#ifndef I18N_H_
#define I18N_H_

#include <cstdint>
#include <ctime>
#include <string>

// UI language. Every user-visible string is written as Tr("English", "Italiano") at the place
// it is used, so the two versions sit side by side and a missing translation is impossible.
// The choice is persisted in NVS and can be changed at runtime from Settings > Language;
// screens pick it up the next time they build their state.
namespace i18n {

enum class Language : uint8_t {
    kEnglish = 0,
    kItalian = 1,
};

inline constexpr int kLanguageCount = 2;

// Loads the saved language (or the Kconfig default). Call once, after nvs_flash_init().
void Init();

Language Current();

// Switches the UI language and saves it. Returns false if saving to NVS failed (the language
// still changes for this session).
bool SetLanguage(Language language);

// The language's own name ("English", "Italiano").
const char* LanguageName(Language language);

// BCP 47 tag ("en", "it"), e.g. for prompts that ask Gemini to answer in the UI language.
const char* LanguageCode(Language language);

inline bool IsItalian()
{
    return Current() == Language::kItalian;
}

// Picks the string for the current language. Both arguments must outlive the returned pointer
// (string literals do).
inline const char* Tr(const char* english, const char* italian)
{
    return IsItalian() ? italian : english;
}

// --- Dates and times -------------------------------------------------------------------------
// English keeps the original formats ("Thursday", "Nov 12, 2026", "2:05 PM"); Italian uses its
// own conventions ("giovedì", "12 nov 2026", 24-hour "14:05").

const char* WeekdayName(int tm_wday);   // "Thursday" / "Giovedì"
const char* WeekdayShort(int tm_wday);  // "Thu" / "Gio"
const char* MonthShort(int tm_mon);     // "Nov" / "nov"

// Italian uses the 24-hour clock everywhere (display and manual time entry).
inline bool Uses24HourClock()
{
    return IsItalian();
}

std::string FormatClock(int hour24, int minute);  // "2:05 PM" / "14:05"
std::string FormatLongDate(const std::tm& local);   // "Nov 12, 2026" / "12 nov 2026"
std::string FormatShortDate(const std::tm& local);  // "Thu Nov 12" / "Gio 12 nov"

}  // namespace i18n

#endif  // I18N_H_
