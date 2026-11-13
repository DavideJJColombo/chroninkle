#ifndef WIFI_SAVED_NETWORKS_H_
#define WIFI_SAVED_NETWORKS_H_

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>

// The list of Wi-Fi networks the device remembers (most recently connected first) and the
// choice of which one to join. Pure logic with no ESP-IDF dependencies, so it is covered by the
// host tests in tests/host; wifi_service keeps it in NVS and feeds it scan results.
namespace wifi_saved_networks {

inline constexpr size_t kMaxNetworks = 5;
inline constexpr size_t kMaxSsidLength = 32;
inline constexpr size_t kMaxPasswordLength = 64;

struct Network {
    std::string ssid = {};
    std::string password = {};
};

struct VisibleNetwork {
    std::string ssid = {};
    int rssi = -127;
};

// Compact NVS blob: version byte, count, then length-prefixed ssid/password pairs.
std::vector<uint8_t> Serialize(const std::vector<Network>& networks);
bool Deserialize(const uint8_t* data, size_t size, std::vector<Network>* networks);

// Adds or refreshes a network as the most recent one; the oldest falls off past kMaxNetworks.
void Remember(std::vector<Network>* networks, const Network& network);
bool Forget(std::vector<Network>* networks, const std::string& ssid);
const Network* Find(const std::vector<Network>& networks, const std::string& ssid);

// Index into `saved` of the saved network to join: the strongest one currently visible, the
// more recently used one on a tie. -1 when none of them is in range.
int ChooseBest(const std::vector<Network>& saved, const std::vector<VisibleNetwork>& visible);

}  // namespace wifi_saved_networks

#endif  // WIFI_SAVED_NETWORKS_H_
