from __future__ import annotations

from pathlib import Path
import re
import textwrap

ROOT = Path(__file__).resolve().parents[2]
INDEX = ROOT / "index.html"
STYLES = ROOT / "styles.css"
CORE = ROOT / "styles-core-4.1.9.css"
WORKFLOW = ROOT / ".github/workflows/portfolio-cleanup.yml"
SCRIPT = Path(__file__).resolve()
VERSION = "4.2.0"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one {label}; found {count}.")
    return text.replace(old, new, 1)


def remove_once(text: str, old: str, label: str) -> str:
    return replace_once(text, old, "", label)


index = INDEX.read_text(encoding="utf-8")
wrapper = STYLES.read_text(encoding="utf-8")
core = CORE.read_text(encoding="utf-8")

# Extract the existing inline refinements so their cascade position can be preserved.
style_pattern = re.compile(
    r"\n  <style id=\"editorial-refinements\">\n(?P<css>.*?)\n  </style>\n",
    re.DOTALL,
)
match = style_pattern.search(index)
if not match:
    raise RuntimeError("The editorial-refinements style block was not found.")
inline_css = textwrap.dedent(match.group("css")).strip()
index = index[: match.start()] + "\n" + index[match.end() :]

# Make approved visible copy real HTML instead of desktop-only generated content.
index = replace_once(
    index,
    '<span class="about-title-line">Building through practice</span>',
    '<span class="about-title-line">Building through practice.</span>',
    "desktop About punctuation",
)
index = replace_once(
    index,
    '<h2 id="projects-title">Learning by building.</h2>',
    '<h2 id="projects-title">Building real projects.</h2>',
    "Projects heading copy",
)

# Version and cache-busting are kept consistent across every HTML page.
for html_path in ROOT.glob("*.html"):
    html = html_path.read_text(encoding="utf-8")
    html = re.sub(r"styles\.css\?v=[0-9.]+", f"styles.css?v={VERSION}", html)
    html = re.sub(r"script\.js\?v=[0-9.]+", f"script.js?v={VERSION}", html)
    html = re.sub(r"Version\s+[0-9.]+", f"Version {VERSION}", html)
    if html_path == INDEX:
        html = index
        html = re.sub(r"styles\.css\?v=[0-9.]+", f"styles.css?v={VERSION}", html)
        html = re.sub(r"script\.js\?v=[0-9.]+", f"script.js?v={VERSION}", html)
        html = re.sub(r"Version\s+[0-9.]+", f"Version {VERSION}", html)
    html_path.write_text(html, encoding="utf-8")

# Remove the temporary import layer.
wrapper = re.sub(
    r'^@import url\("\./styles-core-4\.1\.9\.css"\);\n\n',
    "",
    wrapper,
    count=1,
)
if wrapper.startswith("@import"):
    raise RuntimeError("The legacy stylesheet import was not removed.")

# Projects and About now use their real desktop HTML copy.
wrapper = replace_once(
    wrapper,
    "#projects-title {\n  --mobile-title-copy: \"Building real projects.\";\n  --mobile-title-size: 8.6vw;\n  font-size: 0;\n  line-height: 0;\n}",
    "#projects-title {\n  --mobile-title-copy: \"Building real projects.\";\n  --mobile-title-size: 8.6vw;\n}",
    "Projects desktop reset",
)
wrapper = remove_once(
    wrapper,
    "/* Restore the approved punctuation in the desktop About heading. */\n#about-title .about-title-line:last-child::after {\n  content: \".\";\n}\n\n",
    "generated About punctuation",
)
wrapper = remove_once(
    wrapper,
    "/* The project heading uses the approved copy on every viewport. */\n#projects-title::after {\n  content: var(--mobile-title-copy);\n  display: block;\n  color: inherit;\n  font-size: clamp(2.4rem, 4.4vw, 4.35rem);\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: 1.02;\n}\n\n",
    "generated desktop Projects heading",
)

# Centralize the shared homepage divider palette while preserving each divider's geometry.
divider_tokens = """:root {
  --homepage-divider-glow-rgb: 116, 113, 174;
  --homepage-divider-line: linear-gradient(
    90deg,
    transparent,
    rgba(160, 180, 188, 0.13) 18%,
    rgba(178, 196, 203, 0.34) 50%,
    rgba(160, 180, 188, 0.13) 82%,
    transparent
  );
}
"""
wrapper = divider_tokens + "\n" + wrapper
wrapper = wrapper.replace("  --divider-glow-rgb: 116, 113, 174;\n", "")
wrapper = wrapper.replace(
    "    linear-gradient(\n      90deg,\n      transparent,\n      rgba(160, 180, 188, 0.13) 18%,\n      rgba(178, 196, 203, 0.34) 50%,\n      rgba(160, 180, 188, 0.13) 82%,\n      transparent\n    ) center / 100% 1px no-repeat,",
    "    var(--homepage-divider-line) center / 100% 1px no-repeat,",
)
wrapper = wrapper.replace(
    "rgba(var(--divider-glow-rgb), 0.13)",
    "rgba(var(--homepage-divider-glow-rgb), 0.13)",
)
wrapper = wrapper.replace(
    "rgba(var(--divider-glow-rgb), 0.035)",
    "rgba(var(--homepage-divider-glow-rgb), 0.035)",
)

# Preserve the exact current cascade: core, external refinements, then former inline refinements.
core = core.replace(
    "/* Blue Continuum 4.1.9 — Framed Workshop Dividers */",
    "/* Blue Continuum 4.2.0 — Consolidated portfolio stylesheet */",
    1,
)
merged = (
    core.rstrip()
    + "\n\n/* Consolidated homepage and mobile refinements. */\n"
    + wrapper.strip()
    + "\n\n/* Editorial refinements moved from index.html. */\n"
    + inline_css
    + "\n"
)
STYLES.write_text(merged, encoding="utf-8")
CORE.unlink()

# Validate the resulting architecture and approved copy before committing.
final_index = INDEX.read_text(encoding="utf-8")
final_styles = STYLES.read_text(encoding="utf-8")
checks = {
    "legacy import": '@import url("./styles-core-4.1.9.css")' not in final_styles,
    "inline refinement block": 'id="editorial-refinements"' not in final_index,
    "legacy core file": not CORE.exists(),
    "stylesheet cache key": f"styles.css?v={VERSION}" in final_index,
    "script cache key": f"script.js?v={VERSION}" in final_index,
    "real About punctuation": "Building through practice.</span>" in final_index,
    "real Projects copy": '<h2 id="projects-title">Building real projects.</h2>' in final_index,
    "old Projects copy": "Learning by building." not in final_index,
    "consolidated core": "Consolidated portfolio stylesheet" in final_styles,
    "moved inline CSS": "workshop-updated-under-sweep" in final_styles,
    "mobile heading system": "--mobile-title-size" in final_styles,
    "homepage dividers": "--homepage-divider-line" in final_styles,
    "CSS brace balance": final_styles.count("{") == final_styles.count("}"),
}
failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise RuntimeError("Cleanup validation failed: " + ", ".join(failed))

# Ensure no remaining source file references the deleted core stylesheet.
for path in ROOT.rglob("*"):
    if not path.is_file() or ".git" in path.parts:
        continue
    if path.suffix.lower() not in {".html", ".css", ".js", ".json", ".md"}:
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    if "styles-core-4.1.9.css" in text:
        raise RuntimeError(f"Legacy core stylesheet reference remains in {path.relative_to(ROOT)}")

# Remove the one-shot automation from the final repository state.
WORKFLOW.unlink(missing_ok=True)
SCRIPT.unlink(missing_ok=True)
