import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { BlenderService, Model3DPreviewOptions } from '../services/blender-service-v2.js';

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

    const audioFile = files.audio[0];
    
    // Image é opcional - usar imagem padrão se não fornecida
    let imageFile = files.image?.[0];
    let imagePath: string;
    
    if (imageFile) {
      imagePath = imageFile.path;
    } else {
      // Usar imagem padrão do diretório Blender
      imagePath = path.join(process.cwd(), 'Blender', 'sample_cover.jpg.JPG');
      if (!fs.existsSync(imagePath)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Image file is required or default image not found' 
        });
      }
    }

    console.log('🎵 Received render request:', {
      audio: audioFile.originalname,
      image: imageFile ? imageFile.originalname : 'default-image',
      audioSize: audioFile.size,
      imageSize: imageFile ? imageFile.size : 'default'
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
      imagePath: imagePath,
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
    
    // Testar todos os métodos usando sistema robusto
    const workingMethod = await BlenderService.testBlenderInstallation();
    
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
    // Usar o novo serviço robusto
    const isWorking = await BlenderService.testBlenderInstallation();
    
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
 * GET /api/blender/test-robust
 * Testa se o sistema robusto está carregado
 */
router.get('/test-robust', async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testando sistema robusto...');
    console.log('🔥 SISTEMA ROBUSTO - ENDPOINT DE TESTE CHAMADO!');
    
    res.json({
      success: true,
      message: 'Sistema robusto está carregado e funcionando',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erro no teste robusto:', error);
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

    // Gerar preview completo (um frame do template final) usando sistema robusto V2
    const result = await BlenderService.generatePreview({
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

/**
 * POST /api/blender/preview-3d
 * Generates a preview for 3D models (.blend, .obj, .ply, .stl, .fbx)
 */
const upload3D = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limite
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    console.log('🔍 File upload check:', { fieldname: file.fieldname, mimetype: file.mimetype, originalname: file.originalname });
    
    if (file.fieldname === 'file') {
      // Aceitar arquivos 3D
      const ext = path.extname(file.originalname).toLowerCase();
      const allowed3DExtensions = ['.blend', '.obj', '.ply', '.stl', '.fbx', '.dae', '.3ds', '.x3d'];
      
      if (allowed3DExtensions.includes(ext)) {
        console.log('✅ 3D file accepted:', file.originalname);
        cb(null, true);
      } else {
        console.log('❌ 3D file rejected:', file.originalname, 'Extension:', ext);
        cb(new Error(`Only 3D model files are allowed. Supported: ${allowed3DExtensions.join(', ')}`));
      }
    } else {
      console.log('❌ Unexpected field:', file.fieldname);
      cb(new Error('Unexpected field - use "file" for 3D models'));
    }
  }
});

router.post('/preview-3d', upload3D.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('🎯 3D Preview generation request received');
    console.log('📝 Request file:', req.file);
    console.log('📝 Request body:', req.body);
    
    if (!req.file) {
      console.log('❌ 3D file missing');
      return res.status(400).json({
        success: false,
        error: '3D model file is required'
      });
    }

    const modelFile = req.file;
    const { quality = 'medium', width = '800', height = '600', camera_distance = '5' } = req.body;

    console.log('🎬 Generating 3D preview for:', modelFile.originalname);

    // Preparar opções para o BlenderService
    const options = {
      modelPath: modelFile.path,
      outputPath: path.join(path.dirname(modelFile.path), `preview_${Date.now()}.png`),
      quality: quality as 'low' | 'medium' | 'high',
      width: parseInt(width),
      height: parseInt(height),
      cameraDistance: parseFloat(camera_distance)
    };

    console.log('🔧 Preview options:', options);

    // Chamar o BlenderService V2 com método específico para 3D
    const result = await BlenderService.generate3DPreview(options as Model3DPreviewOptions);

    if (result.success) {
      console.log('✅ 3D Preview generated successfully:', result.previewPath);
      
      // Corrigir URL para corresponder ao caminho real do arquivo
      const relativePath = path.relative(path.join(process.cwd(), 'uploads'), result.previewPath);
      const previewUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;
      
      res.json({
        success: true,
        previewPath: result.previewPath,
        previewUrl: previewUrl,
        modelFile: modelFile.originalname,
        options: options
      });
    } else {
      console.log('❌ 3D Preview generation failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error || '3D Preview generation failed'
      });
    }

  } catch (error) {
    console.error('❌ 3D Preview generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '3D Preview generation failed'
    });
  }
});

/**
 * POST /api/blender/preview-image
 * Generates a preview with only image applied to plane (no audio required)
 */
router.post('/preview-image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    console.log('🖼️ Image preview generation request received');
    console.log('📝 Request file:', req.file);
    console.log('📝 Request body:', req.body);
    
    if (!req.file) {
      console.log('❌ Image file missing');
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }

    const imageFile = req.file;
    const { quality = 'high', renderType = 'image-preview' } = req.body;

    console.log('🖼️ Generating image preview for:', imageFile.originalname);

    // Usar áudio padrão para o preview (só para não quebrar o sistema)
    const defaultAudioPath = path.join(process.cwd(), 'Blender', 'sample_audio.wav');
    let audioPath = defaultAudioPath;
    
    // Se não existe áudio padrão, criar um silence temporário
    if (!fs.existsSync(defaultAudioPath)) {
      console.log('⚠️ Default audio not found, using image-only preview mode');
      // Por enquanto, usar o sistema sem áudio
    }

    // Gerar preview com imagem aplicada ao plane usando sistema robusto V2
    const result = await BlenderService.generatePreview({
      audioFile: audioPath, // Usar áudio padrão ou criar silence
      imageFile: imageFile.path,
      renderEngine: 'eevee' as 'eevee' | 'cycles',
      cameraSettings: {
        distance: 50,
        height: 50,
        angle: 50
      },
      animationStyle: 'cube' as 'cube' | 'sphere' | 'bars',
      sensitivity: 50,
      smoothing: 30
    });

    if (result.success && result.previewPath) {
      // ✅ Gerar URL correta para static file serving
      const relativePath = path.relative(path.join(process.cwd(), 'uploads'), result.previewPath);
      const previewUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;
      
      console.log('✅ Image preview generated successfully:', previewUrl);
      
      res.json({
        success: true,
        previewUrl,
        previewPath: result.previewPath,
        renderTime: result.renderTime,
        imageFile: imageFile.originalname,
        message: `Image preview generated in ${result.renderTime}ms`
      });
    } else {
      console.error('❌ Image preview generation failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error || 'Image preview generation failed'
      });
    }

  } catch (error) {
    console.error('❌ Image preview generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Image preview generation failed'
    });
  }
});

export default router;
