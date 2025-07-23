const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3004;

const server = http.createServer((req, res) => {
    // CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Connection Successful!' }));
    } else if (req.method === 'POST' && req.url === '/api/blender/audio-visualizer') {
        const blenderProcess = spawn('C:\\Blender\\blender.exe', [
            'Blender/template.blend',
            '--background',
            '--python', 'Blender/render_audio_visualizer.py'
        ]);

        blenderProcess.stdout.on('data', (data) => {
            console.log('Blender output:', data.toString());
        });

        blenderProcess.stderr.on('data', (data) => {
            console.error('Blender error:', data.toString());
        });

        blenderProcess.on('close', (code) => {
            if (code === 0) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Visualizer Generated Successfully!' }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to Generate Visualizer!' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
