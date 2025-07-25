const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');


/**
 * Zentraw TemplateLibraryBuilder Backend V1.4.0.a.2
 * Data: 24/07/2025 - 15:45 BRT
 * Propósito: Backend Express para TemplateLibraryBuilder - Sistema isolado (sem 3D Visualizer)
 * Status: Funcional - Core functionality only
 * Dependências: express, multer, path, fs
 * Autor: GitHub Copilot
 * Categoria: Backend - TemplateLibraryBuilder
 * Nota: Sistema 3D Visualizer movido para Zentraw/3d_visualizer/
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

// CORE FUNCTIONALITY - Health check and basic API
app.get('/api/test', (req, res) => {
    const checks = {
        server: true,
        uploads: fs.existsSync(UPLOADS_DIR),
        timestamp: new Date().toISOString()
    };
    
    console.log('V1.4.0.a.2 - TemplateLibraryBuilder Health Check:', checks);
    
    res.json({ 
        success: true, 
        message: 'TemplateLibraryBuilder Backend V1.4.0.a.2 - Funcionando!',
        checks: checks,
        version: 'V1.4.0.a.2',
        module: 'TemplateLibraryBuilder',
        note: '3D Visualizer movido para Zentraw/3d_visualizer/',
        timestamp: new Date().toISOString()
    });
});

// TEMPLATE LIBRARY BUILDER - Core functionality endpoints
app.post('/api/template/upload', upload.fields([
    { name: 'template', maxCount: 1 },
    { name: 'assets', maxCount: 10 }
]), (req, res) => {
    console.log('� TemplateLibraryBuilder Upload Request V1.4.0.a.2');
    console.log('📁 Files received:', req.files);
    
    const templateFile = req.files?.template?.[0]?.path;
    
    if (!templateFile) {
        return res.status(400).json({ 
            success: false, 
            message: 'Template file required.',
            version: 'V1.4.0.a.2'
        });
    }
    
    const outputFile = path.join(UPLOADS_DIR, 'template_' + Date.now() + '.json');
    
    console.log('📁 Template file:', templateFile);
    console.log('📁 Output file:', outputFile);
        '--background',
        `"${templateBlend}"`,
        '--python', `"${pythonScript}"`,
        '--', `"${audioFile}"`, `"${imageFile}"`, `"${outputFile}"`
    ]);
    
    const args = [
        '--background',
        templateBlend,
        '--python', pythonScript,
        '--', audioFile, imageFile, outputFile
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
                message: '🎉 V1.4.0.a.4 - REAL MP4 GENERATED SUCCESSFULLY!', 
                output: outputFile,
                fileSize: fileSize,
                exitCode: code,
                blenderLog: blenderLog,
                errorLog: errorLog,
                version: 'V1.4.0.a.4',
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: `❌ V1.4.0.a.4 - Failed to generate MP4! Exit code: ${code}`,
                output: outputFile,
                fileExists: fileExists,
                fileSize: fileSize,
                exitCode: code,
                blenderLog: blenderLog,
                errorLog: errorLog,
                version: 'V1.4.0.a.4',
                timestamp: new Date().toISOString()
            });
        }
    });
    
    blenderProcess.on('error', (error) => {
        console.error('💥 Blender process error:', error);
        res.status(500).json({ 
            success: false, 
            message: `💥 V1.4.0.a.4 - Blender execution error: ${error.message}`,
            error: error.message,
            version: 'V1.4.0.a.4'
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Zentraw 3D Visualizer V1.4.0.a.4 - Server running on http://localhost:${PORT}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🎯 REAL BLENDER EXECUTION - NO SIMULATION!`);
});
