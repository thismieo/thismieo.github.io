from pathlib import Path

root = Path('.')
index_path = root / 'index.html'
styles_path = root / 'styles.css'

index = index_path.read_text(encoding='utf-8')
styles = styles_path.read_text(encoding='utf-8')

legacy = '''.timeline-foot span {
  color: rgba(var(--foot-label-rgb), .96);
  border: 1px solid rgba(var(--foot-label-rgb), .24);
  background: rgba(var(--foot-label-rgb), .065);
  font-size: .54rem;
  font-weight: 790;
  letter-spacing: .075em;
  text-transform: uppercase;
}


.timeline-foot strong {
  color: rgba(var(--foot-flow-rgb), .98);
  border: 1px solid rgba(var(--foot-flow-rgb), .25);
  background: rgba(var(--foot-flow-rgb), .072);
  font-size: .61rem;
  font-weight: 720;
  letter-spacing: -.002em;
  text-align: left;
}

'''

if styles.count(legacy) != 1:
    raise SystemExit(f'Expected exactly one legacy Journey footer override, found {styles.count(legacy)}')
styles = styles.replace(legacy, '', 1)

if '--foot-flow-rgb' in styles:
    raise SystemExit('Legacy --foot-flow-rgb reference remains after cleanup')

if styles.startswith('/* Blue Continuum 4.5.35 — Consolidated portfolio stylesheet */'):
    styles = styles.replace('/* Blue Continuum 4.5.35 — Consolidated portfolio stylesheet */', '/* Blue Continuum 4.5.36 — Consolidated portfolio stylesheet */', 1)
else:
    raise SystemExit('Expected stylesheet header 4.5.35 not found')

if 'styles.css?v=4.5.35' not in index:
    raise SystemExit('Expected styles cache version 4.5.35 not found')
index = index.replace('styles.css?v=4.5.35', 'styles.css?v=4.5.36', 1)

if 'Version 4.5.35' not in index:
    raise SystemExit('Expected footer version 4.5.35 not found')
index = index.replace('Version 4.5.35', 'Version 4.5.36', 1)

styles_path.write_text(styles, encoding='utf-8')
index_path.write_text(index, encoding='utf-8')
print('Legacy Journey footer overrides removed; styles.css bumped to 4.5.36')
