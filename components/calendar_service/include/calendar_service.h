#ifndef CALENDAR_SERVICE_H_
#define CALENDAR_SERVICE_H_

// Read-only Google Calendar agenda. The user pastes each calendar's "secret address in iCal
// format" in the setup portal (up to kMaxCalendars, saved in NVS "calendar/urls"); the service
// downloads them over HTTPS on its own task when Wi-Fi connects, every 30 minutes while
// online, and on request, and keeps the events of the next days in memory (ics_calendar.h
// does the parsing). No Google account access: the private link is the only credential.

#include <cstdint>
#include <string>
#include <vector>

#include "esp_err.h"
#include "esp_http_server.h"
#include "ics_calendar.h"

namespace calendar_service {

inline constexpr int kMaxCalendars = 3;
// Days of events kept, starting from today's local midnight.
inline constexpr int kAgendaDays = 8;

struct Snapshot {
    int calendar_count = 0;          // configured links
    bool fetching = false;
    bool has_data = false;           // at least one successful download since boot
    int64_t last_success_epoch = 0;  // last download that worked (all calendars)
    std::string last_error;          // English, short; empty when the last download worked
    std::vector<std::string> calendar_names;  // X-WR-CALNAME of each calendar, when known
    std::vector<ics::Occurrence> events;      // sorted by start
};

struct Event {
    Snapshot snapshot = {};
};

using EventHandler = void (*)(const Event& event, void* context);

esp_err_t Init();
void SetEventHandler(EventHandler handler, void* context);
Snapshot GetSnapshot();

// Wi-Fi up/down; a fresh connection triggers a download (once the clock is valid).
void SetNetworkConnected(bool connected);
// Download now (e.g. the Agenda page's Refresh button). False if offline or not configured.
bool RequestRefresh();

std::vector<std::string> GetUrls();
// Replaces the saved links (empty entries are dropped); triggers a download.
esp_err_t SetUrls(const std::vector<std::string>& urls);

// GET/PATCH /api/settings/calendar, POST /api/calendar/refresh.
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace calendar_service

#endif  // CALENDAR_SERVICE_H_
