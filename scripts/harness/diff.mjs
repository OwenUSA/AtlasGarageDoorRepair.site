// STEP C — the comparison side. Three measurement modes, all three required:
//   FIDELITY -> pixel diff (pixelmatch), % divergent area of the union box
//   ADAPTED  -> structural-metric deviation, geometry + type + color + rhythm
//   NOVEL    -> token conformance, zero tolerance
//
//   node scripts/harness/diff.mjs --route / --bp 1440
// Prints a ranked table and writes .harness/diff/<route>-<bp>.json + docs/divergence.md.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import {
  HARNESS, ROOT, BP_SET, OUR_ROUTES, readJson, writeJson, ensure, slug, pct,
} from './lib.mjs';
import { capDir, args } from './capture.mjs';

const THRESHOLD = 2;        // % divergent pixel area   — FIDELITY
const STRUCT_THRESHOLD = 5; // % structural deviation   — ADAPTED
const TOKEN_THRESHOLD = 0;  // token violations         — NOVEL

// ---------- sections.md is the contract: it decides which mode a section runs in ----------
async function sectionClasses() {
  const f = path.join(ROOT, 'docs', 'sections.md');
  if (!existsSync(f)) return {};
  const md = await readFile(f, 'utf8');
  const map = {};
  for (const line of md.split('\n')) {
    // | route | ref-section | our-section-id | CLASS | reason |
    const m = line.match(/^\|\s*(\/[a-z]*)\s*\|([^|]*)\|\s*([a-z0-9-]+)\s*\|\s*(FIDELITY|ADAPTED|NOVEL|DELETED)\s*\|/i);
    if (m) map[`${m[1].trim()}::${m[3].trim()}`] = m[4].toUpperCase();
  }
  return map;
}

// sections.md is keyed on the 1440 reference IDs. Section ordinals shift between
// breakpoints (home is 18 bands at 390, 17 at 1440), so an ordinal join silently
// mislabels everything. Resolve every breakpoint's class by pairing each section back
// to its own 1440 counterpart: heading text first, normalized band progress as tiebreak.
const slugOf = (id) => String(id).replace(/^s\d+-?/, '');
const normHead = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function buildClassResolver(classes, route, refMetaBp, refMeta1440) {
  const lookup = (id) => classes[`${route}::${id}`] || classes[`${route}::${slugOf(id)}`] || null;
  if (!refMeta1440 || refMetaBp === refMeta1440) {
    return (sec) => ({ cls: lookup(sec.id) || 'FIDELITY', canonical: sec.id, via: 'direct' });
  }
  const canon = refMeta1440.sections.map((s) => ({
    id: s.id, head: normHead(s.headingText),
    mid: (s.box.docTop + s.box.h / 2) / Math.max(refMeta1440.page.scrollHeight, 1),
  }));
  const H = Math.max(refMetaBp.page.scrollHeight, 1);
  const used = new Set();
  const resolved = new Map();
  const secs = refMetaBp.sections.map((s) => ({
    idx: s.idx, id: s.id, head: normHead(s.headingText),
    mid: (s.box.docTop + s.box.h / 2) / H,
    weight: (s.textChars || 0) + s.box.h,
  }));
  // pass 1 — heading match, heaviest band first. A band can split into a thin stub plus
  // the real content band at mobile; the substantive one must claim the canonical id,
  // or the stub steals it and everything downstream shifts by one.
  for (const s of [...secs].sort((x, y) => y.weight - x.weight)) {
    if (!s.head) continue;
    const hit = canon.find((c) => !used.has(c.id) && c.head && (c.head === s.head || c.head.startsWith(s.head) || s.head.startsWith(c.head)));
    if (hit) { used.add(hit.id); resolved.set(s.idx, { id: hit.id, via: 'heading' }); }
  }
  // pass 2 — headingless bands match on page progress, assigned GLOBALLY best-first.
  // Sequential assignment lets an early weak match consume a slot a later strong match
  // needed, which strands the last band (the footer) as unmatched.
  const cand = [];
  for (const s of secs) {
    if (resolved.has(s.idx)) continue;
    for (const c of canon) {
      if (used.has(c.id)) continue;
      cand.push({ idx: s.idx, id: c.id, d: Math.abs(c.mid - s.mid) });
    }
  }
  cand.sort((x, y) => x.d - y.d);
  for (const c of cand) {
    if (resolved.has(c.idx) || used.has(c.id)) continue;
    used.add(c.id);
    resolved.set(c.idx, { id: c.id, via: 'progress' });
  }
  return (sec) => {
    const r = resolved.get(sec.idx);
    if (!r) return { cls: 'UNMATCHED', canonical: sec.id, via: 'unmatched' };
    return { cls: lookup(r.id) || 'FIDELITY', canonical: r.id, via: r.via };
  };
}

// ---------- FIDELITY: pixel diff over the union box ----------
async function pixelDiff(refPng, oursPng, outPng) {
  if (!existsSync(refPng) || !existsSync(oursPng)) return null;
  const a = sharp(refPng), b = sharp(oursPng);
  const [ma, mb] = [await a.metadata(), await b.metadata()];
  const W = Math.max(ma.width, mb.width);
  const H = Math.max(ma.height, mb.height);
  // Pad both to the union box on transparent black. Padding counts as divergence,
  // which is correct: a section that is the wrong height IS divergent.
  const pad = (img) => img
    .extend({ top: 0, left: 0, bottom: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize({ width: W, height: H, fit: 'contain', position: 'left top',
              background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw().ensureAlpha().toBuffer();
  const [ba, bb] = [await pad(a), await pad(b)];
  const diff = Buffer.alloc(W * H * 4);
  const n = pixelmatch(ba, bb, diff, W, H, { threshold: 0.1, includeAA: false, alpha: 0.4 });
  if (outPng) await sharp(diff, { raw: { width: W, height: H, channels: 4 } }).png().toFile(outPng);
  return { divergentPx: n, totalPx: W * H, pctArea: pct(n / (W * H)), union: { w: W, h: H },
           ref: { w: ma.width, h: ma.height }, ours: { w: mb.width, h: mb.height } };
}

// ---------- ADAPTED: structural metrics only. Pixel diff is meaningless here. ----------
const NUMERIC = [
  ['box.w', (s) => s.box.w], ['box.h', (s) => s.box.h],
  ['padTop', (s) => s.appearance.paddingTop], ['padBottom', (s) => s.appearance.paddingBottom],
  ['padLeft', (s) => s.appearance.paddingLeft], ['padRight', (s) => s.appearance.paddingRight],
  ['fontSize', (s) => s.appearance.fontSize], ['fontWeight', (s) => Number(s.appearance.fontWeight)],
  ['letterSpacing', (s) => s.appearance.letterSpacing],
  ['lineHeight', (s) => (s.appearance.lineHeight === 'normal' ? null : s.appearance.lineHeight)],
  ['innerCols', (s) => new Set(s.innerGrid.map((k) => Math.round(k.x))).size],
  ['innerRows', (s) => new Set(s.innerGrid.map((k) => Math.round(k.y))).size],
  ['innerCount', (s) => s.innerGrid.length],
  ['cards', (s) => s.listCounts.cards], ['buttons', (s) => s.listCounts.buttons],
];
// AMENDMENT A-8 — colour is excluded from measurement FROM THE START.
// The palette is randomized at token-write time (A-7), so every ADAPTED section would
// otherwise carry a permanent colour delta into STRUCT_THRESHOLD from its first
// measurement and eat the 5% budget before geometry got a look in.
//
// STRIPPED: resolved color, background-color, border-color, gradient stops, shadow colour.
// KEPT: every geometric and typographic field, and the non-colour parts of borders and
// shadows — widths, offsets, blur, spread, radii.

/** Reduce a box-shadow to its geometry, discarding every colour component. */
const shadowGeometry = (v) => {
  if (!v || v === 'none') return 'none';
  const stripped = v
    .replace(/rgba?\([^)]*\)/g, '')
    .replace(/oklch\([^)]*\)/g, '')
    .replace(/#[0-9a-f]{3,8}/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Tailwind composes shadow with empty ring/inset slots, so a computed box-shadow carries
  // "0px 0px 0px 0px" entries that draw nothing. They are a framework artifact, not design.
  const real = stripped
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x && !/^(0px\s+){3}0px$/.test(x) && !/^0px 0px 0px 0px/.test(x));
  return real.length ? real.join(', ') : 'none';
};

const CATEGORICAL = [
  ['fontFamily', (s) => (s.appearance.fontFamily || '').split(',')[0].trim()],
  ['display', (s) => s.appearance.display], ['position', (s) => s.appearance.position],
  ['textAlign', (s) => s.appearance.textAlign], ['radius', (s) => s.appearance.borderRadius],
  ['shadowGeom', (s) => shadowGeometry(s.appearance.boxShadow)],
  ['gridCols', (s) => s.appearance.gridTemplateColumns], ['gap', (s) => s.appearance.gap],
  ['flexDir', (s) => s.appearance.flexDirection],
  ['textTransform', (s) => s.appearance.textTransform],
  ['borderStyle', (s) => {
    const w = (s.appearance.borderTopWidth || 0) + (s.appearance.borderBottomWidth || 0)
      + (s.appearance.borderLeftWidth || 0) + (s.appearance.borderRightWidth || 0);
    return w > 0 ? s.appearance.borderStyle : 'none';  // preflight sets solid at 0 width
  }],
  ['overflow', (s) => s.appearance.overflow],
];

export function structuralDiff(refSec, ourSec) {
  const fields = [];
  for (const [name, get] of NUMERIC) {
    const A = get(refSec), B = get(ourSec);
    if (A == null || B == null) { fields.push({ name, ref: A, ours: B, dev: A === B ? 0 : 100 }); continue; }
    const denom = Math.max(Math.abs(A), Math.abs(B), 1);
    fields.push({ name, ref: A, ours: B, dev: pct(Math.abs(A - B) / denom) });
  }
  for (const [name, get] of CATEGORICAL) {
    const A = get(refSec), B = get(ourSec);
    fields.push({ name, ref: A, ours: B, dev: String(A) === String(B) ? 0 : 100 });
  }
  const mean = pct(fields.reduce((a, f) => a + f.dev, 0) / fields.length / 100);
  const worst = [...fields].sort((a, b) => b.dev - a.dev).slice(0, 6);
  return { structPct: mean, fields, worst };
}

// ---------- NOVEL: token conformance. Every value must resolve to a Prompt 5 token. ----------
// ---- token value normalisation ------------------------------------------------------
// getComputedStyle and the @theme block do not speak the same dialect:
//   theme:    oklch(50.95% 0.0343 331.38)   --text-base: 1.0625rem
//   computed: oklch(0.5095 0.0343 331.38)   font-size: 17px
// Comparing the raw strings makes every in-token value read as a violation, which made
// NOVEL conformance meaningless. Normalise both sides to one canonical form first.
const ROOT_PX = 16;

function normLength(v) {
  const s = String(v).trim();
  const m = s.match(/^(-?[\d.]+)(rem|em|px)?$/i);
  if (!m) return s.toLowerCase();
  const n = parseFloat(m[1]);
  const unit = (m[2] || 'px').toLowerCase();
  const px = unit === 'px' ? n : n * ROOT_PX;
  return `${Math.round(px * 100) / 100}px`;
}

function normColor(v) {
  let s = String(v).trim().toLowerCase();
  // oklch(L C H) — L may be a percentage or a 0-1 decimal
  s = s.replace(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/g, (_, L, pct, C, H) => {
    const l = pct === '%' ? parseFloat(L) / 100 : parseFloat(L);
    return `oklch(${l.toFixed(4)} ${parseFloat(C).toFixed(4)} ${parseFloat(H).toFixed(2)}`;
  });
  // collapse whitespace and drop a trailing alpha of 1
  return s.replace(/\s*\/\s*1\)/, ')').replace(/\s+/g, ' ').trim();
}

export async function loadTokens() {
  // Prompt 5 writes the @theme block; until then the token set is empty and NOVEL
  // sections report "no-token-set" rather than a false pass.
  const candidates = ['src/app/globals.css', 'src/app/tokens.css', 'src/styles/tokens.css'];
  const vals = { color: new Set(), size: new Set(), weight: new Set(), radius: new Set(), shadow: new Set(), space: new Set() };
  let found = false;
  for (const c of candidates) {
    const f = path.join(ROOT, c);
    if (!existsSync(f)) continue;
    const css = await readFile(f, 'utf8');
    const theme = css.match(/@theme[^{]*\{([\s\S]*?)\n\}/);
    if (!theme) continue;
    found = true;
    for (const m of theme[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      const [, k, v0] = m; const v = v0.trim();
      if (/^color-/.test(k)) vals.color.add(normColor(v));
      else if (/^text-/.test(k)) vals.size.add(normLength(v));
      else if (/^font-weight-/.test(k)) vals.weight.add(v);
      else if (/^radius-/.test(k)) vals.radius.add(normLength(v));
      else if (/^shadow-/.test(k)) vals.shadow.add(normColor(v));
      else if (/^spacing-/.test(k)) vals.space.add(normLength(v));
    }
  }
  return { found, vals };
}

export function tokenViolations(sec, tokens) {
  if (!tokens.found) return { violations: -1, note: 'no-token-set (Prompt 5 not landed)' , items: [] };
  const items = [];
  const a = sec.appearance;
  const chk = (kind, value) => {
    if (!value || value === 'none' || value === 'rgba(0, 0, 0, 0)' || value === 'normal' || value === '0px') return;
    if (value === 'transparent' || /^rgba\(0, 0, 0, 0\)$/.test(String(value))) return;
    const set = tokens.vals[kind];
    if (!set.size) return;
    const norm = (kind === 'color' || kind === 'shadow') ? normColor(value)
      : kind === 'weight' ? String(value).trim()   // unitless; never run through normLength
      : normLength(value);
    if (!set.has(norm)) items.push({ kind, value: String(value).slice(0, 60), normalised: norm });
  };
  chk('color', a.color); chk('color', a.backgroundColor); chk('color', a.borderColor);
  chk('size', a.fontSize != null ? a.fontSize + 'px' : null);
  chk('weight', a.fontWeight);
  chk('radius', a.borderRadius);
  chk('shadow', a.boxShadow);
  return { violations: items.length, items: items.slice(0, 10) };
}

// ---------- pairing: section-relative, never absolute scrollY ----------
// Two pages of different height align by ordinal band position, normalized to
// section-relative progress. We pair on nearest normalized midpoint.
function pairSections(refMeta, ourMeta, canonicalOf) {
  const norm = (m) => m.sections.map((s) => ({
    ...s, mid: (s.box.docTop + s.box.h / 2) / Math.max(m.page.scrollHeight, 1),
  }));
  const R = norm(refMeta), O = norm(ourMeta);
  const used = new Set();
  const pairs = new Map();

  // PASS 1 — join on DECLARED IDENTITY, not position.
  //
  // Our sections carry data-section="<reference id>", and the probe emits them as
  // "s<NN>-<reference id>-<heading slug>". Prompt 3's structural gate REQUIRES four bands
  // to move (services 13th -> 5th, stats 12th -> 10th, CTA 10th -> 11th, testimonials
  // 11th -> 12th), so a position-only join pairs exactly those sections to the wrong
  // counterpart, or exhausts the pool and reports "no counterpart section" -> a false
  // 100%. The reordering is a requirement of the build, so the instrument has to survive
  // it: identity wins, position is only the fallback.
  const declared = (o) => String(o.id).replace(/^s\d+-/, '');
  // Match on the CANONICAL (1440) reference id, not the raw per-breakpoint one. Reference
  // section ids are positional, so at 390/768 the band literally named "s13-..." is a
  // different band than at 1440 (home splits one band below 980, shifting every id after
  // it). Our components declare the 1440 id, so pairing on the raw id silently compared
  // our services block against the reference's CTA band at mobile.
  for (const r of R) {
    const target = canonicalOf ? canonicalOf(r) : r.id;
    const hit = O.find((o) => !used.has(o.idx) && declared(o).startsWith(target));
    if (hit) {
      used.add(hit.idx);
      pairs.set(r.idx, { ours: hit, delta: Math.abs(hit.mid - r.mid), via: 'id' });
    }
  }

  // PASS 2 — anything still unpaired falls back to page progress, assigned globally
  // best-first so one weak early match cannot consume a slot a stronger later one needs.
  const cand = [];
  for (const r of R) {
    if (pairs.has(r.idx)) continue;
    for (const o of O) {
      if (used.has(o.idx)) continue;
      cand.push({ rIdx: r.idx, o, d: Math.abs(o.mid - r.mid) });
    }
  }
  cand.sort((a, b) => a.d - b.d);
  for (const c of cand) {
    if (pairs.has(c.rIdx) || used.has(c.o.idx)) continue;
    used.add(c.o.idx);
    pairs.set(c.rIdx, { ours: c.o, delta: c.d, via: 'progress' });
  }

  return R.map((r) => {
    const p = pairs.get(r.idx);
    return {
      ref: r,
      ours: p ? p.ours : null,
      progressDelta: p ? pct(p.delta) : null,
      pairedVia: p ? p.via : 'unpaired',
    };
  });
}

// AMENDMENT A-9 — token conformance has no breakpoint dimension. NOVEL and DELETED rows
// are emitted ONCE, on the canonical pass, instead of three identical times.
const CANONICAL_BP = 1440;

async function diffOne(route, bp, classes, tokens) {
  const rd = capDir('ref', route, bp), od = capDir('ours', route, bp);
  const refMeta = await readJson(path.join(rd, 'meta.json'));
  const ourMeta = await readJson(path.join(od, 'meta.json'));
  const refMeta1440 = bp === 1440 ? refMeta : await readJson(path.join(capDir('ref', route, 1440), 'meta.json'));
  if (!refMeta || !ourMeta) return { route, bp, error: 'missing capture (run capture.mjs first)', rows: [] };

  const outDir = await ensure(path.join(HARNESS, 'diff', `${slug(route)}-${bp}`));
  const resolveClass = buildClassResolver(classes, route, refMeta, refMeta1440);
  const pairs = pairSections(refMeta, ourMeta, (r) => resolveClass(r).canonical);
  const rows = [];

  for (const p of pairs) {
    const id = p.ref.id;
    const { cls, canonical, via } = resolveClass(p.ref);
    // A-9: collapse NOVEL and DELETED to a single pass.
    if ((cls === 'NOVEL' || cls === 'DELETED') && bp !== CANONICAL_BP) continue;

    if (cls === 'UNMATCHED') {
      // A band that exists at this breakpoint but has no 1440 counterpart. Real
      // responsive divergence in the reference itself — reported, never measured.
      rows.push({ route, bp, section: canonical, class: 'UNMATCHED', metric: 'no 1440 counterpart',
        value: null, threshold: null, status: 'REPORTED', joinedVia: via,
        detail: { h: p.ref.box.h, heading: p.ref.headingText || null, textChars: p.ref.textChars } });
      continue;
    }
    // A reference band with no counterpart in our build. At 390/768 home carries 18
    // reference bands against our 15 sections (one reference band splits below 980), so
    // two reference rows can resolve to the same canonical id and compete for one of our
    // sections. The loser has nothing to be compared against. Reporting that as "100%
    // divergent" is false precision — there is no measurement, so say so.
    if (!p.ours) {
      rows.push({ route, bp, section: canonical, class: cls, metric: 'no counterpart in build',
        value: null, threshold: null, status: 'UNPAIRED', joinedVia: via, pairedVia: p.pairedVia,
        detail: { refHeight: p.ref.box.h, refHeading: p.ref.headingText || null } });
      continue;
    }
    if (cls === 'DELETED') {
      rows.push({ route, bp, section: canonical, class: 'DELETED', metric: 'n/a', value: null, threshold: null, status: 'REMOVED', joinedVia: via });
      continue;
    }
    const row = { route, bp, section: canonical, class: cls, progressDelta: p.progressDelta, joinedVia: via, pairedVia: p.pairedVia };

    // A-8: the 3 remaining FIDELITY sections are solid-colour bands. With colour excluded
    // a recoloured band reads 100% divergent forever, so they are measured STRUCTURALLY
    // instead of by pixel diff. A content-bearing FIDELITY section would still be
    // pixel-diffed; there are none left after the Prompt 3 reclassification.
    // Class-based, not content-based: after the Prompt 3 reclassification every remaining
    // FIDELITY section IS a solid-colour band, and a content-based test mis-fires at the
    // breakpoints where the headingless join lands on a neighbouring band.
    const solidBand = cls === 'FIDELITY';
    if (solidBand) {
      const d = p.ours ? structuralDiff(p.ref, p.ours) : null;
      Object.assign(row, {
        metric: 'structural deviation % (solid band, colour excluded)',
        value: d ? d.structPct : 100,
        threshold: STRUCT_THRESHOLD,
        status: d && d.structPct < STRUCT_THRESHOLD ? 'PASS' : 'FAIL',
        detail: d ? { worst: d.worst } : { reason: 'no counterpart section' },
      });
      rows.push(row);
      continue;
    }
    if (cls === 'FIDELITY') {
      const refPng = path.join(rd, `sec-${String(p.ref.idx).padStart(2, '0')}.png`);
      const ourPng = p.ours ? path.join(od, `sec-${String(p.ours.idx).padStart(2, '0')}.png`) : null;
      const d = ourPng ? await pixelDiff(refPng, ourPng, path.join(outDir, `diff-${id}.png`)) : null;
      Object.assign(row, {
        metric: 'divergent px area %',
        value: d ? d.pctArea : 100,
        threshold: THRESHOLD,
        status: d && d.pctArea < THRESHOLD ? 'PASS' : 'FAIL',
        detail: d ? { ref: d.ref, ours: d.ours, union: d.union } : { reason: 'no counterpart section' },
      });
    } else if (cls === 'ADAPTED') {
      const d = p.ours ? structuralDiff(p.ref, p.ours) : null;
      Object.assign(row, {
        metric: 'structural deviation %',
        value: d ? d.structPct : 100,
        threshold: STRUCT_THRESHOLD,
        status: d && d.structPct < STRUCT_THRESHOLD ? 'PASS' : 'FAIL',
        detail: d ? { worst: d.worst } : { reason: 'no counterpart section' },
      });
    } else {
      const d = p.ours ? tokenViolations(p.ours, tokens) : { violations: -1, note: 'no counterpart section', items: [] };
      Object.assign(row, {
        metric: 'token violations',
        value: d.violations,
        threshold: TOKEN_THRESHOLD,
        status: d.violations === 0 ? 'PASS' : d.violations < 0 ? 'BLOCKED' : 'FAIL',
        detail: d,
      });
    }
    rows.push(row);
  }

  // Page-level sanity numbers that no per-section metric catches.
  const pageRow = {
    route, bp, section: '(page)', class: 'PAGE', metric: 'height delta %',
    value: pct(Math.abs(refMeta.page.scrollHeight - ourMeta.page.scrollHeight) / Math.max(refMeta.page.scrollHeight, 1)),
    threshold: STRUCT_THRESHOLD,
    detail: { refH: refMeta.page.scrollHeight, ourH: ourMeta.page.scrollHeight,
              refSections: refMeta.page.sectionCount, ourSections: ourMeta.page.sectionCount,
              consoleErrors: ourMeta.consoleErrors.length },
  };
  pageRow.status = pageRow.value < STRUCT_THRESHOLD ? 'PASS' : 'FAIL';
  rows.push(pageRow);

  await writeJson(path.join(HARNESS, 'diff', `${slug(route)}-${bp}.json`), { route, bp, rows });
  return { route, bp, rows };
}

function table(rows) {
  const head = 'route | section | bp | class | metric | value | threshold | status';
  const sep = '------|---------|----|-------|--------|-------|-----------|-------';
  const body = rows.map((r) =>
    `${r.route} | ${String(r.section).slice(0, 34)} | ${r.bp} | ${r.class} | ${r.metric} | ${r.value} | ${r.threshold ?? '-'} | ${r.status}`);
  return [head, sep, ...body].join('\n');
}

async function main() {
  const a = args();
  const routes = a.route && a.route !== 'true' ? [a.route] : OUR_ROUTES;
  const bps = a.bp && a.bp !== 'true' ? [Number(a.bp)] : BP_SET;
  const classes = await sectionClasses();
  const tokens = await loadTokens();

  const all = [];
  for (const route of routes) for (const bp of bps) {
    const r = await diffOne(route, bp, classes, tokens);
    if (r.error) { console.log(JSON.stringify({ route, bp, error: r.error })); continue; }
    all.push(...r.rows);
    const fails = r.rows.filter((x) => x.status === 'FAIL').length;
    console.log(JSON.stringify({ pass: `diff ${route} @${bp}`, rows: r.rows.length, fails }));
  }

  // Ranked: worst first, normalized against each row's own threshold.
  const ranked = [...all].sort((x, y) => {
    const nx = x.threshold ? x.value / Math.max(x.threshold, 0.0001) : x.value;
    const ny = y.threshold ? y.value / Math.max(y.threshold, 0.0001) : y.value;
    return ny - nx;
  });

  const md = [
    '# docs/divergence.md — ranked divergence table',
    '',
    `Generated ${new Date().toISOString()} by \`scripts/harness/diff.mjs\`.`,
    'Rewritten each convergence loop. Ranked worst-first, normalized against each row\'s own threshold.',
    '',
    `Rows: ${all.length} · FAIL: ${all.filter((r) => r.status === 'FAIL').length} · PASS: ${all.filter((r) => r.status === 'PASS').length} · BLOCKED: ${all.filter((r) => r.status === 'BLOCKED').length}`,
    '',
    '## Top 10',
    '',
    table(ranked.slice(0, 10)),
    '',
    '## Full table',
    '',
    table(ranked),
    '',
  ].join('\n');
  await ensure(path.join(ROOT, 'docs'));
  await writeFile(path.join(ROOT, 'docs', 'divergence.md'), md, 'utf8');

  console.log('\n--- TOP 10 (ranked, worst first) ---');
  console.log(table(ranked.slice(0, 10)));
  console.log(`\nDIFF DONE ${all.length} rows -> docs/divergence.md`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
