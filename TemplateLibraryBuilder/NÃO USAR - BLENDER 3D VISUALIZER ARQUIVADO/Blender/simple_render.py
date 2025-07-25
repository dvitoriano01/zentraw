#!/usr/bin/env python3
"""
Script simplificado para teste de render básico
"""
import bpy
import sys
import os

print("🎯 TESTE BÁSICO - Iniciando render simples")

# Configurar engine de render
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
print("⚡ Using Eevee Next engine")

# Configurar resolução
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080
bpy.context.scene.render.resolution_percentage = 50  # 50% para teste rápido

# Configurar output
output_path = sys.argv[-1] if len(sys.argv) > 1 else 'test_output.png'
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'PNG'

# Certificar que tem objetos na cena
print(f"📦 Objetos na cena: {len(bpy.data.objects)}")
for obj in bpy.data.objects:
    print(f"   - {obj.name} ({obj.type})")

# Render simples
print("🎬 Iniciando render...")
bpy.ops.render.render(write_still=True)
print("✅ Render concluído!")

# Verificar se arquivo foi criado
if os.path.exists(output_path):
    print(f"✅ Arquivo criado: {output_path}")
    print(f"📏 Tamanho: {os.path.getsize(output_path)} bytes")
else:
    print(f"❌ Arquivo não foi criado: {output_path}")
    sys.exit(1)
