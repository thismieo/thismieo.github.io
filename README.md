# Mohammed Muayad Portfolio — Blue Continuum 4.4.1

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Current production architecture

- `styles.css` — shared portfolio foundation, reusable primitives and responsive homepage layout.
- `contact-linkedin.css` — contact-card icon refinement.
- `workshop-integrated.css` — canonical Workshop component layer: Workshop shell, masthead, Python practice, explorer, knowledge cards and responsive behavior.
- `visual-system.css` — canonical cross-page visual system for divider geometry/colors and shared ambient-depth normalization across the homepage and Workshop mobile layout.
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
- Consolidates Workshop component styling in `workshop-integrated.css` and keeps click feedback isolated in the interaction layer.
- Introduces `visual-system.css` as the single shared source for homepage/Workshop divider language and ambient-depth normalization.
- Gives mobile dividers one width system (`min(64vw, 240px)`) and balanced 22px breathing room around major Workshop separators.
- Applies the Workshop steel/bronze/indigo divider palette consistently to homepage About, Journey, Workshop-entry and Project separators.
- Reduces diffuse homepage background, Hero and card haze while retaining local accent depth.
- Rebuilds the `Updated · Aug 2026` line animation inside one clipped line so its sweep finishes cleanly at both edges.
- Corrects the 32px favicon MIME declaration and uses content-specific cache keys for changed production assets.

The site is deployed through GitHub Pages from the `main` branch.