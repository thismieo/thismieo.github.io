from pathlib import Path
import re

css_path = Path("workshop-integrated.css")
html_path = Path("index.html")
css = css_path.read_text(encoding="utf-8")
html = html_path.read_text(encoding="utf-8")

start = "/* ---------- 4.5.23 chromatic Workshop hierarchy ---------- */"
end = "/* ---------- Hover capability ---------- */"

new_block = r'''/* ---------- 6.0.11 Project-derived Workshop surfaces ---------- */
/* Foundation: Verdigris Slate, Glacier Steel, Dusty Iris, Amber Clay. */
.workshop-grid-foundation > .knowledge-card:nth-of-type(1) {
  --accent-rgb: 112, 164, 153;
  --main-icon-rgb: 132, 188, 177;
  --surface-a-rgb: 24, 43, 42;
  --surface-b-rgb: 9, 27, 32;
}
.workshop-grid-foundation > .knowledge-card:nth-of-type(2) {
  --accent-rgb: 111, 148, 181;
  --main-icon-rgb: 130, 169, 202;
  --surface-a-rgb: 22, 37, 51;
  --surface-b-rgb: 9, 24, 36;
}
.workshop-grid-foundation > .knowledge-card:nth-of-type(3) {
  --accent-rgb: 148, 134, 187;
  --main-icon-rgb: 169, 153, 208;
  --surface-a-rgb: 33, 31, 50;
  --surface-b-rgb: 15, 21, 36;
}
.workshop-grid-foundation > .knowledge-card:nth-of-type(4) {
  --accent-rgb: 181, 143, 107;
  --main-icon-rgb: 202, 162, 122;
  --surface-a-rgb: 42, 35, 30;
  --surface-b-rgb: 21, 25, 30;
}

/* Applied practice: Rose Plum, Deep Lagoon, Antique Gold. */
.workshop-grid-featured > .knowledge-card:nth-of-type(1) {
  --accent-rgb: 174, 116, 145;
  --main-icon-rgb: 197, 136, 164;
  --surface-a-rgb: 40, 29, 40;
  --surface-b-rgb: 20, 21, 31;
}
.workshop-grid-featured > .knowledge-card:nth-of-type(2) {
  --accent-rgb: 86, 154, 168;
  --main-icon-rgb: 106, 177, 190;
  --surface-a-rgb: 20, 40, 44;
  --surface-b-rgb: 8, 26, 33;
}
.workshop-grid-featured > .knowledge-card:nth-of-type(3) {
  --accent-rgb: 178, 151, 104;
  --main-icon-rgb: 200, 173, 123;
  --surface-a-rgb: 42, 36, 29;
  --surface-b-rgb: 21, 25, 29;
}

.knowledge-application-merged .knowledge-card {
  border-color: rgba(var(--accent-rgb), .24) !important;
  background:
    radial-gradient(ellipse 86% 108% at 0% 0%, rgba(var(--accent-rgb), .105), transparent 61%),
    radial-gradient(ellipse 66% 82% at 100% 100%, rgba(var(--accent-rgb), .035), transparent 72%),
    linear-gradient(148deg, rgba(var(--surface-a-rgb), .988), rgba(var(--surface-b-rgb), .996)) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.027), 0 13px 31px rgba(0, 6, 12, .12) !important;
}

.knowledge-application-merged .workshop-grid-featured > .knowledge-card {
  border-color: rgba(var(--accent-rgb), .23) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.024), 0 12px 28px rgba(0, 6, 12, .105) !important;
}

'''

pattern = re.escape(start) + r".*?" + re.escape(end)
replacement = new_block + end
css, count = re.subn(pattern, replacement, css, count=1, flags=re.S)
if count != 1:
    raise SystemExit("Workshop chromatic section markers were not found exactly once.")

css = css.replace(
    "/* Workshop 6.0.10 — consolidated production stylesheet.",
    "/* Workshop 6.0.11 — consolidated production stylesheet.",
    1,
)

old_href = "workshop-integrated.css?v=6.0.10"
new_href = "workshop-integrated.css?v=6.0.11"
if old_href not in html:
    raise SystemExit("Expected Workshop stylesheet cache version was not found.")
html = html.replace(old_href, new_href, 1)

css_path.write_text(css, encoding="utf-8")
html_path.write_text(html, encoding="utf-8")
