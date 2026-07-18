#!/usr/bin/env python3
"""Comprehensive structural and asset checks for the static portfolio."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.classes: list[str] = []
        self.local_assets: list[tuple[str, str]] = []
        self.section_ids: list[str] = []
        self.nav_targets: list[str] = []
        self.runtime_assets: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)
            if tag == "section":
                self.section_ids.append(element_id)

        class_value = values.get("class")
        if class_value:
            self.classes.extend(class_value.split())

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
        if not clean:
            return

        self.local_assets.append((candidate, clean))
        if tag in {"link", "script"}:
            self.runtime_assets.append(clean)


def fail(errors: list[str]) -> None:
    print("Portfolio validation failed")
    for error in errors:
        print(f"ERROR: {error}")
    raise SystemExit(1)


def check_balanced_css(path: Path, errors: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
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

    if not INDEX.exists():
        fail(["index.html is missing"])

    index_text = INDEX.read_text(encoding="utf-8")
    parser = SiteParser()
    parser.feed(index_text)
    parser.close()

    duplicates = sorted(item for item, count in Counter(parser.ids).items() if count > 1)
    if duplicates:
        errors.append(f"Duplicate HTML ids: {', '.join(duplicates)}")

    missing_targets = sorted(set(parser.nav_targets) - set(parser.ids))
    if missing_targets:
        errors.append(f"Anchor targets are missing: {', '.join(missing_targets)}")

    required_ids = {
        "home",
        "about",
        "journey",
        "stack",
        "neural",
        "projects",
        "goals",
        "contact",
        "thank-you",
    }
    missing_required = sorted(required_ids - set(parser.ids))
    if missing_required:
        errors.append(f"Required sections are missing: {', '.join(missing_required)}")

    for original, clean in parser.local_assets:
        if not (ROOT / clean).is_file():
            errors.append(f"Referenced local asset is missing: {original}")

    duplicate_assets = sorted(
        asset for asset, count in Counter(parser.runtime_assets).items() if count > 1
    )
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
        if conflict_pattern.search(text):
            errors.append(f"Merge-conflict marker remains in {source_file.relative_to(ROOT)}")
        if source_file.stat().st_size == 0:
            errors.append(f"Empty source file: {source_file.relative_to(ROOT)}")

    loaded_assets = set(parser.runtime_assets)
    dynamic_source = "\n".join(
        path.read_text(encoding="utf-8", errors="replace") for path in js_files
    )

    orphan_assets = sorted(
        path.name
        for path in [*css_files, *js_files]
        if path.name not in loaded_assets and path.name not in dynamic_source
    )
    if orphan_assets:
        errors.append(f"Unreferenced root CSS/JS files: {', '.join(orphan_assets)}")

    required_runtime_files = {
        "interactions.js",
        "portrait.js",
        "mobile-nav.js",
        "hero-interface-v68.css",
        "hero-interface-v68.js",
        "projects-runtime-v68.js",
        "project-readouts-v66.css",
        "core-contact-v63.css",
        "core-contact-v63.js",
    }
    missing_runtime = sorted(
        name
        for name in required_runtime_files
        if name not in loaded_assets and name not in dynamic_source
    )
    if missing_runtime:
        errors.append(f"Required runtime assets are not loaded: {', '.join(missing_runtime)}")

    obsolete_assets = {
        "hero-polish-v36.css",
        "project-mobile-v60.css",
        "project-mobile-v60.js",
        "project-tabs-v61.css",
        "project-tabs-v61.js",
        "projects-grid-v62.js",
        "script.js",
        "v5.js",
        "neural-network.js",
    }
    existing_obsolete = sorted(name for name in obsolete_assets if (ROOT / name).exists())
    if existing_obsolete:
        errors.append(f"Obsolete files remain: {', '.join(existing_obsolete)}")

    combined_source = "\n".join(
        path.read_text(encoding="utf-8", errors="replace") for path in source_files
    )
    referenced_obsolete = sorted(name for name in obsolete_assets if name in combined_source)
    if referenced_obsolete:
        errors.append(f"Obsolete files are still referenced: {', '.join(referenced_obsolete)}")

    ribbon_files = (ROOT / "cyber-header.css", ROOT / "hero-v44.css", ROOT / "hero-interface-v68.css")
    paused_rule = re.compile(r"animation-play-state\s*:\s*paused", re.IGNORECASE)
    for ribbon_file in ribbon_files:
        if paused_rule.search(ribbon_file.read_text(encoding="utf-8", errors="replace")):
            errors.append(f"A ribbon pause rule remains in {ribbon_file.name}")

    if "hero-v33-portrait" in parser.classes or "portrait-modal" in parser.ids:
        errors.append("Removed portrait markup remains in index.html")

    if 'data-release="2026.07.19.72"' not in index_text:
        errors.append("V72 release marker is missing")

    exact_once_assets = (
        "hero-interface-v68.css",
        "hero-interface-v68.js",
        "projects-runtime-v68.js",
    )
    for asset in exact_once_assets:
        if index_text.count(asset) != 1:
            errors.append(f"{asset} must appear exactly once in index.html")

    numbered_assets = sorted(
        asset for asset in loaded_assets if re.fullmatch(r"v\d+\.(?:css|js)", asset)
    )
    if numbered_assets:
        errors.append(f"Numbered release assets are still loaded: {', '.join(numbered_assets)}")

    numbered_files = sorted(
        path.name
        for pattern in ("v*.css", "v*.js")
        for path in ROOT.glob(pattern)
        if re.fullmatch(r"v\d+\.(?:css|js)", path.name)
    )
    if numbered_files:
        errors.append(f"Numbered release files remain in root: {', '.join(numbered_files)}")

    if "data-v18-cyber-rail" in index_text:
        errors.append("Legacy version-specific data attribute remains in index.html")

    if errors:
        fail(errors)

    print("Portfolio validation passed")
    print(f"HTML ids checked: {len(parser.ids)}")
    print(f"Sections checked: {len(parser.section_ids)}")
    print(f"Anchor targets checked: {len(parser.nav_targets)}")
    print(f"Local assets checked: {len(parser.local_assets)}")
    print(f"CSS files checked: {len(css_files)}")
    print(f"JavaScript files tracked: {len(js_files)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
