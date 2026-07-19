from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
validator_path = ROOT / "scripts" / "validate_site.py"
mobile_path = ROOT / "mobile-performance-v92.css"

validator_text = validator_path.read_text(encoding="utf-8")
replacements = {
    '        \'class="hero-v33-rotator rotator-v33-three"\',\n': '',
    '        "identical on desktop and mobile",\n': '        "one identical design on desktop and mobile",\n',
    '        "Planetary motion is owned by V96",\n': '        "Planetary motion is owned by V97",\n',
    'errors.append("V96 must not recalculate screen coordinates for every orbit frame")': 'errors.append("V97 must not recalculate screen coordinates for every orbit frame")',
}
for old, new in replacements.items():
    if old not in validator_text:
        raise SystemExit(f"Missing validator cleanup token: {old}")
    validator_text = validator_text.replace(old, new, 1)
validator_path.write_text(validator_text, encoding="utf-8")

mobile_text = mobile_path.read_text(encoding="utf-8")
old_comment = "Planetary motion is owned by V96."
new_comment = "Planetary motion is owned by V97."
if old_comment not in mobile_text:
    raise SystemExit("Missing mobile ownership comment")
mobile_path.write_text(mobile_text.replace(old_comment, new_comment, 1), encoding="utf-8")

for disposable in (
    ROOT / "scripts" / "v97-trigger.txt",
    ROOT / "v97-diagnostic.txt",
    Path(__file__),
    ROOT / ".github" / "workflows" / "integrate-v97-svg-orbits.yml",
):
    if disposable.exists():
        disposable.unlink()
