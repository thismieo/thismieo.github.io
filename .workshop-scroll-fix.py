from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n  let workshopScrollIntent = 0;\n  let workshopAlignReserve = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    const scroller = document.scrollingElement;\n    if (scroller) scroller.scrollTop = top;\n    else window.scrollTo(0, top);\n  };\n\n  const setWorkshopAlignReserve = (value) => {\n    workshopAlignReserve = Math.max(0, Math.ceil(value));\n    if (!workshopView) return;\n    if (workshopAlignReserve > 0) {\n      workshopView.style.setProperty("--practice-align-reserve", `${workshopAlignReserve}px`);\n    } else {\n      workshopView.style.removeProperty("--practice-align-reserve");\n    }\n  };\n\n  const cancelWorkshopScroll = () => {\n    workshopScrollIntent += 1;\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const smoothScrollTo = (targetY) => {\n    cancelWorkshopScroll();\n    const scrollIntent = workshopScrollIntent;\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return scrollIntent;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 220, 340);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      if (scrollIntent !== workshopScrollIntent) return;\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) {\n        workshopScrollFrame = window.requestAnimationFrame(step);\n      } else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n    return scrollIntent;\n  };\n\n  const stopNativeScroll = cancelWorkshopScroll;\n  window.addEventListener("touchstart", cancelWorkshopScroll, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopScroll, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('patched scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

old_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) state.viewport.style.height = `${height}px`;\n  };\n'''
new_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) {\n      state.viewport.style.height = `${height}px`;\n      // One post-write commit keeps active-card geometry deterministic without\n      // measuring on every scroll frame.\n      void state.viewport.offsetHeight;\n    }\n  };\n'''
if old_measure not in js:
    raise SystemExit('measureActiveCarousel anchor missing')
js = js.replace(old_measure, new_measure, 1)

old_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n    smoothScrollTo(window.scrollY + rect.top - desiredTop);\n  };\n'''
new_align = '''  const releaseWorkshopAlignReserve = async (targetY, token) => {\n    const startedAt = performance.now();\n    while (token === interactionToken && workshopAlignReserve > 0) {\n      const maxYWithReserve = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);\n      const naturalMaxY = Math.max(0, maxYWithReserve - workshopAlignReserve);\n      if (naturalMaxY >= targetY - 2) {\n        setWorkshopAlignReserve(0);\n        return;\n      }\n      if (performance.now() - startedAt >= 1600) return;\n      await new Promise((resolve) => window.setTimeout(resolve, 48));\n    }\n  };\n\n  const gentlyAlignOpenContent = (name, token) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n\n    const targetY = Math.max(0, window.scrollY + rect.top - desiredTop);\n    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);\n    const missingRange = Math.max(0, targetY - maxY + 18);\n    if (missingRange > 0) {\n      setWorkshopAlignReserve(missingRange);\n      // Commit only the temporary bottom reserve so WebKit can scroll now,\n      // rather than waiting for its delayed hidden-subtree document metrics.\n      void workshopView?.offsetHeight;\n    }\n\n    smoothScrollTo(targetY);\n    if (workshopAlignReserve > 0) void releaseWorkshopAlignReserve(targetY, token);\n  };\n'''
if old_align not in js:
    raise SystemExit('gentlyAlignOpenContent anchor missing')
js = js.replace(old_align, new_align, 1)

old_sync = '''  const syncCollectionState = () => {\n    buttons.forEach((button) => {\n'''
new_sync = '''  const syncCollectionState = () => {\n    workshopView?.classList.toggle("has-practice-open", Boolean(openGroupName));\n    buttons.forEach((button) => {\n'''
if old_sync not in js:
    raise SystemExit('syncCollectionState anchor missing')
js = js.replace(old_sync, new_sync, 1)

old_toggle = '''    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n    stopNativeScroll();\n    stabilizeWorkshopBackground();\n'''
new_toggle = '''    const token = ++interactionToken;\n    normalizeInterruptedSlots();\n    stopNativeScroll();\n    setWorkshopAlignReserve(0);\n    stabilizeWorkshopBackground();\n'''
if old_toggle not in js:
    raise SystemExit('patched toggle anchor missing')
js = js.replace(old_toggle, new_toggle, 1)

old_align_call = '''    await nextFrame();\n    if (token === interactionToken) gentlyAlignOpenContent(name);\n  };\n'''
new_align_call = '''    await nextFrame();\n    if (token === interactionToken) gentlyAlignOpenContent(name, token);\n  };\n'''
if old_align_call not in js:
    raise SystemExit('post-open align anchor missing')
js = js.replace(old_align_call, new_align_call, 1)

reserve_css = '''\n/* The permanent reserve is small and only keeps the lower Archive alignable.\n   --practice-align-reserve is computed only when an engine reports a stale\n   document scroll range, then removed as soon as natural layout catches up. */\n.workshop-view.has-practice-open .workshop-main {\n  padding-bottom: calc(60px + clamp(108px, 15svh, 132px) + var(--practice-align-reserve, 0px)) !important;\n}\n'''
if 'has-practice-open .workshop-main' not in css:
    css += reserve_css

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
