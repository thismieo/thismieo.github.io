import { webkit } from 'playwright';

const ORIGIN = 'http://127.0.0.1:4173';
const attempts = 5;

const positionCard = async (page) => {
  const target = await page.evaluate(() => {
    const card = document.querySelector('[data-practice-group="featured"]')?.closest('[data-practice-card]');
    if (!card) return null;
    return Math.max(0, window.scrollY + card.getBoundingClientRect().top - 180);
  });
  if (target === null) throw new Error('Featured card missing');
  const start = await page.evaluate(() => window.scrollY);
  const distance = target - start;
  for (let i = 1; i <= 7; i += 1) {
    const p = i / 7;
    const eased = p * p * (3 - 2 * p);
    await page.evaluate((top) => window.scrollTo(0, top), start + distance * eased);
    await page.waitForTimeout(85);
  }
  await page.waitForTimeout(120);
};

const runAttempt = async (browser, attempt) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(`${ORIGIN}/?view=workshop`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-practice-root]');
  await page.waitForTimeout(180);
  await positionCard(page);

  const before = await page.evaluate(() => ({
    scrollY: window.scrollY,
    scrollHeight: document.documentElement.scrollHeight,
  }));

  await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
  await page.waitForFunction(() => {
    const slot = document.querySelector('[data-practice-slot="featured"]');
    return slot && !slot.hidden;
  });
  await page.waitForTimeout(1150);

  const after = await page.evaluate(() => {
    const controls = document.querySelector('[data-practice-explorer="featured"] .practice-swipe-controls');
    const viewport = document.querySelector('[data-practice-explorer="featured"] .practice-carousel-viewport');
    return {
      scrollY: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      controlsTop: controls?.getBoundingClientRect().top ?? null,
      viewportHeight: viewport?.getBoundingClientRect().height ?? null,
    };
  });

  await context.close();
  return {
    attempt,
    before,
    after,
    pass: after.controlsTop !== null && after.controlsTop >= 8 && after.controlsTop <= 36 && after.viewportHeight > 400,
  };
};

const browser = await webkit.launch({ headless: true });
const results = [];
try {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    results.push(await runAttempt(browser, attempt));
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
if (results.some((result) => !result.pass)) process.exit(1);
