from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
html_path = Path('index.html')

js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

js = js.replace(
'''  let interactionToken = 0;\n  let scrollFrame = 0;\n\n  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;\n  const interactionMotion = Object.freeze({ reveal: 285, close: 225, scroll: 360 });\n''',
'''  let interactionToken = 0;\n  let scrollFrame = 0;\n  let workshopBackgroundFrozen = false;\n  const carouselState = Object.create(null);\n  const workshopView = root.closest(".workshop-view");\n\n  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;\n  const interactionMotion = Object.freeze({ reveal: 240, close: 190, scroll: 420, carousel: 230 });\n''', 1)

scroll_anchor = '''  const pad = (value) => String(value).padStart(2, "0");\n'''
scroll_insert = '''  const stabilizeWorkshopBackground = (force = false) => {\n    if (!workshopView || workshopView.hidden) return;\n    if (workshopBackgroundFrozen && !force) return;\n    const stableHeight = Math.ceil(Math.max(workshopView.scrollHeight, window.innerHeight));\n    workshopView.style.setProperty("--workshop-bg-height", `${stableHeight}px`);\n    workshopBackgroundFrozen = true;\n  };\n\n  const pad = (value) => String(value).padStart(2, "0");\n'''
if scroll_anchor not in js:
    raise SystemExit('JS background anchor missing')
js = js.replace(scroll_anchor, scroll_insert, 1)

start = js.index('  const resetCopyFeedback =')
end = js.index('  const syncCollectionState =', start)
new_carousel = r'''  const populateDetail = (name, detail, index) => {
    const group = groups[name];
    const exercise = group.exercises[index];
    detail.id = `practice-detail-${name}-${index}`;
    detail.classList.add("practice-carousel-slide");
    detail.dataset.practiceSlide = String(index);
    detail.dataset.challenge = String(Boolean(exercise.challenge));
    detail.setAttribute("role", "group");
    detail.setAttribute("aria-label", `${group.unit} ${index + 1} of ${group.exercises.length}: ${exercise.title}`);
    detail.removeAttribute("aria-labelledby");

    detail.querySelector("[data-practice-detail-index]").textContent = `${group.unit} ${pad(index + 1)}`;
    detail.querySelector("[data-practice-detail-badge]").textContent = exercise.badge;
    detail.querySelector("[data-practice-detail-title]").textContent = exercise.title;
    detail.querySelector("[data-practice-detail-summary]").textContent = exercise.summary;
    detail.querySelector("[data-practice-detail-concept]").textContent = exercise.concept;
    detail.querySelector("[data-practice-code-title]").textContent = exercise.title;

    const skills = detail.querySelector("[data-practice-detail-skills]");
    skills.replaceChildren(...exercise.skills.map((skill) => {
      const item = document.createElement("li");
      item.textContent = skill;
      return item;
    }));

    setCode(detail.querySelector("[data-practice-code]"), exercise.code);
    const copyButton = detail.querySelector("[data-practice-copy]");
    copyButton.dataset.code = exercise.code;
    copyButton.setAttribute("aria-label", `Copy ${exercise.title} code`);
    const status = detail.querySelector("[data-practice-copy-status]");
    if (status) status.textContent = "";
  };

  const updateCarouselUI = (name, index) => {
    const group = groups[name];
    const state = carouselState[name];
    if (!state) return;
    const nextIndex = clamp(index, 0, group.exercises.length - 1);
    activeIndex[name] = nextIndex;
    state.counter.textContent = `${pad(nextIndex + 1)} / ${pad(group.exercises.length)}`;
    state.dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === nextIndex));
    state.slides.forEach((slide, slideIndex) => {
      const active = slideIndex === nextIndex;
      slide.inert = !active;
      slide.setAttribute("aria-current", active ? "true" : "false");
    });
    state.prev.disabled = nextIndex === 0;
    state.next.disabled = nextIndex === group.exercises.length - 1;
  };

  const refreshCarouselMetrics = (name, preservePosition = true) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    state.heights = state.slides.map((slide) => Math.ceil(slide.getBoundingClientRect().height));
    const index = activeIndex[name];
    if (preservePosition) state.viewport.scrollLeft = index * state.viewport.clientWidth;
    const height = state.heights[index];
    if (height > 0) state.viewport.style.height = `${height}px`;
  };

  const settleCarousel = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const raw = state.viewport.scrollLeft / state.viewport.clientWidth;
    const index = clamp(Math.round(raw), 0, state.slides.length - 1);
    updateCarouselUI(name, index);
    state.viewport.classList.remove("is-scrolling");
    const height = state.heights[index];
    if (height > 0) state.viewport.style.height = `${height}px`;
  };

  const syncCarouselFromScroll = (name) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const width = state.viewport.clientWidth;
    const raw = clamp(state.viewport.scrollLeft / width, 0, state.slides.length - 1);
    const lower = Math.floor(raw);
    const upper = Math.min(state.slides.length - 1, Math.ceil(raw));
    const mix = raw - lower;
    const lowerHeight = state.heights[lower] || 0;
    const upperHeight = state.heights[upper] || lowerHeight;
    const blendedHeight = lowerHeight + (upperHeight - lowerHeight) * mix;

    state.viewport.classList.add("is-scrolling");
    if (blendedHeight > 0) state.viewport.style.height = `${Math.round(blendedHeight)}px`;
    updateCarouselUI(name, Math.round(raw));

    if (!state.programmatic) {
      window.clearTimeout(state.settleTimer);
      state.settleTimer = window.setTimeout(() => settleCarousel(name), 105);
    }
  };

  const animateCarouselTo = (name, requestedIndex) => {
    const state = carouselState[name];
    if (!state || state.viewport.clientWidth < 2) return;
    const index = clamp(requestedIndex, 0, state.slides.length - 1);
    const start = state.viewport.scrollLeft;
    const end = index * state.viewport.clientWidth;
    const distance = end - start;

    window.cancelAnimationFrame(state.motionFrame);
    if (reduceMotion || Math.abs(distance) < 2) {
      state.viewport.scrollLeft = end;
      updateCarouselUI(name, index);
      settleCarousel(name);
      return;
    }

    state.programmatic = true;
    state.viewport.style.scrollSnapType = "none";
    state.viewport.classList.add("is-scrolling");
    const startedAt = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 4);

    const step = (now) => {
      const progress = clamp((now - startedAt) / interactionMotion.carousel, 0, 1);
      state.viewport.scrollLeft = start + distance * ease(progress);
      if (progress < 1) {
        state.motionFrame = window.requestAnimationFrame(step);
      } else {
        state.viewport.scrollLeft = end;
        state.viewport.style.removeProperty("scroll-snap-type");
        state.programmatic = false;
        updateCarouselUI(name, index);
        settleCarousel(name);
      }
    };

    state.motionFrame = window.requestAnimationFrame(step);
  };

  const buildCarousel = (name) => {
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
      heights: [],
      settleTimer: 0,
      motionFrame: 0,
      scrollFrame: 0,
      programmatic: false,
    };
    carouselState[name] = state;
    updateCarouselUI(name, 0);

    state.prev.addEventListener("click", () => animateCarouselTo(name, activeIndex[name] - 1));
    state.next.addEventListener("click", () => animateCarouselTo(name, activeIndex[name] + 1));

    viewport.addEventListener("scroll", () => {
      window.cancelAnimationFrame(state.scrollFrame);
      state.scrollFrame = window.requestAnimationFrame(() => syncCarouselFromScroll(name));
    }, { passive: true });

    viewport.addEventListener("pointerdown", () => {
      if (!state.programmatic) return;
      window.cancelAnimationFrame(state.motionFrame);
      state.programmatic = false;
      viewport.style.removeProperty("scroll-snap-type");
    }, { passive: true });

    viewport.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      animateCarouselTo(name, activeIndex[name] + (event.key === "ArrowRight" ? 1 : -1));
    });

    if ("onscrollend" in viewport) {
      viewport.addEventListener("scrollend", () => {
        if (!state.programmatic) settleCarousel(name);
      });
    }

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => {
        if (slots[name].hidden) return;
        window.clearTimeout(state.resizeTimer);
        state.resizeTimer = window.setTimeout(() => refreshCarouselMetrics(name, false), 40);
      });
      slides.forEach((slide) => observer.observe(slide));
      state.observer = observer;
    }
  };

'''
js = js[:start] + new_carousel + js[end:]

align_start = js.index('  const gentlyAlignOpenContent =')
align_end = js.index('  const gentlySettleClosedCard =', align_start)
new_align = r'''  const gentlyAlignOpenContent = async (name) => {
    const controls = carouselState[name]?.controls;
    if (!controls) return;

    const rect = controls.getBoundingClientRect();
    const mobile = window.innerWidth <= 700;
    let delta = 0;

    if (mobile) {
      const desiredTop = 92;
      delta = clamp(rect.top - desiredTop, -72, 220);
    } else {
      const safeTop = 94;
      const safeBottom = window.innerHeight - 34;
      if (rect.top < safeTop - 20) delta = rect.top - safeTop;
      else if (rect.bottom > safeBottom) delta = rect.bottom - safeBottom + 8;
      delta = clamp(delta, -96, 132);
    }

    if (Math.abs(delta) >= 6) await smoothScrollTo(window.scrollY + delta, mobile ? 420 : 340);
  };

'''
js = js[:align_start] + new_align + js[align_end:]

open_start = js.index('  const openSlot =')
open_end = js.index('  const closeSlot =', open_start)
new_open = r'''  const openSlot = async (name, token) => {
    const slot = slots[name];
    slot.hidden = false;
    slot.inert = false;
    slot.classList.remove("is-closing", "is-settled", "is-opening", "is-open");
    slot.setAttribute("aria-hidden", "false");

    await nextFrame();
    if (token !== interactionToken) return false;
    refreshCarouselMetrics(name, true);
    await nextFrame();
    if (token !== interactionToken) return false;
    slot.classList.add("is-open", "is-opening");
    window.setTimeout(() => {
      if (token === interactionToken && slot.classList.contains("is-open")) slot.classList.remove("is-opening");
    }, interactionMotion.reveal + 30);
    return true;
  };

'''
js = js[:open_start] + new_open + js[open_end:]

js = js.replace(
'''    slot.classList.add("is-closing");\n    slot.classList.remove("is-open", "is-settled");\n''',
'''    slot.classList.add("is-closing");\n    slot.classList.remove("is-open", "is-settled", "is-opening");\n''', 1)

js = js.replace(
'''  const toggleGroup = async (name) => {\n    if (!groups[name]) return;\n    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n''',
'''  const toggleGroup = async (name) => {\n    if (!groups[name]) return;\n    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n    stabilizeWorkshopBackground();\n''', 1)

js = js.replace('''    renderDetail(name, activeIndex[name], 0);\n    const opened = await openSlot(name, token);\n''', '''    const opened = await openSlot(name, token);\n''', 1)
js = js.replace('''    if (!reduceMotion) await wait(36);\n    if (token === interactionToken) await gentlyAlignOpenContent(name);\n''', '''    await nextFrame();\n    if (token === interactionToken) await gentlyAlignOpenContent(name);\n''', 1)

bottom_old = '''  Object.keys(groups).forEach((name) => {\n    setSlotImmediate(name, false);\n    buildCarouselControls(name);\n    renderDetail(name, 0, 0);\n  });\n  syncCollectionState();\n})();'''
bottom_new = '''  Object.keys(groups).forEach((name) => {\n    setSlotImmediate(name, false);\n    buildCarousel(name);\n  });\n\n  let resizeTimer = 0;\n  window.addEventListener("resize", () => {\n    window.clearTimeout(resizeTimer);\n    resizeTimer = window.setTimeout(() => {\n      if (!openGroupName) {\n        workshopBackgroundFrozen = false;\n        stabilizeWorkshopBackground(true);\n      }\n      Object.keys(groups).forEach((name) => {\n        if (!slots[name].hidden) refreshCarouselMetrics(name, true);\n      });\n    }, 120);\n  }, { passive: true });\n\n  syncCollectionState();\n})();'''
if bottom_old not in js:
    raise SystemExit('JS footer anchor missing')
js = js.replace(bottom_old, bottom_new, 1)

# CSS: freeze Workshop gradient size once JS provides the baseline height.
css = css.replace(
'''/* Unified interaction timing: same calm response for both outer practice cards. */\n''',
'''/* Keep the Workshop gradient mapped to its closed-state height so opening content\n   never changes the apparent page luminance on mobile Safari/Chrome. */\n.workshop-view {\n  background-size: 100% var(--workshop-bg-height, 100%) !important;\n  background-repeat: no-repeat !important;\n  background-position: 0 0 !important;\n  background-color: #08151f !important;\n}\n\n/* Unified interaction timing: same calm response for both outer practice cards. */\n''', 1)

inner_start = css.index('.practice-explorer-slot-inner,')
inner_end = css.index('.practice-explorer {', inner_start)
new_inner = r'''.practice-explorer-slot-inner,
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

.practice-explorer-slot.is-opening .practice-swipe-controls,
.practice-explorer-slot.is-opening .practice-carousel-viewport {
  animation: practice-surface-open 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.practice-explorer-slot.is-closing .practice-swipe-controls,
.practice-explorer-slot.is-closing .practice-carousel-viewport {
  animation: practice-surface-close 190ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes practice-surface-open {
  from { transform: translate3d(0, -4px, 0); }
  to { transform: translate3d(0, 0, 0); }
}

@keyframes practice-surface-close {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -3px, 0); }
}

'''
css = css[:inner_start] + new_inner + css[inner_end:]

slide_anim_start = css.index('.practice-detail.is-slide-next')
slide_anim_end = css.index('.practice-detail-kicker', slide_anim_start)
css = css[:slide_anim_start] + css[slide_anim_end:]

carousel_anchor = '''/* ==========================================================\n   One exercise = one complete content card\n   ========================================================== */\n'''
carousel_css = r'''/* Native-feeling horizontal rail: finger movement and card movement stay 1:1,
   then CSS scroll-snap settles on the selected program. */
.practice-carousel-viewport {
  width: min(100%, 760px);
  min-width: 0;
  margin: 0 auto;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  overflow-anchor: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
  transition: height 175ms cubic-bezier(0.22, 1, 0.36, 1);
}

.practice-carousel-viewport::-webkit-scrollbar {
  display: none;
}

.practice-carousel-viewport.is-scrolling {
  transition: none;
}

.practice-carousel-track {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.practice-carousel-slide {
  flex: 0 0 100% !important;
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  touch-action: pan-x pan-y !important;
}

.practice-swipe-arrow:disabled {
  opacity: 0.38;
  cursor: default;
  transform: none !important;
}

'''
if carousel_anchor not in css:
    raise SystemExit('CSS carousel anchor missing')
css = css.replace(carousel_anchor, carousel_css + carousel_anchor, 1)

css = css.replace(
'''  .practice-detail.is-slide-next,\n  .practice-detail.is-slide-prev,\n  .practice-detail.is-slide-refresh {\n    animation: none !important;\n  }\n\n''', '', 1)
css = css.replace(
'''  .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-open > .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-closing > .practice-explorer-slot-inner,\n''',
'''  .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-open > .practice-explorer-slot-inner,\n  .practice-explorer-slot.is-closing > .practice-explorer-slot-inner,\n  .practice-carousel-viewport,\n''', 1)

html = html.replace('workshop-integrated.css?v=5.2.0', 'workshop-integrated.css?v=5.3.0')
html = html.replace('workshop-integrated.js?v=5.2.0', 'workshop-integrated.js?v=5.3.0')

# Guardrails before writing.
required_js = [
    'const carouselState = Object.create(null);',
    'const stabilizeWorkshopBackground =',
    'const buildCarousel =',
    'scrollend',
    'refreshCarouselMetrics(name, true);',
]
for needle in required_js:
    if needle not in js:
        raise SystemExit(f'Missing JS guard: {needle}')
if 'touchend' in js or 'renderDetail(name' in js or 'buildCarouselControls' in js:
    raise SystemExit('Legacy carousel behavior remains')
if 'practice-carousel-viewport' not in css or 'scroll-snap-type: x mandatory' not in css:
    raise SystemExit('Carousel CSS missing')
if 'workshop-integrated.css?v=5.3.0' not in html or 'workshop-integrated.js?v=5.3.0' not in html:
    raise SystemExit('Cache version bump missing')

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
