# BUILDER BRIEF — Prompt 6/7 dispatch wave

Read this first. It is the contract for every builder agent in this wave.

## Non-negotiables

1. **THE SHELL IS FROZEN.** Do NOT edit any of these. If you need a change in one, STOP and
   report it as a handback — the lead makes the edit, then re-dispatches you:
   - `src/app/globals.css` (tokens)
   - `src/app/layout.tsx`
   - `src/components/SiteHeader.tsx`, `NavLinks.tsx`, `SiteFooter.tsx`, `CallBar.tsx`
   - `src/components/BusinessMap.tsx`, `JsonLd.tsx`, `primitives.tsx`
   - `src/lib/business.ts`
   - `content/copy.ts`
   - Anything under `scripts/`
   You MAY import from all of them. You may not modify them.

2. **NO NEW TOKENS.** Every colour, font size, weight, radius, shadow and spacing value
   must already exist in the `@theme` block of `src/app/globals.css` (67 tokens). No hex,
   no `rgb()`, no `hsl()`, no arbitrary px values for anything a token covers. If you need
   a token that does not exist, it comes back to the lead or it does not happen.
   Layout-only arbitrary values (`max-w-[52ch]`, `min-h-[741px]`) are fine.

3. **COPY COMES FROM `content/copy.ts`.** Import it; never retype it, never reword it. The
   ±10% character parity with the reference is what makes the diff meaningful. If copy
   genuinely does not fit the layout, that is a REPORT LINE, not an edit.

4. **NEVER INVENT A BUSINESS FACT.** No credentials, years, headcount, review counts,
   prices, response times, warranty terms. `TODO(fact):` strings are already in the copy —
   render them literally. Testimonials render the literal `[TESTIMONIAL PLACEHOLDER n — …]`
   strings. No `AggregateRating` or `Review` JSON-LD anywhere.

5. **NO EMAIL, ANYWHERE.** No `mailto:`, no `type="email"`, no `@`-bearing address, no
   newsletter/subscribe wording, no envelope icons.

6. **ITERATION_CAP = 1.** Build it, diff it, ONE fix attempt, then it is floored. Write the
   residual and your best hypothesis into your report. Never a second attempt.
   Reverting a regression YOU introduced is not a second attempt.

## How to build

- Business facts: `import { business, telHref, routes } from '@/lib/business'`.
- Copy: `import { copy } from '../../content/copy'` (adjust depth) then pick your section by
  `id`, e.g. `copy.routes['/about'].sections.find(s => s.id === 's05-our-mission')`.
- Icons: `lucide-react` only. Match stroke width and size, not the exact glyph.
- Placeholders: `public/placeholders/<slot-id>.svg`, dimensions in `assets/INVENTORY.md`.
  Use a plain `<img>` with `alt=""` `aria-hidden` for decorative slots.
- Behaviour: `docs/behavior/01`–`08`. **Spec 02 = a STATIC header** (no scroll transition).
  **Spec 08 = the no-motion baseline** — the reference has ZERO scroll choreography, so do
  not add reveals, staggers, parallax or count-ups. Interaction-triggered motion only.
- Section markup shape matters to the metric: each band is a **full-width block with zero
  padding**, and an **inner container** (`mx-auto max-w-content px-4 md:px-gutter`) carries
  the layout. Making the band itself a flex container changes its computed display,
  padding, gap and width and shows up as structural divergence.
- Put `data-section="<id>"` on the band element. The harness segments on it.

## Useful tokens (the full set is in globals.css)

Colours: `primary`, `primary-deep`, `accent`, `accent-deep`, `surface`, `neutral-200`,
`neutral-400`, `neutral-600`, `neutral-900`, `border`, `border-strong`, `focus`, `error`,
`success`, `warning`.
Type: `text-2xs xs sm base md lg xl 2xl 3xl 4xl 5xl 6xl 7xl 8xl`, `font-light/normal/medium/semibold/bold`,
`leading-heading` (=1, the reference's signature), `leading-body` (=1.6), `tracking-wide`.
Spacing: `hair tight snug gutter loose wide band band-lg rule` (e.g. `py-band`, `gap-wide`),
plus Tailwind's numeric scale for generic layout.
Chrome: `h-topbar h-header h-header-sm h-callbar`. Container: `max-w-content`, `max-w-wide`.
Motion: `duration-[var(--duration-fast|quick|base|panel)]`, `ease-out-quint`.

## How to measure — you MUST do this

The dev server is already running on **port 3101**. Do not start or restart it.

```bash
MSYS_NO_PATHCONV=1 node scripts/harness/capture.mjs --side ours --route <YOUR ROUTE>
MSYS_NO_PATHCONV=1 node scripts/harness/diff.mjs --route <YOUR ROUTE>
```

Only ever pass YOUR OWN route. Never run a full sweep — the lead does that once at the end.

Read your numbers out of `.harness/diff/<slug>-<bp>.json`. Thresholds by class
(`docs/sections.md` is the contract):

| class | metric | done at |
|---|---|---|
| FIDELITY | divergent px area % | < 2% |
| ADAPTED | structural deviation % | < 5% |
| NOVEL | token violations | 0 |

Colour is excluded from the structural comparator (amendment A-8) — do not chase colour.
NOVEL and DELETED are measured once at 1440 only (A-9).

## What to return

**The report table and NOTHING else.** No transcripts, no file contents, no narration of
what you tried.

```
route | section | breakpoint | class | metric | value | threshold | status
```

Then, in at most a few lines each:
- **floored**: any section that missed after its one fix attempt — residual + best hypothesis
- **blocked**: placeholder/asset/known-floor items you correctly did not chase
- **handbacks**: anything you needed in a frozen file
- **new TODO(fact)**: anything that must go into `docs/facts-needed.md`
