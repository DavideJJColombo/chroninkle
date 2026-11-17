#include "calendar_service.h"

#include <algorithm>
#include <array>
#include <atomic>
#include <cstring>
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

// What the task should do on its next wake-up.
std::atomic<bool> s_want_refresh{false};
std::atomic<bool> s_want_send{false};
std::atomic<bool> s_want_notify{false};
std::atomic<bool> s_want_test{false};

// Adding events through the Apps Script bridge.
constexpr const char* kNvsBridgeUrlKey = "bridge_url";
constexpr const char* kNvsBridgeSecretKey = "bridge_sec";
constexpr const char* kNvsWriteStateKey = "write";
constexpr const char* kPortalBridgeUri = "/api/settings/calendar-bridge";
constexpr const char* kPortalBridgeTestUri = "/api/calendar-bridge/test";
constexpr size_t kMaxProposals = 8;
constexpr size_t kMaxOutbox = 16;
constexpr size_t kMaxLocal = 24;
constexpr uint64_t kSendRetryUs = 10ULL * 60 * 1000 * 1000;
std::string s_bridge_url;
std::string s_bridge_secret;
std::vector<Proposal> s_proposals;   // waiting for yes/no
std::vector<Proposal> s_outbox;      // accepted, not yet sent
std::vector<Proposal> s_local;       // accepted: shown in the agenda until a download has them
uint32_t s_next_proposal_id = 1;
std::vector<ics::Occurrence> s_fetched;  // last successful download
bool s_fetched_ok = false;
esp_timer_handle_t s_send_retry_timer = nullptr;
// Result of the portal's "Test" button.
std::string s_test_state = "idle";  // idle | running | ok | error
std::string s_test_message;

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

// --- Adding events: persistence ------------------------------------------------------------

std::string ReadNvsStr(nvs_handle_t handle, const char* key)
{
    size_t size = 0;
    if (nvs_get_str(handle, key, nullptr, &size) != ESP_OK || size <= 1) {
        return {};
    }
    std::string value(size, '\0');
    if (nvs_get_str(handle, key, value.data(), &size) != ESP_OK) {
        return {};
    }
    value.resize(size - 1);
    return value;
}

cJSON* ProposalToJson(const Proposal& proposal)
{
    cJSON* item = cJSON_CreateObject();
    cJSON_AddNumberToObject(item, "id", proposal.id);
    cJSON_AddStringToObject(item, "title", proposal.title.c_str());
    cJSON_AddBoolToObject(item, "all_day", proposal.all_day);
    cJSON_AddStringToObject(item, "date", proposal.date.c_str());
    cJSON_AddNumberToObject(item, "start", static_cast<double>(proposal.start));
    cJSON_AddNumberToObject(item, "end", static_cast<double>(proposal.end));
    return item;
}

void ProposalsFromJson(const cJSON* array, std::vector<Proposal>* out)
{
    out->clear();
    const cJSON* item = nullptr;
    cJSON_ArrayForEach(item, array)
    {
        Proposal proposal;
        const cJSON* id = cJSON_GetObjectItemCaseSensitive(item, "id");
        const cJSON* title = cJSON_GetObjectItemCaseSensitive(item, "title");
        const cJSON* date = cJSON_GetObjectItemCaseSensitive(item, "date");
        const cJSON* start = cJSON_GetObjectItemCaseSensitive(item, "start");
        const cJSON* end = cJSON_GetObjectItemCaseSensitive(item, "end");
        if (!cJSON_IsNumber(id) || !cJSON_IsString(title) || !cJSON_IsNumber(start) ||
            !cJSON_IsNumber(end)) {
            continue;
        }
        proposal.id = static_cast<uint32_t>(id->valuedouble);
        proposal.title = title->valuestring;
        proposal.all_day = cJSON_IsTrue(cJSON_GetObjectItemCaseSensitive(item, "all_day"));
        proposal.date = cJSON_IsString(date) ? date->valuestring : "";
        proposal.start = static_cast<int64_t>(start->valuedouble);
        proposal.end = static_cast<int64_t>(end->valuedouble);
        out->push_back(std::move(proposal));
    }
}

void SaveWriteStateLocked()
{
    cJSON* root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "next", s_next_proposal_id);
    for (const auto& [key, list] : {std::pair<const char*, const std::vector<Proposal>*>{
                                        "proposals", &s_proposals},
                                    {"outbox", &s_outbox},
                                    {"local", &s_local}}) {
        cJSON* array = cJSON_AddArrayToObject(root, key);
        for (const Proposal& proposal : *list) {
            cJSON_AddItemToArray(array, ProposalToJson(proposal));
        }
    }
    char* raw = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    if (raw == nullptr) {
        return;
    }
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) == ESP_OK) {
        if (nvs_set_blob(handle, kNvsWriteStateKey, raw, std::strlen(raw)) == ESP_OK) {
            (void)nvs_commit(handle);
        }
        nvs_close(handle);
    }
    cJSON_free(raw);
}

void LoadWriteStateLocked()
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) != ESP_OK) {
        return;
    }
    s_bridge_url = ReadNvsStr(handle, kNvsBridgeUrlKey);
    s_bridge_secret = ReadNvsStr(handle, kNvsBridgeSecretKey);
    size_t size = 0;
    if (nvs_get_blob(handle, kNvsWriteStateKey, nullptr, &size) == ESP_OK && size > 0) {
        std::string json(size, '\0');
        if (nvs_get_blob(handle, kNvsWriteStateKey, json.data(), &size) == ESP_OK) {
            cJSON* root = cJSON_ParseWithLength(json.c_str(), json.size());
            if (root != nullptr) {
                const cJSON* next = cJSON_GetObjectItemCaseSensitive(root, "next");
                if (cJSON_IsNumber(next)) {
                    s_next_proposal_id = static_cast<uint32_t>(next->valuedouble);
                }
                ProposalsFromJson(cJSON_GetObjectItemCaseSensitive(root, "proposals"),
                                  &s_proposals);
                ProposalsFromJson(cJSON_GetObjectItemCaseSensitive(root, "outbox"), &s_outbox);
                ProposalsFromJson(cJSON_GetObjectItemCaseSensitive(root, "local"), &s_local);
                cJSON_Delete(root);
            }
        }
    }
    nvs_close(handle);
}

bool BridgeConfiguredLocked()
{
    return !s_bridge_url.empty() && !s_bridge_secret.empty();
}

// Snapshot.events = the download + events added here that the download doesn't have yet (the
// secret iCal address lags behind, sometimes by hours). An added event leaves the local list
// once a download shows it, or a day after it ended.
void RebuildEventsLocked()
{
    const int64_t now = static_cast<int64_t>(time(nullptr));
    bool changed = false;
    std::vector<ics::Occurrence> events = s_fetched;
    for (auto it = s_local.begin(); it != s_local.end();) {
        bool seen = false;
        for (const ics::Occurrence& fetched : s_fetched) {
            seen = seen || (fetched.title == it->title && fetched.start == it->start);
        }
        if ((seen && s_fetched_ok) || (now > kMinValidEpoch && it->end < now - 86400)) {
            it = s_local.erase(it);
            changed = true;
            continue;
        }
        ics::Occurrence occurrence;
        occurrence.start = it->start;
        occurrence.end = it->end;
        occurrence.all_day = it->all_day;
        occurrence.title = it->title;
        events.push_back(std::move(occurrence));
        ++it;
    }
    std::sort(events.begin(), events.end(), [](const ics::Occurrence& a, const ics::Occurrence& b) {
        if (a.start != b.start) {
            return a.start < b.start;
        }
        if (a.all_day != b.all_day) {
            return a.all_day;
        }
        return a.title < b.title;
    });
    s_snapshot.events = std::move(events);
    s_snapshot.has_data = s_fetched_ok || !s_local.empty();
    s_snapshot.bridge_configured = BridgeConfiguredLocked();
    s_snapshot.pending_proposals = static_cast<int>(s_proposals.size());
    s_snapshot.outbox_count = static_cast<int>(s_outbox.size());
    if (changed) {
        SaveWriteStateLocked();
    }
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
            s_fetched.clear();
            s_fetched_ok = false;
            s_snapshot.calendar_names.clear();
            s_snapshot.last_error.clear();
            s_snapshot.fetching = false;
            RebuildEventsLocked();
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
            s_fetched = std::move(merged);
            s_fetched_ok = true;
            if (error.empty()) {
                s_snapshot.last_success_epoch = static_cast<int64_t>(time(nullptr));
            }
        }
        RebuildEventsLocked();
    }
    Notify();
}

// --- Adding events: the bridge --------------------------------------------------------------

struct BridgeReply {
    bool ok = false;
    bool temporary = false;  // worth retrying later (no answer, Google busy)
    std::string error;       // English, short
    std::string calendar;
};

// POSTs `body` to the Apps Script web app. Apps Script answers a POST with a 302 to
// script.googleusercontent.com, where the result is fetched with a GET.
BridgeReply BridgePost(const std::string& url, const std::string& body)
{
    BridgeReply reply;
    esp_http_client_config_t config = {};
    config.url = url.c_str();
    config.method = HTTP_METHOD_POST;
    config.crt_bundle_attach = esp_crt_bundle_attach;
    config.timeout_ms = kHttpTimeoutMs;
    config.buffer_size = 2048;
    config.buffer_size_tx = 1024;
    esp_http_client_handle_t client = esp_http_client_init(&config);
    if (client == nullptr) {
        reply.error = "HTTP client init failed";
        reply.temporary = true;
        return reply;
    }
    esp_http_client_set_header(client, "Content-Type", "application/json");

    std::string answer;
    int status = 0;
    esp_err_t err = esp_http_client_open(client, static_cast<int>(body.size()));
    if (err == ESP_OK) {
        const int written = esp_http_client_write(client, body.data(), static_cast<int>(body.size()));
        if (written != static_cast<int>(body.size())) {
            err = ESP_FAIL;
        }
    }
    for (int hop = 0; err == ESP_OK && hop < 4; ++hop) {
        (void)esp_http_client_fetch_headers(client);
        status = esp_http_client_get_status_code(client);
        if (status < 300 || status >= 400) {
            break;
        }
        // Follow the redirect with a GET (that's where Apps Script serves the result).
        esp_http_client_set_redirection(client);
        esp_http_client_close(client);
        esp_http_client_set_method(client, HTTP_METHOD_GET);
        esp_http_client_delete_header(client, "Content-Type");
        err = esp_http_client_open(client, 0);
    }
    if (err == ESP_OK) {
        std::array<char, 512> buffer = {};
        while (answer.size() < 4096) {
            const int read = esp_http_client_read(client, buffer.data(), buffer.size());
            if (read <= 0) {
                break;
            }
            answer.append(buffer.data(), static_cast<size_t>(read));
        }
    }
    esp_http_client_close(client);
    esp_http_client_cleanup(client);

    if (err != ESP_OK) {
        reply.error = std::string("Connection failed (") + esp_err_to_name(err) + ")";
        reply.temporary = true;
        return reply;
    }
    cJSON* root = cJSON_ParseWithLength(answer.c_str(), answer.size());
    if (root == nullptr) {
        // An HTML page instead of JSON: wrong address, or the web app isn't open to "Anyone".
        reply.error = status == 200 ? "Not the Taccuino bridge (check the address and access)"
                                    : "HTTP " + std::to_string(status);
        reply.temporary = status == 0 || status == 429 || status >= 500;
        return reply;
    }
    reply.ok = cJSON_IsTrue(cJSON_GetObjectItemCaseSensitive(root, "ok"));
    const cJSON* error = cJSON_GetObjectItemCaseSensitive(root, "error");
    const cJSON* calendar = cJSON_GetObjectItemCaseSensitive(root, "calendar");
    if (cJSON_IsString(calendar)) {
        reply.calendar = calendar->valuestring;
    }
    if (!reply.ok) {
        const std::string code = cJSON_IsString(error) ? error->valuestring : "error";
        reply.error = code == "wrong_secret" ? "Wrong secret word" : "Bridge error: " + code;
        reply.temporary = false;
    }
    cJSON_Delete(root);
    return reply;
}

std::string BridgeBody(const std::string& secret, const char* action, const Proposal* proposal)
{
    cJSON* root = cJSON_CreateObject();
    cJSON_AddStringToObject(root, "secret", secret.c_str());
    cJSON_AddStringToObject(root, "action", action);
    if (proposal != nullptr) {
        cJSON_AddStringToObject(root, "title", proposal->title.c_str());
        cJSON_AddBoolToObject(root, "all_day", proposal->all_day);
        cJSON_AddStringToObject(root, "date", proposal->date.c_str());
        cJSON_AddNumberToObject(root, "start", static_cast<double>(proposal->start));
        cJSON_AddNumberToObject(root, "end", static_cast<double>(proposal->end));
    }
    char* raw = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    std::string body = raw != nullptr ? raw : "{}";
    if (raw != nullptr) {
        cJSON_free(raw);
    }
    return body;
}

void RunSend()
{
    std::string url;
    std::string secret;
    std::vector<Proposal> outbox;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (!BridgeConfiguredLocked() || s_outbox.empty()) {
            return;
        }
        url = s_bridge_url;
        secret = s_bridge_secret;
        outbox = s_outbox;
    }
    bool retry_later = false;
    for (const Proposal& proposal : outbox) {
        const BridgeReply reply = BridgePost(url, BridgeBody(secret, "create", &proposal));
        std::lock_guard<std::mutex> lock(s_mutex);
        if (reply.ok) {
            ESP_LOGI(kTag, "Added to the Taccuino calendar: %s", proposal.title.c_str());
            s_outbox.erase(std::remove_if(s_outbox.begin(), s_outbox.end(),
                                          [&](const Proposal& p) { return p.id == proposal.id; }),
                           s_outbox.end());
            s_snapshot.last_write_error.clear();
            RebuildEventsLocked();
            SaveWriteStateLocked();
            continue;
        }
        ESP_LOGW(kTag, "Adding '%s' failed: %s", proposal.title.c_str(), reply.error.c_str());
        s_snapshot.last_write_error = reply.error;
        retry_later = reply.temporary;
        break;  // same problem for the rest: try them all again later
    }
    if (retry_later && s_send_retry_timer != nullptr) {
        (void)esp_timer_stop(s_send_retry_timer);
        (void)esp_timer_start_once(s_send_retry_timer, kSendRetryUs);
    }
    Notify();
}

void RunTest()
{
    std::string url;
    std::string secret;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        url = s_bridge_url;
        secret = s_bridge_secret;
    }
    const BridgeReply reply = BridgePost(url, BridgeBody(secret, "ping", nullptr));
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_test_state = reply.ok ? "ok" : "error";
        s_test_message = reply.ok ? reply.calendar : reply.error;
        if (reply.ok) {
            s_snapshot.last_write_error.clear();
        }
    }
    ESP_LOGI(kTag, "Bridge test: %s %s", reply.ok ? "ok" : "failed",
             reply.ok ? reply.calendar.c_str() : reply.error.c_str());
    if (reply.ok) {
        s_want_send.store(true, std::memory_order_relaxed);  // queued events can go now
    }
    Notify();
}

void CalendarTask(void*)
{
    while (true) {
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
        if (s_want_notify.exchange(false, std::memory_order_relaxed)) {
            Notify();
        }
        const bool online = s_network_connected.load(std::memory_order_relaxed) &&
                            time(nullptr) >= kMinValidEpoch;
        if (s_want_test.exchange(false, std::memory_order_relaxed)) {
            if (online) {
                RunTest();
            } else {
                std::lock_guard<std::mutex> lock(s_mutex);
                s_test_state = "error";
                s_test_message = "Device not connected to Wi-Fi";
            }
        }
        if (!online) {
            // Without Wi-Fi, or the right date (no "today", and TLS can't check certificates),
            // nothing to do: the next connection / time sync asks again.
            continue;
        }
        if (s_want_send.exchange(false, std::memory_order_relaxed)) {
            RunSend();
        }
        if (s_want_refresh.exchange(false, std::memory_order_relaxed)) {
            RunRefresh();
        }
    }
}

void Wake()
{
    if (s_task != nullptr) {
        xTaskNotifyGive(s_task);
    }
}

void Kick()
{
    s_want_refresh.store(true, std::memory_order_relaxed);
    Wake();
}

void TimerKick(void*)
{
    s_want_send.store(true, std::memory_order_relaxed);  // retry anything still queued
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

std::string MaskBridgeUrl(const std::string& url)
{
    // ".../macros/s/AKfy...xyz/exec" -> "script.google.com/...xyz/exec"
    const size_t scheme = url.find("://");
    const size_t host_start = scheme == std::string::npos ? 0 : scheme + 3;
    const size_t host_end = url.find('/', host_start);
    const std::string host = url.substr(host_start, host_end == std::string::npos
                                                         ? std::string::npos
                                                         : host_end - host_start);
    const std::string tail = url.size() > 9 ? url.substr(url.size() - 9) : url;
    return host + "/..." + tail;
}

void AppendBridgeStatus(cJSON* root)
{
    cJSON_AddBoolToObject(root, "success", true);
    std::lock_guard<std::mutex> lock(s_mutex);
    cJSON* settings = cJSON_AddObjectToObject(root, "settings");
    cJSON_AddBoolToObject(settings, "configured", BridgeConfiguredLocked());
    cJSON_AddStringToObject(settings, "masked_url",
                            s_bridge_url.empty() ? "" : MaskBridgeUrl(s_bridge_url).c_str());
    cJSON* runtime = cJSON_AddObjectToObject(root, "runtime");
    cJSON_AddNumberToObject(runtime, "outbox_count", static_cast<double>(s_outbox.size()));
    cJSON_AddNumberToObject(runtime, "pending_proposals", static_cast<double>(s_proposals.size()));
    cJSON_AddStringToObject(runtime, "last_write_error", s_snapshot.last_write_error.c_str());
    cJSON_AddStringToObject(runtime, "test_state", s_test_state.c_str());
    cJSON_AddStringToObject(runtime, "test_message", s_test_message.c_str());
    cJSON_AddBoolToObject(runtime, "network_connected",
                          s_network_connected.load(std::memory_order_relaxed));
}

esp_err_t HandleBridgeGet(httpd_req_t* request)
{
    cJSON* root = cJSON_CreateObject();
    AppendBridgeStatus(root);
    cJSON_AddStringToObject(root, "message", "Calendar bridge loaded");
    return SendJson(request, root);
}

esp_err_t HandleBridgePatch(httpd_req_t* request)
{
    if (request->content_len <= 0 || request->content_len > 2048) {
        return SendError(request, "Invalid calendar bridge payload");
    }
    std::string body(static_cast<size_t>(request->content_len), '\0');
    size_t received_total = 0;
    while (received_total < body.size()) {
        const int received =
            httpd_req_recv(request, body.data() + received_total, body.size() - received_total);
        if (received <= 0) {
            return SendError(request, "Invalid calendar bridge payload");
        }
        received_total += static_cast<size_t>(received);
    }
    cJSON* json = cJSON_ParseWithLength(body.c_str(), body.size());
    if (json == nullptr) {
        return SendError(request, "Invalid JSON body");
    }
    const cJSON* url_item = cJSON_GetObjectItemCaseSensitive(json, "url");
    const cJSON* secret_item = cJSON_GetObjectItemCaseSensitive(json, "secret");
    const std::string url = cJSON_IsString(url_item) ? TrimCopy(url_item->valuestring) : "";
    const std::string secret =
        cJSON_IsString(secret_item) ? TrimCopy(secret_item->valuestring) : "";
    cJSON_Delete(json);
    const bool clear = url.empty() && secret.empty();
    if (!clear) {
        if (url.rfind("https://script.google.com/", 0) != 0 || url.size() > kMaxUrlLength) {
            return SendError(request, "Bridge address not valid");
        }
        if (secret.size() < 8) {
            return SendError(request, "Secret word too short");
        }
    }
    nvs_handle_t handle = 0;
    esp_err_t err = nvs_open(kNvsNamespace, NVS_READWRITE, &handle);
    if (err == ESP_OK) {
        if (clear) {
            (void)nvs_erase_key(handle, kNvsBridgeUrlKey);
            (void)nvs_erase_key(handle, kNvsBridgeSecretKey);
        } else {
            err = nvs_set_str(handle, kNvsBridgeUrlKey, url.c_str());
            if (err == ESP_OK) {
                err = nvs_set_str(handle, kNvsBridgeSecretKey, secret.c_str());
            }
        }
        if (err == ESP_OK) {
            err = nvs_commit(handle);
        }
        nvs_close(handle);
    }
    if (err != ESP_OK) {
        return SendError(request, "Failed to save calendar bridge");
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_bridge_url = url;
        s_bridge_secret = secret;
        s_test_state = "idle";
        s_test_message.clear();
        s_snapshot.last_write_error.clear();
        if (clear) {
            s_proposals.clear();  // nothing can be added any more
        }
        RebuildEventsLocked();
        SaveWriteStateLocked();
    }
    if (!clear) {
        s_want_test.store(true, std::memory_order_relaxed);  // check it straight away
        Wake();
    }
    cJSON* root = cJSON_CreateObject();
    AppendBridgeStatus(root);
    cJSON_AddStringToObject(root, "message", clear ? "Calendar bridge removed"
                                                   : "Calendar bridge saved");
    return SendJson(request, root);
}

esp_err_t HandleBridgeTest(httpd_req_t* request)
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (!BridgeConfiguredLocked()) {
            return SendError(request, "Calendar bridge not set up");
        }
        s_test_state = "running";
        s_test_message.clear();
    }
    s_want_test.store(true, std::memory_order_relaxed);
    Wake();
    cJSON* root = cJSON_CreateObject();
    AppendBridgeStatus(root);
    cJSON_AddStringToObject(root, "message", "Calendar bridge test started");
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
    LoadWriteStateLocked();
    s_snapshot.calendar_count = static_cast<int>(s_urls.size());
    RebuildEventsLocked();
    if (xTaskCreatePinnedToCore(CalendarTask, "calendar", kTaskStackBytes, nullptr,
                                chroninkle_task_config::kPriorityCalendar, &s_task,
                                chroninkle_task_config::kSystemCore) != pdPASS) {
        s_task = nullptr;
        ESP_LOGE(kTag, "Calendar task create failed");
        return ESP_ERR_NO_MEM;
    }
    s_periodic_timer = MakeTimer("calendar_refresh");
    s_connect_timer = MakeTimer("calendar_connect");
    s_send_retry_timer = MakeTimer("calendar_send_retry");
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

void AddProposals(const std::vector<Proposal>& proposals)
{
    if (proposals.empty()) {
        return;
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (!BridgeConfiguredLocked()) {
            return;  // adding events isn't set up: nothing to ask about
        }
        for (Proposal proposal : proposals) {
            if (s_proposals.size() >= kMaxProposals) {
                s_proposals.erase(s_proposals.begin());  // the oldest question goes
            }
            proposal.id = s_next_proposal_id++;
            ESP_LOGI(kTag, "Calendar proposal %u: %s", static_cast<unsigned>(proposal.id),
                     proposal.title.c_str());
            s_proposals.push_back(std::move(proposal));
        }
        RebuildEventsLocked();
        SaveWriteStateLocked();
    }
    // Called from transcription callbacks: report it from the calendar task instead.
    s_want_notify.store(true, std::memory_order_relaxed);
    Wake();
}

bool PeekProposal(Proposal* proposal)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_proposals.empty() || proposal == nullptr) {
        return false;
    }
    *proposal = s_proposals.front();
    return true;
}

void AcceptProposal(uint32_t id)
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        auto it = std::find_if(s_proposals.begin(), s_proposals.end(),
                               [id](const Proposal& p) { return p.id == id; });
        if (it == s_proposals.end()) {
            return;
        }
        if (s_outbox.size() < kMaxOutbox) {
            s_outbox.push_back(*it);
        }
        if (s_local.size() >= kMaxLocal) {
            s_local.erase(s_local.begin());
        }
        s_local.push_back(*it);  // in the agenda right away
        s_proposals.erase(it);
        RebuildEventsLocked();
        SaveWriteStateLocked();
    }
    s_want_send.store(true, std::memory_order_relaxed);
    s_want_notify.store(true, std::memory_order_relaxed);
    Wake();
}

void DeclineProposal(uint32_t id)
{
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_proposals.erase(std::remove_if(s_proposals.begin(), s_proposals.end(),
                                         [id](const Proposal& p) { return p.id == id; }),
                          s_proposals.end());
        RebuildEventsLocked();
        SaveWriteStateLocked();
    }
    s_want_notify.store(true, std::memory_order_relaxed);
    Wake();
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
        {.uri = kPortalBridgeUri, .method = HTTP_GET, .handler = HandleBridgeGet,
         .user_ctx = nullptr},
        {.uri = kPortalBridgeUri, .method = HTTP_PATCH, .handler = HandleBridgePatch,
         .user_ctx = nullptr},
        {.uri = kPortalBridgeTestUri, .method = HTTP_POST, .handler = HandleBridgeTest,
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
