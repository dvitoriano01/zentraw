import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PhotoEditorFixed from './pages/PhotoEditorFixed';
import BlenderVisualizerPage from './pages/blender-visualizer';
import App from './App';

// Estilos
import './index.css';

function MainApp() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-white">🎨 Zentraw Studio</h1>
              <div className="flex gap-4">
                <Link 
                  to="/" 
                  className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Photo Editor
                </Link>
                <Link 
                  to="/blender" 
                  className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  🎬 3D Visualizer
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<PhotoEditorFixed />} />
          <Route path="/blender" element={<BlenderVisualizerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Renderiza o app principal com roteamento
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
);
