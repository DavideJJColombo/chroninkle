#include "transcription_service.h"

#include "i18n.h"

#include <mutex>
#include <string>
#include <utility>

#include "esp_log.h"
#include "gemini_service.h"

namespace transcription_service {
namespace {

constexpr const char* kTag = "TranscriptionSvc";

std::mutex s_mutex;
EventHandler s_event_handler = nullptr;
void* s_event_context = nullptr;
bool s_initialized = false;
bool s_request_in_flight = false;
int s_last_http_status = 0;
std::string s_last_status_message = {};
std::string s_last_error_code = {};
std::string s_last_error_message = {};
std::string s_last_transcript = {};

Snapshot BuildSnapshotLocked()
{
    Snapshot snapshot = {};
    snapshot.initialized = s_initialized;
    snapshot.provider_ready = gemini_service::GetSnapshot().runtime.ready;
    snapshot.request_in_flight = s_request_in_flight;
    snapshot.last_http_status = s_last_http_status;
    snapshot.last_status_message = s_last_status_message;
    snapshot.last_error_code = s_last_error_code;
    snapshot.last_error_message = s_last_error_message;
    snapshot.last_transcript = s_last_transcript;
    return snapshot;
}

void NotifyLocked()
{
    EventHandler handler = s_event_handler;
    void* context = s_event_context;
    if (handler == nullptr) {
        return;
    }
    const Event event = {
        .snapshot = BuildSnapshotLocked(),
    };
    handler(event, context);
}

// Runs the (blocking) Gemini audio transcription and publishes the result. The Gemini HTTP now
// lives in gemini_service::Transcribe; this service owns the async lifecycle + snapshot/events.
// Runs on gemini_service's shared worker task (see gemini_service::RunOnWorker).
void RunTranscriptionJob(recording_service::RecordedClipPtr clip,
                         const gemini_service::TranscribeOptions& options)
{
    if (!clip || clip->empty()) {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_request_in_flight = false;
        s_last_http_status = 0;
        s_last_status_message = i18n::Tr("Transcription failed", "Trascrizione non riuscita");
        s_last_error_code = "empty_audio";
        s_last_error_message = i18n::Tr("No recorded audio available", "Nessun audio registrato disponibile");
        s_last_transcript.clear();
        NotifyLocked();
        return;
    }

    const gemini_service::TranscriptionResult result = gemini_service::Transcribe(*clip, &options);

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        s_request_in_flight = false;
        s_last_http_status = result.http_status;
        if (result.success) {
            s_last_status_message = i18n::Tr("Transcript ready", "Trascrizione pronta");
            s_last_error_code.clear();
            s_last_error_message.clear();
            s_last_transcript = result.transcript;
            ESP_LOGI(kTag,
                     "Gemini transcription succeeded: chars=%u wav_bytes=%u clip_ms=%u "
                     "upload_chunks=%u upload_elapsed_ms=%llu total_elapsed_ms=%llu",
                     static_cast<unsigned>(s_last_transcript.size()),
                     static_cast<unsigned>(result.wav_bytes),
                     static_cast<unsigned>(result.clip_duration_ms),
                     static_cast<unsigned>(result.upload_chunk_count),
                     static_cast<unsigned long long>(result.upload_elapsed_ms),
                     static_cast<unsigned long long>(result.total_elapsed_ms));
        } else {
            s_last_status_message = i18n::Tr("Transcription failed", "Trascrizione non riuscita");
            s_last_error_code = result.error_code;
            s_last_error_message = result.error_message;
            s_last_transcript.clear();
            ESP_LOGW(kTag, "Gemini transcription failed: http=%d code=%s message=%s",
                     result.http_status, s_last_error_code.c_str(), s_last_error_message.c_str());
        }
        NotifyLocked();
    }
}

}  // namespace

esp_err_t Init()
{
    std::lock_guard<std::mutex> lock(s_mutex);
    if (s_initialized) {
        return ESP_OK;
    }

    s_initialized = true;
    s_request_in_flight = false;
    s_last_http_status = 0;
    s_last_status_message = gemini_service::GetSnapshot().runtime.ready
                                ? "Gemini ready for transcription"
                                : "Gemini transcription unavailable";
    s_last_error_code.clear();
    s_last_error_message.clear();
    s_last_transcript.clear();
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
    return BuildSnapshotLocked();
}

bool BeginTranscription(recording_service::RecordedClipPtr clip,
                        const gemini_service::TranscribeOptions& options)
{
    if (Init() != ESP_OK) {
        return false;
    }

    const gemini_service::Snapshot gemini_snapshot = gemini_service::GetSnapshot();
    const std::string api_key = gemini_service::GetEffectiveApiKey();
    if (!gemini_snapshot.runtime.ready) {
        // E.g. Transcribe pressed after an earlier key check failed: check it again, so the
        // next try can work without reconnecting Wi-Fi.
        gemini_service::RetryAuthentication();
    }

    {
        std::lock_guard<std::mutex> lock(s_mutex);
        if (s_request_in_flight) {
            s_last_status_message = i18n::Tr("Transcription already running", "Trascrizione già in corso");
            s_last_error_code = "request_in_flight";
            s_last_error_message = i18n::Tr("A transcription request is already running", "È già in corso una trascrizione");
            NotifyLocked();
            return false;
        }
        if (!gemini_snapshot.runtime.ready || api_key.empty()) {
            s_last_http_status = 0;
            // Say why (missing key, invalid key, no Wi-Fi...) instead of a bare "unavailable".
            const std::string reason = gemini_service::NotReadyReason(gemini_snapshot);
            s_last_status_message =
                reason.empty() ? i18n::Tr("Transcription unavailable", "Trascrizione non disponibile")
                               : reason;
            s_last_error_code = gemini_snapshot.settings.configured ? "provider_not_ready"
                                                                    : "not_configured";
            s_last_error_message = gemini_snapshot.settings.configured
                                       ? i18n::Tr("Gemini is not ready yet", "Gemini non è ancora pronto")
                                       : i18n::Tr("No Gemini API key configured", "Nessuna chiave API Gemini configurata");
            s_last_transcript.clear();
            NotifyLocked();
            return false;
        }
        if (!clip || clip->empty()) {
            s_last_http_status = 0;
            s_last_status_message = i18n::Tr("Transcription unavailable", "Trascrizione non disponibile");
            s_last_error_code = "empty_audio";
            s_last_error_message = i18n::Tr("No recorded audio available", "Nessun audio registrato disponibile");
            s_last_transcript.clear();
            NotifyLocked();
            return false;
        }

        s_request_in_flight = true;
        s_last_http_status = 0;
        s_last_status_message = i18n::Tr("Transcribing recording", "Trascrizione in corso");
        s_last_error_code.clear();
        s_last_error_message.clear();
        s_last_transcript.clear();
        NotifyLocked();
    }

    ESP_LOGI(kTag, "Starting Gemini transcription: samples=%u",
             static_cast<unsigned>(clip->sample_count()));
    gemini_service::RunOnWorker([clip = std::move(clip), options]() mutable {
        RunTranscriptionJob(std::move(clip), options);
    });
    return true;
}

}  // namespace transcription_service
