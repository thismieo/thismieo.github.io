from pathlib import Path

BASE = "0680ffb25e9553d38013c23c5a885e5686d24070"


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    return text.replace(old, new, 1)

# --- visual-system.css: restore the visible Project roadmap separator line itself,
# not only its 44px mobile container; remove superseded Foundation card pseudo divider.
p = Path("visual-system.css")
text = p.read_text(encoding="utf-8")
text = replace_once(text, "/* Blue Continuum — Shared Visual System 1.3.0", "/* Blue Continuum — Shared Visual System 1.3.1", "visual header")
needle = '''.portfolio-panel .about::after,
.portfolio-panel .workshop-entry-separator-line,
.portfolio-panel .project-mobile-separator > span {
  background: var(--continuum-divider-line) !important;
  box-shadow: var(--continuum-divider-shadow) !important;
}
'''
replacement = needle + '''
.portfolio-panel .project-mobile-separator > span {
  height: 1px !important;
  display: block !important;
  border-radius: 999px;
  pointer-events: none;
}
'''
text = replace_once(text, needle, replacement, "project visible separator geometry")
legacy_foundation_pseudo = '''  .workshop-grid-foundation > .knowledge-card:not(:last-child)::after {
    left: 50% !important;
    bottom: -9px !important;
    width: var(--continuum-divider-width-mobile) !important;
    transform: translateX(-50%) !important;
    background: var(--continuum-divider-line) !important;
    box-shadow: var(--continuum-divider-shadow) !important;
  }

'''
text = replace_once(text, legacy_foundation_pseudo, "", "superseded Foundation pseudo divider")
p.write_text(text.rstrip() + "\n", encoding="utf-8")

# --- workshop-integrated.css: Foundation semantic icon selectors must count ARTICLE cards,
# not interleaved separator SPANs. nth-child caused missing masks -> solid colored squares.
p = Path("workshop-integrated.css")
text = p.read_text(encoding="utf-8")
text = replace_once(text, "/* Workshop 6.0.4", "/* Workshop 6.0.5", "workshop header")
old_prefix = ".workshop-grid-foundation > .knowledge-card:nth-child("
count = text.count(old_prefix)
if count < 16:
    raise SystemExit(f"Foundation nth-child regression: expected >=16 semantic selectors, found {count}")
text = text.replace(old_prefix, ".workshop-grid-foundation > .knowledge-card:nth-of-type(")
p.write_text(text.rstrip() + "\n", encoding="utf-8")

# --- interactions.js: card-like controls use the same 520ms card sheen path.
p = Path("interactions.js")
text = p.read_text(encoding="utf-8")
text = replace_once(
    text,
    'const cardSelector = [".facts > div", ".timeline-item", ".project-card", ".workshop-entry", ".current-track-card", ".practice-milestone", ".knowledge-card", ".workshop-card", ".contact-card"].join(", ");',
    'const cardSelector = [".facts > div", ".timeline-item", ".project-card", ".workshop-entry", ".current-track-card", ".practice-milestone", ".practice-selector-card", ".knowledge-card", ".workshop-card", ".contact-card"].join(", ");',
    "card selector"
)
text = replace_once(
    text,
    'const directControlSelector = [".hero-cta", ".workshop-entry-action", ".workshop-back", ".workshop-closing .button", ".contact-card-action", ".section-stepper", ".practice-selector-card", ".practice-collection-close", ".practice-copy-button"].join(", ");',
    'const directControlSelector = [".hero-cta", ".workshop-entry-action", ".workshop-back", ".workshop-closing .button", ".contact-card-action", ".section-stepper", ".practice-collection-close", ".practice-copy-button"].join(", ");',
    "direct control selector"
)
old = '''    const contactAction = target.closest(".contact-card-action");
    if (contactAction) return contactAction.closest(".contact-card");
    const directControl = target.closest(directControlSelector);
'''
new = '''    const contactAction = target.closest(".contact-card-action");
    if (contactAction) return contactAction.closest(".contact-card");
    const workshopEntryAction = target.closest(".workshop-entry-action");
    if (workshopEntryAction) return workshopEntryAction.closest(".workshop-entry");
    const directControl = target.closest(directControlSelector);
'''
text = replace_once(text, old, new, "Workshop gateway card routing")
p.write_text(text.rstrip() + "\n", encoding="utf-8")

# --- cache/version metadata.
p = Path("index.html")
text = p.read_text(encoding="utf-8")
for old, new, label in [
    ('workshop-integrated.css?v=6.0.4', 'workshop-integrated.css?v=6.0.5', 'workshop cache'),
    ('visual-system.css?v=1.3.0', 'visual-system.css?v=1.3.1', 'visual cache'),
    ('interactions.js?v=1.3.1', 'interactions.js?v=1.3.2', 'interaction JS cache'),
    ('Version 4.5.17', 'Version 4.5.18', 'footer version'),
]:
    text = replace_once(text, old, new, label)
p.write_text(text.rstrip() + "\n", encoding="utf-8")

p = Path("404.html")
text = p.read_text(encoding="utf-8")
text = replace_once(text, "Version 4.5.17", "Version 4.5.18", "404 version")
p.write_text(text.rstrip() + "\n", encoding="utf-8")

p = Path("CHANGELOG.md")
text = p.read_text(encoding="utf-8")
entry = '''# Blue Continuum 4.5.18 — Regression Repair & Visual Integrity Audit

1. Restored the actual 1px Project roadmap separator stroke on phone; the 44px separator container was present in 4.5.17 but its inner span had lost visible geometry.
2. Repaired Foundation semantic icon ownership by changing interleaved-card selectors from nth-child() to nth-of-type(), preventing missing masks from rendering as solid squares.
3. Removed the superseded Foundation card pseudo-divider rule so independent separator elements remain the only card-to-card divider owner.
4. Routed The Workshop CTA and Practice selector cards through the canonical card sheen path, keeping card-like interactions on the same 520ms timing language.
5. Added deep browser regression checks for visible divider strokes, Foundation icon masks, card sheen timing/targets, overflow and responsive integrity.

---

'''
if text.startswith("# Blue Continuum 4.5.18"):
    raise SystemExit("CHANGELOG already contains 4.5.18")
p.write_text(entry + text.rstrip() + "\n", encoding="utf-8")

print("Applied 4.5.18 regression repair")
