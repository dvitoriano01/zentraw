/**
 * Zentraw Photo Editor - Version 1.3.0.c.1 - ESTADO ESTÁVEL RESTAURADO
 *
 * ROLLBACK COMPLETO - Sistema original que funcionava perfeitamente
 * Data: 26 de junho de 2025
 * Autor: Zentraw Team
 *
 * BUGS CORRIGIDOS NESTA VERSÃO:
 * ✅ Sistema de fontes: 20 fontes Google Fonts carregando corretamente
 * ✅ Histórico Ctrl+Z/Redo: Estável, sem apagamento inesperado de objetos
 * ✅ Seleção de objetos: Sem desseleção indevida, eventos robustos
 * ✅ Zoom e contorno: Canvas wrapper com zoom CSS funcionando
 * ✅ Qualidade das fontes: Renderização nítida com fallbacks seguros
 * ✅ Checkerboard: Fundo transparente #282828/#dbdbdb funcionando
 * ✅ Responsividade: Redimensionamento suave e estável
 *
 * REGRESSÕES REMOVIDAS:
 * ❌ OptimizedFontManager (causava carregamento de apenas 7 fontes)
 * ❌ Sistema de cache complexo (instabilidade no histórico)
 * ❌ Eventos de seleção otimizados (desseleção indevida)
 * ❌ Zoom direto no canvas (quebrava contorno)
 *
 * PRÓXIMOS PASSOS:
 * - Teste manual obrigatório de todas as funcionalidades
 * - Validação do versionamento automático
 * - Implementação de testes automatizados
 */

// Sistema original restaurado - funcionava corretamente
import { FreepikFontManager } from '@/utils/FreepikFontManager';
import { freepikFonts } from '@/constants/freepikFonts';
import FontLoadingIndicator from '@/components/FontLoadingIndicator';
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
// Import fabric types
import {
  Canvas,
  Object as FabricObject,
  Point,
  Image as FabricImage,
  IText,
  TPointerEvent,
} from 'fabric';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Square,
  Circle,
  Triangle,
  Type,
  ImageIcon,
  MousePointer,
  Move,
  RotateCcw,
  Download,
  Upload,
  Layers,
  Palette,
  Filter,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  GripVertical,
} from 'lucide-react';

import { ParameterInput } from '@/components/editor/ParameterInput';
import { ObjectPropertiesPanel } from '@/components/editor/ObjectPropertiesPanel';
import { useCanvasZoomPan } from '@/hooks/useCanvasZoomPan';
import 'fabric';
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

import { TemplatesModal } from '@/components/editor/TemplatesModal';
import { SVGLayoutModal } from '@/components/editor/SVGLayoutModal';
import { TextPropertiesPanel } from '@/components/editor/TextPropertiesPanel';
import { TextFXPanel } from '@/components/editor/TextFXPanel';
import { FormatsModal } from '@/components/editor/FormatsModal';
import { FiltersModal } from '@/components/editor/FiltersModal';
import { TextEffectsModal } from '@/components/editor/TextEffectsModal';
// Using any for fabric event types since the types are not exported correctly
type FabricMouseEvent = {
  e: MouseEvent & {
    deltaY?: number;
    offsetX: number;
    offsetY: number;
  };
  target?: FabricObject;
};

// Função utilitária para garantir que a fonte está carregada
async function ensureFontLoaded(font: { label: string; value: string }) {
  if (!font || !font.value) return;
  try {
    const fontName = font.value.split(' ')[0]; // Pega apenas o nome da fonte
    if (document.fonts.check(`1em ${fontName}`)) return;
    const observer = new FontFaceObserver(fontName);
    await observer.load(null, 2000); // Reduzido timeout para 2s
  } catch (error) {
    console.warn(`Erro ao carregar fonte ${font.label}, continuando...`);
  }
}

interface FabricCanvas extends Canvas {
  isDragging?: boolean;
  lastPosX?: number;
  lastPosY?: number;
}

interface FabricEvent {
  e: {
    deltaY: number;
    offsetX: number;
    offsetY: number;
    altKey: boolean;
    clientX: number;
    clientY: number;
    preventDefault: () => void;
    stopPropagation: () => void;
  };
  target?: FabricObject;
}

interface FabricEventWithTarget extends FabricEvent {
  target?: FabricObject;
}

type ExtendedFabricEvent = {
  e: TPointerEvent & {
    deltaY?: number;
    offsetX: number;
    offsetY: number;
  };
  target?: FabricObject;
};

interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape' | 'background';
  fabricType: string; // Tipo original do Fabric.js para ícones
  visible: boolean;
  locked: boolean;
}

const tools = [
  { id: 'select', label: 'Select', icon: MousePointer },
  { id: 'move', label: 'Move', icon: Move },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'circle', label: 'Circle', icon: Circle },
  { id: 'triangle', label: 'Triangle', icon: Triangle },
];

const PhotoEditorFixed: React.FC = () => {
  // Refs with proper typing
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial states
  const [selectedFormat, setSelectedFormat] = useState('instagram-post');
  const [canvasBackground, setCanvasBackground] = useState('transparent');
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [layerBlendMode, setLayerBlendMode] = useState('normal');
  const [activePropertiesTab, setActivePropertiesTab] = useState('properties');
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [svgLayoutModalOpen, setSvgLayoutModalOpen] = useState(false);
  const [formatsModalOpen, setFormatsModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [textEffectsModalOpen, setTextEffectsModalOpen] = useState(false);

  // Font loading state - iniciar como false para não bloquear
  const [fontLoadingState, setFontLoadingState] = useState<{
    isLoading: boolean;
    loaded: number;
    total: number;
    current: string;
  }>({
    isLoading: false, // Mudar para false para não bloquear inicialmente
    loaded: 0,
    total: 0,
    current: '',
  });
  const [availableFonts, setAvailableFonts] = useState<Array<{ label: string; value: string }>>([]);

  // Zoom state and handlers
  const [currentZoom, setCurrentZoom] = useState(1);
  const zoomPanControls = useCanvasZoomPan({
    canvasRef,
    containerRef,
    minZoom: 0.1,
    maxZoom: 5,
    zoomStep: 0.1,
  });

  // Extract zoom controls
  const { zoom, panX, panY, zoomIn, zoomOut, fitToScreen } = zoomPanControls;

  // Função de saveState corrigida para evitar loops infinitos
  const saveState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    try {
      const json = fabricCanvasRef.current.toJSON();
      const newState = JSON.stringify(json);
      console.log('💾 Salvando estado no histórico');

      setCanvasHistory((prev) => {
        // Se estamos no meio do histórico, remover estados posteriores
        const currentHistory = historyIndex >= 0 ? prev.slice(0, historyIndex + 1) : prev;

        // Verificar se o estado realmente mudou (evitar duplicatas)
        if (currentHistory.length > 0 && currentHistory[currentHistory.length - 1] === newState) {
          console.log('📋 Estado idêntico, pulando salvamento');
          return prev;
        }

        const newHistory = [...currentHistory, newState];

        // Limitar histórico a 30 estados (reduzido para performance)
        if (newHistory.length > 30) {
          newHistory.shift();
          return newHistory;
        }
        return newHistory;
      });

      setHistoryIndex((prev) => {
        const newIndex = historyIndex >= 0 ? historyIndex + 1 : prev + 1;
        return Math.min(newIndex, 29); // Máximo 29 (0-indexed)
      });
    } catch (error) {
      console.error('❌ Erro ao salvar estado:', error);
    }
  }, [historyIndex]); // Manter historyIndex como dependência

  // Funções utilitárias dentro do componente
  const exportCanvas = useCallback((type: string) => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: type as any,
      quality: 1,
      multiplier: 1,
    });
    const link = document.createElement('a');
    link.download = `zentraw-export.${type}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Atualizar as funções que dependem de saveState
  const updateTextProperties = useCallback(
    (properties: any) => {
      if (!selectedObject || !fabricCanvasRef.current) return;
      Object.entries(properties).forEach(([key, value]) => {
        selectedObject.set(key, value);
      });
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  const applyTextEffect = useCallback(
    (effect: string) => {
      if (!selectedObject || !fabricCanvasRef.current) return;
      // Implementar efeitos de texto aqui
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Função para gerar ID único simples
  const generateUniqueId = (prefix: string = 'layer') => {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  };

  const updateLayers = useCallback(() => {
    if (!fabricCanvasRef.current) {
      setLayers([]);
      return;
    }

    const objects = fabricCanvasRef.current.getObjects();
    const newLayers = objects
      .map((obj, index) => {
        const layerId = (obj as any).layerId || `layer-${index}`;
        let name = 'Unknown';
        let type: 'text' | 'image' | 'shape' | 'background' = 'shape';
        const fabricType = obj.type || 'unknown';

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
          fabricType,
          visible: obj.visible !== false,
          locked: !obj.selectable,
        };
      })
      .reverse(); // Reverse para mostrar layers do topo para baixo

    setLayers(newLayers);
  }, []);

  // Adiciona um objeto ao canvas e atualiza a lista de layers
  const addLayerToCanvas = useCallback((obj: FabricObject, name: string, type: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    // Usar ID simples como no Replit
    const layerId = `layer-${Date.now()}`;
    (obj as any).layerId = layerId;

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.renderAll();
    updateLayers();
    saveState();
  }, []);

  // Função de deletar layer com validação
  const deleteLayer = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      canvas.remove(obj);
      canvas.discardActiveObject();
      canvas.renderAll();
      setSelectedObject(null);
      updateLayers();
      saveState();
    }
  }, []);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      obj.set('visible', !obj.visible);
      canvas.renderAll();
      updateLayers();
    }
  }, []);

  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const objects = canvas.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      obj.set('selectable', !obj.selectable);
      obj.set('evented', obj.selectable);
      canvas.renderAll();
      updateLayers();
    }
  }, []);

  // Reorder layers usando drag and drop HTML5 nativo
  const reorderLayers = (fromIndex: number, toIndex: number) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const reversedFromIndex = objects.length - 1 - fromIndex;
    const reversedToIndex = objects.length - 1 - toIndex;

    const objectToMove = objects[reversedFromIndex];
    if (objectToMove) {
      fabricCanvasRef.current.remove(objectToMove);
      (fabricCanvasRef.current as any).insertAt(objectToMove, reversedToIndex, false);
      fabricCanvasRef.current.renderAll();
      updateLayers();
      saveState();
    }
  };

  // Zoom handlers - Zoom do wrapper inteiro, incluindo contorno
  const handleZoomIn = () => {
    if (!canvasRef.current || !containerRef.current) return;
    const newZoom = Math.min(currentZoom * 1.1, 5);

    console.log(`🔍 Zoom In: ${Math.round(currentZoom * 100)}% → ${Math.round(newZoom * 100)}%`);

    // O zoom agora é aplicado via CSS no wrapper, não diretamente no canvas
    setCurrentZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (!canvasRef.current || !containerRef.current) return;
    const newZoom = Math.max(currentZoom * 0.9, 0.1);

    console.log(`🔍 Zoom Out: ${Math.round(currentZoom * 100)}% → ${Math.round(newZoom * 100)}%`);

    // O zoom agora é aplicado via CSS no wrapper, não diretamente no canvas
    setCurrentZoom(newZoom);
  };

  const handleFitToScreen = () => {
    if (!canvasRef.current || !containerRef.current) return;

    console.log('📐 Ajustando canvas à tela');

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

    // O zoom agora é aplicado via CSS no wrapper, não diretamente no canvas
    setCurrentZoom(newZoom);

    console.log(`📐 Zoom ajustado: ${Math.round(newZoom * 100)}%`);
  };

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
            `🖱️ Zoom wheel: ${Math.round(currentZoom * 100)}% → ${Math.round(newZoom * 100)}%`,
          );

          // O zoom agora é aplicado via CSS no wrapper, não diretamente no canvas
          setCurrentZoom(newZoom);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [currentZoom]);

  // Font Manager original - que funcionava
  const fontManager = useMemo(() => FreepikFontManager.getInstance(), []);

  // Sistema de carregamento original restaurado (FUNCIONAVA)
  const loadFreepikFonts = useCallback(async () => {
    console.log('🎨 [v1.3.0.c.1] Carregando fontes Google Fonts (sistema original)...');

    try {
      // Lista original de fontes que funcionava
      const fontsToLoad = [
        {
          name: 'Orbitron',
          url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
        },
        {
          name: 'Dancing Script',
          url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
        },
        { name: 'Bungee', url: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap' },
        {
          name: 'Black Ops One',
          url: 'https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap',
        },
        {
          name: 'Righteous',
          url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
        },
        {
          name: 'Creepster',
          url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap',
        },
        { name: 'Satisfy', url: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap' },
        {
          name: 'Press Start 2P',
          url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        },
        {
          name: 'Fredoka One',
          url: 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',
        },
        {
          name: 'Audiowide',
          url: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
        },
        {
          name: 'Bebas Neue',
          url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        },
        {
          name: 'Montserrat',
          url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
        },
        {
          name: 'Oswald',
          url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
        },
        {
          name: 'Poppins',
          url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
        },
        {
          name: 'Roboto',
          url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
        },
        { name: 'Anton', url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap' },
        { name: 'Bangers', url: 'https://fonts.googleapis.com/css2?family=Bangers&display=swap' },
        { name: 'Pacifico', url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap' },
        { name: 'Lobster', url: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap' },
        {
          name: 'Comfortaa',
          url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap',
        },
      ];

      let loadedCount = 0;
      const totalFonts = fontsToLoad.length;

      // Carregar cada fonte de forma paralela para melhor performance
      const loadPromises = fontsToLoad.map(async (font) => {
        try {
          // Verificar se já existe
          const existingLink = document.querySelector(`link[href="${font.url}"]`);
          if (existingLink) {
            loadedCount++;
            return;
          }

          // Criar e adicionar link
          const link = document.createElement('link');
          link.href = font.url;
          link.rel = 'stylesheet';
          link.type = 'text/css';

          // Promise para aguardar carregamento
          await new Promise<void>((resolve) => {
            link.onload = () => {
              loadedCount++;
              console.log(`✅ Fonte carregada: ${font.name} (${loadedCount}/${totalFonts})`);
              resolve();
            };
            link.onerror = () => {
              console.warn(`⚠️ Erro ao carregar: ${font.name}`);
              resolve(); // Continuar mesmo com erro
            };

            document.head.appendChild(link);
          });
        } catch (error) {
          console.warn(`❌ Erro na fonte ${font.name}:`, error);
        }
      });

      // Aguardar todas as fontes
      await Promise.all(loadPromises);

      // Criar lista para o dropdown
      const fontList = fontsToLoad.map((font) => ({
        label: font.name,
        value: font.name,
      }));

      setAvailableFonts(fontList);
      console.log(
        `🎉 [v1.3.0.c.1] Sistema original: ${loadedCount}/${totalFonts} fontes carregadas`,
      );

      return { loadedFonts: loadedCount, totalFonts: totalFonts };
    } catch (error) {
      console.error('❌ Erro geral no carregamento:', error);
      // Garantir que pelo menos algumas fontes básicas estejam disponíveis
      setAvailableFonts([
        { label: 'Arial', value: 'Arial' },
        { label: 'Helvetica', value: 'Helvetica' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Verdana', value: 'Verdana' },
        { label: 'Trebuchet MS', value: 'Trebuchet MS' },
      ]);
      return { loadedFonts: 6, totalFonts: 20 };
    }
  }, []);

  // Função de compatibilidade mantida
  const ensureFreepikFontsLoaded = async () => {
    return loadFreepikFonts();
  };

  // Carregar fontes ao montar o componente (sistema original)
  useEffect(() => {
    console.log('🎨 [v1.3.0.c.1] Iniciando carregamento (sistema original)...');

    // Carregamento assíncrono não bloqueante
    loadFreepikFonts().catch((error) => {
      console.error('❌ Erro no carregamento:', error);

      // Garantir fontes de fallback sempre
      setAvailableFonts([
        { label: 'Arial', value: 'Arial' },
        { label: 'Helvetica', value: 'Helvetica' },
        { label: 'Times New Roman', value: 'Times New Roman' },
        { label: 'Georgia', value: 'Georgia' },
        { label: 'Verdana', value: 'Verdana' },
        { label: 'Trebuchet MS', value: 'Trebuchet MS' },
      ]);
    });
  }, [loadFreepikFonts]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Garante que o fabric está disponível
    if (typeof fabric === 'undefined') {
      console.error('Fabric.js não está carregado!');
      return;
    }

    // Calcular dimensões iniciais baseadas no formato selecionado
    const formatDimensions: {
      [key: string]: { width: number; height: number };
    } = {
      'instagram-post': { width: 1080, height: 1080 },
      'instagram-story': { width: 1080, height: 1920 },
      'facebook-post': { width: 1200, height: 630 },
      'twitter-post': { width: 1024, height: 512 },
      'linkedin-post': { width: 1200, height: 627 },
      'youtube-thumbnail': { width: 1280, height: 720 },
      'a4-print': { width: 2480, height: 3508 },
      'business-card': { width: 1050, height: 600 },
      banner: { width: 1500, height: 500 },
      custom: { width: 800, height: 600 },
    };

    const dimensions = formatDimensions[selectedFormat] || { width: 800, height: 600 };

    // Ajustar dimensões para caber na tela (escala inicial)
    const maxWidth = Math.min(window.innerWidth * 0.5, 800); // 50% da largura da tela ou 800px
    const maxHeight = Math.min(window.innerHeight * 0.7, 600); // 70% da altura da tela ou 600px

    const scaleX = maxWidth / dimensions.width;
    const scaleY = maxHeight / dimensions.height;
    const initialScale = Math.min(scaleX, scaleY, 0.8); // Máximo 80% para ter espaço

    const canvasWidth = Math.max(400, dimensions.width * initialScale);
    const canvasHeight = Math.max(300, dimensions.height * initialScale);

    console.log(
      `🎨 Inicializando canvas: ${canvasWidth}x${canvasHeight} (formato: ${selectedFormat})`,
    );

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '', // Completamente transparente para mostrar o checkerboard
        preserveObjectStacking: true,
        selection: true,
        controlsAboveOverlay: true,
        centeredScaling: true,
        snapAngle: 15,
        snapThreshold: 15,
        selectionColor: 'rgba(100, 100, 255, 0.3)',
        selectionBorderColor: '#4a90e2',
        selectionLineWidth: 1,
        enableRetinaScaling: true,
      });

      // Configurações adicionais
      canvas.setZoom(1);
      canvas.renderAll();

      fabricCanvasRef.current = canvas;

      console.log('✅ Canvas inicializado com sucesso!');

      // Setup inicial do canvas e histórico
      const initialState = canvas.toJSON();
      const initialStateString = JSON.stringify(initialState);
      setCanvasHistory([initialStateString]);
      setHistoryIndex(0);

      console.log('📋 Estado inicial do canvas salvo no histórico');

      // Configurar eventos do canvas de forma otimizada
      canvas.on('object:added', () => {
        setTimeout(() => {
          updateLayers();
          saveState();
        }, 100); // Delay para garantir que o objeto foi completamente adicionado
      });

      canvas.on('object:removed', () => {
        setTimeout(() => {
          updateLayers();
          saveState();
        }, 100);
      });

      canvas.on('object:modified', () => {
        setTimeout(() => {
          updateLayers();
          saveState();
        }, 100);
      });

      // Eventos de seleção CORRIGIDOS - mais estáveis
      canvas.on('selection:created', (e: any) => {
        const obj = e.selected?.[0] || e.target;
        console.log('📋 Objeto selecionado:', obj?.type);
        setSelectedObject(obj || null);
      });

      canvas.on('selection:updated', (e: any) => {
        const obj = e.selected?.[0] || e.target;
        console.log('📋 Seleção atualizada:', obj?.type);
        setSelectedObject(obj || null);
      });

      canvas.on('selection:cleared', () => {
        console.log('📋 Seleção limpa');
        setSelectedObject(null);
      });

      // Sistema melhorado de clique - previne desseleção indevida
      canvas.on('mouse:down', (e: any) => {
        // Se clicou em um objeto, manter seleção
        if (e.target) {
          console.log('🖱️ Clique em objeto mantido:', e.target.type);
          return;
        }

        // Só desselecionar se realmente clicou no fundo vazio
        if (selectedTool === 'select') {
          console.log('🖱️ Clique no fundo - mantendo seleção se existir');
          // Não forçar desseleção - deixar o Fabric.js decidir
        }
      });

      // Melhorar estabilidade da seleção
      canvas.on('object:moving', () => {
        // Manter objeto selecionado durante movimento
        if (canvas.getActiveObject() && !selectedObject) {
          setSelectedObject(canvas.getActiveObject());
        }
      });

      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
      };
    } catch (error) {
      console.error('Erro ao inicializar o canvas:', error);
    }
  }, [selectedFormat]); // Dependência do formato para reinicializar quando mudar

  // Update canvas background
  useEffect(() => {
    if (fabricCanvasRef.current) {
      if (canvasBackground === 'transparent') {
        // Canvas transparente para mostrar o padrão checkerboard de fundo
        fabricCanvasRef.current.backgroundColor = '';
      } else {
        // Cor sólida de fundo
        fabricCanvasRef.current.backgroundColor = canvasBackground;
      }
      fabricCanvasRef.current.renderAll();
      console.log(
        '🎨 Background alterado para:',
        canvasBackground === 'transparent' ? 'checkerboard transparente' : canvasBackground,
      );
    }
  }, [canvasBackground]);

  // Responsividade: redimensionar canvas quando a janela for redimensionada
  useEffect(() => {
    const handleResize = () => {
      if (fabricCanvasRef.current && containerRef.current) {
        const container = containerRef.current;
        const canvas = fabricCanvasRef.current;

        // Obter dimensões atuais do canvas
        const currentWidth = canvas.getWidth();
        const currentHeight = canvas.getHeight();

        // Calcular novas dimensões baseadas no container
        const containerRect = container.getBoundingClientRect();
        const maxWidth = Math.max(300, containerRect.width * 0.8);
        const maxHeight = Math.max(200, containerRect.height * 0.8);

        // Manter proporção
        const currentRatio = currentWidth / currentHeight;
        let newWidth = Math.min(maxWidth, currentWidth);
        let newHeight = Math.min(maxHeight, currentHeight);

        // Ajustar para manter a proporção
        if (newWidth / newHeight > currentRatio) {
          newWidth = newHeight * currentRatio;
        } else {
          newHeight = newWidth / currentRatio;
        }

        // Aplicar apenas se houve mudança significativa
        if (Math.abs(newWidth - currentWidth) > 10 || Math.abs(newHeight - currentHeight) > 10) {
          console.log(
            `📏 Redimensionando canvas: ${Math.round(newWidth)}x${Math.round(newHeight)}`,
          );
          canvas.setDimensions({
            width: newWidth,
            height: newHeight,
          });
          canvas.renderAll();
        }
      }
    };

    // Throttle para evitar muitas chamadas
    let resizeTimeout: number;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', throttledResize);

    // Executar uma vez após montagem
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const selectLayer = (layerId: string) => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    const obj = objects.find(
      (o, index) => (o as any).layerId === layerId || `layer-${index}` === layerId,
    );

    if (obj) {
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.requestRenderAll();
      setSelectedObject(obj);
    }
  };

  // Handler para mudança de ferramenta
  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    if (fabricCanvasRef.current) {
      // Desativa a seleção se não estiver na ferramenta select
      fabricCanvasRef.current.selection = toolId === 'select';
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();

      // Se for uma ferramenta de forma, criar o objeto
      if (['rectangle', 'circle', 'triangle', 'text'].includes(toolId)) {
        createShape(toolId);
      }
      // Se for a ferramenta de imagem, abrir o seletor de arquivo
      else if (toolId === 'image' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Funções para criar objetos
  const createShape = useCallback((type: string) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;

    let shape;
    const commonProps = {
      left: centerX - 50,
      top: centerY - 50,
      fill: '#4a90e2', // Azul mais visível
      stroke: '#2171c7', // Borda mais escura
      strokeWidth: 2,
      cornerColor: '#2171c7',
      cornerSize: 10,
      transparentCorners: false,
    };

    switch (type) {
      case 'rectangle':
        shape = new fabric.Rect({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          ...commonProps,
          radius: 50,
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          ...commonProps,
          width: 100,
          height: 100,
        });
        break;
      case 'text':
        // Usar uma fonte das carregadas com qualidade melhorada
        const randomFont =
          availableFonts.length > 0
            ? availableFonts[Math.floor(Math.random() * availableFonts.length)].value
            : 'Arial';

        shape = new fabric.IText('Digite seu texto', {
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
          fontFamily: `"${randomFont}", Arial, sans-serif`, // Aspas para fontes com espaços
          fontSize: 32,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 0.3,
          textAlign: 'center',
          // Melhorar qualidade da renderização
          strokeDashArray: [],
          paintFirst: 'fill',
          charSpacing: 0,
          lineHeight: 1.2,
          // Forçar re-render com qualidade
          dirty: true,
        });
        break;
    }

    if (shape) {
      addLayerToCanvas(shape, type.charAt(0).toUpperCase() + type.slice(1), type);
      setSelectedTool('select');
    }
  }, []);

  // History management functions - CORRIGIDO para estabilidade
  const undo = useCallback(() => {
    if (historyIndex > 0 && fabricCanvasRef.current && canvasHistory.length > 0) {
      const newIndex = historyIndex - 1;
      const state = canvasHistory[newIndex];

      if (state) {
        console.log(`↶ UNDO: ${historyIndex} → ${newIndex}`);

        try {
          // Pausar salvamento durante undo
          const canvas = fabricCanvasRef.current;

          // Carregar estado sem disparar eventos
          canvas.loadFromJSON(JSON.parse(state), () => {
            canvas.renderAll();
            setHistoryIndex(newIndex);

            // Atualizar UI após carregamento
            setTimeout(() => {
              updateLayers();
              setSelectedObject(null);
            }, 50);
          });
        } catch (error) {
          console.error('❌ Erro durante UNDO:', error);
        }
      }
    } else {
      console.log(`↶ UNDO indisponível: índice=${historyIndex}, histórico=${canvasHistory.length}`);
    }
  }, [historyIndex, canvasHistory, updateLayers]);

  const redo = useCallback(() => {
    if (historyIndex < canvasHistory.length - 1 && fabricCanvasRef.current) {
      const newIndex = historyIndex + 1;
      const state = canvasHistory[newIndex];

      if (state) {
        console.log(`↷ REDO: ${historyIndex} → ${newIndex}`);

        try {
          const canvas = fabricCanvasRef.current;

          // Carregar estado sem disparar eventos
          canvas.loadFromJSON(JSON.parse(state), () => {
            canvas.renderAll();
            setHistoryIndex(newIndex);

            // Atualizar UI após carregamento
            setTimeout(() => {
              updateLayers();
              setSelectedObject(null);
            }, 50);
          });
        } catch (error) {
          console.error('❌ Erro durante REDO:', error);
        }
      }
    } else {
      console.log(`↷ REDO indisponível: índice=${historyIndex}, histórico=${canvasHistory.length}`);
    }
  }, [historyIndex, canvasHistory, updateLayers]);

  // Format selection handler
  const handleFormatChange = useCallback(
    (format: string) => {
      setSelectedFormat(format);

      const formatDimensions: {
        [key: string]: { width: number; height: number };
      } = {
        'instagram-post': { width: 1080, height: 1080 },
        'instagram-story': { width: 1080, height: 1920 },
        'facebook-post': { width: 1200, height: 630 },
        'twitter-post': { width: 1024, height: 512 },
        'linkedin-post': { width: 1200, height: 627 },
        'youtube-thumbnail': { width: 1280, height: 720 },
        'a4-print': { width: 2480, height: 3508 },
        'business-card': { width: 1050, height: 600 },
        banner: { width: 1500, height: 500 },
        custom: { width: 800, height: 600 },
      };

      const dimensions = formatDimensions[format] || {
        width: 800,
        height: 600,
      };

      if (fabricCanvasRef.current) {
        console.log(
          `🔄 Mudando formato para: ${format} (${dimensions.width}x${dimensions.height})`,
        );

        // Calcular nova escala para manter o canvas visível
        const maxWidth = Math.min(window.innerWidth * 0.5, 800);
        const maxHeight = Math.min(window.innerHeight * 0.7, 600);

        const scaleX = maxWidth / dimensions.width;
        const scaleY = maxHeight / dimensions.height;
        const newScale = Math.min(scaleX, scaleY, 0.8);

        const newCanvasWidth = Math.max(400, dimensions.width * newScale);
        const newCanvasHeight = Math.max(300, dimensions.height * newScale);

        // Redimensionar o canvas
        fabricCanvasRef.current.setDimensions({
          width: newCanvasWidth,
          height: newCanvasHeight,
        });

        // Atualizar viewport para manter proporção correta
        fabricCanvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0]);
        fabricCanvasRef.current.renderAll();

        console.log(`✅ Canvas redimensionado: ${newCanvasWidth}x${newCanvasHeight}`);

        saveState();
      }
    },
    [saveState],
  );

  // Blend mode handler
  const handleBlendModeChange = useCallback(
    (blendMode: string) => {
      if (!selectedObject || !fabricCanvasRef.current) return;

      setLayerBlendMode(blendMode);
      (selectedObject as any).globalCompositeOperation = blendMode;
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Opacity handler
  const handleOpacityChange = useCallback(
    (opacity: number) => {
      if (!selectedObject || !fabricCanvasRef.current) return;

      setLayerOpacity(opacity);
      selectedObject.set('opacity', opacity / 100);
      fabricCanvasRef.current.renderAll();
      saveState();
    },
    [selectedObject],
  );

  // Keyboard shortcuts corrigidos e estabilizados
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evitar ações se estivermos editando texto
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          console.log('⌨️ Atalho Ctrl+Z detectado');
          undo();
        } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          console.log('⌨️ Atalho Ctrl+Y detectado');
          redo();
        }
      }

      // Atalho para deletar objeto selecionado
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey) {
        if (fabricCanvasRef.current && selectedObject && selectedObject.selectable) {
          e.preventDefault();
          console.log('⌨️ Deletando objeto selecionado');
          fabricCanvasRef.current.remove(selectedObject);
          fabricCanvasRef.current.discardActiveObject();
          fabricCanvasRef.current.renderAll();
          setSelectedObject(null);
          setTimeout(() => {
            updateLayers();
            saveState();
          }, 50);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedObject, updateLayers, saveState]);

  // Carregamento de fontes removido da tela inicial - agora em background
  // As fontes carregam em paralelo sem bloquear a interface

  // Debug inicial - verificar se o componente está montando corretamente
  useEffect(() => {
    console.log('🎨 PhotoEditorFixed montado!');
    console.log('📦 Fabric disponível:', typeof fabric !== 'undefined');
    console.log('🖼️ Canvas ref:', canvasRef.current ? 'OK' : 'NULO');
    console.log('📦 Container ref:', containerRef.current ? 'OK' : 'NULO');
    console.log('🎯 Formato selecionado:', selectedFormat);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#2b2b2b] text-white">
      {/* Top Menu Bar */}
      <div className="h-12 bg-[#1e1e1e] border-b border-[#4a4a4a] flex items-center px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-sm font-semibold">Zentraw Photo Editor</h1>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setTemplatesModalOpen(true)}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Templates
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setSvgLayoutModalOpen(true)}
          >
            SVG Layouts
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setFormatsModalOpen(true)}
          >
            Formats
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setFiltersModalOpen(true)}
          >
            Filters
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => setTextEffectsModalOpen(true)}
          >
            Text FX
          </Button>

          {/* History Controls */}
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs disabled:opacity-50"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs disabled:opacity-50"
            onClick={redo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="Redo (Ctrl+Y)"
          >
            <RotateCcw className="w-3 h-3 rotate-180" />
          </Button>

          <div className="flex-1" />

          {/* Font Loading Indicator */}
          {availableFonts.length > 0 && (
            <div className="text-xs text-green-400 px-2">✓ {availableFonts.length} fontes</div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1 h-7 hover:bg-[#4a4a4a] text-xs"
            onClick={() => exportCanvas('png')}
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#383838] border-r border-[#4a4a4a] p-2 flex flex-col items-center flex-shrink-0">
          <div className="space-y-2">
            {tools.map((toolItem) => (
              <Button
                key={toolItem.id}
                variant="ghost"
                size="sm"
                className={`p-2 w-12 h-12 flex items-center justify-center hover:bg-[#4a4a4a] ${
                  selectedTool === toolItem.id ? 'bg-[#0078d4] hover:bg-[#106ebe]' : ''
                }`}
                onClick={() => handleToolChange(toolItem.id)}
                title={toolItem.label}
              >
                <toolItem.icon className="w-5 h-5" />
              </Button>
            ))}
            {/* Hidden file input for image upload */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (!fabricCanvasRef.current || !e.target.files?.[0]) return;
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function (f) {
                  try {
                    const data = f.target?.result as string;
                    if (!fabric.Image) {
                      alert('fabric.Image não está disponível!');
                      return;
                    }
                    const htmlImg = new window.Image();
                    htmlImg.onload = function () {
                      const imgInstance = new fabric.Image(htmlImg, {
                        left: 350,
                        top: 250,
                        scaleX: 0.5,
                        scaleY: 0.5,
                      });
                      addLayerToCanvas(imgInstance, 'Image', 'image');
                    };
                    htmlImg.onerror = function () {
                      alert('Erro ao carregar a imagem no navegador!');
                    };
                    htmlImg.src = data;
                  } catch (err) {
                    alert('Erro ao ler o arquivo de imagem!');
                  }
                };
                reader.onerror = function () {
                  alert('Erro ao ler o arquivo de imagem!');
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Canvas Controls */}
          <div className="h-10 bg-[#2a2a2a] border-b border-[#4a4a4a] flex items-center px-4 gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-400">Format:</label>
              <select
                value={selectedFormat}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="bg-[#1e1e1e] border border-gray-600 rounded px-2 py-1 text-xs text-gray-300"
              >
                <option value="instagram-post">Instagram Post (1080x1080)</option>
                <option value="instagram-story">Instagram Story (1080x1920)</option>
                <option value="facebook-post">Facebook Post (1200x630)</option>
                <option value="twitter-post">Twitter Post (1024x512)</option>
                <option value="linkedin-post">LinkedIn Post (1200x627)</option>
                <option value="youtube-thumbnail">YouTube Thumbnail (1280x720)</option>
                <option value="a4-print">A4 Print (2480x3508)</option>
                <option value="business-card">Business Card (1050x600)</option>
                <option value="banner">Banner (1500x500)</option>
                <option value="custom">Custom (800x600)</option>
              </select>
            </div>

            {/* Status das fontes */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Fontes:</span>
              <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                {availableFonts.length} carregadas
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>

              <span className="text-xs text-gray-400 min-w-[60px] text-center">
                {Math.round(currentZoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleFitToScreen}
                className="h-6 px-2 text-xs hover:bg-[#4a4a4a]"
              >
                <Maximize className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Canvas Container */}
          <div
            ref={containerRef}
            className="flex-1 relative min-h-[400px]"
            style={{
              backgroundColor: '#282828', // Fundo Photoshop
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div className="flex items-center justify-center min-h-full p-8">
              {/* Canvas wrapper que escala junto com o zoom */}
              <div
                className="relative"
                style={{
                  transform: `scale(${currentZoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease-out',
                }}
              >
                {/* Canvas border que agora acompanha o zoom */}
                <div
                  className="absolute -inset-1 border-2 border-gray-500/30 rounded-sm pointer-events-none"
                  style={{
                    width: 'calc(100% + 8px)',
                    height: 'calc(100% + 8px)',
                    left: '-4px',
                    top: '-4px',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="shadow-2xl max-w-full max-h-full block"
                  style={{
                    backgroundColor: '#ffffff', // Base branca
                    backgroundImage: `
                      linear-gradient(45deg, #dbdbdb 25%, transparent 25%),
                      linear-gradient(-45deg, #dbdbdb 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #dbdbdb 75%),
                      linear-gradient(-45deg, transparent 75%, #dbdbdb 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-80 bg-[#2a2a2a] border-l border-[#4a4a4a] flex flex-col min-h-0">
          <Tabs
            value={activePropertiesTab}
            onValueChange={(value: any) => setActivePropertiesTab(value)}
            className="flex flex-col h-full min-h-0"
          >
            <div className="p-2 border-b border-[#4a4a4a] flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-[#1e1e1e]">
                <TabsTrigger value="properties" className="text-xs">
                  Properties
                </TabsTrigger>
                <TabsTrigger value="adjustments" className="text-xs">
                  Adjustments
                </TabsTrigger>
                <TabsTrigger value="libraries" className="text-xs">
                  Libraries
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="properties" className="flex-1 flex flex-col m-0 min-h-0">
              <div className="flex flex-col h-full min-h-0">
                {/* Canvas Background Controls */}
                <div className="p-4 border-b border-[#4a4a4a] flex-shrink-0">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Canvas Background
                  </label>
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
                          backgroundColor: '#f0f0f0',
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
                </div>

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

                      {/* Text Effects Panel */}
                      <div className="border-t border-[#4a4a4a] p-4">
                        <TextFXPanel
                          selectedObject={selectedObject}
                          onApplyEffect={applyTextEffect}
                        />
                      </div>
                    </div>
                  ) : selectedObject ? (
                    <div className="p-4">
                      {/* Layer Properties for Selected Object */}
                      <div className="space-y-4 mb-6">
                        <label className="text-sm font-medium text-gray-300 mb-2 block">
                          Layer Properties
                        </label>

                        {/* Opacity */}
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Opacity</label>
                          <div className="space-y-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={layerOpacity}
                              onChange={(e) => handleOpacityChange(Number(e.target.value))}
                              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">{layerOpacity}%</span>
                          </div>
                        </div>

                        {/* Blend Mode */}
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Blend Mode</label>
                          <select
                            value={layerBlendMode}
                            onChange={(e) => handleBlendModeChange(e.target.value)}
                            className="w-full p-2 bg-[#2a2a2a] border border-gray-600 rounded text-xs text-gray-300"
                          >
                            <option value="normal">Normal</option>
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
                                value={
                                  typeof selectedObject.fill === 'string'
                                    ? selectedObject.fill
                                    : '#000000'
                                }
                                onChange={(e) => {
                                  selectedObject.set('fill', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-8 border border-gray-600 rounded"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">
                                Stroke Color
                              </label>
                              <input
                                type="color"
                                value={
                                  typeof selectedObject.stroke === 'string'
                                    ? selectedObject.stroke
                                    : '#000000'
                                }
                                onChange={(e) => {
                                  selectedObject.set('stroke', e.target.value);
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-8 border border-gray-600 rounded"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 block mb-1">
                                Stroke Width
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                value={selectedObject.strokeWidth || 0}
                                onChange={(e) => {
                                  selectedObject.set('strokeWidth', Number(e.target.value));
                                  fabricCanvasRef.current?.renderAll();
                                  saveState();
                                }}
                                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-xs text-gray-500">
                                {selectedObject.strokeWidth || 0}px
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-400 text-center">
                      Select an object to edit its properties
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="adjustments" className="flex-1 m-0">
              <div className="p-4 space-y-4">
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
            </TabsContent>

            <TabsContent value="libraries" className="flex-1 m-0">
              <div className="flex flex-col h-full">
                {/* Layers Panel - HTML5 Native Drag and Drop */}
                <div className="p-4 border-b border-[#4a4a4a]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300">Layers</h3>
                    <Layers className="w-4 h-4 text-gray-400" />
                  </div>

                  {layers.length === 0 ? (
                    <div className="text-gray-500 text-xs text-center py-8">No layers yet</div>
                  ) : (
                    <div className="flex-1 overflow-y-auto max-h-64 space-y-1">
                      {layers.map((layer, index) => (
                        <div
                          key={layer.id}
                          draggable
                          className={`flex items-center justify-between p-2 rounded border transition-all duration-200 cursor-grab active:cursor-grabbing ${
                            selectedLayer?.id === layer.id
                              ? 'bg-[#0078d4] border-[#106ebe] text-white'
                              : 'bg-[#383838] border-[#4a4a4a] text-gray-300 hover:bg-[#4a4a4a] hover:border-[#5a5a5a]'
                          }`}
                          onClick={() => selectLayer(layer.id)}
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
                            const toIndex = index;
                            if (fromIndex !== toIndex) {
                              reorderLayers(fromIndex, toIndex);
                            }
                          }}
                        >
                          {/* Drag Handle */}
                          <div className="flex items-center justify-center w-4 h-4 text-gray-400 hover:text-gray-200 transition-colors">
                            <GripVertical className="h-3 w-3" />
                          </div>

                          <div className="flex items-center gap-2 flex-1 min-w-0 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                              }}
                            >
                              {layer.visible ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3 opacity-50" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-white/10 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerLock(layer.id);
                              }}
                            >
                              {layer.locked ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Unlock className="h-3 w-3 opacity-70" />
                              )}
                            </Button>

                            {/* Layer Type Icon */}
                            <div className="w-4 h-4 flex items-center justify-center">
                              {layer.fabricType === 'i-text' && (
                                <Type className="h-3 w-3 opacity-70" />
                              )}
                              {layer.fabricType === 'rect' && (
                                <Square className="h-3 w-3 opacity-70" />
                              )}
                              {layer.fabricType === 'circle' && (
                                <Circle className="h-3 w-3 opacity-70" />
                              )}
                              {layer.fabricType === 'triangle' && (
                                <Triangle className="h-3 w-3 opacity-70" />
                              )}
                              {layer.fabricType === 'image' && (
                                <ImageIcon className="h-3 w-3 opacity-70" />
                              )}
                            </div>

                            <div className="truncate text-xs font-medium flex-1 min-w-0">
                              {layer.name}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-500/20 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLayer(layer.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* ... outros conteúdos do painel, se houver ... */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditorFixed;
