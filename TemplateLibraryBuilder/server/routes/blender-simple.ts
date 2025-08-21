import express from 'express';

const router = express.Router();

// Rota de teste simples
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: "Simple Blender endpoint is working!",
    timestamp: new Date().toISOString()
  });
});

// Rota de render simples
router.post('/test-render', (req, res) => {
  res.json({
    success: true,
    message: "Test render endpoint is working!",
    timestamp: new Date().toISOString()
  });
});

export default router;
