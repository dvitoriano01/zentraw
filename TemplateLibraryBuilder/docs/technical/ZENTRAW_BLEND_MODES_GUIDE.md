# 🎨 BLEND MODES PROFISSIONAIS - IMPLEMENTAÇÃO ZENTRAW

## Guia Técnico Completo dos 27 Blend Modes do Photoshop

---

## 📊 **CATEGORIAS E ALGORITMOS**

### **🔶 CATEGORIA: NORMAL**

```typescript
// 1. Normal - Base blend mode
const normal = (base: number, blend: number, opacity: number = 1): number => {
  return base + (blend - base) * opacity;
};

// 2. Dissolve - Pixel-level randomization
const dissolve = (base: number, blend: number, opacity: number): number => {
  return Math.random() < opacity ? blend : base;
};
```

### **🔹 CATEGORIA: DARKEN (Escurecer)**

```typescript
// 3. Darken - Mantém o pixel mais escuro
const darken = (base: number, blend: number): number => {
  return Math.min(base, blend);
};

// 4. Multiply - Multiplica valores (escurece)
const multiply = (base: number, blend: number): number => {
  return (base * blend) / 255;
};

// 5. Color Burn - Escurece aumentando contraste
const colorBurn = (base: number, blend: number): number => {
  if (blend === 0) return 0;
  return Math.max(0, 255 - ((255 - base) * 255) / blend);
};

// 6. Linear Burn - Soma inversa
const linearBurn = (base: number, blend: number): number => {
  return Math.max(0, base + blend - 255);
};

// 7. Darker Color - Compara luminosidade total
const darkerColor = (baseRGB: RGB, blendRGB: RGB): RGB => {
  const baseLum = getLuminance(baseRGB);
  const blendLum = getLuminance(blendRGB);
  return baseLum < blendLum ? baseRGB : blendRGB;
};
```

### **🔸 CATEGORIA: LIGHTEN (Clarear)**

```typescript
// 8. Lighten - Mantém o pixel mais claro
const lighten = (base: number, blend: number): number => {
  return Math.max(base, blend);
};

// 9. Screen - Inverso do Multiply (clareia)
const screen = (base: number, blend: number): number => {
  return 255 - ((255 - base) * (255 - blend)) / 255;
};

// 10. Color Dodge - Clareia reduzindo contraste
const colorDodge = (base: number, blend: number): number => {
  if (blend === 255) return 255;
  return Math.min(255, (base * 255) / (255 - blend));
};

// 11. Linear Dodge (Add) - Soma simples
const linearDodge = (base: number, blend: number): number => {
  return Math.min(255, base + blend);
};

// 12. Lighter Color - Compara luminosidade total
const lighterColor = (baseRGB: RGB, blendRGB: RGB): RGB => {
  const baseLum = getLuminance(baseRGB);
  const blendLum = getLuminance(blendRGB);
  return baseLum > blendLum ? baseRGB : blendRGB;
};
```

### **🔷 CATEGORIA: CONTRAST (Contraste)**

```typescript
// 13. Overlay - Screen + Multiply combinados
const overlay = (base: number, blend: number): number => {
  if (base < 128) {
    return (2 * base * blend) / 255;
  } else {
    return 255 - (2 * (255 - base) * (255 - blend)) / 255;
  }
};

// 14. Soft Light - Overlay suave
const softLight = (base: number, blend: number): number => {
  if (blend < 128) {
    return base - ((255 - 2 * blend) * base * (255 - base)) / (255 * 255);
  } else {
    const d =
      base < 64
        ? (((16 * base - 12) * base + 4) * base) / 255
        : Math.sqrt(base * 255) / 255;
    return base + ((2 * blend - 255) * (d * 255 - base)) / 255;
  }
};

// 15. Hard Light - Multiply + Screen
const hardLight = (base: number, blend: number): number => {
  if (blend < 128) {
    return multiply(base, 2 * blend);
  } else {
    return screen(base, 2 * blend - 255);
  }
};

// 16. Vivid Light - Color Burn + Color Dodge
const vividLight = (base: number, blend: number): number => {
  if (blend < 128) {
    return colorBurn(base, 2 * blend);
  } else {
    return colorDodge(base, 2 * blend - 255);
  }
};

// 17. Linear Light - Linear Burn + Linear Dodge
const linearLight = (base: number, blend: number): number => {
  if (blend < 128) {
    return linearBurn(base, 2 * blend);
  } else {
    return linearDodge(base, 2 * blend - 255);
  }
};

// 18. Pin Light - Darken + Lighten
const pinLight = (base: number, blend: number): number => {
  if (blend < 128) {
    return darken(base, 2 * blend);
  } else {
    return lighten(base, 2 * blend - 255);
  }
};

// 19. Hard Mix - Vivid Light com threshold
const hardMix = (base: number, blend: number): number => {
  const result = vividLight(base, blend);
  return result < 128 ? 0 : 255;
};
```

### **🔺 CATEGORIA: COMPARATIVE (Comparação)**

```typescript
// 20. Difference - Diferença absoluta
const difference = (base: number, blend: number): number => {
  return Math.abs(base - blend);
};

// 21. Exclusion - Difference suave
const exclusion = (base: number, blend: number): number => {
  return base + blend - (2 * base * blend) / 255;
};

// 22. Subtract - Subtração
const subtract = (base: number, blend: number): number => {
  return Math.max(0, base - blend);
};

// 23. Divide - Divisão
const divide = (base: number, blend: number): number => {
  if (blend === 0) return 255;
  return Math.min(255, (base * 255) / blend);
};
```

### **🎨 CATEGORIA: COMPONENT (HSL)**

```typescript
// 24. Hue - Mantém matiz da blend layer
const hue = (baseHSL: HSL, blendHSL: HSL): HSL => {
  return {
    h: blendHSL.h,
    s: baseHSL.s,
    l: baseHSL.l,
  };
};

// 25. Saturation - Mantém saturação da blend layer
const saturation = (baseHSL: HSL, blendHSL: HSL): HSL => {
  return {
    h: baseHSL.h,
    s: blendHSL.s,
    l: baseHSL.l,
  };
};

// 26. Color - Mantém matiz e saturação da blend layer
const color = (baseHSL: HSL, blendHSL: HSL): HSL => {
  return {
    h: blendHSL.h,
    s: blendHSL.s,
    l: baseHSL.l,
  };
};

// 27. Luminosity - Mantém luminosidade da blend layer
const luminosity = (baseHSL: HSL, blendHSL: HSL): HSL => {
  return {
    h: baseHSL.h,
    s: baseHSL.s,
    l: blendHSL.l,
  };
};
```

---

## 🚀 **IMPLEMENTAÇÃO NO FABRIC.JS**

### **🎯 Classe BlendModeManager**

```typescript
class BlendModeManager {
  private canvas: fabric.Canvas;
  private webglSupported: boolean;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.webglSupported = this.checkWebGLSupport();
  }

  // Aplicar blend mode a um objeto
  applyBlendMode(
    object: fabric.Object,
    blendMode: string,
    opacity: number = 1
  ) {
    if (this.webglSupported) {
      this.applyWebGLBlendMode(object, blendMode, opacity);
    } else {
      this.applyCanvasBlendMode(object, blendMode, opacity);
    }
  }

  // WebGL implementation (performance)
  private applyWebGLBlendMode(
    object: fabric.Object,
    blendMode: string,
    opacity: number
  ) {
    const shader = this.getBlendModeShader(blendMode);
    // WebGL shader application
  }

  // Canvas 2D fallback
  private applyCanvasBlendMode(
    object: fabric.Object,
    blendMode: string,
    opacity: number
  ) {
    const imageData = this.getObjectImageData(object);
    const blendedData = this.processPixels(imageData, blendMode, opacity);
    this.applyImageData(object, blendedData);
  }

  // Process pixels with blend mode algorithm
  private processPixels(
    imageData: ImageData,
    blendMode: string,
    opacity: number
  ): ImageData {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const base = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
      };
      const blend = this.getBlendPixel(i);

      const result = this.blendPixel(base, blend, blendMode, opacity);

      data[i] = result.r;
      data[i + 1] = result.g;
      data[i + 2] = result.b;
      data[i + 3] = result.a;
    }

    return imageData;
  }

  // Blend individual pixels
  private blendPixel(
    base: RGBA,
    blend: RGBA,
    mode: string,
    opacity: number
  ): RGBA {
    switch (mode) {
      case "multiply":
        return {
          r: multiply(base.r, blend.r) * opacity + base.r * (1 - opacity),
          g: multiply(base.g, blend.g) * opacity + base.g * (1 - opacity),
          b: multiply(base.b, blend.b) * opacity + base.b * (1 - opacity),
          a: base.a,
        };
      case "screen":
        return {
          r: screen(base.r, blend.r) * opacity + base.r * (1 - opacity),
          g: screen(base.g, blend.g) * opacity + base.g * (1 - opacity),
          b: screen(base.b, blend.b) * opacity + base.b * (1 - opacity),
          a: base.a,
        };
      // ... todos os outros 25 blend modes
      default:
        return base;
    }
  }
}
```

### **🎨 WebGL Shaders para Performance**

```glsl
// Fragment shader para Multiply blend mode
precision mediump float;
uniform sampler2D u_baseTexture;
uniform sampler2D u_blendTexture;
uniform float u_opacity;
varying vec2 v_texCoord;

void main() {
  vec4 base = texture2D(u_baseTexture, v_texCoord);
  vec4 blend = texture2D(u_blendTexture, v_texCoord);

  // Multiply blend mode
  vec3 result = base.rgb * blend.rgb;

  // Apply opacity
  result = mix(base.rgb, result, u_opacity);

  gl_FragColor = vec4(result, base.a);
}
```

---

## 🎯 **INTERFACE DE USUÁRIO**

### **🎨 Blend Mode Selector Component**

```typescript
const BlendModeSelector = ({
  selectedMode,
  onModeChange,
  opacity,
  onOpacityChange,
}) => {
  const blendModeCategories = {
    Normal: ["Normal", "Dissolve"],
    Darken: ["Darken", "Multiply", "Color Burn", "Linear Burn", "Darker Color"],
    Lighten: [
      "Lighten",
      "Screen",
      "Color Dodge",
      "Linear Dodge",
      "Lighter Color",
    ],
    Contrast: [
      "Overlay",
      "Soft Light",
      "Hard Light",
      "Vivid Light",
      "Linear Light",
      "Pin Light",
      "Hard Mix",
    ],
    Comparative: ["Difference", "Exclusion", "Subtract", "Divide"],
    Component: ["Hue", "Saturation", "Color", "Luminosity"],
  };

  return (
    <div className="blend-mode-panel">
      <Select value={selectedMode} onValueChange={onModeChange}>
        {Object.entries(blendModeCategories).map(([category, modes]) => (
          <SelectGroup key={category}>
            <SelectLabel>{category}</SelectLabel>
            {modes.map((mode) => (
              <SelectItem
                key={mode}
                value={mode.toLowerCase().replace(" ", "-")}
              >
                {mode}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </Select>

      <Slider
        value={[opacity * 100]}
        onValueChange={([value]) => onOpacityChange(value / 100)}
        max={100}
        step={1}
        className="opacity-slider"
      />
    </div>
  );
};
```

---

## 🚀 **IMPLEMENTAÇÃO PRÁTICA NO ZENTRAW**

### **1. Integração no ZentrawWorkspaceFull.tsx**

```typescript
// Adicionar ao estado do componente
const [blendModes, setBlendModes] = useState<Map<string, BlendMode>>(new Map());
const blendModeManager = useRef<BlendModeManager>(null);

// Inicializar blend mode manager
useEffect(() => {
  if (fabricCanvas.current) {
    blendModeManager.current = new BlendModeManager(fabricCanvas.current);
  }
}, [fabricCanvas.current]);

// Aplicar blend mode ao objeto selecionado
const applyBlendMode = useCallback(
  (mode: string, opacity: number) => {
    if (activeObject && blendModeManager.current) {
      blendModeManager.current.applyBlendMode(activeObject, mode, opacity);
      fabricCanvas.current.renderAll();
      saveState(); // Para o sistema de history
    }
  },
  [activeObject]
);
```

### **2. Painel de Propriedades Expandido**

```typescript
// Adicionar ao painel de propriedades existente
{
  activeTab === "effects" && (
    <div className="space-y-4">
      <BlendModeSelector
        selectedMode={activeObject?.blendMode || "normal"}
        onModeChange={(mode) =>
          applyBlendMode(mode, activeObject?.opacity || 1)
        }
        opacity={activeObject?.opacity || 1}
        onOpacityChange={(opacity) =>
          applyBlendMode(activeObject?.blendMode || "normal", opacity)
        }
      />

      <LayerEffectsPanel
        object={activeObject}
        onEffectChange={applyLayerEffect}
      />
    </div>
  );
}
```

---

## 📊 **PERFORMANCE E OTIMIZAÇÃO**

### **🚀 Estratégias de Performance**

```typescript
// 1. WebGL quando disponível
const useWebGL = checkWebGLSupport() && imageSize > threshold;

// 2. Web Workers para processamento pesado
const blendWorker = new Worker("./blend-worker.js");

// 3. Canvas caching para blend modes estáticos
const blendCache = new Map<string, ImageData>();

// 4. Processamento incremental para imagens grandes
const processInChunks = (imageData: ImageData, chunkSize: number = 1024) => {
  // Process em chunks para não bloquear UI
};
```

---

## ✅ **RESULTADO FINAL**

Com essa implementação, o Zentraw terá:

1. **✅ 27 Blend Modes Profissionais** - Idênticos ao Photoshop
2. **✅ Performance Otimizada** - WebGL + Web Workers
3. **✅ Interface Intuitiva** - Categorized selector
4. **✅ Real-time Preview** - Immediate feedback
5. **✅ History Integration** - Undo/Redo support
6. **✅ Layer Compatibility** - Works with all layer types

**Tempo de implementação estimado:** 2-3 semanas
**Complexidade:** Alta, mas factível com a estrutura existente
**Impact:** Editor profissional comparable ao Photoshop

---

_Guia completo de Blend Modes - Zentraw Technical Implementation - Junho 2025_
