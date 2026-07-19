#!/usr/bin/env python3
from pathlib import Path

root = Path(__file__).resolve().parents[1]
required_paths = [
    "index.html",
    "assets/css/main.css",
    "assets/css/components.css",
    "assets/css/responsive.css",
    "assets/js/app.js",
    "assets/js/projects.js",
]

missing = [path for path in required_paths if not (root / path).is_file()]
if missing:
    print("Portfolio V2 validation failed")
    for path in missing:
        print(f"ERROR: Missing file: {path}")
    raise SystemExit(1)

html = (root / "index.html").read_text(encoding="utf-8")
errors = []

for section in ("home", "about", "journey", "stack", "direction", "projects", "goals", "contact"):
    if f'id="{section}"' not in html:
        errors.append(f"Missing section: {section}")

for asset in required_paths[1:]:
    if asset not in html:
        errors.append(f"Asset not loaded: {asset}")

if html.count('class="project-card"') != 3:
    errors.append("Expected exactly three project cards")

if html.count('class="visual-footer"') != 3:
    errors.append("Expected exactly three project visual footers")

if errors:
    print("Portfolio V2 validation failed")
    for error in errors:
        print(f"ERROR: {error}")
    raise SystemExit(1)

print("Portfolio V2 validation passed")
