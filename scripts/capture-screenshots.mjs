import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const outDir = '/Users/mikhail/.hermes/cache/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await page.screenshot({ path: `${outDir}/one-day-future-design-after-desktop.png`, fullPage: false });

await page.click('[data-hotspot-button]');
await page.screenshot({ path: `${outDir}/one-day-future-design-after-hotspot.png`, fullPage: false });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
await mobile.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await mobile.screenshot({ path: `${outDir}/one-day-future-design-after-mobile.png`, fullPage: false });

await browser.close();
console.log(`${outDir}/one-day-future-design-after-desktop.png`);
console.log(`${outDir}/one-day-future-design-after-hotspot.png`);
console.log(`${outDir}/one-day-future-design-after-mobile.png`);
