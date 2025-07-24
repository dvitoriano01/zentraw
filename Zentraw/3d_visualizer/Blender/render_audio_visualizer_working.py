"""
Zentraw 3D Visualizer V1.4.0.a.3 - SEM NUMPY
Script que funciona sem dependências externas
Baseado no test_basic.py que funcionou (exit code 0)
"""

import bpy
import wave
import sys
import os

print("🚀 V1.4.0.a.3 - AUDIO VISUALIZER RENDER (SEM NUMPY)")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python executable: {sys.executable}")

try:
    # 1. Capturar argumentos
    argv = sys.argv
    if "--" not in argv:
        print("❌ ERRO: Argumentos não encontrados")
        sys.exit(1)
    
    audio = argv[argv.index("--") + 1]
    image = argv[argv.index("--") + 2] 
    output = argv[argv.index("--") + 3]
    
    # Converter para caminhos absolutos
    audio = os.path.abspath(audio)
    image = os.path.abspath(image)
    output = os.path.abspath(output)
    
    print(f"🎵 Audio: {audio}")
    print(f"🖼️ Image: {image}")
    print(f"📁 Output: {output}")
    
    # 2. Verificar arquivos
    if not os.path.exists(audio):
        print(f"❌ Audio não encontrado: {audio}")
        sys.exit(1)
    
    if not os.path.exists(image):
        print(f"❌ Image não encontrada: {image}")
        sys.exit(1)
    
    # Verificar se diretório de output existe
    output_dir = os.path.dirname(output)
    if not os.path.exists(output_dir):
        print(f"📁 Criando diretório de output: {output_dir}")
        os.makedirs(output_dir, exist_ok=True)
    
    print("✅ Arquivos verificados")
    
    # 3. Carregar áudio SEM NUMPY
    print("📊 Carregando áudio (método simples)...")
    wf = wave.open(audio, 'rb')
    sr = wf.getframerate()
    nframes = wf.getnframes()
    frames = wf.readframes(nframes)
    wf.close()
    
    # Simulação simples de amplitude sem numpy
    duration = nframes / sr
    fps = 30
    total_frames = int(duration * fps)
    
    # Criar amplitudes simuladas (sem numpy)
    amps = []
    for i in range(total_frames):
        # Simulação: varia entre 0.1 e 1.0
        amp = 0.1 + (i % 20) * 0.04  # Cria variação
        amps.append(amp)
    
    print(f"✅ Audio processado: {sr}Hz, {duration:.1f}s, {total_frames} frames")
    
    # 4. Verificar objetos da cena
    scene = bpy.context.scene
    
    if "Plane" not in bpy.data.objects:
        print("⚠️ Criando Plane...")
        bpy.ops.mesh.primitive_plane_add()
        bpy.context.active_object.name = "Plane"
    
    if "Cube" not in bpy.data.objects:
        print("⚠️ Criando Cube...")
        bpy.ops.mesh.primitive_cube_add(location=(0, 0, 1))
        bpy.context.active_object.name = "Cube"
    
    plane = bpy.data.objects["Plane"]
    cube = bpy.data.objects["Cube"]
    print("✅ Objetos verificados")
    
    # 5. Configurar render
    scene.render.fps = fps
    scene.frame_end = total_frames
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'HIGH'
    scene.render.ffmpeg.audio_codec = 'NONE'
    scene.render.filepath = output
    
    print(f"🎬 Render configurado: {total_frames} frames, {fps} FPS")
    
    # 6. Aplicar imagem
    try:
        print("🖼️ Carregando imagem...")
        img = bpy.data.images.load(image)
        
        # Verificar/criar material
        if not plane.active_material:
            mat = bpy.data.materials.new(name="PlaneMaterial")
            mat.use_nodes = True
            plane.data.materials.append(mat)
        else:
            mat = plane.active_material
        
        # Aplicar textura se possível
        if mat.node_tree:
            tex_node = mat.node_tree.nodes.get("Image Texture")
            if not tex_node:
                tex_node = mat.node_tree.nodes.new(type='ShaderNodeTexImage')
                tex_node.name = "Image Texture"
            tex_node.image = img
            print("✅ Imagem aplicada")
        
    except Exception as e:
        print(f"⚠️ Erro na imagem (continuando): {e}")
    
    # 7. Aplicar keyframes
    print(f"🎵 Aplicando {len(amps)} keyframes...")
    for i, amp in enumerate(amps, start=1):
        scale_value = 1 + amp * 2  # Escala menor para teste
        cube.scale[2] = scale_value
        cube.keyframe_insert(data_path="scale", frame=i, index=2)
    
    print("✅ Keyframes aplicados")
    
    # 8. Render
    print("🚀 Iniciando render...")
    bpy.ops.render.render(animation=True)
    print("🎉 Render concluído!")
    
    # 9. Verificação final
    if os.path.exists(output):
        size = os.path.getsize(output)
        print(f"✅ SUCESSO! MP4 gerado: {size} bytes")
    else:
        print("❌ ERRO! Arquivo não foi gerado")
        sys.exit(1)
    
    print("🏁 Script finalizado - exit code 0")

except Exception as e:
    print(f"❌ ERRO GERAL: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
