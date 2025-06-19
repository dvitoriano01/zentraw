// ZentrawWorkspaceLayout.tsx
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Save, Download, Upload, Eye, Grid, Layers, Settings, Type, Image, Palette } from 'lucide-react';
import { Link } from 'wouter';

declare global {
  interface Window {
    fabric: any;
  }
}

export default function ZentrawWorkspaceLayout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<any>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'overlay'>('select');
  const [activeObject, setActiveObject] = useState<any>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const initCanvas = () => {
      if (!window.fabric) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
        document.head.appendChild(script);
        script.onload = createCanvas;
      } else {
        createCanvas();
      }
    };

    const createCanvas = () => {
      const fabric = window.fabric;
      
      const canvas = new fabric.Canvas(canvasRef.current!, {
        width: 1080,
        height: 1080,
        backgroundColor: 'transparent',
        preserveObjectStacking: true
      });
      fabricCanvas.current = canvas;

      // Grade xadrez
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 40;
      const pctx = patternCanvas.getContext('2d')!;
      pctx.fillStyle = '#ccc';
      pctx.fillRect(0, 0, 40, 40);
      pctx.fillStyle = '#eee';
      pctx.fillRect(0, 0, 20, 20);
      pctx.fillRect(20, 20, 20, 20);
      const pattern = new fabric.Pattern({ source: patternCanvas, repeat: 'repeat' });
      canvas.backgroundColor = pattern;
      canvas.renderAll();

      canvas.on('selection:created', (e: any) => setActiveObject(e.selected?.[0] || null));
      canvas.on('selection:updated', (e: any) => setActiveObject(e.selected?.[0] || null));
      canvas.on('selection:cleared', () => setActiveObject(null));

      // Zoom com scroll
      canvas.on('mouse:wheel', (opt: any) => {
        const delta = opt.e.deltaY;
        let newZoom = canvas.getZoom();
        newZoom *= 0.999 ** delta;
        if (newZoom > 20) newZoom = 20;
        if (newZoom < 0.01) newZoom = 0.01;
        setZoom(newZoom);
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      // Delete com tecla Delete
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Delete' && activeObject) {
          canvas.remove(activeObject);
          setActiveObject(null);
          canvas.renderAll();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        canvas.dispose();
      };
    };

    initCanvas();
  }, [activeObject]);

  const handleAddText = () => {
    if (!window.fabric) return;
    const fabric = window.fabric;
    
    const textbox = new fabric.Textbox("Novo Texto", {
      left: 100,
      top: 100,
      fontSize: 48,
      fill: '#ffffff',
      fontFamily: 'Arial'
    });
    fabricCanvas.current?.add(textbox);
    fabricCanvas.current?.setActiveObject(textbox);
    setActiveTool('text');
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !window.fabric) return;
      
      const fabric = window.fabric;
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        fabric.Image.fromURL(imgUrl, (img: any) => {
          img.set({ left: 50, top: 50, selectable: true });
          fabricCanvas.current?.add(img);
          fabricCanvas.current?.setActiveObject(img);
          fabricCanvas.current?.renderAll();
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleAddOverlay = () => {
    if (!window.fabric) return;
    const fabric = window.fabric;
    
    // Criar um overlay simples com cor sólida
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: 1080,
      height: 1080,
      fill: 'rgba(255, 0, 0, 0.3)',
      selectable: true
    });
    fabricCanvas.current?.add(rect);
    fabricCanvas.current?.setActiveObject(rect);
  };

  const exportPNG = () => {
    if (!fabricCanvas.current) return;
    const url = fabricCanvas.current.toDataURL({ format: 'png', multiplier: 2 });
    const link = document.createElement('a');
    link.download = 'zentraw-artwork.png';
    link.href = url;
    link.click();
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    // Implementar toggle da grade se necessário
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      {/* Top Bar */}
      <div className="bg-[#2a2a2a] text-white h-10 flex items-center px-4 text-sm gap-6 border-b border-gray-700">
        <Link href="/">
          <button className="flex items-center gap-2 px-2 py-1 hover:bg-gray-600 rounded text-xs">
            <ArrowLeft size={14} />
            Voltar
          </button>
        </Link>
        <div className="font-bold text-purple-400">ZENTRAW TOOLKIT V2.12.L</div>
        <button className="hover:bg-gray-600 px-2 py-1 rounded">File</button>
        <button className="hover:bg-gray-600 px-2 py-1 rounded">Edit</button>
        <button className="hover:bg-gray-600 px-2 py-1 rounded">View</button>
        <button className="hover:bg-gray-600 px-2 py-1 rounded">Layer</button>
        <button onClick={exportPNG} className="hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1">
          <Download size={12} />
          Export
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tools */}
        <div className="w-16 bg-[#1a1a1a] flex flex-col items-center p-2 text-white gap-4 border-r border-gray-700">
          <button 
            onClick={() => setActiveTool('select')}
            className={`w-10 h-10 rounded flex items-center justify-center ${activeTool === 'select' ? 'bg-purple-600' : 'hover:bg-gray-600'}`}
            title="Selecionar"
          >
            🖱️
          </button>
          <button 
            onClick={() => { setActiveTool('text'); handleAddText(); }}
            className={`w-10 h-10 rounded flex items-center justify-center ${activeTool === 'text' ? 'bg-purple-600' : 'hover:bg-gray-600'}`}
            title="Texto"
          >
            <Type size={16} />
          </button>
          <button 
            onClick={handleAddImage}
            className="w-10 h-10 rounded flex items-center justify-center hover:bg-gray-600"
            title="Imagem"
          >
            <Image size={16} />
          </button>
          <button 
            onClick={() => { setActiveTool('overlay'); handleAddOverlay(); }}
            className={`w-10 h-10 rounded flex items-center justify-center ${activeTool === 'overlay' ? 'bg-purple-600' : 'hover:bg-gray-600'}`}
            title="Overlay"
          >
            <Palette size={16} />
          </button>
          <div className="border-t border-gray-600 w-full my-2"></div>
          <button 
            onClick={toggleGrid}
            className={`w-10 h-10 rounded flex items-center justify-center ${showGrid ? 'bg-blue-600' : 'hover:bg-gray-600'}`}
            title="Grade"
          >
            <Grid size={16} />
          </button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 bg-[#1a1a1a] flex justify-center items-center relative overflow-auto">
          <div className="bg-white shadow-2xl border border-gray-400" style={{
            transform: `scale(${Math.min(zoom, 1)})`,
            transformOrigin: 'center'
          }}>
            <canvas ref={canvasRef} width={1080} height={1080} />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-[#1a1a1a] text-white p-4 overflow-y-auto border-l border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={16} />
            <h3 className="text-sm font-semibold">Propriedades</h3>
          </div>
          
          {activeObject ? (
            <div className="space-y-4">
              {/* Posição */}
              <div>
                <label className="text-xs text-gray-300 block mb-2">Posição</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400">X</label>
                    <input
                      type="number"
                      value={Math.round(activeObject.left || 0)}
                      onChange={(e) => {
                        activeObject.set({ left: parseInt(e.target.value) });
                        fabricCanvas.current?.renderAll();
                      }}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Y</label>
                    <input
                      type="number"
                      value={Math.round(activeObject.top || 0)}
                      onChange={(e) => {
                        activeObject.set({ top: parseInt(e.target.value) });
                        fabricCanvas.current?.renderAll();
                      }}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Opacidade */}
              <div>
                <label className="text-xs text-gray-300 block mb-2">Opacidade</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={activeObject.opacity || 1}
                  onChange={(e) => {
                    activeObject.set({ opacity: parseFloat(e.target.value) });
                    fabricCanvas.current?.renderAll();
                  }}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 text-center mt-1">
                  {Math.round((activeObject.opacity || 1) * 100)}%
                </div>
              </div>

              {/* Propriedades de texto */}
              {activeObject.type === 'textbox' && (
                <>
                  <div>
                    <label className="text-xs text-gray-300 block mb-2">Texto</label>
                    <input
                      type="text"
                      value={activeObject.text || ''}
                      onChange={(e) => {
                        activeObject.set({ text: e.target.value });
                        fabricCanvas.current?.renderAll();
                      }}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-300 block mb-2">Tamanho da Fonte</label>
                    <input
                      type="number"
                      value={activeObject.fontSize || 48}
                      onChange={(e) => {
                        activeObject.set({ fontSize: parseInt(e.target.value) });
                        fabricCanvas.current?.renderAll();
                      }}
                      className="w-full px-2 py-1 bg-gray-700 text-white text-xs rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 block mb-2">Cor</label>
                    <input
                      type="color"
                      value={activeObject.fill || '#ffffff'}
                      onChange={(e) => {
                        activeObject.set({ fill: e.target.value });
                        fabricCanvas.current?.renderAll();
                      }}
                      className="w-full h-8 bg-gray-700 rounded"
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <Layers size={32} className="mb-2" />
              <p className="text-xs text-center">Selecione um objeto para editar suas propriedades</p>
            </div>
          )}

          {/* Informações do zoom */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              Zoom: {Math.round(zoom * 100)}%
            </div>
            <div className="text-xs text-gray-400">
              Canvas: 1080×1080px
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}