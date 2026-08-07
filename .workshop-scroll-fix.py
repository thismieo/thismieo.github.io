from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    const scroller = document.scrollingElement;\n    if (scroller) scroller.scrollTop = top;\n    else window.scrollTo(0, top);\n  };\n\n  const cancelWorkshopScroll = () => {\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const smoothScrollTo = (targetY) => {\n    cancelWorkshopScroll();\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 220, 340);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) workshopScrollFrame = window.requestAnimationFrame(step);\n      else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n  };\n\n  const stopNativeScroll = cancelWorkshopScroll;\n  window.addEventListener("touchstart", cancelWorkshopScroll, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopScroll, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

measure_anchor = '  const measureActiveCarousel = (name) => {\n'
slot_helper = '''  const commitOpenSlotHeight = (name) => {\n    const slot = slots[name];\n    const inner = slot?.querySelector(".practice-explorer-slot-inner");\n    if (!slot || slot.hidden || !inner) return;\n    const height = Math.ceil(inner.getBoundingClientRect().height);\n    if (height <= 0) return;\n    slot.style.setProperty("--practice-slot-height", `${height}px`);\n    void slot.offsetHeight;\n  };\n\n'''
if measure_anchor not in js:
    raise SystemExit('measureActiveCarousel function missing')
js = js.replace(measure_anchor, slot_helper + measure_anchor, 1)

old_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) state.viewport.style.height = `${height}px`;\n  };\n'''
new_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) {\n      state.viewport.style.height = `${height}px`;\n      void state.viewport.offsetHeight;\n      commitOpenSlotHeight(name);\n    }\n  };\n'''
if old_measure not in js:
    raise SystemExit('measureActiveCarousel anchor missing')
js = js.replace(old_measure, new_measure, 1)

old_set_immediate = '''  const setSlotImmediate = (name, open) => {\n    const slot = slots[name];\n    slot.style.removeProperty("height");\n'''
new_set_immediate = '''  const setSlotImmediate = (name, open) => {\n    const slot = slots[name];\n    slot.style.removeProperty("height");\n    if (!open) slot.style.removeProperty("--practice-slot-height");\n'''
if old_set_immediate not in js:
    raise SystemExit('setSlotImmediate anchor missing')
js = js.replace(old_set_immediate, new_set_immediate, 1)

old_close = '''    slot.hidden = true;\n    slot.classList.remove("is-open", "is-closing", "is-settled", "is-opening");\n'''
new_close = '''    slot.hidden = true;\n    slot.style.removeProperty("--practice-slot-height");\n    slot.classList.remove("is-open", "is-closing", "is-settled", "is-opening");\n'''
if old_close not in js:
    raise SystemExit('closeSlot anchor missing')
js = js.replace(old_close, new_close, 1)

old_sync = '''  const syncCollectionState = () => {\n    buttons.forEach((button) => {\n'''
new_sync = '''  const syncCollectionState = () => {\n    workshopView?.classList.toggle("has-practice-open", Boolean(openGroupName));\n    buttons.forEach((button) => {\n'''
if old_sync not in js:
    raise SystemExit('syncCollectionState anchor missing')
js = js.replace(old_sync, new_sync, 1)

slot_css = '''\n/* Mirrors the slot's natural open height without animation. This makes the\n   already-visible height explicit to mobile WebKit's document layout. */\n.practice-explorer-slot.is-open {\n  min-height: var(--practice-slot-height, 0px) !important;\n}\n\n/* Small open-state reserve keeps the lower Archive alignable on compact phones.\n   It disappears immediately when the collection closes. */\n.workshop-view.has-practice-open .workshop-main {\n  padding-bottom: calc(60px + clamp(108px, 15svh, 132px)) !important;\n}\n'''
if '--practice-slot-height' not in css:
    css += slot_css

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
