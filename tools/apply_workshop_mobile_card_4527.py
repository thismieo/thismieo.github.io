from pathlib import Path

html_path = Path('index.html')
css_path = Path('styles.css')

html = html_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')

if 'styles.css?v=4.5.26' not in html:
    raise SystemExit('Expected styles cache version 4.5.26 not found.')
if 'Version 4.5.26' not in html:
    raise SystemExit('Expected footer version 4.5.26 not found.')
if '/* Blue Continuum 4.5.26 — Consolidated portfolio stylesheet */' not in css:
    raise SystemExit('Expected styles.css version 4.5.26 not found.')

old_note = '<span class="workshop-entry-card-note">An evolving record of practice, experiments and applied learning.</span>'
new_note = '<span class="workshop-entry-card-note"><span>An evolving record of practice</span><span>Experiments and applied learning.</span></span>'
if old_note not in html:
    raise SystemExit('Workshop entry note markup not found.')
html = html.replace(old_note, new_note, 1)

old_note_css = '''.workshop-entry-card-note {
  min-width: 0;
  max-width: 48ch;
  color: #adbac1;
  font-size: .66rem;
  font-weight: 650;
  line-height: 1.52;
  letter-spacing: .004em;
}
'''
new_note_css = old_note_css + '''
.workshop-entry-card-note > span { display: inline; }
.workshop-entry-card-note > span + span::before { content: ", "; }
'''
if old_note_css not in css:
    raise SystemExit('Base Workshop note CSS not found.')
css = css.replace(old_note_css, new_note_css, 1)

old_mobile = '''@media (max-width: 700px) {
  .workshop-entry {
    min-height: 0;
    padding: 22px 18px 20px;
    grid-template-columns: 1fr;
    gap: 20px;
    border-radius: 19px;
  }

  .workshop-entry-topline { display: block; }
  .workshop-entry-card-note { max-width: 31ch; font-size: .61rem; line-height: 1.50; }
  .workshop-entry-badge { padding: 5px 8px; font-size: .50rem; }
  .workshop-entry-title { margin-top: 15px; font-size: clamp(2.05rem, 10vw, 2.65rem); }
  .workshop-entry-copy { margin-top: 11px; font-size: .80rem; line-height: 1.70; }
  .workshop-entry-signals { margin-top: 17px; gap: 6px; }
  .workshop-entry-signal { min-height: 29px; padding: 6px 9px; font-size: .58rem; }
  .workshop-entry-signal-symbol { font-size: .57rem; }
  .workshop-entry-cta { gap: 8px; }
  .workshop-entry-cta .workshop-entry-badge { align-self: flex-start; margin-bottom: 1px; }
  .workshop-entry-cta-note { max-width: none; margin: 0; text-align: left; white-space: normal; }
  .workshop-entry-action { width: 100%; min-width: 0; min-height: 50px; }
}
'''
new_mobile = '''@media (max-width: 700px) {
  .workshop-entry {
    min-height: 0;
    padding: 20px 18px 20px;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "note badge"
      "title title"
      "copy copy"
      "signals signals"
      "cta-note cta-note"
      "action action";
    column-gap: 12px;
    row-gap: 0;
    border-radius: 19px;
  }

  .workshop-entry-main,
  .workshop-entry-cta { display: contents; }

  .workshop-entry-topline {
    grid-area: note;
    min-width: 0;
    display: block;
    align-self: start;
  }

  .workshop-entry-card-note {
    max-width: 29ch;
    display: block;
    font-size: .61rem;
    line-height: 1.46;
  }

  .workshop-entry-card-note > span { display: block; }
  .workshop-entry-card-note > span + span::before { content: none; }

  .workshop-entry-cta .workshop-entry-badge {
    grid-area: badge;
    justify-self: end;
    align-self: start;
    margin: 0;
    padding: 5px 8px;
    font-size: .50rem;
  }

  .workshop-entry-title {
    grid-area: title;
    margin-top: 11px;
    font-size: clamp(2.05rem, 10vw, 2.65rem);
  }

  .workshop-entry-copy {
    grid-area: copy;
    margin-top: 10px;
    font-size: .80rem;
    line-height: 1.70;
  }

  .workshop-entry-signals {
    grid-area: signals;
    margin-top: 16px;
    gap: 6px;
  }

  .workshop-entry-signal { min-height: 29px; padding: 6px 9px; font-size: .58rem; }
  .workshop-entry-signal-symbol { font-size: .57rem; }

  .workshop-entry-cta-note {
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
  }
}
'''
if old_mobile not in css:
    raise SystemExit('Expected mobile Workshop card block not found.')
css = css.replace(old_mobile, new_mobile, 1)

html = html.replace('styles.css?v=4.5.26', 'styles.css?v=4.5.27', 1)
html = html.replace('Version 4.5.26', 'Version 4.5.27', 1)
css = css.replace('/* Blue Continuum 4.5.26 — Consolidated portfolio stylesheet */', '/* Blue Continuum 4.5.27 — Consolidated portfolio stylesheet */', 1)

html_path.write_text(html, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
