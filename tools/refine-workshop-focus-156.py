from pathlib import Path

repo = Path('.')
index_path = repo / 'index.html'
visual_path = repo / 'visual-system.css'
script_path = repo / 'script.js'

index = index_path.read_text(encoding='utf-8')
visual = visual_path.read_text(encoding='utf-8')
script = script_path.read_text(encoding='utf-8')

old_about = 'Alongside my work in the private sector, I’m building a practical foundation across'
new_about = 'Alongside my work in the private sector, <span class="about-keep-together">I’m building</span> a practical foundation across'
assert old_about in index, 'About summary source text not found'
index = index.replace(old_about, new_about, 1)

assert 'visual-system.css?v=1.5.5' in index, 'visual-system cache version not found'
index = index.replace('visual-system.css?v=1.5.5', 'visual-system.css?v=1.5.6', 1)
assert 'script.js?v=4.4.1' in index, 'script cache version not found'
index = index.replace('script.js?v=4.4.1', 'script.js?v=4.4.2', 1)

assert 'Shared Visual System 1.5.5' in visual, 'visual-system header version not found'
visual = visual.replace('Shared Visual System 1.5.5', 'Shared Visual System 1.5.6', 1)

old_intro = '''.portfolio-panel .workshop-entry-intro {
  margin: 54px 0 0;
}'''
new_intro = '''.portfolio-panel .workshop-entry-intro {
  margin: 44px 0 0;
}'''
assert old_intro in visual, 'desktop Workshop intro spacing block not found'
visual = visual.replace(old_intro, new_intro, 1)

old_summary_line = '.portfolio-panel .about-summary-line { display: block; }'
new_summary_line = '''.portfolio-panel .about-summary-line { display: block; }
.portfolio-panel .about-keep-together { white-space: nowrap; }'''
assert old_summary_line in visual, 'About summary line rule not found'
visual = visual.replace(old_summary_line, new_summary_line, 1)

old_mobile_first = '''  .portfolio-panel .about-summary-line:first-child {
    max-width: 31ch;
    margin-bottom: 2px;
    font-size: clamp(.99rem, 4.12vw, 1.07rem);
    line-height: 1.52;
  }'''
new_mobile_first = '''  .portfolio-panel .about-summary-line:first-child {
    max-width: 100%;
    margin-bottom: 2px;
    font-size: clamp(.80rem, 4vw, .90rem);
    line-height: 1.48;
    white-space: nowrap;
  }'''
assert old_mobile_first in visual, 'mobile About first-line block not found'
visual = visual.replace(old_mobile_first, new_mobile_first, 1)

old_mobile_intro = '  .portfolio-panel .workshop-entry-intro { margin-top: 40px; }'
new_mobile_intro = '  .portfolio-panel .workshop-entry-intro { margin-top: 32px; }'
assert old_mobile_intro in visual, 'mobile Workshop intro spacing rule not found'
visual = visual.replace(old_mobile_intro, new_mobile_intro, 1)

old_scroll = '''    const top = hash === "#home"
      ? 0
      : Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12);'''
new_scroll = '''    let top;
    if (hash === "#home") {
      top = 0;
    } else if (hash === "#workshop-gateway") {
      const intro = target.previousElementSibling?.classList.contains("workshop-entry-intro")
        ? target.previousElementSibling
        : document.querySelector(".workshop-entry-intro");
      const headerOffset = getHeaderOffset();
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top + window.scrollY;
      const targetCenter = targetTop + targetRect.height / 2;
      const viewportCenter = headerOffset + (window.innerHeight - headerOffset) / 2;
      const centeredTop = targetCenter - viewportCenter;

      if (intro) {
        const introTop = intro.getBoundingClientRect().top + window.scrollY;
        const introVisibleTop = introTop - headerOffset - 14;
        top = Math.max(0, Math.min(centeredTop, introVisibleTop));
      } else {
        top = Math.max(0, centeredTop);
      }
    } else {
      top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12);
    }'''
assert old_scroll in script, 'section scroll calculation not found'
script = script.replace(old_scroll, new_scroll, 1)

index_path.write_text(index, encoding='utf-8')
visual_path.write_text(visual, encoding='utf-8')
script_path.write_text(script, encoding='utf-8')

print('Applied Workshop focus and mobile About refinement.')
