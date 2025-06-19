import React from 'react';
import { Settings, Palette, Type } from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'overlay';
  x: number;
  y: number;
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  src?: string;
  opacity?: number;
  blendMode?: string;
  effect?: string;
}

interface SidebarRightProps {
  selectedId: string | null;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
}

const availableFonts = ['Arial', 'AkuiNa Bold', 'Custody Script', 'Vibes Arcade', 'Neon Display', 'Future Grunge', 'System Bold', 'System Script'];
const blendModes = ['normal', 'multiply', 'screen', 'overlay', 'lighten', 'darken'];

export function SidebarRight({ selectedId, elements, setElements }: SidebarRightProps) {
  const selectedElement = elements.find(el => el.id === selectedId);

  function updateElement(updates: Partial<CanvasElement>) {
    if (!selectedId) return;
    setElements(prev => 
      prev.map(el => el.id === selectedId ? { ...el, ...updates } : el)
    );
  }

  if (!selectedElement) {
    return (
      <div className="w-64 bg-[#1a1a1a] border-l border-gray-700 p-4">
        <div className="text-gray-400 text-sm text-center mt-8">
          Selecione um elemento para editar propriedades
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#1a1a1a] border-l border-gray-700 p-4">
      <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
        <Settings size={16} />
        Propriedades
      </h3>

      {/* Posição */}
      <div className="mb-4">
        <label className="text-gray-300 text-xs mb-2 block">Posição</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-gray-400 text-xs">X</label>
            <input
              type="number"
              value={selectedElement.x}
              onChange={(e) => updateElement({ x: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs">Y</label>
            <input
              type="number"
              value={selectedElement.y}
              onChange={(e) => updateElement({ y: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
            />
          </div>
        </div>
      </div>

      {/* Text Properties */}
      {selectedElement.type === 'text' && (
        <>
          <div className="mb-4">
            <label className="text-gray-300 text-xs mb-2 block flex items-center gap-2">
              <Type size={14} />
              Texto
            </label>
            <input
              type="text"
              value={selectedElement.text || ''}
              onChange={(e) => updateElement({ text: e.target.value })}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-300 text-xs mb-2 block">Fonte</label>
            <select
              value={selectedElement.font || 'Arial'}
              onChange={(e) => updateElement({ font: e.target.value })}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
            >
              {availableFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-gray-300 text-xs mb-2 block">Tamanho</label>
            <input
              type="number"
              value={selectedElement.size || 48}
              onChange={(e) => updateElement({ size: parseInt(e.target.value) || 48 })}
              className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
            />
          </div>

          <div className="mb-4">
            <label className="text-gray-300 text-xs mb-2 block flex items-center gap-2">
              <Palette size={14} />
              Cor
            </label>
            <input
              type="color"
              value={selectedElement.color || '#ffffff'}
              onChange={(e) => updateElement({ color: e.target.value })}
              className="w-full h-8 bg-gray-700 rounded"
            />
          </div>
        </>
      )}

      {/* Opacity */}
      <div className="mb-4">
        <label className="text-gray-300 text-xs mb-2 block">Opacidade</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedElement.opacity || 1}
          onChange={(e) => updateElement({ opacity: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-gray-400 text-xs text-center mt-1">
          {Math.round((selectedElement.opacity || 1) * 100)}%
        </div>
      </div>

      {/* Blend Mode */}
      <div className="mb-4">
        <label className="text-gray-300 text-xs mb-2 block">Modo de Mesclagem</label>
        <select
          value={selectedElement.blendMode || 'normal'}
          onChange={(e) => updateElement({ blendMode: e.target.value })}
          className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
        >
          {blendModes.map(mode => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>
      </div>
    </div>
  );
}