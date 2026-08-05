from pathlib import Path
import re

HTML_PATH = Path('index.html')
CSS_PATH = Path('styles.css')

html = HTML_PATH.read_text(encoding='utf-8')
css = CSS_PATH.read_text(encoding='utf-8')


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly 1 match, found {count}')
    return text.replace(old, new, 1)


def regex_once(text: str, pattern: str, replacement: str, label: str, flags: int = 0) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=flags)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly 1 regex match, found {count}')
    return updated


# Version and cache refresh.
css = replace_once(
    css,
    '/* Blue Continuum 4.2.1 — Consolidated portfolio stylesheet */',
    '/* Blue Continuum 4.2.2 — Consolidated portfolio stylesheet */',
    'stylesheet version',
)
html = replace_once(html, 'href="styles.css?v=4.2.1"', 'href="styles.css?v=4.2.2"', 'stylesheet cache version')
html = replace_once(html, '<p class="footer-version">Version 4.2.0</p>', '<p class="footer-version">Version 4.2.2</p>', 'footer version')

# Closing sign-off: retain a readable font and deliberately break into two lines on phones.
html = replace_once(
    html,
    '<p>Enjoy the journey and come back to see what is built next.</p>',
    '<p class="closing-signoff"><span>Enjoy the journey</span> <span>and come back to see what is built next.</span></p>',
    'closing sign-off markup',
)

# Remove the old appended refinement block. It contained the ABOUT divider and tiny closing override.
refinement_marker = '/* Section spacing and responsive copy refinement — August 2026 */'
if refinement_marker not in css:
    raise SystemExit('previous refinement block not found')
css = css[:css.index(refinement_marker)].rstrip() + '\n'

# Remove the static divider below the Hero image/card.
hero_comment = '/* A long, static closing divider inside the bottom of the homepage hero. */'
workshop_comment = '/* Static lead-in divider above and animated closing shimmer below the Workshop card. */'
hero_start = css.find(hero_comment)
hero_end = css.find(workshop_comment)
if hero_start == -1 or hero_end == -1 or hero_end <= hero_start:
    raise SystemExit('Hero divider block boundaries were not found')
css = css[:hero_start] + css[hero_end:]

# Remove the now-obsolete mobile Hero divider sizing rule.
css = regex_once(
    css,
    r'\n\s*\.hero::after\s*\{\s*width:\s*min\(88vw,\s*340px\);\s*height:\s*44px;\s*\}\s*\n',
    '\n',
    'mobile Hero divider rule',
    flags=re.S,
)

# Keep the long ABOUT lead on one line on desktop, but place the rule beside the ABOUT styles.
about_growth_block = '''.about-lead-line-growth {
  max-width: 1000px;
  margin-top: 4px;
  color: #aebdc3;
  font-size: clamp(0.92rem, 1.02vw, 0.99rem);
  font-weight: 470;
  letter-spacing: -0.008em;
  line-height: 1.82;
}
'''
about_growth_with_desktop = about_growth_block + '''
@media (min-width: 1100px) {
  .about-lead-line-growth {
    max-width: none;
    white-space: nowrap;
    text-wrap: nowrap;
    font-size: clamp(0.86rem, 0.96vw, 0.96rem);
    letter-spacing: -0.012em;
  }
}
'''
css = replace_once(css, about_growth_block, about_growth_with_desktop, 'desktop ABOUT lead rule')

# Bring the Journey-to-Workshop divider closer to the final Advanced Direction card.
css = replace_once(
    css,
    '''.workshop-entry-separator {
  min-height: 72px;
  margin-top: 20px;''',
    '''.workshop-entry-separator {
  min-height: 44px;
  margin-top: 12px;''',
    'desktop Workshop separator spacing',
)
css = replace_once(
    css,
    '''  .workshop-entry-separator {
    min-height: 64px;
    margin-top: 18px;
  }''',
    '''  .workshop-entry-separator {
    min-height: 44px;
    margin-top: 10px;
  }''',
    'mobile Workshop separator spacing',
)

# Normalize the accidental indentation left in the previous mobile shimmer rule.
css = css.replace(
    '\n    .workshop-entry-shimmer {\n    margin-top: 32px;\n  }',
    '\n  .workshop-entry-shimmer {\n    margin-top: 32px;\n  }',
)

# Title Case for heading-like copy only; explanatory paragraphs keep normal sentence casing.
heading_rule_old = '''.hero h1,
.section-heading h2,
.contact h2,
.closing-note h2,
.workshop-hero h1,
.workshop-block-heading h2,
.error-card h1 {
  margin: 0;
  color: #f1f5f6;
  font-weight: 730;
  letter-spacing: -0.06em;
  line-height: 1.02;
}'''
heading_rule_new = '''.hero h1,
.section-heading h2,
.contact h2,
.closing-note h2,
.workshop-hero h1,
.workshop-block-heading h2,
.error-card h1 {
  margin: 0;
  color: #f1f5f6;
  font-weight: 730;
  letter-spacing: -0.06em;
  line-height: 1.02;
  text-transform: capitalize;
}

.timeline-item h3,
.project-card h3,
.workshop-card h3,
.current-track-card h3,
.workshop-entry-title {
  text-transform: capitalize;
}'''
css = replace_once(css, heading_rule_old, heading_rule_new, 'heading Title Case rule')

# Change compact section labels from ALL CAPS to Title Case in their original rules.
def transform_selector_to_capitalize(stylesheet: str, selector: str) -> str:
    pattern = rf'({re.escape(selector)}\s*\{{.*?)(text-transform:\s*)uppercase(;.*?\}})'
    updated, count = re.subn(pattern, r'\1\2capitalize\3', stylesheet, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f'Title Case transform not found for {selector}')
    return updated

for selector in (
    '.eyebrow',
    '.facts dt',
    '.timeline-state',
    '.status',
    '.project-field',
    '.workshop-entry-label',
    '.workshop-header p',
    '.workshop-updated',
    '.workshop-state',
):
    css = transform_selector_to_capitalize(css, selector)

# Readable two-line phone layout for the closing sign-off, integrated beside the original Closing rules.
closing_last_rule = '''.closing-message p:last-child {
  margin-top: 2px;
  color: #bcc9ce;
  font-weight: 560;
}
'''
closing_integrated = closing_last_rule + '''
.closing-signoff span {
  display: inline;
}

@media (max-width: 560px) {
  .closing-signoff {
    max-width: 35ch;
    font-size: 0.9rem;
    line-height: 1.76;
  }

  .closing-signoff span {
    display: block;
  }
}
'''
css = replace_once(css, closing_last_rule, closing_integrated, 'closing sign-off styles')

# Static cleanup checks: no removed divider/override or temporary QA CSS should remain.
for obsolete in (
    '.about::after',
    '.hero::after',
    refinement_marker,
    'font-size: clamp(0.64rem, 2.75vw, 0.78rem)',
):
    if obsolete in css:
        raise SystemExit(f'obsolete CSS remains: {obsolete}')

if css.count('.workshop-entry-separator {') != 2:
    raise SystemExit('unexpected Workshop separator rule count')
if css.count('{') != css.count('}'):
    raise SystemExit('CSS brace count is unbalanced')
if html.count('<section') != html.count('</section>'):
    raise SystemExit('HTML section tags are unbalanced')
if html.count('class="closing-signoff"') != 1:
    raise SystemExit('closing sign-off markup is not unique')

HTML_PATH.write_text(html, encoding='utf-8')
CSS_PATH.write_text(css, encoding='utf-8')
