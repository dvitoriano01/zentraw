import path from 'path';
import fs from 'fs';

// Configuração de paths principal
const MAIN_BLENDER_PATH = 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe';

// Configuração de paths alternativos para Windows
const ALTERNATIVE_PATHS = [
  'C:\\PROGRA~1\\BLENDE~1\\BLENDE~1\\blender.exe',  // Path curto 8.3
  'C:\\Blender\\blender.exe',                        // Path sem espaços
  'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe'  // Path original
];

// Função para encontrar o path funcional do Blender
function findWorkingBlenderPath(): string {
  for (const testPath of ALTERNATIVE_PATHS) {
    if (fs.existsSync(testPath)) {
      console.log(`✅ Found working Blender path: ${testPath}`);
      return testPath;
    }
  }
  
  console.warn('⚠️ No working Blender path found, using default');
  return MAIN_BLENDER_PATH;
}

export const BLENDER_PATHS = {
  BLENDER_EXE: findWorkingBlenderPath(),
  SCRIPT_PATH: path.join(process.cwd(), 'Blender', 'render_audio_visualizer.py'),
  TEMPLATE_PATH: path.join(process.cwd(), 'Blender', 'template.blend')
};

// Debug information
console.log('🔄 BLENDER_PATHS configuration:');
console.log('📍 Blender executable:', BLENDER_PATHS.BLENDER_EXE);
console.log('📍 Script path:', BLENDER_PATHS.SCRIPT_PATH);
console.log('📍 Template path:', BLENDER_PATHS.TEMPLATE_PATH);
console.log('📍 Paths exist check:');
console.log('   Blender:', fs.existsSync(BLENDER_PATHS.BLENDER_EXE));
console.log('   Script:', fs.existsSync(BLENDER_PATHS.SCRIPT_PATH));
console.log('   Template:', fs.existsSync(BLENDER_PATHS.TEMPLATE_PATH));
