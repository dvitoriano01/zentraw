/**
 * Zentraw Photo Editor - Version 1.3.0.final
 * Drag and Drop HTML5 nativo implementado - Elimina erro "Unable to find draggable with id"
 * Solução estável baseada no padrão do Replit com todas as funcionalidades preservadas
 */

import FontFaceObserver from 'fontfaceobserver';
import { freepikFonts } from '@/constants/freepikFonts';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
// Import fabric types
import {
  Canvas,
  Object as FabricObject,
  Point,
  Image as FabricImage,
  IText,
  TPointerEvent,
} from 'fabric';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Square,
  Circle,
  Triangle,
  Type,
  Image as ImageIcon,
  MousePointer,
  Move,
  RotateCcw,
  Download,
  Upload,
  Layers,
  Palette,
  Filter,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
} from 'lucide-react';

import { ParameterInput } from '@/components/editor/ParameterInput';
import { ObjectPropertiesPanel } from '@/components/editor/ObjectPropertiesPanel';
import { useCanvasZoomPan } from '@/hooks/useCanvasZoomPan';
import 'fabric';
declare const fabric: {
  Canvas: any;
  IText: any;
  Image: any;
  Group: any;
  Rect: any;
  Circle: any;
  Triangle: any;
  Object: any;
};

import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { SVGLayoutModal } from '@/components/editor/SVGLayoutModal';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';
import { FormatsModal } from '@/components/editor/FormatsModal';
import { FiltersModal } from '@/components/editor/FiltersModal';
import { TextEffectsModal } from '@/components/editor/TextEffectsModal';
// Using any for fabric event types since the types are not exported correctly
type FabricMouseEvent = {
  e: MouseEvent & {
    deltaY?: number;
    offsetX: number;
    offsetY: number;
  };
  target?: FabricObject;
};

// Função utilitária para garantir que a fonte está carregada
async function ensureFontLoaded(font: { label: string; value: string }) {
  if (!font || !font.value) return;
  try {
    const fontName = font.value.split(' ')[0]; // Pega apenas o nome da fonte
    if (document.fonts.check(`1em ${fontName}`)) return;
    const observer = new FontFaceObserver(fontName);
    await observer.load(null, 2000); // Reduzido timeout para 2s
  } catch (error) {
    console.warn(`Erro ao carregar fonte ${font.label}, continuando...`);
  }
}

interface FabricCanvas extends Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
}

interface FabricEvent {
  e: {
    deltaY: number;
    offsetX: number;
    offsetY: number;
    altKey: boolean;
    clientX: number;
    clientY: number;
    preventDefault: () => void;
    stopPropagation: () => void;
  };
  target?: FabricObject;
}

interface FabricEventWithTarget extends FabricEvent {
  target?: FabricObject;
}

type ExtendedFabricEvent = {
  e: TPointerEvent & {
    deltaY?: number;
    offsetX: number;
    offsetY: number;
  };
  target?: FabricObject;
};

interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'background';
  fabricType: string; // Tipo original do Fabric.js para ícones
  visible: boolean;
  locked: boolean;
}

const tools = [
  { id: 'select', label: 'Select', icon: MousePointer },
  { id: 'move', label: 'Move', icon: Move },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
];

const PhotoEditorFixed: React.FC = () => {
  // Refs with proper typing
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial states
  const [selectedFormat, setSelectedFormat] = useState('instagram-post');
  const [canvasBackground, setCanvasBackground] = useState('transparent');
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [layerBlendMode, setLayerBlendMode] = useState('normal');
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [svgLayoutModalOpen, setSvgLayoutModalOpen] = useState(false);
  const [formatsModalOpen, setFormatsModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [textEffectsModalOpen, setTextEffectsModalOpen] = useState(false);

  // Zoom state and handlers
  const [currentZoom, setCurrentZoom] = useState(1);
  const zoomPanControls = useCanvasZoomPan({
    canvasRef,
    containerRef,
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1,
  });

  // Extract zoom controls
  const { zoom, panX, panY, zoomIn, zoomOut, fitToScreen } = zoomPanControls;

  // Funções principais com useCallback - declaradas primeiro
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const json = fabricCanvasRef.current.toJSON();
    const newState = JSON.stringify(json);

    setCanvasHistory((prev) => {
      const newHistory = [...prev, newState];
      if (newHistory.length > 50) {
        newHistory.shift(); // Remove o primeiro se exceder 50
        return newHistory;
      }
      return newHistory;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, []); // Sem dependências para evitar loop

  // Funções utilitárias dentro do componente
  const exportCanvas = useCallback((type: string) => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: type as any,
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement('a');
    link.download = `zentraw-export.${type}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Atualizar as funções que dependem de saveState
  const updateTextProperties = useCallback(
    (properties: any) => {
      if (!selectedObject || !fabricCanvasRef.current) return;
      Object.entries(properties).forEach(([key, value]) => {
        selectedObject.set(key, value);
      });
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  const applyTextEffect = useCallback(
    (effect: string) => {
      if (!selectedObject || !fabricCanvasRef.current) return;
      // Implementar efeitos de texto aqui
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Função para gerar ID único simples
  const generateUniqueId = (prefix: string = 'layer') => {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };

  const updateLayers = useCallback(() => {
    if (!fabricCanvasRef.current) {
      setLayers([]);
      return;
    }
    
    const objects = fabricCanvasRef.current.getObjects();
    const newLayers = objects.map((obj, index) => {
      const layerId = (obj as any).layerId || `layer-${index}`;
      let name = 'Unknown';
      let type: 'text' | 'image' | 'shape' | 'background' = 'shape';
      const fabricType = obj.type || 'unknown';
      
      switch (obj.type) {
        case 'i-text':
          name = `Text: ${(obj as IText).text?.substring(0, 20) || 'Text'}`;
          type = 'text';
          break;
        case 'rect':
          name = 'Rectangle';
          type = 'shape';
          break;
        case 'circle':
          name = 'Circle';
          type = 'shape';
          break;
        case 'triangle':
          name = 'Triangle';
          type = 'shape';
          break;
        case 'image':
          name = 'Image';
          type = 'image';
          break;
        default:
          name = obj.type || 'Object';
          type = 'shape';
      }

      return {
        id: layerId,
        name,
        type,
        fabricType,
        visible: obj.visible !== false,
        locked: !obj.selectable
      };
    }).reverse(); // Reverse para mostrar layers do topo para baixo

    setLayers(newLayers);
  }, []);

  // Adiciona um objeto ao canvas e atualiza a lista de layers
  const addLayerToCanvas = useCallback((obj: FabricObject, name: string, type: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    // Usar ID simples como no Replit
    const layerId = `layer-${Date.now()}`;
    (obj as any).layerId = layerId;

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    updateLayers();
    saveState();
  }, []);

  // Função de deletar layer com validação
  const deleteLayer = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);

    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedObject(null);
      updateLayers();
      saveState();
    }
  }, []);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);

    if (obj) {
      obj.set('visible', !obj.visible);
      canvas.renderAll();
      updateLayers();
    }
  }, []);

  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);

    if (obj) {
      obj.set('selectable', !obj.selectable);
      obj.set('evented', obj.selectable);
      canvas.renderAll();
      updateLayers();
    }
  }, []);

  // Reorder layers usando drag and drop HTML5 nativo
  const reorderLayers = (fromIndex: number, toIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const reversedFromIndex = objects.length - 1 - fromIndex;
    const reversedToIndex = objects.length - 1 - toIndex;
    
    const objectToMove = objects[reversedFromIndex];
    if (objectToMove) {
      fabricCanvasRef.current.remove(objectToMove);
      (fabricCanvasRef.current as any).insertAt(objectToMove, reversedToIndex, false);
      fabricCanvasRef.current.renderAll();
      updateLayers();
      saveState();
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (!fabricCanvasRef.current) return;
    zoomIn();
  };

  const handleZoomOut = () => {
    if (!fabricCanvasRef.current) return;
    zoomOut();
  };

  const handleFitToScreen = () => {
    if (!fabricCanvasRef.current) return;
    fitToScreen();
  };

  // Função para garantir que as fontes do Freepik estão carregadas
  const ensureFreepikFontsLoaded = async () => {
    for (const font of freepikFonts) {
      await ensureFontLoaded(font);
    }
  };

  // Carregar fontes do Freepik ao montar o componente
  useEffect(() => {
    ensureFreepikFontsLoaded();
  }, []);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Garante que o fabric está disponível
    if (typeof fabric === 'undefined') {
      console.error('Fabric.js não está carregado!');
      return;
    }

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#2b2b2b',
        preserveObjectStacking: true,
        selection: true,
        controlsAboveOverlay: true,
        centeredScaling: true,
        snapAngle: 15,
        snapThreshold: 15,
        selectionColor: 'rgba(100, 100, 255, 0.3)',
        selectionBorderColor: '#4a90e2',
        selectionLineWidth: 1,
        enableRetinaScaling: true,
      });

      // Configurações adicionais
      canvas.setZoom(1);
      canvas.renderAll();

      fabricCanvasRef.current = canvas;

      // Setup inicial do canvas
      const initialState = canvas.toJSON();
      setCanvasHistory([JSON.stringify(initialState)]);
      setHistoryIndex(0);

      // Configurar eventos do canvas de forma otimizada
      canvas.on('object:modified', () => {
        setTimeout(() => {
          updateLayers();
          saveState();
        }, 0);
      });

      canvas.on('selection:created', (e: any) => {
        setSelectedObject(e.selected?.[0] || null);
        // Não precisa chamar updateLayers aqui
      });

      canvas.on('selection:updated', (e: any) => {
        setSelectedObject(e.selected?.[0] || null);
        // Não precisa chamar updateLayers aqui
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
        // Não precisa chamar updateLayers aqui
      });

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error('Erro ao inicializar o canvas:', error);
    }
  }, []); // Remover dependências que causam loop

  // Update canvas background
  useEffect(() => {
    if (fabricCanvasRef.current) {
      if (canvasBackground === 'transparent') {
        fabricCanvasRef.current.backgroundColor = '';
      } else {
        fabricCanvasRef.current.backgroundColor = canvasBackground;
      }
      fabricCanvasRef.current.renderAll();
    }
  }, [canvasBackground]);

  // Removemos o useEffect de sincronização pois não é mais necessário com drag and drop nativo

  const selectLayer = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.requestRenderAll();
      setSelectedObject(obj);
    }
  };

  // Handler para mudança de ferramenta
  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    if (fabricCanvasRef.current) {
      // Desativa a seleção se não estiver na ferramenta select
      fabricCanvasRef.current.selection = toolId === 'select';
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();

      // Se for uma ferramenta de forma, criar o objeto
      if (['rectangle', 'circle', 'triangle', 'text'].includes(toolId)) {
        createShape(toolId);
      }
      // Se for a ferramenta de imagem, abrir o seletor de arquivo
      else if (toolId === 'image' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Funções para criar objetos
  const createShape = useCallback((type: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    let shape;
    const commonProps = {
      left: centerX - 50,
      top: centerY - 50,
      fill: '#4a90e2', // Azul mais visível
      stroke: '#2171c7', // Borda mais escura
      strokeWidth: 2,
      cornerColor: '#2171c7',
      cornerSize: 10,
      transparentCorners: false,
    };

    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          ...commonProps,
          radius: 50,
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case 'text':
        shape = new fabric.IText('Digite seu texto', {
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
          fontFamily: 'Arial',
          fontSize: 32,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 0.3,
          textAlign: 'center',
        });
        break;
    }

    if (shape) {
      addLayerToCanvas(shape, type.charAt(0).toUpperCase() + type.slice(1), type);
      setSelectedTool('select');
    }
  }, []);

  // History management functions
  const undo = useCallback(() => {
    if (historyIndex > 0 && fabricCanvasRef.current && canvasHistory.length > 0) {
      const newIndex = historyIndex - 1;
      const state = canvasHistory[newIndex];

      if (state) {
        fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
          fabricCanvasRef.current!.renderAll();
          setTimeout(() => updateLayers(), 0);
        });
        setHistoryIndex(newIndex);
        setSelectedObject(null);
      }
    }
  }, [historyIndex, canvasHistory]);

  const redo = useCallback(() => {
    if (historyIndex < canvasHistory.length - 1 && fabricCanvasRef.current) {
      const newIndex = historyIndex + 1;
      const state = canvasHistory[newIndex];

      if (state) {
        fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
          fabricCanvasRef.current!.renderAll();
          setTimeout(() => updateLayers(), 0);
        });
        setHistoryIndex(newIndex);
        setSelectedObject(null);
      }
    }
  }, [historyIndex, canvasHistory]);

  // Format selection handler
  const handleFormatChange = useCallback(
    (format: string) => {
      setSelectedFormat(format);

      const formatDimensions: {
        [key: string]: { width: number; height: number };
      } = {
        'instagram-post': { width: 1080, height: 1080 },
        'instagram-story': { width: 1080, height: 1920 },
        'facebook-post': { width: 1200, height: 630 },
        'twitter-post': { width: 1024, height: 512 },
        'linkedin-post': { width: 1200, height: 627 },
        'youtube-thumbnail': { width: 1280, height: 720 },
        'a4-print': { width: 2480, height: 3508 },
        'business-card': { width: 1050, height: 600 },
        banner: { width: 1500, height: 500 },
        custom: { width: 800, height: 600 },
      };

      const dimensions = formatDimensions[format] || {
        width: 800,
        height: 600,
      };

      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.setDimensions(dimensions);
        fabricCanvasRef.current.renderAll();
        saveState();
      }
    },
    [saveState],
  );

  // Blend mode handler
  const handleBlendModeChange = useCallback(
    (blendMode: string) => {
      if (!selectedObject || !fabricCanvasRef.current) return;

      setLayerBlendMode(blendMode);
      (selectedObject as any).globalCompositeOperation = blendMode;
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Opacity handler
  const handleOpacityChange = useCallback(
    (opacity: number) => {
      if (!selectedObject || !fabricCanvasRef.current) return;

      setLayerOpacity(opacity);
      selectedObject.set('opacity', opacity / 100);
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
      // Atalho para deletar objeto selecionado
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (fabricCanvasRef.current && selectedObject) {
          fabricCanvasRef.current.remove(selectedObject);
          fabricCanvasRef.current.discardActiveObject();
          fabricCanvasRef.current.renderAll();
          setSelectedObject(null);
          setTimeout(() => {
            updateLayers();
            saveState();
          }, 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedObject]);

  // Painel de layers simplificado seguindo o padrão do Replit

  return (
    <div className="h-screen flex flex-col bg-[#2b2b2b] text-white">
      {/* Top Menu Bar */}
      <div className="h-12 bg-[#1e1e1e] border-b border-[#4a4a4a] flex items-center px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-sm font-semibold">Zentraw Photo Editor</h1>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setTemplatesModalOpen(true)}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Templates
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setSvgLayoutModalOpen(true)}
          >
            SVG Layouts
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setFormatsModalOpen(true)}
          >
            Formats
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setFiltersModalOpen(true)}
          >
            Filters
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setTextEffectsModalOpen(true)}
          >
            Text FX
          </Button>

          {/* History Controls */}
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs disabled:opacity-50"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs disabled:opacity-50"
            onClick={redo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <RotateCcw className="w-3 h-3 rotate-180" />
          </Button>

          <div className="flex-1" />

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => exportCanvas('png')}
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#383838] border-r border-[#4a4a4a] p-2 flex flex-col items-center flex-shrink-0">
          <div className="space-y-2">
            {tools.map((toolItem) => (
              <Button
                key={toolItem.id}
                variant="ghost"
                size="sm"
                className={`p-2 w-12 h-12 flex items-center justify-center hover:bg-[#4a4a4a] ${
                  selectedTool === toolItem.id ? 'bg-[#0078d4] hover:bg-[#106ebe]' : ''
                }`}
                onClick={() => handleToolChange(toolItem.id)}
                title={toolItem.label}
              >
                <toolItem.icon className="w-5 h-5" />
              </Button>
            ))}
            {/* Hidden file input for image upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (!fabricCanvasRef.current || !e.target.files?.[0]) return;
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function (f) {
                  try {
                    const data = f.target?.result as string;
                    if (!fabric.Image) {
                      alert('fabric.Image não está disponível!');
                      return;
                    }
                    const htmlImg = new window.Image();
                    htmlImg.onload = function () {
                      const imgInstance = new fabric.Image(htmlImg, {
                        left: 350,
                        top: 250,
                        scaleX: 0.5,
                        scaleY: 0.5,
                      });
                      addLayerToCanvas(imgInstance, 'Image', 'image');
                    };
                    htmlImg.onerror = function () {
                      alert('Erro ao carregar a imagem no navegador!');
                    };
                    htmlImg.src = data;
                  } catch (err) {
                    alert('Erro ao ler o arquivo de imagem!');
                  }
                };
                reader.onerror = function () {
                  alert('Erro ao ler o arquivo de imagem!');
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Canvas Controls */}
          <div className="h-10 bg-[#2a2a2a] border-b border-[#4a4a4a] flex items-center px-4 gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Format:</label>
              <select
                value={selectedFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="bg-[#1e1e1e] border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="instagram-post">Instagram Post (1080x1080)</option>
                <option value="instagram-story">Instagram Story (1080x1920)</option>
                <option value="facebook-post">Facebook Post (1200x630)</option>
                <option value="twitter-post">Twitter Post (1024x512)</option>
                <option value="linkedin-post">LinkedIn Post (1200x627)</option>
                <option value="youtube-thumbnail">YouTube Thumbnail (1280x720)</option>
                <option value="a4-print">A4 Print (2480x3508)</option>
                <option value="business-card">Business Card (1050x600)</option>
                <option value="banner">Banner (1500x500)</option>
                <option value="custom">Custom (800x600)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>

              <span className="text-xs text-gray-400 min-w-[60px] text-center">
                {Math.round(currentZoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={fitToScreen}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <Maximize className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 bg-[#2a2a2a] relative"
            style={{
              backgroundImage: `
                  linear-gradient(45deg, #333 25%, transparent 25%),
                  linear-gradient(-45deg, #333 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #333 75%),
                  linear-gradient(-45deg, transparent 75%, #333 75%)
                `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-center min-h-full p-8">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-600 shadow-2xl bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-80 bg-[#2a2a2a] border-l border-[#4a4a4a] flex flex-col min-h-0">
          <Tabs
            value={activePropertiesTab}
            onValueChange={(value: any) => setActivePropertiesTab(value)}
            className="flex flex-col h-full min-h-0"
          >
            <div className="p-2 border-b border-[#4a4a4a] flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
                <TabsTrigger value="properties" className="text-xs">
                  Properties
                </TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs">
                  Adjustments
                </TabsTrigger>
                <TabsTrigger value="libraries" className="text-xs">
                  Libraries
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="properties" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                {/* Canvas Background Controls */}
                <div className="p-4 border-b border-[#4a4a4a] flex-shrink-0">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Canvas Background
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                      onClick={() => setCanvasBackground('transparent')}
                      className={`h-8 border rounded relative overflow-hidden ${canvasBackground === 'transparent' ? 'ring-2 ring-blue-500' : 'border-gray-600'}`}
                      title="Transparent"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                              linear-gradient(45deg, #ffffff 25%, transparent 25%),
                              linear-gradient(-45deg, #ffffff 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #ffffff 75%),
                              linear-gradient(-45deg, transparent 75%, #ffffff 75%)
                            `,
                          backgroundSize: '8px 8px',
                          backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                          backgroundColor: '#f0f0f0',
                        }}
                      />
                    </button>
                    <button
                      onClick={() => setCanvasBackground('#ffffff')}
                      className={`h-8 bg-white border rounded ${canvasBackground === '#ffffff' ? 'ring-2 ring-blue-500' : 'border-gray-600'}`}
                      title="White"
                    />
                    <button
                      onClick={() => setCanvasBackground('#000000')}
                      className={`h-8 bg-black border rounded ${canvasBackground === '#000000' ? 'ring-2 ring-blue-500' : 'border-gray-600'}`}
                      title="Black"
                    />
                    <button
                      onClick={() => setCanvasBackground('#808080')}
                      className={`h-8 bg-gray-500 border rounded ${canvasBackground === '#808080' ? 'ring-2 ring-blue-500' : 'border-gray-600'}`}
                      title="Gray"
                    />
                  </div>
                  <input
                    type="color"
                    value={canvasBackground === 'transparent' ? '#ffffff' : canvasBackground}
                    onChange={(e) => setCanvasBackground(e.target.value)}
                    className="w-full h-8 border border-gray-600 rounded"
                    title="Custom color"
                  />
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  {/* Text Properties Panel */}
                  {selectedObject && selectedObject.type === 'i-text' ? (
                    <div>
                      <div className="p-4">
                        <TextPropertiesPanel
                          selectedObject={selectedObject}
                          onUpdateText={updateTextProperties}
                        />
                      </div>

                      {/* Text Effects Panel */}
                      <div className="border-t border-[#4a4a4a] p-4">
                        <TextFXPanel
                          selectedObject={selectedObject}
                          onApplyEffect={applyTextEffect}
                        />
                      </div>
                    </div>
                  ) : selectedObject ? (
                    <div className="p-4">
                      {/* Layer Properties for Selected Object */}
                      <div className="space-y-4 mb-6">
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Layer Properties
                        </label>

                        {/* Opacity */}
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                          <div className="space-y-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={layerOpacity}
                              onChange={(e) => handleOpacityChange(Number(e.target.value))}
                              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">{layerOpacity}%</span>
                          </div>
                        </div>

                        {/* Blend Mode */}
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Blend Mode</label>
                          <select
                            value={layerBlendMode}
                            onChange={(e) => handleBlendModeChange(e.target.value)}
                            className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded text-xs text-gray-300"
                          >
                            <option value="normal">Normal</option>
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
                        </div>

                        {/* Shape Properties for non-text objects */}
                        {selectedObject.type !== 'i-text' && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Fill Color</label>
                              <input
                                type="color"
                                value={
                                  typeof selectedObject.fill === 'string'
                                    ? selectedObject.fill
                                    : '#000000'
                                }
                                onChange={(e) => {
                                  selectedObject.set('fill', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-8 border border-gray-600 rounded"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">
                                Stroke Color
                              </label>
                              <input
                                type="color"
                                value={
                                  typeof selectedObject.stroke === 'string'
                                    ? selectedObject.stroke
                                    : '#000000'
                                }
                                onChange={(e) => {
                                  selectedObject.set('stroke', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-8 border border-gray-600 rounded"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">
                                Stroke Width
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                value={selectedObject.strokeWidth || 0}
                                onChange={(e) => {
                                  selectedObject.set('strokeWidth', Number(e.target.value));
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-500">
                                {selectedObject.strokeWidth || 0}px
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-400 text-center">
                      Select an object to edit its properties
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adjustments" className="flex-1 m-0">
              <div className="p-4 space-y-4">
                <ParameterInput
                  label="Hue"
                  value={hue}
                  min={-180}
                  max={180}
                  step={1}
                  unit="°"
                  defaultValue={0}
                  onChange={setHue}
                  onReset={() => setHue(0)}
                />

                <ParameterInput
                  label="Saturation"
                  value={saturation}
                  min={-100}
                  max={100}
                  step={1}
                  unit="%"
                  defaultValue={0}
                  onChange={setSaturation}
                  onReset={() => setSaturation(0)}
                />

                <ParameterInput
                  label="Brightness"
                  value={brightness}
                  min={-100}
                  max={100}
                  step={1}
                  unit="%"
                  defaultValue={0}
                  onChange={setBrightness}
                  onReset={() => setBrightness(0)}
                />
              </div>
            </TabsContent>

            <TabsContent value="libraries" className="flex-1 m-0">
              <div className="flex flex-col h-full">
                {/* Layers Panel - HTML5 Native Drag and Drop */}
                <div className="p-4 border-b border-[#4a4a4a]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300">Layers</h3>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  {layers.length === 0 ? (
                    <div className="text-gray-500 text-xs text-center py-8">No layers yet</div>
                  ) : (
                    <div className="flex-1 overflow-y-auto max-h-64 space-y-1">
                      {layers.map((layer, index) => (
                        <div
                          key={layer.id}
                          draggable
                          className={`flex items-center justify-between p-2 rounded border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                            selectedLayer?.id === layer.id 
                            ? 'bg-[#0078d4] border-[#106ebe] text-white' 
                            : 'bg-[#383838] border-[#4a4a4a] text-gray-300 hover:bg-[#4a4a4a] hover:border-[#5a5a5a]'
                          }`}
                          onClick={() => selectLayer(layer.id)}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.dataTransfer.effectAllowed = 'move';
                            (e.target as HTMLElement).style.opacity = '0.5';
                          }}
                          onDragEnd={(e) => {
                            (e.target as HTMLElement).style.opacity = '1';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const toIndex = index;
                            if (fromIndex !== toIndex) {
                              reorderLayers(fromIndex, toIndex);
                            }
                          }}
                        >
                          {/* Drag Handle */}
                          <div className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-200 transition-colors">
                            <GripVertical className="h-3 w-3" />
                          </div>

                          <div className="flex items-center gap-2 flex-1 min-w-0 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                              }}
                            >
                              {layer.visible ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3 opacity-50" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerLock(layer.id);
                              }}
                            >
                              {layer.locked ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Unlock className="h-3 w-3 opacity-70" />
                              )}
                            </Button>
                            
                            {/* Layer Type Icon */}
                            <div className="w-4 h-4 flex items-center justify-center">
                              {layer.fabricType === 'i-text' && <Type className="h-3 w-3 opacity-70" />}
                              {layer.fabricType === 'rect' && <Square className="h-3 w-3 opacity-70" />}
                              {layer.fabricType === 'circle' && <Circle className="h-3 w-3 opacity-70" />}
                              {layer.fabricType === 'triangle' && <Triangle className="h-3 w-3 opacity-70" />}
                              {layer.fabricType === 'image' && <ImageIcon className="h-3 w-3 opacity-70" />}
                            </div>

                            <div className="truncate text-xs font-medium flex-1 min-w-0">
                              {layer.name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-500/20 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLayer(layer.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* ... outros conteúdos do painel, se houver ... */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditorFixed;
