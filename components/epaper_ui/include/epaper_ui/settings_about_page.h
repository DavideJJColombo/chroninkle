#ifndef EPAPER_UI_SETTINGS_ABOUT_PAGE_H_
#define EPAPER_UI_SETTINGS_ABOUT_PAGE_H_

#include <cstdint>

#include "i18n.h"
#include <string>
#include <string_view>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

enum class SettingsAboutPageItemId : uint8_t {
    kNone = 0,
    kBack,
};

struct SettingsAboutPageState {
    int navigation_focus_index = -1;
    std::string_view title_text = i18n::Tr("About", "Informazioni");
    // e.g. "Version 0.7.0" -- built at BuildState() time from esp_app_get_description().
    std::string version_text;
    std::string_view acknowledgment_text = i18n::Tr(
        "Chroninkle began as a fork of Followup, created by ALXV Labs. Thank you to ALXV for "
        "the original design and implementation this project builds on.",
        "Chroninkle è nato come fork di Followup, creato da ALXV Labs. Grazie ad ALXV per il "
        "design e l'implementazione originali su cui si basa questo progetto.");
    ButtonState back = {};
};

UiRect SettingsAboutPageItemBounds(int portrait_width,
                                   int portrait_height,
                                   const SettingsAboutPageState& state,
                                   SettingsAboutPageItemId item);
bool HitTestSettingsAboutPageItem(int portrait_width,
                                  int portrait_height,
                                  const SettingsAboutPageState& state,
                                  int x,
                                  int y,
                                  SettingsAboutPageItemId* item);
void DrawSettingsAboutPage(uint8_t* framebuffer,
                           int raw_width,
                           int raw_height,
                           int portrait_width,
                           int portrait_height,
                           const SettingsAboutPageState& state,
                           const StatusBarState& status_bar_state,
                           const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SETTINGS_ABOUT_PAGE_H_
