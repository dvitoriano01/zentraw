import React from 'react';
import { Type, Image, Sparkles, Layers } from 'lucide-react';

interface SidebarLeftProps {
  addText: () => void;
  uploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  applyTextEffect: (effect: string) => void;
  visualFX: Array<{ id: string; label: string; src: string }>;
  addOverlay: (src: string) => void;
}

const textFX = ['glitch', 'neon', 'chrome'];

export function SidebarLeft({ 
  addText, 
  uploadImage, 
  fileInputRef, 
  applyTextEffect, 
  visualFX, 
  addOverlay 
}: SidebarLeftProps) {
  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-700 p-4">
      {/* Ferramentas */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Layers size={16} />
          Ferramentas
        </h3>
        <div className="space-y-2">
          <button
            onClick={addText}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            <Type size={16} />
            Texto
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            <Image size={16} />
            Imagem
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={uploadImage}
            className="hidden"
          />
        </div>
      </div>

      {/* TextFX */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
          <Sparkles size={16} />
          TextFX
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {textFX.map((fx) => (
            <button
              key={fx}
              onClick={() => applyTextEffect(fx)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm capitalize"
            >
              {fx}
            </button>
          ))}
        </div>
      </div>

      {/* Visual FX */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Visual FX</h3>
        <div className="grid grid-cols-1 gap-2">
          {visualFX.map((fx) => (
            <button
              key={fx.id}
              onClick={() => addOverlay(fx.src)}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
            >
              {fx.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}