"""
Script minimalista para teste - Zentraw V1.4.0.a.3
Apenas testa se consegue executar no Blender
"""

import bpy
import sys
import os

print("🚀 TESTE BÁSICO - Script executando no Blender")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python executable: {sys.executable}")
print(f"📋 Command line args: {sys.argv}")

# Verificar argumentos
argv = sys.argv
if "--" in argv:
    try:
        audio = argv[argv.index("--") + 1]
        image = argv[argv.index("--") + 2] 
        output = argv[argv.index("--") + 3]
        
        print(f"🎵 Audio: {audio}")
        print(f"🖼️ Image: {image}")  
        print(f"📁 Output: {output}")
        
        # Verificar se arquivos existem
        print(f"📋 Audio exists: {os.path.exists(audio)}")
        print(f"📋 Image exists: {os.path.exists(image)}")
        
    except IndexError:
        print("❌ Argumentos insuficientes")
        sys.exit(1)
else:
    print("❌ Argumentos não encontrados")
    sys.exit(1)

print("✅ TESTE BÁSICO CONCLUÍDO COM SUCESSO!")
print("🏁 Script finalizado - exit code 0")
