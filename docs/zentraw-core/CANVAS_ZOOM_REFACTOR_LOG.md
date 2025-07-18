# LOG COMPLETO - CANVAS, ZOOM E WORKSPACE - ZENTRAW V1.3.0.c.8

## 📅 Data: 10 de julho de 2025

## 🎯 Objetivo: Refatoração completa do sistema de canvas + zoom baseado nas instruções do ChatGPT

---

## 🚨 EXPERIÊNCIAS NEGATIVAS - ONTEM (09/07/2025)

### ❌ Erros Críticos Cometidos:

1. **JSX Corrompido**: Edições múltiplas simultâneas causaram duplicação de seções e tags não fechadas
2. **Imports Perdidos**: Remoção acidental de imports essenciais durante edições
3. **Abordagem Não Incremental**: Tentativa de implementar múltiplas funcionalidades sem testar cada etapa
4. **Sistema Zoom Quebrado**: Aplicação incorreta de zoom CSS vs Fabric.js
5. **Canvas Não Centralizado**: Falha na implementação de centralização do workspace
6. **Falta de Backup**: Não manter versão estável antes de grandes alterações

### ⚠️ Problemas Identificados:

- Canvas não ocupava espaço central corretamente
- Zoom aplicado apenas internamente no Fabric.js, não no container
- Maximização inexistente do workspace
- Borda visual não implementada
- Sobreposição de elementos da UI
- Compilação com erros TypeScript

---

## 📋 REQUISITOS BASEADOS NAS INSTRUÇÕES DO CHATGPT

### 🎯 Sistema de Zoom Estilo Photoshop:

1. **Canvas deve abrir ajustado à tela**: Ocupando no máximo 80% da largura/altura visível
2. **Zoom inicial**: 33% ou 50% do tamanho real, dependendo do tamanho da janela
3. **Zoom suave**: Scroll do mouse + botões para zoom-in/zoom-out
4. **Qualidade mantida**: Texto e imagens nítidos em qualquer nível de zoom
5. **Canvas real em alta resolução**: Criado no tamanho real, mas exibido em escala menor

### 🎨 Configurações Específicas:

- **Formato padrão**: Cover Art 2000x2000px
- **Ocupação workspace**: 90% do espaço disponível (fit to screen default)
- **Zoom inicial**: 50% com opção de alteração
- **Sistema híbrido**: Fabric.js para qualidade + CSS para visualização

---

## 🔍 ANÁLISE DO CÓDIGO ATUAL (V1.3.0.c.8)

### 📦 Imports e Dependências:

```typescript
// Fabric.js - Sistema de canvas
declare const fabric: {
  Canvas: any;
  IText: any;
  Image: any;
  Group: any;
  Rect: any;
  Circle: any;
  Triangle: any;
  Object: any;
};

// React Hooks utilizados
import React, { useState, useRef, useCallback, useEffect } from "react";

// Hook personalizado para zoom/pan (ATUALMENTE FUNCIONAL)
import { useCanvasZoomPan } from "../hooks/useCanvasZoomPan";

// Componentes UI
import {
  MousePointer,
  Move,
  Type,
  ImageIcon,
  Square,
  Circle,
  Triangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";

// Fontes Freepik (sistema funcional)
import { freepikFonts, FreepikFont } from "../constants/freepikFontsFixed";
```

### 🎛️ Estados Relacionados ao Canvas e Zoom:

```typescript
// Estados do canvas
const [selectedFormat, setSelectedFormat] = useState("instagram-post"); // DEVE SER 'cover-art'
const [canvasBackground, setCanvasBackground] = useState("transparent");

// Sistema de zoom ATUAL (funcional)
const [currentZoom, setCurrentZoom] = useState(1);
const zoomPanControls = useCanvasZoomPan({
  canvasRef,
  containerRef,
  minZoom: 0.1,
  maxZoom: 5,
  zoomStep: 0.1,
});

// Extrair controles de zoom (FUNCIONAL)
const { zoom, panX, panY, zoomIn, zoomOut, fitToScreen } = zoomPanControls;
```

### 🏗️ Inicialização do Canvas (ÁREA CRÍTICA):

```typescript
// Initialize Fabric.js canvas
useEffect(() => {
  if (!canvasRef.current || fabricCanvasRef.current) return;

  // Garante que o fabric está disponível
  if (typeof fabric === "undefined") {
    console.error("Fabric.js não está carregado!");
    return;
  }

  // Calcular dimensões iniciais baseadas no formato selecionado
  const formatDimensions: {
    [key: string]: { width: number; height: number };
  } = {
    "instagram-post": { width: 1080, height: 1080 },
    "instagram-story": { width: 1080, height: 1920 },
    "facebook-post": { width: 1200, height: 630 },
    "twitter-post": { width: 1024, height: 512 },
    "linkedin-post": { width: 1200, height: 627 },
    "youtube-thumbnail": { width: 1280, height: 720 },
    "a4-print": { width: 2480, height: 3508 },
    "business-card": { width: 1050, height: 600 },
    banner: { width: 1500, height: 500 },
    custom: { width: 800, height: 600 },
    // ADICIONAR: 'cover-art': { width: 2000, height: 2000 }
  };

  const dimensions = formatDimensions[selectedFormat] || {
    width: 800,
    height: 600,
  };

  // PROBLEMA: Escala inicial aplicada no tamanho do canvas, não na visualização
  const maxWidth = Math.min(window.innerWidth * 0.5, 800);
  const maxHeight = Math.min(window.innerHeight * 0.7, 600);
  const scaleX = maxWidth / dimensions.width;
  const scaleY = maxHeight / dimensions.height;
  const initialScale = Math.min(scaleX, scaleY, 0.8);

  const canvasWidth = Math.max(400, dimensions.width * initialScale);
  const canvasHeight = Math.max(300, dimensions.height * initialScale);

  // SOLUÇÃO NECESSÁRIA: Canvas em tamanho real, zoom aplicado separadamente
}, [selectedFormat]);
```

### 🔧 Funções de Zoom (FUNCIONAIS, MAS PRECISAM AJUSTE):

```typescript
// Zoom handlers - Zoom do wrapper inteiro, incluindo contorno
const handleZoomIn = () => {
  if (!canvasRef.current || !containerRef.current) return;
  const newZoom = Math.min(currentZoom * 1.1, 5);
  console.log(
    `🔍 Zoom In: ${Math.round(currentZoom * 100)}% → ${Math.round(
      newZoom * 100
    )}%`
  );
  setCurrentZoom(newZoom);
};

const handleZoomOut = () => {
  if (!canvasRef.current || !containerRef.current) return;
  const newZoom = Math.max(currentZoom * 0.9, 0.1);
  console.log(
    `🔍 Zoom Out: ${Math.round(currentZoom * 100)}% → ${Math.round(
      newZoom * 100
    )}%`
  );
  setCurrentZoom(newZoom);
};

const handleFitToScreen = () => {
  if (!canvasRef.current || !containerRef.current) return;
  console.log("📐 Ajustando canvas à tela");

  const canvasElement = canvasRef.current;
  const container = containerRef.current;
  const containerRect = container.getBoundingClientRect();

  // Obter dimensões reais do canvas (não escalado)
  const canvasWidth = canvasElement.width;
  const canvasHeight = canvasElement.height;

  // Calcular escala para caber no container
  const scaleX = (containerRect.width * 0.8) / canvasWidth;
  const scaleY = (containerRect.height * 0.8) / canvasHeight;
  const newZoom = Math.min(scaleX, scaleY, 1);

  setCurrentZoom(newZoom);
  console.log(`📐 Zoom ajustado: ${Math.round(newZoom * 100)}%`);
};
```

### 🖱️ Zoom com Scroll (FUNCIONAL):

```typescript
// Adicionar suporte para zoom com wheel (scroll do mouse)
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    // Só aplicar zoom se estiver com Ctrl pressionado
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();

      const delta = e.deltaY;
      const zoomFactor = delta > 0 ? 0.9 : 1.1;
      const newZoom = Math.min(Math.max(currentZoom * zoomFactor, 0.1), 5);

      if (newZoom !== currentZoom) {
        console.log(
          `🖱️ Zoom wheel: ${Math.round(currentZoom * 100)}% → ${Math.round(
            newZoom * 100
          )}%`
        );
        setCurrentZoom(newZoom);
      }
    }
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }
}, [currentZoom]);
```

---

## 🏗️ ESTRUTURA JSX DO WORKSPACE (ÁREA CRÍTICA)

### 📋 Layout Principal:

```tsx
return (
  <div
    className="h-screen flex flex-col text-white"
    style={{ backgroundColor: "#282828" }}
  >
    {/* Top Menu Bar */}
    <div className="h-12 bg-[#1e1e1e] border-b border-[#4a4a4a] flex items-center px-4">
      {/* Barra de ferramentas superior */}
    </div>

    {/* Main Content */}
    <div className="flex flex-1 min-h-0">
      {/* Left Toolbar */}
      <div className="w-16 bg-[#2a2a2a] border-r border-[#4a4a4a] flex flex-col py-2">
        {/* Ferramentas laterais */}
      </div>

      {/* Canvas Area - ÁREA PROBLEMÁTICA */}
      <div className="flex-1 relative" style={{ backgroundColor: "#383838" }}>
        <div
          ref={containerRef}
          className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
        >
          {/* PROBLEMA: Canvas aplicado com transform CSS diretamente */}
          <div
            className="relative bg-white shadow-lg"
            style={{
              transform: `scale(${currentZoom})`,
              transformOrigin: "center",
              transition: "transform 0.1s ease-out",
            }}
          >
            {/* Canvas com borda (padrão checkerboard) */}
            <div
              className="relative"
              style={{
                background: `url("data:image/svg+xml;base64,${checkerboardPattern}") repeat`,
                backgroundSize: "20px 20px",
              }}
            >
              <canvas
                ref={canvasRef}
                className="block border-2 border-gray-400"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>

        {/* Canvas Controls */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/50 rounded-lg px-3 py-2">
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white min-w-[50px] text-center">
            {Math.round(currentZoom * 100)}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleFitToScreen}>
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-[#2a2a2a] border-l border-[#4a4a4a] flex flex-col">
        {/* Painel de propriedades */}
      </div>
    </div>
  </div>
);
```

---

## 🎯 HOOK useCanvasZoomPan (FUNCIONAL - NÃO ALTERAR)

### 📄 Localização: `src/hooks/useCanvasZoomPan.ts`

```typescript
// ESTE HOOK ESTÁ FUNCIONAL E NÃO DEVE SER ALTERADO
// Ele fornece controles de zoom e pan que funcionam corretamente
export const useCanvasZoomPan = ({
  canvasRef,
  containerRef,
  minZoom = 0.1,
  maxZoom = 5,
  zoomStep = 0.1,
}) => {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  const fitToScreen = useCallback(() => {
    // Lógica de fit-to-screen
  }, []);

  return { zoom, panX, panY, zoomIn, zoomOut, fitToScreen };
};
```

---

## 🔧 BIBLIOTECAS E DEPENDÊNCIAS

### 📦 Fabric.js:

- **Versão**: Latest
- **Uso**: Sistema de canvas e manipulação de objetos
- **Problema**: Zoom aplicado incorretamente (interno vs externo)

### ⚛️ React Hooks:

- `useState`: Estados do componente
- `useRef`: Referências DOM (canvasRef, containerRef)
- `useCallback`: Otimização de funções
- `useEffect`: Efeitos colaterais e inicialização

### 🎨 Lucide React:

- Ícones da interface (ZoomIn, ZoomOut, Maximize, etc.)

### 🧩 Componentes UI:

- Button, Slider, Select, Tabs, Label, Input
- **Status**: Funcionais

---

## 🎯 SOLUÇÃO PROPOSTA (BASEADA NAS INSTRUÇÕES)

### 1. **Canvas em Tamanho Real**:

```typescript
// Canvas criado no tamanho real (ex: 2000x2000px)
const canvas = new fabric.Canvas(canvasRef.current, {
  width: 2000, // Tamanho real
  height: 2000, // Tamanho real
  // ... outras configurações
});
```

### 2. **Zoom via CSS no Container**:

```typescript
// Aplicar zoom no wrapper, não no canvas
<div
  style={{
    transform: `scale(${zoomLevel})`,
    transformOrigin: "center",
  }}
>
  <canvas ref={canvasRef} />
</div>
```

### 3. **Cálculo de Zoom Inicial**:

```typescript
// Calcular zoom para caber na tela (80% da largura/altura)
const containerWidth = containerRef.current.clientWidth;
const containerHeight = containerRef.current.clientHeight;

const maxDisplayWidth = containerWidth * 0.8;
const maxDisplayHeight = containerHeight * 0.8;

const zoomX = maxDisplayWidth / canvasWidth;
const zoomY = maxDisplayHeight / canvasHeight;
const initialZoom = Math.min(zoomX, zoomY, 1);
```

### 4. **Sistema Híbrido**:

- **Fabric.js**: Manter em zoom 1 para qualidade
- **CSS Transform**: Aplicar zoom visual no container

---

## 📝 CHECKLIST PARA IMPLEMENTAÇÃO

### ✅ Fase 1 - Preparação:

- [ ] Fazer backup da versão V1.3.0.c.8 funcional
- [ ] Criar branch separada para desenvolvimento
- [ ] Validar que versão atual compila sem erros

### ✅ Fase 2 - Formato Cover Art:

- [ ] Alterar formato padrão para 'cover-art'
- [ ] Adicionar dimensões 2000x2000px
- [ ] Testar mudança de formato

### ✅ Fase 3 - Sistema de Zoom:

- [ ] Implementar canvas em tamanho real
- [ ] Aplicar zoom via CSS no container
- [ ] Calcular zoom inicial (50% default)
- [ ] Testar zoom in/out/fit-to-screen

### ✅ Fase 4 - Centralização:

- [ ] Implementar centralização do canvas no workspace
- [ ] Garantir ocupação de 90% do espaço disponível
- [ ] Adicionar borda visual conforme solicitado

### ✅ Fase 5 - Testes:

- [ ] Testar qualidade de texto em diferentes zooms
- [ ] Validar responsividade
- [ ] Verificar atalhos de teclado (Ctrl + / Ctrl -)
- [ ] Testar scroll do mouse para zoom

---

## ⚠️ PONTOS DE ATENÇÃO

### 🔥 Críticos:

1. **NÃO alterar o hook useCanvasZoomPan** - está funcional
2. **Manter sistema de fontes Freepik** - está funcionando perfeitamente
3. **Testar cada alteração** antes de prosseguir para próxima
4. **Fazer backup** antes de cada grande modificação

### 🧪 Para Testes:

1. Verificar se texto permanece nítido em todos os zooms
2. Validar que canvas não "suma" ou fica cortado
3. Confirmar que painéis laterais não são sobrepostos
4. Testar mudança de formatos

---

## 📋 ESTRUTURA DE ARQUIVOS RELEVANTES

```
TemplateLibraryBuilder/
├── client/src/pages/PhotoEditorFixed.tsx (ARQUIVO PRINCIPAL)
├── client/src/hooks/useCanvasZoomPan.ts (NÃO ALTERAR)
├── client/src/constants/freepikFontsFixed.ts (NÃO ALTERAR)
├── client/src/components/ui/ (COMPONENTES UI)
└── public/fonts/freepik/ (FONTES - NÃO ALTERAR)
```

---

## 🎯 OBJETIVO FINAL

**Implementar sistema de zoom estilo Photoshop que:**

- Abre canvas Cover Art 2000x2000px em 50% do tamanho real
- Ocupa 90% do workspace disponível
- Mantém qualidade em qualquer zoom
- Centraliza perfeitamente no workspace
- Não interfere nos painéis laterais
- Funciona com scroll do mouse + atalhos

**Status Atual**: V1.3.0.c.8 funcional, pronto para refatoração incremental
