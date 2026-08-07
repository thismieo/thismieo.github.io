from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
html_path = Path('index.html')

js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

# ----------------------------------------------------------
# 1) Page scrolling: let the browser own smooth scrolling.
#    This removes a JS requestAnimationFrame loop from the
#    same frame budget used by layout and touch scrolling.
# ----------------------------------------------------------
js = js.replace('  let scrollFrame = 0;\n', '', 1)
js = js.replace('  const interactionMotion = Object.freeze({ scroll: 460 });\n', '', 1)
js = js.replace('  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));\n', '', 1)

scroll_start = js.index('  const smoothScrollTo =')
scroll_end = js.index('  const stabilizeWorkshopBackground =', scroll_start)
new_scroll = r'''  const smoothScrollTo = (targetY) => {
    window.scrollTo({
      top: Math.max(0, targetY),
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const scheduleIdle = (callback) => {
    if ("requestIdleCallback" in window) {
      return window.requestIdleCallback(callback, { timeout: 900 });
    }
    return window.setTimeout(callback, 120);
  };

'''
js = js[:scroll_start] + new_scroll + js[scroll_end:]

# ----------------------------------------------------------
# 2) Keep slide shells light. Syntax-highlighted code is the
#    expensive DOM: hydrate active/nearby slides progressively.
# ----------------------------------------------------------
old_code_fill = '''    setCode(detail.querySelector("[data-practice-code]"), exercise.code);\n    const copyButton = detail.querySelector("[data-practice-copy]");\n'''
new_code_fill = '''    const codeTarget = detail.querySelector("[data-practice-code]");\n    codeTarget.replaceChildren();\n    detail.dataset.codeHydrated = "false";\n    const copyButton = detail.querySelector("[data-practice-copy]");\n'''
if old_code_fill not in js:
    raise SystemExit('populateDetail code anchor missing')
js = js.replace(old_code_fill, new_code_fill, 1)

hydrate_anchor = '  const updateCarouselUI = (name, index) => {\n'
hydrate_block = r'''  const hydrateSlide = (name, index) => {
    const state = carouselState[name];
    const group = groups[name];
    const slide = state?.slides[index];
    const exercise = group?.exercises[index];
    if (!slide || !exercise || slide.dataset.codeHydrated === "true") return;

    setCode(slide.querySelector("[data-practice-code]"), exercise.code);
    slide.dataset.codeHydrated = "true";
  };

  const warmCarouselAround = (name, index) => {
    const group = groups[name];
    if (!group) return;
    [index - 1, index + 1].forEach((nearbyIndex) => {
      if (nearbyIndex < 0 || nearbyIndex >= group.exercises.length) return;
      scheduleIdle(() => hydrateSlide(name, nearbyIndex));
    });
  };

'''
if hydrate_anchor not in js:
    raise SystemExit('updateCarouselUI anchor missing')
js = js.replace(hydrate_anchor, hydrate_block + hydrate_anchor, 1)

# ----------------------------------------------------------
# 3) Native carousel engine. No JS work on every animation
#    frame. Settle once after native scrolling ends.
# ----------------------------------------------------------
engine_start = js.index('  const measureActiveCarousel =')
engine_end = js.index('  const buildCarousel =', engine_start)
new_engine = r'''  const carouselTargetLeft = (state, index) => {
    const slide = state?.slides[index];
    if (!state || !slide) return 0;
    const centered = slide.offsetLeft - (state.viewport.clientWidth - slide.offsetWidth) / 2;
    const maxLeft = Math.max(0, state.viewport.scrollWidth - state.viewport.clientWidth);
    return clamp(centered, 0, maxLeft);
  };

  const nearestCarouselIndex = (state) => {
    if (!state || !state.slides.length) return 0;
    const viewportCenter = state.viewport.scrollLeft + state.viewport.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    state.slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });

    return nearest;
  };

  const measureActiveCarousel = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = activeIndex[name];
    hydrateSlide(name, index);
    const slide = state.slides[index];
    if (!slide) return;
    const height = Math.ceil(slide.getBoundingClientRect().height);
    if (height > 0) state.viewport.style.height = `${height}px`;
  };

  const settleCarousel = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = nearestCarouselIndex(state);
    updateCarouselUI(name, index);
    hydrateSlide(name, index);
    warmCarouselAround(name, index);
    measureActiveCarousel(name);
  };

  const goToCarousel = (name, requestedIndex) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = clamp(requestedIndex, 0, state.slides.length - 1);
    hydrateSlide(name, index);
    warmCarouselAround(name, index);
    state.viewport.scrollTo({
      left: carouselTargetLeft(state, index),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

'''
js = js[:engine_start] + new_engine + js[engine_end:]

# ----------------------------------------------------------
# 4) Rebuild only the carousel wiring, preserving all content
#    and controls. Modern browsers use scrollend; older ones
#    get a tiny debounced fallback, not per-frame processing.
# ----------------------------------------------------------
build_start = js.index('  const buildCarousel =')
build_end = js.index('  const syncCollectionState =', build_start)
new_build = r'''  const buildCarousel = (name) => {
    const group = groups[name];
    const view = viewFor(name);
    const template = view.detail;
    view.list?.closest(".practice-exercise-nav")?.setAttribute("aria-hidden", "true");

    const controls = document.createElement("div");
    controls.className = "practice-swipe-controls";
    controls.setAttribute("aria-label", `${group.label} navigation`);
    controls.innerHTML = `
      <button type="button" class="practice-swipe-arrow" data-practice-prev aria-label="Previous ${group.unit.toLowerCase()}">
        <svg aria-hidden="true" viewBox="0 0 12 20"><path d="m8.5 3-5 7 5 7"></path></svg>
      </button>
      <div class="practice-swipe-meta">
        <span class="practice-swipe-hint">${group.hint}</span>
        <strong data-practice-swipe-counter>${pad(1)} / ${pad(group.exercises.length)}</strong>
        <span class="practice-swipe-dots" aria-hidden="true">${group.exercises.map((_, index) => `<i data-practice-dot class="${index === 0 ? "is-active" : ""}"></i>`).join("")}</span>
      </div>
      <button type="button" class="practice-swipe-arrow" data-practice-next aria-label="Next ${group.unit.toLowerCase()}">
        <svg aria-hidden="true" viewBox="0 0 12 20"><path d="m3.5 3 5 7-5 7"></path></svg>
      </button>`;

    const viewport = document.createElement("div");
    viewport.className = "practice-carousel-viewport";
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", `${group.label} carousel`);

    const track = document.createElement("div");
    track.className = "practice-carousel-track";

    const slides = group.exercises.map((_, index) => {
      const slide = template.cloneNode(true);
      populateDetail(name, slide, index);
      track.appendChild(slide);
      return slide;
    });

    viewport.appendChild(track);
    viewport.style.height = "0px";
    template.before(controls);
    template.replaceWith(viewport);

    const state = {
      controls,
      viewport,
      track,
      slides,
      counter: controls.querySelector("[data-practice-swipe-counter]"),
      dots: [...controls.querySelectorAll("[data-practice-dot]")],
      prev: controls.querySelector("[data-practice-prev]"),
      next: controls.querySelector("[data-practice-next]"),
      settleTimer: 0,
    };

    carouselState[name] = state;
    updateCarouselUI(name, 0);

    // Keep the first visible card ready; warm only its neighbour in idle time.
    hydrateSlide(name, 0);
    warmCarouselAround(name, 0);

    state.prev.addEventListener("click", () => goToCarousel(name, activeIndex[name] - 1));
    state.next.addEventListener("click", () => goToCarousel(name, activeIndex[name] + 1));

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      goToCarousel(name, activeIndex[name] + (event.key === "ArrowRight" ? 1 : -1));
    });

    if ("onscrollend" in viewport) {
      viewport.addEventListener("scrollend", () => settleCarousel(name), { passive: true });
    } else {
      viewport.addEventListener("scroll", () => {
        window.clearTimeout(state.settleTimer);
        state.settleTimer = window.setTimeout(() => settleCarousel(name), 130);
      }, { passive: true });
    }
  };

'''
js = js[:build_start] + new_build + js[build_end:]

# ----------------------------------------------------------
# 5) Opening alignment: native vertical smooth-scroll, no
#    custom animation loop and no duration bookkeeping.
# ----------------------------------------------------------
align_start = js.index('  const gentlyAlignOpenContent =')
align_end = js.index('  const openSlot =', align_start)
new_align = r'''  const gentlyAlignOpenContent = (name) => {
    const controls = carouselState[name]?.controls;
    if (!controls) return;
    const desiredTop = window.innerWidth <= 700 ? 18 : 28;
    const rect = controls.getBoundingClientRect();
    if (Math.abs(rect.top - desiredTop) < 4) return;
    smoothScrollTo(window.scrollY + rect.top - desiredTop);
  };

'''
js = js[:align_start] + new_align + js[align_end:]

# Center the active slide using its real offset (supports card gaps/peek).
js = js.replace(
    '    if (state) state.viewport.scrollLeft = activeIndex[name] * state.viewport.clientWidth;\n    measureActiveCarousel(name, true);\n',
    '    if (state) state.viewport.scrollLeft = carouselTargetLeft(state, activeIndex[name]);\n    measureActiveCarousel(name);\n',
    1,
)

# The alignment function is no longer promise-based.
js = js.replace(
    '    if (token === interactionToken) await gentlyAlignOpenContent(name);\n',
    '    if (token === interactionToken) gentlyAlignOpenContent(name);\n',
    1,
)

# One global resize path: reposition + measure only the open carousel.
old_resize = '''      Object.keys(groups).forEach((name) => {\n        if (!slots[name].hidden) measureActiveCarousel(name, true);\n      });\n'''
new_resize = '''      Object.keys(groups).forEach((name) => {\n        if (slots[name].hidden) return;\n        const state = carouselState[name];\n        if (state) state.viewport.scrollLeft = carouselTargetLeft(state, activeIndex[name]);\n        measureActiveCarousel(name);\n      });\n'''
if old_resize not in js:
    raise SystemExit('global resize anchor missing')
js = js.replace(old_resize, new_resize, 1)

# Warm the closed-state background measurement before card interaction when possible.
init_anchor = '  syncCollectionState();\n})();\n'
init_replacement = '''  syncCollectionState();\n  window.requestAnimationFrame(() => stabilizeWorkshopBackground(true));\n})();\n'''
if init_anchor not in js:
    raise SystemExit('init anchor missing')
js = js.replace(init_anchor, init_replacement, 1)

# ----------------------------------------------------------
# 6) Carousel CSS: distinct frames, centred snap, neighbour
#    peek. No animated height (height animation forces layout
#    every frame on weak devices). Offscreen slides can skip
#    rendering via content-visibility when supported.
# ----------------------------------------------------------
viewport_start = css.index('.practice-carousel-viewport {')
viewport_end = css.index('.practice-swipe-arrow:disabled', viewport_start)
new_carousel_css = r'''.practice-carousel-viewport {
  width: min(100%, 760px);
  min-width: 0;
  margin: 0 auto;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
  overflow-anchor: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: auto;
  scroll-padding-inline: 18px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
  transition: none !important;
}

.practice-carousel-viewport::-webkit-scrollbar {
  display: none;
}

.practice-carousel-track {
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-inline: 18px;
}

.practice-carousel-slide {
  flex: 0 0 calc(100% - 36px) !important;
  width: calc(100% - 36px) !important;
  max-width: none !important;
  margin: 0 !important;
  scroll-snap-align: center;
  scroll-snap-stop: normal;
  touch-action: auto !important;
  content-visibility: auto;
}

'''
css = css[:viewport_start] + new_carousel_css + css[viewport_end:]

# Cache bust.
html = html.replace('workshop-integrated.css?v=5.4.0', 'workshop-integrated.css?v=5.5.0')
html = html.replace('workshop-integrated.js?v=5.4.0', 'workshop-integrated.js?v=5.5.0')

# ----------------------------------------------------------
# Guards: reject a partial or regressed patch before writing.
# ----------------------------------------------------------
required_js = (
    'const scheduleIdle',
    'const hydrateSlide',
    'const carouselTargetLeft',
    'const nearestCarouselIndex',
    '"onscrollend" in viewport',
    'behavior: reduceMotion ? "auto" : "smooth"',
)
for token in required_js:
    if token not in js:
        raise SystemExit(f'Missing JS guard: {token}')

for forbidden in (
    'scrollFrame',
    'syncCarouselFromScroll',
    'interactionMotion',
    'is-sizing-instant',
    'index * state.viewport.clientWidth',
):
    if forbidden in js:
        raise SystemExit(f'Legacy performance path remains: {forbidden}')

if 'setCode(detail.querySelector("[data-practice-code]"), exercise.code);' in js:
    raise SystemExit('Eager syntax highlighting remains in populateDetail')
if 'scroll-snap-align: center' not in css or 'gap: 10px' not in css:
    raise SystemExit('Separated centred carousel CSS missing')
if 'transition: height' in css[viewport_start:viewport_start + 1400]:
    raise SystemExit('Carousel height animation remains')
if 'workshop-integrated.css?v=5.5.0' not in html or 'workshop-integrated.js?v=5.5.0' not in html:
    raise SystemExit('Cache version bump missing')

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
