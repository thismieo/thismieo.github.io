from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
index_path = ROOT / "index.html"
validator_path = ROOT / "scripts" / "validate_site.py"

index_text = index_path.read_text(encoding="utf-8")
replacements = {
    'data-release="2026.07.19.93"': 'data-release="2026.07.19.94"',
    'planetary-motion-v93.css?v=20260719.93" data-planetary-motion-v93': 'planetary-motion-v94.css?v=20260719.94" data-planetary-motion-v94',
    'planetary-motion-v93.js?v=20260719.93" defer': 'planetary-motion-v94.js?v=20260719.94" defer',
}
for old, new in replacements.items():
    if old not in index_text:
        raise SystemExit(f"Missing index token: {old}")
    index_text = index_text.replace(old, new, 1)
index_path.write_text(index_text, encoding="utf-8")

validator_text = validator_path.read_text(encoding="utf-8")
validator_replacements = {
    'planetary-motion-v93.css': 'planetary-motion-v94.css',
    'planetary-motion-v93.js': 'planetary-motion-v94.js',
    'data-release="2026.07.19.93"': 'data-release="2026.07.19.94"',
    'planetary-motion-v93.css?v=20260719.93': 'planetary-motion-v94.css?v=20260719.94',
    'planetary-motion-v93.js?v=20260719.93': 'planetary-motion-v94.js?v=20260719.94',
    'heroV93Stars': 'heroV94Stars',
    'heroV93OrbitDash': 'heroV94OrbitDash',
    'heroV93PlanetSpin': 'heroV94PlanetSpin',
    'heroV93PlanetBreath': 'heroV94PlanetBreath',
    'V93 planetary-motion': 'V94 planetary-motion',
}
for old, new in validator_replacements.items():
    if old not in validator_text:
        raise SystemExit(f"Missing validator token: {old}")
    validator_text = validator_text.replace(old, new)

needle = '        "document.hidden",\n'
extra = '        "rotator-v33-three",\n        "orbit-glow-violet",\n'
if extra not in validator_text:
    if needle not in validator_text:
        raise SystemExit("Missing planetary JavaScript validator insertion point")
    validator_text = validator_text.replace(needle, needle + extra, 1)

css_needle = '        "--orbit-y",\n'
css_extra = '        "heroV94BluePulse",\n        "heroV94PinkPulse",\n        "heroV94VioletPulse",\n        ".rotator-v33-three.is-path-driven",\n'
if css_extra not in validator_text:
    if css_needle not in validator_text:
        raise SystemExit("Missing planetary CSS validator insertion point")
    validator_text = validator_text.replace(css_needle, css_needle + css_extra, 1)

validator_path.write_text(validator_text, encoding="utf-8")

for obsolete in (ROOT / "planetary-motion-v93.css", ROOT / "planetary-motion-v93.js"):
    if obsolete.exists():
        obsolete.unlink()

Path(__file__).unlink()
