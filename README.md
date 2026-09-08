<img width="800" height="568" alt="BOB 1_HDES_Original CAD isometric rendering" src="assets/bob1-isometric-01.png.png" />

# PISO-AID | Bob 1
### A small semi-autonomous pontoon research prototype

**Project lead:** Jason Vaughn Holmes  
**Status:** Design development and prototype planning  
**Updated:** 8 September 2026

## The project
Bob 1 explores a small waterborne platform for supervised cargo and remote-observation experiments. It is intended to provide a practical foundation for integrating propulsion, sensing, telemetry and limited autonomous navigation.

The original project brief envisages prototype fabrication in South Korea and possible later adaptation for Lake Piso, Liberia. Larger-scale suitability and local operating needs remain to be validated.

## What exists today
A mechanical and electrical design archive, fabrication drawing set, component references and high-level system documentation have been assembled. A document review identified configuration and integration issues to resolve before establishing an approved build.

Operational autonomy, payload, endurance and field performance have not been verified in the reviewed evidence. This repository currently contains project documentation, not working control software.

## Component concept
![Simplified Bob 1 component groups](assets/images/bob1-component-concept.png)

A schematic introduction to the flotation drums, frame, deck and onboard equipment. Component shapes and arrangement are simplified; propulsion is omitted for clarity. This is not an exploded CAD drawing.

## Assembly concept animation
![Looping schematic of Bob 1 component groups](assets/animations/bob1-assembly-concept.gif)

The layers move together and apart to explain the component groups. Motion, spacing and fit are illustrative, not validated assembly instructions. [Open the animation](assets/animations/bob1-assembly-concept.gif).

## Proposed system architecture
```mermaid
flowchart TD
  O["Operator station"] <--> L["Telemetry link"]
  L <--> C["Onboard control"]
  S["Navigation and sensors"] --> C
  C --> A["Motor and steering control"]
  A --> P["Propulsion"]
  B["Battery and power distribution"] -.-> C
  B -.-> S
  B -.-> A
```

Solid arrows show planned information or control paths; dashed arrows indicate power supply. This is a high-level integration concept, not a wiring diagram or a claim of demonstrated autonomy.

## Development roadmap
1. Reconcile design requirements and approve a prototype configuration.
2. Develop and test manual control, telemetry and fault responses.
3. Integrate the physical prototype and document its as-built configuration.
4. Conduct supervised water trials and measure performance.
5. Evaluate constrained autonomy and prepare the next development phase.

Read the [roadmap](docs/roadmap.md), [current status](docs/status.md) and [system overview](docs/system-overview.md).

## Collaboration and future funding
Areas of interest include marine/mechanical design review, embedded control, robotics, test planning, fabrication and prospective operating partners. These are collaboration interests, not confirmed partnerships.

Future support would help fund engineering reconciliation, components, integration and documented testing. Funding amount, schedule and program eligibility will be established from a scoped work plan and current opportunity requirements.

See the [funding overview](docs/funding-overview.md) and [collaboration guide](CONTRIBUTING.md).

## Learn more
Contact [Jason on GitHub](https://github.com/jvholmes87) or open a general inquiry using this repository's issue template. For a deeper technical discussion, a separate private review package is available by arrangement with the project lead.

## Documentation and rights
This public repository presents project intent, development status and plans. Detailed source records are maintained separately. No open-source license is assigned in this initial release; publishing this overview does not grant rights to commissioned designs or supplier assets.

Any concept illustrations or animations are illustrative only and are not evidence of successful operation or verified CAD geometry.

