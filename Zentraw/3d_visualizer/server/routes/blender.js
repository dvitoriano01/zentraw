import express from "express";

const router = express.Router();

// Exemplo de rota para Blender
router.get("/test", (req, res) => {
  res.send("Blender route funcionando!");
});

export default router;
