import { chromium, webkit } from 'playwright';

const engines = [
  ['chromium', chromium],
  ['webkit', webkit],
];

const results = [];
let failed = false;

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const [name, engine] of engines) {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  const report = { engine: name };

  try {
    await page.goto('http://127.0.0.1:4173/?view=workshop', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-practice-root]');

    report.initial = await page.evaluate(() => ({
      scrollY: window.scrollY,
      rootNodes: document.querySelector('[data-practice-root]')?.getElementsByTagName('*').length || 0,
      hydrated: [...document.querySelectorAll('[data-code-hydrated="true"]')].length,
    }));

    const openButton = page.locator('[data-practice-group="featured"]');
    const openStart = Date.now();
    await openButton.click();
    await page.waitForFunction(() => {
      const slot = document.querySelector('[data-practice-slot="featured"]');
      return slot && !slot.hidden && slot.getAttribute('aria-hidden') === 'false';
    });
    report.openVisibleMs = Date.now() - openStart;
    await page.waitForTimeout(850);

    report.openGeometry = await page.evaluate(() => {
      const controls = document.querySelector('[data-practice-explorer="featured"] .practice-swipe-controls');
      const viewport = document.querySelector('[data-practice-explorer="featured"] .practice-carousel-viewport');
      const slides = [...document.querySelectorAll('[data-practice-explorer="featured"] .practice-carousel-slide')];
      const c = controls.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      const a = slides[0].getBoundingClientRect();
      const b = slides[1].getBoundingClientRect();
      const relativeLeft = viewport.scrollLeft + a.left - v.left;
      return {
        controlsTop: c.top,
        viewportTop: v.top,
        viewportHeight: v.height,
        viewportWidth: v.width,
        slideWidth: a.width,
        firstLeft: a.left - v.left,
        firstRight: a.right - v.left,
        secondLeft: b.left - v.left,
        gap: b.left - a.right,
        nextPeek: v.right - b.left,
        offsetLeft: slides[0].offsetLeft,
        relativeLeft,
        offsetParentClass: slides[0].offsetParent?.className || slides[0].offsetParent?.tagName || null,
        viewportTouchAction: getComputedStyle(viewport).touchAction,
        slideTouchAction: getComputedStyle(slides[0]).touchAction,
        contentVisibility: getComputedStyle(slides[0]).contentVisibility,
      };
    });

    assert(report.openVisibleMs < 500, `${name}: opening DOM visibility took ${report.openVisibleMs}ms`);
    assert(report.openGeometry.controlsTop >= -2 && report.openGeometry.controlsTop <= 48, `${name}: controls top ${report.openGeometry.controlsTop}px is not near screen start`);
    assert(report.openGeometry.viewportHeight > 250, `${name}: carousel viewport height is unexpectedly small`);
    assert(report.openGeometry.gap >= 6 && report.openGeometry.gap <= 16, `${name}: card gap ${report.openGeometry.gap}px is not clean`);
    assert(report.openGeometry.slideWidth <= report.openGeometry.viewportWidth - 24, `${name}: slide is too wide to reveal neighbour`);
    assert(report.openGeometry.nextPeek >= 3 && report.openGeometry.nextPeek <= 24, `${name}: neighbour peek ${report.openGeometry.nextPeek}px is outside intended range`);

    // Detect coordinate-space errors in carousel centering math.
    report.offsetCoordinateDelta = Math.abs(report.openGeometry.offsetLeft - report.openGeometry.relativeLeft);

    const secondButton = page.locator('[data-practice-explorer="featured"] [data-practice-next]');
    await secondButton.click();
    await page.waitForTimeout(850);
    report.afterNext = await page.evaluate(() => {
      const viewport = document.querySelector('[data-practice-explorer="featured"] .practice-carousel-viewport');
      const slides = [...document.querySelectorAll('[data-practice-explorer="featured"] .practice-carousel-slide')];
      const slide = slides[1];
      const v = viewport.getBoundingClientRect();
      const s = slide.getBoundingClientRect();
      const counter = document.querySelector('[data-practice-explorer="featured"] [data-practice-swipe-counter]')?.textContent?.trim();
      return {
        counter,
        scrollLeft: viewport.scrollLeft,
        centerDelta: Math.abs((s.left + s.width / 2) - (v.left + v.width / 2)),
        activeCurrent: slide.getAttribute('aria-current'),
      };
    });
    assert(report.afterNext.counter === '02 / 05', `${name}: counter did not advance correctly (${report.afterNext.counter})`);
    assert(report.afterNext.centerDelta <= 3, `${name}: second slide is not centered after snap (${report.afterNext.centerDelta}px)`);
    assert(report.afterNext.activeCurrent === 'true', `${name}: second slide aria-current is not true`);

    // Verify vertical page scrolling can start while the pointer is over the carousel.
    const viewportBox = await page.locator('[data-practice-explorer="featured"] .practice-carousel-viewport').boundingBox();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(100);
    await page.mouse.move(viewportBox.x + viewportBox.width / 2, Math.min(viewportBox.y + 120, 700));
    const beforeVertical = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 420);
    await page.waitForTimeout(350);
    const afterVertical = await page.evaluate(() => window.scrollY);
    report.verticalWheelDelta = afterVertical - beforeVertical;
    assert(report.verticalWheelDelta > 80, `${name}: vertical scrolling over carousel is being resisted (${report.verticalWheelDelta}px)`);

    // Re-open/close repeatedly and verify state never gets stuck.
    for (let i = 0; i < 4; i += 1) {
      await openButton.click();
      await page.waitForTimeout(80);
      await openButton.click();
      await page.waitForTimeout(80);
    }
    // Normalize final state closed.
    const expanded = await openButton.getAttribute('aria-expanded');
    if (expanded === 'true') {
      await openButton.click();
      await page.waitForTimeout(120);
    }
    report.finalClosed = await page.evaluate(() => {
      const slot = document.querySelector('[data-practice-slot="featured"]');
      const button = document.querySelector('[data-practice-group="featured"]');
      return { hidden: slot.hidden, ariaHidden: slot.getAttribute('aria-hidden'), expanded: button.getAttribute('aria-expanded') };
    });
    assert(report.finalClosed.hidden && report.finalClosed.ariaHidden === 'true' && report.finalClosed.expanded === 'false', `${name}: repeated open/close left an inconsistent state`);

    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    assert(consoleErrors.length === 0, `${name}: console errors: ${consoleErrors.join(' | ')}`);
    assert(pageErrors.length === 0, `${name}: page errors: ${pageErrors.join(' | ')}`);

    report.status = 'pass';
  } catch (error) {
    failed = true;
    report.status = 'fail';
    report.error = String(error?.stack || error);
  } finally {
    results.push(report);
    await browser.close();
  }
}

console.log(JSON.stringify(results, null, 2));
if (failed) process.exit(1);
