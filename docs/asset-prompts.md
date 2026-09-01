# docs/asset-prompts.md — image generation prompts

**Target generator: Nano Banana Pro.** Text only — per OVERRIDE 2 nothing here was
generated, sourced or downloaded. The operator runs these and hands the files back, which
is OVERRIDE 3 and the terminal step of the run.

Output dimensions are stated as **plain text per breakpoint**, deliberately, rather than
relying on an aspect-ratio flag.

## The palette every prompt must use

This is the **Prompt 9 randomized palette, seed `500656`** — NOT the reference's colours.
Name these hues in the prompt or you will get images art-directed to a palette this site
no longer uses.

| role | hex | how to describe it to the generator |
|---|---|---|
| primary | `#441f40` | deep aubergine plum |
| primary-deep | `#2e152b` | near-black plum |
| accent | `#b51e5e` | strong crimson-magenta |
| accent-deep | `#680331` | dark wine crimson |
| ink | `#231421` | near-black plum-brown |
| neutral mid | `#b9a5b6` | warm mauve grey |
| neutral light | `#ede8eb` | pale mauve off-white |
| surface | `#ffffff` | white |

Scheme is **analogous**: primary hue 332, accent hue 2. Neutrals carry a 3.3% chroma tint
of the primary — they are warm mauve greys, never neutral grey.

## Rules that apply to EVERY prompt below

- Subject matter is **ours**: generic residential and commercial **garage doors**, torsion
  springs, openers, rollers, tracks, panels, a technician working. Never roofing.
- **No readable branding, no logos, no signage, no license plates, no identifiable faces.**
  A technician may appear from behind, at a distance, or cropped below the shoulders.
- No text baked into any image except the two logo entries.
- Photographic slots: natural light, shallow-to-moderate depth of field, fine film grain,
  no HDR halos, no heavy vignette.
- Colour grade every photographic slot toward the palette above — plum shadows, crimson
  accents, warm mauve neutrals. Never teal-orange.

---

## LOGO — resolves `TODO(fact): logo asset` (F-01, F-02)

This is the highest-value asset in the file. It is currently the **placeholder-blocked
cause of the header's floored residual**: the two-line Montserrat wordmark standing in for
it puts the logo's children on three rows where the reference has one.

### `logo-primary` — wordmark + icon lockup

- **slot ID** `logo-primary` · **route** all five · **section** `chrome-header`
- **dimensions** 300x120 at 390 · 300x120 at 768 · 300x120 at 1440 (identical at every breakpoint)
- **aspect** 5:2 · **object-fit** `fill`
- **display font** Montserrat Bold (700) — SIL OFL, the site's only design face

> Horizontal logo lockup for a garage door repair company, output exactly 300x120 pixels
> on a transparent background. Left side: a compact geometric icon mark, a simplified
> sectional garage door reduced to four stacked horizontal panels inside a rounded square,
> the lowest panel lifted slightly to suggest the door opening. Flat vector, two colours
> only — deep aubergine plum #441f40 for the frame and strong crimson-magenta #b51e5e for
> the lifted panel. Right side: the wordmark "ATLAS" set in Montserrat Bold, letter-spaced,
> in #441f40, with "GARAGE DOOR REPAIR" beneath it in Montserrat Medium at roughly one
> third the size, letter-spaced wide, in warm mauve grey #b9a5b6. Icon and wordmark
> optically centred on a shared baseline. Crisp edges, no gradients, no bevel, no drop
> shadow, no outer glow. Vector-clean at small size.

### `logo-footer` — stacked lockup

- **slot ID** `logo-footer` · **route** all five · **section** `s16` footer
- **dimensions** 378x252 at 1440 (not rendered at 390 or 768)
- **aspect** 3:2 · **object-fit** `fill`

> Stacked vertical logo lockup for a garage door repair company, output exactly 378x252
> pixels on a transparent background. The same simplified sectional-garage-door icon mark
> centred above the wordmark: four stacked horizontal panels in a rounded square, lowest
> panel lifted, flat vector in pale mauve off-white #ede8eb with the lifted panel in strong
> crimson-magenta #b51e5e. Beneath it, "ATLAS" in Montserrat Bold and "GARAGE DOOR REPAIR"
> in Montserrat Medium at one third the size, both letter-spaced, both in #ede8eb. Designed
> to sit on a warm mauve grey #b9a5b6 footer band, so it must read as a light mark on a
> mid-tone ground. No gradients, no shadow, no glow.

---

## HOME `/`

### `home-hero-media` — hero still

Replaces a brand video. **No video ships** (Appendix A), so this is a poster still only.

- **slot ID** `home-hero-media` · **route** `/` · **section** `s03` hero
- **dimensions** 1600x900 at 390 · 1920x1080 at 768 · 1440x810 at 1440
- **aspect** 16:9 at every breakpoint · **object-fit** `contain`
- **note** the hero band behind it is a `#680331` → `#b51e5e` vertical gradient, so the
  image must sit on crimson without clashing

> Wide cinematic photograph of a modern two-car residential garage door, output exactly
> 1920x1080 pixels. Late afternoon, low warm side light raking across the door's horizontal
> panel lines to pick out their shadow gaps. Clean contemporary suburban house, no visible
> street number, no signage, no vehicles, no people. Shot from a low three-quarter angle so
> the door fills the left two thirds and the right third falls into soft shadow for text
> overlay. Shallow depth of field, background foliage softly out of focus. Colour graded
> with deep aubergine plum #441f40 shadows, warm mauve grey #b9a5b6 midtones and a subtle
> crimson-magenta #b51e5e warmth in the highlights. Fine natural film grain. No HDR, no
> lens flare, no heavy vignette, no text.

### `home-intro-photo-a` — technician at work

- **slot ID** `home-intro-photo-a` · **route** `/` · **section** `s04` intro
- **dimensions** 382x224 at 390 · 753x441 at 768 · 419x245 at 1440
- **aspect** 1.71:1 · **object-fit** `fill`

> Photograph of a garage door technician measuring the tension on a torsion spring above a
> residential garage door, output exactly 753x441 pixels. Seen from behind and slightly to
> the side — no face visible, no readable branding on clothing or tools. Hands and a winding
> bar in sharp focus on the spring and the shaft; the rest of the garage falls away into
> soft bokeh. Practical daylight from the open door behind the camera. Colour graded toward
> deep aubergine plum #441f40 shadows and warm mauve grey #b9a5b6 neutrals, with a single
> crimson-magenta #b51e5e accent from a tool handle. Moderate depth of field, fine grain,
> documentary rather than staged. No text, no logos, no faces.

### `home-intro-photo-b` — hardware detail

- **slot ID** `home-intro-photo-b` · **route** `/` · **section** `s04` intro
- **dimensions** 382x224 at 390 · 753x441 at 768 · 419x245 at 1440
- **aspect** 1.71:1 · **object-fit** `fill`

> Tight detail photograph of a garage door roller sitting in its track, with a hinge and
> lift cable visible, output exactly 753x441 pixels. Clean new galvanised hardware, no rust,
> no branding stamped on any part. Very shallow depth of field, the roller bearing sharp and
> the track receding into blur. Soft directional daylight. Colour graded with deep aubergine
> plum #441f40 in the shadows and warm mauve grey #b9a5b6 on the metal, one crimson-magenta
> #b51e5e highlight. Fine grain, no text, no logos.

### `home-process-step` — five step tiles, DESKTOP ONLY

Five separate tiles at desktop. **Generate five variants of this prompt**, one per step.

- **slot ID** `home-process-step` · **route** `/` · **section** `s09` process
- **dimensions** 202x337 at 1440 · not rendered at 768 or 390 (see `home-process-mobile`)
- **aspect** 0.60:1, portrait · **object-fit** `fill`

> Tall narrow portrait illustration for a numbered process step, output exactly 202x337
> pixels. Flat vector editorial style on a pale mauve off-white #ede8eb ground. A single
> clear garage-door subject centred with generous margin — step 1 a telephone handset,
> step 2 a magnifying glass over a garage door panel, step 3 a clipboard with a written
> estimate, step 4 a torsion spring and winding bar, step 5 a garage door mid-travel with
> motion arcs. Two-colour treatment only: deep aubergine plum #441f40 line work with strong
> crimson-magenta #b51e5e as the single accent per illustration. Even line weight throughout,
> no gradients, no drop shadows, no numerals, no text of any kind.

### `home-process-mobile` — stacked composite, MOBILE ONLY

The reference serves **different art** below 980, not a resize — one tall composite instead
of five tiles. Rebuilding it as a responsive image would be wrong.

- **slot ID** `home-process-mobile` · **route** `/` · **section** `s09` process
- **dimensions** 312x1300 at 390 · 480x2000 at 768 · not rendered at 1440
- **aspect** ~0.24:1, extremely tall · **object-fit** `fill`

> Single extremely tall vertical composite illustration, output exactly 480x2000 pixels,
> stacking five numbered process-step vignettes with even spacing on a pale mauve off-white
> #ede8eb ground. Top to bottom: a telephone handset, a magnifying glass over a garage door
> panel, a clipboard with an estimate, a torsion spring with a winding bar, a garage door
> mid-travel with motion arcs. Flat vector editorial style, deep aubergine plum #441f40 line
> work with strong crimson-magenta #b51e5e accents, connected by a thin vertical plum rule
> running the full height. Even line weight, no gradients, no shadows, no numerals, no text.

### `home-video-poster-a` / `home-video-b` — commercial door still

Both slots are the same frame: a poster still behind an embedded video. **No video ships.**

- **slot ID** `home-video-poster-a` (and `home-video-b`) · **route** `/` · **section** `s09`
- **dimensions** 312x176 at 390 · 614x346 at 768 · 510x287 at 1440
- **aspect** 1.78:1 · **object-fit** `cover` (poster) / `contain` (video slot)

> Photograph of a commercial roll-up steel door on a small industrial unit, partly raised,
> output exactly 614x346 pixels. Clean corrugated slats, no signage, no unit number, no
> vehicles, no people. Flat overcast daylight for even illumination. Straight-on composition,
> the door filling the frame with a shallow band of concrete apron at the bottom. Colour
> graded to warm mauve grey #b9a5b6 neutrals with deep aubergine plum #441f40 in the shadow
> under the door. Moderate depth of field, fine grain. No text, no logos.

### `home-video-poster-b` / `home-video-c` — installation still

- **slot ID** `home-video-poster-b` (and `home-video-c`) · **route** `/` · **section** `s12`
- **dimensions** 386x217 at 390 · 760x428 at 768 · 674x379 at 1440
- **aspect** 1.78:1 · **object-fit** `cover` (poster) / `contain` (video slot)

> Photograph of a new residential garage door being installed, output exactly 760x428
> pixels. A section of door held in the opening with the track partly fitted; a technician's
> gloved hands and forearms enter frame from the left, no face, no readable branding. Warm
> interior daylight from the opening. Colour graded with a dominant dark wine crimson
> #680331 in the shadows, warm mauve grey #b9a5b6 midtones, and strong crimson-magenta
> #b51e5e catching one edge of the metal. Shallow depth of field, fine grain. No text.

### `home-cert-badge` and the eleven `home-badge-*` chips — DO NOT GENERATE

**These slots must stay as `TODO(fact):` placeholder chips.** D-14 forbids inventing
credentials, and F-03 through F-09 are open precisely because we hold none we may name.

Generating a plausible-looking certification badge would fabricate a credential — the exact
failure the decision register exists to prevent. The chips keep their boxes
(`home-cert-badge` 312x114 / 614x225 / 510x187; the eleven `home-badge-*` at 300x68 through
300x264, mobile only) and the layout is already tested honestly against them.

**Action for the operator: resolve F-03–F-09 as facts, not as images.** If a real
certification exists, supply its official asset under its own licence. Otherwise the row
stays as chips or is removed.

---

## `/about`

### `about-title-bg` — page-title strip background

- **slot ID** `about-title-bg` · **route** `/about` · **section** `s02`
- **dimensions** 390x100 at 390 · 768x100 at 768 · 1440x100 at 1440
- **aspect** 14.40:1 at 1440, 3.9:1 at 390 — **aspect changes, second crop required**
- **object-fit** `cover`

> Extremely wide letterbox banner, output exactly 1440x100 pixels. Abstract macro detail of
> the horizontal shadow lines between garage door panels, running left to right across the
> full width, heavily defocused so it reads as soft rhythmic banding rather than a
> recognisable door. Dominant deep aubergine plum #441f40 with warm mauve grey #b9a5b6
> highlights and one soft crimson-magenta #b51e5e bloom off centre. Very shallow depth of
> field, fine grain, no sharp subject, no text, no logos. Must stay legible as a texture
> when a page title is set over it.

### `about-photo` — crew / workshop photograph

- **slot ID** `about-photo` · **route** `/about` · **section** `s06`
- **dimensions** 1440x697 at 1440 only (full-bleed section background)
- **aspect** 2.07:1 · **object-fit** `cover`

> Wide environmental photograph inside a clean, well-ordered garage door service workshop,
> output exactly 1440x697 pixels. Coils of torsion springs on a rack, sections of door panel
> leaning against a wall, hand tools laid out on a bench. One technician at distance with
> their back to camera, small in frame, no face, no readable branding on clothing. Soft
> daylight from a high window on the left. Composition open in the right third for text.
> Colour graded with deep aubergine plum #441f40 shadows, warm mauve grey #b9a5b6 concrete
> and metal, a crimson-magenta #b51e5e accent on one tool. Moderate depth of field, fine
> grain, documentary. No text, no logos, no faces, no vehicles.

### `about-partner-logo` — affiliation row — DO NOT GENERATE

**Stays a `TODO(fact):` chip row.** This is F-10 — partner and affiliation logos we do not
have and may not invent. Generating plausible partner marks would fabricate relationships.
The row keeps its box (312x44 / 614x87 / 970x137, aspect 7.08:1, `object-fit: fill`).

**Action for the operator: resolve F-10 as a fact.** Real partner marks come from the
partner under their own licence, or the row is removed.

---

## `/services`

### `services-title-bg` — page-title strip background

- **slot ID** `services-title-bg` · **route** `/services` · **section** `s02`
- **dimensions** 390x100 at 390 · 768x100 at 768 · 1440x100 at 1440
- **aspect** 14.40:1 at 1440 — **aspect changes, second crop required**
- **object-fit** `cover`

> Extremely wide letterbox banner, output exactly 1440x100 pixels. Abstract macro detail of
> a garage door track and roller assembly running horizontally across the full width,
> strongly defocused into soft metallic banding. Dominant dark wine crimson #680331 shading
> to deep aubergine plum #441f40, with warm mauve grey #b9a5b6 specular highlights along the
> track line. Very shallow depth of field, fine grain, no sharp subject, no text, no logos.
> Must hold a page title set over it.

### `services-body-bg` — full-bleed services background

- **slot ID** `services-body-bg` · **route** `/services` · **section** `s04`
- **dimensions** 390x1764 at 390 · 768x1279 at 768 · 1440x783 at 1440
- **aspect** 1.84:1 at 1440, 0.22:1 at 390 — **aspect changes drastically, second crop required**
- **object-fit** `cover`

> Very subtle full-bleed background texture, output exactly 1440x783 pixels. A near-abstract
> wall of garage door panel lines seen straight on, extremely low contrast, heavily
> desaturated, so it functions as a quiet ground behind body copy rather than an image in
> its own right. Pale mauve off-white #ede8eb overall with the faintest deep aubergine plum
> #441f40 in the panel shadow lines. No focal point anywhere, no vignette, no gradient
> banding, no text, no logos. Must remain legible with dark body text set over the whole
> area at any crop.

### `services-faq-bg` — FAQ band background

- **slot ID** `services-faq-bg` · **route** `/services` · **section** `s06`
- **dimensions** 312x674 at 390 · 614x674 at 768 · 510x674 at 1440
- **aspect** 0.76:1, portrait · **object-fit** `cover`
- **note** this band is dark — the FAQ text sits on it in white

> Tall portrait photograph, output exactly 510x674 pixels, of a residential garage interior
> at dusk with the door half open and cool light spilling under it. Deliberately dark and
> low key so white text can sit over the whole frame. No people, no vehicles, no signage, no
> readable branding. Colour graded almost monochrome toward near-black plum #231421 and deep
> aubergine plum #441f40, with a single strong crimson-magenta #b51e5e rim light along the
> bottom edge of the door. Shallow depth of field, fine grain, no lens flare, no text.

---

## Second crops — the 8 slots whose aspect changes between breakpoints

Per OVERRIDE 2, a second prompt is written **only** where the aspect actually changes.
Each is the same subject and same colour grade as its parent entry, recomposed — not a
scale of it. Placeholder files already carry the `-alt` suffix.

| slot | parent aspect | alt output | recompose note |
|---|---|---|---|
| `about-title-bg-alt` | 14.40:1 | **390x100** | tighten to a single band of panel shadow; the 1440 crop's bloom falls outside this frame |
| `services-title-bg-alt` | 14.40:1 | **390x100** | tighten to one track segment running full width |
| `services-body-bg-alt` | 1.84:1 | **390x1764** | rotate the panel-line field to vertical; at this aspect horizontal lines would compress into moiré |
| `services-faq-bg-alt` | 0.76:1 | **312x674** | same dusk interior, door edge moved to the upper third so the crimson rim light stays in frame |
| `home-cert-badge-alt` | 30:11 | **312x114** | n/a — stays a `TODO(fact)` chip, do not generate |
| `about-partner-logo-alt` | 7.08:1 | **312x44** | n/a — stays a `TODO(fact)` chip, do not generate |
| `home-video-b-alt` | 1.78:1 | **312x176** | same commercial roll-up door, tightened so the door fills the frame edge to edge |
| `home-video-poster-a-alt` | 1.78:1 | **312x176** | identical to `home-video-b-alt` — one file serves both |

---

## Summary

| | count |
|---|---|
| REPLACE slots in `assets/INVENTORY.md` | 29 |
| prompts written here | **16** (2 logo, 8 photographic/illustrative, 1 five-variant tile set, 5 second crops) |
| slots deliberately NOT generated | **13** — `home-cert-badge`, 11 × `home-badge-*`, `about-partner-logo` |

The 13 excluded slots are all credential or affiliation marks. Generating them would
fabricate certifications and partnerships (D-14, F-03–F-10). They stay as `TODO(fact):`
chips at the correct dimensions and are resolved as **facts**, not as images.

Nothing in this file was generated, sourced or downloaded (OVERRIDE 2). Drop-in is
OVERRIDE 3, after acceptance.
