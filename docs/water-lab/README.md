# BOB 1 Water Lab — Phase 1

Phase 1 establishes a reusable, provisional vessel configuration and a tested hydrostatics module for the planned browser water lab. The interactive ocean environment begins in Phase 2; no water-lab UI is published by this baseline.

## Included

- [Vessel baseline](model/bob1-baseline.json): SI values, evidence classes, source records, coordinate conventions, unknowns and phase-linked gaps.
- [Hydrostatics module](model/hydrostatics.js): level flotation of ideal horizontal cylinders, total-mass scenarios and strict input checks. Runs in Node or a browser without dependencies.
- [Phase plan](PHASES.md): deliverables and the decisions needed as each phase begins.
- [Model checks](tests/model.cjs): independent boundary/scaling tests and comparison with the existing explorer.

Run from the repository root:

```sh
node docs/water-lab/tests/model.cjs
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

Next: Phase 2 adds a procedural water scene using this baseline's coordinate system and dimensions. Phase 3 adds positioned ballast and approximate hydrostatic equilibrium, with visible assumptions and comparison against future physical observations. The existing [Visual Explorer](../visual-explorer/) remains the current public interactive tool.
