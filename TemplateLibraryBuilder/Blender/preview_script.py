#!/usr/bin/env python3
"""
Script para preview baseado no render_audio_visualizer.py original
"""
import bpy
import sys
import os
import wave
import numpy as np

print("🎯 PREVIEW SCRIPT - Baseado no script original")

# Capturar argumentos
argv = sys.argv
output_path = argv[argv.index("--")+1] if "--" in argv else "preview.png"

print(f"📁 Output path: {output_path}")

# Configurar render engine
bpy.context.scene.render.engine = 'BLENDER_EEVEE'  # Usar engine estável em vez de EEVEE_NEXT
print("⚡ Using Eevee Next engine")

# Configurar resolução para preview
bpy.context.scene.render.resolution_x = 1080
bpy.context.scene.render.resolution_y = 1920
bpy.context.scene.render.resolution_percentage = 50  # 50% para preview

# Configurar output
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'PNG'

print("📋 Objetos disponíveis na cena:")
for obj in bpy.data.objects:
    print(f"   - {obj.name} ({obj.type})")

# Verificar se objetos essenciais existem
cube = bpy.data.objects.get("Cube")
plane = bpy.data.objects.get("Plane")

if cube:
    print(f"📦 Cube encontrado: {cube.name}")
    # Simular escala do cubo para preview
    cube.scale[2] = 1.5  # Escala Z aumentada
    print(f"📦 Cube escala Z definida para: {cube.scale[2]}")
else:
    print("⚠️ Cube não encontrado na cena")

if plane:
    print(f"🎭 Plane encontrado: {plane.name}")
    # Verificar material do plane
    if plane.active_material:
        print(f"🎨 Material ativo: {plane.active_material.name}")
    else:
        print("⚠️ Plane sem material ativo")
else:
    print("⚠️ Plane não encontrado na cena")

# Verificar câmera
camera = bpy.context.scene.camera
if camera:
    print(f"📷 Câmera: {camera.name}")
    print(f"📍 Posição: {camera.location}")
    print(f"🔄 Rotação: {camera.rotation_euler}")
else:
    print("⚠️ Nenhuma câmera ativa")

# Verificar luzes
lights = [obj for obj in bpy.data.objects if obj.type == 'LIGHT']
print(f"💡 Luzes encontradas: {len(lights)}")
for light in lights:
    print(f"   - {light.name} ({light.data.type})")

# Render
print("🎬 Iniciando render...")
bpy.ops.render.render(write_still=True)

# Verificar resultado
if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"✅ Preview gerado com sucesso: {output_path}")
    print(f"📏 Tamanho do arquivo: {size} bytes")
else:
    print(f"❌ Erro: Preview não foi gerado em {output_path}")
    sys.exit(1)

print("🎉 Preview script concluído!")
