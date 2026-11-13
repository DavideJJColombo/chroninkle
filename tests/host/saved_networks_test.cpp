// Host-side (PC) tests for the saved Wi-Fi networks list (components/wifi_service/saved_networks).
#include <cstdio>
#include <string>
#include <vector>

#include "saved_networks.h"

using namespace wifi_saved_networks;

static int failures = 0;
#define CHECK(cond)                                                             \
    do {                                                                        \
        if (!(cond)) {                                                          \
            std::fprintf(stderr, "FAIL %s:%d %s\n", __FILE__, __LINE__, #cond); \
            ++failures;                                                         \
        }                                                                       \
    } while (0)

int main()
{
    std::vector<Network> list;
    Remember(&list, {"Casa", "pw1"});
    Remember(&list, {"Ufficio", "pw2"});
    Remember(&list, {"Casa", "pw1-new"});  // refreshed: back on top, password updated
    CHECK(list.size() == 2 && list[0].ssid == "Casa" && list[0].password == "pw1-new");
    for (int i = 0; i < 6; ++i) {
        Remember(&list, {"Net" + std::to_string(i), ""});
    }
    CHECK(list.size() == kMaxNetworks);           // oldest dropped
    CHECK(list.front().ssid == "Net5");
    CHECK(Find(list, "Casa") == nullptr);
    Remember(&list, {"", "x"});                   // invalid: ignored
    Remember(&list, {std::string(33, 'a'), ""});  // SSID too long: ignored
    CHECK(list.front().ssid == "Net5");

    // Round trip through the NVS blob, including a password with spaces and accents.
    std::vector<Network> saved = {{"Casa Rossi", "pass word \xC3\xA8"}, {"Hotspot", ""}};
    const std::vector<uint8_t> blob = Serialize(saved);
    std::vector<Network> loaded;
    CHECK(Deserialize(blob.data(), blob.size(), &loaded));
    CHECK(loaded.size() == 2 && loaded[0].ssid == "Casa Rossi" &&
          loaded[0].password == "pass word \xC3\xA8" && loaded[1].password.empty());
    std::vector<uint8_t> truncated(blob.begin(), blob.end() - 3);
    CHECK(!Deserialize(truncated.data(), truncated.size(), &loaded));
    const uint8_t wrong_version[] = {9, 0};
    CHECK(!Deserialize(wrong_version, sizeof(wrong_version), &loaded));

    // Forget.
    CHECK(Forget(&saved, "Hotspot") && saved.size() == 1);
    CHECK(!Forget(&saved, "Hotspot"));

    // Choosing: strongest visible saved network; recent wins a tie; none visible -> -1.
    const std::vector<Network> mine = {{"Casa", ""}, {"Ufficio", ""}, {"Hotspot", ""}};
    CHECK(ChooseBest(mine, {{"Vicino", -30}, {"Ufficio", -60}, {"Casa", -75}}) == 1);
    CHECK(ChooseBest(mine, {{"Hotspot", -50}, {"Casa", -50}}) == 0);
    CHECK(ChooseBest(mine, {{"Ufficio", -80}, {"Ufficio", -40}, {"Casa", -50}}) == 1);
    CHECK(ChooseBest(mine, {{"Vicino", -30}}) == -1);
    CHECK(ChooseBest({}, {{"Casa", -30}}) == -1);

    std::printf(failures == 0 ? "ALL CHECKS PASSED (saved_networks)\n" : "%d CHECKS FAILED\n",
                failures);
    return failures == 0 ? 0 : 1;
}
