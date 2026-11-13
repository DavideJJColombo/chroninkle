#!/usr/bin/env bash
# Builds and runs the host-side (PC) tests. Needs only a C++20 compiler (g++ or clang++).
# The auto_classify test also needs cJSON: it uses ESP-IDF's copy ($IDF_PATH) or CJSON_DIR
# (a folder with cJSON.c/cJSON.h), and is skipped when neither is available.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="${TMPDIR:-/tmp}/chroninkle_host_tests"
mkdir -p "$out"
cxx="${CXX:-g++}"

"$cxx" -std=gnu++20 -O1 -Wall -Wextra \
    -I"$root/components/epaper_ui/include" -I"$root/components/design_tokens/include" \
    "$root/tests/host/bitmap_font_test.cpp" \
    "$root/components/epaper_ui/bitmap_font.cpp" \
    "$root/components/epaper_ui/font_renderer.cpp" \
    "$root/components/epaper_ui/generated_epaper_fonts.cpp" \
    -o "$out/bitmap_font_test"
"$out/bitmap_font_test" "$@"

"$cxx" -std=gnu++20 -O1 -Wall -Wextra -I"$root/components/wifi_service" \
    "$root/tests/host/saved_networks_test.cpp" "$root/components/wifi_service/saved_networks.cpp" \
    -o "$out/saved_networks_test"
"$out/saved_networks_test"

cjson_dir="${CJSON_DIR:-${IDF_PATH:+$IDF_PATH/components/json/cJSON}}"
if [ -n "$cjson_dir" ] && [ -f "$cjson_dir/cJSON.c" ]; then
    "${CC:-gcc}" -O1 -c "$cjson_dir/cJSON.c" -o "$out/cJSON.o"
    "$cxx" -std=gnu++20 -O1 -Wall -Wextra \
        -I"$root/components/recording_session_service" -I"$cjson_dir" \
        "$root/tests/host/auto_classify_test.cpp" \
        "$root/components/recording_session_service/auto_classify.cpp" \
        "$out/cJSON.o" -o "$out/auto_classify_test"
    "$out/auto_classify_test"
else
    echo "auto_classify test skipped: set IDF_PATH or CJSON_DIR to a cJSON source folder"
fi
