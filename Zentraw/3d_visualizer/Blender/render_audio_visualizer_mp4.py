import bpy, wave, os, sys, time, datetime
import numpy as np

# Inicializa logging detalhado
start_time = time.time()
render_start_datetime = datetime.datetime.now()

print("🚀 Starting Blender Audio Visualizer MP4 Generator...")
print(f"📅 Start Time: {render_start_datetime.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"🔧 Blender Version: {bpy.app.version_string}")
print(f"🐍 Python Version: {sys.version}")
print(f"🖥️ Render Engine: {bpy.context.scene.render.engine}")
print(f"📂 Working Directory: {os.getcwd()}")

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
    print("🎵 Loading and processing audio...")
    wf = wave.open(audio, 'rb')
    sr, nframes = wf.getframerate(), wf.getnframes()
    frames = wf.readframes(nframes)
    print(f"📊 Sample rate: {sr}, Frames: {nframes}")
    
    # Converte para numpy array
    if wf.getsampwidth() == 1:
        samples = np.frombuffer(frames, dtype=np.uint8).astype(np.float32)
        samples = (samples - 128) / 128
    elif wf.getsampwidth() == 2:
        samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
        samples = samples / 32768
    else:
        samples = np.frombuffer(frames, dtype=np.int32).astype(np.float32)
        samples = samples / 2147483648
    
    # Se estéreo, converte para mono
    if wf.getnchannels() == 2:
        samples = samples.reshape(-1, 2).mean(axis=1)
    
    wf.close()
    print(f"✅ Audio processed: {len(samples)} samples, {len(samples)/sr:.2f} seconds")

    # 3. Calcula amplitude por frame (30 FPS)
    print("📊 Calculating amplitudes for animation...")
    fps = 30
    spf = int(sr / fps)
    total_frames = len(samples) // spf
    amps = []
    
    for i in range(total_frames):
        start_sample = i * spf
        end_sample = min(start_sample + spf, len(samples))
        frame_samples = samples[start_sample:end_sample]
        amp = np.sqrt(np.mean(frame_samples**2))  # RMS amplitude
        amps.append(amp)
    
    print(f"✅ {total_frames} animation frames calculated ({total_frames/fps:.2f} seconds)")

    # 4. Configura cena do Blender
    print("🎬 Setting up Blender scene...")
    scene = bpy.context.scene
    
    # Log do motor de render atual
    current_engine = scene.render.engine
    print(f"🔧 Current Render Engine: {current_engine}")
    
    # Força usar Cycles para melhor qualidade (opcional)
    if current_engine != 'CYCLES':
        print("⚙️ Switching to Cycles render engine for better quality...")
        scene.render.engine = 'CYCLES'
        # Configurações Cycles para performance
        scene.cycles.samples = 64  # Samples para qualidade vs velocidade
        scene.cycles.preview_samples = 32
        scene.cycles.device = 'GPU' if bpy.context.preferences.addons['cycles'].preferences.has_active_device() else 'CPU'
        print(f"🖥️ Cycles Device: {scene.cycles.device}")
        print(f"🎯 Samples: {scene.cycles.samples}")
    
    # Configurações de render
    scene.render.fps = fps
    scene.render.resolution_x = 1920  # Formato horizontal
    scene.render.resolution_y = 1080
    scene.render.resolution_percentage = 100
    
    print(f"📐 Resolution: {scene.render.resolution_x}x{scene.render.resolution_y} ({scene.render.resolution_percentage}%)")
    print(f"🎬 Frame Rate: {scene.render.fps} FPS")
    
    # Configurações de vídeo MP4
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'HIGH'
    scene.render.ffmpeg.ffmpeg_preset = 'GOOD'
    
    # IMPORTANTE: Configurar áudio
    scene.render.ffmpeg.audio_codec = 'AAC'
    scene.render.ffmpeg.audio_bitrate = 192
    scene.render.ffmpeg.audio_mixrate = sr
    
    print(f"🎥 Video Codec: {scene.render.ffmpeg.codec}")
    print(f"🎵 Audio Codec: {scene.render.ffmpeg.audio_codec}")
    print(f"📊 Audio Bitrate: {scene.render.ffmpeg.audio_bitrate} kbps")
    print(f"🔊 Audio Sample Rate: {scene.render.ffmpeg.audio_mixrate} Hz")
    
    # Definir frame range
    scene.frame_start = 1
    scene.frame_end = total_frames
    
    # Caminho de saída
    output_dir = os.path.join(os.path.dirname(__file__), "Output")
    output_path = os.path.join(output_dir, "audio_visualizer.mp4")
    scene.render.filepath = output_path
    print(f"📁 Output path: {output_path}")

    # 5. Importa e configura áudio no Blender
    print("🎵 Adding audio to timeline...")
    if bpy.context.scene.sequence_editor is None:
        bpy.context.scene.sequence_editor_create()
    
    sequencer = bpy.context.scene.sequence_editor
    # Remove sequências existentes
    for seq in sequencer.sequences:
        sequencer.sequences.remove(seq)
    
    # Adiciona áudio
    audio_strip = sequencer.sequences.new_sound(
        name="Audio",
        filepath=audio,
        channel=1,
        frame_start=1
    )
    print("✅ Audio added to timeline")

    # 6. Aplica capa como textura no "Plane"
    print("🖼️ Setting up image texture...")
    img = bpy.data.images.load(image)
    
    if "Plane" in bpy.data.objects:
        plane = bpy.data.objects["Plane"]
        if plane.active_material and plane.active_material.node_tree:
            mat = plane.active_material
            node = mat.node_tree.nodes.get("Image Texture")
            if node:
                node.image = img
                print("✅ Image texture applied to Plane")
            else:
                print("⚠️ Image Texture node not found in material")
        else:
            print("⚠️ Plane has no material or node tree")
    else:
        print("⚠️ Plane object not found")

    # 7. Configura animação do cubo baseada no áudio
    print("🎯 Setting up cube animation...")
    if "Cube" in bpy.data.objects:
        cube = bpy.data.objects["Cube"]
        
        # Limpa keyframes existentes
        cube.animation_data_clear()
        
        # Insere keyframes
        for i, amp in enumerate(amps, start=1):
            # Scale baseado na amplitude (mais suave)
            scale_factor = 1 + amp * 4  # Multiplicador maior para mais movimento
            cube.scale[2] = scale_factor
            cube.keyframe_insert(data_path="scale", frame=i, index=2)
            
            # Opcional: animar rotação também
            cube.rotation_euler[2] = amp * 3.14159  # Rotação baseada na amplitude
            cube.keyframe_insert(data_path="rotation_euler", frame=i, index=2)
        
        print(f"✅ {len(amps)} keyframes inserted for cube animation")
    else:
        print("⚠️ Cube object not found")

    # 8. Configura câmera para melhor enquadramento
    print("📹 Setting up camera...")
    if "Camera" in bpy.data.objects:
        camera = bpy.data.objects["Camera"]
        camera.location = (7.5, -6.5, 5.5)  # Posição para formato 16:9
        camera.rotation_euler = (1.1, 0, 0.785)  # Ângulo para visualizar bem
        print("✅ Camera positioned")

    # 9. Renderiza animação completa
    print("🎬 Starting render...")
    print(f"📊 Rendering {total_frames} frames at {fps} FPS...")
    print(f"⏱️ Estimated duration: {total_frames/fps:.2f} seconds")
    print(f"🎯 Render Engine: {scene.render.engine}")
    print(f"📐 Output Resolution: {scene.render.resolution_x}x{scene.render.resolution_y}")
    
    # Marca tempo de início do render
    render_start_time = time.time()
    print(f"🕐 Render Start: {datetime.datetime.now().strftime('%H:%M:%S')}")
    
    bpy.ops.render.render(animation=True)
    
    # Calcula tempo total de render
    render_end_time = time.time()
    total_render_time = render_end_time - render_start_time
    render_end_datetime = datetime.datetime.now()
    
    print("✅ Render completed!")
    print(f"🕐 Render End: {render_end_datetime.strftime('%H:%M:%S')}")
    print(f"⏱️ Total Render Time: {total_render_time:.2f} seconds ({total_render_time/60:.2f} minutes)")
    print(f"📊 Average Time per Frame: {total_render_time/total_frames:.2f} seconds")
    print(f"� Frames per Second (render): {total_frames/total_render_time:.2f} FPS")
    
    # Calcula tempo total do script
    script_end_time = time.time()
    total_script_time = script_end_time - start_time
    
    print(f"�🎉 SUCCESS! MP4 with audio saved to: {output_path}")
    print("\n" + "="*60)
    print("📊 FINAL RENDER STATISTICS")
    print("="*60)
    print(f"📅 Session Start: {render_start_datetime.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📅 Session End: {render_end_datetime.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⏱️ Total Script Time: {total_script_time:.2f} seconds ({total_script_time/60:.2f} minutes)")
    print(f"⏱️ Pure Render Time: {total_render_time:.2f} seconds ({total_render_time/60:.2f} minutes)")
    print(f"⚙️ Setup Time: {render_start_time - start_time:.2f} seconds")
    print(f"� Blender Version: {bpy.app.version_string}")
    print(f"🎯 Render Engine: {scene.render.engine}")
    if scene.render.engine == 'CYCLES':
        print(f"🖥️ Cycles Device: {scene.cycles.device}")
        print(f"🎯 Cycles Samples: {scene.cycles.samples}")
    print(f"�📐 Resolution: {scene.render.resolution_x}x{scene.render.resolution_y}")
    print(f"� Frame Rate: {fps} FPS")
    print(f"📊 Total Frames: {total_frames}")
    print(f"⏱️ Video Duration: {total_frames/fps:.2f} seconds")
    print(f"�🎵 Audio Sample Rate: {sr}Hz")
    print(f"🎵 Audio Duration: {len(samples)/sr:.2f} seconds")
    print(f"🎥 Video Codec: {scene.render.ffmpeg.codec}")
    print(f"🎵 Audio Codec: {scene.render.ffmpeg.audio_codec}")
    print(f"📊 Audio Bitrate: {scene.render.ffmpeg.audio_bitrate} kbps")
    print(f"📈 Performance: {total_frames/total_render_time:.2f} frames/second")
    print(f"📁 Output File: {output_path}")
    
    # Verifica tamanho do arquivo gerado
    if os.path.exists(output_path):
        file_size = os.path.getsize(output_path)
        file_size_mb = file_size / (1024 * 1024)
        print(f"📦 File Size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
        print(f"💾 Compression Ratio: {file_size_mb/(total_frames/fps):.2f} MB/second")
    
    print("="*60)

except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
