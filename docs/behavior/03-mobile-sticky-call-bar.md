# Behavior spec — mobile sticky call bar

Below 768. Spec only. Built in Prompt 5. **Not implemented yet.**

> **The reference has no counterpart.** Prompt 1 enumerated every `fixed`/`sticky` element
> at 390: the only one is `.et_pb_scroll_top`, a scroll-to-top pip. There is no call bar.
> This element is **NOVEL** — required by D-04, measured by token conformance, not by
> pixel diff.
>
> It also exists because the header is `position: static` below 980 (spec 02). Once the
> user scrolls past the header on a phone, the phone number is gone from the screen. For a
> business whose entire conversion path is a phone call, that is the gap this closes.

---

## Mechanism

**`position: fixed; bottom: 0; left: 0; right: 0`** containing a single
`<a href="tel:+14055550163">` with the number as visible text.

It is **always present below 768** — no scroll trigger, no reveal, no hide-on-scroll-down.
It is not an animation; it is a persistent surface.

`padding-bottom: env(safe-area-inset-bottom)` so it clears the iOS home indicator. Without
it the tap target sits under the system gesture area on every notched iPhone.

The document gets `padding-bottom` equal to the bar's height below 768, so the footer's last
line is not permanently covered.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| reveal-on-scroll (`IntersectionObserver`) | a bar that appears at 400px is absent exactly when someone lands mid-page from search |
| hide-on-scroll-down | hides the phone number during the gesture people use while reading |
| `position: sticky` | needs a scrolling ancestor of the right height; fragile here |
| a floating circular action button | an icon alone does not show the number, and the number showing is the point |
| `100vh`-based offsets | mobile browser chrome changes `vh` mid-scroll; use `dvh` or fixed px |
| rendering it above 768 | the header CTA already covers that; two would compete |

Rendered server-side and shown/hidden by media query, **not** by a JS width check — a
JS-gated bar flashes in after hydration, which on a slow phone is exactly when someone is
reaching for it.

## Ratio, and why

| property | value | why |
|---|---|---|
| height | **56px** + safe-area inset | 56 clears the 44px minimum touch target with real padding; 48 is legal but cramped for a primary CTA |
| press feedback | `transform: scale(0.98)`, **0.1s** `ease-out` | fast enough to feel like the tap registered, short enough not to delay `tel:` handoff |
| `z-index` | above page content, **below the nav drawer and its backdrop** | an open drawer must not have the call bar floating over it |
| contrast | highest on the page | Prompt 9 constraint: the call-now CTA stays the highest-contrast, highest-chroma element sitewide. The randomizer must not be allowed to make it recede. |

No entrance animation. It is present on first paint, so there is nothing to animate.

## Failure mode

- **Making it appear on scroll.** Feels considerate, is actively harmful: the most common
  arrival is a search result landing mid-page, and a scroll-triggered bar is absent at
  precisely that moment.
- **Hide-on-scroll-down.** Reading a service description means scrolling down, which is
  exactly when someone decides to call.
- **Icon-only.** A phone glyph is not a phone number. The visible number is what makes it a
  conversion path rather than a widget.
- **Forgetting `env(safe-area-inset-bottom)`.** On any notched iPhone the tap lands on the
  home indicator instead of the button.
- **Forgetting the body offset.** The footer's last row is permanently unreachable, which
  usually hides the privacy link — the one link with a compliance reason to be reachable.
- **`z-index` above the drawer.** The call bar floats over the open menu and its backdrop.
- **Rendering it at 1440 too.** Duplicate CTAs competing on the same page.

## Trigger

**No trigger.** It is present whenever the viewport is below 768, from first paint until the
viewport crosses 768.

The only interaction is the tap, which hands off to the OS dialler via `tel:`. That is a
navigation, not a state change — nothing in the app needs to respond to it.

On **client-side route change**, nothing happens: the bar lives in the layout shell, does
not remount, and holds no state. It must look identical on all five routes.

Re-entry: not applicable, nothing fires more than once.

## Accessibility

- A real `<a href="tel:+14055550163">`, never a `<button>` with an `onClick`. Links to
  `tel:` are announced correctly and work with the OS dialler; a scripted button does not.
- Accessible name states the action and the number:
  `aria-label="Call Atlas Garage Door Repair at (405) 555-0163"`. "Call now" alone gives a
  screen-reader user no way to note the number down.
- The number is **visible text**, so it is selectable and copyable.
- Tap target ≥ 44×44 CSS px; the 56px bar height satisfies this with margin.
- Visible focus ring with **3:1 contrast against both the bar and the page behind it**
  (D-19, and re-verified after the Prompt 9 recolor).
- It is in the DOM **after** `<main>`, so it does not intercept the tab order on the way
  into page content — but it is still reachable by keyboard.
- Marked `inert` (or `aria-hidden` plus `tabindex="-1"`) while the nav drawer is open, so
  it is not reachable behind the drawer's focus trap.
- `prefers-reduced-motion: reduce` → the 0.1s press scale is dropped; the colour change on
  `:active` remains, so the tap still has feedback.
- Does not overlap the map's "Get directions" link or the form's submit button at 390 —
  checked at build, since both sit near the bottom of their sections.
