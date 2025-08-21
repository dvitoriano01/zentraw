"""
Script para criar template.blend com estrutura correta
Zentraw V1.4.0.a.3 - Template Creator
"""

import bpy

# 1. Limpar cena atual
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# 2. Criar objetos básicos
# Cube (para animação de áudio)
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 1))
cube = bpy.context.active_object
cube.name = "Cube"

# Plane (para textura da capa)
bpy.ops.mesh.primitive_plane_add(location=(0, 0, 0), scale=(3, 3, 1))
plane = bpy.context.active_object  
plane.name = "Plane"

# 3. Criar material para o Plane
mat = bpy.data.materials.new(name="PlaneMaterial")
mat.use_nodes = True
plane.data.materials.append(mat)

# 4. Configurar nodes do material
nodes = mat.node_tree.nodes
nodes.clear()

# Output node
output_node = nodes.new(type='ShaderNodeOutputMaterial')
output_node.location = (0, 0)

# BSDF node  
bsdf_node = nodes.new(type='ShaderNodeBsdfPrincipled')
bsdf_node.location = (-300, 0)

# Image Texture node
tex_node = nodes.new(type='ShaderNodeTexImage')
tex_node.location = (-600, 0)
tex_node.name = "Image Texture"

# Conectar nodes
links = mat.node_tree.links
links.new(tex_node.outputs[0], bsdf_node.inputs[0])
links.new(bsdf_node.outputs[0], output_node.inputs[0])

# 5. Configurar câmera
bpy.ops.object.camera_add(location=(5, -5, 5))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0.785)

# 6. Configurar luz
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
light = bpy.context.active_object
light.data.energy = 3.0

# 7. Configurar render engine
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920

print("✅ Template criado com sucesso!")
print("📦 Objetos: Cube, Plane, Camera, Light")
print("🎨 Material com Image Texture configurado")
print("🎬 Render engine: EEVEE_NEXT")

# 8. Salvar template
bpy.ops.wm.save_as_mainfile(filepath="template.blend")
print("💾 Template salvo como template.blend")
