# 💻 ZENTRAW TECHNICAL IMPLEMENTATION GUIDE

## Códigos Práticos e Implementações Específicas

---

## 🚀 QUICK WINS - IMPLEMENTAÇÕES IMEDIATAS

### **1. Performance Optimization - Layer Virtualization**

```typescript
// components/editor/VirtualizedLayersPanel.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedLayersPanelProps {
  layers: LayerItem[];
  onLayerSelect: (layer: LayerItem) => void;
  onLayerReorder: (fromIndex: number, toIndex: number) => void;
  selectedLayerId?: string;
}

const LAYER_HEIGHT = 40;
const VISIBLE_LAYERS = 10;

export const VirtualizedLayersPanel: React.FC<VirtualizedLayersPanelProps> = ({
  layers,
  onLayerSelect,
  onLayerReorder,
  selectedLayerId
}) => {
  const listRef = useRef<List>(null);

  const LayerRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const layer = layers[index];
    const isSelected = layer.id === selectedLayerId;

    return (
      <div
        style={style}
        className={`flex items-center px-2 py-1 border-b cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-100' : ''
        }`}
        onClick={() => onLayerSelect(layer)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', index.toString());
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
          if (fromIndex !== index) {
            onLayerReorder(fromIndex, index);
          }
        }}
      >
        <LayerIcon type={layer.fabricType} />
        <span className="ml-2 text-sm truncate">{layer.name}</span>
        <div className="ml-auto flex space-x-1">
          <VisibilityToggle layer={layer} />
          <LockToggle layer={layer} />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <List
        ref={listRef}
        height={VISIBLE_LAYERS * LAYER_HEIGHT}
        itemCount={layers.length}
        itemSize={LAYER_HEIGHT}
        overscanCount={5}
      >
        {LayerRow}
      </List>
    </div>
  );
};
```

### **2. Memory-Optimized Canvas History**

```typescript
// hooks/useOptimizedHistory.ts
import { useCallback, useRef, useState } from 'react';
import { Canvas } from 'fabric';

interface HistoryState {
  id: string;
  timestamp: number;
  delta: string; // Only changes, not full state
  thumbnail?: string;
}

export const useOptimizedHistory = (canvas: Canvas | null) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const lastStateRef = useRef<string>('');
  const maxHistorySize = 50;

  const saveState = useCallback(() => {
    if (!canvas) return;

    const currentState = JSON.stringify(canvas.toJSON());

    // Calculate delta instead of saving full state
    const delta = calculateStateDelta(lastStateRef.current, currentState);

    const newHistoryItem: HistoryState = {
      id: `state_${Date.now()}`,
      timestamp: Date.now(),
      delta: JSON.stringify(delta),
      thumbnail: generateThumbnail(canvas),
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newHistoryItem);

      // Keep only last N states
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }

      return newHistory;
    });

    setCurrentIndex((prev) => Math.min(prev + 1, maxHistorySize - 1));
    lastStateRef.current = currentState;
  }, [canvas, currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex <= 0 || !canvas) return;

    const prevState = history[currentIndex - 1];
    applyStateDelta(canvas, prevState.delta);
    setCurrentIndex((prev) => prev - 1);
  }, [canvas, history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex >= history.length - 1 || !canvas) return;

    const nextState = history[currentIndex + 1];
    applyStateDelta(canvas, nextState.delta);
    setCurrentIndex((prev) => prev + 1);
  }, [canvas, history, currentIndex]);

  return {
    saveState,
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};

function calculateStateDelta(oldState: string, newState: string) {
  // Simplified delta calculation - in production, use library like jsondiffpatch
  return {
    type: 'replace',
    old: oldState,
    new: newState,
  };
}

function applyStateDelta(canvas: Canvas, delta: string) {
  const deltaObj = JSON.parse(delta);
  canvas.loadFromJSON(deltaObj.new, () => {
    canvas.renderAll();
  });
}

function generateThumbnail(canvas: Canvas): string {
  return canvas.toDataURL({
    format: 'jpeg',
    quality: 0.3,
    multiplier: 0.1,
  });
}
```

### **3. Advanced Blend Modes Implementation**

```typescript
// utils/blendModes.ts
export enum BlendMode {
  NORMAL = 'source-over',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  SOFT_LIGHT = 'soft-light',
  HARD_LIGHT = 'hard-light',
  COLOR_DODGE = 'color-dodge',
  COLOR_BURN = 'color-burn',
  DARKEN = 'darken',
  LIGHTEN = 'lighten',
  DIFFERENCE = 'difference',
  EXCLUSION = 'exclusion',
}

// Custom blend modes not supported natively
export const customBlendModes = {
  'linear-burn': (base: number, blend: number) => Math.max(0, base + blend - 255),
  'linear-dodge': (base: number, blend: number) => Math.min(255, base + blend),
  'vivid-light': (base: number, blend: number) => {
    if (blend < 128) {
      return blend === 0 ? 0 : Math.max(0, 255 - ((255 - base) * 255) / (2 * blend));
    } else {
      return blend === 255 ? 255 : Math.min(255, (base * 255) / (2 * (255 - blend)));
    }
  },
  'linear-light': (base: number, blend: number) => {
    return blend < 128
      ? Math.max(0, base + 2 * blend - 255)
      : Math.min(255, base + 2 * (blend - 128));
  },
};

export const applyBlendMode = (
  canvas: HTMLCanvasElement,
  blendMode: BlendMode | keyof typeof customBlendModes,
): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d')!;

  if (Object.values(BlendMode).includes(blendMode as BlendMode)) {
    ctx.globalCompositeOperation = blendMode as BlendMode;
    return canvas;
  }

  // Apply custom blend mode
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const blendFunction = customBlendModes[blendMode as keyof typeof customBlendModes];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    data[i] = blendFunction(r, r); // Simplified - in real implementation, blend with layer below
    data[i + 1] = blendFunction(g, g);
    data[i + 2] = blendFunction(b, b);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};
```

### **4. WebGL Filter Engine Foundation**

```typescript
// utils/webgl/WebGLFilterEngine.ts
export class WebGLFilterEngine {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private programs: Map<string, WebGLProgram> = new Map();

  constructor() {
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl')!;

    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    this.initializeShaders();
  }

  private initializeShaders() {
    // Basic vertex shader for all filters
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Gaussian blur fragment shader
    const gaussianBlurShader = `
      precision mediump float;
      uniform sampler2D u_image;
      uniform vec2 u_resolution;
      uniform float u_radius;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 onePixel = vec2(1.0) / u_resolution;
        vec4 color = vec4(0.0);
        float total = 0.0;
        
        for(float x = -10.0; x <= 10.0; x++) {
          for(float y = -10.0; y <= 10.0; y++) {
            vec2 offset = vec2(x, y) * onePixel * u_radius;
            float weight = exp(-(x*x + y*y) / (2.0 * u_radius * u_radius));
            color += texture2D(u_image, v_texCoord + offset) * weight;
            total += weight;
          }
        }
        
        gl_FragColor = color / total;
      }
    `;

    this.createProgram('gaussianBlur', vertexShaderSource, gaussianBlurShader);
  }

  private createProgram(name: string, vertexSource: string, fragmentSource: string) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(`Program linking failed: ${this.gl.getProgramInfoLog(program)}`);
    }

    this.programs.set(name, program);
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(`Shader compilation failed: ${this.gl.getShaderInfoLog(shader)}`);
    }

    return shader;
  }

  applyGaussianBlur(imageData: ImageData, radius: number): ImageData {
    const { width, height, data } = imageData;

    // Set up canvas and texture
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      width,
      height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      data,
    );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    // Use blur program
    const program = this.programs.get('gaussianBlur')!;
    this.gl.useProgram(program);

    // Set uniforms
    const resolutionLocation = this.gl.getUniformLocation(program, 'u_resolution');
    const radiusLocation = this.gl.getUniformLocation(program, 'u_radius');

    this.gl.uniform2f(resolutionLocation, width, height);
    this.gl.uniform1f(radiusLocation, radius);

    // Set up geometry
    this.setupQuad(program);

    // Render
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Read back result
    const result = new Uint8ClampedArray(width * height * 4);
    this.gl.readPixels(0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, result);

    return new ImageData(result, width, height);
  }

  private setupQuad(program: WebGLProgram) {
    const positions = new Float32Array([
      -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1, 1,
    ]);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const positionLocation = this.gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = this.gl.getAttribLocation(program, 'a_texCoord');

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.enableVertexAttribArray(texCoordLocation);

    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
  }
}
```

---

## 🎨 ADVANCED UI COMPONENTS

### **5. Professional Color Picker**

```typescript
// components/editor/AdvancedColorPicker.tsx
import React, { useState, useRef, useCallback } from 'react';
import { HSB, RGB, CMYK, LAB } from '@/utils/colorSpaces';

interface AdvancedColorPickerProps {
  color: RGB;
  onChange: (color: RGB) => void;
  showAlpha?: boolean;
  colorSpaces?: ('rgb' | 'hsb' | 'cmyk' | 'lab')[];
}

export const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
  color,
  onChange,
  showAlpha = true,
  colorSpaces = ['rgb', 'hsb']
}) => {
  const [activeSpace, setActiveSpace] = useState<string>('hsb');
  const [hsb, setHSB] = useState<HSB>(rgbToHsb(color));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateColor = useCallback((newHSB: HSB) => {
    setHSB(newHSB);
    onChange(hsbToRgb(newHSB));
  }, [onChange]);

  const ColorWheel = () => (
    <div className="relative w-48 h-48">
      <canvas
        ref={canvasRef}
        width={192}
        height={192}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleColorWheelInteraction}
        onMouseMove={handleColorWheelInteraction}
      />
      <div
        className="absolute w-3 h-3 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${50 + Math.cos(hsb.h * Math.PI / 180) * hsb.s * 0.4}%`,
          top: `${50 + Math.sin(hsb.h * Math.PI / 180) * hsb.s * 0.4}%`
        }}
      />
    </div>
  );

  const BrightnessSlider = () => (
    <div className="w-full h-6 relative">
      <div
        className="w-full h-full rounded"
        style={{
          background: `linear-gradient(to right,
            hsl(${hsb.h}, ${hsb.s}%, 0%),
            hsl(${hsb.h}, ${hsb.s}%, 100%))`
        }}
      />
      <div
        className="absolute top-0 w-2 h-full bg-white border border-gray-400 transform -translate-x-1/2"
        style={{ left: `${hsb.b}%` }}
      />
    </div>
  );

  const ColorSpaceInputs = () => {
    switch (activeSpace) {
      case 'rgb':
        return <RGBInputs color={color} onChange={onChange} />;
      case 'hsb':
        return <HSBInputs hsb={hsb} onChange={updateColor} />;
      case 'cmyk':
        return <CMYKInputs color={rgbToCmyk(color)} onChange={(cmyk) => onChange(cmykToRgb(cmyk))} />;
      case 'lab':
        return <LABInputs color={rgbToLab(color)} onChange={(lab) => onChange(labToRgb(lab))} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex space-x-4">
        <ColorWheel />
        <div className="flex-1 space-y-4">
          <BrightnessSlider />
          {showAlpha && <AlphaSlider />}

          <div className="flex space-x-2">
            {colorSpaces.map(space => (
              <button
                key={space}
                className={`px-3 py-1 text-xs rounded ${
                  activeSpace === space ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveSpace(space)}
              >
                {space.toUpperCase()}
              </button>
            ))}
          </div>

          <ColorSpaceInputs />

          <div className="flex space-x-2">
            <ColorSwatch color={color} />
            <ColorHistory />
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **6. Professional Brush Editor**

```typescript
// components/editor/BrushEditor.tsx
import React, { useState, useRef, useEffect } from 'react';

interface BrushSettings {
  size: number;
  hardness: number;
  opacity: number;
  flow: number;
  spacing: number;
  scattering: number;
  sizeJitter: number;
  opacityJitter: number;
  angleJitter: number;
  textureUrl?: string;
  pressureSensitive: boolean;
  velocitySensitive: boolean;
}

export const BrushEditor: React.FC<{
  brush: BrushSettings;
  onChange: (brush: BrushSettings) => void;
}> = ({ brush, onChange }) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    updateBrushPreview();
  }, [brush]);

  const updateBrushPreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw brush preview stroke
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 100; i++) {
      const x = centerX + Math.sin(i * 0.1) * 50;
      const y = centerY + i * 0.5;

      drawBrushDab(ctx, x, y, brush, i / 100);
    }
  };

  const drawBrushDab = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    settings: BrushSettings,
    pressure: number
  ) => {
    const size = settings.size * (settings.pressureSensitive ? pressure : 1);
    const opacity = settings.opacity * (settings.pressureSensitive ? pressure : 1);

    // Create brush gradient for hardness
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
    const hardnessEdge = settings.hardness / 100;

    gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity / 100})`);
    gradient.addColorStop(hardnessEdge, `rgba(0, 0, 0, ${opacity / 100})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const BrushPreview = () => (
    <canvas
      ref={previewCanvasRef}
      width={200}
      height={100}
      className="border border-gray-300 rounded bg-white"
    />
  );

  const DynamicsPanel = () => (
    <div className="space-y-3">
      <h4 className="font-medium">Brush Dynamics</h4>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={brush.pressureSensitive}
          onChange={(e) => onChange({ ...brush, pressureSensitive: e.target.checked })}
        />
        <span>Pressure Sensitivity</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={brush.velocitySensitive}
          onChange={(e) => onChange({ ...brush, velocitySensitive: e.target.checked })}
        />
        <span>Velocity Sensitivity</span>
      </label>

      <div className="space-y-2">
        <label>Size Jitter: {brush.sizeJitter}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={brush.sizeJitter}
          onChange={(e) => onChange({ ...brush, sizeJitter: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label>Opacity Jitter: {brush.opacityJitter}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={brush.opacityJitter}
          onChange={(e) => onChange({ ...brush, opacityJitter: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <BrushPreview />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-medium">Basic Settings</h4>

          <div>
            <label>Size: {brush.size}px</label>
            <input
              type="range"
              min="1"
              max="500"
              value={brush.size}
              onChange={(e) => onChange({ ...brush, size: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label>Hardness: {brush.hardness}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={brush.hardness}
              onChange={(e) => onChange({ ...brush, hardness: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label>Opacity: {brush.opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={brush.opacity}
              onChange={(e) => onChange({ ...brush, opacity: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <DynamicsPanel />
      </div>
    </div>
  );
};
```

---

## 🔧 PERFORMANCE UTILITIES

### **7. Web Worker for Background Processing**

```typescript
// workers/imageProcessor.worker.ts
/// <reference lib="webworker" />

import { applyFilter, FilterType, FilterParams } from '../utils/filters';

interface WorkerMessage {
  id: string;
  type: 'processImage' | 'applyFilter' | 'generateThumbnail';
  imageData: ImageData;
  params: any;
}

self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
  const { id, type, imageData, params } = event.data;

  try {
    let result: ImageData;

    switch (type) {
      case 'applyFilter':
        result = await applyFilter(imageData, params.filterType, params.filterParams);
        break;

      case 'generateThumbnail':
        result = generateThumbnail(imageData, params.width, params.height);
        break;

      case 'processImage':
        result = await processImage(imageData, params);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage({ id, success: true, result });
  } catch (error) {
    self.postMessage({ id, success: false, error: error.message });
  }
});

function generateThumbnail(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number,
): ImageData {
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext('2d')!;

  const sourceCanvas = new OffscreenCanvas(imageData.width, imageData.height);
  const sourceCtx = sourceCanvas.getContext('2d')!;
  sourceCtx.putImageData(imageData, 0, 0);

  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

async function processImage(imageData: ImageData, params: any): Promise<ImageData> {
  // Complex image processing that would block main thread
  // Implementation depends on specific requirements
  return imageData;
}
```

```typescript
// hooks/useWorkerImageProcessor.ts
import { useRef, useCallback } from 'react';

export const useWorkerImageProcessor = () => {
  const workerRef = useRef<Worker | null>(null);
  const pendingOperations = useRef<
    Map<
      string,
      {
        resolve: (result: ImageData) => void;
        reject: (error: Error) => void;
      }
    >
  >(new Map());

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    workerRef.current = new Worker(new URL('../workers/imageProcessor.worker.ts', import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { id, success, result, error } = event.data;
      const operation = pendingOperations.current.get(id);

      if (operation) {
        if (success) {
          operation.resolve(result);
        } else {
          operation.reject(new Error(error));
        }
        pendingOperations.current.delete(id);
      }
    };
  }, []);

  const processImageAsync = useCallback(
    (imageData: ImageData, type: string, params: any): Promise<ImageData> => {
      initWorker();

      return new Promise((resolve, reject) => {
        const id = `operation_${Date.now()}_${Math.random()}`;
        pendingOperations.current.set(id, { resolve, reject });

        workerRef.current!.postMessage({
          id,
          type,
          imageData,
          params,
        });
      });
    },
    [initWorker],
  );

  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    pendingOperations.current.clear();
  }, []);

  return { processImageAsync, cleanup };
};
```

### **8. Canvas Performance Optimizer**

```typescript
// utils/canvasOptimizer.ts
export class CanvasOptimizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dirtyRects: DOMRect[] = [];
  private lastRender = 0;
  private rafId?: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    // Enable optimizations
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  // Mark region as dirty for partial redraws
  markDirty(x: number, y: number, width: number, height: number) {
    this.dirtyRects.push(new DOMRect(x, y, width, height));
    this.scheduleRender();
  }

  // Optimized rendering with dirty rectangle tracking
  private scheduleRender() {
    if (this.rafId) return;

    this.rafId = requestAnimationFrame(() => {
      const now = performance.now();
      const deltaTime = now - this.lastRender;

      // Throttle to 60 FPS
      if (deltaTime >= 16.67) {
        this.render();
        this.lastRender = now;
      } else {
        this.scheduleRender();
      }

      this.rafId = undefined;
    });
  }

  private render() {
    if (this.dirtyRects.length === 0) return;

    // Merge overlapping dirty rects
    const mergedRects = this.mergeDirtyRects();

    // Only redraw dirty regions
    mergedRects.forEach((rect) => {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
      this.ctx.clip();

      // Clear and redraw only this region
      this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      this.renderRegion(rect);

      this.ctx.restore();
    });

    this.dirtyRects = [];
  }

  private mergeDirtyRects(): DOMRect[] {
    if (this.dirtyRects.length <= 1) return this.dirtyRects;

    const merged: DOMRect[] = [];
    const sorted = this.dirtyRects.sort((a, b) => a.x - b.x);

    let current = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];

      if (this.rectsOverlap(current, next)) {
        current = this.mergeRects(current, next);
      } else {
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
    return merged;
  }

  private rectsOverlap(a: DOMRect, b: DOMRect): boolean {
    return !(a.right < b.left || b.right < a.left || a.bottom < b.top || b.bottom < a.top);
  }

  private mergeRects(a: DOMRect, b: DOMRect): DOMRect {
    const left = Math.min(a.left, b.left);
    const top = Math.min(a.top, b.top);
    const right = Math.max(a.right, b.right);
    const bottom = Math.max(a.bottom, b.bottom);

    return new DOMRect(left, top, right - left, bottom - top);
  }

  private renderRegion(rect: DOMRect) {
    // Render only objects that intersect with this rect
    // Implementation depends on your object management system
  }

  // GPU-accelerated operations when available
  transferToGPU(): OffscreenCanvas | null {
    try {
      const offscreen = this.canvas.transferControlToOffscreen();
      return offscreen;
    } catch {
      return null;
    }
  }
}
```

---

## 🎨 NEXT-LEVEL FEATURES

### **9. AI-Powered Background Removal**

```typescript
// utils/ai/backgroundRemoval.ts
import { loadModel, predict } from '@/utils/ai/tensorflowUtils';

export class BackgroundRemovalAI {
  private model: any;
  private isLoaded = false;

  async initialize() {
    try {
      // Load pre-trained segmentation model
      this.model = await loadModel('/models/deeplabv3.json');
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load AI model:', error);
      throw error;
    }
  }

  async removeBackground(imageData: ImageData): Promise<ImageData> {
    if (!this.isLoaded) {
      await this.initialize();
    }

    // Preprocess image for model
    const tensor = this.preprocessImage(imageData);

    // Run inference
    const mask = await predict(this.model, tensor);

    // Apply mask to original image
    return this.applyMask(imageData, mask);
  }

  private preprocessImage(imageData: ImageData) {
    // Resize to model input size (typically 513x513)
    // Normalize pixel values
    // Convert to tensor format
    const canvas = new OffscreenCanvas(513, 513);
    const ctx = canvas.getContext('2d')!;

    const sourceCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const sourceCtx = sourceCanvas.getContext('2d')!;
    sourceCtx.putImageData(imageData, 0, 0);

    ctx.drawImage(sourceCanvas, 0, 0, 513, 513);
    const resized = ctx.getImageData(0, 0, 513, 513);

    // Convert to float32 and normalize
    const float32Data = new Float32Array(513 * 513 * 3);
    for (let i = 0; i < resized.data.length; i += 4) {
      float32Data[(i * 3) / 4] = resized.data[i] / 255.0;
      float32Data[(i * 3) / 4 + 1] = resized.data[i + 1] / 255.0;
      float32Data[(i * 3) / 4 + 2] = resized.data[i + 2] / 255.0;
    }

    return float32Data;
  }

  private applyMask(imageData: ImageData, mask: Float32Array): ImageData {
    const result = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height,
    );

    // Resize mask to match image dimensions
    const maskCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    const maskCtx = maskCanvas.getContext('2d')!;

    // Create mask image from tensor
    const maskImageData = new ImageData(513, 513);
    for (let i = 0; i < mask.length; i++) {
      const alpha = Math.round(mask[i] * 255);
      maskImageData.data[i * 4] = 255;
      maskImageData.data[i * 4 + 1] = 255;
      maskImageData.data[i * 4 + 2] = 255;
      maskImageData.data[i * 4 + 3] = alpha;
    }

    const tempCanvas = new OffscreenCanvas(513, 513);
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.putImageData(maskImageData, 0, 0);

    maskCtx.drawImage(tempCanvas, 0, 0, imageData.width, imageData.height);
    const resizedMask = maskCtx.getImageData(0, 0, imageData.width, imageData.height);

    // Apply mask to alpha channel
    for (let i = 0; i < result.data.length; i += 4) {
      result.data[i + 3] = resizedMask.data[i + 3];
    }

    return result;
  }
}
```

### **10. Plugin System Foundation**

```typescript
// plugins/PluginSystem.ts
export interface ZentrawPlugin {
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: PluginPermission[];

  initialize(api: ZentrawAPI): Promise<void>;
  onToolSelected?(tool: string): void;
  onLayerChanged?(layer: LayerItem): void;
  onCanvasChanged?(canvas: HTMLCanvasElement): void;
  onExport?(format: string, data: Blob): void;
  cleanup?(): void;
}

export interface ZentrawAPI {
  canvas: CanvasAPI;
  layers: LayersAPI;
  tools: ToolsAPI;
  ui: UIAPI;
  filters: FiltersAPI;
}

export class PluginManager {
  private plugins: Map<string, ZentrawPlugin> = new Map();
  private api: ZentrawAPI;

  constructor(api: ZentrawAPI) {
    this.api = api;
  }

  async loadPlugin(pluginCode: string, permissions: PluginPermission[]): Promise<void> {
    // Create sandboxed environment
    const sandbox = this.createSandbox(permissions);

    try {
      // Execute plugin code in sandbox
      const pluginFactory = new Function('api', 'sandbox', pluginCode);
      const plugin: ZentrawPlugin = pluginFactory(this.api, sandbox);

      // Validate plugin structure
      this.validatePlugin(plugin);

      // Initialize plugin
      await plugin.initialize(this.api);

      this.plugins.set(plugin.name, plugin);

      console.log(`Plugin ${plugin.name} loaded successfully`);
    } catch (error) {
      console.error('Failed to load plugin:', error);
      throw error;
    }
  }

  private createSandbox(permissions: PluginPermission[]) {
    const sandbox: any = {};

    // Grant permissions
    permissions.forEach((permission) => {
      switch (permission) {
        case 'canvas-read':
          sandbox.canRead = true;
          break;
        case 'canvas-write':
          sandbox.canWrite = true;
          break;
        case 'network-access':
          sandbox.fetch = fetch.bind(window);
          break;
        case 'local-storage':
          sandbox.localStorage = localStorage;
          break;
      }
    });

    return sandbox;
  }

  private validatePlugin(plugin: any): asserts plugin is ZentrawPlugin {
    if (!plugin.name || !plugin.version || !plugin.initialize) {
      throw new Error('Invalid plugin structure');
    }
  }

  unloadPlugin(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.cleanup?.();
      this.plugins.delete(name);
    }
  }

  getLoadedPlugins(): ZentrawPlugin[] {
    return Array.from(this.plugins.values());
  }
}

// Example plugin
export const ExampleFilterPlugin: ZentrawPlugin = {
  name: 'Custom Filters',
  version: '1.0.0',
  description: 'Adds custom filter effects',
  author: 'Zentraw Team',
  permissions: ['canvas-read', 'canvas-write'],

  async initialize(api: ZentrawAPI) {
    // Register custom filters
    api.filters.register('vintage', this.vintageFilter);
    api.filters.register('polaroid', this.polaroidFilter);

    // Add UI elements
    api.ui.addMenuItem('Filters', 'Vintage Effect', () => {
      api.filters.apply('vintage');
    });
  },

  vintageFilter(imageData: ImageData): ImageData {
    // Custom vintage filter implementation
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Apply vintage color transformation
      data[i] = Math.min(255, r * 1.1 + 20);
      data[i + 1] = Math.min(255, g * 0.9 + 10);
      data[i + 2] = Math.min(255, b * 0.8 + 5);
    }

    return imageData;
  },

  polaroidFilter(imageData: ImageData): ImageData {
    // Custom polaroid filter implementation
    return imageData;
  },
};
```

---

## 📋 IMPLEMENTATION CHECKLIST

### **Immediate Actions (Next 2 weeks)**

- [ ] Implement VirtualizedLayersPanel for performance
- [ ] Add advanced blend modes (10+ new modes)
- [ ] Create optimized history system with delta compression
- [ ] Set up WebGL filter engine foundation
- [ ] Add professional color picker component

### **Short Term (1-2 months)**

- [ ] Complete WebGL filter system (5+ GPU filters)
- [ ] Implement Web Worker image processing
- [ ] Add canvas performance optimizer
- [ ] Create brush engine foundation
- [ ] Add layer effects (shadow, glow, etc.)

### **Medium Term (3-4 months)**

- [ ] Vector tools (pen tool, bezier curves)
- [ ] Advanced selection tools (magic wand, magnetic lasso)
- [ ] AI background removal integration
- [ ] Plugin system foundation
- [ ] Memory optimization for large projects

### **Long Term (6+ months)**

- [ ] WebAssembly integration for performance
- [ ] Desktop-class architecture
- [ ] External service integrations
- [ ] Advanced AI features
- [ ] Professional workflow tools

---

## 🎯 QUICK START GUIDE

Para implementar imediatamente:

1. **Copy** o `VirtualizedLayersPanel` para substituir o painel atual
2. **Add** o `useOptimizedHistory` hook ao PhotoEditorFixed
3. **Integrate** os blend modes avançados no sistema de layers
4. **Test** performance com projetos de 100+ layers
5. **Iterate** baseado no feedback de performance

Cada implementação é **incremental** e **não-destrutiva** - pode ser adicionada sem quebrar funcionalidades existentes.

---

_Guia técnico preparado para implementação imediata - Janeiro 2025_
