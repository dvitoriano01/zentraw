import bpy, wave, numpy as np, os, sys

# 1. Captura caminhos dos argumentos
argv = sys.argv
audio = argv[argv.index("--")+1]
image = argv[argv.index("--")+2]

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

# 4. Configura render
scene = bpy.context.scene
scene.render.fps = fps
scene.render.resolution_x = 1080
scene.render.resolution_y = 1920
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.codec = 'H264'
scene.render.filepath = os.path.join(os.getcwd(), "output.mp4")

# 5. Aplica capa como textura no "Plane"
img = bpy.data.images.load(image)
plane = bpy.data.objects["Plane"]
mat = plane.active_material
node = mat.node_tree.nodes.get("Image Texture")
node.image = img

# 6. Insere keyframes na escala Z de "Cube"
cube = bpy.data.objects["Cube"]
for i, amp in enumerate(amps, start=1):
    cube.scale[2] = 1 + amp * 3
    cube.keyframe_insert(data_path="scale", frame=i, index=2)

# 7. Renderiza todo
bpy.ops.render.render(animation=True)
