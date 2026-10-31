# Water Lab delivery phases

Started 1 November 2026. Work proceeds sequentially; resolve relevant gaps when a phase needs them. Phase status describes software work, not completion of the physical BOB prototype. The [baseline](model/bob1-baseline.json) owns the gap records.

| Phase | Software status | Deliverable | Check before moving on |
| --- | --- | --- | --- |
| 1. Model baseline | Implemented; checks pass | Versioned SI vessel definition, source/evidence classes, null unknowns, level-flotation module and gap records | Reproduce published draft cases; document coordinate and mass conventions; never imply physical approval |
| 2. Water environment | Implemented; Canvas browser QA; GPU/Android checks open | Procedural water/sky/lighting, BOB geometry, orbit camera, synthesized ambience, device quality settings and Canvas fallback | Common baseline and automated scene checks pass; retain explicit GPU/physical-Android verification limits |
| 3. Hull and ballast lab | Planned | Movable load positions, approximate equilibrium, CG/buoyancy overlays, units and reproducible load cases | Resolve or explicitly bound WL-001 to WL-004; verify symmetrical and eccentric cases; export assumptions; compare with future weighing/float tests |
| 4. Environment | Planned | Repeatable wind, wave and current scenarios with bounded forcing | Address WL-005; distinguish an illustrative response from calibrated BOB behavior; check numerical stability |
| 5. Powered operation | Planned | Manual steering, modeled thrust/power, battery bookkeeping and motor degradation | Address WL-005 to WL-007; select the motor/steering/power arrangement; do not derive endurance from capacity alone |
| 6. Research scenarios | Planned | Defined link faults, feasible fallback, selected module arrangement and replay/export | Address WL-008/009; distinguish simulated policy from ArduPilot integration; document all relevant authority and fault states |

Phases 1–3 form the first interactive loading-lab release. Phase 2 provides a visual environment with calculated level draft; movable loading, heel and trim are still Phase 3 work. Later implementation may refine this sequence; record changes and supporting evidence here.
