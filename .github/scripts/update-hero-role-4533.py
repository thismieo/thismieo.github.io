from pathlib import Path

index_path = Path('index.html')
workflow_path = Path('.github/workflows/update-hero-role-4533.yml')
script_path = Path('.github/scripts/update-hero-role-4533.py')

index = index_path.read_text(encoding='utf-8')
old = '<p class="hero-role">AI Engineering Student</p>'
new = '<p class="hero-role">Artificial Intelligence Engineering Student</p>'
if old not in index:
    raise SystemExit('Expected Hero role text was not found')
index = index.replace(old, new, 1)
if old in index:
    raise SystemExit('Old Hero role still remains')
index_path.write_text(index, encoding='utf-8')

workflow_path.unlink(missing_ok=True)
script_path.unlink(missing_ok=True)
print('Updated Hero role to Artificial Intelligence Engineering Student.')
