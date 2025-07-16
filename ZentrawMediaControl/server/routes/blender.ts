import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { BlenderService } from '../services/blender-service.js';

const router = express.Router();

// Configurar Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'blender');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}_${timestamp}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limite
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.fieldname === 'audio') {
      // Aceitar arquivos de audio
      if (file.mimetype.startsWith('audio/')) {
        cb(null, true);
      } else {
        cb(new Error('Only audio files are allowed for audio field'));
      }
    } else if (file.fieldname === 'image') {
      // Aceitar arquivos de imagem
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for image field'));
      }
    } else {
      cb(new Error('Unexpected field'));
    }
  }
});

/**
 * POST /api/blender/render
 * Renderiza um audio visualizer 3D
 */
router.post('/render', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files.audio || !files.audio[0]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Audio file is required' 
      });
    }

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image file is required' 
      });
    }

    const audioFile = files.audio[0];
    const imageFile = files.image[0];

    console.log('🎵 [ZentrawMediaControl] Received render request:', {
      audio: audioFile.originalname,
      image: imageFile.originalname,
      audioSize: audioFile.size,
      imageSize: imageFile.size
    });

    // Gerar nome único para o output
    const timestamp = Date.now();
    const outputDir = path.join(process.cwd(), 'uploads', 'blender', 'outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `zentraw_visualizer_${timestamp}.mp4`);

    // Executar render
    const result = await BlenderService.renderAudioVisualizer({
      audioPath: audioFile.path,
      imagePath: imageFile.path,
      outputPath
    });

    if (result.success && result.outputPath) {
      // Retornar URL para download
      const downloadUrl = `/api/blender/download/${path.basename(result.outputPath)}`;
      
      res.json({
        success: true,
        downloadUrl,
        outputPath: result.outputPath,
        duration: result.duration,
        message: '🎬 3D Audio Visualizer rendered successfully by ZentrawMediaControl!'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Render failed'
      });
    }

  } catch (error) {
    console.error('❌ [ZentrawMediaControl] Render endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

/**
 * GET /api/blender/download/:filename
 * Download do arquivo renderizado
 */
router.get('/download/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const outputDir = path.join(process.cwd(), 'uploads', 'blender', 'outputs');
    const filePath = path.join(outputDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    const stat = fs.statSync(filePath);
    
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${filename}"`
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.error('❌ [ZentrawMediaControl] Download endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

/**
 * GET /api/blender/test
 * Testa se o Blender está funcionando
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    const isWorking = await BlenderService.testBlenderInstallation();
    
    res.json({
      success: true,
      blenderAvailable: isWorking,
      platform: 'ZentrawMediaControl',
      message: isWorking ? '✅ Blender is available and ready' : '❌ Blender is not available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      platform: 'ZentrawMediaControl',
      error: error instanceof Error ? error.message : 'Test failed'
    });
  }
});

/**
 * POST /api/blender/test-render
 * Testa render com arquivos de exemplo
 */
router.post('/test-render', async (req: Request, res: Response) => {
  try {
    const audioPath = path.join(process.cwd(), 'Blender_Test', 'sample_audio.wav');
    const imagePath = path.join(process.cwd(), 'Blender_Test', 'sample_cover.jpg.JPG');
    const outputPath = path.join(process.cwd(), 'uploads', 'blender', 'test_output.mp4');

    console.log('🧪 [ZentrawMediaControl] Starting test render with sample files...');

    const result = await BlenderService.renderAudioVisualizer({
      audioPath,
      imagePath,
      outputPath
    });

    if (result.success) {
      const downloadUrl = `/api/blender/download/test_output.mp4`;
      
      res.json({
        success: true,
        message: '🎬 Test render completed successfully in ZentrawMediaControl!',
        duration: result.duration,
        outputPath: result.outputPath,
        downloadUrl,
        platform: 'ZentrawMediaControl'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Test render failed',
        platform: 'ZentrawMediaControl'
      });
    }

  } catch (error) {
    console.error('❌ [ZentrawMediaControl] Test render error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Test render failed',
      platform: 'ZentrawMediaControl'
    });
  }
});

/**
 * GET /api/blender/status
 * Status geral do módulo Blender
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const blenderAvailable = await BlenderService.testBlenderInstallation();
    const scriptsPath = path.join(process.cwd(), 'Blender_Test');
    const uploadsPath = path.join(process.cwd(), 'uploads', 'blender');
    
    res.json({
      success: true,
      platform: 'ZentrawMediaControl',
      status: {
        blenderAvailable,
        scriptsReady: fs.existsSync(scriptsPath),
        uploadsReady: fs.existsSync(uploadsPath),
        version: '1.0.0'
      },
      message: blenderAvailable ? 
        '✅ ZentrawMediaControl Blender Integration Ready' : 
        '⚠️ Blender not available - check installation'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      platform: 'ZentrawMediaControl',
      error: error instanceof Error ? error.message : 'Status check failed'
    });
  }
});

export default router;
