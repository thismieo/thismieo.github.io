from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
VALIDATOR = ROOT / "scripts" / "validate_site.py"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        if new in text:
            return text
        raise RuntimeError(f"Missing expected {label}")
    return text.replace(old, new, 1)


def main() -> None:
    index_text = INDEX.read_text(encoding="utf-8")
    index_text = replace_once(
        index_text,
        'data-release="2026.07.19.92"',
        'data-release="2026.07.19.93"',
        "V92 release marker",
    )

    css_anchor = '  <link rel="stylesheet" href="mobile-performance-v92.css?v=20260719.92" data-mobile-performance-v92 />\n'
    css_line = '  <link rel="stylesheet" href="planetary-motion-v93.css?v=20260719.93" data-planetary-motion-v93 />\n'
    if css_line not in index_text:
        index_text = replace_once(index_text, css_anchor, css_anchor + css_line, "mobile performance stylesheet")

    js_anchor = '  <script src="hero-v33.js?v=20260719.89" defer></script>\n'
    js_line = '  <script src="planetary-motion-v93.js?v=20260719.93" defer></script>\n'
    if js_line not in index_text:
        index_text = replace_once(index_text, js_anchor, js_anchor + js_line, "Hero runtime script")

    INDEX.write_text(index_text, encoding="utf-8")

    validator_text = VALIDATOR.read_text(encoding="utf-8")
    validator_text = replace_once(
        validator_text,
        '        \'data-release="2026.07.19.92"\',',
        '        \'data-release="2026.07.19.93"\',',
        "validator release token",
    )

    runtime_anchor = '        "mobile-performance-v92.css",\n'
    runtime_lines = (
        '        "planetary-motion-v93.css",\n'
        '        "planetary-motion-v93.js",\n'
    )
    if '        "planetary-motion-v93.css",\n' not in validator_text:
        validator_text = replace_once(
            validator_text,
            runtime_anchor,
            runtime_anchor + runtime_lines,
            "validator runtime asset anchor",
        )

    index_anchor = '        \'mobile-performance-v92.css?v=20260719.92\',\n'
    index_lines = (
        '        \'planetary-motion-v93.css?v=20260719.93\',\n'
        '        \'planetary-motion-v93.js?v=20260719.93\',\n'
    )
    if '        \'planetary-motion-v93.css?v=20260719.93\',\n' not in validator_text:
        validator_text = replace_once(
            validator_text,
            index_anchor,
            index_anchor + index_lines,
            "validator index token anchor",
        )

    read_anchor = '    terminal_js = (ROOT / "hero-v33.js").read_text(encoding="utf-8", errors="replace")\n'
    read_lines = (
        '    planetary_css = (ROOT / "planetary-motion-v93.css").read_text(encoding="utf-8", errors="replace")\n'
        '    planetary_js = (ROOT / "planetary-motion-v93.js").read_text(encoding="utf-8", errors="replace")\n'
    )
    if '    planetary_css = (ROOT / "planetary-motion-v93.css")' not in validator_text:
        validator_text = replace_once(
            validator_text,
            read_anchor,
            read_anchor + read_lines,
            "validator planetary file reads",
        )

    checks = '''    required_planetary_css = (
        "heroV93Stars",
        "heroV93OrbitDash",
        "heroV93PlanetSpin",
        "heroV93PlanetBreath",
        ".hero-v33-rotator.is-path-driven",
        "--orbit-x",
        "--orbit-y",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    )
    for token in required_planetary_css:
        if token not in planetary_css:
            errors.append(f"V93 planetary-motion CSS token is missing: {token}")

    required_planetary_js = (
        "getTotalLength",
        "getPointAtLength",
        "getScreenCTM",
        "IntersectionObserver",
        "requestAnimationFrame",
        "cancelAnimationFrame",
        "--orbit-x",
        "--orbit-y",
        "prefers-reduced-motion",
        "document.hidden",
    )
    for token in required_planetary_js:
        if token not in planetary_js:
            errors.append(f"V93 planetary-motion JavaScript token is missing: {token}")

'''
    error_anchor = '    if errors:\n'
    if '    required_planetary_css = (\n' not in validator_text:
        validator_text = replace_once(
            validator_text,
            error_anchor,
            checks + error_anchor,
            "validator final error block",
        )

    VALIDATOR.write_text(validator_text, encoding="utf-8")
    Path(__file__).unlink()


if __name__ == "__main__":
    main()
