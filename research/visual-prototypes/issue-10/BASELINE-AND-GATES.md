# Issue #10 | Baseline, visual reconciliation, and approval gates

Date: 2026-11-14 (Asia/Seoul). Status: **branch-based implementation candidate; NOT deployed**.

## Sources examined
- `docs/visual-explorer/README.md`, `SOURCE_REGISTER.md`, `assets/app.js`
- `docs/water-lab/README.md`, `PHASES.md`, `assets/scene-core.js`, `model/bob1-baseline.json`
- `docs/water-lab/progress/2026-11-01/README.md` (three genuine historical **desktop Canvas fallback** captures)
- `assets/README.md` (existing render and GIF inventory)
- `docs/water-lab/AGENTS.md` (capture and traceability procedure)

## VIZ-01 desktop / Android baseline log

| Surface | Existing evidence available | Live capture on this branch | Current status |
|---|---|---|---|
| Visual Explorer v0.3 | Hosted application, source tests, `explorer-preview.png` | Not acquired | **Baseline pending** |
| Water Lab Phase 2 desktop Canvas | Three dated 2026-11-01 screenshots and verified historical capture metadata | Not acquired | **Historical baseline available; new before/after needed** |
| Water Lab desktop WebGL 2 GPU | Source and shader exist; prior QA browser unavailable | Not acquired | **Not GPU verified** |
| Physical Android Chrome WebGL 2/Canvas | Pinch/touch logic exists | No physical device access | **Owner device check required** |
| Exploded-view GIF / isometric PNG set | `assets/README.md` inventory | Not visually re-rendered | **Archive/reference exists** |

This is a **source/documentary baseline**, not a claim of current browser or Android screenshot verification. Do not fabricate screenshots, device results, timestamps or FPS.

### Capture worksheet (fill from real devices before approval)
For each test device record: UTC and Korea-local date/time; OS/browser/version; viewport/CSS pixels and device pixel ratio; real WebGL 2 context status versus Canvas fallback; bare/complete configuration; lighting and animation state; orbit, pinch, accessibility and reduced-motion observations; load time and FPS measured with a documented method; source commit; original screenshot filename/dimensions/SHA-256. Keep raw captures unchanged under a dated `docs/water-lab/progress/YYYY-MM-DD/` directory, and follow `AGENTS.md` and `captures.json` requirements.

## VIZ-02 Geometry reconciliation matrix

| Element | Current input | Evidence | Decision |
|---|---|---|---|
| Deck footprint | 1,500 × 800 × 9 mm | Drawing 0004 (documented; not as-built) | Preserve |
| Four drum equivalent radius | 180 mm | Ideal-cylinder **assumption** | Preserve for hydrostatics only |
| Drum display centers | x=±390 mm; lateral ±240 mm | **Assumed display positions**, not approved spacing | Leave provisional; require CAD confirmation |
| Bare / complete total masses | 49.28 / 80.40 kg | **Modeled** CAD values, not weighed | Preserve without double counting |
| Deck lower face z | 505 mm in model | **Assumed** display stack-up | Leave provisional pending vertical dimension survey |
| Deck vs top of 20 mm schematic rails | Previously frame top z=400 mm, leaving 105 mm visual gap | Current geometry code, **not a drawing-based assembly clearance** | Fix display contact only: frame base z=deck−20 mm |
| Transom displayed upper face | Previously z=500 mm | Existing renderer assumption | Fix visual upper face to schematic deck underside; verify actual transom location later |
| Support rails, strap locations, camera mounts | Simplified illustrative models | No native CAD import revalidated | Do **not** relabel as dimensionally accurate |
| CG, external drum displacement, safe payload | Unknown/null | `WL-001`–`WL-004` | Keep unknown; no estimates introduced |

**Coordinate caution:** baseline JSON declares conventional design x/y plan coordinates and positive-up z, while the browser 3D renderer uses x/vertical y/lateral z. Conversion must be explicit in any future CAD/Three.js export; never silently swap axes.

### Localized source fix (already staged on this branch)
The Water Lab `scene-core.js` derives schematic rail elevation from `schematicDeckBottomZ` so the rail tops meet the underside of the deck. The transom top is aligned to the same visual contact plane. It does not alter draft mathematics, model source records, controls, the Visual Explorer or real-world design dimensions. A source-level regression assertion has been added; run the actual Node test suite before accepting the PR.

## VIZ-03 Comparison and pass/fail rubric

| Gate | Acceptable outcome |
|---|---|
| Geometry | Deck/frame visibly in contact across rotations; documented source versus assumed coordinates retain distinct labels |
| Function parity | Bare/complete, zoom/orbit, lighting, unit switching, pause, audio and fallback retain existing behavior |
| Computation | `node docs/water-lab/tests/model.cjs`, `node docs/water-lab/tests/scene.cjs`, `node docs/visual-explorer/tests/check.cjs` pass |
| Brand/accessibility | HDES #FF6600 and #2E2E2E, unmodified official logo, readable contrast, reduced motion and keyboard navigation |
| Mobile | Physical Android Chrome with orbit, two-finger pinch, frame rate and no page-scroll trapping; record evidence |
| Rendering | Distinguish desktop WebGL 2 GPU tests from Canvas fallback; separately inspect shader errors and loss/recovery |
| Offline/performance | Existing Visual Explorer offline package intact; new Three.js pilot stays isolated. Compare JS bytes/loading/FPS before adopting |
| Model correctness | Equilibrium computation and 5 reference cases unchanged; no payload capacity or wave-response claim |
| Reproducibility | Capture files dated with source SHA, device, renderer, manifest hashes and settings |
| Approval | Owner reviews independent comparisons before any dependency, merge or deployment |

## Owner release gates
1. **Gate A: geometry truth.** Obtain original CAD assembly or engineering drawing dimensions for drum spacing, rail/deck support stack-up, motor and equipment mounts. If unavailable keep schematic provisional and do not claim validated alignment.
2. **Gate B: visual and analytical parity.** Run and record automated checks plus real desktop GPU and Android tests; submit before/after side-by-side visuals and measurable results.
3. **Gate C: pilots.** Approve or reject Blender/Three.js/Manim individually. Third-party libraries must pass version/license/security/offline review.
4. **Gate D: release.** Owner explicitly approves reviewed PR changes. Do not auto-merge or enable automatic deployment.

## Pilot scope
Isolated examples live in `research/visual-prototypes/issue-10/` and are **not** imported by `docs/` production pages. The 3D pilot is illustration-only; Manim explains the same ideal-cylinder equation, not a certified stability or payload model.

## Known blockers at preparation
Native CAD source not verified in this public repo; physical Android test requires owner device; browser GPU validation and actual rendering of Blender/Manim require suitable tools; formal verification of third-party licensing is required before production adoption.
