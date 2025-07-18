import express from "express";
import path from "path";
import blenderRouter from "./routes/blender.js";

const app = express();
const PORT = 5001;

// CORS middleware simples
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ✅ IMAGE PROXY IMPLEMENTATION - Static file serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, path) => {
    console.log('📁 Serving static file:', path);
  }
}));

// API routes
app.use('/api/blender', blenderRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Zentraw 3D Visualizer Backend is running!'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Zentraw 3D Visualizer Backend V1.4.0.a.2',
    status: 'running',
    endpoints: {
      health: '/health',
      blenderTest: '/api/blender/test',
      blenderPreview: '/api/blender/preview'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Zentraw 3D Visualizer Backend running on http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`   - Health: http://localhost:${PORT}/health`);
  console.log(`   - Blender Test: http://localhost:${PORT}/api/blender/test`);
  console.log(`   - Blender Preview: http://localhost:${PORT}/api/blender/preview`);
});
