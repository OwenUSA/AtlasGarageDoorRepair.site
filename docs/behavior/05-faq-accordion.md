# Behavior spec — FAQ accordion

`/services` only, in-page. Spec only. Built in Prompt 7. **Not implemented yet.**

> **The reference has no accordion anywhere.** Prompt 1 counted disclosure widgets across
> all five pages: **0 accordions, 0 tabs, 0 carousels, site-wide.** Both the home FAQ and
> the `/services` FAQ band are flat stacked text — every question and answer visible at
> once.
>
> **We are adding one.** Reason: the home FAQ is deleted and relocated here (Prompt 3), so
> `/services` now carries the FAQ content on a page that already holds eight services in
> five symptom groups. At 390 the flat version is a very long scroll between the services
> and the CTA. This is a deliberate divergence, logged in `docs/known-divergence.md`.
>
> **Consequence:** the `/services` `s06-faq-s` section is ADAPTED, and the accordion is the
> reason — do not measure it against the reference's flat block on pixel area.

---

## Mechanism

Native **`<details>` / `<summary>`**, one per question, styled.

Native gives keyboard operation, correct screen-reader semantics, in-page find (Chrome and
Safari expand a closed `<details>` to reveal a match), and it works before hydration. A
hand-rolled `useState` accordion gives up all four.

Animation uses **`::details-content`** with `interpolate-size: allow-keywords` where
supported, so `height: 0 → auto` is animatable. Where it is not supported the panel opens
instantly — an acceptable, non-broken baseline.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| `useState` + a `div` | loses keyboard, semantics, find-in-page and pre-hydration function |
| animating `max-height: 0 → 999px` | the classic hack: the easing is wrong because the browser animates to 999px not to the real height, so short answers snap and long ones lag |
| `transform: scaleY()` | squashes and stretches the text vertically — visibly distorted mid-transition |
| `display: none` toggling | no exit transition, snaps shut |
| `visibility` + `position: absolute` | removes the content from flow, so the sections below jump |
| an "open all / close all" control | not in the reference and not needed for four questions |
| accordion behaviour on the service groups | the services are reference content and stay visible; only the FAQ collapses |

**Multiple panels may be open at once** — no `name` attribute on the `<details>` elements.
Exclusive accordions close the answer someone was still reading when they open the next.

Default state: **all closed** at every breakpoint. Four questions, so the closed stack is
short and scannable.

## Ratio, and why

| element | duration | easing |
|---|---|---|
| panel height | **0.24s** | `cubic-bezier(0.22, 1, 0.36, 1)` |
| panel content opacity | **0.16s**, delayed **0.06s** on open | `ease-out` |
| chevron rotation | **0.24s**, matched to the panel | `cubic-bezier(0.22, 1, 0.36, 1)` |

**0.24s** is the ceiling for a disclosure that a user may open four times in a row. Longer
and repeated use feels sluggish; shorter and the height change reads as a jump rather than
a reveal, which is disorienting because the content below moves.

**Opacity is delayed 6ms behind the height and finishes first (0.16 inside 0.24).** The box
opens, then the text arrives. Fading text in while the box is still growing reads as two
unrelated things happening.

**Chevron rotates 0 → 180°, on the same curve and duration as the panel.** A chevron that
finishes early breaks the sense that it is the handle for the motion.

Close is the same durations, with the opacity delay removed — text leaves immediately, box
follows.

## Failure mode

- **`max-height: 999px`.** The transition animates toward 999px, not the content's real
  height, so the perceived speed depends on how long the answer is. Short answers snap open
  and long ones drift. It is the most common accordion bug on the web.
- **Rebuilding it in React.** Loses `Ctrl+F` find-in-page reveal, loses pre-hydration
  operation, and reimplements keyboard handling that `<summary>` already has correct.
- **Exclusive open.** Closes the answer being read. With four short questions there is no
  reason to enforce one-at-a-time.
- **Animating `transform: scaleY()`.** The text visibly stretches. Obvious on any answer
  longer than a line.
- **Opening the first item by default.** Makes the closed items look like they are missing
  something, and shifts the page below on load.
- **Forgetting the layout shift.** Everything below the FAQ moves when a panel opens. Fine —
  it is user-initiated — but the CTA band below must not be mid-transition-jumpy, and no
  `IntersectionObserver` should be watching that region.
- **Putting the services in accordions too.** They are reference content, measured
  structurally; hiding them changes what is on the page.

## Trigger

- **Click or tap on `<summary>`** — native toggle.
- **`Enter` or `Space`** on a focused `<summary>` — native, no JS.
- **Find-in-page** may auto-expand a closed panel in Chromium and WebKit — native, and a
  reason to keep `<details>`.
- **Deep link**: if the URL hash targets a question, that panel opens on mount and is
  scrolled to with `scroll-margin-top` clearing the sticky header (spec 02).

Repeating and freely interruptible. Toggling mid-animation reverses from the current height
rather than snapping, because the height is interpolated by the browser.

On **client-side route change** the whole section unmounts. Panels return to all-closed on
next mount — correct, since open state is not worth persisting for four questions and
restoring it would move content under the user on arrival.

## Accessibility

- Native `<details>`/`<summary>` supplies the disclosure role and expanded state. **Do not
  add `role="button"` or a manual `aria-expanded`** to `<summary>` — it already has both,
  and duplicating them causes double announcements.
- `<summary>` must contain the question as text. The chevron is decorative:
  `aria-hidden="true"`.
- The question is a heading for document outline purposes — `<summary>` wrapping an
  `<h3>`, so the FAQ appears in the heading map.
- **`:focus-visible`** ring on `<summary>`, 3:1 against background (D-19). `<summary>` is
  focusable by default; do not remove it from the tab order.
- Remove the default disclosure triangle with `list-style: none` **and**
  `::-webkit-details-marker { display: none }`, but never by removing focusability.
- Content is real DOM whether open or closed, so it is indexable; closed panels are hidden
  from the accessibility tree by the native element, which is correct.
- Answers contain **no pricing, no response-time claim, no warranty terms and no
  credentials** — generic technical content only, per the brief.
- **`prefers-reduced-motion: reduce`** → height and opacity transitions removed; panels
  open and close instantly. The chevron still rotates but with no transition.
- No `FAQPage` JSON-LD in this build — schema is limited to `LocalBusiness` (Prompt 5), and
  adding FAQ markup would need answers we are certain of.
