# Systems engineering documentation status

**Audit date:** 9 October 2026  
**Project:** PISO-AID / Bob 1, owned by HDES (U.S. LLC formation in progress)  
**Scope:** Current BOB1 design archive and public repository `main` at `a02481e434b0203c3097b8186b0495591bcb4128` before this update.

Bob 1 is a small supervised-autonomy research USV. The future cargo-barge concept has a separate scale and operating basis. This audit found useful mechanical, electrical, architecture and testing material, but did not verify an approved systems engineering baseline, a completed safety case, statutory certification or passing prototype tests.

Before this audit, **7 of the 12 checklist areas had partial coverage and 5 dedicated deliverables were not located**. A **draft RTM with 34 candidate requirements** has now been created in the working project records. Current status is **7 partial, 4 not found and 1 newly created draft**. These counts describe documentation coverage, not design completion or operational readiness.

## Document tree and gap assessment

| WBS | Document | Status | Existing public evidence | Next work |
|---|---|---|---|---|
| 1.1 | Concept of Operations (ConOps) | Partial | [Project overview](../README.md), [regulatory approach](regulatory-approach.md), [test plan](test-plan.md) | Define site-specific Operational Design Domain (ODD), modes, shore roles, handover and recovery. The existing ConOps graphic is a high-level illustration. |
| 1.2 | System Requirements Specification (SyRS) | Partial | [Acceptance criteria](acceptance-criteria.md), [drawing register](drawing-register.md) | Approve requirement IDs, numerical limits, tolerances and a single build configuration. Existing performance targets are TBD. |
| 2.1 | Safety analysis (FMEA / STPA) | Not found | [Test safety controls](test-plan.md) are supporting material | Create a hazard log and select suitable analysis methods. Cover position, sensors, link, power, propulsion, operator and hull failures. |
| 2.2 | Cybersecurity and Data Link Specification | Not found | [Proposed communications architecture](control-architecture.md) | Define authorization, command freshness, replay protection, trust boundaries, updates, logs and link-loss behavior. |
| 3.1 | System Architecture Document (SAD) | Partial | [System overview](system-overview.md), [proposed control architecture](control-architecture.md) | Reconcile the source design and proposed autopilot. Allocate functions, power and control authority. |
| 3.2 | Interface Control Document (ICD) | Partial | [Architecture integration items](control-architecture.md), [drawing reconciliation items](drawing-register.md) | Approve electrical ratings, pinouts, actuator commands, messages, timing and mechanical interfaces. |
| 4.1 | Perception and Sensor Fusion Specification | Partial | [System overview](system-overview.md), [control architecture](control-architecture.md) | Define installed sensors, calibration, timestamps, uncertainty, quality flags, fusion and degraded modes. |
| 4.2 | Collision Avoidance and Autopilot Logic Plan | Not found | [Waypoint test intent](test-plan.md) | Define applicable navigation rules and encounter scenarios. Proposed waypoint navigation does not demonstrate collision avoidance or COLREG compliance. |
| 5.1 | Regulatory Compliance Matrix | Partial | [Regulatory approach](regulatory-approach.md) | Create clause-level applicability and evidence tracking for each jurisdiction, site and vessel stage. |
| 5.2 | Registry and Statutory Certification Register | Not found; applicability open | [Regulatory approach](regulatory-approach.md) | Determine required, not applicable and later-stage records from vessel particulars and intended use. No certificates verified. |
| 6.1 | Verification and Validation (V&V) Master Plan | Partial | [Staged test plan](test-plan.md), [acceptance criteria](acceptance-criteria.md), [research questions](research-questions.md) | Add simulation/HIL scope, controlled procedures, approved thresholds, trace links and sign-off records. |
| 6.2 | Requirements Traceability Matrix (RTM) | Created draft | Working project tracker created 9 October 2026 | Approve the 34 candidate requirements, owners, procedures and criteria. Execute tests and attach reviewed results. |

**Partial** means related content exists but the checklist deliverable is incomplete or not verified as approved. **Not found** means not located in the audited archive and repository; it is not proof that no copy exists elsewhere. **Created draft** identifies new planning material, without claiming approval or test completion.

The private working tracker includes the document hierarchy, dependencies, review gates, evidence source IDs, candidate requirements, proposed verification methods and test IDs, acceptance criteria, owners and result/approval links. All candidate requirements begin as drafts and every proposed test begins as **Not run**. A requirement cannot close in the tracker until its criteria, owner, test plan, passing result and approval evidence are populated.

## Scope and evidence limits

- Inventoried 246 files across 26 subfolders in the BOB1 Drive tree before creating the tracker. This includes CAD, drawings, component references, renders, electrical records and analysis material. Relevant engineering PDF text and the repository documents were reviewed; file inventory alone is not content validation.
- The `04_AsBuilt` folder was empty at audit time. No completed as-built package or passing test evidence was verified.
- The source archive includes an original system report, electrical schematics and a preliminary hull estimate. These provide partial inputs to several checklist documents; they do not establish approval or certification.
- Native CAD geometry, Simulink execution and physical hardware were not validated by this audit. Detailed designs, source URLs and working records remain private.
- Current published project status reports no built or water-tested prototype. The CubePilot Cube Orange+ running ArduPilot Rover remains proposed, not purchased, integrated or tested. See [current status](status.md).
- Radar, LiDAR, AIS and sonar are not confirmed parts of the current integrated system. Cameras and ultrasonic references do not demonstrate a working perception or collision-avoidance stack.

## Engineering priorities

1. Reconcile power, propulsion and control selections. Existing sources disagree on 24 V versus 12 V and contain different motor/steering and controller concepts. Resolve these before procurement or wiring.
2. Approve Phase 1 hull requirements and the drawing/BOM baseline. Measure drum geometry, as-built mass, support spans and load distribution before assigning test loads. The preliminary flotation model is not a safe payload rating.
3. Establish the safety analysis, ODD, permissions, recovery procedures and measurable acceptance criteria before powered water trials. A generic stop/hold response needs evaluation for current, drift and available position/propulsion control.
4. Expand the V&V plan and maintain the RTM through bench, restrained float, manual handling, supervised waypoint and later payload/endurance tests. Add simulation and fault injection before expanding autonomy.

Pre-funding trials: South Korea (site TBD, with required permission). Funded trials: United States. The full-scale concept remains a crewed platform using supervised autonomy.

## Regulatory basis

The twelve-document checklist is used here as an engineering planning structure. It is not a universal legal certification package for every vessel.

As of this audit, IMO's non-mandatory MASS Code was adopted in May 2026 and took effect on 1 July 2026. Its stated scope concerns SOLAS Chapter I cargo ships, with wider application encouraged as practicable. Bob 1's local trial requirements still need a site-specific assessment (International Maritime Organization [IMO], n.d.).

DNV's AROS notations and ABS's autonomy/remote-control requirements are useful reference frameworks. This project does not claim class approval or engagement with either society. The safety-analysis method and required submissions must follow the selected scope and applicable authority/class basis, rather than assuming FMEA or STPA is universally mandated (American Bureau of Shipping, 2024; DNV, n.d.).

Registry, tonnage, load-line and pollution documentation depend on size, use, jurisdiction and voyage. For example, Article 5 of the International Convention on Load Lines excludes new ships under 24 m from that convention. This does not determine national or local trial obligations (IMO, 1966).

## References

American Bureau of Shipping. (2024). *Requirements for autonomous and remote control functions*. https://ww2.eagle.org/content/dam/eagle/rules-and-guides/current/other/323-requirements-for-autonomous-and-remote-control-functions-2024/323-autonomous-reqts-oct24.pdf

DNV. (n.d.). *AROS class notations*. Retrieved October 9, 2026, from https://www.dnv.com/maritime/autonomous-remotely-operated-ships/aros-class-notation/

International Maritime Organization. (1966). *International Convention on Load Lines*. https://www.riigiteataja.ee/aktilisa/2160/1201/3001/Conv_on_Load_Lines.pdf

International Maritime Organization. (n.d.). *FAQ: Autonomous shipping*. Retrieved October 9, 2026, from https://www.imo.org/en/mediacentre/hottopics/pages/autonomous-shipping.aspx
