from pathlib import Path

script_path = Path('script.js')
html_path = Path('index.html')
script = script_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_init = '''  if (isWorkshopLocation()) renderWorkshop(true, { restoreScroll: false });\n\n  document.addEventListener("keydown", (event) => {\n'''
new_init = '''  if (isWorkshopLocation()) {\n    renderWorkshop(true, { restoreScroll: false });\n\n    // Direct Workshop URLs enter layout during the initial document render,\n    // unlike normal in-site navigation. Rebind the Workshop once after the\n    // first paint so mobile WebKit owns the same settled layout lifecycle.\n    window.requestAnimationFrame(() => {\n      window.requestAnimationFrame(() => {\n        if (!isWorkshopLocation() || workshopView?.hidden) return;\n        workshopView.hidden = true;\n        void workshopView.offsetHeight;\n        workshopView.hidden = false;\n        void workshopView.offsetHeight;\n        settleScrollPosition(0);\n        workshopView.querySelector("[data-close-workshop]")?.focus({ preventScroll: true });\n      });\n    });\n  }\n\n  document.addEventListener("keydown", (event) => {\n'''
if old_init not in script:
    raise SystemExit('direct Workshop initialization anchor missing')
script = script.replace(old_init, new_init, 1)

html = html.replace('script.js?v=4.2.0', 'script.js?v=4.2.1')

script_path.write_text(script, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
