// Shared harness primitives. Node 22, ESM, no hosted services.
import { chromium } from 'playwright';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const HARNESS = path.join(ROOT, '.harness');
export const PORT = 3101;
export const LOCAL = `http://127.0.0.1:${PORT}`;
export const REFERENCE = 'https://vh1roofing.com';

export const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// BP_SET is fixed at three. 430 is captured for geometry only (real-device width,
// phone-call-driven business) and is NOT a diff target — see docs/profile.md.
export const BP_SET = [390, 768, 1440];
export const BP_EXTRA = [430];
export const ALL_BP = [...BP_SET, ...BP_EXTRA].sort((a, b) => a - b);

// Reference page  ->  our route.  Locations pages are DELETED per D-02 and never captured.
export const ROUTE_MAP = {
  '/': '/',
  '/about-vh1/': '/about',
  '/services/': '/services',
  '/contact/': '/contact',
  '/privacy-policy/': '/privacy',
};
export const OUR_ROUTES = ['/', '/about', '/services', '/contact', '/privacy'];
export const refForRoute = (r) =>
  Object.entries(ROUTE_MAP).find(([, v]) => v === r)?.[0] ?? null;

export const slug = (s) => (s === '/' ? 'home' : s.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-'));

export async function ensure(dir) {
  await mkdir(dir, { recursive: true });
  return dir;
}
export async function writeJson(file, data) {
  await ensure(path.dirname(file));
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  return file;
}
export async function readJson(file) {
  if (!existsSync(file)) return null;
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function browser({ headed = false } = {}) {
  return chromium.launch({
    headless: !headed,
    args: ['--disable-blink-features=AutomationControlled', '--force-color-profile=srgb', '--font-render-hinting=none'],
  });
}

export async function newPage(b, width, { height = 900, motion = 'reduce' } = {}) {
  const ctx = await b.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    userAgent: UA,
    locale: 'en-US',
    timezoneId: 'America/Chicago',
    reducedMotion: motion, // deterministic captures; motion is profiled separately
    hasTouch: width < 768,
    isMobile: width < 768,
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(45000);
  return { ctx, page };
}

// Deterministic settle: fonts, lazy images, animation freeze. No scrollTo() stepping.
export async function settle(page, { freeze = true } = {}) {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    // Force every lazy/offscreen asset to commit before we measure.
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += Math.round(window.innerHeight * 0.8)) {
      window.scrollTo(0, y); // eslint-disable-line -- asset warm-up only, not a motion sample
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
  await page.waitForLoadState('networkidle').catch(() => {});
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  if (freeze) {
    await page.addStyleTag({
      content: `*,*::before,*::after{animation-play-state:paused!important;animation-delay:-1ms!important;animation-duration:1ms!important;transition-duration:0s!important;transition-delay:0s!important;caret-color:transparent!important;scroll-behavior:auto!important}`,
    });
  }
  await page.waitForTimeout(200);
}

export function pct(n) { return Math.round(n * 10000) / 100; }
export const summary = (o) => console.log(JSON.stringify(o));
