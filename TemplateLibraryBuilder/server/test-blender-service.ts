import { BlenderService } from './services/blender-service.js';

async function testBlenderService() {
  console.log('🔄 Testing Blender Service...');
  
  try {
    // Teste 1: Testar instalação
    console.log('\n1. Testing Blender installation...');
    const isWorking = await BlenderService.testBlenderInstallation();
    console.log(`Result: ${isWorking ? '✅ Working' : '❌ Failed'}`);
    
    if (isWorking) {
      console.log('\n2. Testing preview generation...');
      const blenderService = new BlenderService();
      
      // Criar arquivos de teste se não existirem
      const testOptions = {
        audioFile: 'test-audio.mp3',
        imageFile: 'test-image.jpg',
        renderEngine: 'eevee' as const,
        cameraSettings: {
          distance: 50,
          height: 50,
          angle: 0
        },
        animationStyle: 'cube' as const,
        sensitivity: 50,
        smoothing: 30
      };
      
      const result = await blenderService.generatePreview(testOptions);
      console.log('Preview result:', result);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBlenderService();
