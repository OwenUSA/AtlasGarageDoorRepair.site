# docs/sections.md — route x section x class

**This file is the contract for everything after Prompt 1.** `scripts/harness/diff.mjs` parses
the tables below and runs each section in the mode its class dictates. Changing a class here
changes how that section is measured, everywhere, for the rest of the run.

Generated from `.harness/profile/ref-*-1440.json`. Section IDs in the third column are the
**reference** section IDs emitted by `scripts/harness/probe.mjs`; that is the join key.

## Classes and how each is measured

| class | measured by | done at |
|---|---|---|
| **FIDELITY** | pixel diff, % divergent area of the union box | `< 2%` |
| **ADAPTED** | structural metrics only — section box, inner grid geometry, computed type scale and weights, letter-spacing, resolved colors, spacing rhythm, border/shadow/gradient | `< 5%` |
| **NOVEL** | token conformance against the Prompt 5 `@theme` set | `0` violations |
| **DELETED** | not built, not measured | n/a |

Reference counterparts: `/` -> `/`, `/about` -> `/about-vh1/`, `/services` -> `/services/`,
`/contact` -> `/contact/`, `/privacy` -> `/privacy-policy/`. Every route has a real
counterpart, so **every route carries FIDELITY-eligible sections**, not only `/`.

**Expect movement in Prompt 3.** Any section whose *information content* changes moves
FIDELITY -> ADAPTED there, with the reason recorded. Classifying a deliberately-different
section as FIDELITY burns its full ITERATION_CAP for a reason that was a decision, not a
defect. The FIDELITY rows below are the ones whose content is genuinely structurally
equivalent: pure chrome and pure geometry bands.

---

## `/` (home) — reference `/`, 17 sections @1440, 18 @390, h 9248 -> 19775

| route | reference section | id | class | reason |
|---|---|---|---|---|
| / | top bar, navy 30px | s00-top-header | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** The reference top bar reads `OK Lic # 80006064` — a state licence number. We hold no licence we may name (D-14), so the band carries our hours instead. That is an information change, not a wording change, so a pixel diff would be measuring a decision. |
| / | header / nav, fixed 129px | s01-main-header | ADAPTED | Nav item count changes 18 -> 5 (D-01) and the whole Locations tree is scrubbed (D-02). Item count is information, so pixel diff is meaningless. |
| / | red announcement strip, 50px | s02-vh1-is-proud-to-support-employ-v | ADAPTED | Reference claims veteran support/employment. We cannot claim it (D-14/D-17). Band retained at identical geometry, carrying TAGLINE instead. |
| / | hero, bg image, 741px | s03-we-get-the-job-done | ADAPTED | Own copy, own proposition (workmanship, not speed), placeholder hero image (D-09). Static background image, not a carousel or video. |
| / | intro / top-rated two-column, 454px | s04-top-rated-roofing-contractor-in-tu | ADAPTED | "TOP RATED" is an unverifiable credential claim. Rebuilt as a workmanship intro; any rating becomes TODO(fact). |
| / | Oklahoma FORTIFIED roof grant promo, 338px | s05-explore-oklahoma-s-10-000-fortifi | DELETED | Roofing-specific state grant program with no garage-door analogue. Rebuilding it would require inventing a program. **Deliberate drop #1 of the two Prompt 3 requires.** |
| / | GAF Master Elite certification badge row, 377px | s06 | ADAPTED | Badge row retained at correct dimensions, filled with TODO(fact) placeholder chips per D-14. We hold no certifications we may name. |
| / | manufacturer / material logo strip, 392px | s07 | DELETED | Their supplier brand logos. D-09 forbids reuse and we have no brand relationships to name. **Deliberate drop #2.** |
| / | navy divider band, 108px | s08 | FIDELITY | Zero content. A solid colour band of a fixed height. Pixel diff is exactly the right instrument. |
| / | process steps, 5 icons, 527px | s09-we-make-it-easy-to-get-the-job-don | ADAPTED | Own copy, own step names, `lucide-react` icons matched on stroke width and size rather than glyph (Appendix A). |
| / | CTA band, bg image, 476px | s10-your-roof-our-reputation | ADAPTED | Own copy; primary CTA becomes call-with-number-visible, secondary becomes request-a-callback. Never "instant quote" or "book online". |
| / | testimonials, 1458px | s11-hundreds-of-oklahoman-s-rate-vh1-5 | ADAPTED | `[TESTIMONIAL PLACEHOLDER]` blocks at realistic length per D-13. No invented quotes, no star counts, no AggregateRating or Review JSON-LD. |
| / | red stat strip, 3 tiles, 439px | s12-the-proof-is-in-the-numbers-vh1-g | ADAPTED | Every number on it is an invented business fact. Tiles kept at identical dimensions carrying TODO(fact) chips (D-14). |
| / | services grid, 743px | s13-services-our-services | ADAPTED | Our eight garage-door services, regrouped by symptom rather than by their grouping (Prompt 3 structural gate item 4). |
| / | service-area map + city list, 806px | s14-proudly-serving-tulsa-and-oklahoma | DELETED | **D-02.** Google My Maps service-area embed plus a city list. Scrubbed along with the nav item, footer column, sitemap entries, `/locations/*`, internal anchors, and any `areaServed` array. |
| / | Roofing FAQs, 1865px | s15-FAQ-roofing-faqs | DELETED | FAQ lives on `/services` only, in-page, per the brief. Relocated, not removed from the site. |
| / | footer, grey 305px | s16 | ADAPTED | NAP from `lib/business.ts`, hours, single SERVICE_AREA sentence (the only D-02 survivor), five route links, no email column, no locations column. |

### `/` — sections with no reference counterpart

| route | reference section | id | class | reason |
|---|---|---|---|---|
| / | none | home-map | NOVEL | **D-08 requires a home map.** Replaces removed `s14`: keyless coords-only embed at zoom ~13, lazy, titled, fixed aspect-ratio wrapper, directions link. No city grid. **Deliberate addition #1.** |
| / | none | home-nap-hours | NOVEL | Hours and service-area card, 7 days 07:00-19:00, single block. The reference states hours nowhere. **Deliberate addition #2.** |
| / | none | mobile-call-bar | NOVEL | **D-04.** Sticky `tel:` call bar below 768. The reference has no mobile sticky element at all; its only fixed node at 390 is a scroll-to-top pip. |

---

## `/about` — reference `/about-vh1/`, 12 sections @1440, h 4264 -> 6855

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /about | top bar, navy 30px | s00-top-header | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** The reference top bar reads `OK Lic # 80006064` — a state licence number. We hold no licence we may name (D-14), so the band carries our hours instead. That is an information change, not a wording change, so a pixel diff would be measuring a decision. |
| /about | header / nav | s01-main-header | ADAPTED | Same nav reduction as `/`. |
| /about | hero image strip, 100px | s02 | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** Pure image band, but the image subject is deliberately swapped — theirs is a roofing photo, ours is a placeholder standing in for a garage-door image (D-09). Image subject is an ADAPTED trigger by definition, and the slot is placeholder-blocked until Prompt 10 regardless. |
| /about | page title band, red 129px | s03-about-vh1-roofing | ADAPTED | Our page title, our business name. |
| /about | navy rule band, 54px | s04 | FIDELITY | Zero content, solid colour, fixed height. |
| /about | Our Mission, 932px, 4 list items | s05-our-mission | ADAPTED | Own copy at matched length. No founding year, no history (D-17). |
| /about | Reliable Roofing Professionals, 697px | s06-reliable-roofing-professionals | ADAPTED | Own copy, workmanship proposition held. Placeholder image per `assets/INVENTORY.md`. |
| /about | OUR TEAM, 448px | s07-our-team | ADAPTED | No headcount, no names, no credentials, no staff photos (D-09/D-14). Layout built around TODO(fact) placeholders of the right length. |
| /about | OUR SERVICES, 1085px | s08-our-services | ADAPTED | Our eight services, same regrouping as `/`. |
| /about | navy rule band, 54px | s09 | FIDELITY | As `s04`. |
| /about | CTA band, grey 302px | s10 | ADAPTED | Own copy, call-first CTA pair. |
| /about | footer, grey 305px | s11 | ADAPTED | As `/` footer. |

---

## `/services` — reference `/services/`, 9 sections @1440, h 2857 -> 6311

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /services | top bar, navy 30px | s00-top-header | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** The reference top bar reads `OK Lic # 80006064` — a state licence number. We hold no licence we may name (D-14), so the band carries our hours instead. That is an information change, not a wording change, so a pixel diff would be measuring a decision. |
| /services | header / nav | s01-main-header | ADAPTED | Same nav reduction. |
| /services | hero image strip, 100px | s02 | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** Pure image band, but the image subject is deliberately swapped — theirs is a roofing photo, ours is a placeholder standing in for a garage-door image (D-09). Image subject is an ADAPTED trigger by definition, and the slot is placeholder-blocked until Prompt 10 regardless. |
| /services | page title, 251px | s03-roofing-services | ADAPTED | Our title and intro. |
| /services | phone CTA + services body, 783px | s04-call-918-630-7788-405-760-9814 | ADAPTED | Their two phone numbers become our single PHONE as a `tel:` link. Body carries our eight services, grouped by symptom. No prices (D-12). |
| /services | WE GET THE JOB DONE band, 173px | s05-we-get-the-job-done | ADAPTED | Own copy, workmanship line. |
| /services | FAQ block, navy, 782px | s06-faq-s | ADAPTED | Generic garage-door technical FAQ content. Nothing about response time, pricing, warranty, or credentials. Note: the reference block is flat stacked text, **not** a disclosure widget — 0 accordions site-wide. |
| /services | CTA band, grey 302px | s07 | ADAPTED | As `/about` CTA band. |
| /services | footer, grey 305px | s08 | ADAPTED | As `/` footer. |

### `/services` — sections with no reference counterpart

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /services | none | services-anchor-nav | NOVEL | In-page anchor list for the eight services. D-01 forbids per-service routes, so the anchors carry the navigation the reference spreads across pages. |

---

## `/contact` — reference `/contact/`, 5 sections @1440, h 2254 -> 3202

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /contact | top bar, navy 30px | s00-top-header | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** The reference top bar reads `OK Lic # 80006064` — a state licence number. We hold no licence we may name (D-14), so the band carries our hours instead. That is an information change, not a wording change, so a pixel diff would be measuring a decision. |
| /contact | header / nav | s01-main-header | ADAPTED | Same nav reduction. |
| /contact | red announcement strip, 50px | s02-vh1-is-proud-to-support-employ-v | ADAPTED | As the `/` strip; unverifiable claim replaced. |
| /contact | form + info block, 1739px | s03 | ADAPTED | **D-03/D-05.** Reference runs Gravity Forms with `<input type="email">`, a consent checkbox and reCAPTCHA. Ours: name, phone, service select, preferred callback window, message. No email field, no captcha, no backend. Field count and box geometry matched so the layout is still tested honestly. |
| /contact | footer, grey 305px | s04 | ADAPTED | As `/` footer. |

### `/contact` — sections with no reference counterpart

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /contact | none | contact-map | NOVEL | **D-08.** Coords-only keyless embed at zoom ~15 beside the form, lazy, titled, aspect-ratio wrapper, directions link. The reference contact page embeds no location map. |

---

## `/privacy` — reference `/privacy-policy/`, 6 sections @1440, h 2215 -> 5369

| route | reference section | id | class | reason |
|---|---|---|---|---|
| /privacy | top bar, navy 30px | s00-top-header | ADAPTED | **Reclassified in Prompt 3 (was FIDELITY).** The reference top bar reads `OK Lic # 80006064` — a state licence number. We hold no licence we may name (D-14), so the band carries our hours instead. That is an information change, not a wording change, so a pixel diff would be measuring a decision. |
| /privacy | header / nav | s01-main-header | ADAPTED | Same nav reduction. |
| /privacy | page title, 112px | s02-privacy-policy-and-terms-and-condi | ADAPTED | Our title. |
| /privacy | policy body, 1338px, 7 list items | s03 | NOVEL | **D-16.** Written from scratch to describe what this site actually does: a phone-callback form, no email collection, no analytics, no trackers, no cookies beyond the framework's. No GDPR/CCPA claims. No counterpart content exists, so there is no diff — measured by token conformance on the long-form type scale, which must come from the extracted scale, not defaults. |
| /privacy | CTA band, grey 302px | s04 | ADAPTED | As `/about` CTA band. |
| /privacy | footer, grey 305px | s05 | ADAPTED | As `/` footer. |

---

## DELETED site-wide, per D-02 — scrub list

Not built, not measured, and each one is a checklist item for the Prompt 11 locations sweep.

| item | where it lives in the reference |
|---|---|
| 9 city landing pages | `/bixby-ok-...`, `/broken-arrow-ok-...`, `/edmond-ok-...`, `/jenks-ok-...`, `/moore-ok-...`, `/norman-ok-...`, `/oklahoma-city-ok-...`, `/owasso-ok-...`, `/tulsa-ok-...`, `/yukon-ok-...` |
| Locations nav tree | header nav, 18-item mobile drawer |
| Footer locations column | footer template |
| Service-area map band | home `s14` |
| Both Google My Maps embeds | home, 2 iframes (`maps/d/u/0/embed?mid=...`) |
| Sitemap entries for city pages | `sitemap.xml` |
| Internal anchors to city pages | throughout |
| `areaServed` city array | JSON-LD |

**Only survivor:** the single SERVICE_AREA sentence in the footer —
"Serving Edmond and the north Oklahoma City metro."

Also out of scope per D-01, never captured: `/financing/`, `/faqs/`, `/gallery/`,
`/careers/`, `/our-certifications/`.

---

## Prompt 3 structural gate — how these tables already satisfy it

| requirement | satisfied by |
|---|---|
| Reorder >= 3 sections | Services grid, testimonials, and the process-steps band all move relative to the reference order on `/`. Recorded in `docs/content-divergence.md` in Prompt 3. |
| Drop 2 reference sections | `s05` FORTIFIED grant promo, `s07` manufacturer logo strip. (`s14` and `s15` are additionally removed, under D-02 and FAQ relocation.) |
| Add 2 of our own | `home-map`, `home-nap-hours`. (`mobile-call-bar`, `services-anchor-nav`, `contact-map` are further additions.) |
| Change the headline proposition category | Reference leads on speed and volume ("We Get The Job Done", "the proof is in the numbers"). We lead on **workmanship — the repair holds up**, held across all five routes. |
| Regroup the services | Reference groups by roofing system/material. We group by **symptom** — the door will not close, it is loud, the spring snapped. |


---

## Prompt 3 reclassification log

Done now, not during convergence. A FIDELITY section carrying deliberately different
information burns its whole `ITERATION_CAP` for a reason that was a decision, not a defect
— and under the amended cap that is the section's only attempt.

| section | was | now | why the information changed |
|---|---|---|---|
| `s00-top-header` (all 5 routes) | FIDELITY | **ADAPTED** | The reference band reads `OK Lic # 80006064`. A state licence number is exactly the kind of credential D-14 bars us from inventing, so ours carries `Open daily 7am–7pm` instead. Different information, same 30px band. |
| `/about` `s02` image strip | FIDELITY | **ADAPTED** | Image subject deliberately swapped (D-09) and placeholder-blocked until Prompt 10. |
| `/services` `s02` image strip | FIDELITY | **ADAPTED** | Same. |

**Still FIDELITY — 3 sections.** All three are solid colour bands with zero content on
either side, where a pixel diff is exactly the right instrument:

| section | height | content |
|---|---|---|
| `/` `s08` | 108px | none |
| `/about` `s04` | 54px | none |
| `/about` `s09` | 54px | none |

Every other section on the site is now ADAPTED, NOVEL or DELETED. That is the honest
outcome of a clone-and-adapt where the copy, the proposition, the service grouping, the
nav, the credentials and the imagery are all deliberately ours.

---

## Tally

| class | sections |
|---|---|
| FIDELITY | 3 |
| ADAPTED | 41 |
| NOVEL | 6 |
| DELETED | 4 in-page + 8 site-wide scrub items |
