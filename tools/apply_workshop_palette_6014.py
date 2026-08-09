from pathlib import Path
import re

css_path = Path('workshop-integrated.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

EXPECTED_CSS_VERSION = '6.0.13'
NEW_VERSION = '6.0.14'

if f'/* Workshop {EXPECTED_CSS_VERSION} — consolidated production stylesheet.' not in css:
    raise SystemExit('Expected Workshop CSS version not found; no change made.')
if f'workshop-integrated.css?v={EXPECTED_CSS_VERSION}' not in html:
    raise SystemExit('Expected Workshop cache version not found; no change made.')


def update_last_block(selector: str, required_key: str, assignments: dict[str, str]):
    global css
    pattern = re.compile(re.escape(selector) + r'\s*\{([^{}]*)\}', re.S)
    matches = list(pattern.finditer(css))
    candidates = [m for m in matches if required_key in m.group(1)]
    if not candidates:
        raise SystemExit(f'Could not find block for {selector} containing {required_key}')
    match = candidates[-1]
    body = match.group(1)
    for prop, value in assignments.items():
        prop_pattern = re.compile(r'(' + re.escape(prop) + r'\s*:\s*)[^;]+;')
        body, count = prop_pattern.subn(r'\g<1>' + value + ';', body, count=1)
        if count != 1:
            raise SystemExit(f'Could not update {prop} in {selector}')
    css = css[:match.start(1)] + body + css[match.end(1):]


def update_card_palette(selector: str, accent: str, main_icon: str, surface_a: str, surface_b: str):
    update_last_block(selector, '--surface-a-rgb', {
        '--accent-rgb': accent,
        '--main-icon-rgb': main_icon,
        '--surface-a-rgb': surface_a,
        '--surface-b-rgb': surface_b,
    })


def update_badges(selector: str, label: str, value: str):
    update_last_block(selector, '--knowledge-foot-label-rgb', {
        '--knowledge-foot-label-rgb': label,
        '--knowledge-foot-value-rgb': value,
    })


def update_main_icon(selector: str, value: str):
    update_last_block(selector, '--main-icon-rgb', {'--main-icon-rgb': value})


def update_topic_icon(selector: str, value: str):
    update_last_block(selector, '--topic-icon-rgb', {'--topic-icon-rgb': value})


# Surface + title palette.
update_card_palette('.workshop-grid-foundation > .knowledge-card:nth-of-type(1)', '98, 181, 166', '129, 205, 189', '22, 41, 40', '8, 27, 30')
update_card_palette('.workshop-grid-foundation > .knowledge-card:nth-of-type(4)', '176, 118, 150', '206, 146, 178', '39, 28, 39', '18, 20, 31')
update_card_palette('.workshop-grid-featured > .knowledge-card:nth-of-type(1)', '174, 112, 148', '203, 141, 175', '40, 28, 40', '19, 18, 30')
update_card_palette('.workshop-grid-featured > .knowledge-card:nth-of-type(2)', '90, 161, 181', '114, 191, 210', '18, 38, 47', '7, 25, 35')
update_card_palette('.workshop-grid-featured > .knowledge-card:nth-of-type(3)', '186, 149, 96', '214, 178, 121', '42, 34, 27', '22, 24, 28')

# Badge signatures.
update_badges('.workshop-grid-foundation > .knowledge-card:nth-of-type(1)', '110, 160, 150', '126, 191, 176')
update_badges('.workshop-grid-foundation > .knowledge-card:nth-of-type(4)', '188, 127, 161', '161, 145, 203')
update_badges('.workshop-grid-featured > .knowledge-card:nth-of-type(1)', '191, 126, 162', '163, 145, 201')
update_badges('.workshop-grid-featured > .knowledge-card:nth-of-type(2)', '98, 169, 178', '117, 165, 203')
update_badges('.workshop-grid-featured > .knowledge-card:nth-of-type(3)', '193, 156, 108', '141, 177, 146')

# Main icon colors (final semantic icon layer).
update_main_icon('.workshop-grid-foundation > .knowledge-card:nth-of-type(1)', '129, 205, 189')
update_main_icon('.workshop-grid-foundation > .knowledge-card:nth-of-type(4)', '206, 146, 178')
update_main_icon('.workshop-grid-featured > .knowledge-card:nth-of-type(1)', '203, 141, 175')
update_main_icon('.workshop-grid-featured > .knowledge-card:nth-of-type(2)', '114, 191, 210')
update_main_icon('.workshop-grid-featured > .knowledge-card:nth-of-type(3)', '214, 178, 121')

# Topic icons — preserve all mask shapes; update only their colors.
topic_colors = {
    '.workshop-grid-foundation > .knowledge-card:nth-of-type(1)': ['104, 182, 188', '111, 158, 195', '181, 135, 166'],
    '.workshop-grid-foundation > .knowledge-card:nth-of-type(4)': ['193, 132, 161', '161, 146, 201', '188, 152, 113'],
    '.workshop-grid-featured > .knowledge-card:nth-of-type(1)': ['191, 129, 159', '160, 145, 199', '187, 151, 112'],
    '.workshop-grid-featured > .knowledge-card:nth-of-type(2)': ['106, 185, 188', '116, 167, 203', '135, 179, 163'],
    '.workshop-grid-featured > .knowledge-card:nth-of-type(3)': ['201, 171, 119', '140, 180, 148', '184, 134, 152'],
}
for card_selector, colors in topic_colors.items():
    for idx, value in enumerate(colors, start=1):
        update_topic_icon(f'{card_selector} .knowledge-card-topics li:nth-child({idx})', value)

# Keep version comments truthful rather than stacking another override layer.
css = css.replace('/* ---------- 6.0.11 Project-derived Workshop surfaces ---------- */', '/* ---------- 6.0.14 coordinated Workshop surfaces ---------- */', 1)
css = css.replace('/* ---------- 6.0.13 coordinated icon palette ---------- */', '/* ---------- 6.0.14 coordinated icon palette ---------- */', 1)
css = css.replace(f'/* Workshop {EXPECTED_CSS_VERSION} — consolidated production stylesheet.', f'/* Workshop {NEW_VERSION} — consolidated production stylesheet.', 1)
html = html.replace(f'workshop-integrated.css?v={EXPECTED_CSS_VERSION}', f'workshop-integrated.css?v={NEW_VERSION}', 1)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
