// Instrument self-test. Proves the ADAPTED structural comparator and the NOVEL token
// checker compute real numbers — not just "no counterpart" against an empty scaffold.
// Runs reference-vs-reference so both sides have real sections.
import { readFile } from 'node:fs/promises';
import { structuralDiff, tokenViolations, loadTokens } from './diff.mjs';

const a = JSON.parse(await readFile('.harness/cap/ref/about-1440/meta.json', 'utf8'));
const b = JSON.parse(await readFile('.harness/cap/ref/about-768/meta.json', 'utf8'));

const s1 = a.sections.find((s) => s.id.includes('our-mission'));
const s2 = b.sections.find((s) => s.id.includes('our-mission'));

console.log('=== ADAPTED structural comparator — /about s05-our-mission, 1440 vs 768 ===');
const d = structuralDiff(s1, s2);
console.log('structural deviation =', d.structPct + '%   (threshold 5%)');
console.log('fields compared      =', d.fields.length, '(numeric + categorical; colour fields stripped per A-8)');
console.log('worst fields:');
for (const w of d.worst) {
  console.log('   ' + w.name.padEnd(14),
    'ref=' + String(w.ref).slice(0, 26).padEnd(28),
    'ours=' + String(w.ours).slice(0, 26).padEnd(28),
    'dev=' + w.dev + '%');
}

console.log('\n=== comparator sanity — identical sections must read 0% ===');
console.log('structuralDiff(s05, s05) =', structuralDiff(s1, s1).structPct + '%');

console.log('\n=== NOVEL token checker ===');
const real = await loadTokens();
console.log('token set present in repo:', real.found,
  '-> NOVEL rows report BLOCKED/no-token-set rather than a false pass (Prompt 5 not landed)');

const strict = { found: true, vals: {
  color: new Set(['rgb(255, 255, 255)']), size: new Set(['17px']), weight: new Set(['400']),
  radius: new Set(['0px']), shadow: new Set(), space: new Set(),
} };
const v = tokenViolations(s1, strict);
console.log('violations vs a deliberately-wrong token set =', v.violations, '(threshold 0)');
console.log('offending values:', JSON.stringify(v.items.slice(0, 4)));

const ap = s1.appearance;
const conformant = { found: true, vals: {
  color: new Set([ap.color, ap.backgroundColor, ap.borderColor].map((c) => String(c).toLowerCase())),
  size: new Set([ap.fontSize + 'px']), weight: new Set([String(ap.fontWeight)]),
  radius: new Set([ap.borderRadius]), shadow: new Set([ap.boxShadow]), space: new Set(),
} };
console.log('violations vs a conformant token set        =', tokenViolations(s1, conformant).violations);
