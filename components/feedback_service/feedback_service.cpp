#include "feedback_service.h"

#include "esp_log.h"
#include "waveshare_board.h"
#include "system_sound_service.h"

namespace feedback_service {
namespace {

constexpr const char* kTag = "FeedbackService";

// Maps a feedback event onto the closest system-sound cue (played through the
// ES8311 codec). There is no dedicated buzzer on this board.
SoundCue CueForEvent(FeedbackEvent event)
{
    switch (event) {
        case FeedbackEvent::kStartup:
            return SoundCue::kStartup;
        case FeedbackEvent::kGeminiConnected:
            return SoundCue::kOnline;
        case FeedbackEvent::kLock:
            return SoundCue::kLock;
        case FeedbackEvent::kUnlock:
            return SoundCue::kUnlock;
        case FeedbackEvent::kRecordingStart:
            return SoundCue::kButtonActivate;
        case FeedbackEvent::kModalOpen:
            return SoundCue::kModalNotification;
        case FeedbackEvent::kButtonClick:
        case FeedbackEvent::kButtonDoubleClick:
        case FeedbackEvent::kButtonLongPress:
            return SoundCue::kButtonActivate;
        case FeedbackEvent::kShutdown:
            return SoundCue::kModalNotification;
        case FeedbackEvent::kError:
        default:
            return SoundCue::kInterrupt;
    }
}

}  // namespace

esp_err_t Init()
{
    AudioCodec* codec = waveshare_board::GetAudioCodec();
    if (codec == nullptr) {
        ESP_LOGW(kTag, "Audio codec unavailable; feedback cues disabled");
        return ESP_ERR_NOT_FOUND;
    }

    // Starts the sound-service playback task and warms (decodes) the cue cache.
    SystemSoundService::GetInstance().Initialize(codec);
    ESP_LOGI(kTag, "Feedback service initialized (audio cues via ES8311)");
    return ESP_OK;
}

void ApplyVolumeLevel(int level)
{
    // esp_codec_dev maps 0..100 linearly onto -50..0 dB: 12 points = 6 dB per level.
    static constexpr int kCodecVolume[] = {0, 52, 64, 76, 88, 100};
    const int clamped = level < 0 ? 0 : (level > 5 ? 5 : level);
    SystemSoundService::GetInstance().SetMuted(clamped == 0);
    if (clamped > 0) {
        AudioCodec* codec = waveshare_board::GetAudioCodec();
        if (codec != nullptr) {
            codec->SetOutputVolume(kCodecVolume[clamped]);
        }
    }
    ESP_LOGI(kTag, "Volume level %d%s", clamped, clamped == 0 ? " (muted)" : "");
}

void PlayVolumePreview()
{
    SystemSoundService::GetInstance().PlayCue(SoundCue::kVolume);
}

esp_err_t Play(FeedbackEvent event)
{
    SystemSoundService::GetInstance().PlayCue(CueForEvent(event));
    return ESP_OK;
}

}  // namespace feedback_service
