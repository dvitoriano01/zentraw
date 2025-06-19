// ZentrawFXPanel.tsx - Painel de Efeitos Visuais e Filtros
import { useState } from 'react';
import { Sliders, Palette, Zap, RotateCcw } from 'lucide-react';

declare global {
  interface Window {
    fabric: any;
  }
}

interface ZentrawFXPanelProps {
  object: any;
  canvasRef: React.MutableRefObject<any>;
  fontList: string[];
  onUpdate?: () => void;
}

export default function ZentrawFXPanel({ object, canvasRef, fontList, onUpdate }: ZentrawFXPanelProps) {
  const [activeTab, setActiveTab] = useState<'effects' | 'filters' | 'blend'>('effects');

  if (!object) {
    return (
      <div className="text-center py-8">
        <Palette size={48} className="mx-auto opacity-30 text-gray-400 mb-4" />
        <p className="text-sm text-gray-400">Selecione um objeto para aplicar efeitos</p>
      </div>
    );
  }

  const isText = object.type === 'textbox';
  const isImage = object.type === 'image';

  const updateCanvas = () => {
    canvasRef.current?.renderAll();
    onUpdate?.();
  };

  const applyImageFilter = (filterType: string, options: any = {}) => {
    if (!window.fabric || !isImage) return;
    
    const fabric = window.fabric;
    
    try {
      let filter;
      switch (filterType) {
        case 'blur':
          filter = new fabric.Image.filters.Blur({ blur: options.blur || 0.2 });
          break;
        case 'brightness':
          filter = new fabric.Image.filters.Brightness({ brightness: options.brightness || 0.3 });
          break;
        case 'contrast':
          filter = new fabric.Image.filters.Contrast({ contrast: options.contrast || 0.5 });
          break;
        case 'grayscale':
          filter = new fabric.Image.filters.Grayscale();
          break;
        case 'sepia':
          filter = new fabric.Image.filters.Sepia();
          break;
        case 'invert':
          filter = new fabric.Image.filters.Invert();
          break;
        case 'noise':
          filter = new fabric.Image.filters.Noise({ noise: options.noise || 100 });
          break;
        case 'hue':
          filter = new fabric.Image.filters.HueRotation({ rotation: options.rotation || 0.5 });
          break;
        default:
          return;
      }

      object.filters = object.filters || [];
      object.filters.push(filter);
      object.applyFilters();
      updateCanvas();
    } catch (error) {
      console.warn('Erro ao aplicar filtro:', error);
    }
  };

  const clearFilters = () => {
    if (object.filters) {
      object.filters = [];
      object.applyFilters();
      updateCanvas();
    }
  };

  const applyTextEffect = (effectType: string) => {
    if (!isText || !window.fabric) return;

    const fabric = window.fabric;

    switch (effectType) {
      case 'warp':
        object.set({ skewX: object.skewX === 20 ? 0 : 20 });
        break;
      case 'arch':
        object.set({ skewY: object.skewY === 15 ? 0 : 15 });
        break;
      case 'wave':
        object.set({ angle: object.angle === 5 ? 0 : 5 });
        break;
      case 'glow':
        object.set({ 
          shadow: object.shadow ? null : '0 0 20px rgba(255, 255, 255, 0.8)' 
        });
        break;
      case 'outline':
        object.set({
          stroke: object.stroke ? null : '#000000',
          strokeWidth: object.stroke ? 0 : 2
        });
        break;
      case 'glitch':
        // Efeito glitch duplicando o texto com offset
        try {
          if (window.fabric) {
            const fabric = window.fabric;
            const clone = fabric.util.object.clone(object);
            clone.set({ 
              left: (object.left || 0) + 3, 
              top: (object.top || 0) + 3, 
              fill: 'rgba(255, 0, 0, 0.7)',
              selectable: false
            });
            canvasRef.current?.add(clone);
            canvasRef.current?.sendToBack(clone);
          }
        } catch (error) {
          console.warn('Erro ao aplicar efeito glitch:', error);
        }
        break;
    }
    updateCanvas();
  };

  const changeBlendMode = (mode: string) => {
    object.globalCompositeOperation = mode;
    updateCanvas();
  };

  const blendModes = [
    'source-over', 'multiply', 'screen', 'overlay', 'soft-light',
    'hard-light', 'color-dodge', 'color-burn', 'darken', 'lighten',
    'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-purple-400" />
        <h3 className="text-sm font-bold text-purple-400">Efeitos Visuais</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded p-1">
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
            activeTab === 'effects' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Efeitos
        </button>
        <button
          onClick={() => setActiveTab('filters')}
          className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
            activeTab === 'filters' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Filtros
        </button>
        <button
          onClick={() => setActiveTab('blend')}
          className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
            activeTab === 'blend' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Blend
        </button>
      </div>

      {/* Effects Tab */}
      {activeTab === 'effects' && (
        <div className="space-y-4">
          {isText && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Efeitos de Texto</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyTextEffect('warp')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Warp
                </button>
                <button
                  onClick={() => applyTextEffect('arch')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Arco
                </button>
                <button
                  onClick={() => applyTextEffect('wave')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Onda
                </button>
                <button
                  onClick={() => applyTextEffect('glow')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Brilho
                </button>
                <button
                  onClick={() => applyTextEffect('outline')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
                >
                  Contorno
                </button>
                <button
                  onClick={() => applyTextEffect('glitch')}
                  className="px-3 py-2 bg-red-700 hover:bg-red-600 rounded text-xs transition-colors"
                >
                  Glitch
                </button>
              </div>
            </div>
          )}

          {/* Transformações Gerais */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Transformações</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Rotação: {Math.round(object.angle || 0)}°
                </label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={object.angle || 0}
                  onChange={(e) => {
                    object.set({ angle: parseInt(e.target.value) });
                    updateCanvas();
                  }}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Escala: {Math.round((object.scaleX || 1) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={object.scaleX || 1}
                  onChange={(e) => {
                    const scale = parseFloat(e.target.value);
                    object.set({ scaleX: scale, scaleY: scale });
                    updateCanvas();
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Tab */}
      {activeTab === 'filters' && (
        <div className="space-y-4">
          {isImage ? (
            <>
              <h4 className="text-sm font-medium text-gray-300 mb-3">Filtros de Imagem</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyImageFilter('blur', { blur: 0.3 })}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Blur
                </button>
                <button
                  onClick={() => applyImageFilter('brightness', { brightness: 0.3 })}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Brilho
                </button>
                <button
                  onClick={() => applyImageFilter('contrast', { contrast: 0.5 })}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Contraste
                </button>
                <button
                  onClick={() => applyImageFilter('grayscale')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  P&B
                </button>
                <button
                  onClick={() => applyImageFilter('sepia')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Sépia
                </button>
                <button
                  onClick={() => applyImageFilter('invert')}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Inverter
                </button>
                <button
                  onClick={() => applyImageFilter('noise', { noise: 50 })}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Ruído
                </button>
                <button
                  onClick={() => applyImageFilter('hue', { rotation: 0.5 })}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                >
                  Matiz
                </button>
              </div>
              
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw size={12} />
                Limpar Filtros
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-gray-400">Filtros disponíveis apenas para imagens</p>
            </div>
          )}
        </div>
      )}

      {/* Blend Tab */}
      {activeTab === 'blend' && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Modo de Mistura</h4>
          <select
            value={object.globalCompositeOperation || 'source-over'}
            onChange={(e) => changeBlendMode(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white text-xs rounded"
          >
            <option value="source-over">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="soft-light">Soft Light</option>
            <option value="hard-light">Hard Light</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
          </select>

          <div className="text-xs text-gray-400 space-y-2">
            <p><strong>Multiply:</strong> Escurece multiplicando cores</p>
            <p><strong>Screen:</strong> Clareia invertendo e multiplicando</p>
            <p><strong>Overlay:</strong> Combina multiply e screen</p>
            <p><strong>Difference:</strong> Cria efeitos de contraste</p>
          </div>
        </div>
      )}
    </div>
  );
}