// ZentrawWorkspaceFull.tsx - Editor Visual Pro Completo para Zentraw
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Save, Download, Upload, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Type, Image as ImageIcon, Palette, RotateCcw, Undo2, Redo2, Square, Smartphone, Monitor } from 'lucide-react';
import { Link } from 'wouter';
import { useHistory } from './ZentrawHistory';
import ZentrawFXPanel from './ZentrawFXPanel';

declare global {
  interface Window {
    fabric: any;
  }
}

export default function ZentrawWorkspaceFull() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<any>(null);
  const [activeObject, setActiveObject] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [zoom, setZoom] = useState(1);
  const [canvasInitialized, setCanvasInitialized] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1080, height: 1080 });
  const [activeTab, setActiveTab] = useState<'properties' | 'effects' | 'layers'>('properties');
  const { saveState, undo, redo, canUndo, canRedo } = useHistory(fabricCanvas);

  const fontList = [
    'Arkhip', 
    'FreepikFont', 
    'AkuiNa Bold', 
    'Custody Script', 
    'Vibes Arcade', 
    'Neon Display',
    'Arial',
    'Georgia',
    'Impact',
    'Times New Roman',
    'Helvetica'
  ];

  const formats = {
    square: { width: 1080, height: 1080, name: 'Square', icon: Square },
    story: { width: 1080, height: 1920, name: 'Story', icon: Smartphone },
    poster: { width: 1350, height: 1080, name: 'Poster', icon: Monitor }
  };

  const loadFonts = async () => {
    const promises = fontList.slice(0, 6).map(name => {
      const fontFileName = name.replace(/\s+/g, '');
      const font = new FontFace(name, `url(/fonts/${fontFileName}.ttf)`);
      return font.load().then(loaded => {
        document.fonts.add(loaded);
        console.log(`Fonte carregada: ${name}`);
      }).catch(err => {
        console.warn(`Erro ao carregar fonte ${name}:`, err);
      });
    });
    
    await Promise.allSettled(promises);
  };

  useEffect(() => {
    const initCanvas = async () => {
      try {
        await loadFonts();

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
          backgroundColor: 'transparent',
          preserveObjectStacking: true,
          selection: true
        });

        // Background pattern (grade xadrez)
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = bgCanvas.height = 40;
        const ctx = bgCanvas.getContext('2d')!;
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, 40, 40);
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, 20, 20);
        ctx.fillRect(20, 20, 20, 20);
        const pattern = new fabric.Pattern({ source: bgCanvas, repeat: 'repeat' });
        canvas.setBackgroundColor(pattern, canvas.renderAll.bind(canvas));

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
        setCanvasInitialized(true);

        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          canvas.dispose();
        };

      } catch (error) {
        console.error('Erro ao inicializar canvas:', error);
        setCanvasInitialized(true);
      }
    };

    initCanvas();
  }, [canvasSize]);

  const addText = () => {
    if (!window.fabric || !fabricCanvas.current) return;
    
    const fabric = window.fabric;
    const text = new fabric.Textbox('Texto Zentraw', {
      left: 100 + Math.random() * 200,
      top: 100 + Math.random() * 200,
      fontSize: 48,
      fontFamily: 'Arkhip',
      fill: '#111',
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

  const addOverlay = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.svg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !window.fabric || !fabricCanvas.current) return;
      
      const fabric = window.fabric;
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        
        if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
          // Handle SVG files
          fabric.loadSVGFromURL(imgUrl, (objects: any[], options: any) => {
            const svg = fabric.util.groupSVGElements(objects, options);
            svg.set({
              left: 100,
              top: 100,
              scaleX: 0.5,
              scaleY: 0.5
            });
            fabricCanvas.current?.add(svg);
            fabricCanvas.current?.setActiveObject(svg);
          });
        } else {
          // Handle regular images
          fabric.Image.fromURL(imgUrl, (img: any) => {
            const scale = Math.min(400 / img.width, 400 / img.height);
            img.set({
              left: 50,
              top: 50,
              scaleX: scale,
              scaleY: scale,
              opacity: 0.8
            });
            fabricCanvas.current?.add(img);
            fabricCanvas.current?.setActiveObject(img);
          });
        }
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
    a.download = `zentraw-studio-${Date.now()}.png`;
    a.click();
  };

  const exportJSON = () => {
    if (!fabricCanvas.current) return;
    
    const json = {
      version: '2.12.L',
      timestamp: new Date().toISOString(),
      canvas: fabricCanvas.current.toJSON(['selectable', 'evented']),
      metadata: {
        zoom: zoom,
        objects: objects.length,
        creator: 'Zentraw Studio Pro'
      }
    };
    
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-zentraw-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleObjectVisibility = (obj: any) => {
    obj.visible = !obj.visible;
    fabricCanvas.current?.renderAll();
    setObjects([...fabricCanvas.current.getObjects()]);
  };

  const toggleObjectLock = (obj: any) => {
    obj.selectable = !obj.selectable;
    obj.evented = !obj.evented;
    setObjects([...fabricCanvas.current.getObjects()]);
  };

  const moveObjectUp = (obj: any) => {
    fabricCanvas.current?.bringForward(obj);
    fabricCanvas.current?.renderAll();
    setObjects([...fabricCanvas.current.getObjects()]);
  };

  const moveObjectDown = (obj: any) => {
    fabricCanvas.current?.sendBackwards(obj);
    fabricCanvas.current?.renderAll();
    setObjects([...fabricCanvas.current.getObjects()]);
  };

  const selectObject = (obj: any) => {
    fabricCanvas.current?.setActiveObject(obj);
    fabricCanvas.current?.renderAll();
    setActiveObject(obj);
  };

  const updateTextProperty = (property: string, value: any) => {
    if (!activeObject || activeObject.type !== 'textbox') return;
    
    activeObject.set({ [property]: value });
    fabricCanvas.current?.renderAll();
    setObjects([...fabricCanvas.current.getObjects()]);
  };

  const changeCanvasFormat = (format: keyof typeof formats) => {
    setCanvasSize(formats[format]);
  };

  if (!canvasInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Zentraw Studio Pro</h2>
          <p className="text-gray-400">Carregando editor completo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a]">
      {/* Menu Bar */}
      <div className="h-8 bg-[#0a0a0a] text-white flex items-center px-4 text-sm gap-6 border-b border-gray-800">
        <div className="font-bold text-purple-400">ZENTRAW TOOLKIT</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Arquivo</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Editar</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Visualizar</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Camada</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Exportar</div>
        <div className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">Ajuda</div>
      </div>

      {/* Header */}
      <div className="h-12 bg-[#1a1a1a] border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 px-3 py-1 hover:bg-gray-700 rounded transition-colors">
              <ArrowLeft size={16} />
              Voltar
            </button>
          </Link>
          <div className="border-l border-gray-600 h-6"></div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ZENTRAW WORKSPACE PRO
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
                  onClick={() => changeCanvasFormat(key as keyof typeof formats)}
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
        <div className="w-16 bg-[#1a1a1a] border-r border-gray-700 flex flex-col items-center p-3 gap-4">
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
          <button
            onClick={addOverlay}
            className="w-12 h-12 bg-pink-600 hover:bg-pink-700 rounded-xl flex items-center justify-center transition-colors"
            title="Adicionar Overlay"
          >
            <Palette size={20} />
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
                onClick={() => setActiveTab('properties')}
                className={`flex-1 px-3 py-2 text-xs rounded transition-colors ${
                  activeTab === 'properties' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Propriedades
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

            {/* Properties Tab */}
            {activeTab === 'properties' && activeObject && (
              <div className="space-y-4 text-white">
                {/* Object Info */}
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-xs text-gray-400 mb-2">Objeto Selecionado</div>
                  <div className="text-sm font-medium">
                    {activeObject.type === 'textbox' ? `Texto: "${activeObject.text?.substring(0, 20)}..."` : 
                     activeObject.type === 'image' ? 'Imagem' : 
                     activeObject.type === 'rect' ? 'Overlay/Forma' : 
                     activeObject.type}
                  </div>
                </div>

                {/* Basic Properties */}
                <div>
                  <label className="text-xs text-gray-300 block mb-2">Opacidade: {Math.round((activeObject.opacity || 1) * 100)}%</label>
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
                </div>

                {/* Text Properties */}
                {activeObject.type === 'textbox' && (
                  <div className="space-y-4 border-t border-gray-600 pt-4">
                    <h4 className="text-sm font-semibold text-purple-400">Propriedades de Texto</h4>

                    {/* Text Content */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Conteúdo</label>
                      <textarea
                        value={activeObject.text || ''}
                        onChange={(e) => updateTextProperty('text', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded resize-none"
                        rows={3}
                      />
                    </div>

                    {/* Font Family */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Fonte</label>
                      <select
                        value={activeObject.fontFamily || 'Arkhip'}
                        onChange={(e) => updateTextProperty('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded"
                      >
                        {fontList.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">
                        Tamanho: {activeObject.fontSize || 48}px
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={activeObject.fontSize || 48}
                        onChange={(e) => updateTextProperty('fontSize', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Cor</label>
                      <input
                        type="color"
                        value={activeObject.fill || '#000000'}
                        onChange={(e) => updateTextProperty('fill', e.target.value)}
                        className="w-full h-10 bg-gray-700 rounded cursor-pointer"
                      />
                    </div>

                    {/* Character Spacing */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">
                        Espaçamento: {activeObject.charSpacing || 0}px
                      </label>
                      <input
                        type="range"
                        min="-10"
                        max="50"
                        value={activeObject.charSpacing || 0}
                        onChange={(e) => updateTextProperty('charSpacing', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Text Alignment */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Alinhamento</label>
                      <div className="flex gap-1">
                        {['left', 'center', 'right', 'justify'].map(align => (
                          <button
                            key={align}
                            onClick={() => updateTextProperty('textAlign', align)}
                            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                              activeObject.textAlign === align ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            {align === 'left' ? '←' : align === 'center' ? '↔' : align === 'right' ? '→' : '≡'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Style */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Estilo</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTextProperty('fontWeight', activeObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            activeObject.fontWeight === 'bold' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <strong>B</strong>
                        </button>
                        <button
                          onClick={() => updateTextProperty('fontStyle', activeObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            activeObject.fontStyle === 'italic' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <em>I</em>
                        </button>
                        <button
                          onClick={() => updateTextProperty('underline', !activeObject.underline)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            activeObject.underline ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <u>U</u>
                        </button>
                      </div>
                    </div>

                    {/* Shadow */}
                    <div>
                      <label className="text-xs text-gray-300 block mb-2">Sombra</label>
                      <input
                        type="text"
                        value={activeObject.shadow || ''}
                        onChange={(e) => updateTextProperty('shadow', e.target.value)}
                        placeholder="2px 2px 5px #000"
                        className="w-full px-3 py-2 bg-gray-700 text-white text-xs rounded"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Effects Tab */}
            {activeTab === 'effects' && (
              <ZentrawFXPanel 
                object={activeObject} 
                canvasRef={fabricCanvas} 
                fontList={fontList}
                onUpdate={() => setObjects([...fabricCanvas.current.getObjects()])}
              />
            )}

            {/* Layers Tab */}
            {activeTab === 'layers' && (
              <div className="space-y-4 text-white">
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
                      const name = obj.type === 'textbox' ? `Texto: ${obj.text?.substring(0, 15)}...` :
                                  obj.type === 'image' ? 'Imagem' : 
                                  obj.type === 'rect' ? 'Overlay' : obj.type;
                      
                      return (
                        <div
                          key={`${obj.type}-${i}`}
                          className={`p-3 rounded cursor-pointer transition-colors ${
                            isActive ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                          }`}
                          onClick={() => selectObject(obj)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm flex-1">{name}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleObjectVisibility(obj);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title={obj.visible ? 'Ocultar' : 'Mostrar'}
                              >
                                {obj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleObjectLock(obj);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title={obj.selectable ? 'Bloquear' : 'Desbloquear'}
                              >
                                {obj.selectable ? <Unlock size={12} /> : <Lock size={12} />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveObjectUp(obj);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Mover para frente"
                              >
                                <ChevronUp size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveObjectDown(obj);
                                }}
                                className="p-1 hover:bg-gray-600 rounded"
                                title="Mover para trás"
                              >
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* No object selected */}
            {!activeObject && activeTab === 'properties' && (
              <div className="text-center py-8">
                <Palette size={48} className="mx-auto opacity-30 text-gray-400 mb-4" />
                <p className="text-sm text-gray-400">Selecione um objeto para ver suas propriedades</p>
              </div>
            )}

            {/* Info Panel */}
            <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-400 space-y-1">
              <div>Canvas: {canvasSize.width}×{canvasSize.height}px</div>
              <div>Objetos: {objects.length}</div>
              <div>Zoom: {Math.round(zoom * 100)}%</div>
              <div>Versão: Studio Pro 1.2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}