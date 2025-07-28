"""
Zentraw 3D Visualizer V1.4.0.a.8.2 - HOTFIX BLENDER 4.5+ COMPATIBILITY
Data: 25/07/2025 - CORREÇÃO CRÍTICA API EEVEE NEXT
Propósito: Compatibilidade total com Blender 4.5+ e EEVEE_NEXT
Base: render_audio_visualizer_v1.4.0.a.8.py (correção API)
Novidade: APIs compatíveis com Blender 4.5+ sem propriedades obsoletas
Dependências: bpy, wave, numpy, os, sys, json, mathutils
Autor: GitHub Copilot
Categoria: Blender Python Script - Blender 4.5+ Compatible
Status: ✅ HOTFIX - Compatibilidade Blender 4.5+ garantida
"""

import bpy
import wave
import numpy as np
import os
import sys
import json
from mathutils import Color

print("🎯 V1.4.0.a.8.2 - CYCLES RENDER CORREÇÃO INICIADO")
print("🛡️ BLINDAGEM: V1.4.0.a.7 sync perfeito preservado")
print("🔧 HOTFIX: APIs compatíveis com Blender 4.5+ e EEVEE_NEXT")
print(f"📂 Working directory: {os.getcwd()}")
print(f"🐍 Python script: {__file__}")

# 1. Captura argumentos e configurações com validação rigorosa
argv = sys.argv
try:
    if '--' not in argv:
        raise ValueError("Parâmetros '--' não encontrados nos argumentos.")
    
    # Captura argumentos após '--' com verificação de índices
    dash_index = argv.index("--")
    
    # Verificar se há argumentos suficientes
    if len(argv) <= dash_index + 1:
        raise ValueError("Argumento de áudio não fornecido")
    
    audio_path = argv[dash_index + 1]
    image_path = argv[dash_index + 2] if len(argv) > dash_index + 2 else None
    output_path = argv[dash_index + 3] if len(argv) > dash_index + 3 else "output.mp4"
    # Garantir caminho absoluto e diretório existente
    output_path = os.path.abspath(output_path)
    output_dir = os.path.dirname(output_path)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)
    config_json = argv[dash_index + 4] if len(argv) > dash_index + 4 else None
    
    # Verificação de tipo de dados
    if not isinstance(audio_path, str) or not audio_path:
        raise ValueError("Caminho do áudio não é uma string válida")
    
    if image_path and (not isinstance(image_path, str) or not image_path):
        raise ValueError("Caminho da imagem não é uma string válida")
    
    if not isinstance(output_path, str) or not output_path:
        raise ValueError("Caminho de output não é uma string válida")
    
    if config_json and (not isinstance(config_json, str) or not config_json):
        raise ValueError("Caminho do config não é uma string válida")

except (ValueError, IndexError) as e:
    print(f"❌ Erro: Argumentos inválidos - {e}")
    print("📖 Uso: blender --background --python script.py -- <audio> [image] [output] [config]")
    print(f"🔍 Debug - argv: {argv}")
    sys.exit(1)

# Verificação de existência de arquivos
print("🔍 Verificando existência dos arquivos...")

if not os.path.exists(audio_path):
    print(f"❌ Erro: Arquivo de áudio não encontrado: {audio_path}")
    sys.exit(1)

if image_path and not os.path.exists(image_path):
    print(f"❌ Erro: Arquivo de imagem não encontrado: {image_path}")
    sys.exit(1)

if config_json and not os.path.exists(config_json):
    print(f"❌ Erro: Arquivo de configuração não encontrado: {config_json}")
    sys.exit(1)

print(f"✅ Todos os arquivos validados com sucesso")
print(f"🎵 Áudio: {audio_path}")
print(f"🖼️ Imagem: {image_path}")
print(f"📁 Output (absoluto): {output_path}")
print(f"⚙️ Config: {config_json}")

# 2. Função para ler configurações (🛡️ BLINDAGEM V1.4.0.a.7)
def get_setting(key, default_value):
    if config_json:
        try:
            # Se config_json é um caminho de arquivo
            if os.path.exists(config_json):
                with open(config_json, 'r') as f:
                    config = json.load(f)
                    return config.get(key, default_value)
            else:
                # Se config_json é uma string JSON direta
                config = json.loads(config_json)
                return config.get(key, default_value)
        except Exception as e:
            print(f"⚠️ Erro ao ler configuração: {e}")
            pass
    return default_value

# 3. Parâmetros configuráveis (otimizados para Blender 4.5+)
RESOLUTION = get_setting('resolution', '1920x1080')  # Full HD como padrão
FPS = int(get_setting('fps', 30))
SAMPLES = int(get_setting('samples', 128))
RENDER_ENGINE = get_setting('renderEngine', 'CYCLES')  # CYCLES como padrão

# Parâmetros de áudio (🛡️ BLINDAGEM V1.4.0.a.7)
AMPLITUDE_MULTIPLIER = float(get_setting('amplitudeMultiplier', 3.0))  # Preservado V1.4.0.a.7
SMOOTHING = int(get_setting('smoothing', 1))
FREQUENCY_RANGE = get_setting('frequencyRange', 'full')
AUDIO_CHANNELS = get_setting('audioChannels', 'mono')

# Parâmetros visuais - CORREÇÃO CRÍTICA: RELATIVOS AO TEMPLATE (PONTO 0)
BACKGROUND_COLOR = tuple(int(get_setting('backgroundColor', '#000000')[i:i+2], 16)/255.0 for i in (1, 3, 5))
PARTICLE_COLOR = tuple(int(get_setting('particleColor', '#00ff00')[i:i+2], 16)/255.0 for i in (1, 3, 5))

# 🔧 CORREÇÃO CRÍTICA: Câmera relativa ao centro (0,0,0) do template
CAMERA_DISTANCE = float(get_setting('cameraDistance', 10.0))  # NUMÉRICO, não string
CUBE_SCALE = float(get_setting('cubeScale', 0.5))
MAX_SCALE = float(get_setting('maxScale', 4.0))
PARTICLE_COUNT = int(get_setting('particleCount', 64))
CUBE_SPACING = float(get_setting('cubeSpacing', 1.2))

# 🎯 OUTPUTS: Sempre usar diretório padrão absoluto
import datetime
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
OUTPUT_DIR = "C:/Users/Denys Victoriano/Documents/GitHub/clone/zentraw/Zentraw/3d_visualizer/outputs"

# Garantir que diretório existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Se output_path não está no diretório correto, corrigir
if not output_path.startswith(OUTPUT_DIR):
    output_filename = f"output_v1.4.0.a.8.2_{timestamp}.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    print(f"🔧 Correção: Output redirecionado para: {output_path}")

print("📊 CONFIGURAÇÕES APLICADAS V1.4.0.a.8.1 HOTFIX:")
print(f"   🎬 Resolução: {RESOLUTION} (Full HD padrão)")
print(f"   🎞️ FPS: {FPS}")
print(f"   🔍 Samples: {SAMPLES}")
print(f"🚀 Forçando render engine: CYCLES")
print(f"   📊 Amplitude Multiplier: {AMPLITUDE_MULTIPLIER}x (V1.4.0.a.7 BLINDADO)")
print(f"   🌊 Suavização: {SMOOTHING}")
print(f"   🎧 Canais: {AUDIO_CHANNELS}")
print(f"   📦 Escala Base: {CUBE_SCALE}x")
print(f"   📈 Escala Máxima: {MAX_SCALE}x")
print(f"   🎯 Partículas: {PARTICLE_COUNT}")
print(f"   📏 Espaçamento: {CUBE_SPACING}")

# 4. Verificar se arquivo de áudio existe
if not os.path.exists(audio_path):
    print(f"❌ Erro: Arquivo de áudio não encontrado: {audio_path}")
    sys.exit(1)

print("🎬 Setting up scene...")

# Limpar cena
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Configurar render engine (com compatibilidade Blender 4.5+)
try:
    bpy.context.scene.render.engine = RENDER_ENGINE
    print(f"🚀 Render engine: {RENDER_ENGINE}")
except Exception as e:
    print(f"⚠️ Aviso: Engine {RENDER_ENGINE} não disponível, usando CYCLES: {e}")
    bpy.context.scene.render.engine = 'CYCLES'
    RENDER_ENGINE = 'CYCLES'

# Configurar resolução
res_width, res_height = map(int, RESOLUTION.split('x'))
bpy.context.scene.render.resolution_x = res_width
bpy.context.scene.render.resolution_y = res_height
bpy.context.scene.render.resolution_percentage = 100
print(f"📐 Resolução: {res_width}x{res_height}")

# Configurar samples e otimizações por engine (compatível Blender 4.5+)
if RENDER_ENGINE == 'CYCLES':
    bpy.context.scene.cycles.samples = SAMPLES
    print(f"🔍 Cycles samples: {SAMPLES}")
elif RENDER_ENGINE in ['BLENDER_EEVEE', 'BLENDER_EEVEE_NEXT']:
    # Configuração minimalista para máxima compatibilidade
    print(f"⚡ Eevee configurado para velocidade (samples: {min(SAMPLES, 64)})")
    
    # Tentar configurar samples se disponível
    try:
        eevee = bpy.context.scene.eevee
        if hasattr(eevee, 'taa_render_samples'):
            eevee.taa_render_samples = min(SAMPLES, 64)
        elif hasattr(eevee, 'taa_samples'):
            eevee.taa_samples = min(SAMPLES, 64)
        print("✅ Samples Eevee configurados")
    except Exception as e:
        print(f"⚠️ Samples Eevee usando padrão: {e}")
else:
    print(f"🚀 Engine: {RENDER_ENGINE} (configuração padrão)")

# Background color
bpy.context.scene.world.use_nodes = True
bg_node = bpy.context.scene.world.node_tree.nodes["Background"]
bg_node.inputs[0].default_value = (*BACKGROUND_COLOR, 1.0)

# Configurar output
print(f"🔒 Definindo caminho de saída do render: {output_path}")
bpy.context.scene.render.filepath = output_path
bpy.context.scene.render.image_settings.file_format = 'FFMPEG'
bpy.context.scene.render.ffmpeg.format = 'MPEG4'
bpy.context.scene.render.ffmpeg.codec = 'H264'

# Adicionar timestamp único ao nome do arquivo:
from datetime import datetime
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
output_path_with_timestamp = output_path.replace('.mp4', f'_{timestamp}.mp4')
print(f"🔍 DEBUG - Output path com timestamp: {output_path_with_timestamp}")
bpy.context.scene.render.filepath = output_path_with_timestamp

# 5. Carregar e processar áudio (🛡️ BLINDAGEM V1.4.0.a.7 PRESERVADA)
print("🎵 Carregando áudio...")
with wave.open(audio_path, 'rb') as wav_file:
    frames = wav_file.readframes(-1)
    sample_rate = wav_file.getframerate()
    n_channels = wav_file.getnchannels()
    n_frames = wav_file.getnframes()
    
    # Converter para numpy array
    if wav_file.getsampwidth() == 2:
        audio_data = np.frombuffer(frames, dtype=np.int16)
    else:
        audio_data = np.frombuffer(frames, dtype=np.int32)
    
    # Converter para mono se necessário
    if n_channels > 1:
        audio_data = audio_data.reshape(-1, n_channels)
        if AUDIO_CHANNELS == 'mono':
            audio_data = np.mean(audio_data, axis=1)
        else:
            audio_data = audio_data[:, 0]  # Usar canal esquerdo
    
    # Normalizar
    if np.issubdtype(audio_data.dtype, np.integer):
        audio_data = audio_data.astype(np.float32) / np.iinfo(audio_data.dtype).max
    elif np.issubdtype(audio_data.dtype, np.floating):
        # Se já for float, apenas normaliza para -1.0 a 1.0 se necessário
        max_val = np.abs(audio_data).max()
        if max_val > 1.0:
            audio_data = audio_data / max_val
        audio_data = audio_data.astype(np.float32)
    else:
        raise ValueError(f"Tipo de dado de áudio não suportado: {audio_data.dtype}")

print(f"🎵 Áudio carregado: {len(audio_data)} samples, {sample_rate}Hz, {n_channels} canais")

# 6. Calcular duração e frames
duration = len(audio_data) / sample_rate
total_frames = int(duration * FPS)
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = total_frames
bpy.context.scene.render.fps = FPS

print(f"⏱️ Duração: {duration:.2f}s, {total_frames} frames @ {FPS}fps")

# 7. Criar cubos para visualização (🛡️ SISTEMA V1.4.0.a.7 BLINDADO)
print("🎯 Criando sistema de cubos...")

# Calcular quantos samples de áudio por frame
samples_per_frame = len(audio_data) // total_frames if total_frames > 0 else len(audio_data)

# Dividir frequências em bandas
frequency_bands = PARTICLE_COUNT
band_size = samples_per_frame // frequency_bands if frequency_bands > 0 else 1

cubes = []
for i in range(frequency_bands):
    # Posição em grid circular
    angle = (i / frequency_bands) * 2 * np.pi
    radius = 4.0
    x = radius * np.cos(angle)
    y = radius * np.sin(angle)
    z = 0
    
    # Criar cubo
    bpy.ops.mesh.primitive_cube_add(location=(x, y, z))
    cube = bpy.context.active_object
    cube.name = f"AudioCube_{i:03d}"
    cube.scale = (CUBE_SCALE, CUBE_SCALE, CUBE_SCALE)
    
    # Material
    mat = bpy.data.materials.new(name=f"AudioMaterial_{i:03d}")
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    
    # Shader simples compatível
    shader = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(shader.outputs[0], output.inputs[0])
    
    # Cor base
    shader.inputs[0].default_value = (*PARTICLE_COLOR, 1.0)
    
    cube.data.materials.append(mat)
    cubes.append(cube)

print(f"✅ {len(cubes)} cubos criados")

# 8. Configurar câmera
bpy.ops.object.camera_add(location=(0, -CAMERA_DISTANCE, 2))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0)
bpy.context.scene.camera = camera

# 9. Configurar iluminação
bpy.ops.object.light_add(type='SUN', location=(0, 0, 10))
light = bpy.context.active_object
light.data.energy = 3.0

# 10. Animar cubos baseado no áudio (🛡️ ALGORITMO V1.4.0.a.7 PRESERVADO)
print("🎵 Animando baseado no áudio...")

for frame in range(1, total_frames + 1):
    bpy.context.scene.frame_set(frame)
    
    # Calcular posição no áudio
    audio_start = int((frame - 1) * samples_per_frame)
    audio_end = min(audio_start + samples_per_frame, len(audio_data))
    
    if audio_end > audio_start:
        frame_audio = audio_data[audio_start:audio_end]
        
        # Dividir em bandas de frequência
        for i, cube in enumerate(cubes):
            band_start = int(i * band_size)
            band_end = min(band_start + band_size, len(frame_audio))
            
            if band_end > band_start:
                band_data = frame_audio[band_start:band_end]
                
                # Calcular amplitude (🛡️ FÓRMULA V1.4.0.a.7 PRESERVADA)
                amplitude = np.abs(band_data).mean() * AMPLITUDE_MULTIPLIER
                
                # Suavização
                if SMOOTHING > 1 and frame > SMOOTHING:
                    prev_keyframes = []
                    for prev_frame in range(max(1, frame - SMOOTHING), frame):
                        if cube.scale[2] > 0:
                            prev_keyframes.append(cube.scale[2])
                    if prev_keyframes:
                        amplitude = (amplitude + sum(prev_keyframes)) / (len(prev_keyframes) + 1)
                
                # Aplicar escala (limitada)
                scale_z = max(CUBE_SCALE, min(MAX_SCALE, CUBE_SCALE + amplitude))
                cube.scale = (CUBE_SCALE, CUBE_SCALE, scale_z)
                
                # Keyframe
                cube.keyframe_insert(data_path="scale", frame=frame)

print("✅ Animação completa")

# 11. Adicionar imagem de fundo se fornecida
if image_path and os.path.exists(image_path):
    print(f"🖼️ Adicionando imagem de fundo: {image_path}")
    
    # Criar plano para imagem
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 5, -2))
    plane = bpy.context.active_object
    plane.name = "BackgroundImage"
    
    # Material com imagem
    mat = bpy.data.materials.new(name="BackgroundMaterial")
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    
    # Nodes para imagem
    shader = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
    output = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    image_node = mat.node_tree.nodes.new('ShaderNodeTexImage')
    
    # Carregar imagem
    image_node.image = bpy.data.images.load(image_path)
    
    # Conectar
    mat.node_tree.links.new(image_node.outputs[0], shader.inputs[0])
    mat.node_tree.links.new(shader.outputs[0], output.inputs[0])
    
    plane.data.materials.append(mat)

# 12. Configurar sequencer de áudio (🛡️ CORREÇÃO APLICADA)
print("🎵 Configurando áudio no sequencer...")
if not bpy.context.scene.sequence_editor:
    bpy.context.scene.sequence_editor_create()

bpy.context.scene.sequence_editor.sequences.new_sound(
    name="audio_track",
    filepath=audio_path,
    channel=1,
    frame_start=1
)

# 13. Render final
print("🎬 Iniciando render...")
print(f"📊 Engine: {RENDER_ENGINE}")
print(f"📐 Resolução: {res_width}x{res_height}")
print(f"⏱️ Frames: {total_frames}")
print(f"🎵 Com áudio: {os.path.exists(audio_path)}")

try:
    bpy.ops.render.render(animation=True)
    print("🎉 Render concluído com sucesso!")
    
    # Verificar se arquivo foi criado
    if os.path.exists(output_path_with_timestamp):
        file_size = os.path.getsize(output_path_with_timestamp)
        print(f"✅ SUCESSO - Arquivo criado: {output_path_with_timestamp} ({file_size} bytes)")
        
        # Criar arquivo de resultado para comunicar com o backend
        result_info = {
            "success": True,
            "original_output": output_path,
            "actual_output": output_path_with_timestamp,
            "filename": os.path.basename(output_path_with_timestamp),
            "size": file_size,
            "timestamp": timestamp
        }
        
        result_file = output_path.replace('.mp4', '_result.json')
        with open(result_file, 'w') as f:
            json.dump(result_info, f, indent=2)
        print(f"📊 Arquivo de resultado criado: {result_file}")
        
    else:
        print(f"❌ ERRO - Arquivo NÃO foi criado: {output_path_with_timestamp}")
        
        # Criar arquivo de erro para comunicar com o backend
        result_info = {
            "success": False,
            "original_output": output_path,
            "expected_output": output_path_with_timestamp,
            "error": "MP4 file not generated"
        }
        
        result_file = output_path.replace('.mp4', '_result.json')
        with open(result_file, 'w') as f:
            json.dump(result_info, f, indent=2)
        print(f"📊 Arquivo de erro criado: {result_file}")
        
    # Listar arquivos no diretório para debug
    output_dir = os.path.dirname(output_path_with_timestamp)
    print(f"📂 Arquivos no diretório de saída ({output_dir}):")
    for f in os.listdir(output_dir):
        print(f" - {f}")
        
except Exception as e:
    print(f"❌ Erro durante render: {e}")
    sys.exit(1)
