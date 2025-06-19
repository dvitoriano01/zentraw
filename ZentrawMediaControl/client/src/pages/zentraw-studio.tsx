// zentraw-studio.tsx - Zentraw Studio Pro Independente
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Save, Download, Type, Image as ImageIcon, Palette, Undo2, Redo2, Square, Smartphone, Monitor } from 'lucide-react';
import { Link } from 'wouter';

declare global {
  interface Window {
    fabric: any;
  }
}

// Hook para histórico de undo/redo
function useCanvasHistory(canvasRef: React.MutableRefObject<any>) {
  const history = useRef<string[]>([]);
  const currentIndex = useRef<number>(-1);

  const saveState = () => {
    if (!canvasRef.current) return;
    
    try {
      const json = canvasRef.current.toJSON(['selectable', 'evented']);
      const jsonString = JSON.stringify(json);
      
      if (currentIndex.current < history.current.length - 1) {
        history.current = history.current.slice(0, currentIndex.current + 1);
      }
      
      history.current.push(jsonString);
      currentIndex.current = history.current.length - 1;
      
      if (history.current.length > 50) {
        history.current.shift();
        currentIndex.current--;
      }
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  };

  const undo = () => {
    if (currentIndex.current <= 0 || !canvasRef.current) return false;
    
    try {
      currentIndex.current--;
      const previousState = history.current[currentIndex.current];
      
      canvasRef.current.loadFromJSON(JSON.parse(previousState), () => {
        canvasRef.current?.renderAll();
      });
      
      return true;
    } catch (error) {
      console.error('Erro no undo:', error);
      return false;
    }
  };

  const redo = () => {
    if (currentIndex.current >= history.current.length - 1 || !canvasRef.current) return false;
    
    try {
      currentIndex.current++;
      const nextState = history.current[currentIndex.current];
      
      canvasRef.current.loadFromJSON(JSON.parse(nextState), () => {
        canvasRef.current?.renderAll();
      });
      
      return true;
    } catch (error) {
      console.error('Erro no redo:', error);
      return false;
    }
  };

  const canUndo = () => currentIndex.current > 0;
  const canRedo = () => currentIndex.current < history.current.length - 1;

  return { saveState, undo, redo, canUndo, canRedo };
}

// Componente de painel de efeitos simplificado
function EffectsPanel({ activeObject, canvasRef }: { activeObject: any; canvasRef: React.MutableRefObject<any> }) {
  const updateCanvas = () => canvasRef.current?.renderAll();

  const applyTextEffect = (effect: string) => {
    if (!activeObject || activeObject.type !== 'textbox') return;

    switch (effect) {
      case 'shadow':
        activeObject.set({ 
          shadow: activeObject.shadow ? null : '2px 2px 8px rgba(0,0,0,0.5)' 
        });
        break;
      case 'outline':
        activeObject.set({
          stroke: activeObject.stroke ? null : '#000000',
          strokeWidth: activeObject.stroke ? 0 : 2
        });
        break;
      case 'glow':
        activeObject.set({ 
          shadow: activeObject.shadow ? null : '0 0 15px rgba(138,43,226,0.8)' 
        });
        break;
    }
    updateCanvas();
  };

  if (!activeObject) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">Selecione um objeto para aplicar efeitos</p>
      </div>
    );
  }

  const isText = activeObject.type === 'textbox';

  return (
    <div className="space-y-4">
      {isText && (
        <div>
          <h4 className="text-sm font-medium text-purple-400 mb-3">Efeitos de Texto</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => applyTextEffect('shadow')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Sombra
            </button>
            <button
              onClick={() => applyTextEffect('glow')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Brilho
            </button>
            <button
              onClick={() => applyTextEffect('outline')}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs col-span-2"
            >
              Contorno
            </button>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3">Transformações</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Opacidade: {Math.round((activeObject.opacity || 1) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={activeObject.opacity || 1}
              onChange={(e) => {
                activeObject.set({ opacity: parseFloat(e.target.value) });
                updateCanvas();
              }}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Rotação: {Math.round(activeObject.angle || 0)}°
            </label>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeObject.angle || 0}
              onChange={(e) => {
                activeObject.set({ angle: parseInt(e.target.value) });
                updateCanvas();
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ZentrawStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<any>(null);
  const [activeObject, setActiveObject] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [activeTab, setActiveTab] = useState<'text' | 'effects' | 'layers'>('text');
  const [isLoading, setIsLoading] = useState(true);
  const { saveState, undo, redo, canUndo, canRedo } = useCanvasHistory(fabricCanvas);

  const formats = {
    square: { width: 1080, height: 1080, name: 'Square', icon: Square },
    story: { width: 1080, height: 1920, name: 'Story', icon: Smartphone },
    poster: { width: 1350, height: 1080, name: 'Poster', icon: Monitor }
  };

  useEffect(() => {
    const initStudio = async () => {
      try {
        // Carregar Fabric.js
        if (!window.fabric) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        const fabric = window.fabric;
        if (!fabric) throw new Error('Fabric.js não carregou');

        // Criar canvas
        const canvas = new fabric.Canvas(canvasRef.current!, {
          width: canvasSize.width,
          height: canvasSize.height,
          backgroundColor: 'white',
          preserveObjectStacking: true,
          selection: true
        });

        fabricCanvas.current = canvas;

        // Event listeners
        canvas.on('selection:created', (e: any) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:updated', (e: any) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:cleared', () => setActiveObject(null));
        
        canvas.on('object:added', () => {
          saveState();
          setObjects([...canvas.getObjects()]);
        });
        
        canvas.on('object:removed', () => {
          saveState();
          setObjects([...canvas.getObjects()]);
        });
        
        canvas.on('object:modified', () => {
          saveState();
          setObjects([...canvas.getObjects()]);
        });

        // Keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
          }
          if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
          }
          if (e.key === 'Delete' && activeObject) {
            canvas.remove(activeObject);
            setActiveObject(null);
            canvas.renderAll();
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        setIsLoading(false);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          canvas.dispose();
        };

      } catch (error) {
        console.error('Erro ao inicializar Studio:', error);
        setIsLoading(false);
      }
    };

    initStudio();
  }, [canvasSize]);

  const addText = () => {
    if (!window.fabric || !fabricCanvas.current) return;
    
    const fabric = window.fabric;
    const text = new fabric.Textbox('Zentraw Studio', {
      left: 100 + Math.random() * 200,
      top: 100 + Math.random() * 200,
      fontSize: 60,
      fontFamily: 'Arial',
      fill: '#000000',
      fontWeight: 'bold',
      editable: true,
      width: 300
    });
    
    fabricCanvas.current.add(text);
    fabricCanvas.current.setActiveObject(text);
  };

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !window.fabric || !fabricCanvas.current) return;
      
      const fabric = window.fabric;
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        fabric.Image.fromURL(imgUrl, (img: any) => {
          const scale = Math.min(400 / img.width, 400 / img.height);
          img.set({
            left: 50,
            top: 50,
            scaleX: scale,
            scaleY: scale
          });
          fabricCanvas.current?.add(img);
          fabricCanvas.current?.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const exportPNG = () => {
    if (!fabricCanvas.current) return;
    
    const dataUrl = fabricCanvas.current.toDataURL({
      format: 'png',
      multiplier: 2,
      quality: 1.0
    });
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `zentraw-cover-${Date.now()}.png`;
    a.click();
  };

  const exportJSON = () => {
    if (!fabricCanvas.current) return;
    
    const projectData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      canvas: fabricCanvas.current.toJSON(['selectable', 'evented']),
      metadata: {
        format: `${canvasSize.width}x${canvasSize.height}`,
        objects: objects.length,
        creator: 'Zentraw Studio Pro'
      }
    };
    
    const json = JSON.stringify(projectData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-zentraw-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const changeFormat = (format: keyof typeof formats) => {
    setCanvasSize(formats[format]);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Zentraw Studio Pro</h2>
          <p className="text-gray-400">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="h-14 bg-[#1a1a1a] border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-700 rounded transition-colors">
              <ArrowLeft size={16} />
              Voltar ao Toolkit
            </button>
          </Link>
          <div className="border-l border-gray-600 h-6"></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ZENTRAW STUDIO PRO
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Formatos */}
          <div className="flex gap-1 bg-gray-800 rounded p-1">
            {Object.entries(formats).map(([key, format]) => {
              const Icon = format.icon;
              const isActive = canvasSize.width === format.width && canvasSize.height === format.height;
              return (
                <button
                  key={key}
                  onClick={() => changeFormat(key as keyof typeof formats)}
                  className={`px-3 py-1 text-xs rounded flex items-center gap-1 transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={12} />
                  {format.name}
                </button>
              );
            })}
          </div>

          <div className="border-l border-gray-600 h-6"></div>

          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={`p-2 rounded ${canUndo() ? 'hover:bg-gray-700' : 'opacity-30 cursor-not-allowed'}`}
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={`p-2 rounded ${canRedo() ? 'hover:bg-gray-700' : 'opacity-30 cursor-not-allowed'}`}
          >
            <Redo2 size={16} />
          </button>

          <div className="border-l border-gray-600 h-6"></div>

          {/* Export */}
          <button
            onClick={exportPNG}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            PNG
          </button>
          <button
            onClick={exportJSON}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2 transition-colors"
          >
            <Save size={16} />
            JSON
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Tools Sidebar */}
        <div className="w-20 bg-[#1a1a1a] border-r border-gray-700 flex flex-col items-center p-3 gap-4">
          <button
            onClick={addText}
            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-xl flex items-center justify-center text-xl font-bold transition-colors"
            title="Adicionar Texto"
          >
            T
          </button>
          <button
            onClick={addImage}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center transition-colors"
            title="Adicionar Imagem"
          >
            <ImageIcon size={20} />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-[#151515] p-6">
          <div 
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: Math.min(canvasSize.width, window.innerWidth - 500),
              height: Math.min(canvasSize.height, window.innerHeight - 150)
            }}
          >
            <canvas 
              ref={canvasRef}
              className="block"
            />
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-[#1a1a1a] border-l border-gray-700">
          <div className="p-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-gray-800 rounded p-1 mb-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                  activeTab === 'text' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Texto
              </button>
              <button
                onClick={() => setActiveTab('effects')}
                className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                  activeTab === 'effects' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Efeitos
              </button>
              <button
                onClick={() => setActiveTab('layers')}
                className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                  activeTab === 'layers' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Camadas
              </button>
            </div>

            {/* Content */}
            {activeTab === 'text' && activeObject?.type === 'textbox' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-purple-400">Propriedades do Texto</h3>
                
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Conteúdo</label>
                  <textarea
                    value={activeObject.text || ''}
                    onChange={(e) => {
                      activeObject.set({ text: e.target.value });
                      fabricCanvas.current?.renderAll();
                    }}
                    className="w-full px-3 py-2 bg-gray-800 text-white text-sm rounded resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">
                    Tamanho: {activeObject.fontSize || 60}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="200"
                    value={activeObject.fontSize || 60}
                    onChange={(e) => {
                      activeObject.set({ fontSize: parseInt(e.target.value) });
                      fabricCanvas.current?.renderAll();
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Cor</label>
                  <input
                    type="color"
                    value={activeObject.fill || '#000000'}
                    onChange={(e) => {
                      activeObject.set({ fill: e.target.value });
                      fabricCanvas.current?.renderAll();
                    }}
                    className="w-full h-10 bg-gray-800 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'effects' && (
              <EffectsPanel activeObject={activeObject} canvasRef={fabricCanvas} />
            )}

            {activeTab === 'layers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-400">Camadas</h3>
                  <span className="text-xs text-gray-400">{objects.length} objetos</span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {objects.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-gray-400">Nenhuma camada</p>
                    </div>
                  ) : (
                    objects.slice().reverse().map((obj, i) => {
                      const isActive = activeObject === obj;
                      const name = obj.type === 'textbox' ? `Texto: ${obj.text?.substring(0, 20)}...` :
                                  obj.type === 'image' ? 'Imagem' : obj.type;
                      
                      return (
                        <div
                          key={`${obj.type}-${i}`}
                          className={`p-3 rounded cursor-pointer transition-colors ${
                            isActive ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            fabricCanvas.current?.setActiveObject(obj);
                            fabricCanvas.current?.renderAll();
                            setActiveObject(obj);
                          }}
                        >
                          <span className="text-sm">{name}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Info Panel */}
            <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-400 space-y-1">
              <div>Canvas: {canvasSize.width}×{canvasSize.height}px</div>
              <div>Objetos: {objects.length}</div>
              <div>Versão: Studio Pro 1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}