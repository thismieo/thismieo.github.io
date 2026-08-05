from pathlib import Path

path = Path("index.html")
text = path.read_text(encoding="utf-8")

replacements = {
    '<span>for real-world challenges.</span>': '<span>for real-world challenges</span>',
    '<div><dt>Education</dt><dd>Studying at CIS College in the Diploma of Artificial Intelligence Engineering.</dd></div>': '<div><dt>Education</dt><dd>Studying at CIS College in the Diploma of Artificial Intelligence Engineering</dd></div>',
}

for old, new in replacements.items():
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected one match for {old!r}, found {count}")
    text = text.replace(old, new, 1)

if text.count('for real-world challenges.') != 0:
    raise SystemExit("Hero terminal punctuation remains")
if text.count('Artificial Intelligence Engineering.</dd>') != 0:
    raise SystemExit("Education terminal punctuation remains")

path.write_text(text, encoding="utf-8")
print("Final visible punctuation audit completed.")
