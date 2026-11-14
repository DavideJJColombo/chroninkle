#ifndef SYSTEM_SOUND_SERVICE_H_
#define SYSTEM_SOUND_SERVICE_H_

#include "audio_codec.h"

#include <cstdint>
#include <functional>

enum class SoundCue : uint8_t {
    kNavigationMove = 0,
    kButtonActivate,
    kCharging,
    kComplete,
    kInterrupt,
    kLock,
    kLowBattery,
    kModalNotification,
    kOnline,
    kSpeaking,
    kStartup,
    kToggleOff,
    kToggleOn,
    kUnlock,
    kVolume,
};

enum class SoundCuePlaybackResult : uint8_t {
    kCompleted = 0,
    kDebounced,
    kSuperseded,
    kInterrupted,
    kFailed,
};

class SystemSoundService {
public:
    static SystemSoundService& GetInstance();

    void Initialize(AudioCodec* codec);
    void PlayCue(SoundCue cue);
    void PlayCue(SoundCue cue, std::function<void(SoundCuePlaybackResult)> on_complete);
    // Muted: cues are skipped but still report kCompleted right away, so flows that wait for a
    // cue (e.g. the recording start cue) carry on as if it had played.
    void SetMuted(bool muted);
    bool IsMuted() const;

private:
    SystemSoundService() = default;
};

#endif  // SYSTEM_SOUND_SERVICE_H_
