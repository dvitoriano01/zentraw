import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Square, 
  Circle, 
  Triangle, 
  Type, 
  Image, 
  MousePointer, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Share, 
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Layers
} from 'lucide-react';
import { Canvas, FabricObject, IText, Rect, Circle as FabricCircle, Triangle as FabricTriangle, FabricImage } from 'fabric';
import { useCanvasZoomPan } from '@/hooks/useCanvasZoomPan';
import { CANVAS_FORMATS } from '@/types/formats';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';

interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'background';
  visible: boolean;
  locked: boolean;
}

export default function PhotoEditorNew() {
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedFormat, setSelectedFormat] = useState('instagram-post');
  const [canvasBackground, setCanvasBackground] = useState('transparent');
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(null);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [layerBlendMode, setLayerBlendMode] = useState('normal');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  
  const { zoom, panX, panY, zoomIn, zoomOut, resetZoom } = useCanvasZoomPan({
    canvasRef,
    containerRef,
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1
  });

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'transparent',
        selection: true,
        preserveObjectStacking: true
      });

      fabricCanvasRef.current = canvas;

      canvas.on('selection:created', (e) => {
        setSelectedObject(e.selected?.[0] || null);
        updateLayers();
      });

      canvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected?.[0] || null);
        updateLayers();
      });

      canvas.on('selection:cleared', () => {
        setSelectedObject(null);
        updateLayers();
      });

      canvas.on('object:added', updateLayers);
      canvas.on('object:removed', updateLayers);
      canvas.on('object:modified', updateLayers);

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    }
  }, []);

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
    }).reverse();

    setLayers(newLayers);
  }, []);

  // Canvas tool handlers
  const handleCanvasClick = useCallback((e: any) => {
    if (!fabricCanvasRef.current || selectedTool === 'select') return;

    const pointer = fabricCanvasRef.current.getPointer(e.e);
    let newObject: FabricObject | null = null;

    switch (selectedTool) {
      case 'rectangle':
        newObject = new Rect({
          left: pointer.x - 50,
          top: pointer.y - 30,
          width: 100,
          height: 60,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2
        });
        break;
      case 'circle':
        newObject = new FabricCircle({
          left: pointer.x - 40,
          top: pointer.y - 40,
          radius: 40,
          fill: '#ef4444',
          stroke: '#dc2626',
          strokeWidth: 2
        });
        break;
      case 'triangle':
        newObject = new FabricTriangle({
          left: pointer.x - 40,
          top: pointer.y - 40,
          width: 80,
          height: 80,
          fill: '#10b981',
          stroke: '#059669',
          strokeWidth: 2
        });
        break;
      case 'text':
        newObject = new IText('Click to edit text', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: 'Arial',
          fontSize: 20,
          fill: '#000000'
        });
        break;
    }

    if (newObject) {
      (newObject as any).layerId = `layer-${Date.now()}`;
      fabricCanvasRef.current.add(newObject);
      fabricCanvasRef.current.setActiveObject(newObject);
      fabricCanvasRef.current.renderAll();
      setSelectedTool('select');
    }
  }, [selectedTool]);

  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.on('mouse:down', handleCanvasClick);
      return () => {
        fabricCanvasRef.current?.off('mouse:down', handleCanvasClick);
      };
    }
  }, [handleCanvasClick]);

  // Text properties update
  const updateTextProperties = (properties: any) => {
    if (!selectedObject || selectedObject.type !== 'i-text') return;
    selectedObject.set(properties);
    fabricCanvasRef.current?.renderAll();
  };

  // Text effects
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
    }
    
    fabricCanvasRef.current.renderAll();
    updateLayers();
  };

  // Export functionality
  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return;
    
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = `zentraw-design-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Layer selection and property management
  const selectLayer = (layer: LayerItem) => {
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
    updateLayers();
  };

  // Layer management
  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      obj.set('visible', !obj.visible);
      fabricCanvasRef.current.renderAll();
      updateLayers();
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
      updateLayers();
    }
  };

  const deleteLayer = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find((o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId);
    
    if (obj) {
      fabricCanvasRef.current.remove(obj);
      fabricCanvasRef.current.renderAll();
      updateLayers();
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
      updateLayers();
    }
  };

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-[#383838] border-b border-[#4a4a4a] px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold">Zentraw Editor</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-xs">File</Button>
              <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
              <Button variant="ghost" size="sm" className="text-xs">View</Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={exportCanvas}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Toolbar */}
        <div className="w-12 bg-[#383838] border-r border-[#4a4a4a] flex flex-col py-2 flex-shrink-0">
          <div className="space-y-1">
            {[
              { tool: 'select', icon: MousePointer, title: 'Select (V)' },
              { tool: 'rectangle', icon: Square, title: 'Rectangle (R)' },
              { tool: 'circle', icon: Circle, title: 'Circle (C)' },
              { tool: 'triangle', icon: Triangle, title: 'Triangle' },
              { tool: 'text', icon: Type, title: 'Text (T)' },
              { tool: 'image', icon: Image, title: 'Image' }
            ].map(({ tool, icon: Icon, title }) => (
              <button 
                key={tool}
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded hover:bg-[#4a4a4a] ${selectedTool === tool ? 'bg-blue-600' : ''}`}
                onClick={() => setSelectedTool(tool)}
                title={title}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Canvas Controls */}
          <div className="bg-[#383838] border-b border-[#4a4a4a] px-4 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-400">Format:</label>
                <select 
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2 py-1 text-xs"
                >
                  {Object.entries(CANVAS_FORMATS).map(([key, format]) => (
                    <option key={key} value={key}>{format.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={zoomOut} className="px-2 py-1 h-6 text-xs">
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="px-2 py-1 bg-[#2d2d2d] text-white text-xs rounded min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button variant="ghost" size="sm" onClick={zoomIn} className="px-2 py-1 h-6 text-xs">
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={resetZoom} className="px-2 py-1 h-6 text-xs">
                100%
              </Button>
            </div>
          </div>

          {/* Main Canvas Container */}
          <div 
            ref={containerRef} 
            className="flex-1 relative flex items-center justify-center bg-[#2d2d2d] min-h-0"
          >
            {/* Canvas */}
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
                    backgroundSize: '10px 10px',
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
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-[#383838] border-l border-[#4a4a4a] flex flex-col flex-shrink-0">
          <Tabs value={activePropertiesTab} onValueChange={setActivePropertiesTab} className="flex-1 flex flex-col min-h-0">
            <div className="bg-[#2d2d2d] border-b border-[#4a4a4a] px-3 py-2 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
                <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs">Adjustments</TabsTrigger>
                <TabsTrigger value="libraries" className="text-xs">Libraries</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="properties" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex-1 overflow-y-auto min-h-0">
                {selectedObject && selectedObject.type === 'i-text' ? (
                  <div>
                    <div className="p-4">
                      <TextPropertiesPanel 
                        selectedObject={selectedObject}
                        onUpdateText={updateTextProperties}
                      />
                    </div>
                    <div className="border-t border-[#4a4a4a] p-4">
                      <TextFXPanel 
                        selectedObject={selectedObject}
                        onApplyEffect={applyTextEffect}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Canvas Filters</label>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Hue</label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={hue}
                            onChange={(e) => setHue(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-500">{hue}°</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Saturation</label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={saturation}
                            onChange={(e) => setSaturation(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-500">{saturation}%</span>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Brightness</label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="text-xs text-gray-500">{brightness}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="adjustments" className="flex-1 m-0">
              <div className="p-4">
                <p className="text-sm text-gray-400">Canvas adjustments and filters</p>
              </div>
            </TabsContent>

            <TabsContent value="libraries" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                <div className="bg-[#2d2d2d] border-b border-[#4a4a4a] px-3 py-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-300">Layers ({layers.length})</span>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

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
                          `}
                          draggable
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
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Handle file upload
          }
        }}
      />
    </div>
  );
}