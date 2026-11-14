#include "app_state_service.h"

#include <atomic>

#include "esp_log.h"
#include "nvs.h"

namespace app_state_service {
namespace {

constexpr const char* kTag = "AppStateService";
constexpr const char* kNvsNamespace = "app_state";
constexpr const char* kOnboardingKey = "onboarded";
constexpr const char* kAutoClassifyKey = "auto_class";
constexpr const char* kVolumeKey = "volume";

// -1 = not loaded yet, otherwise 0/1. Read on every recording, so cached after the first read.
std::atomic<int> s_auto_classify{-1};
std::atomic<int> s_volume_level{-1};  // -1 = not loaded yet

}  // namespace

bool OnboardingViewed()
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) != ESP_OK) {
        return false;
    }
    uint8_t viewed = 0;
    const esp_err_t err = nvs_get_u8(handle, kOnboardingKey, &viewed);
    nvs_close(handle);
    return err == ESP_OK && viewed != 0;
}

void MarkOnboardingViewed()
{
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Onboarding flag: nvs_open failed");
        return;
    }
    if (nvs_set_u8(handle, kOnboardingKey, 1) == ESP_OK) {
        (void)nvs_commit(handle);
    }
    nvs_close(handle);
}

bool AutoClassifyEnabled()
{
    int cached = s_auto_classify.load(std::memory_order_relaxed);
    if (cached >= 0) {
        return cached != 0;
    }
    uint8_t value = 1;  // default on
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) == ESP_OK) {
        (void)nvs_get_u8(handle, kAutoClassifyKey, &value);
        nvs_close(handle);
    }
    cached = value != 0 ? 1 : 0;
    s_auto_classify.store(cached, std::memory_order_relaxed);
    return cached != 0;
}

void SetAutoClassifyEnabled(bool enabled)
{
    s_auto_classify.store(enabled ? 1 : 0, std::memory_order_relaxed);
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Auto-classify flag: nvs_open failed");
        return;
    }
    if (nvs_set_u8(handle, kAutoClassifyKey, enabled ? 1 : 0) == ESP_OK) {
        (void)nvs_commit(handle);
    }
    nvs_close(handle);
}

int VolumeLevel()
{
    int cached = s_volume_level.load(std::memory_order_relaxed);
    if (cached >= 0) {
        return cached;
    }
    uint8_t value = kMaxVolumeLevel;
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) == ESP_OK) {
        (void)nvs_get_u8(handle, kVolumeKey, &value);
        nvs_close(handle);
    }
    cached = value > kMaxVolumeLevel ? kMaxVolumeLevel : static_cast<int>(value);
    s_volume_level.store(cached, std::memory_order_relaxed);
    return cached;
}

void SetVolumeLevel(int level)
{
    if (level < 0) {
        level = 0;
    } else if (level > kMaxVolumeLevel) {
        level = kMaxVolumeLevel;
    }
    s_volume_level.store(level, std::memory_order_relaxed);
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Volume: nvs_open failed");
        return;
    }
    if (nvs_set_u8(handle, kVolumeKey, static_cast<uint8_t>(level)) == ESP_OK) {
        (void)nvs_commit(handle);
    }
    nvs_close(handle);
}

}  // namespace app_state_service
