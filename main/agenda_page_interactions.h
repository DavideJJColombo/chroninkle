#ifndef AGENDA_PAGE_INTERACTIONS_H_
#define AGENDA_PAGE_INTERACTIONS_H_

#include <cstdint>
#include <functional>

#include "page_action_result.h"
#include "agenda_page_coordinator.h"

namespace agenda_page_interactions {

enum class ActivateIntent : uint8_t {
    kNone = 0,
    kShowHome,
    // Returns to Home -- this page's only source.
    kShowBack,
    kEnterScroll,
    kRefresh,
};

struct ActivateResult {
    ActivateIntent intent = ActivateIntent::kNone;
    bool handled = false;
    bool play_activate_cue = false;
};

using FocusMoveResult = page_actions::FocusMoveOutcome;

struct ActivateCallbacks {
    std::function<void()> show_home;
    std::function<void()> show_back;
    std::function<void()> enter_scroll;
    std::function<void()> refresh;
};

ActivateResult HandlePrimaryActivate(AgendaPageCoordinator& coordinator);
void ApplyPrimaryActivateResult(const ActivateResult& result, const ActivateCallbacks& callbacks);
FocusMoveResult HandleMoveFocus(AgendaPageCoordinator& coordinator, int delta);

}  // namespace agenda_page_interactions

#endif  // AGENDA_PAGE_INTERACTIONS_H_
