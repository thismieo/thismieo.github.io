from pathlib import Path

styles_path = Path("styles.css")
index_path = Path("index.html")

styles = styles_path.read_text(encoding="utf-8")
index = index_path.read_text(encoding="utf-8")

replacements_styles = [
    ("/* Blue Continuum 4.5.33 — Consolidated portfolio stylesheet */", "/* Blue Continuum 4.5.34 — Consolidated portfolio stylesheet */"),
    (
        "  .hero-tagline span { display: block; }",
        "  .hero-tagline span { display: inline; }\n  .hero-tagline-future { display: block; }\n  .hero-tagline-code,\n  .hero-tagline-intelligence { display: inline; }",
    ),
]

for old, new in replacements_styles:
    if old not in styles:
        raise SystemExit(f"Expected styles pattern not found: {old}")
    styles = styles.replace(old, new, 1)

replacements_index = [
    ('styles.css?v=4.5.33', 'styles.css?v=4.5.34'),
    ('Version 4.5.33', 'Version 4.5.34'),
]

for old, new in replacements_index:
    if old not in index:
        raise SystemExit(f"Expected index pattern not found: {old}")
    index = index.replace(old, new, 1)

styles_path.write_text(styles, encoding="utf-8")
index_path.write_text(index, encoding="utf-8")
