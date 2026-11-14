#ifndef AGENDA_PAGE_COORDINATOR_H_
#define AGENDA_PAGE_COORDINATOR_H_

#include <cstdint>
#include <string>

#include "calendar_service.h"
#include "epaper_ui/agenda_page.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"

// Owns the Agenda screen: focus roves scroll/back/refresh + footer; entering the scroll
// container captures UP/DOWN. Reached only from the Home menu, so Back returns there.
class AgendaPageCoordinator {
public:
    AgendaPageCoordinator();

    // Resets focus/scroll for a fresh page entry.
    void Show();

    bool MoveFocus(int delta);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;

    bool EnterScrollContainer();
    bool ExitScrollContainer();
    bool scroll_container_active() const { return scroll_container_active_; }

    epaper_ui::AgendaPageState BuildState(const calendar_service::Snapshot& calendar,
                                          bool wifi_connected) const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildAgendaPageNavigationModel();
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};
    bool scroll_container_active_ = false;
    int scroll_position_percent_ = 0;
};

// The agenda as text: one block per day that has events ("Today - Saturday 14 November",
// then "09:00-10:00  Title" lines, the location indented below). Exposed for the Home badge
// and tests; `now` is epoch seconds.
std::string FormatAgendaText(const calendar_service::Snapshot& calendar, int64_t now);
// Events still to come or in progress today (Home menu badge).
int CountEventsLeftToday(const calendar_service::Snapshot& calendar, int64_t now);

#endif  // AGENDA_PAGE_COORDINATOR_H_
