from pathlib import Path
import re

root = Path('.')
index_path = root / 'index.html'
styles_path = root / 'styles.css'

index = index_path.read_text(encoding='utf-8')
styles = styles_path.read_text(encoding='utf-8')

replacements = {
    '<div class="timeline-foot"><span>Foundation</span><strong>Logic → Code → Structure</strong></div>': '<div class="timeline-foot"><span>Foundation</span><strong>Logic · Code · Structure</strong></div>',
    '<div class="timeline-foot"><span>Data workflow</span><strong>Raw Data → Insight</strong></div>': '<div class="timeline-foot"><span>Data workflow</span><strong>Raw Data · Preparation · Insight</strong></div>',
    '<div class="timeline-foot"><span>Learning workflow</span><strong>Train → Evaluate → Predict</strong></div>': '<div class="timeline-foot"><span>Model workflow</span><strong>Train · Evaluate · Predict</strong></div>',
    '<div class="timeline-foot"><span>Representation</span><strong>Features → Networks</strong></div>': '<div class="timeline-foot"><span>Neural systems</span><strong>Features · Networks · Learning</strong></div>',
    '<div class="timeline-foot"><span>AI systems</span><strong>Context → Retrieval → Agents</strong></div>': '<div class="timeline-foot"><span>AI systems</span><strong>Context · Retrieval · Agents</strong></div>',
}

for old, new in replacements.items():
    if old not in index:
        raise SystemExit(f'Missing expected Journey footer markup: {old}')
    index = index.replace(old, new, 1)

if 'styles.css?v=4.5.34' not in index:
    raise SystemExit('Expected styles cache version 4.5.34 not found')
index = index.replace('styles.css?v=4.5.34', 'styles.css?v=4.5.35', 1)

if 'Version 4.5.34' not in index:
    raise SystemExit('Expected footer version 4.5.34 not found')
index = index.replace('Version 4.5.34', 'Version 4.5.35', 1)

if styles.startswith('/* Blue Continuum 4.5.34 — Consolidated portfolio stylesheet */'):
    styles = styles.replace('/* Blue Continuum 4.5.34 — Consolidated portfolio stylesheet */', '/* Blue Continuum 4.5.35 — Consolidated portfolio stylesheet */', 1)
else:
    raise SystemExit('Expected stylesheet header 4.5.34 not found')

new_foot_css = r'''.timeline-foot {
  --foot-label-rgb: 130, 151, 164;
  --foot-detail-rgb: var(--accent-rgb);
  position: relative;
  z-index: 2;
  min-height: 0;
  margin-top: 18px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.timeline-item.journey-stage-01 .timeline-foot { --foot-label-rgb: 112, 151, 184; --foot-detail-rgb: 110, 169, 153; }
.timeline-item.journey-stage-02 .timeline-foot { --foot-label-rgb: 181, 146, 111; --foot-detail-rgb: 105, 151, 186; }
.timeline-item.journey-stage-03 .timeline-foot { --foot-label-rgb: 151, 132, 190; --foot-detail-rgb: 184, 146, 119; }
.timeline-item.journey-stage-04 .timeline-foot { --foot-label-rgb: 181, 124, 151; --foot-detail-rgb: 151, 132, 190; }
.timeline-item.journey-stage-05 .timeline-foot { --foot-label-rgb: 185, 145, 116; --foot-detail-rgb: 108, 158, 151; }

.timeline-foot span,
.timeline-foot strong {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  min-height: 28px;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.014);
  line-height: 1.22;
  white-space: nowrap;
}

.timeline-foot span {
  color: rgba(var(--foot-label-rgb), .98);
  border: 1px solid rgba(var(--foot-label-rgb), .28);
  background: rgba(var(--foot-label-rgb), .090);
  font-size: .56rem;
  font-weight: 760;
  letter-spacing: .018em;
  text-transform: none;
}

.timeline-foot strong {
  color: rgba(var(--foot-detail-rgb), .98);
  border: 1px solid rgba(var(--foot-detail-rgb), .24);
  background: rgba(var(--foot-detail-rgb), .064);
  font-size: .60rem;
  font-weight: 690;
  letter-spacing: .006em;
  text-align: left;
}'''

pattern = re.compile(r'\.timeline-foot \{.*?\.timeline-foot strong \{.*?\n\}', re.S)
styles, count = pattern.subn(new_foot_css, styles, count=1)
if count != 1:
    raise SystemExit(f'Expected one canonical timeline-foot CSS block, replaced {count}')

old_mobile = '  .timeline-foot { margin-top: 16px; padding: 0; gap: 6px; }\n  .timeline-foot span { padding: 6px 8px; font-size: .52rem; }\n  .timeline-foot strong { padding: 6px 8px; font-size: .59rem; }'
new_mobile = '  .timeline-foot { margin-top: 16px; padding: 0; gap: 6px; }\n  .timeline-foot span,\n  .timeline-foot strong { min-height: 27px; padding: 6px 9px; }\n  .timeline-foot span { font-size: .54rem; }\n  .timeline-foot strong { font-size: .59rem; }'
if old_mobile not in styles:
    raise SystemExit('Expected mobile timeline-foot block not found')
styles = styles.replace(old_mobile, new_mobile, 1)

if 'timeline-foot span::before' in styles:
    raise SystemExit('Legacy Journey footer marker rule still present after replacement')

index_path.write_text(index, encoding='utf-8')
styles_path.write_text(styles, encoding='utf-8')
print('Journey footer badges refined; styles.css bumped to 4.5.35')
