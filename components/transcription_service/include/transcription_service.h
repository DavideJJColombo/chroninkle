#ifndef TRANSCRIPTION_SERVICE_H_
#define TRANSCRIPTION_SERVICE_H_

#include <cstdint>
#include <string>

#include "esp_err.h"
#include "gemini_service.h"
#include "recording_service.h"

namespace transcription_service {

struct Snapshot {
    bool initialized = false;
    bool provider_ready = false;
    bool request_in_flight = false;
    int last_http_status = 0;
    std::string last_status_message = {};
    std::string last_error_code = {};
    std::string last_error_message = {};
    std::string last_transcript = {};
};

struct Event {
    Snapshot snapshot = {};
};

using EventHandler = void (*)(const Event& event, void* context);

esp_err_t Init();
void SetEventHandler(EventHandler handler, void* context);
Snapshot GetSnapshot();
// `options` (custom prompt / JSON schema) is passed through to gemini_service::Transcribe; with
// a schema, Snapshot::last_transcript holds Gemini's JSON text instead of plain transcript.
bool BeginTranscription(recording_service::RecordedClipPtr clip,
                        const gemini_service::TranscribeOptions& options = {});

}  // namespace transcription_service

#endif  // TRANSCRIPTION_SERVICE_H_
