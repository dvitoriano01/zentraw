import express from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔥 ZENTRAW 3D VISUALIZER - SIMPLE REAL BACKEND STARTING...');

const app = express();
const upload = multer({ dest: 'uploads/' });

// CORS middleware
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

app.use(express.json());

// Configurações do Blender
const BLENDER_CONFIG = {
  BLENDER_EXE: 'C:\\Blender\\blender.exe',
  SCRIPT_PATH: path.resolve('Blender', 'render_audio_visualizer.py'),
  TEMPLATE_PATH: path.resolve('Blender', 'template.blend')
};

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint called');
  
  const response = {
    success: true,
    message: 'Zentraw 3D Visualizer V1.4.0.a.2 - SIMPLE REAL BACKEND!',
    timestamp: new Date().toISOString(),
    blender: {
      exe: BLENDER_CONFIG.BLENDER_EXE,
      script: BLENDER_CONFIG.SCRIPT_PATH,
      template: BLENDER_CONFIG.TEMPLATE_PATH,
      exe_exists: fs.existsSync(BLENDER_CONFIG.BLENDER_EXE),
      script_exists: fs.existsSync(BLENDER_CONFIG.SCRIPT_PATH),
      template_exists: fs.existsSync(BLENDER_CONFIG.TEMPLATE_PATH)
    }
  };
  
  console.log('📋 Blender config check:', response.blender);
  res.json(response);
});

// REAL Visualizer endpoint
app.post('/api/blender/audio-visualizer', upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('🎬 SIMPLE REAL VISUALIZER REQUEST RECEIVED!');
    
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
    
    // Verificar se o Blender existe
    if (!fs.existsSync(BLENDER_CONFIG.BLENDER_EXE)) {
      return res.status(500).json({
        success: false,
        error: `Blender não encontrado em: ${BLENDER_CONFIG.BLENDER_EXE}`
      });
    }
    
    // Verificar se o script Python existe
    if (!fs.existsSync(BLENDER_CONFIG.SCRIPT_PATH)) {
      return res.status(500).json({
        success: false,
        error: `Script Python não encontrado em: ${BLENDER_CONFIG.SCRIPT_PATH}`
      });
    }
    
    // Executar Blender diretamente
    console.log('🔥 Executing REAL Blender...');
    
    const outputPath = path.resolve('uploads', `output_${Date.now()}.mp4`);
    
    const blenderArgs = [
      '--background',
      BLENDER_CONFIG.TEMPLATE_PATH,
      '--python', BLENDER_CONFIG.SCRIPT_PATH,
      '--',
      path.resolve(audioFile.path),
      path.resolve(imageFile.path),
      outputPath
    ];
    
    console.log('🚀 Blender command:', BLENDER_CONFIG.BLENDER_EXE, blenderArgs.join(' '));
    
    const result = await executeBlender(BLENDER_CONFIG.BLENDER_EXE, blenderArgs);
    
    console.log('🎯 Blender execution result:', result);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Visualizer executado com sucesso!',
        output: result.output,
        outputPath: outputPath,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Erro na execução do Blender',
        details: result.error,
        output: result.output
      });
    }
    
  } catch (error) {
    console.error('💥 SIMPLE REAL Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Função para executar o Blender
function executeBlender(blenderPath, args) {
  return new Promise((resolve) => {
    console.log('🎬 Starting Blender process...');
    
    const blenderProcess = spawn(blenderPath, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      timeout: 300000 // 5 minutos
    });
    
    let output = '';
    let errorOutput = '';
    
    blenderProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log('📊 Blender stdout:', text);
    });
    
    blenderProcess.stderr.on('data', (data) => {
      const text = data.toString();
      errorOutput += text;
      console.log('⚠️ Blender stderr:', text);
    });
    
    blenderProcess.on('close', (code) => {
      console.log(`🏁 Blender process exited with code: ${code}`);
      
      if (code === 0) {
        resolve({
          success: true,
          output: output,
          exitCode: code
        });
      } else {
        resolve({
          success: false,
          error: `Blender exited with code ${code}`,
          output: output,
          errorOutput: errorOutput,
          exitCode: code
        });
      }
    });
    
    blenderProcess.on('error', (error) => {
      console.error('💥 Blender process error:', error);
      resolve({
        success: false,
        error: error.message,
        output: output,
        errorOutput: errorOutput
      });
    });
  });
}

const PORT = 3004;

app.listen(PORT, () => {
  console.log(`🚀 SIMPLE REAL Backend running on http://localhost:${PORT}`);
  console.log('🎬 This will execute Blender directly!');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/blender/audio-visualizer`);
  console.log('');
  console.log('✅ READY FOR SIMPLE REAL BLENDER EXECUTION!');
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
});
