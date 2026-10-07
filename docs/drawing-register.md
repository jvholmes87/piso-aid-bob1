# Drawing register

Index of the Bob 1 mechanical drawing package (revision V03, dated 26 October 2025) and the preliminary engineering analysis that reads from it. Native CAD (SolidWorks part, assembly and drawing files, and DWG exports) is held privately and is not published here. Only the register, PDF sheet references and summary values are public.

Status terms: **Issued** means the sheet exists in the private package; **Reviewed** means its values were read into the September 2026 hull estimate or the visual explorer. No sheet has been released for fabrication.

## Mechanical drawings

| No. | Title | Subsystem | Native format | PDF | Status | Read into |
|---|---|---|---|---|---|---|
| 0001 | Full assembly, sheets 1–4 (30-row top-level BOM) | ASM | SLDDRW / SLDASM | Yes | Issued, reviewed | Explorer BOM index, equipment XY centres |
| 0002 | Pontoon assembly | STR | SLDDRW / SLDASM | Yes | Issued, reviewed | Hull estimate (drums, bare mass) |
| 0003 | Frame welding | STR | SLDDRW / SLDPRT | Yes | Issued, reviewed | Hull estimate (tube, transom, cut list) |
| 0004 | Deck, 1,500 × 800 × 9 mm marine plywood | STR | SLDDRW / SLDPRT | Yes | Issued, reviewed | Hull estimate (deck mass) |
| 0005 | Drum pad | STR | SLDDRW / SLDPRT | — | Issued, reviewed | Hull estimate (restraints) |
| 0006 | Drum strap | STR | SLDDRW / SLDPRT | — | Issued, reviewed | Hull estimate (restraints) |
| 0007 | GPS/IMU post assembly and enclosure | SNS | SLDDRW / SLDASM | — | Issued, reviewed | Explorer |
| 0012 | Corner camera assembly | SNS | SLDDRW / SLDASM | Yes | Issued, reviewed | Explorer |
| 0013 | Camera post and housing details | SNS | SLDDRW / SLDASM | — | Issued, reviewed | Explorer |
| 0015 | Sensor main plate | SNS | SLDDRW / SLDPRT / DWG | Yes | Issued | — |
| 0020 | Control enclosure, 240 × 160 × 120 mm | ELC | SLDDRW / SLDASM | — | Issued, reviewed | Explorer |
| 0022 | Rear control post: 360 camera, lamp, illuminators, LTE antenna | SNS / LGT / ELC | SLDDRW / SLDASM | — | Issued, reviewed | Explorer |
| 0026 | All-round lamp mount | LGT | SLDDRW / SLDPRT | — | Issued | — |
| 0032 | Ultrasonic sensor mount | SNS | SLDDRW / SLDPRT / DWG | — | Issued, reviewed | Explorer |
| 0033 | Conduit runs 1–6 (six flexible conduits, nominal 3,680 mm total) | CAB | SLDDRW / SLDASM | Yes | Issued, reviewed | Explorer |

Subsystem codes follow the CAD file naming: STR structure, SNS sensors, ELC electronics, PWR power, PRP propulsion, LGT lighting, CAB cabling, ASM assembly.

Additional part files exist for the battery pad (PWR), motor clamping pad (PRP), LTE mount and flange (ELC), side plate, post flange and camera post pad/cover (SNS). They are covered by the assembly sheets above.

## Electrical

| Item | Status |
|---|---|
| Original system block diagram (24 V propulsion and lighting bus, 12 V control, 5 V sensors) | Issued; see [system overview](system-overview.md) |
| Bill of materials (BOB1-HDES BOM, spreadsheet) | Issued; final approved BOM and quotations outstanding |
| Proposed autopilot stack (Cube Orange+ / ArduPilot Rover) | Proposed, not purchased; see [control architecture](control-architecture.md) |

The block diagram's 24 V propulsion bus and drawing 0001's 12 V motor and 12 V 100 Ah battery are a known conflict to reconcile before procurement.

## Analysis

| Document | Date | Scope |
|---|---|---|
| Bob 1 hull: preliminary capacity estimate, calculation revision 0 | 12 September 2026 | Flotation, draft, initial stability sensitivity, frame member and deck screens, connection notes, validation sequence. Reads drawings 0001–0006. Not a payload rating. |

Summary figures from that estimate are shown in the [draft and stability chart](../assets/images/bob1-hull-draft-stability.png) and in the explorer's load-case lab.

## Known reconciliation items

- Motor and battery voltage (24 V diagram vs. 12 V drawing).
- BOM item 23 pairs an M8 identifier with an M6 description.
- Port/starboard lamp sidedness differs between sources.
- Drum-row spacing, clear frame spans and loaded centre of gravity are not yet dimensioned for analysis.
- Nominal 60 L drum capacity is a proxy; measured external volume is required.

Related: [system overview](system-overview.md) · [status](status.md) · [test plan](test-plan.md)
