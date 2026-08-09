from pathlib import Path

css_path = Path('visual-system.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_version = '1.5.3'
new_version = '1.5.4'

if f'/* Blue Continuum — Shared Visual System {old_version}' not in css:
    raise SystemExit('Expected visual-system version not found; no changes made.')
if f'visual-system.css?v={old_version}' not in html:
    raise SystemExit('Expected visual-system cache reference not found; no changes made.')

replacements = {
    '/* ---------- 1.5.3 signature button sheen ---------- */': '/* ---------- 1.5.4 signature button sheen ---------- */',
    '/* A short, low-contrast sweep inside a 3s cycle. The long idle phase keeps\n   the effect atmospheric instead of constantly animated. */': '/* A clearly visible but restrained sweep inside a 3s cycle. The long idle phase\n   preserves the calm rhythm while the brighter core reads on light and dark CTAs. */',
    '  top: -42%;\n  left: -52%;\n  width: 34%;\n  height: 184%;': '  top: -46%;\n  left: -58%;\n  width: 42%;\n  height: 192%;',
    '    rgba(255,255,255,.025) 22%,\n    rgba(255,255,255,.105) 48%,\n    rgba(255,255,255,.035) 72%,': '    rgba(226,242,249,.055) 18%,\n    rgba(246,252,255,.255) 48%,\n    rgba(218,238,247,.075) 76%,',
    '  filter: blur(.25px);': '  filter: blur(.16px);\n  box-shadow: 0 0 18px rgba(222, 241, 249, .075);',
    '  0%, 63% {': '  0%, 60% {',
    '  68% { opacity: .22; }': '  65% { opacity: .38; }',
    '  82% {\n    opacity: .72;\n    transform: translate3d(455%,0,0) skewX(-18deg);\n  }\n  88%, 100% {\n    opacity: 0;\n    transform: translate3d(520%,0,0) skewX(-18deg);': '  80% {\n    opacity: .96;\n    transform: translate3d(430%,0,0) skewX(-18deg);\n  }\n  89%, 100% {\n    opacity: 0;\n    transform: translate3d(505%,0,0) skewX(-18deg);',
}

for old, new in replacements.items():
    if old not in css:
        raise SystemExit(f'Expected sheen fragment missing: {old[:70]!r}')
    css = css.replace(old, new, 1)

css = css.replace(
    f'/* Blue Continuum — Shared Visual System {old_version}',
    f'/* Blue Continuum — Shared Visual System {new_version}',
    1,
)
html = html.replace(
    f'visual-system.css?v={old_version}',
    f'visual-system.css?v={new_version}',
    1,
)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
