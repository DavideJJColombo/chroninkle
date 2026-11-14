#include "transcription_retry_service.h"

#include "i18n.h"

#include <atomic>
#include <map>
#include <mutex>
#include <string>
#include <vector>

#include "esp_log.h"
#include "esp_timer.h"
#include "gemini_service.h"
#include "chroninkle_task_config.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "recording_archive_service.h"
#include "recording_service.h"
#include "transcription_service.h"

namespace transcription_retry_service {
namespace {

constexpr const char* kTag = "TranscribeRetry";
// Per-item poll timeout: a transcription is an upload plus a generate call, each bounded by
// gemini_service's own HTTP timeouts; this leaves margin for long recordings and scheduling.
constexpr int64_t kItemTimeoutUs = 200LL * 1000 * 1000;
constexpr int64_t kPollIntervalMs = 250;
// Mirrors details_page_runtime's TranscribeWorker: loading a clip back off SD needs a
// generously sized stack.
constexpr uint32_t kRetryTaskStackWords = 8192;
constexpr const char* kRetryTaskName = "transcribe_retry";
// A recording recorded offline keeps its "to transcribe" mark until Gemini really answers
// for it. Temporary failures (no answer, timeout, Gemini busy or rate-limited) are tried
// again later instead of giving up after one attempt; only these many per recording per boot,
// then the next boot or the Transcribe button can try again.
constexpr int kMaxAttemptsPerBoot = 4;
constexpr uint64_t kRetryLaterUs = 10ULL * 60 * 1000 * 1000;  // next batch in 10 minutes

// Outcome of one recording's attempt.
enum class Outcome {
    kDone,       // transcribed and saved
    kFailed,     // permanent failure: recorded on the note, not retried automatically
    kTryLater,   // temporary failure: stays "to transcribe"
    kStopBatch,  // Gemini not ready / busy with a live recording: stop, try the rest later
};

std::mutex s_mutex;
Snapshot s_snapshot = {};
EventHandler s_event_handler = nullptr;
void* s_event_context = nullptr;
std::atomic<bool> s_batch_in_flight{false};
std::atomic<bool> s_initialized{false};
std::map<std::string, int> s_attempts;  // recording id -> attempts this boot (batch task only)
esp_timer_handle_t s_later_timer = nullptr;

void RetryLaterCallback(void*)
{
    (void)RetryPending();
}

void ScheduleRetryLater()
{
    if (s_later_timer == nullptr) {
        const esp_timer_create_args_t args = {
            .callback = RetryLaterCallback,
            .arg = nullptr,
            .dispatch_method = ESP_TIMER_TASK,
            .name = "transcribe_retry_later",
            .skip_unhandled_events = true,
        };
        if (esp_timer_create(&args, &s_later_timer) != ESP_OK) {
            s_later_timer = nullptr;
            return;
        }
    }
    (void)esp_timer_stop(s_later_timer);
    (void)esp_timer_start_once(s_later_timer, kRetryLaterUs);
}

// Network trouble, timeouts, rate limits and server-side errors go away by themselves.
bool IsTemporaryFailure(const transcription_service::Snapshot& result)
{
    const std::string& code = result.last_error_code;
    const int status = result.last_http_status;
    return code == "transport_error" || code == "request_in_flight" ||
           code == "provider_not_ready" || status == 0 || status == 408 || status == 429 ||
           status >= 500;
}

void MarkFailed(const std::string& recording_id, const std::string& message)
{
    recording_archive_service::ClearPendingTranscription(recording_id);
    recording_archive_service::SaveTranscriptionFailure(recording_id, message);
}

void NotifyLocked()
{
    EventHandler handler = s_event_handler;
    void* context = s_event_context;
    if (handler == nullptr) {
        return;
    }
    const Event event = {.snapshot = s_snapshot};
    handler(event, context);
}

// Retries a single archived recording: load its clip off SD, submit it for transcription, and
// poll transcription_service for completion. Deliberately does not go through
// recording_session_service::BeginArchivedTranscription -- that shares a single-slot phase
// machine with the live recording UI flow, and a background batch running alongside a user
// press-and-hold would corrupt it. This function only touches recording_archive_service and
// transcription_service directly, using transcription_service's own request_in_flight guard as
// the sole serialization point.
Outcome RetryOne(const std::string& recording_id)
{
    if (!gemini_service::GetSnapshot().runtime.ready) {
        // E.g. Wi-Fi just connected and the key check hasn't finished: not this note's fault.
        ESP_LOGI(kTag, "Gemini not ready: retry of %s postponed", recording_id.c_str());
        return Outcome::kStopBatch;
    }
    if (transcription_service::GetSnapshot().request_in_flight) {
        // Something else holds the single transcription slot (most likely a live recording).
        ESP_LOGI(kTag, "Transcription busy: retry of %s postponed", recording_id.c_str());
        return Outcome::kStopBatch;
    }

    recording_service::RecordedClipPtr clip = recording_archive_service::LoadClip(recording_id);
    if (!clip || clip->empty()) {
        ESP_LOGW(kTag, "Retry for %s: clip load failed", recording_id.c_str());
        MarkFailed(recording_id, i18n::Tr("Couldn't read the saved recording",
                                          "Impossibile leggere la registrazione salvata"));
        return Outcome::kFailed;
    }

    if (!transcription_service::BeginTranscription(clip)) {
        ESP_LOGW(kTag, "Retry for %s: BeginTranscription refused", recording_id.c_str());
        return Outcome::kStopBatch;  // busy or not ready after all: keep it for later
    }

    const int64_t deadline_us = esp_timer_get_time() + kItemTimeoutUs;
    while (transcription_service::GetSnapshot().request_in_flight) {
        if (esp_timer_get_time() > deadline_us) {
            ESP_LOGW(kTag, "Retry for %s timed out waiting for transcription", recording_id.c_str());
            return Outcome::kTryLater;
        }
        vTaskDelay(pdMS_TO_TICKS(kPollIntervalMs));
    }

    const transcription_service::Snapshot result = transcription_service::GetSnapshot();
    if (!result.last_error_code.empty() || result.last_transcript.empty()) {
        ESP_LOGW(kTag, "Retry for %s failed: error=%s http=%d", recording_id.c_str(),
                 result.last_error_code.empty() ? "<empty transcript>"
                                                : result.last_error_code.c_str(),
                 result.last_http_status);
        if (!result.last_error_code.empty() && IsTemporaryFailure(result)) {
            return Outcome::kTryLater;
        }
        MarkFailed(recording_id, result.last_error_message.empty()
                                     ? i18n::Tr("Transcription failed", "Trascrizione non riuscita")
                                     : result.last_error_message);
        return Outcome::kFailed;
    }

    const recording_archive_service::SaveResult save_result =
        recording_archive_service::SaveTranscript(recording_id, result.last_transcript);
    if (!save_result.transcript_saved) {
        ESP_LOGW(kTag, "Retry for %s: transcript save failed", recording_id.c_str());
        MarkFailed(recording_id, save_result.error_message);
        return Outcome::kFailed;
    }

    ESP_LOGI(kTag, "Retry succeeded for %s", recording_id.c_str());
    return Outcome::kDone;  // SaveTranscript already clears pending_transcription on success.
}

// Runs on its own dedicated one-shot task -- deliberately NOT on gemini_service's shared
// worker task (see gemini_service::RunOnWorker). RetryOne blocks waiting for each item's
// transcription to finish, but BeginTranscription's actual HTTP work is itself queued onto
// that shared worker; if this batch ran there too, RetryOne's wait would block the very
// task needed to run the work it's waiting on, and every item would time out. Running this
// loop elsewhere lets the shared worker process each queued transcription immediately, while
// BeginTranscription's own request_in_flight guard (set synchronously before it enqueues
// anything) still keeps this from ever running concurrently with a live user transcription.
void RunTranscriptionRetryJob()
{
    esp_err_t status = ESP_OK;
    const std::vector<recording_archive_service::RecordingEntry> entries =
        recording_archive_service::ListRecordings(&status);

    int attempted = 0;
    int succeeded = 0;
    int failed = 0;
    bool retry_later = false;
    if (status == ESP_OK) {
        for (const auto& entry : entries) {
            if (!entry.metadata.pending_transcription) {
                continue;
            }
            int& attempts = s_attempts[entry.recording_id];
            if (attempts >= kMaxAttemptsPerBoot) {
                continue;  // left for the next boot or the Transcribe button
            }
            const Outcome outcome = RetryOne(entry.recording_id);
            if (outcome == Outcome::kStopBatch) {
                retry_later = true;
                break;
            }
            ++attempts;
            attempted++;
            if (outcome == Outcome::kDone) {
                succeeded++;
                s_attempts.erase(entry.recording_id);
            } else if (outcome == Outcome::kTryLater) {
                failed++;
                retry_later = retry_later || attempts < kMaxAttemptsPerBoot;
            } else {
                failed++;
                s_attempts.erase(entry.recording_id);
            }
        }
    } else {
        ESP_LOGW(kTag, "Retry batch aborted: archive listing failed (%s)", esp_err_to_name(status));
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.batch_in_flight = false;
        s_snapshot.last_batch_attempted = attempted;
        s_snapshot.last_batch_succeeded = succeeded;
        s_snapshot.last_batch_failed = failed;
        s_snapshot.last_batch_generation++;
        NotifyLocked();
    }

    ESP_LOGI(kTag, "Retry batch complete: attempted=%d succeeded=%d failed=%d later=%d", attempted,
             succeeded, failed, retry_later ? 1 : 0);
    s_batch_in_flight.store(false, std::memory_order_release);
    if (retry_later) {
        ScheduleRetryLater();
    }
}

void RetryTaskEntry(void*)
{
    RunTranscriptionRetryJob();
    vTaskDelete(nullptr);
}

}  // namespace

esp_err_t Init()
{
    if (s_initialized.exchange(true)) {
        return ESP_OK;
    }
    std::lock_guard<std::mutex> lock(s_mutex);
    s_snapshot.initialized = true;
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

bool RetryPending()
{
    if (Init() != ESP_OK) {
        return false;
    }
    if (recording_archive_service::GetSnapshot().pending_transcription_count == 0) {
        return false;
    }
    if (!gemini_service::GetSnapshot().runtime.ready) {
        // Offline, or the key check is still running: Gemini's ready edge calls this again.
        return false;
    }

    bool expected = false;
    if (!s_batch_in_flight.compare_exchange_strong(expected, true)) {
        return false;  // a batch is already running
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.batch_in_flight = true;
        NotifyLocked();
    }

    const BaseType_t created = xTaskCreatePinnedToCore(
        RetryTaskEntry, kRetryTaskName, kRetryTaskStackWords, nullptr,
        chroninkle_task_config::kPriorityTranscriptionRetry, nullptr, chroninkle_task_config::kAppCore);
    if (created != pdPASS) {
        ESP_LOGW(kTag, "Retry batch task creation failed");
        s_batch_in_flight.store(false, std::memory_order_release);
        std::lock_guard<std::mutex> lock(s_mutex);
        s_snapshot.batch_in_flight = false;
        NotifyLocked();
        return false;
    }
    return true;
}

}  // namespace transcription_retry_service
