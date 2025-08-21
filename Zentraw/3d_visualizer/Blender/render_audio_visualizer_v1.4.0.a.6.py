#!/usr/bin/env python3
"""
Zentraw 3D Audio Visualizer V1.4.0.a.6 - SINCRONIZAÇÃO PRECISA + PARÂMETROS DINÂMICOS

Melhorias V1.4.0.a.6:
- Sincronização precisa áudio-visual com timestamp
- Parâmetros dinâmicos (FPS, resolução, amplitude)
- Keyframes alinhados com tempo real de áudio
- Base sólida V1.4.0.a.5 preservada

Uso:
blender --background template.blend --python render_audio_visualizer_v1.4.0.a.6.py -- audio.wav cover.jpg output.mp4 [fps] [resolution] [amplitude]

Argumentos opcionais:
- fps: 24, 30, 60 (default: 30)
- resolution: 1080p, 4k (default: 1080p)  
- amplitude: 1.0-5.0 (default: 3.0)
"""

import bpy, wave, numpy as np, os, sys

# 1. Processa argumentos com parâmetros opcionais V1.4.0.a.6
if len(sys.argv) < 4:
    print("❌ ERRO: Argumentos insuficientes")
    print("Uso: blender --background template.blend --python script.py -- audio.wav cover.jpg output.mp4 [fps] [resolution] [amplitude]")
    sys.exit(1)

audio = sys.argv[-6] if len(sys.argv) >= 6 else sys.argv[-3]
image = sys.argv[-5] if len(sys.argv) >= 6 else sys.argv[-2]  
output = sys.argv[-4] if len(sys.argv) >= 6 else sys.argv[-1]

# Parâmetros dinâmicos V1.4.0.a.6
fps = int(sys.argv[-3]) if len(sys.argv) >= 7 else 30
resolution_preset = sys.argv[-2] if len(sys.argv) >= 8 else "1080p"
amplitude_multiplier = float(sys.argv[-1]) if len(sys.argv) >= 9 else 3.0

print(f"🎬 V1.4.0.a.6 - ZENTRAW AUDIO VISUALIZER COM SINCRONIZAÇÃO PRECISA")
print(f"📁 Base: V1.4.0.a.5 (duração correta) + sincronização melhorada")
print(f"⚙️ Parâmetros: FPS={fps}, Resolução={resolution_preset}, Amplitude={amplitude_multiplier}x")
print(f"🎵 Audio: {audio}")
print(f"🖼️ Image: {image}")
print(f"📤 Output: {output}")

# 2. Carrega áudio via wave + numpy (Base V1.4.0.a.5)
print("📊 Loading and analyzing audio...")
audio_path = os.path.abspath(audio)
print(f"🎵 Caminho absoluto áudio: {audio_path}")
wf = wave.open(audio_path, 'rb')
sr, nframes = wf.getframerate(), wf.getnframes()
frames = wf.readframes(nframes)
samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
samples /= np.max(np.abs(samples))
print(f"✅ Audio loaded: {sr}Hz, {nframes} frames")

# 3. Calcula amplitude por frame com sincronização precisa V1.4.0.a.6
duration_seconds = nframes / sr  # Base V1.4.0.a.5 (duração correta)
total_frames = int(duration_seconds * fps)
spf = int(sr / fps)  # Samples per frame

# MELHORIA V1.4.0.a.6: Calcular amplitude com timestamp preciso
amps = []
timestamps = []
for i in range(total_frames):
    # Timestamp real do frame no áudio
    frame_timestamp = i / fps
    start_sample = int(frame_timestamp * sr)
    end_sample = min(start_sample + spf, len(samples))
    
    if start_sample < len(samples):
        frame_samples = samples[start_sample:end_sample]
        amplitude = np.mean(np.abs(frame_samples)) if len(frame_samples) > 0 else 0.0
        amps.append(amplitude)
        timestamps.append(frame_timestamp)
    else:
        amps.append(0.0)
        timestamps.append(frame_timestamp)

print(f"📈 Audio analysis V1.4.0.a.6: {duration_seconds:.2f}s → {total_frames} frames at {fps} FPS")
print(f"🎯 Sincronização: {len(timestamps)} timestamps precisos calculados")

# 4. Configura resolução dinâmica V1.4.0.a.6
resolutions = {
    "1080p": (1920, 1080),
    "4k": (3840, 2160),
    "720p": (1280, 720)
}
res_x, res_y = resolutions.get(resolution_preset, (1920, 1080))

# 5. Configura render para MP4 COM ÁUDIO V1.4.0.a.6
scene = bpy.context.scene
scene.render.fps = fps
scene.frame_end = total_frames
scene.render.resolution_x = res_x
scene.render.resolution_y = res_y
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'

# ✅ V1.4.0.a.6 - COM ÁUDIO: Configuração herdada da V1.4.0.a.5
scene.render.ffmpeg.audio_codec = 'AAC'
scene.sequence_editor_create()
seq = scene.sequence_editor.sequences.new_sound("Audio", audio_path, 1, 1)
seq.frame_final_duration = total_frames
seq.frame_final_end = total_frames

print(f"🎬 V1.4.0.a.6 - Configurando render MP4 COM SINCRONIZAÇÃO PRECISA:")
print(f"📐 Resolução: {res_x}x{res_y} ({resolution_preset})")
print(f"🎞️ FPS: {fps}")
print(f"📊 Total frames: {total_frames}")
print(f"⏱️ Duração: {duration_seconds:.2f} segundos")
print(f"🎵 Audio: AAC codec ATIVADO")
print(f"🔊 Amplitude: {amplitude_multiplier}x multiplier")
print(f"📁 Output: {output}")

# 6. Aplica capa como textura no "Plane" (Base V1.4.0.a.5)
print("🖼️ Aplicando imagem de capa...")
image_path = os.path.abspath(image)
print(f"🖼️ Caminho absoluto imagem: {image_path}")
img = bpy.data.images.load(image_path)
plane = bpy.data.objects["Plane"]
mat = plane.active_material
node = mat.node_tree.nodes.get("Image Texture")
node.image = img
print(f"✅ Imagem aplicada ao Plane")

# 7. MELHORIA V1.4.0.a.6: Insere keyframes com sincronização precisa
print(f"🎵 Aplicando {len(amps)} keyframes com SINCRONIZAÇÃO PRECISA...")
cube = bpy.data.objects["Cube"]

for i, (amp, timestamp) in enumerate(zip(amps, timestamps)):
    # CORREÇÃO V1.4.0.a.6: Frame baseado em timestamp real
    frame_number = int(timestamp * fps) + 1
    
    # Aplicar amplitude com multiplicador dinâmico
    scale_value = 1 + (amp * amplitude_multiplier)
    cube.scale[2] = scale_value
    cube.keyframe_insert(data_path="scale", frame=frame_number, index=2)
    
    # Log de progresso a cada 10% 
    if i % (len(amps) // 10) == 0:
        progress = (i / len(amps)) * 100
        print(f"📈 Progresso keyframes: {progress:.0f}% (frame {frame_number}, amplitude {scale_value:.3f})")

print(f"✅ Keyframes aplicados com sincronização precisa V1.4.0.a.6")

# 8. Renderiza MP4 COM ÁUDIO E SINCRONIZAÇÃO V1.4.0.a.6
print(f"🚀 V1.4.0.a.6 - INICIANDO RENDER MP4 COM SINCRONIZAÇÃO PRECISA...")
print(f"⏱️ Estimated time: {total_frames/fps:.1f} seconds of synchronized video")
print(f"🎵 Audio: AAC codec sincronizado")
print(f"🎯 Sync: Keyframes alinhados com timestamp de áudio")

# Configurar output com caminho absoluto
output_path = os.path.abspath(output)
scene.render.filepath = output_path
print(f"📁 Output absoluto: {output_path}")

bpy.ops.render.render(animation=True)

print(f"🎉 V1.4.0.a.6 - RENDER MP4 COM SINCRONIZAÇÃO PRECISA CONCLUÍDO!")
print(f"📁 Arquivo gerado: {output_path}")

# 9. Verificação final V1.4.0.a.6
if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"✅ SUCESSO! Arquivo MP4 COM ÁUDIO E SINCRONIZAÇÃO gerado: {size} bytes")
    print(f"📂 Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.6 - SISTEMA COM SINCRONIZAÇÃO PRECISA FUNCIONANDO!")
    print(f"🎵 Duração: {duration_seconds:.2f}s - MP4 com trilha sonora AAC sincronizada")
    print(f"⚙️ Parâmetros: {fps}fps, {resolution_preset}, {amplitude_multiplier}x amplitude")
    print(f"🎯 Sync Quality: Keyframes alinhados com timestamp de áudio")
else:
    print(f"❌ ERRO! Arquivo não foi gerado: {output}")
    print(f"📂 Directory: {os.path.dirname(__file__)}")
    print(f"🎬 V1.4.0.a.6 - RENDER FALHOU!")

print(f"🏁 V1.4.0.a.6 - ZENTRAW AUDIO VISUALIZER FINALIZADO!")
