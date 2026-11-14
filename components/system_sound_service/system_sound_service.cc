#include "system_sound_service_internal.h"

#include <atomic>

using system_sound_service_internal::SystemSoundServiceImpl;

namespace {
std::atomic<bool> s_muted{false};
}  // namespace

SystemSoundService& SystemSoundService::GetInstance() {
    static SystemSoundService instance;
    return instance;
}

void SystemSoundService::Initialize(AudioCodec* codec) {
    SystemSoundServiceImpl::GetInstance().Initialize(codec);
}

void SystemSoundService::PlayCue(SoundCue cue) {
    if (s_muted.load(std::memory_order_relaxed)) {
        return;
    }
    SystemSoundServiceImpl::GetInstance().PlayCue(cue);
}

void SystemSoundService::PlayCue(SoundCue cue,
                                 std::function<void(SoundCuePlaybackResult)> on_complete) {
    if (s_muted.load(std::memory_order_relaxed)) {
        if (on_complete) {
            on_complete(SoundCuePlaybackResult::kCompleted);
        }
        return;
    }
    SystemSoundServiceImpl::GetInstance().PlayCue(cue, std::move(on_complete));
}

void SystemSoundService::SetMuted(bool muted) {
    s_muted.store(muted, std::memory_order_relaxed);
}

bool SystemSoundService::IsMuted() const {
    return s_muted.load(std::memory_order_relaxed);
}
