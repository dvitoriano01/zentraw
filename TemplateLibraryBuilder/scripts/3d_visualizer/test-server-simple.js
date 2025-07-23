// Servidor de teste simplificado - ES Module
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Teste simples do Blender
app.get('/api/blender/test', (req, res) => {
  res.json({
    success: true,
    message: 'Blender endpoint is working!',
    blenderPath: 'C:\\Program Files\\Blender Foundation\\Blender 4.5',
    templatePath:
      'C:\\Users\\Denys Victoriano\\Documents\\GitHub\\clone\\zentraw\\TemplateLibraryBuilder\\Blender\\template.blend',
    timestamp: new Date().toISOString(),
    status: 'Server is running correctly',
  });
});

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Rota para servir o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Iniciar servidor
app.listen(port, '127.0.0.1', () => {
  console.log(`🎬 Servidor Zentraw rodando na porta ${port}`);
  console.log(`🧪 Teste Blender: http://localhost:${port}/api/blender/test`);
  console.log(`🌐 Interface: http://localhost:${port}`);
});

export default app;
