import React from "react";
import { createRoot } from "react-dom/client";
import PhotoEditorFixed from "./pages/PhotoEditorFixed";

// Estilos
import "./index.css";
import "./styles/fonts_freepik.css";

// Observador de fonte (opcional, mas útil para fontes do Freepik)
import FontFaceObserver from "fontfaceobserver";

// Garante que a fonte está carregada antes de aplicar a classe
const font = new FontFaceObserver("Akuina Akuina Bold 700");
font.load().then(() => {
  console.log("Fonte Akuina carregada!");
  document.documentElement.classList.add("font-loaded");
});

// Renderiza o editor como página principal
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PhotoEditorFixed />
  </React.StrictMode>
);
