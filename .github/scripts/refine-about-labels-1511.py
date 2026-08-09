from pathlib import Path

visual_path = Path('visual-system.css')
index_path = Path('index.html')
visual = visual_path.read_text(encoding='utf-8')
index = index_path.read_text(encoding='utf-8')

assert 'Shared Visual System 1.5.10' in visual
assert 'visual-system.css?v=1.5.10' in index

old_dt = '''.portfolio-panel .facts dt {
  position: static;
  width: fit-content;
  min-height: 28px;
  margin: 0;
  padding: 6px 10px;
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(var(--accent-rgb), .18);
  border-radius: 999px;
  color: rgba(var(--accent-rgb), .98);
  background: rgba(var(--accent-rgb), .070);
  font-size: .59rem;
  font-weight: 820;
  letter-spacing: .125em;
  line-height: 1.2;
  text-transform: uppercase;
}
'''
new_dt = '''.portfolio-panel .facts dt {
  position: static;
  width: auto;
  min-height: 0;
  margin: 0;
  padding: 0;
  display: block;
  border: 0;
  border-radius: 0;
  color: rgba(var(--accent-rgb), .88);
  background: transparent;
  font-size: .60rem;
  font-weight: 770;
  letter-spacing: .055em;
  line-height: 1.25;
  text-transform: none;
}
'''
assert old_dt in visual
visual = visual.replace(old_dt, new_dt, 1)

old_mobile_dt = '''  .portfolio-panel .facts dt {
    min-height: 27px;
    padding: 6px 9px;
    font-size: .58rem;
    letter-spacing: .12em;
  }
'''
new_mobile_dt = '''  .portfolio-panel .facts dt {
    min-height: 0;
    padding: 0;
    font-size: .58rem;
    letter-spacing: .048em;
    line-height: 1.24;
  }
'''
assert old_mobile_dt in visual
visual = visual.replace(old_mobile_dt, new_mobile_dt, 1)

visual = visual.replace('Shared Visual System 1.5.10', 'Shared Visual System 1.5.11', 1)
index = index.replace('visual-system.css?v=1.5.10', 'visual-system.css?v=1.5.11', 1)

# Guard the About label rule itself without matching unrelated separators.
dt_start = visual.index('.portfolio-panel .facts dt {')
dt_end = visual.index('.portfolio-panel .facts dt::before {')
dt_css = visual[dt_start:dt_end]
assert 'border: 0;' in dt_css
assert 'border-radius: 0;' in dt_css
assert 'background: transparent;' in dt_css
assert 'text-transform: none;' in dt_css
assert 'padding: 6px 10px;' not in dt_css
assert 'border-radius: 999px;' not in dt_css

visual_path.write_text(visual, encoding='utf-8')
index_path.write_text(index, encoding='utf-8')
