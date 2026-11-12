#ifndef APP_STATE_SERVICE_H_
#define APP_STATE_SERVICE_H_

namespace app_state_service {

// Persisted first-run flag. Device/firmware state (not tied to the SD card), so it
// survives an SD format; a future Settings action can clear it to replay onboarding.
bool OnboardingViewed();
void MarkOnboardingViewed();

// Automatic classification of new recordings by Gemini (type, topic, todos and deadlines) instead
// of the "Save recording as" menu. On by default; persisted in NVS.
bool AutoClassifyEnabled();
void SetAutoClassifyEnabled(bool enabled);

}  // namespace app_state_service

#endif  // APP_STATE_SERVICE_H_
