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
    required_runtime = {"interactions.js", "hero-v33.js", "hero-interface-v68.js", "hero-interface-v68.css", "tech-icons-v69.css", "projects-runtime-v68.js", "core-contact-v63.js"}
    missing_runtime = sorted(name for name in required_runtime if name not in loaded_assets and name not in dynamic_source)
    if missing_runtime:
        errors.append(f"Required runtime assets are not loaded: {', '.join(missing_runtime)}")

    if 'data-release="2026.07.19.87"' not in index_text:
        errors.append("V87 release marker is missing")
    if 'tech-icons-v69.css?v=20260719.87' not in index_text:
        errors.append("V87 technical rail stylesheet cache key is missing")
    if 'hero-interface-v68.js?v=20260719.87' not in index_text:
        errors.append("V87 visual-only Hero script cache key is missing")

    hero_js = (ROOT / "hero-interface-v68.js").read_text(encoding="utf-8", errors="replace")
    terminal_js = (ROOT / "hero-v33.js").read_text(encoding="utf-8", errors="replace")
    tech_css = (ROOT / "tech-icons-v69.css").read_text(encoding="utf-8", errors="replace")
    micro_css = (ROOT / "micro-polish.css").read_text(encoding="utf-8", errors="replace")

    required_hero_tokens = (
        'document.documentElement.dataset.release = "2026.07.19.87"',
        'micro-polish.css?v=20260719.87',
        'dataset.techIcons = "v87"',
        'CORE LEARNING STACK',
        'document.createElement("a")',
        'hero-tech-rail',
        'hero-tech-item',
    )
    for token in required_hero_tokens:
        if token not in hero_js:
            errors.append(f"V87 Hero token is missing: {token}")

    forbidden_runtime_tokens = (
        "interaction-v86.css",
        "requestAnimationFrame",
        "setPointerCapture",
        "pointerdown",
        "pointermove",
        "is-pressing",
        "is-releasing",
        "--press-x",
        "--press-y",
        "--terminal-visible-chars",
        "terminalV86Ready",
        "is-holding",
        "is-deleting",
    )
    for token in forbidden_runtime_tokens:
        if token in hero_js or token in tech_css or token in micro_css:
            errors.append(f"Removed custom interaction runtime remains: {token}")

    if (ROOT / "interaction-v86.css").exists():
        errors.append("Superseded interaction-v86.css remains")

    original_terminal_tokens = (
        'const output = document.querySelector("#hero-v33-terminal-text")',
        "window.setTimeout(step, delay)",
        "schedule(1650)",
        "schedule(deleting ? 24 : 48)",
    )
    for token in original_terminal_tokens:
        if token not in terminal_js:
            errors.append(f"Original terminal runtime token is missing: {token}")

    if "hero-v33-terminal-text" in hero_js:
        errors.append("Hero visual script must not replace or control the Terminal output")

    required_visual_css = (
        "@media (hover: hover) and (pointer: fine)",
        "@media (hover: none), (pointer: coarse)",
        "@media (prefers-reduced-motion: reduce)",
        "@keyframes heroTechRailWave",
        "#home.has-tech-rail .hero-tech-item:focus-visible",
    )
    for token in required_visual_css:
        if token not in tech_css:
            errors.append(f"V87 visual rail CSS token is missing: {token}")

    if errors:
        print("Portfolio validation failed")
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print("Portfolio validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
