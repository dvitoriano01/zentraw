import { createServer } from 'http';

console.log('🎬 ZENTRAW 3D VISUALIZER TEST SERVER STARTING...');

const server = createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  console.log(`Request: ${req.method} ${req.url}`);

  if (req.url === '/api/test') {
    const response = {
      success: true,
      message: 'Zentraw 3D Visualizer V1.4.0.a.2 Working!',
      timestamp: new Date().toISOString(),
      features: [
        'executeAudioVisualizerWithFallback method',
        'Multiple execution strategies',
        '5-minute timeout',
        'Full HD MP4 output',
        'Audio-visual synchronization'
      ]
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
    return;
  }

  if (req.url === '/api/blender/audio-visualizer' && req.method === 'POST') {
    const result = {
      success: true,
      message: 'Visualizer 3D Generated Successfully!',
      method: 'audio-visualizer',
      strategy: 'CROSS_SPAWN',
      outputPath: `uploads/visualizer_${Date.now()}.mp4`,
      timestamp: new Date().toISOString(),
      detailedLogs: [
        'Attempting strategy: CROSS_SPAWN',
        'Blender executable found at C:\\Blender\\blender.exe',
        'Template loaded: template.blend',
        'Audio processed with wave/numpy',
        'Image texture applied to Plane object',
        'Cube animation keyframes created based on audio amplitude',
        'Rendering 1920x1080 MP4 with audio sync',
        'SUCCESS with CROSS_SPAWN: Render completed successfully'
      ]
    };
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // Default response
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Zentraw 3D Visualizer Backend Working!');
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('🎬 Zentraw 3D Visualizer ready for testing!');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   POST http://localhost:${PORT}/api/blender/audio-visualizer`);
  console.log('');
  console.log('✅ READY FOR TESTING!');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('❌ Server error:', err);
  }
});
