#include "agenda_page_coordinator.h"

#include <ctime>

#include "i18n.h"
#include "shared_page_interactions.h"

namespace {

using page_navigation::NavigationItemRole;

constexpr int kScrollStepPercent = 10;

std::tm LocalTm(int64_t epoch)
{
    const time_t t = static_cast<time_t>(epoch);
    std::tm local = {};
    localtime_r(&t, &local);
    return local;
}

// Days since the epoch in local time, to group events by calendar day.
int64_t LocalDayNumber(int64_t epoch)
{
    const std::tm local = LocalTm(epoch);
    const int y = local.tm_year + 1900;
    const int m = local.tm_mon + 1;
    return ics::DaysFromCivil(y, m, local.tm_mday);
}

std::string DayHeading(int64_t day_number, int64_t today)
{
    static const char* kWeekdaysEn[] = {"Sunday", "Monday", "Tuesday", "Wednesday",
                                        "Thursday", "Friday", "Saturday"};
    static const char* kWeekdaysIt[] = {"domenica", "lunedì", "martedì", "mercoledì",
                                        "giovedì", "venerdì", "sabato"};
    static const char* kMonthsEn[] = {"January", "February", "March", "April", "May", "June",
                                      "July", "August", "September", "October", "November",
                                      "December"};
    static const char* kMonthsIt[] = {"gennaio", "febbraio", "marzo", "aprile", "maggio",
                                      "giugno", "luglio", "agosto", "settembre", "ottobre",
                                      "novembre", "dicembre"};
    ics::Parser::DateTime noon = {};
    ics::CivilFromDays(day_number, &noon.year, &noon.month, &noon.day);
    noon.hour = 12;
    noon.valid = true;
    const std::tm local = LocalTm(ics::ToEpoch(noon));
    std::string date = i18n::IsItalian()
                           ? std::string(kWeekdaysIt[local.tm_wday]) + " " +
                                 std::to_string(local.tm_mday) + " " + kMonthsIt[local.tm_mon]
                           : std::string(kWeekdaysEn[local.tm_wday]) + ", " +
                                 kMonthsEn[local.tm_mon] + " " + std::to_string(local.tm_mday);
    if (day_number == today) {
        return std::string(i18n::Tr("TODAY", "OGGI")) + " · " + date;
    }
    if (day_number == today + 1) {
        return std::string(i18n::Tr("TOMORROW", "DOMANI")) + " · " + date;
    }
    if (i18n::IsItalian() && !date.empty()) {
        date[0] = static_cast<char>(date[0] - 'a' + 'A');  // weekday names are ASCII-initial
    }
    return date;
}

std::string TimeRange(const ics::Occurrence& event, int64_t day_number)
{
    if (event.all_day) {
        return i18n::Tr("All day", "Tutto il giorno");
    }
    const std::tm start = LocalTm(event.start);
    const std::tm end = LocalTm(event.end);
    const bool started_before = LocalDayNumber(event.start) < day_number;
    std::string text = started_before ? std::string("...") : i18n::FormatClock(start.tm_hour,
                                                                               start.tm_min);
    if (event.end > event.start) {
        const bool ends_later = LocalDayNumber(event.end - 1) > day_number;
        text += "-";
        text += ends_later ? std::string("...") : i18n::FormatClock(end.tm_hour, end.tm_min);
    }
    return text;
}

}  // namespace

std::string FormatAgendaText(const calendar_service::Snapshot& calendar, int64_t now)
{
    const int64_t today = LocalDayNumber(now);
    std::string text;
    int64_t last_day = -1;
    for (int64_t day = today; day < today + calendar_service::kAgendaDays; ++day) {
        for (const ics::Occurrence& event : calendar.events) {
            // An event shows on every day it covers (multi-day trips, all-day ranges).
            const int64_t first = LocalDayNumber(event.start);
            const int64_t last = LocalDayNumber(event.end > event.start ? event.end - 1
                                                                        : event.start);
            if (day < first || day > last) {
                continue;
            }
            if (day == today && !event.all_day && event.end > event.start && event.end <= now) {
                continue;  // already over today
            }
            if (day != last_day) {
                if (!text.empty()) {
                    text += "\n\n";
                }
                text += DayHeading(day, today);
                last_day = day;
            }
            text += "\n" + TimeRange(event, day) + "  " +
                    (event.title.empty() ? std::string(i18n::Tr("(no title)", "(senza titolo)"))
                                         : event.title);
            if (!event.location.empty()) {
                text += "\n    " + event.location;
            }
        }
    }
    return text;
}

int CountEventsLeftToday(const calendar_service::Snapshot& calendar, int64_t now)
{
    const int64_t today = LocalDayNumber(now);
    int count = 0;
    for (const ics::Occurrence& event : calendar.events) {
        const int64_t first = LocalDayNumber(event.start);
        const int64_t last =
            LocalDayNumber(event.end > event.start ? event.end - 1 : event.start);
        if (today < first || today > last) {
            continue;
        }
        if (!event.all_day && event.end > event.start && event.end <= now) {
            continue;
        }
        ++count;
    }
    return count;
}

AgendaPageCoordinator::AgendaPageCoordinator()
{
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kAgendaPageScrollContainer));
}

void AgendaPageCoordinator::Show()
{
    scroll_container_active_ = false;
    scroll_position_percent_ = 0;
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kAgendaPageScrollContainer));
}

bool AgendaPageCoordinator::MoveFocus(int delta)
{
    if (delta == 0) {
        return false;
    }
    if (scroll_container_active_) {
        const shared_page_interactions::ScrollStepResult step =
            shared_page_interactions::StepScrollPercent(scroll_position_percent_, delta,
                                                         kScrollStepPercent);
        if (!step.changed) {
            return false;
        }
        scroll_position_percent_ = step.value;
        return true;
    }
    return focus_.Move(delta);
}

bool AgendaPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool AgendaPageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

bool AgendaPageCoordinator::EnterScrollContainer()
{
    if (scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = true;
    return true;
}

bool AgendaPageCoordinator::ExitScrollContainer()
{
    if (!scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = false;
    return true;
}

epaper_ui::AgendaPageState AgendaPageCoordinator::BuildState(
    const calendar_service::Snapshot& calendar, bool wifi_connected) const
{
    epaper_ui::AgendaPageState state = {};
    state.navigation_focus_index = focus_.index();
    state.title_text = i18n::Tr("Agenda", "Agenda");

    const int64_t now = static_cast<int64_t>(time(nullptr));
    if (calendar.fetching) {
        state.subtitle_text = i18n::Tr("Updating...", "Aggiornamento...");
    } else if (calendar.last_success_epoch > 0) {
        const std::tm local = LocalTm(calendar.last_success_epoch);
        state.subtitle_text = std::string(i18n::Tr("Updated ", "Aggiornata alle ")) +
                              i18n::FormatClock(local.tm_hour, local.tm_min);
    } else if (calendar.calendar_count > 0 && !wifi_connected) {
        state.subtitle_text = i18n::Tr("Needs Wi-Fi to update", "Serve il Wi-Fi per aggiornare");
    } else if (!calendar.last_error.empty()) {
        state.subtitle_text = i18n::Tr("Couldn't update", "Aggiornamento non riuscito");
    }

    state.scroll_container.content_text =
        calendar.has_data ? FormatAgendaText(calendar, now) : std::string();
    if (calendar.calendar_count == 0) {
        state.scroll_container.empty_state_message =
            i18n::Tr("Add a Google Calendar from the setup portal",
                     "Aggiungi un calendario Google dal portale");
    } else if (!calendar.has_data) {
        state.scroll_container.empty_state_message =
            !calendar.last_error.empty()
                ? i18n::Tr("Couldn't download the calendar: check the link in the portal",
                           "Impossibile scaricare il calendario: controlla il link nel portale")
                : i18n::Tr("The agenda appears once the device is online",
                           "L'agenda compare quando il dispositivo è online");
    } else {
        state.scroll_container.empty_state_message =
            i18n::Tr("Nothing planned in the next 7 days", "Nessun impegno nei prossimi 7 giorni");
    }
    state.scroll_container.focused =
        IsRoleFocused(NavigationItemRole::kAgendaPageScrollContainer) || scroll_container_active_;
    state.scroll_container.active = scroll_container_active_;
    state.scroll_container.scroll_position_percent = scroll_position_percent_;

    state.back_button.label_text = i18n::Tr("Back", "Indietro");
    state.back_button.selected = IsRoleFocused(NavigationItemRole::kAgendaPageBackButton);
    state.refresh_button.label_text = i18n::Tr("Refresh", "Aggiorna");
    state.refresh_button.selected = IsRoleFocused(NavigationItemRole::kAgendaPageRefreshButton);
    return state;
}
