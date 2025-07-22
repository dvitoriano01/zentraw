import path from 'path';

export const BLENDER_PATHS = {
  // ✅ SOLUÇÃO IMPLEMENTADA: Blender copiado para pasta sem espaços
  BLENDER_EXE: 'C:\\Blender\\blender.exe',
  
  // ⚠️ FALLBACK: Path original (caso seja necessário)
  BLENDER_EXE_ORIGINAL: 'C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe',
  
  // Outros paths mantidos
  SCRIPT_PATH: path.join(process.cwd(), 'Blender', 'render_audio_visualizer.py'),
  TEMPLATE_PATH: path.join(process.cwd(), 'Blender', 'template.blend')
};

// 🧪 VERIFICAÇÃO DE EXISTÊNCIA DOS CAMINHOS
import fs from 'fs';

console.log('🔄 BLENDER_PATHS loaded - verificando caminhos...');
console.log('📁 Template path:', BLENDER_PATHS.TEMPLATE_PATH);

// Verificar se o novo caminho do Blender existe
if (fs.existsSync(BLENDER_PATHS.BLENDER_EXE)) {
  console.log('✅ Blender encontrado em:', BLENDER_PATHS.BLENDER_EXE);
} else {
  console.log('❌ Blender NÃO encontrado em:', BLENDER_PATHS.BLENDER_EXE);
  console.log('🔄 Verificando caminho original...');
  
  if (fs.existsSync(BLENDER_PATHS.BLENDER_EXE_ORIGINAL)) {
    console.log('⚠️ Blender encontrado no caminho original:', BLENDER_PATHS.BLENDER_EXE_ORIGINAL);
    console.log('💡 Sugestão: Copie o Blender para C:\\Blender\\ para resolver problemas de path');
  } else {
    console.log('❌ Blender não encontrado em nenhum dos caminhos!');
  }
}
