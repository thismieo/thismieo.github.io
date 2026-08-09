from pathlib import Path

css_path = Path('styles.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_version = '4.5.28'
new_version = '4.5.29'

if f'/* Blue Continuum {old_version}' not in css:
    raise SystemExit('Expected styles version not found; no changes made.')
if f'styles.css?v={old_version}' not in html:
    raise SystemExit('Expected styles cache version not found; no changes made.')

old_badge = '''.workshop-entry-badge {
  flex: none;
  padding: 6px 9px;
  color: #bba0b3;
  border: 1px solid rgba(var(--entry-garnet-rgb), .22);
  border-radius: 999px;
  background: rgba(var(--entry-garnet-rgb), .055);
  font-size: .54rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: .09em;
  text-transform: uppercase;
  white-space: nowrap;
}'''

new_badge = '''.workshop-entry-badge {
  flex: none;
  padding: 6px 9px;
  color: #e5c8d9;
  border: 1px solid rgba(var(--entry-garnet-rgb), .34);
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgba(var(--entry-garnet-rgb), .18), rgba(var(--entry-indigo-rgb), .11));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.035),
    0 7px 18px rgba(83, 55, 86, .10),
    0 0 18px rgba(var(--entry-garnet-rgb), .045);
  font-size: .54rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: .09em;
  text-transform: uppercase;
  white-space: nowrap;
}'''

old_cta = '''.workshop-entry-cta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 11px;
}

.workshop-entry-cta .workshop-entry-badge {
  align-self: center;
  margin-bottom: 1px;
  padding: 7px 10px;
  font-size: .57rem;
}

.workshop-entry-cta-note {
  max-width: none;
  margin-inline: auto;
  color: #96a8af;
  font-size: .72rem;
  font-weight: 690;
  line-height: 1.42;
  letter-spacing: .005em;
  text-align: center;
  white-space: nowrap;
}

.workshop-entry-action {
  position: relative;
  min-width: 228px;
  min-height: 60px;
  padding: 0 20px 0 21px;
  overflow: hidden;
  isolation: isolate;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  color: #e6eef1;
  border-color: rgba(190, 207, 214, .22);
  background: linear-gradient(135deg, rgba(207, 220, 225, .105), rgba(116, 145, 158, .070));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035), 0 12px 26px rgba(0, 6, 12, .13);
  font-size: .82rem;
  font-weight: 790;
}'''

new_cta = '''.workshop-entry-cta {
  width: min(100%, 276px);
  min-width: 0;
  justify-self: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0;
}

.workshop-entry-cta .workshop-entry-badge {
  align-self: center;
  margin: 0;
  padding: 7px 11px;
  font-size: .57rem;
}

.workshop-entry-cta-note {
  max-width: 28ch;
  margin: 11px auto 0;
  color: #b9b6c9;
  font-size: .73rem;
  font-weight: 710;
  line-height: 1.42;
  letter-spacing: .002em;
  text-align: center;
  white-space: normal;
  text-wrap: balance;
}

.workshop-entry-action {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 60px;
  margin-top: 13px;
  padding: 0 20px 0 21px;
  overflow: hidden;
  isolation: isolate;
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 20px;
  color: #f1eaf0;
  border-color: rgba(var(--entry-garnet-rgb), .31);
  background:
    radial-gradient(circle at 14% 18%, rgba(196, 133, 166, .17), transparent 40%),
    linear-gradient(135deg, rgba(var(--entry-garnet-rgb), .22), rgba(var(--entry-indigo-rgb), .16) 56%, rgba(var(--entry-steel-rgb), .10));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.045),
    inset 0 0 0 1px rgba(var(--entry-indigo-rgb), .055),
    0 13px 29px rgba(48, 38, 70, .14),
    0 0 22px rgba(var(--entry-indigo-rgb), .035);
  font-size: .82rem;
  font-weight: 790;
}'''

old_hover = '''@media (hover: hover) and (pointer: fine) {
  .workshop-entry:hover {
    border-color: rgba(158, 167, 190, .27);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.032), 0 17px 40px rgba(0, 6, 12, .17);
  }
}'''

new_hover = '''@media (hover: hover) and (pointer: fine) {
  .workshop-entry:hover {
    border-color: rgba(158, 167, 190, .27);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.032), 0 17px 40px rgba(0, 6, 12, .17);
  }

  .workshop-entry-action:hover {
    color: #fff8fc;
    border-color: rgba(var(--entry-garnet-rgb), .42);
    background:
      radial-gradient(circle at 14% 18%, rgba(211, 147, 181, .22), transparent 40%),
      linear-gradient(135deg, rgba(var(--entry-garnet-rgb), .29), rgba(var(--entry-indigo-rgb), .22) 56%, rgba(var(--entry-steel-rgb), .14));
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,.055),
      inset 0 0 0 1px rgba(var(--entry-indigo-rgb), .075),
      0 17px 34px rgba(49, 37, 72, .18),
      0 0 26px rgba(var(--entry-garnet-rgb), .055);
  }
}'''

old_focus = '''.workshop-entry-action-label,
.workshop-entry-action .workshop-control-chevron {
  position: relative;
  z-index: 2;
}'''

new_focus = '''.workshop-entry-action-label,
.workshop-entry-action .workshop-control-chevron {
  position: relative;
  z-index: 2;
}

.workshop-entry-action:focus-visible {
  color: #fff8fc;
  border-color: rgba(var(--entry-garnet-rgb), .44);
  background:
    radial-gradient(circle at 14% 18%, rgba(211, 147, 181, .22), transparent 40%),
    linear-gradient(135deg, rgba(var(--entry-garnet-rgb), .29), rgba(var(--entry-indigo-rgb), .22) 56%, rgba(var(--entry-steel-rgb), .14));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.055),
    inset 0 0 0 1px rgba(var(--entry-indigo-rgb), .075),
    0 17px 34px rgba(49, 37, 72, .18),
    0 0 26px rgba(var(--entry-garnet-rgb), .055);
}'''

old_mobile_note = '''  .workshop-entry-cta-note {
    grid-area: cta-note;
    width: 100%;
    max-width: none;
    margin: 17px 0 0;
    color: #b5c3c8;
    font-size: clamp(.78rem, 3.35vw, .88rem);
    font-weight: 735;
    line-height: 1.38;
    letter-spacing: -.006em;
    text-align: center;
    white-space: normal;
  }

  .workshop-entry-action {
    grid-area: action;
    width: 100%;
    min-width: 0;
    min-height: 50px;
    margin-top: 9px;
  }'''

new_mobile_note = '''  .workshop-entry-cta-note {
    grid-area: cta-note;
    width: 100%;
    max-width: none;
    margin: 17px 0 0;
    color: #c0bacf;
    font-size: clamp(.78rem, 3.35vw, .88rem);
    font-weight: 735;
    line-height: 1.38;
    letter-spacing: -.006em;
    text-align: center;
    white-space: normal;
  }

  .workshop-entry-action {
    grid-area: action;
    width: 100%;
    min-width: 0;
    min-height: 50px;
    margin-top: 9px;
  }'''

for old, new, label in [
    (old_badge, new_badge, 'badge'),
    (old_cta, new_cta, 'cta stack'),
    (old_focus, new_focus, 'focus state'),
    (old_hover, new_hover, 'hover state'),
    (old_mobile_note, new_mobile_note, 'mobile color'),
]:
    if old not in css:
        raise SystemExit(f'Expected {label} block not found; no changes made.')
    css = css.replace(old, new, 1)

css = css.replace(f'/* Blue Continuum {old_version}', f'/* Blue Continuum {new_version}', 1)
html = html.replace(f'styles.css?v={old_version}', f'styles.css?v={new_version}', 1)
html = html.replace(f'Version {old_version}', f'Version {new_version}', 1)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
