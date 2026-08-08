# Mohammed Muayad Portfolio — Blue Continuum 4.4.1

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Current production architecture

- `styles.css` — shared portfolio foundation, reusable primitives and responsive homepage layout.
- `contact-linkedin.css` — contact-card icon refinement.
- `workshop-integrated.css` — canonical Workshop visual layer: Workshop shell, masthead, Python practice, explorer, knowledge cards, dividers, responsive behavior and reduced-motion rules.
- `script.js` — portfolio navigation, Workshop transitions, history and copy behavior.
- `workshop-integrated.js` — Python practice data, selectors, code rendering and collection state without page-scroll or background-height forcing.
- `interactions.css` / `interactions.js` — one click-confirmed interaction engine for mouse, touch, pen and keyboard; it contains no Workshop layout or visual overrides.

## Release 4.4.1

- Keeps Journey and other cards geometrically stable when clicked; feedback no longer scales or translates the card itself.
- Preserves structural `first-child` / `last-child` selectors by inserting the DOM sheen layer without becoming the semantic edge child of multi-element cards.
- Gives Workshop and portfolio navigation explicit ownership of scroll restoration to avoid browser history races.
- Reorders the Workshop DOM to match its visual reading order: masthead, Python Development, Foundation, Applied Practice and closing action.
- Makes the Workshop a real `main` landmark while it is open and removes the hidden-portfolio skip-link mismatch.
- Removes the obsolete Workshop background-height freezing runtime and lets the background follow dynamic content naturally.
- Consolidates the final Workshop visual runtime into `workshop-integrated.css` 6.0.2 instead of carrying Workshop overrides in the interaction layer.
- Refines Workshop divider rhythm with consistent breathing room before and after major section separators.
- Rebuilds the `Updated · Aug 2026` line animation inside one clipped line so its sweep finishes cleanly at both edges.
- Reduces diffuse Workshop glow and fog while retaining local card accents and depth.
- Corrects the 32px favicon MIME declaration and uses content-specific cache keys for changed production assets.

The site is deployed through GitHub Pages from the `main` branch.
