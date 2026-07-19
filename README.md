# Mohammed Muayad — Personal Portfolio

Production repository for the responsive portfolio of **Mohammed Muayad**, an AI Engineering Student from Baghdad, Iraq.

## Live Website

**https://thismieo.github.io**

## Current Scope

The portfolio presents Mohammed's identity, learning journey, technology direction, projects, goals, and contact channels through one responsive interface for desktop and mobile devices.

The current production release includes:

- Semantic single-page HTML structure
- Layered responsive CSS for desktop, tablet, and mobile layouts
- Modular JavaScript for navigation, project visuals, contact interactions, and the planetary Hero system
- Keyboard-accessible navigation and reduced-motion support
- GitHub Pages deployment from the `main` branch
- Automated structural, asset, CSS, JavaScript, and repository-cleanliness validation

## Repository Structure

```text
thismieo.github.io/
├── .github/workflows/validate-site.yml
├── scripts/validate_site.py
├── index.html
├── *.css
├── *.js
├── .gitignore
└── README.md
```

The HTML entry point explicitly loads production stylesheets and scripts. The only intentionally dynamic local stylesheet is `micro-polish.css`, loaded by `hero-interface-v68.js`.

## Validation

Pull requests and updates to `main` are checked for:

- Missing local assets or navigation targets
- Duplicate HTML identifiers and runtime references
- Unbalanced CSS and merge-conflict markers
- JavaScript syntax errors
- Unreferenced root CSS or JavaScript files
- Unexpected files or directories
- Required responsive and planetary-system regression tokens
- Whitespace errors

The local structural validator can be run with:

```bash
python3 scripts/validate_site.py
```

## Maintenance Rules

- `main` contains the production website.
- `backup/stable-2026-07-19` preserves the accepted stable release before repository cleanup.
- New work should be completed on a dedicated branch and validated through a pull request.
- Obsolete runtime files must be removed only after confirming they are not referenced directly or dynamically.

---

**Learning Python · Building AI Skills · One verified commit at a time.**
