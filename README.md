# Mohammed Muayad Portfolio — Blue Continuum 5.0.0

Production portfolio for Mohammed Muayad, including the main portfolio experience and The Workshop learning archive.

## Production architecture

- `index.html` — canonical document structure for the portfolio and integrated Workshop view.
- `styles.css` — consolidated homepage foundation, Hero, Journey, Projects and responsive layout.
- `contact-linkedin.css` — contact-card icon masks and LinkedIn placement refinements.
- `visual-system.css` — shared homepage visual system, About cards, editorial copy, divider rhythm and signature CTA sheen.
- `workshop-integrated.css` — consolidated Workshop structure, Python practice, knowledge cards and responsive behavior.
- `script.js` — portfolio navigation, section scrolling, Workshop transitions, history and copy behavior.
- `workshop-integrated.js` — Python practice data, selectors, code rendering and collection state.
- `assets/` — portrait, Manrope variable font and favicon/PWA icon set.

There is no separate interaction runtime in production. Click/press behavior is owned by the active component styles and the two canonical JavaScript files above.

## Release 5.0.0

- Freezes the approved homepage and Workshop design after the August 2026 refinement pass.
- Unifies all production CSS/JS cache keys and visible version labels under `5.0.0`.
- Keeps About cards in the approved soft contact-derived layout with bare icons and plain label/value hierarchy.
- Keeps the refined Journey footer tags, Workshop spacing, Hero tagline color identity and responsive editorial copy.
- Reduces the mobile `Artificial Intelligence Engineering Student` Hero role to a calmer responsive size without changing desktop typography.
- Synchronizes the 404 page with the current production stylesheet cache and release label.
- Removes stale documentation references to deleted interaction assets.
- Uses a conservative cleanup policy: only confirmed temporary/stale artifacts are removed; working responsive and interaction ownership is preserved.

## Deployment

The site is deployed through GitHub Pages from the `main` branch.

Stable release snapshot: `release/5.0.0-stable`.
Pre-release safety snapshot: `backup/pre-release-5.0.0`.
