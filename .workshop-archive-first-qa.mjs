import { chromium, webkit } from 'playwright';

const ORIGIN = 'http://127.0.0.1:4173';
const reports = [];
let failed = false;

const humanScrollTo = async (page, selector, desiredTop = 170) => {
  const target = await page.evaluate(({ selector, desiredTop }) => {
    const el = document.querySelector(selector);
    const card = el?.closest('[data-practice-card]');
    if (!card) return null;
    return Math.max(0, window.scrollY + card.getBoundingClientRect().top - desiredTop);
  }, { selector, desiredTop });
  if (target === null) throw new Error(`missing ${selector}`);
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

const touch = async (page, selector) => {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`no touch box for ${selector}`);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
};

for (const [engineName, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const report = { engine: engineName, suite: 'archive-first-natural-touch', issues: [] };
  const check = (value, message) => { if (!value) report.issues.push(message); };
  try {
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const opener = [...document.querySelectorAll('[data-open-workshop]')].find((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      opener?.scrollIntoView({ block: 'center', behavior: 'auto' });
      opener?.click();
    });
    await page.waitForFunction(() => document.documentElement.classList.contains('workshop-open') && !document.querySelector('[data-workshop-view]')?.hidden);
    await page.waitForTimeout(1250);

    await humanScrollTo(page, '[data-practice-group="archive"]');
    const started = Date.now();
    await touch(page, '[data-practice-group="archive"]');
    await page.waitForFunction(() => {
      const slot = document.querySelector('[data-practice-slot="archive"]');
      return slot && !slot.hidden && slot.getAttribute('aria-hidden') === 'false';
    });
    report.openVisibleMs = Date.now() - started;
    await page.waitForTimeout(720);

    report.geometry = await page.evaluate(() => {
      const explorer = document.querySelector('[data-practice-explorer="archive"]');
      const controls = explorer.querySelector('.practice-swipe-controls');
      const viewport = explorer.querySelector('.practice-carousel-viewport');
      const slides = [...explorer.querySelectorAll('.practice-carousel-slide')];
      const v = viewport.getBoundingClientRect();
      const a = slides[0].getBoundingClientRect();
      const b = slides[1].getBoundingClientRect();
      return {
        controlsTop: controls.getBoundingClientRect().top,
        viewportHeight: v.height,
        viewportWidth: v.width,
        slideWidth: a.width,
        gap: b.left - a.right,
        peek: v.right - b.left,
        counter: explorer.querySelector('[data-practice-swipe-counter]')?.textContent?.trim(),
        touchAction: getComputedStyle(viewport).touchAction,
      };
    });

    check(report.openVisibleMs < 250, `${engineName}: Archive-first touch opening took ${report.openVisibleMs}ms`);
    check(report.geometry.controlsTop >= -2 && report.geometry.controlsTop <= 55, `${engineName}: Archive-first controls top ${report.geometry.controlsTop}px`);
    check(report.geometry.viewportHeight > 350, `${engineName}: Archive-first height ${report.geometry.viewportHeight}px`);
    check(report.geometry.gap >= 8 && report.geometry.gap <= 12, `${engineName}: Archive-first gap ${report.geometry.gap}px`);
    check(report.geometry.peek >= 4 && report.geometry.peek <= 16, `${engineName}: Archive-first peek ${report.geometry.peek}px`);
    check(report.geometry.counter === '01 / 07', `${engineName}: Archive-first counter ${report.geometry.counter}`);
    check(report.geometry.touchAction.includes('pan-y'), `${engineName}: Archive-first vertical touch is not allowed`);
  } catch (error) {
    report.issues.push(String(error?.stack || error));
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    reports.push(report);
    await browser.close();
  }
}

console.log(JSON.stringify(reports, null, 2));
if (failed) process.exit(1);
