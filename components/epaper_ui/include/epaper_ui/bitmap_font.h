#ifndef BITMAP_FONT_H
#define BITMAP_FONT_H

#include <cstddef>
#include <cstdint>
#include <string_view>

namespace epaper_font {

struct GlyphBitmap {
    uint32_t bitmap_offset;
    uint16_t bitmap_byte_count;
    uint8_t width;
    uint8_t height;
    int16_t bearing_x;
    int16_t bearing_y;
    uint8_t advance;
};

// Glyphs are indexed by byte "slot" in the Windows-1252 layout: 32-126 is ASCII, 160-255 is
// Latin-1 (accented letters), 128-159 holds the typographic punctuation Windows-1252 puts
// there (curly quotes, dashes, ellipsis, euro sign). A font covers first_char..last_char;
// ASCII-only fonts stop at 126. See scripts/generate_epaper_fonts.py.
struct BitmapFont {
    const char* name;
    uint8_t first_char;
    uint8_t last_char;
    uint8_t line_height;
    uint8_t ascent;
    const GlyphBitmap* glyphs;
    const uint8_t* bitmaps;
};

// Decodes the UTF-8 code point starting at *index and advances *index past it. A byte that
// does not start a valid UTF-8 sequence is consumed on its own and returned as its
// Windows-1252 code point, so legacy Latin-1/Windows-1252 text still renders sensibly.
uint32_t DecodeUtf8(std::string_view text, size_t* index);

// True when pos is 0, text.size(), or the first byte of a UTF-8 sequence. Check it before
// cutting a string at a byte offset so a multi-byte character is never split in half.
bool IsUtf8Boundary(std::string_view text, size_t pos);

// Start of the code point that ends right before pos (0 when pos is 0).
size_t PreviousUtf8Boundary(std::string_view text, size_t pos);

// Windows-1252 slot for a Unicode code point, or -1 when it has none.
int CodepointToSlot(uint32_t codepoint);

// True when the code point maps to a Windows-1252 slot, i.e. the extended fonts draw it.
bool IsRenderableCodepoint(uint32_t codepoint);

// Glyph for a slot, or nullptr when the font does not cover it.
const GlyphBitmap* GlyphForSlot(const BitmapFont& font, int slot);

// ASCII stand-in used when a font has no glyph for a code point: the base letter of an
// accented one, straight quotes for curly ones, "..." for an ellipsis, and so on. Empty when
// there is no sensible stand-in.
std::string_view AsciiFallback(uint32_t codepoint);

// Calls fn(const GlyphBitmap&) for every glyph the UTF-8 `text` renders to, in order. Code
// points the font lacks go through AsciiFallback, and render as '?' failing that -- the same
// '?' the original ASCII-only renderer drew for any unsupported byte.
template <typename Fn>
void ForEachGlyph(const BitmapFont& font, std::string_view text, Fn&& fn)
{
    size_t index = 0;
    while (index < text.size()) {
        const uint32_t codepoint = DecodeUtf8(text, &index);
        if (const GlyphBitmap* glyph = GlyphForSlot(font, CodepointToSlot(codepoint))) {
            fn(*glyph);
            continue;
        }
        std::string_view fallback = AsciiFallback(codepoint);
        if (fallback.empty()) {
            fallback = "?";
        }
        for (const char ch : fallback) {
            if (const GlyphBitmap* glyph = GlyphForSlot(font, static_cast<unsigned char>(ch))) {
                fn(*glyph);
            }
        }
    }
}

// Width of `text` up to its first line break.
int MeasureText(const BitmapFont& font, std::string_view text, int tracking = 0);

}  // namespace epaper_font

#endif  // BITMAP_FONT_H
