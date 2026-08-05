from pathlib import Path
import subprocess
import time

from playwright.sync_api import sync_playwright

output = Path("layout-audit")
output.mkdir(exist_ok=True)
server = subprocess.Popen(
    ["python3", "-m", "http.server", "4173", "--bind", "127.0.0.1"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)
time.sleep(1.2)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        viewports = (
            ("desktop", 1440, 1000),
            ("laptop", 1024, 900),
            ("tablet", 768, 900),
            ("mobile", 390, 844),
            ("small-mobile", 360, 800),
        )
        for name, width, height in viewports:
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto("http://127.0.0.1:4173", wait_until="networkidle")
            page.evaluate("document.fonts.ready")
            page.evaluate("document.activeElement && document.activeElement.blur()")

            checks = page.evaluate(
                """
                () => {
                  const hero = document.querySelector('.hero-copy > .eyebrow');
                  const heroTitle = document.querySelector('.hero h1');
                  const states = [...document.querySelectorAll('.timeline-state')];
                  const lastCard = document.querySelector('.timeline-item:last-child');
                  const separatorLine = document.querySelector('.workshop-entry-separator-line');
                  const workshopCard = document.querySelector('.workshop-entry');
                  const styles = states.map((el) => {
                    const s = getComputedStyle(el);
                    return {
                      fontSize: s.fontSize,
                      fontWeight: s.fontWeight,
                      letterSpacing: s.letterSpacing,
                      lineHeight: s.lineHeight,
                      textTransform: s.textTransform,
                      whiteSpace: s.whiteSpace,
                      height: el.getBoundingClientRect().height,
                    };
                  });
                  const heroBox = hero.getBoundingClientRect();
                  const titleBox = heroTitle.getBoundingClientRect();
                  const lastBox = lastCard.getBoundingClientRect();
                  const lineBox = separatorLine.getBoundingClientRect();
                  const workshopBox = workshopCard.getBoundingClientRect();
                  return {
                    overflow: document.documentElement.scrollWidth - window.innerWidth,
                    pseudoContent: getComputedStyle(hero, '::after').content,
                    heroLeftOffset: heroBox.left - titleBox.left,
                    heroCenterOffset: (heroBox.left + heroBox.width / 2) - (titleBox.left + titleBox.width / 2),
                    stateStyles: styles,
                    stateTexts: states.map((el) => el.textContent.trim()),
                    separatorTopGap: lineBox.top - lastBox.bottom,
                    separatorBottomGap: workshopBox.top - lineBox.bottom,
                    closingText: document.querySelector('#closing-title').textContent.trim(),
                    closingPseudo: getComputedStyle(document.querySelector('#closing-title'), '::after').content,
                  };
                }
                """
            )

            assert checks["overflow"] <= 1, checks
            assert checks["pseudoContent"] in ("none", "normal"), checks
            if width > 700:
                assert 5 <= checks["heroLeftOffset"] <= 12, checks
            else:
                assert abs(checks["heroCenterOffset"]) <= 2, checks

            expected_states = [
                "Currently learning",
                "Next step",
                "Upcoming",
                "Future direction",
                "Advanced direction",
            ]
            assert checks["stateTexts"] == expected_states, checks
            signature = {
                (
                    s["fontSize"],
                    s["fontWeight"],
                    s["letterSpacing"],
                    s["lineHeight"],
                    s["textTransform"],
                    s["whiteSpace"],
                )
                for s in checks["stateStyles"]
            }
            assert len(signature) == 1, checks
            assert all(s["height"] < 20 for s in checks["stateStyles"]), checks
            assert abs(checks["separatorTopGap"] - checks["separatorBottomGap"]) <= 1.5, checks
            assert checks["closingText"] == "Thank you!for being here", checks
            if width <= 700:
                assert "Thank you!" in checks["closingPseudo"], checks

            page.locator(".hero").screenshot(path=output / f"{name}-hero.png")
            page.locator("#journey").screenshot(path=output / f"{name}-journey.png")
            page.locator("#closing").screenshot(path=output / f"{name}-closing.png")

            page.locator("[data-open-workshop]").click()
            page.wait_for_timeout(500)
            assert page.evaluate("document.documentElement.scrollWidth - window.innerWidth") <= 1
            page.locator('[aria-labelledby="current-title"]').scroll_into_view_if_needed()
            page.wait_for_timeout(150)
            page.locator('[aria-labelledby="current-title"]').screenshot(
                path=output / f"{name}-workshop-current.png"
            )
            page.close()
        browser.close()
    print("audit=success")
finally:
    server.terminate()
    server.wait(timeout=5)
