#include "timeline_format.h"

#include "i18n.h"

#include <cstdio>
#include <cstdlib>
#include <ctime>

#include "timezone_service.h"

namespace timeline_format {

using recording_archive_service::RecordingTag;

std::string DateKey(const std::string& created_local_date)
{
    const auto space = created_local_date.find(' ');
    return space == std::string::npos ? created_local_date : created_local_date.substr(0, space);
}

std::string FormatDateLabel(const std::string& created_local_date)
{
    const std::string day_key = DateKey(created_local_date);

    // "Today" only while the recording's day equals the current local date. GetSnapshot().current_date
    // is the live "YYYY-MM-DD", so this stops reading "Today" as soon as the date rolls over.
    if (!day_key.empty() &&
        day_key == timezone_service::GetSnapshot().runtime.current_date) {
        return i18n::Tr("Today", "Oggi");
    }

    int year = 0;
    int month = 0;
    int day = 0;
    if (std::sscanf(day_key.c_str(), "%d-%d-%d", &year, &month, &day) == 3) {
        std::tm tm = {};
        tm.tm_year = year - 1900;
        tm.tm_mon = month - 1;
        tm.tm_mday = day;
        std::time_t stamp = std::mktime(&tm);
        if (stamp != static_cast<std::time_t>(-1)) {
            std::tm local = {};
            localtime_r(&stamp, &local);
            return i18n::FormatShortDate(local);
        }
    }
    return created_local_date.empty() ? std::string(i18n::Tr("Today", "Oggi")) : created_local_date;
}

std::string FormatTimeLabel(bool time_valid, int64_t created_unix_seconds)
{
    if (time_valid && created_unix_seconds > 0) {
        std::time_t stamp = static_cast<std::time_t>(created_unix_seconds);
        std::tm local = {};
        localtime_r(&stamp, &local);
        return i18n::FormatClock(local.tm_hour, local.tm_min);
    }
    return "--:--";
}

std::string FormatDurationLabel(uint32_t duration_ms)
{
    if (duration_ms == 0) {
        return {};  // text-only entry (e.g. a todo split out of another recording)
    }
    const uint32_t seconds = duration_ms / 1000U;
    if (seconds < 60U) {
        return std::to_string(seconds) + "s";
    }
    return std::to_string(seconds / 60U) + "m";
}

std::string TrimTranscript(const std::string& text)
{
    const auto begin = text.find_first_not_of(" \t\r\n");
    if (begin == std::string::npos) {
        return {};
    }
    const auto end = text.find_last_not_of(" \t\r\n");
    return text.substr(begin, end - begin + 1);
}

std::string TagText(RecordingTag tag)
{
    switch (tag) {
        case RecordingTag::kTask:
            return i18n::Tr("Task", "Da fare");
        case RecordingTag::kIdea:
            return "Idea";
        case RecordingTag::kNote:
        default:
            return i18n::Tr("Note", "Nota");
    }
}

std::string EntryText(const recording_archive_service::RecordingEntry& entry)
{
    const std::string display = TrimTranscript(entry.metadata.display_text);
    return !display.empty() ? display : TrimTranscript(entry.transcript_text);
}

namespace {

// "YYYY-MM-DD" -> local midnight; false when unparseable.
bool ParseDay(const std::string& day, std::tm* out)
{
    int year = 0;
    int month = 0;
    int mday = 0;
    if (std::sscanf(day.c_str(), "%d-%d-%d", &year, &month, &mday) != 3) {
        return false;
    }
    std::tm tm = {};
    tm.tm_year = year - 1900;
    tm.tm_mon = month - 1;
    tm.tm_mday = mday;
    tm.tm_hour = 12;  // noon: immune to DST shifts when stepping by days
    tm.tm_isdst = -1;
    if (std::mktime(&tm) == static_cast<std::time_t>(-1)) {
        return false;
    }
    *out = tm;
    return true;
}

std::string DayKey(const std::tm& tm)
{
    char buffer[16] = {};
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d", &tm);
    return buffer;
}

}  // namespace

std::string DueLabel(const recording_archive_service::RecordingMetadata& metadata)
{
    if (metadata.due_date.empty()) {
        return {};
    }
    std::string label;
    const std::string today = timezone_service::GetSnapshot().runtime.current_date;
    std::tm today_tm = {};
    std::tm due_tm = {};
    const bool have_today = ParseDay(today, &today_tm);
    if (!ParseDay(metadata.due_date, &due_tm)) {
        return {};
    }
    std::tm tomorrow_tm = today_tm;
    tomorrow_tm.tm_mday += 1;
    std::mktime(&tomorrow_tm);

    if (have_today && metadata.due_date < today) {
        return i18n::Tr("Overdue", "Scaduta");
    }
    if (have_today && metadata.due_date == today) {
        label = i18n::Tr("Today", "Oggi");
    } else if (have_today && metadata.due_date == DayKey(tomorrow_tm)) {
        label = i18n::Tr("Tomorrow", "Domani");
    } else {
        label = i18n::FormatShortDate(due_tm);
    }
    if (!metadata.due_time.empty() && metadata.due_time.size() == 5) {
        const int hour = std::atoi(metadata.due_time.substr(0, 2).c_str());
        const int minute = std::atoi(metadata.due_time.substr(3, 2).c_str());
        label += " " + i18n::FormatClock(hour, minute);
    }
    return label;
}

std::string DueSortKey(const recording_archive_service::RecordingMetadata& metadata)
{
    if (metadata.due_date.empty()) {
        return "~";  // after any digit
    }
    return metadata.due_date + " " + (metadata.due_time.empty() ? "99:99" : metadata.due_time);
}

}  // namespace timeline_format
