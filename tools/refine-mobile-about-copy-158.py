from pathlib import Path

root = Path('.')
index_path = root / 'index.html'
visual_path = root / 'visual-system.css'

index = index_path.read_text(encoding='utf-8')
visual = visual_path.read_text(encoding='utf-8')

old_summary = '''          <p class="about-summary"><span class="about-summary-line"><strong>Mohammed Muayad</strong> — Based in Baghdad, Iraq</span> <span class="about-summary-line">Currently pursuing a Diploma in Artificial Intelligence Engineering at CIS College.</span> <span class="about-summary-line">Alongside my work in the private sector, <span class="about-keep-together">I’m building</span> a practical foundation across</span> <span class="about-summary-line">Python, algorithms, machine learning and modern AI technologies.</span></p>'''
new_summary = '''          <p class="about-summary"><span class="about-summary-line"><strong>Mohammed Muayad</strong> — Based in Baghdad, Iraq</span> <span class="about-summary-line">Currently pursuing a Diploma in<br class="about-mobile-break"> Artificial Intelligence Engineering at CIS College.</span> <span class="about-summary-line about-work-summary">Alongside my work in the private sector, <span class="about-keep-together">I’m building</span> a practical<br class="about-mobile-break"> foundation across Python, algorithms, machine learning<br class="about-mobile-break"><br class="about-desktop-break"> <span class="about-work-tail">and modern AI technologies.</span></span></p>'''
if old_summary not in index:
    raise SystemExit('Expected About summary markup not found')
index = index.replace(old_summary, new_summary, 1)

if 'visual-system.css?v=1.5.7' not in index:
    raise SystemExit('Expected visual-system cache 1.5.7 not found')
index = index.replace('visual-system.css?v=1.5.7', 'visual-system.css?v=1.5.8', 1)

if not visual.startswith('/* Blue Continuum — Shared Visual System 1.5.7'):
    raise SystemExit('Expected visual system 1.5.7 header not found')
visual = visual.replace('/* Blue Continuum — Shared Visual System 1.5.7', '/* Blue Continuum — Shared Visual System 1.5.8', 1)

old_base = '''.portfolio-panel .about-summary-line { display: block; }
.portfolio-panel .about-keep-together { white-space: nowrap; }
.portfolio-panel .about-summary-line:first-child {
  color: #e2e7ec;
  font-size: 1.07rem;
  font-weight: 590;
}
.portfolio-panel .about-summary-line:first-child strong { color: #f3f5f7; font-weight: 760; }
.portfolio-panel .about-summary-line:nth-child(2) { color: #c5ccd6; }
.portfolio-panel .about-summary-line:nth-child(3) { color: #adb7c5; }
.portfolio-panel .about-summary-line:nth-child(4) { color: #9faabc; }
'''
new_base = '''.portfolio-panel .about-summary-line { display: block; }
.portfolio-panel .about-mobile-break { display: none; }
.portfolio-panel .about-desktop-break { display: block; }
.portfolio-panel .about-keep-together { white-space: nowrap; }
.portfolio-panel .about-summary-line:first-child {
  color: #e2e7ec;
  font-size: 1.07rem;
  font-weight: 590;
}
.portfolio-panel .about-summary-line:first-child strong { color: #f3f5f7; font-weight: 760; }
.portfolio-panel .about-summary-line:nth-child(2) { color: #c5ccd6; }
.portfolio-panel .about-summary-line:nth-child(3) { color: #adb7c5; }
.portfolio-panel .about-work-tail { color: #9faabc; }
'''
if old_base not in visual:
    raise SystemExit('Expected base About summary CSS not found')
visual = visual.replace(old_base, new_base, 1)

old_mobile = '''  .portfolio-panel .about-summary {
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
    max-width: 100%;
    margin-bottom: 2px;
    font-size: clamp(.80rem, 4vw, .90rem);
    line-height: 1.48;
    white-space: nowrap;
  }
  .portfolio-panel .about-summary-line:nth-child(2) { max-width: 35ch; }
  .portfolio-panel .about-summary-line:nth-child(3) { max-width: 36ch; }
  .portfolio-panel .about-summary-line:nth-child(4) { max-width: 33ch; }
'''
new_mobile = '''  .portfolio-panel .about-summary {
    width: calc(100% + 16px);
    max-width: calc(100vw - 20px);
    margin: 0 auto;
    padding-inline: 0;
    color: #b8c1cd;
    font-size: clamp(.74rem, 3.15vw, .84rem);
    font-weight: 505;
    line-height: 1.50;
    letter-spacing: -.025em;
    text-align: center;
    text-wrap: nowrap;
  }

  .portfolio-panel .about-summary-line {
    width: fit-content;
    max-width: 100%;
    margin-inline: auto;
    display: block;
    white-space: nowrap;
  }

  .portfolio-panel .about-summary-line + .about-summary-line { margin-top: 8px; }
  .portfolio-panel .about-mobile-break { display: block; }
  .portfolio-panel .about-desktop-break { display: none; }
  .portfolio-panel .about-work-tail { color: inherit; }

  .portfolio-panel .about-summary-line:first-child {
    max-width: 100%;
    margin-bottom: 1px;
    font-size: inherit;
    line-height: 1.44;
    letter-spacing: -.028em;
  }

  .portfolio-panel .about-summary-line:nth-child(2) {
    max-width: 100%;
    color: #c7ced7;
    line-height: 1.48;
  }

  .portfolio-panel .about-summary-line:nth-child(3) {
    max-width: 100%;
    color: #adb8c6;
    line-height: 1.50;
  }
'''
if old_mobile not in visual:
    raise SystemExit('Expected mobile About summary CSS not found')
visual = visual.replace(old_mobile, new_mobile, 1)

if 'about-summary-line:nth-child(4)' in visual:
    raise SystemExit('Legacy fourth-line About selector remains')

index_path.write_text(index, encoding='utf-8')
visual_path.write_text(visual, encoding='utf-8')
print('Mobile About copy rhythm refined; visual-system.css bumped to 1.5.8')
