from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path('qa-output')
out.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, width, height in (
        ('desktop', 1440, 1000),
        ('mobile', 390, 844),
    ):
        page = browser.new_page(
            viewport={'width': width, 'height': height},
            device_scale_factor=1,
            reduced_motion='reduce',
        )
        page.goto('http://127.0.0.1:8000/', wait_until='networkidle')
        page.evaluate("document.documentElement.style.scrollBehavior='auto'")
        page.evaluate("document.activeElement && document.activeElement.blur()")

        overflow = page.evaluate('document.documentElement.scrollWidth - window.innerWidth')
        assert overflow <= 1, f'{name}: horizontal overflow is {overflow}px'

        hero_after = page.evaluate("getComputedStyle(document.querySelector('.hero'), '::after').content")
        about_after = page.evaluate("getComputedStyle(document.querySelector('.about'), '::after').content")
        assert hero_after == 'none', f'{name}: Hero divider remains ({hero_after})'
        assert about_after == 'none', f'{name}: ABOUT divider remains ({about_after})'

        for selector in ('#about-title', '#contact-title', '#workshop-title', '#foundation-title'):
            transform = page.locator(selector).evaluate("element => getComputedStyle(element).textTransform")
            assert transform == 'capitalize', f'{name}: {selector} is not Title Case'

        last_card = page.locator('.timeline-item').last.bounding_box()
        divider = page.locator('.workshop-entry-separator-line').bounding_box()
        assert last_card and divider
        gap = divider['y'] - (last_card['y'] + last_card['height'])
        assert 18 <= gap <= 42, f'{name}: final Journey card-to-divider gap is {gap}px'

        if name == 'mobile':
            spans = page.locator('.closing-signoff span')
            assert spans.count() == 2
            first = spans.nth(0).bounding_box()
            second = spans.nth(1).bounding_box()
            assert first and second and second['y'] > first['y'], 'mobile closing sign-off is not two lines'
            font_size = page.locator('.closing-signoff').evaluate("element => parseFloat(getComputedStyle(element).fontSize)")
            assert font_size >= 14, f'mobile closing sign-off is too small ({font_size}px)'

        for section in ('about', 'journey', 'closing'):
            locator = page.locator(f'#{section}')
            locator.scroll_into_view_if_needed()
            page.wait_for_timeout(100)
            page.evaluate("document.activeElement && document.activeElement.blur()")
            locator.screenshot(path=str(out / f'{name}-{section}.png'), animations='disabled')

        page.close()
    browser.close()
