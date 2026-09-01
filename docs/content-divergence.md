# docs/content-divergence.md — the measured result of Prompt 3

All site copy was written before any component consumed it, to a measured divergence
target. Source of truth: `content/copy.ts`. Gate: `node scripts/similarity.mjs`
(re-run in Prompt 11, gate 11).

## Result

| gate | threshold | result |
|---|---|---|
| Shared 5-grams with the reference corpus | 0 | **0 across all 55 blocks** |
| Trigram Jaccard vs the paired reference section | <= 0.15 | **max 0.100**, 55/55 pass |
| Character count vs the reference slot | +/-10% | **38/38 measured blocks pass**, 7 exempt with reasons |

The 5-gram check runs against the **entire** reference corpus, not just the paired
section, so a phrase lifted from any of the five pages would still be caught.

---

## The four structural changes

### 1. Three sections reordered on `/`

| section | reference position | ours | note |
|---|---|---|---|
| `s13` services grid | 13th | **5th** | Moved above the fold group. The services block is the reason people are on the page; the reference buries it below testimonials and a stat strip. |
| `s12` stat strip | 12th | **10th** | Now follows the process band, so the (TODO(fact)) numbers sit next to the method they describe. |
| `s10` CTA band | 10th | **11th** | Displaced by the stat-strip move, and reads better as the closer after the numbers. |

Testimonials (`s11`) consequently shift from 11th to 12th. Four bands move in total;
the requirement was three.

### 2. Two reference sections dropped, two of our own added

**Dropped** (held from `docs/sections.md`, unchanged):

- `s05` — Oklahoma FORTIFIED roof-grant promo. A roofing-specific state programme with no
  garage-door analogue. Rebuilding it would require inventing a programme.
- `s07` — manufacturer / material logo strip. Their supplier brand logos; D-09 forbids
  reuse and we have no brand relationships to name.

**Added:**

- `home-map` — required by D-08, coords-only keyless embed at zoom 13. Also replaces the
  deleted `s14` service-area band.
- `home-nap-hours` — hours and service-area card. The reference states its hours nowhere
  on the site.

(Three further additions exist — `mobile-call-bar`, `services-anchor-nav`, `contact-map` —
plus two further removals, `s14` under D-02 and `s15` relocated to `/services`.)

### 3. Headline proposition category changed

| | |
|---|---|
| **Reference leads on** | speed and volume — "We Get The Job Done.", "The proof is in the numbers", "TOP RATED ROOFING CONTRACTOR" |
| **We lead on** | **workmanship — the repair holds up** |

Held across all five routes, with no exceptions:

- `/` hero — "Fixed once, properly."
- `/` strip and `/contact` strip — "The repair holds. That is the whole promise."
- `/` intro — "EVERY REPAIR IS BUILT TO BE THE LAST ONE THIS DOOR NEEDS"
- `/about` — "How we work", "Why measurement beats judgement"
- `/services` — "THE REPAIR HOLDS"
- every metadata description mentions measurement or cycle-testing, never speed

**Speed is never claimed anywhere**, and no response-time window is invented (F-20).

### 4. Services regrouped

The reference groups by **roofing system and material** — shingle, metal, shake, tile,
slate, commercial coatings. That is a taxonomy of what they install.

We group by **symptom** — what you would say on the phone:

| our group | services it contains |
|---|---|
| It will not close, or it closes crooked | spring repair and replacement; off-track and misaligned door correction |
| It runs, but it sounds wrong | cable, roller and track repair; annual maintenance and tune-up |
| The opener will not listen | opener repair and installation |
| The door itself is damaged or dated | panel replacement; new residential door installation |
| It is a bay door, and downtime costs money | commercial and roll-up doors |

All eight required services are present. The grouping is held identically on `/`,
`/about` and `/services`, and drives the `/services` in-page anchor nav.

---

## Per-section overlap table

`5g` = shared 5-grams with the whole reference corpus (must be 0).
`tri` = trigram Jaccard against the paired reference section, stopwords and industry
allowlist removed (must be <= 0.15).

| route | our section | ref section | class | our chars | ref chars | Δ | 5g | tri | status |
|---|---|---|---|---|---|---|---|---|---|
| / | `s00-top-header` | `s00-top-header` | FIDELITY | 18 | 17 | +5.9% | 0 | 0.000 | PASS |
| / | `s01-main-header` | `s01-main-header` | ADAPTED | 92 | 373 | -75.3% | 0 | 0.000 | **LEN EXEMPT** |
| / | `s02-vh1-is-proud-to-support-employ-v` | `s02-vh1-is-proud-to-support-employ-v` | ADAPTED | 44 | 41 | +7.3% | 0 | 0.000 | PASS |
| / | `s03-we-get-the-job-done` | `s03-we-get-the-job-done` | ADAPTED | 143 | 131 | +9.2% | 0 | 0.000 | PASS |
| / | `s13-services-our-services` | `s13-services-our-services` | ADAPTED | 3836 | 3610 | +6.3% | 0 | 0.000 | PASS |
| / | `s04-top-rated-roofing-contractor-in-tu` | `s04-top-rated-roofing-contractor-in-tu` | ADAPTED | 131 | 142 | -7.7% | 0 | 0.000 | PASS |
| / | `s06` | `s06` | ADAPTED | 329 | 349 | -5.7% | 0 | 0.000 | PASS |
| / | `s08` | `s08` | FIDELITY | 0 | 0 | — | 0 | 0.000 | PASS |
| / | `s09-we-make-it-easy-to-get-the-job-don` | `s09-we-make-it-easy-to-get-the-job-don` | ADAPTED | 456 | 84 | +442.9% | 0 | 0.000 | **LEN EXEMPT** |
| / | `s12-the-proof-is-in-the-numbers-vh1-g` | `s12-the-proof-is-in-the-numbers-vh1-g` | ADAPTED | 123 | 112 | +9.8% | 0 | 0.000 | PASS |
| / | `s10-your-roof-our-reputation` | `s10-your-roof-our-reputation` | ADAPTED | 350 | 345 | +1.4% | 0 | 0.000 | PASS |
| / | `s11-hundreds-of-oklahoman-s-rate-vh1-5` | `s11-hundreds-of-oklahoman-s-rate-vh1-5` | ADAPTED | 1615 | 1663 | -2.9% | 0 | 0.000 | PASS |
| / | `home-map` | `null` | NOVEL | 121 | — | — | 0 | 0.000 | PASS |
| / | `home-nap-hours` | `null` | NOVEL | 270 | — | — | 0 | 0.000 | PASS |
| / | `mobile-call-bar` | `null` | NOVEL | 19 | — | — | 0 | 0.000 | PASS |
| / | `s16` | `s16` | ADAPTED | 235 | 241 | -2.5% | 0 | 0.000 | PASS |
| /about | `s00-top-header` | `s00-top-header` | FIDELITY | 18 | 17 | +5.9% | 0 | 0.000 | PASS |
| /about | `s01-main-header` | `s01-main-header` | ADAPTED | 92 | 373 | -75.3% | 0 | 0.000 | **LEN EXEMPT** |
| /about | `s02` | `s02` | FIDELITY | 0 | 0 | — | 0 | 0.000 | PASS |
| /about | `s03-about-vh1-roofing` | `s03-about-vh1-roofing` | ADAPTED | 47 | 43 | +9.3% | 0 | 0.000 | PASS |
| /about | `s04` | `s04` | FIDELITY | 0 | 0 | — | 0 | 0.000 | PASS |
| /about | `s05-our-mission` | `s05-our-mission` | ADAPTED | 1303 | 1388 | -6.1% | 0 | 0.000 | PASS |
| /about | `s06-reliable-roofing-professionals` | `s06-reliable-roofing-professionals` | ADAPTED | 910 | 1004 | -9.4% | 0 | 0.000 | PASS |
| /about | `s07-our-team` | `s07-our-team` | ADAPTED | 704 | 750 | -6.1% | 0 | 0.000 | PASS |
| /about | `s08-our-services` | `s08-our-services` | ADAPTED | 1322 | 1404 | -5.8% | 0 | 0.000 | PASS |
| /about | `s09` | `s09` | FIDELITY | 0 | 0 | — | 0 | 0.000 | PASS |
| /about | `s10` | `s10` | ADAPTED | 220 | 223 | -1.3% | 0 | 0.000 | PASS |
| /about | `s11` | `s11` | ADAPTED | 235 | 241 | -2.5% | 0 | 0.000 | PASS |
| /services | `s00-top-header` | `s00-top-header` | FIDELITY | 18 | 17 | +5.9% | 0 | 0.000 | PASS |
| /services | `s01-main-header` | `s01-main-header` | ADAPTED | 92 | 373 | -75.3% | 0 | 0.000 | **LEN EXEMPT** |
| /services | `s02` | `s02` | FIDELITY | 0 | 0 | — | 0 | 0.000 | PASS |
| /services | `s03-roofing-services` | `s03-roofing-services` | ADAPTED | 85 | 85 | 0% | 0 | 0.000 | PASS |
| /services | `services-anchor-nav` | `null` | NOVEL | 168 | — | — | 0 | 0.000 | PASS |
| /services | `s04-call-918-630-7788-405-760-9814` | `s04-call-918-630-7788-405-760-9814` | ADAPTED | 1514 | 1379 | +9.8% | 0 | 0.000 | PASS |
| /services | `s05-we-get-the-job-done` | `s05-we-get-the-job-done` | ADAPTED | 88 | 94 | -6.4% | 0 | 0.000 | PASS |
| /services | `s06-faq-s` | `s06-faq-s` | ADAPTED | 720 | 676 | +6.5% | 0 | 0.000 | PASS |
| /services | `s07` | `s07` | ADAPTED | 220 | 223 | -1.3% | 0 | 0.000 | PASS |
| /services | `s08` | `s08` | ADAPTED | 235 | 241 | -2.5% | 0 | 0.000 | PASS |
| /contact | `s00-top-header` | `s00-top-header` | FIDELITY | 18 | 17 | +5.9% | 0 | 0.000 | PASS |
| /contact | `s01-main-header` | `s01-main-header` | ADAPTED | 92 | 373 | -75.3% | 0 | 0.000 | **LEN EXEMPT** |
| /contact | `s02-vh1-is-proud-to-support-employ-v` | `s02-vh1-is-proud-to-support-employ-v` | ADAPTED | 44 | 41 | +7.3% | 0 | 0.000 | PASS |
| /contact | `s03` | `s03` | ADAPTED | 1174 | 5883 | -80% | 0 | 0.000 | **LEN EXEMPT** |
| /contact | `contact-map` | `null` | NOVEL | 100 | — | — | 0 | 0.000 | PASS |
| /contact | `s04` | `s04` | ADAPTED | 235 | 241 | -2.5% | 0 | 0.000 | PASS |
| /privacy | `s00-top-header` | `s00-top-header` | FIDELITY | 18 | 17 | +5.9% | 0 | 0.000 | PASS |
| /privacy | `s01-main-header` | `s01-main-header` | ADAPTED | 92 | 373 | -75.3% | 0 | 0.000 | **LEN EXEMPT** |
| /privacy | `s02-privacy-policy-and-terms-and-condi` | `s02-privacy-policy-and-terms-and-condi` | ADAPTED | 60 | 65 | -7.7% | 0 | 0.100 | PASS |
| /privacy | `s03` | `s03` | NOVEL | 2384 | 2593 | -8.1% | 0 | 0.000 | PASS |
| /privacy | `s04` | `s04` | ADAPTED | 220 | 228 | -3.5% | 0 | 0.000 | PASS |
| /privacy | `s05` | `s05` | ADAPTED | 235 | 241 | -2.5% | 0 | 0.000 | PASS |

### Metadata — written in the same pass, same gates

Duplicate metadata is the most detectable form of copying, so titles and descriptions run
through the identical gate.

| route | block | compared against | class | our chars | ref chars | Δ | 5g | tri | status |
|---|---|---|---|---|---|---|---|---|---|
| / | `(metadata)` | (whole page) | ADAPTED | 209 | — | — | 0 | 0.000 | PASS |
| /about | `(metadata)` | (whole page) | ADAPTED | 201 | — | — | 0 | 0.000 | PASS |
| /services | `(metadata)` | (whole page) | ADAPTED | 206 | — | — | 0 | 0.000 | PASS |
| /contact | `(metadata)` | (whole page) | ADAPTED | 194 | — | — | 0 | 0.000 | PASS |
| /privacy | `(metadata)` | (whole page) | ADAPTED | 193 | — | — | 0 | 0.000 | PASS |

---

## Length-gate exemptions — three cases, with reasons

The +/-10% rule exists so the layout is still tested against something real. Three cases
break that assumption, and in each the reference figure is not a target we could hit
without undoing a decision. They are encoded in `LENGTH_EXEMPT` in
`scripts/similarity.mjs`, so the Prompt 11 re-run reports them as EXEMPT rather than
quietly passing or failing.

| block | Δ | why the reference number is not a target |
|---|---|---|
| `s01-main-header` (all 5 routes) | -75.3% | The reference nav is 373 characters because it contains the entire 18-item Locations city tree. **D-02 mandates deleting it.** Matching the count would mean re-adding content we removed on purpose. |
| `/` `s09` process band | +442.9% | The reference's five step captions live **inside PNG artwork**, so its extractable text is only 84 characters. Ours must carry the same information as real text — the images are placeholders and screen readers need the words. Character parity here would mean shipping words as pictures. |
| `/contact` `s03` form block | -80% | The 5883-character reference figure is the **entire Gravity Forms DOM**: every select option, hidden label, consent paragraph and reCAPTCHA notice. Ours is five fields with no captcha, no consent block and no email field (D-03, D-05). The visible copy is comparable; the DOM text is not. |

Everything else — every hero, body block, service description, FAQ answer, policy
section, CTA band and footer — is inside +/-10%.

## Trigram note

Every section came in at 0.000 except `/privacy` `s02` at 0.100, which is a two-word page
title against a two-word page title. No section approached the 0.15 ceiling, so no block
had to be floored for allowlist saturation.

## Facts

No fact was invented to make any of this read better. `TODO(fact)` markers are carried
inside the copy itself — the badge row, the stat strip, the team block and the
testimonials all render their placeholders as real strings. `docs/facts-needed.md` holds
all 24. Prices appear nowhere (D-12); "free estimate" is used, which is allowed.

Testimonials are literal `[TESTIMONIAL PLACEHOLDER n — ...]` blocks at realistic length
(D-13). No named customer, no quote, no star count, and no `AggregateRating` or `Review`
JSON-LD anywhere in the build.
