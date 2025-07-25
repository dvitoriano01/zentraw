import bpy, wave, numpy as np, os, sys

# 1. Captura caminhos dos argumentos
argv = sys.argv
audio = argv[argv.index("--")+1]
image = argv[argv.index("--")+2]
output = argv[argv.index("--")+3] if len(argv) > argv.index("--")+3 else os.path.join(os.getcwd(), "output.mp4")

# 2. Carrega áudio via wave + numpy
wf = wave.open(audio, 'rb')
sr, nframes = wf.getframerate(), wf.getnframes()
frames = wf.readframes(nframes)
samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
samples /= np.max(np.abs(samples))

# 3. Calcula amplitude por frame
fps = 30
spf = int(sr / fps)
total_frames = len(samples) // spf
amps = [np.mean(np.abs(samples[i*spf:(i+1)*spf])) for i in range(total_frames)]

# 4. Configura render para MP4 real
scene = bpy.context.scene
scene.render.fps = fps
scene.frame_end = total_frames
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'
scene.render.ffmpeg.audio_codec = 'NONE'  # Sem áudio
scene.render.filepath = output

print(f"🎬 V1.4.0.a.4 - Configurando render MP4:")
print(f"📐 Resolução: {scene.render.resolution_x}x{scene.render.resolution_y}")
print(f"🎞️ FPS: {fps}")
print(f"📊 Total frames: {total_frames}")
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

# 7. Renderiza todo
print(f"🚀 V1.4.0.a.4 - INICIANDO RENDER REAL DO MP4...")
print(f"⏱️ Estimated time: {total_frames/fps:.1f} seconds of video")
bpy.ops.render.render(animation=True)
print(f"🎉 V1.4.0.a.4 - RENDER MP4 CONCLUÍDO!")
print(f"📁 Arquivo gerado: {output}")

# 8. Verificação final
import os
if os.path.exists(output):
    size = os.path.getsize(output)
    print(f"✅ SUCESSO! Arquivo MP4 gerado: {size} bytes")
else:
    print(f"❌ ERRO! Arquivo não foi gerado: {output}")
