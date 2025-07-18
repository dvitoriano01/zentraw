import { BlenderServiceComplete } from './services/blender-service-complete.js';

async function testBlenderComplete() {
  console.log('🔍 Testing Blender Service Complete...');
  
  try {
    // Testa todos os métodos
    const workingMethod = await BlenderServiceComplete.testAllMethods();
    console.log(`✅ Working method: ${workingMethod}`);
    
    // Testa a instalação
    const isWorking = await BlenderServiceComplete.testBlenderInstallation();
    console.log(`✅ Installation test: ${isWorking}`);
    
    if (isWorking) {
      console.log('🎉 Blender is working! All methods tested successfully.');
      
      // Testa preview
      const service = new BlenderServiceComplete();
      const previewResult = await service.generatePreview({
        audioFile: 'test.mp3',
        imageFile: 'test.jpg',
        renderEngine: 'eevee',
        cameraSettings: {
          distance: 10,
          height: 5,
          angle: 45
        },
        animationStyle: 'cube',
        sensitivity: 0.5,
        smoothing: 0.3
      });
      
      console.log('Preview result:', previewResult);
    } else {
      console.log('❌ Blender is not working. Check installation path.');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBlenderComplete();
