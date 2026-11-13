#include "time_page_coordinator.h"

#include <algorithm>
#include <cstdlib>

#include "i18n.h"

#include <array>
#include <cstdint>
#include <cstdio>
#include <ctime>
#include <cstdlib>

namespace {

using page_navigation::NavigationItemRole;

// Splits "a<sep>b<sep>c" into up to 3 parts; missing parts are empty.
std::array<std::string, 3> Split3(const std::string& text, char sep)
{
    std::array<std::string, 3> parts = {};
    size_t start = 0;
    for (int i = 0; i < 3; ++i) {
        const size_t end = text.find(sep, start);
        parts[static_cast<size_t>(i)] =
            text.substr(start, end == std::string::npos ? std::string::npos : end - start);
        if (end == std::string::npos) {
            break;
        }
        start = end + 1;
    }
    return parts;
}

std::string Pad2(int value)
{
    char buffer[8] = {};
    std::snprintf(buffer, sizeof(buffer), "%02d", value);
    return std::string(buffer);
}

}  // namespace

TimePageCoordinator::TimePageCoordinator() = default;

std::string LocalizedTimezoneLabel(const timezone_service::TimezoneInfo& info)
{
    const std::string& english = info.description.empty() ? info.name : info.description;
    if (!i18n::IsItalian()) {
        return english;
    }
    struct Translation {
        const char* english;
        const char* italian;
    };
    static constexpr Translation kTranslations[] = {
        {"Eastern Time", "Nord America orientale"},
        {"Central Time", "Nord America centrale"},
        {"Mountain Time", "Nord America (Montagne Rocciose)"},
        {"Pacific Time", "Nord America (Pacifico)"},
        {"Alaska Time", "Alaska"},
        {"Hawaii Time", "Hawaii"},
        {"United Kingdom", "Regno Unito"},
        {"Central Europe", "Europa centrale (Italia)"},
        {"Eastern Europe", "Europa orientale"},
        {"Japan", "Giappone"},
        {"China", "Cina"},
        {"Australia Eastern", "Australia orientale"},
        {"Australia Central", "Australia centrale"},
        {"Australia Western", "Australia occidentale"},
    };
    for (const Translation& translation : kTranslations) {
        if (english == translation.english) {
            return translation.italian;
        }
    }
    return english;
}

void TimePageCoordinator::LoadFromSnapshot(const timezone_service::Snapshot& snapshot)
{
    timezone_name_ = snapshot.settings.timezone_name;
    auto_sync_ = snapshot.settings.enabled;

    timezone_description_ = timezone_name_;
    for (const timezone_service::TimezoneInfo& info : timezones_) {
        if (info.name == timezone_name_) {
            timezone_description_ = LocalizedTimezoneLabel(info);
            break;
        }
    }

    const std::array<std::string, 3> date = Split3(snapshot.runtime.current_date, '-');
    year_ = date[0];
    month_ = date[1];
    day_ = date[2];

    const std::array<std::string, 3> time = Split3(snapshot.runtime.current_time, ':');
    const int hour24 = std::atoi(time[0].c_str());
    minute_ = time[1].empty() ? std::string("00") : time[1];
    meridiem_pm_ = hour24 >= 12;
    if (uses_24_hour_) {
        hour_ = Pad2(hour24);
        return;
    }
    int hour12 = hour24 % 12;
    if (hour12 == 0) {
        hour12 = 12;
    }
    hour_ = Pad2(hour12);
}

void TimePageCoordinator::RefreshFromService(
    const timezone_service::Snapshot& snapshot,
    const std::vector<timezone_service::TimezoneInfo>& timezones)
{
    timezones_ = timezones;
    // The sync status line always follows the service, even while the user is editing.
    has_network_sync_ = snapshot.runtime.has_network_sync;
    last_network_sync_epoch_ = static_cast<int64_t>(snapshot.runtime.last_network_sync_epoch);
    sync_in_progress_ = snapshot.runtime.sync_in_progress;
    if (!user_edited_) {
        LoadFromSnapshot(snapshot);
    }
}

void TimePageCoordinator::PrepareForShow()
{
    user_edited_ = false;
    // The clock format follows the UI language, which can change while the page is hidden.
    const bool uses_24_hour = i18n::Uses24HourClock();
    if (uses_24_hour != uses_24_hour_) {
        if (!hour_.empty()) {
            const int hour = std::atoi(hour_.c_str());
            if (uses_24_hour) {
                hour_ = Pad2((hour % 12) + (meridiem_pm_ ? 12 : 0));
            } else {
                meridiem_pm_ = hour >= 12;
                hour_ = Pad2(hour % 12 == 0 ? 12 : hour % 12);
            }
        }
        uses_24_hour_ = uses_24_hour;
    }
    // Field order (AM/PM toggle, day before month) also follows the language: rebuild the
    // focus order to match what BuildState() lays out.
    day_first_ = i18n::UsesDayFirstDates();
    navigation_model_ = page_navigation::BuildTimePageNavigationModel(!uses_24_hour_, day_first_);
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kTimePageTimezone));
}

bool TimePageCoordinator::MoveFocus(int delta)
{
    if (delta == 0) {
        return false;
    }
    return focus_.Move(delta);
}

bool TimePageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool TimePageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

NavigationItemRole TimePageCoordinator::FocusedRole() const
{
    const page_navigation::NavigationItemDescriptor* item =
        navigation_model_.ItemAt(focus_.index());
    return item != nullptr ? item->role : NavigationItemRole::kUnknown;
}

int TimePageCoordinator::SelectedTimezoneIndex() const
{
    for (size_t index = 0; index < timezones_.size(); ++index) {
        if (timezones_[index].name == timezone_name_) {
            return static_cast<int>(index);
        }
    }
    return -1;
}

void TimePageCoordinator::SetTimezoneByIndex(int index)
{
    if (index < 0 || index >= static_cast<int>(timezones_.size())) {
        return;
    }
    timezone_name_ = timezones_[static_cast<size_t>(index)].name;
    timezone_description_ = timezones_[static_cast<size_t>(index)].description.empty()
                                ? timezones_[static_cast<size_t>(index)].name
                                : timezones_[static_cast<size_t>(index)].description;
    user_edited_ = true;
}

void TimePageCoordinator::SetHour(const std::string& value)
{
    hour_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetMinute(const std::string& value)
{
    minute_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetMonth(const std::string& value)
{
    month_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetDay(const std::string& value)
{
    day_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::SetYear(const std::string& value)
{
    year_ = value;
    user_edited_ = true;
}

void TimePageCoordinator::ToggleMeridiem()
{
    meridiem_pm_ = !meridiem_pm_;
    user_edited_ = true;
}

void TimePageCoordinator::ToggleAutoSync()
{
    auto_sync_ = !auto_sync_;
    user_edited_ = true;
}

void TimePageCoordinator::MarkSaved()
{
    user_edited_ = false;
}

timezone_service::SettingsPatch TimePageCoordinator::BuildSettingsPatch() const
{
    timezone_service::SettingsPatch patch = {};
    patch.has_enabled = true;
    patch.enabled = auto_sync_;
    patch.has_timezone_name = true;
    patch.timezone_name = timezone_name_;

    int hour24 = 0;
    if (uses_24_hour_) {
        hour24 = std::clamp(std::atoi(hour_.c_str()), 0, 23);
    } else {
        hour24 = std::atoi(hour_.c_str()) % 12;
        if (meridiem_pm_) {
            hour24 += 12;
        }
    }
    patch.has_manual_datetime = true;
    patch.manual_date = year_ + "-" + month_ + "-" + day_;
    patch.manual_time = Pad2(hour24) + ":" + (minute_.empty() ? std::string("00") : minute_);
    return patch;
}

std::string TimePageCoordinator::SyncStatusText() const
{
    if (!auto_sync_) {
        return i18n::Tr("The clock keeps the time you set.", "L'orologio tiene l'ora impostata.");
    }
    if (sync_in_progress_) {
        return i18n::Tr("Syncing with the internet...", "Sincronizzazione in corso...");
    }
    if (!has_network_sync_ || last_network_sync_epoch_ <= 0) {
        return i18n::Tr("Never synced: needs Wi-Fi", "Mai sincronizzata: serve il Wi-Fi");
    }
    const time_t epoch = static_cast<time_t>(last_network_sync_epoch_);
    struct tm local = {};
    localtime_r(&epoch, &local);
    char date[16] = {};
    if (i18n::UsesDayFirstDates()) {
        std::snprintf(date, sizeof(date), "%02d/%02d", local.tm_mday, local.tm_mon + 1);
    } else {
        std::snprintf(date, sizeof(date), "%02d/%02d", local.tm_mon + 1, local.tm_mday);
    }
    return i18n::Tr("Last synced: ", "Sincronizzata il ") + std::string(date) + " " +
           i18n::FormatClock(local.tm_hour, local.tm_min);
}

epaper_ui::TimePageState TimePageCoordinator::BuildState() const
{
    epaper_ui::TimePageState state = {};
    state.navigation_focus_index = focus_.index();

    state.timezone.label_text = i18n::Tr("Timezone", "Fuso orario");
    state.timezone.placeholder_text = i18n::Tr("Select timezone", "Seleziona fuso orario");
    state.timezone.value_text = timezone_description_;
    state.timezone.focused = IsRoleFocused(NavigationItemRole::kTimePageTimezone);

    state.auto_sync.label_text = auto_sync_ ? i18n::Tr("Automatic time: Yes", "Ora automatica: Sì")
                                            : i18n::Tr("Automatic time: No", "Ora automatica: No");
    state.auto_sync.selected = IsRoleFocused(NavigationItemRole::kTimePageAutoSync);
    state.sync_status_text = SyncStatusText();

    state.hour.value_text = hour_;
    state.hour.suffix_text = i18n::Tr("HR", "ORE");
    state.hour.max_length = 2;
    state.hour.focused = IsRoleFocused(NavigationItemRole::kTimePageHour);

    state.minute.value_text = minute_;
    state.minute.suffix_text = "MIN";
    state.minute.max_length = 2;
    state.minute.focused = IsRoleFocused(NavigationItemRole::kTimePageMinute);

    state.meridiem.label_text = meridiem_pm_ ? "PM" : "AM";
    state.show_meridiem = !uses_24_hour_;
    state.day_first = day_first_;
    state.meridiem.selected = IsRoleFocused(NavigationItemRole::kTimePageMeridiem);

    state.month.value_text = month_;
    state.month.placeholder_text = "MM";
    state.month.max_length = 2;
    state.month.focused = IsRoleFocused(NavigationItemRole::kTimePageMonth);

    state.day.value_text = day_;
    state.day.placeholder_text = i18n::Tr("DD", "GG");
    state.day.max_length = 2;
    state.day.focused = IsRoleFocused(NavigationItemRole::kTimePageDay);

    state.year.value_text = year_;
    state.year.placeholder_text = i18n::Tr("YYYY", "AAAA");
    state.year.max_length = 4;
    state.year.focused = IsRoleFocused(NavigationItemRole::kTimePageYear);

    state.save.label_text =
        auto_sync_ ? i18n::Tr("Sync & Save", "Sincronizza e salva") : i18n::Tr("Save", "Salva");
    state.manual_heading_text = auto_sync_
                                    ? i18n::Tr("Manual time (used offline)", "Ora manuale (se offline)")
                                    : i18n::Tr("Set manual time", "Imposta ora manualmente");
    state.save.selected = IsRoleFocused(NavigationItemRole::kTimePageSave);

    state.back.label_text = i18n::Tr("Back", "Indietro");
    state.back.selected = IsRoleFocused(NavigationItemRole::kTimePageBackButton);
    return state;
}
