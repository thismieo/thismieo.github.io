from pathlib import Path
import re

index_path = Path('index.html')
visual_path = Path('visual-system.css')

index = index_path.read_text(encoding='utf-8')
visual = visual_path.read_text(encoding='utf-8')

# 1) Remove the standalone divider above the Workshop editorial intro.
separator_html = '      <div class="workshop-entry-separator" aria-hidden="true"><span class="workshop-entry-separator-line"></span></div>\n'
if separator_html not in index:
    raise SystemExit('Workshop entry separator HTML target not found')
index = index.replace(separator_html, '', 1)

# 2) Refine About copy to remove the repeated student/program wording while
# preserving the four-line editorial structure used on desktop and mobile.
old_about = ('          <p class="about-summary"><span class="about-summary-line"><strong>Mohammed Muayad</strong> — Based in Baghdad, Iraq</span> '
             '<span class="about-summary-line">an AI Engineering student, currently pursuing a Diploma in Artificial Intelligence Engineering at CIS College.</span> '
             '<span class="about-summary-line">Alongside my work in the private sector, I’m developing a practical foundation in</span> '
             '<span class="about-summary-line">Python, algorithms, machine learning and modern AI technologies.</span></p>')
new_about = ('          <p class="about-summary"><span class="about-summary-line"><strong>Mohammed Muayad</strong> — Based in Baghdad, Iraq</span> '
             '<span class="about-summary-line">Currently pursuing a Diploma in Artificial Intelligence Engineering at CIS College.</span> '
             '<span class="about-summary-line">Alongside my work in the private sector, I’m building a practical foundation across</span> '
             '<span class="about-summary-line">Python, algorithms, machine learning and modern AI technologies.</span></p>')
if old_about not in index:
    raise SystemExit('About summary target not found')
index = index.replace(old_about, new_about, 1)

# 3) Bump the shared visual-system release/cache version.
if 'visual-system.css?v=1.5.4' not in index:
    raise SystemExit('visual-system cache target not found')
index = index.replace('visual-system.css?v=1.5.4', 'visual-system.css?v=1.5.5', 1)

if 'Shared Visual System 1.5.4' not in visual:
    raise SystemExit('visual-system header target not found')
visual = visual.replace('Shared Visual System 1.5.4', 'Shared Visual System 1.5.5', 1)

# 4) Remove the now-dead Workshop gateway separator CSS entirely.
separator_css = '''/* The Workshop gateway lives inside Journey, so its divider carries the
   same 36px + 36px transition rhythm as two adjacent homepage sections. */
.portfolio-panel .workshop-entry-separator {
  width: 100%;
  min-height: calc(var(--continuum-section-space) * 2);
  margin: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: none !important;
}

.portfolio-panel .workshop-entry-separator-line {
  width: var(--continuum-divider-width);
  height: 1px;
  display: block;
  border-radius: 999px;
  background: var(--continuum-divider-line) !important;
  box-shadow: var(--continuum-divider-shadow) !important;
}

'''
if separator_css not in visual:
    raise SystemExit('Desktop Workshop separator CSS target not found')
visual = visual.replace(separator_css, '', 1)

old_intro = '''.portfolio-panel .workshop-entry-intro {
  margin: 0;
}
'''
new_intro = '''.portfolio-panel .workshop-entry-intro {
  margin: 54px 0 0;
}
'''
if old_intro not in visual:
    raise SystemExit('Workshop intro spacing target not found')
visual = visual.replace(old_intro, new_intro, 1)

# Remove the early mobile separator-height rule.
early_mobile_separator = '''
  .portfolio-panel .workshop-entry-separator {
    min-height: calc(var(--continuum-section-space-mobile) * 2);
  }
'''
if early_mobile_separator not in visual:
    raise SystemExit('Early mobile separator rule not found')
visual = visual.replace(early_mobile_separator, '', 1)

# Remove separator-line from shared divider selectors and delete the obsolete
# standalone gateway background rule.
visual = visual.replace('''.portfolio-panel .about::after,
.portfolio-panel .workshop-entry-separator-line,
.portfolio-panel .project-mobile-separator > span {''', '''.portfolio-panel .about::after,
.portfolio-panel .project-mobile-separator > span {''', 1)

obsolete_bg = '''
.portfolio-panel .workshop-entry-separator {
  background: none !important;
}
'''
if obsolete_bg not in visual:
    raise SystemExit('Obsolete Workshop separator background rule not found')
visual = visual.replace(obsolete_bg, '', 1)

# 5) Rebuild mobile About typography/hierarchy without changing its card system.
old_mobile_about = '''  .portfolio-panel .about-grid { gap: 9px; }
  .portfolio-panel .about-content { display: block; max-width: 100%; }

  .portfolio-panel .about-summary {
    max-width: 36ch;
    margin: 0 auto;
    padding-inline: 2px;
    font-size: clamp(.84rem, 3.55vw, .92rem);
    line-height: 1.62;
    text-align: center;
    text-wrap: pretty;
  }

  .portfolio-panel .about-summary-line { display: block; white-space: normal; }
  .portfolio-panel .about-summary-line + .about-summary-line { margin-top: 2px; }
  .portfolio-panel .about-summary-line:first-child {
    margin-bottom: 1px;
    font-size: clamp(.91rem, 3.80vw, .99rem);
    line-height: 1.55;
  }
'''
new_mobile_about = '''  .portfolio-panel .about-grid { gap: 11px; }
  .portfolio-panel .about-content { display: block; max-width: 100%; }
  .portfolio-panel .about .eyebrow {
    font-size: .68rem;
    letter-spacing: .155em;
  }

  .portfolio-panel .about-summary {
    max-width: 100%;
    margin: 0 auto;
    padding-inline: 0;
    font-size: clamp(.90rem, 3.78vw, .98rem);
    line-height: 1.66;
    text-align: center;
    text-wrap: pretty;
  }

  .portfolio-panel .about-summary-line {
    width: fit-content;
    max-width: 100%;
    margin-inline: auto;
    display: block;
    white-space: normal;
  }
  .portfolio-panel .about-summary-line + .about-summary-line { margin-top: 5px; }
  .portfolio-panel .about-summary-line:first-child {
    max-width: 31ch;
    margin-bottom: 2px;
    font-size: clamp(.99rem, 4.12vw, 1.07rem);
    line-height: 1.52;
  }
  .portfolio-panel .about-summary-line:nth-child(2) { max-width: 35ch; }
  .portfolio-panel .about-summary-line:nth-child(3) { max-width: 36ch; }
  .portfolio-panel .about-summary-line:nth-child(4) { max-width: 33ch; }
'''
if old_mobile_about not in visual:
    raise SystemExit('Mobile About typography target not found')
visual = visual.replace(old_mobile_about, new_mobile_about, 1)

# Slightly restore breathing room before the profile cards after larger copy.
visual = visual.replace('''  .portfolio-panel .facts {
    width: 100%;
    margin: 22px auto 12px;''', '''  .portfolio-panel .facts {
    width: 100%;
    margin: 25px auto 12px;''', 1)

# Remove separator-line from the later mobile divider selector.
visual = visual.replace('''  .portfolio-panel .about::after,
  .portfolio-panel .workshop-entry-separator-line,
  .portfolio-panel .project-mobile-separator > span {''', '''  .portfolio-panel .about::after,
  .portfolio-panel .project-mobile-separator > span {''', 1)

late_mobile_separator = '''

  .portfolio-panel .workshop-entry-separator {
    min-height: calc(var(--continuum-section-space-mobile) * 2) !important;
  }
'''
if late_mobile_separator not in visual:
    raise SystemExit('Late mobile separator rule not found')
visual = visual.replace(late_mobile_separator, '', 1)

# Mobile spacing replaces the removed divider with intentional whitespace only.
mobile_anchor = '''  .portfolio-panel .section-heading-copy { max-width: 100%; }
'''
mobile_spacing = '''  .portfolio-panel .section-heading-copy { max-width: 100%; }
  .portfolio-panel .workshop-entry-intro { margin-top: 40px; }
'''
if mobile_anchor not in visual:
    raise SystemExit('Mobile Workshop intro anchor not found')
visual = visual.replace(mobile_anchor, mobile_spacing, 1)

# Final integrity checks.
if 'workshop-entry-separator' in index:
    raise SystemExit('Workshop separator HTML residue remains')
if 'workshop-entry-separator' in visual:
    raise SystemExit('Workshop separator CSS residue remains')
if 'visual-system.css?v=1.5.5' not in index:
    raise SystemExit('Visual-system cache bump missing')
if 'Shared Visual System 1.5.5' not in visual:
    raise SystemExit('Visual-system header bump missing')

index_path.write_text(index, encoding='utf-8')
visual_path.write_text(visual, encoding='utf-8')
