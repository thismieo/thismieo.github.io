from pathlib import Path

script_path = Path('script.js')
html_path = Path('index.html')
script = script_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_init = '''  if (isWorkshopLocation()) renderWorkshop(true, { restoreScroll: false });\n\n  document.addEventListener("keydown", (event) => {\n'''
new_init = '''  if (isWorkshopLocation()) {\n    renderWorkshop(true, { restoreScroll: false });\n\n    // Direct Workshop URLs skip the full-screen entry transition. Prime the\n    // revealed document once on the first paint so WebKit commits the complete\n    // Workshop layout before later expandable practice content is measured.\n    window.requestAnimationFrame(() => {\n      if (!isWorkshopLocation() || workshopView?.hidden) return;\n      const previousOverflowY = document.body.style.overflowY;\n      document.body.style.overflowY = "auto";\n      void document.body.offsetHeight;\n      void workshopView.offsetHeight;\n      if (previousOverflowY) document.body.style.overflowY = previousOverflowY;\n      else document.body.style.removeProperty("overflow-y");\n    });\n  }\n\n  document.addEventListener("keydown", (event) => {\n'''
if old_init not in script:
    raise SystemExit('direct Workshop initialization anchor missing')
script = script.replace(old_init, new_init, 1)

html = html.replace('script.js?v=4.2.0', 'script.js?v=4.2.1')

script_path.write_text(script, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
