#include "ics_calendar.h"

#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <ctime>

namespace ics {
namespace {

constexpr size_t kMaxLineLength = 4096;
constexpr size_t kMaxTitleLength = 96;
constexpr size_t kMaxLocationLength = 64;
constexpr int kMaxExpansionSteps = 4000;

std::string Upper(std::string value)
{
    for (char& c : value) {
        c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
    }
    return value;
}

int DaysInMonth(int year, int month)
{
    static const int kDays[] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    if (month == 2) {
        const bool leap = (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        return leap ? 29 : 28;
    }
    return kDays[(month - 1) % 12];
}

// 0 = Monday ... 6 = Sunday
int WeekdayFromDays(int64_t days)
{
    // 1970-01-01 was a Thursday (3).
    int64_t w = (days + 3) % 7;
    if (w < 0) {
        w += 7;
    }
    return static_cast<int>(w);
}

int WeekdayFromCode(const std::string& code)
{
    static const char* kCodes[] = {"MO", "TU", "WE", "TH", "FR", "SA", "SU"};
    for (int i = 0; i < 7; ++i) {
        if (code == kCodes[i]) {
            return i;
        }
    }
    return -1;
}

std::vector<std::string> Split(const std::string& value, char separator)
{
    std::vector<std::string> parts;
    size_t start = 0;
    while (start <= value.size()) {
        const size_t end = value.find(separator, start);
        parts.push_back(value.substr(start, end == std::string::npos ? std::string::npos
                                                                     : end - start));
        if (end == std::string::npos) {
            break;
        }
        start = end + 1;
    }
    return parts;
}

int64_t ParseDuration(const std::string& value)
{
    // [+-]P[nW][nD][T[nH][nM][nS]]
    int64_t total = 0;
    int64_t number = 0;
    bool in_time = false;
    bool negative = false;
    for (char c : value) {
        if (c == '-') {
            negative = true;
        } else if (c == 'P' || c == '+') {
            continue;
        } else if (c == 'T') {
            in_time = true;
        } else if (std::isdigit(static_cast<unsigned char>(c))) {
            number = number * 10 + (c - '0');
        } else {
            switch (c) {
                case 'W': total += number * 7 * 86400; break;
                case 'D': total += number * 86400; break;
                case 'H': total += number * 3600; break;
                case 'M': total += in_time ? number * 60 : 0; break;
                case 'S': total += number; break;
                default: break;
            }
            number = 0;
        }
    }
    return negative ? -total : total;
}

void Truncate(std::string* value, size_t max_length)
{
    if (value->size() <= max_length) {
        return;
    }
    size_t cut = max_length;
    // Don't split a UTF-8 sequence.
    while (cut > 0 && (static_cast<unsigned char>((*value)[cut]) & 0xC0) == 0x80) {
        --cut;
    }
    value->resize(cut);
    value->append("...");
}

struct Rule {
    std::string freq;
    int interval = 1;
    int count = -1;
    bool has_until = false;
    int64_t until = 0;
    std::vector<std::pair<int, int>> by_day;  // (ordinal or 0, weekday)
    std::vector<int> by_month_day;
};

Rule ParseRule(const std::string& text)
{
    Rule rule;
    for (const std::string& part : Split(text, ';')) {
        const size_t eq = part.find('=');
        if (eq == std::string::npos) {
            continue;
        }
        const std::string key = Upper(part.substr(0, eq));
        const std::string value = part.substr(eq + 1);
        if (key == "FREQ") {
            rule.freq = Upper(value);
        } else if (key == "INTERVAL") {
            rule.interval = std::max(1, std::atoi(value.c_str()));
        } else if (key == "COUNT") {
            rule.count = std::max(0, std::atoi(value.c_str()));
        } else if (key == "UNTIL") {
            const Parser::DateTime until = ParseDateTime(value, false);
            if (until.valid) {
                rule.has_until = true;
                Parser::DateTime end_of_day = until;
                if (until.date_only) {
                    // An UNTIL date includes that whole day.
                    end_of_day.date_only = false;
                    end_of_day.hour = 23;
                    end_of_day.minute = 59;
                    end_of_day.second = 59;
                }
                rule.until = ToEpoch(end_of_day);
            }
        } else if (key == "BYDAY") {
            for (const std::string& item : Split(value, ',')) {
                if (item.size() < 2) {
                    continue;
                }
                const int weekday = WeekdayFromCode(Upper(item.substr(item.size() - 2)));
                if (weekday < 0) {
                    continue;
                }
                const int ordinal =
                    item.size() > 2 ? std::atoi(item.substr(0, item.size() - 2).c_str()) : 0;
                rule.by_day.emplace_back(ordinal, weekday);
            }
        } else if (key == "BYMONTHDAY") {
            for (const std::string& item : Split(value, ',')) {
                const int day = std::atoi(item.c_str());
                if (day != 0) {
                    rule.by_month_day.push_back(day);
                }
            }
        }
    }
    return rule;
}

// Day-of-month for "the n-th <weekday>" (n < 0 counts from the end); 0 if none.
int NthWeekdayOfMonth(int year, int month, int ordinal, int weekday)
{
    const int days = DaysInMonth(year, month);
    const int first_weekday = WeekdayFromDays(DaysFromCivil(year, month, 1));
    if (ordinal > 0) {
        const int day = 1 + ((weekday - first_weekday + 7) % 7) + (ordinal - 1) * 7;
        return day <= days ? day : 0;
    }
    if (ordinal < 0) {
        const int last_weekday = WeekdayFromDays(DaysFromCivil(year, month, days));
        const int day = days - ((last_weekday - weekday + 7) % 7) + (ordinal + 1) * 7;
        return day >= 1 ? day : 0;
    }
    return 0;
}

}  // namespace

void CivilFromDays(int64_t z, int* year, int* month, int* day)
{
    z += 719468;
    const int64_t era = (z >= 0 ? z : z - 146096) / 146097;
    const int64_t doe = z - era * 146097;
    const int64_t yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    const int64_t y = yoe + era * 400;
    const int64_t doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    const int64_t mp = (5 * doy + 2) / 153;
    const int64_t d = doy - (153 * mp + 2) / 5 + 1;
    const int64_t m = mp < 10 ? mp + 3 : mp - 9;
    *year = static_cast<int>(y + (m <= 2 ? 1 : 0));
    *month = static_cast<int>(m);
    *day = static_cast<int>(d);
}

int64_t DaysFromCivil(int year, int month, int day)
{
    year -= month <= 2 ? 1 : 0;
    const int64_t era = (year >= 0 ? year : year - 399) / 400;
    const int64_t yoe = year - era * 400;
    const int64_t doy = (153 * (month + (month > 2 ? -3 : 9)) + 2) / 5 + day - 1;
    const int64_t doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
    return era * 146097 + doe - 719468;
}

int64_t ToEpoch(const Parser::DateTime& value)
{
    if (!value.valid) {
        return 0;
    }
    if (value.utc) {
        return DaysFromCivil(value.year, value.month, value.day) * 86400 + value.hour * 3600 +
               value.minute * 60 + value.second;
    }
    std::tm tm = {};
    tm.tm_year = value.year - 1900;
    tm.tm_mon = value.month - 1;
    tm.tm_mday = value.day;
    tm.tm_hour = value.date_only ? 0 : value.hour;
    tm.tm_min = value.date_only ? 0 : value.minute;
    tm.tm_sec = value.date_only ? 0 : value.second;
    tm.tm_isdst = -1;
    return static_cast<int64_t>(std::mktime(&tm));
}

Parser::DateTime ParseDateTime(const std::string& value, bool date_param)
{
    Parser::DateTime result;
    if (value.size() < 8) {
        return result;
    }
    for (size_t i = 0; i < 8; ++i) {
        if (!std::isdigit(static_cast<unsigned char>(value[i]))) {
            return result;
        }
    }
    result.year = std::atoi(value.substr(0, 4).c_str());
    result.month = std::atoi(value.substr(4, 2).c_str());
    result.day = std::atoi(value.substr(6, 2).c_str());
    if (result.month < 1 || result.month > 12 || result.day < 1 || result.day > 31) {
        return result;
    }
    if (date_param || value.size() < 15 || value[8] != 'T') {
        result.date_only = true;
    } else {
        result.hour = std::atoi(value.substr(9, 2).c_str());
        result.minute = std::atoi(value.substr(11, 2).c_str());
        result.second = std::atoi(value.substr(13, 2).c_str());
        result.utc = value.size() >= 16 && (value[15] == 'Z' || value[15] == 'z');
    }
    result.valid = true;
    return result;
}

std::string Unescape(const std::string& value)
{
    std::string out;
    out.reserve(value.size());
    for (size_t i = 0; i < value.size(); ++i) {
        if (value[i] == '\\' && i + 1 < value.size()) {
            const char next = value[++i];
            if (next == 'n' || next == 'N') {
                out.push_back(' ');
            } else {
                out.push_back(next);  // \, \; \\ -> the character itself
            }
        } else {
            out.push_back(value[i]);
        }
    }
    return out;
}

Parser::Parser(int64_t window_start, int64_t window_end, size_t max_occurrences)
    : window_start_(window_start), window_end_(window_end), max_occurrences_(max_occurrences)
{
}

void Parser::Feed(const char* data, size_t length)
{
    for (size_t i = 0; i < length; ++i) {
        const char c = data[i];
        if (c == '\n') {
            ProcessPhysicalLine(std::move(partial_));
            partial_.clear();
        } else if (c != '\r' && partial_.size() < kMaxLineLength) {
            partial_.push_back(c);
        }
    }
}

void Parser::Finish()
{
    if (!partial_.empty()) {
        ProcessPhysicalLine(std::move(partial_));
        partial_.clear();
    }
    if (!pending_.empty()) {
        ProcessLine(pending_);
        pending_.clear();
    }
}

void Parser::ProcessPhysicalLine(std::string line)
{
    if (!line.empty() && (line[0] == ' ' || line[0] == '\t')) {
        if (pending_.size() < kMaxLineLength) {
            pending_.append(line, 1, std::string::npos);
        }
        return;
    }
    if (!pending_.empty()) {
        ProcessLine(pending_);
    }
    pending_ = std::move(line);
}

void Parser::ProcessLine(const std::string& line)
{
    // NAME;PARAM=...;PARAM="a:b":VALUE -- the value starts at the first ':' outside quotes.
    size_t colon = std::string::npos;
    bool quoted = false;
    for (size_t i = 0; i < line.size(); ++i) {
        if (line[i] == '"') {
            quoted = !quoted;
        } else if (line[i] == ':' && !quoted) {
            colon = i;
            break;
        }
    }
    if (colon == std::string::npos) {
        return;
    }
    const std::string head = line.substr(0, colon);
    const std::string value = line.substr(colon + 1);
    const size_t semicolon = head.find(';');
    const std::string name = Upper(head.substr(0, semicolon));
    const std::string params =
        semicolon == std::string::npos ? std::string() : Upper(head.substr(semicolon + 1));
    const bool date_param = params.find("VALUE=DATE") != std::string::npos &&
                            params.find("VALUE=DATE-TIME") == std::string::npos;

    if (name == "BEGIN") {
        const std::string what = Upper(value);
        if (what == "VCALENDAR") {
            saw_calendar_ = true;
        } else if (what == "VEVENT" && !in_event_) {
            in_event_ = true;
            nested_ = 0;
            event_ = Event{};
        } else if (in_event_) {
            ++nested_;  // VALARM and friends: ignore their properties
        }
        return;
    }
    if (name == "END") {
        const std::string what = Upper(value);
        if (in_event_ && nested_ > 0) {
            --nested_;
        } else if (in_event_ && what == "VEVENT") {
            in_event_ = false;
            FinishEvent();
        }
        return;
    }
    if (!in_event_) {
        if (name == "X-WR-CALNAME" && calendar_name_.empty()) {
            calendar_name_ = Unescape(value);
            Truncate(&calendar_name_, kMaxLocationLength);
        }
        return;
    }
    if (nested_ > 0) {
        return;
    }

    if (name == "UID") {
        event_.uid = value;
    } else if (name == "SUMMARY") {
        event_.title = Unescape(value);
        Truncate(&event_.title, kMaxTitleLength);
    } else if (name == "LOCATION") {
        event_.location = Unescape(value);
        Truncate(&event_.location, kMaxLocationLength);
    } else if (name == "DTSTART") {
        event_.start = ParseDateTime(value, date_param);
    } else if (name == "DTEND") {
        event_.end = ParseDateTime(value, date_param);
        event_.has_end = event_.end.valid;
    } else if (name == "DURATION") {
        event_.duration_seconds = ParseDuration(value);
    } else if (name == "RRULE") {
        event_.rrule = value;
    } else if (name == "STATUS") {
        event_.status = Upper(value);
    } else if (name == "EXDATE") {
        for (const std::string& item : Split(value, ',')) {
            const DateTime when = ParseDateTime(item, date_param);
            if (when.valid) {
                event_.exdates.push_back(ToEpoch(when));
            }
        }
    } else if (name == "RECURRENCE-ID") {
        const DateTime when = ParseDateTime(value, date_param);
        if (when.valid) {
            event_.has_recurrence_id = true;
            event_.recurrence_id = ToEpoch(when);
        }
    }
}

void Parser::FinishEvent()
{
    ++event_count_;
    if (!event_.start.valid) {
        return;
    }
    if (event_.has_recurrence_id) {
        // A moved or cancelled instance of a recurring event: hide the rule's own copy.
        overridden_.insert({event_.uid, event_.recurrence_id});
    }
    if (event_.status == "CANCELLED") {
        return;
    }

    const int64_t start = ToEpoch(event_.start);
    int64_t length = 0;
    if (event_.has_end) {
        length = ToEpoch(event_.end) - start;
    } else if (event_.duration_seconds >= 0) {
        length = event_.duration_seconds;
    } else if (event_.start.date_only) {
        length = 86400;
    }
    if (length < 0) {
        length = 0;
    }

    if (event_.rrule.empty() || event_.has_recurrence_id) {
        AddOccurrence(event_, start, length, false);
    } else {
        Expand(event_, length);
    }
}

void Parser::AddOccurrence(const Event& event, int64_t start, int64_t length, bool master)
{
    int64_t end = start + length;
    if (event.start.date_only) {
        // All-day: end at local midnight of the last day + 1 (DST-safe), via the date fields.
        int y = 0, m = 0, d = 0;
        const std::time_t t = static_cast<std::time_t>(start);
        std::tm local = {};
        localtime_r(&t, &local);
        const int64_t days = DaysFromCivil(local.tm_year + 1900, local.tm_mon + 1, local.tm_mday) +
                             std::max<int64_t>(1, (length + 43200) / 86400);
        CivilFromDays(days, &y, &m, &d);
        DateTime next = {};
        next.year = y;
        next.month = m;
        next.day = d;
        next.date_only = true;
        next.valid = true;
        end = ToEpoch(next);
    }
    const bool zero_length = end == start;
    if (!(end > window_start_ || (zero_length && start >= window_start_)) ||
        start >= window_end_) {
        return;
    }
    if (results_.size() >= max_occurrences_) {
        return;
    }
    Pending pending;
    pending.occurrence.start = start;
    pending.occurrence.end = end;
    pending.occurrence.all_day = event.start.date_only;
    pending.occurrence.title = event.title;
    pending.occurrence.location = event.location;
    pending.uid = event.uid;
    pending.master = master;
    results_.push_back(std::move(pending));
}

void Parser::Expand(const Event& event, int64_t length)
{
    const Rule rule = ParseRule(event.rrule);
    const DateTime& base = event.start;
    const int64_t base_days = DaysFromCivil(base.year, base.month, base.day);
    int produced = 0;

    // Returns false to stop the expansion.
    auto emit = [&](int64_t days) -> bool {
        int y = 0, m = 0, d = 0;
        CivilFromDays(days, &y, &m, &d);
        DateTime when = base;
        when.year = y;
        when.month = m;
        when.day = d;
        const int64_t start = ToEpoch(when);
        if (rule.has_until && start > rule.until) {
            return false;
        }
        if (rule.count >= 0 && produced >= rule.count) {
            return false;
        }
        ++produced;
        if (start >= window_end_) {
            return false;
        }
        if (std::find(event.exdates.begin(), event.exdates.end(), start) != event.exdates.end()) {
            return true;
        }
        AddOccurrence(event, start, length, true);
        return true;
    };

    // Rules without COUNT can skip straight to just before the window.
    const int64_t window_days = static_cast<int64_t>(window_start_ / 86400) - 2;

    if (rule.freq == "DAILY") {
        int64_t step = 0;
        if (rule.count < 0 && window_days > base_days) {
            step = (window_days - base_days) / rule.interval;
        }
        for (int i = 0; i < kMaxExpansionSteps; ++i, ++step) {
            if (!emit(base_days + step * rule.interval)) {
                break;
            }
        }
    } else if (rule.freq == "WEEKLY") {
        std::vector<int> weekdays;
        for (const auto& item : rule.by_day) {
            weekdays.push_back(item.second);
        }
        if (weekdays.empty()) {
            weekdays.push_back(WeekdayFromDays(base_days));
        }
        std::sort(weekdays.begin(), weekdays.end());
        const int64_t week_start = base_days - WeekdayFromDays(base_days);  // Monday
        int64_t week = 0;
        if (rule.count < 0 && window_days > week_start) {
            week = (window_days - week_start) / (7 * rule.interval);
        }
        bool running = true;
        for (int i = 0; i < kMaxExpansionSteps && running; ++i, ++week) {
            const int64_t monday = week_start + week * 7 * rule.interval;
            for (int weekday : weekdays) {
                const int64_t days = monday + weekday;
                if (days < base_days) {
                    continue;
                }
                if (!emit(days)) {
                    running = false;
                    break;
                }
            }
        }
    } else if (rule.freq == "MONTHLY") {
        int year = base.year;
        int month = base.month;
        bool running = true;
        for (int i = 0; i < kMaxExpansionSteps && running; ++i) {
            std::vector<int> days_in_month;
            if (!rule.by_day.empty()) {
                for (const auto& item : rule.by_day) {
                    if (item.first != 0) {
                        const int day = NthWeekdayOfMonth(year, month, item.first, item.second);
                        if (day > 0) {
                            days_in_month.push_back(day);
                        }
                    } else {
                        for (int day = 1; day <= DaysInMonth(year, month); ++day) {
                            if (WeekdayFromDays(DaysFromCivil(year, month, day)) == item.second) {
                                days_in_month.push_back(day);
                            }
                        }
                    }
                }
            } else {
                const std::vector<int> wanted =
                    rule.by_month_day.empty() ? std::vector<int>{base.day} : rule.by_month_day;
                for (int wanted_day : wanted) {
                    const int day = wanted_day > 0 ? wanted_day
                                                   : DaysInMonth(year, month) + wanted_day + 1;
                    if (day >= 1 && day <= DaysInMonth(year, month)) {
                        days_in_month.push_back(day);
                    }
                }
            }
            std::sort(days_in_month.begin(), days_in_month.end());
            for (int day : days_in_month) {
                const int64_t days = DaysFromCivil(year, month, day);
                if (days < base_days) {
                    continue;
                }
                if (!emit(days)) {
                    running = false;
                    break;
                }
            }
            month += rule.interval;
            while (month > 12) {
                month -= 12;
                ++year;
            }
        }
    } else if (rule.freq == "YEARLY") {
        for (int i = 0, year = base.year; i < kMaxExpansionSteps; ++i, year += rule.interval) {
            if (base.day > DaysInMonth(year, base.month)) {
                continue;  // Feb 29 in a non-leap year
            }
            if (!emit(DaysFromCivil(year, base.month, base.day))) {
                break;
            }
        }
    } else {
        // Unsupported rule: show at least the first instance.
        AddOccurrence(event, ToEpoch(base), length, false);
    }
}

std::vector<Occurrence> Parser::TakeResults()
{
    std::vector<Occurrence> out;
    out.reserve(results_.size());
    for (Pending& pending : results_) {
        if (pending.master && overridden_.count({pending.uid, pending.occurrence.start}) > 0) {
            continue;
        }
        out.push_back(std::move(pending.occurrence));
    }
    results_.clear();
    std::sort(out.begin(), out.end(), [](const Occurrence& a, const Occurrence& b) {
        // All-day events start at local midnight, so they already come first on their day.
        if (a.start != b.start) {
            return a.start < b.start;
        }
        if (a.all_day != b.all_day) {
            return a.all_day;
        }
        return a.title < b.title;
    });
    return out;
}

}  // namespace ics
