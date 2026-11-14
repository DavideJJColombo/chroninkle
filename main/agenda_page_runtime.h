#ifndef AGENDA_PAGE_RUNTIME_H_
#define AGENDA_PAGE_RUNTIME_H_

#include "app_interaction_target.h"
#include "display_service.h"
#include "esp_err.h"
#include "footer_runtime.h"
#include "page_action_result.h"
#include "calendar_service.h"
#include "agenda_page_interactions.h"

namespace agenda_page_runtime {

esp_err_t UpdateDisplayState();
esp_err_t UpdateDisplayStateAndRequestRefresh(
    display_service::RefreshMode refresh_mode = display_service::RefreshMode::kPartial);
esp_err_t UpdateDisplayStateAndRequestRefresh(
    const display_service::RefreshRequest& refresh_request);

page_actions::FocusMoveOutcome MoveFocus(int delta);
agenda_page_interactions::ActivateResult ActivateFocusedItem();

footer_runtime::ProjectionState BuildFooterProjectionState();
page_actions::FocusUpdateOutcome FocusFooterItem(footer_runtime::FooterFocusItem item);
void ResetFocus();

// Rebuilds the page from calendar_service for a fresh entry (resets focus/scroll).
esp_err_t ShowFresh();
// Adopts a calendar snapshot (download finished/started) and refreshes if the page is active.
esp_err_t OnCalendarSnapshot(const calendar_service::Snapshot& snapshot, bool request_refresh);
void SetWifiConnected(bool connected);

// Activation effects invoked from the page-input callbacks.
void EnterScroll();
void Refresh();
// Leave an entered scroll container. Returns true if it was active.
bool ExitActiveControl();

// Back navigation is deferred so it happens after input dispatch returns; app_shell polls
// ConsumePendingBack() and returns to Home.
void RequestBack();
bool ConsumePendingBack();

}  // namespace agenda_page_runtime

#endif  // AGENDA_PAGE_RUNTIME_H_
