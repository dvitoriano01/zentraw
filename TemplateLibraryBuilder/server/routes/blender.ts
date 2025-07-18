import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { BlenderService } from '../services/blender-service.js';
import { BlenderServiceComplete } from '../services/blender-service-complete.js';

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

    console.log('🎵 Received render request:', {
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
    
    const outputPath = path.join(outputDir, `visualizer_${timestamp}.mp4`);

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
        message: 'Audio visualizer rendered successfully!'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Render failed'
      });
    }

  } catch (error) {
    console.error('❌ Render endpoint error:', error);
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
    const ext = path.extname(filename).toLowerCase();
    
    // Determinar Content-Type baseado na extensão
    let contentType = 'application/octet-stream';
    if (ext === '.mp4') {
      contentType = 'video/mp4';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    }
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${filename}"`
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.error('❌ Download endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file'
    });
  }
});

/**
 * GET /api/blender/debug
 * Debug detalhado do Blender
 */
router.get('/debug', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Starting detailed Blender debug...');
    
    // Testar todos os métodos
    const workingMethod = await BlenderServiceComplete.testAllMethods();
    
    // Verificar arquivos necessários
    const templatePath = path.join(process.cwd(), 'Blender', 'template.blend');
    const scriptPath = path.join(process.cwd(), 'Blender', 'render_audio_visualizer.py');
    
    const files = {
      template: {
        path: templatePath,
        exists: fs.existsSync(templatePath),
        size: fs.existsSync(templatePath) ? fs.statSync(templatePath).size : 0
      },
      script: {
        path: scriptPath,
        exists: fs.existsSync(scriptPath),
        size: fs.existsSync(scriptPath) ? fs.statSync(scriptPath).size : 0
      }
    };
    
    res.json({
      success: true,
      workingMethod,
      files,
      workingDirectory: process.cwd(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      message: 'Debug information collected'
    });
    
  } catch (error) {
    console.error('❌ Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Debug failed'
    });
  }
});

/**
 * GET /api/blender/test
 * Testa se o Blender está funcionando
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    // Usar o novo serviço completo
    const isWorking = await BlenderServiceComplete.testBlenderInstallation();
    
    res.json({
      success: true,
      blenderAvailable: isWorking,
      message: isWorking ? 'Blender is available' : 'Blender is not available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
    const audioPath = path.join(process.cwd(), 'Blender', 'sample_audio.wav');
    const imagePath = path.join(process.cwd(), 'Blender', 'sample_cover.jpg.JPG');
    const outputPath = path.join(process.cwd(), 'Blender', 'test_output.mp4');

    console.log('🧪 Starting test render with sample files...');

    const result = await BlenderService.renderAudioVisualizer({
      audioPath,
      imagePath,
      outputPath
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Test render completed successfully!',
        duration: result.duration,
        outputPath: result.outputPath
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Test render failed'
      });
    }

  } catch (error) {
    console.error('❌ Test render error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Test render failed'
    });
  }
});

/**
 * POST /api/blender/preview
 * Generates a single frame preview with complete template (audio + image + camera settings)
 */
router.post('/preview', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req: Request, res: Response) => {
  try {
    console.log('🎬 Preview generation request received');
    console.log('📝 Request files:', req.files);
    console.log('📝 Request body:', req.body);
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.audio || !files.audio[0]) {
      console.log('❌ Audio file missing:', { files, hasFiles: !!files, hasAudio: !!(files && files.audio) });
      return res.status(400).json({
        success: false,
        error: 'Audio file is required'
      });
    }

    if (!files.image || !files.image[0]) {
      console.log('❌ Image file missing:', { hasImage: !!(files && files.image) });
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }

    const audioFile = files.audio[0];
    const imageFile = files.image[0];

    const {
      renderEngine = 'eevee',
      cameraDistance = '50',
      cameraHeight = '50', 
      cameraAngle = '50',
      animationStyle = 'cube',
      sensitivity = '50',
      smoothing = '30'
    } = req.body;

    console.log('📷 Preview settings:', {
      renderEngine,
      cameraDistance,
      cameraHeight,
      cameraAngle,
      animationStyle,
      sensitivity,
      smoothing,
      audioFile: audioFile.filename,
      imageFile: imageFile.filename
    });

    const blenderService = new BlenderServiceComplete();
    
    // Gerar preview completo (um frame do template final)
    const result = await blenderService.generatePreview({
      audioFile: audioFile.path,
      imageFile: imageFile.path,
      renderEngine: renderEngine as 'eevee' | 'cycles',
      cameraSettings: {
        distance: parseInt(cameraDistance),
        height: parseInt(cameraHeight),
        angle: parseInt(cameraAngle)
      },
      animationStyle: animationStyle as 'cube' | 'sphere' | 'bars',
      sensitivity: parseInt(sensitivity),
      smoothing: parseInt(smoothing)
    });

    if (result.success && result.previewPath) {
      // ✅ SOLUÇÃO: Gerar URL para static file serving
      const relativePath = path.relative(process.cwd(), result.previewPath);
      const previewUrl = `/${relativePath.replace(/\\/g, '/')}`;
      
      console.log('✅ Preview generated successfully:', previewUrl);
      
      res.json({
        success: true,
        previewUrl,
        previewPath: result.previewPath,
        renderTime: result.renderTime,
        message: `Preview generated with ${renderEngine.toUpperCase()} in ${result.renderTime}ms`
      });
    } else {
      console.error('❌ Preview generation failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error || 'Preview generation failed'
      });
    }

  } catch (error) {
    console.error('❌ Preview generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Preview generation failed'
    });
  }
});

export default router;
