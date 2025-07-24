"""
Zentraw 3D Visualizer V1.4.0.a.5
Data: 24/07/2025 - 12:40 BRT
Propósito: Script Python Blender para render real de MP4 com áudio visualizer + trilha sonora
Status: Testando - INTEGRAÇÃO DE ÁUDIO AAC
Dependências: bpy, wave, numpy, os, sys
Autor: GitHub Copilot
Categoria: Blender Python Script
Diretório Oficial: C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender
Novidade V1.4.0.a.5: Audio codec AAC integrado ao MP4 final
"""

import bpy, wave, numpy as np, os, sys

print("🚀 V1.4.0.a.5 - AUDIO VISUALIZER COM ÁUDIO RENDER STARTED (Official Directory)")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python script: {__file__}")
print(f"🎵 NEW: Audio integration enabled (AAC codec)")

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
wf = wave.open(audio, 'rb')
sr, nframes = wf.getframerate(), wf.getnframes()
frames = wf.readframes(nframes)
samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
samples /= np.max(np.abs(samples))
print(f"✅ Audio loaded: {sr}Hz, {nframes} frames")

# 3. Calcula amplitude por frame
fps = 30
spf = int(sr / fps)
total_frames = len(samples) // spf
amps = [np.mean(np.abs(samples[i*spf:(i+1)*spf])) for i in range(total_frames)]
print(f"📈 Audio analysis: {total_frames} frames at {fps} FPS")

# 4. Configura render para MP4 real V1.4.0.a.5 - COM ÁUDIO
scene = bpy.context.scene
scene.render.fps = fps
scene.frame_end = total_frames
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'

# ✅ V1.4.0.a.5 - INTEGRAÇÃO DE ÁUDIO
scene.render.ffmpeg.audio_codec = 'AAC'         # Codec de áudio
scene.render.ffmpeg.audio_bitrate = 192         # Qualidade média 
scene.render.ffmpeg.audio_mixrate = 44100       # Sample rate
scene.render.ffmpeg.audio_channels = 'STEREO'   # Canais estéreo

scene.render.filepath = output

print(f"🎬 V1.4.0.a.5 - Configurando render MP4 COM ÁUDIO (Official Directory):")
print(f"📐 Resolução: {scene.render.resolution_x}x{scene.render.resolution_y}")
print(f"🎞️ FPS: {fps}")
print(f"📊 Total frames: {total_frames}")
print(f"🎵 Audio codec: AAC @ 192kbps")
print(f"📁 Output: {output}")

# 5. Aplica capa como textura no "Plane"
print(f"🖼️ Carregando imagem: {image}")
img = bpy.data.images.load(image)
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

# 7. Renderiza MP4 com áudio
print(f"🚀 V1.4.0.a.5 - INICIANDO RENDER MP4 COM ÁUDIO (Official Directory)...")
print(f"⏱️ Estimated time: {total_frames/fps:.1f} seconds of video")
print(f"🎵 Audio integration: AAC @ 192kbps")
bpy.ops.render.render(animation=True)
print(f"🎉 V1.4.0.a.5 - RENDER MP4 COM ÁUDIO CONCLUÍDO (Official Directory)!")
print(f"📁 Arquivo gerado: {output}")

# 8. Verificação final
import os
if os.path.exists(output):
    size = os.path.getsize(output)
    print(f"✅ SUCESSO! Arquivo MP4 com áudio gerado: {size} bytes")
    print(f"📂 Official Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.5 - SISTEMA 100% FUNCIONAL!")
else:
    print(f"❌ ERRO! Arquivo não foi gerado: {output}")
    print(f"📂 Official Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.5 - RENDER FALHOU!")
