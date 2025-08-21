
/**
 * Zentraw 3D Visualizer V1.4.0.a.5
 * Data: 24/07/2025 - 13:50 BRT
 * Propósito: Backend Express com EXECUÇÃO REAL DO BLENDER - PATHS FIX para Windows com espaços
 * Status: Funcional - PATHS CORRIGIDOS para espaços no Windows
 * Dependências: express, multer, child_process, path, fs
 * Autor: GitHub Copilot
 * Categoria: Backend
 * Diretório Oficial: C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer
 * Fix V1.4.0.a.5: Correção de paths com espaços usando aspas duplas
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

// TEST CONNECTION - Verificar dependências
app.get('/api/test', (req, res) => {
    const blenderExe = 'C:\\Blender\\blender.exe';
    const templateBlend = path.resolve(__dirname, 'Blender', 'template.blend');
    const pythonScript = path.resolve(__dirname, 'Blender', 'render_audio_visualizer.py');
    
    const checks = {
        blender: fs.existsSync(blenderExe),
        template: fs.existsSync(templateBlend),
        script: fs.existsSync(pythonScript),
        uploads: fs.existsSync(UPLOADS_DIR),
        workingDirectory: __dirname
    };
    
    console.log('V1.4.0.a.4 - Dependency Check (Official Directory):', checks);
    console.log('Official Directory:', __dirname);
    
    res.json({ 
        success: true, 
        message: 'Connection Successful - V1.4.0.a.4 (Official Directory)!',
        dependencies: checks,
        version: 'V1.4.0.a.4',
        officialDirectory: 'C:\\Users\\Denys Victoriano\\Documents\\GitHub\\clone\\zentraw\\Zentraw\\3d_visualizer',
        timestamp: new Date().toISOString()
    });
});

// BLENDER REAL EXECUTION - Upload + Render
app.post('/api/blender/audio-visualizer', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), (req, res) => {
    console.log('🚀 V1.4.0.a.4 - REAL BLENDER EXECUTION STARTED (Official Directory)');
    console.log('📁 Files received:', req.files);
    console.log('📂 Working from:', __dirname);
    
    const audioFile = req.files?.audio?.[0]?.path;
    const imageFile = req.files?.image?.[0]?.path;
    
    if (!audioFile || !imageFile) {
        return res.status(400).json({ 
            success: false, 
            message: 'Audio and image files required.',
            version: 'V1.4.0.a.4',
            officialDirectory: __dirname
        });
    }
    
    const outputFile = path.resolve(UPLOADS_DIR, 'visualizer_' + Date.now() + '.mp4');
    const blenderExe = 'C:\\Blender\\blender.exe';
    const templateBlend = path.resolve(__dirname, 'Blender', 'template.blend');
    const pythonScript = path.resolve(__dirname, 'Blender', 'render_audio_visualizer.py');
    const audioPath = path.resolve(audioFile);
    const imagePath = path.resolve(imageFile);
    
    console.log('🎬 Blender Command:', blenderExe);
    console.log('📋 Template:', templateBlend);
    console.log('🐍 Script:', pythonScript);
    console.log('🎵 Audio:', audioPath);
    console.log('🖼️ Image:', imagePath);
    console.log('📁 Output:', outputFile);
    
    const args = [
        '--background',
        `"${templateBlend}"`,
        '--python', 
        `"${pythonScript}"`,
        '--', 
        `"${audioPath}"`, 
        `"${imagePath}"`, 
        `"${outputFile}"`
    ];
    
    const blenderProcess = spawn(blenderExe, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        timeout: 300000 // 5 minutos
    });
    
    let blenderLog = '';
    let errorLog = '';
    
    blenderProcess.stdout.on('data', (data) => {
        const output = data.toString();
        blenderLog += output;
        console.log('📤 Blender STDOUT:', output);
    });
    
    blenderProcess.stderr.on('data', (data) => {
        const error = data.toString();
        errorLog += error;
        console.error('⚠️ Blender STDERR:', error);
    });
    
    blenderProcess.on('close', (code) => {
        console.log(`🏁 Blender process finished with code: ${code}`);
        
        // Verificar se arquivo foi gerado
        const fileExists = fs.existsSync(outputFile);
        const fileSize = fileExists ? fs.statSync(outputFile).size : 0;
        
        console.log(`📁 Output file: ${outputFile}`);
        console.log(`✅ File exists: ${fileExists}`);
        console.log(`📏 File size: ${fileSize} bytes`);
        
        if (code === 0 && fileExists && fileSize > 0) {
            res.json({ 
                success: true, 
                message: '🎉 V1.4.0.a.4 - REAL MP4 GENERATED SUCCESSFULLY! (Official Directory)', 
                output: outputFile,
                fileSize: fileSize,
                exitCode: code,
                blenderLog: blenderLog,
                errorLog: errorLog,
                version: 'V1.4.0.a.4',
                officialDirectory: __dirname,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: `❌ V1.4.0.a.4 - Failed to generate MP4! Exit code: ${code} (Official Directory)`,
                output: outputFile,
                fileExists: fileExists,
                fileSize: fileSize,
                exitCode: code,
                blenderLog: blenderLog,
                errorLog: errorLog,
                version: 'V1.4.0.a.4',
                officialDirectory: __dirname,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    blenderProcess.on('error', (error) => {
        console.error('💥 Blender process error:', error);
        res.status(500).json({ 
            success: false, 
            message: `💥 V1.4.0.a.4 - Blender execution error: ${error.message} (Official Directory)`,
            error: error.message,
            version: 'V1.4.0.a.4',
            officialDirectory: __dirname
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Zentraw 3D Visualizer V1.4.0.a.4 - Server running on http://localhost:${PORT}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`📂 Official Directory: ${__dirname}`);
    console.log(`🎯 REAL BLENDER EXECUTION - NO SIMULATION!`);
});
