#include "epaper_ui/bitmap_font.h"

#include <algorithm>

namespace epaper_font {

namespace {

// Unicode code points of Windows-1252 bytes 0x80-0x9F; 0 marks the five undefined bytes.
// Must match kCp1252HighControls in scripts/generate_epaper_fonts.py.
constexpr uint16_t kCp1252High[32] = {
    0x20AC, 0,      0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
    0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0,      0x017D, 0,
    0,      0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
    0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0,      0x017E, 0x0178,
};

// Base letter for each Latin-1 letter 0xC0-0xFF, used by fonts without the accented glyph.
constexpr char kLatin1Letters[] =
    "AAAAAAACEEEEIIIIDNOOOOOxOUUUUYPs"
    "aaaaaaaceeeeiiiidnooooo/ouuuuypy";

bool IsContinuationByte(unsigned char value)
{
    return (value & 0xC0) == 0x80;
}

uint32_t Cp1252ByteToCodepoint(unsigned char value)
{
    if (value >= 0x80 && value <= 0x9F) {
        const uint16_t mapped = kCp1252High[value - 0x80];
        return mapped != 0 ? mapped : value;
    }
    return value;
}

}  // namespace

uint32_t DecodeUtf8(std::string_view text, size_t* index)
{
    const size_t start = *index;
    const unsigned char lead = static_cast<unsigned char>(text[start]);
    if (lead < 0x80) {
        *index = start + 1;
        return lead;
    }

    size_t length = 0;
    uint32_t codepoint = 0;
    uint32_t minimum = 0;
    if ((lead & 0xE0) == 0xC0) {
        length = 2;
        codepoint = lead & 0x1F;
        minimum = 0x80;
    } else if ((lead & 0xF0) == 0xE0) {
        length = 3;
        codepoint = lead & 0x0F;
        minimum = 0x800;
    } else if ((lead & 0xF8) == 0xF0) {
        length = 4;
        codepoint = lead & 0x07;
        minimum = 0x10000;
    }

    bool valid = length > 0 && start + length <= text.size();
    for (size_t k = 1; valid && k < length; ++k) {
        const unsigned char cont = static_cast<unsigned char>(text[start + k]);
        if (!IsContinuationByte(cont)) {
            valid = false;
            break;
        }
        codepoint = (codepoint << 6) | (cont & 0x3F);
    }
    if (valid && (codepoint < minimum || codepoint > 0x10FFFF)) {
        valid = false;  // overlong encoding or out of range
    }

    if (!valid) {
        *index = start + 1;
        return Cp1252ByteToCodepoint(lead);
    }
    *index = start + length;
    return codepoint;
}

bool IsUtf8Boundary(std::string_view text, size_t pos)
{
    if (pos == 0 || pos >= text.size()) {
        return true;
    }
    return !IsContinuationByte(static_cast<unsigned char>(text[pos]));
}

size_t PreviousUtf8Boundary(std::string_view text, size_t pos)
{
    pos = std::min(pos, text.size());
    if (pos == 0) {
        return 0;
    }
    size_t candidate = pos - 1;
    // A code point is at most 4 bytes; don't walk further back over stray continuation bytes.
    while (candidate > 0 && pos - candidate < 4 &&
           IsContinuationByte(static_cast<unsigned char>(text[candidate]))) {
        --candidate;
    }
    size_t decoded_end = candidate;
    DecodeUtf8(text, &decoded_end);
    return decoded_end == pos ? candidate : pos - 1;
}

int CodepointToSlot(uint32_t codepoint)
{
    if (codepoint < 0x7F || (codepoint >= 0xA0 && codepoint <= 0xFF)) {
        return static_cast<int>(codepoint);
    }
    for (int i = 0; i < 32; ++i) {
        if (kCp1252High[i] != 0 && kCp1252High[i] == codepoint) {
            return 0x80 + i;
        }
    }
    return -1;
}

bool IsRenderableCodepoint(uint32_t codepoint)
{
    return codepoint >= 0x20 && CodepointToSlot(codepoint) >= 0;
}

const GlyphBitmap* GlyphForSlot(const BitmapFont& font, int slot)
{
    if (slot < 0x20 || slot < font.first_char || slot > font.last_char) {
        return nullptr;
    }
    return &font.glyphs[static_cast<size_t>(slot - font.first_char)];
}

std::string_view AsciiFallback(uint32_t codepoint)
{
    if (codepoint >= 0xC0 && codepoint <= 0xFF) {
        return std::string_view(&kLatin1Letters[codepoint - 0xC0], 1);
    }
    switch (codepoint) {
        case 0x00A0:  // no-break space
        case 0x2007:
        case 0x2009:
        case 0x202F:
            return " ";
        case 0x00AB:  // guillemets
        case 0x00BB:
        case 0x201C:
        case 0x201D:
        case 0x201E:
        case 0x2033:
            return "\"";
        case 0x00B4:
        case 0x2018:
        case 0x2019:
        case 0x201A:
        case 0x2032:
        case 0x2039:
        case 0x203A:
            return "'";
        case 0x00B0:
            return "o";
        case 0x00B7:
        case 0x2022:
            return "*";
        case 0x2013:
        case 0x2014:
        case 0x2212:
            return "-";
        case 0x2026:
            return "...";
        case 0x20AC:
            return "EUR";
        case 0x0152:
            return "OE";
        case 0x0153:
            return "oe";
        case 0x2122:
            return "TM";
        default:
            return {};
    }
}

int MeasureText(const BitmapFont& font, std::string_view text, int tracking)
{
    const size_t line_end = text.find_first_of("\r\n");
    if (line_end != std::string_view::npos) {
        text = text.substr(0, line_end);
    }

    int width = 0;
    bool first = true;
    ForEachGlyph(font, text, [&](const GlyphBitmap& glyph) {
        if (!first) {
            width += std::max(tracking, 0);
        }
        width += glyph.advance;
        first = false;
    });
    return width;
}

}  // namespace epaper_font
