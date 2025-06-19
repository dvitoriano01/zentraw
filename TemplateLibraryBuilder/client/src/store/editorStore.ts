import { create } from 'zustand';
import { Canvas, Object as FabricObject, Rect, Circle, Triangle, IText, Line, Point } from 'fabric';
import { CanvasState, CanvasObjectProperties, LayerItem } from '@/types/canvas';

interface EditorState extends CanvasState {
  // Canvas methods
  initCanvas: (canvasElement: HTMLCanvasElement) => void;
  disposeCanvas: () => void;
  
  // Object management
  setSelectedObject: (object: FabricObject | null) => void;
  updateObjectProperties: (properties: Partial<CanvasObjectProperties>) => void;
  deleteSelectedObject: () => void;
  
  // History management
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Zoom and pan
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  
  // Layers
  layers: LayerItem[];
  setLayers: (layers: LayerItem[]) => void;
  addLayer: (layer: LayerItem) => void;
  removeLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;
  
  // Tools
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  
  // Document
  setDimensions: (width: number, height: number) => void;
  setModified: (modified: boolean) => void;
  
  // Layer management
  updateLayers: () => void;
  reorderLayers: (sourceIndex: number, destinationIndex: number) => void;
  
  // Grid system
  gridEnabled: boolean;
  gridVisible: boolean;
  gridSize: number;
  snapToGrid: boolean;
  setGridEnabled: (enabled: boolean) => void;
  setGridVisible: (visible: boolean) => void;
  setGridSize: (size: number) => void;
  setSnapToGrid: (snap: boolean) => void;
  drawGrid: () => void;
  snapToGridPosition: (value: number) => number;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  selectedObject: null,
  history: [],
  historyIndex: -1,
  zoom: 0.25,
  dimensions: { width: 800, height: 600 },
  isModified: false,
  layers: [],
  selectedTool: 'select',
  
  // Grid system initial state
  gridEnabled: true,
  gridVisible: true,
  gridSize: 20,
  snapToGrid: false,

  initCanvas: (canvasElement: HTMLCanvasElement) => {
    const canvas = new Canvas(canvasElement, {
      width: get().dimensions.width,
      height: get().dimensions.height,
      backgroundColor: '#ffffff',
      allowTouchScrolling: false,
    });

    // Set initial zoom to 25% and center the canvas
    const initialZoom = 0.25;
    canvas.setZoom(initialZoom);
    set({ zoom: initialZoom });

    // Center the canvas
    const container = canvasElement.parentElement;
    if (container) {
      const panX = (container.clientWidth - get().dimensions.width * initialZoom) / 2;
      const panY = (container.clientHeight - get().dimensions.height * initialZoom) / 2;
      canvas.absolutePan(new Point(panX, panY));
    }

    canvas.on('selection:created', (e: any) => {
      get().setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e: any) => {
      get().setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      get().setSelectedObject(null);
    });

    canvas.on('object:modified', () => {
      get().saveState();
      get().setModified(true);
      get().updateLayers();
    });

    canvas.on('path:created', () => {
      get().saveState();
      get().setModified(true);
      get().updateLayers();
    });

    canvas.on('object:added', () => {
      get().updateLayers();
    });

    canvas.on('object:removed', () => {
      get().updateLayers();
    });

    // Add snap-to-grid functionality
    canvas.on('object:moving', (e: any) => {
      const { snapToGrid, snapToGridPosition } = get();
      if (snapToGrid && e.target) {
        const obj = e.target;
        obj.set({
          left: snapToGridPosition(obj.left!),
          top: snapToGridPosition(obj.top!)
        });
      }
    });

    set({ canvas });
    get().saveState();
    get().drawGrid();
  },

  disposeCanvas: () => {
    const { canvas } = get();
    if (canvas) {
      canvas.dispose();
      set({ canvas: null, selectedObject: null });
    }
  },

  setSelectedObject: (object) => {
    set({ selectedObject: object });
  },

  updateObjectProperties: (properties) => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    Object.entries(properties).forEach(([key, value]) => {
      selectedObject.set(key, value);
    });

    canvas.renderAll();
    get().saveState();
    get().setModified(true);
  },

  deleteSelectedObject: () => {
    const { canvas, selectedObject } = get();
    if (!canvas || !selectedObject) return;

    canvas.remove(selectedObject);
    set({ selectedObject: null });
    get().saveState();
    get().setModified(true);
  },

  saveState: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas) return;

    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      state,
      timestamp: Date.now(),
    });

    set({
      history: newHistory.slice(-50), // Keep last 50 states
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state.state).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex, selectedObject: null });
    });
  },

  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const state = history[newIndex];
    
    canvas.loadFromJSON(state.state).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex, selectedObject: null });
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  setZoom: (zoom) => {
    const { canvas } = get();
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.renderAll();
    set({ zoom });
  },

  zoomIn: () => {
    const { zoom } = get();
    const newZoom = Math.min(zoom * 1.2, 5);
    get().setZoom(newZoom);
  },

  zoomOut: () => {
    const { zoom } = get();
    const newZoom = Math.max(zoom / 1.2, 0.1);
    get().setZoom(newZoom);
  },

  fitToScreen: () => {
    const { canvas } = get();
    if (!canvas) return;

    const container = canvas.getElement().parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth - 32;
    const containerHeight = container.clientHeight - 32;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);

    get().setZoom(scale);
  },

  setLayers: (layers) => set({ layers }),

  addLayer: (layer) => {
    const { layers } = get();
    set({ layers: [...layers, layer] });
  },

  removeLayer: (layerId) => {
    const { layers } = get();
    set({ layers: layers.filter(layer => layer.id !== layerId) });
  },

  toggleLayerVisibility: (layerId) => {
    const { layers, canvas } = get();
    if (!canvas) return;

    const updatedLayers = layers.map(layer => {
      if (layer.id === layerId) {
        const visible = !layer.visible;
        layer.object.set('visible', visible);
        return { ...layer, visible };
      }
      return layer;
    });

    set({ layers: updatedLayers });
    canvas.renderAll();
  },

  toggleLayerLock: (layerId) => {
    const { layers } = get();
    const updatedLayers = layers.map(layer => {
      if (layer.id === layerId) {
        const locked = !layer.locked;
        layer.object.set('selectable', !locked);
        layer.object.set('evented', !locked);
        return { ...layer, locked };
      }
      return layer;
    });

    set({ layers: updatedLayers });
  },

  setSelectedTool: (tool) => set({ selectedTool: tool }),

  setDimensions: (width, height) => {
    const { canvas } = get();
    if (canvas) {
      canvas.setDimensions({ width, height });
    }
    set({ dimensions: { width, height } });
  },

  setModified: (modified) => set({ isModified: modified }),

  updateLayers: () => {
    const { canvas } = get();
    if (!canvas) return;

    const objects = canvas.getObjects();
    // Filter out grid lines from layers
    const filteredObjects = objects.filter(obj => (obj as any).name !== 'grid-line');
    
    const layers: LayerItem[] = filteredObjects.map((obj, index) => {
      let type: LayerItem['type'] = 'shape';
      let name = 'Layer';

      if (obj.type === 'i-text' || obj.type === 'text') {
        type = 'text';
        name = (obj as any).text || 'Text';
      } else if (obj.type === 'image') {
        type = 'image';
        name = 'Image';
      } else if (obj.type === 'rect') {
        name = 'Rectangle';
      } else if (obj.type === 'circle') {
        name = 'Circle';
      } else if (obj.type === 'triangle') {
        name = 'Triangle';
      }

      return {
        id: `layer-${obj.uid || index}`,
        name: `${name} ${index + 1}`,
        type,
        visible: obj.visible !== false,
        locked: !obj.selectable,
        object: obj as FabricObject,
      };
    });

    set({ layers });
  },

  reorderLayers: (sourceIndex: number, destinationIndex: number) => {
    const { canvas, layers } = get();
    if (!canvas) return;

    // Reorder layers array
    const newLayers = Array.from(layers);
    const [removed] = newLayers.splice(sourceIndex, 1);
    newLayers.splice(destinationIndex, 0, removed);

    // Reorder canvas objects to match new layer order
    const objects = canvas.getObjects();
    const [removedObject] = objects.splice(sourceIndex, 1);
    objects.splice(destinationIndex, 0, removedObject);

    // Clear canvas and re-add objects in new order
    canvas.clear();
    objects.forEach(obj => canvas.add(obj));

    set({ layers: newLayers });
    canvas.renderAll();
  },

  // Grid system functions
  setGridEnabled: (enabled) => {
    set({ gridEnabled: enabled });
    if (enabled) {
      get().drawGrid();
    } else {
      get().setGridVisible(false);
    }
  },

  setGridVisible: (visible) => {
    set({ gridVisible: visible });
    get().drawGrid();
  },

  setGridSize: (size) => {
    set({ gridSize: size });
    if (get().gridVisible) {
      get().drawGrid();
    }
  },

  setSnapToGrid: (snap) => {
    set({ snapToGrid: snap });
  },

  snapToGridPosition: (value) => {
    const { gridSize } = get();
    return Math.round(value / gridSize) * gridSize;
  },

  drawGrid: () => {
    const { canvas, gridVisible, gridSize, dimensions } = get();
    if (!canvas) return;

    // Remove existing grid lines
    const objects = canvas.getObjects();
    const gridObjects = objects.filter(obj => (obj as any).name === 'grid-line');
    gridObjects.forEach(obj => canvas.remove(obj));

    if (!gridVisible) {
      canvas.renderAll();
      return;
    }

    // Draw vertical lines
    for (let i = 0; i <= dimensions.width; i += gridSize) {
      const line = new Line([i, 0, i, dimensions.height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).name = 'grid-line';
      (line as any).excludeFromExport = true;
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Draw horizontal lines
    for (let i = 0; i <= dimensions.height; i += gridSize) {
      const line = new Line([0, i, dimensions.width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).name = 'grid-line';
      (line as any).excludeFromExport = true;
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    canvas.renderAll();
  },
}));
