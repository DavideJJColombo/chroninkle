#!/usr/bin/env bash
# Builds and runs the host-side (PC) tests. Needs only a C++20 compiler (g++ or clang++).
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
out="${TMPDIR:-/tmp}/chroninkle_host_tests"
mkdir -p "$out"
"${CXX:-g++}" -std=gnu++20 -O1 -Wall -Wextra \
    -I"$root/components/epaper_ui/include" -I"$root/components/design_tokens/include" \
    "$root/tests/host/bitmap_font_test.cpp" \
    "$root/components/epaper_ui/bitmap_font.cpp" \
    "$root/components/epaper_ui/font_renderer.cpp" \
    "$root/components/epaper_ui/generated_epaper_fonts.cpp" \
    -o "$out/bitmap_font_test"
"$out/bitmap_font_test" "$@"
