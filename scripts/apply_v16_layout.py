from pathlib import Path


path = Path("index.html")
text = path.read_text(encoding="utf-8")

old_assets = '''  <link rel="stylesheet" href="v13.css?v=3" />
  <script src="v12.js?v=1" defer></script>'''
new_assets = '''  <link rel="stylesheet" href="v16.css?v=1" />
  <script src="v12.js?v=1" defer></script>
  <script src="v16.js?v=1" defer></script>'''

old_brand = '''      <div class="brand">
        <button class="brand-mark brand-portrait" id="portrait-trigger" type="button" aria-haspopup="dialog" aria-controls="portrait-modal" aria-label="Open Mohammed Muayad portrait" title="View portrait">
          <img src="https://avatars.githubusercontent.com/u/302812532?v=4&s=256" alt="Mohammed Muayad" width="256" height="256" decoding="async" fetchpriority="high" />
        </button>
        <a class="brand-copy" href="#home" aria-label="Mohammed Muayad home">
          <strong>Mohammed Muayad</strong>
          <small>AI Engineering Student</small>
        </a>
      </div>

'''

old_identity = '''          <div class="eyebrow"><span class="status-dot"></span> Baghdad, Iraq · Learning in public</div>
          <p class="section-index">PORTFOLIO / 2026</p>
          <h1>'''

new_identity = '''          <div class="eyebrow"><span class="status-dot"></span> BAGHDAD, IRAQ <span aria-hidden="true">•</span> LEARNING IN PUBLIC</div>
          <p class="section-index">PORTFOLIO / 2026</p>
          <button class="hero-portrait" id="portrait-trigger" type="button" aria-haspopup="dialog" aria-controls="portrait-modal" aria-label="Open high-resolution portrait of Mohammed Muayad" title="View portrait">
            <img
              src="https://avatars.githubusercontent.com/u/302812532?v=4&s=1024"
              srcset="https://avatars.githubusercontent.com/u/302812532?v=4&s=512 512w, https://avatars.githubusercontent.com/u/302812532?v=4&s=1024 1024w, https://avatars.githubusercontent.com/u/302812532?v=4&s=2048 2048w"
              sizes="(max-width: 390px) 74vw, (max-width: 580px) 72vw, (max-width: 860px) 68vw, 248px"
              alt="Mohammed Muayad"
              width="2048"
              height="2048"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </button>
          <h1>'''

replacements = (
    (old_assets, new_assets, "asset links"),
    (old_brand, "", "repeated header identity"),
    (old_identity, new_identity, "hero identity block"),
)

for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"Expected exactly one {label} block, found {count}")
    text = text.replace(old, new, 1)

checks = {
    'id="portrait-trigger"': 1,
    'v16.css?v=1': 1,
    'v16.js?v=1': 1,
    'BAGHDAD, IRAQ': 1,
}

for token, expected in checks.items():
    actual = text.count(token)
    if actual != expected:
        raise SystemExit(f"Expected {token!r} exactly {expected} time(s), found {actual}")

if "v13.css" in text:
    raise SystemExit("Legacy V13 stylesheet is still loaded")

path.write_text(text, encoding="utf-8")
