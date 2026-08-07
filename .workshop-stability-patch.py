from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
html_path = Path('index.html')

js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

# 1) Motion model: opening/closing are immediate at DOM level; only page scroll remains animated.
js = js.replace(
    'const interactionMotion = Object.freeze({ reveal: 240, close: 190, scroll: 420, carousel: 230 });',
    'const interactionMotion = Object.freeze({ scroll: 460 });',
    1,
)

# 2) Replace the competing carousel engine with native scrolling + one settle measurement.
start = js.index('  const refreshCarouselMetrics =')
end = js.index('  const buildCarousel =', start)
new_engine = r'''  const measureActiveCarousel = (name, instant = false) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const slide = state.slides[activeIndex[name]];
    if (!slide) return;
    const height = Math.ceil(slide.getBoundingClientRect().height);
    if (height <= 0) return;
    state.viewport.classList.toggle("is-sizing-instant", instant);
    state.viewport.style.height = `${height}px`;
    if (instant) window.requestAnimationFrame(() => state.viewport.classList.remove("is-sizing-instant"));
  };

  const settleCarousel = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = clamp(Math.round(state.viewport.scrollLeft / state.viewport.clientWidth), 0, state.slides.length - 1);
    updateCarouselUI(name, index);
    measureActiveCarousel(name);
  };

  const syncCarouselFromScroll = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = clamp(Math.round(state.viewport.scrollLeft / state.viewport.clientWidth), 0, state.slides.length - 1);
    if (index !== activeIndex[name]) updateCarouselUI(name, index);
    window.clearTimeout(state.settleTimer);
    state.settleTimer = window.setTimeout(() => settleCarousel(name), 90);
  };

  const goToCarousel = (name, requestedIndex) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = clamp(requestedIndex, 0, state.slides.length - 1);
    state.viewport.scrollTo({
      left: index * state.viewport.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

'''
js = js[:start] + new_engine + js[end:]

# 3) Simplify carousel state/listeners: no custom horizontal RAF, no live height interpolation, no all-slide observer.
js = js.replace('''      heights: [],\n      settleTimer: 0,\n      motionFrame: 0,\n      scrollFrame: 0,\n      programmatic: false,\n''', '''      settleTimer: 0,\n      scrollFrame: 0,\n      resizeTimer: 0,\n''', 1)
js = js.replace('''    state.prev.addEventListener("click", () => animateCarouselTo(name, activeIndex[name] - 1));\n    state.next.addEventListener("click", () => animateCarouselTo(name, activeIndex[name] + 1));\n''', '''    state.prev.addEventListener("click", () => goToCarousel(name, activeIndex[name] - 1));\n    state.next.addEventListener("click", () => goToCarousel(name, activeIndex[name] + 1));\n''', 1)

pointer_start = js.index('    viewport.addEventListener("pointerdown"')
pointer_end = js.index('    viewport.addEventListener("keydown"', pointer_start)
js = js[:pointer_start] + js[pointer_end:]

js = js.replace('''      animateCarouselTo(name, activeIndex[name] + (event.key === "ArrowRight" ? 1 : -1));\n''', '''      goToCarousel(name, activeIndex[name] + (event.key === "ArrowRight" ? 1 : -1));\n''', 1)
js = js.replace('''    if ("onscrollend" in viewport) {\n      viewport.addEventListener("scrollend", () => {\n        if (!state.programmatic) settleCarousel(name);\n      });\n    }\n\n    if (window.ResizeObserver) {\n      const observer = new ResizeObserver(() => {\n        if (slots[name].hidden) return;\n        window.clearTimeout(state.resizeTimer);\n        state.resizeTimer = window.setTimeout(() => refreshCarouselMetrics(name, false), 40);\n      });\n      slides.forEach((slide) => observer.observe(slide));\n      state.observer = observer;\n    }\n''', '''    if ("onscrollend" in viewport) viewport.addEventListener("scrollend", () => settleCarousel(name));\n\n    window.addEventListener("resize", () => {\n      if (slots[name].hidden) return;\n      window.clearTimeout(state.resizeTimer);\n      state.resizeTimer = window.setTimeout(() => {\n        viewport.scrollLeft = activeIndex[name] * viewport.clientWidth;\n        measureActiveCarousel(name, true);\n      }, 90);\n    }, { passive: true });\n''', 1)

# 4) Opening scroll: place the actual opened controls near the top; do not cap long movement.
align_start = js.index('  const gentlyAlignOpenContent =')
align_end = js.index('  const gentlySettleClosedCard =', align_start)
new_align = r'''  const gentlyAlignOpenContent = async (name) => {
    const controls = carouselState[name]?.controls;
    if (!controls) return;
    const desiredTop = window.innerWidth <= 700 ? 18 : 28;
    const rect = controls.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - desiredTop;
    if (Math.abs(rect.top - desiredTop) >= 4) await smoothScrollTo(targetY, interactionMotion.scroll);
  };

'''
js = js[:align_start] + new_align + js[align_end:]

# Remove close-settle helper entirely: closing should not start a second page motion.
close_settle_start = js.index('  const gentlySettleClosedCard =')
close_settle_end = js.index('  const openSlot =', close_settle_start)
js = js[:close_settle_start] + js[close_settle_end:]

# 5) Open/close are light and deterministic. Measure only the active slide once.
open_start = js.index('  const openSlot =')
close_start = js.index('  const closeSlot =', open_start)
new_open = r'''  const openSlot = async (name, token) => {
    const slot = slots[name];
    slot.hidden = false;
    slot.inert = false;
    slot.classList.remove("is-closing", "is-settled", "is-opening");
    slot.classList.add("is-open");
    slot.setAttribute("aria-hidden", "false");
    await nextFrame();
    if (token !== interactionToken) return false;
    const state = carouselState[name];
    if (state) state.viewport.scrollLeft = activeIndex[name] * state.viewport.clientWidth;
    measureActiveCarousel(name, true);
    return true;
  };

'''
js = js[:open_start] + new_open + js[close_start:]

close_start = js.index('  const closeSlot =')
normalize_start = js.index('  const normalizeInterruptedSlots =', close_start)
new_close = r'''  const closeSlot = async (name, token, anchorElement = null, anchorTop = NaN) => {
    const slot = slots[name];
    if (slot.hidden) return true;
    slot.inert = true;
    slot.setAttribute("aria-hidden", "true");
    slot.hidden = true;
    slot.classList.remove("is-open", "is-closing", "is-settled", "is-opening");
    if (token !== interactionToken) return false;
    preserveViewportAnchor(anchorElement, anchorTop);
    return true;
  };

'''
js = js[:close_start] + new_close + js[normalize_start:]

js = js.replace('''      const closed = await closeSlot(name, token);\n      if (closed && token === interactionToken) await gentlySettleClosedCard(name);\n      return;\n''', '''      await closeSlot(name, token);\n      return;\n''', 1)

# 6) Keep instant-state cleanup aligned with the simplified classes.
js = js.replace('slot.classList.remove("is-settled", "is-closing");', 'slot.classList.remove("is-settled", "is-closing", "is-opening");', 1)

# CSS: remove heavyweight full-content open/close animations.
css_start = css.index('.practice-explorer-slot-inner,')
css_end = css.index('.practice-explorer {', css_start)
new_reveal_css = r'''.practice-explorer-slot-inner,
.practice-explorer-slot.is-open > .practice-explorer-slot-inner,
.practice-explorer-slot.is-closing > .practice-explorer-slot-inner {
  min-width: 0 !important;
  min-height: 0 !important;
  padding-top: 12px !important;
  overflow: visible !important;
  opacity: 1 !important;
  transform: none !important;
  transition: none !important;
}

'''
css = css[:css_start] + new_reveal_css + css[css_end:]

# Native rail refinements: no height interpolation while finger is moving; settle only afterward.
css = css.replace('''  scroll-snap-type: x mandatory;\n  scroll-behavior: auto;\n''', '''  scroll-snap-type: x mandatory;\n  scroll-behavior: auto;\n  scroll-padding-inline: 0;\n''', 1)
css = css.replace('''  transition: height 175ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.practice-carousel-viewport::-webkit-scrollbar {\n''', '''  transition: height 145ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.practice-carousel-viewport.is-sizing-instant {\n  transition: none !important;\n}\n\n.practice-carousel-viewport::-webkit-scrollbar {\n''', 1)
css = css.replace('''.practice-carousel-viewport.is-scrolling {\n  transition: none;\n}\n\n''', '', 1)
css = css.replace('''  scroll-snap-align: start;\n  scroll-snap-stop: always;\n  touch-action: pan-x pan-y !important;\n''', '''  scroll-snap-align: start;\n  touch-action: auto !important;\n  contain: layout paint;\n''', 1)

# Reduce-motion cleanup for removed classes.
css = css.replace('''  .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-open > .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-closing > .practice-explorer-slot-inner,\n''', '''  .practice-explorer-slot-inner,\n''', 1)

# Cache bust.
html = html.replace('workshop-integrated.css?v=5.3.0', 'workshop-integrated.css?v=5.4.0')
html = html.replace('workshop-integrated.js?v=5.3.0', 'workshop-integrated.js?v=5.4.0')

# Guard checks before write.
for forbidden in ('animateCarouselTo', 'refreshCarouselMetrics', 'gentlySettleClosedCard', 'is-scrolling'):
    if forbidden in js:
        raise SystemExit(f'Forbidden legacy JS remains: {forbidden}')
if 'getBoundingClientRect().height' not in js:
    raise SystemExit('Active-slide measurement missing')
if 'scroll-snap-type: x mandatory' not in css:
    raise SystemExit('Native scroll snap missing')
if 'scroll-snap-stop: always' in css:
    raise SystemExit('Sticky snap-stop remains')

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
