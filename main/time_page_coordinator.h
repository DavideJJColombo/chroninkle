#ifndef TIME_PAGE_COORDINATOR_H_
#define TIME_PAGE_COORDINATOR_H_

#include <string>
#include <vector>

#include "epaper_ui/time_page.h"
#include "i18n.h"
#include "page_navigation/navigation_model.h"
#include "page_navigation/roving_focus.h"
#include "timezone_service.h"

// Timezone name for display in the current UI language (catalog descriptions are English).
std::string LocalizedTimezoneLabel(const timezone_service::TimezoneInfo& info);

class TimePageCoordinator {
public:
    TimePageCoordinator();

    // Reloads the editable fields from the service snapshot unless the user has edited
    // them since the page was last shown. The timezone list is always refreshed.
    void RefreshFromService(const timezone_service::Snapshot& snapshot,
                            const std::vector<timezone_service::TimezoneInfo>& timezones);
    // Called when the page is (re)entered: clears edit state and focuses the first field.
    void PrepareForShow();

    bool MoveFocus(int delta);
    bool SetFocusIndex(int index);
    bool IsRoleFocused(page_navigation::NavigationItemRole role) const;
    page_navigation::NavigationItemRole FocusedRole() const;

    epaper_ui::TimePageState BuildState() const;

    // Field accessors used to seed overlays and build the save patch.
    const std::vector<timezone_service::TimezoneInfo>& timezones() const { return timezones_; }
    int SelectedTimezoneIndex() const;
    const std::string& hour() const { return hour_; }
    const std::string& minute() const { return minute_; }
    const std::string& month() const { return month_; }
    const std::string& day() const { return day_; }
    const std::string& year() const { return year_; }

    // Commit setters (invoked when an overlay returns a value).
    void SetTimezoneByIndex(int index);
    void SetHour(const std::string& value);
    void SetMinute(const std::string& value);
    void SetMonth(const std::string& value);
    void SetDay(const std::string& value);
    void SetYear(const std::string& value);
    void ToggleMeridiem();
    void ToggleAutoSync();
    // Clears the "user edited" guard after a save so later service syncs (e.g. an async NTP
    // result) reload the page instead of preserving the now-committed edits.
    void MarkSaved();

    timezone_service::SettingsPatch BuildSettingsPatch() const;

    const page_navigation::NavigationModel& navigation_model() const { return navigation_model_; }
    const page_navigation::RovingFocus& focus() const { return focus_; }

private:
    void LoadFromSnapshot(const timezone_service::Snapshot& snapshot);
    std::string SyncStatusText() const;

    page_navigation::NavigationModel navigation_model_ =
        page_navigation::BuildTimePageNavigationModel(!i18n::Uses24HourClock(),
                                                      i18n::UsesDayFirstDates());
    page_navigation::RovingFocus focus_{navigation_model_.item_count, 0};

    std::vector<timezone_service::TimezoneInfo> timezones_ = {};
    std::string timezone_name_ = {};
    std::string timezone_description_ = {};
    std::string hour_ = {};    // "01".."12" with AM/PM, "00".."23" on the 24-hour clock
    std::string minute_ = {};  // "00".."59"
    bool meridiem_pm_ = false;
    bool auto_sync_ = true;  // "Automatic time", staged until Save
    bool has_network_sync_ = false;
    int64_t last_network_sync_epoch_ = 0;
    bool sync_in_progress_ = false;
    bool uses_24_hour_ = i18n::Uses24HourClock();  // follows the UI language, set on show
    bool day_first_ = i18n::UsesDayFirstDates();    // likewise
    std::string month_ = {};   // "01".."12"
    std::string day_ = {};     // "01".."31"
    std::string year_ = {};    // "YYYY"
    bool user_edited_ = false;
};

#endif  // TIME_PAGE_COORDINATOR_H_
