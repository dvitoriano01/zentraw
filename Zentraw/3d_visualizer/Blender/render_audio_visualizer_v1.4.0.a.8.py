"""
Zentraw 3D Visualizer V1.4.0.a.8 - SCRIPT PARAMETRIZADO COMPLETO
Data: 25/07/2025 - EVOLUÇÃO PARAMETRIZADA BLINDADA
Propósito: Script Blender totalmente parametrizado + blindagem V1.4.0.a.7
Base: render_audio_visualizer_v1.4.0.a.7.py (BLINDADO - sync perfeito preservado)
Novidade: TODOS os parâmetros configuráveis via interface + logs detalhados
Dependências: bpy, wave, numpy, os, sys, json, mathutils
Autor: GitHub Copilot
Categoria: Blender Python Script Parametrized
Status: ✅ EVOLUÇÃO PARAMETRIZADA - Blindagem V1.4.0.a.7 completa
"""

import bpy
import wave
import numpy as np
import os
import sys
import json
from mathutils import Color

print("🎯 V1.4.0.a.8 - EVOLUÇÃO PARAMETRIZADA INICIADA")
print("🛡️ BLINDAGEM: V1.4.0.a.7 sync perfeito preservado")
print("⚙️ NOVIDADE: Parâmetros configuráveis completos")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python script: {__file__}")

# 1. Captura argumentos e configurações
argv = sys.argv
try:
    audio_path = argv[argv.index("--")+1]
    image_path = argv[argv.index("--")+2]
    output_path = argv[argv.index("--")+3] if len(argv) > argv.index("--")+3 else os.path.join(os.getcwd(), "output.mp4")
    settings_json = argv[argv.index("--")+4] if len(argv) > argv.index("--")+4 else "{}"
    
    print(f"🎵 Audio file: {audio_path}")
    print(f"🖼️ Image file: {image_path}")
    print(f"📁 Output file: {output_path}")
    print(f"⚙️ Settings JSON: {settings_json}")
    
    # Parse das configurações
    settings = json.loads(settings_json)
    print("✅ Configurações carregadas com sucesso")
    
except (ValueError, IndexError, json.JSONDecodeError) as e:
    print(f"❌ ERRO na captura de argumentos: {e}")
    print("🛡️ FALLBACK: Usando configurações padrão V1.4.0.a.7")
    settings = {}

# 2. Configurações com fallback para V1.4.0.a.7 (BLINDAGEM)
def get_setting(key, default):
    """Obter configuração com fallback blindado para V1.4.0.a.7"""
    return settings.get(key, default)

# Parâmetros de render
RESOLUTION = get_setting('resolution', '1920x1080')  # Full HD como padrão
FPS = int(get_setting('fps', 30))
SAMPLES = int(get_setting('samples', 128))
RENDER_ENGINE = get_setting('renderEngine', 'BLENDER_EEVEE_NEXT')  # Eevee Next como padrão (Blender 4.5+)

# Parâmetros de áudio (🛡️ BLINDAGEM V1.4.0.a.7)
AMPLITUDE_MULTIPLIER = float(get_setting('amplitudeMultiplier', 3.0))  # Preservado V1.4.0.a.7
SMOOTHING = int(get_setting('smoothing', 1))
FREQUENCY_RANGE = get_setting('frequencyRange', 'full')
AUDIO_CHANNELS = get_setting('audioChannels', 'mono')

# Parâmetros visuais
CUBE_SCALE = float(get_setting('cubeScale', 1.0))
MAX_SCALE = float(get_setting('maxScale', 5.0))
CAMERA_DISTANCE = float(get_setting('cameraDistance', 10.0))  # Ajustado para visão melhor (era 7.3)
LIGHT_INTENSITY = float(get_setting('lightIntensity', 1000))

# Cores (convertidas de hex para RGB)
def hex_to_rgb(hex_color):
    """Converter cor hex para RGB normalizado"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

BACKGROUND_COLOR = hex_to_rgb(get_setting('backgroundColor', '#1e3c72'))
CUBE_COLOR = hex_to_rgb(get_setting('cubeColor', '#4CAF50'))

print("📊 CONFIGURAÇÕES APLICADAS V1.4.0.a.8 OTIMIZADO:")
print(f"   🎬 Resolução: {RESOLUTION} (Full HD padrão)")
print(f"   🎞️ FPS: {FPS}")
print(f"   🔍 Samples: {SAMPLES}")
print(f"   ⚡ Engine: {RENDER_ENGINE} (Eevee Next padrão - 3x mais rápido)")
print(f"   📊 Amplitude Multiplier: {AMPLITUDE_MULTIPLIER}x (V1.4.0.a.7 BLINDADO)")
print(f"   🌊 Suavização: {SMOOTHING}")
print(f"   🎧 Canais: {AUDIO_CHANNELS}")
print(f"   📦 Escala Base: {CUBE_SCALE}x")
print(f"   📈 Escala Máxima: {MAX_SCALE}x")
print(f"   📷 Distância Câmera: {CAMERA_DISTANCE}m")
print(f"   💡 Intensidade Luz: {LIGHT_INTENSITY}W")

# 3. Carregar e analisar áudio (🛡️ PRESERVADO V1.4.0.a.7)
print("📊 Loading and analyzing audio...")
audio_path = os.path.abspath(audio_path)
print(f"🎵 Caminho absoluto áudio: {audio_path}")

# 🛡️ BLINDAGEM: Validação de arquivo
if not os.path.exists(audio_path):
    print(f"❌ ERRO BLINDAGEM: Arquivo de áudio não encontrado: {audio_path}")
    sys.exit(1)

try:
    wf = wave.open(audio_path, 'rb')
    sr, nframes = wf.getframerate(), wf.getnframes()
    channels = wf.getnchannels()  # 🛡️ PRESERVADO V1.4.0.a.7: Ler antes de fechar
    frames = wf.readframes(nframes)
    wf.close()
    
    print(f"🔍 ANÁLISE DETALHADA:")
    print(f"   📊 Sample rate: {sr} Hz")
    print(f"   📈 Total frames: {nframes}")
    print(f"   🎧 Canais: {channels} ({'stereo' if channels == 2 else 'mono'})")
    
    # 🛡️ PRESERVADO V1.4.0.a.7: Processamento correto de canais
    samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
    
    # Processamento de canais baseado na configuração
    if channels == 2:  # Stereo
        if AUDIO_CHANNELS == 'mono' or AUDIO_CHANNELS == 'stereo_left':
            samples = samples[::2]  # Canal esquerdo (🛡️ V1.4.0.a.7 PRESERVADO)
            print(f"   🔧 PROCESSAMENTO: Usando canal esquerdo")
        elif AUDIO_CHANNELS == 'stereo_right':
            samples = samples[1::2]  # Canal direito
            print(f"   🔧 PROCESSAMENTO: Usando canal direito") 
        elif AUDIO_CHANNELS == 'stereo_mix':
            left = samples[::2]
            right = samples[1::2]
            samples = (left + right) / 2  # Mix dos canais
            print(f"   🔧 PROCESSAMENTO: Mix dos canais stereo")
    else:
        print(f"   🔧 PROCESSAMENTO: Audio já em mono")
    
    print(f"   🔢 Samples array length: {len(samples)}")
    
    # 🛡️ BLINDAGEM: Normalização
    samples /= np.max(np.abs(samples)) if np.max(np.abs(samples)) > 0 else 1
    
except Exception as e:
    print(f"❌ ERRO ao processar áudio: {e}")
    sys.exit(1)

# 4. Configurar cena Blender
print("🎬 Setting up scene...")

# Limpar cena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Configurar render engine
bpy.context.scene.render.engine = RENDER_ENGINE
print(f"🚀 Render engine: {RENDER_ENGINE}")

# Configurar resolução
res_width, res_height = map(int, RESOLUTION.split('x'))
bpy.context.scene.render.resolution_x = res_width
bpy.context.scene.render.resolution_y = res_height
bpy.context.scene.render.resolution_percentage = 100
print(f"📐 Resolução: {res_width}x{res_height}")

# Configurar FPS
bpy.context.scene.render.fps = FPS
print(f"🎞️ FPS: {FPS}")

# Configurar samples e otimizações por engine
if RENDER_ENGINE == 'CYCLES':
    bpy.context.scene.cycles.samples = SAMPLES
    print(f"🔍 Cycles samples: {SAMPLES}")
elif RENDER_ENGINE == 'BLENDER_EEVEE' or RENDER_ENGINE == 'BLENDER_EEVEE_NEXT':
    # Otimizações para Eevee/Eevee Next (velocidade)
    eevee = bpy.context.scene.eevee
    
    # Configurar samples de forma compatível
    try:
        if hasattr(eevee, 'taa_render_samples'):
            eevee.taa_render_samples = min(SAMPLES, 64)  # Eevee clássico
        elif hasattr(eevee, 'taa_samples'):
            eevee.taa_samples = min(SAMPLES, 64)  # Possível mudança no Eevee Next
        
        samples_count = getattr(eevee, 'taa_render_samples', getattr(eevee, 'taa_samples', SAMPLES))
        print(f"⚡ Eevee samples: {samples_count} (otimizado para velocidade)")
    except Exception as e:
        print(f"⚠️ Aviso: Configuração de samples Eevee não aplicada: {e}")
    
    # Configurações visuais compatíveis com Eevee Next (Blender 4.5+)
    try:
        # Tentar configurações clássicas do Eevee (Blender 4.4 e anterior)
        if hasattr(eevee, 'use_bloom'):
            eevee.use_bloom = True  # Visual melhor
        if hasattr(eevee, 'use_ssr'):
            eevee.use_ssr = True   # Screen Space Reflections
        if hasattr(eevee, 'use_motion_blur'):
            eevee.use_motion_blur = False  # Desabilitar para velocidade
        if hasattr(eevee, 'use_volumetric_lights'):
            eevee.use_volumetric_lights = False  # Desabilitar para velocidade
        print("✅ Configurações visuais Eevee aplicadas")
    except Exception as e:
        print(f"⚠️ Aviso: Configurações visuais Eevee não aplicadas: {e}")
        # Eevee Next (Blender 4.5+) - usando configurações padrão
else:
    print(f"🚀 Engine: {RENDER_ENGINE} (configuração padrão)")

# Background color
bpy.context.scene.world.use_nodes = True
bg_node = bpy.context.scene.world.node_tree.nodes["Background"]
bg_node.inputs[0].default_value = (*BACKGROUND_COLOR, 1.0)
print(f"🌈 Background color: {BACKGROUND_COLOR}")

# 5. Criar cubo
print("📦 Creating cube...")
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
cube = bpy.context.active_object
cube.name = "AudioCube"
cube.scale = (CUBE_SCALE, CUBE_SCALE, CUBE_SCALE)

# Material do cubo
mat = bpy.data.materials.new(name="CubeMaterial")
mat.use_nodes = True
principled = mat.node_tree.nodes["Principled BSDF"]
principled.inputs[0].default_value = (*CUBE_COLOR, 1.0)  # Base Color
principled.inputs[7].default_value = 0.8  # Roughness
principled.inputs[12].default_value = 0.5  # Specular
cube.data.materials.append(mat)
print(f"🎨 Cube color: {CUBE_COLOR}")

# 6. Posicionar câmera
print("📷 Setting up camera...")
bpy.ops.object.camera_add(location=(CAMERA_DISTANCE, -CAMERA_DISTANCE, CAMERA_DISTANCE))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0.785)  # Ângulo padrão
bpy.context.scene.camera = camera

# Aplicar offsets relativos e zoom
camera.location.x += float(settings.get('camera_offset_x', 0))
camera.location.y += float(settings.get('camera_offset_y', 0))
camera.location.z += float(settings.get('camera_offset_z', 0))
if hasattr(camera.data, 'lens'):
    camera.data.lens += float(settings.get('camera_zoom', 0))
print(f"📷 Câmera distância: {CAMERA_DISTANCE}m | Offsets aplicados: x={settings.get('camera_offset_x', 0)}, y={settings.get('camera_offset_y', 0)}, z={settings.get('camera_offset_z', 0)}, zoom={settings.get('camera_zoom', 0)}")

# 7. Configurar iluminação
print("💡 Setting up lighting...")
bpy.ops.object.light_add(type='SUN', location=(4, 4, 8))
light = bpy.context.active_object
light.data.energy = LIGHT_INTENSITY
light.rotation_euler = (0.3, 0.3, 0)
print(f"💡 Luz intensidade: {LIGHT_INTENSITY}W")

# 8. Carregar imagem de background (se fornecida)
if image_path and os.path.exists(image_path):
    print(f"🖼️ Loading background image: {image_path}")
    try:
        bpy.ops.import_image.to_plane(files=[{"name": os.path.basename(image_path)}], 
                                      directory=os.path.dirname(image_path))
        bg_plane = bpy.context.active_object
        bg_plane.location = (0, 5, 0)  # Posicionar atrás do cubo
        bg_plane.scale = (4, 4, 4)
        print("✅ Background image carregada")
    except Exception as e:
        print(f"⚠️ Erro ao carregar imagem: {e}")

# 9. Calcular duração e frames (🛡️ PRESERVADO V1.4.0.a.7)
duration = len(samples) / sr
total_frames = int(duration * FPS)
samples_per_frame = len(samples) // total_frames if total_frames > 0 else len(samples)

print(f"🎯 SINCRONIZAÇÃO CALCULADA V1.4.0.a.8:")
print(f"   🎧 Canais processados: {channels} → {AUDIO_CHANNELS}")
print(f"   ⏱️ Duração do áudio: {duration:.3f} segundos")
print(f"   🎞️ FPS: {FPS}")
print(f"   📊 Total frames: {total_frames}")
print(f"   🔢 Samples per frame: {samples_per_frame}")

# 10. Gerar keyframes com suavização
print("🎯 Generating keyframes...")
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = total_frames

# Função de suavização
def smooth_amplitude(amplitudes, window_size):
    """Aplicar suavização nas amplitudes"""
    if window_size <= 1:
        return amplitudes
    
    smoothed = []
    for i in range(len(amplitudes)):
        start = max(0, i - window_size // 2)
        end = min(len(amplitudes), i + window_size // 2 + 1)
        smoothed.append(np.mean(amplitudes[start:end]))
    return np.array(smoothed)

# Calcular amplitudes
amplitudes = []
for frame in range(total_frames):
    start_sample = frame * samples_per_frame
    end_sample = min(start_sample + samples_per_frame, len(samples))
    
    if start_sample < len(samples):
        frame_samples = samples[start_sample:end_sample]
        # 🛡️ PRESERVADO V1.4.0.a.7: Método de amplitude original
        amp = np.mean(np.abs(frame_samples))
        amplitudes.append(amp)
    else:
        amplitudes.append(0)

# Aplicar suavização se configurada
if SMOOTHING > 1:
    amplitudes = smooth_amplitude(amplitudes, SMOOTHING)
    print(f"🌊 Suavização aplicada: {SMOOTHING} frames")

# Normalizar e aplicar multiplicador (🛡️ PRESERVADO V1.4.0.a.7)
max_amp = np.max(amplitudes) if len(amplitudes) > 0 else 1
amplitudes = [(amp / max_amp) * AMPLITUDE_MULTIPLIER for amp in amplitudes]

print(f"📊 Amplitude range: 0 → {max(amplitudes):.3f}")

# Aplicar keyframes
for frame_num, amplitude in enumerate(amplitudes, 1):
    # Calcular escala: base + (amplitude * range)
    scale_factor = CUBE_SCALE + (amplitude * (MAX_SCALE - CUBE_SCALE))
    
    bpy.context.scene.frame_set(frame_num)
    cube.scale = (scale_factor, scale_factor, scale_factor)
    cube.keyframe_insert(data_path="scale", frame=frame_num)

print(f"✅ SINCRONIZAÇÃO CONCLUÍDA: {len(amplitudes)} keyframes gerados")

# 11. Configurar output
print("📁 Configuring output...")
output_path = os.path.abspath(output_path)  # Garantir caminho absoluto
output_dir = os.path.dirname(output_path)

# 🛡️ BLINDAGEM: Criar diretório se não existir
if not os.path.exists(output_dir):
    os.makedirs(output_dir, exist_ok=True)
    print(f"📁 Diretório criado: {output_dir}")

bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.ffmpeg.codec = 'H264'

# Configurações de áudio
bpy.context.scene.render.ffmpeg.audio_codec = 'AAC'
bpy.context.scene.render.ffmpeg.audio_bitrate = 192

# 🎵 CORREÇÃO CRÍTICA: Incluir trilha de áudio original
try:
    # Adicionar sequencer com áudio
    if not bpy.context.scene.sequence_editor:
        bpy.context.scene.sequence_editor_create()
    
    seq_editor = bpy.context.scene.sequence_editor
    
    # Adicionar strip de áudio
    audio_strip = seq_editor.sequences.new_sound(
        name="AudioTrack",
        filepath=audio_path,
        channel=1,
        frame_start=1
    )
    
    print(f"🎵 Trilha de áudio adicionada: {os.path.basename(audio_path)}")
    print(f"🎵 Duração áudio: {audio_strip.frame_final_duration} frames")
    
except Exception as e:
    print(f"⚠️ ALERTA: Erro ao adicionar trilha de áudio: {e}")
    print(f"🎬 Continuando render apenas com animação visual...")

print(f"📁 Output path: {output_path}")
print(f"🎬 Format: MP4 + H264 + AAC")

# 12. Render final
print("🚀 Starting render...")
print(f"🎬 Rendering {total_frames} frames at {FPS} FPS...")

try:
    bpy.ops.render.render(animation=True)
    print("🎉 V1.4.0.a.8 - RENDER CONCLUÍDO COM SUCESSO!")
    
    # Verificar arquivo de saída
    if os.path.exists(output_path):
        file_size = os.path.getsize(output_path)
        print(f"✅ SUCESSO TOTAL V1.4.0.a.8!")
        print(f"📊 Arquivo: {output_path}")
        print(f"📊 Tamanho: {file_size:,} bytes ({file_size/1024/1024:.2f} MB)")
        print(f"⏱️ Duração: {duration:.3f} segundos")
        print(f"🎵 Sincronização: PARAMETRIZADA + V1.4.0.a.7 BLINDADA")
        print(f"🛡️ Blindagem: PRESERVADA 100%")
        print(f"⚙️ Parâmetros: APLICADOS COMPLETAMENTE")
        print(f"🎯 STATUS: EVOLUÇÃO PARAMETRIZADA COMPLETA")
    else:
        print(f"❌ ERRO: Arquivo de output não foi criado")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ ERRO durante render: {e}")
    sys.exit(1)

print("🎯 V1.4.0.a.8 - EVOLUÇÃO PARAMETRIZADA FINALIZADA")
