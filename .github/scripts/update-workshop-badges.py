from pathlib import Path

html_path = Path("index.html")
css_path = Path("workshop-integrated.css")
html = html_path.read_text(encoding="utf-8")
css = css_path.read_text(encoding="utf-8")

replacements = {
    '<div class="knowledge-card-foot"><span>Core focus</span><strong>Data · Learning · Decisions</strong></div>':
        '<div class="knowledge-card-foot"><span>Model thinking</span><strong>Patterns · Learning · Prediction</strong></div>',
    '<div class="knowledge-card-foot"><span>Core focus</span><strong>Reliable data before modeling</strong></div>':
        '<div class="knowledge-card-foot"><span>Data readiness</span><strong>Collect · Clean · Prepare</strong></div>',
    '<div class="knowledge-card-foot"><span>Core focus</span><strong>Clear logic before code</strong></div>':
        '<div class="knowledge-card-foot"><span>Logic design</span><strong>Input · Steps · Output</strong></div>',
    '<div class="knowledge-card-foot"><span>Core focus</span><strong>Understanding language systems</strong></div>':
        '<div class="knowledge-card-foot"><span>Language systems</span><strong>Tokens · Context · Response</strong></div>',
    '<div class="knowledge-card-foot"><span>Applied skill</span><strong>Prompt · Response · Refinement</strong></div>':
        '<div class="knowledge-card-foot"><span>Prompt craft</span><strong>Instruction · Context · Output</strong></div>',
    '<div class="knowledge-card-foot"><span>Applied skill</span><strong>Connected AI workflows</strong></div>':
        '<div class="knowledge-card-foot"><span>Workflow design</span><strong>Trigger · Connect · Automate</strong></div>',
    '<div class="knowledge-card-foot"><span>Applied skill</span><strong>Ideas · Digital Outputs</strong></div>':
        '<div class="knowledge-card-foot"><span>Creative direction</span><strong>Idea · Generate · Refine</strong></div>',
}

for old, new in replacements.items():
    if old not in html:
        raise SystemExit(f"Expected badge markup not found: {old}")
    html = html.replace(old, new, 1)

start_marker = ".knowledge-card-foot {\n"
end_marker = "\n/* Semantic topic masks. */"
start = css.find(start_marker)
end = css.find(end_marker, start)
if start == -1 or end == -1:
    raise SystemExit("Knowledge-card footer CSS block markers not found")

new_block = r'''.knowledge-card-foot {
  --knowledge-foot-label-rgb: 124, 151, 174;
  --knowledge-foot-value-rgb: var(--accent-rgb);
  min-height: 0;
  margin-top: 1px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  border: 0;
  background: transparent;
}

/* Each card gets a distinct two-tone signature derived from its surface palette. */
.workshop-grid-foundation > .knowledge-card:nth-of-type(1) { --knowledge-foot-label-rgb: 111, 151, 181; --knowledge-foot-value-rgb: 112, 178, 162; }
.workshop-grid-foundation > .knowledge-card:nth-of-type(2) { --knowledge-foot-label-rgb: 183, 147, 109; --knowledge-foot-value-rgb: 116, 159, 194; }
.workshop-grid-foundation > .knowledge-card:nth-of-type(3) { --knowledge-foot-label-rgb: 157, 138, 195; --knowledge-foot-value-rgb: 188, 150, 108; }
.workshop-grid-foundation > .knowledge-card:nth-of-type(4) { --knowledge-foot-label-rgb: 190, 138, 104; --knowledge-foot-value-rgb: 164, 145, 201; }
.workshop-grid-featured > .knowledge-card:nth-of-type(1) { --knowledge-foot-label-rgb: 190, 125, 157; --knowledge-foot-value-rgb: 157, 143, 200; }
.workshop-grid-featured > .knowledge-card:nth-of-type(2) { --knowledge-foot-label-rgb: 93, 167, 165; --knowledge-foot-value-rgb: 112, 160, 198; }
.workshop-grid-featured > .knowledge-card:nth-of-type(3) { --knowledge-foot-label-rgb: 193, 157, 109; --knowledge-foot-value-rgb: 137, 171, 143; }

.knowledge-card-foot span,
.knowledge-card-foot strong {
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
  text-align: left;
  white-space: nowrap;
}

.knowledge-card-foot span {
  position: relative;
  padding: 6px 9px 6px 11px;
  overflow: hidden;
  color: rgba(var(--knowledge-foot-label-rgb), .98);
  border: 1px solid rgba(var(--knowledge-foot-label-rgb), .22);
  border-left-color: rgba(var(--knowledge-foot-label-rgb), .72);
  border-radius: 5px 9px 9px 5px;
  background: linear-gradient(100deg, rgba(var(--knowledge-foot-label-rgb), .105), rgba(var(--knowledge-foot-label-rgb), .035));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.018);
  font-size: .52rem;
  font-weight: 810;
  letter-spacing: .072em;
  text-transform: uppercase;
}

.knowledge-card-foot span::before {
  content: "";
  width: 3px;
  height: 13px;
  margin-right: 7px;
  flex: 0 0 3px;
  border-radius: 2px;
  background: rgba(var(--knowledge-foot-label-rgb), .82);
  box-shadow: 0 0 10px rgba(var(--knowledge-foot-label-rgb), .16);
}

.knowledge-card-foot strong {
  position: relative;
  padding: 6px 10px;
  color: rgba(var(--knowledge-foot-value-rgb), .99);
  border: 1px solid rgba(var(--knowledge-foot-value-rgb), .24);
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(var(--knowledge-foot-value-rgb), .105), rgba(var(--knowledge-foot-value-rgb), .038));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.022), 0 6px 16px rgba(0, 5, 10, .055);
  font-size: .60rem;
  font-weight: 735;
  letter-spacing: .005em;
}

.knowledge-card-foot strong::before {
  content: "";
  width: 5px;
  height: 5px;
  margin-right: 7px;
  flex: 0 0 5px;
  border: 1px solid rgba(var(--knowledge-foot-value-rgb), .70);
  border-radius: 50%;
  background: rgba(var(--knowledge-foot-value-rgb), .18);
  box-shadow: 0 0 9px rgba(var(--knowledge-foot-value-rgb), .13);
}
'''

css = css[:start] + new_block + css[end:]

if "/* Workshop 6.0.11 — consolidated production stylesheet." not in css:
    raise SystemExit("Expected Workshop CSS version header not found")
css = css.replace("/* Workshop 6.0.11 — consolidated production stylesheet.", "/* Workshop 6.0.12 — consolidated production stylesheet.", 1)

if "workshop-integrated.css?v=6.0.11" not in html:
    raise SystemExit("Expected Workshop cache version not found")
html = html.replace("workshop-integrated.css?v=6.0.11", "workshop-integrated.css?v=6.0.12", 1)

html_path.write_text(html, encoding="utf-8")
css_path.write_text(css, encoding="utf-8")
