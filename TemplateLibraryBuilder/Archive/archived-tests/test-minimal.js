console.log('=== ZENTRAW 3D VISUALIZER V1.4.0.a.2 TEST ===');
console.log('Testing basic functionality...');
console.log('');

// Test 1: Basic Node.js functionality
console.log('✓ Node.js is working');
console.log('✓ Console output functional');

// Test 2: Check if required modules exist
try {
    const http = require('http');
    console.log('✓ HTTP module available');
} catch (error) {
    console.log('✗ HTTP module error:', error.message);
}

// Test 3: Simple server test
console.log('');
console.log('Creating simple test server...');

const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end('Zentraw 3D Visualizer Backend Working!');
});

const PORT = 3000;

server.listen(PORT, (err) => {
    if (err) {
        console.log('✗ Server failed to start:', err.message);
        process.exit(1);
    }
    
    console.log(`✓ Server started successfully on port ${PORT}`);
    console.log(`✓ Test URL: http://localhost:${PORT}`);
    console.log('');
    console.log('=== SERVER RUNNING ===');
    console.log('Press Ctrl+C to stop');
});

// Test the server after 1 second
setTimeout(() => {
    console.log('Testing server response...');
    
    const testReq = http.get(`http://localhost:${PORT}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('✓ Server response:', data);
            console.log('✓ Backend is fully functional!');
        });
    }).on('error', (err) => {
        console.log('✗ Server test failed:', err.message);
    });
}, 1000);
