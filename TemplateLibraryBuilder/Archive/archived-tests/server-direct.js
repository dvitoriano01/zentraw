import express from 'express';
import multer from 'multer';
import { BlenderServiceRobustV2 } from './server/services/blender-service-robust-v2.ts';
import { BLENDER_PATHS } from './server/blender-paths.ts';
import path from 'path';

console.log('🔥 ZENTRAW 3D VISUALIZER - DIRECT REAL BACKEND STARTING...');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint called - DIRECT VERSION');
  
  const response = {
    success: true,
    message: 'Zentraw 3D Visualizer V1.4.0.a.2 - DIRECT REAL BACKEND!',
    timestamp: new Date().toISOString(),
    features: [
      'executeAudioVisualizerWithFallback method - DIRECT',
      'BlenderServiceRobustV2 - DIRECT ACCESS',
      'Multiple execution strategies - DIRECT',
      'Full HD MP4 output - DIRECT',
      'Audio-visual synchronization - DIRECT'
    ]
  };
  
  res.json(response);
});

// DIRECT Visualizer endpoint using BlenderServiceRobustV2
app.post('/api/blender/audio-visualizer', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🔥 DIRECT REAL VISUALIZER REQUEST RECEIVED!');
    
    const audioFile = req.files?.audioFile?.[0];
    const imageFile = req.files?.imageFile?.[0];
    
    if (!audioFile || !imageFile) {
      return res.status(400).json({ 
        success: false, 
        error: 'Audio e imagem são necessários' 
      });
    }
    
    console.log('📊 Files received:', { 
      audio: audioFile.originalname, 
      image: imageFile.originalname,
      audioPath: audioFile.path,
      imagePath: imageFile.path
    });
    
    // CHAMAR DIRETAMENTE O BlenderServiceRobustV2.executeAudioVisualizerWithFallback!
    console.log('🔥 Calling DIRECT BlenderServiceRobustV2.executeAudioVisualizerWithFallback...');
    
    const outputPath = path.join(process.cwd(), 'uploads', `visualizer_${Date.now()}.mp4`);
    
    const options = {
      blenderPath: BLENDER_PATHS.BLENDER_EXECUTABLE,
      templatePath: BLENDER_PATHS.TEMPLATE_BLEND,
      scriptPath: BLENDER_PATHS.SCRIPT_PATH,
      audioPath: path.resolve(audioFile.path),
      imagePath: path.resolve(imageFile.path),
      outputPath: outputPath
    };
    
    console.log('🎯 Calling with options:', options);
    
    const result = await BlenderServiceRobustV2.executeAudioVisualizerWithFallback(options);
    
    console.log('🎯 DIRECT Result from BlenderServiceRobustV2:', result);
    
    res.json(result);
    
  } catch (error) {
    console.error('💥 DIRECT Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`🚀 DIRECT REAL Backend running on http://localhost:${PORT}`);
  console.log('🔥 This calls BlenderServiceRobustV2.executeAudioVisualizerWithFallback DIRECTLY!');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/blender/audio-visualizer`);
  console.log('');
  console.log('✅ READY FOR DIRECT BLENDER EXECUTION!');
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
});
