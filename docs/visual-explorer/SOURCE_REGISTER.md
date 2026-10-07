# Source register — v0.3

Prepared 6 October 2026. Physical status has not been independently verified.

| Input | Value | Basis | Evidence class |
|---|---|---|---|
| Deck | 1,500 × 800 × 9 mm | Drawing 0004 summarized by estimate | Documented drawing value |
| Drums | 4 × nominal 60 L HDPE | Drawing 0002 summarized by estimate | Nominal container capacity, not measured exterior displacement |
| Bare hull mass | 49.28 kg | Drawing 0002 CAD mass in estimate | Modeled, not weighed |
| Complete craft mass | 80.40 kg | Drawing 0001 CAD mass in estimate | Modeled, not weighed |
| Frame tube | 20 × 20 × 2 mm; 14 m cut-list total | Drawing 0003 summarized by estimate | Documented drawing value |
| Transom tube | 120 × 40 × 3 mm; 800 mm length | Drawing 0003 summarized by estimate | Documented drawing value |
| Pads | 8; 200 × 100 × 25 mm EPDM | Drawings 0002, 0005, 0006 in estimate | Documented drawing value |
| Restraints | 8 stainless straps; 16 M6 bolts | Drawings 0002, 0005, 0006 in estimate | Documented; connection capacity unverified |
| Drum diameter | 360 mm | Ideal-cylinder assumption in estimate | Analyst assumption |
| Equivalent drum length | 589.46 mm | 0.060 / (π × 0.180²) metres | Calculated to preserve nominal volume |
| Display drum centres | X ±390 mm, Y ±240 mm | Explorer implementation | Illustrative, not measured |
| Display rail topology and vertical heights | See app.js | Explorer implementation | Illustrative, not native CAD |
| Water density | 1,000 kg/m³ | Estimate calculation basis | Freshwater assumption |
| Base mass allowance | 0–30% | User-adjustable scenario | Sensitivity only |
| Added mass | 0–200 kg | User-adjustable scenario | Sensitivity only; not load authorization |
| Stability screen tiers | >100.4 kg reduced; >120.4 kg marginal; >140.4 kg unstable | GM table in estimate (KG = 450 mm, 400/440 mm spacing) | Sensitivity band, not measured |
| Build progress | No completion percentage | Work sequence and reported Phase 1 focus | Latest completion unverified |

## Methods

For radius r = 0.180 m and draft d, let q = sqrt(2rd − d²). Circular submerged area is r² acos((r − d)/r) − (r − d)q. Total supported mass is density × drum count × equivalent length × area. Solve d by 70 bisection iterations over [0, 2r]. Zero and full immersion are handled explicitly. Above 240 kg, no equilibrium in this model is reported. No buoyancy credit is assigned to other components.

## Reference cases

| Total mass (kg) | Report rounded draft (mm) |
|---|---|
| 49.28 | 93 |
| 80.40 | 133 |
| 100.40 | 157 |
| 120.40 | 180 |
| 160.40 | 228 |

## References

Holmes, J. V. (2026, September 12). *Bob 1 hull: Preliminary capacity estimate* (Calculation revision 0). Project analysis, filename `Bob1_Hull_Structural_and_Flotation_Estimate.pdf`.

Holmes, J. V. (2026, September 5). *Bob 1 folder review*. Project review, filename `Bob1_Folder_Review.md`.

Holmes Dynamic Engineered Systems. (2025, October 26). *BOB1-HDES mechanical drawings 0001–0006* (V03). Summarized in the project estimate. Detailed geometry and release approval were not revalidated for this explorer.

Private source URLs and private documents are intentionally excluded from the public-ready bundle. Values may change after configuration reconciliation. Electronics and propulsion conflicts are outside this hull-only display.

## HDES brand basis

Holmes Dynamic Engineered Systems, LLC. (n.d.). *Brand style guidelines* (Brand Book.pdf; stored in ADMIN / Brand Book). Color palette: Vivid Orange #FF6600; Dark Charcoal #2E2E2E. Typography prose: Facundo headings; Scandia body. Sample labels also mention Nexa; provided font folder contains NexaBold/NexaLight only. CSS therefore requests Facundo/Scandia locally and explicitly falls back to Arial. Exact typography remains pending; no replacement font is presented as a confirmed brand typeface.

## Unit display

Default: both metric and imperial (US customary). All calculations remain in SI. Display conversion factors are exact: 25.4 mm/in; 0.45359237 kg/lb; 3.785411784 L/US gal. Inch/pound/gallon displays are rounded and do not establish alternate fabrication dimensions. M6 thread designations remain metric.

## v0.3 assembly and logo sources

- Drawing 0001, V03, sheets 1–4: directly read the top-level BOM (30 rows) and equipment XY centres; visually reviewed sheets 1–2. The official mechanical drawing’s single motor, 12 V battery and 100 Ah configuration is shown without resolving prior electrical/reference conflicts.
- Drawing 0007: GPS/IMU enclosure (100 × 100 × 75 mm), post, pad, gland and screws.
- Drawings 0012–0013: four corner camera posts, all-weather Raspberry Pi camera housings, pads, covers, glands, U-bolts and forward flooding plates.
- Drawing 0020: control enclosure 240 × 160 × 120 mm, pad and gland schedule.
- Drawing 0022: Insta360 X4/case, all-round lamp, two CM-IR130-850 illuminators, AN GSM 046 MIMO Wi-Fi/LTE antenna, mount, post and hardware.
- Drawing 0032: ultrasonic bent mount; three sensors are listed in drawing 0001.
- Drawing 0033: six flexible conduit runs; total nominal length 3,680 mm. Display routes are schematic.
- Official branding PNG-01.png and SVG 1-01.svg were retrieved from the HDES final-logo assets. Original bytes are preserved as hdes-logo.png and hdes-logo.svg. The PNG is displayed; the vector is included for future use.
- assembly-reference.png is a direct raster render of drawing 0001, sheet 1; no AI reconstruction was used.

Coordinate conversion: display x=(drawing X−750)/1000, y=(drawing Y−400)/1000 metres. Equipment heights, battery envelope, accessory envelopes, mount offsets, fine motor geometry and conduit routes are illustrative. Small hardware is grouped rather than individually reproduced. The control enclosure does not establish an internal board layout.

No quantities or individual component masses are automatically added to the flotation model: it still uses the source CAD total or bare-hull mass plus the user’s added mass. Visibility changes never change the calculation base.
