# Research questions

Bob 1 is intended to convert design assumptions into testable evidence. No research question below is considered answered today.

## RQ1 — Supervised waypoint navigation in moving water

**Question:** Can a low-cost USV maintain reliable supervised waypoint navigation in moving-water conditions such as current, wind, and floating debris?

**Why it is uncertain:** The platform has not been built or water-tested, so hull response, propulsion authority, sensor performance, and guidance behavior under environmental disturbance are unverified.

**How it will be tested:** Execute repeatable supervised waypoint routes after bench, tethered, and manual handling tests. Log GPS track, commanded route, environmental notes, operator interventions, and ArduPilot dataflash logs.

**Success:** Demonstrated performance against the route-following and intervention metrics in [acceptance-criteria.md](acceptance-criteria.md). Numerical targets remain **TBD, set by project lead**.

## RQ2 — Operator intervention rate

**Question:** What operator-intervention rate is achievable under supervised autonomy, and which conditions drive interventions?

**Why it is uncertain:** The interaction between route geometry, environmental conditions, telemetry quality, vehicle handling, and failsafe behavior has not been measured.

**How it will be tested:** Record every manual override, abort, route correction, and safety intervention during supervised waypoint runs, together with the condition that triggered it.

**Success:** A repeatable intervention rate can be calculated and traced to operating conditions, with the project meeting the applicable criterion in [acceptance-criteria.md](acceptance-criteria.md). Target: **TBD, set by project lead**.

## RQ3 — Payload-to-cost ratio

**Question:** What payload-to-cost ratio can a shallow-draft pontoon platform achieve compared with conventional small craft?

**Why it is uncertain:** Actual flotation, usable payload, as-built mass, propulsion efficiency, and completed build cost are not yet measured.

**How it will be tested:** Weigh the completed platform and defined payloads, compare measured flotation with the project calculator, record endurance at defined payload, and reconcile actual build cost against the bill of materials. Comparisons with conventional craft will only use documented, like-for-like data.

**Success:** A reproducible payload-to-cost calculation supported by measured payload and actual build cost, with project-specific targets **TBD, set by project lead**.

## RQ4 — Evidence-quality telemetry and logging

**Question:** What telemetry and logging architecture produces evidence sufficient to support future crewing and operating standards?

**Why it is uncertain:** The proposed electronics and logging stack has not been integrated, and the completeness and reliability of its operating record are unverified.

**How it will be tested:** For each run, retain GPS track, battery data, intervention log, ArduPilot dataflash log, link-availability record, and short run notes. Review whether events can be reconstructed and whether operator interventions can be correlated with vehicle state and environmental conditions.

**Success:** Each test can be reconstructed from a complete, time-correlated evidence package, and the telemetry-link metric in [acceptance-criteria.md](acceptance-criteria.md) is met. Target: **TBD, set by project lead**.
