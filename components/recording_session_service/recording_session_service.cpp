#include "recording_session_service.h"

#include "i18n.h"

#include <algorithm>
#include <array>
#include <atomic>
#include <cctype>
#include <ctime>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

#include "app_state_service.h"
#include "auto_classify.h"

#include "esp_log.h"
#include "chroninkle_task_config.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "gemini_service.h"
#include "playback_service.h"
#include "sdkconfig.h"
#include "storage_service.h"
#include "system_sound_service.h"
#include "topic_service.h"

namespace recording_session_service {
namespace {

constexpr const char* kTag = "RecordingSession";
const char* IdleStatus()
{
    return i18n::Tr("Hold POWER to record", "Tieni premuto POWER per registrare");
}
const char* ArmedStatus()
{
    return i18n::Tr("Keep holding to record", "Continua a tenere premuto per registrare");
}
const char* RecordingStatus()
{
    return i18n::Tr("Recording", "Registrazione");
}
const char* StartCueStatus()
{
    return i18n::Tr("Starting recording", "Avvio registrazione");
}
const char* StopCueStatus()
{
    return i18n::Tr("Finishing recording", "Fine registrazione");
}
const char* PlayingBackStatus()
{
    return i18n::Tr("Playing back", "Riproduzione");
}
const char* ChooseTagStatus()
{
    return i18n::Tr("Choose recording type", "Scegli il tipo di registrazione");
}
const char* SavingStatus()
{
    return i18n::Tr("Saving recording", "Salvataggio registrazione");
}
const char* TranscribingStatus()
{
    return i18n::Tr("Transcribing recording", "Trascrizione in corso");
}
const char* SavedWithoutTranscriptStatus()
{
    return i18n::Tr("Recording saved without transcription",
                    "Registrazione salvata senza trascrizione");
}
const char* DiscardedStatus()
{
    return i18n::Tr("Recording discarded", "Registrazione scartata");
}
const char* AddingTopicStatus()
{
    return i18n::Tr("Adding topic", "Aggiunta argomento");
}
// Replay the take before asking what to save it as. Off by default: the recording goes
// straight to the tag menu (it can still be played later from its menu or Details page).
constexpr bool kReplayBeforeTagSelection =
#if defined(CONFIG_CHRONINKLE_REPLAY_RECORDING_BEFORE_TAG)
    true;
#else
    false;
#endif
constexpr uint32_t kMinTranscriptionDurationMs = 500;
constexpr uint32_t kFallbackAudioSampleRateHz = 24000;
constexpr size_t kSignalWindowSamples = 240;
constexpr int32_t kSpeechPeakThreshold = 700;
constexpr size_t kMinSpeechWindows = 3;

constexpr std::array<TagOption, 5> kTagOptions = {{
    {.tag = recording_archive_service::RecordingTag::kNote, .label_text = "Note"},
    {.tag = recording_archive_service::RecordingTag::kTask, .label_text = "Task"},
    {.tag = recording_archive_service::RecordingTag::kIdea, .label_text = "Idea"},
    {.label_text = "Topic", .is_topic = true},
    {.label_text = "Discard", .is_discard = true},
}};

struct GuardrailResult {
    bool accepted = false;
    const char* error_code = "";
    const char* status_message = "";
};

std::mutex s_mutex;
EventHandler s_event_handler = nullptr;
void* s_event_context = nullptr;
bool s_initialized = false;
Snapshot s_snapshot = {};
std::string s_pending_recording_id = {};
// Recording whose in-flight transcription also carries automatic classification (its answer is
// the auto_classify JSON, not a plain transcript).
std::string s_auto_classify_recording_id = {};

// Cue tokens make a late callback harmless: every cue we queue bumps the token, so a
// result that arrives after the session has moved on (cancel, failure, a new recording)
// no longer matches and is dropped instead of driving a stale transition.
uint32_t s_cue_token = 0;
std::atomic<bool> s_playback_worker_active{false};
// Live Wi-Fi connectivity, pushed in from app_shell (mirrors gemini_service/timezone_service's
// SetNetworkState/SetNetworkConnected hooks). gemini_service's `ready` flag alone reflects
// "configured and has authenticated at some point" -- it does not reset on a later
// disconnect -- so it has to be combined with this to actually mean "reachable right now".
std::atomic<bool> s_network_connected{false};
// Set when BOOT is released before the start cue finishes; consumed by HandleStartCueResult.
bool s_finish_pending_after_start_cue = false;

uint32_t ResolveClipDurationMs(const recording_service::RecordedClip& clip, uint32_t duration_ms)
{
    if (duration_ms > 0) {
        return duration_ms;
    }
    return clip.sample_rate_hz() > 0
               ? clip.duration_ms()
               : static_cast<uint32_t>((clip.sample_count() * 1000ULL) /
                                       kFallbackAudioSampleRateHz);
}

GuardrailResult ValidateClip(const recording_service::RecordedClip& clip, uint32_t duration_ms)
{
    if (clip.empty()) {
        return {
            .accepted = false,
            .error_code = "empty_audio",
            .status_message = i18n::Tr("Recording too short", "Registrazione troppo breve"),
        };
    }

    const uint32_t resolved_duration_ms = ResolveClipDurationMs(clip, duration_ms);
    if (resolved_duration_ms < kMinTranscriptionDurationMs) {
        return {
            .accepted = false,
            .error_code = "recording_too_short",
            .status_message = i18n::Tr("Recording too short", "Registrazione troppo breve"),
        };
    }

    size_t speech_windows = 0;
    size_t window_fill = 0;
    int32_t window_peak = 0;
    auto finish_window = [&]() -> bool {
        if (window_fill == 0) {
            return false;
        }
        if (window_peak >= kSpeechPeakThreshold) {
            ++speech_windows;
            if (speech_windows >= kMinSpeechWindows) {
                return true;
            }
        }
        window_fill = 0;
        window_peak = 0;
        return false;
    };

    bool accepted = false;
    clip.ForEachChunk([&](const int16_t* chunk_data, size_t chunk_size) {
        if (accepted || chunk_data == nullptr) {
            return;
        }
        for (size_t index = 0; index < chunk_size; ++index) {
            int32_t amplitude = chunk_data[index];
            if (amplitude < 0) {
                amplitude = -amplitude;
            }
            window_peak = std::max(window_peak, amplitude);
            ++window_fill;
            if (window_fill >= kSignalWindowSamples && finish_window()) {
                accepted = true;
                break;
            }
        }
    });
    if (!accepted && finish_window()) {
        accepted = true;
    }

    if (accepted) {
        return {
            .accepted = true,
            .error_code = "",
            .status_message = "",
        };
    }

    return {
        .accepted = false,
        .error_code = "recording_too_quiet",
        .status_message = i18n::Tr("No speech detected", "Nessuna voce rilevata"),
    };
}

BlockedReason EvaluateBlockedReason(const Context& context)
{
    if (context.lock_screen_active) {
        return BlockedReason::kLockScreenActive;
    }
    if (context.overlay_visible) {
        return BlockedReason::kOverlayVisible;
    }
    if (storage_service::IsWriteBusy()) {
        return BlockedReason::kStorageBusy;
    }
    if (!recording_service::IsInitialized()) {
        return BlockedReason::kRecorderUnavailable;
    }
    if (transcription_service::GetSnapshot().request_in_flight) {
        return BlockedReason::kTranscriptionInFlight;
    }
    return BlockedReason::kNone;
}

const char* BlockedReasonStatusMessage(BlockedReason reason)
{
    switch (reason) {
        case BlockedReason::kLockScreenActive:
            return i18n::Tr("Unlock to record", "Sblocca per registrare");
        case BlockedReason::kOverlayVisible:
            return i18n::Tr("Close the current dialog", "Chiudi la finestra aperta");
        case BlockedReason::kStorageBusy:
            return i18n::Tr("Wait for SD activity to finish", "Attendi la fine dell'attività sulla SD");
        case BlockedReason::kRecorderUnavailable:
            return i18n::Tr("Recorder unavailable", "Registratore non disponibile");
        case BlockedReason::kTranscriptionInFlight:
            return i18n::Tr("Wait for transcription to finish", "Attendi la fine della trascrizione");
        case BlockedReason::kNone:
        default:
            return "";
    }
}

void ResetToIdleLocked()
{
    s_snapshot.allowed = true;
    s_snapshot.blocked_reason = BlockedReason::kNone;
    s_snapshot.phase = Phase::kIdle;
    s_snapshot.has_clip = false;
    s_snapshot.clip_saved = false;
    s_snapshot.transcript_saved = false;
    s_snapshot.last_topic_action = TopicActionState::kNone;
    s_snapshot.request_in_flight = false;
    s_snapshot.recorded_samples = 0;
    s_snapshot.duration_ms = 0;
    s_snapshot.input_level_percent = 0;
    s_snapshot.stop_reason = recording_service::StopReason::kNone;
    s_snapshot.last_saved_recording_id.clear();
    s_snapshot.last_saved_recording_path.clear();
    s_snapshot.last_saved_transcript_path.clear();
    s_snapshot.last_transcript.clear();
    s_snapshot.last_error_code.clear();
    s_snapshot.last_error_message.clear();
    s_snapshot.last_status_message = IdleStatus();
    s_pending_recording_id.clear();
    s_auto_classify_recording_id.clear();
    s_snapshot.auto_classified = false;
    // Invalidate any cue callback still in flight, so a late result cannot resurrect a
    // session that was just cancelled.
    ++s_cue_token;
    s_finish_pending_after_start_cue = false;
}

void SyncRecordingStateLocked(const recording_service::UiState& state)
{
    s_snapshot.initialized = state.initialized;
    s_snapshot.recorded_samples = state.recorded_samples;
    s_snapshot.duration_ms = state.duration_ms;
    s_snapshot.max_recording_ms = state.max_recording_ms;
    s_snapshot.input_level_percent = state.input_level_percent;
    s_snapshot.stop_reason = state.stop_reason;
    s_snapshot.has_clip = state.has_clip;
}

void NotifyLocked()
{
    EventHandler handler = s_event_handler;
    void* context = s_event_context;
    if (handler == nullptr) {
        return;
    }

    const Event event = {
        .snapshot = s_snapshot,
    };
    handler(event, context);
}

// Playback blocks for the length of the clip, so it cannot run on the sound-cue callback
// task. This mirrors the details page's short-lived worker: the shared_ptr keeps the PSRAM
// clip alive for the duration even though nothing else references it yet.
constexpr uint32_t kPlaybackWorkerStackWords = 4096;

void AdvanceToTagSelection(const char* reason);

void PlaybackWorker(void* arg)
{
    std::unique_ptr<recording_service::RecordedClipPtr> clip(
        static_cast<recording_service::RecordedClipPtr*>(arg));
    if (clip != nullptr && *clip != nullptr) {
        const esp_err_t err = playback_service::PlayClip(*clip);
        if (err != ESP_OK) {
            ESP_LOGW(kTag, "Clip playback failed: %s", esp_err_to_name(err));
        }
    }
    s_playback_worker_active.store(false, std::memory_order_release);
    AdvanceToTagSelection("playback finished");
    vTaskDelete(nullptr);
}

// Every route out of the stop cue lands here: playback done, playback refused to start, or
// the stop cue itself failed. The clip is still unsaved, so the tag menu's Discard option
// is what throws away a bad take.
// Automatic classification replaces the tag menu only when it can actually run right now:
// enabled, online, Gemini authenticated, and the single transcription slot free. Otherwise the
// menu opens as before (and an offline recording is transcribed later, as before).
// Called without s_mutex held: transcription_service calls into this service while holding
// its own lock, so taking them in the other order here could deadlock.
bool ShouldAutoClassify()
{
    return app_state_service::AutoClassifyEnabled() &&
           s_network_connected.load(std::memory_order_relaxed) &&
           gemini_service::GetSnapshot().runtime.ready &&
           !transcription_service::GetSnapshot().request_in_flight;
}

bool SaveAndTranscribeClip(recording_archive_service::RecordingTag tag, bool auto_classify);

void AdvanceToTagSelection(const char* reason)
{
    const bool auto_classify = ShouldAutoClassify();
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (s_snapshot.phase != Phase::kStopCue && s_snapshot.phase != Phase::kPlayingBack) {
            return;
        }
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        if (auto_classify) {
            ESP_LOGI(kTag, "Saving for automatic classification (%s)", reason);
            s_snapshot.phase = Phase::kSaving;
            s_snapshot.last_status_message = SavingStatus();
        } else {
            ESP_LOGI(kTag, "Advancing to tag selection (%s)", reason);
            s_snapshot.phase = Phase::kAwaitingTagSelection;
            s_snapshot.last_status_message = ChooseTagStatus();
        }
        NotifyLocked();
    }
    if (auto_classify) {
        // SD write + upload start off the cue/playback callback task. Saved as a Note until
        // Gemini's answer says otherwise.
        gemini_service::RunOnWorker([]() {
            (void)SaveAndTranscribeClip(recording_archive_service::RecordingTag::kNote,
                                        /*auto_classify=*/true);
        });
    }
}

// Replays the take the user just recorded. Returns false when playback could not be
// started, so the caller can fall through to tag selection rather than stranding the
// session in kStopCue.
bool StartClipPlayback(const recording_service::RecordedClipPtr& clip)
{
    if (clip == nullptr || clip->empty()) {
        return false;
    }
    bool expected = false;
    if (!s_playback_worker_active.compare_exchange_strong(expected, true)) {
        return false;
    }

    // Publish kPlayingBack before the worker can exist. The worker advances to tag
    // selection the moment it finishes, and a very short clip would otherwise beat this
    // update -- leaving the phase stuck on kPlayingBack after the menu had already opened.
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kPlayingBack;
        s_snapshot.last_status_message = PlayingBackStatus();
        NotifyLocked();
    }

    auto* clip_copy = new recording_service::RecordedClipPtr(clip);
    if (xTaskCreate(&PlaybackWorker, "clip_playback", kPlaybackWorkerStackWords, clip_copy,
                    chroninkle_task_config::kPriorityStorage, nullptr) != pdPASS) {
        delete clip_copy;
        s_playback_worker_active.store(false, std::memory_order_release);
        ESP_LOGW(kTag, "Failed to start clip playback worker");
        // Phase is kPlayingBack here, which AdvanceToTagSelection accepts, so the caller's
        // fallback still lands correctly.
        return false;
    }
    return true;
}

// Fires once the stop cue has finished (or failed). Playing the clip under the cue would
// overlap two streams on the same codec output, so the replay waits for it.
void HandleStopCueResult(uint32_t token, SoundCuePlaybackResult result)
{
    recording_service::RecordedClipPtr clip = nullptr;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (token != s_cue_token || s_snapshot.phase != Phase::kStopCue) {
            return;
        }
    }
    if (result != SoundCuePlaybackResult::kCompleted) {
        AdvanceToTagSelection("stop cue did not complete");
        return;
    }
    if (!kReplayBeforeTagSelection) {
        AdvanceToTagSelection("replay disabled");
        return;
    }

    clip = recording_service::GetRecordedClip();
    if (!StartClipPlayback(clip)) {
        AdvanceToTagSelection("playback unavailable");
    }
}

void HandleStartCueResult(uint32_t token, SoundCuePlaybackResult)
{
    bool finish_now = false;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        // The cue is cosmetic: capture is already running underneath it, so even a failed
        // cue just moves the UI on rather than aborting the take.
        if (token != s_cue_token || s_snapshot.phase != Phase::kStartCue) {
            return;
        }
        finish_now = s_finish_pending_after_start_cue;
        s_finish_pending_after_start_cue = false;
        if (finish_now) {
            s_snapshot.phase = Phase::kSaving;
            s_snapshot.last_status_message = i18n::Tr("Preparing recording", "Preparazione registrazione");
        } else {
            s_snapshot.phase = Phase::kRecording;
            s_snapshot.last_status_message = RecordingStatus();
        }
        NotifyLocked();
    }

    if (finish_now) {
        (void)recording_service::Finish();
    }
}

void MarkBlockedLocked(BlockedReason reason)
{
    s_snapshot.allowed = false;
    s_snapshot.blocked_reason = reason;
    s_snapshot.last_status_message = BlockedReasonStatusMessage(reason);
    s_snapshot.last_error_code.clear();
    s_snapshot.last_error_message.clear();
}

std::string TrimWhitespace(const std::string& text)
{
    const size_t start = text.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) {
        return {};
    }
    const size_t end = text.find_last_not_of(" \t\r\n");
    return text.substr(start, end - start + 1);
}

// Distills a spoken transcript ("this one's for the kitchen renovation project") into a short
// topic name via a second, cheap Gemini call -- falls back to the raw transcript if that call
// fails, since a slightly verbose name beats an empty one.
std::string ExtractTopicName(const std::string& transcript)
{
    // Italian names keep the language's own capitalization (first word and proper nouns only),
    // not English title case.
    const std::string prompt =
        std::string(i18n::IsItalian()
                        ? "Extract a short topic or project name from this spoken phrase, using as "
                          "few words as possible -- if the phrase is already just one or two words, "
                          "use exactly those words and do not add any others. Never invent or infer "
                          "additional words that weren't said. Keep the language of the phrase "
                          "(usually Italian) and never translate. At most 4 words, capitalize only "
                          "the first word and proper nouns, no punctuation. Respond with only the "
                          "name, nothing else.\n\n"
                        : "Extract a short topic or project name from this spoken phrase, using as "
                          "few words as possible -- if the phrase is already just one or two words, "
                          "use exactly those words and do not add any others. Never invent or infer "
                          "additional words that weren't said. At most 4 words, title case, no "
                          "punctuation. Respond with only the name, nothing else.\n\n") +
        transcript;
    const gemini_service::TextResult result = gemini_service::GenerateText(prompt);
    if (result.success && !result.text.empty()) {
        return TrimWhitespace(result.text);
    }
    return TrimWhitespace(transcript);
}

// Runs on gemini_service's shared worker task, queued by SubmitTagSelection's is_topic branch.
void ProcessTopicFromRecording(recording_service::RecordedClipPtr clip)
{
    std::string name;
    if (clip && !clip->empty()) {
        const gemini_service::TranscriptionResult transcription =
            gemini_service::Transcribe(*clip);
        if (transcription.success && !transcription.transcript.empty()) {
            name = ExtractTopicName(transcription.transcript);
        }
    }
    clip.reset();

    const std::string created_id = name.empty() ? std::string() : topic_service::Create(name);

    std::lock_guard<std::mutex> lock(s_mutex);
    if (!created_id.empty()) {
        s_snapshot.last_topic_action = TopicActionState::kSucceeded;
        s_snapshot.last_status_message = i18n::Tr("Added as topic: ", "Aggiunto come argomento: ") + name;
    } else {
        s_snapshot.last_topic_action = TopicActionState::kFailed;
        s_snapshot.last_status_message = i18n::Tr("Couldn't catch a topic name", "Non ho capito il nome dell'argomento");
    }
    NotifyLocked();
}

auto_classify::PromptContext BuildAutoClassifyContext()
{
    auto_classify::PromptContext context = {};
    context.italian = i18n::IsItalian();
    const std::time_t now = std::time(nullptr);
    constexpr std::time_t kMinValidEpoch = 1704067200;  // 2024-01-01
    if (now >= kMinValidEpoch) {
        std::tm local = {};
        localtime_r(&now, &local);
        char date[16] = {};
        char weekday[16] = {};
        char clock[8] = {};
        std::strftime(date, sizeof(date), "%Y-%m-%d", &local);
        std::strftime(weekday, sizeof(weekday), "%A", &local);  // C locale: English
        std::strftime(clock, sizeof(clock), "%H:%M", &local);
        context.time_valid = true;
        context.today_date = date;
        context.today_weekday = weekday;
        context.now_time = clock;
    }
    for (const topic_service::Topic& topic : topic_service::GetSnapshot().topics) {
        context.topic_names.push_back(topic.name);
    }
    return context;
}

std::string LowerAscii(std::string text)
{
    std::transform(text.begin(), text.end(), text.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return text;
}

std::vector<std::string> MatchTopicIds(const std::string& topic_name)
{
    std::vector<std::string> ids;
    if (topic_name.empty()) {
        return ids;
    }
    const std::string wanted = LowerAscii(topic_name);
    for (const topic_service::Topic& topic : topic_service::GetSnapshot().topics) {
        if (LowerAscii(topic.name) == wanted) {
            ids.push_back(topic.id);
            break;
        }
    }
    return ids;
}

std::string AutoClassifiedStatus(const auto_classify::Result& result, bool has_topic)
{
    std::string text;
    switch (result.kind) {
        case auto_classify::Kind::kTask:
            if (result.tasks.size() > 1) {
                text = std::to_string(result.tasks.size()) +
                       i18n::Tr(" todos added", " attività aggiunte a Da fare");
            } else {
                text = i18n::Tr("Added to Todos", "Aggiunto a Da fare");
            }
            break;
        case auto_classify::Kind::kIdea:
            text = i18n::Tr("Saved as Idea", "Salvato come Idea");
            break;
        case auto_classify::Kind::kNote:
        case auto_classify::Kind::kNewTopic:
        default:
            text = i18n::Tr("Saved as Note", "Salvato come Nota");
            break;
    }
    if (has_topic) {
        text += " - " + result.topic;
    }
    return text;
}

// Applies Gemini's transcript + classification to the recording just saved (as a Note): the
// transcript, the type, the topic, and for todos one entry per task with its deadline (the
// first task is the recording itself, the others are text-only entries pointing at it).
// Runs from HandleTranscriptionEvent, i.e. on transcription_service's notify path with its lock
// held: must not call back into transcription_service.
void ApplyAutoClassification(const std::string& recording_id, const std::string& answer)
{
    using recording_archive_service::RecordingTag;
    const auto_classify::Result result = auto_classify::Parse(answer);
    ESP_LOGI(kTag, "Auto-classification: id=%s parsed=%d kind=%d tasks=%u topic=%s",
             recording_id.c_str(), result.parsed ? 1 : 0, static_cast<int>(result.kind),
             static_cast<unsigned>(result.tasks.size()),
             result.topic.empty() ? "<none>" : result.topic.c_str());

    if (result.kind == auto_classify::Kind::kNewTopic) {
        // "Nuovo argomento ..." creates the topic; the recording itself is not kept, matching
        // the menu's Topic option.
        const std::string created_id = topic_service::Create(result.topic);
        (void)recording_archive_service::DeleteRecording(recording_id);
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kComplete;
        s_snapshot.request_in_flight = false;
        s_snapshot.clip_saved = false;
        s_snapshot.transcript_saved = false;
        s_snapshot.last_topic_action =
            created_id.empty() ? TopicActionState::kFailed : TopicActionState::kSucceeded;
        s_snapshot.last_status_message =
            created_id.empty()
                ? std::string(i18n::Tr("Couldn't catch a topic name",
                                       "Non ho capito il nome dell'argomento"))
                : std::string(i18n::Tr("Added as topic: ", "Aggiunto come argomento: ")) +
                      result.topic;
        s_pending_recording_id.clear();
        s_auto_classify_recording_id.clear();
        NotifyLocked();
        return;
    }

    const std::string transcript = result.transcript;
    recording_archive_service::SaveResult save_result = {};
    if (!transcript.empty()) {
        save_result = recording_archive_service::SaveTranscript(recording_id, transcript);
    }
    if (!save_result.transcript_saved) {
        (void)recording_archive_service::SaveTranscriptionFailure(
            recording_id, transcript.empty() ? i18n::Tr("Gemini returned no transcript text",
                                                        "Gemini non ha restituito il testo")
                                             : save_result.error_message);
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kComplete;
        s_snapshot.request_in_flight = false;
        s_snapshot.transcript_saved = false;
        s_snapshot.last_status_message = SavedWithoutTranscriptStatus();
        s_pending_recording_id.clear();
        s_auto_classify_recording_id.clear();
        NotifyLocked();
        return;
    }

    recording_archive_service::Classification classification = {};
    classification.topic_ids = MatchTopicIds(result.topic);
    switch (result.kind) {
        case auto_classify::Kind::kTask:
            classification.tag = RecordingTag::kTask;
            classification.display_text = result.tasks.front().text;
            classification.due_date = result.tasks.front().due_date;
            classification.due_time = result.tasks.front().due_time;
            break;
        case auto_classify::Kind::kIdea:
            classification.tag = RecordingTag::kIdea;
            break;
        default:
            classification.tag = RecordingTag::kNote;
            break;
    }
    (void)recording_archive_service::ApplyClassification(recording_id, classification);
    for (size_t i = 1; i < result.tasks.size(); ++i) {
        recording_archive_service::Classification extra = classification;
        extra.display_text.clear();  // the entry's own text is the task
        extra.due_date = result.tasks[i].due_date;
        extra.due_time = result.tasks[i].due_time;
        (void)recording_archive_service::CreateDerivedEntry(recording_id, extra,
                                                            result.tasks[i].text);
    }

    std::lock_guard<std::mutex> lock(s_mutex);
    s_snapshot.phase = Phase::kComplete;
    s_snapshot.request_in_flight = false;
    s_snapshot.transcript_saved = true;
    s_snapshot.auto_classified = true;
    s_snapshot.last_saved_transcript_path = save_result.transcript_path;
    s_snapshot.last_transcript = transcript;
    s_snapshot.last_status_message =
        AutoClassifiedStatus(result, !classification.topic_ids.empty());
    s_snapshot.last_error_code.clear();
    s_snapshot.last_error_message.clear();
    s_pending_recording_id.clear();
    s_auto_classify_recording_id.clear();
    NotifyLocked();
}

// Saves the take under `tag` and starts its transcription when Gemini is reachable. With
// auto_classify, the same Gemini call also classifies it (see ApplyAutoClassification).
bool SaveAndTranscribeClip(recording_archive_service::RecordingTag tag, bool auto_classify)
{
    recording_service::RecordedClipPtr clip = recording_service::GetRecordedClip();
    if (!clip || clip->empty()) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kFailed;
        s_snapshot.last_status_message = i18n::Tr("Save failed", "Salvataggio non riuscito");
        s_snapshot.last_error_code = "recording_missing";
        s_snapshot.last_error_message = "Recording clip was not available";
        NotifyLocked();
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kSaving;
        s_snapshot.last_status_message = SavingStatus();
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        NotifyLocked();
    }

    recording_archive_service::SaveOptions options = {};
    options.tag = tag;
    const bool gemini_ready = s_network_connected.load(std::memory_order_relaxed) &&
                              gemini_service::GetSnapshot().runtime.ready;
    options.pending_transcription = !gemini_ready;
    ESP_LOGI(kTag,
             "Starting archive save: tag=%s samples=%u duration_ms=%lu",
             recording_archive_service::TagName(options.tag),
             static_cast<unsigned>(clip->sample_count()),
             static_cast<unsigned long>(clip->duration_ms()));
    const recording_archive_service::SaveResult save_result =
        recording_archive_service::SaveClip(*clip, options);
    ESP_LOGI(kTag,
             "Archive save result: success=%d clip_saved=%d metadata_saved=%d id=%s wav=%s metadata=%s error=%s",
             save_result.success ? 1 : 0,
             save_result.clip_saved ? 1 : 0,
             save_result.metadata_saved ? 1 : 0,
             save_result.recording_id.empty() ? "<none>" : save_result.recording_id.c_str(),
             save_result.recording_path.empty() ? "<none>" : save_result.recording_path.c_str(),
             save_result.metadata_path.empty() ? "<none>" : save_result.metadata_path.c_str(),
             save_result.error_code.empty() ? "<none>" : save_result.error_code.c_str());

    const bool should_transcribe = save_result.clip_saved && gemini_ready;
    ESP_LOGI(kTag,
             "Transcription decision: clip_saved=%d gemini_ready=%d should_transcribe=%d",
             save_result.clip_saved ? 1 : 0,
             gemini_ready ? 1 : 0,
             should_transcribe ? 1 : 0);

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.clip_saved = save_result.clip_saved;
        s_snapshot.transcript_saved = false;
        s_snapshot.last_saved_recording_id = save_result.recording_id;
        s_snapshot.last_saved_recording_path = save_result.recording_path;
        s_snapshot.last_saved_transcript_path = save_result.transcript_path;
        s_pending_recording_id = save_result.recording_id;
    }

    gemini_service::TranscribeOptions transcribe_options = {};
    if (auto_classify && should_transcribe) {
        transcribe_options.prompt = auto_classify::BuildPrompt(BuildAutoClassifyContext());
        transcribe_options.response_schema_json = auto_classify::ResponseSchemaJson();
        // Set before the job can possibly report back.
        std::lock_guard<std::mutex> lock(s_mutex);
        s_auto_classify_recording_id = save_result.recording_id;
    }
    if (should_transcribe && transcription_service::BeginTranscription(clip, transcribe_options)) {
        recording_service::DiscardClip();
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kTranscribing;
        s_snapshot.request_in_flight = true;
        s_snapshot.last_status_message = TranscribingStatus();
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        NotifyLocked();
        return true;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_auto_classify_recording_id.clear();
    }
    if (should_transcribe) {
        ESP_LOGW(kTag,
                 "Transcription did not start after save: id=%s",
                 save_result.recording_id.empty() ? "<none>" : save_result.recording_id.c_str());
    }

    recording_service::DiscardClip();
    // Saved but not sent to Gemini: say why when it is Gemini that isn't ready (missing or
    // rejected key...), rather than only "saved without transcription".
    std::string not_ready_status = SavedWithoutTranscriptStatus();
    if (!gemini_ready && s_network_connected.load(std::memory_order_relaxed)) {
        const std::string reason = gemini_service::NotReadyReason(gemini_service::GetSnapshot());
        if (!reason.empty()) {
            not_ready_status = i18n::Tr("Saved. ", "Salvata. ") + reason;
        }
    }
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.request_in_flight = false;
        s_snapshot.phase = save_result.clip_saved ? Phase::kComplete : Phase::kFailed;
        s_snapshot.last_status_message = save_result.clip_saved
                                             ? not_ready_status
                                             : (save_result.status_message.empty()
                                                    ? i18n::Tr("Save failed", "Salvataggio non riuscito")
                                                    : save_result.status_message);
        s_snapshot.last_error_code = save_result.error_code;
        s_snapshot.last_error_message = save_result.error_message;
        if (save_result.clip_saved && !save_result.error_code.empty()) {
            // Keep the saved result but surface the archive warning.
            s_snapshot.last_error_message = save_result.error_message;
        } else if (save_result.clip_saved) {
            s_snapshot.last_error_code.clear();
            s_snapshot.last_error_message.clear();
        }
        NotifyLocked();
    }
    return save_result.clip_saved;
}

}  // namespace

esp_err_t Init()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_initialized) {
        return ESP_OK;
    }

    s_initialized = true;
    s_snapshot.initialized = recording_service::IsInitialized();
    s_snapshot.max_recording_ms = recording_service::GetUiState().max_recording_ms;
    ResetToIdleLocked();
    return ESP_OK;
}

void SetEventHandler(EventHandler handler, void* context)
{
    std::lock_guard<std::mutex> lock(s_mutex);
    s_event_handler = handler;
    s_event_context = context;
}

Snapshot GetSnapshot()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    return s_snapshot;
}

void SetNetworkConnected(bool connected)
{
    s_network_connected.store(connected, std::memory_order_relaxed);
}

const std::array<TagOption, 5>& TagOptions()
{
    return kTagOptions;
}

bool BeginArchivedTranscription(const std::string& recording_id)
{
    if (Init() != ESP_OK || recording_id.empty()) {
        return false;
    }

    // Reuse the recording->transcription pipeline for an already-archived clip: load its WAV
    // back into memory, hand it to the same transcription service, and let the existing
    // HandleTranscriptionEvent path save the transcript and drive the toasts.
    if (transcription_service::GetSnapshot().request_in_flight) {
        return false;  // a recording or another re-transcribe is already running
    }

    recording_service::RecordedClipPtr clip = recording_archive_service::LoadClip(recording_id);
    if (!clip || clip->empty()) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kFailed;
        s_snapshot.request_in_flight = false;
        s_snapshot.last_status_message = i18n::Tr("Couldn't load recording audio", "Impossibile caricare l'audio");
        s_snapshot.last_error_code = "clip_load_failed";
        s_snapshot.last_error_message = "Failed to read WAV from SD";
        NotifyLocked();
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.clip_saved = true;  // the recording already lives on SD
        s_snapshot.transcript_saved = false;
        s_pending_recording_id = recording_id;
    }

    if (transcription_service::BeginTranscription(clip)) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kTranscribing;
        s_snapshot.request_in_flight = true;
        s_snapshot.last_status_message = TranscribingStatus();
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        NotifyLocked();
        return true;
    }

    // Couldn't start (e.g. Gemini not ready): surface the transcription error as a failure.
    const transcription_service::Snapshot ts = transcription_service::GetSnapshot();
    std::lock_guard<std::mutex> lock(s_mutex);
    s_snapshot.phase = Phase::kFailed;
    s_snapshot.request_in_flight = false;
    s_snapshot.last_status_message =
        ts.last_status_message.empty() ? i18n::Tr("Transcription unavailable", "Trascrizione non disponibile") : ts.last_status_message;
    s_snapshot.last_error_code = ts.last_error_code;
    s_snapshot.last_error_message = ts.last_error_message;
    s_pending_recording_id.clear();
    NotifyLocked();
    return false;
}

bool HandlePowerPressDown(const Context& context)
{
    if (Init() != ESP_OK) {
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        // No new take while the previous one is still being cued, replayed, or resolved.
        if (s_snapshot.phase == Phase::kStartCue || s_snapshot.phase == Phase::kStopCue ||
            s_snapshot.phase == Phase::kPlayingBack ||
            s_snapshot.phase == Phase::kAwaitingTagSelection ||
            s_snapshot.phase == Phase::kTranscribing) {
            return false;
        }

        const BlockedReason blocked_reason = EvaluateBlockedReason(context);
        if (blocked_reason != BlockedReason::kNone) {
            MarkBlockedLocked(blocked_reason);
            NotifyLocked();
            return false;
        }
    }

    const esp_err_t err = recording_service::Arm();
    std::lock_guard<std::mutex> lock(s_mutex);
    if (err != ESP_OK) {
        s_snapshot.phase = Phase::kFailed;
        s_snapshot.allowed = false;
        s_snapshot.blocked_reason = BlockedReason::kRecorderUnavailable;
        s_snapshot.last_status_message = i18n::Tr("Recorder unavailable", "Registratore non disponibile");
        s_snapshot.last_error_code = "record_arm_failed";
        s_snapshot.last_error_message = esp_err_to_name(err);
        NotifyLocked();
        return false;
    }

    ResetToIdleLocked();
    s_snapshot.phase = Phase::kArmed;
    s_snapshot.allowed = true;
    s_snapshot.last_status_message = ArmedStatus();
    NotifyLocked();
    return true;
}

bool HandlePowerLongPressStart(const Context& context)
{
    if (Init() != ESP_OK) {
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        const BlockedReason blocked_reason = EvaluateBlockedReason(context);
        if (blocked_reason != BlockedReason::kNone) {
            MarkBlockedLocked(blocked_reason);
            NotifyLocked();
            return false;
        }
        if (s_snapshot.phase != Phase::kArmed) {
            return false;
        }
    }

    // Capture starts before the cue, not after it: waiting for the cue to finish would
    // swallow the first word. The cue overlaps the opening moments of the take.
    const esp_err_t err = recording_service::Start(recording_service::StartMode::kFresh);
    uint32_t cue_token = 0;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (err != ESP_OK) {
            s_snapshot.phase = Phase::kFailed;
            s_snapshot.last_status_message = i18n::Tr("Recording failed to start", "Impossibile avviare la registrazione");
            s_snapshot.last_error_code = "record_start_failed";
            s_snapshot.last_error_message = esp_err_to_name(err);
            NotifyLocked();
            return false;
        }

        cue_token = ++s_cue_token;
        s_snapshot.phase = Phase::kStartCue;
        s_snapshot.last_status_message = StartCueStatus();
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        NotifyLocked();
    }

    SystemSoundService::GetInstance().PlayCue(
        SoundCue::kSpeaking, [cue_token](SoundCuePlaybackResult result) {
            HandleStartCueResult(cue_token, result);
        });
    return true;
}

bool HandlePowerPressUp(const Context&)
{
    if (Init() != ESP_OK) {
        return false;
    }

    Phase phase = Phase::kIdle;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        phase = s_snapshot.phase;
    }

    if (phase == Phase::kArmed) {
        (void)recording_service::Cancel();
        std::lock_guard<std::mutex> lock(s_mutex);
        ResetToIdleLocked();
        NotifyLocked();
        return true;
    }

    // Released while the start cue is still playing: capture is already running, but the
    // cue owns the transition out of kStartCue. Defer the finish rather than dropping it,
    // otherwise a hold barely longer than the cue would record forever.
    if (phase == Phase::kStartCue) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_finish_pending_after_start_cue = true;
        return true;
    }

    if (phase != Phase::kRecording) {
        return false;
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kSaving;
        s_snapshot.last_status_message = i18n::Tr("Preparing recording", "Preparazione registrazione");
        NotifyLocked();
    }
    (void)recording_service::Finish();
    return true;
}

bool SubmitTagSelection(int selected_index)
{
    if (Init() != ESP_OK) {
        return false;
    }

    if (selected_index < 0 || selected_index >= static_cast<int>(kTagOptions.size())) {
        return false;
    }

    ESP_LOGI(kTag,
             "Recording tag selection submitted: index=%d label=%.*s",
             selected_index,
             static_cast<int>(kTagOptions[static_cast<size_t>(selected_index)].label_text.size()),
             kTagOptions[static_cast<size_t>(selected_index)].label_text.data());

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (s_snapshot.phase != Phase::kAwaitingTagSelection) {
            return false;
        }
    }

    if (kTagOptions[static_cast<size_t>(selected_index)].is_discard) {
        recording_service::DiscardClip();
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.phase = Phase::kComplete;
        s_snapshot.has_clip = false;
        s_snapshot.clip_saved = false;
        s_snapshot.transcript_saved = false;
        s_snapshot.last_status_message = DiscardedStatus();
        s_snapshot.last_error_code.clear();
        s_snapshot.last_error_message.clear();
        NotifyLocked();
        return true;
    }

    if (kTagOptions[static_cast<size_t>(selected_index)].is_topic) {
        // Never archived -- transcribed straight from the in-memory clip and distilled into a
        // topic name on gemini_service's worker task (Transcribe/GenerateText are blocking HTTP
        // calls and must not run on the caller's task). The clip is handed to the worker job and
        // discarded from recording_service immediately after, same as the normal transcribe path
        // does right after transcription_service::BeginTranscription accepts a clip.
        recording_service::RecordedClipPtr clip = recording_service::GetRecordedClip();
        recording_service::DiscardClip();
        {
            std::lock_guard<std::mutex> lock(s_mutex);
            s_snapshot.phase = Phase::kComplete;
            s_snapshot.has_clip = false;
            s_snapshot.clip_saved = false;
            s_snapshot.transcript_saved = false;
            s_snapshot.last_topic_action = TopicActionState::kInProgress;
            s_snapshot.last_status_message = AddingTopicStatus();
            s_snapshot.last_error_code.clear();
            s_snapshot.last_error_message.clear();
            NotifyLocked();
        }
        gemini_service::RunOnWorker(
            [clip]() mutable { ProcessTopicFromRecording(std::move(clip)); });
        return true;
    }

    return SaveAndTranscribeClip(kTagOptions[static_cast<size_t>(selected_index)].tag,
                                 /*auto_classify=*/false);
}

void HandleRecordingEvent(const recording_service::Event& event)
{
    if (Init() != ESP_OK) {
        return;
    }

    recording_service::RecordedClipPtr clip = nullptr;
    bool should_show_tag_selection = false;
    GuardrailResult guardrail = {};
    bool discard_invalid_clip = false;
    bool queue_stop_cue = false;
    uint32_t cue_token = 0;

    if (event.state == recording_service::State::kClipReady && event.ui_state.has_clip) {
        clip = recording_service::GetRecordedClip();
        if (clip) {
            guardrail = ValidateClip(*clip, event.ui_state.duration_ms);
            should_show_tag_selection = guardrail.accepted;
        }
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        SyncRecordingStateLocked(event.ui_state);
        s_snapshot.request_in_flight = transcription_service::GetSnapshot().request_in_flight;

        if (event.state == recording_service::State::kArmed && s_snapshot.phase == Phase::kIdle) {
            s_snapshot.phase = Phase::kArmed;
            s_snapshot.last_status_message = ArmedStatus();
        } else if (event.state == recording_service::State::kRecording) {
            // Leave kStartCue alone -- HandleStartCueResult owns that transition, and
            // overwriting it here would drop the cue phase the moment capture engages.
            if (s_snapshot.phase != Phase::kStartCue) {
                s_snapshot.phase = Phase::kRecording;
                s_snapshot.last_status_message = RecordingStatus();
            }
        } else if (event.state == recording_service::State::kClipReady) {
            if (should_show_tag_selection) {
                // Stop cue first, then playback, then the tag menu. HandleStopCueResult
                // drives the rest; queue_stop_cue defers the PlayCue call until the lock
                // is released so the callback cannot deadlock on a fast cue.
                cue_token = ++s_cue_token;
                queue_stop_cue = true;
                s_snapshot.phase = Phase::kStopCue;
                s_snapshot.last_status_message = StopCueStatus();
                s_snapshot.last_error_code.clear();
                s_snapshot.last_error_message.clear();
            } else {
                discard_invalid_clip = true;
                s_snapshot.phase = Phase::kFailed;
                s_snapshot.has_clip = false;
                s_snapshot.last_status_message = guardrail.status_message;
                s_snapshot.last_error_code = guardrail.error_code;
                s_snapshot.last_error_message = guardrail.status_message;
            }
        }

        NotifyLocked();
    }
    if (discard_invalid_clip) {
        recording_service::DiscardClip();
    }
    if (queue_stop_cue) {
        SystemSoundService::GetInstance().PlayCue(
            SoundCue::kInterrupt, [cue_token](SoundCuePlaybackResult result) {
                HandleStopCueResult(cue_token, result);
            });
    }
}

void HandleTranscriptionEvent(const transcription_service::Event& event)
{
    if (Init() != ESP_OK) {
        return;
    }

    bool should_attach_transcript = false;
    bool auto_classify = false;
    std::string pending_recording_id;
    std::string transcript_text;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.request_in_flight = event.snapshot.request_in_flight;
        if (s_snapshot.phase == Phase::kTranscribing && !event.snapshot.request_in_flight &&
            !event.snapshot.last_transcript.empty() && !s_pending_recording_id.empty()) {
            should_attach_transcript = true;
            pending_recording_id = s_pending_recording_id;
            transcript_text = event.snapshot.last_transcript;
            auto_classify = !s_auto_classify_recording_id.empty() &&
                            s_auto_classify_recording_id == s_pending_recording_id;
        }
    }

    if (should_attach_transcript && auto_classify) {
        ApplyAutoClassification(pending_recording_id, transcript_text);
        return;
    }

    if (should_attach_transcript) {
        ESP_LOGI(kTag,
                 "Attaching transcript to saved recording: id=%s chars=%u",
                 pending_recording_id.c_str(),
                 static_cast<unsigned>(transcript_text.size()));
        const recording_archive_service::SaveResult save_result =
            recording_archive_service::SaveTranscript(pending_recording_id, transcript_text);
        ESP_LOGI(kTag,
                 "Transcript save result: success=%d transcript_saved=%d metadata_saved=%d transcript=%s metadata=%s error=%s",
                 save_result.success ? 1 : 0,
                 save_result.transcript_saved ? 1 : 0,
                 save_result.metadata_saved ? 1 : 0,
                 save_result.transcript_path.empty() ? "<none>" : save_result.transcript_path.c_str(),
                 save_result.metadata_path.empty() ? "<none>" : save_result.metadata_path.c_str(),
                 save_result.error_code.empty() ? "<none>" : save_result.error_code.c_str());
        if (!save_result.transcript_saved) {
            // A transcript came back from Gemini but saving it failed (e.g. SD write) --
            // persist that as the recording's failure reason. SD I/O, so done here, outside
            // any lock.
            (void)recording_archive_service::SaveTranscriptionFailure(pending_recording_id,
                                                                       save_result.error_message);
        }
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.transcript_saved = save_result.transcript_saved;
        s_snapshot.last_saved_transcript_path = save_result.transcript_path;
        s_snapshot.last_transcript = transcript_text;
        s_snapshot.phase = Phase::kComplete;
        s_snapshot.request_in_flight = false;
        s_snapshot.last_status_message = save_result.transcript_saved
                                             ? i18n::Tr("Transcript saved to SD", "Trascrizione salvata su SD")
                                             : SavedWithoutTranscriptStatus();
        if (save_result.transcript_saved) {
            s_snapshot.last_error_code = save_result.error_code;
            s_snapshot.last_error_message = save_result.error_message;
        } else {
            s_snapshot.last_error_code = event.snapshot.last_error_code;
            s_snapshot.last_error_message = event.snapshot.last_error_message;
        }
        s_pending_recording_id.clear();
        NotifyLocked();
        return;
    }

    bool transcription_failed = false;
    std::string failed_recording_id;
    std::string failure_message;
    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (s_snapshot.phase == Phase::kTranscribing && !event.snapshot.request_in_flight) {
            s_snapshot.phase = s_snapshot.clip_saved ? Phase::kComplete : Phase::kFailed;
            s_snapshot.last_status_message = s_snapshot.clip_saved
                                                 ? SavedWithoutTranscriptStatus()
                                                 : i18n::Tr("Transcription failed", "Trascrizione non riuscita");
            s_snapshot.last_error_code = event.snapshot.last_error_code;
            s_snapshot.last_error_message = event.snapshot.last_error_message;
            transcription_failed = !s_pending_recording_id.empty();
            failed_recording_id = s_pending_recording_id;
            s_auto_classify_recording_id.clear();
            failure_message = event.snapshot.last_error_message.empty()
                                  ? s_snapshot.last_status_message
                                  : event.snapshot.last_error_message;
            s_pending_recording_id.clear();
        }
        NotifyLocked();
    }
    if (transcription_failed) {
        // The recording was already saved to SD (has_clip/clip_saved) with no transcript --
        // persist why, so it's visible later instead of only in this transient toast. SD I/O,
        // so done here, outside the lock.
        (void)recording_archive_service::SaveTranscriptionFailure(failed_recording_id,
                                                                   failure_message);
    }
}

const char* PhaseName(Phase phase)
{
    switch (phase) {
        case Phase::kArmed:
            return "armed";
        case Phase::kStartCue:
            return "start_cue";
        case Phase::kRecording:
            return "recording";
        case Phase::kStopCue:
            return "stop_cue";
        case Phase::kPlayingBack:
            return "playing_back";
        case Phase::kAwaitingTagSelection:
            return "awaiting_tag_selection";
        case Phase::kSaving:
            return "saving";
        case Phase::kTranscribing:
            return "transcribing";
        case Phase::kComplete:
            return "complete";
        case Phase::kFailed:
            return "failed";
        case Phase::kIdle:
        default:
            return "idle";
    }
}

}  // namespace recording_session_service
