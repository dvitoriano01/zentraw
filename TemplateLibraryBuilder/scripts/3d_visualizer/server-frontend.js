import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🌐 ZENTRAW FRONTEND SERVER STARTING...');

const server = createServer((req, res) => {
    console.log(`Frontend request: ${req.method} ${req.url}`);
    
    // Serve the HTML file
    if (req.url === '/' || req.url === '/index.html') {
        try {
            const htmlContent = readFileSync(join(__dirname, 'test-working.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(htmlContent);
        } catch (error) {
            res.writeHead(500);
            res.end('Error loading interface');
        }
        return;
    }
    
    // 404 for other routes
    res.writeHead(404);
    res.end('Not found');
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`✅ Frontend server running on http://localhost:${PORT}`);
    console.log(`🎬 Zentraw interface available at:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`📡 Backend running on http://localhost:3001`);
    console.log(`🚀 READY FOR TESTING!`);
});
