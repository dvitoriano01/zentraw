#!/usr/bin/env python3
"""
Script para criar um template.blend básico e funcional
"""
import bpy
import bmesh
import mathutils
import os

# Limpar scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Criar cubo básico
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
cube = bpy.context.object
cube.name = "AudioVisualizerCube"

# Adicionar material básico
material = bpy.data.materials.new(name="AudioMaterial")
material.use_nodes = True
cube.data.materials.append(material)

# Configurar material com emission
nodes = material.node_tree.nodes
links = material.node_tree.links

# Limpar nodes existentes
for node in nodes:
    nodes.remove(node)

# Criar output node
output_node = nodes.new(type='ShaderNodeOutputMaterial')
output_node.location = (300, 0)

# Criar emission node
emission_node = nodes.new(type='ShaderNodeEmission')
emission_node.location = (100, 0)
emission_node.inputs['Color'].default_value = (0.2, 0.6, 1.0, 1.0)  # Azul
emission_node.inputs['Strength'].default_value = 2.0

# Conectar nodes
links.new(emission_node.outputs['Emission'], output_node.inputs['Surface'])

# Configurar câmera
bpy.ops.object.camera_add(location=(7, -7, 5))
camera = bpy.context.object
camera.name = "Camera"
camera.rotation_euler = (1.1, 0, 0.785)

# Configurar câmera como ativa
bpy.context.scene.camera = camera

# Adicionar luz
bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
light = bpy.context.object
light.name = "SunLight"
light.data.energy = 3.0

# Configurar render settings
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE_NEXT'
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Configurar viewport shading
for area in bpy.context.screen.areas:
    if area.type == 'VIEW_3D':
        for space in area.spaces:
            if space.type == 'VIEW_3D':
                space.shading.type = 'MATERIAL'

# Salvar template
template_path = os.path.join(os.path.dirname(__file__), 'template_basic.blend')
bpy.ops.wm.save_as_mainfile(filepath=template_path)

print(f"✅ Template básico criado em: {template_path}")
print("🎯 Template contém:")
print("   - Cubo com material emission azul")
print("   - Câmera posicionada")
print("   - Luz solar")
print("   - Configurações de render EEVEE")
