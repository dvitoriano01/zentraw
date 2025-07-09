# 🎯 ZENTRAW PRIORITY IMPLEMENTATION PLAN

## Próximas Implementações Práticas - Foco Imediato

---

## 🚀 IMPLEMENTAÇÃO PRIORITÁRIA 1: ADVANCED BLEND MODES

**Estimativa:** 1 semana  
**Impacto:** Alto - Feature essencial para editor profissional  
**Complexidade:** Média

### Implementação no PhotoEditorFixed.tsx

```typescript
// Adicionar ao PhotoEditorFixed.tsx - seção de imports
import { BlendMode, applyBlendMode, customBlendModes } from '@/utils/blendModes';

// Adicionar ao estado
const [layerBlendMode, setLayerBlendMode] = useState<BlendMode>(BlendMode.NORMAL);

// Nova função para aplicar blend mode
const applyBlendModeToLayer = useCallback((layerId: string, blendMode: BlendMode) => {
  if (!fabricCanvasRef.current) return;

  const canvas = fabricCanvasRef.current;
  const objects = canvas.getObjects();
  const obj = objects.find((o, index) =>
    (o as any).layerId === layerId || `layer-${index}` === layerId
  );

  if (obj) {
    // Store blend mode in object
    (obj as any).blendMode = blendMode;

    // Apply blend mode to canvas
    if (blendMode in BlendMode) {
      obj.set('globalCompositeOperation', blendMode);
    } else {
      // Custom blend mode - requires post-processing
      obj.set('globalCompositeOperation', 'source-over');
      (obj as any).customBlendMode = blendMode;
    }

    canvas.renderAll();
    updateLayers();
    saveState();
  }
}, [updateLayers, saveState]);

// Adicionar ao JSX - no painel de propriedades
<div className="space-y-2">
  <label className="text-sm font-medium">Blend Mode</label>
  <select
    value={layerBlendMode}
    onChange={(e) => {
      const newBlendMode = e.target.value as BlendMode;
      setLayerBlendMode(newBlendMode);
      if (selectedLayer) {
        applyBlendModeToLayer(selectedLayer.id, newBlendMode);
      }
    }}
    className="w-full p-2 border rounded-md"
  >
    <option value={BlendMode.NORMAL}>Normal</option>
    <option value={BlendMode.MULTIPLY}>Multiply</option>
    <option value={BlendMode.SCREEN}>Screen</option>
    <option value={BlendMode.OVERLAY}>Overlay</option>
    <option value={BlendMode.SOFT_LIGHT}>Soft Light</option>
    <option value={BlendMode.HARD_LIGHT}>Hard Light</option>
    <option value={BlendMode.COLOR_DODGE}>Color Dodge</option>
    <option value={BlendMode.COLOR_BURN}>Color Burn</option>
    <option value={BlendMode.DARKEN}>Darken</option>
    <option value={BlendMode.LIGHTEN}>Lighten</option>
    <option value={BlendMode.DIFFERENCE}>Difference</option>
    <option value={BlendMode.EXCLUSION}>Exclusion</option>
  </select>
</div>
```

### Arquivo utilitário necessário

```typescript
// utils/blendModes.ts - CRIAR ESTE ARQUIVO
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

    data[i] = blendFunction(r, r);
    data[i + 1] = blendFunction(g, g);
    data[i + 2] = blendFunction(b, b);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};
```

---

## 🚀 IMPLEMENTAÇÃO PRIORITÁRIA 2: LAYER EFFECTS (SHADOWS & GLOWS)

**Estimativa:** 1-2 semanas  
**Impacto:** Alto - Diferencial competitivo  
**Complexidade:** Média-Alta

### Interface para Layer Effects

```typescript
// Adicionar ao PhotoEditorFixed.tsx
interface LayerEffect {
  type: 'drop-shadow' | 'inner-shadow' | 'outer-glow' | 'inner-glow' | 'bevel-emboss';
  enabled: boolean;
  color: string;
  opacity: number;
  angle?: number;
  distance?: number;
  spread?: number;
  blur: number;
  blendMode: BlendMode;
}

interface AdvancedLayerItem extends LayerItem {
  effects: LayerEffect[];
}

// No estado do componente
const [layerEffects, setLayerEffects] = useState<LayerEffect[]>([]);

// Função para aplicar efeitos
const applyLayerEffects = useCallback((layerId: string, effects: LayerEffect[]) => {
  if (!fabricCanvasRef.current) return;

  const canvas = fabricCanvasRef.current;
  const objects = canvas.getObjects();
  const obj = objects.find((o, index) =>
    (o as any).layerId === layerId || `layer-${index}` === layerId
  );

  if (obj) {
    // Store effects in object
    (obj as any).effects = effects;

    // Apply shadow effects (Fabric.js native support)
    const dropShadow = effects.find(e => e.type === 'drop-shadow' && e.enabled);
    if (dropShadow) {
      obj.set({
        shadow: {
          color: dropShadow.color,
          blur: dropShadow.blur,
          offsetX: dropShadow.distance * Math.cos((dropShadow.angle || 0) * Math.PI / 180),
          offsetY: dropShadow.distance * Math.sin((dropShadow.angle || 0) * Math.PI / 180),
          opacity: dropShadow.opacity / 100
        }
      });
    } else {
      obj.set('shadow', null);
    }

    // For complex effects like glow, we need custom rendering
    applyComplexEffects(obj, effects);

    canvas.renderAll();
    updateLayers();
    saveState();
  }
}, [updateLayers, saveState]);

// JSX para painel de efeitos
const LayerEffectsPanel = () => (
  <div className="space-y-4">
    <h4 className="font-medium">Layer Effects</h4>

    {layerEffects.map((effect, index) => (
      <div key={index} className="border rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={effect.enabled}
              onChange={(e) => {
                const newEffects = [...layerEffects];
                newEffects[index].enabled = e.target.checked;
                setLayerEffects(newEffects);
                if (selectedLayer) {
                  applyLayerEffects(selectedLayer.id, newEffects);
                }
              }}
            />
            <span className="capitalize">{effect.type.replace('-', ' ')}</span>
          </label>
        </div>

        {effect.enabled && (
          <div className="space-y-2 text-sm">
            <div>
              <label>Color</label>
              <input
                type="color"
                value={effect.color}
                onChange={(e) => {
                  const newEffects = [...layerEffects];
                  newEffects[index].color = e.target.value;
                  setLayerEffects(newEffects);
                  if (selectedLayer) {
                    applyLayerEffects(selectedLayer.id, newEffects);
                  }
                }}
                className="w-full h-8 rounded border"
              />
            </div>

            <div>
              <label>Opacity: {effect.opacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={effect.opacity}
                onChange={(e) => {
                  const newEffects = [...layerEffects];
                  newEffects[index].opacity = parseInt(e.target.value);
                  setLayerEffects(newEffects);
                  if (selectedLayer) {
                    applyLayerEffects(selectedLayer.id, newEffects);
                  }
                }}
                className="w-full"
              />
            </div>

            <div>
              <label>Blur: {effect.blur}px</label>
              <input
                type="range"
                min="0"
                max="50"
                value={effect.blur}
                onChange={(e) => {
                  const newEffects = [...layerEffects];
                  newEffects[index].blur = parseInt(e.target.value);
                  setLayerEffects(newEffects);
                  if (selectedLayer) {
                    applyLayerEffects(selectedLayer.id, newEffects);
                  }
                }}
                className="w-full"
              />
            </div>

            {(effect.type === 'drop-shadow' || effect.type === 'inner-shadow') && (
              <>
                <div>
                  <label>Distance: {effect.distance}px</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={effect.distance || 0}
                    onChange={(e) => {
                      const newEffects = [...layerEffects];
                      newEffects[index].distance = parseInt(e.target.value);
                      setLayerEffects(newEffects);
                      if (selectedLayer) {
                        applyLayerEffects(selectedLayer.id, newEffects);
                      }
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label>Angle: {effect.angle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={effect.angle || 0}
                    onChange={(e) => {
                      const newEffects = [...layerEffects];
                      newEffects[index].angle = parseInt(e.target.value);
                      setLayerEffects(newEffects);
                      if (selectedLayer) {
                        applyLayerEffects(selectedLayer.id, newEffects);
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    ))}

    <button
      onClick={() => {
        const newEffect: LayerEffect = {
          type: 'drop-shadow',
          enabled: true,
          color: '#000000',
          opacity: 75,
          angle: 135,
          distance: 5,
          blur: 5,
          blendMode: BlendMode.NORMAL
        };
        setLayerEffects([...layerEffects, newEffect]);
      }}
      className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Add Effect
    </button>
  </div>
);
```

---

## 🚀 IMPLEMENTAÇÃO PRIORITÁRIA 3: PERFORMANCE OPTIMIZATION

**Estimativa:** 3-4 dias  
**Impacto:** Alto - Melhora experiência geral  
**Complexidade:** Baixa-Média

### Layer Virtualization

```typescript
// Substituir o painel de layers atual por versão virtualizada
// Instalar dependência: npm install react-window

// No PhotoEditorFixed.tsx, substituir o painel de layers existente:
import { FixedSizeList as List } from 'react-window';

const VirtualLayersPanel = () => {
  const LAYER_HEIGHT = 40;
  const MAX_VISIBLE = 10;

  const LayerItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const layer = layers[index];
    if (!layer) return null;

    return (
      <div
        style={style}
        className={`flex items-center px-3 py-2 border-b cursor-pointer hover:bg-gray-50 ${
          selectedLayer?.id === layer.id ? 'bg-blue-100' : ''
        }`}
        onClick={() => selectLayer(layer.id)}
        draggable
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
          if (fromIndex !== index) {
            reorderLayers(fromIndex, index);
          }
        }}
      >
        {/* Ícone do layer */}
        <div className="flex-shrink-0 mr-2">
          {layer.type === 'text' && <Type size={16} />}
          {layer.type === 'image' && <ImageIcon size={16} />}
          {layer.type === 'shape' && <Square size={16} />}
        </div>

        {/* Nome do layer */}
        <span className="flex-1 text-sm truncate">{layer.name}</span>

        {/* Controles */}
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerVisibility(layer.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLayerLock(layer.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteLayer(layer.id);
            }}
            className="p-1 hover:bg-red-200 rounded text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="p-2 border-b">
        <h3 className="font-medium">Layers ({layers.length})</h3>
      </div>

      <List
        height={Math.min(layers.length * LAYER_HEIGHT, MAX_VISIBLE * LAYER_HEIGHT)}
        itemCount={layers.length}
        itemSize={LAYER_HEIGHT}
        overscanCount={3}
      >
        {LayerItem}
      </List>
    </div>
  );
};
```

### Optimized History System

```typescript
// Melhorar o sistema de histórico
const useOptimizedHistory = (canvas: Canvas | null) => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const lastStateRef = useRef<string>('');
  const compressionRef = useRef<any>(null);

  // Inicializar compressão (LZ-string ou similar)
  useEffect(() => {
    import('lz-string').then((module) => {
      compressionRef.current = module.default;
    });
  }, []);

  const saveState = useCallback(() => {
    if (!canvas) return;

    const currentState = JSON.stringify(canvas.toJSON());

    // Evitar estados duplicados
    if (currentState === lastStateRef.current) return;

    // Comprimir estado se disponível
    const stateToSave = compressionRef.current
      ? compressionRef.current.compress(currentState)
      : currentState;

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(stateToSave);

      // Manter apenas últimos 30 estados para performance
      if (newHistory.length > 30) {
        newHistory.shift();
      }

      return newHistory;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, 29));
    lastStateRef.current = currentState;
  }, [canvas, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !canvas) return;

    const prevState = history[historyIndex - 1];
    const decompressed = compressionRef.current
      ? compressionRef.current.decompress(prevState)
      : prevState;

    canvas.loadFromJSON(decompressed, () => {
      canvas.renderAll();
      updateLayers();
    });

    setHistoryIndex((prev) => prev - 1);
  }, [canvas, history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !canvas) return;

    const nextState = history[historyIndex + 1];
    const decompressed = compressionRef.current
      ? compressionRef.current.decompress(nextState)
      : nextState;

    canvas.loadFromJSON(decompressed, () => {
      canvas.renderAll();
      updateLayers();
    });

    setHistoryIndex((prev) => prev + 1);
  }, [canvas, history, historyIndex]);

  return {
    saveState,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyLength: history.length,
  };
};
```

---

## 🚀 IMPLEMENTAÇÃO PRIORITÁRIA 4: ENHANCED TEXT TOOLS

**Estimativa:** 1 semana  
**Impacto:** Médio-Alto - Funcionalidade central  
**Complexidade:** Média

### Advanced Text Properties

```typescript
// Expandir as propriedades de texto no PhotoEditorFixed.tsx
interface AdvancedTextProperties {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textShadow: {
    enabled: boolean;
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  stroke: {
    enabled: boolean;
    color: string;
    width: number;
  };
  fill: {
    type: 'solid' | 'gradient';
    color: string;
    gradient?: {
      type: 'linear' | 'radial';
      colors: string[];
      angle: number;
    };
  };
}

// No estado do componente
const [textProperties, setTextProperties] = useState<AdvancedTextProperties>({
  fontFamily: 'Arial',
  fontSize: 24,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  lineHeight: 1.2,
  letterSpacing: 0,
  wordSpacing: 0,
  textDecoration: 'none',
  textTransform: 'none',
  textShadow: {
    enabled: false,
    color: '#000000',
    offsetX: 2,
    offsetY: 2,
    blur: 4
  },
  stroke: {
    enabled: false,
    color: '#000000',
    width: 1
  },
  fill: {
    type: 'solid',
    color: '#000000'
  }
});

// Função para aplicar propriedades avançadas de texto
const applyAdvancedTextProperties = useCallback((properties: AdvancedTextProperties) => {
  if (!selectedObject || selectedObject.type !== 'i-text') return;

  const textObj = selectedObject as IText;

  // Propriedades básicas
  textObj.set({
    fontFamily: properties.fontFamily,
    fontSize: properties.fontSize,
    fontWeight: properties.fontWeight,
    fontStyle: properties.fontStyle,
    textAlign: properties.textAlign,
    lineHeight: properties.lineHeight,
  });

  // Letter spacing (charSpacing em Fabric.js)
  textObj.set('charSpacing', properties.letterSpacing * 1000); // Fabric usa escala diferente

  // Text decoration
  if (properties.textDecoration !== 'none') {
    textObj.set({
      underline: properties.textDecoration === 'underline',
      linethrough: properties.textDecoration === 'line-through',
      overline: properties.textDecoration === 'overline'
    });
  }

  // Text transform
  if (properties.textTransform !== 'none') {
    const originalText = textObj.text || '';
    let transformedText = originalText;

    switch (properties.textTransform) {
      case 'uppercase':
        transformedText = originalText.toUpperCase();
        break;
      case 'lowercase':
        transformedText = originalText.toLowerCase();
        break;
      case 'capitalize':
        transformedText = originalText.replace(/\b\w/g, l => l.toUpperCase());
        break;
    }

    textObj.set('text', transformedText);
  }

  // Text shadow
  if (properties.textShadow.enabled) {
    textObj.set('shadow', {
      color: properties.textShadow.color,
      blur: properties.textShadow.blur,
      offsetX: properties.textShadow.offsetX,
      offsetY: properties.textShadow.offsetY
    });
  } else {
    textObj.set('shadow', null);
  }

  // Stroke
  if (properties.stroke.enabled) {
    textObj.set({
      stroke: properties.stroke.color,
      strokeWidth: properties.stroke.width
    });
  } else {
    textObj.set({
      stroke: '',
      strokeWidth: 0
    });
  }

  // Fill
  if (properties.fill.type === 'solid') {
    textObj.set('fill', properties.fill.color);
  } else if (properties.fill.gradient) {
    const gradient = new fabric.Gradient({
      type: properties.fill.gradient.type,
      coords: properties.fill.gradient.type === 'linear'
        ? { x1: 0, y1: 0, x2: 100, y2: 0 }
        : { x1: 50, y1: 50, x2: 50, y2: 50, r1: 0, r2: 50 },
      colorStops: properties.fill.gradient.colors.map((color, index) => ({
        offset: index / (properties.fill.gradient!.colors.length - 1),
        color
      }))
    });
    textObj.set('fill', gradient);
  }

  fabricCanvasRef.current?.renderAll();
  saveState();
}, [selectedObject, saveState]);

// JSX para painel de propriedades avançadas de texto
const AdvancedTextPanel = () => (
  <div className="space-y-4">
    <h4 className="font-medium">Advanced Text Properties</h4>

    {/* Typography */}
    <div className="space-y-3">
      <h5 className="text-sm font-medium">Typography</h5>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs">Line Height</label>
          <input
            type="number"
            min="0.5"
            max="3"
            step="0.1"
            value={textProperties.lineHeight}
            onChange={(e) => {
              const newProps = { ...textProperties, lineHeight: parseFloat(e.target.value) };
              setTextProperties(newProps);
              applyAdvancedTextProperties(newProps);
            }}
            className="w-full p-1 border rounded text-sm"
          />
        </div>

        <div>
          <label className="text-xs">Letter Spacing</label>
          <input
            type="number"
            min="-10"
            max="10"
            step="0.1"
            value={textProperties.letterSpacing}
            onChange={(e) => {
              const newProps = { ...textProperties, letterSpacing: parseFloat(e.target.value) };
              setTextProperties(newProps);
              applyAdvancedTextProperties(newProps);
            }}
            className="w-full p-1 border rounded text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs">Text Transform</label>
        <select
          value={textProperties.textTransform}
          onChange={(e) => {
            const newProps = { ...textProperties, textTransform: e.target.value as any };
            setTextProperties(newProps);
            applyAdvancedTextProperties(newProps);
          }}
          className="w-full p-1 border rounded text-sm"
        >
          <option value="none">None</option>
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>
    </div>

    {/* Text Shadow */}
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={textProperties.textShadow.enabled}
          onChange={(e) => {
            const newProps = {
              ...textProperties,
              textShadow: { ...textProperties.textShadow, enabled: e.target.checked }
            };
            setTextProperties(newProps);
            applyAdvancedTextProperties(newProps);
          }}
        />
        <span className="text-sm font-medium">Text Shadow</span>
      </label>

      {textProperties.textShadow.enabled && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label>Color</label>
            <input
              type="color"
              value={textProperties.textShadow.color}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  textShadow: { ...textProperties.textShadow, color: e.target.value }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full h-6 rounded border"
            />
          </div>

          <div>
            <label>Blur: {textProperties.textShadow.blur}px</label>
            <input
              type="range"
              min="0"
              max="20"
              value={textProperties.textShadow.blur}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  textShadow: { ...textProperties.textShadow, blur: parseInt(e.target.value) }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label>Offset X: {textProperties.textShadow.offsetX}px</label>
            <input
              type="range"
              min="-20"
              max="20"
              value={textProperties.textShadow.offsetX}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  textShadow: { ...textProperties.textShadow, offsetX: parseInt(e.target.value) }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full"
            />
          </div>

          <div>
            <label>Offset Y: {textProperties.textShadow.offsetY}px</label>
            <input
              type="range"
              min="-20"
              max="20"
              value={textProperties.textShadow.offsetY}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  textShadow: { ...textProperties.textShadow, offsetY: parseInt(e.target.value) }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>

    {/* Text Stroke */}
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={textProperties.stroke.enabled}
          onChange={(e) => {
            const newProps = {
              ...textProperties,
              stroke: { ...textProperties.stroke, enabled: e.target.checked }
            };
            setTextProperties(newProps);
            applyAdvancedTextProperties(newProps);
          }}
        />
        <span className="text-sm font-medium">Text Stroke</span>
      </label>

      {textProperties.stroke.enabled && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label>Color</label>
            <input
              type="color"
              value={textProperties.stroke.color}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  stroke: { ...textProperties.stroke, color: e.target.value }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full h-6 rounded border"
            />
          </div>

          <div>
            <label>Width: {textProperties.stroke.width}px</label>
            <input
              type="range"
              min="1"
              max="10"
              value={textProperties.stroke.width}
              onChange={(e) => {
                const newProps = {
                  ...textProperties,
                  stroke: { ...textProperties.stroke, width: parseInt(e.target.value) }
                };
                setTextProperties(newProps);
                applyAdvancedTextProperties(newProps);
              }}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  </div>
);
```

---

## 📋 CRONOGRAMA DE IMPLEMENTAÇÃO

### **SEMANA 1: Blend Modes**

- **Dias 1-2:** Implementar enum e funções básicas
- **Dias 3-4:** Integrar ao PhotoEditorFixed.tsx
- **Dias 5:** Testes e refinamentos

### **SEMANA 2: Layer Effects**

- **Dias 1-3:** Sistema de efeitos básico (drop shadow)
- **Dias 4-5:** Efeitos avançados (glow, inner shadow)

### **SEMANA 3: Performance**

- **Dias 1-2:** Layer virtualization
- **Dias 3-4:** Optimized history system
- **Dia 5:** Testes de performance

### **SEMANA 4: Advanced Text**

- **Dias 1-3:** Propriedades avançadas de texto
- **Dias 4-5:** Interface e integração

---

## 🎯 QUICK START - PRIMEIRA IMPLEMENTAÇÃO

Para começar imediatamente com **Blend Modes**:

1. **Criar** o arquivo `utils/blendModes.ts` com o código fornecido
2. **Adicionar** as imports no `PhotoEditorFixed.tsx`
3. **Inserir** o select de blend mode no painel de propriedades
4. **Testar** com diferentes layers e modes

**Resultado esperado:** Editor com 12+ blend modes profissionais funcionais em menos de 1 dia de implementação.

---

_Plano de implementação prioritária - Janeiro 2025_
_Próxima revisão após primeira implementação_
