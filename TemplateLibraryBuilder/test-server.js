// Teste do servidor Blender
const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

// Teste simples
app.get('/api/blender/test', (req, res) => {
  res.json({
    success: true,
    message: 'Blender endpoint is working!',
    blenderPath: 'C:\\Program Files\\Blender Foundation\\Blender 4.5',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`🎬 Servidor de teste rodando na porta ${port}`);
  console.log(`🧪 Teste: http://localhost:${port}/api/blender/test`);
});
