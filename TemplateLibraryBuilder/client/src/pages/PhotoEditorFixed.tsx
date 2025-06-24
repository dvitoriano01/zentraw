import FontFaceObserver from 'fontfaceobserver';
import { freepikFonts } from '@/constants/freepikFonts';
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
} from 'lucide-react';

import { ParameterInput } from '@/components/editor/ParameterInput';
import { ObjectPropertiesPanel } from '@/components/editor/ObjectPropertiesPanel';
import { useCanvasZoomPan } from '@/hooks/useCanvasZoomPan';
import {
  Canvas,
  FabricObject,
  IText,
  Rect,
  Circle as FabricCircle,
  Triangle as FabricTriangle,
  Image as FabricImage, // Importação correta
} from 'fabric';
import * as fabric from 'fabric'; // Importação correta para Vite/React

import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { SVGLayoutModal } from '@/components/editor/SVGLayoutModal';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';
import { FormatsModal } from '@/components/editor/FormatsModal';
import { FiltersModal } from '@/components/editor/FiltersModal';
import { TextEffectsModal } from '@/components/editor/TextEffectsModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Função utilitária para garantir que a fonte está carregada
async function ensureFontLoaded(fontFamily: string) {
  if (!fontFamily) return;
  if (document.fonts.check(`1em ${fontFamily}`)) return;
  const observer = new FontFaceObserver(fontFamily);
  await observer.load(null, 5000);
}

interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

const tools = [
  { id: 'select', icon: MousePointer, label: 'Select' },
  { id: 'move', icon: Move, label: 'Move' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'triangle', icon: Triangle, label: 'Triangle' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'image', icon: ImageIcon, label: 'Image' },
];

export default function PhotoEditor() {
  // State management
  const [selectedTool, setSelectedTool] = useState('select');
  const [activePropertiesTab, setActivePropertiesTab] = useState<
    'character' | 'paragraph' | 'textfx' | 'properties'
  >('properties');
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [svgLayoutModalOpen, setSvgLayoutModalOpen] = useState(false);
  const [formatsModalOpen, setFormatsModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [textEffectsModalOpen, setTextEffectsModalOpen] = useState(false);

  // Text properties
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.2);

  // Adjustments
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [canvasBackground, setCanvasBackground] = useState('transparent');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [layerBlendMode, setLayerBlendMode] = useState('normal');
  const [selectedFormat, setSelectedFormat] = useState('instagram-post');
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);

  // Custom zoom implementation
  const [currentZoom, setCurrentZoom] = useState(1);

  const zoomIn = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const currentZoom = canvas.getZoom();
    const newZoom = Math.min(currentZoom * 1.2, 5);
    canvas.setZoom(newZoom);
    setCurrentZoom(newZoom);
  }, []);

  const zoomOut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const currentZoom = canvas.getZoom();
    const newZoom = Math.max(currentZoom / 1.2, 0.1);
    canvas.setZoom(newZoom);
    setCurrentZoom(newZoom);
  }, []);

  const fitToScreen = useCallback(() => {
    if (!fabricCanvasRef.current || !containerRef.current) return;
    const canvas = fabricCanvasRef.current;
    const container = containerRef.current;

    const containerWidth = container.clientWidth - 64;
    const containerHeight = container.clientHeight - 64;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    canvas.setZoom(scale);
    setCurrentZoom(scale);
  }, []);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        skipTargetFind: false,
        stopContextMenu: true,
      });

      // Configure canvas container
      if (containerRef.current) {
        const container = containerRef.current;
        container.style.overflow = 'hidden';
      }

      fabricCanvasRef.current = canvas;

      // Save initial state for history
      const initialState = canvas.toJSON();
      setCanvasHistory([JSON.stringify(initialState)]);
      setHistoryIndex(0);

      // Object selection events
      canvas.on('selection:created', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        if (obj) {
          setLayerOpacity((obj.opacity || 1) * 100);
          setLayerBlendMode((obj as any).globalCompositeOperation || 'normal');
        }
        updateLayersList();
      });

      canvas.on('selection:updated', (e) => {
        const obj = e.selected?.[0];
        setSelectedObject(obj || null);
        if (obj) {
          setLayerOpacity((obj.opacity || 1) * 100);
          setLayerBlendMode((obj as any).globalCompositeOperation || 'normal');
        }
        updateLayersList();
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
        updateLayersList();
      });

      canvas.on('object:added', () => {
        updateLayersList();
      });

      canvas.on('object:removed', () => {
        updateLayersList();
      });

      canvas.on('object:modified', () => {
        updateLayersList();
      });

      // Initial layer update
      updateLayersList();

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, []);

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

  // Force re-render when canvas changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      updateLayersList();
    }
  }, [fabricCanvasRef.current]);

  // History management functions
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(currentState);

    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex((prev) => prev + 1);
    }

    setCanvasHistory(newHistory);
  }, [canvasHistory, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && fabricCanvasRef.current) {
      const newIndex = historyIndex - 1;
      const state = canvasHistory[newIndex];

      fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
        fabricCanvasRef.current!.renderAll();
        updateLayersList();
      });

      setHistoryIndex(newIndex);
      setSelectedObject(null);
    }
  }, [historyIndex, canvasHistory]);

  const redo = useCallback(() => {
    if (historyIndex < canvasHistory.length - 1 && fabricCanvasRef.current) {
      const newIndex = historyIndex + 1;
      const state = canvasHistory[newIndex];

      fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
        fabricCanvasRef.current!.renderAll();
        updateLayersList();
      });

      setHistoryIndex(newIndex);
      setSelectedObject(null);
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
    [selectedObject, saveState],
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
    [selectedObject, saveState],
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
          updateLayersList();
          saveState();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedObject, saveState]);

  const updateLayersList = useCallback(() => {
    if (!fabricCanvasRef.current) {
      setLayers([]);
      return;
    }

    const objects = fabricCanvasRef.current.getObjects();
    const newLayers = objects
      .map((obj, index) => {
        const layerId = (obj as any).layerId || `layer-${index}`;
        let name = 'Unknown';

        if (obj.type === 'i-text') {
          name = `Text: ${(obj as IText).text?.substring(0, 20) || 'Empty'}`;
        } else if (obj.type === 'rect') {
          name = 'Rectangle';
        } else if (obj.type === 'circle') {
          name = 'Circle';
        } else if (obj.type === 'triangle') {
          name = 'Triangle';
        } else if (obj.type === 'image') {
          name = 'Image';
        }

        return {
          id: layerId,
          name,
          type: obj.type || 'unknown',
          visible: obj.visible !== false,
          locked: !obj.selectable,
        };
      })
      .reverse();

    setLayers(newLayers);
  }, []);

  // Tool functions
  const setTool = (toolId: string) => {
    setSelectedTool(toolId);

    if (toolId === 'rectangle') {
      addRectangle();
    } else if (toolId === 'circle') {
      addCircle();
    } else if (toolId === 'triangle') {
      addTriangle();
    } else if (toolId === 'text') {
      addText();
    } else if (toolId === 'image') {
      fileInputRef.current?.click();
    }
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new Rect({
      left: 350,
      top: 250,
      width: 100,
      height: 80,
      fill: '#ff0000',
      stroke: '#000000',
      strokeWidth: 2,
    });

    (rect as any).layerId = `rect-${Date.now()}`;
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;

    const circle = new FabricCircle({
      left: 350,
      top: 250,
      radius: 50,
      fill: '#00ff00',
      stroke: '#000000',
      strokeWidth: 2,
    });

    (circle as any).layerId = `circle-${Date.now()}`;
    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;

    const triangle = new FabricTriangle({
      left: 350,
      top: 250,
      width: 100,
      height: 100,
      fill: '#0000ff',
      stroke: '#000000',
      strokeWidth: 2,
    });

    (triangle as any).layerId = `triangle-${Date.now()}`;
    fabricCanvasRef.current.add(triangle);
    fabricCanvasRef.current.setActiveObject(triangle);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  // Função de texto com carregamento de fonte customizada
  const addText = async () => {
    if (!fabricCanvasRef.current) return;

    const fontToUse = fontFamily || 'Arial';
    await ensureFontLoaded(fontToUse);

    const canvas = fabricCanvasRef.current;
    const canvasCenter = {
      x: canvas.width! / 2,
      y: canvas.height! / 2,
    };

    const text = new IText('Double-click to edit', {
      left: canvasCenter.x,
      top: canvasCenter.y,
      fontSize: 32,
      fontFamily: fontToUse,
      fill: '#000000',
      selectable: true,
      evented: true,
      editable: true,
      originX: 'center',
      originY: 'center',
    });

    (text as any).layerId = `text-${Date.now()}`;
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();

    setSelectedObject(text);
    setActivePropertiesTab('properties');
    saveState();
  };

  // Atualização de propriedades de texto com carregamento de fonte
  const updateTextProperties = async (properties: any) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.type !== 'i-text') return;

    if (properties.fontFamily) {
      await ensureFontLoaded(properties.fontFamily);
    }

    selectedObject.set(properties);
    fabricCanvasRef.current.renderAll();
    saveState();
  };
  const applyTextEffect = (effect: any) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.type !== 'i-text') return;

    selectedObject.set(effect);
    fabricCanvasRef.current.renderAll();
    saveState();
  };

  const exportCanvas = (format: 'png' | 'jpeg' | 'svg' = 'png') => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const dataURL = canvas.toDataURL({
      format: undefined,
      quality: 1.0,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = `canvas-export.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Layer management functions
  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      obj.set('visible', !obj.visible);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
      saveState();
    }
  };

  const toggleLayerLock = (layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      obj.set('selectable', !obj.selectable);
      obj.set('evented', !obj.evented);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
      saveState();
    }
  };

  const deleteLayer = (layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      fabricCanvasRef.current.remove(obj);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
      updateLayersList();
      saveState();
    }
  };

  const reorderLayers = (result: any) => {
    if (!result.destination || !fabricCanvasRef.current) return;

    const { source, destination } = result;
    const fromIndex = source.index;
    const toIndex = destination.index;

    if (fromIndex === toIndex) return;

    const objects = fabricCanvasRef.current.getObjects();
    const reversedFromIndex = objects.length - 1 - fromIndex;
    const reversedToIndex = objects.length - 1 - toIndex;

    const objectToMove = objects[reversedFromIndex];
    if (objectToMove) {
      fabricCanvasRef.current.remove(objectToMove);
      fabricCanvasRef.current.insertAt(reversedToIndex, objectToMove);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
      saveState();
    }
  };

  const selectLayer = (layer: Layer) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layer.id || `layer-${index}` === layer.id,
    );

    if (obj) {
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(obj);
      setSelectedLayer(layer);
      setLayerOpacity(Math.round((obj.opacity || 1) * 100));
    }
  };

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
                onClick={() => setTool(toolItem.id)}
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
                    console.log('Tentando carregar imagem:', data.substring(0, 100));
                    console.log('fabric.Image existe?', typeof fabric.Image);
                    if (!fabric.Image) {
                      alert(
                        'fabric.Image não está disponível! Problema de build/importação do Fabric.js.',
                      );
                      return;
                    }
                    // Criação manual do objeto Fabric.Image a partir do HTMLImageElement
                    const htmlImg = new window.Image();
                    htmlImg.onload = function () {
                      const imgInstance = new fabric.Image(htmlImg, {
                        left: 350,
                        top: 250,
                        scaleX: 0.5,
                        scaleY: 0.5,
                      });
                      (imgInstance as any).layerId = `image-${Date.now()}`;
                      fabricCanvasRef.current?.add(imgInstance);
                      fabricCanvasRef.current?.setActiveObject(imgInstance);
                      fabricCanvasRef.current?.renderAll();
                      updateLayersList();
                      saveState();
                      console.log('Imagem criada manualmente pelo Fabric:', imgInstance);
                    };
                    htmlImg.onerror = function () {
                      alert('Erro ao carregar a imagem no navegador!');
                      console.error('Erro ao carregar a imagem HTML.');
                    };
                    htmlImg.src = data;
                  } catch (err) {
                    alert('Erro ao ler o arquivo de imagem!');
                    console.error('Erro no FileReader:', err);
                  }
                };
                reader.onerror = function (err) {
                  alert('Erro ao ler o arquivo de imagem!');
                  console.error('Erro no FileReader:', err);
                };
                reader.readAsDataURL(file);
                // Reset input value to allow re-uploading the same file
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
          {/* Properties Panel */}
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
                                value={selectedObject.fill || '#000000'}
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
                                value={selectedObject.stroke || '#000000'}
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
                {/* Layers Panel */}
                <div className="p-4 border-b border-[#4a4a4a]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300">Layers</h3>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>

                  <DragDropContext onDragEnd={reorderLayers}>
                    <Droppable droppableId="layers">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-1"
                        >
                          {layers.map((layer, index) => (
                            <Draggable key={layer.id} draggableId={layer.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center p-2 rounded text-xs cursor-pointer hover:bg-gray-700 ${
                                    selectedLayer?.id === layer.id ? 'bg-blue-600' : 'bg-gray-800'
                                  }`}
                                >
                                  <span className="truncate flex-1">{layer.name}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
                {/* ... outros conteúdos do painel, se houver ... */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
