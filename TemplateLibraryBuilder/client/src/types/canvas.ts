import { Canvas, Object as FabricObject } from 'fabric';

export interface CanvasState {
  canvas: Canvas | null;
  selectedObject: FabricObject | null;
  history: CanvasHistoryItem[];
  historyIndex: number;
  zoom: number;
  dimensions: {
    width: number;
    height: number;
  };
  isModified: boolean;
}

export interface CanvasHistoryItem {
  state: string;
  timestamp: number;
}

export interface CanvasObjectProperties {
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  opacity: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
}

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg';
  quality: 'standard' | 'high' | 'ultra';
  transparent: boolean;
  scale?: number;
}

export interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'background';
  visible: boolean;
  locked: boolean;
  object: FabricObject;
}
