from pathlib import Path

html_path = Path('index.html')
css_path = Path('styles.css')

html = html_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

old_version = '4.5.27'
new_version = '4.5.28'

if f'styles.css?v={old_version}' not in html:
    raise SystemExit('Expected styles cache version not found.')
if f'Version {old_version}' not in html:
    raise SystemExit('Expected footer version not found.')
if f'/* Blue Continuum {old_version}' not in css:
    raise SystemExit('Expected stylesheet version not found.')
if 'hero-cta-workshop' in html or 'hero-cta-workshop' in css:
    raise SystemExit('Workshop hero CTA already exists.')

old_actions = '''        <div class="hero-actions">\n          <a class="hero-cta hero-cta-primary" href="#journey" data-hero-cta><span class="hero-cta-label">Explore My Journey</span><svg class="hero-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.75 4.5 12.25 10l-5.5 5.5" vector-effect="non-scaling-stroke"/></svg></a>\n          <a class="hero-cta hero-cta-secondary" href="#projects" data-hero-cta><span class="hero-cta-label">View My Projects</span><svg class="hero-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.75 4.5 12.25 10l-5.5 5.5" vector-effect="non-scaling-stroke"/></svg></a>\n        </div>'''

new_actions = '''        <div class="hero-actions">\n          <a class="hero-cta hero-cta-primary" href="#journey" data-hero-cta><span class="hero-cta-label">Explore My Journey</span><svg class="hero-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.75 4.5 12.25 10l-5.5 5.5" vector-effect="non-scaling-stroke"/></svg></a>\n          <a class="hero-cta hero-cta-secondary" href="#projects" data-hero-cta><span class="hero-cta-label">View My Projects</span><svg class="hero-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.75 4.5 12.25 10l-5.5 5.5" vector-effect="non-scaling-stroke"/></svg></a>\n          <a class="hero-cta hero-cta-workshop" href="#workshop-gateway" data-hero-cta><span class="hero-cta-label">Explore Workshop</span><svg class="hero-cta-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6.75 4.5 12.25 10l-5.5 5.5" vector-effect="non-scaling-stroke"/></svg></a>\n        </div>'''

if old_actions not in html:
    raise SystemExit('Hero action block did not match expected source.')
html = html.replace(old_actions, new_actions, 1)

old_card = '<div class="workshop-entry" data-workshop-card>'
new_card = '<div class="workshop-entry" id="workshop-gateway" data-workshop-card>'
if old_card not in html:
    raise SystemExit('Workshop entry card source did not match expected source.')
html = html.replace(old_card, new_card, 1)

old_css = '''.hero-cta-primary { color: #08141c; background: linear-gradient(135deg, #dde6e8 0%, #b1c1c6 48%, #879da6 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 -1px 0 rgba(16, 34, 43, 0.12), 0 16px 38px rgba(48, 70, 79, 0.22); }\n.hero-cta-secondary { color: #eaf1f3; background: linear-gradient(135deg, rgba(255,255,255,0.052), rgba(255,255,255,0.022)); }'''

new_css = '''.hero-cta-primary { color: #08141c; background: linear-gradient(135deg, #dde6e8 0%, #b1c1c6 48%, #879da6 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 -1px 0 rgba(16, 34, 43, 0.12), 0 16px 38px rgba(48, 70, 79, 0.22); }\n.hero-cta-secondary { color: #eaf1f3; background: linear-gradient(135deg, rgba(255,255,255,0.052), rgba(255,255,255,0.022)); }\n.hero-cta-workshop {\n  color: #eee8f2;\n  background:\n    radial-gradient(circle at 14% 18%, rgba(196, 153, 190, .13), transparent 42%),\n    linear-gradient(135deg, rgba(139, 103, 157, .28), rgba(84, 83, 132, .17));\n  box-shadow:\n    inset 0 0 0 1px rgba(190, 157, 202, .25),\n    inset 0 1px 0 rgba(255,255,255,.045),\n    0 15px 36px rgba(64, 42, 82, .18);\n}'''

if old_css not in css:
    raise SystemExit('Hero CTA palette block did not match expected source.')
css = css.replace(old_css, new_css, 1)

old_focus = '''.hero-cta-secondary:focus-visible { background: linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.034)); box-shadow: inset 0 0 0 1px rgba(209, 224, 230, 0.3), 0 18px 38px rgba(0, 6, 11, 0.2); }'''
new_focus = '''.hero-cta-secondary:focus-visible { background: linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.034)); box-shadow: inset 0 0 0 1px rgba(209, 224, 230, 0.3), 0 18px 38px rgba(0, 6, 11, 0.2); }\n.hero-cta-workshop:focus-visible {\n  background:\n    radial-gradient(circle at 14% 18%, rgba(212, 169, 205, .17), transparent 42%),\n    linear-gradient(135deg, rgba(154, 116, 172, .34), rgba(94, 92, 145, .22));\n  box-shadow:\n    inset 0 0 0 1px rgba(207, 174, 216, .34),\n    inset 0 1px 0 rgba(255,255,255,.055),\n    0 18px 42px rgba(69, 45, 88, .23);\n}'''
if old_focus not in css:
    raise SystemExit('Hero CTA focus block did not match expected source.')
css = css.replace(old_focus, new_focus, 1)

old_hover = '''@media (hover: hover) and (pointer: fine) { .hero-cta:hover { transform: translateY(-2px); } .hero-cta-primary:hover { background: linear-gradient(135deg, #e7edef 0%, #bdcbd0 48%, #92a7af 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.19), inset 0 -1px 0 rgba(16, 34, 43, 0.11), 0 18px 42px rgba(48, 70, 79, 0.27); } .hero-cta-secondary:hover { background: linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.034)); box-shadow: inset 0 0 0 1px rgba(209, 224, 230, 0.3), 0 18px 38px rgba(0, 6, 11, 0.2); } .hero-cta:hover .hero-cta-icon { transform: translateX(2px); } }'''
new_hover = '''@media (hover: hover) and (pointer: fine) { .hero-cta:hover { transform: translateY(-2px); } .hero-cta-primary:hover { background: linear-gradient(135deg, #e7edef 0%, #bdcbd0 48%, #92a7af 100%); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.19), inset 0 -1px 0 rgba(16, 34, 43, 0.11), 0 18px 42px rgba(48, 70, 79, 0.27); } .hero-cta-secondary:hover { background: linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.034)); box-shadow: inset 0 0 0 1px rgba(209, 224, 230, 0.3), 0 18px 38px rgba(0, 6, 11, 0.2); } .hero-cta-workshop:hover { background: radial-gradient(circle at 14% 18%, rgba(212, 169, 205, .17), transparent 42%), linear-gradient(135deg, rgba(154, 116, 172, .34), rgba(94, 92, 145, .22)); box-shadow: inset 0 0 0 1px rgba(207, 174, 216, .34), inset 0 1px 0 rgba(255,255,255,.055), 0 18px 42px rgba(69, 45, 88, .23); } .hero-cta:hover .hero-cta-icon { transform: translateX(2px); } }'''
if old_hover not in css:
    raise SystemExit('Hero CTA hover block did not match expected source.')
css = css.replace(old_hover, new_hover, 1)

css = css.replace(f'/* Blue Continuum {old_version}', f'/* Blue Continuum {new_version}', 1)
html = html.replace(f'styles.css?v={old_version}', f'styles.css?v={new_version}', 1)
html = html.replace(f'Version {old_version}', f'Version {new_version}', 1)

html_path.write_text(html, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
