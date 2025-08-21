/**
 * Zentraw 3D Visualizer V1.4.0.a.6
 * Data: 19/01/2025 - 19:30 BRT
 * Propósito: Backend Express com parâmetros dinâmicos + sincronização precisa
 * Status: Novo - V1.4.0.a.6 com FPS/Resolution/Amplitude configuráveis
 * Dependências: express, multer, child_process, path, fs
 * Autor: GitHub Copilot
 * Categoria: Backend V1.4.0.a.6
 * Novidades: Parâmetros dinâmicos, sincronização timestamp, interface integrada
 */

const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 3004; // Porta oficial documentada para Zentraw
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // Servir arquivos estáticos (interface HTML)

// CORS Headers V1.4.0.a.6
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Root: Servir interface V1.4.0.a.6
app.get('/', (req, res) => {
    const interfacePath = path.join(__dirname, 'interface-v1.4.0.a.6.html');
    if (fs.existsSync(interfacePath)) {
        res.sendFile(interfacePath);
    } else {
        res.json({ 
            success: true, 
            message: 'Zentraw V1.4.0.a.6 Backend Online!',
            interface: 'interface-v1.4.0.a.6.html not found',
            timestamp: new Date().toISOString()
        });
    }
});

// Health Check V1.4.0.a.6
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Zentraw V1.4.0.a.6 - Sync + Interface Backend Online!',
        version: 'V1.4.0.a.6',
        features: ['Dynamic FPS', 'Configurable Resolution', 'Amplitude Control', 'Timestamp Sync'],
        timestamp: new Date().toISOString()
    });
});

// Endpoint principal V1.4.0.a.6 com parâmetros dinâmicos
app.post('/api/blender/render-v1.4.0.a.6', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    const audioFile = req.files?.audio?.[0]?.path;
    const imageFile = req.files?.image?.[0]?.path;
    
    // Parâmetros V1.4.0.a.6 (com defaults)
    const fps = parseInt(req.body.fps) || 30;
    const resolution = req.body.resolution || '1080p';
    const amplitude = parseFloat(req.body.amplitude) || 3.0;
    const outputName = req.body.outputName || 'zentraw_v1.4.0.a.6';
    
    console.log('🚀 V1.4.0.a.6 Render Request:');
    console.log('📊 Parameters:', { fps, resolution, amplitude, outputName });
    
    if (!audioFile || !imageFile) {
        return res.status(400).json({ 
            success: false, 
            message: 'V1.4.0.a.6: Audio and image files required.',
            version: 'V1.4.0.a.6'
        });
    }
    
    // Validar parâmetros V1.4.0.a.6
    if (fps < 24 || fps > 60) {
        return res.status(400).json({ 
            success: false, 
            message: 'V1.4.0.a.6: FPS must be between 24-60',
            received: fps
        });
    }
    
    if (!['720p', '1080p', '4k'].includes(resolution)) {
        return res.status(400).json({ 
            success: false, 
            message: 'V1.4.0.a.6: Resolution must be 720p, 1080p, or 4k',
            received: resolution
        });
    }
    
    if (amplitude < 1 || amplitude > 5) {
        return res.status(400).json({ 
            success: false, 
            message: 'V1.4.0.a.6: Amplitude must be between 1.0-5.0',
            received: amplitude
        });
    }
    
    // Configurações de resolução
    const resolutionMap = {
        '720p': { width: 1280, height: 720 },
        '1080p': { width: 1920, height: 1080 },
        '4k': { width: 3840, height: 2160 }
    };
    
    const { width, height } = resolutionMap[resolution];
    
    const outputFile = path.join(UPLOADS_DIR, `${outputName}_v1.4.0.a.6_${fps}fps_${resolution}_${amplitude}x.mp4`);
    const blenderExe = 'C:\\Blender\\blender.exe';
    const templateBlend = path.resolve(__dirname, 'Blender', 'template.blend');
    const pythonScript = path.resolve(__dirname, 'Blender', 'render_audio_visualizer_v1.4.0.a.6.py');
    
    // Verificar arquivos V1.4.0.a.6
    if (!fs.existsSync(templateBlend)) {
        return res.status(500).json({ 
            success: false, 
            message: `V1.4.0.a.6: Template not found: ${templateBlend}`,
            version: 'V1.4.0.a.6'
        });
    }
    
    if (!fs.existsSync(pythonScript)) {
        return res.status(500).json({ 
            success: false, 
            message: `V1.4.0.a.6: Python script not found: ${pythonScript}`,
            version: 'V1.4.0.a.6'
        });
    }
    
    console.log('🎬 Starting V1.4.0.a.6 Blender render with dynamic parameters...');
    console.log('📁 Audio:', audioFile);
    console.log('📁 Image:', imageFile);
    console.log('📁 Output:', outputFile);
    console.log('🎯 Template:', templateBlend);
    console.log('🐍 Script V1.4.0.a.6:', pythonScript);
    console.log('⚙️ Render Config:', { fps, width, height, amplitude });
    
    // Argumentos V1.4.0.a.6 com parâmetros dinâmicos
    const args = [
        '--background',
        templateBlend,
        '--python', 
        pythonScript,
        '--', 
        path.resolve(audioFile),  // arg 0: audio_path
        path.resolve(imageFile),  // arg 1: image_path 
        path.resolve(outputFile), // arg 2: output_path
        fps.toString(),           // arg 3: fps
        width.toString(),         // arg 4: width
        height.toString(),        // arg 5: height
        amplitude.toString()      // arg 6: amplitude
    ];
    
    // Log dos argumentos V1.4.0.a.6
    console.log('🔧 V1.4.0.a.6 Blender arguments:');
    args.forEach((arg, i) => console.log(`  [${i}]: "${arg}"`));
    
    const blenderProcess = spawn(blenderExe, args, { 
        timeout: 600000 // 10 minutos para renderizações maiores (4K)
    });
    
    let blenderLog = '';
    const renderStartTime = Date.now();
    
    blenderProcess.on('error', (error) => {
        console.error('❌ V1.4.0.a.6: Failed to start Blender:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: `V1.4.0.a.6: Failed to start Blender: ${error.message}`,
            error: error.message,
            version: 'V1.4.0.a.6'
        });
    });
    
    blenderProcess.stdout.on('data', (data) => {
        blenderLog += data.toString();
        console.log('📤 V1.4.0.a.6 Blender stdout:', data.toString());
    });
    
    blenderProcess.stderr.on('data', (data) => {
        blenderLog += data.toString();
        console.error('📤 V1.4.0.a.6 Blender stderr:', data.toString());
    });
    
    blenderProcess.on('close', (code) => {
        const renderTime = Date.now() - renderStartTime;
        console.log(`🏁 V1.4.0.a.6 Blender process finished with code: ${code} (${renderTime}ms)`);
        
        if (code === 0) {
            if (fs.existsSync(outputFile)) {
                const fileSize = fs.statSync(outputFile).size;
                const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
                
                console.log(`✅ V1.4.0.a.6 MP4 generated successfully! Size: ${fileSizeMB}MB`);
                
                res.json({ 
                    success: true, 
                    message: `✅ V1.4.0.a.6 - Audio Visualizer Generated Successfully!`, 
                    output: outputFile,
                    filename: path.basename(outputFile),
                    fileSize: fileSize,
                    fileSizeMB: fileSizeMB,
                    renderTimeMs: renderTime,
                    parameters: { fps, resolution, width, height, amplitude },
                    version: 'V1.4.0.a.6',
                    log: blenderLog.substring(-2000) // Últimos 2000 chars
                });
            } else {
                console.log('❌ V1.4.0.a.6: MP4 file not found after Blender execution');
                res.status(500).json({ 
                    success: false, 
                    message: 'V1.4.0.a.6: MP4 file not generated', 
                    version: 'V1.4.0.a.6',
                    log: blenderLog 
                });
            }
        } else {
            console.log(`❌ V1.4.0.a.6: Failed to generate MP4! Exit code: ${code}`);
            console.log(`📋 V1.4.0.a.6 Blender log:\n${blenderLog}`);
            
            res.status(500).json({ 
                success: false, 
                message: `❌ V1.4.0.a.6: Failed to generate MP4! Exit code: ${code}`, 
                exitCode: code,
                version: 'V1.4.0.a.6',
                parameters: { fps, resolution, width, height, amplitude },
                log: blenderLog,
                diagnostics: {
                    templateExists: fs.existsSync(templateBlend),
                    scriptExists: fs.existsSync(pythonScript),
                    audioExists: fs.existsSync(audioFile),
                    imageExists: fs.existsSync(imageFile),
                    renderTimeMs: renderTime
                }
            });
        }
    });
});

// Legacy endpoint (manter compatibilidade com V1.4.0.a.5)
app.post('/api/blender/audio-visualizer', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    res.json({
        success: true,
        message: 'V1.4.0.a.6: Use /api/blender/render-v1.4.0.a.6 for new features',
        redirect: '/api/blender/render-v1.4.0.a.6',
        version: 'V1.4.0.a.6'
    });
});

// Status dos uploads
app.get('/api/uploads', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOADS_DIR)
            .filter(file => file.endsWith('.mp4'))
            .map(file => {
                const filePath = path.join(UPLOADS_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    sizeMB: (stats.size / 1024 / 1024).toFixed(2),
                    created: stats.birthtime,
                    isV146: file.includes('v1.4.0.a.6')
                };
            })
            .sort((a, b) => new Date(b.created) - new Date(a.created));
            
        res.json({
            success: true,
            version: 'V1.4.0.a.6',
            totalFiles: files.length,
            files: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to list uploads',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log('🚀 Zentraw V1.4.0.a.6 Backend Started!');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🎨 Interface: http://localhost:${PORT}/`);
    console.log(`📊 API Test: http://localhost:${PORT}/api/test`);
    console.log(`🎬 Render Endpoint: POST /api/blender/render-v1.4.0.a.6`);
    console.log('✨ Features: Dynamic FPS, Resolution, Amplitude + Timestamp Sync');
    console.log('🔧 Porta Oficial: 3004 (conforme documentação)');
});
