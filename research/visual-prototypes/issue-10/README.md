# Bob 1 — Issue #10 visual pilot workbench

**Status:** Experimental source only, prepared 2026-11-14. No build outputs, screenshots, scene captures, physical measurements, deployments or third-party dependencies have been claimed or committed. This folder is outside GitHub Pages' `docs/` publishing root.

## Deliverables
- [BASELINE-AND-GATES.md](BASELINE-AND-GATES.md): audited source assets, known visual defect, evidence/coordinate reconciliation, desktop/Android capture worksheet, acceptance criteria, owner approval gates.
- [three-comparison.html](three-comparison.html): isolated Three.js comparison sketch — static idealized drums, deck/frame and concept equipment, orbit/zoom, assembled/exploded and hull/complete toggle. This **is not** the 30-item Visual Explorer and has no hydrostatics engine. Uses an externally served pinned Three.js build; not yet an offline solution.
- [bob1_schematic.py](bob1_schematic.py): Blender Python script generating a schematic GLB based on provisional coordinates, not native CAD or an accurate imported assembly.
- [bob1_flotation.py](bob1_flotation.py): Manim clip script using the same four-cylinder immersion equation and five documented rounded cases.

## How to test in a separate working tree
1. Run existing regressions: `node docs/water-lab/tests/model.cjs`, `node docs/water-lab/tests/scene.cjs`, `node docs/visual-explorer/tests/check.cjs`. Source changes must pass these before merging.
2. For Three.js: `python3 -m http.server 8080` from repository root and open `http://localhost:8080/research/visual-prototypes/issue-10/three-comparison.html` in an internet-connected browser. Document browser, GPU, remote CDN load, camera/touch behavior, and downloaded JS bytes. The site must remain functional with the existing renderer if the pilot fails.
3. For Blender: use a reviewed Blender version and run `blender -b -P research/visual-prototypes/issue-10/bob1_schematic.py`. GLB output is illustrative; check approximate dimensions, correct coordinate mapping and Blender version. Do not commit generated GLB before owner review.
4. For Manim: after verifying its license and environment, run `manim -pql research/visual-prototypes/issue-10/bob1_flotation.py Bob1Flotation`. Review numerical case assertions and all visual disclaimers. Do not publish an unreviewed simulation clip.
5. Compare outputs with baseline (desktop native WebGL 2 AND Canvas fallback; real Android as distinct test), then supply screenshots/captures manifests per `docs/water-lab/AGENTS.md`. Do not replace existing implementation before approval.

## Tool comparison decision worksheet

| Candidate | Benefits sought | Cost/risks to measure | Adoption decision |
|---|---|---|---|
| Existing WebGL 2 + Canvas fallback | Already works without third-party JS; supports offline | Current model fidelity, shader/device verification | Default incumbent |
| Three.js | Simplifies 3D scene objects/materials/imports | CDN/network, library payload, offline compatibility, mobile FPS | **Pending tests** |
| Blender | Reproducible geometry renders and GLB export | CAD provenance, axis convention, operator toolchain | **Pending tests** |
| Manim | Repeatable source-based math animation | Rendering toolchain, formula parity, provenance | **Pending tests** |

**Legal/quality:** Assess full current licenses and redistribution terms at adoption time. HDES palette, exact logo handling, reduced-motion defaults, SI + US units, independent calculations, and non-misleading evidence labels are mandatory. A visual effect is never evidence that a vehicle has been built, tested, or certified.

## Required owner decision
Review the source code and the reconciliation matrix. Authorize separate testing and provide/approve native CAD/drawing inputs before replacing schematic geometry. Do not merge or deploy this source branch until the recorded release gates are satisfied.
