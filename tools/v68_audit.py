from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import re
import subprocess
import sys

root = Path(".")
errors: list[str] = []


class IndexParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.local_assets: list[tuple[str, str, str]] = []
        self.anchor_targets: list[str] = []
        self.script_and_style_refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)

        href = values.get("href")
        src = values.get("src")
        if tag == "a" and href and href.startswith("#") and len(href) > 1:
            self.anchor_targets.append(href[1:])

        value = src if tag in {"script", "img", "source"} else href if tag == "link" else None
        if not value:
            return

        parsed = urlsplit(value)
        if parsed.scheme or parsed.netloc or value.startswith(("data:", "mailto:", "tel:", "//")):
            return

        path = parsed.path.lstrip("/")
        if not path:
            return

        self.local_assets.append((tag, value, path))
        if tag in {"script", "link"}:
            self.script_and_style_refs.append(path)


def audit_css_balance(path: Path) -> None:
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
                errors.append(f"CSS closes before opening: {path}")
                return
        index += 1

    if in_comment:
        errors.append(f"unclosed CSS comment: {path}")
    if quote:
        errors.append(f"unclosed CSS string: {path}")
    if depth != 0:
        errors.append(f"unbalanced CSS braces ({depth}): {path}")


index_path = Path("index.html")
index_text = index_path.read_text(encoding="utf-8")
parser = IndexParser()
parser.feed(index_text)

seen_ids: set[str] = set()
duplicate_ids: set[str] = set()
for element_id in parser.ids:
    if element_id in seen_ids:
        duplicate_ids.add(element_id)
    seen_ids.add(element_id)
if duplicate_ids:
    errors.append(f"duplicate HTML ids: {sorted(duplicate_ids)}")

missing_anchors = sorted(set(parser.anchor_targets) - set(parser.ids))
if missing_anchors:
    errors.append(f"missing anchor targets: {missing_anchors}")

for tag, original, local_path in parser.local_assets:
    if not (root / local_path).is_file():
        errors.append(f"missing local {tag} asset: {original}")

duplicate_refs = sorted({
    ref for ref in parser.script_and_style_refs
    if parser.script_and_style_refs.count(ref) > 1
})
if duplicate_refs:
    errors.append(f"duplicate script/style references: {duplicate_refs}")

css_files = sorted(root.glob("*.css"))
js_files = sorted(root.glob("*.js"))
for css_file in css_files:
    audit_css_balance(css_file)

for js_file in js_files:
    completed = subprocess.run(
        ["node", "--check", str(js_file)],
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        errors.append(f"JavaScript syntax failed: {js_file}\n{completed.stderr.strip()}")

text_files = [index_path, *css_files, *js_files]
combined = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in text_files)

ribbon_files = [Path("cyber-header.css"), Path("hero-v44.css"), Path("hero-interface-v68.css")]
for ribbon_file in ribbon_files:
    ribbon_text = ribbon_file.read_text(encoding="utf-8", errors="replace")
    if re.search(r"animation-play-state\s*:\s*paused", ribbon_text, re.IGNORECASE):
        errors.append(f"a paused ribbon rule still exists in {ribbon_file}")

conflict_pattern = re.compile(r"^(<<<<<<<|=======|>>>>>>>)", re.MULTILINE)
for path in text_files:
    if conflict_pattern.search(path.read_text(encoding="utf-8", errors="replace")):
        errors.append(f"merge conflict marker in {path}")

obsolete_names = [
    "project-mobile-v60.css",
    "project-mobile-v60.js",
    "project-tabs-v61.css",
    "project-tabs-v61.js",
    "projects-grid-v62.js",
]
for name in obsolete_names:
    if (root / name).exists():
        errors.append(f"obsolete file still exists: {name}")
    if name in combined:
        errors.append(f"obsolete file still referenced: {name}")

required_names = [
    "hero-interface-v68.css",
    "hero-interface-v68.js",
    "projects-runtime-v68.js",
    "project-readouts-v66.css",
    "core-contact-v63.css",
    "core-contact-v63.js",
]
for name in required_names:
    if not (root / name).is_file():
        errors.append(f"required V68 asset missing: {name}")

if "hero-v33-portrait" in index_text or "portrait-modal-v6" in index_text:
    errors.append("portrait markup remains in index.html")

empty_files = [str(path) for path in text_files if path.stat().st_size == 0]
if empty_files:
    errors.append(f"empty source files: {empty_files}")

if index_text.count("hero-interface-v68.css") != 1:
    errors.append("V68 hero stylesheet must be referenced exactly once")
if index_text.count("hero-interface-v68.js") != 1:
    errors.append("V68 hero runtime must be referenced exactly once")
if index_text.count("projects-runtime-v68.js") != 1:
    errors.append("V68 project runtime must be referenced exactly once")

referenced_names = set(parser.script_and_style_refs)
dynamic_source = "\n".join(path.read_text(encoding="utf-8", errors="replace") for path in js_files)
potential_orphans: list[str] = []
for path in [*css_files, *js_files]:
    if path.name in referenced_names or path.name in dynamic_source:
        continue
    potential_orphans.append(path.name)

print(f"HTML ids checked: {len(parser.ids)}")
print(f"Anchor targets checked: {len(parser.anchor_targets)}")
print(f"Local assets checked: {len(parser.local_assets)}")
print(f"CSS files checked: {len(css_files)}")
print(f"JavaScript files checked: {len(js_files)}")
print("Potential unreferenced top-level CSS/JS (manual review only):")
for name in potential_orphans:
    print(f"  - {name}")

if errors:
    print("AUDIT FAILED")
    for error in errors:
        print(f"  ERROR: {error}")
    sys.exit(1)

print("AUDIT PASSED")
