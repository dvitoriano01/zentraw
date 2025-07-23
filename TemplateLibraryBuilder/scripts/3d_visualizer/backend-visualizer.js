import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { BlenderServiceV2 } from './server/services/blender-service-v2.ts';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

console.log('🎬🔥 ZENTRAW 3D VISUALIZER V1.4.0.a.2 - BACKEND INICIANDO! 🔥🎬');

// Endpoint do visualizador 3D
app.post(
  '/api/blender/audio-visualizer',
  upload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log('🎬 Recebendo request para visualizador 3D...');

      const audioFile = req.files?.audioFile?.[0];
      const imageFile = req.files?.imageFile?.[0];

      if (!audioFile || !imageFile) {
        return res.status(400).json({
          success: false,
          error: 'Audio e imagem são necessários',
        });
      }

      console.log('📊 Files received:', {
        audio: audioFile.originalname,
        image: imageFile.originalname,
      });

      // Chamar o visualizador real
      const result = await BlenderServiceV2.renderAudioVisualizer(audioFile.path, imageFile.path);

      console.log('🎯 Resultado do visualizador:', result);

      res.json(result);
    } catch (error) {
      console.error('💥 Erro no visualizador:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ Zentraw 3D Visualizer V1.4.0.a.2 funcionando!',
    timestamp: new Date().toISOString(),
  });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
  console.log('🎬 Visualizador 3D REAL implementado e pronto!');
});
