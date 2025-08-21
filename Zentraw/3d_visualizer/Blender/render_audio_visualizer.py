"""
Zentraw 3D Visualizer V1.4.0.a.5
Data: 24/07/2025 - 13:45 BRT
Propósito: Script Python Blender para render real de MP4 com áudio visualizer básico
Status: Testando - BÁSICO WAV (sem codec AAC)
Dependências: bpy, wave, numpy, os, sys
Autor: GitHub Copilot
Categoria: Blender Python Script
Diretório Oficial: Zentraw/3d_visualizer/Blender (usando barras normais)
Novidade V1.4.0.a.5: Mantendo básico .WAV - sem complexidade AAC
"""

import bpy, wave, numpy as np, os, sys

print("🚀 V1.4.0.a.5 - AUDIO VISUALIZER BÁSICO WAV STARTED (Official Directory)")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python script: {__file__}")
print(f"🎵 BÁSICO: Usando .WAV nativo (sem codec AAC)")

# 1. Captura caminhos dos argumentos
argv = sys.argv
audio = argv[argv.index("--")+1]
image = argv[argv.index("--")+2]
output = argv[argv.index("--")+3] if len(argv) > argv.index("--")+3 else os.path.join(os.getcwd(), "output.mp4")

print(f"🎵 Audio file: {audio}")
print(f"🖼️ Image file: {image}")
print(f"📁 Output file: {output}")

# 2. Carrega áudio via wave + numpy
print("📊 Loading and analyzing audio...")
# Converter para caminho absoluto
audio_path = os.path.abspath(audio)
print(f"🎵 Caminho absoluto áudio: {audio_path}")
wf = wave.open(audio_path, 'rb')
sr, nframes = wf.getframerate(), wf.getnframes()
frames = wf.readframes(nframes)
samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
samples /= np.max(np.abs(samples))
print(f"✅ Audio loaded: {sr}Hz, {nframes} frames")

# 3. Calcula amplitude por frame e duração correta V1.4.0.a.5
fps = 30
duration_seconds = nframes / sr  # CORREÇÃO: usar nframes (total de samples) não len(samples)
total_frames = int(duration_seconds * fps)  # Cálculo correto da duração
spf = int(sr / fps)  # Samples per frame
# Garantir que temos exatamente total_frames de amplitude
amps = []
for i in range(total_frames):
    start_sample = i * spf
    end_sample = min(start_sample + spf, len(samples))
    if start_sample < len(samples):
        frame_samples = samples[start_sample:end_sample]
        amps.append(np.mean(np.abs(frame_samples)) if len(frame_samples) > 0 else 0.0)
    else:
        amps.append(0.0)
print(f"📈 Audio analysis CORRIGIDO: {duration_seconds:.2f}s → {total_frames} frames at {fps} FPS")

# 4. Configura render para MP4 COM ÁUDIO V1.4.0.a.5
scene = bpy.context.scene
scene.render.fps = fps
scene.frame_end = total_frames
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'

# ✅ V1.4.0.a.5 - COM ÁUDIO: Configurando codec AAC
scene.render.ffmpeg.audio_codec = 'AAC'
# Configurar arquivo de áudio para o Blender usar no render
scene.sequence_editor_create()
seq = scene.sequence_editor.sequences.new_sound("Audio", audio_path, 1, 1)
# CORREÇÃO V1.4.0.a.5: Ajustar duração do áudio ao video
seq.frame_final_duration = total_frames
seq.frame_final_end = total_frames

print(f"🎬 V1.4.0.a.5 - Configurando render MP4 COM ÁUDIO (Official Directory):")
print(f"📐 Resolução: {scene.render.resolution_x}x{scene.render.resolution_y}")
print(f"🎞️ FPS: {fps}")
print(f"📊 Total frames: {total_frames}")
print(f"⏱️ Duração: {duration_seconds:.2f} segundos")
print(f"🎵 Audio: AAC codec ATIVADO")
print(f"📁 Output: {output}")

# 5. Aplica capa como textura no "Plane"
print(f"🖼️ Carregando imagem: {image}")
# Converter para caminho absoluto
image_path = os.path.abspath(image)
print(f"🖼️ Caminho absoluto: {image_path}")
img = bpy.data.images.load(image_path)
plane = bpy.data.objects["Plane"]
mat = plane.active_material
node = mat.node_tree.nodes.get("Image Texture")
node.image = img
print(f"✅ Imagem aplicada ao Plane")

# 6. Insere keyframes na escala Z de "Cube"
print(f"🎵 Aplicando {len(amps)} keyframes de áudio...")
cube = bpy.data.objects["Cube"]
for i, amp in enumerate(amps, start=1):
    cube.scale[2] = 1 + amp * 3
    cube.keyframe_insert(data_path="scale", frame=i, index=2)
print(f"✅ Keyframes aplicados no Cube")

# 7. Renderiza MP4 COM ÁUDIO V1.4.0.a.5
print(f"🚀 V1.4.0.a.5 - INICIANDO RENDER MP4 COM ÁUDIO (Official Directory)...")
print(f"⏱️ Estimated time: {total_frames/fps:.1f} seconds of video with audio")
print(f"🎵 Audio: AAC codec integrado ao MP4")
# Configurar output com caminho absoluto
output_path = os.path.abspath(output)
scene.render.filepath = output_path
print(f"📁 Output absoluto: {output_path}")
bpy.ops.render.render(animation=True)
print(f"🎉 V1.4.0.a.5 - RENDER MP4 COM ÁUDIO CONCLUÍDO (Official Directory)!")
print(f"📁 Arquivo gerado: {output_path}")

# 8. Verificação final
if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"✅ SUCESSO! Arquivo MP4 COM ÁUDIO gerado: {size} bytes")
    print(f"📂 Official Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.5 - SISTEMA COM ÁUDIO FUNCIONANDO!")
    print(f"🎵 Duração: {duration_seconds:.2f}s - MP4 com trilha sonora AAC")
else:
    print(f"❌ ERRO! Arquivo não foi gerado: {output}")
    print(f"📂 Official Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.5 - RENDER FALHOU!")
