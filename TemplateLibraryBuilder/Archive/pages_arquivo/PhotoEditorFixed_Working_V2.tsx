import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, IText, Rect, Circle, Triangle, FabricImage, FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon, 
  Type, 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Save, 
  FileText, 
  Palette, 
  Layout, 
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Layers,
  Copy,
  Grid3X3
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { ParameterInput } from '@/components/editor/ParameterInput';
import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { SVGLayoutModal } from '@/components/editor/SVGLayoutModal';
import { FormatsModal } from '@/components/editor/FormatsModal';
import { FiltersModal } from '@/components/editor/FiltersModal';
import { TextEffectsModal } from '@/components/editor/TextEffectsModal';
import { VisualEffectsPanel } from '@/components/editor/VisualEffectsPanel';

interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export default function PhotoEditor() {
  // Modal states
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
  const [showGrid, setShowGrid] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  
  // Active tab states
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  
  // Custom zoom implementation
  const [currentZoom, setCurrentZoom] = useState(1);
  
  const zoomIn = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const currentZoom = canvas.getZoom();
    const newZoom = Math.min(currentZoom * 1.2, 5);
    
    // Use setZoom with proper centering
    canvas.setZoom(newZoom);
    canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0]);
    setCurrentZoom(newZoom);
  }, []);

  const zoomOut = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    const currentZoom = canvas.getZoom();
    const newZoom = Math.max(currentZoom / 1.2, 0.1);
    
    // Use setZoom with proper centering
    canvas.setZoom(newZoom);
    canvas.setViewportTransform([newZoom, 0, 0, newZoom, 0, 0]);
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
    canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
    setCurrentZoom(scale);
  }, []);


  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 1080,
        height: 1080,
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true,
        imageSmoothingEnabled: true,
        enableRetinaScaling: true,
        fireRightClick: true,
        stopContextMenu: true,
        controlsAboveOverlay: true,
        centeredScaling: false,
        centeredRotation: true,
        interactive: true,
        uniformScaling: false
      });

      fabricCanvasRef.current = canvas;

      // Keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
          if (e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
          } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
            e.preventDefault();
            redo();
          } else if (e.key === 'c') {
            e.preventDefault();
            duplicateSelectedObject();
          } else if (e.key === 's') {
            e.preventDefault();
            exportCanvas();
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedObject) {
            canvas.remove(selectedObject);
            setSelectedObject(null);
            updateLayersList();
            saveState();
          }
        } else if (e.key === "'") {
          e.preventDefault();
          setShowGrid(!showGrid);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      // Canvas event listeners
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
        document.removeEventListener('keydown', handleKeyDown);
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

  // Layer management
  const updateLayersList = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const newLayers: Layer[] = objects.map((obj, index) => ({
      id: (obj as any).layerId || `layer-${index}`,
      name: obj.type === 'i-text' ? (obj as IText).text || 'Text' : 
            obj.type === 'image' ? 'Image' :
            obj.type === 'rect' ? 'Rectangle' :
            obj.type === 'circle' ? 'Circle' :
            obj.type === 'triangle' ? 'Triangle' : `Layer ${index + 1}`,
      type: obj.type || 'object',
      visible: obj.visible !== false,
      locked: !obj.selectable
    })).reverse();
    
    setLayers(newLayers);
  }, []);

  // Drag and drop reordering
  const reorderLayers = (result: DropResult) => {
    if (!result.destination || !fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const fromIndex = objects.length - 1 - result.source.index;
    const toIndex = objects.length - 1 - result.destination.index;
    
    const obj = objects[fromIndex];
    canvas.remove(obj);
    canvas.insertAt(obj, toIndex, false);
    canvas.renderAll();
    
    updateLayersList();
    saveState();
  };

  // Shape creation functions
  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasCenter = canvas.getCenterPoint();
    
    const rect = new Rect({
      left: canvasCenter.x,
      top: canvasCenter.y,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });
    
    (rect as any).layerId = `rect-${Date.now()}`;
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    setSelectedObject(rect);
    setActivePropertiesTab('properties');
    saveState();
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasCenter = canvas.getCenterPoint();
    
    const circle = new Circle({
      left: canvasCenter.x,
      top: canvasCenter.y,
      radius: 50,
      fill: '#10b981',
      stroke: '#047857',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });
    
    (circle as any).layerId = `circle-${Date.now()}`;
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    
    setSelectedObject(circle);
    setActivePropertiesTab('properties');
    saveState();
  };

  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasCenter = canvas.getCenterPoint();
    
    const triangle = new Triangle({
      left: canvasCenter.x,
      top: canvasCenter.y,
      width: 100,
      height: 100,
      fill: '#f59e0b',
      stroke: '#d97706',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center'
    });
    
    (triangle as any).layerId = `triangle-${Date.now()}`;
    
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    
    setSelectedObject(triangle);
    setActivePropertiesTab('properties');
    saveState();
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const canvasCenter = canvas.getCenterPoint();
    
    const text = new IText('Add your text', {
      left: canvasCenter.x,
      top: canvasCenter.y,
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
    
    // Add text without triggering viewport changes
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    setSelectedObject(text);
    setActivePropertiesTab('properties');
    saveState();
  };

  const updateTextProperties = (properties: any) => {
    if (!fabricCanvasRef.current || !selectedObject || selectedObject.type !== 'i-text') return;
    
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
      format: format,
      quality: 1.0,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `canvas-export.${format}`;
    link.href = dataURL;
    link.click();
  };

  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
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
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
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
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      fabricCanvasRef.current.remove(obj);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
      updateLayersList();
      saveState();
    }
  };

  const duplicateSelectedObject = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;

    selectedObject.clone().then((cloned: FabricObject) => {
      cloned.set({
        left: (cloned.left || 0) + 10,
        top: (cloned.top || 0) + 10
      });
      
      (cloned as any).layerId = `${selectedObject.type}-${Date.now()}`;
      
      fabricCanvasRef.current!.add(cloned);
      fabricCanvasRef.current!.setActiveObject(cloned);
      fabricCanvasRef.current!.renderAll();
      
      setSelectedObject(cloned);
      updateLayersList();
      saveState();
    });
  };

  const selectLayer = (layer: Layer) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layer.id || `layer-${index}` === layer.id);
    
    if (obj) {
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.renderAll();
      setSelectedObject(obj);
      setSelectedLayer(layer);
    }
  };

  return (
    <div className="h-screen bg-[#2a2a2a] text-white overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="h-12 bg-[#1e1e1e] border-b border-[#4a4a4a] flex items-center px-4 gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= canvasHistory.length - 1}>
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-[#4a4a4a]" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={addRectangle}>
            <Square className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addCircle}>
            <CircleIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addTriangle}>
            <TriangleIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addText}>
            <Type className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-[#4a4a4a]" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-400 min-w-[60px] text-center">
            {Math.round(currentZoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={fitToScreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
        
        <Separator orientation="vertical" className="h-6 bg-[#4a4a4a]" />
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setTemplatesModalOpen(true)}>
            <FileText className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSvgLayoutModalOpen(true)}>
            <Layout className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setFormatsModalOpen(true)}>
            <Palette className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => exportCanvas('png')}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Tools */}
        <div className="w-16 bg-[#1e1e1e] border-r border-[#4a4a4a] flex flex-col items-center py-4 gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={() => setFiltersModalOpen(true)}>
            <Filter className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={() => setTextEffectsModalOpen(true)}>
            <Type className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0" onClick={duplicateSelectedObject} disabled={!selectedObject}>
            <Copy className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-10 h-10 p-0" 
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid3X3 className="w-5 h-5" />
          </Button>
        </div>

        {/* Canvas Area */}
        <div 
          ref={containerRef}
          className="flex-1 bg-[#4c4c4c] flex items-center justify-center overflow-auto relative"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: showGrid ? '20px 20px' : '0 0',
            backgroundPosition: '0 0, 0 0'
          }}
        >
          <canvas 
            ref={canvasRef}
            className="border border-[#666] shadow-2xl"
            style={{
              filter: canvasBackground === 'transparent' ? 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' : 'none'
            }}
          />
        </div>

        {/* Right Panels */}
        <div className="w-80 bg-[#2a2a2a] border-l border-[#4a4a4a] flex flex-col min-h-0">
          {/* Properties Panel */}
          <Tabs value={activePropertiesTab} onValueChange={(value: any) => setActivePropertiesTab(value)} className="flex flex-col h-full min-h-0">
            <div className="p-2 border-b border-[#4a4a4a] flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
                <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs">Adjustments</TabsTrigger>
                <TabsTrigger value="libraries" className="text-xs">Libraries</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                {/* Canvas Background Controls - Only show when no object is selected */}
                {!selectedObject && (
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
                    
                    {/* Grid Controls */}
                    <div className="mt-4 pt-4 border-t border-[#4a4a4a]">
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Grid</label>
                      <div className="flex items-center space-x-2 mb-2">
                        <button
                          onClick={() => {
                            const newGridState = !showGrid;
                            setShowGrid(newGridState);
                            // Toggle grid visibility on canvas
                            if (fabricCanvasRef.current) {
                              const canvas = fabricCanvasRef.current;
                              if (newGridState) {
                                canvas.backgroundColor = canvasBackground === 'transparent' ? 'rgba(255,255,255,0.1)' : canvasBackground;
                              } else {
                                canvas.backgroundColor = canvasBackground === 'transparent' ? 'transparent' : canvasBackground;
                              }
                              canvas.renderAll();
                            }
                          }}
                          className={`px-3 py-1 text-xs rounded ${showGrid ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                        >
                          {showGrid ? 'Hide Grid' : 'Show Grid'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                    </div>
                  ) : selectedObject ? (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-300 mb-4">Object Properties</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">X Position</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.left || 0)}
                              onChange={(e) => {
                                selectedObject.set('left', parseFloat(e.target.value));
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-gray-600 rounded text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Y Position</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.top || 0)}
                              onChange={(e) => {
                                selectedObject.set('top', parseFloat(e.target.value));
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Width</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.width * (selectedObject.scaleX || 1))}
                              onChange={(e) => {
                                const newWidth = parseFloat(e.target.value);
                                const scaleX = newWidth / selectedObject.width;
                                selectedObject.set('scaleX', scaleX);
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-gray-600 rounded text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Height</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.height * (selectedObject.scaleY || 1))}
                              onChange={(e) => {
                                const newHeight = parseFloat(e.target.value);
                                const scaleY = newHeight / selectedObject.height;
                                selectedObject.set('scaleY', scaleY);
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-[#1e1e1e] border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Rotation</label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={selectedObject.angle || 0}
                            onChange={(e) => {
                              selectedObject.set('angle', parseFloat(e.target.value));
                              fabricCanvasRef.current?.renderAll();
                              saveState();
                            }}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-400 mt-1">{Math.round(selectedObject.angle || 0)}°</div>
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(selectedObject.opacity || 1) * 100}
                            onChange={(e) => {
                              const opacity = parseFloat(e.target.value) / 100;
                              selectedObject.set('opacity', opacity);
                              fabricCanvasRef.current?.renderAll();
                              setLayerOpacity(parseFloat(e.target.value));
                              saveState();
                            }}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-400 mt-1">{Math.round((selectedObject.opacity || 1) * 100)}%</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                        </div>
                        
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Stroke Width</label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={selectedObject.strokeWidth || 0}
                            onChange={(e) => {
                              selectedObject.set('strokeWidth', parseFloat(e.target.value));
                              fabricCanvasRef.current?.renderAll();
                              saveState();
                            }}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-400 mt-1">{selectedObject.strokeWidth || 0}px</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      Select an object to edit its properties
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adjustments" className="flex-1 m-0">
              <div className="p-4 space-y-4">
                {/* Visual Effects Panel */}
                <VisualEffectsPanel 
                  selectedObject={selectedObject}
                  applyEffect={(effect) => {
                    if (selectedObject) {
                      // Apply visual effect to the selected object
                      selectedObject.set('filters', []);
                      if (effect.fabricOptions.css && effect.fabricOptions.css !== 'none') {
                        selectedObject.set('cssFilter', effect.fabricOptions.css);
                      } else {
                        selectedObject.set('cssFilter', '');
                      }
                      fabricCanvasRef.current?.renderAll();
                    }
                  }}
                />
                
                <div className="border-t border-[#4a4a4a] pt-4 space-y-4">
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
              </div>
            </TabsContent>

            <TabsContent value="libraries" className="flex-1 m-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-300">Layers</h3>
                  <Layers className="w-4 h-4 text-gray-400" />
                </div>
                
                <DragDropContext onDragEnd={reorderLayers}>
                  <Droppable droppableId="layers">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                        {layers.map((layer, index) => (
                          <Draggable key={layer.id} draggableId={layer.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center p-2 rounded text-xs cursor-pointer hover:bg-[#4a4a4a] ${
                                  selectedLayer?.id === layer.id ? 'bg-[#0078d4]' : 'bg-[#3a3a3a]'
                                }`}
                                onClick={() => selectLayer(layer)}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">{layer.name}</div>
                                  <div className="text-gray-400">{layer.type}</div>
                                </div>
                                
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLayerVisibility(layer.id);
                                    }}
                                    className="p-1 hover:bg-gray-600 rounded"
                                  >
                                    {layer.visible ? (
                                      <Eye className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <EyeOff className="w-3 h-3 text-gray-400" />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLayerLock(layer.id);
                                    }}
                                    className="p-1 hover:bg-gray-600 rounded"
                                  >
                                    {layer.locked ? (
                                      <Lock className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <Unlock className="w-3 h-3 text-gray-400" />
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteLayer(layer.id);
                                    }}
                                    className="p-1 hover:bg-red-600 rounded"
                                  >
                                    <Trash2 className="w-3 h-3 text-gray-400 hover:text-white" />
                                  </button>
                                </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && fabricCanvasRef.current) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const imgElement = new Image();
              imgElement.onload = () => {
                FabricImage.fromURL(event.target?.result as string).then((img) => {
                  const canvas = fabricCanvasRef.current!;
                  const canvasCenter = canvas.getCenterPoint();
                  
                  // Scale image to fit canvas if too large
                  const maxSize = 400;
                  const scale = Math.min(maxSize / img.width!, maxSize / img.height!, 1);
                  
                  img.set({
                    left: canvasCenter.x,
                    top: canvasCenter.y,
                    originX: 'center',
                    originY: 'center',
                    scaleX: scale,
                    scaleY: scale
                  });
                  
                  (img as any).layerId = `image-${Date.now()}`;
                  
                  canvas.add(img);
                  canvas.setActiveObject(img);
                  canvas.renderAll();
                  
                  setSelectedObject(img);
                  setActivePropertiesTab('properties');
                  saveState();
                });
              };
              imgElement.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Modals */}
      <TemplatesModal 
        open={templatesModalOpen} 
        onOpenChange={setTemplatesModalOpen}
        onTemplateSelect={() => setTemplatesModalOpen(false)}
      />
      
      <SVGLayoutModal 
        open={svgLayoutModalOpen} 
        onOpenChange={setSvgLayoutModalOpen}
        onLayoutSelect={() => setSvgLayoutModalOpen(false)}
      />
      
      <FormatsModal 
        open={formatsModalOpen} 
        onOpenChange={setFormatsModalOpen}
        selectedFormat={selectedFormat}
        onFormatSelect={(format: string) => setSelectedFormat(format)}
      />
      
      <FiltersModal 
        open={filtersModalOpen} 
        onOpenChange={setFiltersModalOpen}
      />
      
      <TextEffectsModal 
        open={textEffectsModalOpen} 
        onOpenChange={setTextEffectsModalOpen}
        selectedObject={selectedObject}
        onApplyEffect={applyTextEffect}
      />
    </div>
  );
}