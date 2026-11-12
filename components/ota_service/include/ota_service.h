#ifndef OTA_SERVICE_H_
#define OTA_SERVICE_H_

#include <cstdint>

#include "esp_http_server.h"

// Firmware update over the setup portal (access-point mode). The portal uploads a firmware
// .bin (the build's build/chroninkle.bin) to the inactive OTA slot; the device verifies it,
// switches the boot slot and restarts. The bootloader's rollback brings the previous firmware
// back if the new one fails before marking itself valid (app_shell does that at boot).
//
// The portal's Wi-Fi is open, so an upload must carry a one-time 6-digit code that the device
// shows on its own screen: whoever updates it has to be holding it.
namespace ota_service {

enum class EventType : uint8_t {
    kCodeIssued,       // `code` is the code to show on the device screen
    kUpdateStarted,
    kUpdateFailed,
    kUpdateSucceeded,  // the device restarts a few seconds later
};

struct Event {
    EventType type = EventType::kCodeIssued;
    uint32_t code = 0;
};

using EventHandler = void (*)(const Event& event, void* context);

void SetEventHandler(EventHandler handler, void* context);

// Adds GET /api/ota/status, POST /api/ota/code and POST /api/ota/upload?code=NNNNNN.
void RegisterPortalRoutes(httpd_handle_t server);

}  // namespace ota_service

#endif  // OTA_SERVICE_H_
