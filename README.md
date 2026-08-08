# Mohammed Muayad Portfolio — Blue Continuum 4.4.1

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Current production architecture

- `styles.css` — shared portfolio foundation and responsive layout.
- `contact-linkedin.css` — contact-card icon refinement.
- `workshop-integrated.css` — primary Workshop component stylesheet for masthead, Python practice, explorer, knowledge cards and responsive behavior.
- `script.js` — portfolio navigation, Workshop transitions, history and copy behavior.
- `workshop-integrated.js` — Python practice data, selectors, code rendering and collection state without page-scroll or background-height forcing.
- `interactions.css` / `interactions.js` — click-confirmed interaction engine plus the final dynamic-view stability overrides required after interaction and Workshop state changes.

## Release 4.4.1

- Keeps Journey and other cards geometrically stable when clicked; feedback no longer scales or translates the card itself.
- Preserves structural `first-child` / `last-child` selectors by inserting the DOM sheen layer without becoming the semantic edge child of multi-element cards.
- Gives Workshop and portfolio navigation explicit ownership of scroll restoration to avoid browser history races.
- Reorders the Workshop DOM to match its visual reading order: masthead, Python Development, Foundation, Applied Practice and closing action.
- Makes the Workshop a real `main` landmark while it is open and removes the hidden-portfolio skip-link mismatch.
- Removes the obsolete Workshop background-height freezing runtime and lets the background follow dynamic content naturally.
- Refines Workshop divider rhythm with consistent breathing room before and after major section separators.
- Rebuilds the `Updated · Aug 2026` line animation inside one clipped line so its sweep finishes cleanly at both edges.
- Reduces diffuse Workshop glow and fog while retaining local card accents and depth.
- Corrects the 32px favicon MIME declaration and aligns production cache keys and visible release metadata.

The site is deployed through GitHub Pages from the `main` branch.
