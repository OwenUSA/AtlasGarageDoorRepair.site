// Extract reference body copy per section, for the Prompt 3 lexical gate.
// Text only, at 1440. Writes .harness/refcopy.json.
import path from 'node:path';
import { HARNESS, REFERENCE, ROUTE_MAP, browser, newPage, settle, writeJson } from './lib.mjs';

const EXTRACT = () => {
  let n = Array.from(document.querySelectorAll('.et_pb_section'));
  n = n.filter((x) => !n.some((y) => y !== x && y.contains(x)));
  const chrome = Array.from(document.querySelectorAll('#main-header,#top-header,.et-l--footer'));
  const all = [...n, ...chrome]
    .filter((e) => e.getBoundingClientRect().height > 8)
    .sort((a, b) => (a.getBoundingClientRect().top + scrollY) - (b.getBoundingClientRect().top + scrollY));
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  return all.map((el, i) => {
    const h = el.querySelector('h1,h2,h3');
    const heads = Array.from(el.querySelectorAll('h1,h2,h3,h4')).map((x) => clean(x.textContent)).filter(Boolean);
    const paras = Array.from(el.querySelectorAll('p,li')).map((x) => clean(x.textContent)).filter(Boolean);
    const btns = Array.from(el.querySelectorAll('a.et_pb_button,button,.et_pb_button')).map((x) => clean(x.textContent)).filter(Boolean);
    return {
      idx: i,
      heading: clean(h ? h.textContent : ''),
      headings: heads, paragraphs: paras, buttons: btns,
      text: clean(el.textContent),
      chars: clean(el.textContent).length,
      headingChars: heads.join(' ').length,
      bodyChars: paras.join(' ').length,
      h: Math.round(el.getBoundingClientRect().height),
    };
  });
};

const b = await browser();
const out = {};
for (const refPath of Object.keys(ROUTE_MAP)) {
  const { ctx, page } = await newPage(b, 1440);
  await page.goto(REFERENCE + refPath, { waitUntil: 'domcontentloaded' });
  await settle(page);
  out[refPath] = await page.evaluate(EXTRACT);
  console.log(refPath, out[refPath].length, 'sections,', out[refPath].reduce((a, s) => a + s.chars, 0), 'chars');
  await ctx.close();
}
await b.close();
await writeJson(path.join(HARNESS, 'refcopy.json'), out);
console.log('-> .harness/refcopy.json');
