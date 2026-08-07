from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
html_path = Path('index.html')

js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

# 1) Per-button copy timers and current-slide status target.
js = js.replace('  let copyTimer = 0;\n', '  const copyTimers = new WeakMap();\n', 1)

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n'''
new_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
if old_scroll not in js:
    raise SystemExit('smoothScrollTo anchor missing')
js = js.replace(old_scroll, new_scroll, 1)

# 2) Make inactive slides explicit for accessibility without changing geometry.
old_active = '''      slide.inert = !active;\n      slide.setAttribute("aria-current", active ? "true" : "false");\n'''
new_active = '''      slide.inert = !active;\n      slide.setAttribute("aria-hidden", String(!active));\n      slide.setAttribute("aria-current", active ? "true" : "false");\n'''
if old_active not in js:
    raise SystemExit('active slide anchor missing')
js = js.replace(old_active, new_active, 1)

# 3) Do not hydrate neighbouring code before the first open. It reduces hidden DOM work.
old_init = '''    // Keep the first visible card ready; warm only its neighbour in idle time.\n    hydrateSlide(name, 0);\n    warmCarouselAround(name, 0);\n'''
new_init = '''    // Keep only the first card ready before opening. Neighbours warm after reveal.\n    hydrateSlide(name, 0);\n'''
if old_init not in js:
    raise SystemExit('initial hydration anchor missing')
js = js.replace(old_init, new_init, 1)

# 4) Warm neighbours only after the active card has been measured and revealed.
old_open = '''    if (state) state.viewport.scrollLeft = carouselTargetLeft(state, activeIndex[name]);\n    measureActiveCarousel(name);\n    return true;\n'''
new_open = '''    if (state) state.viewport.scrollLeft = carouselTargetLeft(state, activeIndex[name]);\n    measureActiveCarousel(name);\n    scheduleIdle(() => {\n      if (token === interactionToken && openGroupName === name) {\n        warmCarouselAround(name, activeIndex[name]);\n      }\n    });\n    return true;\n'''
if old_open not in js:
    raise SystemExit('openSlot anchor missing')
js = js.replace(old_open, new_open, 1)

# 5) Cancel any previous native smooth scroll before a new open/close action.
old_toggle = '''    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n    stabilizeWorkshopBackground();\n\n    if (openGroupName === name) {\n      openGroupName = "";\n      syncCollectionState();\n      await closeSlot(name, token);\n      return;\n    }\n'''
new_toggle = '''    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n    stopNativeScroll();\n    stabilizeWorkshopBackground();\n\n    if (openGroupName === name) {\n      const currentCard = cardFor(name);\n      const currentTop = currentCard?.getBoundingClientRect().top ?? NaN;\n      openGroupName = "";\n      syncCollectionState();\n      await closeSlot(name, token, currentCard, currentTop);\n      return;\n    }\n'''
if old_toggle not in js:
    raise SystemExit('toggleGroup anchor missing')
js = js.replace(old_toggle, new_toggle, 1)

# 6) Copy feedback must stay with the exact visible slide and use a timer per button.
old_copy_head = '''    const value = button.dataset.code || "";\n    const owner = button.closest("[data-practice-explorer]");\n    const status = owner?.querySelector("[data-practice-copy-status]");\n'''
new_copy_head = '''    const value = button.dataset.code || "";\n    const owner = button.closest(".practice-carousel-slide");\n    const status = owner?.querySelector("[data-practice-copy-status]");\n'''
if old_copy_head not in js:
    raise SystemExit('copy owner anchor missing')
js = js.replace(old_copy_head, new_copy_head, 1)

old_copy_timer = '''    window.clearTimeout(copyTimer);\n    button.classList.add("is-copied");\n    button.querySelector("span")?.replaceChildren(document.createTextNode("Copied"));\n    if (status) status.textContent = "Code copied to clipboard";\n    copyTimer = window.setTimeout(() => {\n      button.classList.remove("is-copied");\n      button.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));\n      if (status) status.textContent = "";\n    }, 1500);\n'''
new_copy_timer = '''    const previousTimer = copyTimers.get(button);\n    if (previousTimer) window.clearTimeout(previousTimer);\n    button.classList.add("is-copied");\n    button.querySelector("span")?.replaceChildren(document.createTextNode("Copied"));\n    if (status) status.textContent = "Code copied to clipboard";\n    const timer = window.setTimeout(() => {\n      button.classList.remove("is-copied");\n      button.querySelector("span")?.replaceChildren(document.createTextNode("Copy code"));\n      if (status) status.textContent = "";\n      copyTimers.delete(button);\n    }, 1500);\n    copyTimers.set(button, timer);\n'''
if old_copy_timer not in js:
    raise SystemExit('copy timer anchor missing')
js = js.replace(old_copy_timer, new_copy_timer, 1)

# 7) Correct carousel sizing. The track already has 18px padding on both sides,
# so subtracting another 36px made cards too narrow. Also remove content-visibility:
# it returned an intrinsic 37px height before the slide entered view.
old_slide_css = '''.practice-carousel-slide {\n  flex: 0 0 calc(100% - 36px) !important;\n  width: calc(100% - 36px) !important;\n  max-width: none !important;\n  margin: 0 !important;\n  scroll-snap-align: center;\n  scroll-snap-stop: normal;\n  touch-action: auto !important;\n  content-visibility: auto;\n}\n'''
new_slide_css = '''.practice-carousel-slide {\n  flex: 0 0 100% !important;\n  width: 100% !important;\n  max-width: none !important;\n  margin: 0 !important;\n  scroll-snap-align: center;\n  scroll-snap-stop: normal;\n  touch-action: auto !important;\n}\n'''
if old_slide_css not in css:
    raise SystemExit('carousel slide CSS anchor missing')
css = css.replace(old_slide_css, new_slide_css, 1)

# 8) Cache-bust only the integrated Workshop layer.
html = html.replace('workshop-integrated.css?v=5.5.0', 'workshop-integrated.css?v=5.6.0')
html = html.replace('workshop-integrated.js?v=5.5.0', 'workshop-integrated.js?v=5.6.0')

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
