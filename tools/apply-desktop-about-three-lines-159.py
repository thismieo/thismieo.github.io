from pathlib import Path

root = Path('.')
index_path = root / 'index.html'
visual_path = root / 'visual-system.css'

index = index_path.read_text(encoding='utf-8')
visual = visual_path.read_text(encoding='utf-8')

old_break = '<br class="about-desktop-break"> '
if old_break not in index:
    raise SystemExit('Expected desktop About break not found')
index = index.replace(old_break, '', 1)

if 'visual-system.css?v=1.5.8' not in index:
    raise SystemExit('Expected visual-system cache 1.5.8 not found')
index = index.replace('visual-system.css?v=1.5.8', 'visual-system.css?v=1.5.9', 1)

if visual.startswith('/* Blue Continuum — Shared Visual System 1.5.8'):
    visual = visual.replace('/* Blue Continuum — Shared Visual System 1.5.8', '/* Blue Continuum — Shared Visual System 1.5.9', 1)
else:
    raise SystemExit('Expected visual-system header 1.5.8 not found')

for legacy in [
    '.portfolio-panel .about-desktop-break { display: block; }\n',
    '  .portfolio-panel .about-desktop-break { display: none; }\n',
]:
    visual = visual.replace(legacy, '')

if 'about-desktop-break' in index or 'about-desktop-break' in visual:
    raise SystemExit('Legacy desktop About break still present')

index_path.write_text(index, encoding='utf-8')
visual_path.write_text(visual, encoding='utf-8')
print('Desktop About restored to three lines; visual-system bumped to 1.5.9')
