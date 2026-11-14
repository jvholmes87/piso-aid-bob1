"""Bob 1 illustration-only Blender asset pilot; run: blender -b -P bob1_schematic.py.
Uses provisional JSON values replicated from docs/water-lab/model/bob1-baseline.json.
Does NOT import validated CAD or certify dimensional fidelity. Blender required.
Exports an illustrative GLB to this script's directory, never production docs.
"""
import bpy
import math
from pathlib import Path
from mathutils import Vector

OUT = Path(__file__).resolve().parent
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, rgba):
    m=bpy.data.materials.new(name);m.diffuse_color=rgba
    return m

drum=material("Provisional drums",(.10,.20,.25,1))
frame=material("Schematic frame",(.39,.46,.48,1))
deckmat=material("Schematic deck",(.54,.34,.20,1))
orange=material("HDES orange", (1,.4,0,1))

def cube(name, loc, size, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o=bpy.context.object;o.name=name;o.dimensions=size
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(mat)
    return o

# Blender axes: X longitudinal, Y lateral, Z vertical.
radius=.180
length=.06/(math.pi*radius**2)
for xi in (-.39,.39):
    for yi in (-.24,.24):
        bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=radius,depth=length,location=(xi,yi,radius),rotation=(0,math.pi/2,0))
        bpy.context.object.name="ASSUMED ideal-cylinder drum"
        bpy.context.object.data.materials.append(drum)

deck_bottom=.505  # ASSUMED visual stack-up, not confirmed fabrication elevation.
for yi in (-.38,.38):
    cube("Illustrative longitudinal rail", (0,yi,deck_bottom-.01),(1.5,.02,.02),frame)
for xi in (-.74,-.39,0,.39,.74):
    cube("Illustrative cross rail", (xi,0,deck_bottom-.01),(.02,.78,.02),frame)
cube("Documented deck footprint; assumed elevation", (0,0,deck_bottom+.0045),(1.5,.8,.009),deckmat)
cube("Illustrative transom",(.74,0,deck_bottom-.06),(.04,.8,.12),frame)
cube("Illustrative equipment enclosure",(.30,0,deck_bottom+.07),(.24,.16,.12),orange)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(OUT/"bob1-illustrative-pilot.glb"), export_format='GLB', use_selection=True)
print("EXPORT: illustrative GLB only — must not be represented as native CAD or an as-built.")
