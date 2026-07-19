# Portfolio V2

This branch rebuilds the portfolio from a clean architecture while the published `main` branch remains unchanged.

## Production files

- `index.html`
- `assets/css/main.css`
- `assets/css/components.css`
- `assets/css/responsive.css`
- `assets/js/app.js`
- `assets/js/projects.js`

## Design principles

- One visual system driven by CSS custom properties.
- Desktop and mobile layouts designed together.
- No version-numbered production filenames.
- No JavaScript-driven stylesheet loading.
- No dependency on legacy override chains.
- Motion respects `prefers-reduced-motion`.
- Project telemetry keeps the same left/right information order on desktop and phone.

## Safety

The live site remains on `main`. The previous implementation is preserved in `archive/legacy-v105` and will not be removed until V2 is reviewed and explicitly approved.
