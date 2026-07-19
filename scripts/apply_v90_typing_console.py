#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
VALIDATOR = ROOT / "scripts" / "validate_site.py"
OLD_CSS = ROOT / "learning-console-v89.css"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected one {label}; found {count}")
    return text.replace(old, new, 1)


index = INDEX.read_text(encoding="utf-8")
index = replace_once(index, 'data-release="2026.07.19.89"', 'data-release="2026.07.19.90"', "release token")
index = replace_once(
    index,
    'learning-console-v89.css?v=20260719.89',
    'learning-console-v90.css?v=20260719.90',
    "console stylesheet",
)
index = index.replace("hero-console-v89", "hero-console-v90")
index = replace_once(index, "learning.py / current status", "journey.py / live learning log", "console title")
INDEX.write_text(index, encoding="utf-8")

validator = VALIDATOR.read_text(encoding="utf-8")
validator = validator.replace('"learning-console-v89.css"', '"learning-console-v90.css"')
validator = validator.replace('data-release="2026.07.19.89"', 'data-release="2026.07.19.90"')
validator = validator.replace('learning-console-v89.css?v=20260719.89', 'learning-console-v90.css?v=20260719.90')
validator = validator.replace("hero-console-v89", "hero-console-v90")
validator = validator.replace("V89 learning-console", "V90 typing-console")
validator = validator.replace('(ROOT / "learning-console-v89.css")', '(ROOT / "learning-console-v90.css")')

old_required = '''    required_console_css = (
        "grid-area: console",
        "@keyframes heroConsoleV89Cycle",
        ".hero-console-v89-message:nth-child(1)",
        ".hero-console-v89-message:nth-child(2)",
        ".hero-console-v89-message:nth-child(3)",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    )
'''
new_required = '''    required_console_css = (
        "grid-area: console",
        "@keyframes heroConsoleV90TypeA",
        "@keyframes heroConsoleV90TypeB",
        "@keyframes heroConsoleV90TypeC",
        ".hero-console-v90-message:nth-child(1)",
        ".hero-console-v90-message:nth-child(2)",
        ".hero-console-v90-message:nth-child(3)",
        "steps(29, end)",
        "animation-delay: 5s",
        "animation-delay: 10s",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    )
'''
validator = replace_once(validator, old_required, new_required, "required console CSS block")
validator = validator.replace(
    '        "hero-v33-terminal",\n',
    '        "hero-v33-terminal",\n        "hero-console-v89",\n        "learning-console-v89.css",\n',
    1,
)
VALIDATOR.write_text(validator, encoding="utf-8")

if OLD_CSS.exists():
    OLD_CSS.unlink()

Path(__file__).unlink()
