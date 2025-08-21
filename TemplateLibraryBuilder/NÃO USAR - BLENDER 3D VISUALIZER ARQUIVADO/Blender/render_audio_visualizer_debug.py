import bpy, wave, os, sys

print("🚀 Starting Blender Audio Visualizer...")

try:
    import numpy as np
    print("✅ NumPy imported successfully")
except ImportError as e:
    print(f"❌ NumPy import failed: {e}")
    sys.exit(1)

try:
    # 1. Captura caminhos dos argumentos
    argv = sys.argv
    print(f"📋 Arguments: {argv}")
    
    audio = argv[argv.index("--")+1]
    image = argv[argv.index("--")+2]
    print(f"🎵 Audio file: {audio}")
    print(f"🖼️ Image file: {image}")
    
    # Verificar se arquivos existem
    if not os.path.exists(audio):
        print(f"❌ Audio file not found: {audio}")
        sys.exit(1)
    
    if not os.path.exists(image):
        print(f"❌ Image file not found: {image}")
        sys.exit(1)
    
    print("✅ Input files exist")

    # 2. Carrega áudio via wave + numpy
    print("🎵 Loading audio...")
    wf = wave.open(audio, 'rb')
    sr, nframes = wf.getframerate(), wf.getnframes()
    print(f"📊 Sample rate: {sr}, Frames: {nframes}")
    
    frames = wf.readframes(nframes)
    samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
    samples /= np.max(np.abs(samples))
    print(f"✅ Audio processed, {len(samples)} samples")

    # 3. Calcula amplitude por frame
    print("📊 Calculating amplitudes...")
    fps = 30
    spf = int(sr / fps)
    total_frames = len(samples) // spf
    amps = [np.mean(np.abs(samples[i*spf:(i+1)*spf])) for i in range(total_frames)]
    print(f"✅ {total_frames} animation frames calculated")

    # 4. Configura render
    print("🎬 Setting up render...")
    scene = bpy.context.scene
    scene.render.fps = fps
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.codec = 'H264'
    
    output_path = os.path.join(os.getcwd(), "output.mp4")
    scene.render.filepath = output_path
    print(f"📁 Output path: {output_path}")

    # 5. Aplica capa como textura no "Plane"
    print("🖼️ Loading image texture...")
    img = bpy.data.images.load(image)
    
    if "Plane" in bpy.data.objects:
        plane = bpy.data.objects["Plane"]
        if plane.active_material and plane.active_material.node_tree:
            mat = plane.active_material
            node = mat.node_tree.nodes.get("Image Texture")
            if node:
                node.image = img
                print("✅ Image texture applied")
            else:
                print("⚠️ Image Texture node not found")
        else:
            print("⚠️ Plane has no material or node tree")
    else:
        print("⚠️ Plane object not found")

    # 6. Insere keyframes na escala Z de "Cube"
    print("🎯 Setting up animation keyframes...")
    if "Cube" in bpy.data.objects:
        cube = bpy.data.objects["Cube"]
        for i, amp in enumerate(amps, start=1):
            cube.scale[2] = 1 + amp * 3
            cube.keyframe_insert(data_path="scale", frame=i, index=2)
        print(f"✅ {len(amps)} keyframes inserted")
    else:
        print("⚠️ Cube object not found")

    # 7. Renderiza todo
    print("🎬 Starting render...")
    bpy.ops.render.render(animation=True)
    print("✅ Render completed!")
    
    print(f"🎉 SUCCESS! Video saved to: {output_path}")

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
