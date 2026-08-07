from pathlib import Path

script_path = Path('script.js')
html_path = Path('index.html')
script = script_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_init = '''  if (isWorkshopLocation()) renderWorkshop(true, { restoreScroll: false });\n\n  document.addEventListener("keydown", (event) => {\n'''
new_init = '''  if (isWorkshopLocation()) {\n    // The site already owns Workshop/portfolio scroll restoration explicitly.\n    // Disable the browser's initial-entry restoration so mobile WebKit cannot\n    // counteract a later programmatic align after expandable content opens.\n    if ("scrollRestoration" in window.history) {\n      window.history.scrollRestoration = "manual";\n    }\n    renderWorkshop(true, { restoreScroll: false });\n  }\n\n  document.addEventListener("keydown", (event) => {\n'''
if old_init not in script:
    raise SystemExit('direct Workshop initialization anchor missing')
script = script.replace(old_init, new_init, 1)

html = html.replace('script.js?v=4.2.0', 'script.js?v=4.2.1')

script_path.write_text(script, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
