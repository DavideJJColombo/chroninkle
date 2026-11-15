#include "epaper_ui/lock_screen.h"

#include "i18n.h"

#include <algorithm>
#include <string>
#include <string_view>
#include <vector>

#include "design_tokens.h"
#include "epaper_ui/checkbox.h"
#include "epaper_ui/font_renderer.h"
#include "project_assets.h"
#include "render_utils.h"

namespace epaper_ui {
namespace {

// Must match lock_screen_runtime.cpp's kMaxPendingTodoTitles -- that's the cap on how
// many titles the caller ever populates in pending_todo_titles, this is the cap on how
// many of them get drawn. Kept as two separate constants (epaper_ui can't depend on
// main) rather than one shared source of truth; if it drifts, DrawLockScreen would just
// never draw a row for a title that's actually present in the passed-in state.
constexpr size_t kMaxDisplayedTodoRows = 5;

template <typename DrawFn>
void DrawOutlined(DrawFn&& draw_fn, int stroke_thickness)
{
    const int thickness = std::max(0, stroke_thickness);
    for (int dy = -thickness; dy <= thickness; ++dy) {
        for (int dx = -thickness; dx <= thickness; ++dx) {
            if (dx == 0 && dy == 0) {
                continue;
            }
            draw_fn(dx, dy, design::color::kWhite);
        }
    }
    draw_fn(0, 0, design::color::kBlack);
}

void DrawOutlinedText(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height,
                      int x,
                      int y,
                      std::string_view text,
                      design::TypographyRole role,
                      int stroke_thickness)
{
    DrawOutlined(
        [&](int dx, int dy, uint8_t tone) {
            DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                               x + dx, y + dy, text, role, tone);
        },
        stroke_thickness);
}

void DrawOutlinedAsset(uint8_t* framebuffer,
                       int raw_width,
                       int raw_height,
                       int portrait_width,
                       int portrait_height,
                       int x,
                       int y,
                       const EmbeddedImageAsset* asset,
                       int stroke_thickness)
{
    if (asset == nullptr) {
        return;
    }

    DrawOutlined(
        [&](int dx, int dy, uint8_t tone) {
            DrawPortraitMonoAsset(framebuffer,
                                  raw_width,
                                  raw_height,
                                  portrait_width,
                                  portrait_height,
                                  x + dx,
                                  y + dy,
                                  asset,
                                  tone);
        },
        stroke_thickness);
}

const EmbeddedImageAsset* ResolveBatteryIcon(const BatteryStatus& battery)
{
    if (battery.charging) {
        return project_assets::GetIcon(EmbeddedIconId::kBattery6);
    }
    if (battery.percent < 0 || battery.percent <= 10) {
        return project_assets::GetIcon(EmbeddedIconId::kBattery1);
    }
    if (battery.percent <= 30) {
        return project_assets::GetIcon(EmbeddedIconId::kBattery2);
    }
    if (battery.percent <= 50) {
        return project_assets::GetIcon(EmbeddedIconId::kBattery3);
    }
    if (battery.percent <= 75) {
        return project_assets::GetIcon(EmbeddedIconId::kBattery4);
    }
    return project_assets::GetIcon(EmbeddedIconId::kBattery5);
}

const EmbeddedImageAsset* ResolveWifiIcon(WifiStatus status)
{
    switch (status) {
        case WifiStatus::kDisconnected:
            return project_assets::GetIcon(EmbeddedIconId::kWifi3);
        case WifiStatus::kConnected:
            return project_assets::GetIcon(EmbeddedIconId::kWifi2);
        case WifiStatus::kAccessPoint:
            return project_assets::GetIcon(EmbeddedIconId::kWifi4);
        case WifiStatus::kDisabled:
        default:
            return project_assets::GetIcon(EmbeddedIconId::kWifi1);
    }
}

const EmbeddedImageAsset* ResolveGeminiIcon(bool visible)
{
    if (!visible) {
        return nullptr;
    }
    return project_assets::GetIcon(EmbeddedIconId::kStar);
}

int CenterY(int container_top, int container_height, int item_height)
{
    return container_top + std::max(0, (container_height - item_height) / 2);
}

void DrawIconSlot(uint8_t* framebuffer,
                  int raw_width,
                  int raw_height,
                  int portrait_width,
                  int portrait_height,
                  int slot_x,
                  int top,
                  int box_size,
                  const EmbeddedImageAsset* asset,
                  int stroke_thickness)
{
    if (asset == nullptr) {
        return;
    }

    const int draw_x = slot_x + std::max(0, (box_size - static_cast<int>(asset->width)) / 2);
    const int draw_y = top + std::max(0, (box_size - static_cast<int>(asset->height)) / 2);
    DrawOutlinedAsset(framebuffer,
                      raw_width,
                      raw_height,
                      portrait_width,
                      portrait_height,
                      draw_x,
                      draw_y,
                      asset,
                      stroke_thickness);
}

void DrawLockScreenStatusRow(uint8_t* framebuffer,
                             int raw_width,
                             int raw_height,
                             int portrait_width,
                             int portrait_height,
                             const StatusBarState& state)
{
    const int bar_height = design::status_bar::kHeight;
    const int content_right = portrait_width - design::status_bar::kSidePadding;
    const int icon_box = design::status_bar::kPreferredIconSize;
    const int icon_top = CenterY(0, bar_height, icon_box);
    const auto label_role = design::TypographyRole::kStatusBarLabel;
    const int text_height = LineHeight(label_role);
    const int text_y = CenterY(0, bar_height, text_height);
    const int stroke_thickness = design::status_bar::kStrokeThickness;

    std::string battery_text;
    if (state.battery.percent >= 0) {
        battery_text = std::to_string(std::clamp(state.battery.percent, 0, 100)) + "%";
    }
    const int battery_text_width = MeasureText(label_role, battery_text);

    const EmbeddedImageAsset* battery_icon = ResolveBatteryIcon(state.battery);
    const EmbeddedImageAsset* wifi_icon = ResolveWifiIcon(state.wifi);
    const EmbeddedImageAsset* gemini_icon = ResolveGeminiIcon(state.show_gemini_icon);
    const EmbeddedImageAsset* sleep_icon =
        state.show_sleep_icon ? project_assets::GetIcon(EmbeddedIconId::kSleep) : nullptr;
    const EmbeddedImageAsset* power_icon =
        state.show_power_icon ? project_assets::GetIcon(EmbeddedIconId::kPower) : nullptr;

    int cursor_right = content_right;
    if (battery_text_width > 0) {
        cursor_right -= battery_text_width;
        DrawOutlinedText(framebuffer,
                         raw_width,
                         raw_height,
                         portrait_width,
                         portrait_height,
                         cursor_right,
                         text_y,
                         battery_text,
                         label_role,
                         stroke_thickness);
    }

    cursor_right -= design::status_bar::kItemGap + icon_box;
    DrawIconSlot(framebuffer,
                 raw_width,
                 raw_height,
                 portrait_width,
                 portrait_height,
                 cursor_right,
                 icon_top,
                 icon_box,
                 battery_icon,
                 stroke_thickness);

    cursor_right -= design::status_bar::kItemGap + icon_box;
    DrawIconSlot(framebuffer,
                 raw_width,
                 raw_height,
                 portrait_width,
                 portrait_height,
                 cursor_right,
                 icon_top,
                 icon_box,
                 wifi_icon,
                 stroke_thickness);

    if (state.show_gemini_icon) {
        cursor_right -= design::status_bar::kItemGap + icon_box;
        DrawIconSlot(framebuffer,
                     raw_width,
                     raw_height,
                     portrait_width,
                     portrait_height,
                     cursor_right,
                     icon_top,
                     icon_box,
                     gemini_icon,
                     stroke_thickness);
    }

    if (state.show_sleep_icon) {
        cursor_right -= design::status_bar::kItemGap + icon_box;
        DrawIconSlot(framebuffer,
                     raw_width,
                     raw_height,
                     portrait_width,
                     portrait_height,
                     cursor_right,
                     icon_top,
                     icon_box,
                     sleep_icon,
                     stroke_thickness);
    }

    if (state.show_power_icon) {
        cursor_right -= design::status_bar::kItemGap + icon_box;
        DrawIconSlot(framebuffer,
                     raw_width,
                     raw_height,
                     portrait_width,
                     portrait_height,
                     cursor_right,
                     icon_top,
                     icon_box,
                     power_icon,
                     stroke_thickness);
    }
}

std::string_view SafeText(const std::string& text, std::string_view fallback)
{
    return text.empty() ? fallback : std::string_view(text);
}

std::string BuildDateLine(std::string_view weekday, std::string_view date)
{
    if (weekday.empty()) {
        return std::string(date);
    }
    if (date.empty()) {
        return std::string(weekday);
    }
    return std::string(weekday) + ", " + std::string(date);
}

// Word-wraps `text` to `max_width` at the body role, capped to
// design::lock_screen::kMaxWrapLinesPerTodo lines -- the last one ellipsis-fitted from
// whatever text didn't make the earlier lines, rather than just cutting off wherever the
// word-wrap happened to land.
std::vector<std::string> WrapAndCapTodoText(const std::string& text, int max_width)
{
    const auto role = design::TypographyRole::kBody;
    std::vector<std::string> lines = WrapTextToWidth(role, text, max_width);
    const size_t max_lines = static_cast<size_t>(design::lock_screen::kMaxWrapLinesPerTodo);
    if (lines.size() <= max_lines || max_lines == 0) {
        return lines;
    }

    std::string tail = lines[max_lines - 1];
    for (size_t i = max_lines; i < lines.size(); ++i) {
        tail += " " + lines[i];
    }
    lines.resize(max_lines);
    lines[max_lines - 1] = FitLabelText(role, tail, max_width);
    return lines;
}

// Draws one checkbox + wrapped-text todo row at (x, y) within `content_width`. Returns the
// row's total drawn height so the caller can advance its layout cursor.
int DrawTodoRow(uint8_t* framebuffer,
                int raw_width,
                int raw_height,
                int portrait_width,
                int portrait_height,
                int x,
                int y,
                int content_width,
                const std::string& text)
{
    const int checkbox_size = design::lock_screen::kCheckboxSize;
    const int text_x = x + checkbox_size + design::lock_screen::kCheckboxTextGap;
    const int text_max_width =
        std::max(0, content_width - checkbox_size - design::lock_screen::kCheckboxTextGap);
    const std::vector<std::string> lines = WrapAndCapTodoText(text, text_max_width);

    const CheckboxState checkbox_state = {.checked = false, .selected = false};
    CheckboxStyle checkbox_style = {};
    checkbox_style.size = checkbox_size;
    DrawCheckbox(framebuffer, raw_width, raw_height, portrait_width, portrait_height, x, y,
                checkbox_state, checkbox_style);

    const auto role = design::TypographyRole::kBody;
    const int line_height = LineHeight(role);
    int line_y = y;
    for (const std::string& line : lines) {
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           text_x, line_y, line, role, design::color::kBlack);
        line_y += line_height + design::lock_screen::kWrapLineGap;
    }

    const int text_height =
        lines.empty() ? 0
                     : (static_cast<int>(lines.size()) * line_height) +
                           ((static_cast<int>(lines.size()) - 1) * design::lock_screen::kWrapLineGap);
    return std::max(checkbox_size, text_height);
}


// --- Agenda section ---------------------------------------------------------------------

constexpr size_t kMaxDisplayedEventRows = 6;
constexpr auto kEventWhenRole = design::TypographyRole::kLabelMediumBold;
constexpr auto kEventTitleRole = design::TypographyRole::kBody;
constexpr auto kSectionHeadingRole = design::TypographyRole::kLabelMediumBold;
constexpr auto kMoreRole = design::TypographyRole::kLabelSmall;

int EventRowHeight()
{
    return std::max(LineHeight(kEventWhenRole), LineHeight(kEventTitleRole));
}

constexpr auto kDayLabelRole = design::TypographyRole::kLabelSmallBold;

bool StartsDayGroup(const LockScreenState& state, int index)
{
    const std::string& label = state.agenda_events[static_cast<size_t>(index)].day_label;
    if (label.empty()) {
        return false;
    }
    return index == 0 || state.agenda_events[static_cast<size_t>(index - 1)].day_label != label;
}

int DayLabelHeight()
{
    return LineHeight(kDayLabelRole) + design::lock_screen::kWrapLineGap;
}

// Height of the first `rows` event rows, day labels included.
int EventRowsHeight(const LockScreenState& state, int rows)
{
    int h = 0;
    for (int i = 0; i < rows; ++i) {
        if (StartsDayGroup(state, i)) {
            h += DayLabelHeight() + (i > 0 ? design::lock_screen::kWrapLineGap * 2 : 0);
        }
        h += EventRowHeight() + (i > 0 ? design::lock_screen::kWrapLineGap * 2 : 0);
    }
    return h;
}

int TodoRowHeight(const std::string& text, int content_width)
{
    const int text_max_width = std::max(
        0, content_width - design::lock_screen::kCheckboxSize - design::lock_screen::kCheckboxTextGap);
    const std::vector<std::string> lines = WrapAndCapTodoText(text, text_max_width);
    const int line_height = LineHeight(design::TypographyRole::kBody);
    const int text_height =
        lines.empty() ? 0
                      : static_cast<int>(lines.size()) * line_height +
                            (static_cast<int>(lines.size()) - 1) * design::lock_screen::kWrapLineGap;
    return std::max(design::lock_screen::kCheckboxSize, text_height);
}

struct SectionPlan {
    int events = 0;  // agenda rows drawn (0 = no agenda section)
    int todos = 0;   // todo rows drawn
};

// Shares the height between the agenda and the todo list. Both sections start with their most
// important row (the nearest event always shows); then each further row goes to the section
// with more still hidden -- the busier one grows, the quieter one shrinks -- as long as it fits,
// "+N more" lines included.
SectionPlan PlanSections(const LockScreenState& state, int content_width, int available)
{
    const int heading = LineHeight(kSectionHeadingRole) + design::lock_screen::kHeadingRowGap;
    const int more_line = design::lock_screen::kRowGap + LineHeight(kMoreRole);
    const int event_count = static_cast<int>(
        std::min(state.agenda_events.size(), kMaxDisplayedEventRows));
    const int todo_total = std::max(0, state.pending_todo_count);
    const int todo_available = static_cast<int>(
        std::min(state.pending_todo_titles.size(), kMaxDisplayedTodoRows));

    std::vector<int> todo_heights;
    for (int i = 0; i < todo_available; ++i) {
        todo_heights.push_back(TodoRowHeight(state.pending_todo_titles[static_cast<size_t>(i)],
                                             content_width));
    }
    const int agenda_hidden_total = std::max(state.agenda_today_count, event_count);

    auto height_of = [&](int events, int todos) {
        int h = 0;
        if (events > 0) {
            h += heading + EventRowsHeight(state, events);
            if (agenda_hidden_total > events) {
                h += more_line;
            }
            h += design::lock_screen::kSectionGap;
        }
        h += heading;
        if (todo_total == 0) {
            h += std::max(LineHeight(design::TypographyRole::kBody), design::lock_screen::kCheckboxSize);
        } else {
            for (int i = 0; i < todos; ++i) {
                h += todo_heights[static_cast<size_t>(i)] + (i > 0 ? design::lock_screen::kRowGap : 0);
            }
            if (todo_total > todos) {
                h += more_line;
            }
        }
        return h;
    };

    SectionPlan plan;
    plan.events = event_count > 0 ? 1 : 0;
    plan.todos = todo_available > 0 ? 1 : 0;
    if (height_of(plan.events, plan.todos) > available && plan.todos > 0) {
        plan.todos = 0;  // tiny space: the nearest event wins over the first todo
    }
    while (true) {
        const int events_hidden = event_count - plan.events;
        const int todos_hidden = todo_available - plan.todos;
        const bool can_event =
            events_hidden > 0 && height_of(plan.events + 1, plan.todos) <= available;
        const bool can_todo =
            todos_hidden > 0 && height_of(plan.events, plan.todos + 1) <= available;
        if (!can_event && !can_todo) {
            break;
        }
        // Busier section first; on a tie, an event happening soon beats a todo.
        if (can_event && (!can_todo || events_hidden >= todo_total - plan.todos)) {
            ++plan.events;
        } else {
            ++plan.todos;
        }
    }
    return plan;
}

// Heading, `rows` event rows ("15:00  Dentist"), and "+N more today" when some didn't fit.
// Returns the y below the section.
int DrawAgendaSection(uint8_t* framebuffer,
                      int raw_width,
                      int raw_height,
                      int portrait_width,
                      int portrait_height,
                      int x,
                      int y,
                      int content_width,
                      const LockScreenState& state,
                      int rows)
{
    std::string heading = i18n::Tr("AGENDA", "AGENDA");
    if (state.agenda_today_count > 0) {
        heading += " - " + std::to_string(state.agenda_today_count) + i18n::Tr(" TODAY", " OGGI");
    }
    DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height, x, y,
                       heading, kSectionHeadingRole, design::color::kBlack);
    y += LineHeight(kSectionHeadingRole) + design::lock_screen::kHeadingRowGap;

    // The time column is as wide as the widest label shown, so the titles line up.
    int when_width = 0;
    for (int i = 0; i < rows; ++i) {
        when_width = std::max(when_width, MeasureText(kEventWhenRole,
                                                      state.agenda_events[static_cast<size_t>(i)].when_text));
    }
    const int timed_title_x = x + when_width + design::lock_screen::kCheckboxTextGap;
    const int row_height = EventRowHeight();
    for (int i = 0; i < rows; ++i) {
        const LockScreenEvent& event = state.agenda_events[static_cast<size_t>(i)];
        if (StartsDayGroup(state, i)) {
            if (i > 0) {
                y += design::lock_screen::kWrapLineGap * 2;
            }
            DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width,
                               portrait_height, x, y, event.day_label, kDayLabelRole,
                               design::color::kBlack);
            y += DayLabelHeight();
        }
        if (event.happening_now) {
            // Emphasized: the label in a solid black pill.
            const int pill_width = MeasureText(kEventWhenRole, event.when_text) + 8;
            FillPortraitRect(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                             {x - 4, y - 1, pill_width, row_height + 2}, design::color::kBlack);
            DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                               x, y, event.when_text, kEventWhenRole, design::color::kWhite);
        } else {
            DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                               x, y, event.when_text, kEventWhenRole, design::color::kBlack);
        }
        // All-day events have no time: their title starts at the left edge.
        const int title_x = event.when_text.empty() ? x : timed_title_x;
        const int title_width = std::max(0, x + content_width - title_x);
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height,
                           title_x, y + (row_height - LineHeight(kEventTitleRole)) / 2,
                           FitLabelText(kEventTitleRole, event.title_text, title_width),
                           kEventTitleRole, design::color::kBlack);
        y += row_height;
        if (i + 1 < rows) {
            y += design::lock_screen::kWrapLineGap * 2;
        }
    }
    const int hidden_today = state.agenda_today_count - rows;
    const int hidden_listed = static_cast<int>(state.agenda_events.size()) - rows;
    const int hidden = std::max(hidden_today, hidden_listed);
    if (hidden > 0) {
        y += design::lock_screen::kRowGap;
        const bool one = hidden == 1;
        const char* suffix =
            hidden_today > 0
                ? (one ? i18n::Tr(" more today", " altro oggi") : i18n::Tr(" more today", " altri oggi"))
                : (one ? i18n::Tr(" more", " altro") : i18n::Tr(" more", " altri"));
        const std::string more = "+" + std::to_string(hidden) + suffix;
        DrawTypographyText(framebuffer, raw_width, raw_height, portrait_width, portrait_height, x,
                           y, more, kMoreRole, design::color::kGray2);
        y += LineHeight(kMoreRole);
    }
    return y;
}

}  // namespace

void DrawLockScreen(uint8_t* framebuffer,
                    int raw_width,
                    int raw_height,
                    int portrait_width,
                    int portrait_height,
                    const LockScreenState& state,
                    const StatusBarState& status_state)
{
    if (framebuffer == nullptr) {
        return;
    }

    DrawLockScreenStatusRow(framebuffer,
                            raw_width,
                            raw_height,
                            portrait_width,
                            portrait_height,
                            status_state);

    const int content_left = design::lock_screen::kSidePadding;
    const int content_width =
        std::max(0, portrait_width - (2 * design::lock_screen::kSidePadding));
    int cursor_y = design::lock_screen::kContentTop;

    const std::string date_line =
        BuildDateLine(SafeText(state.weekday_text, ""), SafeText(state.date_text, ""));
    if (!date_line.empty()) {
        const auto date_role = design::TypographyRole::kLabelMediumBlack;
        const int date_width = MeasureText(date_role, date_line);
        DrawTypographyText(framebuffer,
                           raw_width,
                           raw_height,
                           portrait_width,
                           portrait_height,
                           content_left + std::max(0, (content_width - date_width) / 2),
                           cursor_y,
                           date_line,
                           date_role,
                           design::color::kBlack);
        cursor_y += LineHeight(date_role);
    }
    cursor_y += design::lock_screen::kDateDividerGap;

    FillPortraitRect(framebuffer,
                     raw_width,
                     raw_height,
                     portrait_width,
                     portrait_height,
                     {content_left, cursor_y, content_width, design::lock_screen::kDividerHeight},
                     design::color::kGray3);
    cursor_y += design::lock_screen::kDividerHeight + design::lock_screen::kDividerSectionGap;

    // The rest of the screen, down to the lock icon, is shared between the agenda and the
    // todos (see PlanSections).
    const int area_bottom = portrait_height - design::lock_screen::kLockIconBottomMargin -
                            design::lock_screen::kLockIconSize - design::lock_screen::kRowGap;
    const SectionPlan plan =
        PlanSections(state, content_width, std::max(0, area_bottom - cursor_y));

    if (plan.events > 0) {
        cursor_y = DrawAgendaSection(framebuffer, raw_width, raw_height, portrait_width,
                                     portrait_height, content_left, cursor_y, content_width,
                                     state, plan.events);
        cursor_y += design::lock_screen::kSectionGap;
    }

    const int pending_count = std::max(0, state.pending_todo_count);
    std::string heading = i18n::Tr("TO-DO", "DA FARE");
    if (pending_count > 0) {
        heading += " - " + std::to_string(pending_count) + i18n::Tr(" PENDING", " IN SOSPESO");
    }
    const auto heading_role = design::TypographyRole::kLabelMediumBold;
    DrawTypographyText(framebuffer,
                       raw_width,
                       raw_height,
                       portrait_width,
                       portrait_height,
                       content_left,
                       cursor_y,
                       heading,
                       heading_role,
                       design::color::kBlack);
    cursor_y += LineHeight(heading_role) + design::lock_screen::kHeadingRowGap;

    if (pending_count == 0) {
        const EmbeddedImageAsset* check_icon = project_assets::GetIcon(EmbeddedIconId::kCheck);
        const auto body_role = design::TypographyRole::kBody;
        const std::string message = i18n::Tr("All caught up", "Tutto fatto");
        int text_x = content_left;
        int text_y = cursor_y;
        if (check_icon != nullptr) {
            DrawPortraitMonoAsset(framebuffer,
                                  raw_width,
                                  raw_height,
                                  portrait_width,
                                  portrait_height,
                                  content_left,
                                  cursor_y,
                                  check_icon,
                                  design::color::kBlack);
            text_x = content_left + static_cast<int>(check_icon->width) +
                    design::lock_screen::kCheckboxTextGap;
            text_y = cursor_y +
                    std::max(0, (static_cast<int>(check_icon->height) - LineHeight(body_role)) / 2);
        }
        DrawTypographyText(framebuffer,
                           raw_width,
                           raw_height,
                           portrait_width,
                           portrait_height,
                           text_x,
                           text_y,
                           message,
                           body_role,
                           design::color::kBlack);
    } else {
        const size_t row_count = static_cast<size_t>(plan.todos);
        for (size_t i = 0; i < row_count; ++i) {
            const int row_height = DrawTodoRow(framebuffer,
                                               raw_width,
                                               raw_height,
                                               portrait_width,
                                               portrait_height,
                                               content_left,
                                               cursor_y,
                                               content_width,
                                               state.pending_todo_titles[i]);
            cursor_y += row_height;
            if (i + 1 < row_count) {
                cursor_y += design::lock_screen::kRowGap;
            }
        }

        if (pending_count > static_cast<int>(row_count)) {
            cursor_y += design::lock_screen::kRowGap;
            const int more_count = pending_count - static_cast<int>(row_count);
            const std::string more_text =
                "+" + std::to_string(more_count) + i18n::Tr(" more pending", " altre in sospeso");
            DrawTypographyText(framebuffer,
                               raw_width,
                               raw_height,
                               portrait_width,
                               portrait_height,
                               content_left,
                               cursor_y,
                               more_text,
                               design::TypographyRole::kLabelSmall,
                               design::color::kGray2);
        }
    }

    const EmbeddedImageAsset* bottom_icon = project_assets::GetIcon(
        state.for_shutdown ? EmbeddedIconId::kPower : EmbeddedIconId::kLock);
    if (bottom_icon != nullptr) {
        const int icon_size = design::lock_screen::kLockIconSize;
        const UiRect dest = {
            content_left + std::max(0, (content_width - icon_size) / 2),
            portrait_height - design::lock_screen::kLockIconBottomMargin - icon_size,
            icon_size,
            icon_size,
        };
        DrawScaledPortraitMonoAsset(framebuffer,
                                    raw_width,
                                    raw_height,
                                    portrait_width,
                                    portrait_height,
                                    dest,
                                    bottom_icon,
                                    design::color::kBlack);
    }
}

}  // namespace epaper_ui
