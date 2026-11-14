// Host test for components/calendar_service/ics_calendar.*: single, all-day, UTC and TZID events,
// line folding, chunked input, weekly/monthly/yearly/daily rules with COUNT/UNTIL/EXDATE,
// moved and cancelled instances, and the window filter. Runs in Italy's time zone.
#include <cstdio>
#include <cstdlib>
#include <ctime>
#include <string>

#include "ics_calendar.h"

static int g_failures = 0;
#define CHECK(cond)                                                                   \
    do {                                                                              \
        if (!(cond)) {                                                                \
            std::printf("FAIL %s:%d: %s\n", __FILE__, __LINE__, #cond);               \
            ++g_failures;                                                             \
        }                                                                             \
    } while (0)

static int64_t Local(int y, int mo, int d, int h = 0, int mi = 0)
{
    ics::Parser::DateTime value;
    value.year = y;
    value.month = mo;
    value.day = d;
    value.hour = h;
    value.minute = mi;
    value.valid = true;
    return ics::ToEpoch(value);
}

static std::vector<ics::Occurrence> Parse(const std::string& body, int64_t from, int64_t to,
                                          size_t chunk = 7)
{
    ics::Parser parser(from, to);
    for (size_t i = 0; i < body.size(); i += chunk) {
        parser.Feed(body.data() + i, std::min(chunk, body.size() - i));
    }
    parser.Finish();
    CHECK(parser.saw_calendar());
    return parser.TakeResults();
}

static std::string Calendar(const std::string& events)
{
    return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nX-WR-CALNAME:Personale\r\n" + events +
           "END:VCALENDAR\r\n";
}

int main()
{
    setenv("TZ", "CET-1CEST,M3.5.0,M10.5.0/3", 1);
    tzset();

    const int64_t from = Local(2026, 11, 14);
    const int64_t to = Local(2026, 11, 28);

    // Single timed event with a TZID, a folded summary and escaped characters.
    {
        const auto r = Parse(Calendar("BEGIN:VEVENT\r\nUID:a\r\n"
                                      "DTSTART;TZID=Europe/Rome:20261114T150000\r\n"
                                      "DTEND;TZID=Europe/Rome:20261114T160000\r\n"
                                      "SUMMARY:Dentista\\, controllo \r\n annuale\r\n"
                                      "LOCATION:Via Roma 1\\, Milano\r\n"
                                      "BEGIN:VALARM\r\nSUMMARY:ignored\r\nEND:VALARM\r\n"
                                      "END:VEVENT\r\n"),
                             from, to);
        CHECK(r.size() == 1);
        CHECK(r[0].title == "Dentista, controllo annuale");
        CHECK(r[0].location == "Via Roma 1, Milano");
        CHECK(r[0].start == Local(2026, 11, 14, 15, 0));
        CHECK(r[0].end == Local(2026, 11, 14, 16, 0));
        CHECK(!r[0].all_day);
    }

    // UTC time and an all-day event; events outside the window are dropped.
    {
        const auto r = Parse(Calendar("BEGIN:VEVENT\r\nUID:b\r\nDTSTART:20261116T080000Z\r\n"
                                      "DTEND:20261116T090000Z\r\nSUMMARY:Call\r\nEND:VEVENT\r\n"
                                      "BEGIN:VEVENT\r\nUID:c\r\nDTSTART;VALUE=DATE:20261120\r\n"
                                      "DTEND;VALUE=DATE:20261121\r\nSUMMARY:Ferie\r\nEND:VEVENT\r\n"
                                      "BEGIN:VEVENT\r\nUID:d\r\nDTSTART:20251116T080000Z\r\n"
                                      "SUMMARY:Old\r\nEND:VEVENT\r\n"),
                             from, to);
        CHECK(r.size() == 2);
        CHECK(r[0].title == "Call");
        CHECK(r[0].start == Local(2026, 11, 16, 9, 0));  // 08:00Z = 09:00 in Italy (CET)
        CHECK(r[1].title == "Ferie");
        CHECK(r[1].all_day);
        CHECK(r[1].start == Local(2026, 11, 20));
        CHECK(r[1].end == Local(2026, 11, 21));
    }

    // Weekly meeting started years ago on Monday and Wednesday, with one date excluded, one
    // instance moved and one cancelled.
    {
        const auto r = Parse(
            Calendar("BEGIN:VEVENT\r\nUID:w\r\nDTSTART;TZID=Europe/Rome:20230102T100000\r\n"
                     "DTEND;TZID=Europe/Rome:20230102T103000\r\n"
                     "RRULE:FREQ=WEEKLY;BYDAY=MO,WE\r\n"
                     "EXDATE;TZID=Europe/Rome:20261118T100000\r\n"
                     "SUMMARY:Riunione\r\nEND:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:w\r\nRECURRENCE-ID;TZID=Europe/Rome:20261116T100000\r\n"
                     "DTSTART;TZID=Europe/Rome:20261116T113000\r\n"
                     "DTEND;TZID=Europe/Rome:20261116T120000\r\nSUMMARY:Riunione (spostata)\r\n"
                     "END:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:w\r\nRECURRENCE-ID;TZID=Europe/Rome:20261123T100000\r\n"
                     "DTSTART;TZID=Europe/Rome:20261123T100000\r\nSTATUS:CANCELLED\r\n"
                     "SUMMARY:Riunione\r\nEND:VEVENT\r\n"),
            from, to);
        // Window 14-27 Nov: Mondays 16 (moved), 23 (cancelled); Wednesdays 18 (excluded), 25.
        CHECK(r.size() == 2);
        if (r.size() == 2) {
            CHECK(r[0].title == "Riunione (spostata)");
            CHECK(r[0].start == Local(2026, 11, 16, 11, 30));
            CHECK(r[1].title == "Riunione");
            CHECK(r[1].start == Local(2026, 11, 25, 10, 0));
        }
    }

    // Yearly birthday (all-day), monthly "last Friday", daily with COUNT, weekly with UNTIL.
    {
        const auto r = Parse(
            Calendar("BEGIN:VEVENT\r\nUID:y\r\nDTSTART;VALUE=DATE:19900115\r\n"
                     "RRULE:FREQ=YEARLY\r\nSUMMARY:Never\r\nEND:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:y2\r\nDTSTART;VALUE=DATE:19851119\r\n"
                     "DTEND;VALUE=DATE:19851120\r\nRRULE:FREQ=YEARLY\r\n"
                     "SUMMARY:Compleanno Marco\r\nEND:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:m\r\nDTSTART;TZID=Europe/Rome:20260130T180000\r\n"
                     "DURATION:PT1H\r\nRRULE:FREQ=MONTHLY;BYDAY=-1FR\r\n"
                     "SUMMARY:Aperitivo\r\nEND:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:d\r\nDTSTART;TZID=Europe/Rome:20261113T070000\r\n"
                     "RRULE:FREQ=DAILY;COUNT=3\r\nSUMMARY:Pillola\r\nEND:VEVENT\r\n"
                     "BEGIN:VEVENT\r\nUID:u\r\nDTSTART;TZID=Europe/Rome:20261101T090000\r\n"
                     "RRULE:FREQ=WEEKLY;UNTIL=20261115T235959Z\r\nSUMMARY:Corso\r\n"
                     "END:VEVENT\r\n"),
            from, to);
        int birthday = 0, aperitivo = 0, pillola = 0, corso = 0;
        for (const auto& o : r) {
            if (o.title == "Compleanno Marco") {
                ++birthday;
                CHECK(o.all_day && o.start == Local(2026, 11, 19));
            } else if (o.title == "Aperitivo") {
                ++aperitivo;
                CHECK(o.start == Local(2026, 11, 27, 18, 0));  // last Friday of November
                CHECK(o.end - o.start == 3600);
            } else if (o.title == "Pillola") {
                ++pillola;  // 13, 14, 15 Nov: 14 and 15 are in the window
            } else if (o.title == "Corso") {
                ++corso;  // Sundays from 1 Nov until the 15th: only the 15th is in the window
                CHECK(o.start == Local(2026, 11, 15, 9, 0));
            } else {
                CHECK(o.title != "Never");
            }
        }
        CHECK(birthday == 1);
        CHECK(aperitivo == 1);
        CHECK(pillola == 2);
        CHECK(corso == 1);
    }

    // An HTML error page is not a calendar.
    {
        ics::Parser parser(from, to);
        const std::string html = "<html><body>Not found</body></html>";
        parser.Feed(html.data(), html.size());
        parser.Finish();
        CHECK(!parser.saw_calendar());
        CHECK(parser.TakeResults().empty());
    }

    if (g_failures == 0) {
        std::printf("ALL CHECKS PASSED (ics_calendar)\n");
        return 0;
    }
    std::printf("%d check(s) failed\n", g_failures);
    return 1;
}
