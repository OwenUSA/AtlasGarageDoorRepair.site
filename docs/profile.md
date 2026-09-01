# docs/profile.md — reference profile and chosen measurement axes

Reference: `https://vh1roofing.com/` · profiled 2026-09-01 · Playwright + pixelmatch + sharp, nothing hosted.
Raw traces: `.harness/profile/ref-<page>-<bp>.json` (20 passes), `.harness/cap/`, `.harness/diff/`.

---

## 0. Capture path decision (made before the run, per Appendix A)

`curl` returned **200 with and without a browser UA**; headless Chromium loaded all five pages
at all four widths, 20/20 passes, zero 403s, no Cloudflare interstitial, no bot wall.

**Path taken: direct headless capture.** The headed-retry and the local-copy fallback in
`reference/` were never needed and are not in play. If the origin later starts blocking,
the fallback stands as written in `CLAUDE.md`.

---

## 1. What the reference actually is

**Not a one-pager.** This is the single most important correction to the predicted profile.
It is a **WordPress + Divi** site (`et_pb_*`, Divi Theme Builder header/footer templates,
Gravity Forms, Yoast). Four of our five routes have a real, directly-comparable counterpart:

| our route | reference counterpart | exists |
|---|---|---|
| `/` | `/` | yes |
| `/about` | `/about-vh1/` | yes |
| `/services` | `/services/` | yes |
| `/contact` | `/contact/` | yes |
| `/privacy` | `/privacy-policy/` | yes |

Consequence: **every route carries real FIDELITY-eligible sections**, not just `/`. The
Appendix A assumption that subpages must be composed from a section vocabulary and are
therefore ADAPTED/NOVEL by definition **does not apply here**. Subpages get real
page-level targets. This makes the run more measurable, not less.

Pages present in the reference but **out of scope** (D-01): `/financing/`, `/faqs/`,
`/gallery/`, `/careers/`, `/our-certifications/`. Nine `*-ok-roofing-services-*` city
pages are **DELETED** per D-02 and were never captured.

---

## 2. Page height and section count — every page we draw from

Section = one Divi `.et_pb_section` band, plus header/top-bar/footer chrome counted as
sections in their own right. Segmentation selector recorded per capture as `page.segMode`.

| page | sections | h @390 | h @430 | h @768 | h @1440 | headings (h1–h3) |
|---|---|---|---|---|---|---|
| `/` | 18 mobile / 17 desktop | 19775 | 19307 | 15306 | 9248 | 33 |
| `/about-vh1/` | 11 mobile / 12 desktop | 6855 | 6525 | 4861 | 4264 | 21 |
| `/services/` | 9 | 6311 | 6017 | 4653 | 2857 | 14 |
| `/contact/` | 5 | 3202 | 3123 | 2617 | 2254 | 6 |
| `/privacy-policy/` | 6 | 5369 | 5114 | 3460 | 2215 | 1 |

Home is **2.14× taller at 390 than at 1440** (19775 vs 9248). That ratio, not any motion
curve, is the hard part of this clone: the entire layout restacks and the density
collapses. `/privacy-policy/` restacks 2.42×, the worst on the site.

The home section-count delta (18 mobile → 17 desktop) is a real responsive divergence: one
band is suppressed at desktop. It is tracked, not smoothed over.

---

## 3. Breakpoints in the CSS

26 stylesheets, ~680 KB of CSS. Mined `@media (min|max-width)` declarations, by frequency:

| breakpoint | rules | what it is |
|---|---|---|
| `max-980` | 30 | **Divi primary** — desktop nav → mobile drawer, columns collapse |
| `max-767` | 26 | **Divi mobile** — full single-column stack |
| `min-600` | 19 | WP block/gallery internals |
| `min-981` | 16 | desktop counterpart of `max-980` |
| `min-768` | 8 | tablet counterpart of `max-767` |
| `max-479` | 5 | small-phone tightening |
| `max-768`, `min-782`, `max-782`, `max-800`, `max-900`, `max-600`, `min-480`, `min-960`, `max-460`, `max-480`, `min-1350` | 1–3 each | plugin/theme noise, not layout-bearing |

**Captured: `BP_SET` = 390, 768, 1440. Fixed, three, no fourth.** They land cleanly in the
three real bands: 390 inside `max-767` (mobile stack), 768 between `min-768` and `max-980`
(tablet), 1440 above `min-981` (full desktop).

**Recorded and skipped**, per the cost rule: 479, 600, 782, 800, 900, 960, 1350. Each extra
breakpoint multiplies every capture, diff, and agent report for the rest of the run.

**430 is captured for geometry and appearance only** (`ALL_BP` in the harness) because it is
a real iPhone-Pro-Max width on a phone-call-driven business. It is **not a diff target** and
carries no threshold. Home @430 is 19307 vs 19775 @390 — the band behaves, no surprises.

---

## 4. Motion — scroll-linked, time-driven, or neither?

**Neither. This site has essentially no motion, and that is the finding that shapes the run.**

Probed on every page at every width:

| signal | result |
|---|---|
| GSAP / ScrollTrigger | absent |
| Lenis / Locomotive (smooth-scroll hijack) | absent |
| AOS / WOW.js, `[data-aos]` attributes | absent, 0 attributes |
| Swiper / Slick / any carousel class | **0 on every page** |
| `[data-parallax]`, `[class*=parallax]`, `[data-speed]` | 0 |
| elements with a live CSS `animation-name` | **3, site-wide** |
| elements with `will-change: transform` | 0 |
| inline `window.onscroll` handler | none |
| split-text: `splitCount` on 33 headings | **0** |
| split-text: visually-hidden duplicate heading | **0 of 33** |
| headings containing any `<span>` | 3 of 33 (color spans, not split rigs) |

There is no scroll choreography, no stagger, no easing curve to reproduce, no
split-text library, no carousel. The three animated elements are Divi's scroll-to-top pip
and menu chrome.

**Therefore: no rAF motion sampling.** The instruction not to default to a motion-heavy
capture on a page whose difficulty is layout, density, or state applies exactly. Sampling
this page at 2–4px/frame would produce the single largest artifact the harness can generate
and it would be flat. A full-page rAF trace here measures nothing.

**Confirmed: this is a density, responsive-behavior, and state problem — not scroll choreography.**

---

## 5. Content — static or fetched?

**Static.** Server-rendered WordPress HTML, 244 KB on the home document. No client-side data
fetching, no hydration-dependent lists, no empty/loading states, no pagination, no filters.
Every list is a fixed authored set. Item counts are therefore literal and comparable:

| list | count |
|---|---|
| header nav links | 37 anchors (18 items in the mobile drawer, incl. the locations tree) |
| home `OUR SERVICES` block | 3610 chars, single band |
| home FAQ block | 2161 chars, 5 images |
| home testimonials | 1663 chars |
| home stat strip | 3 tiles at 225px |
| footer | 2 list items, 1 image |

No empty or loading state is reachable, because none exists.

---

## 6. State — what is actually interactive

| state | reference behavior | measured |
|---|---|---|
| **Mobile nav drawer** | Divi `.mobile_menu_bar` toggle. Panel `.et_mobile_menu` goes `display:none → block`, `position:absolute`, 312×804 at 390, 18 items, white bg. Body scroll **not** locked (`overflow: hidden auto`, `position: static`). | captured open + closed |
| **Sticky header** | `position: fixed`, `z-index: 99999`, 129px at 1440. At 390 the header is `position: absolute`, height 80px — **not sticky on mobile**. No shrink, no bg change, no shadow transition between at-top and engaged. | captured at-top + engaged |
| **Mobile sticky call bar** | **Does not exist.** Only fixed element at 390 is the scroll-to-top pip. | n/a — ours is NOVEL |
| **Top bar** | 30px navy strip above the header, static. | captured |
| **Accordions** | **0 site-wide.** The `/services/` and home FAQ blocks are flat stacked text, not disclosure widgets. | n/a |
| **Tabs / carousels / filters** | **0 site-wide.** | n/a |
| **Contact form** | Gravity Forms, `POST /contact/`, 8 visible fields: text ×4, `tel` ×1, **`email` ×1**, `select` ×1, `textarea` ×1, plus consent checkbox, reCAPTCHA, hidden state fields. No field is `required`; validation is server-side on submit. | captured pristine + focused |
| **CTA hover/active** | captured at ≥768 only (skipped below 768 per Appendix A) | captured |
| **Auth / geo gating** | **None.** Every page is public, no login, no geo-redirect, no consent gate. | verified |

Two divergences from the reference's state that are deliberate and already decided:

1. The reference form carries an **`<input type="email">` and reCAPTCHA**. Ours carries
   neither (D-03, D-05). Field count and layout are matched; the email field is replaced by
   the preferred-callback-window field so the form's box geometry stays honest.
2. The reference drawer is a **`display` toggle**, which kills its own exit transition —
   the exact failure mode named in the Prompt 4 worked example. We do **not** clone that.
   Ours is a `translate3d` panel with a real scroll lock. Recorded as an intentional
   behavior divergence, not a defect.

---

## 7. Typography and color, as measured

| | value |
|---|---|
| body font | `Montserrat, Helvetica, Arial, Lucida, sans-serif` @ 17px |
| declared families | Montserrat, Open Sans, **GD Sherpa**, ETmodules (icon font), FontAwesome, dashicons |
| heading sizes @1440 | 18, 22, 26, 27, 28, 31, 37, 38 px |
| heading weights | 500, 600, 700 |
| letter-spacing | 0 everywhere except one 18px h1 at 1px |
| line-height | **equal to font-size on every heading** (Divi `line-height: 1em`) — a real, reproducible trait |
| navy | `rgb(19, 47, 84)` (one section uses `rgb(17, 47, 84)`) |
| red | `rgb(187, 32, 38)` |
| footer / CTA grey | `rgb(172, 172, 172)` |
| page bg | `rgb(255, 255, 255)` |

**Montserrat is Google/SIL-OFL — TAKE, via `next/font`.** **GD Sherpa is a licensed display
face — REPLACE** (D-11); the substitution and its permanent text-metric floor get recorded in
`docs/known-divergence.md` in Prompt 2. Icon fonts (ETmodules, FontAwesome, dashicons) are
replaced wholesale by `lucide-react` per Appendix A.

Colors above are the **structure** the Prompt 9 randomizer will re-hue. They are recorded
here as the extraction source for Prompt 5, not as the final palette.

---

## 8. Measurement axes — capturing vs skipping

**Capturing** (these are where this site is actually hard):

| axis | why |
|---|---|
| **Geometry** — box, position, z-order, overflow, per section | the 2.14× mobile-to-desktop restack is the whole problem |
| **Static appearance** — color, bg, resolved family, weight, letter-spacing, line-height, rest opacity, borders, shadows, gradient stops, radii | a geometry-only audit is blind to the `line-height: 1em` trait, the three-color system, and the divider bands |
| **Inner grid geometry** — child box positions, derived column/row counts | density is the difficulty; section boxes alone can match while the grid inside is wrong |
| **Responsive** — the full pass at 390 / 768 / 1440, plus 430 geometry | non-negotiable for a phone-call-driven business |
| **Interactive state as its own reference** — drawer open/closed, header at-top/engaged, form pristine/focused, CTA rest/hover | the only real state on the site; each captured separately, not as a default render |
| **Data-driven list counts** — cards, list items, links, buttons per section | static authored lists, so counts are literal and comparable |

**Skipping, with reason:**

| axis | why skipped |
|---|---|
| **rAF scroll-motion sampling** | §4 — no scroll-linked motion exists. Largest possible artifact, zero signal. |
| **Split-text / per-char heading dumps** | 0/33 headings show a split signature; the check ran and came back clean. Not re-run per loop. |
| **Carousel frame capture** | 0 carousels site-wide. The hero is a static background image, not a slider or video loop. |
| **Empty / loading states** | static HTML, none reachable |
| **Hover states below 768** | Appendix A |
| **Breakpoints 479/600/782/800/900/960/1350** | recorded in §3, not captured |
| **Auth / geo paths** | none exist |

---

## 9. The instrument

```
scripts/harness/lib.mjs                shared: browser, viewport, deterministic settle, paths
scripts/harness/probe.mjs              the in-page probe — ONE source of truth, both sides
scripts/harness/profile-reference.mjs  STEP A: profile all reference pages × all widths
scripts/harness/capture.mjs            STEP B: --side ref|ours --route <r> --bp <n>
scripts/harness/diff.mjs               STEP C: --route <r> --bp <n>, all three modes
```

- `probe.mjs` runs against **both** sides, so every metric is defined identically on the
  reference and on ours. Framework-aware segmentation (Divi → `.et_pb_section`;
  ours → `main > section`) with header/footer/call-bar promoted to sections.
- **Section-relative pairing, never absolute `scrollY`.** Page heights differ by design, so
  sections are paired on normalized band midpoint (`docTop + h/2` ÷ `scrollHeight`) and each
  section is shot by clipping to its own document box. `progressDelta` per row records how
  far apart the two bands sit in normalized page progress.
- **Three modes, all live:** FIDELITY → pixelmatch over the union box, padding counts as
  divergence (a section of the wrong height *is* divergent); ADAPTED → 15 numeric + 12
  categorical structural fields; NOVEL → token conformance against the Prompt 5 `@theme`
  block, reporting `BLOCKED / no-token-set` rather than a false pass until Prompt 5 lands.
- `--route` and `--bp` are honored end to end and each pass writes only to its own
  `.harness/cap/<side>/<route>-<bp>/` directory, so a subagent can measure one section
  without touching anyone else's work.
- Concurrency is hard-capped at **2** passes in both the profiler and the capture driver.
- Each pass prints one JSON summary line and the artifact path. Traces are never echoed.

Dev server is pinned to **3101** and stays up.
