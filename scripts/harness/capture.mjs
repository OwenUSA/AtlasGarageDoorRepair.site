// STEP B — capture one side, one route, one breakpoint.
//   node scripts/harness/capture.mjs --side ref|ours --route / --bp 1440
// Writes .harness/cap/<side>/<route>-<bp>/{meta.json, page.png, sec-*.png} and prints
// a single summary line. Safe for a subagent: touches only its own output directory.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PROBE } from './probe.mjs';
import {
  HARNESS, REFERENCE, LOCAL, BP_SET, ALL_BP, OUR_ROUTES, refForRoute,
  browser, newPage, settle, writeJson, slug, summary, ensure,
} from './lib.mjs';

export function args(argv = process.argv.slice(2)) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const k = argv[i].slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      o[k] = v;
    }
  }
  return o;
}

export function capDir(side, route, bp) {
  return path.join(HARNESS, 'cap', side, `${slug(route)}-${bp}`);
}

// Section-relative capture: scroll each section into view and clip to its own box.
// Absolute scrollY is meaningless across two pages of different height, so we never use it.
export async function captureSide(b, { side, route, bp, states = true }) {
  const isRef = side === 'ref';
  const target = isRef ? REFERENCE + (refForRoute(route) ?? '/') : LOCAL + route;
  const dir = await ensure(capDir(side, route, bp));
  const { ctx, page } = await newPage(b, bp);

  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message.slice(0, 160)));

  const resp = await page.goto(target, { waitUntil: 'domcontentloaded' });
  const status = resp ? resp.status() : 0;
  await settle(page);

  const data = await page.evaluate(PROBE);

  // Re-resolve the same node list in the page and shoot each section individually.
  await page.evaluate(() => {
    // tag sections so screenshots and metrics reference identical nodes
    window.__secs = [];
  });
  const shots = [];
  for (const sec of data.sections) {
    const name = `sec-${String(sec.idx).padStart(2, '0')}.png`;
    const file = path.join(dir, name);
    try {
      // clip in page coordinates — full-page shot cropped, so no scroll-position artifacts
      await page.screenshot({
        path: file,
        clip: { x: 0, y: sec.box.docTop, width: bp, height: Math.max(1, Math.min(sec.box.h, 8000)) },
        fullPage: true,
        animations: 'disabled',
      });
      shots.push({ idx: sec.idx, id: sec.id, file: name, w: bp, h: Math.round(sec.box.h) });
    } catch (e) {
      shots.push({ idx: sec.idx, id: sec.id, file: null, error: e.message.slice(0, 90) });
    }
  }

  // Interactive state captures — each state is its own reference, not just the default render.
  const stateShots = {};
  if (states) {
    // hover + active on every CTA (skipped below 768 per Appendix A)
    if (bp >= 768) {
      const ctas = await page.$$('a[href^="tel:"], .et_pb_button, button, [class*=btn], [class*=button]');
      const cta = ctas[0];
      if (cta) {
        try {
          stateShots.ctaRest = await cta.evaluate((e) => {
            const s = getComputedStyle(e);
            return { bg: s.backgroundColor, color: s.color, border: s.borderTopColor, transform: s.transform, shadow: s.boxShadow.slice(0, 80) };
          });
          await cta.hover({ timeout: 3000 });
          await page.waitForTimeout(320);
          stateShots.ctaHover = await cta.evaluate((e) => {
            const s = getComputedStyle(e);
            return { bg: s.backgroundColor, color: s.color, border: s.borderTopColor, transform: s.transform, shadow: s.boxShadow.slice(0, 80) };
          });
        } catch { /* not hoverable */ }
      }
    }
    // mobile nav drawer open/closed
    if (bp < 980) {
      const t = await page.$('.mobile_menu_bar, .mobile_nav, [aria-controls][aria-expanded], [class*=menu-toggle], [class*=hamburger], [data-nav-toggle]');
      if (t) {
        try {
          await t.click({ timeout: 3000 });
          await page.waitForTimeout(600);
          stateShots.navOpen = await page.evaluate(() => {
            const m = document.querySelector('.et_mobile_menu, [class*=drawer], [class*=mobile-menu], nav[data-open]');
            const r = m ? m.getBoundingClientRect() : null;
            const s = m ? getComputedStyle(m) : null;
            return {
              present: !!m,
              box: r ? { w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top) } : null,
              display: s ? s.display : null, transform: s ? s.transform : null,
              bg: s ? s.backgroundColor : null,
              items: m ? m.querySelectorAll('li,a').length : 0,
              bodyOverflow: getComputedStyle(document.body).overflow,
              bodyPosition: getComputedStyle(document.body).position,
            };
          });
          await page.screenshot({ path: path.join(dir, 'state-nav-open.png'), animations: 'disabled' });
        } catch { /* ignore */ }
      }
    }
    // sticky header: at-top vs engaged
    const hSel = '#main-header, .et-l--header, header';
    stateShots.headerAtTop = await page.evaluate((sel) => {
      const h = document.querySelector(sel); if (!h) return null;
      const s = getComputedStyle(h), r = h.getBoundingClientRect();
      return { position: s.position, h: Math.round(r.height), top: Math.round(r.top), bg: s.backgroundColor, shadow: s.boxShadow.slice(0, 80), transform: s.transform };
    }, hSel);
    await page.evaluate(() => window.scrollTo(0, Math.min(1200, document.documentElement.scrollHeight)));
    await page.waitForTimeout(500);
    stateShots.headerEngaged = await page.evaluate((sel) => {
      const h = document.querySelector(sel); if (!h) return null;
      const s = getComputedStyle(h), r = h.getBoundingClientRect();
      return { position: s.position, h: Math.round(r.height), top: Math.round(r.top), bg: s.backgroundColor, shadow: s.boxShadow.slice(0, 80), transform: s.transform };
    }, hSel);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);

    // form states: pristine / focused / error / submitted
    const form = await page.$('form');
    if (form) {
      stateShots.form = await page.evaluate(() => {
        const f = document.querySelector('form');
        const first = f.querySelector('input:not([type=hidden]),select,textarea');
        const s = first ? getComputedStyle(first) : null;
        return {
          fields: f.querySelectorAll('input:not([type=hidden]),select,textarea').length,
          firstField: s ? { h: Math.round(first.getBoundingClientRect().height), border: s.borderTopColor, bw: s.borderTopWidth, radius: s.borderRadius, bg: s.backgroundColor, fs: s.fontSize } : null,
        };
      });
      const fld = await page.$('form input:not([type=hidden]), form textarea');
      if (fld) {
        try {
          await fld.focus();
          await page.waitForTimeout(250);
          stateShots.formFocused = await fld.evaluate((e) => {
            const s = getComputedStyle(e);
            return { outline: s.outline, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, border: s.borderTopColor, shadow: s.boxShadow.slice(0, 90) };
          });
        } catch { /* ignore */ }
      }
    }
  }

  const meta = {
    side, route, bp, target, status, consoleErrors: consoleErrors.slice(0, 20),
    capturedAt: new Date().toISOString(),
    ...data, shots, stateShots,
  };
  await writeJson(path.join(dir, 'meta.json'), meta);
  await ctx.close();
  return {
    pass: `${side} ${route} @${bp}`, status,
    height: data.page.scrollHeight, sections: data.page.sectionCount,
    shots: shots.filter((s) => s.file).length, errors: consoleErrors.length,
    dir: path.relative(process.cwd(), dir),
  };
}

async function main() {
  const a = args();
  const routes = a.route && a.route !== 'true' ? [a.route] : OUR_ROUTES;
  const bps = a.bp && a.bp !== 'true' ? [Number(a.bp)] : (a.all ? ALL_BP : BP_SET);
  const sides = a.side && a.side !== 'true' ? [a.side] : ['ref', 'ours'];

  const jobs = [];
  for (const side of sides) for (const route of routes) for (const bp of bps) jobs.push({ side, route, bp });

  const b = await browser();
  const MAX = 2; // hard concurrency cap
  const out = [];
  for (let i = 0; i < jobs.length; i += MAX) {
    const batch = jobs.slice(i, i + MAX);
    const r = await Promise.all(batch.map((j) =>
      captureSide(b, j).catch((e) => ({ pass: `${j.side} ${j.route} @${j.bp}`, error: e.message.slice(0, 140) }))));
    r.forEach((x) => { summary(x); out.push(x); });
  }
  await b.close();
  console.log(`CAPTURE DONE ${out.length} passes`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
