const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');


/**
 * Zentraw 3D Visualizer V1.4.0.a.3
 * Data: 23/07/2025 - 17:00 BRT
 * Propósito: Backend Express para upload e execução Blender
 * Status: Funcional
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

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Connection Successful!' });
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
    const blenderExe = 'C:\\Blender\\blender.exe';
    const templateBlend = path.resolve(__dirname, 'Blender', 'template.blend');
    const pythonScript = path.resolve(__dirname, 'Blender', 'render_audio_visualizer.py');
    const args = [
        '--background',
        templateBlend,
        '--python', pythonScript,
        '--', audioFile, imageFile, outputFile
    ];
    const blenderProcess = spawn(blenderExe, args);
    let blenderLog = '';
    blenderProcess.stdout.on('data', (data) => {
        blenderLog += data.toString();
        console.log('Blender output:', data.toString());
    });
    blenderProcess.stderr.on('data', (data) => {
        blenderLog += data.toString();
        console.error('Blender error:', data.toString());
    });
    blenderProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, message: 'Visualizer Generated Successfully!', output: outputFile, log: blenderLog });
        } else {
            res.status(500).json({ success: false, message: 'Failed to Generate Visualizer!', log: blenderLog });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
