from pathlib import Path

js_path = Path('workshop-integrated.js')
css_path = Path('workshop-integrated.css')
js = js_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_scroll = '''  const smoothScrollTo = (targetY) => {\n    window.scrollTo({\n      top: Math.max(0, targetY),\n      left: 0,\n      behavior: reduceMotion ? "auto" : "smooth",\n    });\n  };\n\n  const stopNativeScroll = () => {\n    window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });\n  };\n'''
new_scroll = '''  let workshopScrollFrame = 0;\n  let workshopUserInteractionEpoch = 0;\n\n  const setWorkshopScrollTop = (value) => {\n    const top = Math.max(0, value);\n    const scroller = document.scrollingElement;\n    if (scroller) scroller.scrollTop = top;\n    else window.scrollTo(0, top);\n  };\n\n  const cancelWorkshopScroll = () => {\n    if (workshopScrollFrame) window.cancelAnimationFrame(workshopScrollFrame);\n    workshopScrollFrame = 0;\n  };\n\n  const cancelWorkshopScrollFromUser = () => {\n    workshopUserInteractionEpoch += 1;\n    cancelWorkshopScroll();\n  };\n\n  const smoothScrollTo = (targetY) => {\n    cancelWorkshopScroll();\n\n    const startY = Math.max(0, window.scrollY);\n    const endY = Math.max(0, targetY);\n    const distance = endY - startY;\n\n    if (reduceMotion || Math.abs(distance) < 2) {\n      setWorkshopScrollTop(endY);\n      return;\n    }\n\n    const duration = clamp(Math.abs(distance) * 0.62, 220, 340);\n    const startedAt = performance.now();\n    const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);\n\n    const step = (now) => {\n      const progress = clamp((now - startedAt) / duration, 0, 1);\n      setWorkshopScrollTop(startY + distance * easeOut(progress));\n      if (progress < 1) {\n        workshopScrollFrame = window.requestAnimationFrame(step);\n      } else {\n        workshopScrollFrame = 0;\n        setWorkshopScrollTop(endY);\n      }\n    };\n\n    workshopScrollFrame = window.requestAnimationFrame(step);\n  };\n\n  const stopNativeScroll = cancelWorkshopScroll;\n  window.addEventListener("touchstart", cancelWorkshopScrollFromUser, { passive: true });\n  window.addEventListener("wheel", cancelWorkshopScrollFromUser, { passive: true });\n'''
if old_scroll not in js:
    raise SystemExit('scroll block missing')
js = js.replace(old_scroll, new_scroll, 1)

old_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n    smoothScrollTo(window.scrollY + rect.top - desiredTop);\n  };\n'''
new_align = '''  const gentlyAlignOpenContent = (name) => {\n    const controls = carouselState[name]?.controls;\n    if (!controls) return;\n    const desiredTop = window.innerWidth <= 700 ? 18 : 28;\n    const rect = controls.getBoundingClientRect();\n    if (Math.abs(rect.top - desiredTop) < 4) return;\n\n    const startY = window.scrollY;\n    const userEpoch = workshopUserInteractionEpoch;\n    smoothScrollTo(startY + rect.top - desiredTop);\n\n    // WebKit may briefly clamp the first scripted scroll after a direct Workshop\n    // reload while it commits the newly opened subtree into document scroll range.\n    // Only if the first motion did not start, use the browser's own smooth anchor\n    // scroll once. Any user touch/wheel after opening cancels this fallback.\n    window.setTimeout(() => {\n      if (userEpoch !== workshopUserInteractionEpoch || openGroupName !== name) return;\n      const currentRect = controls.getBoundingClientRect();\n      if (currentRect.top <= desiredTop + 36 || Math.abs(window.scrollY - startY) > 4) return;\n      controls.style.scrollMarginTop = `${desiredTop}px`;\n      controls.scrollIntoView({\n        block: "start",\n        inline: "nearest",\n        behavior: reduceMotion ? "auto" : "smooth",\n      });\n      window.setTimeout(() => controls.style.removeProperty("scroll-margin-top"), 420);\n    }, 220);\n  };\n'''
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
