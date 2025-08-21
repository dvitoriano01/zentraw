import express from 'express';
import { BlenderServiceComplete } from './services/blender-service-complete.js';

const app = express();
const port = 5002;

app.use(express.json());

// Middleware de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rota de teste completa
app.get('/api/blender/test-complete', async (req, res) => {
  try {
    console.log('🔍 Testing complete Blender service...');
    
    const workingMethod = await BlenderServiceComplete.testAllMethods();
    const isWorking = await BlenderServiceComplete.testBlenderInstallation();
    
    res.json({
      success: true,
      workingMethod,
      isWorking,
      message: `Blender working with method: ${workingMethod}`
    });
  } catch (error) {
    console.error('❌ Complete test failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rota de preview
app.post('/api/blender/generate-preview', async (req, res) => {
  try {
    console.log('🎬 Generating preview...');
    
    const service = new BlenderServiceComplete();
    const result = await service.generatePreview({
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
    
    res.json(result);
  } catch (error) {
    console.error('❌ Preview generation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
  console.log(`🧪 Test endpoint: http://localhost:${port}/api/blender/test-complete`);
  console.log(`🎬 Preview endpoint: http://localhost:${port}/api/blender/generate-preview`);
});
