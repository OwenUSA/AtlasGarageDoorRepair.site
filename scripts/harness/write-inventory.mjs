// Emits assets/INVENTORY.md from .harness/inventory.json. Regenerate, never hand-edit
// the table — the prose header lives in this file so a rerun cannot lose it.
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { HARNESS, ROOT, BP_SET, ensure } from './lib.mjs';

const d = JSON.parse(await readFile(path.join(HARNESS, 'inventory.json'), 'utf8'));
const rows = d.rows;
const dim = (r, b) => (r.bps[b] ? `${r.bps[b].w}x${r.bps[b].h}` : '—');
const ph = (id) => d.generated.filter((g) => g.slotId === id).map((g) => path.basename(g.file)).join(' + ') || '—';

const head = `# assets/INVENTORY.md — asset slots, provenance, status

Built by \`scripts/harness/assets.mjs\` + \`scripts/harness/inventory.mjs\` from all five
reference pages at 390 / 768 / 1440. Raw slot geometry: \`.harness/assets/*.json\`.
Machine-readable inventory: \`.harness/inventory.json\`.

Dimensions are **rendered** pixels at each breakpoint, read off the live reference, not
intrinsic file sizes. Dominant colour is sampled from the Prompt 1 section screenshots
already on disk (\`.harness/cap/ref/**/sec-*.png\`) — nothing was re-fetched to build this.

## Provenance rule (D-09, D-11)

- **TAKE** — generic UI icons and open-licensed fonts, license verified in one step.
- **REPLACE** — the reference business's photos, logo, wordmark, vehicle and staff shots,
  badge images, brand/partner logos, and any licensed font file. **These are theirs.
  Not one REPLACE asset was downloaded into this repo, not even temporarily.** Every row
  below was measured from the live DOM and the screenshots we already had.

**Every photographic slot on this site is REPLACE.** The reference is a real business's
site; its imagery is entirely its own. There is no generic stock in it to inherit.

---

## TAKE — acquired

| asset | provenance | license | how it lands | status |
|---|---|---|---|---|
| **Montserrat** (300/500/600/700) | Google Fonts | **SIL Open Font License 1.1** — verified in one step | \`next/font/google\` in Prompt 5, self-hosted at build, no CDN call | ACQUIRED |
| **lucide-react** icons | npm, allowlisted | **ISC** | replaces the reference's three icon fonts; match stroke width and size, not the exact glyph | ACQUIRED (\`lucide-react@1.39.0\`) |

No binary font or icon file is checked into \`public/\`. \`next/font\` self-hosts Montserrat
from the package at build time and \`lucide-react\` ships SVG paths as components — that is
the acquisition. \`public/\` therefore contains placeholders only, which is correct.

### Fonts found, and what happened to each

| family | where it came from | rendered on the public page? | decision |
|---|---|---|---|
| **Montserrat** | Google Fonts, 54 \`@font-face\` rules, weights 100–900 | **yes — 138 text nodes**, the entire design | **TAKE**, OFL |
| Helvetica | system fallback, 4 nodes at 10–11px | yes, incidentally | n/a — system stack |
| **ETmodules** | Divi theme icon font (\`modules.woff\`) | yes, 1 glyph at 59.5px | **REPLACE** → \`lucide-react\` |
| **FontAwesome** | Divi bundle (\`fa-solid-900.woff2\`, \`fa-regular-400.woff2\`) | no rendered glyphs found | **REPLACE** → \`lucide-react\` |
| dashicons | WordPress admin, base64 data URI | no | dropped — admin chrome, not site design |
| gform-icons-orbital | Gravity Forms | no | dropped — we ship no Gravity Forms |
| **GD Sherpa** | \`.godaddy-styles\`, \`#wpadminbar\` | **no — hosting control-panel chrome only** | **not a design font.** No \`@font-face\`, never rendered. Not substituted, because it was never used. |

**There is no licensed display-font substitution on this build.** The Prompt 1 profile
flagged "GD Sherpa" from a raw CSS scrape; the \`@font-face\` enumeration in this prompt
shows it has no font file and styles only the GoDaddy admin bar. The only design face is
Montserrat, which is OFL and comes in unchanged. See \`docs/known-divergence.md\` — this
removes a floor that was expected to exist, and adds a smaller one for icon glyphs.

---

## REPLACE — every slot, with the geometry a generator needs

\`object-fit\` is the CSS \`object-fit\` for \`<img>\`/\`<video>\` and the \`background-size\` for
CSS background slots. **Aspect Δ** marks a slot whose aspect ratio changes between
breakpoints — those get a second crop in Prompt 10, per OVERRIDE 2.

| slot ID | route | section | kind | 390 | 768 | 1440 | aspect @1440 | object-fit | dominant | aspect Δ | placeholder |
|---|---|---|---|---|---|---|---|---|---|---|---|
`;

const body = rows
  .filter((r) => r.provenance === 'REPLACE')
  .map((r) => `| \`${r.slotId}\` | ${r.route} | ${r.section} | ${r.kind} | ${dim(r, 390)} | ${dim(r, 768)} | ${dim(r, 1440)} | ${r.aspects[1440]} | ${r.objectFit} | \`${r.colour.hex}\` | ${r.aspectChanges ? '**yes**' : 'no'} | \`${ph(r.slotId)}\` |`)
  .join('\n');

const deleted = rows.filter((r) => r.provenance === 'DELETED')
  .map((r) => `| \`${r.slotId}\` | ${r.route} | ${r.section} | ${dim(r, 1440)} | ${r.note} |`)
  .join('\n');

const tail = `

### Slot notes

${rows.filter((r) => r.provenance === 'REPLACE').map((r) => `- **\`${r.slotId}\`** — ${r.note}${r.count > 1 ? ` Rendered ${r.count}× in the band.` : ''}`).join('\n')}

---

## DELETED — inventoried, deliberately not filled

| slot ID | route | section | 1440 | why |
|---|---|---|---|---|
${deleted}

Additionally **not inventoried as slots at all**, per D-02: the two Google My Maps
service-area embeds on home, the home service-area map band (\`s14\`), and every asset on
the nine city landing pages. They are not gaps to fill; they are removals.

Also excluded: \`mejs-controls.svg\` (MediaElement.js player chrome — framework UI, not a
design asset) and the base64 \`dashicons\` face (WordPress admin).

---

## Video

The reference plays **three \`.mp4\` files**, none with a \`poster\` attribute:

| file | rendered 390 | 768 | 1440 | our slot |
|---|---|---|---|---|
| \`vh1_roofing-1080p.mp4\` | 1600x900 | 1920x1080 | 1440x810 | \`home-hero-media\` |
| \`VH1_052826.mp4\` | 312x176 | 614x346 | 510x287 | \`home-video-b\` |
| \`VH1_roofing_1215.mp4\` | 386x217 | 760x428 | 674x379 | \`home-video-c\` |

**No video ships in this build** (Appendix A). Each becomes a poster image slot at the same
box and aspect. Two of the three sit behind a CSS background cover frame
(\`home-video-poster-a\`, \`home-video-poster-b\`) which is the still we actually need.

## Responsive asset swaps worth knowing before Prompt 6

Two slots are not one image at three sizes — the reference serves **different assets** by
breakpoint, and rebuilding them as a single responsive image would be wrong:

1. **Process steps.** Desktop renders **five separate 202x337 tiles**
   (\`home-process-step\`). Below 980 those are hidden and a **single 312x1300 / 480x2000
   stacked composite** takes over (\`home-process-mobile\`). Different art, not a resize.
2. **Trust badges.** Mobile renders **eleven individual badge images** at 300×N
   (\`home-badge-*\`). Desktop hides them and shows one **1080x338 composite strip**
   (\`home-brand-strip\`, which we DELETE). Our badge row is TODO(fact) chips either way.

## Gradients are tokens, not assets

The home hero and four other bands read as "background images" but are
\`linear-gradient(rgb(107,4,11) → rgb(187,32,38))\` — no file. They belong to the Prompt 5
token set, not this inventory. Recorded here so nobody hunts for a hero JPEG that does not
exist.

---

## Placeholders

${d.generated.length} generated SVGs in \`public/placeholders/\`, checked in. Each is a flat fill of the
slot's sampled dominant colour with the slot ID and pixel dimensions as text — nothing
else. No external placeholder service, no network dependency at build or runtime.

Files carrying an \`-alt\` suffix are the second crop for a slot whose aspect changes
between breakpoints.

**Placeholder slots are a tracked gap, not a blocker.** They are listed in
\`docs/known-divergence.md\` as permanent floors until Prompt 10 hands back real files, and
any section whose diff is blocked by one is reported with the placeholder area excluded.

## Tally

| | count |
|---|---|
| slots inventoried | ${rows.length} |
| REPLACE | ${rows.filter((r) => r.provenance === 'REPLACE').length} |
| DELETED | ${rows.filter((r) => r.provenance === 'DELETED').length} |
| TAKE | 2 (Montserrat, lucide-react) |
| placeholders generated | ${d.generated.length} |
| REPLACE assets downloaded | **0** |
`;

await ensure(path.join(ROOT, 'assets'));
await writeFile(path.join(ROOT, 'assets', 'INVENTORY.md'), head + body + tail, 'utf8');
console.log('assets/INVENTORY.md written:', (head + body + tail).length, 'bytes');
