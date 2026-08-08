from pathlib import Path
import re

# CSS brace sanity, ignoring comments and quoted strings.
for name in ['styles.css','contact-linkedin.css','workshop-integrated.css','visual-system.css','interactions.css']:
    text = Path(name).read_text(encoding='utf-8')
    depth = 0
    quote = None
    esc = False
    comment = False
    i = 0
    while i < len(text):
        c = text[i]
        n = text[i+1] if i + 1 < len(text) else ''
        if comment:
            if c == '*' and n == '/':
                comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == quote:
                quote = None
            i += 1
            continue
        if c == '/' and n == '*':
            comment = True
            i += 2
            continue
        if c in "'\"":
            quote = c
            i += 1
            continue
        if c == '{': depth += 1
        elif c == '}': depth -= 1
        if depth < 0:
            raise SystemExit(f'{name}: closing brace underflow')
        i += 1
    if depth != 0:
        raise SystemExit(f'{name}: brace depth {depth}')

html = Path('index.html').read_text(encoding='utf-8')
ids = re.findall(r'\bid=["\']([^"\']+)["\']', html)
dup = sorted({x for x in ids if ids.count(x) > 1})
if dup:
    raise SystemExit('Duplicate IDs: ' + ', '.join(dup))

workshop = Path('workshop-integrated.css').read_text(encoding='utf-8')
visual = Path('visual-system.css').read_text(encoding='utf-8')
interactions = Path('interactions.js').read_text(encoding='utf-8')

checks = [
    ('Foundation nth-child regression removed', 'workshop-grid-foundation > .knowledge-card:nth-child(' not in workshop),
    ('Foundation nth-of-type card 3 present', 'workshop-grid-foundation > .knowledge-card:nth-of-type(3)' in workshop),
    ('Foundation nth-of-type card 4 present', 'workshop-grid-foundation > .knowledge-card:nth-of-type(4)' in workshop),
    ('Legacy Foundation card pseudo divider removed', 'workshop-grid-foundation > .knowledge-card:not(:last-child)::after' not in visual),
    ('Project stroke height restored', 'height: 1px !important;' in visual and '.portfolio-panel .project-mobile-separator > span {' in visual),
    ('Workshop CTA routes to card', 'const workshopEntryAction = target.closest(".workshop-entry-action")' in interactions),
    ('Practice selector is card-like surface', '".practice-selector-card", ".knowledge-card"' in interactions),
]
for label, ok in checks:
    if not ok:
        raise SystemExit(label + ': FAILED')

print('Static regression integrity audit: OK')
