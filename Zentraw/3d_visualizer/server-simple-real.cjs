/**
 * Zentraw 3D Visualizer V1.4.0.a.5
 * Data: 24/07/2025 - 13:50 BRT
 * Propósito: Backend Express para upload e execução Blender (REAL) - BÁSICO WAV
 * Status: Funcional com correção de paths Windows + V1.4.0.a.5 básico
 * Dependências: express, multer, child_process, path, fs
 * Autor: GitHub Copilot
 * Categoria: Backend
 */

const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 3004;
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const app = express();
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS) do diretório atual
app.use(express.static(__dirname));

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

// Rota específica para a interface principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-simple-real.html'));
});

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Connection Successful - V1.4.0.a.5 BÁSICO (Official Directory)!' });
});

app.post('/api/blender/audio-visualizer', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    const audioFile = req.files?.audio?.[0]?.path;
    const imageFile = req.files?.image?.[0]?.path;
    
    if (!audioFile || !imageFile) {
        return res.status(400).json({ success: false, message: 'Audio and image files required.' });
    }
    
    const outputFile = path.join(UPLOADS_DIR, 'output_' + Date.now() + '.mp4');
    const blenderExe = 'C:\\Blender\\blender.exe'; // Caminho absoluto do Blender
    const templateBlend = path.resolve(__dirname, 'Blender', 'template.blend');
    const pythonScript = path.resolve(__dirname, 'Blender', 'render_audio_visualizer.py');
    
    // Verificar se arquivos existem
    if (!fs.existsSync(templateBlend)) {
        return res.status(500).json({ success: false, message: `Template not found: ${templateBlend}` });
    }
    
    if (!fs.existsSync(pythonScript)) {
        return res.status(500).json({ success: false, message: `Python script not found: ${pythonScript}` });
    }
    
    console.log('🎬 Starting Blender render...');
    console.log('📁 Audio:', audioFile);
    console.log('📁 Image:', imageFile);
    console.log('📁 Output:', outputFile);
    console.log('🎯 Template:', templateBlend);
    console.log('🐍 Script:', pythonScript);
    
    const args = [
        '--background',
        templateBlend,
        '--python', 
        pythonScript,
        '--', 
        path.resolve(audioFile), 
        path.resolve(imageFile), 
        path.resolve(outputFile)
    ];
    
    // Log dos argumentos para debug
    console.log('🔧 Blender arguments:');
    args.forEach((arg, i) => console.log(`  [${i}]: "${arg}"`));
    
    const blenderProcess = spawn(blenderExe, args, { 
        // Remover shell: true para tratar paths com espaços corretamente
        timeout: 300000 // 5 minutos timeout
    });
    let blenderLog = '';
    
    blenderProcess.on('error', (error) => {
        console.error('❌ Failed to start Blender:', error.message);
        return res.status(500).json({ 
            success: false, 
            message: `Failed to start Blender: ${error.message}. Make sure Blender is installed and in PATH.`,
            error: error.message 
        });
    });
    
    blenderProcess.stdout.on('data', (data) => {
        blenderLog += data.toString();
        console.log('📤 Blender stdout:', data.toString());
    });
    
    blenderProcess.stderr.on('data', (data) => {
        blenderLog += data.toString();
        console.error('📤 Blender stderr:', data.toString());
    });
    
    blenderProcess.on('close', (code) => {
        console.log(`🏁 Blender process finished with code: ${code}`);
        
        if (code === 0) {
            // Verificar se arquivo foi gerado
            if (fs.existsSync(outputFile)) {
                const fileSize = fs.statSync(outputFile).size;
                console.log(`✅ MP4 generated successfully! Size: ${fileSize} bytes`);
                res.json({ 
                    success: true, 
                    message: '✅ V1.4.0.a.5 BÁSICO - Visualizer Generated Successfully! (Official Directory)', 
                    output: outputFile,
                    fileSize: fileSize,
                    log: blenderLog 
                });
            } else {
                console.log('❌ MP4 file not found after Blender execution');
                res.status(500).json({ 
                    success: false, 
                    message: 'MP4 file not generated', 
                    log: blenderLog 
                });
            }
        } else {
            console.log(`❌ V1.4.0.a.5 - Failed to generate MP4! Exit code: ${code}`);
            console.log(`📋 Blender log:\n${blenderLog}`);
            res.status(500).json({ 
                success: false, 
                message: `❌ V1.4.0.a.5 BÁSICO - Failed to generate MP4! Exit code: ${code} (Official Directory)`, 
                exitCode: code,
                log: blenderLog,
                diagnostics: {
                    templateExists: fs.existsSync(templateBlend),
                    scriptExists: fs.existsSync(pythonScript),
                    audioExists: fs.existsSync(audioFile),
                    imageExists: fs.existsSync(imageFile)
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
