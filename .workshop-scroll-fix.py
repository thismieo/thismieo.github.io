from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    const scroller = document.scrollingElement;\n    if (scroller) scroller.scrollTop = top;\n    else window.scrollTo(0, top);\n  };\n\n  const cancelWorkshopScroll = () => {\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const smoothScrollTo = (targetY) => {\n    cancelWorkshopScroll();\n\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 220, 340);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) {\n        workshopScrollFrame = window.requestAnimationFrame(step);\n      } else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n  };\n\n  const stopNativeScroll = cancelWorkshopScroll;\n  window.addEventListener("touchstart", cancelWorkshopScroll, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopScroll, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('patched scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

old_sync = '''  const syncCollectionState = () => {\n    buttons.forEach((button) => {\n'''
new_sync = '''  const syncCollectionState = () => {\n    workshopView?.classList.toggle("has-practice-open", Boolean(openGroupName));\n    buttons.forEach((button) => {\n'''
if old_sync not in js:
    raise SystemExit('syncCollectionState anchor missing')
js = js.replace(old_sync, new_sync, 1)

old_align_call = '''    await nextFrame();\n    if (token === interactionToken) gentlyAlignOpenContent(name);\n  };\n'''
new_align_call = '''    await nextFrame();\n    await new Promise((resolve) => window.setTimeout(resolve, 48));\n    if (token === interactionToken) gentlyAlignOpenContent(name);\n  };\n'''
if old_align_call not in js:
    raise SystemExit('post-open align anchor missing')
js = js.replace(old_align_call, new_align_call, 1)

reserve_css = '''\n/* Keep enough scroll range beneath an open practice collection so even the\n   lower Archive card can align near the top of compact phone viewports.\n   The reserve lives below the closing control and disappears when closed. */\n.workshop-view.has-practice-open .workshop-main {\n  padding-bottom: calc(60px + clamp(108px, 15svh, 132px)) !important;\n}\n'''
if 'has-practice-open .workshop-main' not in css:
    css += reserve_css

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
