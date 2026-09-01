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

## 5. Palette — applied in Prompt 5 (amendment A-7)

**Colour divergence from the reference is intentional and is permanently excluded from
every diff, every threshold, and every future iteration.** The palette was randomized at
token-write time, so the site was built in its final colours from the first component
onward — there was no recolor pass and therefore no geometry/typography regression to
prove innocent.

### Seeds — the record

| | |
|---|---|
| master seed | `20260901` |
| **winning seed** | **`500656`** |
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
