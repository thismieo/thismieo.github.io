from pathlib import Path
import re


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


index_path = Path("index.html")
index = index_path.read_text(encoding="utf-8")

index = replace_once(index, 'data-release="2026.07.18.67"', 'data-release="2026.07.18.68"', "release marker")
index = replace_once(index, 'cyber-header.css?v=20260718.44', 'cyber-header.css?v=20260718.68', "cyber header cache")
index = replace_once(index, 'hero-v44.css?v=20260718.44', 'hero-v44.css?v=20260718.68', "hero V44 cache")
index = replace_once(index, 'portrait.js?v=20260718.50', 'portrait.js?v=20260718.68', "portrait runtime cache")
index = replace_once(index, 'core-contact-v63.css?v=20260718.63', 'core-contact-v63.css?v=20260718.68', "core CSS cache")
index = replace_once(index, 'project-readouts-v66.css?v=20260718.67', 'project-readouts-v66.css?v=20260718.68', "readout cache")
index = replace_once(index, 'core-contact-v63.js?v=20260718.67', 'core-contact-v63.js?v=20260718.68', "core runtime cache")

obsolete_lines = [
    '  <link rel="stylesheet" href="project-mobile-v60.css?v=20260718.60" data-project-mobile-v60 />\n',
    '  <link rel="stylesheet" href="project-tabs-v61.css?v=20260718.61" data-project-tabs-v61 />\n',
    '  <script src="project-mobile-v60.js?v=20260718.60" defer></script>\n',
    '  <script src="project-tabs-v61.js?v=20260718.61" defer></script>\n',
]
for line in obsolete_lines:
    index = replace_once(index, line, "", f"remove {line.strip()}")

index = replace_once(
    index,
    '  <script src="projects-grid-v62.js?v=20260718.62" defer></script>\n',
    '  <script src="projects-runtime-v68.js?v=20260718.68" defer></script>\n',
    "replace legacy project runtime",
)

readout_link = '  <link rel="stylesheet" href="project-readouts-v66.css?v=20260718.68" data-project-readouts-v66 />\n'
index = replace_once(
    index,
    readout_link,
    readout_link + '  <link rel="stylesheet" href="hero-interface-v68.css?v=20260718.68" data-hero-interface-v68 />\n',
    "wire V68 hero stylesheet",
)

core_script = '  <script src="core-contact-v63.js?v=20260718.68" defer></script>\n'
index = replace_once(
    index,
    core_script,
    core_script + '  <script src="hero-interface-v68.js?v=20260718.68" defer></script>\n',
    "wire V68 hero runtime",
)

portrait_figure = re.compile(
    r'\n\s*<figure class="hero-v33-portrait".*?</figure>\n',
    re.DOTALL,
)
index, removed_figures = portrait_figure.subn("\n", index, count=1)
if removed_figures != 1:
    raise SystemExit(f"portrait figure: expected one block, removed {removed_figures}")

portrait_modal = re.compile(
    r'\n\s*<div class="portrait-modal portrait-modal-v6" id="portrait-modal".*?</div>\n\s*</body>',
    re.DOTALL,
)
index, removed_modals = portrait_modal.subn("\n</body>", index, count=1)
if removed_modals != 1:
    raise SystemExit(f"portrait modal: expected one block, removed {removed_modals}")

index_path.write_text(index, encoding="utf-8")

cyber_path = Path("cyber-header.css")
cyber = cyber_path.read_text(encoding="utf-8")
cyber = replace_once(
    cyber,
    '.cyber-stream:hover .cyber-track-v46,\n.cyber-stream:focus-within .cyber-track-v46 {\n  animation-play-state: paused;\n}\n\n',
    '',
    "remove upper ribbon pause",
)
cyber_path.write_text(cyber, encoding="utf-8")

hero_path = Path("hero-v44.css")
hero = hero_path.read_text(encoding="utf-8")
hero = replace_once(
    hero,
    '.system-ticker:hover .ticker-v44-track,\n.system-ticker:focus-within .ticker-v44-track {\n  animation-play-state: paused;\n}\n\n',
    '',
    "remove lower ribbon pause",
)
hero_path.write_text(hero, encoding="utf-8")

portrait_path = Path("portrait.js")
portrait = portrait_path.read_text(encoding="utf-8")
portrait = replace_once(portrait, '2026.07.18.50', '2026.07.18.68', "portrait release")
portrait = replace_once(portrait, 'mobile-v47.css?v=20260718.50', 'mobile-v47.css?v=20260718.68', "mobile layer cache")

old_portrait_probe = '''  const portraitImage = document.querySelector("#home .hero-v33-portrait img");
  if (portraitImage) {
    portraitImage.sizes = "(max-width: 350px) 176px, (max-width: 620px) 190px, (max-width: 860px) 210px, (min-width: 1181px) 204px, 148px";
    portraitImage.decoding = "async";
    portraitImage.fetchPriority = "high";
  }

'''
portrait = replace_once(portrait, old_portrait_probe, "", "remove obsolete portrait probe")

old_entries = '''  const entries = [
    "Logic Before Complexity",
    "Every Bug Reveals a Lesson",
    "Data Becomes Intelligence",
    "Build Systems · Not Shortcuts",
    "Patterns Become Predictions",
    "Think · Test · Refine",
    "Progress Compounds Quietly",
    "Code With Purpose"
  ];'''
new_entries = '''  const entries = [
    "Build Systems · Not Shortcuts",
    "Data Becomes Intelligence",
    "Think · Test · Refine",
    "Patterns Become Predictions",
    "Progress Compounds Quietly",
    "Code With Purpose"
  ];'''
portrait = replace_once(portrait, old_entries, new_entries, "simplify upper ribbon statements")
portrait_path.write_text(portrait, encoding="utf-8")

core_path = Path("core-contact-v63.js")
core = core_path.read_text(encoding="utf-8")
core = replace_once(core, '2026.07.18.67', '2026.07.18.68', "core release")
core = replace_once(core, 'core-contact-v63.css?v=20260718.67', 'core-contact-v63.css?v=20260718.68', "core CSS runtime cache")
core = replace_once(core, 'project-readouts-v66.css?v=20260718.67', 'project-readouts-v66.css?v=20260718.68', "readout runtime cache")

portrait_cleanup = '''  /* Remove the personal portrait and its now-unused viewer. The globe, copy,
     terminal, buttons and planetary motion remain untouched. */
  document.querySelectorAll(
    "#home .hero-v33-portrait, #home .hero-mobile-legacy .hero-portrait"
  ).forEach((portrait) => portrait.remove());
  document.querySelector("#portrait-modal")?.remove();

'''
core = replace_once(core, portrait_cleanup, "", "remove obsolete runtime portrait cleanup")
core_path.write_text(core, encoding="utf-8")

for obsolete in [
    "project-mobile-v60.css",
    "project-mobile-v60.js",
    "project-tabs-v61.css",
    "project-tabs-v61.js",
    "projects-grid-v62.js",
]:
    path = Path(obsolete)
    if not path.exists():
        raise SystemExit(f"obsolete file missing before cleanup: {obsolete}")
    path.unlink()

print("V68 cleanup applied successfully")
