# CLAUDE.md — Atlas Garage Door Repair, clone-and-adapt build chain

This file is the standing contract for the 11-prompt sequential chain defined in
`process.md`. It is written before any work. One prompt per turn: do Prompt N, produce its
deliverable, stop. Never roll into the next prompt.

**GOAL:** a faithful clone of the design system and layout of REFERENCE, adapted to our own
five routes, our own copy, our own fictional business facts, and our own randomized
palette, shipped as a local-only Next.js site.

---

## CONSTANTS — final. Use verbatim wherever `process.md` says `<...>`.

```
REFERENCE          = https://vh1roofing.com/
STACK              = Next.js 15 App Router + TypeScript (strict) + Tailwind v4
                     (CSS-first @theme) + Node 22.20.0 + pnpm 10.25.0
PORT               = 3101          (fixed; kill anything holding it, never move)
PKG                = pnpm
THRESHOLD          = 2%            divergent pixel area — FIDELITY sections
STRUCT_THRESHOLD   = 5%            structural metric deviation — ADAPTED sections
TOKEN_THRESHOLD    = 0             token violations — NOVEL sections

ROUTES             = /  /about  /services  /contact  /privacy
BREAKPOINTS        = <filled by Prompt 1 from the reference CSS>

BUSINESS           = Atlas Garage Door Repair
TAGLINE            = The repair holds. That is the whole promise.
PHONE              = (405) 555-0163
ADDRESS            = 2317 Harrow Bend, Edmond, OK 73013
MAP_COORDS         = 35.6528,-97.4781
HOURS              = 7 days, 7:00 AM – 7:00 PM
SERVICE_AREA       = Serving Edmond and the north Oklahoma City metro.

MAX_AGENTS         = 4             hard concurrency cap (amended, was 2)
ITERATION_CAP      = 1             ONE fix attempt per section, then floored and logged (amended, was 3)
BP_SET             = 390, 768, 1440   exactly three
```

**EVERY BUSINESS FACT ABOVE IS FICTIONAL AND DELIBERATE.** The address does not exist; the
coordinates are real Edmond coordinates and the map is embedded by coordinates only, per
D-07. The phone is in the 555-01XX reserved range and cannot ring anyone. Treat all of it
as ground truth for the build and list every one of them in `docs/PRE-LAUNCH.md` as
must-replace-before-public. This does not license inventing any OTHER fact — credentials,
years in business, review counts, prices, response times, and team size are still
`TODO(fact)` per D-14 and D-17.

**Pre-answered, do not stall on these:**

- Proposition category (Prompt 3, item 3): **workmanship — the repair holds up.** Held
  across all five routes. Do not lead on speed.
- Services (Prompt 7), the eight: spring repair and replacement; opener repair and
  installation; cable / roller / track repair; panel replacement; off-track and misaligned
  door correction; new residential door installation; commercial and roll-up doors; annual
  maintenance and tune-up.
- FAQ: yes, on `/services` only, in-page. Generic garage-door technical content. Nothing
  about response time, pricing, warranty, or credentials.
- If the reference blocks headless capture: one retry headed with a normal UA, then fall
  back to profiling a local saved copy in `reference/`. Decide before starting.
- Dependency allowlist is Appendix A's as written (reproduced at the bottom of this file).
  Anything else needs a one-line justification before install.
- The decision register below has answered the predictable questions. Consult it instead
  of asking. Do not ask for confirmation of intermediate steps.

---

## THREE OVERRIDES to `process.md`. Where these conflict with that file, these win.

**OVERRIDE 1 — Prompt 9 is fully autonomous.** Do not stop and wait for a palette pick.
Generate the five candidates exactly as specified, discard and re-roll any that fail the
hard constraints (AA on pairs actually in use, call-now CTA remains highest contrast and
chroma, semantic colors exempt from rotation, focus rings 3:1), then auto-select the
surviving candidate whose call-now CTA has the highest contrast ratio against its
background. Ties break to the lowest seed. Still render the contact sheet and still record
the winning seed and all five candidate seeds in `docs/known-divergence.md` — the record is
wanted, not the decision. Everything else about Prompt 9 stands, including that color is
terminal for measurement afterward and that geometry and typography must not have moved.

**OVERRIDE 2 — Prompt 10 produces text only.** Write every image-generation prompt to
`docs/asset-prompts.md` and stop there. Do not attempt to generate, source, or download any
image. Target generator is **Nano Banana Pro** — write the prompts in its idiom, and state
the exact output pixel dimensions per breakpoint for each slot as plain text rather than
relying on an aspect-ratio flag. One prompt per slot, plus a second crop only where the
slot changes aspect ratio between breakpoints. Each entry carries: slot ID, route, section,
dimensions per breakpoint, aspect, object-fit, and the applied Prompt 9 hues named
explicitly. The logo goes in the same file as its own entry — wordmark plus icon lockup,
with the display font and applied palette named. The operator runs them through Nano Banana
Pro and hands the files back.

**OVERRIDE 3 — asset drop-in is the terminal step, after acceptance.** Run Prompt 11 with
placeholders still in place; placeholder-blocked sections are reported as known floors, not
failures. When the generated images and logo are handed back, drop them in, re-run the diff
on every affected section, and report the final table. That is the end of the run.

---

## Prompt 0 — CLAUDE.md, written before any work

> Write `CLAUDE.md` at the repo root containing everything below verbatim, plus the
> CONSTANTS and DECISION REGISTER blocks. Then stop. No other files yet.

**Autonomy.** Never stop to ask "should I continue?" Work until the task is done or you
are genuinely blocked on a decision only I can make. The decision register has already
answered the predictable ones — consult it before concluding you are blocked. Do not ask
me to confirm intermediate steps.

**Three divergence classes.** This is a clone *and adapt*, not a copy. Every section is
classified once, in `docs/sections.md`, and measured accordingly:

- **FIDELITY** — exists in both, same purpose, content is structurally equivalent.
  Measured by pixel diff. Done at `< THRESHOLD`.
- **ADAPTED** — reference section retained, content deliberately swapped (business name,
  hours, phone, service list, copy length, image subject). Pixel diff is meaningless.
  Measured on structural metrics only: section box, inner grid geometry, computed type
  scale and weights, letter-spacing, resolved colors, spacing rhythm, border/shadow/
  gradient values. Done at `< STRUCT_THRESHOLD` on those metrics.
- **NOVEL** — no counterpart in the reference (privacy policy body, any section that
  replaces a removed one). No diff exists. Measured by token conformance: every color,
  font size, weight, radius, shadow, and spacing value must resolve to a token extracted
  in Prompt 5. Done at zero violations.

Misclassifying an ADAPTED section as FIDELITY and grinding on it is the single most
expensive failure mode here. If a diff will not close and the reason is that the words
are different, the class is wrong — fix the class, not the pixels.

**Definition of done.** Every section of every route, at every declared breakpoint,
under the threshold for its class. Report the per-section number every time you claim
something is finished. A route is not done until all five are.

**Placeholders and known floors.** Sections blocked by a placeholder asset or a font
substitution are reported separately, with the placeholder area excluded from the
measurement. Never treat one as a fixable divergence and never burn iterations closing
one. `docs/known-divergence.md` is the list; check it before starting any fix.

**Never invent a business fact.** Phone, address, hours, credentials, years in business,
service radius, review counts, prices, warranty terms, response times. Anything not in
CONSTANTS is `TODO(fact):` and goes in `docs/facts-needed.md`.

**No email.** Before every "done" report, run and paste the result:

```bash
rg -n "mailto:|type=[\"']email|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|newsletter|subscribe" \
   app components lib content || echo "EMAIL SWEEP CLEAN"
```

Non-empty output is a build failure, not a note.

**Routes are fixed.** Five, listed in CONSTANTS. Adding one is out of scope.

**Dev server.** Keep it running on `PORT`. Never ask me to start it. When you finish a
visual change, screenshot the affected section and diff it before reporting done. If the
diff regressed, fix it before telling me. **Never report "done" on a visual change you
have not diffed.**

**Concurrency is capped at `MAX_AGENTS`.** Never exceed it, never ask to exceed it.
Dispatch a subagent only when the work is high-volume and low-judgment — capture passes,
measurement sweeps, per-route builds that touch no shared file. Do the reasoning-heavy
work yourself in the main thread. When in doubt, serial.

**Cost discipline.** These are correctness rules, not preferences:

- Diffs return numbers. The harness writes screenshots, DOM dumps, computed-style JSON,
  and rAF traces to `.harness/` and prints a summary line plus the file path. Never `cat`
  a raw trace into context.
- Do not open a screenshot to evaluate a diff. Look at an image only when a number is
  unexplained after one code-level attempt, one image at a time, cropped to the section.
- Three breakpoints, `BP_SET`, fixed. Do not add a fourth because the reference CSS has
  one; note it in `docs/profile.md` instead.
- `ITERATION_CAP` attempts per section — now **one**. On the first miss, stop, write the
  residual and your best hypothesis to `docs/known-divergence.md`, and move on. Never a second.
- Subagents return the report table and nothing else. No transcripts, no file contents,
  no narration of what they tried.
- Re-diff only the sections you touched. Full sweeps happen at the end of a prompt, once.
- Paste the top 10 rows of the divergence table, not all of it. The file has the rest.

**Commit after every prompt.** `git init` now. One commit per prompt in this chain, message
`prompt-N: <what landed>`. This is the rollback path when an iteration makes things worse,
and it is cheaper than re-deriving state.

**Before context runs out.** If you are approaching compaction, stop mid-task, flush all
state to `docs/`, and print a resume block: current prompt number, current section, what
is in flight, what to run next. Do not let compaction eat unwritten state.

**Ownership.** One agent owns one section, end to end — geometry, appearance, responsive,
behavior — and reports its divergence number per breakpoint. An agent that cannot measure
its own result has not finished. Shared files — `globals.css`, `layout.tsx`, tokens,
header, footer, nav, the NAP block, the map component — are owned by you, the lead, not
by section agents. If two sections need the same shared change, make it yourself before
dispatching, or serialize just that edit.

**State survives context.** After every prompt, write results to `docs/`. Assume the next
prompt starts with no memory of this one. Canonical files:

```
docs/profile.md            reference profile, breakpoints, axes chosen
docs/sections.md           route × section × class, the source of truth
docs/divergence.md         the ranked table, rewritten each loop
docs/known-divergence.md   permanent floors: placeholders, font substitution
docs/facts-needed.md       every TODO(fact)
docs/behavior/*.md         one spec per non-obvious interaction
assets/INVENTORY.md        acquired vs placeholder, with slot dimensions
```

**Report format**, every time:

```
route | section | breakpoint | class | metric | value | threshold | status
```

Plus: what changed, what regressed, what is newly blocked, and the next batch you are
dispatching. No prose summary in place of the table.


---

## 0.1 DECISION REGISTER — pre-answered so it never asks

Paste this whole block into `CLAUDE.md`. If any answer is wrong for you, change it here
and nowhere else.

| # | Question it would ask | Answer |
|---|---|---|
| D-01 | Which pages? | Exactly five: `/`, `/about`, `/services`, `/contact`, `/privacy`. Do not add blog, FAQ page, booking, careers, gallery route, or per-service routes. Sections inside a page are fine. |
| D-02 | The reference has a Locations page / city grid / service-area map list. | Delete it. Also scrub: nav item, footer column, sitemap entry, any `/locations/*` route, internal anchors to it, and any `areaServed` city array in schema. A single `SERVICE_AREA` sentence in the footer is the only survivor. |
| D-03 | Email? Contact form? Newsletter? | No email in any form. Concretely banned: `mailto:`, any `@`-bearing address in copy, `<input type="email">`, newsletter/subscribe blocks, envelope icons, "Email us" CTAs, `email` in JSON-LD, email in the privacy policy contact section. |
| D-04 | What phone number? | `PHONE` from constants. Must use the 555-01XX reserved range so it cannot ring a real person. Render as `tel:` links everywhere, including a mobile sticky call bar. |
| D-05 | Contact form fields, since no email? | Name, phone, service needed (select), preferred callback window, message. No backend. Client-side validation only; on submit show a "we'll call you back" state and `console.warn` a stub notice. Mark the component `// STUB: no submission target` at the top. |
| D-06 | Hours — weekdays only? Emergency service? | 7:00–19:00, all seven days, single block, no split hours. Do not invent "24/7 emergency" or after-hours claims. |
| D-07 | The address won't geocode. | Correct — it's fake. Embed the map by coordinates, not by address string: `https://www.google.com/maps?q=<MAP_COORDS>&z=15&output=embed` in a keyless iframe. Display the fake address as text next to the map. Never pass the fake address to a geocoder. |
| D-08 | Where do maps go? | Both are required: home page (one section, zoom ~13, below services or above footer) and `/contact` (zoom ~15, beside the form). `loading="lazy"`, explicit `title` attribute, fixed aspect-ratio wrapper so it cannot shift layout. Add a "Get directions" link: `https://www.google.com/maps/dir/?api=1&destination=<MAP_COORDS>`. |
| D-09 | Can I reuse the reference's photos, logo, and copy? | No. Their photos, logo, business name, phone, license numbers, staff shots, truck shots, review screenshots, and body copy stay on their site. Layout, spacing, type scale, grid, motion, and interaction patterns are what you are cloning. Photographic slots default to placeholders (Prompt 2). Copy is written fresh (D-10). |
| D-10 | What copy goes in the slots? | Write original generic garage-door copy at the same length and line count as the reference block, so the layout is tested honestly. Never paste the reference's sentences. |
| D-11 | Fonts? | If the reference self-hosts a licensed font, do not lift the file. Substitute the closest open equivalent via `next/font`, record it in `docs/known-divergence.md`, and treat the resulting text-metric delta as a permanent floor — never iterate against it. |
| D-12 | Prices? | None. No numbers, no "starting at". "Free estimate" is allowed. |
| D-13 | Testimonials / star ratings / review counts? | Build the section, fill it with literal `[TESTIMONIAL PLACEHOLDER]` blocks at realistic length. Do not invent named customers or quotes. No `AggregateRating` or `Review` JSON-LD at all — fabricated review markup is a legal problem, not a content gap. |
| D-14 | Trust badges — licensed, bonded, insured, BBB, certifications, years in business, jobs completed? | Do not invent any of them. Where the reference has a badge row, use `TODO(fact):` placeholder chips at the correct dimensions. List every one in `docs/facts-needed.md`. |
| D-15 | Analytics, chat widget, cookie banner, tracking pixels? | None. If you add no trackers, the privacy policy must say so rather than describing cookies you didn't ship. |
| D-16 | Privacy policy content? | Generate a standard policy consistent with what the site actually does: a phone-callback form, no email collection, no analytics, no cookies beyond what the framework sets. Contact section lists phone and postal address only. Top of the file: `<!-- UNREVIEWED TEMPLATE — requires legal review before launch -->`. Do not claim GDPR/CCPA compliance. |
| D-17 | Any unknown business fact. | Never guess. Emit `TODO(fact): <what you need>` inline, append to `docs/facts-needed.md`, keep building. |
| D-18 | Deploy? Domain? Env vars? Database? | None. Local only, `PORT`. No `.env`, no third-party keys, no auth. |
| D-19 | Accessibility target? | WCAG 2.2 AA. Contrast checked against your own palette, not assumed from the reference. Full keyboard path through nav, form, accordion, and map bypass. `prefers-reduced-motion` honored on every animation. |
| D-20 | Should I ask before X? | No. See the autonomy rule. Blocked means "a decision only the owner can make," and this table has already made them. |


---

## Dependency allowlist — settled here, in Prompt 0

Pre-approved, exactly this. Anything else requires a one-line justification before
installing:

```
next  react  typescript  tailwindcss  playwright  pixelmatch  sharp
lucide-react  clsx
```

Banned by default, with reasons: **Lenis / Locomotive** (scroll hijacking breaks keyboard
and mobile momentum, and a repair customer scrolling to your phone number is the one
thing you cannot make janky), **shadcn/ui or any component library** (ships its own token
system and will fight the palette you extracted in Prompt 5), **react-hook-form + zod**
(five fields, no backend), **libphonenumber** (one country), **any image CDN or hosted
diff service**. `framer-motion` only if Prompt 1's profile finds real choreography — it
should say so explicitly.

---

## CHAIN AMENDMENTS — issued after Prompt 2, before Prompt 3

The chain was compressed mid-run. **These override both `process.md` and anything earlier
in this file.** They are written here so they survive a context reset.

### A-1 — `MAX_AGENTS` 2 → 4

The hard cap moved; it is still hard. **Never exceed 4 concurrent agents, never ask to.**

### A-2 — `ITERATION_CAP` 3 → 1

A section gets **one** fix attempt. On the first miss it is floored: write the residual and
your best hypothesis to `docs/known-divergence.md` and move on. **Never a second attempt.**
Measure once, log it, move on.

### A-3 — Prompt 8 is DROPPED as a separate turn

There is no convergence loop. Its behavior folds into Prompts 6 and 7: **each section is
diffed as it is built, gets one fix attempt, then is floored and logged.** The only full
sweep in the whole run is the one in Prompt 11.

### A-4 — Prompt 11 is TRIMMED

**Dropped entirely — do not run, do not substitute anything for them:**

- Gate 12, Lighthouse on all five routes.
- The manual keyboard-only pass in gate 8.

Both become pre-public blockers in `docs/PRE-LAUNCH.md`, worded as:

- *"performance never measured"*
- *"keyboard access is spec-verified only, never hand-tested"*

**Every other gate stands**, explicitly including: `pnpm build` clean, the email sweep, the
locations sweep, NAP consistency, hours, both maps, the internal link crawl, the
programmatic contrast audit, reduced-motion, palette conformance and the winning seed,
the `scripts/similarity.mjs` re-run, metadata/robots/sitemap, and the `TODO(fact)` count.

### A-5 — Subagent model policy

**Dispatch every section-builder and route-builder subagent on Sonnet.** The lead stays on
Opus and keeps all reasoning-heavy work and every shared-file edit in the main thread.
Four concurrent Opus agents is what re-trips the session rate limit.

### A-6 — Parallelism guardrails at 4-wide

These were theoretical at 2-wide and are real at 4-wide:

- **The shell is frozen after Prompt 5.** No section agent touches `globals.css`,
  `layout.tsx`, tokens, header, footer, nav, the NAP block, or `<BusinessMap>`. An agent
  that needs a shared change **stops and hands it back**; the lead makes the edit once in
  the main thread, then re-dispatches.
- **No section agent introduces a token that is not in Prompt 5's set.** It comes back to
  the lead or it does not happen.
- **Prompt 6:** the lead still builds the hero and the map section personally.
- **Prompt 7:** all four routes dispatch as a **single batch** of 4.

### A-7 — Prompt 9 folds into Prompt 5

OVERRIDE 1 already made palette selection autonomous, so a contact sheet would render for an
audience of nobody. **The palette is randomized at token-write time, in Prompt 5.** The site
is built in its final palette from the first component onward.

**Gone:** the recolor pass, the candidate crop renders, the contact sheet, and the
geometry/typography regression table — there is no recolor for a regression table to prove
innocent.

**Surviving from Prompt 9, unchanged:**

- Convert the extracted ramp to OKLCH, hold every L and C exactly, re-derive from a new
  random primary hue.
- Accent by randomly selecting one scheme — complementary, split-complementary, analogous,
  triadic — and rotating from the primary.
- Neutrals keep a **3–6% chroma tint** of the primary hue. Pure grey reads cheap.
- `scripts/palette.mjs --seed <n>` reproduces a palette exactly.
- **Five candidates are still generated and still gated programmatically.** Discard and
  re-roll any that fails a hard constraint, then auto-select the survivor whose call-now CTA
  has the highest contrast against its background; ties break to the lowest seed.
- **Hard constraints, verified programmatically:** every foreground/background pair *actually
  used* passes WCAG AA (text 4.5:1, large text and UI borders 3:1) — pairs in use, not the
  ramp in theory; the call-now CTA stays the highest-contrast, highest-chroma element on
  every page; **semantic colors (form error, form success, focus ring) are EXEMPT from
  rotation** and keep conventional hues; focus rings keep 3:1 against both the element and
  its background.
- Record the winning seed **and all five candidate seeds** in `docs/known-divergence.md`.

### A-8 — color is excluded from measurement FROM THE START

The structural comparator scored resolved colors as part of its 27 fields. With the recolor
now at token-write time, every ADAPTED section would carry a permanent color delta into
`STRUCT_THRESHOLD` from its first measurement and eat the 5% budget before geometry got a
look in.

- **Strip color-valued fields from the structural comparator**: resolved color,
  background-color, border-color, gradient stops, shadow color.
- **Keep every geometric and typographic field**, and keep the non-color parts of borders
  and shadows — widths, offsets, blur, spread, radii.
- The 3 remaining FIDELITY sections are solid-color bands, so a recolored band reads 100%
  divergent forever. They are **excluded from pixel diff and measured structurally instead**.

**Color divergence from the reference is intentional and permanently excluded from every
diff, every threshold, and every future iteration.** Recorded in `docs/known-divergence.md`.

### A-9 — NOVEL and DELETED rows are measured once, not per breakpoint

Token conformance has no breakpoint dimension. NOVEL and DELETED rows **collapse to a single
pass** in the harness and in every report. `BP_SET` does not change — all three widths stay
for everything geometric, and 768 in particular stays because it is where the Divi
`max-980` restack resolves.

### A-10 — Prompt 10 folds into Prompt 11

Asset-prompt writing is pure text and has no dependency on the acceptance sweep. It needs
the applied palette hues, which now exist from Prompt 5. Write `docs/asset-prompts.md` and
run the trimmed acceptance gates in the same turn.

### Resulting turn structure

```
0  CLAUDE.md
1  profile + harness
2+3+4   assets, copy and divergence gates, behavior specs
5+9     tokens, randomized palette, shared shell
6+7     lead builds hero + map, then ONE 4-wide wave over home sections + four subpages
10+11   asset prompts, then the trimmed acceptance sweep
```

### Not adopted, deliberately

- **Measuring at two breakpoints instead of three.** Rejected: the tablet band is where the
  restack resolves — Divi's primary breakpoint is `max-980` and home is 2.14× taller at 390
  than at 1440 — and with `ITERATION_CAP` at 1 there is no second pass to catch what it
  hides. It buys a third of measurement time by making the measurement blind exactly where
  the clone is hard.
- **Reclassifying borderline sections FIDELITY → ADAPTED to avoid pixel diffing.**
  Rejected: `process.md` names it as the failure mode to watch for, and the Prompt 1
  harness bug — where ordinal section IDs shifted between breakpoints and every section
  silently defaulted to FIDELITY — proved the classification is load-bearing. It buys speed
  by making the measurement lie.

### A-11 — one-time cap lift, section padding ONLY

The Prompt 6+7 builder brief instructed every agent that bands are full-width blocks with
zero padding. **That was wrong: the reference varies padding per band.** The resulting
uniform `0/0` is a **build defect introduced by the brief, not a divergence floor**, and it
is mechanical rather than judgment work.

Each section gets **ONE additional attempt, spent on vertical padding and nothing else.**

**`ITERATION_CAP` returns to 1 the moment this pass ends. No other residual is reopened.**

| | |
|---|---|
| **IN SCOPE** | section vertical padding — `padTop` / `padBottom` — and only where the reference capture gives a per-section value to match |
| **OUT OF SCOPE** | horizontal padding (unless the reference explicitly differs), `innerCount` / `innerRows` / `innerCols`, `position`, `lineHeight`, `box.h`, copy, tokens, and every frozen shell file. A-6 still holds. |

- **No blanket patch.** A uniform `54/54` fixes 3 bands and breaks the 5 that are correctly
  `0/0`. Values come per-section from the reference appearance capture in `.harness/`, read
  individually.
- **No new tokens.** If a band's padding does not land on one of Prompt 5's 9 named spacing
  steps, use the nearest existing step and record the delta in the report rather than
  minting a `--spacing-*`.
