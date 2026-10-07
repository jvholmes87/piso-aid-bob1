# Changelog

## v0.3.1 — 7 October 2026

- Added a preliminary stability screen below the load note, tiered from the hull estimate's GM table (KG = 450 mm, 400–440 mm drum-row spacing). It is a sensitivity band, not a rating.
- Linked the static draft/stability chart from the calculation-basis notes.
- Reworded build-path step 02 to "Planned Phase 1"; no prototype has been built.
- Added stability-tier checks to the Node test harness.

## v0.3 — 6 October 2026

- Added the official HDES logo unchanged and bundled it for offline viewing.
- Added full/hull switching and the major equipment and accessory groups from the mechanical drawing package.
- Added a 30-row top-level BOM index with source quantities, selectable groups and configuration notes.
- Added a direct render of the original assembly drawing for comparison.
- Added drawing-derived XY centres; retained schematic shapes, heights, accessory positions and conduit routes.
- Added model-click selection, automatic projection fitting, complete group coverage and full/hull tests.
- Visually reviewed a rendered SVG of the full assembly. Real-browser layout review remains outstanding.

## v0.2 — 6 October 2026

- Replaced the teal palette with HDES Vivid Orange #FF6600, Dark Charcoal #2E2E2E, and neutral surfaces.
- Set Facundo heading and Scandia body font families, using local installed fonts when available. Exact font files were not found; Arial is the explicit fallback. The discrepancy with supplied Nexa files is documented.
- Added Metric, Imperial (US), and Both measurement displays, defaulting to Both.
- Converted component dimensions, masses, volume, calculator outputs, base selectors, and diagram labels; retained M6 as a metric designation.
- Preserved metric calculation precision and load cases during unit switching.
- Added conversion and repeated unit-switching checks. Real-browser visual review remains outstanding.

## v0.1 — 6 October 2026

- Added dependency-free schematic hull viewer and component inspector.
- Added numerical ideal-cylinder flotation calculator and load scenarios.
- Added planned build path and source/assumption register.
- Added standalone offline HTML and GitHub Pages handoff instructions.
- Node checks passed for reference drafts, immersion boundaries, monotonicity, event wiring, and generated SVG output.
- Real-browser screenshot and responsive-layout review could not be completed in this environment: Chromium was unavailable and the browser download failed. Manual browser checklist is in README.md.
- Saved as a project-folder starter. No GitHub deployment or commit made.
