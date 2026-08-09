from pathlib import Path

root = Path('.')
index_path = root / 'index.html'
styles_path = root / 'styles.css'
workflow_path = root / '.github/workflows/apply-hero-tagline-color-4533.yml'
script_path = root / 'tools/apply-hero-tagline-color-4533.py'

index = index_path.read_text(encoding='utf-8')
styles = styles_path.read_text(encoding='utf-8')

old_tagline = '<p class="hero-tagline"><span>Building the future</span> <span>with code &amp; intelligence</span></p>'
new_tagline = '<p class="hero-tagline"><span class="hero-tagline-future">Building the future</span> <span class="hero-tagline-code">with code</span> <span class="hero-tagline-intelligence">&amp; intelligence</span></p>'

if index.count(old_tagline) != 1:
    raise SystemExit(f'Expected exactly one Hero tagline, found {index.count(old_tagline)}')
index = index.replace(old_tagline, new_tagline, 1)

anchor = '.hero-tagline span, .hero-intro span { display: inline; }\n'
color_rules = (
    '.hero-tagline span, .hero-intro span { display: inline; }\n'
    '.hero-tagline-future { color: #e2e9eb; }\n'
    '.hero-tagline-code { color: #a6bdc8; font-weight: 700; }\n'
    '.hero-tagline-intelligence { color: #c1adca; font-weight: 710; }\n'
)
if styles.count(anchor) != 1:
    raise SystemExit(f'Expected exactly one Hero tagline span anchor, found {styles.count(anchor)}')
styles = styles.replace(anchor, color_rules, 1)

if '/* Blue Continuum 4.5.32 — Consolidated portfolio stylesheet */' not in styles:
    raise SystemExit('Expected styles.css 4.5.32 header not found')
styles = styles.replace(
    '/* Blue Continuum 4.5.32 — Consolidated portfolio stylesheet */',
    '/* Blue Continuum 4.5.33 — Consolidated portfolio stylesheet */',
    1,
)

if 'styles.css?v=4.5.32' not in index:
    raise SystemExit('Expected styles.css?v=4.5.32 cache reference not found')
index = index.replace('styles.css?v=4.5.32', 'styles.css?v=4.5.33', 1)
index = index.replace('Version 4.5.32', 'Version 4.5.33')

index_path.write_text(index, encoding='utf-8')
styles_path.write_text(styles, encoding='utf-8')

# Self-clean temporary migration artifacts before the final production commit.
for path in (workflow_path, script_path):
    if path.exists():
        path.unlink()
