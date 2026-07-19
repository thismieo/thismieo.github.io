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
    required_runtime = {
        "interactions.js",
        "hero-v33.js",
        "hero-interface-v68.js",
        "hero-interface-v68.css",
        "tech-icons-v69.css",
        "learning-console-v92.css",
        "mobile-performance-v92.css",
        "planetary-motion-v97.css",
        "planetary-motion-v97.js",
        "projects-runtime-v68.js",
        "core-contact-v63.js",
    }
    missing_runtime = sorted(required_runtime - loaded_assets)
    if missing_runtime:
        errors.append(f"Required runtime assets are not loaded: {', '.join(missing_runtime)}")

    required_index_tokens = (
        'data-release="2026.07.19.97"',
        'learning-console-v92.css?v=20260719.92',
        'mobile-performance-v92.css?v=20260719.92',
        'planetary-motion-v97.css?v=20260719.97',
        'planetary-motion-v97.js?v=20260719.97',
        'hero-v33.js?v=20260719.89',
        'class="hero-console-v92"',
        'class="hero-console-v92-messages"',
        'class="hero-console-v92-caret"',
    )
    for token in required_index_tokens:
        if token not in index_text:
            errors.append(f"Required index token is missing: {token}")

    if index_text.count('class="hero-console-v92"') != 1:
        errors.append("V92 must contain exactly one Hero console")
    if index_text.count('class="hero-console-v92-message"') != 3:
        errors.append("V92 Hero console must contain exactly three messages")
    if index_text.count('class="hero-v33-rotator ') != 0:
        errors.append("V97 must not keep superseded HTML orbit rotators")

    console_css = (ROOT / "learning-console-v92.css").read_text(encoding="utf-8", errors="replace")
    mobile_css = (ROOT / "mobile-performance-v92.css").read_text(encoding="utf-8", errors="replace")
    planetary_css = (ROOT / "planetary-motion-v97.css").read_text(encoding="utf-8", errors="replace")
    planetary_js = (ROOT / "planetary-motion-v97.js").read_text(encoding="utf-8", errors="replace")

    for token in (
        "@keyframes heroConsoleV92Type",
        "@keyframes heroConsoleV92CaretBlink",
        ".hero-console-v92-message:nth-child(1)",
        ".hero-console-v92-message:nth-child(2)",
        ".hero-console-v92-message:nth-child(3)",
        "@media (prefers-reduced-motion: reduce)",
    ):
        if token not in console_css:
            errors.append(f"V92 console CSS token is missing: {token}")

    for token in (
        ".ambient,",
        ".page-grid,",
        ".scroll-progress",
        "display: none !important",
        "overflow-anchor: none",
        "contain: layout",
    ):
        if token not in mobile_css:
            errors.append(f"Mobile stability token is missing: {token}")

    for token in (
        "aspect-ratio: 680 / 620",
        "heroV97Stars",
        "heroV97OrbitFlow",
        "heroV97PlanetSpin",
        "heroV97PlanetBreath",
        ".hero-v97-satellite",
        ".hero-v97-satellite-blue",
        ".hero-v97-satellite-pink",
        ".hero-v97-satellite-violet",
        "@media (max-width: 860px)",
        "@media (prefers-reduced-motion: reduce)",
    ):
        if token not in planetary_css:
            errors.append(f"V97 planetary CSS token is missing: {token}")

    for token in (
        "createElementNS",
        "animateMotion",
        "buildMotionPath",
        "sampleCount = 240",
        "preserveAspectRatio",
        "native-svg-v97",
        "unpauseAnimations",
        "pageshow",
        "visibilitychange",
        "prefers-reduced-motion",
    ):
        if token not in planetary_js:
            errors.append(f"V97 planetary JavaScript token is missing: {token}")

    for obsolete_asset in (
        "planetary-motion-v94.css",
        "planetary-motion-v94.js",
        "planetary-motion-v95.css",
        "planetary-motion-v95.js",
        "planetary-motion-v96.css",
        "planetary-motion-v96.js",
    ):
        if obsolete_asset in index_text:
            errors.append(f"Superseded planetary asset is still loaded: {obsolete_asset}")

    for forbidden_runtime in (
        'window.addEventListener("scroll"',
        "requestAnimationFrame",
        "IntersectionObserver",
        "ResizeObserver",
        "getBoundingClientRect",
        "getScreenCTM",
        "--orbit-x",
        "--orbit-y",
    ):
        if forbidden_runtime in planetary_js:
            errors.append(f"Superseded JavaScript orbit runtime remains: {forbidden_runtime}")

    if errors:
        print("Portfolio validation failed")
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("Portfolio validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
