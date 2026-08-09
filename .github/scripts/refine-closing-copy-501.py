from pathlib import Path

VERSION_OLD = '5.0.0'
VERSION_NEW = '5.0.1'

visual_path = Path('visual-system.css')
styles_path = Path('styles.css')
contact_path = Path('contact-linkedin.css')
workshop_css_path = Path('workshop-integrated.css')
index_path = Path('index.html')
error_path = Path('404.html')
readme_path = Path('README.md')
changelog_path = Path('CHANGELOG.md')

visual = visual_path.read_text(encoding='utf-8')
styles = styles_path.read_text(encoding='utf-8')
contact = contact_path.read_text(encoding='utf-8')
workshop_css = workshop_css_path.read_text(encoding='utf-8')
index = index_path.read_text(encoding='utf-8')
error = error_path.read_text(encoding='utf-8')
readme = readme_path.read_text(encoding='utf-8')
changelog = changelog_path.read_text(encoding='utf-8')

old_primary = '''.portfolio-panel .closing-message .closing-message-primary {
  max-width: 760px;
  color: #c3ccd4;
  font-size: clamp(.96rem, 1.12vw, 1.03rem);
  font-weight: 540;
  line-height: 1.76;
  letter-spacing: -.012em;
}
'''
new_primary = '''.portfolio-panel .closing-message .closing-message-primary {
  max-width: 760px;
  color: #c8d0d7;
  font-size: clamp(.99rem, 1.15vw, 1.06rem);
  font-weight: 560;
  line-height: 1.74;
  letter-spacing: -.012em;
}
'''
old_secondary = '''.portfolio-panel .closing-message .closing-message-secondary {
  max-width: 800px;
  color: #98a5b4;
  font-size: clamp(.88rem, 1.02vw, .95rem);
  font-weight: 470;
  line-height: 1.80;
  letter-spacing: -.010em;
}
'''
new_secondary = '''.portfolio-panel .closing-message .closing-message-secondary {
  max-width: 800px;
  color: #a3afbc;
  font-size: clamp(.91rem, 1.05vw, .98rem);
  font-weight: 500;
  line-height: 1.76;
  letter-spacing: -.010em;
}
'''
old_mobile_primary = '''  .portfolio-panel .closing-message .closing-message-primary {
    width: calc(100% + 16px);
    max-width: calc(100vw - 20px);
    font-size: clamp(.74rem, 3.15vw, .86rem);
    line-height: 1.60;
    letter-spacing: -.024em;
  }
'''
new_mobile_primary = '''  .portfolio-panel .closing-message .closing-message-primary {
    width: calc(100% + 16px);
    max-width: calc(100vw - 20px);
    font-size: clamp(.77rem, 3.22vw, .88rem);
    line-height: 1.58;
    letter-spacing: -.024em;
  }
'''
old_mobile_secondary = '''  .portfolio-panel .closing-message .closing-message-secondary {
    width: calc(100% + 16px);
    max-width: calc(100vw - 20px);
    font-size: clamp(.73rem, 3.08vw, .84rem);
    line-height: 1.64;
    letter-spacing: -.022em;
  }
'''
new_mobile_secondary = '''  .portfolio-panel .closing-message .closing-message-secondary {
    width: calc(100% + 16px);
    max-width: calc(100vw - 20px);
    font-size: clamp(.76rem, 3.17vw, .86rem);
    line-height: 1.62;
    letter-spacing: -.022em;
  }
'''

for old, new in [
    (old_primary, new_primary),
    (old_secondary, new_secondary),
    (old_mobile_primary, new_mobile_primary),
    (old_mobile_secondary, new_mobile_secondary),
]:
    assert old in visual, 'Expected closing-copy block missing'
    visual = visual.replace(old, new, 1)

visual = visual.replace('Shared Visual System 5.0.0', 'Shared Visual System 5.0.1', 1)
styles = styles.replace('Blue Continuum 5.0.0 — Consolidated portfolio stylesheet', 'Blue Continuum 5.0.1 — Consolidated portfolio stylesheet', 1)
contact = contact.replace('Blue Continuum 5.0.0 — Contact icon masks & LinkedIn placement', 'Blue Continuum 5.0.1 — Contact icon masks & LinkedIn placement', 1)
workshop_css = workshop_css.replace('Blue Continuum 5.0.0 — consolidated Workshop production stylesheet', 'Blue Continuum 5.0.1 — consolidated Workshop production stylesheet', 1)

# Keep all production cache keys and visible version labels unified.
index = index.replace('?v=5.0.0', '?v=5.0.1')
index = index.replace('Version 5.0.0', 'Version 5.0.1')
error = error.replace('?v=5.0.0', '?v=5.0.1')
error = error.replace('Version 5.0.0', 'Version 5.0.1')

assert '# Mohammed Muayad Portfolio — Blue Continuum 5.0.0' in readme
readme = readme.replace('# Mohammed Muayad Portfolio — Blue Continuum 5.0.0', '# Mohammed Muayad Portfolio — Blue Continuum 5.0.1', 1)
patch_note = '''## Patch 5.0.1\n\n- Improves readability of the two descriptive paragraphs beneath the closing Thank-you message with a small responsive type and weight increase.\n- Preserves the approved forced line breaks on phone and leaves the closing signoff unchanged.\n- Keeps the `release/5.0.0-stable` snapshot intact as the pre-patch approved baseline.\n\n'''
assert '## Release 5.0.0' in readme
readme = readme.replace('## Release 5.0.0', patch_note + '## Release 5.0.0', 1)

entry = '''# Blue Continuum 5.0.1 — Closing Copy Readability Patch\n\n1. Increased the two descriptive Thank-you paragraphs by a restrained amount on desktop and phone.\n2. Strengthened text weight and contrast slightly so the closing message reads more comfortably without becoming visually heavy.\n3. Preserved the approved mobile line breaks, widths, signoff treatment and overall closing hierarchy.\n4. Unified production cache keys and visible release labels under 5.0.1 while retaining the 5.0.0 stable snapshot.\n\n---\n\n'''
if not changelog.startswith('# Blue Continuum 5.0.1'):
    changelog = entry + changelog

# Final guards.
assert visual.count('closing-message-primary') >= 2
assert 'font-size: clamp(.77rem, 3.22vw, .88rem);' in visual
assert 'font-size: clamp(.76rem, 3.17vw, .86rem);' in visual
assert '?v=5.0.0' not in index
assert '?v=5.0.0' not in error
assert index.count('?v=5.0.1') == 6
assert 'Version 5.0.1' in index
assert 'Version 5.0.1' in error

visual_path.write_text(visual, encoding='utf-8')
styles_path.write_text(styles, encoding='utf-8')
contact_path.write_text(contact, encoding='utf-8')
workshop_css_path.write_text(workshop_css, encoding='utf-8')
index_path.write_text(index, encoding='utf-8')
error_path.write_text(error, encoding='utf-8')
readme_path.write_text(readme, encoding='utf-8')
changelog_path.write_text(changelog, encoding='utf-8')
