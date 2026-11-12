# Scripts

This repo keeps e-paper asset generators ported from the sibling `followup`
firmware repo.

## E-paper Assets

Source artwork lives in:

- `assets/icons/`
- `assets/logos/`
- `fonts/`

The generators emit monochrome C++ assets for the SSD1677 e-paper UI:

- `generate_epaper_icons.py`: fixed `36x36` icon assets
- `generate_epaper_footer_icons.py`: fixed `44x44` footer icon assets
- `generate_epaper_logos.py`: aspect-ratio-preserving logo assets
- `generate_epaper_fonts.py`: packed bitmap fonts from TTF files (ASCII, or
  Windows-1252: ASCII + accented Latin-1 letters + typographic punctuation)
- `generate_epaper_project_assets.py`: manifest-driven wrapper for all project
  image assets

The PNG generators use macOS `sips`. The font generator uses macOS
CoreGraphics/CoreText through `ctypes` on macOS, and FreeType elsewhere
(`pip install freetype-py`); the FreeType output matches CoreText's to within
~1% of edge pixels, with identical metrics.

For normal UI work, update `assets/epaper_assets.json` and run:

```bash
python3 scripts/generate_epaper_project_assets.py
```

The lower-level scripts remain available for quick one-off experiments.

Examples:

```bash
python3 scripts/generate_epaper_icons.py \
  --output-header components/project_assets/generated_epaper_icons.h \
  --output-source components/project_assets/generated_epaper_icons.cpp \
  assets/icons/home.png:kHome \
  assets/icons/settings.png:kSettings

python3 scripts/generate_epaper_logos.py \
  --output-header components/project_assets/generated_epaper_logos.h \
  --output-source components/project_assets/generated_epaper_logos.cpp \
  assets/logos/folloup-logo.png:kFollowupLogo

python3 scripts/generate_epaper_fonts.py \
  --output components/epaper_ui/generated_epaper_fonts.cpp \
  fonts/Inter_28pt-SemiBold.ttf:kInter22SemiBold:22
```

### Fonts

Every UI font is generated from the `Inter_28pt-*` TTFs. A spec is
`<ttf>:<symbol>:<size>[:<charset>]`, with charset `cp1252` (default: ASCII,
accented letters, curly quotes, dashes, ellipsis, euro sign) or `ascii`. The
165px clock font stays `ascii` to save flash; the renderer draws accented
letters there as their base letter.

Regenerate the full set (add `--reuse-glyphs-from` to keep every glyph that
already exists byte-identical and only rasterize missing ones, which is how the
Windows-1252 glyphs were added from a non-macOS machine):

```bash
specs=""
for size in 22 26 32 38 46 55; do
  for weight in SemiBold Bold Black; do
    specs="$specs fonts/Inter_28pt-$weight.ttf:kInter$size$weight:$size:cp1252"
  done
done
for weight in SemiBold Bold Black; do
  specs="$specs fonts/Inter_28pt-$weight.ttf:kInter165$weight:165:ascii"
done
cp components/epaper_ui/generated_epaper_fonts.cpp /tmp/previous_fonts.cpp
python3 scripts/generate_epaper_fonts.py \
  --output components/epaper_ui/generated_epaper_fonts.cpp \
  --reuse-glyphs-from /tmp/previous_fonts.cpp $specs
```

The slot layout is shared with `epaper_font::CodepointToSlot` in
`components/epaper_ui/bitmap_font.cpp`; keep the two in sync.

Do not hand-edit generated asset files once they are added. Update the source
PNG/TTF files and regenerate instead.
