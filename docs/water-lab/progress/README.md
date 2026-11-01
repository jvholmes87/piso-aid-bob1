# BOB 1 Water Lab — visual progress record

This is the phase-by-phase record of Water Lab development. **Software screenshots, design visualizations and physical build photographs are separate evidence types.** A screenshot does not establish that BOB 1 has been fabricated, tested on water or validated against measurements.

## Recorded milestones

| Record | Status at recording | Evidence |
| --- | --- | --- |
| Phase 1 — vessel baseline | Merged in [PR #5](https://github.com/jvholmes87/piso-aid-bob1/pull/5) | Source-linked SI configuration, null unknowns and hydrostatics checks. No water-scene interface existed; no historical screenshot is recreated. |
| [1 November 2026 — Phase 2](2026-11-01/README.md) | Captured while [PR #6](https://github.com/jvholmes87/piso-aid-bob1/pull/6) was a candidate; implementation subsequently merged | Three original desktop screenshots, capture manifest, changes, checks and open verification items. |
| [1 November 2026 — public walkthrough](2026-11-01/publication.md) | Published on YouTube and X | Author/title and visible post excerpt checked through public metadata; playback and audience metrics not independently checked. |

Phases 3–6 have no completed visual record yet. Add entries as work occurs; do not backfill invented results.

## Record each phase

For each completed phase or material visual revision:

1. Capture the prior interface **before** editing when available, and the resulting interface after checking the change. If no prior capture exists, say so.
2. Keep a default/overview image and images of the changed feature and relevant readouts. Add real device captures when tested. Preserve the original screenshot bytes.
3. Add a dated folder and record the source commit, phase, renderer/device, selected configuration and visible settings. Dates here use Asia/Seoul. Do not invent precise capture times.
4. Document the problem, change, observable result, checks, open issues and next step. Distinguish automated checks from browser checks and physical measurements.
5. Add captions and a `captures.json` manifest with image names, dimensions and SHA-256 hashes. Verify the references and hashes before committing.
6. Update this index, the phase status and changelog. Keep source, photos and record in the same PR when practical.

Physical-build photographs belong to a separately labeled record supplied during fabrication or testing. Include the actual date, configuration, build/test stage, relevant dimensions or measured values, and observations. Do not use renders as construction photos. Keep private contact information and unrelated people out of public images.

The local [contributor instructions](../AGENTS.md) make this record part of the Water Lab workflow.
