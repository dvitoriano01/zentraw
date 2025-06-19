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
  Undo,
  Redo
} from 'lucide-react';

import { ParameterInput } from '@/components/editor/ParameterInput';
import { ObjectPropertiesPanel } from '@/components/editor/ObjectPropertiesPanel';
import { useCanvasZoomPan } from '@/hooks/useCanvasZoomPan';
import { Canvas, FabricObject, IText, Rect, Circle as FabricCircle, Triangle as FabricTriangle, FabricImage } from 'fabric';

import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { SVGLayoutModal } from '@/components/editor/SVGLayoutModal';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';
import { FormatsModal } from '@/components/editor/FormatsModal';
import { FiltersModal } from '@/components/editor/FiltersModal';
import { TextEffectsModal } from '@/components/editor/TextEffectsModal';

interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

const tools = [
  { id: 'select', name: 'Select', icon: MousePointer },
  { id: 'move', name: 'Move', icon: Move },
  { id: 'rectangle', name: 'Rectangle', icon: Square },
  { id: 'circle', name: 'Circle', icon: Circle },
  { id: 'triangle', name: 'Triangle', icon: Triangle },
  { id: 'text', name: 'Text', icon: Type },
  { id: 'image', name: 'Image', icon: ImageIcon }
];

const layers: Layer[] = [
  { id: 'layer-1', name: 'Background', type: 'background', visible: true, locked: false },
  { id: 'layer-2', name: 'Shape 1', type: 'shape', visible: true, locked: false },
  { id: 'layer-3', name: 'Text Layer', type: 'text', visible: true, locked: false }
];

export default function PhotoEditor() {
  const [selectedTool, setSelectedTool] = useState('select');
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [svgLayoutModalOpen, setSvgLayoutModalOpen] = useState(false);
  const [formatsModalOpen, setFormatsModalOpen] = useState(false);
  const [textEffectsModalOpen, setTextEffectsModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
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
  
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom, fitToScreen } = useCanvasZoomPan({
    canvasRef,
    containerRef,
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1
  });

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: false,
        skipTargetFind: false,
        stopContextMenu: true
      });

      // Disable automatic viewport adjustments completely
      (canvas as any).centerObject = function() { return this; };
      (canvas as any).viewportCenterObject = function() { return this; };
      (canvas as any).centerObjectH = function() { return this; };
      (canvas as any).centerObjectV = function() { return this; };
      
      // Override ensureObjectVisibility to prevent auto-scrolling
      (canvas as any).ensureObjectVisibility = function() { return this; };

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
      setHistoryIndex(prev => prev + 1);
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
  const handleFormatChange = useCallback((format: string) => {
    setSelectedFormat(format);
    
    const formatDimensions: { [key: string]: { width: number; height: number } } = {
      'instagram-post': { width: 1080, height: 1080 },
      'instagram-story': { width: 1080, height: 1920 },
      'facebook-post': { width: 1200, height: 630 },
      'twitter-post': { width: 1024, height: 512 },
      'linkedin-post': { width: 1200, height: 627 },
      'youtube-thumbnail': { width: 1280, height: 720 },
      'a4-print': { width: 2480, height: 3508 },
      'business-card': { width: 1050, height: 600 },
      'banner': { width: 1500, height: 500 },
      'custom': { width: 800, height: 600 }
    };

    const dimensions = formatDimensions[format] || { width: 800, height: 600 };
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setDimensions(dimensions);
      fabricCanvasRef.current.renderAll();
      saveState();
    }
  }, [saveState]);

  // Blend mode handler
  const handleBlendModeChange = useCallback((blendMode: string) => {
    if (!selectedObject || !fabricCanvasRef.current) return;
    
    setLayerBlendMode(blendMode);
    (selectedObject as any).globalCompositeOperation = blendMode;
    fabricCanvasRef.current.renderAll();
    saveState();
  }, [selectedObject, saveState]);

  // Opacity handler
  const handleOpacityChange = useCallback((opacity: number) => {
    if (!selectedObject || !fabricCanvasRef.current) return;
    
    setLayerOpacity(opacity);
    selectedObject.set('opacity', opacity / 100);
    fabricCanvasRef.current.renderAll();
    saveState();
  }, [selectedObject, saveState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y') || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const updateLayersList = useCallback(() => {
    if (!fabricCanvasRef.current) {
      setLayers([]);
      return;
    }
    
    const objects = fabricCanvasRef.current.getObjects();
    const newLayers = objects.map((obj, index) => {
      const layerId = (obj as any).layerId || `layer-${index}`;
      let name = 'Unknown';
      let type: 'text' | 'image' | 'shape' | 'background' = 'shape';
      
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
        visible: obj.visible !== false,
        locked: !obj.selectable
      };
    }).reverse(); // Reverse to show top layer first

    setLayers(newLayers);
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleDragDropFile(file);
    }
  }, []);

  const handleDragDropFile = useCallback((file: File) => {
    if (!fabricCanvasRef.current) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        FabricImage.fromURL(e.target?.result as string, {
          crossOrigin: 'anonymous'
        }).then((img) => {
          if (fabricCanvasRef.current) {
            // Scale image to fit canvas
            const canvas = fabricCanvasRef.current;
            const canvasWidth = canvas.width || 800;
            const canvasHeight = canvas.height || 600;
            
            const scaleX = canvasWidth / (img.width || 1);
            const scaleY = canvasHeight / (img.height || 1);
            const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
            
            img.set({
              scaleX: scale,
              scaleY: scale,
              left: (canvasWidth - (img.width || 0) * scale) / 2,
              top: (canvasHeight - (img.height || 0) * scale) / 2,
              id: `image-${Date.now()}`
            });
            
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            updateLayersList();
          }
        });
      };
      reader.readAsDataURL(file);
    } else if (file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgData = e.target?.result as string;
        FabricImage.fromURL('data:image/svg+xml;base64,' + btoa(svgData), {
          crossOrigin: 'anonymous'
        }).then((img) => {
          if (fabricCanvasRef.current) {
            const canvas = fabricCanvasRef.current;
            img.set({
              left: 100,
              top: 100,
              id: `svg-${Date.now()}`
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            updateLayersList();
          }
        });
      };
      reader.readAsText(file);
    }
  }, []);

  const setTool = (tool: string) => {
    setSelectedTool(tool);
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    switch (tool) {
      case 'select':
        canvas.defaultCursor = 'default';
        canvas.selection = true;
        break;
      case 'rectangle':
        addRectangle();
        break;
      case 'circle':
        addCircle();
        break;
      case 'triangle':
        addTriangle();
        break;
      case 'text':
        addText();
        break;
      case 'image':
        fileInputRef.current?.click();
        break;
    }
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;
    
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 150,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      selectable: true,
      evented: true
    });
    
    (rect as any).layerId = `rect-${Date.now()}`;
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;
    
    const circle = new FabricCircle({
      left: 100,
      top: 100,
      radius: 75,
      fill: '#10b981',
      stroke: '#047857',
      strokeWidth: 2,
      selectable: true,
      evented: true
    });
    
    (circle as any).layerId = `circle-${Date.now()}`;
    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
  };

  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;
    
    const triangle = new FabricTriangle({
      left: 100,
      top: 100,
      width: 150,
      height: 130,
      fill: '#f59e0b',
      stroke: '#d97706',
      strokeWidth: 2,
      selectable: true,
      evented: true
    });
    
    (triangle as any).layerId = `triangle-${Date.now()}`;
    fabricCanvasRef.current.add(triangle);
    fabricCanvasRef.current.setActiveObject(triangle);
    fabricCanvasRef.current.renderAll();
  };

  const addText = () => {
    if (!fabricCanvasRef.current || !containerRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const container = containerRef.current;
    
    // Store current scroll position
    const currentScrollTop = container.scrollTop;
    const currentScrollLeft = container.scrollLeft;
    
    // Create text at canvas center
    const text = new IText('Double-click to edit', {
      left: 400,
      top: 300,
      fontSize: 32,
      fontFamily: 'Arial',
      fill: '#000000',
      selectable: true,
      evented: true,
      editable: true,
      originX: 'center',
      originY: 'center'
    });
    
    (text as any).layerId = `text-${Date.now()}`;
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    // Force restore scroll position immediately after rendering
    requestAnimationFrame(() => {
      container.scrollTop = currentScrollTop;
      container.scrollLeft = currentScrollLeft;
    });
    
    setSelectedObject(text);
    setActivePropertiesTab('properties');
  };

  const updateTextProperties = (properties: any) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.type !== 'i-text') return;
    
    selectedObject.set(properties);
    fabricCanvasRef.current.renderAll();
  };

  const applyTextEffect = (effectName: string, properties: any) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.type !== 'i-text') return;
    
    if (effectName === 'clear') {
      selectedObject.set({
        shadow: null,
        stroke: null,
        strokeWidth: 0,
        textBackgroundColor: ''
      });
    } else if (effectName === 'shadow') {
      selectedObject.set({
        shadow: `${properties.shadowOffsetX || 2}px ${properties.shadowOffsetY || 2}px ${properties.shadowBlur || 4}px ${properties.shadowColor || '#000000'}`
      });
    } else if (effectName === 'outline') {
      selectedObject.set({
        stroke: properties.strokeColor || '#000000',
        strokeWidth: properties.strokeWidth || 2
      });
    } else if (effectName === 'glow') {
      selectedObject.set({
        shadow: `0px 0px ${properties.glowBlur || 10}px ${properties.glowColor || '#00ffff'}`
      });
    } else if (effectName === 'gradient') {
      selectedObject.set('fill', properties.gradientStart || '#ff0000');
    } else if (effectName === 'neon') {
      selectedObject.set({
        shadow: `0px 0px ${properties.neonIntensity || 15}px ${properties.neonColor || '#00ff00'}`,
        stroke: properties.neonColor || '#00ff00',
        strokeWidth: 1
      });
    } else if (effectName === 'fire') {
      selectedObject.set({
        fill: properties.fireColor1 || '#ff4500',
        shadow: `0px 0px 8px ${properties.fireColor1 || '#ff4500'}`
      });
    } else if (effectName === 'ice') {
      selectedObject.set({
        fill: properties.iceColor || '#87ceeb',
        shadow: `0px 0px ${properties.iceBlur || 5}px #87ceeb`,
        opacity: properties.iceOpacity || 0.8
      });
    } else if (effectName === 'retro') {
      selectedObject.set({
        fill: properties.retroColor || '#ff69b4',
        shadow: `2px 2px 0px #000000`,
        stroke: '#000000',
        strokeWidth: 1
      });
    } else if (effectName === 'emboss') {
      selectedObject.set({
        shadow: `1px 1px 0px rgba(255,255,255,0.5)`,
        stroke: 'rgba(0,0,0,0.3)',
        strokeWidth: 1
      });
    } else if (effectName === 'holographic') {
      selectedObject.set('fill', '#ff00ff');
    } else if (effectName === 'vintage') {
      selectedObject.set({
        fill: properties.vintageSepia || '#8b4513',
        shadow: `1px 1px 2px #654321`
      });
    }
    
    fabricCanvasRef.current.renderAll();
    updateLayers();
  };

  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const duplicateSelectedObject = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      activeObject.clone().then((cloned: FabricObject) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20,
        });
        fabricCanvasRef.current?.add(cloned);
        fabricCanvasRef.current?.setActiveObject(cloned);
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      obj.set('visible', !obj.visible);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
    }
  };

  const toggleLayerLock = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      obj.set('selectable', obj.selectable ? false : true);
      obj.set('evented', obj.evented ? false : true);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
    }
  };

  const deleteLayer = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      fabricCanvasRef.current.remove(obj);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
    }
  };

  const reorderLayers = (fromIndex: number, toIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const reversedFromIndex = objects.length - 1 - fromIndex;
    const reversedToIndex = objects.length - 1 - toIndex;
    
    const objectToMove = objects[reversedFromIndex];
    if (objectToMove) {
      fabricCanvasRef.current.remove(objectToMove);
      fabricCanvasRef.current.insertAt(reversedToIndex, objectToMove);
      fabricCanvasRef.current.renderAll();
      updateLayersList();
    }
  };



  // Layer selection and property management
  const selectLayer = (layer: Layer) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layer.id || `layer-${index}` === layer.id);
    
    if (obj) {
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(obj);
      setSelectedLayer(layer);
      setLayerOpacity(Math.round((obj.opacity || 1) * 100));
    }
  };

  const updateLayerOpacity = (opacity: number) => {
    if (!selectedObject || !fabricCanvasRef.current) return;
    
    selectedObject.set('opacity', opacity / 100);
    fabricCanvasRef.current.renderAll();
    setLayerOpacity(opacity);
    updateLayersList();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fabricCanvasRef.current) return;
      
      // Prevent default browser behavior for our shortcuts
      if ((e.ctrlKey || e.metaKey) && ['z', 'y', 'c', 'v', 'a', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedObject();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        // Undo functionality would go here
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        // Redo functionality would go here
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        // Copy functionality would go here
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        // Paste functionality would go here
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelectedObject();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        // Select all functionality would go here
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Export functionality
  const exportCanvas = (format: 'png' | 'jpeg' | 'svg') => {
    if (!fabricCanvasRef.current) return;
    
    let dataURL: string;
    
    if (format === 'svg') {
      dataURL = fabricCanvasRef.current.toSVG();
      const blob = new Blob([dataURL], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `canvas-export.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      dataURL = fabricCanvasRef.current.toDataURL({
        format: format,
        quality: 0.9,
        multiplier: format === 'png' ? 2 : 1 // Higher resolution for PNG
      });
      
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `canvas-export.${format}`;
      link.click();
    }
  };

  const updateLayers = () => {
    updateLayersList();
  };

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <div className="bg-[#2c2c2c] border-b border-[#1e1e1e] px-4 py-1">
        <div className="flex items-center text-sm space-x-6">
          <span className="font-semibold">Zentraw Editor</span>
          
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setTemplatesModalOpen(true)}
          >
            Templates
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setSvgLayoutModalOpen(true)}
          >
            SVG Layout
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
            onClick={() => window.location.href = '/admin'}
          >
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
            </svg>
            Admin
          </Button>
          
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
      <div className="flex flex-1">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#383838] border-r border-[#4a4a4a] p-2 flex flex-col items-center">
          {/* Tools */}
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
                title={toolItem.name}
              >
                {React.createElement(toolItem.icon, { className: "w-3 h-3" })}
              </Button>
            ))}
          </div>
          
          {/* Color Swatches */}
          <div className="mt-6 px-1">
            <div className="space-y-2">
              <div className="w-10 h-5 bg-black border border-gray-600 rounded cursor-pointer"></div>
              <div className="w-10 h-5 bg-white border border-gray-600 rounded cursor-pointer"></div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-[#2d2d2d] flex flex-col relative">
          {/* Top Bar with Zoom Controls */}
          <div className="bg-[#383838] border-b border-[#4a4a4a] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-400">Format:</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2 py-1 text-xs text-white"
                >
                  <option value="instagram-post">Instagram Post (1080x1080)</option>
                  <option value="instagram-story">Instagram Story (1080x1920)</option>
                  <option value="facebook-post">Facebook Post (1200x630)</option>
                  <option value="twitter-post">Twitter Post (1024x512)</option>
                  <option value="linkedin-post">LinkedIn Post (1200x627)</option>
                  <option value="youtube-thumbnail">YouTube Thumbnail (1280x720)</option>
                  <option value="custom">Custom Size</option>
                </select>
              </div>
              <span className="text-xs text-gray-400">Canvas: 800 x 600px</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fitToScreen}
                className="px-2 py-1 h-6 text-xs hover:bg-[#4a4a4a]"
              >
                Fit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                className="px-2 py-1 h-6 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="px-2 py-1 bg-[#2d2d2d] text-white text-xs rounded min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                className="px-2 py-1 h-6 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="px-2 py-1 h-6 text-xs hover:bg-[#4a4a4a]"
              >
                100%
              </Button>
            </div>
          </div>

          {/* Main Canvas Container */}
          <div 
            ref={containerRef} 
            className="flex-1 overflow-hidden relative flex items-center justify-center bg-[#2d2d2d]"
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleDragDropFile(files[0]);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: `${panX % 20}px ${panY % 20}px`
              }}
            />
            
            {/* Canvas with Transparent Background */}
            <div 
              className="relative shadow-2xl"
              style={{
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transformOrigin: 'center center',
                border: '1px solid #666',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              {/* Transparency Checkerboard Pattern - only show when transparent */}
              {canvasBackground === 'transparent' && (
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ffffff 25%, transparent 25%),
                      linear-gradient(-45deg, #ffffff 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ffffff 75%),
                      linear-gradient(-45deg, transparent 75%, #ffffff 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundColor: '#f0f0f0'
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="block relative"
                style={{
                  filter: `hue-rotate(${hue}deg) saturate(${100 + saturation}%) brightness(${100 + brightness}%)`,
                  display: 'block'
                }}
              />
            </div>
            
            {/* Drop Zone Overlay */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 text-white p-8 rounded-lg backdrop-blur-sm text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                  <p className="text-lg font-medium mb-2">Start Creating</p>
                  <p className="text-sm text-gray-300 mb-4">Use the toolbar to add shapes, text, or drag files here</p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs">
                    <span className="bg-blue-500/20 px-2 py-1 rounded">Shapes</span>
                    <span className="bg-green-500/20 px-2 py-1 rounded">Text</span>
                    <span className="bg-purple-500/20 px-2 py-1 rounded">Images</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Hint */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded backdrop-blur-sm">
              <p>Space + Drag to pan • Scroll to zoom • Double-click text to edit</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Fixed width, scrollable content only */}
        <div className="w-80 bg-[#383838] border-l border-[#4a4a4a] flex flex-col flex-shrink-0">
          {/* Properties Tabs */}
          <Tabs value={activePropertiesTab} onValueChange={setActivePropertiesTab} className="flex-1 flex flex-col min-h-0">
            <div className="bg-[#2d2d2d] border-b border-[#4a4a4a] px-3 py-2 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
                <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs">Adjustments</TabsTrigger>
                <TabsTrigger value="libraries" className="text-xs">Libraries</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                {/* Canvas Background Controls - Fixed */}
                <div className="p-4 border-b border-[#4a4a4a] flex-shrink-0">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Canvas Background</label>
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
                          backgroundColor: '#f0f0f0'
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
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Layer Properties</label>
                        
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
                              <label className="text-xs text-gray-400 block mb-1">Stroke Color</label>
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
                              <label className="text-xs text-gray-400 block mb-1">Stroke Width</label>
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
                              <span className="text-xs text-gray-500">{selectedObject.strokeWidth || 0}px</span>
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

                <div className="pt-2 border-t border-[#4a4a4a]">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="w-full text-xs"
                    onDoubleClick={() => {
                      setHue(0);
                      setSaturation(0);
                      setBrightness(0);
                    }}
                  >
                    Reset All (Double-click)
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-[#4a4a4a]">
                  <Button 
                    size="sm" 
                    className="w-full bg-[#0078d4] hover:bg-[#106ebe] text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="libraries" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                {/* Layers Header - Fixed */}
                <div className="bg-[#2d2d2d] border-b border-[#4a4a4a] px-3 py-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">Layers ({layers.length})</span>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Scrollable Layers Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 space-y-2">
                    {layers.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No layers yet</p>
                        <p className="text-xs">Add shapes or text to create layers</p>
                      </div>
                    ) : (
                      layers.map((layer, index) => (
                        <div
                          key={layer.id}
                          className={`
                            flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors
                            ${layer.visible ? 'bg-[#4a4a4a] hover:bg-[#555555]' : 'bg-[#3a3a3a] hover:bg-[#404040] opacity-60'}
                            ${layer.locked ? 'border border-orange-500/30' : ''}
                            ${selectedLayer?.id === layer.id ? 'ring-2 ring-blue-500' : ''}
                          `}
                          draggable
                          onClick={() => selectLayer(layer)}
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            if (fromIndex !== index) {
                              reorderLayers(fromIndex, index);
                            }
                          }}
                        >
                          <button 
                            className="p-1 hover:bg-[#5a5a5a] rounded"
                            onClick={() => toggleLayerVisibility(layer.id)}
                            title={layer.visible ? 'Hide layer' : 'Show layer'}
                          >
                            {layer.visible ? (
                              <Eye className="w-4 h-4 text-gray-300" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-gray-500" />
                            )}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-300 truncate">{layer.name}</div>
                            <div className="text-xs text-gray-500">{layer.type}</div>
                          </div>
                          
                          <button 
                            className="p-1 hover:bg-[#5a5a5a] rounded"
                            onClick={() => toggleLayerLock(layer.id)}
                            title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                          >
                            {layer.locked ? (
                              <Lock className="w-4 h-4 text-orange-400" />
                            ) : (
                              <Unlock className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          
                          <button 
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                            onClick={() => deleteLayer(layer.id)}
                            title="Delete layer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Layer Properties - Show when layer is selected */}
                {selectedLayer && (
                  <div className="border-t border-[#4a4a4a] p-4 flex-shrink-0">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">Layer Properties</h3>
                    
                    {/* Opacity Control */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-gray-400">Opacity:</label>
                        <span className="text-xs text-gray-300">{layerOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layerOpacity}
                        onChange={(e) => updateLayerOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    {/* Blend Mode */}
                    <div>
                      <label className="text-xs text-gray-400 block mb-2">Blend Mode:</label>
                      <select 
                        value={layerBlendMode}
                        onChange={(e) => setLayerBlendMode(e.target.value)}
                        className="w-full bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2 py-1 text-xs text-white"
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
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <TemplatesModal
        open={templatesModalOpen}
        onOpenChange={setTemplatesModalOpen}
        onSelectTemplate={(template) => {
          console.log('Selected template:', template);
        }}
      />

      <SVGLayoutModal
        open={svgLayoutModalOpen}
        onOpenChange={setSvgLayoutModalOpen}
        onSelectLayout={(layout) => {
          console.log('Selected layout:', layout);
        }}
      />

      <FormatsModal
        open={formatsModalOpen}
        onOpenChange={setFormatsModalOpen}
        onSelectFormat={(format) => {
          console.log('Selected format:', format);
        }}
      />

      <TextEffectsModal
        open={textEffectsModalOpen}
        onOpenChange={setTextEffectsModalOpen}
        onApplyEffect={(effect, settings) => {
          console.log('Applied effect:', effect, settings);
        }}
      />

      <FiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        onApplyFilter={(filter, settings) => {
          console.log('Applied filter:', filter, settings);
        }}
      />
    </div>
  );
}