import bpy
import sys
import os

print("🎯 TESTE SIMPLES - Verificando se Blender está funcionando")
print("📁 Current working directory:", os.getcwd())
print("📋 Python version:", sys.version)

# Tentar renderizar um frame simples
try:
    # Configurar render
    bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
    bpy.context.scene.render.resolution_x = 1920
    bpy.context.scene.render.resolution_y = 1080
    
    # Output path do argumento
    argv = sys.argv
    output_path = argv[argv.index("--")+1] if "--" in argv else "test_simple.png"
    print(f"📁 Output path: {output_path}")
    
    bpy.context.scene.render.filepath = output_path
    
    # Renderizar
    print("🎬 Iniciando render...")
    bpy.ops.render.render(write_file=True)
    print("✅ Render concluído!")
    
except Exception as e:
    print(f"❌ Erro durante render: {e}")
    sys.exit(1)

print("🎉 Script executado com sucesso!")
