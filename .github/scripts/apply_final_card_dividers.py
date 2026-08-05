from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


index_path = Path("index.html")
styles_path = Path("styles.css")
index = index_path.read_text(encoding="utf-8")
styles = styles_path.read_text(encoding="utf-8")

# Move the Workshop shimmer below the card and add a static divider above it.
index = replace_once(
    index,
    '      <div class="workshop-entry" data-workshop-card>\n        <span class="workshop-entry-shimmer" aria-hidden="true"></span>\n',
    '      <div class="workshop-entry-separator" aria-hidden="true"><span class="workshop-entry-separator-line"></span></div>\n\n      <div class="workshop-entry" data-workshop-card>\n',
    "Workshop opening markup",
)
index = replace_once(
    index,
    '        </button>\n      </div>\n    </section>\n\n    <section class="projects section"',
    '        </button>\n      </div>\n      <div class="workshop-entry-shimmer" aria-hidden="true"></div>\n    </section>\n\n    <section class="projects section"',
    "Workshop closing markup",
)

# Add a divider between the featured project and the project stack.
index = replace_once(
    index,
    '          </article>\n\n          <div class="project-stack">',
    '          </article>\n\n          <div class="project-divider project-divider-main project-divider-indigo" aria-hidden="true"><span class="project-divider-line"></span></div>\n\n          <div class="project-stack">',
    "Main project divider",
)

# Add the three dividers inside the four-card project stack.
index = replace_once(
    index,
    '            </article>\n\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">03</span>',
    '            </article>\n\n            <div class="project-divider project-divider-vertical project-divider-top project-divider-teal" aria-hidden="true"><span class="project-divider-line"></span></div>\n\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">03</span>',
    "Top project-stack divider",
)
index = replace_once(
    index,
    '            </article>\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">04</span>',
    '            </article>\n\n            <div class="project-divider project-divider-horizontal project-divider-middle project-divider-indigo" aria-hidden="true"><span class="project-divider-line"></span></div>\n\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">04</span>',
    "Middle project-stack divider",
)
index = replace_once(
    index,
    '            </article>\n\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">05</span>',
    '            </article>\n\n            <div class="project-divider project-divider-vertical project-divider-bottom project-divider-teal" aria-hidden="true"><span class="project-divider-line"></span></div>\n\n            <article class="project-card">\n              <div class="project-meta">\n                <span class="project-number">05</span>',
    "Bottom project-stack divider",
)

# Restore the Workshop card's original internal spacing.
styles = replace_once(styles, '  margin-top: 20px;\n  min-height: 170px;\n  padding: 42px 28px 26px;', '  margin-top: 0;\n  min-height: 170px;\n  padding: 26px 28px;', "Desktop Workshop spacing")

# Rebuild the desktop Projects grid with real divider tracks.
old_projects_grid = '''.project-grid {
  margin-top: 48px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  gap: 16px;
}

.project-stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
'''
new_projects_grid = '''.project-grid {
  margin-top: 48px;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) 38px minmax(0, 0.92fr);
  align-items: stretch;
  gap: 0;
}

.project-featured {
  grid-column: 1;
  grid-row: 1;
}

.project-divider-main {
  grid-column: 2;
  grid-row: 1;
}

.project-stack {
  grid-column: 3;
  grid-row: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 38px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 38px minmax(0, 1fr);
  gap: 0;
}

.project-stack > .project-card:nth-of-type(1) { grid-column: 1; grid-row: 1; }
.project-stack > .project-card:nth-of-type(2) { grid-column: 3; grid-row: 1; }
.project-stack > .project-card:nth-of-type(3) { grid-column: 1; grid-row: 3; }
.project-stack > .project-card:nth-of-type(4) { grid-column: 3; grid-row: 3; }

.project-divider {
  --divider-glow-rgb: 116, 113, 174;
  min-width: 0;
  min-height: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.project-divider-main,
.project-divider-vertical {
  background: radial-gradient(
    ellipse 78% 62% at center,
    rgba(var(--divider-glow-rgb), 0.12),
    rgba(var(--divider-glow-rgb), 0.035) 42%,
    transparent 76%
  );
}

.project-divider-main .project-divider-line,
.project-divider-vertical .project-divider-line {
  width: 1px;
  height: 58%;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(160, 180, 188, 0.13) 18%,
    rgba(178, 196, 203, 0.34) 50%,
    rgba(160, 180, 188, 0.13) 82%,
    transparent
  );
}

.project-divider-horizontal {
  background: radial-gradient(
    ellipse 48% 78% at center,
    rgba(var(--divider-glow-rgb), 0.13),
    rgba(var(--divider-glow-rgb), 0.035) 44%,
    transparent 76%
  );
}

.project-divider-horizontal .project-divider-line {
  width: min(66%, 420px);
  height: 1px;
  background: var(--homepage-divider-line);
}

.project-divider-line {
  display: block;
  box-shadow: 0 0 12px rgba(145, 169, 178, 0.06);
}

.project-divider-teal { --divider-glow-rgb: 98, 145, 156; }
.project-divider-indigo { --divider-glow-rgb: 116, 113, 174; }

.project-divider-top { grid-column: 2; grid-row: 1; }
.project-divider-middle { grid-column: 1 / -1; grid-row: 2; }
.project-divider-bottom { grid-column: 2; grid-row: 3; }
'''
styles = replace_once(styles, old_projects_grid, new_projects_grid, "Desktop Projects grid")

# Keep card accent ordering stable after divider elements are inserted.
styles = replace_once(
    styles,
    '''.project-stack .project-card:nth-child(1) { --accent-rgb: var(--palette-steel); }
.project-stack .project-card:nth-child(2) { --accent-rgb: var(--palette-indigo); }
.project-stack .project-card:nth-child(3) { --accent-rgb: var(--palette-bronze); }
.project-stack .project-card:nth-child(4) { --accent-rgb: var(--palette-teal); }''',
    '''.project-stack > .project-card:nth-of-type(1) { --accent-rgb: var(--palette-steel); }
.project-stack > .project-card:nth-of-type(2) { --accent-rgb: var(--palette-indigo); }
.project-stack > .project-card:nth-of-type(3) { --accent-rgb: var(--palette-bronze); }
.project-stack > .project-card:nth-of-type(4) { --accent-rgb: var(--palette-teal); }''',
    "Project accent selectors",
)

# Convert the main Projects divider to horizontal when the layout stacks.
styles = replace_once(
    styles,
    '  .project-grid { grid-template-columns: 1fr; }\n  .project-featured { min-height: 430px; }',
    '''  .project-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 44px auto;
  }
  .project-featured {
    grid-column: 1;
    grid-row: 1;
    min-height: 430px;
  }
  .project-divider-main {
    grid-column: 1;
    grid-row: 2;
    min-height: 44px;
    background: radial-gradient(
      ellipse 48% 78% at center,
      rgba(var(--divider-glow-rgb), 0.13),
      rgba(var(--divider-glow-rgb), 0.035) 44%,
      transparent 76%
    );
  }
  .project-divider-main .project-divider-line {
    width: min(66%, 420px);
    height: 1px;
    background: var(--homepage-divider-line);
  }
  .project-stack {
    grid-column: 1;
    grid-row: 3;
  }''',
    "Tablet Projects layout",
)

# Restore mobile Workshop padding and make every Projects divider horizontal.
styles = replace_once(styles, '    padding: 38px 18px 22px;', '    padding: 22px 18px;', "Mobile Workshop spacing")
styles = replace_once(
    styles,
    '''  .project-grid { margin-top: 34px; }
  .project-stack { grid-template-columns: 1fr; }
  .project-featured { min-height: 390px; padding: 22px; }
  .project-card { min-height: 230px; padding: 19px; }''',
    '''  .project-grid {
    margin-top: 34px;
    grid-template-columns: 1fr;
    grid-template-rows: auto 44px auto;
  }
  .project-divider-main { min-height: 44px; }
  .project-stack {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 0;
  }
  .project-stack > .project-card:nth-of-type(n),
  .project-stack > .project-divider {
    grid-column: 1;
    grid-row: auto;
  }
  .project-stack > .project-divider {
    width: 100%;
    min-height: 44px;
    background: radial-gradient(
      ellipse 48% 78% at center,
      rgba(var(--divider-glow-rgb), 0.13),
      rgba(var(--divider-glow-rgb), 0.035) 44%,
      transparent 76%
    );
  }
  .project-stack > .project-divider .project-divider-line {
    width: min(72%, 320px);
    height: 1px;
    background: var(--homepage-divider-line);
  }
  .project-featured { min-height: 390px; padding: 22px; }
  .project-card { min-height: 230px; padding: 19px; }''',
    "Mobile Projects layout",
)

# Replace the internal Workshop shimmer with a static lead-in divider and an external closing shimmer.
old_workshop_shimmer = '''/* Animated shimmer contained inside the homepage Workshop card. */
.workshop-entry-shimmer {
  position: absolute;
  z-index: 2;
  top: 20px;
  left: 50%;
  width: min(70%, 620px);
  height: 1px;
  transform: translateX(-50%);
  overflow: hidden;
  border-radius: 999px;
  pointer-events: none;
  background-image:
    linear-gradient(90deg, transparent 0%, rgba(232, 242, 245, 0.82) 50%, transparent 100%),
    linear-gradient(90deg, transparent, rgba(151, 174, 184, 0.22) 16%, rgba(175, 195, 202, 0.34) 50%, rgba(151, 174, 184, 0.22) 84%, transparent);
  background-repeat: no-repeat;
  background-size: 54% 100%, 100% 100%;
  background-position: -120% 0, 0 0;
  animation: homepage-workshop-line-sweep 3s ease-in-out infinite;
}
'''
new_workshop_shimmer = '''/* Static lead-in divider above and animated closing shimmer below the Workshop card. */
.workshop-entry-separator {
  min-height: 44px;
  margin-top: 40px;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: radial-gradient(
    ellipse 48% 78% at center,
    rgba(var(--homepage-divider-glow-rgb), 0.13),
    rgba(var(--homepage-divider-glow-rgb), 0.035) 44%,
    transparent 76%
  );
}

.workshop-entry-separator-line {
  width: min(66%, 420px);
  height: 1px;
  display: block;
  background: var(--homepage-divider-line);
  box-shadow: 0 0 12px rgba(145, 169, 178, 0.06);
}

.workshop-entry-shimmer {
  position: relative;
  width: min(70%, 620px);
  height: 1px;
  margin: 24px auto 0;
  overflow: hidden;
  border-radius: 999px;
  pointer-events: none;
  background-image:
    linear-gradient(90deg, transparent 0%, rgba(232, 242, 245, 0.82) 50%, transparent 100%),
    linear-gradient(90deg, transparent, rgba(151, 174, 184, 0.22) 16%, rgba(175, 195, 202, 0.34) 50%, rgba(151, 174, 184, 0.22) 84%, transparent);
  background-repeat: no-repeat;
  background-size: 54% 100%, 100% 100%;
  background-position: -120% 0, 0 0;
  animation: homepage-workshop-line-sweep 3s ease-in-out infinite;
}
'''
styles = replace_once(styles, old_workshop_shimmer, new_workshop_shimmer, "Workshop divider treatment")

styles = replace_once(
    styles,
    '''  .workshop-entry-shimmer {
    top: 18px;
    width: min(72%, 320px);
  }''',
    '''  .workshop-entry-separator {
    min-height: 44px;
    margin-top: 34px;
  }

  .workshop-entry-separator-line,
  .workshop-entry-shimmer {
    width: min(72%, 320px);
  }

  .workshop-entry-shimmer {
    margin-top: 22px;
  }''',
    "Mobile Workshop divider treatment",
)

# Final structural guards.
if index.count('class="workshop-entry-separator"') != 1:
    raise SystemExit("Workshop separator validation failed")
if index.count('class="workshop-entry-shimmer"') != 1:
    raise SystemExit("Workshop shimmer validation failed")
if index.count('class="project-divider ') != 4:
    raise SystemExit("Project divider validation failed")
if styles.count(".project-divider-main") < 2:
    raise SystemExit("Project CSS validation failed")
if styles.count(".workshop-entry-separator") < 2:
    raise SystemExit("Workshop CSS validation failed")
if styles.count("{") != styles.count("}"):
    raise SystemExit("CSS brace balance validation failed")

index_path.write_text(index, encoding="utf-8")
styles_path.write_text(styles, encoding="utf-8")
print("Final Workshop and Projects divider layout applied successfully.")
