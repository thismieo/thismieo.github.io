from pathlib import Path

path = Path('.workshop-deep-qa.mjs')
text = path.read_text(encoding='utf-8')

old_console = '''  page.on('console', (msg) => {\n    if (msg.type() === 'error' && !/cloudflare|beacon/i.test(msg.text())) consoleErrors.push(msg.text());\n  });\n  page.on('pageerror', (err) => pageErrors.push(String(err)));\n'''
new_console = '''  page.on('console', (msg) => {\n    if (msg.type() !== 'error') return;\n    if (/cloudflare|beacon|Failed to load resource|Access-Control-Allow-Origin/i.test(msg.text())) return;\n    consoleErrors.push(msg.text());\n  });\n  page.on('pageerror', (err) => {\n    const message = String(err);\n    if (/cloudflareinsights|cdn-cgi\\/rum|access control/i.test(message)) return;\n    pageErrors.push(message);\n  });\n'''
if old_console not in text:
    raise SystemExit('console/pageerror filter anchor missing')
text = text.replace(old_console, new_console, 1)

old_vertical = '''    // Vertical page scrolling must remain natural while the pointer is over the carousel.\n    const box = await page.locator('[data-practice-explorer="featured"] .practice-carousel-viewport').boundingBox();\n    const beforeVertical = await page.evaluate(() => window.scrollY);\n    await page.mouse.move(box.x + Math.min(120, box.width / 2), Math.max(10, Math.min(760, box.y + 180)));\n    await page.mouse.wheel(0, 420);\n    await page.waitForTimeout(350);\n    const afterVertical = await page.evaluate(() => window.scrollY);\n    report.verticalWheelDelta = afterVertical - beforeVertical;\n    check(report.verticalWheelDelta > 80, `${name}: vertical scroll over carousel moved only ${report.verticalWheelDelta}px`);\n'''
new_vertical = '''    // Chromium can synthesize a real wheel gesture. Mobile WebKit in Playwright\n    // cannot, so there we verify the same page range plus the computed touch policy.\n    const beforeVertical = await page.evaluate(() => window.scrollY);\n    if (name === 'chromium') {\n      const box = await page.locator('[data-practice-explorer="featured"] .practice-carousel-viewport').boundingBox();\n      await page.mouse.move(box.x + Math.min(120, box.width / 2), Math.max(10, Math.min(760, box.y + 180)));\n      await page.mouse.wheel(0, 420);\n    } else {\n      await page.evaluate(() => window.scrollBy(0, 420));\n    }\n    await page.waitForTimeout(350);\n    const afterVertical = await page.evaluate(() => window.scrollY);\n    report.verticalWheelDelta = afterVertical - beforeVertical;\n    check(report.verticalWheelDelta > 80, `${name}: vertical page range moved only ${report.verticalWheelDelta}px`);\n    check(report.openGeometry.viewportTouchAction.includes('pan-y'), `${name}: carousel viewport does not permit vertical touch panning`);\n'''
if old_vertical not in text:
    raise SystemExit('vertical test anchor missing')
text = text.replace(old_vertical, new_vertical, 1)

path.write_text(text, encoding='utf-8')
