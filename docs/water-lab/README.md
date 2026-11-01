# BOB 1 Water Lab — Phase 2

The [Water Lab](./) adds a procedural water/sky scene and orbitable BOB geometry to the Phase 1 vessel baseline. It is a visual prototype: vessel height uses the level-flotation calculation, while surface ripples and reflections do not apply physical wave forces.

See the [visual progress record](progress/README.md) for dated screenshots, source commits, checks, limitations and the record-keeping workflow. The [Phase 2 record](progress/2026-11-01/README.md) contains the first three captures.

## Recorded walkthrough

Jason's [YouTube walkthrough](https://youtu.be/t5QHTm9MyZM) introduces the project, Visual Explorer and Water Lab. The [X update](https://x.com/jasonvonholmes/status/2116818255210020981) shares the development progress. The [publication record](progress/2026-11-01/publication.md) records the public metadata checked and the known deck/frame alignment issue.

## Run and controls

GitHub Pages serves this folder at `/water-lab/`. For a local copy, serve `docs/` over HTTP and open `/water-lab/`; loading `index.html` directly with `file://` will not load the JSON baseline.

- Drag or use arrow keys to orbit. Scroll, pinch, +/− or the zoom buttons change distance. Home or the reset button restores the view.
- Switch between bare hull and the complete-craft concept. Both use the CAD mass in the shared JSON; no new mass estimates are invented.
- Choose daylight, golden hour or overcast; adjust visual surface detail; pause motion or enable camera orbit.
- WebGL 2 provides shader water, reflections and sky. If unavailable or initialization fails, the scene switches to a Canvas renderer with procedural water texture and projected vessel geometry.
- Graphics Auto reduces pixel density on small viewports; Reduced and High allow explicit selection. Canvas animation is capped at 30 redraws per second. Animation pauses on hidden tabs, and reduced-motion preference pauses it initially.
- Ambience is synthesized noise filtered through a spatial audio source, starts only after a click, and suspends when motion is paused or the tab is hidden. No microphone, imported audio, pre-made model, texture, CDN or package runtime is used. The official HDES logo is reused unchanged.

The Phase 2 complete-craft display is a simplified equipment concept, not the explorer's full 30-row BOM representation. Geometry remains schematic. The source-backed readouts do not imply a physical build or a safe load rating.

## Included

- [Vessel baseline](model/bob1-baseline.json): SI values, evidence classes, source records, coordinate conventions, unknowns and phase-linked gaps.
- [Hydrostatics module](model/hydrostatics.js): level flotation of ideal horizontal cylinders, total-mass scenarios and strict input checks. Runs in Node or a browser without dependencies.
- [Phase plan](PHASES.md): deliverables and the decisions needed as each phase begins.
- [Model checks](tests/model.cjs): independent boundary/scaling tests and comparison with the existing explorer.
- [Scene checks](tests/scene.cjs): camera transforms, finite geometry/normals and resource resolution.

Run from the repository root:

```sh
node docs/water-lab/tests/model.cjs
node docs/water-lab/tests/scene.cjs
node docs/visual-explorer/tests/check.cjs
```

Node example:

```js
const baseline = require('./docs/water-lab/model/bob1-baseline.json');
const hydro = require('./docs/water-lab/model/hydrostatics.js');
const model = hydro.resolveModel(baseline);
const mass = hydro.scenarioMass(baseline, 'bareHull', 0, 0);
console.log(hydro.levelFlotation(model, mass));
```

For a browser, load `model/hydrostatics.js` as a script; it exposes `BobHydrostatics`. Fetch the JSON over HTTP(S), then call the same functions. The JSON is not silently embedded in a second source file.

## Evidence and mass accounting

`documented` means a value is recorded in a source; `modeled` means calculated/CAD; `assumed` is an explicit scenario input; `measured` requires a future measurement record; `unknown` is represented by `null`. No physical measurements are claimed in v0.1. When adding measured values, link a dated record with method, configuration, units and uncertainty.

The two mass configurations are alternatives: bare hull **49.28 kg** and complete craft **80.40 kg**, both CAD values. Complete craft already includes equipment. Do not add component masses on top of it. For later movable ballast, begin with one declared mass configuration and add only new masses at explicit positions; its center of gravity must be established separately.

The default model deliberately preserves the explorer's four nominal 60 L cylinders and assumed 360 mm diameter. Cylinder length is derived from nominal volume. The original level-draft reference cases remain reproducible. A measured exterior volume does **not** automatically change this ideal-cylinder scenario: actual tapered drum geometry needs a reviewed model revision.

The source explorer uses 480 mm display row spacing, while the estimate examines 400/440 mm sensitivity cases. They must not be mixed in a stability calculation. These are separate assumptions, not competing measurements.

## Limits and next action

Phase 1 is complete as a **software foundation**, not an approved physical build baseline. It does not solve heel/trim, dynamic roll/pitch, righting arms, structural loads, drag, propulsion, energy use or autopilot behavior. `drumCrownClearance` is clearance to the ideal drum crown, not deck freeboard; `fullImmersionMass` is not payload capacity. Unknown CG, inertia and payload remain null.

Next: Phase 3 adds positioned ballast and approximate hydrostatic equilibrium, with visible assumptions and comparison against future physical observations. The [Visual Explorer](../visual-explorer/) remains available for component inspection and its original load calculator.

## Verification record — 1 November 2026

Node checks pass for the model, scene geometry/camera math and existing explorer. Browser QA exercised the Canvas fallback, configuration and unit changes, atmosphere and pause controls. The cloud browser does not expose WebGL 2, so GPU shader compilation/rendering is **not verified here**. Responsive CSS and touch handlers are included; physical Android performance and pinch behavior remain to be checked. Phase 2 should not be described as validated on all devices.
