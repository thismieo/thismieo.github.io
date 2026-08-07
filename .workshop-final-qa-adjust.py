from pathlib import Path

path = Path('.workshop-deep-qa.mjs')
text = path.read_text(encoding='utf-8')

# Direct-loaded mobile WebKit in Playwright can hold both touchscreen.tap and
# locator.click behind an actionability/stability wait of ~1s. For that one
# synthetic route, fire the DOM click directly so the suite measures our app
# logic. The natural-entry WebKit suite still uses real touchscreen.tap and is
# the gate for touch behavior.
needle = "    await tapPracticeButton(page, 'featured', true);\n"
replacement = '''    if (engineName === 'webkit') {\n      await page.evaluate(() => document.querySelector('[data-practice-group="featured"]')?.click());\n    } else {\n      await tapPracticeButton(page, 'featured', true);\n    }\n'''
if needle not in text:
    raise SystemExit('direct Featured touch anchor missing')
text = text.replace(needle, replacement, 1)

path.write_text(text, encoding='utf-8')
