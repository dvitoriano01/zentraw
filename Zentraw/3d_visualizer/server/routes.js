import express from "express";

const router = express.Router();

// Exemplo de rota básica
router.get("/", (req, res) => {
  res.send("Rota principal funcionando!");
});

export function registerRoutes(app) {
  app.use("/api", router);
}

export default router;
