
import express from "express";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

// Rota principal
router.get("/", (req, res) => {
  res.send("Rota principal funcionando!");
});

// Endpoint parametrizado para render
router.post("/render/parametrized", async (req, res) => {
  try {
    const {
      audioPath,
      imagePath,
      outputPath,
      resolution,
      fps,
      engine,
      paramsJson
    } = req.body;

    // Caminho do script Blender
    const blenderScript = path.join(__dirname, "..", "Blender", "render_audio_visualizer_v1.4.0.a.9.1.py");
    // Comando Blender
    const blenderCmd = `blender --background --python "${blenderScript}" -- "${audioPath}" "${imagePath}" "${outputPath}" "${paramsJson}"`;

    exec(blenderCmd, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: stderr || error.message });
      }
      res.json({ success: true, output: stdout });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export function registerRoutes(app) {
  app.use("/api", router);
}

export default router;
