// Teste simples das rotas do Blender
import express from 'express';
import blenderRoutes from './server/routes/blender.ts';

const app = express();
app.use(express.json());

// Registrar as rotas do Blender
app.use('/api/blender', blenderRoutes);

// Teste básico
app.get('/test', (req, res) => {
  res.json({ message: 'Test server working!' });
});

const port = 3001;
app.listen(port, '127.0.0.1', () => {
  console.log(`Test server running on port ${port}`);
  console.log('Testing routes:');
  console.log('- GET  http://localhost:3001/test');
  console.log('- GET  http://localhost:3001/api/blender/test');
  console.log('- POST http://localhost:3001/api/blender/test-render');
});
