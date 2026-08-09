from pathlib import Path

css_path = Path('visual-system.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

old_version = '1.5.2'
new_version = '1.5.3'
marker = '/* ---------- 1.5.3 signature button sheen ---------- */'

if marker in css:
    raise SystemExit('Button sheen already applied.')
if f'/* Blue Continuum — Shared Visual System {old_version}' not in css:
    raise SystemExit('Expected visual-system version not found; no changes made.')
if f'visual-system.css?v={old_version}' not in html:
    raise SystemExit('Expected visual-system cache reference not found; no changes made.')

block = r'''

/* ---------- 1.5.3 signature button sheen ---------- */
/* A short, low-contrast sweep inside a 3s cycle. The long idle phase keeps
   the effect atmospheric instead of constantly animated. */
:is(
  .portfolio-panel .hero-cta,
  .portfolio-panel .workshop-entry-action,
  .workshop-view .practice-milestone-action
) {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

:is(
  .portfolio-panel .hero-cta,
  .portfolio-panel .workshop-entry-action,
  .workshop-view .practice-milestone-action
)::after {
  content: "";
  position: absolute;
  z-index: 1;
  top: -42%;
  left: -52%;
  width: 34%;
  height: 184%;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,.025) 22%,
    rgba(255,255,255,.105) 48%,
    rgba(255,255,255,.035) 72%,
    transparent 100%
  );
  filter: blur(.25px);
  opacity: 0;
  transform: translate3d(0,0,0) skewX(-18deg);
  will-change: transform, opacity;
  animation: continuum-button-sheen 3s cubic-bezier(.22, 1, .36, 1) infinite;
}

:is(
  .portfolio-panel .hero-cta,
  .portfolio-panel .workshop-entry-action,
  .workshop-view .practice-milestone-action
) > * {
  position: relative;
  z-index: 2;
}

@keyframes continuum-button-sheen {
  0%, 63% {
    opacity: 0;
    transform: translate3d(0,0,0) skewX(-18deg);
  }
  68% { opacity: .22; }
  82% {
    opacity: .72;
    transform: translate3d(455%,0,0) skewX(-18deg);
  }
  88%, 100% {
    opacity: 0;
    transform: translate3d(520%,0,0) skewX(-18deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  :is(
    .portfolio-panel .hero-cta,
    .portfolio-panel .workshop-entry-action,
    .workshop-view .practice-milestone-action
  )::after {
    animation: none;
    opacity: 0;
  }
}
'''

css = css.replace(
    f'/* Blue Continuum — Shared Visual System {old_version}',
    f'/* Blue Continuum — Shared Visual System {new_version}',
    1,
)
css = css.rstrip() + block + '\n'
html = html.replace(
    f'visual-system.css?v={old_version}',
    f'visual-system.css?v={new_version}',
    1,
)

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
