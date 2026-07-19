#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
VALIDATOR = ROOT / "scripts" / "validate_site.py"


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected one {label}; found {count}")
    return text.replace(old, new, 1)


index = INDEX.read_text(encoding="utf-8")
index = replace_once(
    index,
    'data-release="2026.07.19.90"',
    'data-release="2026.07.19.92"',
    "release token",
)
index = replace_once(
    index,
    '  <link rel="stylesheet" href="learning-console-v90.css?v=20260719.90" data-learning-console-v89 />',
    '  <link rel="stylesheet" href="learning-console-v92.css?v=20260719.92" data-learning-console-v92 />\n'
    '  <link rel="stylesheet" href="mobile-performance-v92.css?v=20260719.92" data-mobile-performance-v92 />',
    "console stylesheet link",
)

old_surface = '''            </nav>
          </div>

          <aside class="hero-console-v90" aria-label="Current learning status">
            <span class="hero-console-v90-lights" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="hero-console-v90-copy">
              <small>journey.py / live learning log</small>
              <span class="hero-console-v90-messages" aria-hidden="true">
                <code class="hero-console-v90-message">focus = "Python Foundations"</code>
                <code class="hero-console-v90-message">mode = "Learn · Practice · Build"</code>
                <code class="hero-console-v90-message">next = "Data Analysis"</code>
              </span>
            </span>
            <span class="hero-console-v90-state"><i aria-hidden="true"></i>Active</span>
          </aside>
        </div>'''

new_surface = '''            </nav>

            <aside class="hero-console-v92" aria-label="Current learning status">
              <span class="hero-console-v92-lights" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="hero-console-v92-copy">
                <small>journey.py / live learning log</small>
                <span class="hero-console-v92-messages" aria-hidden="true">
                  <code class="hero-console-v92-message">focus = "Python Foundations"</code>
                  <code class="hero-console-v92-message">mode = "Learn · Practice · Build"</code>
                  <code class="hero-console-v92-message">next = "Data Analysis"</code>
                  <i class="hero-console-v92-caret" aria-hidden="true"></i>
                </span>
              </span>
              <span class="hero-console-v92-state"><i aria-hidden="true"></i>Active</span>
            </aside>
          </div>
        </div>'''

index = replace_once(index, old_surface, new_surface, "Hero console surface")
INDEX.write_text(index, encoding="utf-8")

validator = VALIDATOR.read_text(encoding="utf-8")
start_marker = "    required_runtime = {\n"
end_marker = "    if errors:\n"
start = validator.find(start_marker)
end = validator.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit("Could not locate the validator runtime block")

new_validation = '''    required_runtime = {
        "interactions.js",
        "hero-v33.js",
        "hero-interface-v68.js",
        "hero-interface-v68.css",
        "tech-icons-v69.css",
        "learning-console-v92.css",
        "mobile-performance-v92.css",
        "projects-runtime-v68.js",
        "core-contact-v63.js",
    }
    missing_runtime = sorted(name for name in required_runtime if name not in loaded_assets and name not in dynamic_source)
    if missing_runtime:
        errors.append(f"Required runtime assets are not loaded: {', '.join(missing_runtime)}")

    required_index_tokens = (
        'data-release="2026.07.19.92"',
        'learning-console-v92.css?v=20260719.92',
        'mobile-performance-v92.css?v=20260719.92',
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

    inside_copy_marker = '            </nav>\\n\\n            <aside class="hero-console-v92"'
    closing_copy_marker = '            </aside>\\n          </div>\\n        </div>'
    if inside_copy_marker not in index_text or closing_copy_marker not in index_text:
        errors.append("V92 Hero console is not physically nested below the profile links")

    all_css = "\\n".join(path.read_text(encoding="utf-8", errors="replace") for path in css_files)
    console_css = (ROOT / "learning-console-v92.css").read_text(encoding="utf-8", errors="replace")
    mobile_css = (ROOT / "mobile-performance-v92.css").read_text(encoding="utf-8", errors="replace")
    terminal_js = (ROOT / "hero-v33.js").read_text(encoding="utf-8", errors="replace")

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
    legacy_surface = "\\n".join((index_text, all_css, terminal_js))
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

'''

validator = validator[:start] + new_validation + validator[end:]
VALIDATOR.write_text(validator, encoding="utf-8")

for obsolete in (ROOT / "learning-console-v90.css", ROOT / "mobile-performance-v91.css"):
    if obsolete.exists():
        obsolete.unlink()

Path(__file__).unlink()
