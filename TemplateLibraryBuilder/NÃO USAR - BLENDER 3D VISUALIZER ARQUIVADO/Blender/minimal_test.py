import bpy
import sys
import os

print("🔧 CRIANDO TEMPLATE MÍNIMO")

# Limpar cena padrão
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Adicionar cubo simples
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))

# Adicionar luz
bpy.ops.object.light_add(type='SUN', location=(4, 4, 10))

# Adicionar câmera
bpy.ops.object.camera_add(location=(7, -7, 5))
camera = bpy.context.object
camera.rotation_euler = (1.1, 0, 0.785)

# Configurar render
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'  # Usar engine mais estável
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.image_settings.file_format = 'PNG'

# Output path
argv = sys.argv
output_path = argv[argv.index("--")+1] if "--" in argv else "minimal_test.png"
scene.render.filepath = output_path

print(f"📁 Output: {output_path}")
print("🎬 Renderizando...")

# Renderizar
bpy.ops.render.render(write_file=True)

if os.path.exists(output_path):
    print(f"✅ Sucesso: {os.path.getsize(output_path)} bytes")
else:
    print("❌ Falhou")
    sys.exit(1)
