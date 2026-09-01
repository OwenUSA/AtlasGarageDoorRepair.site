// Prompt 3 lexical gate. Runs again in Prompt 11.
//   node scripts/similarity.mjs            full table
//   node scripts/similarity.mjs --json     machine-readable
//
// Two measures, per section:
//   1. shared 5-grams  — our copy vs the ENTIRE reference corpus. Must be 0.
//      Checked corpus-wide, not just against the paired section, so an accidental lift
//      from any other reference page is still caught.
//   2. trigram Jaccard — our copy vs the PAIRED reference section, after stopwords and
//      the industry allowlist are removed. Must be <= 0.15.
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const GRAM_N = 5;
export const TRIGRAM_MAX = 0.15;

// Exempt: avoiding these would produce copy no customer searches for.
export const ALLOWLIST = [
  'garage door', 'torsion spring', 'extension spring', 'opener', 'cable', 'roller',
  'track', 'panel', 'off-track', 'remote', 'keypad', 'sensor', 'weather seal',
  'residential', 'commercial', 'same-day', 'free estimate', 'repair', 'installation',
  'replacement',
];

const STOPWORDS = new Set(`a about above after again against all am an and any are as at be because been
before being below between both but by can cannot could did do does doing down during each few for from
further had has have having he her here hers herself him himself his how i if in into is it its itself
me more most my myself no nor not of off on once only or other ought our ours ourselves out over own
same she should so some such than that the their theirs them themselves then there these they this those
through to too under until up very was we were what when where which while who whom why with would you
your yours yourself yourselves will just dont cant wont thats weve youre isnt its im`.split(/\s+/));

const norm = (s) => String(s || '')
  .toLowerCase()
  .replace(/[‘’ʼ]/g, "'")
  .replace(/[“”]/g, '"')
  .replace(/[–—]/g, ' ')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/[^a-z0-9'\-\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Remove allowlisted phrases as PHRASES, longest first, so an allowlisted span can never
// manufacture a shared n-gram or inflate the Jaccard overlap.
const stripAllowlist = (s) => {
  let out = ' ' + s + ' ';
  for (const term of [...ALLOWLIST].sort((a, b) => b.length - a.length)) {
    const t = norm(term);
    out = out.split(' ' + t + ' ').join(' ');
  }
  return out.replace(/\s+/g, ' ').trim();
};

const words = (s) => s.split(' ').filter(Boolean);

export function ngrams(text, n) {
  const w = words(stripAllowlist(norm(text)));
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}

export function contentTrigrams(text) {
  const w = words(stripAllowlist(norm(text))).filter((t) => !STOPWORDS.has(t));
  const out = new Set();
  for (let i = 0; i + 3 <= w.length; i++) out.add(w.slice(i, i + 3).join(' '));
  return out;
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

// ---- our copy, flattened to one text blob per section ----
// Structural keys are bookkeeping, not copy. Counting them inflates every short section.
const STRUCTURAL_KEYS = new Set(['id', 'refSection', 'cls']);
function flatten(node, acc = []) {
  if (node == null) return acc;
  if (typeof node === 'string') { acc.push(node); return acc; }
  if (Array.isArray(node)) { for (const x of node) flatten(x, acc); return acc; }
  if (typeof node === 'object') {
    for (const k of Object.keys(node)) if (!STRUCTURAL_KEYS.has(k)) flatten(node[k], acc);
    return acc;
  }
  return acc;
}

export async function ourSections() {
  const mod = await import(pathToFileURL(path.join(ROOT, 'content', 'copy.ts')).href);
  const copy = mod.copy ?? mod.default;
  const out = [];
  for (const [route, page] of Object.entries(copy.routes)) {
    for (const sec of page.sections) {
      out.push({
        route, id: sec.id, refSection: sec.refSection ?? null, cls: sec.cls,
        headings: flatten(sec.heading ?? '').concat(flatten(sec.subheading ?? '')),
        text: flatten(sec).join(' '),
      });
    }
    out.push({
      route, id: '(metadata)', refSection: 'metadata', cls: 'ADAPTED',
      headings: [page.meta.title],
      text: `${page.meta.title} ${page.meta.description}`,
    });
  }
  return out;
}

async function refCorpus() {
  const f = path.join(ROOT, '.harness', 'refcopy.json');
  const raw = JSON.parse(await readFile(f, 'utf8'));
  const byRoute = {
    '/': raw['/'], '/about': raw['/about-vh1/'], '/services': raw['/services/'],
    '/contact': raw['/contact/'], '/privacy': raw['/privacy-policy/'],
  };
  const all = Object.values(raw).flat().map((s) => s.text).join(' ');
  return { byRoute, all };
}

// ---- LENGTH-GATE EXEMPTIONS ----
// The +/-10% character rule exists so the layout is still tested against something real.
// Three cases break that assumption, and in each the reference figure is not a target we
// could hit without undoing a decision. They are listed explicitly, with the reason, so
// the Prompt 11 re-run reports them as EXEMPT rather than quietly passing or failing.
export const LENGTH_EXEMPT = {
  '*::s01-main-header':
    'Reference nav is 373 chars because it contains the entire 18-item Locations city tree. D-02 mandates deleting it. Matching the count would mean re-adding content we removed on purpose.',
  '/::s09-we-make-it-easy-to-get-the-job-don':
    'Reference process band carries its five step captions inside PNG artwork, so its extractable text is only 84 chars. Our equivalent must carry the same information as real text (a11y, and the images are placeholders). Character parity here would mean shipping words as pictures.',
  '/contact::s03':
    'Reference figure of 5883 chars is the entire Gravity Forms DOM: every select option, hidden label, consent paragraph and reCAPTCHA notice. Ours is five fields with no captcha, no consent block and no email field (D-03, D-05). The visible copy is comparable; the DOM text is not.',
};

export const exemptReason = (route, section) =>
  LENGTH_EXEMPT[`${route}::${section}`] ?? LENGTH_EXEMPT[`*::${section}`] ?? null;

// map our section id -> reference section index, via docs/sections.md ids (sNN-...)
const refIdx = (refSection) => {
  const m = String(refSection || '').match(/^s(\d+)/);
  return m ? Number(m[1]) : null;
};

export async function run() {
  const ours = await ourSections();
  const ref = await refCorpus();
  const refAll5 = ngrams(ref.all, GRAM_N);

  const rows = [];
  for (const s of ours) {
    const idx = refIdx(s.refSection);
    const refSec = idx != null && ref.byRoute[s.route] ? ref.byRoute[s.route].find((x) => x.idx === idx) : null;
    const refText = refSec ? refSec.text : (s.refSection === 'metadata' ? ref.byRoute[s.route].map((x) => x.text).join(' ') : '');

    const our5 = ngrams(s.text, GRAM_N);
    const shared = [...our5].filter((g) => refAll5.has(g));

    const tri = jaccard(contentTrigrams(s.text), contentTrigrams(refText));

    rows.push({
      route: s.route, section: s.id, cls: s.cls,
      refSection: s.refSection,
      ourChars: s.text.length,
      refChars: refSec ? refSec.chars : null,
      charDeltaPct: refSec ? Math.round(((s.text.length - refSec.chars) / refSec.chars) * 1000) / 10 : null,
      lengthExempt: exemptReason(s.route, s.id),
      shared5: shared.length,
      shared5Examples: shared.slice(0, 3),
      trigram: Math.round(tri * 1000) / 1000,
      pass5: shared.length === 0,
      passTri: tri <= TRIGRAM_MAX,
    });
  }
  return rows;
}

function table(rows) {
  const head = 'route | section | ref | our chars | ref chars | Δ% | 5-grams | trigram | status';
  const sep = '------|---------|-----|-----------|-----------|----|---------|---------|-------';
  const body = rows.map((r) => {
    const ok = r.pass5 && r.passTri;
    return [
      r.route, r.section.slice(0, 26), (r.refSection || '-').slice(0, 22),
      r.ourChars, r.refChars ?? '-',
      r.charDeltaPct == null ? '-' : (r.charDeltaPct > 0 ? '+' : '') + r.charDeltaPct,
      r.shared5, r.trigram.toFixed(3),
      (ok ? 'PASS' : [!r.pass5 ? '5GRAM' : null, !r.passTri ? 'TRIGRAM' : null].filter(Boolean).join('+'))
        + (r.lengthExempt ? ' (len exempt)' : (r.charDeltaPct != null && Math.abs(r.charDeltaPct) > 10 ? ' (LEN)' : '')),
    ].join(' | ');
  });
  return [head, sep, ...body].join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rows = await run();
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    console.log(table(rows));
    const fails = rows.filter((r) => !r.pass5 || !r.passTri);
    const measured = rows.filter((r) => r.charDeltaPct != null && !r.lengthExempt);
    const charFails = measured.filter((r) => Math.abs(r.charDeltaPct) > 10);
    const exempt = rows.filter((r) => r.lengthExempt);
    console.log(`\nsections: ${rows.length}`);
    console.log(`5-gram gate  : ${rows.filter((r) => r.pass5).length}/${rows.length} pass (zero shared 5-grams with the entire reference corpus)`);
    console.log(`trigram gate : ${rows.filter((r) => r.passTri).length}/${rows.length} pass (Jaccard <= ${TRIGRAM_MAX} vs paired section)`);
    console.log(`length gate  : ${measured.length - charFails.length}/${measured.length} measured sections within +/-10% (${exempt.length} exempt, see LENGTH_EXEMPT)`);
    if (charFails.length) console.log('  outside +/-10%: ' + charFails.map((r) => `${r.route}:${r.section}(${r.charDeltaPct > 0 ? '+' : ''}${r.charDeltaPct}%)`).join(', '));
    if (exempt.length) {
      console.log('  exempt:');
      for (const e of exempt) console.log(`    ${e.route}:${e.section} (${e.charDeltaPct > 0 ? '+' : ''}${e.charDeltaPct}%) — ${e.lengthExempt.slice(0, 96)}...`);
    }
    if (fails.length) {
      console.log('\nFAILING:');
      for (const f of fails) {
        console.log(`  ${f.route} ${f.section}: 5grams=${f.shared5} trigram=${f.trigram}`);
        if (f.shared5Examples.length) console.log('     shared: ' + f.shared5Examples.map((x) => `"${x}"`).join(', '));
      }
      process.exitCode = 1;
    }
  }
}
