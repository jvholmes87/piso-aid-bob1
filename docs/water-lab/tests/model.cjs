'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const baseline = require('../model/bob1-baseline.json');
const hydro = require('../model/hydrostatics.js');
const legacy = require('../../visual-explorer/assets/app.js');
const model = hydro.resolveModel(baseline);
const near = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`);

// Independent limiting cases: dry, half-submerged and fully submerged cylinders.
near(hydro.segmentArea(.18, 0), 0);
near(hydro.segmentArea(.18, .18), Math.PI * .18 ** 2 / 2);
near(hydro.segmentArea(.18, .36), Math.PI * .18 ** 2);
near(hydro.supportedMass(model, .36), 240);
near(hydro.levelFlotation(model, 120).draft, .18);
assert.equal(hydro.levelFlotation(model, 0).draft, 0);
assert.equal(hydro.levelFlotation(model, hydro.supportedMass(model, .36)).drumCrownClearance, 0);
assert.equal(hydro.levelFlotation(model, 241).equilibrium, false);
assert.equal(hydro.levelFlotation(model, 241).draft, null);
for (const [mass, mm] of [[49.28, 93], [80.4, 133], [100.4, 157], [120.4, 180], [160.4, 228]]) {
  near(hydro.levelFlotation(model, mass).draft * 1000, mm, 1);
}
// Force balance, continuity and compatibility with the existing published calculator.
let previous = -1;
for (let mass = 0; mass <= 240; mass += .5) {
  const result = hydro.levelFlotation(model, mass);
  assert.ok(result.draft >= previous);
  near(hydro.supportedMass(model, result.draft), mass, 1e-8);
  near(result.draft + result.drumCrownClearance, .36);
  near(result.draft, legacy.flotation(mass, 0).draft);
  previous = result.draft;
}
// Scaling law: same immersed fraction at a scaled density or drum length.
const dense = {...model, density: 1025};
near(hydro.levelFlotation(dense, 80.4 * 1.025).draft, hydro.levelFlotation(model, 80.4).draft);
const long = {...model, length: model.length * 2};
near(hydro.levelFlotation(long, 160.8).draft, hydro.levelFlotation(model, 80.4).draft);
near(hydro.scenarioMass(baseline, 'completeCraft', 20, 20), 116.48);
near(hydro.scenarioMass(baseline, 'bareHull'), 49.28);

// Reject invalid cases, unit mistakes and invented provenance before simulation.
for (const value of [-1, NaN, Infinity, '80']) assert.throws(() => hydro.levelFlotation(model, value));
for (const radius of [0, -1, NaN]) assert.throws(() => hydro.segmentArea(radius, .1));
assert.throws(() => hydro.scenarioMass(baseline, 'unknown'));
assert.throws(() => hydro.scenarioMass(baseline, 'bareHull', -1));
const changed = mutate => {const copy = JSON.parse(JSON.stringify(baseline)); mutate(copy); return copy;};
assert.throws(() => hydro.resolveModel(changed(b => b.parameters.deckLength.unit = 'mm')));
assert.throws(() => hydro.resolveModel(changed(b => b.parameters.externalDrumVolume.value = 0)));
assert.throws(() => hydro.resolveModel(changed(b => b.parameters.bareHullMass.sources = ['missing'])));
assert.throws(() => hydro.resolveModel(changed(b => b.parameters.drumCentersXY.value.pop())));
assert.throws(() => hydro.resolveModel(changed(b => b.parameters.bareHullMass.value = -10)));
assert.throws(() => hydro.resolveModel(changed(b => b.gaps.push(b.gaps[0]))));
const measured = changed(b => {b.parameters.externalDrumVolume.value = .065; b.parameters.externalDrumVolume.evidence = 'measured';});
near(hydro.resolveModel(measured).volumePerDrum, .06); // Different shape requires an explicit model revision.
assert.equal(baseline.parameters.bareHullCenterOfGravity.value, null);
for (const source of Object.values(baseline.sources)) {
  if (source.locator.endsWith('.md') || source.locator.endsWith('.js')) {
    assert.ok(fs.existsSync(path.resolve(__dirname, '../model', source.locator)), source.locator);
  }
}
// The same module works as a browser script without Node or a DOM.
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../model/hydrostatics.js'), 'utf8'), context);
near(context.BobHydrostatics.levelFlotation(context.BobHydrostatics.resolveModel(baseline), 120).draft, .18);
console.log('PASS: baseline provenance/units; boundary cases; 481 force-balance and legacy comparisons; density/length scaling; invalid inputs; null unknowns; browser-script loading.');
