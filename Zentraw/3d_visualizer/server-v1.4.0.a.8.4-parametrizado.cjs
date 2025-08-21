// Zentraw Backend V1.4.0.a.8.4 - Parametrizado
// Nova versão oficial, compliance total
// ...existing code from v1.4.0.a.8-parametrizado.cjs...
// Zentraw Backend V1.4.0.a.8.4 - Parametrizado
// Nova versão oficial, compliance total
// Compliance: AI-AGENT-PROTOCOL.md

const express = require('express');
const app = express();
// Porta oficial Zentraw: 3004 (padrão), 3005, 3006 liberadas conforme regras de entrada
const allowedPorts = [3004, 3005, 3006];
const envPort = parseInt(process.env.ZENTRAW_PORT, 10);
const PORT = allowedPorts.includes(envPort) ? envPort : 3004;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: 'V1.4.0.a.8.4', compliance: 'AI-AGENT-PROTOCOL.md' });
});

app.post('/api/blender/render', (req, res) => {
  // Compliance: Chamada do script Python v1.4.0.a.9
  const { audio_path, image_path, output_path, params } = req.body;
  const pythonScript = 'Blender/render_audio_visualizer_v1.4.0.a.9.py';
  const blenderExecutable = 'blender'; // Ajuste se necessário para o seu ambiente
  const templateBlend = 'Blender/template.blend';
  const args = [
    templateBlend,
    '--background',
    '--python', pythonScript,
    '--',
    audio_path,
    image_path,
    output_path,
    JSON.stringify(params || {})
  ];
  console.log('🔍 Chamada Blender:', blenderExecutable, args);
  const { spawn } = require('child_process');
  const blenderProcess = spawn(blenderExecutable, args, { cwd: __dirname });
  let stdout = '';
  let stderr = '';
  blenderProcess.stdout.on('data', (data) => { stdout += data.toString(); });
  blenderProcess.stderr.on('data', (data) => { stderr += data.toString(); });
  blenderProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ status: 'success', compliance: 'AI-AGENT-PROTOCOL.md', stdout });
    } else {
      res.status(500).json({ status: 'error', code, compliance: 'AI-AGENT-PROTOCOL.md', stderr });
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Zentraw Backend V1.4.0.a.8.4 iniciado na porta ${PORT} | Compliance: AI-AGENT-PROTOCOL.md`);
  console.log(`Portas liberadas: ${allowedPorts.join(', ')} | Para usar outra porta, defina a variável de ambiente ZENTRAW_PORT.`);
});
