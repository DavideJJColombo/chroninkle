#include "i18n.h"

#include <atomic>
#include <cstdio>

#if __has_include("nvs.h")
#include "esp_log.h"
#include "nvs.h"
#include "sdkconfig.h"
#define I18N_HAS_NVS 1
#else
#define I18N_HAS_NVS 0  // host-side (PC) builds: no persistence
#endif

namespace i18n {
namespace {

#if I18N_HAS_NVS
constexpr const char* kTag = "I18n";
constexpr const char* kNvsNamespace = "app_state";
constexpr const char* kLanguageKey = "language";
#endif

#if defined(CONFIG_CHRONINKLE_DEFAULT_LANGUAGE_ITALIAN)
constexpr Language kDefaultLanguage = Language::kItalian;
#else
constexpr Language kDefaultLanguage = Language::kEnglish;
#endif

std::atomic<Language> s_language{kDefaultLanguage};

bool IsValid(uint8_t value)
{
    return value < static_cast<uint8_t>(kLanguageCount);
}

}  // namespace

void Init()
{
#if I18N_HAS_NVS
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READONLY, &handle) != ESP_OK) {
        return;  // nothing saved yet: keep the Kconfig default
    }
    uint8_t value = 0;
    const esp_err_t err = nvs_get_u8(handle, kLanguageKey, &value);
    nvs_close(handle);
    if (err == ESP_OK && IsValid(value)) {
        s_language.store(static_cast<Language>(value), std::memory_order_relaxed);
    }
    ESP_LOGI(kTag, "UI language: %s", LanguageCode(Current()));
#endif
}

Language Current()
{
    return s_language.load(std::memory_order_relaxed);
}

bool SetLanguage(Language language)
{
    if (!IsValid(static_cast<uint8_t>(language))) {
        return false;
    }
    s_language.store(language, std::memory_order_relaxed);
#if I18N_HAS_NVS
    nvs_handle_t handle = 0;
    if (nvs_open(kNvsNamespace, NVS_READWRITE, &handle) != ESP_OK) {
        ESP_LOGW(kTag, "Saving language: nvs_open failed");
        return false;
    }
    esp_err_t err = nvs_set_u8(handle, kLanguageKey, static_cast<uint8_t>(language));
    if (err == ESP_OK) {
        err = nvs_commit(handle);
    }
    nvs_close(handle);
    if (err != ESP_OK) {
        ESP_LOGW(kTag, "Saving language failed: %s", esp_err_to_name(err));
        return false;
    }
#endif
    return true;
}

const char* LanguageName(Language language)
{
    return language == Language::kItalian ? "Italiano" : "English";
}

const char* LanguageCode(Language language)
{
    return language == Language::kItalian ? "it" : "en";
}

namespace {

constexpr const char* kWeekdaysEn[7] = {"Sunday",   "Monday", "Tuesday", "Wednesday",
                                        "Thursday", "Friday", "Saturday"};
// Capitalized: these only ever start a line or a heading.
constexpr const char* kWeekdaysIt[7] = {"Domenica", "Lunedì",  "Martedì", "Mercoledì",
                                        "Giovedì",  "Venerdì", "Sabato"};
constexpr const char* kWeekdaysShortEn[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
constexpr const char* kWeekdaysShortIt[7] = {"Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"};
constexpr const char* kMonthsShortEn[12] = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
constexpr const char* kMonthsShortIt[12] = {"gen", "feb", "mar", "apr", "mag", "giu",
                                            "lug", "ago", "set", "ott", "nov", "dic"};

int Wrap(int value, int count)
{
    value %= count;
    return value < 0 ? value + count : value;
}

}  // namespace

const char* WeekdayName(int tm_wday)
{
    const int index = Wrap(tm_wday, 7);
    return IsItalian() ? kWeekdaysIt[index] : kWeekdaysEn[index];
}

const char* WeekdayShort(int tm_wday)
{
    const int index = Wrap(tm_wday, 7);
    return IsItalian() ? kWeekdaysShortIt[index] : kWeekdaysShortEn[index];
}

const char* MonthShort(int tm_mon)
{
    const int index = Wrap(tm_mon, 12);
    return IsItalian() ? kMonthsShortIt[index] : kMonthsShortEn[index];
}

std::string FormatClock(int hour24, int minute)
{
    char buffer[16] = {};
    hour24 = Wrap(hour24, 24);
    minute = Wrap(minute, 60);
    if (IsItalian()) {
        std::snprintf(buffer, sizeof(buffer), "%02d:%02d", hour24, minute);
    } else {
        const int hour12 = hour24 % 12 == 0 ? 12 : hour24 % 12;
        std::snprintf(buffer, sizeof(buffer), "%d:%02d %s", hour12, minute,
                      hour24 >= 12 ? "PM" : "AM");
    }
    return buffer;
}

std::string FormatLongDate(const std::tm& local)
{
    const std::string day = std::to_string(local.tm_mday);
    const std::string year = std::to_string(local.tm_year + 1900);
    if (IsItalian()) {
        return day + " " + MonthShort(local.tm_mon) + " " + year;
    }
    return std::string(MonthShort(local.tm_mon)) + " " + day + ", " + year;
}

std::string FormatShortDate(const std::tm& local)
{
    char day[4] = {};
    std::snprintf(day, sizeof(day), "%02d", local.tm_mday);
    if (IsItalian()) {
        return std::string(WeekdayShort(local.tm_wday)) + " " + std::to_string(local.tm_mday) +
               " " + MonthShort(local.tm_mon);
    }
    // Matches the original strftime("%a %b %d") output.
    return std::string(WeekdayShort(local.tm_wday)) + " " + MonthShort(local.tm_mon) + " " + day;
}

}  // namespace i18n
