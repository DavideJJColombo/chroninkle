#include "ota_service.h"

#include <algorithm>
#include <atomic>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <mutex>
#include <string>
#include <vector>

#include "cJSON.h"
#include "esp_app_desc.h"
#include "esp_app_format.h"
#include "esp_log.h"
#include "esp_ota_ops.h"
#include "esp_random.h"
#include "esp_system.h"
#include "esp_timer.h"
#include "sdkconfig.h"

namespace ota_service {
namespace {

constexpr const char* kTag = "OtaService";
constexpr const char* kStatusUri = "/api/ota/status";
constexpr const char* kCodeUri = "/api/ota/code";
constexpr const char* kUploadUri = "/api/ota/upload";
constexpr int64_t kCodeLifetimeUs = 10LL * 60 * 1000 * 1000;  // 10 minutes
constexpr int kMaxWrongCodeAttempts = 5;
constexpr size_t kChunkSize = 4096;
constexpr int kMaxRecvTimeouts = 10;
// Long enough for the e-paper to show the "restarting" toast before the reset.
constexpr uint64_t kRestartDelayUs = 4ULL * 1000 * 1000;
// Image header + first segment header + app description: enough to identify the firmware.
constexpr size_t kIdentifyBytes =
    sizeof(esp_image_header_t) + sizeof(esp_image_segment_header_t) + sizeof(esp_app_desc_t);

std::mutex s_mutex;
EventHandler s_handler = nullptr;
void* s_handler_context = nullptr;
uint32_t s_code = 0;
int64_t s_code_expires_us = 0;
int s_wrong_attempts = 0;
std::atomic<bool> s_update_in_progress{false};
esp_timer_handle_t s_restart_timer = nullptr;

void Notify(EventType type, uint32_t code = 0)
{
    EventHandler handler = nullptr;
    void* context = nullptr;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        handler = s_handler;
        context = s_handler_context;
    }
    if (handler != nullptr) {
        handler(Event{.type = type, .code = code}, context);
    }
}

esp_err_t SendJson(httpd_req_t* request, const char* status, cJSON* root)
{
    char* raw = cJSON_PrintUnformatted(root);
    cJSON_Delete(root);
    const std::string payload = raw != nullptr ? raw : "{}";
    if (raw != nullptr) {
        cJSON_free(raw);
    }
    httpd_resp_set_status(request, status);
    httpd_resp_set_type(request, "application/json; charset=utf-8");
    return httpd_resp_send(request, payload.c_str(), payload.size());
}

esp_err_t SendResult(httpd_req_t* request, const char* status, bool success, const char* message)
{
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", success);
    cJSON_AddStringToObject(root, "message", message);
    return SendJson(request, status, root);
}

esp_err_t HandleStatus(httpd_req_t* request)
{
    const esp_app_desc_t* app = esp_app_get_description();
    const esp_partition_t* next = esp_ota_get_next_update_partition(nullptr);
    cJSON* root = cJSON_CreateObject();
    cJSON_AddBoolToObject(root, "success", true);
    cJSON_AddStringToObject(root, "message", "Firmware status loaded");
    cJSON_AddStringToObject(root, "project", app->project_name);
    cJSON_AddStringToObject(root, "version", app->version);
    cJSON_AddNumberToObject(root, "max_size", next != nullptr ? next->size : 0);
    cJSON_AddBoolToObject(root, "update_in_progress", s_update_in_progress.load());
    return SendJson(request, HTTPD_200, root);
}

esp_err_t HandleCode(httpd_req_t* request)
{
    uint32_t code = 0;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_code = 100000 + (esp_random() % 900000);  // always 6 digits
        s_code_expires_us = esp_timer_get_time() + kCodeLifetimeUs;
        s_wrong_attempts = 0;
        code = s_code;
    }
    ESP_LOGI(kTag, "Update code issued (shown on the device screen)");
    Notify(EventType::kCodeIssued, code);
    return SendResult(request, HTTPD_200, true, "Update code shown on the device");
}

// Checks (and on success consumes) the one-time code from the upload's query string.
bool ConsumeCode(httpd_req_t* request, const char** error)
{
    char query[64] = {};
    char value[16] = {};
    if (httpd_req_get_url_query_str(request, query, sizeof(query)) != ESP_OK ||
        httpd_query_key_value(query, "code", value, sizeof(value)) != ESP_OK) {
        *error = "Update code required";
        return false;
    }
    const uint32_t given = static_cast<uint32_t>(std::strtoul(value, nullptr, 10));

    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_code == 0 || esp_timer_get_time() > s_code_expires_us) {
        s_code = 0;
        *error = "Update code expired, request a new one";
        return false;
    }
    if (given != s_code) {
        if (++s_wrong_attempts >= kMaxWrongCodeAttempts) {
            s_code = 0;
            *error = "Too many wrong codes, request a new one";
        } else {
            *error = "Wrong update code";
        }
        return false;
    }
    s_code = 0;  // single use
    return true;
}

// Rejects anything that isn't a firmware image of this project (wrong file, other device).
bool IdentifyImage(const uint8_t* data, const char** error)
{
    esp_image_header_t image = {};
    std::memcpy(&image, data, sizeof(image));
    esp_app_desc_t desc = {};
    std::memcpy(&desc, data + sizeof(esp_image_header_t) + sizeof(esp_image_segment_header_t),
                sizeof(desc));
    if (image.magic != ESP_IMAGE_HEADER_MAGIC || desc.magic_word != ESP_APP_DESC_MAGIC_WORD) {
        *error = "Not a firmware file (use build/chroninkle.bin)";
        return false;
    }
    if (image.chip_id != CONFIG_IDF_FIRMWARE_CHIP_ID) {
        *error = "Firmware built for a different chip";
        return false;
    }
    const esp_app_desc_t* running = esp_app_get_description();
    if (std::strncmp(desc.project_name, running->project_name, sizeof(desc.project_name)) != 0) {
        *error = "Firmware for a different project";
        return false;
    }
    ESP_LOGI(kTag, "Incoming firmware: %s %s (running %s)", desc.project_name, desc.version,
             running->version);
    return true;
}

void RestartTimerCallback(void*)
{
    ESP_LOGI(kTag, "Restarting into the new firmware");
    esp_restart();
}

esp_err_t FailUpload(httpd_req_t* request, esp_ota_handle_t* handle, const char* status,
                     const char* message)
{
    if (handle != nullptr && *handle != 0) {
        esp_ota_abort(*handle);
        *handle = 0;
    }
    ESP_LOGW(kTag, "Firmware update failed: %s", message);
    s_update_in_progress.store(false);
    Notify(EventType::kUpdateFailed);
    httpd_resp_set_hdr(request, "Connection", "close");
    return SendResult(request, status, false, message);
}

esp_err_t HandleUpload(httpd_req_t* request)
{
    const char* error = nullptr;
    if (!ConsumeCode(request, &error)) {
        httpd_resp_set_hdr(request, "Connection", "close");
        return SendResult(request, "403 Forbidden", false, error);
    }
    bool expected = false;
    if (!s_update_in_progress.compare_exchange_strong(expected, true)) {
        httpd_resp_set_hdr(request, "Connection", "close");
        return SendResult(request, "409 Conflict", false, "An update is already in progress");
    }

    const esp_partition_t* partition = esp_ota_get_next_update_partition(nullptr);
    const size_t total = request->content_len;
    if (partition == nullptr) {
        return FailUpload(request, nullptr, HTTPD_500, "No OTA partition available");
    }
    if (total < kIdentifyBytes || total > partition->size) {
        return FailUpload(request, nullptr, HTTPD_400, "Firmware file has the wrong size");
    }

    Notify(EventType::kUpdateStarted);
    ESP_LOGI(kTag, "Receiving %u bytes into %s", static_cast<unsigned>(total), partition->label);

    std::vector<uint8_t> buffer(kChunkSize);
    std::vector<uint8_t> header;  // first bytes, held back until the image is identified
    header.reserve(kChunkSize + kIdentifyBytes);
    esp_ota_handle_t handle = 0;
    size_t received = 0;
    int timeouts = 0;
    while (received < total) {
        const int read = httpd_req_recv(request, reinterpret_cast<char*>(buffer.data()),
                                         std::min(buffer.size(), total - received));
        if (read == HTTPD_SOCK_ERR_TIMEOUT && ++timeouts <= kMaxRecvTimeouts) {
            continue;
        }
        if (read <= 0) {
            return FailUpload(request, &handle, HTTPD_500, "Upload interrupted");
        }
        timeouts = 0;
        received += static_cast<size_t>(read);

        if (handle == 0) {
            header.insert(header.end(), buffer.begin(), buffer.begin() + read);
            if (header.size() < kIdentifyBytes) {
                continue;  // total >= kIdentifyBytes, so more is coming
            }
            if (!IdentifyImage(header.data(), &error)) {
                return FailUpload(request, nullptr, HTTPD_400, error);
            }
            if (esp_ota_begin(partition, OTA_WITH_SEQUENTIAL_WRITES, &handle) != ESP_OK) {
                handle = 0;
                return FailUpload(request, nullptr, HTTPD_500, "Could not start the update");
            }
            if (esp_ota_write(handle, header.data(), header.size()) != ESP_OK) {
                return FailUpload(request, &handle, HTTPD_500, "Could not write the firmware");
            }
            header.clear();
            header.shrink_to_fit();
            continue;
        }
        if (esp_ota_write(handle, buffer.data(), static_cast<size_t>(read)) != ESP_OK) {
            return FailUpload(request, &handle, HTTPD_500, "Could not write the firmware");
        }
    }

    // esp_ota_end verifies the image (checksum / hash) and frees the handle either way.
    const esp_err_t end_err = esp_ota_end(handle);
    handle = 0;
    if (end_err != ESP_OK) {
        return FailUpload(request, nullptr, HTTPD_400,
                          end_err == ESP_ERR_OTA_VALIDATE_FAILED ? "Firmware file is corrupted"
                                                                 : "Could not finish the update");
    }
    if (esp_ota_set_boot_partition(partition) != ESP_OK) {
        return FailUpload(request, nullptr, HTTPD_500, "Could not activate the new firmware");
    }

    ESP_LOGI(kTag, "Firmware update written; restarting shortly");
    Notify(EventType::kUpdateSucceeded);
    const esp_err_t sent =
        SendResult(request, HTTPD_200, true, "Update installed, the device is restarting");

    if (s_restart_timer == nullptr) {
        const esp_timer_create_args_t args = {
            .callback = RestartTimerCallback,
            .arg = nullptr,
            .dispatch_method = ESP_TIMER_TASK,
            .name = "ota_restart",
            .skip_unhandled_events = true,
        };
        if (esp_timer_create(&args, &s_restart_timer) != ESP_OK) {
            s_restart_timer = nullptr;
        }
    }
    if (s_restart_timer == nullptr || esp_timer_start_once(s_restart_timer, kRestartDelayUs) != ESP_OK) {
        esp_restart();
    }
    return sent;
}

void Register(httpd_handle_t server, const char* uri, httpd_method_t method,
              esp_err_t (*handler)(httpd_req_t*))
{
    httpd_uri_t route = {};
    route.uri = uri;
    route.method = method;
    route.handler = handler;
    route.user_ctx = nullptr;
    const esp_err_t err = httpd_register_uri_handler(server, &route);
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Registering %s failed: %s", uri, esp_err_to_name(err));
    }
}

}  // namespace

void SetEventHandler(EventHandler handler, void* context)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_handler = handler;
    s_handler_context = context;
}

void RegisterPortalRoutes(httpd_handle_t server)
{
    if (server == nullptr) {
        return;
    }
    Register(server, kStatusUri, HTTP_GET, HandleStatus);
    Register(server, kCodeUri, HTTP_POST, HandleCode);
    Register(server, kUploadUri, HTTP_POST, HandleUpload);
}

}  // namespace ota_service
