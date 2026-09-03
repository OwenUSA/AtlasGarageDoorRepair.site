# Behavior spec — service card hover and press

Hover at ≥768 only (Appendix A: skip hover below 768). Press at all widths.
Spec only. Built in Prompt 6. **Not implemented yet.**

> **Reference behaviour.** Prompt 1 captured CTA rest and hover states at ≥768. The Divi
> buttons carry a `background-color` and `border-color` transition; the service blocks
> themselves are not interactive cards in the reference — they are stacked text. Our
> services are regrouped by symptom (Prompt 3) into card-shaped blocks, so this spec
> defines a card interaction the reference does not have, held to the reference's own
> transition character rather than invented from scratch.

---

## Mechanism

Two separately-animated properties, both compositor-friendly:

- **`transform: translateY(-2px)`** on hover
- **`box-shadow`** rest → raised

Colour changes (`background-color`, `border-color`) transition alongside, matching the
reference's button character.

The whole card is a link surface, built with a **stretched-link pattern**: the card is
`position: relative`, and the heading contains a single `<a>` with a `::after` covering the
card. One anchor, one accessible name, one tab stop — the card is not itself focusable.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| `transform: scale()` | scales the text too, so type gets blurry mid-transition and the card's borders thicken visibly |
| animating `top` / `margin-top` | layout properties; reflows every sibling card in the grid |
| animating `height` on a "reveal more" hover | reflows the grid row and shoves neighbouring cards down |
| a `<div onClick>` card | not focusable, not announced, no middle-click, no open-in-new-tab |
| wrapping the whole card in `<a>` | swallows the service name, the body copy and the `tel:` link into one enormous accessible name |
| nested `<a>` inside the card `<a>` | invalid HTML; browsers unnest it unpredictably |
| `:hover` styles below 768 | sticky hover on touch — the card stays "hovered" after the tap |

Hover rules are wrapped in **`@media (hover: hover) and (pointer: fine)`**, not a width
query. A width query still applies hover to a 1024px touch tablet.

## Ratio, and why

| state | property | duration | easing |
|---|---|---|---|
| rest → hover | `transform`, `box-shadow`, colours | **0.18s** | `ease-out` |
| hover → rest | same | **0.24s** | `ease-out` |
| press (`:active`) | `transform: translateY(0)` | **0.08s** | `ease-out` |

**Leaving is slower than arriving (0.24 vs 0.18).** Entry should feel responsive to the
cursor; exit should not feel like the card is fleeing. Equal durations make a grid of cards
feel twitchy when the pointer crosses several in succession.

**The lift is 2px, not 8px.** These cards sit in a dense grid on a local-services page. A
large lift turns pointer movement across the grid into a wave of bobbing, and it fights the
reference's flat, squared design language. 2px plus a shadow reads as "this is clickable"
without theatre.

**Press returns to `translateY(0)`** — the card goes *down* to meet the click, cancelling
the hover lift. Pressing something should not raise it further.

0.08s on press is at the floor of perceptible; any longer and the visual feedback lags the
navigation that follows.

## Failure mode

- **`transform: scale(1.03)`.** The classic choice. Text renders blurry during the
  transition on non-integer scales, borders visibly thicken, and any image inside crops
  differently at each frame.
- **Animating `height` to reveal a description.** Reflows the whole grid row; sibling cards
  jump. The information should be visible, not hidden behind a hover a touch user can never
  perform.
- **A big shadow with a big lift.** Reads as a floating tile, not a service listing, and is
  out of character with the reference's flat bands.
- **Hover styles applied on touch.** Without `@media (hover: hover)` the card stays in its
  hover state after a tap on iOS, so it looks selected until something else is tapped.
- **The whole card as one `<a>`.** The accessible name becomes the service name plus the
  entire body paragraph plus "Call (239) 427-4221" — unusable in a links list.
- **A `div` with `onClick`.** No keyboard access, no context menu, no middle-click, nothing
  announced. Every one of those matters more than the hover does.
- **Transitioning `all`.** Sweeps up properties that should not animate and creates
  unpredictable cost.

## Trigger

- **Hover**: pointer enter/leave, `@media (hover: hover) and (pointer: fine)` only.
  Repeating, freely interruptible — `transform` and `opacity` transitions reverse cleanly
  mid-flight, so crossing the grid quickly never queues or stutters.
- **Press**: `:active` on pointer-down and on `Enter`/`Space` via the focused anchor.
- **Focus**: `:focus-visible` shows the focus ring; it does **not** apply the hover lift.
  Focus is not hover, and conflating them makes keyboard traversal of the grid jump.

On **client-side route change** the cards unmount and remount with no persisted state —
there is no state to persist, since every state here is a CSS pseudo-class. Nothing needs
resetting, and nothing can be left stuck.

Re-entry mid-transition: handled natively by CSS transition interruption. No JS involved.

## Accessibility

- One anchor per card, wrapping the **service name only**. The accessible name is the
  service, e.g. "Spring repair and replacement".
- The stretched `::after` makes the card clickable without extending the accessible name.
- Text inside the card remains selectable — the `::after` must not sit above the body copy
  in a way that blocks selection (`pointer-events` handled so the heading link keeps
  priority but text selection still works).
- **`:focus-visible`** ring, not `:focus`, so a mouse click does not leave a ring behind.
- Focus ring holds **3:1 against both the card background and the page background**
  (D-19), re-verified after the Prompt 9 recolor.
- The ring must not be clipped: the card cannot use `overflow: hidden` with a ring drawn
  outside its box — use `outline-offset` with room in the layout.
- Hover must never be the only way to reach information. Everything in the card is visible
  at rest.
- The per-card `tel:` link is a separate, clearly-labelled anchor, not folded into the
  stretched link.
- **`prefers-reduced-motion: reduce`** → `transform` transitions removed entirely; the
  shadow and colour change remain, so the affordance survives without movement.
