import { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, FabricObject, FabricImage, IText, Rect, Circle, Triangle } from 'fabric';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Download, Upload, Type, Square, Circle as CircleIcon, 
  Triangle as TriangleIcon, Image as ImageIcon, Layers, Settings,
  RotateCw, FlipHorizontal, FlipVertical, Copy, Trash2,
  ZoomIn, ZoomOut, RotateCcw, Grid, Save, FolderOpen,
  Palette, Filter, Wand2
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { canvasService } from '@/services/canvasService';
import { Slider } from '@/components/ui/slider';
import { ParameterInput } from '@/components/editor/ParameterInput';
import { VisualEffectsPanel } from '@/components/editor/VisualEffectsPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';

interface Layer {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export default function PhotoEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [gridSpacing, setGridSpacing] = useState(20);
  
  // Visual adjustment controls
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(100);

  // Modal states
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showLayoutsModal, setShowLayoutsModal] = useState(false);
  const [showFormatsModal, setShowFormatsModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showTextEffectsModal, setShowTextEffectsModal] = useState(false);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: 'transparent',
    });

    fabricCanvasRef.current = canvas;

    // Snap to grid functionality
    canvas.on('object:moving', (e) => {
      if (snapToGrid && e.target) {
        const obj = e.target;
        obj.set({
          left: Math.round((obj.left || 0) / gridSpacing) * gridSpacing,
          top: Math.round((obj.top || 0) / gridSpacing) * gridSpacing
        });
      }
    });

    const updateLayersList = () => {
      const objects = canvas.getObjects();
      const newLayers: Layer[] = objects.map((obj, index) => ({
        id: obj.get('id') || `layer-${index}`,
        name: obj.get('name') || `${obj.type} ${index + 1}`,
        type: obj.type || 'object',
        visible: obj.visible !== false,
        locked: obj.selectable === false
      }));
      setLayers(newLayers);
    };

    const saveState = () => {
      const state = canvas.toJSON();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(state));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
        const layerId = e.selected[0].get('id') || `layer-${canvas.getObjects().indexOf(e.selected[0])}`;
        const layer = layers.find(l => l.id === layerId);
        if (layer) {
          setSelectedLayer(layer);
        }
      }
      updateLayersList();
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedObject(e.selected[0]);
        const layerId = e.selected[0].get('id') || `layer-${canvas.getObjects().indexOf(e.selected[0])}`;
        const layer = layers.find(l => l.id === layerId);
        if (layer) {
          setSelectedLayer(layer);
        }
      }
      updateLayersList();
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      setSelectedLayer(null);
      updateLayersList();
    });

    // Prevent showing properties when clicking workspace
    canvas.on('mouse:down', (e) => {
      if (!e.target) {
        setSelectedObject(null);
        setSelectedLayer(null);
        canvas.discardActiveObject();
        canvas.renderAll();
      }
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
    saveState();

    return canvas;
  }, [snapToGrid, gridSpacing, history, historyIndex, layers]);

  useEffect(() => {
    const canvas = initializeCanvas();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'c':
            e.preventDefault();
            copy();
            break;
          case 'v':
            e.preventDefault();
            paste();
            break;
          case 'a':
            e.preventDefault();
            canvas?.discardActiveObject();
            const selection = new fabric.ActiveSelection(canvas?.getObjects(), { canvas });
            canvas?.setActiveObject(selection);
            canvas?.renderAll();
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas?.dispose();
    };
  }, []);

  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const state = fabricCanvasRef.current.toJSON();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(state));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      fabricCanvasRef.current?.loadFromJSON(JSON.parse(prevState), () => {
        fabricCanvasRef.current?.renderAll();
        setHistoryIndex(historyIndex - 1);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      fabricCanvasRef.current?.loadFromJSON(JSON.parse(nextState), () => {
        fabricCanvasRef.current?.renderAll();
        setHistoryIndex(historyIndex + 1);
      });
    }
  };

  const copy = () => {
    if (selectedObject) {
      selectedObject.clone().then((cloned: FabricObject) => {
        localStorage.setItem('clipboard', JSON.stringify(cloned.toObject()));
      });
    }
  };

  const paste = () => {
    const clipboardData = localStorage.getItem('clipboard');
    if (clipboardData && fabricCanvasRef.current) {
      const objectData = JSON.parse(clipboardData);
      fabric.util.enlivenObjects([objectData], (objects: FabricObject[]) => {
        objects.forEach((obj) => {
          obj.set({
            left: (obj.left || 0) + 20,
            top: (obj.top || 0) + 20
          });
          fabricCanvasRef.current?.add(obj);
        });
        fabricCanvasRef.current?.renderAll();
        saveState();
      });
    }
  };

  const deleteSelected = () => {
    if (selectedObject && fabricCanvasRef.current) {
      fabricCanvasRef.current.remove(selectedObject);
      setSelectedObject(null);
      saveState();
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    
    const text = canvasService.createText(fabricCanvasRef.current, 'Add your text', {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: '#000000'
    });
    
    saveState();
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;
    
    canvasService.createRectangle(fabricCanvasRef.current, {
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: '#3b82f6'
    });
    
    saveState();
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;
    
    canvasService.createCircle(fabricCanvasRef.current, {
      left: 100,
      top: 100,
      radius: 50,
      fill: '#ef4444'
    });
    
    saveState();
  };

  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;
    
    canvasService.createTriangle(fabricCanvasRef.current, {
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#22c55e'
    });
    
    saveState();
  };

  const handleDragDropFile = useCallback((file: File) => {
    if (file.type.startsWith('image/') && fabricCanvasRef.current) {
      canvasService.addImage(fabricCanvasRef.current, file).then(() => {
        saveState();
      });
    }
  }, [saveState]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleDragDropFile(file);
    }
  };

  const exportCanvas = async (format: 'png' | 'jpeg' | 'svg' = 'png', quality: string = 'high') => {
    if (!fabricCanvasRef.current) return;
    
    try {
      const dataUrl = await canvasService.exportCanvas(fabricCanvasRef.current, {
        format,
        quality,
        multiplier: quality === 'high' ? 2 : 1
      });
      
      canvasService.downloadImage(dataUrl, `design.${format}`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const duplicateObject = () => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.clone().then((cloned: FabricObject) => {
        cloned.set({
          left: (cloned.left || 0) + 20,
          top: (cloned.top || 0) + 20
        });
        fabricCanvasRef.current?.add(cloned);
        fabricCanvasRef.current?.setActiveObject(cloned);
        fabricCanvasRef.current?.renderAll();
        saveState();
      });
    }
  };

  const flipHorizontal = () => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.set('flipX', !selectedObject.flipX);
      fabricCanvasRef.current.renderAll();
      saveState();
    }
  };

  const flipVertical = () => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.set('flipY', !selectedObject.flipY);
      fabricCanvasRef.current.renderAll();
      saveState();
    }
  };

  const rotateObject = (angle: number) => {
    if (selectedObject && fabricCanvasRef.current) {
      selectedObject.rotate((selectedObject.angle || 0) + angle);
      fabricCanvasRef.current.renderAll();
      saveState();
    }
  };

  const reorderLayers = (result: DropResult) => {
    if (!result.destination || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const [removed] = objects.splice(result.source.index, 1);
    objects.splice(result.destination.index, 0, removed);

    canvas.clear();
    objects.forEach(obj => canvas.add(obj));
    canvas.renderAll();
    saveState();
  };

  const toggleLayerVisibility = (layerId: string) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(l => l.id === layerId);
    
    if (layerIndex !== -1 && objects[layerIndex]) {
      const obj = objects[layerIndex];
      obj.set('visible', !obj.visible);
      canvas.renderAll();
      saveState();
    }
  };

  const selectLayer = (layer: Layer) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const layerIndex = layers.findIndex(l => l.id === layer.id);
    
    if (layerIndex !== -1 && objects[layerIndex]) {
      canvas.setActiveObject(objects[layerIndex]);
      canvas.renderAll();
      setSelectedLayer(layer);
      setSelectedObject(objects[layerIndex]);
    }
  };

  // Apply visual adjustments
  useEffect(() => {
    if (selectedObject && fabricCanvasRef.current) {
      const filters = [];
      
      if (brightness !== 0) {
        filters.push(`brightness(${100 + brightness}%)`);
      }
      if (contrast !== 0) {
        filters.push(`contrast(${100 + contrast}%)`);
      }
      if (saturation !== 0) {
        filters.push(`saturate(${100 + saturation}%)`);
      }
      if (hue !== 0) {
        filters.push(`hue-rotate(${hue}deg)`);
      }
      if (blur > 0) {
        filters.push(`blur(${blur}px)`);
      }
      
      selectedObject.set('cssFilter', filters.join(' '));
      selectedObject.set('opacity', opacity / 100);
      fabricCanvasRef.current.renderAll();
    }
  }, [brightness, contrast, saturation, hue, blur, opacity, selectedObject]);

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Left Toolbar */}
      <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" onClick={addText} title="Add Text">
          <Type className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addRectangle} title="Add Rectangle">
          <Square className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addCircle} title="Add Circle">
          <CircleIcon className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={addTriangle} title="Add Triangle">
          <TriangleIcon className="w-5 h-5" />
        </Button>
        <label className="cursor-pointer">
          <Button variant="ghost" size="icon" asChild title="Upload Image">
            <span>
              <ImageIcon className="w-5 h-5" />
            </span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <div className="border-t border-gray-600 pt-4">
          <Button variant="ghost" size="icon" onClick={() => setShowGrid(!showGrid)} title="Toggle Grid">
            <Grid className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <RotateCw className="w-4 h-4 mr-2" />
              Redo
            </Button>
            
            <div className="border-l border-gray-600 pl-4 ml-4">
              <Button variant="ghost" size="sm" onClick={() => setShowTemplatesModal(true)}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Templates
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowLayoutsModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Layouts
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFormatsModal(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Format
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedObject && (
              <>
                <Button variant="ghost" size="sm" onClick={duplicateObject}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="ghost" size="sm" onClick={flipHorizontal}>
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Flip H
                </Button>
                <Button variant="ghost" size="sm" onClick={flipVertical}>
                  <FlipVertical className="w-4 h-4 mr-2" />
                  Flip V
                </Button>
                <Button variant="ghost" size="sm" onClick={() => rotateObject(90)}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate
                </Button>
                <Button variant="ghost" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
            
            <div className="border-l border-gray-600 pl-4 ml-4">
              <Button variant="ghost" size="sm" onClick={() => exportCanvas('png', 'high')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Canvas Area */}
          <div className="flex-1 bg-gray-600 overflow-hidden">
            <div 
              className="w-full h-full bg-gray-600"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%), 
                  linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #ccc 75%), 
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Fixed workspace grid */}
              {showGrid && (
                <div 
                  className="workspace-grid" 
                  style={{ '--grid-size': `${gridSpacing}px` } as React.CSSProperties}
                />
              )}
              <div className="flex items-center justify-center min-h-full p-8">
                <div className="relative">
                  <div className="transparency-checkerboard">
                    <canvas
                      ref={canvasRef}
                      className="border border-gray-600 shadow-2xl bg-transparent"
                    />
                  </div>
                  {showGrid && (
                    <div 
                      className="canvas-grid-overlay absolute top-0 left-0"
                      style={{
                        width: '100%',
                        height: '100%',
                        '--grid-size': `${gridSpacing}px`
                      } as React.CSSProperties}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <Tabs defaultValue="properties" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                <TabsTrigger value="properties" className="data-[state=active]:bg-gray-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Properties
                </TabsTrigger>
                <TabsTrigger value="layers" className="data-[state=active]:bg-gray-600">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers
                </TabsTrigger>
                <TabsTrigger value="adjustments" className="data-[state=active]:bg-gray-600">
                  <Palette className="w-4 h-4 mr-2" />
                  Effects
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1 m-0">
                <div className="h-full flex flex-col">
                  {selectedObject ? (
                    <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-300">Transform</h3>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">X</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.left || 0)}
                              onChange={(e) => {
                                selectedObject.set('left', parseInt(e.target.value));
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Y</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.top || 0)}
                              onChange={(e) => {
                                selectedObject.set('top', parseInt(e.target.value));
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Width</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.getScaledWidth())}
                              onChange={(e) => {
                                const newWidth = parseInt(e.target.value);
                                selectedObject.scaleToWidth(newWidth);
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Height</label>
                            <input
                              type="number"
                              value={Math.round(selectedObject.getScaledHeight())}
                              onChange={(e) => {
                                const newHeight = parseInt(e.target.value);
                                selectedObject.scaleToHeight(newHeight);
                                fabricCanvasRef.current?.renderAll();
                                saveState();
                              }}
                              className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Rotation: {Math.round(selectedObject.angle || 0)}°</label>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={selectedObject.angle || 0}
                            onChange={(e) => {
                              selectedObject.rotate(parseInt(e.target.value));
                              fabricCanvasRef.current?.renderAll();
                              saveState();
                            }}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Opacity: {Math.round((selectedObject.opacity || 1) * 100)}%</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(selectedObject.opacity || 1) * 100}
                            onChange={(e) => {
                              selectedObject.set('opacity', parseInt(e.target.value) / 100);
                              fabricCanvasRef.current?.renderAll();
                              saveState();
                            }}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>

                        {/* Text Properties */}
                        {selectedObject.type === 'i-text' && (
                          <div className="space-y-4 border-t border-gray-600 pt-4">
                            <h3 className="text-sm font-medium text-gray-300">Text Properties</h3>
                            
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Font Size</label>
                              <input
                                type="number"
                                value={(selectedObject as IText).fontSize || 16}
                                onChange={(e) => {
                                  (selectedObject as IText).set('fontSize', parseInt(e.target.value));
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Text Color</label>
                              <input
                                type="color"
                                value={(selectedObject as IText).fill as string || '#000000'}
                                onChange={(e) => {
                                  (selectedObject as IText).set('fill', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-8 border border-gray-600 rounded"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Font Weight</label>
                              <select
                                value={(selectedObject as IText).fontWeight || 'normal'}
                                onChange={(e) => {
                                  (selectedObject as IText).set('fontWeight', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                              >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                                <option value="lighter">Lighter</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Text Align</label>
                              <select
                                value={(selectedObject as IText).textAlign || 'left'}
                                onChange={(e) => {
                                  (selectedObject as IText).set('textAlign', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                              >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                                <option value="justify">Justify</option>
                              </select>
                            </div>

                            {/* Text Effects Panel */}
                            <div className="border-t border-gray-600 pt-4">
                              <TextFXPanel 
                                selectedObject={selectedObject}
                                onApplyEffect={(effect) => {
                                  if (selectedObject) {
                                    // Apply text effect properties
                                    Object.entries(effect.fabricOptions).forEach(([key, value]) => {
                                      if (value !== undefined && value !== null) {
                                        selectedObject.set(key, value);
                                      }
                                    });
                                    fabricCanvasRef.current?.renderAll();
                                    saveState();
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Blend Mode</label>
                          <select
                            value={selectedObject.globalCompositeOperation || 'source-over'}
                            onChange={(e) => {
                              selectedObject.set('globalCompositeOperation', e.target.value);
                              fabricCanvasRef.current?.renderAll();
                              saveState();
                            }}
                            className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                          >
                            <option value="source-over">Normal</option>
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
                                type="number"
                                min="0"
                                value={selectedObject.strokeWidth || 0}
                                onChange={(e) => {
                                  selectedObject.set('strokeWidth', parseInt(e.target.value));
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {/* Grid Controls */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-300">Grid Controls</h3>
                        
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Grid Visibility</label>
                          <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`w-full px-3 py-2 text-xs rounded ${showGrid ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                          >
                            {showGrid ? 'Hide Grid' : 'Show Grid'}
                          </button>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Snap to Grid</label>
                          <button
                            onClick={() => setSnapToGrid(!snapToGrid)}
                            className={`w-full px-3 py-2 text-xs rounded ${snapToGrid ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}
                          >
                            {snapToGrid ? 'Snap Enabled' : 'Snap Disabled'}
                          </button>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Grid Spacing: {gridSpacing}px</label>
                          <input
                            type="range"
                            min="10"
                            max="50"
                            value={gridSpacing}
                            onChange={(e) => setGridSpacing(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>10px</span>
                            <span>50px</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        Select an object to edit its properties
                      </div>
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

                  <ParameterInput
                    label="Contrast"
                    value={contrast}
                    min={-100}
                    max={100}
                    step={1}
                    unit="%"
                    defaultValue={0}
                    onChange={setContrast}
                    onReset={() => setContrast(0)}
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
                    label="Blur"
                    value={blur}
                    min={0}
                    max={20}
                    step={0.1}
                    unit="px"
                    defaultValue={0}
                    onChange={setBlur}
                    onReset={() => setBlur(0)}
                  />

                  <ParameterInput
                    label="Opacity"
                    value={opacity}
                    min={0}
                    max={100}
                    step={1}
                    unit="%"
                    defaultValue={100}
                    onChange={setOpacity}
                    onReset={() => setOpacity(100)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="flex-1 m-0">
              <div className="p-4">
                <DragDropContext onDragEnd={reorderLayers}>
                  <Droppable droppableId="layers">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {layers.slice().reverse().map((layer, index) => (
                          <Draggable key={layer.id} draggableId={layer.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded border transition-colors ${
                                  selectedLayer?.id === layer.id 
                                    ? 'bg-blue-600 border-blue-500' 
                                    : 'bg-gray-700 border-gray-600'
                                } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                onClick={() => selectLayer(layer)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-500 rounded flex-shrink-0"></div>
                                    <span className="text-sm text-white truncate">{layer.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLayerVisibility(layer.id);
                                      }}
                                      className="p-1 h-6 w-6"
                                    >
                                      {layer.visible ? '👁️' : '🚫'}
                                    </Button>
                                  </div>
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
      </div>

      {/* Modals would go here */}
    </div>
  );
}