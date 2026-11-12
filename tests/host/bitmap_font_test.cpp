// Host-side (PC) tests for the UTF-8 text rendering path -- no ESP-IDF or hardware needed.
// Run: tests/host/run.sh            (optionally: tests/host/run.sh preview.pgm  to also
// render a sample screen of accented Italian text to a PGM image for a visual check).
#include <cassert>
#include <cstdio>
#include <string>
#include <vector>

#include "epaper_ui/font_renderer.h"

using epaper_font::DecodeUtf8;
using epaper_font::IsUtf8Boundary;
using epaper_font::PreviousUtf8Boundary;

static int failures = 0;
#define CHECK(cond)                                                     \
    do {                                                                \
        if (!(cond)) {                                                  \
            std::fprintf(stderr, "FAIL %s:%d %s\n", __FILE__, __LINE__, #cond); \
            ++failures;                                                 \
        }                                                               \
    } while (0)

int main(int argc, char** argv)
{
    // Decoding
    {
        std::string s = "a\xC3\xA8\xE2\x80\x99\xE2\x82\xAC";  // a è ’ €
        size_t i = 0;
        CHECK(DecodeUtf8(s, &i) == 'a' && i == 1);
        CHECK(DecodeUtf8(s, &i) == 0xE8 && i == 3);
        CHECK(DecodeUtf8(s, &i) == 0x2019 && i == 6);
        CHECK(DecodeUtf8(s, &i) == 0x20AC && i == 9);
        // Lone Latin-1 byte (legacy file) decodes as itself; CP1252 0x80 -> euro.
        std::string latin = "citt\xE0 \x80";
        i = 4;
        CHECK(DecodeUtf8(latin, &i) == 0xE0 && i == 5);
        i = 6;
        CHECK(DecodeUtf8(latin, &i) == 0x20AC && i == 7);
        // Truncated sequence at the end consumes one byte.
        std::string cut = "x\xC3";
        i = 1;
        DecodeUtf8(cut, &i);
        CHECK(i == 2);
    }
    // Boundaries
    {
        std::string s = "p\xC3\xB9";  // più (p, ù)
        CHECK(IsUtf8Boundary(s, 0));
        CHECK(IsUtf8Boundary(s, 1));
        CHECK(!IsUtf8Boundary(s, 2));
        CHECK(IsUtf8Boundary(s, 3));
        CHECK(PreviousUtf8Boundary(s, 3) == 1);
        CHECK(PreviousUtf8Boundary(s, 1) == 0);
        CHECK(PreviousUtf8Boundary("abc", 3) == 2);
        std::string euro = "\xE2\x82\xAC";
        CHECK(PreviousUtf8Boundary(euro, 3) == 0);
    }
    // Slots and fallbacks
    {
        CHECK(epaper_font::CodepointToSlot('A') == 'A');
        CHECK(epaper_font::CodepointToSlot(0xE8) == 0xE8);
        CHECK(epaper_font::CodepointToSlot(0x2019) == 0x92);
        CHECK(epaper_font::CodepointToSlot(0x20AC) == 0x80);
        CHECK(epaper_font::CodepointToSlot(0x7F) == -1);
        CHECK(epaper_font::CodepointToSlot(0x1F600) == -1);
        CHECK(epaper_font::AsciiFallback(0xE8) == "e");
        CHECK(epaper_font::AsciiFallback(0xC0) == "A");
        CHECK(epaper_font::AsciiFallback(0xFF) == "y");
        CHECK(epaper_font::AsciiFallback(0x2026) == "...");
    }
    // Measuring: ASCII widths unchanged; accented letter as wide as its glyph, one glyph.
    {
        const auto& f = epaper_fonts::kInter22SemiBold;
        CHECK(f.last_char == 255);
        CHECK(epaper_fonts::kInter165Black.last_char == 126);
        const int e = epaper_font::MeasureText(f, "e");
        const int egrave = epaper_font::MeasureText(f, "\xC3\xA8");
        CHECK(egrave > 0 && egrave <= e + 2);
        // Emoji (unsupported) renders as a single '?', not one per byte.
        CHECK(epaper_font::MeasureText(f, "\xF0\x9F\x98\x80") == epaper_font::MeasureText(f, "?"));
        // The clock font has no accents: falls back to the base letter.
        CHECK(epaper_font::MeasureText(epaper_fonts::kInter165Black, "\xC3\xA8") ==
              epaper_font::MeasureText(epaper_fonts::kInter165Black, "e"));
        // Text after a line break is not measured.
        CHECK(epaper_font::MeasureText(f, "ab\ncd") == epaper_font::MeasureText(f, "ab"));
    }

    if (argc < 2) {
        std::printf(failures == 0 ? "ALL CHECKS PASSED\n" : "%d CHECKS FAILED\n", failures);
        return failures == 0 ? 0 : 1;
    }

    // Rendered preview
    const int W = 800, H = 480;
    std::vector<unsigned char> px(W * H, 255);
    auto put = [&](int x, int y, uint8_t) {
        if (x >= 0 && y >= 0 && x < W && y < H) px[y * W + x] = 0;
    };
    using R = design::TypographyRole;
    struct Line { R role; const char* text; };
    const Line lines[] = {
        {R::kHeadingH1, "Città, perché è così?"},
        {R::kHeadingH2, "Più tardi: l’idea è “già” pronta…"},
        {R::kHeadingH3, "ÀÈÉÌÒÙ àèéìòù çñ äöü ß € «ciao» – —"},
        {R::kBodyLarge, "Lunedì 12 novembre: comprare il caffè (3,50 €)."},
        {R::kBody, "Oggi · Ieri · Impostazioni · Lingua: Italiano / English"},
        {R::kBody, "Before (ASCII): The quick brown fox jumps over the lazy dog 0123456789"},
        {R::kDisplay, "Attività è già lì"},
        {R::kLabelXL, "Perché sì"},
    };
    int y = 8;
    for (const auto& line : lines) {
        epaper_ui::DrawText(put, 12, y, line.text, 0, line.role);
        y += epaper_ui::LineHeight(line.role) + 6;
    }
    FILE* out = std::fopen(argv[1], "wb");
    std::fprintf(out, "P5\n%d %d\n255\n", W, H);
    std::fwrite(px.data(), 1, px.size(), out);
    std::fclose(out);

    std::printf(failures == 0 ? "ALL CHECKS PASSED\n" : "%d CHECKS FAILED\n", failures);
    return failures == 0 ? 0 : 1;
}
