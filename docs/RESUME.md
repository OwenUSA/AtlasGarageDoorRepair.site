# RESUME BLOCK — written after the A-11 padding pass was killed mid-flight

**Cause of stop:** account session rate limit (HTTP 429), resets **2:20pm America/Caracas**.
It killed the Opus lead and both in-flight Sonnet agents simultaneously. This is not a
defect in the work; nothing was rolled back.

## Current prompt

Chain position: **A-11 targeted padding pass**, between `prompt-6-7` and the final
merged `10+11` turn. Turn structure is `0 | 1 | 2+3+4 | 5+9 | 6+7 | 10+11` (see CHAIN
AMENDMENTS in CLAUDE.md), plus this one-time A-11 pass.

## What is in flight

`docs/PADDING-TABLE.md` (179 rows) holds the reference per-section padTop/padBottom at
every breakpoint, with the nearest named spacing step and the px delta from using it.
**It is complete.** Read padding values from here; do not re-derive them from `.harness/`.

### Applied, NOT MEASURED — 13 components

The edits landed and `tsc --noEmit` exits 0, but no capture or diff was run against any
of them. Treat every number in `docs/divergence.md` for these sections as stale.

```
home      BadgeRow, CtaBand, Intro, Process, Services, StatStrip, Testimonials   (7)
services  CtaBand, Faq, ImpactBand, PageTitle, ServicesBody                      (5)
contact   ContactSection                                                          (1)
```

### Never started

```
/about    CtaBand, HeroStrip, OurMission, OurServices, OurTeam, ReliablePros,
          RuleBand, TitleBand                                                     (8)
/privacy  CtaBand, PolicyBody, TitleBand                                          (3)
contact   AnnouncementStrip, ContactForm, ContactMapSection                       (3)
home      AnnouncementStrip, NapHours, RuleBand                                   (3)
```

`Hero.tsx` and `MapSection.tsx` are lead-built and were deliberately excluded.
Shell files (SiteHeader, SiteFooter, MobileDrawer, NavLinks, CallBar, BusinessMap,
JsonLd, primitives) are FROZEN and out of scope — A-6 still holds.

## What to run next, in order

1. Finish applying padding to the "never started" components above, reading values from
   `docs/PADDING-TABLE.md`. 4-wide on Sonnet, partitioned by route so no two agents
   share a file.
2. Re-diff **every** section touched in this pass — including the 13 already applied,
   which have never been measured.
3. Report: top 10 ranked rows; section rows PASS before (17) vs after; how many of the
   116 floored rows cleared; any section that REGRESSED (revert it and say so).
4. Confirm `ITERATION_CAP` is back to 1 and that no out-of-scope residual was touched.
5. Commit `prompt-6-7b: per-section vertical padding`.
6. Then, and only then, the final merged `10+11` turn.

## Scope reminder for the resumed pass

IN: section vertical padding only, per-section values from the table.
OUT: horizontal padding, innerCount/innerRows/innerCols, position, lineHeight, box.h,
copy, tokens, and every frozen shell file. **No new tokens** — nearest named step, and
report the delta. **Do not blanket-patch**: uniform 54/54 fixes 3 bands and breaks the 5
that are correctly 0/0.

## Standing caveat

The three instrument bugs fixed during `prompt-6-7` (BODY joining CHROME and deleting
header/topbar/footer from every ours-capture; `pairSections()` joining by scroll position
and reporting false 100% on the four bands Prompt 3 required to move; `tokenViolations()`
comparing oklch percent against unit-interval and rem against px) mean **every divergence
number recorded before `437d57e` is superseded.** Do not compare against the pre-wave table.
