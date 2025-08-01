import bpy
import sys
import os
import wave
import numpy as np
import logging
from pathlib import Path
import json

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler('render_log_v1.4.0.a.9.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Parâmetros padrão e limites
DEFAULT_PARAMS = {
    "amplitude_multiplier": 3.0,  # Multiplicador de amplitude
    "cube_base_scale": 1.0,       # Escala base do cubo
    "cube_max_scale": 3.0,        # Escala máxima nos picos
    "camera_distance": 10.0,      # Distância da câmera
    "camera_offset_x": 0.0,       # Offset X da câmera
    "camera_offset_y": 0.0,       # Offset Y da câmera
    "camera_offset_z": 0.0,       # Offset Z da câmera
    "camera_zoom": 1.0,           # Zoom da câmera
    "light_intensity": 1000.0,    # Intensidade da luz
    "background_color": [1.0, 1.0, 1.0, 1.0],  # Cor de fundo (RGBA)
    "cube_color": [0.8, 0.8, 0.8, 1.0]        # Cor do cubo (RGBA)
}

PARAM_RANGES = {
    "amplitude_multiplier": (1.0, 5.0),
    "cube_base_scale": (0.5, 2.0),
    "cube_max_scale": (1.0, 5.0),
    "camera_distance": (5.0, 15.0),
    "camera_offset_x": (-5.0, 5.0),
    "camera_offset_y": (-5.0, 5.0),
    "camera_offset_z": (-5.0, 5.0),
    "camera_zoom": (0.5, 2.0),
    "light_intensity": (500.0, 2000.0),
    "background_color": (0.0, 1.0),  # Por canal RGBA
    "cube_color": (0.0, 1.0)         # Por canal RGBA
}

def validate_path(file_path, description):
    """Valida se o caminho existe e é uma string válida."""
    if not isinstance(file_path, str):
        logger.error(f"{description} não é uma string válida: {file_path}")
        raise ValueError(f"{description} deve ser uma string")
    path = Path(file_path).resolve()
    if not path.exists():
        logger.error(f"{description} não encontrado: {path}")
        raise FileNotFoundError(f"{description} não encontrado: {path}")
    logger.info(f"{description} validado: {path}")
    return str(path)

def validate_params(params):
    """Valida os parâmetros e aplica limites."""
    validated_params = DEFAULT_PARAMS.copy()
    for key, value in params.items():
        if key not in DEFAULT_PARAMS:
            logger.warning(f"Parâmetro desconhecido: {key}, ignorando")
            continue
        if key in ["background_color", "cube_color"]:
            if not isinstance(value, list) or len(value) != 4:
                logger.error(f"{key} deve ser uma lista RGBA com 4 valores")
                raise ValueError(f"{key} inválido")
            for i, val in enumerate(value):
                value[i] = max(PARAM_RANGES[key][0], min(PARAM_RANGES[key][1], val))
        else:
            min_val, max_val = PARAM_RANGES[key]
            validated_params[key] = max(min_val, min(max_val, value))
    logger.info(f"Parâmetros validados: {validated_params}")
    return validated_params

def process_audio(audio_path):
    """Processa o arquivo de áudio e retorna samples mono."""
    logger.info(f"Iniciando processamento de áudio: {audio_path}")
    try:
        with wave.open(audio_path, 'rb') as wf:
            sr = wf.getframerate()
            nframes = wf.getnframes()
            channels = wf.getnchannels()
            frames = wf.readframes(nframes)
        logger.info(f"Áudio lido: {sr} Hz, {nframes} frames, {channels} canais")

        # Converte para numpy array
        samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
        if channels == 2:
            logger.info("Correção stereo: usando apenas canal esquerdo")
            samples = samples[::2]  # Usa apenas o canal esquerdo
        else:
            logger.info("Áudio mono detectado")

        duration = nframes / sr
        logger.info(f"Duração do áudio: {duration:.3f} segundos")
        return samples, sr, duration
    except Exception as e:
        logger.error(f"Erro ao processar áudio: {str(e)}")
        raise

def setup_blender_scene(audio_path, image_path, output_path, params, fps=30, resolution=(1920, 1080)):
    """Configura a cena do Blender com parâmetros validados."""
    logger.info("Configurando cena do Blender")
    try:
        # Limpa a cena e carrega template
        bpy.ops.wm.open_mainfile(filepath=validate_path("template.blend", "Arquivo de template"))
        scene = bpy.context.scene
        scene.render.engine = 'BLENDER_EEVEE'
        scene.render.resolution_x = resolution[0]
        scene.render.resolution_y = resolution[1]
        scene.render.fps = fps
        scene.render.image_settings.file_format = 'FFMPEG'
        scene.render.ffmpeg.format = 'MPEG4'
        scene.render.ffmpeg.codec = 'H264'
        scene.render.ffmpeg.audio_codec = 'AAC'
        scene.render.ffmpeg.audio_bitrate = 192
        scene.render.filepath = output_path

        # Adiciona áudio à cena
        scene.sequence_editor_create()
        seq = scene.sequence_editor.sequences.new_sound(
            name="AudioTrack",
            filepath=audio_path,
            channel=1,
            frame_start=1
        )
        seq.frame_final_duration = int(params["duration"] * fps)

        # Configura cubo
        cube = bpy.data.objects.get("VisualizerCube") or bpy.ops.mesh.primitive_cube_add(size=params["cube_base_scale"], location=(0, 0, 0))[0]
        cube.name = "VisualizerCube"

        # Configura material do cubo
        mat = bpy.data.materials.new(name="CubeMaterial")
        mat.use_nodes = True
        cube.data.materials.append(mat)
        nodes = mat.node_tree.nodes
        principled = nodes.get("Principled BSDF")
        principled.inputs["Base Color"].default_value = params["cube_color"]

        # Processa áudio para animação
        samples, sr, duration = process_audio(audio_path)
        scene.frame_end = int(duration * fps)
        params["duration"] = duration

        # Anima cubo com base na amplitude
        samples_per_frame = sr // fps
        for frame in range(scene.frame_end):
            sample_idx = frame * samples_per_frame
            if sample_idx < len(samples):
                amplitude = abs(samples[sample_idx]) / 32768.0 * params["amplitude_multiplier"]
                scale_z = params["cube_base_scale"] + min(amplitude, params["cube_max_scale"] - params["cube_base_scale"])
                cube.scale = (params["cube_base_scale"], params["cube_base_scale"], scale_z)
                cube.keyframe_insert(data_path="scale", frame=frame)

        # Configura câmera
        camera = bpy.data.objects.get("Camera") or bpy.ops.object.camera_add(location=(params["camera_offset_x"], params["camera_offset_y"], params["camera_distance"] + params["camera_offset_z"]))[0]
        scene.camera = camera
        camera.data.lens = 50 / params["camera_zoom"]  # Ajusta zoom

        # Configura luz
        light = bpy.data.objects.get("Light") or bpy.ops.object.light_add(type='POINT', location=(0, 0, 5))[0]
        light.data.energy = params["light_intensity"]

        # Configura fundo
        world = scene.world
        world.use_nodes = True
        bg_node = world.node_tree.nodes.get("Background")
        bg_node.inputs["Color"].default_value = params["background_color"]

        # Adiciona imagem como fundo (se fornecida)
        if image_path:
            img = bpy.data.images.load(image_path)
            mat = bpy.data.materials.new(name="BackgroundMaterial")
            mat.use_nodes = True
            nodes = mat.node_tree.nodes
            tex = nodes.new('ShaderNodeTexImage')
            tex.image = img
            nodes['Principled BSDF'].inputs['Base Color'].default_value = (1, 1, 1, 1)
            mat.node_tree.links.new(tex.outputs['Color'], nodes['Principled BSDF'].inputs['Base Color'])

        logger.info("Cena configurada com sucesso")
        return duration
    except Exception as e:
        logger.error(f"Erro ao configurar cena: {str(e)}")
        raise

def render_scene(output_path):
    """Renderiza a cena e valida a saída."""
    logger.info(f"Iniciando renderização para: {output_path}")
    try:
        bpy.ops.render.render(animation=True)
        output_file = Path(output_path).resolve()
        if output_file.exists() and output_file.stat().st_size > 0:
            logger.info(f"Render concluído com sucesso: {output_file}")
        else:
            logger.error("Arquivo MP4 não foi gerado ou está vazio")
            raise RuntimeError("Falha na geração do arquivo MP4")
    except Exception as e:
        logger.error(f"Erro durante renderização: {str(e)}")
        raise

def main():
    """Função principal."""
    logger.info("🛡️ Iniciando Zentraw 3D Visualizer V1.4.0.a.9")
    try:
        # Obtém argumentos da linha de comando
        argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
        if len(argv) < 3:
            logger.error("Uso: blender template.blend --background --python render_audio_visualizer_v1.4.0.a.9.py -- audio_path image_path output_path [params_json]")
            sys.exit(1)

        audio_path, image_path, output_path = argv[:3]
        params = DEFAULT_PARAMS.copy()
        if len(argv) > 3:
            try:
                params.update(json.loads(argv[3]))
            except json.JSONDecodeError as e:
                logger.error(f"Erro ao parsear parâmetros JSON: {str(e)}")
                sys.exit(1)

        # Valida caminhos
        audio_path = validate_path(audio_path, "Arquivo de áudio")
        image_path = validate_path(image_path, "Imagem de fundo")
        output_dir = validate_path(os.path.dirname(output_path), "Diretório de saída")
        output_path = os.path.join(output_dir, os.path.basename(output_path))

        # Valida parâmetros
        params = validate_params(params)

        # Configura e renderiza
        duration = setup_blender_scene(audio_path, image_path, output_path, params)
        render_scene(output_path)
        logger.info(f"🎉 Renderização concluída com sucesso! Duração: {duration:.3f} segundos")
    except Exception as e:
        logger.error(f"Erro fatal: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()