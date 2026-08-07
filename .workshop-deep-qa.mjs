import { chromium, webkit } from 'playwright';

const engines = [['chromium', chromium], ['webkit', webkit]];
const results = [];
let failed = false;

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
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !/cloudflare|beacon/i.test(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));

  const report = { engine: name, issues: [] };
  const check = (condition, message) => { if (!condition) report.issues.push(message); };

  try {
    await page.goto('http://127.0.0.1:4173/?view=workshop', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-practice-root]');

    report.initial = await page.evaluate(() => ({
      rootNodes: document.querySelector('[data-practice-root]')?.getElementsByTagName('*').length || 0,
      hydrated: [...document.querySelectorAll('[data-code-hydrated="true"]')].length,
    }));
    check(report.initial.hydrated <= 2, `${name}: too many syntax-highlighted slides are hydrated before opening (${report.initial.hydrated})`);

    const openButton = page.locator('[data-practice-group="featured"]');
    await openButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);

    const openStart = Date.now();
    await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
    await page.waitForFunction(() => {
      const slot = document.querySelector('[data-practice-slot="featured"]');
      return slot && !slot.hidden && slot.getAttribute('aria-hidden') === 'false';
    });
    report.openVisibleMs = Date.now() - openStart;
    await page.waitForTimeout(950);

    report.openGeometry = await page.evaluate(() => {
      const explorer = document.querySelector('[data-practice-explorer="featured"]');
      const controls = explorer.querySelector('.practice-swipe-controls');
      const viewport = explorer.querySelector('.practice-carousel-viewport');
      const slides = [...explorer.querySelectorAll('.practice-carousel-slide')];
      const c = controls.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      const a = slides[0].getBoundingClientRect();
      const b = slides[1].getBoundingClientRect();
      return {
        controlsTop: c.top,
        viewportTop: v.top,
        viewportHeight: v.height,
        viewportWidth: v.width,
        slideWidth: a.width,
        firstLeft: a.left - v.left,
        gap: b.left - a.right,
        nextPeek: v.right - b.left,
        viewportTouchAction: getComputedStyle(viewport).touchAction,
        slideTouchAction: getComputedStyle(slides[0]).touchAction,
        contentVisibility: getComputedStyle(slides[0]).contentVisibility,
        hydrated: slides.filter((slide) => slide.dataset.codeHydrated === 'true').length,
      };
    });

    check(report.openVisibleMs < 180, `${name}: open state visibility took ${report.openVisibleMs}ms`);
    check(report.openGeometry.controlsTop >= -2 && report.openGeometry.controlsTop <= 55, `${name}: controls stop at ${report.openGeometry.controlsTop}px instead of near the screen start`);
    check(report.openGeometry.viewportHeight > 400, `${name}: active carousel height is only ${report.openGeometry.viewportHeight}px`);
    check(report.openGeometry.gap >= 8 && report.openGeometry.gap <= 12, `${name}: card gap is ${report.openGeometry.gap}px`);
    check(report.openGeometry.slideWidth >= report.openGeometry.viewportWidth - 44 && report.openGeometry.slideWidth <= report.openGeometry.viewportWidth - 28, `${name}: slide width ${report.openGeometry.slideWidth}px is not the intended framed width`);
    check(report.openGeometry.nextPeek >= 4 && report.openGeometry.nextPeek <= 16, `${name}: neighbour peek is ${report.openGeometry.nextPeek}px`);
    check(report.openGeometry.contentVisibility !== 'auto', `${name}: content-visibility:auto is still active on carousel slides`);

    const next = page.locator('[data-practice-explorer="featured"] [data-practice-next]');
    await next.click();
    await page.waitForTimeout(900);
    report.afterNext = await page.evaluate(() => {
      const explorer = document.querySelector('[data-practice-explorer="featured"]');
      const viewport = explorer.querySelector('.practice-carousel-viewport');
      const slides = [...explorer.querySelectorAll('.practice-carousel-slide')];
      const slide = slides[1];
      const v = viewport.getBoundingClientRect();
      const s = slide.getBoundingClientRect();
      return {
        counter: explorer.querySelector('[data-practice-swipe-counter]')?.textContent?.trim(),
        centerDelta: Math.abs((s.left + s.width / 2) - (v.left + v.width / 2)),
        activeCurrent: slide.getAttribute('aria-current'),
        activeHidden: slide.getAttribute('aria-hidden'),
        viewportHeight: v.height,
      };
    });
    check(report.afterNext.counter === '02 / 05', `${name}: counter did not advance (${report.afterNext.counter})`);
    check(report.afterNext.centerDelta <= 3, `${name}: second slide center is off by ${report.afterNext.centerDelta}px`);
    check(report.afterNext.activeCurrent === 'true' && report.afterNext.activeHidden === 'false', `${name}: active slide ARIA state is inconsistent`);
    check(report.afterNext.viewportHeight > 400, `${name}: second slide height collapsed to ${report.afterNext.viewportHeight}px`);

    // Vertical page scrolling must remain natural while the pointer is over the carousel.
    const box = await page.locator('[data-practice-explorer="featured"] .practice-carousel-viewport').boundingBox();
    const beforeVertical = await page.evaluate(() => window.scrollY);
    await page.mouse.move(box.x + Math.min(120, box.width / 2), Math.max(10, Math.min(760, box.y + 180)));
    await page.mouse.wheel(0, 420);
    await page.waitForTimeout(350);
    const afterVertical = await page.evaluate(() => window.scrollY);
    report.verticalWheelDelta = afterVertical - beforeVertical;
    check(report.verticalWheelDelta > 80, `${name}: vertical scroll over carousel moved only ${report.verticalWheelDelta}px`);

    // Mock only the clipboard transport so this test isolates feedback ownership.
    await page.evaluate(() => {
      try {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: { writeText: () => Promise.resolve() },
        });
      } catch {}
    });
    const secondCopy = page.locator('[data-practice-explorer="featured"] .practice-carousel-slide').nth(1).locator('[data-practice-copy]');
    await secondCopy.click();
    await page.waitForTimeout(100);
    report.copyStatus = await page.evaluate(() => {
      const slides = [...document.querySelectorAll('[data-practice-explorer="featured"] .practice-carousel-slide')];
      return slides.map((slide) => slide.querySelector('[data-practice-copy-status]')?.textContent?.trim() || '');
    });
    check(report.copyStatus[1] === 'Code copied to clipboard', `${name}: visible slide did not receive copy feedback`);
    check(report.copyStatus[0] === '', `${name}: copy feedback leaked to the first slide`);

    // Close and verify the outer card remains anchored.
    await openButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const beforeCloseTop = await openButton.evaluate((el) => el.closest('[data-practice-card]')?.getBoundingClientRect().top ?? 0);
    await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
    await page.waitForTimeout(120);
    report.close = await page.evaluate((beforeTop) => {
      const slot = document.querySelector('[data-practice-slot="featured"]');
      const button = document.querySelector('[data-practice-group="featured"]');
      const card = button.closest('[data-practice-card]');
      return {
        hidden: slot.hidden,
        ariaHidden: slot.getAttribute('aria-hidden'),
        expanded: button.getAttribute('aria-expanded'),
        anchorShift: Math.abs(card.getBoundingClientRect().top - beforeTop),
      };
    }, beforeCloseTop);
    check(report.close.hidden && report.close.ariaHidden === 'true' && report.close.expanded === 'false', `${name}: close state is inconsistent`);
    check(report.close.anchorShift <= 2, `${name}: closing shifted the outer card by ${report.close.anchorShift}px`);

    // Stress quick open/close; no stale smooth-scroll or stuck slot may remain.
    for (let i = 0; i < 4; i += 1) {
      await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
      await page.waitForTimeout(45);
      await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());
      await page.waitForTimeout(70);
    }
    report.rapidFinal = await page.evaluate(() => {
      const slot = document.querySelector('[data-practice-slot="featured"]');
      const button = document.querySelector('[data-practice-group="featured"]');
      return { hidden: slot.hidden, ariaHidden: slot.getAttribute('aria-hidden'), expanded: button.getAttribute('aria-expanded') };
    });
    check(report.rapidFinal.hidden && report.rapidFinal.ariaHidden === 'true' && report.rapidFinal.expanded === 'false', `${name}: rapid toggling left the Featured card stuck`);

    // Archive must use the same engine and remain independently correct.
    const archiveButton = page.locator('[data-practice-group="archive"]');
    await archiveButton.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('[data-practice-group="archive"]')?.click());
    await page.waitForTimeout(850);
    report.archive = await page.evaluate(() => {
      const explorer = document.querySelector('[data-practice-explorer="archive"]');
      const viewport = explorer.querySelector('.practice-carousel-viewport');
      return {
        counter: explorer.querySelector('[data-practice-swipe-counter]')?.textContent?.trim(),
        height: viewport.getBoundingClientRect().height,
        controlsTop: explorer.querySelector('.practice-swipe-controls').getBoundingClientRect().top,
      };
    });
    check(report.archive.counter === '01 / 07', `${name}: archive counter is ${report.archive.counter}`);
    check(report.archive.height > 350, `${name}: archive viewport height collapsed to ${report.archive.height}px`);
    check(report.archive.controlsTop >= -2 && report.archive.controlsTop <= 55, `${name}: archive auto-scroll stopped at ${report.archive.controlsTop}px`);

    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    check(consoleErrors.length === 0, `${name}: console errors: ${consoleErrors.join(' | ')}`);
    check(pageErrors.length === 0, `${name}: page errors: ${pageErrors.join(' | ')}`);
  } catch (error) {
    report.issues.push(`unexpected QA exception: ${String(error?.stack || error)}`);
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    results.push(report);
    await browser.close();
  }
}

console.log(JSON.stringify(results, null, 2));
if (failed) process.exit(1);
