import { createServer } from 'http';
import { parse } from 'url';
import { BlenderServiceV2 } from './server/services/blender-service-v2.ts';
import multer from 'multer';
import express from 'express';

console.log('🎬 ZENTRAW 3D VISUALIZER - REAL BACKEND STARTING...');

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
  console.log('✅ Test endpoint called');
  
  const response = {
    success: true,
    message: 'Zentraw 3D Visualizer V1.4.0.a.2 - REAL BACKEND!',
    timestamp: new Date().toISOString(),
    features: [
      'executeAudioVisualizerWithFallback method - REAL',
      'Multiple execution strategies - REAL',
      '5-minute timeout - REAL',
      'Full HD MP4 output - REAL',
      'Audio-visual synchronization - REAL'
    ]
  };
  
  res.json(response);
});

// REAL Visualizer endpoint
app.post('/api/blender/audio-visualizer', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🎬 REAL VISUALIZER REQUEST RECEIVED!');
    
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
      image: imageFile.originalname 
    });
    
    // CHAMAR O BLENDER SERVICE REAL!
    console.log('🔥 Calling REAL BlenderServiceV2.renderAudioVisualizer...');
    
    const result = await BlenderServiceV2.renderAudioVisualizer(
      audioFile.path,
      imageFile.path
    );
    
    console.log('🎯 REAL Result from BlenderService:', result);
    
    res.json(result);
    
  } catch (error) {
    console.error('💥 REAL Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`🚀 REAL Backend running on http://localhost:${PORT}`);
  console.log('🎬 This will call the ACTUAL BlenderServiceV2!');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/blender/audio-visualizer`);
  console.log('');
  console.log('✅ READY FOR REAL BLENDER EXECUTION!');
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
});
