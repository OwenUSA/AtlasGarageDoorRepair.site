# docs/known-divergence.md — permanent floors

**Read this before starting any fix.** Everything on this page is a *decision* or a
*substitution*, not a defect. None of it is closable by iterating, and burning an
`ITERATION_CAP` attempt against any of it is wasted work.

When a section's diff is blocked by a row here, report it as a **known floor** with the
blocked area excluded from the measurement — never as a fixable divergence.

Last updated: Prompt 5-9.

---

## 1. Fonts

### 1.1 No display-font substitution — the expected floor does not exist

The Prompt 1 profile mined the raw CSS and reported **GD Sherpa** as a self-hosted
licensed display face, which under D-11 would have meant a substitution and a permanent
text-metric floor.

**Prompt 2's `@font-face` enumeration shows that was wrong.** GD Sherpa has **no
`@font-face` rule and no font file**. It appears in exactly one selector:

```
#wpadminbar > .godaddy-styles *, .godaddy-styles * { font-family: "GD Sherpa", -apple-system, ... }
```

That is the GoDaddy hosting control-panel admin bar — chrome that never renders on the
public page. It is not part of the reference's design system.

**The only design face on the reference is Montserrat**, used on 138 rendered text nodes
at weights 300 / 500 / 600 / 700. Montserrat is **SIL OFL 1.1**, so it is TAKE and comes in
unchanged via `next/font/google`.

**Consequence: there is no text-metric floor from a font swap.** Type geometry is expected
to converge properly, and a heading that will not close is a real bug, not a substitution
artifact. Do not excuse type divergence by pointing at a font substitution — there isn't one.

### 1.2 Icon-font glyph substitution — a real, small floor

| reference | ours | why |
|---|---|---|
| ETmodules (`modules.woff`), FontAwesome (`fa-solid-900.woff2`, `fa-regular-400.woff2`) | `lucide-react` | Appendix A. Divi's icon fonts are theme-bundled and not ours to ship. |

Per Appendix A we **match stroke width and size, not the exact glyph.** Glyph outlines will
differ. The reference renders exactly one ETmodules glyph at 59.5px, so the blast radius is
one icon slot plus whatever icons our own sections introduce.

**Floor:** pixel diff over any icon's bounding box. Excluded from measurement. Do not
iterate to match a glyph outline.

---

## 2. Placeholder assets — 29 slots

Every photographic, logo, badge, and video slot on the reference belongs to the reference
business (D-09). **None was downloaded.** All are neutral SVG placeholders at the correct
rendered dimensions and sampled dominant colour until Prompt 10 hands back generated files.

Full table with per-breakpoint geometry: **`assets/INVENTORY.md`**.
Generated files: `public/placeholders/` (37 SVGs, including 8 `-alt` second crops).

**Floor:** any FIDELITY or ADAPTED section containing one of these slots cannot close on
pixel area while a flat colour field stands in for a photograph. Report with the
placeholder box excluded.

Sections carrying at least one placeholder slot:

| route | sections blocked | slots |
|---|---|---|
| `/` | `s03` hero, `s04` intro, `s06` badge row, `s09` process + video, `s12` stat strip, `s16` footer | `home-hero-media`, `home-intro-photo-a/b`, `home-cert-badge`, 11 × `home-badge-*`, `home-process-step`, `home-process-mobile`, `home-video-b/c`, `home-video-poster-a/b`, `logo-footer` |
| `/about` | `s02` title strip, `s06` photo, `s08` partner logos | `about-title-bg`, `about-photo`, `about-partner-logo` |
| `/services` | `s02` title strip, `s04` body, `s06` FAQ band | `services-title-bg`, `services-body-bg`, `services-faq-bg` |
| all routes | header | `logo-primary` |

### 2.1 Logo

`TODO(fact): logo asset`. Until a file exists, the logo renders as a **Montserrat
wordmark** at the reference's rendered box (300×120 at 390/768, 290×116 at 1440).
A wordmark is not a logotype: expect a permanent divergence in the header's optical weight.
Recorded in `docs/facts-needed.md`.

### 2.2 Video → poster still

The reference plays three `.mp4` files with no `poster` attribute. **No video ships in this
build** (Appendix A). Each becomes a still at the same box and aspect.

**Floor:** a moving hero against a static one will never diff to zero, and the reference's
frame at capture time is arbitrary. Excluded permanently. Do not attempt to match a frame.

### 2.3 Responsive asset swaps, not resizes

Two slots serve **different art** per breakpoint, not one image at three sizes:

- **Process steps** — five 202×337 tiles at desktop; one 312×1300 / 480×2000 stacked
  composite below 980.
- **Trust badges** — eleven individual 300×N badges at mobile; one 1080×338 composite
  strip at desktop (which we DELETE).

Rebuilding either as a single responsive image is wrong. Noted so Prompt 6 does not
"simplify" it into a defect.

---

## 3. Content and structure divergences (decisions, not defects)

| what | why | authority |
|---|---|---|
| Nav 18 items → 5 | five fixed routes; whole Locations tree scrubbed | D-01, D-02 |
| Home `s05` grant promo, `s07` brand strip dropped | no garage-door analogue; their supplier logos | Prompt 3 structural gate |
| Home `s14` service-area map + both Google My Maps embeds removed | locations | D-02 |
| Home FAQ (`s15`) relocated to `/services` | FAQ lives on one page, in-page | brief |
| Contact form loses `<input type="email">`, consent checkbox, reCAPTCHA | no email anywhere; no backend | D-03, D-05 |
| Testimonials carry `[TESTIMONIAL PLACEHOLDER]` | no invented quotes, no `AggregateRating` | D-13 |
| Badge row and stat strip carry TODO(fact) chips | no invented credentials or numbers | D-14, D-17 |
| Proposition changes speed/volume → **workmanship** | held across all five routes | brief |
| Services regrouped by symptom | structural gate item 4 | Prompt 3 |
| Maps added on `/` and `/contact` | required, coords-only, keyless | D-07, D-08 |
| Mobile sticky call bar added | reference has none | D-04 |

**All of these mean the affected sections are ADAPTED, measured structurally.** If one is
sitting in a FIDELITY row and refusing to close, the class is wrong — fix the class.

---

## 4. Behavior divergences we are choosing

| reference | ours | why |
|---|---|---|
| Mobile drawer toggles `display: none → block`; no body scroll lock | `translate3d` panel + backdrop, real scroll lock via `position: fixed; top: -Ypx` | A `display` toggle kills its own exit transition — the failure mode named in the Prompt 4 worked example. Cloning it would ship a worse drawer. |
| Header `fixed` at 1440, `absolute` at 390 — not sticky on mobile | same, plus the sticky call bar below 768 | matches the reference where it matters; D-04 adds the call bar |
| No `prefers-reduced-motion` handling | honored on every animation | D-19 |
| FAQ is flat stacked text; **0 accordions site-wide** | `/services` FAQ becomes a native `<details>` accordion | The home FAQ is deleted and relocated to `/services` (Prompt 3), so that page now carries the FAQ on top of eight services in five groups. At 390 the flat version is a very long scroll to the CTA. Deliberate. See `docs/behavior/05-faq-accordion.md`. **Consequence: `/services` `s06-faq-s` is ADAPTED and must not be pixel-diffed against the reference's flat block.** |
| Top bar reads `OK Lic # 80006064` | ours reads `Open daily 7am–7pm` | A state licence number is a credential D-14 bars us from inventing. Forced `s00-top-header` FIDELITY -> ADAPTED on all five routes in Prompt 3. |

---

## 5. Palette — applied in Prompt 5 (amendment A-7), superseded 2026-09-03

**Colour divergence from the reference is intentional and is permanently excluded from
every diff, every threshold, and every future iteration.** The palette was randomized at
token-write time, so the site was built in its final colours from the first component
onward — there was no recolor pass and therefore no geometry/typography regression to
prove innocent.

### 2026-09-03 — seed replaced: `500656` → `239259`

The original auto-selected seed (`500656`, analogous, primary hue 332°/accent hue 2°)
passed the AA gate but landed on plum/crimson/magenta — reading as a fashion or beauty
palette rather than a garage-door repair trade brand named "Atlas." Superseded by
**seed `239259`** (split-complementary, primary hue 246°/accent hue 36°): a navy
structural blue with a burnt-orange CTA, searched via the same `generate()`/`gate()`
functions in `scripts/palette.mjs` constrained to a steel/navy primary-hue arc and an
orange/amber accent-hue arc, still requiring `gate(cand).pass`. `ctaRatio` 6.21 (vs.
6.34 for the old seed) — the gate is unaffected by which hue arc is searched, only by
which of the 4,844 passing candidates in that arc is picked.

Reproduce: `node scripts/palette.mjs --seed 239259 --emit`

This palette swap coincided with fixing a real, unrelated contrast defect — see
`docs/PRE-LAUNCH.md`'s "RESOLVED — the primary call CTA was invisible" section for the
root cause (an unlayered `a`/`h1..h6` rule in `globals.css` beating every Tailwind
utility color class, regardless of hue). The palette choice did not fix that bug; the
`@layer base` fix did. Re-measured 0 FAIL / 1152 scored on `contrast.mjs` afterward.

### Seeds — the record (original selection, superseded above)

| | |
|---|---|
| master seed | `20260901` |
| **winning seed** | **`500656`** (superseded — see above) |
| all five candidate seeds | `723907`, `941750`, **`500656`**, `23871`, `136729` |
| rolls needed | 5 (0 rejected) |
| reproduce | `node scripts/palette.mjs --seed 500656 --emit` |

| seed | scheme | primary hue | accent hue | neutral chroma | CTA contrast |
|---|---|---|---|---|---|
| 723907 | split-complementary | 304 | 94 | 0.054 | 5.69 |
| 941750 | complementary | 219 | 39 | 0.041 | 6.12 |
| **500656** | **analogous (+30deg)** | **332** | **2** | **0.033** | **6.34** |
| 23871 | triadic | 277 | 37 | 0.035 | 6.13 |
| 136729 | triadic | 130 | 250 | 0.035 | 5.69 |

Auto-selected on highest call-now CTA contrast against its background (6.34:1), per
OVERRIDE 1. Ties would have broken to the lowest seed.

**Structure held, hue rotated.** Every L and C value from the Prompt 1 extracted ramp is
preserved exactly; only H moved. Neutrals carry a 3.3% chroma tint of the primary hue
rather than being pure grey. Semantic colours — form error, form success — are exempt from
the rotation and keep conventional hues, asserted by hue arc in the gate, not merely by
contrast.

### What the gate actually verifies

23 foreground/background pairs **in use**, not the ramp in theory. It also asserts the
neutral ramp is still monotonic in L and that `primaryDeep`/`accentDeep` remain darker than
their base — otherwise the "hold every L and C" claim would be unverified. Verified to
reject: body text too light, CTA washed out, CTA desaturated below primary, invisible focus
ring, error turned green, success turned red, ramp order broken, accentDeep inverted.

### Three constraints that had to be re-specified to be meaningful

The reference's own palette fails all three as first written, which is the tell that the
test was wrong rather than the palette:

| constraint | first reading | why it was wrong | what is gated now |
|---|---|---|---|
| UI borders 3:1 | `neutral400` on white | 2.27:1 — the reference's decorative hairline fails, and WCAG 1.4.11 does not cover pure decoration | a separate `--color-border-strong` for meaningful edges (inputs, controls), gated at 3:1; the hairline stays decorative and ungated |
| focus ring 3:1 vs element *and* background | one flat ring against every surface | impossible for a single colour against both a white page and a saturated button — ring vs CTA came out 1:1 | a **two-layer ring**: surface-coloured inner halo plus dark outer ring, with each layer gated on the surface where it is the operative one |
| CTA is highest-contrast on every page | CTA ratio vs every text pair | white-on-navy always beats a mid-tone button — true in the reference too — so this rejected every possible palette | CTA label passes AA on its fill, the fill separates from the page at 3:1, and the fill is more chromatic than the structural primary and than every other rotated token |

---

## 5b. Colour excluded from measurement (amendment A-8)

Colour-valued fields are **stripped from the structural comparator**: resolved color,
background-color, border-color, gradient stops, shadow colour. Kept: every geometric and
typographic field, and the non-colour parts of borders and shadows — widths, offsets, blur,
spread, radii. The comparator still weighs 27 fields; three colour fields were replaced by
`textTransform`, `borderStyle` and `overflow`.

**The 3 remaining FIDELITY sections are measured structurally, not by pixel diff.** All
three (`/` `s08`, `/about` `s04`, `/about` `s09`) are solid-colour bands, so with colour
excluded a recoloured band would read 100% divergent forever. The routing is class-based:
every FIDELITY section goes structural. A content-bearing FIDELITY section would still be
pixel-diffed, but the Prompt 3 reclassification left none.

## 5c. NOVEL and DELETED measured once (amendment A-9)

Token conformance has no breakpoint dimension, so NOVEL and DELETED rows are emitted once
on the canonical 1440 pass instead of three identical times. `BP_SET` is unchanged — all
three widths stay for everything geometric, and 768 in particular stays because it is where
the Divi `max-980` restack resolves.

## 5d. Two harness corrections made while measuring the shell

Both were the instrument measuring framework artifacts rather than design:

- **`box-shadow` empty ring slots.** Tailwind composes shadows with unset ring/inset slots,
  so a computed value carries `0px 0px 0px 0px` entries that draw nothing. They are now
  stripped before comparison.
- **`border-style` at zero width.** Tailwind preflight sets `border-style: solid` on every
  element. Compared naively it flagged every section forever. It is now only compared when
  a border actually has width.
- **Invisible elements in structural counts.** `listCounts` now counts only elements with a
  non-zero box. A `display: none` control is DOM, not layout, and counting it made the
  responsive shell diverge from a reference that hides the same control differently.

---

## 6. Instrument-level floors

| item | note |
|---|---|
| Home has 18 bands at 390/768, 17 at 1440 | Real responsive divergence in the reference. The extra band is reported `UNMATCHED / no 1440 counterpart`, never measured. |
| Breakpoints 479, 600, 782, 800, 900, 960, 1350 | Exist in the reference CSS, deliberately not captured. `docs/profile.md` §3. |
| 430 captured for geometry only | Real-device width, no threshold, not a diff target. |
| No rAF motion traces | The reference has no scroll-linked motion. `docs/profile.md` §4. |

---

## 7. Shell floors — Prompt 5, one attempt each (ITERATION_CAP = 1)

Both shell sections had their single fix attempt in Prompt 5. `s00-top-header` passes at
1440 and misses marginally below it; `s01-main-header` misses at every width. Both are
floored. **Do not dispatch either again.**

### `s00-top-header` — 3.70% @1440 (PASS), 5.56% @390 and @768 (floored)

| residual field | reference | ours | why |
|---|---|---|---|
| `position` | `fixed` @1440, `absolute` @390/768 | `sticky` @≥980, `static` below | **Deliberate.** `docs/behavior/02` specifies sticky over fixed so the header stays in flow and needs no compensating offset. One field of 27 = 3.70%. |
| `innerCount` | 2 | 1 | The reference top bar carries a licence number plus a separator element. Ours carries one hours string, because a licence number is a credential D-14 bars us from inventing. |

**Hypothesis:** this is at its floor. Both fields are decisions, not defects, and 3.70% of
that is `position` alone. It would only close by adopting `position: fixed`, which
`docs/behavior/02` rejects for good reason.

### `s01-main-header` — 6.17% @1440, 13.21% @390, 14.44% @768 (floored)

| residual field | reference | ours | why |
|---|---|---|---|
| `position` | `fixed` / `absolute` | `sticky` / `static` | as above — deliberate |
| `innerRows` | 1 | 3 @1440, 3–5 below | **Placeholder-caused.** The reference logo is a single `<img>`; ours is a two-line Montserrat wordmark standing in for `TODO(fact): logo asset` (F-01). Two stacked spans put the logo's children on different rows. |
| `innerCols` / `innerCount` | 2–3 | 4–6 | Same cause: the wordmark contributes extra boxes the reference's single image does not. |
| `buttons` | 0 | 1 | **Deliberate.** Divi's mobile toggle is a `<span class="mobile_menu_bar">`. Ours is a real `<button>` with `aria-expanded` / `aria-controls`, required by `docs/behavior/01`. We are not shipping a div-as-button to close a metric. |

**Hypothesis:** the dominant term is the logo placeholder, not the layout. When the real
logo asset lands in Prompt 10 and replaces the two-line wordmark with a single image
element, `innerRows`/`innerCols`/`innerCount` should collapse toward the reference and this
section should land near the `position` + `buttons` floor of roughly 7.4% at 1440.
**This is a placeholder-blocked floor (F-01), not a fixable divergence** — treat it as such
and exclude the wordmark box from the measurement when the section is re-measured.

## 8. `/privacy` route floors — Prompt 6/7, one attempt each (ITERATION_CAP = 1)

### `s02-privacy-policy-and-terms-and-condi` — 3.31% @1440 (PASS), 4.80% @768 (PASS), 5.02% @390 (floored)

One fix attempt applied (`position: relative`, `font-medium` on the band to match the
reference's computed 500 weight) brought 1440 and 768 under threshold. 390 misses by 0.02
points on `box.h` (298.3 ref vs 160 ours) and `innerCols`/`innerRows`, driven by our title
+ subheading stacking to a shorter block than the reference's wrapped heading at that
width. **Hypothesis:** floor is content-length driven (own copy at matched character count
still wraps differently than the reference's words); not a layout defect. Not chased
further under ITERATION_CAP = 1.

### `s04` (CTA band) — 4.44% @1440 (PASS), 6.68% @390 (floored), 5.07% @768 (floored)

Same one fix attempt (`position: relative`, `pt-snug pb-gutter` matching the reference's
11px/17px pad, `font-medium`) brought 1440 under threshold. 390/768 remain over by 1.68 and
0.07 points respectively, both driven by `box.h` — our CTA band is shorter than the
reference's stacked layout at narrow widths because our copy (one paragraph, two buttons)
is shorter than the reference's five-item inner grid. **Hypothesis:** content-length floor,
same cause as `s02`; the shared CTA band shape is otherwise correct (it also passes at 1440
on `/about`'s identical component). Not chased further under ITERATION_CAP = 1.

### `s03` (policy body) — NOVEL, 4 token "violations" at 1440, all false positives

`scripts/harness/diff.mjs`'s `tokenViolations()` compares the browser's *computed* style
string against the *literal* `@theme` source text. Two units mismatch, not a real
divergence:
- Colors: `@theme` writes `oklch(50.95% 0.0343 331.38)` (percent L); every browser
  normalizes computed style to `oklch(0.5095 0.0343 331.38)` (0–1 L). The two reported
  color violations (`oklch(0.5095 0.0343 331.38)` = `--color-neutral-600`, and
  `oklch(1 0 89.88)` = `--color-surface`) are both tokens in use, just serialized
  differently.
- Size: `@theme` writes `--text-base: 1.0625rem`; `getComputedStyle().fontSize` always
  returns px (`17px`, which is exactly `1.0625rem` at the 16px root). Same token, different
  unit.

**This is a harness instrument bug in the token-conformance comparator, not a content
violation** — `s03` uses no color, size, weight, radius or shadow outside the token set
(verified by inspection: every class on the page is `text-*`/`font-*`/`leading-*` from the
established scale, or a `border-dashed border-border-strong` token pair). **Handback**:
`tokenViolations()` needs to normalize both sides (parse to a canonical form, e.g. via a
throwaway `getComputedStyle` on a probe element, or resolve `rem`→`px` and `%L`→`0-1 L`
before comparing) — that is a `scripts/` file, frozen to builders. Not chased as a code
change on this route; reported for the lead.

### `s05` (footer) — not built; shell-owned, 16.26% @1440 / 17.75–19.89% @390/768

Per dispatch instructions, checked `.harness/cap/ref/privacy-1440/meta.json` first: the
reference `s05` is the grey footer band (NAP block, 4 links, 2 list items, the reference's
logo image) — structurally identical in purpose to the site footer the frozen shell
(`SiteFooter.tsx`) already renders on every route. Correctly **not duplicated**. The
reported failure is the shell footer's own structural gap against the reference (padding,
`position: relative`, inner grid count) — not something this route's page component can
fix without editing a frozen file. **Handback** to the lead, same class of fix as
`s01-main-header` above (shared shell component, one owner).

---

## 9. Prompt 6/7 build wave — floors and instrument corrections

### 9.1 Three instrument bugs found during the wave (all fixed by the lead)

Every builder agent independently reported numbers that turned out to be measurement
artifacts. Three real defects in the harness, all now fixed. **All agent-reported numbers
from this wave are superseded by the lead's final sweep.**

| # | bug | effect | fix |
|---|---|---|---|
| 1 | `probe.mjs` `CHROME` selector contained `[class*=callbar]`, which matched `<body class="… pb-callbar …">` | BODY entered the chrome set; the containment dedup then dropped HEADER and FOOTER (contained by BODY) and dropped BODY itself (contains every `main > section`). **The header, top bar and footer vanished from every "ours" capture on every route.** Section counts came up 2–3 short, so positional pairing cascaded every downstream section onto the wrong counterpart. | Selector no longer uses substring class matching; chrome is `header`/`footer` plus any `[data-section]` outside `<main>`, with BODY and HTML explicitly excluded. |
| 2 | `diff.mjs` `pairSections()` joined reference→ours by nearest normalized scroll-midpoint only | Prompt 3's structural gate **requires** four bands to move (services 13th→5th, stats 12th→10th, CTA 10th→11th, testimonials 11th→12th). A position-only join pairs exactly those to the wrong counterpart or exhausts the pool and reports `"no counterpart section"` → a false **100%**. Structurally guaranteed to punish the sections the brief mandated moving. | Two-pass join: **identity first** (our sections carry `data-section="<reference id>"`, which the probe emits into the section id), then globally-best-first progress as fallback. Every row now records `pairedVia`. 101 of 131 pairable rows now join by id. |
| 3 | `diff.mjs` `tokenViolations()` compared raw strings | `@theme` stores `oklch(50.95% …)` and `1.0625rem`; `getComputedStyle` returns `oklch(0.5095 …)` and `17px`. Every in-token value read as a violation, so **NOVEL conformance was meaningless** — it could never pass. | Both sides normalised before comparison: oklch L to a 0–1 decimal, all lengths to px at a 16px root, weights compared unitless. `/privacy` `s03` now measures **0 violations**. |

Credit where due: bug 1 was diagnosed precisely by the `/about` and `/services` agents,
bug 2 by the home agent, bug 3 by the `/contact` and `/privacy` agents. Each correctly
declined to edit a frozen file and handed it back instead.

### 9.2 The dominant residual — a defect in the lead's builder brief

`docs/BUILDER-BRIEF.md` told every agent: *"each band is a full-width block with zero
padding, and an inner container carries the layout."* That was the right lesson from the
Prompt 5 header (where making the band itself a flex container broke `display`, `gap` and
`box.w`) but it is **wrong about padding**.

Measured reference band padding across home's 17 bands:

```
0/0 ×5   54/54 ×3   57/37   54/33   54/7   54/0   31/0   20/54   0/54   0/20   11/17
```

The reference varies vertical padding per band. Our bands are uniformly `0/0`, which
matches 5 of 17 and misses the rest by 100% on two fields — a **7.4% floor** on every
affected section before anything else is counted. `padTop`/`padBottom` appear in 126 of the
residual field lists, second only to the inner-grid triple.

**Not fixed, deliberately.** A blanket change to `54/54` would match 3 more sections and
break the 5 that are correctly `0/0` — net worse. The correct fix is per-section padding
matched to each reference band, and every section has already spent its single
`ITERATION_CAP` attempt. Recorded here as the known cause. **If the cap is ever lifted,
this is the highest-value single pass available: it is mechanical, it is ~7.4% per section,
and it affects roughly two-thirds of the site.**

### 9.3 Other standing residuals

| field | frequency | cause | fixable? |
|---|---|---|---|
| `innerCount` / `innerRows` / `innerCols` | 90 / 84 / 78 | Our markup shape differs from Divi's deeply-nested column tree. Also driven by the logo wordmark placeholder (F-01) and by real `<button>` elements where Divi uses `<span>`. | Partly, but it is per-section work past the cap |
| `position` | 88 | `sticky`/`static` vs the reference's `fixed`/`absolute` — **deliberate**, per `docs/behavior/02` | No — decision |
| `padTop` / `padBottom` | 69 / 57 | §9.2 above | Yes, past the cap |
| `lineHeight` | 55 | Reference band wrappers carry per-band line-heights; ours inherit `--leading-body` | Partly |
| `box.h` | 53 | Copy is length-matched but wraps differently; mobile stacks are more compact than the reference's | Content-driven |

### 9.4 Sections floored in this wave

**All 116 failing section rows are floored.** Every unit spent its one `ITERATION_CAP`
attempt and none may be dispatched again. 17 section rows pass, including
`/privacy` `s03` (NOVEL, 0 token violations) and every `s00-top-header` at 1440.

Four rows remain at a literal 100% — `/` `s09` and `s10` at 390 and 768. Cause: home has
18 reference bands at mobile against 17 at desktop (the "we make it easy" band splits into
a 20px stub plus the real band below 980), so two mobile reference bands compete for one of
our sections and one is left unpaired. This is the same mobile band-split already recorded
in §6, not a build defect.

### 9.5 Newly blocked

- `/about` `s02` background (`about-title-bg`), `s06` photo (`about-photo`), `s08` partner
  logos (`about-partner-logo`) — placeholder-blocked, Prompt 10.
- `/services` `services-title-bg`, `services-body-bg`, `services-faq-bg` — placeholder-blocked.
- `/` `s06` badge chips — dimensions estimated; the reference ships ~10 separate logo
  images against our 4 TODO(fact) chips (D-14). Geometry cannot converge while the content
  is deliberately different.
- Reference `s11`/`s08`/`s04`/`s05` on the subpages are the **shared footer**, already
  rendered by the frozen shell. Every agent correctly identified this and skipped it rather
  than duplicating the footer. Those rows measure the shell footer, which is lead-owned and
  carries the same class of residual as `s01-main-header` in §7.

---

## 10. Every divergence number before `437d57e` is superseded

**A future reader must not compare against any pre-wave table.** Three instrument defects,
all found during the Prompt 6+7 wave and fixed in that commit, mean the numbers recorded
before it were measuring the wrong things:

1. **BODY joined the CHROME set** (`[class*=callbar]` matched `<body class="… pb-callbar …">`)
   and the containment dedup then deleted the **header, top bar and footer** from every
   `ours` capture on every route. Section counts ran 2–3 short and positional pairing
   cascaded every downstream section onto the wrong counterpart.
2. **`pairSections()` joined by scroll position**, so the four bands Prompt 3 *required* to
   move (services, stat strip, CTA, testimonials) reported a **false 100%** — the
   instrument punished the build for obeying the brief.
3. **`tokenViolations()` compared `oklch` percentage against unit-interval, and `rem`
   against `px`**, so NOVEL token conformance could never pass at all.

The first table measured with all three fixed is the one in `437d57e`. Anything earlier —
including the Prompt 1 instrument-proof table and the Prompt 5 shell table — is a record of
the instrument's state at that time, not of the build's fidelity.

---

## 11. A-11 targeted padding pass — result

Scope was section **vertical padding only**. Nothing else was touched: horizontal padding,
`innerCount`/`innerRows`/`innerCols`, `position`, `lineHeight`, `box.h`, copy, tokens and
every frozen shell file were left exactly as they were. **`ITERATION_CAP` is back to 1**;
A-11 was a one-time, defect-scoped exception and is now spent.

### Outcome

| | before | after |
|---|---|---|
| measurable section rows | 131 | 129 (2 reclassified UNPAIRED) |
| **PASS** | **17** | **23** |
| rows that cleared their threshold | — | **8** |
| rows improved | — | 59 |
| worst section row | 100% (×4) | **25.18%** |
| PASS → FAIL regressions | — | **0** |

**No section was reverted.** The two rows that first appeared to regress (home `s13` at 390
and 768) turned out to be a pairing defect, not a build regression — see 11.2. Once fixed,
`s13` improved at every breakpoint.

Padding is now materially correct: `padTop` fell from 69 residual appearances to 40, and
`padBottom` dropped out of the top seven fields entirely. 48 of 129 section rows still show
a non-zero padding field, almost all of them the 4px token approximation below.

### 11.1 Nearest-step approximations (no new tokens were minted)

The reference uses 50px vertical padding at 768/390 where it uses 54px at 1440. There is no
50px step in Prompt 5's 9-step scale, so `band` (54) was used and the **+4px delta** is
recorded rather than minting a `--spacing-*`:

| route | sections | delta |
|---|---|---|
| `/` | `s08` RuleBand | +4px top/bottom @768, @390 |
| `/about` | `s04`+`s09` RuleBand, `s05` OurMission, `s06` ReliablePros, `s07` OurTeam | +4px @768, @390 |
| `/services` | `s04` ServicesBody, `s06` FAQ | +4px @768, @390 |

One further approximation: `/about` `s06` uses `xl:pt-loose` at 1440, a **−2px** delta.
Everything else landed exactly on an existing step with delta 0.

### 11.2 A fourth instrument defect, found by this pass

`pairSections()` matched our sections to reference sections using the **raw per-breakpoint
reference id**. Reference ids are positional, and home splits one band below 980 — so every
id after the split shifts. The band literally named `s13-…` at 390 is **not** the services
band (that is `s14-…` there). Our components declare the 1440 id, so at mobile the services
block was being compared against the reference's CTA band.

That produced two false effects: apparent regressions on `s13`, and four literal 100% rows
on `s09`/`s10`. Both vanished once pairing was switched to the **canonical** id, which
`buildClassResolver` already computes:

| row | before fix | after fix |
|---|---|---|
| `/` `s09` @390 / @768 | 100 / 100 | 10.74 / 12.06 |
| `/` `s10` @390 / @768 | 100 / 100 | **4.83 PASS** / 5.96 |
| `/` `s13` @390 / @768 | 12.72 / 13.51 | 7.65 / 7.33 |

**This is the fourth defect this build has found in its own instrument**, after the three
in §10. Every one of them made the build look worse than it was.

### 11.3 Unpaired rows are no longer scored as 100%

At 390/768 home carries 18 reference bands against our 15 sections, so two reference rows
can resolve to the same canonical id and compete for one of ours. The loser has nothing to
compare against. That is now reported as `UNPAIRED` with a null value rather than a 100%
FAIL — there is no measurement, so claiming a number was false precision. 4 rows are
affected (1 ADAPTED, 1 FIDELITY, 2 DELETED).

### 11.4 What still fails, and why

Nothing remaining is padding. The dominant fields across all 106 failing rows:

| field | count | in scope for A-11? |
|---|---|---|
| `innerCount` / `innerRows` / `innerCols` | 94 / 82 / 81 | **No** — markup shape vs Divi's nested column tree, plus the logo wordmark placeholder (F-01) |
| `position` | 88 | **No** — `sticky`/`static` vs `fixed`/`absolute`, deliberate per `docs/behavior/02` |
| `lineHeight` | 71 | **No** — reference band wrappers carry per-band line-heights |
| `box.h` | 69 | **No** — copy is length-matched but wraps differently; mobile stacks are more compact |
| `padTop` | 40 | mostly the +4px token approximation in 11.1 |

The `(page)` height-delta rows (30–41%) are the aggregate of `box.h` above and are expected:
our pages are shorter than the reference's because four bands were dropped or relocated by
the Prompt 3 structural gate.

---

# 12. FINAL — every permanent floor and its cause

This section is the authoritative list at the end of the chain. Read it before touching
any number in `docs/divergence.md`.

## 12.1 Colour is permanently excluded from measurement (A-8)

**Colour divergence from the reference is intentional and is permanently excluded from
every diff, every threshold, and every future iteration.** The palette was randomized at
token-write time, originally from seed `500656` (analogous, primary hue 332), and
replaced 2026-09-03 with seed `239259` (split-complementary, primary hue 246, navy
blue / burnt orange — see §5) for brand fit. Either way the site is built in its final
colours from the first component onward. Colour-valued fields — resolved colour,
background-colour, border-colour, gradient stops, shadow colour — are stripped from the
structural comparator. Do not open a colour delta as a defect; there is nothing to converge.

## 12.2 There is NO font-substitution floor

Prompt 1 flagged "GD Sherpa" as a self-hosted licensed display face, which under D-11 would
have meant a substitution and a permanent text-metric floor. **Prompt 2 disproved it**: GD
Sherpa has no `@font-face`, no font file, and styles exactly one selector —
`#wpadminbar > .godaddy-styles` — the GoDaddy hosting admin bar, which never renders on the
public page. The reference's only design face is **Montserrat**, which is SIL OFL and comes
in unchanged via `next/font/google`.

**Consequence, and it matters: a heading that will not converge is a real bug, not an
excused one.** Nobody may point at a font swap to explain a type residual. There isn't one.
The only typographic floor is icon-glyph substitution (Divi's ETmodules/FontAwesome →
`lucide-react`), which is bounded to icon bounding boxes.

## 12.3 The `position` residual is deliberate

88 residual rows carry a `position` delta: ours is `sticky`/`static` where the reference is
`fixed`/`absolute`. This is specified in `docs/behavior/02-sticky-header-transition.md`.
Sticky keeps the header in flow so nothing needs a compensating offset, which removes an
entire class of bug the reference actually has. It is one field of 27, worth ~3.7% on every
chrome section, and it will never close. **Do not "fix" it.**

## 12.4 Placeholder-blocked slots — resolve only on asset drop-in

29 REPLACE slots ship as neutral SVG placeholders at the correct dimensions and sampled
dominant colour. They resolve when the operator hands back the generated files
(OVERRIDE 3), using the prompts in `docs/asset-prompts.md`.

The single highest-value one is **`logo-primary` (F-01)**. The two-line Montserrat wordmark
standing in for it puts the logo's children on three rows where the reference has one, and
that is the dominant term in `s01-main-header`'s floored residual on all five routes. When
the real logo lands as one image element, `innerRows`/`innerCols`/`innerCount` should
collapse toward the reference.

**13 slots are deliberately never generated**: `home-cert-badge`, the eleven
`home-badge-*` chips, and `about-partner-logo`. Generating them would fabricate
certifications and partnerships (D-14, F-03–F-10). They stay as `TODO(fact):` chips at the
correct dimensions and are resolved as facts, not images.

## 12.5 Four instrument defects were found and fixed during this build

**Every divergence number recorded before `437d57e` is superseded.** A future reader must
not compare against any earlier table — the Prompt 1 instrument-proof table and the Prompt 5
shell table are records of the instrument's state at that time, not of the build's fidelity.

| # | defect | effect | fixed in |
|---|---|---|---|
| 1 | `probe.mjs` `CHROME` used `[class*=callbar]`, which matched `<body class="… pb-callbar …">` | BODY joined the chrome set; containment dedup then deleted the **header, top bar and footer** from every `ours` capture on every route | `437d57e` |
| 2 | `pairSections()` joined by nearest scroll-midpoint | the four bands Prompt 3 *required* to move reported a false **100%** — the instrument punished the build for obeying the brief | `437d57e` |
| 3 | `tokenViolations()` compared `oklch` percentage against unit-interval, and `rem` against `px` | **NOVEL token conformance could never pass**, at all | `437d57e` |
| 4 | identity pairing used the **raw per-breakpoint** reference id | reference ids are positional and home splits a band below 980, so at mobile our services block was compared against the reference's CTA band — producing a phantom regression and four more false 100%s | `657e321` |

Every one of them made the build look worse than it was. Defects 2 and 4 were surfaced by
builder agents who correctly refused to edit a frozen file and handed back instead.

## 12.6 What actually remains

129 measurable section rows: **23 PASS, 106 FAIL, worst 25.18%.** No row is at 100%.
Dominant residual fields, none of them in scope for any remaining pass:

| field | count | cause |
|---|---|---|
| `innerCount` / `innerRows` / `innerCols` | 94 / 82 / 81 | our markup shape vs Divi's deeply nested column tree; plus the logo wordmark placeholder (12.4) and real `<button>` elements where Divi ships `<span>` |
| `position` | 88 | deliberate — 12.3 |
| `lineHeight` | 71 | reference band wrappers carry per-band line-heights |
| `box.h` | 69 | copy is length-matched but wraps differently; mobile stacks are more compact |
| `padTop` | 40 | mostly the +4px token approximation from A-11 (reference uses 50px at mobile; nearest step is `band`=54) |

The `(page)` height-delta rows (30–41%) are the aggregate of `box.h`: our pages are shorter
because four bands were dropped or relocated by the Prompt 3 structural gate. That is the
gate working, not a defect.

## 12.7 Standing behaviour divergences

| reference | ours | why |
|---|---|---|
| drawer toggles `display:none → block`, no scroll lock | `translate3d` panel + backdrop, `position:fixed` scroll lock | a `display` toggle kills its own exit transition — `docs/behavior/01` |
| FAQ is flat text; **0 accordions site-wide** | native `<details>` accordion on `/services` | the home FAQ relocated onto an already-long page — `docs/behavior/05`. `s06-faq-s` must never be pixel-diffed |
| mobile toggle is a `<span>` | real `<button>` with `aria-expanded`/`aria-controls` | we do not ship a div-as-button to close a metric |
| top bar reads `OK Lic # 80006064` | `Open daily 7am–7pm` | a licence number is a credential D-14 bars inventing |
| no `prefers-reduced-motion` handling | honoured globally and per component | D-19 |

---

## 13. CORRECTION — this site's acceptance sweep was measuring almost nothing

Added after the shared harness (`../_shared/harness`) was built and five instrument defects
were found. **Every number in `07d0eef` predates all of them.** Re-measured against the
current instrument, on the same committed build, this site reads:

| gate | reported at `07d0eef` | actual |
|---|---|---|
| WCAG AA, pairs in use | **"23/23 pass"** | **214 FAIL of 1155 scored**, 12 UNMEASURABLE |
| render-truth | not run — the gate did not exist | **129 findings** (90 text-legibility, 39 tap-target) |

For comparison, on the same instrument Forge reads 1504 scored / 0 FAIL / 0 findings and
Ridge 1031 / 0 / 0. This is not a threshold quibble; it is a different order of result.

### Why the original sweep could not have caught it

Six independent reasons, each sufficient on its own:

1. **The AA audit modelled gradient bands as flat tokens.** Backgrounds were resolved via
   `getComputedStyle(el).backgroundColor`, which is `rgba(0,0,0,0)` on a gradient, so the
   walker climbed to the first solid ancestor — the white page surface — and scored
   dark-on-dark text as though it sat on white. Five of the reference's bands are
   gradients, covering the hero, both CTA bands and the stat strip.
2. **`PAIRS_IN_USE` was a hand-written list of 23 token pairs**, not a measurement of what
   the page renders. It could only ever prove the palette *can* work, never that the build
   *uses* it correctly.
3. **`normColor()` never expanded hex**, so a token file writing `#63e489` never matched
   the browser's `rgb(99, 228, 137)`. No colour token could match, `TOKEN_THRESHOLD = 0`
   was unreachable, and the check looked strict while measuring nothing.
4. **`docs/sections.md` parsed to 5 rows of ~88** under the shared parser's column order.
   Unparsed sections default to FIDELITY.
5. **There was no pixel-level gate at all.** Nothing verified that text a stylesheet
   declares is text a reader can see.
6. **`cta-primacy` did not exist**, so nothing checked that the conversion path led the page.

### What is actually wrong with the site

The call CTA is painted in **exactly its own background colour — 1:1 — on all five
routes**. `sep 0` at the pixel level: the box is one flat tone with no text in it. Also
`THE REPAIR HOLDS` on `/services` at `sep 0`, the hero H1 at 1.09, and the entire
`/services` FAQ at 1.21.

### Standing rule this establishes

**A gate that has never failed has not been shown to work.** Every one of the five defects
above reported success. The three sites built after them were caught by the same gates
within minutes of their shells landing — Forge at 1.16:1, Ridge on a secondary action
out-contrasting its primary. The gates are only credible because they have failed real
builds and been checked against a site known to be broken.

Atlas has NOT been repaired against these findings. Doing so is a build task, not a
measurement one, and it is listed in `docs/PRE-LAUNCH.md` as a blocker.
