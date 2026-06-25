import bpy
import bmesh
import math

def clear_scene():
    """Clears default objects from the scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_material(name, diffuse_color, roughness=0.4):
    """Creates a simple stylized material."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    principled = nodes.get("Principled BSDF")
    if principled:
        principled.inputs['Base Color'].default_value = diffuse_color
        principled.inputs['Roughness'].default_value = roughness
    # Viewport/workbench display color (workbench reads this, not the node graph).
    mat.diffuse_color = diffuse_color
    mat.roughness = roughness
    return mat

def create_lyra_base():
    """Generates the low-poly base mesh proportions for Lyra (4-head chibi)."""
    # Head (Oversized, blocky/stylized)
    bpy.ops.mesh.primitive_cube_add(size=1.8, location=(0, 0, 5.5))
    head = bpy.context.active_object
    head.name = "Lyra_Head"

    # Torso (Compact, athletic)
    bpy.ops.mesh.primitive_cube_add(size=1.2, location=(0, 0, 3.8))
    torso = bpy.context.active_object
    torso.name = "Lyra_Torso"
    torso.scale = (1.1, 0.8, 1.3)
    bpy.ops.object.transform_apply(scale=True)

    # Oversized Boots/Legs (Combined low-poly approximation)
    for side, x_pos in [("L", -0.6), ("R", 0.6)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.4, depth=1.8, location=(x_pos, 0, 1.8))
        leg = bpy.context.active_object
        leg.name = f"Lyra_Leg_{side}"

        # Chunky Boot Base
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, 0.3, 0.5))
        boot = bpy.context.active_object
        boot.name = f"Lyra_Boot_{side}"
        boot.scale = (0.9, 1.4, 0.7)
        bpy.ops.object.transform_apply(scale=True)

    # Oversized Gloves/Arms
    for side, x_pos in [("L", -1.1), ("R", 1.1)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=1.4, location=(x_pos, 0, 3.8))
        arm = bpy.context.active_object
        arm.name = f"Lyra_Arm_{side}"
        arm.rotation_euler[1] = math.radians(15 if side == "R" else -15)

        # Chunky Glove/Guanlet
        bpy.ops.mesh.primitive_cube_add(size=0.8, location=(x_pos * 1.2, 0, 3.2))
        glove = bpy.context.active_object
        glove.name = f"Lyra_Glove_{side}"

def create_stylized_sword():
    """Generates the oversized shard crystal sword."""
    # Blade (Low-poly crystal shard shape)
    mesh = bpy.data.meshes.new("Crystal_Blade")
    obj = bpy.data.objects.new("Lyra_Shard_Sword", mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    # Closed, manifold low-poly crystal: bottom point, a 4-vert mid ring, and a tip.
    bottom = bm.verts.new((0, 0, 0))
    tip = bm.verts.new((0, 0, 3.5))
    ring = [
        bm.verts.new((0.5, 0.0, 0.7)),
        bm.verts.new((0.0, 0.4, 0.7)),
        bm.verts.new((-0.5, 0.0, 0.7)),
        bm.verts.new((0.0, -0.4, 0.7)),
    ]
    for index in range(4):
        current = ring[index]
        following = ring[(index + 1) % 4]
        bm.faces.new((bottom, following, current))  # lower facet
        bm.faces.new((current, following, tip))     # upper facet

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()

    # Seat the grip inside the right glove (glove sits at x≈1.32, z≈3.2).
    obj.location = (1.32, -0.1, 3.25)
    obj.scale = (1.1, 1.0, 1.2)
    obj.rotation_euler[0] = math.radians(-10)

def set_origin_to_point(obj, point):
    """Move an object's origin (pivot) to a world point without moving the mesh."""
    bpy.context.scene.cursor.location = point
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')


def set_limb_pivots():
    """Place leg/arm pivots at the hip/shoulder so rotation swings from the joint."""
    leg_joints = {"Lyra_Leg_L": (-0.6, 0, 2.7), "Lyra_Leg_R": (0.6, 0, 2.7)}
    arm_joints = {"Lyra_Arm_L": (-1.1, 0, 4.5), "Lyra_Arm_R": (1.1, 0, 4.5)}
    for name, point in {**leg_joints, **arm_joints}.items():
        obj = bpy.data.objects.get(name)
        if obj:
            set_origin_to_point(obj, point)
    bpy.context.scene.cursor.location = (0, 0, 0)


def setup_materials():
    """Assigns the blocky color palette material zones."""
    m_teal = create_material("Teal_Armor", (0.05, 0.5, 0.5, 1.0))
    m_orange = create_material("Orange_Accent", (0.9, 0.35, 0.05, 1.0))
    m_gold = create_material("Gold_Trim", (0.8, 0.55, 0.1, 1.0))
    m_crystal = create_material("Cyan_Crystal", (0.2, 0.8, 0.8, 1.0), roughness=0.1)

    # Color assignment by object names. Every mesh gets exactly one zone.
    for obj in bpy.data.objects:
        if obj.type != 'MESH':
            continue
        if "Torso" in obj.name or "Leg" in obj.name or "Arm" in obj.name:
            obj.data.materials.append(m_teal)
        elif "Boot" in obj.name or "Glove" in obj.name:
            obj.data.materials.append(m_orange)
        elif "Head" in obj.name:
            obj.data.materials.append(m_gold)
        elif "Sword" in obj.name:
            obj.data.materials.append(m_crystal)

# Execution
clear_scene()
create_lyra_base()
create_stylized_sword()
set_limb_pivots()
setup_materials()
