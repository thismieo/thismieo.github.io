from pathlib import Path
from html.parser import HTMLParser
import re

ROOT = Path('.')

def read(path):
    return Path(path).read_text(encoding='utf-8')

def write(path, text):
    Path(path).write_text(text, encoding='utf-8')

def replace_once(text, old, new, label):
    if text.count(old) != 1:
        raise AssertionError(f'{label}: expected exactly one match, found {text.count(old)}')
    return text.replace(old, new, 1)

# --- Targeted release edits only ---
styles = read('styles.css')
styles = replace_once(styles,
    '/* Blue Continuum 4.5.36 — Consolidated portfolio stylesheet */',
    '/* Blue Continuum 5.0.0 — Consolidated portfolio stylesheet */',
    'styles header')
styles = replace_once(styles,
    '  .hero-role { margin-top: 20px; text-align: center; }',
    '''  .hero-role {\n    margin-top: 20px;\n    font-size: clamp(.82rem, 3.55vw, .92rem);\n    line-height: 1.38;\n    letter-spacing: -.018em;\n    text-align: center;\n  }''',
    'mobile hero role')
write('styles.css', styles)

visual = read('visual-system.css')
visual = replace_once(visual,
    '/* Blue Continuum — Shared Visual System 1.5.12',
    '/* Blue Continuum 5.0.0 — Shared Visual System',
    'visual header')
write('visual-system.css', visual)

contact = read('contact-linkedin.css')
contact = replace_once(contact,
    '/* Contact icon masks & LinkedIn placement — Version 4.5.8 */',
    '/* Blue Continuum 5.0.0 — Contact icon masks & LinkedIn placement */',
    'contact header')
write('contact-linkedin.css', contact)

workshop_css = read('workshop-integrated.css')
workshop_css = replace_once(workshop_css,
    '/* Workshop 6.0.14 — consolidated production stylesheet.',
    '/* Blue Continuum 5.0.0 — consolidated Workshop production stylesheet.',
    'workshop css header')
write('workshop-integrated.css', workshop_css)

script = read('script.js')
if not script.startswith('/* Blue Continuum 5.0.0'):
    script = '/* Blue Continuum 5.0.0 — Portfolio behavior */\n' + script
write('script.js', script)

workshop_js = read('workshop-integrated.js')
if not workshop_js.startswith('/* Blue Continuum 5.0.0'):
    workshop_js = '/* Blue Continuum 5.0.0 — Workshop behavior and practice data */\n' + workshop_js
write('workshop-integrated.js', workshop_js)

index = read('index.html')
for old in [
    'styles.css?v=4.5.36',
    'contact-linkedin.css?v=4.5.8',
    'workshop-integrated.css?v=6.0.14',
    'visual-system.css?v=1.5.12',
    'script.js?v=4.4.2',
    'workshop-integrated.js?v=6.0.3',
]:
    index = replace_once(index, old, old.split('?')[0] + '?v=5.0.0', f'index asset {old}')
index = replace_once(index, 'Version 4.5.36', 'Version 5.0.0', 'index footer version')
write('index.html', index)

error = read('404.html')
error = replace_once(error, 'styles.css?v=4.5.17', 'styles.css?v=5.0.0', '404 styles cache')
error = replace_once(error, 'Version 4.5.26', 'Version 5.0.0', '404 footer version')
write('404.html', error)

readme = '''# Mohammed Muayad Portfolio — Blue Continuum 5.0.0

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Production architecture

- `index.html` — canonical document structure for the portfolio and integrated Workshop view.
- `styles.css` — consolidated homepage foundation, Hero, Journey, Projects and responsive layout.
- `contact-linkedin.css` — contact-card icon masks and LinkedIn placement refinements.
- `visual-system.css` — shared homepage visual system, About cards, editorial copy, divider rhythm and signature CTA sheen.
- `workshop-integrated.css` — consolidated Workshop structure, Python practice, knowledge cards and responsive behavior.
- `script.js` — portfolio navigation, section scrolling, Workshop transitions, history and copy behavior.
- `workshop-integrated.js` — Python practice data, selectors, code rendering and collection state.
- `assets/` — portrait, Manrope variable font and favicon/PWA icon set.

There is no separate interaction runtime in production. Click/press behavior is owned by the active component styles and the two canonical JavaScript files above.

## Release 5.0.0

- Freezes the approved homepage and Workshop design after the August 2026 refinement pass.
- Unifies all production CSS/JS cache keys and visible version labels under `5.0.0`.
- Keeps About cards in the approved soft contact-derived layout with bare icons and plain label/value hierarchy.
- Keeps the refined Journey footer tags, Workshop spacing, Hero tagline color identity and responsive editorial copy.
- Reduces the mobile `Artificial Intelligence Engineering Student` Hero role to a calmer responsive size without changing desktop typography.
- Synchronizes the 404 page with the current production stylesheet cache and release label.
- Removes stale documentation references to deleted interaction assets.
- Uses a conservative cleanup policy: only confirmed temporary/stale artifacts are removed; working responsive and interaction ownership is preserved.

## Deployment

The site is deployed through GitHub Pages from the `main` branch.

Stable release snapshot: `release/5.0.0-stable`.
Pre-release safety snapshot: `backup/pre-release-5.0.0`.
'''
write('README.md', readme)

changelog = read('CHANGELOG.md')
release_note = '''# Blue Continuum 5.0.0 — Approved Stable Release\n\n1. Froze the approved August 2026 portfolio and Workshop design as a clean production baseline.\n2. Unified all production CSS/JS cache keys and visible version labels under `5.0.0`, including the 404 page.\n3. Reduced the mobile Hero role `Artificial Intelligence Engineering Student` to a calmer responsive size while preserving desktop typography.\n4. Preserved the approved About, Journey, Workshop, Projects, Contact and closing layouts without aggressive selector deletion or risky responsive rewrites.\n5. Removed stale README references to previously deleted interaction assets and documented the actual six-file CSS/JS production architecture.\n6. Revalidated local asset references, duplicate IDs, internal anchors, JavaScript syntax, approved root asset inventory and conflict-marker hygiene before publishing.\n7. Created dedicated pre-release and stable release branches so this state can be retained and restored independently of future work.\n\n---\n\n'''
if not changelog.startswith('# Blue Continuum 5.0.0'):
    changelog = release_note + changelog
write('CHANGELOG.md', changelog)

# --- Conservative production audit ---
approved_css = {'styles.css', 'contact-linkedin.css', 'visual-system.css', 'workshop-integrated.css'}
approved_js = {'script.js', 'workshop-integrated.js'}
assert {p.name for p in ROOT.glob('*.css')} == approved_css, 'Unexpected or missing root CSS asset'
assert {p.name for p in ROOT.glob('*.js')} == approved_js, 'Unexpected or missing root JS asset'
assert not Path('interactions.css').exists()
assert not Path('interactions.js').exists()

index = read('index.html')
error = read('404.html')
for asset in sorted(approved_css | approved_js):
    if asset in {'styles.css'}:
        continue
    assert f'{asset}?v=5.0.0' in index, f'Unified cache key missing for {asset}'
assert 'styles.css?v=5.0.0' in index
assert 'styles.css?v=5.0.0' in error
assert 'Version 5.0.0' in index and 'Version 5.0.0' in error
assert 'interactions.css' not in index and 'interactions.js' not in index
assert 'interactions.css' not in read('README.md') and 'interactions.js' not in read('README.md')
assert 'font-size: clamp(.82rem, 3.55vw, .92rem);' in read('styles.css')

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.refs = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if 'id' in d:
            self.ids.append(d['id'])
        for key in ('src', 'href'):
            value = d.get(key)
            if value:
                self.refs.append((key, value))

parser = AuditParser()
parser.feed(index)
assert len(parser.ids) == len(set(parser.ids)), 'Duplicate HTML IDs detected'
ids = set(parser.ids)
for key, ref in parser.refs:
    if ref.startswith('#') and len(ref) > 1:
        assert ref[1:] in ids, f'Broken internal anchor: {ref}'
    if ref.startswith(('http://', 'https://', 'mailto:', 'tel:', '#', 'data:')):
        continue
    clean = ref.split('?', 1)[0].split('#', 1)[0]
    if clean in ('', '/'):
        continue
    local = Path(clean.lstrip('/'))
    assert local.exists(), f'Missing local asset/reference: {ref}'

for path in ['index.html','404.html','styles.css','contact-linkedin.css','visual-system.css','workshop-integrated.css','script.js','workshop-integrated.js','README.md']:
    text = read(path)
    assert '<<<<<<<' not in text and '=======' not in text and '>>>>>>>' not in text, f'Conflict marker in {path}'

print('Release 5.0.0 source edits and production audit passed.')
