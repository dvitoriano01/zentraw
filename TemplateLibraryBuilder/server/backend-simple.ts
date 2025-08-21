import express from "express";
import path from "path";
import blenderRouter from "./routes/blender.js";

const app = express();

// CORS middleware simples
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
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

// ✅ SOLUÇÃO: Servir arquivos estáticos da pasta uploads
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('📁 Static files serving from:', uploadsPath);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Log middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} [backend] ${req.method} ${req.path}`);
  next();
});

// ✅ ROTAS PRINCIPAIS
// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Zentraw 3D Visualizer Backend is running!',
    version: '1.4.0.a.2'
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

// Blender routes
app.use('/api/blender', blenderRouter);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

const port = 5001;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🎨 Blender test: http://localhost:${port}/api/blender/test`);
  console.log(`🔗 CORS enabled for frontend ports`);
});
