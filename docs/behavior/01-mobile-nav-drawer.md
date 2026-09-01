# Behavior spec — mobile nav drawer

Applies below 980 (the reference's own Divi breakpoint; captured at 390 and 768).
Spec only. Built in Prompt 5. **Not implemented yet.**

> **What the reference does, and why we are not copying it.** Captured at 390: the toggle is
> `.mobile_menu_bar`, the panel is `ul.et_mobile_menu`, and it opens by going
> `display: none → block`. Body scroll is **not** locked (`overflow: hidden auto`,
> `position: static`). Panel is 312×804 with 18 items. That is the exact failure mode this
> spec exists to correct — see **Failure mode** below. We clone the layout, not the defect.

---

## Mechanism

A fixed panel moved with **`transform: translate3d(100%, 0, 0) → translate3d(0, 0, 0)`**,
plus a separate backdrop element animating **`opacity` only**. Both are compositor
properties, so neither triggers layout or paint during the transition.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| `max-height` / `height` | animating either reflows the link list on every frame; the items visibly jitter |
| `left` / `right` / `top` | layout properties, not compositor ones — same jitter, worse on low-end Android |
| `display: none` on close | kills the exit transition outright; the panel snaps shut |
| `visibility` alone | not animatable in a way that reads as motion |
| `width` | reflows the text inside the panel as it opens |

**Body scroll lock** is `position: fixed; top: -<scrollY>px; width: 100%` on `<body>`, with
the scroll position stored on open and restored with `window.scrollTo(0, stored)` on close.

**Do NOT use `overflow: hidden` on `<body>`** — iOS Safari ignores it and the page scrolls
behind the open drawer.

No library. CSS transitions only; `framer-motion`, GSAP and Lenis are all barred by the
allowlist and none is needed here.

## Ratio, and why

| element | duration | easing | delay |
|---|---|---|---|
| panel `transform` | **0.32s** | `cubic-bezier(0.22, 1, 0.36, 1)` | 0ms |
| backdrop `opacity` | **0.2s** | `linear` | 0ms |
| link stagger | 0.03s apart | — | begins at **0.08s** |

**The backdrop must finish first.** It starts with the panel but completes at 200ms against
the panel's 320ms. That ordering is what makes the panel read as arriving *over a page that
is already dimmed*, rather than dragging the dimming along with it. Reverse the two and the
whole gesture feels like it is fighting the page.

The panel easing is a decelerating curve with no overshoot — it arrives quickly and settles
without bouncing, which is what a navigation surface should do. An elastic curve reads as
playful and is wrong for someone whose garage door is stuck.

**Link stagger is 0.03s across 5 items**, so the last link starts at 0.08 + 0.12 = 0.2s,
comfortably inside the panel's own 0.32s. With only five routes a longer stagger reads as a
slideshow rather than one gesture. The reference has 18 items and could afford more; we have
five and cannot.

Close is the same durations, reversed, with **no stagger** — items leave together. A
staggered exit reads as hesitation.

## Failure mode

- **Animating `max-height`.** The link list reflows mid-transition and the items jitter
  against each other. Universally the first thing tried, universally wrong.
- **`display: none` on close.** There is no exit transition at all; the panel vanishes
  between frames. This is the single most common tell of a hand-rolled drawer, and it is
  what the reference ships.
- **`overflow: hidden` on body.** Looks correct on desktop Chrome, silently fails on iOS
  Safari — the page scrolls underneath and the user loses their place entirely.
- **Backdrop and panel on the same duration.** Removes the layering cue; the drawer reads
  as flat.
- **Forgetting to restore `scrollY`.** With `position: fixed` the page jumps to the top on
  close. Worse than no lock at all.
- **Not closing on route change.** In App Router the drawer survives navigation, so the user
  taps a link, the page changes behind the panel, and the drawer is still sitting there.

## Trigger

Opens on **hamburger click**. Closes on:

- hamburger click again (toggle)
- **`Escape`** keydown
- **backdrop click** (not panel click — clicks inside must not close it)
- **`usePathname()` change** — the App Router does not unmount the drawer on navigation, so
  it must close itself in an effect keyed on pathname
- viewport crossing **980 upward** — if the desktop nav appears, the drawer must not remain
  open behind it

Repeating, not once. Re-entry is clean: state is boolean, nothing accumulates. No animation
is queued or replayed on re-open; interrupting a close mid-transition reverses smoothly
because `transform` and `opacity` are interruptible.

## Accessibility

- Toggle carries **`aria-expanded`** (true/false) and **`aria-controls`** pointing at the
  panel's `id`.
- Toggle has an accessible name — `aria-label="Open menu"` / `"Close menu"`, since it is an
  icon button.
- **Focus is trapped in the panel while open**: Tab and Shift+Tab cycle within it.
- **Focus returns to the toggle on close**, always, whichever close route fired.
- **`inert`** on the rest of the tree while open, so screen readers and the tab sequence do
  not reach the page behind the backdrop.
- Backdrop is not a focus target and is `aria-hidden`.
- Current route link carries **`aria-current="page"`**.
- The panel is a `<nav>` with an `aria-label` distinguishing it from the desktop nav.
- **`prefers-reduced-motion: reduce`** → transform transition drops to **0.01s**, opacity
  only, **stagger removed entirely**. The drawer still appears and disappears; it simply
  does not travel.
- Minimum 44×44 CSS px touch target on the toggle and every link.
