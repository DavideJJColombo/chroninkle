#ifndef FEEDBACK_SERVICE_H_
#define FEEDBACK_SERVICE_H_

#include "esp_err.h"

namespace feedback_service {

enum class FeedbackEvent {
    kStartup,
    kGeminiConnected,
    kLock,
    kUnlock,
    kRecordingStart,
    kModalOpen,
    kButtonClick,
    kButtonDoubleClick,
    kButtonLongPress,
    kShutdown,
    kError,
};

esp_err_t Init();
esp_err_t Play(FeedbackEvent event);

// Applies Settings > Volume: level 0 mutes the system sounds (cues; a recording played back from
// its details page still plays), 1..5 set the speaker volume in 6 dB steps (5 = full volume).
void ApplyVolumeLevel(int level);
// Plays the volume cue at the current level (a preview after changing it); silent when muted.
void PlayVolumePreview();

}  // namespace feedback_service

#endif  // FEEDBACK_SERVICE_H_
