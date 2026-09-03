Read `process.md` in this repo end to end before doing anything. It is an 11-prompt
sequential chain. You are running it one prompt per turn: do Prompt N, produce its
deliverable, stop. Never roll into the next prompt on your own — I send them.

GOAL: a faithful clone of the design system and layout of REFERENCE, adapted to our own
five routes, our own copy, our own real business facts, and our own randomized
palette, shipped as a local-only Next.js site.

CONSTANTS — final. Use verbatim wherever process.md says <...>:

REFERENCE          = https://vh1roofing.com/
STACK              = Next.js 15 App Router + TypeScript (strict) + Tailwind v4
                     (CSS-first @theme) + Node 22.20.0 + pnpm 10.25.0
PORT               = 3101          (fixed; kill anything holding it, never move)
PKG                = pnpm
THRESHOLD          = 2%
STRUCT_THRESHOLD   = 5%
TOKEN_THRESHOLD    = 0

ROUTES             = /  /about  /services  /contact  /privacy
BREAKPOINTS        = filled by Prompt 1 from the reference CSS

BUSINESS           = Atlas Garage Door Repair
TAGLINE            = The repair holds. That is the whole promise.
PHONE              = (239) 427-4221
ADDRESS            = 6050 Collier Blvd, Ste 1, Naples, FL 34114
MAP_COORDS         = 26.0439,-81.6999
HOURS              = 7 days, 7:00 AM – 7:00 PM
SERVICE_AREA       = Serving Naples and the surrounding Collier County communities.

MAX_AGENTS         = 2
ITERATION_CAP      = 3
BP_SET             = 390, 768, 1440

EVERY BUSINESS FACT ABOVE IS REAL (updated 2026-09-03, verified against
../domains-table.md). The street address is real and the coordinates were geocoded from
it via the US Census geocoder; the map is embedded by coordinates only, per D-07. The
phone is a real, working number. Treat all of it as ground truth for the build. This does
not license inventing any OTHER fact — credentials, years in business, review counts,
prices, response times, and team size are still TODO(fact) per D-14 and D-17.

THREE OVERRIDES to process.md. Where these conflict with the file, these win:

OVERRIDE 1 — Prompt 9 is fully autonomous. Do not stop and wait for me to pick a
palette. Generate the five candidates exactly as specified, discard and re-roll any that
fail the hard constraints (AA on pairs actually in use, call-now CTA remains highest
contrast and chroma, semantic colors exempt from rotation, focus rings 3:1), then
auto-select the surviving candidate whose call-now CTA has the highest contrast ratio
against its background. Ties break to the lowest seed. Still render the contact sheet
and still record the winning seed and all five candidate seeds in
docs/known-divergence.md — I want the record, not the decision. Everything else about
Prompt 9 stands, including that color is terminal for measurement afterward and that
geometry and typography must not have moved.

OVERRIDE 2 — Prompt 10 produces text only. Write every image-generation prompt to
`docs/asset-prompts.md` and stop there. Do not attempt to generate, source, or download
any image. Target generator is Nano Banana Pro — write the prompts in its idiom, and
state the exact output pixel dimensions per breakpoint for each slot as plain text rather
than relying on an aspect-ratio flag. One prompt per slot, plus a second crop only where
the slot changes aspect ratio between breakpoints. Each entry carries: slot ID, route,
section, dimensions per breakpoint, aspect, object-fit, and the applied Prompt 9 hues
named explicitly. The logo goes in the same file as its own entry — wordmark plus icon
lockup, with the display font and applied palette named. I run them through Nano Banana
Pro and hand the files back.

OVERRIDE 3 — asset drop-in is the terminal step, after acceptance. Run Prompt 11 with
placeholders still in place; placeholder-blocked sections are reported as known floors,
not failures. When I hand back the generated images and logo, drop them in, re-run the
diff on every affected section, and report the final table. That is the end of the run.

Pre-answered so you don't stall:
- Proposition category (Prompt 3, item 3): workmanship — the repair holds up. Hold it
  across all five routes. Do not lead on speed.
- Services (Prompt 7): spring repair and replacement; opener repair and installation;
  cable / roller / track repair; panel replacement; off-track and misaligned door
  correction; new residential door installation; commercial and roll-up doors; annual
  maintenance and tune-up.
- FAQ: yes, on /services only, in-page. Generic garage-door technical content. Nothing
  about response time, pricing, warranty, or credentials.
- If the reference blocks headless capture: one retry headed with a normal UA, then
  fall back to profiling a local saved copy in reference/. Decide before you start.
- Dependency allowlist is Appendix A's as written. Anything else needs a one-line
  justification before install.
- The decision register in §0.1 has answered the predictable questions. Consult it
  instead of asking me. Do not ask me to confirm intermediate steps.

Now run PROMPT 0 ONLY: `git init`, then write `CLAUDE.md` at the repo root containing the
Prompt 0 text verbatim plus the CONSTANTS above, the three OVERRIDES, the full DECISION
REGISTER from §0.1, and the dependency allowlist. No other files. Commit as
`prompt-0: CLAUDE.md`. Then stop and show me the file.
