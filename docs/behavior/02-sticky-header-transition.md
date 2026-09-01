# Behavior spec — sticky header transition

Spec only. Built in Prompt 5. **Not implemented yet.**

> **What the reference does, measured at every breakpoint in Prompt 1.**
>
> | width | `position` | height | at-top vs scrolled |
> |---|---|---|---|
> | 1440 | `fixed`, `z-index: 99999` | 129px | **identical** — same bg, same shadow (`none`), same transform |
> | 768 | `fixed` | 129px | identical |
> | 390 | **`absolute`** | 80px | **not sticky at all** |
>
> So: sticky on desktop and tablet, not on mobile, and **no visual transition between
> at-top and engaged**. Appendix A says the header shrinks or changes on scroll *only if
> the reference does*. It does not. **We ship a static sticky header.**

---

## Mechanism

**`position: sticky; top: 0`** on the header wrapper, not `position: fixed`.

Sticky keeps the header in normal flow, so it reserves its own space and the content below
does not need a compensating `padding-top`. Fixed removes it from flow, which is why the
reference needs the top bar and header stacked in a wrapper with a manual offset — a class
of bug we can avoid entirely.

Below 980 the header is **`position: static`**, matching the reference. The
mobile call bar (spec 03) carries persistent access to the phone number there instead.

`z-index` comes from the token scale, not a literal. The reference's `99999` is a symptom
of a plugin fight we do not have.

**Do NOT use, where the wrong choice is plausible:**

| not this | why |
|---|---|
| a scroll listener setting a `.scrolled` class | there is nothing to change on scroll; the listener would be pure cost |
| `IntersectionObserver` on a sentinel | same — it exists to drive a transition we do not have |
| `position: fixed` + `padding-top` on main | manual offset that breaks whenever the header height changes |
| animating `height` on scroll | not what the reference does, and it reflows the whole page below |
| `backdrop-filter` | not in the reference; expensive on mid-range Android |

## Ratio, and why

**There is no transition, and that is the specification.** No duration, no easing, no
threshold.

The one number that matters: the header is **129px at ≥980 and 80px below it**, and it must
be measured from the token spacing scale rather than hard-coded, because the in-page anchor
targets on `/services` (spec: `services-anchor-nav`) need `scroll-margin-top` equal to the
sticky header height or every anchor lands with its heading hidden underneath.

`scroll-margin-top: 129px` at ≥980, `0` below it (nothing is sticky there).

Deliberately not added, because the reference has none of them: shrink-on-scroll, a
background fade, a shadow that appears past a threshold, a hide-on-scroll-down /
show-on-scroll-up pattern. Each is a plausible "improvement" that would put us out of
fidelity with the thing we are cloning, and each costs a scroll listener.

## Failure mode

- **Inventing a scroll transition.** The tempting version adds a shadow and a height
  reduction past ~100px because it feels modern. It makes every FIDELITY and ADAPTED
  measurement on the header wrong, and it is not what the reference does.
- **`position: fixed` without reserving space.** The first section slides under the header
  on load. Then someone adds a magic `padding-top: 129px` which is correct at exactly one
  breakpoint.
- **Leaving the header sticky below 980.** 129px of a 844px-tall phone viewport is 15% of
  the screen permanently gone. The reference correctly drops sticky on mobile; so do we.
- **Forgetting `scroll-margin-top`.** Anchors on `/services` scroll the target heading to
  y=0, directly behind the sticky header. Invisible until someone tries the anchor nav.
- **A `z-index` literal.** It ends up in an arms race with the drawer, the call bar and the
  map, and eventually something lands on top of the phone number.

## Trigger

None. The header does not respond to scroll at any width.

The only state change is **the responsive one**, at 980, handled by a media query rather
than JavaScript: sticky above, static below.

On **client-side route change**, nothing happens — the header is in the persistent layout
shell and does not remount. It must therefore not hold any state that would need resetting.

## Accessibility

- Header is `<header>` with the desktop nav as `<nav aria-label="Main">`.
- A **skip link** is the first focusable element in the document: visually hidden until
  focused, then visible, jumping to `#main`. With a sticky header this is not optional —
  keyboard users otherwise tab the full nav on every route.
- `#main` has `scroll-margin-top` matching the header height, or the skip link lands the
  first heading behind the header.
- Current route link carries **`aria-current="page"`**.
- The phone CTA in the header is a real `<a href="tel:...">` with the number as visible
  text, not an icon alone — it is the primary conversion path for the whole site.
- Focus outlines on header links must not be clipped by `overflow: hidden` on the wrapper.
- No `prefers-reduced-motion` branch is needed, because there is no motion.
- Sticky positioning must not trap focus: a focused element below the header must scroll
  into view clear of it, which `scroll-margin-top` handles.
