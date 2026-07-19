#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected one {label}; found {count}")
    return text.replace(old, new, 1)


def find_open(text: str, start: int) -> int:
    quote = None
    escaped = False
    comment = False
    i = start
    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""
        if comment:
            if ch == "*" and nxt == "/":
                comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch == "/" and nxt == "*":
            comment = True
            i += 2
            continue
        if ch in {"'", '"'}:
            quote = ch
        elif ch == "{":
            return i
        i += 1
    return -1


def find_close(text: str, open_index: int) -> int:
    depth = 1
    quote = None
    escaped = False
    comment = False
    i = open_index + 1
    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""
        if comment:
            if ch == "*" and nxt == "/":
                comment = False
                i += 2
                continue
            i += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == quote:
                quote = None
            i += 1
            continue
        if ch == "/" and nxt == "*":
            comment = True
            i += 2
            continue
        if ch in {"'", '"'}:
            quote = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit("Unbalanced CSS")


def strip_old_terminal_rules(text: str) -> str:
    forbidden = (
        ".hero-v33-terminal",
        ".terminal-v33-",
        "#hero-v33-terminal-text",
        "heroV33Caret",
    )
    containers = ("@media", "@supports", "@container", "@layer")
    output: list[str] = []
    cursor = 0

    while cursor < len(text):
        open_index = find_open(text, cursor)
        if open_index < 0:
            output.append(text[cursor:])
            break

        close_index = find_close(text, open_index)
        prelude = text[cursor:open_index]
        clean = re.sub(r"/\*[\s\S]*?\*/", "", prelude).strip()
        body = text[open_index + 1:close_index]

        if clean.startswith(containers):
            cleaned = strip_old_terminal_rules(body)
            if cleaned.strip():
                output.append(prelude + "{" + cleaned + "}")
        elif any(token in clean for token in forbidden):
            pass
        else:
            output.append(prelude + "{" + body + "}")

        cursor = close_index + 1

    return "".join(output)


index_path = ROOT / "index.html"
index = index_path.read_text(encoding="utf-8")
index = replace_once(
    index,
    'data-release="2026.07.19.87"',
    'data-release="2026.07.19.89"',
    "release marker",
)
index = replace_once(
    index,
    'hero-v33.js?v=20260719.88',
    'hero-v33.js?v=20260719.89',
    "Hero script cache key",
)
anchor = '  <link rel="stylesheet" href="tech-icons-v69.css?v=20260719.87" data-tech-icons-v69 />'
index = replace_once(
    index,
    anchor,
    anchor + '\n  <link rel="stylesheet" href="learning-console-v89.css?v=20260719.89" data-learning-console-v89 />',
    "stylesheet anchor",
)

old_markup = '''          <div class="hero-v33-terminal" aria-label="Animated learning status">
            <span class="terminal-v33-controls" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="terminal-v33-body">
              <small>journey.py / live learning log</small>
              <span class="terminal-v33-line" aria-hidden="true"><b class="terminal-v33-prompt">›</b><code id="hero-v33-terminal-text">current_focus = "Python Foundations"</code><i class="terminal-v33-caret"></i></span>
            </span>
            <span class="terminal-v33-live">Active</span>
          </div>'''

new_markup = '''          <aside class="hero-console-v89" aria-label="Current learning status">
            <span class="hero-console-v89-lights" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="hero-console-v89-copy">
              <small>learning.py / current status</small>
              <span class="hero-console-v89-messages" aria-hidden="true">
                <code class="hero-console-v89-message">focus = "Python Foundations"</code>
                <code class="hero-console-v89-message">mode = "Learn · Practice · Build"</code>
                <code class="hero-console-v89-message">next = "Data Analysis"</code>
              </span>
            </span>
            <span class="hero-console-v89-state"><i aria-hidden="true"></i>Active</span>
          </aside>'''

index = replace_once(index, old_markup, new_markup, "legacy Terminal markup")
index_path.write_text(index, encoding="utf-8")

hero_path = ROOT / "hero-v33.js"
hero = hero_path.read_text(encoding="utf-8")
hero = replace_once(
    hero,
    '  const output = document.querySelector("#hero-v33-terminal-text");\n',
    "",
    "legacy Terminal output lookup",
)
hero, count = re.subn(
    r'\n  if \(output\) \{[\s\S]*?\n  \}\n\n  const desktopPortrait',
    '\n\n  const desktopPortrait',
    hero,
    count=1,
)
if count != 1:
    raise SystemExit("Could not remove legacy Terminal runtime")
hero_path.write_text(hero, encoding="utf-8")

for css_path in ROOT.glob("*.css"):
    css = css_path.read_text(encoding="utf-8")
    css = strip_old_terminal_rules(css)
    css = css.replace('"terminal terminal"', '"console console"')
    css_path.write_text(css, encoding="utf-8")

for path in (
    ROOT / "_v89_ready",
    ROOT / "scripts" / "apply_v89_learning_console.py",
    ROOT / ".github" / "workflows" / "apply-v89-learning-console.yml",
):
    if path.exists():
        path.unlink()
