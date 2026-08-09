from pathlib import Path

css_path = Path('styles.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_version = '4.5.30'
new_version = '4.5.31'

if f'Blue Continuum {old_version}' not in css:
    raise SystemExit('Expected styles version not found; no changes made.')
if f'styles.css?v={old_version}' not in html:
    raise SystemExit('Expected styles cache reference not found; no changes made.')

old_note = '''.workshop-entry-card-note {
  min-width: 0;
  max-width: 48ch;
  color: #adbac1;
  font-size: .66rem;
  font-weight: 650;
  line-height: 1.52;
  letter-spacing: .004em;
}'''
new_note = '''.workshop-entry-card-note {
  min-width: 0;
  max-width: 48ch;
  color: #bdc7cc;
  font-size: .72rem;
  font-weight: 685;
  line-height: 1.48;
  letter-spacing: .002em;
}'''

old_mobile = '''  .workshop-entry-card-note {
    max-width: 29ch;
    display: block;
    font-size: .61rem;
    line-height: 1.46;
  }'''
new_mobile = '''  .workshop-entry-card-note {
    max-width: 29ch;
    display: block;
    color: #c2ccd1;
    font-size: .67rem;
    font-weight: 690;
    line-height: 1.44;
  }'''

for old, new in ((old_note, new_note), (old_mobile, new_mobile)):
    count = css.count(old)
    if count != 1:
        raise SystemExit(f'Expected exactly one target block, found {count}.')
    css = css.replace(old, new, 1)

css = css.replace(f'Blue Continuum {old_version}', f'Blue Continuum {new_version}', 1)
html = html.replace(f'styles.css?v={old_version}', f'styles.css?v={new_version}', 1)
html = html.replace(f'Version {old_version}', f'Version {new_version}', 1)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
