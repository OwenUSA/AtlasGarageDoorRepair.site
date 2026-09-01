# docs/known-divergence.md — permanent floors

**Read this before starting any fix.** Everything on this page is a *decision* or a
*substitution*, not a defect. None of it is closable by iterating, and burning an
`ITERATION_CAP` attempt against any of it is wasted work.

When a section's diff is blocked by a row here, report it as a **known floor** with the
blocked area excluded from the measurement — never as a fixable divergence.

Last updated: Prompt 2.

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

---

## 5. Palette — reserved for Prompt 9

Once Prompt 9 applies the randomized palette, **colour divergence from the reference
becomes intentional and is permanently excluded from every diff, threshold, and future
iteration.** Geometry and typography must not move.

- winning seed: _pending Prompt 9_
- all five candidate seeds: _pending Prompt 9_

---

## 6. Instrument-level floors

| item | note |
|---|---|
| Home has 18 bands at 390/768, 17 at 1440 | Real responsive divergence in the reference. The extra band is reported `UNMATCHED / no 1440 counterpart`, never measured. |
| Breakpoints 479, 600, 782, 800, 900, 960, 1350 | Exist in the reference CSS, deliberately not captured. `docs/profile.md` §3. |
| 430 captured for geometry only | Real-device width, no threshold, not a diff target. |
| No rAF motion traces | The reference has no scroll-linked motion. `docs/profile.md` §4. |
