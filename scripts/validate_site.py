#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"

required = [
    INDEX,
    ROOT / "assets/css/main.css",
    ROOT / "assets/css/components.css",
    ROOT / "assets/css/responsive.css",
    ROOT / "assets/js/app.js",
    ROOT / "assets/js/projects.js",
]

errors = []
for path in required:
    if not path.is_file():
        errors.append(f"Missing file: {path.relative_to(ROOT)}")

if INDEX.is_file():
    html = INDEX.read_text(encoding="utf-8")
    for target in ("home", "about", "journey", "stack", "direction", "projects", "goals", "contact"):
        if f'id="{target}"' not in html:
            errors.append(f"Missing section: {target}")
    for asset in required[1:]:
        relative = asset.relative_to(ROOT).as_posix()
        if relative not in html:
            errors.append(f"Asset not loaded: {relative}")
    if html.count('class="project-card"') != 3:
        errors.append("Expected exactly three project cards")
    if html.count('class="visual-footer"') != 3:
        errors.append("Expected exactly three visual footers")

for stylesheet in required[1:4]:
    if stylesheet.is_file():
        css = stylesheet.read_text(encoding="utf-8")
        if css.count("{") != css.count("}"):
            errors.append(f"Unbalanced CSS: {stylesheet.relative_to(ROOT)}")
        if "!important" in css:
            errors.append(f"Unexpected !important: {stylesheet.relative_to(ROOT)}")

if errors:
    print("Portfolio V2 validation failed")
    for error in errors:
        print(f"ERROR: {error}")
    raise SystemExit(1)

print("Portfolio V2 validation passed")
