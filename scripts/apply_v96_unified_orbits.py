from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
index_path = ROOT / "index.html"
validator_path = ROOT / "scripts" / "validate_site.py"

index_text = index_path.read_text(encoding="utf-8")
index_replacements = {
    'data-release="2026.07.19.95"': 'data-release="2026.07.19.96"',
    'planetary-motion-v95.css?v=20260719.95" data-planetary-motion-v95': 'planetary-motion-v96.css?v=20260719.96" data-planetary-motion-v96',
    'planetary-motion-v95.js?v=20260719.95" defer': 'planetary-motion-v96.js?v=20260719.96" defer',
}
for old, new in index_replacements.items():
    if old not in index_text:
        raise SystemExit(f"Missing index token: {old}")
    index_text = index_text.replace(old, new, 1)
index_path.write_text(index_text, encoding="utf-8")

validator_text = validator_path.read_text(encoding="utf-8")
validator_replacements = {
    '"planetary-motion-v95.css"': '"planetary-motion-v96.css"',
    '"planetary-motion-v95.js"': '"planetary-motion-v96.js"',
    'data-release="2026.07.19.95"': 'data-release="2026.07.19.96"',
    'planetary-motion-v95.css?v=20260719.95': 'planetary-motion-v96.css?v=20260719.96',
    'planetary-motion-v95.js?v=20260719.95': 'planetary-motion-v96.js?v=20260719.96',
    'ROOT / "planetary-motion-v95.css"': 'ROOT / "planetary-motion-v96.css"',
    'ROOT / "planetary-motion-v95.js"': 'ROOT / "planetary-motion-v96.js"',
    'V95 planetary-motion': 'V96 planetary-motion',
    'V95 must contain exactly three Hero orbit satellites': 'V96 must contain exactly three Hero orbit satellites',
    'V95 must not recalculate screen coordinates for every orbit frame': 'V96 must not recalculate screen coordinates for every orbit frame',
}
for old, new in validator_replacements.items():
    if old not in validator_text:
        raise SystemExit(f"Missing validator token: {old}")
    validator_text = validator_text.replace(old, new)

mobile_block = '''    required_mobile_css = (
        ".ambient,",
        ".page-grid,",
        ".scroll-progress",
        "display: none !important",
        "backdrop-filter: none !important",
        "overflow-anchor: none",
        "contain: layout",
        "animation: none !important",
        "Planetary motion is owned by V96",
        "#home .hero-console-v92-message",
    )
    for token in required_mobile_css:'''
validator_text, mobile_count = re.subn(
    r"    required_mobile_css = \(\n.*?\n    \)\n    for token in required_mobile_css:",
    mobile_block,
    validator_text,
    count=1,
    flags=re.S,
)
if mobile_count != 1:
    raise SystemExit("Could not replace mobile CSS validator block")

css_block = '''    required_planetary_css = (
        "heroV96Stars",
        "heroV96OrbitFlow",
        "heroV96PlanetSpin",
        "heroV96PlanetBreath",
        "heroV96DotPulse",
        "heroV96AuraWave",
        ".hero-v33-rotator.is-path-driven",
        ".rotator-v33-two.is-path-driven",
        ".rotator-v33-three.is-path-driven",
        "--orbit-x",
        "--orbit-y",
        "--glow-rgb",
        "identical on desktop and mobile",
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
        "scheduleGeometryRefresh",
        "pageshow",
        "pagehide",
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

obsolete_pattern = r'    for obsolete_asset in \("planetary-motion-v94\.css", "planetary-motion-v94\.js"\):\n        if obsolete_asset in index_text:\n            errors\.append\(f"Superseded planetary asset is still loaded: \{obsolete_asset\}"\)'
obsolete_replacement = '''    for obsolete_asset in (
        "planetary-motion-v94.css",
        "planetary-motion-v94.js",
        "planetary-motion-v95.css",
        "planetary-motion-v95.js",
    ):
        if obsolete_asset in index_text:
            errors.append(f"Superseded planetary asset is still loaded: {obsolete_asset}")'''
validator_text, obsolete_count = re.subn(obsolete_pattern, obsolete_replacement, validator_text, count=1)
if obsolete_count != 1:
    raise SystemExit("Could not update obsolete planetary asset validation")

validation_anchor = '    if errors:\n'
extra_validation = '''    for forbidden_mobile_token in (
        "contain: layout paint",
        "#home .hero-v33-stars",
        "#home .hero-v33-rotator",
        "#home .hero-v33-orbit-svg .orbit-line",
        "#home .hero-v33-planet::before",
        "#home .hero-v33-planet,",
    ):
        if forbidden_mobile_token in mobile_css:
            errors.append(f"Obsolete mobile planetary override remains: {forbidden_mobile_token}")

    for forbidden_orbit_runtime in (
        'window.addEventListener("scroll"',
        "scrolling =",
        "scrollEndTimer",
        "coarsePointer",
        "getScreenCTM",
    ):
        if forbidden_orbit_runtime in planetary_js:
            errors.append(f"Unstable mobile orbit runtime remains: {forbidden_orbit_runtime}")

'''
if extra_validation not in validator_text:
    if validation_anchor not in validator_text:
        raise SystemExit("Missing validator completion anchor")
    validator_text = validator_text.replace(validation_anchor, extra_validation + validation_anchor, 1)

validator_path.write_text(validator_text, encoding="utf-8")

for obsolete in (ROOT / "planetary-motion-v95.css", ROOT / "planetary-motion-v95.js"):
    if obsolete.exists():
        obsolete.unlink()

for disposable in (
    Path(__file__),
    ROOT / ".github" / "workflows" / "integrate-v96-unified-orbits.yml",
):
    if disposable.exists():
        disposable.unlink()
