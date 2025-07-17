import path from 'path';

export const BLENDER_PATHS = {
  BLENDER_EXE: 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe',
  SCRIPT_PATH: path.join(process.cwd(), 'Blender', 'render_audio_visualizer.py'),
  TEMPLATE_PATH: path.join(process.cwd(), 'Blender', 'template.blend')
};

console.log('🔄 BLENDER_PATHS loaded - Template:', BLENDER_PATHS.TEMPLATE_PATH);
