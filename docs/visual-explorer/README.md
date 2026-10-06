# BOB 1 Visual Explorer v0.3

An offline-capable visual starter for the PISO-AID / BOB 1 project, prepared for Jason Von Holmes on 6 October 2026.

## Run

**Run it:** [Open the hosted BOB 1 Visual Explorer](https://jvholmes87.github.io/piso-aid-bob1/visual-explorer/). It runs directly in your browser without downloading or installing anything.

For optional offline use, download `BOB1_Visual_Explorer_v0.3.html` and open it locally. It bundles the same styles and JavaScript as the editable source.

For source development, open `index.html` directly, or run `python3 -m http.server 8080` from this folder and visit `http://localhost:8080`.

No npm installation, CDN, build framework, tracking, or backend is required. The only external link is the project repository, opened when selected. The portable HTML embeds the official logo and drawing-reference image, so they also work offline.

## Brand and units

The HDES Brand Book defines Vivid Orange `#FF6600` and Dark Charcoal `#2E2E2E`. This version uses those colors with neutral backgrounds and tints. The prose specifies Facundo for headings and Scandia for body text. CSS selects those local families when installed, with Arial as an explicit fallback. Exact Facundo/Scandia font files were not found in the connected brand assets; the font folder contains NexaBold and NexaLight, while the guide’s samples also mention Nexa. These families were not silently substituted. The exact typography is pending the intended webfont assets.

The display defaults to Both, with Metric and Imperial (US) options. Length uses mm/in, mass uses kg/lb, and volume uses L/US gal. Metric designations such as M6 remain unchanged. Calculations and load sliders retain canonical metric values so switching units cannot alter the load case. Conversion factors: 1 in = 25.4 mm; 1 lb = 0.45359237 kg; 1 US gal = 3.785411784 L. Rounded dimensions do not redefine stock sizes.

## Included

- Full-assembly schematic viewer with rotation, assembled/exploded controls, hull/full switching, deck visibility, component highlighting and selection from the model or parts index.
- Four-drum freshwater displacement calculator with base configurations, added mass, growth allowance, ideal draft, and drum crown clearance in either or both unit systems.
- Evidence-aware build path without invented completion percentages.
- Source register and a repeatable Node test harness.

## Full assembly and logo

The official PNG-01 logo is included unchanged, preserving its original canvas, colours, aspect ratio, lettering and whitespace. The official SVG 1-01 is included as an additional vector asset. CSS does not recolour, crop, stretch, outline or shadow the logo.

The full configuration represents all major equipment from mechanical drawing 0001, plus accessories from selected subassembly drawings. A 30-row top-level BOM index preserves source quantities and maps every row to a selectable group. Small hardware is represented/grouped rather than individually reproduced. The control box is a housing, not a verified internal-electronics layout.

Shown: battery/box/pad, one motor/clamp/shaft/propeller, GPS/IMU post, four corner camera assemblies, three ultrasonic sensors and mount, control enclosure, rear post/arms, 360 camera, all-round lamp, two IR illuminators, LTE antenna/mount, two forward navigation lamps, two floodlights, four pad-eye plates, six conduit runs and representative hardware.

Equipment X/Y centres follow drawing 0001: the deck-centred display uses x=(X−750)/1000 and y=(Y−400)/1000 metres. Heights, envelopes, accessory offsets, conduit routes and fine attachment geometry remain schematic. Port/starboard lamps use neutral colours because source sidedness conflicts. The mechanical single-motor/12 V/100 Ah configuration is displayed as a source-specific design, not a final resolution of electrical or motor conflicts.

The original sheet-1 drawing is rendered directly from the project PDF as an expandable reference. Its annotations retain original metric units.

## GitHub hosting

GitHub Pages publishes `docs/` from `main`. The explorer is hosted at [https://jvholmes87.github.io/piso-aid-bob1/visual-explorer/](https://jvholmes87.github.io/piso-aid-bob1/visual-explorer/). The repository site root redirects to the explorer. Changes merged into `main` are deployed by GitHub's existing Pages build and deployment workflow.

## Source layout

- `index.html`: page structure and visible source notes.
- `assets/style.css`: responsive styles.
- `assets/app.js`: schematic projection, controls, and hydrostatic calculation.
- `BOB1_Visual_Explorer_v0.3.html`: portable bundled build.
- `SOURCE_REGISTER.md`: factual inputs, assumptions, and next validation tasks.
- `tests/check.cjs`: arithmetic and event/output checks, using a minimal DOM harness.
- `CHANGELOG.md`: changes and verification status.

## Test

Run `node tests/check.cjs`. It checks report draft cases, immersion boundaries, monotonicity, load updates, and viewer controls. It is not a real-browser layout test.

Browser review checklist: desktop/mobile layout; keyboard focus through controls; assembled/exploded rendering at rotation extremes; component descriptions; base selection; payload/growth updates; full/over-immersion display; and offline bundled operation.

## Basis

Hull inputs use the 12 September 2026 estimate. Full-assembly centres and the top-level BOM were read directly from drawing 0001; selected drawings 0007, 0012–0013, 0020, 0022, 0032 and 0033 were also read. Native CAD was not imported or revalidated. The geometry is schematic and not suitable as a fabrication drawing. Frame rail positions, drum spacing, restraints, and vertical stack-up remain illustrative. The projection shows the documented components, not an exact assembly export. Component presence in this design view does not imply physical installation.

The calculator assumes four equal horizontal circular cylinders, nominal 60 L each, 360 mm diameter, equal loading, level trim, and freshwater density 1,000 kg/m³. It solves circular-segment immersion numerically. Actual outer volume, shape, mass, structure, and stability require measured inputs. No safe payload rating is assigned. Crown clearance is not deck freeboard.

## Next iteration

1. Validate mechanical baseline and export actual CAD to a browser-friendly model.
2. Replace nominal drum assumptions with measured manufacturer geometry and sealed volume.
3. Add dated photos, measured masses, and test observations.
4. Replace schematic pad/strap/frame locations with verified coordinates.
5. Continue browser and device checks on the hosted explorer.

No source design drawings or existing project files were modified.
