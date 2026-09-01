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

MAX_AGENTS         = 2             hard concurrency cap
ITERATION_CAP      = 3             attempts per section, then it is floored and reported
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
- `ITERATION_CAP` attempts per section. On the third failure, stop, write the residual and
  your best hypothesis to `docs/known-divergence.md`, and move on. Never a fourth.
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
