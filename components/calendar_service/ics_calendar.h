#ifndef CALENDAR_SERVICE_ICS_CALENDAR_H_
#define CALENDAR_SERVICE_ICS_CALENDAR_H_

// Streaming reader for iCalendar (.ics) feeds such as Google Calendar's "secret address in
// iCal format". Pure C++ (no ESP-IDF), host-tested in tests/host/ics_calendar_test.cpp.
//
// Feed() takes the download in chunks of any size; only events overlapping
// [window_start, window_end) are kept, so a feed with years of history needs no more memory
// than the events in the window. Recurring events (RRULE: DAILY/WEEKLY/MONTHLY/YEARLY with
// INTERVAL, COUNT, UNTIL, BYDAY, BYMONTHDAY), EXDATE, moved/cancelled instances (RECURRENCE-ID)
// and cancelled events are handled. Times with a TZID or no zone are read as device-local wall
// time (the calendar is assumed to be in the device's time zone); "Z" times are UTC.

#include <cstddef>
#include <cstdint>
#include <set>
#include <string>
#include <utility>
#include <vector>

namespace ics {

struct Occurrence {
    int64_t start = 0;  // epoch seconds
    int64_t end = 0;    // epoch seconds, exclusive (all-day: next local midnight)
    bool all_day = false;
    std::string title;
    std::string location;
};

class Parser {
public:
    Parser(int64_t window_start, int64_t window_end, size_t max_occurrences = 300);

    void Feed(const char* data, size_t length);
    // Processes the last buffered line; call once after the last Feed().
    void Finish();
    // Occurrences in the window, sorted by start (then title), moved/cancelled instances
    // applied. Valid after Finish().
    std::vector<Occurrence> TakeResults();

    const std::string& calendar_name() const { return calendar_name_; }
    // True once a BEGIN:VCALENDAR line was seen (to tell an .ics file from an HTML error page).
    bool saw_calendar() const { return saw_calendar_; }
    size_t event_count() const { return event_count_; }

    // A wall-clock or UTC moment as written in the file.
    struct DateTime {
        int year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;
        bool date_only = false;
        bool utc = false;
        bool valid = false;
    };

private:
    struct Event {
        std::string uid;
        std::string title;
        std::string location;
        std::string rrule;
        std::string status;
        DateTime start;
        DateTime end;
        int64_t duration_seconds = -1;
        bool has_end = false;
        std::vector<int64_t> exdates;
        bool has_recurrence_id = false;
        int64_t recurrence_id = 0;
    };

    void ProcessPhysicalLine(std::string line);
    void ProcessLine(const std::string& line);
    void FinishEvent();
    void AddOccurrence(const Event& event, int64_t start, int64_t length, bool master);
    void Expand(const Event& event, int64_t length);

    int64_t window_start_;
    int64_t window_end_;
    size_t max_occurrences_;
    std::string partial_;   // physical line being received
    std::string pending_;   // logical line waiting for possible continuation lines
    bool in_event_ = false;
    int nested_ = 0;        // VALARM etc. inside an event
    bool saw_calendar_ = false;
    size_t event_count_ = 0;
    std::string calendar_name_;
    Event event_;

    struct Pending {
        Occurrence occurrence;
        std::string uid;
        bool master = false;  // came from a recurring event's rule (may be overridden)
    };
    std::vector<Pending> results_;
    std::set<std::pair<std::string, int64_t>> overridden_;  // (uid, original start)
};

// Helpers, exposed for tests.
int64_t DaysFromCivil(int year, int month, int day);
void CivilFromDays(int64_t days, int* year, int* month, int* day);
int64_t ToEpoch(const Parser::DateTime& value);  // local via mktime, UTC via civil arithmetic
Parser::DateTime ParseDateTime(const std::string& value, bool date_param);
std::string Unescape(const std::string& value);

}  // namespace ics

#endif  // CALENDAR_SERVICE_ICS_CALENDAR_H_
