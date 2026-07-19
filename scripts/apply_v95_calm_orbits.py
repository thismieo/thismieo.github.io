from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
index_path = ROOT / "index.html"
validator_path = ROOT / "scripts" / "validate_site.py"

index_text = index_path.read_text(encoding="utf-8")
index_replacements = {
    'data-release="2026.07.19.94"': 'data-release="2026.07.19.95"',
    'planetary-motion-v94.css?v=20260719.94" data-planetary-motion-v94': 'planetary-motion-v95.css?v=20260719.95" data-planetary-motion-v95',
    'planetary-motion-v94.js?v=20260719.94" defer': 'planetary-motion-v95.js?v=20260719.95" defer',
}
for old, new in index_replacements.items():
    if old not in index_text:
        raise SystemExit(f"Missing index token: {old}")
    index_text = index_text.replace(old, new, 1)

third_satellite = '          <div class="hero-v33-rotator rotator-v33-three" aria-hidden="true"><i></i></div>\n'
if third_satellite not in index_text:
    second_satellite = '          <div class="hero-v33-rotator rotator-v33-two" aria-hidden="true"><i></i></div>\n'
    if second_satellite not in index_text:
        raise SystemExit("Missing second Hero satellite insertion point")
    index_text = index_text.replace(second_satellite, second_satellite + third_satellite, 1)

index_path.write_text(index_text, encoding="utf-8")

validator_text = validator_path.read_text(encoding="utf-8")
validator_replacements = {
    '"planetary-motion-v94.css"': '"planetary-motion-v95.css"',
    '"planetary-motion-v94.js"': '"planetary-motion-v95.js"',
    'data-release="2026.07.19.94"': 'data-release="2026.07.19.95"',
    'planetary-motion-v94.css?v=20260719.94': 'planetary-motion-v95.css?v=20260719.95',
    'planetary-motion-v94.js?v=20260719.94': 'planetary-motion-v95.js?v=20260719.95',
    'ROOT / "planetary-motion-v94.css"': 'ROOT / "planetary-motion-v95.css"',
    'ROOT / "planetary-motion-v94.js"': 'ROOT / "planetary-motion-v95.js"',
    'V94 planetary-motion': 'V95 planetary-motion',
}
for old, new in validator_replacements.items():
    if old not in validator_text:
        raise SystemExit(f"Missing validator token: {old}")
    validator_text = validator_text.replace(old, new)

index_token = "        'planetary-motion-v95.js?v=20260719.95',\n"
third_token = "        'class=\"hero-v33-rotator rotator-v33-three\"',\n"
if third_token not in validator_text:
    if index_token not in validator_text:
        raise SystemExit("Missing V95 index token insertion point")
    validator_text = validator_text.replace(index_token, index_token + third_token, 1)

css_block = '''    required_planetary_css = (
        "heroV95Stars",
        "heroV95OrbitFlow",
        "heroV95PlanetSpin",
        "heroV95PlanetBreath",
        "heroV95DotPulse",
        "heroV95AuraWave",
        ".hero-v33-rotator.is-path-driven",
        ".rotator-v33-two.is-path-driven",
        ".rotator-v33-three.is-path-driven",
        "--orbit-x",
        "--orbit-y",
        "--glow-rgb",
        "Soft circular aura only",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    )
    for token in required_planetary_css:'''
validator_text, css_count = re.subn(
    r"    required_planetary_css = \(\n.*?\n    \)\n    for token in required_planetary_css:",
    css_block,
    validator_text,
    count=1,
    flags=re.S,
)
if css_count != 1:
    raise SystemExit("Could not replace planetary CSS validator block")

js_block = '''    required_planetary_js = (
        "line.cx.baseVal.value",
        "line.transform.baseVal.consolidate",
        "ResizeObserver",
        "IntersectionObserver",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "coarsePointer.matches ? 1000 / 24",
        "window.addEventListener(\"scroll\"",
        "scrolling = true",
        "--orbit-x",
        "--orbit-y",
        "prefers-reduced-motion",
        "document.hidden",
        "rotator-v33-three",
        "orbit-glow-violet",
    )
    for token in required_planetary_js:'''
validator_text, js_count = re.subn(
    r"    required_planetary_js = \(\n.*?\n    \)\n    for token in required_planetary_js:",
    js_block,
    validator_text,
    count=1,
    flags=re.S,
)
if js_count != 1:
    raise SystemExit("Could not replace planetary JavaScript validator block")

validation_anchor = '    if errors:\n'
extra_validation = '''    if index_text.count('class="hero-v33-rotator ') != 3:
        errors.append("V95 must contain exactly three Hero orbit satellites")

    for obsolete_asset in ("planetary-motion-v94.css", "planetary-motion-v94.js"):
        if obsolete_asset in index_text:
            errors.append(f"Superseded planetary asset is still loaded: {obsolete_asset}")

    for saturn_token in ("width: 164%", "height: 48%", "rotate(-18deg)", "rotate(24deg)"):
        if saturn_token in planetary_css:
            errors.append(f"Saturn-style satellite ring remains: {saturn_token}")

    if "getScreenCTM" in planetary_js:
        errors.append("V95 must not recalculate screen coordinates for every orbit frame")

'''
if extra_validation not in validator_text:
    if validation_anchor not in validator_text:
        raise SystemExit("Missing validator completion anchor")
    validator_text = validator_text.replace(validation_anchor, extra_validation + validation_anchor, 1)

validator_path.write_text(validator_text, encoding="utf-8")

for obsolete in (ROOT / "planetary-motion-v94.css", ROOT / "planetary-motion-v94.js"):
    if obsolete.exists():
        obsolete.unlink()

for disposable in (
    Path(__file__),
    ROOT / ".github" / "workflows" / "integrate-v95-calm-orbits.yml",
):
    if disposable.exists():
        disposable.unlink()
