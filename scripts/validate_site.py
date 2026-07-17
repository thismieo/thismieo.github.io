#!/usr/bin/env python3
"""Lightweight structural checks for the static portfolio."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.local_assets: list[str] = []
        self.section_ids: list[str] = []
        self.nav_targets: list[str] = []
        self.tags: Counter[str] = Counter()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tags[tag] += 1
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)
            if tag == "section":
                self.section_ids.append(element_id)

        if tag == "link" and values.get("rel") == "stylesheet":
            href = values.get("href")
            if href and not href.startswith(("http://", "https://", "//")):
                self.local_assets.append(href)

        if tag == "script":
            src = values.get("src")
            if src and not src.startswith(("http://", "https://", "//")):
                self.local_assets.append(src)

        if tag == "a":
            href = values.get("href")
            if href and href.startswith("#") and len(href) > 1:
                self.nav_targets.append(href[1:])


def fail(message: str) -> None:
    print(f"ERROR: {message}")
    raise SystemExit(1)


def check_balanced_css(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    stripped = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    if stripped.count("{") != stripped.count("}"):
        fail(f"Unbalanced CSS braces in {path.relative_to(ROOT)}")


def main() -> int:
    if not INDEX.exists():
        fail("index.html is missing")

    index_text = INDEX.read_text(encoding="utf-8")
    parser = SiteParser()
    parser.feed(index_text)
    parser.close()

    duplicates = [item for item, count in Counter(parser.ids).items() if count > 1]
    if duplicates:
        fail(f"Duplicate HTML ids: {', '.join(sorted(duplicates))}")

    for asset in parser.local_assets:
        clean = asset.split("?", 1)[0].split("#", 1)[0]
        if clean and not (ROOT / clean).is_file():
            fail(f"Referenced local asset is missing: {asset}")

    missing_targets = sorted(set(parser.nav_targets) - set(parser.ids))
    if missing_targets:
        fail(f"Anchor targets are missing: {', '.join(missing_targets)}")

    required_ids = {
        "home", "about", "journey", "stack", "neural", "projects",
        "goals", "contact", "thank-you", "portrait-modal"
    }
    missing_required = sorted(required_ids - set(parser.ids))
    if missing_required:
        fail(f"Required sections/components are missing: {', '.join(missing_required)}")

    css_files = (
        "styles.css",
        "effects.css",
        "interface-polish.css",
        "portrait-mobile.css",
        "goals-mobile.css",
        "stability.css",
        "hero-portrait.css",
        "cyber-header.css",
        "goals-desktop.css",
        "neural-layout.css",
        "desktop-rhythm.css",
        "mobile.css",
    )
    for css_file in css_files:
        check_balanced_css(ROOT / css_file)

    loaded = {asset.split("?", 1)[0] for asset in parser.local_assets}
    required_runtime_files = {"interactions.js", "portrait.js", "mobile-nav.js"}
    missing_runtime = sorted(required_runtime_files - loaded)
    if missing_runtime:
        fail(f"Current runtime files are not loaded: {', '.join(missing_runtime)}")

    legacy_runtime_files = {"script.js", "v5.js", "neural-network.js"}
    accidentally_loaded = sorted(legacy_runtime_files & loaded)
    if accidentally_loaded:
        fail(f"Legacy runtime files are still loaded: {', '.join(accidentally_loaded)}")

    numbered_assets = sorted(
        asset for asset in loaded
        if re.fullmatch(r"v\d+\.(?:css|js)", asset)
    )
    if numbered_assets:
        fail(f"Numbered release assets are still loaded: {', '.join(numbered_assets)}")

    numbered_files = sorted(
        path.name
        for pattern in ("v*.css", "v*.js")
        for path in ROOT.glob(pattern)
        if re.fullmatch(r"v\d+\.(?:css|js)", path.name)
    )
    if numbered_files:
        fail(f"Numbered release files remain in repository root: {', '.join(numbered_files)}")

    if "data-v18-cyber-rail" in index_text:
        fail("Legacy version-specific data attribute remains in index.html")

    print("Portfolio validation passed")
    print(f"HTML ids: {len(parser.ids)}")
    print(f"Sections: {len(parser.section_ids)}")
    print(f"Local assets checked: {len(parser.local_assets)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
