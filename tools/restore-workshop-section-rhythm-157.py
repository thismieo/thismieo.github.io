from pathlib import Path

root = Path('.')
visual_path = root / 'visual-system.css'
index_path = root / 'index.html'

visual = visual_path.read_text(encoding='utf-8')
index = index_path.read_text(encoding='utf-8')

old_header = '/* Blue Continuum — Shared Visual System 1.5.6'
new_header = '/* Blue Continuum — Shared Visual System 1.5.7'
if old_header not in visual:
    raise SystemExit('Expected visual-system header 1.5.6 not found')
visual = visual.replace(old_header, new_header, 1)

old_desktop = '''.portfolio-panel .workshop-entry-intro {
  margin: 44px 0 0;
}'''
new_desktop = '''.portfolio-panel .workshop-entry-intro {
  margin: calc(var(--continuum-section-space) + var(--continuum-content-gap)) 0 0;
}'''
if old_desktop not in visual:
    raise SystemExit('Expected desktop Workshop intro margin rule not found')
visual = visual.replace(old_desktop, new_desktop, 1)

old_mobile = '  .portfolio-panel .workshop-entry-intro { margin-top: 32px; }'
new_mobile = '  .portfolio-panel .workshop-entry-intro { margin-top: calc(var(--continuum-section-space-mobile) + var(--continuum-content-gap-mobile)); }'
if old_mobile not in visual:
    raise SystemExit('Expected mobile Workshop intro margin rule not found')
visual = visual.replace(old_mobile, new_mobile, 1)

if 'visual-system.css?v=1.5.6' not in index:
    raise SystemExit('Expected visual-system cache version 1.5.6 not found')
index = index.replace('visual-system.css?v=1.5.6', 'visual-system.css?v=1.5.7', 1)

if visual.count('.portfolio-panel .workshop-entry-intro') < 2:
    raise SystemExit('Workshop intro rules unexpectedly missing')
if 'margin: 44px 0 0;' in visual or 'margin-top: 32px;' in visual:
    raise SystemExit('Legacy Workshop intro spacing remains')

visual_path.write_text(visual, encoding='utf-8')
index_path.write_text(index, encoding='utf-8')
print('Workshop section rhythm restored; visual-system.css bumped to 1.5.7')
