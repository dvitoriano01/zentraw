#!/usr/bin/env python3
"""
Script mínimo para testar render do template original
"""
import bpy
import sys
import os

print("🎯 SCRIPT MÍNIMO - Iniciando...")

# Configurar engine
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'

# Configurar resolução baixa para teste
bpy.context.scene.render.resolution_x = 960
bpy.context.scene.render.resolution_y = 540
bpy.context.scene.render.resolution_percentage = 100

# Configurar output
output_path = sys.argv[-1] if len(sys.argv) > 1 else 'minimal_test.png'
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'PNG'

print(f"📋 Objetos na cena:")
for obj in bpy.data.objects:
    print(f"   - {obj.name} ({obj.type})")

print(f"📷 Câmera: {bpy.context.scene.camera}")
print(f"🎬 Renderizando para: {output_path}")

# Render
bpy.ops.render.render(write_still=True)

if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"✅ Arquivo criado: {output_path} ({size} bytes)")
else:
    print(f"❌ Erro: Arquivo não criado")
    sys.exit(1)
