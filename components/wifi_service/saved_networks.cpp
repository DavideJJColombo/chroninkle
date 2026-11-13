#include "saved_networks.h"

#include <algorithm>

namespace wifi_saved_networks {
namespace {

constexpr uint8_t kBlobVersion = 1;

bool IsStorable(const Network& network)
{
    return !network.ssid.empty() && network.ssid.size() <= kMaxSsidLength &&
           network.password.size() <= kMaxPasswordLength;
}

}  // namespace

std::vector<uint8_t> Serialize(const std::vector<Network>& networks)
{
    std::vector<uint8_t> blob = {kBlobVersion, 0};
    uint8_t count = 0;
    for (const Network& network : networks) {
        if (!IsStorable(network) || count >= kMaxNetworks) {
            continue;
        }
        blob.push_back(static_cast<uint8_t>(network.ssid.size()));
        blob.insert(blob.end(), network.ssid.begin(), network.ssid.end());
        blob.push_back(static_cast<uint8_t>(network.password.size()));
        blob.insert(blob.end(), network.password.begin(), network.password.end());
        ++count;
    }
    blob[1] = count;
    return blob;
}

bool Deserialize(const uint8_t* data, size_t size, std::vector<Network>* networks)
{
    if (data == nullptr || networks == nullptr || size < 2 || data[0] != kBlobVersion) {
        return false;
    }
    std::vector<Network> parsed;
    const uint8_t count = data[1];
    size_t offset = 2;
    const auto read_string = [&](size_t max_length, std::string* out) {
        if (offset >= size) {
            return false;
        }
        const size_t length = data[offset++];
        if (length > max_length || offset + length > size) {
            return false;
        }
        out->assign(reinterpret_cast<const char*>(data + offset), length);
        offset += length;
        return true;
    };
    for (uint8_t i = 0; i < count; ++i) {
        Network network = {};
        if (!read_string(kMaxSsidLength, &network.ssid) ||
            !read_string(kMaxPasswordLength, &network.password)) {
            return false;
        }
        if (!network.ssid.empty() && parsed.size() < kMaxNetworks) {
            parsed.push_back(std::move(network));
        }
    }
    *networks = std::move(parsed);
    return true;
}

void Remember(std::vector<Network>* networks, const Network& network)
{
    if (networks == nullptr || !IsStorable(network)) {
        return;
    }
    Forget(networks, network.ssid);
    networks->insert(networks->begin(), network);
    if (networks->size() > kMaxNetworks) {
        networks->resize(kMaxNetworks);
    }
}

bool Forget(std::vector<Network>* networks, const std::string& ssid)
{
    if (networks == nullptr) {
        return false;
    }
    const auto it = std::find_if(networks->begin(), networks->end(),
                                 [&](const Network& network) { return network.ssid == ssid; });
    if (it == networks->end()) {
        return false;
    }
    networks->erase(it);
    return true;
}

const Network* Find(const std::vector<Network>& networks, const std::string& ssid)
{
    for (const Network& network : networks) {
        if (network.ssid == ssid) {
            return &network;
        }
    }
    return nullptr;
}

int ChooseBest(const std::vector<Network>& saved, const std::vector<VisibleNetwork>& visible)
{
    int best_index = -1;
    int best_rssi = -1000;
    for (size_t i = 0; i < saved.size(); ++i) {
        int strongest = -1000;
        for (const VisibleNetwork& candidate : visible) {
            if (candidate.ssid == saved[i].ssid) {
                strongest = std::max(strongest, candidate.rssi);
            }
        }
        // Strictly stronger wins, so on a tie the earlier (more recent) network is kept.
        if (strongest > -1000 && strongest > best_rssi) {
            best_rssi = strongest;
            best_index = static_cast<int>(i);
        }
    }
    return best_index;
}

}  // namespace wifi_saved_networks
