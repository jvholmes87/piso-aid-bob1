# Bob 1 staged test plan

No Bob 1 prototype has been built or water-tested. This plan defines the intended progression from bench verification to a supervised waypoint trial.

**Test locations:** Pre-funding trials: South Korea (site TBD, with required local permission). Funded trials: United States. **[CONFIRM specific sites when selected]**

## Common safety controls

- Physical kill switch
- RC manual override with priority over supervised autonomy
- Failsafe on telemetry loss: stop/hold, with final behavior verified before water testing
- Testing only in permitted waters
- Safety observer on shore or in a chase boat
- Liability coverage in place before any water trial
- Test progression stops when a prerequisite stage fails or a safety control is unavailable

## 1. Bench test

**Objective:** Verify power distribution, propulsion commands, sensors, telemetry, manual override, failsafes, and logging before launch.

**Setup:** Vehicle electronics secured on the bench with propulsion made safe for bench operation; proposed autopilot, GPS/compass, telemetry, RC receiver, power monitoring, and ground station connected.

**Data to log:** Power state, sensor health, telemetry availability, RC/manual-override events, failsafe events, ArduPilot dataflash log, and test notes.

**Pass/fail criteria:** Applicable telemetry, manual-override, and logging criteria in [acceptance-criteria.md](acceptance-criteria.md). Targets remain **TBD, set by project lead**.

**Safety controls:** Propulsion physically restrained or disabled as appropriate; emergency power disconnect accessible; no exposed conductors; test stopped for unexpected motor command, overheating, smoke, or unstable power.

## 2. Dockside/tethered test

**Objective:** Verify flotation, trim, watertightness observations, and manual control while restricting vehicle travel.

**Setup:** Bob 1 launched in permitted water and secured with a tether suitable for the test environment. Defined initial payload and battery configuration documented.

**Data to log:** As-built mass, payload, flotation/trim observations, GPS, battery data, manual-control response, telemetry, intervention notes, and dataflash log.

**Pass/fail criteria:** Applicable payload/flotation, telemetry, and override criteria in [acceptance-criteria.md](acceptance-criteria.md).

**Safety controls:** Physical kill switch, RC override, shore observer, recovery line/tether, local permission, and liability coverage.

## 3. Calm-water manual run

**Objective:** Establish remote-controlled handling and propulsion baseline before supervised autonomy.

**Setup:** Short, bounded course in permitted calm water with safety observer and recovery plan.

**Data to log:** GPS track, control inputs, speed/heading response as available, battery data, telemetry availability, interventions, anomalies, and dataflash log.

**Pass/fail criteria:** Applicable telemetry, override, endurance, and route-baseline criteria in [acceptance-criteria.md](acceptance-criteria.md).

**Safety controls:** RC control remains primary, autonomy disabled, physical kill switch available, observer on shore or chase boat, and pre-briefed abort/recovery procedure.

## 4. Supervised waypoint run

**Objective:** Evaluate waypoint navigation while an operator remains ready to take control.

**Setup:** Short preplanned route in permitted water after successful manual handling tests. Operator monitors from the ground station with RC override immediately available.

**Data to log:** Planned waypoints, GPS track, cross-track error data, battery data, telemetry availability, every operator intervention, environmental notes, and ArduPilot dataflash log.

**Pass/fail criteria:** Route-following error, operator interventions, telemetry reliability, and manual-override response in [acceptance-criteria.md](acceptance-criteria.md).

**Safety controls:** RC override priority, telemetry-loss failsafe verified before launch, observer on shore or chase boat, bounded test area, physical kill switch, and defined abort conditions.

## 5. Payload and endurance run

**Objective:** Measure operation with a defined payload and compare observed endurance and flotation with project predictions.

**Setup:** Approved test payload secured and weighed; battery configuration documented; route and operating profile fixed for repeatability.

**Data to log:** Payload, GPS track, battery voltage/current/energy as available, elapsed run time, telemetry availability, interventions, environmental notes, flotation observations, and dataflash log.

**Pass/fail criteria:** Endurance at defined payload, measured payload versus flotation prediction, telemetry reliability, and build-cost evidence where applicable in [acceptance-criteria.md](acceptance-criteria.md).

**Safety controls:** Same water-trial controls as Stage 4, with payload restraint and flotation condition checked before departure.

## Data logging

Every run will produce:

- GPS track
- Battery data
- Operator-intervention log
- ArduPilot dataflash log
- Short run notes

Store each run in:

`data/runs/YYYY-MM-DD-run-NN/`

Each run folder should identify the test stage, configuration, payload, environmental observations, anomalies, and whether the applicable acceptance criteria were met.
