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
PHONE              = (239) 427-4221
ADDRESS            = 6050 Collier Blvd, Ste 1, Naples, FL 34114
MAP_COORDS         = 26.0439,-81.6999
HOURS              = 7 days, 7:00 AM – 7:00 PM
SERVICE_AREA       = Serving Naples and the surrounding Collier County communities.

MAX_AGENTS         = 4             hard concurrency cap (amended, was 2)
ITERATION_CAP      = 1             ONE fix attempt per section, then floored and logged (amended, was 3)
BP_SET             = 390, 768, 1440   exactly three
```

**These are Atlas Garage Door Repair's real business facts** (updated 2026-09-03, per
`domains-table.md` at the repo root). The coordinates were geocoded from the street
address via the US Census geocoder and the map is embedded by coordinates, per D-07.
This does not license inventing any OTHER fact — credentials, years in business, review
counts, prices, response times, and team size are still `TODO(fact)` per D-14 and D-17.

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

### Numbering note

This site's **A-11** is the one-time padding cap-lift and predates the fleet-wide
amendments. The shared-harness amendments therefore land here as **A-12 to A-16**,
one higher than their numbers on the sibling sites. The content is identical; only
the label differs, because renumbering A-11 would silently invalidate every existing
reference to it in this repo's commit messages and docs.

### A-12 — the harness is SHARED; this site consumes it, it does not own one

Five sites independently wrote five harnesses against the same spec. Measured line overlap
was **3–8%, and every shared line was boilerplate** (`import { chromium }`, viewport
literals) — zero shared domain logic. The instrument is measurement plumbing: it is
identical for every site and invisible in the product, so rebuilding it per site bought
nothing and cost roughly 500k tokens across the programme.

**Governing rule: share the instrument, never the output.** Tokens, palette seed, copy,
section order and layout are still derived per-site from this site's own reference URL, so
the sites stay genuinely different. Only the measuring apparatus is common.

The package lives at `../_shared/harness`, configured by `./harness.config.mjs` at this
site's root. Run every gate with the SITE ROOT as cwd:

```bash
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/diff.mjs        [--route /about] [--bp 1440]
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/contrast.mjs    [--route /about] [--bp 1440]
MSYS_NO_PATHCONV=1 node ../_shared/harness/src/rendertruth.mjs [--route /about] [--bp 390]
```

`MSYS_NO_PATHCONV=1` is required in Git Bash: a bare `/` route argument is otherwise
rewritten into a Windows path. Two further traps, both of which have already bitten:

- **Never background the dev server with `&` in the same command chain as a gate run.** It
  drops the rest of the chain back to the original cwd, `loadConfig()` then reads a
  *different site's* config, and the gate silently reports another site's numbers.
  Verify identity with `curl -s localhost:<PORT>/ | grep '<title>'` before trusting output.
- Any legacy `scripts/harness/` or `harness/` directory in this repo is **superseded**. Do
  not run it, do not extend it.

Seven instrument defects found the expensive way are now locked behind executable
assertions in `_shared/harness/test/selftest.mjs`. They previously survived only as inline
comments. Run `node test/selftest.mjs` in the package if you touch it.

### A-13 — the comparator splits BLOCKING from ADVISORY

`innerCount`, `innerRows`, `innerCols` and `position` are **ADVISORY**: computed and
reported as a trailing per-row note, never contributing to the deviation %, never failing a
row.

They compare our clean markup against a page-builder's nested column tree and are
**unclosable by construction**. On the Atlas site they were 94/82/81 of every residual and
drowned the real defects underneath. Do not chase them, and do not restructure markup to
imitate the builder's nesting.

BLOCKING fields remain: box geometry, type scale, weights, letter-spacing, line-height,
spacing rhythm, and border/shadow/radius geometry. Colour stays excluded entirely (A-8).

### A-14 — render-truth gates are BLOCKING and are NOT subject to `ITERATION_CAP`

`ITERATION_CAP = 1` governs **structural residuals only**. A render-truth failure is a
defect, not a divergence from the reference — fix it, however many attempts that takes.

Two gates, which fail independently because one reasons about declared CSS and the other
about painted pixels:

- **`contrast.mjs`** — gradient-aware WCAG AA. Resolves backgrounds as an ordered layer
  stack; treats `background-image` as a real background and parses its gradient stops;
  scores the **worst sample along the ramp**; reports `UNMEASURABLE` for `url()` or
  translucent overlays rather than assuming white.
- **`rendertruth.mjs`** — pixel-level. Screenshots each text box and measures the contrast
  between its dominant painted tones; enforces WCAG 2.5.8 tap targets at the smallest
  breakpoint; and checks CTA salience as **chroma dominance** — no other action on the page
  may be more saturated than the call CTA.

  That last check was specified wrongly three times before it worked, and the history is
  worth keeping because each version failed differently. Ranking the CTA by painted
  contrast against all text is unsatisfiable (near-black copy on white is ~18:1 and no
  brand colour beats it — one site washed out its headings trying, and the regression had
  to be reverted). Ranking the best `tel:` element against all interactive elements is
  vacuous (a plain footer phone number at ~21:1 tops it, so the real button never has to
  win — Atlas's invisible CTA never fired this check once). Ranking among "buttons" fails
  on bordered nav links at 21:1 beating a saturated fill at 7.4:1. Painted contrast is
  simply not a proxy for visual prominence; chroma is. Legibility of the CTA is covered by
  the text-legibility check, which is what actually caught Atlas.

**Why these exist.** Atlas completed this entire chain and shipped with its primary call
CTA invisible — label painted in *exactly* its own background colour, 1:1 — on all five
routes, while its acceptance sweep reported "23/23 pairs pass AA". Every check in that
chain trusted the same declared values, so one blind spot took the whole audit down.
Forge's frozen shell carried the same class of bug (a 1.16:1 secondary CTA on all five
routes), caught before its build wave rather than after.

Both gates must read **0 FAIL / 0 findings** before any "done" report.

### A-15 — one rule that prevents a whole defect class

Every `tel:` link is a primary conversion target on a phone-driven site, so give them all
the WCAG 2.5.8 minimum in one place rather than per component:

```css
a[href^="tel:"] { min-height: 44px; }
```

Chased class-by-class this recurred three times in Forge's shell alone and would have
recurred again in section builds. `min-height` is inert on a purely inline box, so tel
links inside prose keep their natural metrics and the type scale the diff measures is
untouched.

### A-16 — the reference is SAVED LOCALLY; structural measurement is available here

Three of the five sites that ran before this one lost their reference mid-build: the live
site began answering every request — headless, headed, normal desktop UA — with a bot
challenge (`<title>One moment, please...</title>`). Two of them had kept no local copy, so
structural comparison became permanently impossible and every structural row on those sites
now reports `BLOCKED/no-reference` forever.

**That will not happen here.** A complete local copy of all five reference pages is in
`reference/raw/`. Note the honest caveat for THIS site: they were saved late, after the
build, not at Prompt 1 — so they insure future re-measurement but were not what the
original chain measured against. The reference was still reachable when they were taken:

```
home.html  about.html  services.html  contact.html  privacy.html
```

Rules that follow from this:

- **Profile and capture the LOCAL COPY, not the live site.** Serve `reference/raw/` over
  HTTP at the same paths `harness.config.mjs`'s `routeMap` uses, and point
  `referenceOrigin` at that server. Capturing the live site invites a mid-run wall and
  makes every number irreproducible.
- **Never delete `reference/raw/`.** It is the only thing standing between this site and
  the permanent measurement loss two of its siblings suffered. It is gitignored because it
  is someone else's markup — do not commit it, and do not lose it either.
- Stylesheets and images still load from the reference's own CDN, which is generally not
  challenged, so layout resolves correctly from the saved HTML.
- Structural rows here carry REAL numbers against `STRUCT_THRESHOLD`. This site does not
  get the `BLOCKED/no-reference` exemption, and must not claim it.

The cheap preventative, stated once for anyone repeating this process: **save every
reference page at Prompt 1, while the site is still reachable.** It costs one `curl` per
page and it is the difference between a measurable clone and an unmeasurable one.
