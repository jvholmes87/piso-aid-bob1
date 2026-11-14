# Bob 1 animation and visualization tool candidate register

**Reviewed:** 2026-11-14  
**Status:** Candidate tools only; no packages installed and no production visualization modified.  
**Scope:** HDES / PISO-AID | Bob 1 public Visual Explorer, Water Lab, design communication, reproducible educational animations.

## Existing baseline

- `docs/visual-explorer/` is an offline-capable, dependency-free schematic viewer with an explicit source register, 30-item parts index, unit options and flotation scenario calculator.
- `docs/water-lab/` currently uses browser WebGL 2 with Canvas fallback; the procedural water **does not model physical wave forces**.
- The current repository distinguishes documented drawings, modeled masses, assumptions, unknown quantities and eventual measured evidence. Preserve these distinctions.
- Follow HDES brand palette (#FF6600 orange, #2E2E2E charcoal), official unmodified logo and both SI and US-customary display units.

## Priority definitions

- **A — pilot candidate:** clear near-term documentation/visual value; evaluate in an isolated proof of concept.
- **B — situational:** adopt only when a named feature requires it.
- **C — defer:** overlaps existing technology or adds complexity with little immediate value.

| No. | Project | Priority | Specific Bob 1 use | Evaluation / caveat |
|---|---|---|---|---|
| 01 | [Remotion Skills](https://github.com/remotion-dev/skills) | A | AI-assisted scripted research video and walkthrough production | Evaluate with Remotion runtime; distinguish skills from engine; review Remotion licensing |
| 02 | [Motion Canvas](https://github.com/motion-canvas/motion-canvas) | A | Reproducible TypeScript animated CONOPS, data flow and system architecture explainers | Pilot short research explainer, export video |
| 03 | [Motion](https://github.com/motiondivision/motion) | B | Accessible dashboard transitions and telemetry cards | Evaluate only if React or JS UI needs richer transitions |
| 04 | [Ola](https://github.com/franciscop/ola) | C | Simple eased value interpolation for UI numbers | Likely redundant with existing JS; defer |
| 05 | [Anime.js](https://github.com/juliangarnier/anime) | B | Assembly highlighting and ordered animation sequences | Compare against native Web Animations API and existing JS |
| 06 | [Manim](https://github.com/ManimCommunity/manim) | A | Mathematical communication of flotation, stability, control and estimation | Keep analytical input sourced and calculations independently verified |
| 07 | [Shifty](https://github.com/jeremyckahn/shifty) | C | Deterministic easing and tweening | Defer unless native animation is insufficient |
| 08 | [Two.js](https://github.com/jonobr1/two.js) | B | Schematic 2D vector animations and diagrams | Compare with SVG before adopting |
| 09 | [Lottie Web](https://github.com/airbnb/lottie-web) | B | Lightweight reusable animated icons and status illustrations | Playback only; avoid for mission-critical status meanings without accessible labels |
| 10 | [TweenJS](https://github.com/CreateJS/TweenJS) | C | Sequential 2D property tweens | Alternative to Anime.js; don't install both by default |
| 11 | [LUME](https://github.com/lume/lume) | C | HTML-oriented 3D presentation experiments | Three.js already stronger candidate; defer |
| 12 | [gifenc](https://github.com/mattdesl/gifenc) | B | Export lightweight GitHub-compatible animated GIF demonstrations | Prefer MP4/WebM for longer, more detailed motion |
| 13 | [Konva](https://github.com/konvajs/konva) | B | Interactive plan-view mission diagrams, draggable annotations | For conceptual operator UI only, not real navigation |
| 14 | [Blender](https://github.com/blender/blender) | A | CAD-derived vessel modeling, renderings and exploded assembly video | Use reconciled geometry, record provenance and modeled-vs-measured status |
| 15 | [Three.js](https://github.com/mrdoob/three.js) | A | Browser 3D model, equipment selection and water-scene visual upgrades | Benchmark against existing zero-dependency WebGL2/Canvas Water Lab; no automatic replacement |
| 16 | [Godot](https://github.com/godotengine/godot) | C | Interactive training and simulated operational scenarios | Future option; not source of validated vessel dynamics |
| 17 | [Babylon.js](https://github.com/BabylonJS/Babylon.js) | B | Alternative engine for browser-based 3D interactive viewer | Compare with Three.js; choose one engine if needed |
| 18 | [Proton](https://github.com/drawcall/Proton) | C | 2D particle effects for visualizing conceptual flows | Avoid unnecessary particle decorations or physically misleading effects |

## Proposed pilots (not approved dependencies)

1. **Blender -> exported model -> browser viewer:** reconcile CAD and known geometry first; test whether Three.js reduces implementation burden compared with current native WebGL 2 and Canvas code.
2. **Motion Canvas:** generate one short control architecture/shore-operator interaction explainer from versioned diagrams and sourced assumptions.
3. **Manim:** render one 60 L drum cylinder immersion explanation; check numerical cases against `docs/water-lab/model/hydrostatics.js` and the existing documented reference cases.
4. **Remotion Skills:** storyboard a 60–90 second project status video. Use explicit phrases such as “schematic visualization,” “modeled,” and “not water-tested” wherever applicable.
5. **Konva:** evaluate only if a plan-view prototype or editable diagram is specifically required. It must not imply production-ready remote operation.

## Engineering acceptance gate

Before adopting any candidate: check project license and commercial redistribution obligations; maintenance/security/dependency footprint; browser mobile and offline support; accessibility and reduced-motion behavior; reproducibility and ability to export/pin results; metric/US unit fidelity; brand consistency; and evidence provenance. Compare bundle and performance impact on the existing site. Do not add multiple overlapping animation engines by default. Keep visual effects distinct from validated simulation outputs. Do not make claims about tested autonomy or physical vessel construction based on animations.

## Licensing caution

“Free” does not necessarily mean open-source or unrestricted commercial use. In particular, **Remotion Skills** is an agent-instruction repository and is not itself the Remotion rendering runtime. Review the Remotion runtime's separate license before use in a business workflow; review each tool's current LICENSE at integration time.

## Source and traceability

Candidate list: social media compilation supplied by project owner, 2026-11-14. Repository URLs are upstream references, **not installed components**. Versions, specific license texts and interoperability are not yet formally validated. Review against `docs/visual-explorer/README.md`, `docs/visual-explorer/SOURCE_REGISTER.md` and `docs/water-lab/README.md` before creating implementation work.
