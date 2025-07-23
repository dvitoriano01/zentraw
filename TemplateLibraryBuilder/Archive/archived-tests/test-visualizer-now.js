/**
 * 🎬 TESTE IMEDIATO DO VISUALIZADOR 3D V1.4.0.a.2
 * Este script testa diretamente o novo BlenderServiceRobustV2.executeAudioVisualizerWithFallback
 */
import { BlenderServiceRobustV2 } from './server/services/blender-service-robust-v2.ts';
import { BLENDER_PATHS } from './server/config/blender-paths.ts';
import path from 'path';

console.log('🎬🔥 TESTE DIRETO DO VISUALIZADOR 3D REAL! 🔥🎬');

async function testAudioVisualizer() {
  try {
    console.log('📊 Configuração dos caminhos...');
    
    const options = {
      blenderPath: BLENDER_PATHS.BLENDER_EXECUTABLE,
      templatePath: BLENDER_PATHS.TEMPLATE_BLEND,
      scriptPath: BLENDER_PATHS.SCRIPT_PATH,
      audioPath: path.join(process.cwd(), 'test_audio.wav'),
      imagePath: path.join(process.cwd(), 'test_image.jpg'),
      outputPath: path.join(process.cwd(), 'uploads', `visualizer_test_${Date.now()}.mp4`)
    };
    
    console.log('🎯 Options:', options);
    
    // Testar o visualizador real
    console.log('\n🎬 EXECUTANDO VISUALIZADOR REAL...');
    const result = await BlenderServiceRobustV2.executeAudioVisualizerWithFallback(options);
    
    console.log('\n📊 RESULTADO FINAL:');
    console.log('Success:', result.success);
    console.log('Method:', result.method);
    console.log('Strategy:', result.strategy);
    console.log('Output:', result.output);
    console.log('Error:', result.error);
    console.log('Detailed Logs:', result.detailedLogs);
    
    if (result.success) {
      console.log('✅ VISUALIZADOR 3D FUNCIONANDO PERFEITAMENTE!');
    } else {
      console.log('❌ Problema com o visualizador:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Erro no teste:', error);
  }
}

testAudioVisualizer();
