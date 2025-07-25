import bpy
import sys
import os

print("🔧 DIAGNÓSTICO BLENDER")
print("=" * 50)

try:
    print("📋 Informações do sistema:")
    print(f"   - Blender version: {bpy.app.version}")
    print(f"   - Python version: {sys.version}")
    print(f"   - Working directory: {os.getcwd()}")
    
    print("\n🎭 Configurações de render:")
    scene = bpy.context.scene
    print(f"   - Engine: {scene.render.engine}")
    print(f"   - Resolution: {scene.render.resolution_x}x{scene.render.resolution_y}")
    
    # Capturar argumentos
    argv = sys.argv
    if "--" in argv:
        output_path = argv[argv.index("--")+1]
    else:
        output_path = "diagnostic_test.png"
    
    print(f"\n📁 Output path: {output_path}")
    
    # Configurar output
    scene.render.filepath = output_path
    scene.render.image_settings.file_format = 'PNG'
    
    print("\n🎬 Tentando renderizar...")
    
    # Renderizar
    result = bpy.ops.render.render(write_file=True)
    print(f"   - Render result: {result}")
    
    # Verificar se arquivo foi criado
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        print(f"✅ Sucesso! Arquivo criado: {size} bytes")
    else:
        print("❌ Arquivo não foi criado")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("🎉 Diagnóstico concluído!")
