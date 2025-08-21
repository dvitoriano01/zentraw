"""
Zentraw 3D Visualizer V1.4.0.a.4
Script para criar template básico do Blender
"""

import bpy
import os

def create_basic_scene():
    # Limpar cena atual
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    
    # Adicionar cubo (para animação de escala)
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 1))
    cube = bpy.context.active_object
    cube.name = "Cube"
    
    # Adicionar plano (para textura da capa)
    bpy.ops.mesh.primitive_plane_add(location=(0, -3, 0), rotation=(1.5708, 0, 0), scale=(2, 2, 2))
    plane = bpy.context.active_object
    plane.name = "Plane"
    
    # Criar material para o plano
    material = bpy.data.materials.new(name="PlaneMaterial")
    material.use_nodes = True
    plane.data.materials.append(material)
    
    # Configurar nodes do material
    nodes = material.node_tree.nodes
    nodes.clear()
    
    # Output node
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (300, 0)
    
    # BSDF node
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    
    # Image Texture node
    img_texture = nodes.new(type='ShaderNodeTexImage')
    img_texture.location = (-300, 0)
    img_texture.name = "Image Texture"
    
    # Links
    links = material.node_tree.links
    links.new(img_texture.outputs['Color'], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Adicionar câmera
    bpy.ops.object.camera_add(location=(7, -7, 5))
    camera = bpy.context.active_object
    camera.rotation_euler = (1.1, 0, 0.785)
    
    # Adicionar luz
    bpy.ops.object.light_add(type='SUN', location=(5, 5, 10))
    light = bpy.context.active_object
    light.data.energy = 3.0
    
    # Configurar render
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920
    scene.render.fps = 30
    
    # Configurar output para MP4
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'HIGH'
    
    print("✅ Template básico criado com sucesso!")
    print("📁 Objetos: Cube, Plane, Camera, Light")
    print("🎨 Material configurado para textura de imagem")
    print("⚙️ Render configurado para MP4 1080x1920 30fps")

if __name__ == "__main__":
    create_basic_scene()
    
    # Salvar template
    template_path = bpy.path.abspath("//template.blend")
    if not template_path.endswith("template.blend"):
        template_path = os.path.join(os.path.dirname(bpy.data.filepath), "template.blend")
    
    bpy.ops.wm.save_as_mainfile(filepath=template_path)
    print(f"💾 Template salvo em: {template_path}")
