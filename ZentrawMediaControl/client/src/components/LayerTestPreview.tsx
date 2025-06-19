// LayerTestPreview.tsx - Mini App React para testar camadas com imagem base, texto e overlay
import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface TextReplacers {
  ARTIST: string;
  TITLE: string;
}

interface LayerState {
  show: boolean;
  blend: string;
  alpha: number;
  scale: number;
}

const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
  'hard-light', 'color-dodge', 'color-burn', 'darken', 
  'lighten', 'difference', 'exclusion'
];

export default function LayerTestPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [textSvg, setTextSvg] = useState<string | null>(null);
  const [overlaySvg, setOverlaySvg] = useState<string | null>(null);

  const [layers, setLayers] = useState({
    base: { show: true, blend: 'normal', alpha: 1, scale: 1 },
    text: { show: true, blend: 'normal', alpha: 1, scale: 1 },
    overlay: { show: true, blend: 'normal', alpha: 1, scale: 1 }
  });

  const [textReplacers, setTextReplacers] = useState<TextReplacers>({ 
    ARTIST: 'ZENTRAW ARTIST', 
    TITLE: 'SAMPLE TITLE' 
  });

  const [isApplying, setIsApplying] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'base' | 'text' | 'overlay') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'base') setBaseImage(result);
      if (type === 'text') setTextSvg(result);
      if (type === 'overlay') setOverlaySvg(result);
    };
    reader.readAsDataURL(file);
  };

  const updateLayer = (layerType: keyof typeof layers, property: keyof LayerState, value: any) => {
    setLayers(prev => ({
      ...prev,
      [layerType]: {
        ...prev[layerType],
        [property]: value
      }
    }));
  };

  const drawLayer = (ctx: CanvasRenderingContext2D, src: string, options: LayerState): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = options.alpha;
        ctx.globalCompositeOperation = options.blend as GlobalCompositeOperation;
        
        const scale = options.scale;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (1080 - w) / 2;
        const y = (1080 - h) / 2;
        
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  };

  const applyCanvas = async () => {
    if (!canvasRef.current) return;
    
    setIsApplying(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1080, 1080);

    try {
      // Layer 1: Base Image
      if (layers.base.show && baseImage) {
        await drawLayer(ctx, baseImage, layers.base);
      }

      // Layer 2: Text SVG (with replacements)
      if (layers.text.show && textSvg) {
        let svgTextProcessed = textSvg;
        Object.entries(textReplacers).forEach(([key, val]) => {
          const regex = new RegExp(key, 'g');
          svgTextProcessed = svgTextProcessed.replace(regex, val);
        });

        const blob = new Blob([svgTextProcessed], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        await drawLayer(ctx, url, layers.text);
        URL.revokeObjectURL(url);
      }

      // Layer 3: Overlay SVG
      if (layers.overlay.show && overlaySvg) {
        await drawLayer(ctx, overlaySvg, layers.overlay);
      }
    } catch (error) {
      console.error('Erro ao aplicar camadas:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const exportImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `zentraw-layers-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  const resetLayers = () => {
    setLayers({
      base: { show: true, blend: 'normal', alpha: 1, scale: 1 },
      text: { show: true, blend: 'normal', alpha: 1, scale: 1 },
      overlay: { show: true, blend: 'normal', alpha: 1, scale: 1 }
    });
    setTextReplacers({ ARTIST: 'ZENTRAW ARTIST', TITLE: 'SAMPLE TITLE' });
  };

  // Auto-apply when layers change
  useEffect(() => {
    if (baseImage || textSvg || overlaySvg) {
      const timer = setTimeout(applyCanvas, 300);
      return () => clearTimeout(timer);
    }
  }, [layers, textReplacers, baseImage, textSvg, overlaySvg]);

  const LayerControl = ({ 
    type, 
    layer, 
    hasContent 
  }: { 
    type: 'base' | 'text' | 'overlay'; 
    layer: LayerState; 
    hasContent: boolean;
  }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-400 uppercase">{type}</h3>
        <button
          onClick={() => updateLayer(type, 'show', !layer.show)}
          className={`p-1 rounded ${layer.show ? 'text-green-400' : 'text-gray-500'}`}
        >
          {layer.show ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* Upload */}
      <div className="mb-3">
        <label className="flex items-center gap-2 cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded text-xs">
          <Upload size={14} />
          Upload {type === 'text' || type === 'overlay' ? 'SVG' : 'Image'}
          <input
            type="file"
            accept={type === 'text' || type === 'overlay' ? '.svg,image/svg+xml' : 'image/*'}
            onChange={(e) => handleImageUpload(e, type)}
            className="hidden"
          />
        </label>
        {hasContent && <div className="text-xs text-green-400 mt-1">✓ Loaded</div>}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Blend Mode */}
        <div>
          <label className="text-xs text-gray-300 block mb-1">Blend Mode</label>
          <select
            value={layer.blend}
            onChange={(e) => updateLayer(type, 'blend', e.target.value)}
            className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded"
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>

        {/* Alpha */}
        <div>
          <label className="text-xs text-gray-300 block mb-1">
            Opacidade: {Math.round(layer.alpha * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={layer.alpha}
            onChange={(e) => updateLayer(type, 'alpha', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Scale */}
        <div>
          <label className="text-xs text-gray-300 block mb-1">
            Escala: {layer.scale.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={layer.scale}
            onChange={(e) => updateLayer(type, 'scale', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ZENTRAW LAYER TEST
          </h1>
          <div className="flex gap-3">
            <button
              onClick={resetLayers}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={applyCanvas}
              disabled={isApplying}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors disabled:opacity-50"
            >
              {isApplying ? 'Aplicando...' : 'Aplicar Camadas'}
            </button>
            <button
              onClick={exportImage}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              <Download size={16} />
              Export PNG
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Layer Controls */}
          <div className="xl:col-span-1 space-y-4">
            <LayerControl 
              type="base" 
              layer={layers.base} 
              hasContent={!!baseImage} 
            />
            <LayerControl 
              type="text" 
              layer={layers.text} 
              hasContent={!!textSvg} 
            />
            <LayerControl 
              type="overlay" 
              layer={layers.overlay} 
              hasContent={!!overlaySvg} 
            />

            {/* Text Replacers */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-sm font-bold text-purple-400 mb-3">TEXTO DINÂMICO</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Artist Name</label>
                  <input
                    type="text"
                    value={textReplacers.ARTIST}
                    onChange={(e) => setTextReplacers(prev => ({ ...prev, ARTIST: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded"
                    placeholder="Digite o nome do artista"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Title</label>
                  <input
                    type="text"
                    value={textReplacers.TITLE}
                    onChange={(e) => setTextReplacers(prev => ({ ...prev, TITLE: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded"
                    placeholder="Digite o título"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="xl:col-span-3">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Preview (1080x1080px)</h3>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={1080}
                  height={1080}
                  className="max-w-full max-h-[600px] border border-gray-600 rounded shadow-lg bg-white"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              
              {/* Layer Status */}
              <div className="mt-4 flex justify-center gap-4 text-xs">
                <div className={`flex items-center gap-1 ${baseImage ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  Base: {baseImage ? 'Loaded' : 'Empty'}
                </div>
                <div className={`flex items-center gap-1 ${textSvg ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  Text: {textSvg ? 'Loaded' : 'Empty'}
                </div>
                <div className={`flex items-center gap-1 ${overlaySvg ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  Overlay: {overlaySvg ? 'Loaded' : 'Empty'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}