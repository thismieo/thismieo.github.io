import { webkit } from 'playwright';

const ORIGIN = 'http://127.0.0.1:4173';
const methods = [
  'window-object',
  'window-legacy',
  'document-element',
  'body',
  'scrolling-element',
  'scroll-by',
  'scroll-into-view',
];

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

const runMethod = async (browser, method) => {
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

  await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
  await page.waitForFunction(() => {
    const slot = document.querySelector('[data-practice-slot="featured"]');
    return slot && !slot.hidden;
  });

  // Let the opened subtree finish committing to the document before testing a
  // single root-scroller primitive. This diagnostic does not alter production.
  await page.waitForTimeout(220);

  const before = await page.evaluate(() => {
    const controls = document.querySelector('[data-practice-explorer="featured"] .practice-swipe-controls');
    const top = controls?.getBoundingClientRect().top ?? null;
    const desiredTop = 18;
    return {
      scrollY: window.scrollY,
      controlsTop: top,
      target: top === null ? null : window.scrollY + top - desiredTop,
      scrollHeight: document.documentElement.scrollHeight,
      htmlScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      scrollingElement: document.scrollingElement?.tagName || null,
      scrollingElementTop: document.scrollingElement?.scrollTop ?? null,
      htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      activeElement: document.activeElement?.tagName || null,
    };
  });

  await page.evaluate(({ method, target }) => {
    const controls = document.querySelector('[data-practice-explorer="featured"] .practice-swipe-controls');
    const delta = target - window.scrollY;
    switch (method) {
      case 'window-object':
        window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        break;
      case 'window-legacy':
        window.scrollTo(0, target);
        break;
      case 'document-element':
        document.documentElement.scrollTop = target;
        break;
      case 'body':
        document.body.scrollTop = target;
        break;
      case 'scrolling-element':
        if (document.scrollingElement) document.scrollingElement.scrollTop = target;
        break;
      case 'scroll-by':
        window.scrollBy(0, delta);
        break;
      case 'scroll-into-view':
        if (controls) {
          controls.style.scrollMarginTop = '18px';
          controls.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'auto' });
        }
        break;
    }
  }, { method, target: before.target });

  await page.waitForTimeout(120);
  const after = await page.evaluate(() => {
    const controls = document.querySelector('[data-practice-explorer="featured"] .practice-swipe-controls');
    return {
      scrollY: window.scrollY,
      controlsTop: controls?.getBoundingClientRect().top ?? null,
      scrollHeight: document.documentElement.scrollHeight,
      htmlScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      scrollingElementTop: document.scrollingElement?.scrollTop ?? null,
    };
  });

  await context.close();
  return { method, before, after };
};

const browser = await webkit.launch({ headless: true });
const results = [];
try {
  for (const method of methods) results.push(await runMethod(browser, method));
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
