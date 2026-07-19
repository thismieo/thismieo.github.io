#!/usr/bin/env python3
"""Structural, asset, and regression checks for the static portfolio."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.local_assets: list[tuple[str, str]] = []
        self.runtime_assets: list[str] = []
        self.nav_targets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)

        if tag == "a":
            href = values.get("href")
            if href and href.startswith("#") and len(href) > 1:
                self.nav_targets.append(href[1:])

        candidate: str | None = None
        if tag == "link" and values.get("rel") == "stylesheet":
            candidate = values.get("href")
        elif tag in {"script", "img", "source"}:
            candidate = values.get("src")

        if not candidate:
            return

        parsed = urlsplit(candidate)
        if parsed.scheme or parsed.netloc or candidate.startswith(("//", "data:", "mailto:", "tel:")):
            return

        clean = parsed.path.lstrip("/")
        if clean:
            self.local_assets.append((candidate, clean))
            if tag in {"link", "script"}:
                self.runtime_assets.append(clean)


def check_balanced_css(path: Path, errors: list[str]) -> None:
    text = path.read_text(encoding="utf-8", errors="replace")
    depth = 0
    quote: str | None = None
    escaped = False
    in_comment = False
    index = 0

    while index < len(text):
        char = text[index]
        nxt = text[index + 1] if index + 1 < len(text) else ""

        if in_comment:
            if char == "*" and nxt == "/":
                in_comment = False
                index += 2
                continue
            index += 1
            continue

        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue

        if char == "/" and nxt == "*":
            in_comment = True
            index += 2
            continue

        if char in {'"', "'"}:
            quote = char
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth < 0:
                errors.append(f"CSS closes before opening: {path.relative_to(ROOT)}")
                return
        index += 1

    if in_comment:
        errors.append(f"Unclosed CSS comment: {path.relative_to(ROOT)}")
    if quote:
        errors.append(f"Unclosed CSS string: {path.relative_to(ROOT)}")
    if depth != 0:
        errors.append(f"Unbalanced CSS braces ({depth}): {path.relative_to(ROOT)}")


def main() -> int:
    errors: list[str] = []

    if not INDEX.is_file():
        raise SystemExit("index.html is missing")

    index_text = INDEX.read_text(encoding="utf-8", errors="replace")
    parser = SiteParser()
    parser.feed(index_text)
    parser.close()

    duplicates = sorted(item for item, count in Counter(parser.ids).items() if count > 1)
    if duplicates:
        errors.append(f"Duplicate HTML ids: {', '.join(duplicates)}")

    missing_targets = sorted(set(parser.nav_targets) - set(parser.ids))
    if missing_targets:
        errors.append(f"Anchor targets are missing: {', '.join(missing_targets)}")

    required_ids = {"home", "about", "journey", "stack", "neural", "projects", "goals", "contact", "thank-you"}
    missing_required = sorted(required_ids - set(parser.ids))
    if missing_required:
        errors.append(f"Required sections are missing: {', '.join(missing_required)}")

    for original, clean in parser.local_assets:
        if not (ROOT / clean).is_file():
            errors.append(f"Referenced local asset is missing: {original}")

    duplicate_assets = sorted(asset for asset, count in Counter(parser.runtime_assets).items() if count > 1)
    if duplicate_assets:
        errors.append(f"Duplicate stylesheet/script references: {', '.join(duplicate_assets)}")

    css_files = sorted(ROOT.glob("*.css"))
    js_files = sorted(ROOT.glob("*.js"))
    source_files = [INDEX, *css_files, *js_files]

    for css_file in css_files:
        check_balanced_css(css_file, errors)

    conflict_pattern = re.compile(r"^(<<<<<<<|=======|>>>>>>>)", re.MULTILINE)
    for source_file in source_files:
        text = source_file.read_text(encoding="utf-8", errors="replace")
        if not text.strip():
            errors.append(f"Empty source file: {source_file.relative_to(ROOT)}")
        if conflict_pattern.search(text):
            errors.append(f"Merge-conflict marker remains in {source_file.relative_to(ROOT)}")

    loaded_assets = set(parser.runtime_assets)
    dynamic_source = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in js_files)
    required_runtime = {
        "interactions.js",
        "hero-v33.js",
        "hero-interface-v68.js",
        "hero-interface-v68.css",
        "tech-icons-v69.css",
        "learning-console-v92.css",
        "mobile-performance-v92.css",
        "planetary-motion-v93.css",
        "planetary-motion-v93.js",
        "projects-runtime-v68.js",
        "core-contact-v63.js",
    }
    missing_runtime = sorted(name for name in required_runtime if name not in loaded_assets and name not in dynamic_source)
    if missing_runtime:
        errors.append(f"Required runtime assets are not loaded: {', '.join(missing_runtime)}")

    required_index_tokens = (
        'data-release="2026.07.19.93"',
        'learning-console-v92.css?v=20260719.92',
        'mobile-performance-v92.css?v=20260719.92',
        'planetary-motion-v93.css?v=20260719.93',
        'planetary-motion-v93.js?v=20260719.93',
        'hero-v33.js?v=20260719.89',
        'class="hero-console-v92"',
        'class="hero-console-v92-lights"',
        'class="hero-console-v92-copy"',
        'class="hero-console-v92-messages"',
        'class="hero-console-v92-caret"',
        'class="hero-console-v92-state"',
    )
    for token in required_index_tokens:
        if token not in index_text:
            errors.append(f"V92 typing-console token is missing: {token}")

    if index_text.count('class="hero-console-v92"') != 1:
        errors.append("V92 must contain exactly one Hero console")
    if index_text.count('class="hero-console-v92-message"') != 3:
        errors.append("V92 Hero console must contain exactly three messages")
    if index_text.count('class="hero-console-v92-caret"') != 1:
        errors.append("V92 Hero console must contain exactly one caret")

    inside_copy_marker = '            </nav>\n\n            <aside class="hero-console-v92"'
    closing_copy_marker = '            </aside>\n          </div>\n        </div>'
    if inside_copy_marker not in index_text or closing_copy_marker not in index_text:
        errors.append("V92 Hero console is not physically nested below the profile links")

    all_css = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in css_files)
    console_css = (ROOT / "learning-console-v92.css").read_text(encoding="utf-8", errors="replace")
    mobile_css = (ROOT / "mobile-performance-v92.css").read_text(encoding="utf-8", errors="replace")
    terminal_js = (ROOT / "hero-v33.js").read_text(encoding="utf-8", errors="replace")
    planetary_css = (ROOT / "planetary-motion-v93.css").read_text(encoding="utf-8", errors="replace")
    planetary_js = (ROOT / "planetary-motion-v93.js").read_text(encoding="utf-8", errors="replace")

    forbidden_legacy_surface_tokens = (
        "hero-v33-terminal",
        "hero-console-v89",
        "hero-console-v90",
        "learning-console-v89.css",
        "learning-console-v90.css",
        "mobile-performance-v91.css",
        "terminal-v33-",
        "hero-v33-terminal-text",
        'terminalMode = "line-swap"',
        "HOLD_DURATION",
        "FADE_DURATION",
        "heroV33Caret",
        '"terminal terminal"',
        "grid-area: console",
    )
    legacy_surface = "\n".join((index_text, all_css, terminal_js))
    for token in forbidden_legacy_surface_tokens:
        if token in legacy_surface:
            errors.append(f"Superseded Terminal token remains: {token}")

    forbidden_terminal_runtime_tokens = (
        "characterIndex",
        "phrase.slice",
        "setTimeout",
        "requestAnimationFrame",
    )
    for token in forbidden_terminal_runtime_tokens:
        if token in terminal_js:
            errors.append(f"Superseded Terminal runtime remains in hero-v33.js: {token}")

    required_console_css = (
        "overflow-anchor: none",
        "contain: layout paint",
        "clip-path: inset(0 100% 0 0)",
        "@keyframes heroConsoleV92Type",
        "@keyframes heroConsoleV92CaretPath",
        "@keyframes heroConsoleV92CaretBlink",
        ".hero-console-v92-message:nth-child(1)",
        ".hero-console-v92-message:nth-child(2)",
        ".hero-console-v92-message:nth-child(3)",
        ".hero-console-v92-caret",
        "steps(28, end)",
        "animation-delay: 5s",
        "animation-delay: 10s",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    )
    for token in required_console_css:
        if token not in console_css:
            errors.append(f"V92 typing-console CSS token is missing: {token}")

    required_mobile_css = (
        ".ambient,",
        ".page-grid,",
        ".scroll-progress",
        "display: none !important",
        "backdrop-filter: none !important",
        "overflow-anchor: none",
        "animation: none !important",
        "#home .hero-console-v92-message",
    )
    for token in required_mobile_css:
        if token not in mobile_css:
            errors.append(f"V92 mobile-stability CSS token is missing: {token}")

    required_planetary_css = (
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

    if errors:
        print("Portfolio validation failed")
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("Portfolio validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
