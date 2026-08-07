from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n  let workshopScrollGeneration = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    const scroller = document.scrollingElement;\n    if (scroller) scroller.scrollTop = top;\n    else window.scrollTo(0, top);\n  };\n\n  const cancelWorkshopScroll = () => {\n    workshopScrollGeneration += 1;\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const smoothScrollTo = (targetY, maxDuration = 340) => {\n    cancelWorkshopScroll();\n    const generation = workshopScrollGeneration;\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return generation;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 180, maxDuration);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      if (generation !== workshopScrollGeneration) return;\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) {\n        workshopScrollFrame = window.requestAnimationFrame(step);\n      } else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n    return generation;\n  };\n\n  const stopNativeScroll = cancelWorkshopScroll;\n  window.addEventListener("touchstart", cancelWorkshopScroll, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopScroll, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('patched scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

old_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) state.viewport.style.height = `${height}px`;\n  };\n'''
new_measure = '''    const height = Math.ceil(slide.getBoundingClientRect().height);\n    if (height > 0) {\n      state.viewport.style.height = `${height}px`;\n      // One post-write commit after selecting a card; never measured per swipe frame.\n      void state.viewport.offsetHeight;\n    }\n  };\n'''
if old_measure not in js:
    raise SystemExit('measureActiveCarousel anchor missing')
js = js.replace(old_measure, new_measure, 1)

old_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n    smoothScrollTo(window.scrollY + rect.top - desiredTop);\n  };\n'''
new_align = '''  const retryClampedOpenAlignment = (name, token, desiredTop, generation, finalAttempt = false) => {\n    const delay = finalAttempt ? 120 : 360;\n    window.setTimeout(() => {\n      if (token !== interactionToken || openGroupName !== name || generation !== workshopScrollGeneration) return;\n\n      const controls = carouselState[name]?.controls;\n      if (!controls) return;\n      const rect = controls.getBoundingClientRect();\n      if (rect.top <= desiredTop + 36) return;\n\n      const targetY = Math.max(0, window.scrollY + rect.top - desiredTop);\n      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);\n      if (maxY < targetY - 2) {\n        if (!finalAttempt) retryClampedOpenAlignment(name, token, desiredTop, generation, true);\n        return;\n      }\n\n      smoothScrollTo(targetY, 220);\n    }, delay);\n  };\n\n  const gentlyAlignOpenContent = (name, token) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n\n    const targetY = Math.max(0, window.scrollY + rect.top - desiredTop);\n    const generation = smoothScrollTo(targetY);\n    retryClampedOpenAlignment(name, token, desiredTop, generation);\n  };\n'''
if old_align not in js:
    raise SystemExit('gentlyAlignOpenContent anchor missing')
js = js.replace(old_align, new_align, 1)

old_sync = '''  const syncCollectionState = () => {\n    buttons.forEach((button) => {\n'''
new_sync = '''  const syncCollectionState = () => {\n    workshopView?.classList.toggle("has-practice-open", Boolean(openGroupName));\n    buttons.forEach((button) => {\n'''
if old_sync not in js:
    raise SystemExit('syncCollectionState anchor missing')
js = js.replace(old_sync, new_sync, 1)

old_align_call = '''    await nextFrame();\n    if (token === interactionToken) gentlyAlignOpenContent(name);\n  };\n'''
new_align_call = '''    await nextFrame();\n    if (token === interactionToken) gentlyAlignOpenContent(name, token);\n  };\n'''
if old_align_call not in js:
    raise SystemExit('post-open align anchor missing')
js = js.replace(old_align_call, new_align_call, 1)

reserve_css = '''\n/* Small open-state scroll reserve keeps the lower Archive alignable on compact\n   phone viewports. It disappears immediately when the collection closes. */\n.workshop-view.has-practice-open .workshop-main {\n  padding-bottom: calc(60px + clamp(108px, 15svh, 132px)) !important;\n}\n'''
if 'has-practice-open .workshop-main' not in css:
    css += reserve_css

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
