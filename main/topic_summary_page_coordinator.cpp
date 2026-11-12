#include "topic_summary_page_coordinator.h"

#include "i18n.h"

#include "shared_page_interactions.h"

namespace {

using page_navigation::NavigationItemRole;

constexpr int kScrollStepPercent = 10;
const char* ConnectToGeminiMessage()
{
    return i18n::Tr("Connect to Gemini for summaries", "Connetti Gemini per i riepiloghi");
}
const char* EmptyStateMessage()
{
    return i18n::Tr("Get a summary of every entry tagged with this topic",
                    "Ottieni un riepilogo di tutte le voci con questo argomento");
}

}  // namespace

TopicSummaryPageCoordinator::TopicSummaryPageCoordinator()
{
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kTopicSummaryPageScrollContainer));
}

void TopicSummaryPageCoordinator::QueueShow(const std::string& topic_id,
                                            const std::string& topic_name)
{
    pending_topic_id_ = topic_id;
    pending_topic_name_ = topic_name;
}

void TopicSummaryPageCoordinator::Show()
{
    scroll_container_active_ = false;
    scroll_position_percent_ = 0;
    if (!pending_topic_id_.empty() || !pending_topic_name_.empty()) {
        topic_id_ = pending_topic_id_;
        topic_name_ = pending_topic_name_.empty() ? i18n::Tr("Topic", "Argomento") : pending_topic_name_;
        pending_topic_id_.clear();
        pending_topic_name_.clear();
    }
    focus_.Configure(navigation_model_.item_count,
                     navigation_model_.IndexOfRole(NavigationItemRole::kTopicSummaryPageScrollContainer));
}

bool TopicSummaryPageCoordinator::MoveFocus(int delta)
{
    if (delta == 0) {
        return false;
    }
    if (scroll_container_active_) {
        const shared_page_interactions::ScrollStepResult step =
            shared_page_interactions::StepScrollPercent(scroll_position_percent_, delta,
                                                         kScrollStepPercent);
        if (!step.changed) {
            return false;
        }
        scroll_position_percent_ = step.value;
        return true;
    }
    return focus_.Move(delta);
}

bool TopicSummaryPageCoordinator::SetFocusIndex(int index)
{
    return focus_.SetIndex(index);
}

bool TopicSummaryPageCoordinator::IsRoleFocused(NavigationItemRole role) const
{
    return navigation_model_.IsRoleSelected(focus_.index(), role);
}

bool TopicSummaryPageCoordinator::EnterScrollContainer()
{
    if (scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = true;
    return true;
}

bool TopicSummaryPageCoordinator::ExitScrollContainer()
{
    if (!scroll_container_active_) {
        return false;
    }
    scroll_container_active_ = false;
    return true;
}

epaper_ui::TopicSummaryPageState TopicSummaryPageCoordinator::BuildState(
    bool gemini_ready, const summary_service::CacheEntrySnapshot& cache) const
{
    epaper_ui::TopicSummaryPageState state = {};
    state.navigation_focus_index = focus_.index();
    state.title_text = topic_name_;

    state.scroll_container.content_text = cache.available ? cache.text : std::string();
    state.scroll_container.empty_state_message = BuildEmptyStateMessage(gemini_ready, cache);
    state.scroll_container.focused =
        IsRoleFocused(NavigationItemRole::kTopicSummaryPageScrollContainer) ||
        scroll_container_active_;
    state.scroll_container.active = scroll_container_active_;
    state.scroll_container.scroll_position_percent = scroll_position_percent_;

    state.back_button.label_text = i18n::Tr("Back", "Indietro");
    state.back_button.selected = IsRoleFocused(NavigationItemRole::kTopicSummaryPageBackButton);

    state.get_summary_button.label_text = cache.available ? i18n::Tr("Refresh summary", "Aggiorna") : i18n::Tr("Get summary", "Ottieni riepilogo");
    state.get_summary_button.selected =
        IsRoleFocused(NavigationItemRole::kTopicSummaryPageGetSummaryButton);
    return state;
}

std::string TopicSummaryPageCoordinator::BuildEmptyStateMessage(
    bool gemini_ready, const summary_service::CacheEntrySnapshot& cache) const
{
    if (cache.available) {
        return {};
    }
    if (!gemini_ready) {
        return ConnectToGeminiMessage();
    }
    return EmptyStateMessage();
}
