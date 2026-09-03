# docs/facts-needed.md — every TODO(fact)

Anything not in the `CLAUDE.md` CONSTANTS block is unknown and must never be guessed
(D-14, D-17). Each row below renders as a `TODO(fact):` placeholder at the correct
dimensions so the layout is still tested honestly, and each one is a pre-launch blocker in
`docs/PRE-LAUNCH.md`.

**Known and fixed — do NOT list these here:** business name, tagline, phone, address, map
coordinates, hours, service area. They are in CONSTANTS. (Phone, address, map coordinates
and service area are now real, verified values as of 2026-09-03 — see `CLAUDE.md`.
Business name and hours are still unverified against the real business; see
`docs/PRE-LAUNCH.md` PL-03 / PL-05.)

Opened: Prompt 2.

---

## Assets

| # | TODO(fact) | where it renders | placeholder standing in | dimensions |
|---|---|---|---|---|
| F-01 | **logo asset** — real wordmark + icon lockup | header, all five routes | Montserrat wordmark | 300×120 @390/768, 290×116 @1440 |
| F-02 | **logo asset, footer lockup** | footer | Montserrat wordmark | 378×252 @1440 |

## Credentials, certifications, trust badges — D-14

The reference carries a certification badge and an eleven-badge trust grid. **We hold none
we may name.** Each keeps its box and renders a `TODO(fact):` chip.

| # | TODO(fact) | reference slot it replaces | chip dimensions |
|---|---|---|---|
| F-03 | manufacturer / trade certification, if any | `home-cert-badge` | 312×114 @390, 614×225 @768, 510×187 @1440 |
| F-04 | licensed / bonded / insured status and license number | `home-badge-*` grid | 300×113 |
| F-05 | BBB rating and accreditation status, if any | `home-badge-bbb-a-rating` | 300×130 |
| F-06 | safety certification (OSHA or equivalent), if any | `home-badge-osha-logo` | 300×86 |
| F-07 | trade association memberships, if any | `home-badge-hba-logo`, `home-badge-orca-logo-fi` | 300×124, 300×169 |
| F-08 | manufacturer/dealer partnerships, if any | `home-badge-davinci-logo`, `-owens-logo`, `-certainteed-logo-rgb`, `-fortified-logo-roof`, `-gaf-certified-steep-slope-logo`, `-haag-logo-2` | 300×68 – 300×264 |
| F-09 | third-party review-platform presence, if any | `home-badge-angi-wordmark-1c-heart-rgb-svg` | 300×183 |
| F-10 | partner / affiliation logos on `/about` | `about-partner-logo` | 312×44 @390, 614×87 @768, 970×137 @1440 |

## Numbers — D-14

The reference's stat strip is three tiles of figures. **Every one is a business fact we do
not have.** Tiles keep their dimensions and carry `TODO(fact):` chips.

| # | TODO(fact) | where |
|---|---|---|
| F-11 | jobs completed / doors serviced | home `s12` stat strip, tile 1 (225×142) |
| F-12 | years in business / year founded | home `s12` tile 2 (225×142), `/about` `s05` |
| F-13 | team size / number of technicians | home `s12` tile 3 (225×164), `/about` `s07` |
| F-14 | customer review count and average rating | home `s11` testimonials |

## Company history and team — D-17

| # | TODO(fact) | where |
|---|---|---|
| F-15 | founding year and founder(s) | `/about` `s05` Our Mission |
| F-16 | company history / origin story | `/about` `s05` |
| F-17 | technician names, roles, headshots | `/about` `s07` OUR TEAM |
| F-18 | technician training or certification programme | `/about` `s07` |

## Service terms — D-12, D-14, brief

| # | TODO(fact) | note |
|---|---|---|
| F-19 | warranty terms on parts and labour | **must not appear in the FAQ** — the brief bars warranty content there |
| F-20 | response-time commitment | we lead on workmanship, not speed; do not invent a window |
| F-21 | service radius in miles | only `SERVICE_AREA` sentence ships (D-02) |
| F-22 | emergency / after-hours availability | hours are 07:00–19:00 seven days, single block. Do **not** invent 24/7 (D-06) |
| F-23 | payment methods and financing | reference has a `/financing/` page; out of scope (D-01) |

**Prices are not a TODO(fact) — they are barred outright** (D-12). No numbers, no
"starting at". "Free estimate" is allowed.

## Testimonials — D-13

| # | TODO(fact) | note |
|---|---|---|
| F-24 | real, permissioned customer quotes with attribution | Until then the section renders `[TESTIMONIAL PLACEHOLDER]` blocks at realistic length. **No `AggregateRating` or `Review` JSON-LD ships at all** — fabricated review markup is a legal problem, not a content gap. |

---

## Tally

| category | count |
|---|---|
| assets | 2 |
| credentials / badges | 8 |
| numbers | 4 |
| history / team | 4 |
| service terms | 5 |
| testimonials | 1 |
| **total open** | **24** |

Count is reported at Prompt 11, never silently resolved.

---

## Prompt 6/7 wave — status

No new `TODO(fact)` entries were opened. All five builder agents confirmed they invented
nothing and rendered the existing markers literally. The 24 open facts are unchanged.

Where each now renders:

| # | rendered at |
|---|---|
| F-01 / F-02 | header + footer wordmark (shell) |
| F-03 – F-09 | `/` `s06` badge row — four `TODO(fact)` chips via the `FactChip` primitive |
| F-10 | `/about` `s08` partner-logo row |
| F-11 – F-13 | `/` `s12` stat strip — three tiles, `TODO(fact)` in place of every number |
| F-14 | `/` `s11` testimonials — seven literal `[TESTIMONIAL PLACEHOLDER n …]` blocks |
| F-15 – F-18 | `/about` `s05` mission and `s07` team |
| F-19 – F-23 | not rendered anywhere; still barred from the `/services` FAQ by the brief |
| F-24 | `/` `s11`, as above |

Verified absent from the build: `AggregateRating`, `Review`, any invented name, quote,
rating, year, headcount, licence number, price or response-time claim.
