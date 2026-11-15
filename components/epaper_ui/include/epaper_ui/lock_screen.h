#ifndef EPAPER_UI_LOCK_SCREEN_H_
#define EPAPER_UI_LOCK_SCREEN_H_

#include <string>
#include <vector>

#include "epaper_ui/status_bar.h"

namespace epaper_ui {

// One calendar event row on the lock screen, already worded by the caller.
struct LockScreenEvent {
    std::string when_text = {};   // "15:00" or "Now"; empty for an all-day event
    // Day the event belongs to when it isn't today ("Tomorrow", "Tuesday 17"); a small label is
    // drawn above the first event of each such day.
    std::string day_label = {};
    std::string title_text = {};  // may carry a short suffix, e.g. "Meeting (until 16:00)"
    bool happening_now = false;   // drawn emphasized

    bool operator==(const LockScreenEvent& other) const = default;
};

struct LockScreenState {
    std::string weekday_text = {};
    std::string date_text = {};
    // The top few pending todos, already selected and prioritized (follow-up flagged ones
    // first) by the caller. Full transcript text, untruncated -- DrawLockScreen wraps and
    // caps each one to fit.
    std::vector<std::string> pending_todo_titles = {};
    // True total count of pending todos, which may be larger than pending_todo_titles.size().
    int pending_todo_count = 0;
    // Calendar events worth showing, nearest first (in progress, rest of today, tomorrow; or
    // just the next one). DrawLockScreen shares the space between these and the todos by how
    // many of each there are, always keeping at least the nearest event, and says how many
    // didn't fit. Empty = no agenda section.
    std::vector<LockScreenEvent> agenda_events = {};
    // Events left today (for the heading), may exceed what fits.
    int agenda_today_count = 0;
    // True only for the one-shot freeze frame painted immediately before a full
    // power-off (see lock_screen_runtime::ShowForShutdown): swaps the bottom lock
    // icon for a power icon at the same size/position, so the frozen screen reads
    // as "powered down" rather than "locked."
    bool for_shutdown = false;
};

void DrawLockScreen(uint8_t* framebuffer,
                    int raw_width,
                    int raw_height,
                    int portrait_width,
                    int portrait_height,
                    const LockScreenState& state,
                    const StatusBarState& status_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_LOCK_SCREEN_H_
