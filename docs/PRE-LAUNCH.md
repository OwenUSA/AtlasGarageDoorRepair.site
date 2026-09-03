# docs/PRE-LAUNCH.md — blockers before this site faces the public

**This site is not launch-ready and must not be deployed as-is.** Everything below is a
hard blocker. The build is a faithful local clone-and-adapt exercise; some facts started
as deliberate placeholders and several of the site's capabilities are stubs. As of
2026-09-03 the phone, street address, map coordinates and service-area sentence have been
replaced with Atlas Garage Door Repair's real, verified values (see `CLAUDE.md`) — those
items are resolved and are no longer pre-launch blockers. The remaining items below (name
verification, images, credentials, testimonials, legal review, the contact form, and the
never-run gates) are still open.

Status at end of chain: `pnpm build` clean, 5 routes static, 0 console errors, all
acceptance gates run except the two dropped in A-4 (see §7).

---

## 1. Business facts — resolved vs. still open

The phone, street address, map coordinates and service-area sentence were originally
invented placeholders so the build could be exercised without touching a real business.
As of 2026-09-03 those four are **real, verified values** (per `CLAUDE.md`'s CONSTANTS,
cross-checked against `../domains-table.md`) and are resolved — no longer blockers.
Business name and hours are still unverified against the real business and remain open,
and the canonical URL is still a local dev placeholder.

| # | fact | current value | status |
|---|---|---|---|
| PL-01 | **Phone** | `(239) 427-4221` | **RESOLVED.** Real number. Rendered as `tel:+12394274221` in the header, drawer, call bar, hero, every CTA band, the footer, the contact card and JSON-LD. |
| PL-02 | **Street address** | `6050 Collier Blvd, Ste 1, Naples, FL 34114` | **RESOLVED.** Real street address. Both maps still embed by coordinates rather than the address string (D-07) — that is a reliability choice, not a fiction workaround. |
| PL-03 | **Business name** | `Atlas Garage Door Repair` | **Open — unverified.** Appears in the logo wordmark, the `<title>` on all five routes, every meta description, JSON-LD `name`, the footer, and every `aria-label` on a call link. Confirm this is the business's actual registered/trade name before launch. |
| PL-04 | **Map coordinates** | `26.0439,-81.6999` | **RESOLVED.** Geocoded from the real street address via the US Census geocoder. Both maps and both "Get directions" links use them. |
| PL-05 | **Hours** | `7 days, 7:00 AM – 7:00 PM` | **Open — unverified.** Plausible but not yet confirmed against the real business. Rendered in the top bar, footer, NAP card, contact page and `openingHoursSpecification`. |
| PL-06 | **Service area** | `Serving Naples and the surrounding Collier County communities.` | **RESOLVED.** Updated to match the real address's metro. The only surviving locations sentence (D-02). |
| PL-07 | **Canonical URL** | `http://localhost:3101` | **Open.** Local-only build (D-18). Every canonical tag, the sitemap, `robots.txt` and JSON-LD `url` point at localhost — must be swapped for the production domain before launch. |

All of PL-01 to PL-07 live in **one file** — `src/lib/business.ts`. Changing them there
updates every render site.

## 2. Images — every photographic slot is a placeholder

29 REPLACE slots ship as flat-colour SVG placeholders. Nothing from the reference site was
ever downloaded. Generation prompts are written and ready in **`docs/asset-prompts.md`**.

| # | blocker |
|---|---|
| PL-08 | **Logo (F-01, F-02).** No logo exists. A two-line Montserrat wordmark stands in, and it is the dominant cause of the header's floored structural residual on all five routes. |
| PL-09 | **All photographic slots** — home hero, two intro photos, two video posters, five process tiles plus the mobile composite, `/about` title strip and crew photo, `/services` title strip, body background and FAQ background. |
| PL-10 | **No video ships.** The reference plays three `.mp4` files; ours are poster stills only. If video is wanted it is new work, not a drop-in. |

## 3. All 24 `TODO(fact)` must be resolved — F-01 to F-24

Counted, never removed. Full detail in `docs/facts-needed.md`. Grouped:

| # | blocker |
|---|---|
| PL-11 | **Credentials and licensing (F-03–F-09).** Licence number, bonding, insurance, BBB, safety and trade certifications, manufacturer partnerships, review-platform presence. The reference's own top bar carries `OK Lic # 80006064`; we render hours instead because inventing a licence number is not acceptable. **13 asset slots are deliberately never generated for this reason** — resolve them as facts, or remove the badge row. |
| PL-12 | **Every number on the stat strip (F-11–F-13).** Doors serviced, years in business, technicians. All three tiles render the literal string `TODO(fact)`. |
| PL-13 | **Company history and team (F-15–F-18).** Founding year, founder, origin story, technician names, roles, headshots, training. |
| PL-14 | **Service terms (F-19–F-23).** Warranty, response-time commitment, service radius, after-hours availability, payment and financing. **Note: hours are a single 07:00–19:00 block, seven days — do not invent 24/7 emergency cover.** |
| PL-15 | **Partner and affiliation logos (F-10).** |

## 4. Testimonials — fabricated review markup is a legal problem

| # | blocker |
|---|---|
| PL-16 | The testimonials section renders **seven literal `[TESTIMONIAL PLACEHOLDER n — …]` blocks** at realistic length. Fill them with **real, permissioned, attributed quotes, or delete the section.** There is deliberately **no `AggregateRating` and no `Review` JSON-LD anywhere** in the build (D-13). If real reviews are added, that markup must be added carefully and truthfully, and only then. |

## 5. Privacy policy is an unreviewed template

| # | blocker |
|---|---|
| PL-17 | `/privacy` ships with a visible **`UNREVIEWED TEMPLATE — requires legal review before launch`** marker. It is written to describe what the site actually does: phone-callback form, no email collection, no analytics, no tracking cookies, a lazily-mounted Google map. **It claims no GDPR or CCPA compliance and must not be edited to claim any without counsel.** If the site's behaviour changes — analytics added, form wired up — this page must change with it *before* launch. |

## 6. The contact form does not submit

| # | blocker |
|---|---|
| PL-18 | `src/components/contact/ContactForm.tsx` is marked **`// STUB: no submission target`** on its first line. It validates client-side, `console.warn`s a stub notice and shows a "we'll call you back" state. **Nothing is transmitted or stored anywhere.** Until a real target exists, the confirmation state is a promise the site cannot keep. Wire it up, or remove the form and leave the phone number. Any backend added here is new attack surface that has never been reviewed — there is currently no server code at all. |

## 7. Two acceptance gates were dropped and never run (A-4)

Recorded verbatim, as required:

| # | blocker |
|---|---|
| PL-19 | **performance never measured** — Lighthouse was dropped from the acceptance sweep. No Core Web Vitals and no performance, accessibility, best-practices or SEO score exists for any route. The map iframes in particular are a known, unmeasured cost. |
| PL-20 | **keyboard access is spec-verified only, never hand-tested** — the manual keyboard pass was dropped. Every requirement in `docs/behavior/01`–`08` was verified to be *present in the source* (skip link, `aria-expanded`/`aria-controls`, Escape handling, focus trap, focus return, body scroll lock, native `<details>`, `aria-live`/`aria-invalid`/`aria-describedby`, map bypass, `aria-current`, `:focus-visible`) — but **no human has driven this site with a keyboard, and no screen reader has been run against it.** |

## 8. Other launch prerequisites

| # | blocker |
|---|---|
| PL-21 | **JSON-LD re-verified against the real facts.** `LocalBusiness` now draws its phone, address and geo from real, verified constants (PL-01, PL-02, PL-04); business name and hours still need verification (PL-03, PL-05). It deliberately contains no `email`, no `aggregateRating`, no `review`, no `priceRange` and no `areaServed` city array — keep it that way unless each addition is true. |
| PL-22 | **Hosting, domain and HTTPS.** D-18: local only. No environment config, no deploy target, no `.env`, no third-party keys, no auth. |
| PL-23 | **Analytics and consent.** None ships (D-15). If any is added, the privacy policy (PL-17) becomes wrong the same day. |
| PL-24 | **Prune the duplicated NAP literals from `content/copy.ts`** so `lib/business.ts` is the single source of truth in fact as well as in practice. Rendered values already come from `business.ts`; the copy file carries stale copies in its `items[]` labels. |

---

## Summary

| category | blockers |
|---|---|
| business facts (PL-01, PL-02, PL-04, PL-06 resolved 2026-09-03; PL-03, PL-05, PL-07 still open) | PL-03, PL-05, PL-07 |
| images and logo | PL-08 – PL-10 |
| unresolved facts (24) | PL-11 – PL-15 |
| testimonials | PL-16 |
| legal review | PL-17 |
| non-functional form | PL-18 |
| never-measured gates | PL-19 – PL-20 |
| infrastructure and hygiene | PL-21 – PL-24 |
| **total** | **21 open blockers** (4 resolved: PL-01, PL-02, PL-04, PL-06) |

Nothing here is optional. The phone and street address are now real, but the business
name and hours are still unverified, the form does not submit, and the privacy policy has
not been read by a lawyer.

## RESOLVED (2026-09-03) — the primary call CTA was invisible on all five routes

Root cause found: `src/app/globals.css`'s "Base" rules (`a { color: ... }`,
`h1..h6 { color: ... }`, focus ring, skip link) were **unlayered** CSS. In Tailwind v4,
any unlayered rule beats every rule inside a `@layer` — including every Tailwind utility
class — regardless of source order or specificity. So a component's explicit
`text-surface` / `text-primary` / `text-neutral-900` on an `<a>` or heading was being
silently overridden back to the base accent/primary colour, which is exactly why the
header/hero/CTA phone links and the hero H1 collapsed onto a same-toned background.
Fixed by wrapping those rules in `@layer base { ... }` so component-level utilities win
as originally intended. Three remaining components also had genuine per-component bugs,
fixed alongside it: `FactChip` on the stat strip used the light-band text colour
against the accent gradient band (now takes a `tone="inverted"` prop there),
`SiteFooter`'s phone link had no explicit text colour and fell back to the (also
unlayered) default, and `PolicyBody.tsx` used `text-neutral-400` (a decorative-only
token) for body copy instead of `text-neutral-600`.

Also replaced the applied palette: seed `500656` (plum/crimson) → seed `239259`
(navy blue / burnt orange, split-complementary) via the existing `scripts/palette.mjs`
generator/gate, searched for a primary hue in the steel/navy arc and an accent hue in
the orange/amber arc — a better fit for a garage-door trade brand named "Atlas." Same
generator, same AA + CTA-chroma-dominance gate; only H moved.

Re-measured against the shared harness after both fixes:

| gate | before | after |
|---|---|---|
| `contrast.mjs` | 214 FAIL / 1155 scored | **0 FAIL** / 1152 scored, 12 UNMEASURABLE (text over a placeholder photo, pre-existing) |
| `rendertruth.mjs` text-legibility | 90 findings | **0 findings** |
| `rendertruth.mjs` other (tap-target, cta-primacy) | — | 40 findings, unchanged before/after the palette swap — pre-existing, unrelated to colour (see below) |

**Not fixed, out of scope for this pass — still open:**
- 39 tap-target findings: a few links (`Privacy Policy` footer link, "Call about this"
  on service cards) are under the 44×44 WCAG 2.5.8 minimum at 390px. Sizing, not colour.
- 1 `cta-primacy` finding on `/contact` at 390: the callback form's submit button reads
  as more saturated (chroma 0.70) than the call CTA (chroma 0.31) — the reading looks
  like a capture artifact from an unstyled native form control rather than a real token
  issue, since the submit button uses the same `bg-accent`/`text-surface` classes as
  every other CTA. Needs its own investigation, unrelated to this fix.
