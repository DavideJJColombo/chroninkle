#ifndef EPAPER_UI_SETTINGS_PAGE_H_
#define EPAPER_UI_SETTINGS_PAGE_H_

#include <cstdint>
#include <string>
#include <string_view>

#include "epaper_ui/button.h"
#include "epaper_ui/global_footer.h"
#include "epaper_ui/menu_container.h"
#include "epaper_ui/menu_item.h"
#include "epaper_ui/status_bar.h"

namespace epaper_ui {

// Settings is a hub: 9 headings in this fixed slot order (must match SettingsMenuItemLabel in
// settings_page.cpp). Each navigates to a dedicated sub-page, except Language, Sorting
// (automatic classification of recordings) and Volume, which change in place and show their
// current value.
inline constexpr int kSettingsMenuItemCount = 9;

enum class SettingsMenuItem : int {
    kNetwork = 0,
    kTime,
    kLanguage,
    kAutoClassify,
    kVolume,
    kStorage,
    kTodos,
    kTopics,
    kAbout,
};

struct SettingsPageMenuState {
    int selected_index = -1;

    bool operator==(const SettingsPageMenuState& other) const = default;
};

struct SettingsPageState {
    int navigation_focus_index = -1;
    std::string_view title_text = {};
    // Part of the state (not just looked up at draw time) so a language switch is seen as a
    // state change and the page repaints.
    int language = 0;
    bool auto_classify = true;
    int volume_level = 5;  // 0 = muted
    SettingsPageMenuState menu = {};
    // Replays the onboarding carousel -- a one-shot action, not a heading, so it sits below the
    // menu rather than being one of the 4 headings above.
    ButtonState manual_button = {};

    bool operator==(const SettingsPageState& other) const = default;
};

std::string SettingsMenuItemLabel(int index, const SettingsPageState& state);
UiRect SettingsMenuItemBounds(int portrait_width,
                              int portrait_height,
                              const SettingsPageState& state,
                              int index);
bool HitTestSettingsMenuItem(int portrait_width,
                             int portrait_height,
                             const SettingsPageState& state,
                             int x,
                             int y,
                             int* index);
UiRect SettingsManualButtonBounds(int portrait_width,
                                  int portrait_height,
                                  const SettingsPageState& state);
bool HitTestSettingsManualButton(int portrait_width,
                                 int portrait_height,
                                 const SettingsPageState& state,
                                 int x,
                                 int y);
void DrawSettingsPage(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height,
                      const SettingsPageState& state,
                      const StatusBarState& status_bar_state,
                      const GlobalFooterState& footer_state);

}  // namespace epaper_ui

#endif  // EPAPER_UI_SETTINGS_PAGE_H_
