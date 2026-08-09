from pathlib import Path

index_path = Path('index.html')
styles_path = Path('styles.css')
workflow_path = Path('.github/workflows/remove-hero-education-4532.yml')
script_path = Path('.github/scripts/remove-hero-education-4532.py')

index = index_path.read_text(encoding='utf-8')
styles = styles_path.read_text(encoding='utf-8')

hero_education = '        <p class="hero-education"><span class="hero-education-college">CIS College</span><span class="hero-education-separator" aria-hidden="true">·</span><span class="hero-education-program">Diploma in Artificial Intelligence Engineering</span></p>\n'
if hero_education not in index:
    raise SystemExit('Expected Hero education line was not found')
index = index.replace(hero_education, '', 1)

style_lines = styles.splitlines(keepends=True)
removed = [line for line in style_lines if '.hero-education' in line]
if len(removed) < 4:
    raise SystemExit(f'Expected Hero education CSS rules were not all found; found {len(removed)}')
styles = ''.join(line for line in style_lines if '.hero-education' not in line)

old_version = '4.5.31'
new_version = '4.5.32'
if old_version not in styles or old_version not in index:
    raise SystemExit('Expected 4.5.31 version references were not found')
styles = styles.replace(old_version, new_version)
index = index.replace(old_version, new_version)

if 'hero-education' in index or 'hero-education' in styles:
    raise SystemExit('Hero education markup/CSS still remains after cleanup')
if f'styles.css?v={new_version}' not in index:
    raise SystemExit('Updated stylesheet cache version is missing')
if new_version not in styles:
    raise SystemExit('Updated stylesheet version header is missing')

index_path.write_text(index, encoding='utf-8')
styles_path.write_text(styles, encoding='utf-8')

workflow_path.unlink(missing_ok=True)
script_path.unlink(missing_ok=True)

print(f'Removed Hero education markup and {len(removed)} CSS rule lines; updated styles to {new_version}.')
