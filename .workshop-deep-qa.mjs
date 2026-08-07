import { chromium, webkit } from 'playwright';

const ORIGIN = 'http://127.0.0.1:4173';
const reports = [];
let failed = false;

const createErrorCollectors = (page) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (/cloudflare|beacon|Failed to load resource|Access-Control-Allow-Origin/i.test(text)) return;
    consoleErrors.push(text);
  });
  page.on('pageerror', (err) => {
    const text = String(err);
    if (/cloudflareinsights|cdn-cgi\/rum|access control/i.test(text)) return;
    pageErrors.push(text);
  });
  return { consoleErrors, pageErrors };
};

const positionPracticeCard = async (page, group, desiredTop = 180) => {
  await page.evaluate(({ group, desiredTop }) => {
    const button = document.querySelector(`[data-practice-group="${group}"]`);
    const card = button?.closest('[data-practice-card]');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    window.scrollTo(0, Math.max(0, window.scrollY + rect.top - desiredTop));
  }, { group, desiredTop });
  await page.waitForTimeout(140);
};

const tapPracticeButton = async (page, group, hasTouch) => {
  const locator = page.locator(`[data-practice-group="${group}"]`);
  if (!hasTouch) {
    await locator.click();
    return;
  }
  const box = await locator.boundingBox();
  if (!box) throw new Error(`${group} button has no touch box`);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
};

const waitOpen = async (page, group) => {
  await page.waitForFunction((group) => {
    const slot = document.querySelector(`[data-practice-slot="${group}"]`);
    return slot && !slot.hidden && slot.getAttribute('aria-hidden') === 'false';
  }, group);
};

const firstOpenTimeline = async (page, group, duration = 760) => {
  const samples = [];
  const started = Date.now();
  for (const delay of [0, 70, 160, 320, duration]) {
    const elapsed = Date.now() - started;
    if (delay > elapsed) await page.waitForTimeout(delay - elapsed);
    samples.push(await page.evaluate((group) => {
      const explorer = document.querySelector(`[data-practice-explorer="${group}"]`);
      const controls = explorer?.querySelector('.practice-swipe-controls');
      return {
        t: performance.now(),
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        controlsTop: controls?.getBoundingClientRect().top ?? null,
      };
    }, group));
  }
  return samples;
};

const geometry = async (page, group) => page.evaluate((group) => {
  const explorer = document.querySelector(`[data-practice-explorer="${group}"]`);
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
}, group);

const runMobileFunctional = async (engineName, engine) => {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  const { consoleErrors, pageErrors } = createErrorCollectors(page);
  const report = { suite: 'mobile-direct', engine: engineName, issues: [] };
  const check = (condition, message) => { if (!condition) report.issues.push(message); };

  try {
    await page.goto(`${ORIGIN}/?view=workshop`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-practice-root]');
    await page.waitForTimeout(180);

    report.initial = await page.evaluate(() => ({
      rootNodes: document.querySelector('[data-practice-root]')?.getElementsByTagName('*').length || 0,
      hydrated: [...document.querySelectorAll('[data-code-hydrated="true"]')].length,
      reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    }));
    check(report.initial.hydrated <= 2, `${engineName}: too many highlighted slides before opening (${report.initial.hydrated})`);

    await positionPracticeCard(page, 'featured', 180);
    report.beforeOpen = await page.evaluate(() => {
      const button = document.querySelector('[data-practice-group="featured"]');
      const card = button.closest('[data-practice-card]');
      return { scrollY: window.scrollY, scrollHeight: document.documentElement.scrollHeight, cardTop: card.getBoundingClientRect().top };
    });

    const openStart = Date.now();
    await tapPracticeButton(page, 'featured', true);
    await waitOpen(page, 'featured');
    report.openVisibleMs = Date.now() - openStart;
    report.openTimeline = await firstOpenTimeline(page, 'featured');
    report.openGeometry = await geometry(page, 'featured');

    check(report.openVisibleMs < 220, `${engineName}: opening visibility took ${report.openVisibleMs}ms`);
    check(report.openGeometry.controlsTop >= -2 && report.openGeometry.controlsTop <= 55, `${engineName}: Featured controls stop at ${report.openGeometry.controlsTop}px`);
    check(report.openGeometry.viewportHeight > 400, `${engineName}: Featured viewport collapsed to ${report.openGeometry.viewportHeight}px`);
    check(report.openGeometry.gap >= 8 && report.openGeometry.gap <= 12, `${engineName}: card gap is ${report.openGeometry.gap}px`);
    check(report.openGeometry.slideWidth >= report.openGeometry.viewportWidth - 44 && report.openGeometry.slideWidth <= report.openGeometry.viewportWidth - 28, `${engineName}: slide width is ${report.openGeometry.slideWidth}px for viewport ${report.openGeometry.viewportWidth}px`);
    check(report.openGeometry.nextPeek >= 4 && report.openGeometry.nextPeek <= 16, `${engineName}: neighbour peek is ${report.openGeometry.nextPeek}px`);
    check(report.openGeometry.contentVisibility !== 'auto', `${engineName}: content-visibility:auto is still active`);
    check(report.openGeometry.viewportTouchAction.includes('pan-y'), `${engineName}: vertical touch panning is not permitted by carousel viewport`);

    const next = page.locator('[data-practice-explorer="featured"] [data-practice-next]');
    await next.click();
    await page.waitForTimeout(720);
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
        current: slide.getAttribute('aria-current'),
        hidden: slide.getAttribute('aria-hidden'),
        height: v.height,
      };
    });
    check(report.afterNext.counter === '02 / 05', `${engineName}: counter is ${report.afterNext.counter}`);
    check(report.afterNext.centerDelta <= 3, `${engineName}: second card center is off by ${report.afterNext.centerDelta}px`);
    check(report.afterNext.current === 'true' && report.afterNext.hidden === 'false', `${engineName}: active card ARIA is inconsistent`);
    check(report.afterNext.height > 400, `${engineName}: second card height collapsed to ${report.afterNext.height}px`);

    // Vertical range / gesture ownership.
    const beforeVertical = await page.evaluate(() => window.scrollY);
    if (engineName === 'chromium') {
      const box = await page.locator('[data-practice-explorer="featured"] .practice-carousel-viewport').boundingBox();
      await page.mouse.move(box.x + Math.min(120, box.width / 2), Math.max(10, Math.min(760, box.y + 180)));
      await page.mouse.wheel(0, 420);
    } else {
      await page.evaluate(() => window.scrollBy(0, 420));
    }
    await page.waitForTimeout(320);
    const afterVertical = await page.evaluate(() => window.scrollY);
    report.verticalDelta = afterVertical - beforeVertical;
    check(report.verticalDelta > 80, `${engineName}: vertical page motion moved only ${report.verticalDelta}px`);

    // Copy feedback ownership.
    await page.evaluate(() => {
      try {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.resolve() } });
      } catch {}
    });
    const secondCopy = page.locator('[data-practice-explorer="featured"] .practice-carousel-slide').nth(1).locator('[data-practice-copy]');
    await secondCopy.click();
    await page.waitForTimeout(80);
    report.copyStatus = await page.evaluate(() => [...document.querySelectorAll('[data-practice-explorer="featured"] .practice-carousel-slide')]
      .map((slide) => slide.querySelector('[data-practice-copy-status]')?.textContent?.trim() || ''));
    check(report.copyStatus[1] === 'Code copied to clipboard' && report.copyStatus[0] === '', `${engineName}: copy feedback belongs to the wrong slide`);

    // Close with a normal page position, then stress rapid toggles.
    await positionPracticeCard(page, 'featured', 180);
    const beforeCloseTop = await page.locator('[data-practice-group="featured"]').evaluate((el) => el.closest('[data-practice-card]').getBoundingClientRect().top);
    await tapPracticeButton(page, 'featured', true);
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
    check(report.close.hidden && report.close.ariaHidden === 'true' && report.close.expanded === 'false', `${engineName}: close state is inconsistent`);
    check(report.close.anchorShift <= 2, `${engineName}: close shifts outer card by ${report.close.anchorShift}px`);

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
    check(report.rapidFinal.hidden && report.rapidFinal.ariaHidden === 'true' && report.rapidFinal.expanded === 'false', `${engineName}: rapid toggles leave Featured stuck`);

    await positionPracticeCard(page, 'archive', 180);
    await tapPracticeButton(page, 'archive', true);
    await waitOpen(page, 'archive');
    await page.waitForTimeout(720);
    report.archive = await geometry(page, 'archive');
    const archiveCounter = await page.locator('[data-practice-explorer="archive"] [data-practice-swipe-counter]').textContent();
    report.archive.counter = archiveCounter?.trim();
    check(report.archive.counter === '01 / 07', `${engineName}: archive counter is ${report.archive.counter}`);
    check(report.archive.viewportHeight > 350, `${engineName}: archive viewport collapsed to ${report.archive.viewportHeight}px`);
    check(report.archive.controlsTop >= -2 && report.archive.controlsTop <= 55, `${engineName}: Archive controls stop at ${report.archive.controlsTop}px`);

    report.consoleErrors = consoleErrors;
    report.pageErrors = pageErrors;
    check(consoleErrors.length === 0, `${engineName}: console errors: ${consoleErrors.join(' | ')}`);
    check(pageErrors.length === 0, `${engineName}: page errors: ${pageErrors.join(' | ')}`);
  } catch (error) {
    report.issues.push(`unexpected exception: ${String(error?.stack || error)}`);
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    reports.push(report);
    await browser.close();
  }
};

const runNaturalEntrySmoke = async (engineName, engine) => {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const report = { suite: 'mobile-natural-entry', engine: engineName, issues: [] };
  const check = (condition, message) => { if (!condition) report.issues.push(message); };
  try {
    await page.goto(`${ORIGIN}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-open-workshop]');
    await page.evaluate(() => {
      const opener = [...document.querySelectorAll('[data-open-workshop]')].find((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      opener?.scrollIntoView({ block: 'center', behavior: 'auto' });
      opener?.click();
    });
    await page.waitForFunction(() => document.documentElement.classList.contains('workshop-open') && !document.querySelector('[data-workshop-view]')?.hidden);
    await page.waitForTimeout(1250);
    await positionPracticeCard(page, 'featured', 180);
    await tapPracticeButton(page, 'featured', true);
    await waitOpen(page, 'featured');
    await page.waitForTimeout(720);
    const g = await geometry(page, 'featured');
    report.controlsTop = g.controlsTop;
    report.height = g.viewportHeight;
    report.gap = g.gap;
    report.peek = g.nextPeek;
    check(g.controlsTop >= -2 && g.controlsTop <= 55, `${engineName}: natural-entry first open stops at ${g.controlsTop}px`);
    check(g.viewportHeight > 400, `${engineName}: natural-entry viewport collapsed to ${g.viewportHeight}px`);
    check(g.gap >= 8 && g.gap <= 12 && g.nextPeek >= 4 && g.nextPeek <= 16, `${engineName}: natural-entry frame geometry is wrong`);
  } catch (error) {
    report.issues.push(`unexpected exception: ${String(error?.stack || error)}`);
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    reports.push(report);
    await browser.close();
  }
};

const runDesktopSmoke = async (engineName, engine) => {
  const browser = await engine.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const report = { suite: 'desktop-smoke', engine: engineName, issues: [] };
  const check = (condition, message) => { if (!condition) report.issues.push(message); };
  try {
    await page.goto(`${ORIGIN}/?view=workshop`, { waitUntil: 'networkidle' });
    await positionPracticeCard(page, 'featured', 170);
    await tapPracticeButton(page, 'featured', false);
    await waitOpen(page, 'featured');
    await page.waitForTimeout(720);
    const g = await geometry(page, 'featured');
    report.geometry = g;
    check(g.controlsTop >= 8 && g.controlsTop <= 55, `${engineName}: desktop controls top is ${g.controlsTop}px`);
    check(g.viewportWidth >= 700 && g.viewportWidth <= 760, `${engineName}: desktop carousel width is ${g.viewportWidth}px`);
    check(g.gap >= 8 && g.gap <= 12 && g.nextPeek >= 4 && g.nextPeek <= 16, `${engineName}: desktop frame spacing is inconsistent`);
    const next = page.locator('[data-practice-explorer="featured"] [data-practice-next]');
    await next.click();
    await page.waitForTimeout(720);
    const counter = (await page.locator('[data-practice-explorer="featured"] [data-practice-swipe-counter]').textContent())?.trim();
    report.counter = counter;
    check(counter === '02 / 05', `${engineName}: desktop arrow navigation counter is ${counter}`);
  } catch (error) {
    report.issues.push(`unexpected exception: ${String(error?.stack || error)}`);
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    reports.push(report);
    await browser.close();
  }
};

const runLowEndChromium = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const report = { suite: 'low-end-4x-cpu', engine: 'chromium', issues: [] };
  const check = (condition, message) => { if (!condition) report.issues.push(message); };
  try {
    await page.goto(`${ORIGIN}/?view=workshop`, { waitUntil: 'networkidle' });
    await positionPracticeCard(page, 'featured', 160);
    const started = Date.now();
    await tapPracticeButton(page, 'featured', true);
    await waitOpen(page, 'featured');
    report.openVisibleMs = Date.now() - started;
    await page.waitForTimeout(900);
    const g = await geometry(page, 'featured');
    report.geometry = g;
    check(report.openVisibleMs < 500, `4x CPU: open visibility took ${report.openVisibleMs}ms`);
    check(g.controlsTop >= -2 && g.controlsTop <= 60, `4x CPU: controls stop at ${g.controlsTop}px`);
    check(g.viewportHeight > 400, `4x CPU: viewport collapsed to ${g.viewportHeight}px`);
    check(g.gap >= 8 && g.gap <= 12 && g.nextPeek >= 4 && g.nextPeek <= 16, '4x CPU: frame geometry changed');
    await page.locator('[data-practice-explorer="featured"] [data-practice-next]').click();
    await page.waitForTimeout(950);
    const counter = (await page.locator('[data-practice-explorer="featured"] [data-practice-swipe-counter]').textContent())?.trim();
    report.counter = counter;
    check(counter === '02 / 05', `4x CPU: arrow navigation counter is ${counter}`);
  } catch (error) {
    report.issues.push(`unexpected exception: ${String(error?.stack || error)}`);
  } finally {
    report.status = report.issues.length ? 'fail' : 'pass';
    if (report.issues.length) failed = true;
    reports.push(report);
    await browser.close();
  }
};

for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  await runMobileFunctional(name, engine);
  await runNaturalEntrySmoke(name, engine);
  await runDesktopSmoke(name, engine);
}
await runLowEndChromium();

console.log(JSON.stringify(reports, null, 2));
if (failed) process.exit(1);
