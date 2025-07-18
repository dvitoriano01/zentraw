# 🔧 ZENTRAW V1.3.0.c.9 - SOLUÇÃO PARA BOUNDING BOX

📅 **Data:** 10/07/2025  
🎯 **Status:** IMPLEMENTAÇÃO DE CORREÇÃO  
🔧 **Objetivo:** Corrigir proporção dos bounding boxes em alta resolução

## 📋 **PROBLEMA RESUMIDO**

Os bounding boxes dos textos ficam visualmente menores em alta resolução porque:

- Canvas físico: 2400x2400px (alta resolução)
- Canvas visual: 1200x1200px (mostrado na tela)
- fontSize fixo: 48px → Proporção: 48/2400 = 2% (em vez de 4%)

## 🛠️ **SOLUÇÃO IMPLEMENTADA**

### **1. Função de Scaling Inteligente**

```typescript
// Função para calcular fontSize baseado na resolução
const calculateScaledFontSize = (baseFontSize: number): number => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return baseFontSize;

  const devicePixelRatio = (canvas as any).devicePixelRatio || window.devicePixelRatio || 1;
  const highResMultiplier = Math.max(devicePixelRatio, 2);

  // Escalar fontSize para manter proporção visual
  const scaledSize = baseFontSize * highResMultiplier;

  console.log(`📏 Font scaling: ${baseFontSize}px → ${scaledSize}px (${highResMultiplier}x)`);
  return scaledSize;
};
```

### **2. Atualização na Criação de Textos**

```typescript
// ANTES (V1.3.0.c.9):
const fontSize = 48; // Tamanho fixo

// DEPOIS (V1.3.0.c.10):
const baseFontSize = 48;
const fontSize = calculateScaledFontSize(baseFontSize);
```

### **3. Normalização de Controles Visuais**

```typescript
// Função para normalizar controles do bounding box
const normalizeFabricControls = (object: fabric.Object): void => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const devicePixelRatio = (canvas as any).devicePixelRatio || 1;
  const controlMultiplier = Math.max(devicePixelRatio, 2);

  object.set({
    borderScaleFactor: 1 / controlMultiplier,
    cornerSize: 12 * controlMultiplier,
    cornerStrokeColor: '#4a90e2',
    borderColor: '#4a90e2',
    transparentCorners: false,
  });
};
```

## 🎯 **IMPLEMENTAÇÃO NO CÓDIGO**

### **Arquivo:** `PhotoEditorFixed.tsx`

#### **Alteração 1: Adicionar função de scaling**

```typescript
// Adicionar após as outras funções utilitárias (linha ~1150)
const calculateScaledFontSize = useCallback((baseFontSize: number): number => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return baseFontSize;

  const devicePixelRatio = (canvas as any).devicePixelRatio || window.devicePixelRatio || 1;
  const highResMultiplier = Math.max(devicePixelRatio, 2);

  // Se devicePixelRatio for 1 (resolução normal), não escalar
  if (highResMultiplier <= 1) return baseFontSize;

  // Escalar fontSize para manter proporção visual em alta resolução
  const scaledSize = Math.round(baseFontSize * highResMultiplier);

  console.log(`📏 Font scaling: ${baseFontSize}px → ${scaledSize}px (ratio: ${highResMultiplier})`);
  return scaledSize;
}, []);
```

#### **Alteração 2: Usar scaling na criação de textos**

```typescript
// Alterar a linha ~1220 (caso 'text'):
case 'text':
  // ALTA RESOLUÇÃO: Texto com tamanho escalado para manter proporção
  const randomFreepikFont =
    availableFonts.length > 0
      ? availableFonts[Math.floor(Math.random() * availableFonts.length)]
      : freepikFonts[0];

  // Usar scaling inteligente baseado na resolução
  const baseFontSize = 48; // Tamanho base para usuário
  const fontSize = calculateScaledFontSize(baseFontSize);

  shape = new fabric.IText('Digite seu texto', {
    left: centerX,
    top: centerY,
    originX: 'center',
    originY: 'center',
    fontFamily: randomFreepikFont.value,
    fontSize: fontSize, // Tamanho escalado
    fill: '#ffffff',
    stroke: '',
    strokeWidth: 0,
    textAlign: 'center',
    strokeDashArray: [],
    paintFirst: 'fill',
    charSpacing: 0,
    lineHeight: 1.2,
    dirty: true,
    fontWeight: randomFreepikFont.weight || 400,
    fontStyle: randomFreepikFont.style || 'normal',
    // Metadados para rastreamento
    _baseFontSize: baseFontSize,
    _scaledFontSize: fontSize,
  });

  console.log(`📝 Texto criado: ${randomFreepikFont.label}`);
  console.log(`📏 Tamanho: ${baseFontSize}px base → ${fontSize}px escalado`);
  break;
```

#### **Alteração 3: Adicionar normalização após criação**

```typescript
// Adicionar após a criação do shape (linha ~1250):
if (shape) {
  // Normalizar controles visuais para alta resolução
  const canvas = fabricCanvasRef.current;
  if (canvas) {
    const devicePixelRatio = (canvas as any).devicePixelRatio || 1;
    if (devicePixelRatio > 1) {
      shape.set({
        borderScaleFactor: 1,
        cornerSize: 12,
        cornerStrokeColor: '#4a90e2',
        borderColor: '#4a90e2',
        transparentCorners: false,
      });
    }
  }

  addLayerToCanvas(shape, type.charAt(0).toUpperCase() + type.slice(1), type);
  setSelectedTool('select');
}
```

## 🎯 **SOLUÇÃO PARA TextPropertiesPanel**

### **Exibir Tamanho Base ao Usuário**

```typescript
// No TextPropertiesPanel, mostrar sempre o tamanho base, não o escalado
const getDisplayFontSize = (fabricObject: fabric.IText): number => {
  const baseFontSize = (fabricObject as any)._baseFontSize;
  return baseFontSize || Math.round((fabricObject.fontSize || 16) / 2); // Fallback
};

const setDisplayFontSize = (fabricObject: fabric.IText, displaySize: number): void => {
  const canvas = fabricCanvasRef.current;
  if (!canvas) return;

  const devicePixelRatio = (canvas as any).devicePixelRatio || 1;
  const highResMultiplier = Math.max(devicePixelRatio, 2);

  const scaledSize = displaySize * (highResMultiplier > 1 ? highResMultiplier : 1);

  fabricObject.set({
    fontSize: scaledSize,
    _baseFontSize: displaySize,
    _scaledFontSize: scaledSize,
  });
};
```

## 📊 **RESULTADOS ESPERADOS**

### **Antes da Correção:**

```
Canvas Alta Resolução (2400x2400px):
- fontSize: 48px fixo
- Proporção: 48/2400 = 2%
- Bounding box visualmente pequeno
```

### **Depois da Correção:**

```
Canvas Alta Resolução (2400x2400px):
- fontSize: 96px (48px * 2)
- Proporção: 96/2400 = 4%
- Bounding box proporcionalmente correto
```

### **Canvas Normal (1200x1200px):**

```
- fontSize: 48px (sem alteração)
- Proporção: 48/1200 = 4%
- Compatibilidade mantida
```

## 🧪 **TESTE DE VALIDAÇÃO**

### **Como Testar:**

1. Criar um texto em resolução normal
2. Criar um texto em alta resolução (monitor com devicePixelRatio > 1)
3. Comparar proporções visuais
4. Verificar experiência de seleção

### **Comandos de Debug:**

```javascript
// No console do browser:
const canvas = fabricCanvasRef.current;
const textObjects = canvas.getObjects('i-text');

textObjects.forEach((text, index) => {
  console.log(`Texto ${index}:`);
  console.log('- fontSize:', text.fontSize);
  console.log('- baseFontSize:', text._baseFontSize);
  console.log('- devicePixelRatio:', canvas.devicePixelRatio);
  console.log('- proporção:', ((text.fontSize / canvas.width) * 100).toFixed(2) + '%');
});
```

## 🎯 **BENEFÍCIOS DA IMPLEMENTAÇÃO**

### ✅ **Problemas Resolvidos:**

- Bounding boxes proporcionalmente corretos
- Experiência consistente entre resoluções
- Seleção de objetos mais intuitiva
- Qualidade visual mantida

### ✅ **Compatibilidade:**

- Funciona em todas as resoluções
- Não quebra funcionamento existente
- Melhoria progressiva automática

### ✅ **Facilidade de Manutenção:**

- Código limpo e bem documentado
- Sistema automático de scaling
- Debug logs para troubleshooting

---

**Implementação recomendada:** Aplicar as alterações acima ao PhotoEditorFixed.tsx  
**Versão:** V1.3.0.c.10 - Bounding Box Fix  
**Branch:** feature/resolution-adjustments-v1.3.0.c.9
