#include "calendar_service.h"

#include <algorithm>
#include <array>
#include <atomic>
#include <ctime>
#include <mutex>

#include "cJSON.h"
#include "chroninkle_task_config.h"
#include "esp_crt_bundle.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "nvs.h"

namespace calendar_service {
namespace {

constexpr const char* kTag = "CalendarService";
constexpr const char* kNvsNamespace = "calendar";
constexpr const char* kNvsUrlsKey = "urls";
constexpr const char* kPortalSettingsUri = "/api/settings/calendar";
constexpr const char* kPortalRefreshUri = "/api/calendar/refresh";
constexpr size_t kMaxUrlLength = 600;
constexpr size_t kMaxOccurrences = 200;
constexpr uint64_t kRefreshPeriodUs = 30ULL * 60 * 1000 * 1000;  // every 30 minutes online
constexpr uint64_t kConnectDelayUs = 15ULL * 1000 * 1000;        // let NTP set the clock first
constexpr int kHttpTimeoutMs = 20000;
constexpr int kTaskStackBytes = 8192;
constexpr time_t kMinValidEpoch = 1735689600;  // 2025-01-01: clock not set before this

std::mutex s_mutex;
bool s_initialized = false;
std::vector<std::string> s_urls;
Snapshot s_snapshot = {};
EventHandler s_handler = nullptr;
void* s_handler_context = nullptr;
std::atomic<bool> s_network_connected{false};
TaskHandle_t s_task = nullptr;
esp_timer_handle_t s_periodic_timer = nullptr;
esp_timer_handle_t s_connect_timer = nullptr;

std::string TrimCopy(const std::string& value)
{
    const size_t first = value.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) {
        return {};
    }
    const size_t last = value.find_last_not_of(" \t\r\n");
    return value.substr(first, last - first + 1);
}

void LoadUrlsLocked()
{
    s_urls.clear();
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) != ESP_OK) {
        return;
    }
    size_t size = 0;
    if (nvs_get_str(handle, kNvsUrlsKey, nullptr, &size) == ESP_OK && size > 1) {
        std::string joined(size, '\0');
        if (nvs_get_str(handle, kNvsUrlsKey, joined.data(), &size) == ESP_OK) {
            joined.resize(size > 0 ? size - 1 : 0);
            size_t start = 0;
            while (start < joined.size() && static_cast<int>(s_urls.size()) < kMaxCalendars) {
                const size_t end = joined.find('\n', start);
                const std::string url = TrimCopy(joined.substr(
                    start, end == std::string::npos ? std::string::npos : end - start));
                if (!url.empty()) {
                    s_urls.push_back(url);
                }
                if (end == std::string::npos) {
                    break;
                }
                start = end + 1;
            }
        }
    }
    nvs_close(handle);
}

esp_err_t SaveUrls(const std::vector<std::string>& urls)
{
    std::string joined;
    for (const std::string& url : urls) {
        if (!joined.empty()) {
            joined.push_back('\n');
        }
        joined += url;
    }
    nvs_handle_t handle = 0;
    esp_err_t err = nvs_open(kNvsNamespace, NVS_READWRITE, &handle);
    if (err != ESP_OK) {
        return err;
    }
    err = joined.empty() ? nvs_erase_key(handle, kNvsUrlsKey) : nvs_set_str(handle, kNvsUrlsKey,
                                                                            joined.c_str());
    if (err == ESP_ERR_NVS_NOT_FOUND) {
        err = ESP_OK;
    }
    if (err == ESP_OK) {
        err = nvs_commit(handle);
    }
    nvs_close(handle);
    return err;
}

void Notify()
{
    EventHandler handler = nullptr;
    void* context = nullptr;
    Event event = {};
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        handler = s_handler;
        context = s_handler_context;
        event.snapshot = s_snapshot;
    }
    if (handler != nullptr) {
        handler(event, context);
    }
}

int64_t LocalMidnightToday()
{
    const time_t now = time(nullptr);
    std::tm local = {};
    localtime_r(&now, &local);
    local.tm_hour = 0;
    local.tm_min = 0;
    local.tm_sec = 0;
    local.tm_isdst = -1;
    return static_cast<int64_t>(mktime(&local));
}

struct FetchResult {
    bool ok = false;
    int http_status = 0;
    std::string error;
    std::string name;
    std::vector<ics::Occurrence> events;
};

FetchResult FetchCalendar(const std::string& url, int64_t from, int64_t to, bool browser_like)
{
    FetchResult result;
    // webcal:// is how calendar apps link .ics feeds; it is plain HTTPS underneath.
    std::string target = url;
    if (target.rfind("webcal://", 0) == 0) {
        target = "https://" + target.substr(9);
    }

    esp_http_client_config_t config = {};
    config.url = target.c_str();
    config.method = HTTP_METHOD_GET;
    config.crt_bundle_attach = esp_crt_bundle_attach;
    config.timeout_ms = kHttpTimeoutMs;
    config.buffer_size = 2048;
    config.max_redirection_count = 3;
    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == nullptr) {
        result.error = "HTTP client init failed";
        return result;
    }
    if (browser_like) {
        // Second try after a 404: some Google front ends answer differently to unknown
        // clients, so present the request the way a desktop browser does.
        esp_http_client_set_header(client, "User-Agent",
                                   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                                   "(KHTML, like Gecko) Chrome/124.0 Safari/537.36");
        esp_http_client_set_header(client, "Accept", "*/*");
    } else {
        esp_http_client_set_header(client, "Accept", "text/calendar, */*");
    }

    int status = 0;
    esp_err_t err = ESP_OK;
    for (int attempt = 0; attempt < 4; ++attempt) {
        err = esp_http_client_open(client, 0);
        if (err != ESP_OK) {
            break;
        }
        (void)esp_http_client_fetch_headers(client);
        status = esp_http_client_get_status_code(client);
        if (status >= 300 && status < 400 && attempt < 3) {
            esp_http_client_set_redirection(client);
            esp_http_client_close(client);
            continue;
        }
        break;
    }
    if (err != ESP_OK) {
        result.error = std::string("Connection failed (") + esp_err_to_name(err) + ")";
        esp_http_client_cleanup(client);
        return result;
    }
    if (status != 200) {
        result.http_status = status;
        const bool is_public = target.find("/public/") != std::string::npos;
        const bool is_private = target.find("/private-") != std::string::npos;
        if (status == 404 && is_public) {
            result.error = "Public address of a private calendar: use the secret address (HTTP 404)";
        } else if (status == 404 && is_private) {
            result.error = "Secret address not found: it may have been reset (HTTP 404)";
        } else if (status == 404 || status == 403 || status == 401) {
            result.error = "Link not valid (HTTP " + std::to_string(status) + ")";
        } else {
            result.error = "HTTP " + std::to_string(status);
        }
        esp_http_client_close(client);
        esp_http_client_cleanup(client);
        return result;
    }

    ics::Parser parser(from, to, kMaxOccurrences);
    std::array<char, 1024> buffer = {};
    bool read_failed = false;
    while (true) {
        const int read = esp_http_client_read(client, buffer.data(), buffer.size());
        if (read < 0) {
            read_failed = true;
            break;
        }
        if (read == 0) {
            break;
        }
        parser.Feed(buffer.data(), static_cast<size_t>(read));
    }
    parser.Finish();
    esp_http_client_close(client);
    esp_http_client_cleanup(client);

    if (read_failed) {
        result.error = "Download interrupted";
        return result;
    }
    if (!parser.saw_calendar()) {
        result.error = "Not a calendar (use the secret iCal address)";
        return result;
    }
    result.ok = true;
    result.name = parser.calendar_name();
    result.events = parser.TakeResults();
    ESP_LOGI(kTag, "Calendar '%s': %u events in the file, %u in the next %d days",
             result.name.c_str(), static_cast<unsigned>(parser.event_count()),
             static_cast<unsigned>(result.events.size()), kAgendaDays);
    return result;
}

void RunRefresh()
{
    std::vector<std::string> urls;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        urls = s_urls;
        if (urls.empty()) {
            s_snapshot.events.clear();
            s_snapshot.calendar_names.clear();
            s_snapshot.has_data = false;
            s_snapshot.last_error.clear();
            s_snapshot.fetching = false;
        } else {
            s_snapshot.fetching = true;
        }
    }
    Notify();
    if (urls.empty()) {
        return;
    }

    const int64_t from = LocalMidnightToday();
    const int64_t to = from + static_cast<int64_t>(kAgendaDays) * 86400 + 3600;  // DST slack
    std::vector<ics::Occurrence> merged;
    std::vector<std::string> names;
    std::string error;
    int ok_count = 0;
    for (size_t i = 0; i < urls.size(); ++i) {
        FetchResult result = FetchCalendar(urls[i], from, to, false);
        if (!result.ok && result.http_status == 404) {
            ESP_LOGW(kTag, "Calendar %u: HTTP 404, retrying as a browser",
                     static_cast<unsigned>(i + 1));
            result = FetchCalendar(urls[i], from, to, true);
        }
        names.push_back(result.name);
        if (!result.ok) {
            ESP_LOGW(kTag, "Calendar %u download failed: %s", static_cast<unsigned>(i + 1),
                     result.error.c_str());
            if (error.empty()) {
                error = urls.size() > 1 ? "Calendar " + std::to_string(i + 1) + ": " + result.error
                                        : result.error;
            }
            continue;
        }
        ++ok_count;
        merged.insert(merged.end(), std::make_move_iterator(result.events.begin()),
                      std::make_move_iterator(result.events.end()));
    }
    std::sort(merged.begin(), merged.end(), [](const ics::Occurrence& a, const ics::Occurrence& b) {
        if (a.start != b.start) {
            return a.start < b.start;
        }
        if (a.all_day != b.all_day) {
            return a.all_day;
        }
        return a.title < b.title;
    });

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.fetching = false;
        s_snapshot.calendar_names = names;
        s_snapshot.last_error = error;
        if (ok_count > 0) {
            // Keep what downloaded; a calendar that failed this time is simply missing.
            s_snapshot.events = std::move(merged);
            s_snapshot.has_data = true;
            if (error.empty()) {
                s_snapshot.last_success_epoch = static_cast<int64_t>(time(nullptr));
            }
        }
    }
    Notify();
}

void CalendarTask(void*)
{
    while (true) {
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
        if (!s_network_connected.load(std::memory_order_relaxed)) {
            continue;
        }
        if (time(nullptr) < kMinValidEpoch) {
            // Without the right date there is no "today" (and TLS can't check certificates):
            // the next time sync / connection asks again.
            ESP_LOGI(kTag, "Clock not set yet: calendar download postponed");
            continue;
        }
        RunRefresh();
    }
}

void Kick()
{
    if (s_task != nullptr) {
        xTaskNotifyGive(s_task);
    }
}

void TimerKick(void*)
{
    Kick();
}

esp_timer_handle_t MakeTimer(const char* name)
{
    esp_timer_handle_t timer = nullptr;
    const esp_timer_create_args_t args = {
        .callback = TimerKick,
        .arg = nullptr,
        .dispatch_method = ESP_TIMER_TASK,
        .name = name,
        .skip_unhandled_events = true,
    };
    return esp_timer_create(&args, &timer) == ESP_OK ? timer : nullptr;
}

// --- Setup portal ---------------------------------------------------------------------------

std::string MaskUrl(const std::string& url)
{
    // Show where it points and the last characters, never the secret part in full.
    const size_t scheme = url.find("://");
    const size_t host_start = scheme == std::string::npos ? 0 : scheme + 3;
    const size_t host_end = url.find('/', host_start);
    const std::string host = url.substr(host_start, host_end == std::string::npos
                                                         ? std::string::npos
                                                         : host_end - host_start);
    const std::string tail = url.size() > 10 ? url.substr(url.size() - 10) : std::string();
    std::string kind;
    if (url.find("/private-") != std::string::npos) {
        kind = " [secret]";
    } else if (url.find("/public/") != std::string::npos) {
        kind = " [public]";
    }
    return host + "/..." + tail + kind + " (" + std::to_string(url.size()) + ")";
}

void AppendStatus(cJSON* root)
{
    Snapshot snapshot;
    std::vector<std::string> urls;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        snapshot = s_snapshot;
        urls = s_urls;
    }
    cJSON_AddBoolToObject(root, "success", true);
    cJSON* settings = cJSON_AddObjectToObject(root, "settings");
    cJSON_AddNumberToObject(settings, "max", kMaxCalendars);
    cJSON* list = cJSON_AddArrayToObject(settings, "calendars");
    for (size_t i = 0; i < urls.size(); ++i) {
        cJSON* item = cJSON_CreateObject();
        cJSON_AddStringToObject(item, "masked_url", MaskUrl(urls[i]).c_str());
        cJSON_AddStringToObject(item, "name",
                                i < snapshot.calendar_names.size()
                                    ? snapshot.calendar_names[i].c_str()
                                    : "");
        cJSON_AddItemToArray(list, item);
    }
    cJSON* runtime = cJSON_AddObjectToObject(root, "runtime");
    cJSON_AddBoolToObject(runtime, "fetching", snapshot.fetching);
    cJSON_AddBoolToObject(runtime, "has_data", snapshot.has_data);
    cJSON_AddNumberToObject(runtime, "last_success_epoch",
                            static_cast<double>(snapshot.last_success_epoch));
    cJSON_AddNumberToObject(runtime, "event_count", static_cast<double>(snapshot.events.size()));
    cJSON_AddStringToObject(runtime, "last_error", snapshot.last_error.c_str());
    cJSON_AddBoolToObject(runtime, "network_connected",
                          s_network_connected.load(std::memory_order_relaxed));
}

esp_err_t SendJson(httpd_req_t* request, cJSON* root, const char* status = "200 OK")
{
    char* raw = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    httpd_resp_set_status(request, status);
    httpd_resp_set_type(request, "application/json; charset=utf-8");
    httpd_resp_set_hdr(request, "Cache-Control", "no-store");
    const esp_err_t err = httpd_resp_sendstr(request, raw != nullptr ? raw : "{}");
    if (raw != nullptr) {
        cJSON_free(raw);
    }
    return err;
}

esp_err_t SendError(httpd_req_t* request, const char* message)
{
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", false);
    cJSON_AddStringToObject(root, "message", message);
    return SendJson(request, root, "400 Bad Request");
}

esp_err_t HandleSettingsGet(httpd_req_t* request)
{
    cJSON* root = cJSON_CreateObject();
    AppendStatus(root);
    cJSON_AddStringToObject(root, "message", "Calendar settings loaded");
    return SendJson(request, root);
}

esp_err_t HandleSettingsPatch(httpd_req_t* request)
{
    if (request->content_len <= 0 || request->content_len > 4096) {
        return SendError(request, "Invalid calendar settings payload");
    }
    std::string body(static_cast<size_t>(request->content_len), '\0');
    size_t received_total = 0;
    while (received_total < body.size()) {
        const int received =
            httpd_req_recv(request, body.data() + received_total, body.size() - received_total);
        if (received <= 0) {
            return SendError(request, "Invalid calendar settings payload");
        }
        received_total += static_cast<size_t>(received);
    }
    cJSON* json = cJSON_ParseWithLength(body.c_str(), body.size());
    if (json == nullptr) {
        return SendError(request, "Invalid JSON body");
    }

    std::vector<std::string> current = GetUrls();
    std::vector<std::string> updated = current;
    const char* error = nullptr;
    const cJSON* add = cJSON_GetObjectItemCaseSensitive(json, "add_url");
    const cJSON* remove = cJSON_GetObjectItemCaseSensitive(json, "remove_index");
    if (cJSON_IsString(add)) {
        const std::string url = TrimCopy(add->valuestring);
        const bool web = url.rfind("https://", 0) == 0 || url.rfind("http://", 0) == 0 ||
                         url.rfind("webcal://", 0) == 0;
        if (!web || url.size() > kMaxUrlLength) {
            error = "Calendar link not valid";
        } else if (static_cast<int>(updated.size()) >= kMaxCalendars) {
            error = "Calendar list full";
        } else if (std::find(updated.begin(), updated.end(), url) != updated.end()) {
            error = "Calendar already added";
        } else {
            updated.push_back(url);
        }
    } else if (cJSON_IsNumber(remove)) {
        const int index = remove->valueint;
        if (index < 0 || index >= static_cast<int>(updated.size())) {
            error = "Calendar not found";
        } else {
            updated.erase(updated.begin() + index);
        }
    } else {
        error = "Invalid calendar settings payload";
    }
    cJSON_Delete(json);
    if (error != nullptr) {
        return SendError(request, error);
    }
    if (SetUrls(updated) != ESP_OK) {
        return SendError(request, "Failed to save calendar settings");
    }
    cJSON* root = cJSON_CreateObject();
    AppendStatus(root);
    cJSON_AddStringToObject(root, "message", cJSON_IsString(add) ? "Calendar added"
                                                                 : "Calendar removed");
    return SendJson(request, root);
}

esp_err_t HandleRefresh(httpd_req_t* request)
{
    const bool started = RequestRefresh();
    cJSON* root = cJSON_CreateObject();
    AppendStatus(root);
    cJSON_AddStringToObject(root, "message",
                            started ? "Calendar refresh started" : "Calendar needs Wi-Fi");
    return SendJson(request, root);
}

}  // namespace

esp_err_t Init()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_initialized) {
        return ESP_OK;
    }
    LoadUrlsLocked();
    s_snapshot.calendar_count = static_cast<int>(s_urls.size());
    if (xTaskCreatePinnedToCore(CalendarTask, "calendar", kTaskStackBytes, nullptr,
                                chroninkle_task_config::kPriorityCalendar, &s_task,
                                chroninkle_task_config::kSystemCore) != pdPASS) {
        s_task = nullptr;
        ESP_LOGE(kTag, "Calendar task create failed");
        return ESP_ERR_NO_MEM;
    }
    s_periodic_timer = MakeTimer("calendar_refresh");
    s_connect_timer = MakeTimer("calendar_connect");
    if (s_periodic_timer != nullptr) {
        (void)esp_timer_start_periodic(s_periodic_timer, kRefreshPeriodUs);
    }
    s_initialized = true;
    ESP_LOGI(kTag, "Calendar service ready: %u calendar(s)", static_cast<unsigned>(s_urls.size()));
    return ESP_OK;
}

void SetEventHandler(EventHandler handler, void* context)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_handler = handler;
    s_handler_context = context;
}

Snapshot GetSnapshot()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_snapshot;
}

void SetNetworkConnected(bool connected)
{
    const bool was_connected = s_network_connected.exchange(connected, std::memory_order_relaxed);
    if (connected && !was_connected && s_connect_timer != nullptr) {
        (void)esp_timer_stop(s_connect_timer);
        (void)esp_timer_start_once(s_connect_timer, kConnectDelayUs);
    }
}

bool RequestRefresh()
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (s_urls.empty()) {
            return false;
        }
    }
    if (!s_network_connected.load(std::memory_order_relaxed)) {
        return false;
    }
    Kick();
    return true;
}

std::vector<std::string> GetUrls()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_urls;
}

esp_err_t SetUrls(const std::vector<std::string>& urls)
{
    std::vector<std::string> cleaned;
    for (const std::string& url : urls) {
        const std::string trimmed = TrimCopy(url);
        if (!trimmed.empty() && static_cast<int>(cleaned.size()) < kMaxCalendars) {
            cleaned.push_back(trimmed);
        }
    }
    const esp_err_t err = SaveUrls(cleaned);
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Saving calendar links failed: %s", esp_err_to_name(err));
        return err;
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_urls = cleaned;
        s_snapshot.calendar_count = static_cast<int>(cleaned.size());
        s_snapshot.calendar_names.clear();
    }
    Kick();  // download now (or clear the agenda when the last link was removed)
    Notify();
    return ESP_OK;
}

void RegisterPortalRoutes(httpd_handle_t server)
{
    if (server == nullptr) {
        return;
    }
    const httpd_uri_t routes[] = {
        {.uri = kPortalSettingsUri, .method = HTTP_GET, .handler = HandleSettingsGet,
         .user_ctx = nullptr},
        {.uri = kPortalSettingsUri, .method = HTTP_PATCH, .handler = HandleSettingsPatch,
         .user_ctx = nullptr},
        {.uri = kPortalRefreshUri, .method = HTTP_POST, .handler = HandleRefresh,
         .user_ctx = nullptr},
    };
    for (const httpd_uri_t& route : routes) {
        const esp_err_t err = httpd_register_uri_handler(server, &route);
        if (err != ESP_OK) {
            ESP_LOGW(kTag, "Register %s failed: %s", route.uri, esp_err_to_name(err));
        }
    }
}

}  // namespace calendar_service
