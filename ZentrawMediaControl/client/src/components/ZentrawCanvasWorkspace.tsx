// ZentrawCanvasWorkspace.tsx
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

declare global {
  interface Window {
    fabric: any;
  }
}

export default function ZentrawCanvasWorkspace({ onExport }: { onExport: (imageUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvas = useRef<any>(null);
  const [activeObject, setActiveObject] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  // Carregar fontes locais
  const loadFonts = async () => {
    const fontNames = ['AkuiNa Bold', 'Custody Script', 'Vibes Arcade', 'Neon Display', 'Future Grunge'];
    fontNames.forEach((name) => {
      const font = new FontFace(name, `url(/fonts/${name.replace(' ', '')}.ttf)`);
      font.load().then((loaded) => {
        document.fonts.add(loaded);
        console.log(`Fonte carregada: ${name}`);
      }).catch((err) => console.error('Erro ao carregar fonte:', err));
    });
  };

  useEffect(() => {
    const initCanvas = async () => {
      await loadFonts();
      
      // Aguardar o Fabric.js carregar
      if (!window.fabric) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          createCanvas();
        };
      } else {
        createCanvas();
      }
    };

    const createCanvas = () => {
      const fabric = window.fabric;
      
      const canvas = new fabric.Canvas(canvasRef.current!, {
        backgroundColor: 'transparent',
        preserveObjectStacking: true,
        selection: true,
        width: 1080,
        height: 1080,
      });

      fabricCanvas.current = canvas;

      // Fundo xadrez estilo Photoshop
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

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!fabricCanvas.current) return;
        if (e.key === 'Delete' && activeObject) {
          fabricCanvas.current.remove(activeObject);
          setActiveObject(null);
          fabricCanvas.current.renderAll();
        }
        if (e.ctrlKey && e.key === '+') {
          const newZoom = zoom + 0.1;
          setZoom(newZoom);
          fabricCanvas.current.setZoom(newZoom);
        }
        if (e.ctrlKey && e.key === '-') {
          const newZoom = zoom - 0.1;
          setZoom(newZoom);
          fabricCanvas.current.setZoom(newZoom);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        canvas.dispose();
      };
    };

    initCanvas();
  }, [activeObject, zoom]);

  // Adicionar texto com fonte Freepik
  const addText = () => {
    if (!window.fabric) return;
    const fabric = window.fabric;
    
    const text = new fabric.Textbox('Novo Texto', {
      left: 100,
      top: 100,
      fontSize: 48,
      fontFamily: 'AkuiNa Bold',
      fill: '#ffffff',
    });
    fabricCanvas.current?.add(text);
    fabricCanvas.current?.setActiveObject(text);
    fabricCanvas.current?.renderAll();
  };

  const addOverlay = (src: string) => {
    if (!window.fabric) return;
    const fabric = window.fabric;
    
    fabric.Image.fromURL(src, (img: any) => {
      img.set({ left: 0, top: 0, selectable: true, opacity: 0.6 });
      fabricCanvas.current?.add(img);
      fabricCanvas.current?.setActiveObject(img);
      fabricCanvas.current?.renderAll();
    });
  };

  const uploadImage = () => {
    if (!window.fabric) return;
    const fabric = window.fabric;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
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

  const exportImage = () => {
    const url = fabricCanvas.current?.toDataURL({ format: 'png', multiplier: 2 });
    if (url) onExport(url);
  };

  const applyTextEffect = (effect: string) => {
    if (!activeObject || activeObject.type !== 'textbox' || !window.fabric) return;
    const fabric = window.fabric;
    
    const textObj = activeObject;
    
    switch (effect) {
      case 'glitch':
        textObj.set({
          shadow: new fabric.Shadow({
            color: 'red',
            offsetX: 2,
            offsetY: 0,
            blur: 0
          }),
          fill: '#00ffff'
        });
        break;
      case 'neon':
        textObj.set({
          shadow: new fabric.Shadow({
            color: '#00ffff',
            offsetX: 0,
            offsetY: 0,
            blur: 15
          }),
          fill: '#00ffff'
        });
        break;
      case 'chrome':
        textObj.set({
          fill: '#cccccc',
          shadow: new fabric.Shadow({
            color: '#666',
            offsetX: 1,
            offsetY: 1,
            blur: 2
          })
        });
        break;
    }
    
    fabricCanvas.current?.renderAll();
  };

  return (
    <div className="flex h-screen w-screen bg-[#121212]">
      {/* Header com botão voltar */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#2a2a2a] border-b border-gray-700 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">
              <ArrowLeft size={16} />
              Voltar
            </button>
          </Link>
          <h1 className="text-white font-semibold">Zentraw Canvas Editor (Fabric.js)</h1>
        </div>
      </div>

      {/* Barra lateral esquerda */}
      <div className="w-64 bg-[#1a1a1a] border-r border-gray-700 p-4 pt-16">
        <h3 className="text-white text-sm font-semibold mb-4">Ferramentas</h3>
        <div className="space-y-2">
          <button 
            onClick={addText}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            📝 Texto
          </button>
          <button 
            onClick={uploadImage}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            🖼️ Imagem
          </button>
          <button 
            onClick={() => addOverlay('/overlays/grain.svg')}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            🎨 Grain
          </button>
          <button 
            onClick={() => addOverlay('/overlays/vhs.svg')}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm"
          >
            📼 VHS
          </button>
        </div>
        
        <h3 className="text-white text-sm font-semibold mb-4 mt-6">TextFX</h3>
        <div className="space-y-2">
          <button 
            onClick={() => applyTextEffect('glitch')}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm"
          >
            Glitch
          </button>
          <button 
            onClick={() => applyTextEffect('neon')}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm"
          >
            Neon
          </button>
          <button 
            onClick={() => applyTextEffect('chrome')}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white text-sm"
          >
            Chrome
          </button>
        </div>
      </div>

      {/* Área central do canvas */}
      <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center">
        <canvas ref={canvasRef} className="shadow-lg border border-gray-600" />
      </div>

      {/* Painel lateral direito */}
      <div className="w-64 bg-[#1a1a1a] border-l border-gray-700 text-white p-4 space-y-4">
        <h2 className="text-sm font-bold">Propriedades</h2>
        {activeObject && (
          <div className="space-y-4">
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
            
            {activeObject.type === 'textbox' && (
              <div>
                <label className="text-xs text-gray-300 block mb-2">Tamanho da Fonte</label>
                <input
                  type="number"
                  value={(activeObject as fabric.Textbox).fontSize || 48}
                  onChange={(e) => {
                    (activeObject as fabric.Textbox).set({ fontSize: parseInt(e.target.value) });
                    fabricCanvas.current?.renderAll();
                  }}
                  className="w-full px-2 py-1 bg-gray-700 text-white text-sm rounded"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4">
          <button 
            onClick={exportImage} 
            className="bg-blue-600 hover:bg-blue-700 w-full py-2 text-sm rounded text-white"
          >
            Exportar PNG
          </button>
        </div>
      </div>
    </div>
  );
}