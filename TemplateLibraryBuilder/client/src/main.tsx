import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/fonts_freepik.css"; // <-- Adicione esta linha!
import "./styles/fonts_freepik.css";
import FontFaceObserver from "fontfaceobserver";

// Observa a fonte que você quer garantir que carregou
const font = new FontFaceObserver("Akuina Akuina Bold 700");

font.load().then(() => {
  console.log("Fonte Akuina carregada!");
  document.documentElement.classList.add("font-loaded");
});


createRoot(document.getElementById("root")!).render(<App />);