"""Bob 1 / Issue #10 — educational ideal-cylinder flotation animation.

Requires Manim Community (and its rendering prerequisites).
Run: manim -pql bob1_flotation.py Bob1Flotation
This clip illustrates a documented **assumed** four-cylinder freshwater model,
not actual drum outer geometry, righting stability or safe payload.
The expected reference cases are from the 12 Sep 2026 preliminary estimate.
"""
from manim import *
from math import acos, sqrt, pi

R = .180
VOLUME = .060
LENGTH = VOLUME / (pi * R * R)
DENSITY = 1000.0
N_DRUMS = 4
CASES = [(49.28,93),(80.40,133),(100.40,157),(120.40,180),(160.40,228)]

def supported_mass(draft):
    d = max(0.0, min(2 * R, draft))
    q = sqrt(max(0.0, 2 * R * d - d * d))
    area = R * R * acos(max(-1.0, min(1.0, (R-d)/R))) - (R-d)*q
    return DENSITY * N_DRUMS * LENGTH * area

def solve_draft(mass):
    if not 0 <= mass <= DENSITY * N_DRUMS * VOLUME:
        raise ValueError("Outside ideal-cylinder buoyancy calculation")
    lo, hi = 0.0, 2*R
    for _ in range(70):
        mid = (lo + hi)/2
        if supported_mass(mid) < mass:
            lo=mid
        else:
            hi=mid
    return (lo+hi)/2

# Check numerical parity with the repository's rounded historical report cases.
for m, rounded_mm in CASES:
    actual_mm = solve_draft(m)*1000
    assert abs(actual_mm - rounded_mm) < 1.0, (m,actual_mm,rounded_mm)

class Bob1Flotation(Scene):
    def construct(self):
        self.camera.background_color="#2E2E2E"
        title=Text("BOB 1 | Ideal-cylinder flotation",font_size=34,color="#FF6600").to_edge(UP)
        subtitle=Text("4 × nominal 60 L drums | freshwater | conceptual cross-section",font_size=21).next_to(title,DOWN)
        self.add(title,subtitle)
        label=Text("MODEL ASSUMPTION — NOT A PAYLOAD RATING",font_size=18,color=YELLOW).to_edge(DOWN)
        self.add(label)

        # Cross-sectional display only: one ideal cylinder stands for four in the formula.
        center=LEFT*2.0+DOWN*.1
        radius=1.30
        circle=Circle(radius=radius,color=WHITE,stroke_width=3).move_to(center)
        water=Line(LEFT*4.0,RIGHT*.1,color=BLUE,stroke_width=3)
        self.play(Create(circle),FadeIn(water),run_time=1.2)
        mass_label=Text("",font_size=25)
        mass_label.move_to(RIGHT*2+UP*.7)
        draft_label=Text("",font_size=25)
        draft_label.move_to(RIGHT*2+DOWN*.2)
        self.add(mass_label,draft_label)
        for mass,_ in CASES:
            depth=solve_draft(mass)
            y=center[1]-radius+(depth/(2*R))*2*radius
            new_water=Line(LEFT*4,RIGHT*.1,color=BLUE,stroke_width=3).shift(UP*y)
            self.play(
                Transform(water,new_water),
                Transform(mass_label,Text("Total mass: %.2f kg"%mass,font_size=25).move_to(RIGHT*2+UP*.7)),
                Transform(draft_label,Text("Ideal draft: %.0f mm"%(depth*1000),font_size=25).move_to(RIGHT*2+DOWN*.2)),
                run_time=.9
            )
            self.wait(.25)
        footer=Text("Assumed: perfect cylinders, level loading, 1,000 kg/m³ water",font_size=17,color=LIGHT_GRAY)
        footer.next_to(label,UP)
        self.play(FadeIn(footer));self.wait(1)
