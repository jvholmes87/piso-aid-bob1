/* BOB Water Lab Phase 1: dependency-free, SI-only level flotation model. */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BobHydrostatics = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const positive = (name, value) => {
    if (!Number.isFinite(value) || value <= 0) throw new RangeError(name + ' must be finite and positive');
    return value;
  };
  function validateBaseline(baseline) {
    if (!baseline || baseline.schemaVersion !== 1 || baseline.units !== 'SI') {
      throw new TypeError('Expected an SI schemaVersion 1 baseline');
    }
    const p = baseline.parameters;
    const required = ['deckLength', 'deckWidth', 'deckThickness', 'drumCount',
      'nominalDrumVolume', 'idealDrumRadius', 'waterDensity', 'bareHullMass',
      'completeCraftMass', 'drumCentersXY', 'schematicDeckBottomZ',
      'externalDrumVolume', 'bareHullCenterOfGravity', 'completeCraftCenterOfGravity',
      'yawInertia', 'approvedPayload'];
    if (!p || required.some(key => !p[key])) throw new TypeError('Required baseline parameters are missing');
    const expectedUnits = {
      deckLength: 'm', deckWidth: 'm', deckThickness: 'm', drumCount: 'count',
      nominalDrumVolume: 'm3', idealDrumRadius: 'm', waterDensity: 'kg/m3',
      bareHullMass: 'kg', completeCraftMass: 'kg', drumCentersXY: 'm',
      schematicDeckBottomZ: 'm', externalDrumVolume: 'm3', bareHullCenterOfGravity: 'm',
      completeCraftCenterOfGravity: 'm', yawInertia: 'kg*m2', approvedPayload: 'kg'
    };
    for (const [key, parameter] of Object.entries(p)) {
      if (!['documented', 'modeled', 'assumed', 'measured', 'unknown'].includes(parameter.evidence)) {
        throw new TypeError(key + ' has invalid evidence class');
      }
      if ((parameter.value === null) !== (parameter.evidence === 'unknown')) {
        throw new TypeError(key + ' must preserve unknown values as null');
      }
      if (expectedUnits[key] && parameter.unit !== expectedUnits[key]) throw new TypeError(key + ' has incorrect SI unit');
      if (!parameter.note || !parameter.sources?.length || parameter.sources.some(id => !baseline.sources?.[id])) {
        throw new TypeError(key + ' lacks a note or resolvable source');
      }
      if (typeof parameter.value === 'number' && !Number.isFinite(parameter.value)) throw new TypeError(key + ' is non-finite');
    }
    for (const key of ['deckLength', 'deckWidth', 'deckThickness', 'drumCount',
      'nominalDrumVolume', 'idealDrumRadius', 'waterDensity', 'bareHullMass', 'completeCraftMass']) positive(key, p[key].value);
    if (!Number.isInteger(p.drumCount.value)) throw new TypeError('Drum count must be an integer');
    if (!Array.isArray(p.drumCentersXY.value) || p.drumCentersXY.value.length !== p.drumCount.value ||
      p.drumCentersXY.value.some(point => !Array.isArray(point) || point.length !== 2 || point.some(v => !Number.isFinite(v)))) {
      throw new TypeError('Drum centers must be finite x/y pairs, one per drum');
    }
    for (const key of ['bareHullCenterOfGravity', 'completeCraftCenterOfGravity']) {
      const value = p[key].value;
      if (value !== null && (!Array.isArray(value) || value.length !== 3 || value.some(v => !Number.isFinite(v)))) {
        throw new TypeError(key + ' must be a finite x/y/z triple');
      }
    }
    for (const key of ['externalDrumVolume', 'yawInertia']) if (p[key].value !== null) positive(key, p[key].value);
    if (p.approvedPayload.value !== null && (!Number.isFinite(p.approvedPayload.value) || p.approvedPayload.value < 0)) {
      throw new RangeError('Approved payload cannot be negative');
    }
    const ids = new Set();
    for (const gap of baseline.gaps || []) {
      if (!gap.id || ids.has(gap.id) || !gap.phases?.length || gap.phases.some(v => !Number.isInteger(v) || v < 1 || v > 6) ||
        !gap.action || !gap.sources?.length || gap.sources.some(id => !baseline.sources[id]) ||
        !['open', 'resolved'].includes(gap.status)) throw new TypeError('Invalid or duplicate gap record');
      ids.add(gap.id);
    }
    return baseline;
  }
  function resolveModel(baseline) {
    validateBaseline(baseline);
    const p = baseline.parameters;
    const radius = p.idealDrumRadius.value;
    const volumePerDrum = p.nominalDrumVolume.value;
    return Object.freeze({
      baselineId: baseline.id,
      drumCount: p.drumCount.value,
      radius,
      length: volumePerDrum / (Math.PI * radius * radius),
      volumePerDrum,
      density: p.waterDensity.value,
      note: 'Nominal-volume ideal-cylinder scenario; measured exterior volume is not automatically substituted.'
    });
  }
  function validateModel(model) {
    for (const key of ['drumCount', 'radius', 'length', 'density']) positive(key, model[key]);
    if (!Number.isInteger(model.drumCount)) throw new TypeError('Drum count must be an integer');
  }
  function segmentArea(radius, draft) {
    positive('radius', radius);
    if (!Number.isFinite(draft)) throw new TypeError('Draft must be finite');
    const d = Math.max(0, Math.min(2 * radius, draft));
    if (d === 0) return 0;
    if (d === 2 * radius) return Math.PI * radius * radius;
    return radius * radius * Math.acos(Math.max(-1, Math.min(1, (radius - d) / radius)))
      - (radius - d) * Math.sqrt(Math.max(0, 2 * radius * d - d * d));
  }
  function supportedMass(model, draft) {
    validateModel(model);
    return model.density * model.drumCount * model.length * segmentArea(model.radius, draft);
  }
  function levelFlotation(model, totalMass) {
    validateModel(model);
    if (!Number.isFinite(totalMass) || totalMass < 0) throw new RangeError('Total mass must be finite and nonnegative');
    const diameter = 2 * model.radius;
    const capacity = supportedMass(model, diameter);
    const result = {totalMass, fullImmersionMass: capacity, immersedFraction: totalMass / capacity,
      equilibrium: totalMass <= capacity, draft: null, drumCrownClearance: null};
    if (totalMass > capacity) return result;
    if (totalMass === 0) return {...result, draft: 0, drumCrownClearance: diameter};
    if (totalMass === capacity) return {...result, draft: diameter, drumCrownClearance: 0};
    let lo = 0, hi = diameter;
    for (let i = 0; i < 70; i++) {
      const mid = (lo + hi) / 2;
      if (supportedMass(model, mid) < totalMass) lo = mid;
      else hi = mid;
    }
    const draft = (lo + hi) / 2;
    return {...result, draft, drumCrownClearance: diameter - draft};
  }
  function scenarioMass(baseline, configuration, addedMass = 0, growthPercent = 0) {
    validateBaseline(baseline);
    if (!['bareHull', 'completeCraft'].includes(configuration)) throw new TypeError('Unknown mass configuration');
    if (!Number.isFinite(addedMass) || addedMass < 0 || !Number.isFinite(growthPercent) || growthPercent < 0) {
      throw new RangeError('Added mass and growth must be finite and nonnegative');
    }
    return baseline.parameters[configuration + 'Mass'].value * (1 + growthPercent / 100) + addedMass;
  }
  return Object.freeze({validateBaseline, resolveModel, segmentArea, supportedMass, levelFlotation, scenarioMass});
});
