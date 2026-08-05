from pathlib import Path

css_path = Path("styles.css")
html_path = Path("index.html")
css = css_path.read_text(encoding="utf-8")
html = html_path.read_text(encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)


css = replace_once(
    css,
    "/* Blue Continuum 4.2.5 — Consolidated portfolio stylesheet */",
    "/* Blue Continuum 4.2.6 — Consolidated portfolio stylesheet */",
    "stylesheet version",
)

css = replace_once(
    css,
    """.hero-copy > .eyebrow {
  width: fit-content;
  margin-bottom: 8px;
  padding-left: 2px;
  color: #bacacf;
  font-size: 0.7rem;
  font-weight: 730;
  letter-spacing: 0.075em;
  text-transform: none;
}

.hero-copy > .eyebrow::after {
  content: "";
  width: 28px;
  height: 1px;
  flex: 0 0 28px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(174, 196, 203, 0.72), rgba(174, 196, 203, 0));
  box-shadow: 0 0 14px rgba(145, 169, 178, 0.08);
}""",
    """.hero-copy > .eyebrow {
  width: fit-content;
  margin-bottom: 6px;
  margin-left: 8px;
  padding-left: 0;
  color: #bacacf;
  font-size: 0.7rem;
  font-weight: 730;
  letter-spacing: 0.075em;
  text-transform: none;
}

.hero-copy > .eyebrow::after {
  content: none;
  display: none;
}""",
    "hero introduction alignment",
)

css = replace_once(
    css,
    """.timeline-state {
  display: inline-flex;
  align-self: flex-start;
  margin: 24px 0 0;
  padding: 0;
  border: 0;
  color: rgb(var(--accent-rgb));
  background: transparent;
  font-size: 0.58rem;
  font-weight: 820;
  letter-spacing: 0.14em;
  line-height: 1.3;
  text-transform: uppercase;
}""",
    """.timeline-state {
  width: 100%;
  min-height: 1.3em;
  display: inline-flex;
  align-self: flex-start;
  margin: 24px 0 0;
  padding: 0;
  border: 0;
  color: rgb(var(--accent-rgb));
  background: transparent;
  font-size: 0.58rem;
  font-weight: 820;
  letter-spacing: 0.12em;
  line-height: 1.3;
  white-space: nowrap;
  text-transform: uppercase;
}""",
    "journey status typography",
)

css = replace_once(
    css,
    "  .timeline-state { margin-top: 3px; }",
    """  .timeline-state {
    margin-top: 3px;
    font-size: 0.58rem;
    font-weight: 820;
    letter-spacing: 0.12em;
    line-height: 1.3;
    white-space: nowrap;
  }""",
    "mobile journey status typography",
)

css = replace_once(
    css,
    """.workshop-entry-separator {
  min-height: 44px;
  margin-top: 12px;""",
    """.workshop-entry-separator {
  min-height: clamp(44px, 4vw, 52px);
  margin-top: 0;""",
    "desktop workshop separator spacing",
)

css = replace_once(
    css,
    """  .workshop-entry-separator {
    min-height: 44px;
    margin-top: 10px;
  }""",
    """  .workshop-entry-separator {
    min-height: 44px;
    margin-top: 0;
  }""",
    "mobile workshop separator spacing",
)

css = replace_once(
    css,
    '#closing-title {\n  --mobile-title-copy: "Thank you\\A for being here";',
    '#closing-title {\n  --mobile-title-copy: "Thank you!\\A for being here";',
    "mobile closing title",
)

html = replace_once(
    html,
    'href="styles.css?v=4.2.5"',
    'href="styles.css?v=4.2.6"',
    "stylesheet cache version",
)
html = replace_once(
    html,
    '<h2 id="closing-title"><span>Thank you</span><span>for being here</span></h2>',
    '<h2 id="closing-title"><span>Thank you!</span><span>for being here</span></h2>',
    "closing title punctuation",
)
html = replace_once(
    html,
    '<p class="footer-version">Version 4.2.5</p>',
    '<p class="footer-version">Version 4.2.6</p>',
    "footer version",
)

required_states = (
    "Currently learning",
    "Next step",
    "Upcoming",
    "Future direction",
    "Advanced direction",
)
for state in required_states:
    if html.count(f'<p class="timeline-state">{state}</p>') != 1:
        raise RuntimeError(f"timeline state missing or duplicated: {state}")

if css.count("{") != css.count("}"):
    raise RuntimeError("CSS braces are unbalanced")
if html.count("<section") != html.count("</section>"):
    raise RuntimeError("HTML section tags are unbalanced")

css_path.write_text(css, encoding="utf-8")
html_path.write_text(html, encoding="utf-8")
print("refinement=success")
