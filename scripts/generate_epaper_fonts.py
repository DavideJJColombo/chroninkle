#!/usr/bin/env python3
"""Generate packed 1-bit bitmap fonts for the e-paper UI from TTF files.

Each font covers one of two slot ranges, indexed by byte value:

- ``ascii``: 32-126 (printable ASCII only).
- ``cp1252``: 32-255 laid out as Windows-1252, i.e. ASCII + Latin-1 (accented
  letters such as a-grave, e-acute, ...) + the typographic punctuation
  Windows-1252 puts at 0x80-0x9F (curly quotes, dashes, ellipsis, euro sign).
  ``epaper_font::CodepointToSlot`` in ``components/epaper_ui/bitmap_font.cpp``
  maps decoded UTF-8 code points onto these slots; keep the two in sync.

Two rasterizer backends are supported:

- ``coretext`` (macOS only): the original backend.
- ``freetype`` (any OS, needs ``pip install freetype-py``): unhinted monochrome
  rendering, which matches CoreText's output to within ~1% of edge pixels.

``--reuse-glyphs-from <existing generated .cpp>`` copies every glyph (and the
font metrics) already present in an existing generated file verbatim and only
rasterizes the missing ones, so extending a font's charset on a non-macOS
machine does not perturb the glyphs that were already shipped.
"""

from __future__ import annotations

import math
import platform
import re
import sys
from ctypes import (
    CDLL,
    POINTER,
    Structure,
    addressof,
    c_bool,
    c_char_p,
    c_double,
    c_int,
    c_long,
    c_size_t,
    c_uint16,
    c_uint32,
    c_uint8,
    c_void_p,
)
from dataclasses import dataclass
from pathlib import Path



class CGPoint(Structure):
    _fields_ = [("x", c_double), ("y", c_double)]


class CGSize(Structure):
    _fields_ = [("width", c_double), ("height", c_double)]


class CGRect(Structure):
    _fields_ = [("origin", CGPoint), ("size", CGSize)]


class CGAffineTransform(Structure):
    _fields_ = [
        ("a", c_double),
        ("b", c_double),
        ("c", c_double),
        ("d", c_double),
        ("tx", c_double),
        ("ty", c_double),
    ]


@dataclass(frozen=True)
class FontSpec:
    path: str
    symbol: str
    size: float
    charset: str = "cp1252"


@dataclass(frozen=True)
class GlyphRecord:
    width: int
    height: int
    bearing_x: int
    bearing_y: int
    advance: int
    bitmap: list[int]


kFirstSlot = 32
kCharsetLastSlot = {"ascii": 126, "cp1252": 255}

# Windows-1252 0x80-0x9F. None marks the five slots Windows-1252 leaves undefined;
# they are emitted as empty, zero-advance glyphs and never addressed at runtime.
kCp1252HighControls = [
    0x20AC, None, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
    0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, None, 0x017D, None,
    None, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
    0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, None, 0x017E, 0x0178,
]


def slot_codepoint(slot: int) -> int | None:
    """Unicode code point rendered into a byte slot (Windows-1252 layout)."""
    if 0x80 <= slot <= 0x9F:
        return kCp1252HighControls[slot - 0x80]
    if slot == 0x7F:
        return None
    return slot


class FontGenError(RuntimeError):
    pass


if platform.system() == "Darwin":
    CORE_GRAPHICS = CDLL(
        "/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics"
    )
    CORE_TEXT = CDLL("/System/Library/Frameworks/CoreText.framework/CoreText")

    kCTFontOrientationHorizontal = 0
    kCGInterpolationNone = 1
    kCGImageAlphaNone = 0
    kIdentityTransform = CGAffineTransform(1.0, 0.0, 0.0, 1.0, 0.0, 0.0)

    CORE_GRAPHICS.CGDataProviderCreateWithFilename.argtypes = [c_char_p]
    CORE_GRAPHICS.CGDataProviderCreateWithFilename.restype = c_void_p
    CORE_GRAPHICS.CGFontCreateWithDataProvider.argtypes = [c_void_p]
    CORE_GRAPHICS.CGFontCreateWithDataProvider.restype = c_void_p
    CORE_GRAPHICS.CGColorSpaceCreateDeviceGray.argtypes = []
    CORE_GRAPHICS.CGColorSpaceCreateDeviceGray.restype = c_void_p
    CORE_GRAPHICS.CGBitmapContextCreate.argtypes = [
        c_void_p,
        c_size_t,
        c_size_t,
        c_size_t,
        c_size_t,
        c_void_p,
        c_uint32,
    ]
    CORE_GRAPHICS.CGBitmapContextCreate.restype = c_void_p
    CORE_GRAPHICS.CGContextSetGrayFillColor.argtypes = [c_void_p, c_double, c_double]
    CORE_GRAPHICS.CGContextFillRect.argtypes = [c_void_p, CGRect]
    CORE_GRAPHICS.CGContextSetShouldAntialias.argtypes = [c_void_p, c_bool]
    CORE_GRAPHICS.CGContextSetAllowsAntialiasing.argtypes = [c_void_p, c_bool]
    CORE_GRAPHICS.CGContextSetInterpolationQuality.argtypes = [c_void_p, c_int]
    CORE_GRAPHICS.CGContextSetTextMatrix.argtypes = [c_void_p, CGAffineTransform]

    CORE_TEXT.CTFontCreateWithGraphicsFont.argtypes = [
        c_void_p,
        c_double,
        c_void_p,
        c_void_p,
    ]
    CORE_TEXT.CTFontCreateWithGraphicsFont.restype = c_void_p
    CORE_TEXT.CTFontGetGlyphsForCharacters.argtypes = [
        c_void_p,
        POINTER(c_uint16),
        POINTER(c_uint16),
        c_long,
    ]
    CORE_TEXT.CTFontGetGlyphsForCharacters.restype = c_bool
    CORE_TEXT.CTFontGetAdvancesForGlyphs.argtypes = [
        c_void_p,
        c_uint32,
        POINTER(c_uint16),
        POINTER(CGSize),
        c_long,
    ]
    CORE_TEXT.CTFontGetBoundingRectsForGlyphs.argtypes = [
        c_void_p,
        c_uint32,
        POINTER(c_uint16),
        POINTER(CGRect),
        c_long,
    ]
    CORE_TEXT.CTFontGetBoundingRectsForGlyphs.restype = CGRect
    CORE_TEXT.CTFontGetAscent.argtypes = [c_void_p]
    CORE_TEXT.CTFontGetAscent.restype = c_double
    CORE_TEXT.CTFontGetDescent.argtypes = [c_void_p]
    CORE_TEXT.CTFontGetDescent.restype = c_double
    CORE_TEXT.CTFontGetLeading.argtypes = [c_void_p]
    CORE_TEXT.CTFontGetLeading.restype = c_double
    CORE_TEXT.CTFontDrawGlyphs.argtypes = [
        c_void_p,
        POINTER(c_uint16),
        POINTER(CGPoint),
        c_long,
        c_void_p,
    ]





def load_font(spec: FontSpec) -> c_void_p:
    provider = CORE_GRAPHICS.CGDataProviderCreateWithFilename(
        spec.path.encode("utf-8")
    )
    if not provider:
        raise FontGenError(f"unable to load font: {spec.path}")

    cg_font = CORE_GRAPHICS.CGFontCreateWithDataProvider(provider)
    if not cg_font:
        raise FontGenError(f"unable to create CGFont: {spec.path}")

    ct_font = CORE_TEXT.CTFontCreateWithGraphicsFont(cg_font, spec.size, None, None)
    if not ct_font:
        raise FontGenError(f"unable to create CTFont: {spec.path}")

    return ct_font


def resolve_glyph(font: c_void_p, character: int) -> int:
    code_unit = c_uint16(character)
    glyph = c_uint16()
    ok = CORE_TEXT.CTFontGetGlyphsForCharacters(font, code_unit, glyph, 1)
    if ok:
        return glyph.value
    if character != ord("?"):
        return resolve_glyph(font, ord("?"))
    raise FontGenError("font is missing fallback glyph '?'")


def glyph_advance(font: c_void_p, glyph_value: int) -> int:
    glyph = c_uint16(glyph_value)
    advance = CGSize()
    CORE_TEXT.CTFontGetAdvancesForGlyphs(
        font, kCTFontOrientationHorizontal, glyph, advance, 1
    )
    return max(1, math.ceil(advance.width))


def glyph_bounds(font: c_void_p, glyph_value: int) -> tuple[int, int, int, int]:
    glyph = c_uint16(glyph_value)
    bounds = CGRect()
    CORE_TEXT.CTFontGetBoundingRectsForGlyphs(
        font, kCTFontOrientationHorizontal, glyph, bounds, 1
    )
    min_x = math.floor(bounds.origin.x)
    max_x = math.ceil(bounds.origin.x + bounds.size.width)
    min_y = math.floor(bounds.origin.y)
    max_y = math.ceil(bounds.origin.y + bounds.size.height)
    return min_x, max_x, min_y, max_y


def create_bitmap_context(width: int, height: int) -> tuple[c_void_p, object]:
    bytes_per_row = width
    buffer_size = width * height
    pixels = (c_uint8 * buffer_size)(*([0xFF] * buffer_size))
    colorspace = CORE_GRAPHICS.CGColorSpaceCreateDeviceGray()
    context = CORE_GRAPHICS.CGBitmapContextCreate(
        addressof(pixels),
        width,
        height,
        8,
        bytes_per_row,
        colorspace,
        kCGImageAlphaNone,
    )
    if not context:
        raise FontGenError("unable to create bitmap context")

    CORE_GRAPHICS.CGContextSetGrayFillColor(context, 1.0, 1.0)
    CORE_GRAPHICS.CGContextFillRect(
        context, CGRect(CGPoint(0.0, 0.0), CGSize(float(width), float(height)))
    )
    CORE_GRAPHICS.CGContextSetShouldAntialias(context, False)
    CORE_GRAPHICS.CGContextSetAllowsAntialiasing(context, False)
    CORE_GRAPHICS.CGContextSetInterpolationQuality(context, kCGInterpolationNone)
    CORE_GRAPHICS.CGContextSetGrayFillColor(context, 0.0, 1.0)
    CORE_GRAPHICS.CGContextSetTextMatrix(context, kIdentityTransform)
    return context, pixels


def pack_bitmap(
    pixels: object, width: int, height: int, bytes_per_row: int
) -> list[int]:
    packed: list[int] = []
    current_byte = 0
    bit_index = 0

    for row in range(height):
        for col in range(width):
            sample = pixels[row * bytes_per_row + col]
            if sample < 128:
                current_byte |= 0x80 >> bit_index
            bit_index += 1
            if bit_index == 8:
                packed.append(current_byte)
                current_byte = 0
                bit_index = 0

    if bit_index:
        packed.append(current_byte)
    return packed


def render_glyph(font: c_void_p, character: int) -> GlyphRecord:
    glyph_value = resolve_glyph(font, character)
    advance = glyph_advance(font, glyph_value)
    min_x, max_x, min_y, max_y = glyph_bounds(font, glyph_value)

    width = max(0, max_x - min_x)
    height = max(0, max_y - min_y)
    if width == 0 or height == 0:
        return GlyphRecord(
            width=0,
            height=0,
            bearing_x=min_x,
            bearing_y=max_y,
            advance=advance,
            bitmap=[],
        )

    context, pixels = create_bitmap_context(width, height)
    glyph = c_uint16(glyph_value)
    position = CGPoint(float(-min_x), float(-min_y))
    CORE_TEXT.CTFontDrawGlyphs(font, glyph, position, 1, context)

    bitmap = pack_bitmap(pixels, width, height, width)
    return GlyphRecord(
        width=width,
        height=height,
        bearing_x=min_x,
        bearing_y=max_y,
        advance=advance,
        bitmap=bitmap,
    )


class CoreTextBackend:
    name = "coretext"

    def __init__(self, spec: FontSpec) -> None:
        if platform.system() != "Darwin":
            raise FontGenError("the coretext backend is only available on macOS")
        self._font = load_font(spec)

    def metrics(self) -> tuple[int, int]:
        ascent = max(1, math.ceil(CORE_TEXT.CTFontGetAscent(self._font)))
        descent = max(0, math.ceil(CORE_TEXT.CTFontGetDescent(self._font)))
        leading = max(0, math.ceil(CORE_TEXT.CTFontGetLeading(self._font)))
        return max(1, ascent + descent + leading), ascent

    def render(self, codepoint: int) -> GlyphRecord:
        return render_glyph(self._font, codepoint)


class FreeTypeBackend:
    name = "freetype"

    def __init__(self, spec: FontSpec) -> None:
        try:
            import freetype  # type: ignore[import-not-found]
        except ImportError as exc:
            raise FontGenError(
                "the freetype backend needs freetype-py: pip install freetype-py"
            ) from exc
        self._ft = freetype
        self._face = freetype.Face(spec.path)
        self._size = spec.size
        self._face.set_char_size(int(round(spec.size * 64)), 0, 72, 72)

    def metrics(self) -> tuple[int, int]:
        # Unrounded design-unit metrics, rounded up the way the CoreText backend does.
        scale = self._size / self._face.units_per_EM
        ascent = max(1, math.ceil(self._face.ascender * scale))
        descent = max(0, math.ceil(-self._face.descender * scale))
        leading = max(0, math.ceil((self._face.height - self._face.ascender + self._face.descender) * scale))
        return max(1, ascent + descent + leading), ascent

    def render(self, codepoint: int) -> GlyphRecord:
        ft = self._ft
        if self._face.get_char_index(codepoint) == 0 and codepoint != ord("?"):
            codepoint = ord("?")
        self._face.load_char(
            chr(codepoint),
            ft.FT_LOAD_RENDER
            | ft.FT_LOAD_NO_HINTING
            | ft.FT_LOAD_TARGET_MONO
            | ft.FT_LOAD_MONOCHROME,
        )
        glyph = self._face.glyph
        bitmap = glyph.bitmap
        advance = max(1, math.ceil(glyph.linearHoriAdvance / 65536.0))
        width, height = bitmap.width, bitmap.rows
        if width == 0 or height == 0:
            return GlyphRecord(0, 0, glyph.bitmap_left, glyph.bitmap_top, advance, [])

        samples: list[int] = []
        for row in range(height):
            for col in range(width):
                byte = bitmap.buffer[row * bitmap.pitch + col // 8]
                samples.append(0 if byte & (0x80 >> (col % 8)) else 0xFF)
        return GlyphRecord(
            width=width,
            height=height,
            bearing_x=glyph.bitmap_left,
            bearing_y=glyph.bitmap_top,
            advance=advance,
            bitmap=pack_bitmap(samples, width, height, width),
        )


@dataclass
class ExistingFont:
    first_slot: int
    line_height: int
    ascent: int
    glyphs: dict[int, GlyphRecord]


def parse_existing_fonts(path: Path) -> dict[str, ExistingFont]:
    """Read glyphs and metrics back out of a previously generated fonts .cpp."""
    source = path.read_text(encoding="utf-8")
    fonts: dict[str, ExistingFont] = {}
    record_re = re.compile(
        r"\{\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(-?\d+),\s*(-?\d+),\s*(\d+)\s*\}"
    )
    for match in re.finditer(
        r"const epaper_font::GlyphBitmap (\w+)_glyphs\[\] = \{(.*?)\};", source, re.S
    ):
        symbol = match.group(1)
        bitmaps_match = re.search(
            r"const uint8_t %s_bitmaps\[\] = \{(.*?)\};" % re.escape(symbol), source, re.S
        )
        font_match = re.search(
            r"const epaper_font::BitmapFont %s = \{\s*\"[^\"]*\",\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),"
            % re.escape(symbol),
            source,
        )
        if bitmaps_match is None or font_match is None:
            raise FontGenError(f"could not parse existing font {symbol} in {path}")
        data = [int(value, 16) for value in re.findall(r"0x([0-9A-Fa-f]{2})", bitmaps_match.group(1))]
        first_slot = int(font_match.group(1))
        glyphs: dict[int, GlyphRecord] = {}
        for index, record in enumerate(record_re.findall(match.group(2))):
            offset, count, width, height, bearing_x, bearing_y, advance = (int(v) for v in record)
            glyphs[first_slot + index] = GlyphRecord(
                width=width,
                height=height,
                bearing_x=bearing_x,
                bearing_y=bearing_y,
                advance=advance,
                bitmap=data[offset : offset + count],
            )
        fonts[symbol] = ExistingFont(
            first_slot=first_slot,
            line_height=int(font_match.group(3)),
            ascent=int(font_match.group(4)),
            glyphs=glyphs,
        )
    return fonts


def emit_byte_array(values: list[int], indent: str) -> str:
    if not values:
        return ""

    lines: list[str] = []
    line = indent
    for index, value in enumerate(values):
        entry = f"0x{value:02X}"
        if index == 0:
            line += entry
        elif len(line) + len(entry) + 2 > 100:
            lines.append(line + ",")
            line = indent + entry
        else:
            line += ", " + entry
    lines.append(line)
    return "\n".join(lines)


kEmptyGlyph = GlyphRecord(0, 0, 0, 0, 0, [])


def generate_source(
    specs: list[FontSpec], backend_name: str, existing: dict[str, ExistingFont]
) -> str:
    out = [
        '#include "epaper_ui/generated_epaper_fonts.h"',
        "",
        "namespace epaper_fonts {",
        "",
    ]

    backend_cls = CoreTextBackend if backend_name == "coretext" else FreeTypeBackend
    for spec in specs:
        backend = backend_cls(spec)
        previous = existing.get(spec.symbol)
        if previous is not None:
            line_height, ascent = previous.line_height, previous.ascent
        else:
            line_height, ascent = backend.metrics()

        last_slot = kCharsetLastSlot[spec.charset]
        all_bitmap_bytes: list[int] = []
        glyph_lines: list[str] = []
        for slot in range(kFirstSlot, last_slot + 1):
            codepoint = slot_codepoint(slot)
            if previous is not None and slot in previous.glyphs:
                glyph = previous.glyphs[slot]
            elif codepoint is None:
                glyph = kEmptyGlyph
            else:
                glyph = backend.render(codepoint)
            offset = len(all_bitmap_bytes)
            all_bitmap_bytes.extend(glyph.bitmap)
            glyph_lines.append(
                "    { %5u, %4u, %3u, %3u, %4d, %4d, %3u },"
                % (
                    offset,
                    len(glyph.bitmap),
                    glyph.width,
                    glyph.height,
                    glyph.bearing_x,
                    glyph.bearing_y,
                    glyph.advance,
                )
            )

        out.extend(
            [
                "namespace {",
                f"const epaper_font::GlyphBitmap {spec.symbol}_glyphs[] = {{",
                *glyph_lines,
                "};",
                "",
                f"const uint8_t {spec.symbol}_bitmaps[] = {{",
            ]
        )
        if all_bitmap_bytes:
            out.append(emit_byte_array(all_bitmap_bytes, indent="    "))
        out.extend(
            [
                "};",
                "}  // namespace",
                "",
                f"const epaper_font::BitmapFont {spec.symbol} = {{",
                f'    "{spec.symbol}",',
                f"    {kFirstSlot},",
                f"    {last_slot},",
                f"    {line_height},",
                f"    {ascent},",
                f"    {spec.symbol}_glyphs,",
                f"    {spec.symbol}_bitmaps,",
                "};",
                "",
            ]
        )

    out.append("}  // namespace epaper_fonts")
    out.append("")
    return "\n".join(out)


kUsage = (
    "usage: generate_epaper_fonts.py --output <file> [--backend coretext|freetype] "
    "[--reuse-glyphs-from <generated.cpp>] <font-path:symbol:size[:ascii|cp1252]>..."
)


def parse_args(argv: list[str]) -> tuple[Path, str, Path | None, list[FontSpec]]:
    output_path: Path | None = None
    backend = "coretext" if platform.system() == "Darwin" else "freetype"
    reuse_from: Path | None = None
    raw_specs: list[str] = []

    args = argv[1:]
    index = 0
    while index < len(args):
        arg = args[index]
        if arg in ("--output", "--backend", "--reuse-glyphs-from"):
            if index + 1 >= len(args):
                raise FontGenError(kUsage)
            value = args[index + 1]
            if arg == "--output":
                output_path = Path(value)
            elif arg == "--backend":
                if value not in ("coretext", "freetype"):
                    raise FontGenError(f"unknown backend: {value}")
                backend = value
            else:
                reuse_from = Path(value)
            index += 2
            continue
        raw_specs.append(arg)
        index += 1

    if output_path is None or not raw_specs:
        raise FontGenError(kUsage)

    specs: list[FontSpec] = []
    for raw in raw_specs:
        parts = raw.split(":")
        if len(parts) not in (3, 4):
            raise FontGenError(f"invalid font spec: {raw}")
        try:
            size = float(parts[2])
        except ValueError as exc:
            raise FontGenError(f"invalid font size in spec: {raw}") from exc
        charset = parts[3] if len(parts) == 4 else "cp1252"
        if charset not in kCharsetLastSlot:
            raise FontGenError(f"unknown charset in spec: {raw}")
        specs.append(FontSpec(path=parts[0], symbol=parts[1], size=size, charset=charset))

    return output_path, backend, reuse_from, specs


def main(argv: list[str]) -> int:
    try:
        output_path, backend, reuse_from, specs = parse_args(argv)
        existing = parse_existing_fonts(reuse_from) if reuse_from is not None else {}
        source = generate_source(specs, backend, existing)
        output_path.write_text(source, encoding="utf-8")
        return 0
    except FontGenError as exc:
        sys.stderr.write(f"font generation failed: {exc}\n")
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
