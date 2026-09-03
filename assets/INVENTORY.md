# assets/INVENTORY.md — asset slots, provenance, status

Built by `scripts/harness/assets.mjs` + `scripts/harness/inventory.mjs` from all five
reference pages at 390 / 768 / 1440. Raw slot geometry: `.harness/assets/*.json`.
Machine-readable inventory: `.harness/inventory.json`.

Dimensions are **rendered** pixels at each breakpoint, read off the live reference, not
intrinsic file sizes. Dominant colour is sampled from the Prompt 1 section screenshots
already on disk (`.harness/cap/ref/**/sec-*.png`) — nothing was re-fetched to build this.

## Provenance rule (D-09, D-11)

- **TAKE** — generic UI icons and open-licensed fonts, license verified in one step.
- **REPLACE** — the reference business's photos, logo, wordmark, vehicle and staff shots,
  badge images, brand/partner logos, and any licensed font file. **These are theirs.
  Not one REPLACE asset was downloaded into this repo, not even temporarily.** Every row
  below was measured from the live DOM and the screenshots we already had.

**Every photographic slot on this site is REPLACE.** The reference is a real business's
site; its imagery is entirely its own. There is no generic stock in it to inherit.

---

## TAKE — acquired

| asset | provenance | license | how it lands | status |
|---|---|---|---|---|
| **Montserrat** (300/500/600/700) | Google Fonts | **SIL Open Font License 1.1** — verified in one step | `next/font/google` in Prompt 5, self-hosted at build, no CDN call | ACQUIRED |
| **lucide-react** icons | npm, allowlisted | **ISC** | replaces the reference's three icon fonts; match stroke width and size, not the exact glyph | ACQUIRED (`lucide-react@1.39.0`) |

No binary font or icon file is checked into `public/`. `next/font` self-hosts Montserrat
from the package at build time and `lucide-react` ships SVG paths as components — that is
the acquisition. `public/` therefore contains placeholders only, which is correct.

### Fonts found, and what happened to each

| family | where it came from | rendered on the public page? | decision |
|---|---|---|---|
| **Montserrat** | Google Fonts, 54 `@font-face` rules, weights 100–900 | **yes — 138 text nodes**, the entire design | **TAKE**, OFL |
| Helvetica | system fallback, 4 nodes at 10–11px | yes, incidentally | n/a — system stack |
| **ETmodules** | Divi theme icon font (`modules.woff`) | yes, 1 glyph at 59.5px | **REPLACE** → `lucide-react` |
| **FontAwesome** | Divi bundle (`fa-solid-900.woff2`, `fa-regular-400.woff2`) | no rendered glyphs found | **REPLACE** → `lucide-react` |
| dashicons | WordPress admin, base64 data URI | no | dropped — admin chrome, not site design |
| gform-icons-orbital | Gravity Forms | no | dropped — we ship no Gravity Forms |
| **GD Sherpa** | `.godaddy-styles`, `#wpadminbar` | **no — hosting control-panel chrome only** | **not a design font.** No `@font-face`, never rendered. Not substituted, because it was never used. |

**There is no licensed display-font substitution on this build.** The Prompt 1 profile
flagged "GD Sherpa" from a raw CSS scrape; the `@font-face` enumeration in this prompt
shows it has no font file and styles only the GoDaddy admin bar. The only design face is
Montserrat, which is OFL and comes in unchanged. See `docs/known-divergence.md` — this
removes a floor that was expected to exist, and adds a smaller one for icon glyphs.

---

## REPLACE — every slot, with the geometry a generator needs

`object-fit` is the CSS `object-fit` for `<img>`/`<video>` and the `background-size` for
CSS background slots. **Aspect Δ** marks a slot whose aspect ratio changes between
breakpoints — those get a second crop in Prompt 10, per OVERRIDE 2.

| slot ID | route | section | kind | 390 | 768 | 1440 | aspect @1440 | object-fit | dominant | aspect Δ | placeholder |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `about-partner-logo` | /about | s08 | img | 312x44 | 614x87 | 970x137 | 7.08:1 | fill | `#f7f6f6` | **yes** | `about-partner-logo.svg + about-partner-logo-alt.svg` |
| `about-photo` | /about | s06 | bg | — | — | 1440x697 | 2.07:1 | cover | `#c5c4c4` | no | `about-photo.svg` |
| `about-title-bg` | /about | s02 | bg | 390x100 | 768x100 | 1440x100 | 14.40:1 | cover | `#857888` | **yes** | `about-title-bg.svg + about-title-bg-alt.svg` |
| `home-badge-angi-wordmark-1c-heart-rgb-svg` | / | s06 | img | 300x183 | — | — | - | fill | `#d6d5d7` | no | `home-badge-angi-wordmark-1c-heart-rgb-svg.svg` |
| `home-badge-bbb-a-rating` | / | s06 | img | 300x130 | — | — | - | fill | `#d6d5d7` | no | `home-badge-bbb-a-rating.svg` |
| `home-badge-certainteed-logo-rgb` | / | s06 | img | 300x68 | — | — | - | fill | `#d6d5d7` | no | `home-badge-certainteed-logo-rgb.svg` |
| `home-badge-davinci-logo` | / | s06 | img | 300x161 | — | — | - | fill | `#d6d5d7` | no | `home-badge-davinci-logo.svg` |
| `home-badge-fortified-logo-roof` | / | s06 | img | 300x143 | — | — | - | fill | `#d6d5d7` | no | `home-badge-fortified-logo-roof.svg` |
| `home-badge-gaf-certified-steep-slope-logo` | / | s06 | img | 300x113 | — | — | - | fill | `#d6d5d7` | no | `home-badge-gaf-certified-steep-slope-logo.svg` |
| `home-badge-haag-logo-2` | / | s06 | img | 300x264 | — | — | - | fill | `#d6d5d7` | no | `home-badge-haag-logo-2.svg` |
| `home-badge-hba-logo` | / | s06 | img | 300x124 | — | — | - | fill | `#d6d5d7` | no | `home-badge-hba-logo.svg` |
| `home-badge-orca-logo-fi` | / | s06 | img | 300x169 | — | — | - | fill | `#d6d5d7` | no | `home-badge-orca-logo-fi.svg` |
| `home-badge-osha-logo` | / | s06 | img | 300x86 | — | — | - | fill | `#d6d5d7` | no | `home-badge-osha-logo.svg` |
| `home-badge-owens-logo` | / | s06 | img | 300x113 | — | — | - | fill | `#d6d5d7` | no | `home-badge-owens-logo.svg` |
| `home-cert-badge` | / | s06 | img | 312x114 | 614x225 | 510x187 | 30:11 | fill | `#d9d8da` | **yes** | `home-cert-badge.svg + home-cert-badge-alt.svg` |
| `home-hero-media` | / | s03 | video | 1600x900 | 1920x1080 | 1440x810 | 16:9 | contain | `#1f334a` | no | `home-hero-media.svg` |
| `home-intro-photo-a` | / | s04 | img | 382x224 | 753x441 | 419x245 | 1.71:1 | fill | `#8b2631` | no | `home-intro-photo-a.svg` |
| `home-intro-photo-b` | / | s04 | img | 382x224 | 753x441 | 419x245 | 1.71:1 | fill | `#8b2631` | no | `home-intro-photo-b.svg` |
| `home-process-mobile` | / | s09 | img | 312x1300 | 480x2000 | — | - | fill | `#e9b5b5` | no | `home-process-mobile.svg` |
| `home-process-step` | / | s09 | img | — | — | 202x337 | 0.60:1 | fill | `#e6adae` | no | `home-process-step.svg` |
| `home-video-b` | / | s09 | video | 312x176 | 614x346 | 510x287 | 1.78:1 | contain | `#c6c7c5` | **yes** | `home-video-b.svg + home-video-b-alt.svg` |
| `home-video-c` | / | s12 | video | 386x217 | 760x428 | 674x379 | 1.78:1 | contain | `#923c4d` | no | `home-video-c.svg` |
| `home-video-poster-a` | / | s09 | bg | 312x176 | 614x346 | 510x287 | 1.78:1 | cover | `#c6c7c5` | **yes** | `home-video-poster-a.svg + home-video-poster-a-alt.svg` |
| `home-video-poster-b` | / | s12 | bg | 386x217 | 760x428 | 674x379 | 1.78:1 | cover | `#923c4d` | no | `home-video-poster-b.svg` |
| `services-body-bg` | /services | s04 | bg | 390x1764 | 768x1279 | 1440x783 | 1.84:1 | cover | `#ebe9e9` | **yes** | `services-body-bg.svg + services-body-bg-alt.svg` |
| `services-faq-bg` | /services | s06 | bg | 312x674 | 614x674 | 510x674 | 0.76:1 | cover | `#384b5d` | **yes** | `services-faq-bg.svg + services-faq-bg-alt.svg` |
| `services-title-bg` | /services | s02 | bg | 390x100 | 768x100 | 1440x100 | 14.40:1 | cover | `#6b6d5e` | **yes** | `services-title-bg.svg + services-title-bg-alt.svg` |
| `logo-footer` | all | s16 | img | — | — | 378x252 | 3:2 | fill | `#ececee` | no | `logo-footer.svg` |
| `logo-primary` | all | chrome-header | img | 300x120 | 300x120 | 300x120 | 5:2 | fill | `#ede8eb` | no | **SUPPLIED** `logo-primary.png` (640x169) |
| `logo-mark` | all | favicon / apple-icon | img | — | — | 512x512 | 1:1 | contain | transparent | no | **SUPPLIED** `logo-mark.png` |
| `logo-social` | all | og:image / JSON-LD `image` | img | — | — | 1456x736 | 1.98:1 | — | `#f6f6f1` | no | **SUPPLIED** `atlas-door-logo-new.jpg` |

### Slot notes

- **`about-partner-logo`** — Partner/affiliation logo band. Ours is a TODO(fact) chip row.
- **`about-photo`** — Their crew/site photo.
- **`about-title-bg`** — Page-title strip background.
- **`home-badge-angi-wordmark-1c-heart-rgb-svg`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-bbb-a-rating`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-certainteed-logo-rgb`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-davinci-logo`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-fortified-logo-roof`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-gaf-certified-steep-slope-logo`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-haag-logo-2`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-hba-logo`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-orca-logo-fi`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-osha-logo`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-badge-owens-logo`** — Third-party certification / rating badge. We hold none we may name; becomes a TODO(fact) chip at the same dimensions (D-14).
- **`home-cert-badge`** — Manufacturer certification badge. Ours is a TODO(fact) chip at the same box.
- **`home-hero-media`** — Their brand video. Poster image placeholder only, no video in this build.
- **`home-intro-photo-a`** — Their vehicle shot.
- **`home-intro-photo-b`** — Their vehicle shot.
- **`home-process-mobile`** — Single stacked composite used INSTEAD of the 5 desktop tiles below 980. Aspect changes between breakpoints — needs a second crop in Prompt 10.
- **`home-process-step`** — Process step illustrations, 5 at desktop. Rendered 5× in the band.
- **`home-video-b`** — Their brand video. Poster placeholder only.
- **`home-video-c`** — Their brand video. Poster placeholder only.
- **`home-video-poster-a`** — Video cover frame behind an embedded video.
- **`home-video-poster-b`** — Video cover frame behind an embedded video.
- **`services-body-bg`** — Full-bleed section background behind the services body.
- **`services-faq-bg`** — Their vehicle shot behind the FAQ band.
- **`services-title-bg`** — Page-title strip background. Rendered 2× in the band.
- **`logo-footer`** — Their logo again, footer lockup.
- **`logo-primary`** — Their wordmark. **Ours is now the supplied Atlas lockup** (`atlas-door-logo-new.jpg`,
  handed over 2026-09-03; superseded the first burgundy cut the same day — same artwork,
  restated in the rust/red that sits with the navy + orange palette). The JPG ships as-is for `og:image` and JSON-LD `image`; for the header it was
  keyed off its off-white studio backdrop and trimmed to the artwork box (910x240, served at 640w as
  `logo-primary.png`) so the mark sits on `--color-surface` with no visible plate. The `A` glyph, squared
  and padded, is `logo-mark.png` → `src/app/icon.png` + `apple-icon.png`. The Montserrat text wordmark is gone.

---

## DELETED — inventoried, deliberately not filled

| slot ID | route | section | 1440 | why |
|---|---|---|---|---|
| `home-brand-strip` | / | s07 | 1080x338 | Supplier brand logo strip. Deliberate drop #2 per docs/sections.md. |

Additionally **not inventoried as slots at all**, per D-02: the two Google My Maps
service-area embeds on home, the home service-area map band (`s14`), and every asset on
the nine city landing pages. They are not gaps to fill; they are removals.

Also excluded: `mejs-controls.svg` (MediaElement.js player chrome — framework UI, not a
design asset) and the base64 `dashicons` face (WordPress admin).

---

## Video

The reference plays **three `.mp4` files**, none with a `poster` attribute:

| file | rendered 390 | 768 | 1440 | our slot |
|---|---|---|---|---|
| `vh1_roofing-1080p.mp4` | 1600x900 | 1920x1080 | 1440x810 | `home-hero-media` |
| `VH1_052826.mp4` | 312x176 | 614x346 | 510x287 | `home-video-b` |
| `VH1_roofing_1215.mp4` | 386x217 | 760x428 | 674x379 | `home-video-c` |

**No video ships in this build** (Appendix A). Each becomes a poster image slot at the same
box and aspect. Two of the three sit behind a CSS background cover frame
(`home-video-poster-a`, `home-video-poster-b`) which is the still we actually need.

## Responsive asset swaps worth knowing before Prompt 6

Two slots are not one image at three sizes — the reference serves **different assets** by
breakpoint, and rebuilding them as a single responsive image would be wrong:

1. **Process steps.** Desktop renders **five separate 202x337 tiles**
   (`home-process-step`). Below 980 those are hidden and a **single 312x1300 / 480x2000
   stacked composite** takes over (`home-process-mobile`). Different art, not a resize.
2. **Trust badges.** Mobile renders **eleven individual badge images** at 300×N
   (`home-badge-*`). Desktop hides them and shows one **1080x338 composite strip**
   (`home-brand-strip`, which we DELETE). Our badge row is TODO(fact) chips either way.

## Gradients are tokens, not assets

The home hero and four other bands read as "background images" but are
`linear-gradient(rgb(107,4,11) → rgb(187,32,38))` — no file. They belong to the Prompt 5
token set, not this inventory. Recorded here so nobody hunts for a hero JPEG that does not
exist.

---

## Placeholders

37 generated SVGs in `public/placeholders/`, checked in. Each is a flat fill of the
slot's sampled dominant colour with the slot ID and pixel dimensions as text — nothing
else. No external placeholder service, no network dependency at build or runtime.

Files carrying an `-alt` suffix are the second crop for a slot whose aspect changes
between breakpoints.

**Placeholder slots are a tracked gap, not a blocker.** They are listed in
`docs/known-divergence.md` as permanent floors until Prompt 10 hands back real files, and
any section whose diff is blocked by one is reported with the placeholder area excluded.

## Tally

| | count |
|---|---|
| slots inventoried | 30 |
| REPLACE | 29 |
| DELETED | 1 |
| TAKE | 2 (Montserrat, lucide-react) |
| placeholders generated | 37 |
| REPLACE assets downloaded | **0** |
