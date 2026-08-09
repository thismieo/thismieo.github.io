from pathlib import Path

css_path = Path('visual-system.css')
html_path = Path('index.html')
css = css_path.read_text(encoding='utf-8')
html = html_path.read_text(encoding='utf-8')

css = css.replace('Shared Visual System 1.5.9', 'Shared Visual System 1.5.10', 1)

css = css.replace('width: min(100%, 900px);\n  margin: clamp(24px, 2.2vw, 30px) auto 12px;',
                  'width: min(100%, 980px);\n  margin: clamp(24px, 2.2vw, 30px) auto 12px;', 1)

old_card = '''  min-width: 0;\n  min-height: 96px;\n  padding: 16px 18px 16px 82px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 6px;\n  overflow: hidden;\n  isolation: isolate;\n  border: 1px solid rgba(var(--accent-rgb), .20);\n  border-radius: 18px;\n  background:\n    radial-gradient(ellipse 76% 126% at -4% -16%, rgba(var(--accent-rgb), .105), transparent 67%),\n    radial-gradient(ellipse 58% 108% at 104% 112%, rgba(var(--secondary-rgb), .045), transparent 73%),\n    linear-gradient(148deg, rgba(var(--surface-a-rgb), .985), rgba(var(--surface-b-rgb), .995));\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,.025),\n    0 12px 29px rgba(0, 6, 12, .12);\n  transition: border-color 220ms ease, box-shadow 240ms ease;'''
new_card = '''  min-width: 0;\n  min-height: 86px;\n  padding: 14px 18px 14px 64px;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n  gap: 4px;\n  overflow: hidden;\n  isolation: isolate;\n  border: 1px solid rgba(var(--accent-rgb), .14);\n  border-radius: 18px;\n  background:\n    radial-gradient(ellipse 76% 126% at -4% -16%, rgba(var(--accent-rgb), .075), transparent 67%),\n    radial-gradient(ellipse 58% 108% at 104% 112%, rgba(var(--secondary-rgb), .030), transparent 73%),\n    linear-gradient(148deg, rgba(var(--surface-a-rgb), .985), rgba(var(--surface-b-rgb), .995));\n  box-shadow: 0 10px 24px rgba(0, 6, 12, .10);\n  transition: border-color 220ms ease, box-shadow 240ms ease;'''
if old_card not in css:
    raise SystemExit('About card block not found')
css = css.replace(old_card, new_card, 1)

css = css.replace('  left: 28px;\n  width: 22px;', '  left: 22px;\n  width: 22px;', 1)

icon_frame = '''.portfolio-panel .facts dt::after {\n  content: "";\n  position: absolute;\n  z-index: 1;\n  top: 50%;\n  left: 16px;\n  width: 46px;\n  height: 46px;\n  border: 1px solid rgba(var(--accent-rgb), .20);\n  border-radius: 14px;\n  background: linear-gradient(145deg, rgba(var(--accent-rgb), .135), rgba(var(--accent-rgb), .045));\n  box-shadow:\n    inset 0 1px 0 rgba(255,255,255,.028),\n    0 8px 18px rgba(0, 6, 12, .10);\n  transform: translateY(-50%);\n  pointer-events: none;\n}\n\n'''
if icon_frame not in css:
    raise SystemExit('Icon glass frame block not found')
css = css.replace(icon_frame, '', 1)

separator = '''.portfolio-panel .facts > div::after {\n  content: "";\n  position: absolute;\n  top: 18px;\n  bottom: 18px;\n  left: 69px;\n  width: 1px;\n  border-radius: 999px;\n  background: linear-gradient(180deg, transparent, rgba(var(--accent-rgb), .20) 25%, rgba(var(--accent-rgb), .12) 75%, transparent);\n  pointer-events: none;\n}\n\n'''
if separator not in css:
    raise SystemExit('About internal separator block not found')
css = css.replace(separator, '', 1)

css = css.replace('''  .portfolio-panel .facts > div {\n    min-height: 92px;\n    padding: 14px 14px 14px 76px;\n    border-radius: 17px;\n    gap: 5px;\n  }''', '''  .portfolio-panel .facts > div {\n    min-height: 80px;\n    padding: 12px 14px 12px 56px;\n    border-radius: 17px;\n    gap: 4px;\n  }''', 1)
css = css.replace('''  .portfolio-panel .facts dt::before {\n    left: 25px;\n    width: 20px;\n    height: 20px;\n  }\n\n  .portfolio-panel .facts dt::after {\n    left: 13px;\n    width: 44px;\n    height: 44px;\n    border-radius: 13px;\n  }\n\n  .portfolio-panel .facts > div::after {\n    top: 17px;\n    bottom: 17px;\n    left: 65px;\n  }''', '''  .portfolio-panel .facts dt::before {\n    left: 19px;\n    width: 20px;\n    height: 20px;\n  }''', 1)
css = css.replace('''  .portfolio-panel .facts > div { padding-left: 72px; padding-right: 12px; }\n  .portfolio-panel .facts dt::before { left: 23px; width: 19px; height: 19px; }\n  .portfolio-panel .facts dt::after { left: 12px; width: 42px; height: 42px; border-radius: 12px; }\n  .portfolio-panel .facts > div::after { left: 61px; }''', '''  .portfolio-panel .facts > div { padding-left: 54px; padding-right: 12px; }\n  .portfolio-panel .facts dt::before { left: 18px; width: 19px; height: 19px; }''', 1)

css = css.replace('''  .portfolio-panel .facts > div:hover {\n    border-color: rgba(var(--accent-rgb), .31);\n    box-shadow:\n      inset 0 1px 0 rgba(255,255,255,.030),\n      0 13px 31px rgba(0, 6, 12, .14);\n  }''', '''  .portfolio-panel .facts > div:hover {\n    border-color: rgba(var(--accent-rgb), .22);\n    box-shadow: 0 11px 26px rgba(0, 6, 12, .11);\n  }''', 1)

html = html.replace('visual-system.css?v=1.5.9', 'visual-system.css?v=1.5.10', 1)

# Guard against stale glass icon/container rules.
for stale in ['.portfolio-panel .facts dt::after {', '.portfolio-panel .facts > div::after {']:
    if stale in css:
        raise SystemExit(f'Stale About chrome rule remains: {stale}')

css_path.write_text(css, encoding='utf-8')
html_path.write_text(html, encoding='utf-8')
