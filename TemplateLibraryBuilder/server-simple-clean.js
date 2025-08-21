/**
 * Zentraw TemplateLibraryBuilder Backend V1.4.0.a.2
 * Data: 24/07/2025 - 15:50 BRT
 * Propósito: Backend Express para TemplateLibraryBuilder - Sistema isolado (sem 3D Visualizer)
 * Status: Funcional - Core functionality only
 * Dependências: express, multer, path, fs
 * Autor: GitHub Copilot
 * Categoria: Backend - TemplateLibraryBuilder
 * Nota: Sistema 3D Visualizer movido para Zentraw/3d_visualizer/
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5001;
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const app = express();
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(__dirname));

// CORS headers
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

// HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'TemplateLibraryBuilder',
        version: 'V1.4.0.a.2',
        timestamp: new Date().toISOString()
    });
});

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
    console.log('📤 TemplateLibraryBuilder Upload Request V1.4.0.a.2');
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
    
    // Core TemplateLibraryBuilder processing logic
    try {
        // Simulate template processing
        const templateData = {
            id: Date.now(),
            originalName: req.files.template[0].originalname,
            processedAt: new Date().toISOString(),
            status: 'processed',
            version: 'V1.4.0.a.2'
        };
        
        fs.writeFileSync(outputFile, JSON.stringify(templateData, null, 2));
        
        res.json({
            success: true,
            message: 'Template processed successfully',
            version: 'V1.4.0.a.2',
            module: 'TemplateLibraryBuilder',
            templateId: templateData.id,
            outputPath: outputFile,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Template processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Template processing failed',
            error: error.message,
            version: 'V1.4.0.a.2'
        });
    }
});

// LIST TEMPLATES
app.get('/api/templates', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOADS_DIR);
        const templates = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(UPLOADS_DIR, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            });
            
        res.json({
            success: true,
            templates: templates,
            count: templates.length,
            version: 'V1.4.0.a.2',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to list templates',
            error: error.message,
            version: 'V1.4.0.a.2'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 TemplateLibraryBuilder V1.4.0.a.2 - Server running on http://localhost:${PORT}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🏗️ Core TemplateLibraryBuilder functionality - No 3D Visualizer`);
    console.log(`📁 Upload directory: ${UPLOADS_DIR}`);
});
