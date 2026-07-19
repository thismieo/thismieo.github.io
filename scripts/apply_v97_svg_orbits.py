from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
index_path = ROOT / "index.html"
validator_path = ROOT / "scripts" / "validate_site.py"

index_text = index_path.read_text(encoding="utf-8")
index_replacements = {
    'data-release="2026.07.19.96"': 'data-release="2026.07.19.97"',
    'planetary-motion-v96.css?v=20260719.96" data-planetary-motion-v96': 'planetary-motion-v97.css?v=20260719.97" data-planetary-motion-v97',
    'planetary-motion-v96.js?v=20260719.96" defer': 'planetary-motion-v97.js?v=20260719.97" defer',
}
for old, new in index_replacements.items():
    if old not in index_text:
        raise SystemExit(f"Missing index token: {old}")
    index_text = index_text.replace(old, new, 1)

rotator_block = '''          <div class="hero-v33-rotator rotator-v33-one" aria-hidden="true"><i></i></div>
          <div class="hero-v33-rotator rotator-v33-two" aria-hidden="true"><i></i></div>
          <div class="hero-v33-rotator rotator-v33-three" aria-hidden="true"><i></i></div>

'''
if rotator_block not in index_text:
    raise SystemExit("Missing superseded HTML rotator block")
index_text = index_text.replace(rotator_block, "", 1)
index_path.write_text(index_text, encoding="utf-8")

validator_text = validator_path.read_text(encoding="utf-8")
validator_replacements = {
    '"planetary-motion-v96.css"': '"planetary-motion-v97.css"',
    '"planetary-motion-v96.js"': '"planetary-motion-v97.js"',
    'data-release="2026.07.19.96"': 'data-release="2026.07.19.97"',
    'planetary-motion-v96.css?v=20260719.96': 'planetary-motion-v97.css?v=20260719.97',
    'planetary-motion-v96.js?v=20260719.96': 'planetary-motion-v97.js?v=20260719.97',
    'V96 planetary-motion': 'V97 planetary-motion',
}
for old, new in validator_replacements.items():
    if old not in validator_text:
        raise SystemExit(f"Missing validator token: {old}")
    validator_text = validator_text.replace(old, new)

css_block = '''    required_planetary_css = (
        "aspect-ratio: 680 / 620",
        "heroV97Stars",
        "heroV97OrbitFlow",
        "heroV97PlanetSpin",
        "heroV97PlanetBreath",
        ".hero-v97-satellite",
        ".hero-v97-satellite-blue",
        ".hero-v97-satellite-pink",
        ".hero-v97-satellite-violet",
        "Hide every superseded HTML rotator",
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
    raise SystemExit("Could not replace V97 planetary CSS validator block")

js_block = '''    required_planetary_js = (
        "createElementNS",
        "animateMotion",
        "buildMotionPath",
        "sampleCount = 240",
        "preserveAspectRatio",
        "native-svg-v97",
        "unpauseAnimations",
        "pageshow",
        "visibilitychange",
        "hero-v97-satellite-blue",
        "hero-v97-satellite-pink",
        "hero-v97-satellite-violet",
        "prefers-reduced-motion",
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
    raise SystemExit("Could not replace V97 planetary JavaScript validator block")

validator_text = re.sub(
    r"    if index_text\.count\('class=\"hero-v33-rotator '\) != 3:\n        errors\.append\(\"V96 must contain exactly three Hero orbit satellites\"\)",
    '''    if index_text.count('class="hero-v33-rotator ') != 0:
        errors.append("V97 must not keep superseded HTML orbit rotators")''',
    validator_text,
    count=1,
)

obsolete_pattern = r'''    for obsolete_asset in \(
        "planetary-motion-v94\.css",
        "planetary-motion-v94\.js",
        "planetary-motion-v95\.css",
        "planetary-motion-v95\.js",
    \):'''
obsolete_replacement = '''    for obsolete_asset in (
        "planetary-motion-v94.css",
        "planetary-motion-v94.js",
        "planetary-motion-v95.css",
        "planetary-motion-v95.js",
        "planetary-motion-v96.css",
        "planetary-motion-v96.js",
    ):'''
validator_text, obsolete_count = re.subn(
    obsolete_pattern,
    obsolete_replacement,
    validator_text,
    count=1,
)
if obsolete_count != 1:
    raise SystemExit("Could not update obsolete planetary assets")

forbidden_block_pattern = r'''    for forbidden_orbit_runtime in \(
.*?
    \):
        if forbidden_orbit_runtime in planetary_js:
            errors\.append\(f"Unstable mobile orbit runtime remains: \{forbidden_orbit_runtime\}"\)'''
forbidden_block_replacement = '''    for forbidden_orbit_runtime in (
        'window.addEventListener("scroll"',
        "requestAnimationFrame",
        "IntersectionObserver",
        "ResizeObserver",
        "getBoundingClientRect",
        "getScreenCTM",
        "--orbit-x",
        "--orbit-y",
    ):
        if forbidden_orbit_runtime in planetary_js:
            errors.append(f"Superseded JavaScript orbit runtime remains: {forbidden_orbit_runtime}")'''
validator_text, forbidden_count = re.subn(
    forbidden_block_pattern,
    forbidden_block_replacement,
    validator_text,
    count=1,
    flags=re.S,
)
if forbidden_count != 1:
    raise SystemExit("Could not replace unstable orbit runtime validation")

validator_path.write_text(validator_text, encoding="utf-8")

for obsolete in (ROOT / "planetary-motion-v96.css", ROOT / "planetary-motion-v96.js"):
    if obsolete.exists():
        obsolete.unlink()

for disposable in (
    Path(__file__),
    ROOT / ".github" / "workflows" / "integrate-v97-svg-orbits.yml",
):
    if disposable.exists():
        disposable.unlink()
