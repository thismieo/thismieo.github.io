from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n  let workshopAlignTimer = 0;\n  let workshopAlignRequest = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    window.scrollTo({ top, left: 0, behavior: "auto" });\n  };\n\n  const cancelWorkshopScroll = () => {\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const cancelWorkshopMotion = () => {\n    workshopAlignRequest += 1;\n    window.clearTimeout(workshopAlignTimer);\n    workshopAlignTimer = 0;\n    cancelWorkshopScroll();\n  };\n\n  const smoothScrollTo = (targetY) => {\n    cancelWorkshopScroll();\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 220, 340);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) workshopScrollFrame = window.requestAnimationFrame(step);\n      else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n  };\n\n  const stopNativeScroll = cancelWorkshopMotion;\n  window.addEventListener("touchstart", cancelWorkshopMotion, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopMotion, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

old_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n    smoothScrollTo(window.scrollY + rect.top - desiredTop);\n  };\n'''
new_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n\n    const absoluteTarget = Math.max(0, window.scrollY + rect.top - desiredTop);\n    const request = ++workshopAlignRequest;\n    const startedAt = performance.now();\n\n    const alignWhenScrollable = () => {\n      if (request !== workshopAlignRequest || openGroupName !== name) return;\n\n      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);\n      const rangeReady = maxScroll + 2 >= absoluteTarget;\n      const timedOut = performance.now() - startedAt >= 900;\n\n      if (rangeReady || timedOut) {\n        workshopAlignTimer = 0;\n        smoothScrollTo(Math.min(absoluteTarget, maxScroll));\n        return;\n      }\n\n      workshopAlignTimer = window.setTimeout(alignWhenScrollable, 32);\n    };\n\n    alignWhenScrollable();\n  };\n'''
if old_align not in js:
    raise SystemExit('gentlyAlignOpenContent anchor missing')
js = js.replace(old_align, new_align, 1)

old_sync = '''  const syncCollectionState = () => {\n    buttons.forEach((button) => {\n'''
new_sync = '''  const syncCollectionState = () => {\n    workshopView?.classList.toggle("has-practice-open", Boolean(openGroupName));\n    buttons.forEach((button) => {\n'''
if old_sync not in js:
    raise SystemExit('syncCollectionState anchor missing')
js = js.replace(old_sync, new_sync, 1)

reserve_css = '''\n/* Small open-state reserve keeps the lower Archive alignable on compact phones.\n   It disappears immediately when the collection closes. */\n.workshop-view.has-practice-open .workshop-main {\n  padding-bottom: calc(60px + clamp(108px, 15svh, 132px)) !important;\n}\n'''
if 'has-practice-open .workshop-main' not in css:
    css += reserve_css

js_path.write_text(js, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
