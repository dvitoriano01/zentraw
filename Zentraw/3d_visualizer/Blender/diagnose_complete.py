"""
Zentraw V1.4.0.a.3 - Diagnóstico Completo de Dependências
Criado para verificar tudo que é necessário para execução do render
"""

import sys
import os

print("🔍 DIAGNÓSTICO COMPLETO - ZENTRAW V1.4.0.a.3")
print("=" * 50)

# 1. Verificar Python e versão
print(f"🐍 Python: {sys.version}")
print(f"📂 Working directory: {os.getcwd()}")

# 2. Verificar dependências Python
dependencies = ['numpy', 'wave', 'bpy']
for dep in dependencies:
    try:
        if dep == 'numpy':
            import numpy as np
            print(f"✅ {dep}: v{np.__version__}")
        elif dep == 'wave':
            import wave
            print(f"✅ {dep}: Built-in module OK")
        elif dep == 'bpy':
            import bpy
            print(f"✅ {dep}: Blender Python API OK")
    except ImportError as e:
        print(f"❌ {dep}: NOT AVAILABLE - {e}")

# 3. Verificar arquivos essenciais
essential_files = [
    'template.blend',
    'render_audio_visualizer.py',
    'sample_audio2.wav',
    'sample_cover.jpg'
]

for file_name in essential_files:
    if os.path.exists(file_name):
        size = os.path.getsize(file_name)
        print(f"✅ {file_name}: {size} bytes")
    else:
        print(f"❌ {file_name}: NOT FOUND")

# 4. Verificar estrutura do template.blend (se existir)
if os.path.exists('template.blend'):
    print("\n🔍 Verificando template.blend:")
    try:
        import bpy
        bpy.ops.wm.open_mainfile(filepath='template.blend')
        
        # Verificar objetos necessários
        required_objects = ['Cube', 'Plane', 'Camera', 'Light']
        for obj_name in required_objects:
            if obj_name in bpy.data.objects:
                print(f"✅ Objeto {obj_name}: OK")
            else:
                print(f"❌ Objeto {obj_name}: NOT FOUND")
                
        # Verificar materiais
        if len(bpy.data.materials) > 0:
            print(f"✅ Materiais: {len(bpy.data.materials)} encontrados")
        else:
            print(f"❌ Materiais: Nenhum material encontrado")
            
    except Exception as e:
        print(f"❌ Erro ao analisar template.blend: {e}")

print("\n" + "=" * 50)
print("🏁 DIAGNÓSTICO COMPLETO")
