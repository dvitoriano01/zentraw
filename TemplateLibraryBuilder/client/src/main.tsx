import React from 'react';
import { createRoot } from 'react-dom/client';
import PhotoEditorFixed from './pages/PhotoEditorFixed';
import App from './App';

// Estilos
import './index.css';

// Renderiza o editor como página principal
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PhotoEditorFixed />
  </React.StrictMode>,
);
