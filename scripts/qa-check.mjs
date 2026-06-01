import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const url = 'http://127.0.0.1:4173';
const outDir = '.gstack/qa-reports/screenshots';
mkdirSync(outDir, { recursive: true });
const issues = [];
const events = [];
const assert = (cond, severity, title, details = {}) => {
  if (!cond) issues.push({ severity, title, details });
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const consoleErrors = [];
page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) consoleErrors.push({ type: msg.type(), text: msg.text() }); });
page.on('pageerror', err => consoleErrors.push({ type: 'pageerror', text: err.message }));
const failedRequests = [];
page.on('requestfailed', req => failedRequests.push({ url: req.url(), failure: req.failure()?.errorText }));

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${outDir}/qa-desktop-initial.png`, fullPage: false });

// Basic content and structure
assert(await page.locator('#hero-title').count() === 1, 'critical', 'Hero title missing or duplicated');
assert((await page.locator('[data-daily-badge]').count()) === 1, 'high', 'Daily mood badge missing');
assert(await page.locator('section.scene').count() === 6, 'critical', 'Expected exactly 6 scenes');
assert(await page.locator('[data-hotspot-button]').count() === 18, 'critical', 'Expected exactly 18 hotspot buttons');
assert(await page.locator('[data-hotspot-card]').count() === 18, 'critical', 'Expected exactly 18 hotspot cards');

// All nav anchors resolve to existing sections
const nav = await page.$$eval('.progress-line a', links => links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })));
for (const item of nav) {
  const exists = await page.locator(item.href).count();
  assert(exists === 1, 'high', `Navigation target missing: ${item.text}`, item);
}

// Check all hotspots: opens exactly one card, aria state updates, close works.
const hotspotCount = await page.locator('[data-hotspot-button]').count();
for (let i = 0; i < hotspotCount; i++) {
  const button = page.locator('[data-hotspot-button]').nth(i);
  await button.scrollIntoViewIfNeeded();
  await button.click();
  const openCards = await page.locator('[data-hotspot-card]:not([hidden])').count();
  const expanded = await button.getAttribute('aria-expanded');
  const controlled = await button.getAttribute('aria-controls');
  const visibleText = controlled ? (await page.locator(`#${controlled}`).innerText()).trim() : '';
  const fullText = controlled ? (await page.locator(`#${controlled}`).evaluate((el) => el.textContent || '')).trim() : '';
  assert(openCards === 1, 'high', `Hotspot ${i + 1} does not leave exactly one card open`, { openCards });
  assert(expanded === 'true', 'high', `Hotspot ${i + 1} aria-expanded not true after click`, { expanded });
  assert(fullText.includes('Технологический слой') && fullText.includes('Микро-пример'), 'medium', `Hotspot ${i + 1} card content incomplete`, { visibleText: visibleText.slice(0, 120), fullText: fullText.slice(0, 160) });
  await page.keyboard.press('Escape');
  const afterEscape = await page.locator('[data-hotspot-card]:not([hidden])').count();
  assert(afterEscape === 0, 'high', `Escape does not close hotspot ${i + 1}`, { afterEscape });
}
await page.screenshot({ path: `${outDir}/qa-desktop-after-hotspots.png`, fullPage: false });

// Check close button path separately.
await page.locator('[data-hotspot-button]').first().click();
await page.locator('[data-hotspot-card]:not([hidden]) [data-close-hotspot]').click();
assert(await page.locator('[data-hotspot-card]:not([hidden])').count() === 0, 'high', 'Hotspot close button does not close card');

// Share fallback path: force no navigator.share, mock clipboard.
await page.evaluate(() => {
  Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  window.__copiedText = null;
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (value) => { window.__copiedText = value; } }, configurable: true });
});
await page.locator('[data-share]').scrollIntoViewIfNeeded();
await page.locator('[data-share]').click();
await page.waitForTimeout(50);
const copied = await page.evaluate(() => window.__copiedText);
const shareText = await page.locator('[data-share]').innerText();
assert(copied?.startsWith(url), 'medium', 'Share fallback did not copy current URL', { copied });
assert(shareText.includes('Ссылка скопирована'), 'low', 'Share button does not show copy confirmation', { shareText });

// Restart link returns to hero.
await page.locator('a.secondary-cta').click();
await page.waitForTimeout(250);
assert((await page.evaluate(() => location.hash)) === '#hero-title', 'medium', 'Restart link does not target hero', { hash: await page.evaluate(() => location.hash) });

// Touch target audit desktop visible + all elements computed.
const undersized = await page.$$eval('a,button', els => els
  .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44) && !e.classList.contains('skip-link'); })
  .map(e => { const r = e.getBoundingClientRect(); return { text: e.textContent.trim(), w: Math.round(r.width), h: Math.round(r.height) }; }));
assert(undersized.length === 0, 'medium', 'Some interactive targets are under 44px', { undersized });

// Mobile checks
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mobileErrors = [];
mobile.on('console', msg => { if (['error', 'warning'].includes(msg.type())) mobileErrors.push({ type: msg.type(), text: msg.text() }); });
mobile.on('pageerror', err => mobileErrors.push({ type: 'pageerror', text: err.message }));
await mobile.goto(url, { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${outDir}/qa-mobile-initial.png`, fullPage: false });
const mobileMetrics = await mobile.evaluate(() => ({
  vw: innerWidth,
  sw: document.documentElement.scrollWidth,
  h1: getComputedStyle(document.querySelector('h1')).fontSize,
  ctaVisible: !!document.elementFromPoint(innerWidth / 2, Math.round(innerHeight * 0.72))?.closest?.('.primary-cta, .hero, main'),
  navOverflow: document.querySelector('.progress-line').scrollWidth > document.querySelector('.progress-line').clientWidth,
  navCanScroll: (() => { const n = document.querySelector('.progress-line'); const old = n.scrollLeft; n.scrollLeft = 100; const moved = n.scrollLeft > old; n.scrollLeft = old; return moved; })(),
}));
assert(mobileMetrics.sw <= mobileMetrics.vw + 2, 'high', 'Mobile page has horizontal overflow', mobileMetrics);
assert(mobileMetrics.navOverflow === mobileMetrics.navCanScroll, 'medium', 'Mobile nav overflow is not scrollable', mobileMetrics);
await mobile.locator('[data-hotspot-button]').first().scrollIntoViewIfNeeded();
await mobile.locator('[data-hotspot-button]').first().tap();
assert(await mobile.locator('[data-hotspot-card]:not([hidden])').count() === 1, 'high', 'Mobile hotspot tap does not open card');
await mobile.screenshot({ path: `${outDir}/qa-mobile-hotspot.png`, fullPage: false });
await mobile.keyboard.press('Escape');
assert(await mobile.locator('[data-hotspot-card]:not([hidden])').count() === 0, 'medium', 'Mobile Escape does not close card');

assert(consoleErrors.length === 0, 'high', 'Desktop console has errors/warnings', { consoleErrors });
assert(mobileErrors.length === 0, 'high', 'Mobile console has errors/warnings', { mobileErrors });
assert(failedRequests.length === 0, 'medium', 'Some network requests failed', { failedRequests });

const result = { url, checkedAt: new Date().toISOString(), issues, consoleErrors, mobileErrors, failedRequests, nav, mobileMetrics, screenshots: [
  `${outDir}/qa-desktop-initial.png`,
  `${outDir}/qa-desktop-after-hotspots.png`,
  `${outDir}/qa-mobile-initial.png`,
  `${outDir}/qa-mobile-hotspot.png`,
] };
writeFileSync('.gstack/qa-reports/qa-result.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
process.exit(issues.some(i => ['critical','high','medium'].includes(i.severity)) ? 1 : 0);
