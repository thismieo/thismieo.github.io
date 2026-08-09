from pathlib import Path

css_path = Path('styles.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_version = '4.5.29'
new_version = '4.5.30'

if f'Blue Continuum {old_version}' not in css:
    raise SystemExit('Expected styles version not found; no changes made.')
if f'styles.css?v={old_version}' not in html:
    raise SystemExit('Expected styles cache reference not found; no changes made.')

replacements = {
    '  font-size: .73rem;\n  font-weight: 710;\n  line-height: 1.42;': '  font-size: .80rem;\n  font-weight: 725;\n  line-height: 1.40;',
    '  font-size: .82rem;\n  font-weight: 790;\n}': '  font-size: .89rem;\n  font-weight: 790;\n}',
    '  .workshop-entry-cta-note { font-size: .62rem; }': '  .workshop-entry-cta-note { font-size: .69rem; }',
    '  .workshop-entry-action { min-width: 194px; min-height: 52px; padding-inline: 18px 17px; gap: 18px; font-size: .73rem; }': '  .workshop-entry-action { min-width: 194px; min-height: 52px; padding-inline: 18px 17px; gap: 18px; font-size: .79rem; }',
    '    font-size: clamp(.78rem, 3.35vw, .88rem);': '    font-size: clamp(.84rem, 3.55vw, .94rem);',
    '    min-height: 50px;\n    margin-top: 9px;': '    min-height: 52px;\n    margin-top: 10px;\n    font-size: .84rem;',
}

for old, new in replacements.items():
    count = css.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one match for {old!r}, found {count}.')
    css = css.replace(old, new, 1)

css = css.replace(f'Blue Continuum {old_version}', f'Blue Continuum {new_version}', 1)
html = html.replace(f'styles.css?v={old_version}', f'styles.css?v={new_version}', 1)
html = html.replace(f'Version {old_version}', f'Version {new_version}', 1)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
