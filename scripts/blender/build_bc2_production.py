"""Build the first rigged character delivery from the BC2 concept blockout.

Run with Blender in background mode after opening the latest BC2 workfile:
  blender --background 3D_Build/BC2/bc2_v010_head_body_tune.blend --python scripts/blender/build_bc2_production.py

The source workfile is never overwritten.  This produces a separately versioned
Blend file and a web-ready GLB with named animation clips.
"""

from pathlib import Path
import bpy
from mathutils import Vector
from math import radians

ROOT = Path(__file__).resolve().parents[2]
OUT_BLEND = ROOT / "3D_Build" / "BC2" / "bc2_rigged_v011.blend"
OUT_GLB = ROOT / "public" / "assets" / "models" / "BC2" / "BC2_rigged.glb"


def material(name, color, metallic=0.0, roughness=0.55):
    value = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1.0)
    value.use_nodes = True
    p = next((node for node in value.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if p is None:
        p = value.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (*color, 1.0)
    p.inputs["Metallic"].default_value = metallic
    p.inputs["Roughness"].default_value = roughness
    return value


SKIN = material("BC2_Skin", (0.29, 0.12, 0.065), 0.0, 0.62)
GREEN = material("BC2_Expedition_Green", (0.075, 0.15, 0.10), 0.0, 0.78)
GOLD = material("BC2_Brass", (0.38, 0.22, 0.055), 0.78, 0.32)
LEATHER = material("BC2_Leather", (0.115, 0.05, 0.025), 0.0, 0.68)
HAIR = material("BC2_Hair", (0.012, 0.009, 0.007), 0.0, 0.48)
WHITE = material("BC2_Shirt", (0.72, 0.67, 0.55), 0.0, 0.78)
EYE = material("BC2_Eye", (0.035, 0.02, 0.008), 0.0, 0.3)


def primitive(kind, name, location, scale, mat, parent_bone=None, rotation=None):
    if kind == "cube":
        bpy.ops.mesh.primitive_cube_add(location=location)
    elif kind == "uv":
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, location=location)
    elif kind == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, location=location)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(vertices=20, location=location)
    else:
        raise ValueError(kind)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if rotation:
        obj.rotation_euler = rotation
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    if parent_bone:
        obj.parent = RIG
        obj.parent_type = "BONE"
        obj.parent_bone = parent_bone
        obj.matrix_parent_inverse = RIG.matrix_world.inverted()
    return obj


def make_rig():
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    rig = bpy.context.object
    rig.name = "BC2_Mira_Rig"
    rig.data.name = "BC2_Mira_Skeleton"
    first = rig.data.edit_bones[0]
    first.name = "root"
    first.head, first.tail = (0, 0, 0), (0, 0, 0.25)
    bones = {
        "pelvis": ((0, 0, 0.25), (0, 0, 0.63), "root"),
        "spine": ((0, 0, 0.63), (0, 0, 1.0), "pelvis"),
        "chest": ((0, 0, 1.0), (0, 0, 1.31), "spine"),
        "neck": ((0, 0, 1.31), (0, 0, 1.44), "chest"),
        "head": ((0, 0, 1.44), (0, 0, 1.71), "neck"),
        "upper_arm.L": ((-0.17, 0, 1.24), (-0.47, 0, 1.02), "chest"),
        "forearm.L": ((-0.47, 0, 1.02), (-0.61, 0, 0.77), "upper_arm.L"),
        "hand.L": ((-0.61, 0, 0.77), (-0.65, 0, 0.62), "forearm.L"),
        "upper_arm.R": ((0.17, 0, 1.24), (0.47, 0, 1.02), "chest"),
        "forearm.R": ((0.47, 0, 1.02), (0.61, 0, 0.77), "upper_arm.R"),
        "hand.R": ((0.61, 0, 0.77), (0.65, 0, 0.62), "forearm.R"),
        "thigh.L": ((-0.13, 0, 0.45), (-0.16, 0, -0.1), "pelvis"),
        "shin.L": ((-0.16, 0, -0.1), (-0.16, 0, -0.62), "thigh.L"),
        "foot.L": ((-0.16, 0, -0.62), (-0.16, 0.2, -0.68), "shin.L"),
        "thigh.R": ((0.13, 0, 0.45), (0.16, 0, -0.1), "pelvis"),
        "shin.R": ((0.16, 0, -0.1), (0.16, 0, -0.62), "thigh.R"),
        "foot.R": ((0.16, 0, -0.62), (0.16, 0.2, -0.68), "shin.R"),
    }
    made = {"root": first}
    for name, (head, tail, parent) in bones.items():
        bone = rig.data.edit_bones.new(name)
        bone.head, bone.tail, bone.parent = head, tail, made[parent]
        made[name] = bone
    bpy.ops.object.mode_set(mode="POSE")
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
    bpy.ops.object.mode_set(mode="OBJECT")
    return rig


def attach_source_meshes():
    keep = {"BC2_Body_Base", "BC2_Head_Base", "BC2_Eye_L", "BC2_Eye_R"}
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        obj.hide_render = obj.name not in keep
        obj.hide_viewport = obj.name not in keep
        if obj.name == "BC2_Body_Base":
            obj.data.materials.clear(); obj.data.materials.append(SKIN)
            obj.parent = RIG
        elif obj.name == "BC2_Head_Base":
            obj.data.materials.clear(); obj.data.materials.append(SKIN)
            obj.parent = RIG; obj.parent_type = "BONE"; obj.parent_bone = "head"
        elif obj.name.startswith("BC2_Eye"):
            obj.data.materials.clear(); obj.data.materials.append(EYE)
            obj.parent = RIG; obj.parent_type = "BONE"; obj.parent_bone = "head"


def build_outfit():
    # Layered, separately animated production components based on the supplied sheet.
    primitive("cube", "BC2_Tunic", (0, 0, 0.9), (0.34, 0.14, 0.56), GREEN, "spine")
    primitive("cube", "BC2_Shirt", (0, -0.145, 1.0), (0.22, 0.028, 0.34), WHITE, "chest")
    primitive("cube", "BC2_Scarf", (0, -0.06, 1.31), (0.39, 0.17, 0.09), GOLD, "chest")
    primitive("cube", "BC2_Backpack", (0, 0.22, 0.91), (0.35, 0.15, 0.27), LEATHER, "spine")
    primitive("cube", "BC2_BagFlap", (0, 0.385, 0.99), (0.28, 0.025, 0.12), LEATHER, "spine")
    primitive("cylinder", "BC2_Bedroll", (0, 0.4, 1.18), (0.15, 0.15, 0.38), GREEN, "spine", (radians(90), 0, 0))
    for side in (-1, 1):
        primitive("cylinder", f"BC2_Boot_{side}", (side * 0.16, 0, -0.37), (0.13, 0.13, 0.38), LEATHER, "shin.L" if side < 0 else "shin.R")
        primitive("cylinder", f"BC2_Sleeve_{side}", (side * 0.39, 0, 1.06), (0.14, 0.14, 0.34), GREEN, "upper_arm.L" if side < 0 else "upper_arm.R", (0, radians(55 * side), 0))
        primitive("uv", f"BC2_Shoulder_{side}", (side * 0.29, 0, 1.25), (0.19, 0.14, 0.14), GREEN, "chest")
    # braid, lantern shaft and brass lantern are independent bones/components for future polish.
    primitive("cylinder", "BC2_Braid", (-0.16, 0.13, 1.2), (0.045, 0.045, 0.43), HAIR, "head", (radians(25), 0, 0))
    primitive("cylinder", "BC2_LanternStaff", (-0.63, 0, 0.48), (0.025, 0.025, 0.92), GOLD, "hand.L")
    lantern = primitive("uv", "BC2_Lantern", (-0.63, 0, 1.26), (0.13, 0.13, 0.18), GOLD, "hand.L")
    lantern.data.materials.clear(); lantern.data.materials.append(material("BC2_LanternGlow", (0.95, 0.46, 0.05), 0.0, 0.25))


def make_animation(name, keys):
    action = bpy.data.actions.new(name)
    RIG.animation_data_create(); RIG.animation_data.action = action
    for frame, values in keys:
        for bone_name, rotation in values.items():
            bone = RIG.pose.bones[bone_name]
            bone.rotation_euler = rotation
            bone.keyframe_insert("rotation_euler", frame=frame)
    return action


RIG = make_rig()
attach_source_meshes()
build_outfit()
make_animation("Idle", [(1, {"chest": (radians(-1), 0, 0), "head": (radians(1), 0, radians(-1))}), (30, {"chest": (radians(1), 0, 0), "head": (radians(-1), 0, radians(1))}), (60, {"chest": (radians(-1), 0, 0), "head": (radians(1), 0, radians(-1))})])
make_animation("Attack", [(1, {"upper_arm.L": (radians(8), 0, radians(8))}), (12, {"upper_arm.L": (radians(-58), 0, radians(22)), "chest": (0, radians(-10), 0)}), (28, {"upper_arm.L": (radians(8), 0, radians(8)), "chest": (0, 0, 0)})])
make_animation("Hit", [(1, {"chest": (0, 0, 0)}), (7, {"chest": (radians(12), 0, radians(-8)), "head": (radians(8), 0, 0)}), (20, {"chest": (0, 0, 0), "head": (0, 0, 0)})])
make_animation("Death", [(1, {"root": (0, 0, 0)}), (32, {"root": (0, radians(82), radians(18))})])

OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
# Export only the current delivery meshes and rig. Reference geometry and previous
# revision meshes remain in the .blend for artists but must never ship in the GLB.
bpy.ops.object.select_all(action="DESELECT")
for obj in bpy.context.scene.objects:
    if obj == RIG or (obj.name.startswith("BC2_") and "_PRE_" not in obj.name and "Guide" not in obj.name):
        obj.select_set(True)
bpy.context.view_layer.objects.active = RIG
bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
bpy.ops.export_scene.gltf(filepath=str(OUT_GLB), export_format="GLB", export_animations=True, export_materials="EXPORT", export_yup=True, use_selection=True)
print(f"Wrote {OUT_BLEND}")
print(f"Wrote {OUT_GLB}")
