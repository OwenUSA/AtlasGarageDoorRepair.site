# Behavior spec — scroll reveal

**There is none. This spec specifies the absence, and the no-motion baseline that replaces it.**

Spec only. Enforced from Prompt 5 onward. **Nothing to implement.**

---

## The finding

Prompt 1 probed every page at every breakpoint for scroll-linked and time-driven motion.
The full result, from `docs/profile.md` §4:

| signal | result |
|---|---|
| GSAP / ScrollTrigger | absent |
| Lenis / Locomotive (smooth-scroll hijack) | absent |
| AOS / WOW.js | absent, **0** `[data-aos]` attributes |
| Swiper / Slick / any carousel class | **0 on every page** |
| `[data-parallax]`, `[class*=parallax]`, `[data-speed]` | **0** |
| elements with a live CSS `animation-name` | **3, site-wide** |
| elements with `will-change: transform` | **0** |
| inline `window.onscroll` handler | none |
| split-text `splitCount` across 33 headings | **0** |
| visually-hidden duplicate heading (split-library signature) | **0 of 33** |

The three animated elements are Divi's scroll-to-top pip and menu chrome. None is content.

**There is no scroll choreography to clone.** No stagger, no easing curve, no reveal
threshold, no parallax, no split text. The reference renders its content visible and leaves
it visible.

This is why Prompt 1 skipped rAF sampling: a full-page trace at 2–4px/frame would have been
the largest artifact the harness can produce and it would have been flat.

---

## Mechanism

**Content is visible on paint. No reveal, no observer, no transition on entry.**

That is the entire mechanism. There is no `IntersectionObserver` for animation anywhere in
this build. The only `IntersectionObserver` in the codebase is the one that lazy-mounts the
map (spec 07), and it toggles *mounting*, not opacity.

**Do NOT add, where the temptation is real:**

| not this | why |
|---|---|
| fade-up-on-scroll on section entry | the reference has none; it would put every FIDELITY and ADAPTED measurement out |
| staggered card entry in the services grid | same, plus it delays the content people came for |
| a counter that animates the stat strip numbers | the numbers are `TODO(fact)` placeholders; there is nothing to count to |
| parallax on the hero | the hero is a gradient, not an image (see below) |
| `framer-motion` | allowlist permits it **only if Prompt 1 found real choreography**. It found none. Not installed. |
| Lenis / Locomotive smooth scroll | explicitly banned — scroll hijacking breaks keyboard and mobile momentum, and a repair customer scrolling to a phone number is the one thing that must not be janky |
| split-text heading animation | 0/33 reference headings use it |
| `scroll-behavior: smooth` globally | acceptable *only* for the `/services` anchor nav, and it must be inside a `prefers-reduced-motion` guard |

## Ratio, and why

**No ratio. There is no motion to time.**

The numbers that matter here are the ones that must stay at zero:

| metric | required value |
|---|---|
| `IntersectionObserver` instances used for animation | **0** |
| scroll event listeners | **0** |
| elements with a scroll-driven `transform` | **0** |
| `will-change: transform` on scrolled content | **0** |
| `framer-motion` in `package.json` | **absent** |

The only motion in this build is **interaction-triggered and local**: the nav drawer
(0.32s), the card hover lift (0.18s), the accordion (0.24s), form state changes (0.15s),
the map crossfade (0.2s). Every one responds to a direct user action. None fires from
scroll position.

**Why the absence is the right call, not laziness.** For a phone-call-driven local-services
site the difficulty is density, responsive behaviour and form/nav state. Scroll reveals add
latency between "the user scrolled here" and "the user can read this", and on a mid-range
Android they add jank to the one gesture that leads to the phone number. The reference
already made this call correctly.

## Failure mode

- **Adding reveals because the page "feels static".** It is supposed to. Every added reveal
  is a divergence from the reference measured on every section it touches, and under the
  amended `ITERATION_CAP` of 1 there is no attempt left to take it back out.
- **Animating the stat strip.** The values are literal `TODO(fact)` strings. A count-up
  animation on placeholder text is absurd, and it hard-codes an assumption that they will
  become numbers.
- **Parallaxing the hero.** There is no hero image. Prompt 2 established that home `s03` and
  four other bands are `linear-gradient(rgb(107,4,11) → rgb(187,32,38))` — no file. There is
  nothing to parallax.
- **Installing `framer-motion` "just in case".** The allowlist makes it conditional on this
  profile finding real choreography. It did not. Installing it needs a written
  justification that cannot honestly be given.
- **Global `scroll-behavior: smooth`.** Affects the skip link and every in-page jump,
  including the ones assistive technology triggers, and it is ignored under
  `prefers-reduced-motion` inconsistently across browsers. Scope it to the anchor nav.
- **A scroll listener to drive the header.** Spec 02 already establishes the header does not
  change on scroll. A listener would exist to drive nothing.

## Trigger

**Nothing is triggered by scroll position anywhere in this build**, with exactly one
exception:

- **`<BusinessMap>` mount** (spec 07) — `IntersectionObserver` at `rootMargin: 200px`,
  one-shot, then disconnects. It gates a network fetch, not an animation.

No re-entry behaviour, because nothing replays. No client-side route-change behaviour,
because no scroll state persists across navigation.

Scroll position on route change is Next.js's default: the App Router scrolls to top on
navigation. Do not override it.

## Accessibility

- **`prefers-reduced-motion` is trivially satisfied for scroll**, since there is no scroll
  motion to reduce. It still must be honoured on the five interaction-triggered animations
  listed above (D-19) — each of their specs carries its own reduced-motion clause.
- **Content is never gated behind motion.** Because nothing reveals on scroll, nothing can
  be stuck invisible if `IntersectionObserver` fails, JS is blocked, or the observer never
  fires in a headless or reader context. This is the single largest accessibility advantage
  of the no-reveal baseline, and it is worth stating explicitly: a fade-up reveal whose
  observer does not fire leaves content permanently at `opacity: 0`.
- No scroll hijacking, so keyboard `Page Down`, `Home`, `End`, spacebar and mobile momentum
  all behave natively.
- The `/services` anchor nav uses in-page links with `scroll-margin-top` matching the sticky
  header (spec 02). If smooth scrolling is applied there it must be inside
  `@media (prefers-reduced-motion: no-preference)`.
- Focus is never moved by scroll position.

## Enforcement

This spec is checkable, and should be checked in Prompt 11:

```bash
rg -n "IntersectionObserver" app components src | grep -v BusinessMap   # expect: nothing
rg -n "addEventListener\(['\"]scroll" src                                # expect: nothing
rg -n "framer-motion|lenis|locomotive|gsap|aos" package.json             # expect: nothing
```
