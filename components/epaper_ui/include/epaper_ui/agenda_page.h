#ifndef EPAPER_UI_AGENDA_PAGE_H_
#define EPAPER_UI_AGENDA_PAGE_H_

#include <cstdint>

#include "i18n.h"
#include <string>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/overlay_geometry.h"
#include "epaper_ui/scroll_container.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

// Agenda: the next days of Google Calendar events (calendar_service), as a scrollable text
// list grouped by day, with Back and Refresh buttons.
struct AgendaPageState {
    int navigation_focus_index = -1;
    std::string title_text = i18n::Tr("Agenda", "Agenda");
    // e.g. "Updated 14:05" / "Updating..." / "Not connected".
    std::string subtitle_text = {};
    ScrollContainerState scroll_container = {};
    ButtonState back_button = {};
    ButtonState refresh_button = {};

    bool operator==(const AgendaPageState& other) const = default;
};

void DrawAgendaPage(uint8_t* framebuffer,
                          int raw_width,
                          int raw_height,
                          int portrait_width,
                          int portrait_height,
                          const AgendaPageState& state,
                          const StatusBarState& status_bar_state,
                          const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_AGENDA_PAGE_H_
