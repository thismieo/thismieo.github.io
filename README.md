# Mohammed Muayad Portfolio — Blue Continuum 4.4.0

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Current production architecture

- `styles.css` — shared portfolio foundation and responsive layout.
- `contact-linkedin.css` — contact-card icon refinement.
- `workshop-integrated.css` — the single Workshop stylesheet; masthead, Python practice, explorer, knowledge cards and responsive behavior are consolidated here.
- `script.js` — portfolio navigation, Workshop transitions, history and copy behavior.
- `workshop-integrated.js` — Python practice data, selectors, code rendering and collection state.
- `interactions.css` / `interactions.js` — one click-confirmed interaction engine for mouse, touch, pen and keyboard.

## Release 4.4.0

- Consolidates the previous Workshop CSS layers into one production file.
- Removes the legacy Workshop base and masthead stylesheets.
- Removes the old pointer-based press engine and duplicate Workshop press pulse.
- Keeps one DOM-backed sheen layer, avoiding pseudo-element conflicts with structural separators.
- Preserves natural vertical page scrolling; Featured Practice and Learning Archive never auto-scroll the page.
- Normalizes production cache versions and the visible release number.
- Validates responsive Workshop behavior in Chromium at 350, 390, 700, 900, 1024 and 1440 px viewports.
- Keeps reduced-motion behavior and keyboard-accessible controls.

The site is deployed through GitHub Pages from the `main` branch.
