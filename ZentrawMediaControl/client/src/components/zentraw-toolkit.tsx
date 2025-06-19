// Zentraw Artist Toolkit V2.7 - Versão consolidada e funcional completa

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Wand2, Save, Eye, Trash, Edit, FileDown, Copy, Music, Newspaper, Palette, Package, History, X, Layers, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FontFaceObserver from 'fontfaceobserver';
import PhotoshopEditor from '@/components/photoshop-editor';
import Header from '@/components/header';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { exportToPDF } from '@/lib/pdf-utils';

// Image Modal Component
const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white bg-red-500 hover:bg-red-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10 shadow-lg"
        title="Fechar"
      >
        <X className="h-5 w-5" />
      </button>
      <img 
        src={imageUrl} 
        alt="Visualização" 
        className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/20" 
      />
    </div>
  </div>
);

export default function ZentrawToolkit() {
  const [formData, setFormData] = useState({
    artistName: '',
    genre: '',
    achievements: '',
    influences: '',
    tone: 'formal',
    audience: 'press',
    songTitle: '',
    musicStyle: '',
    mood: '',
    releaseDate: '',
    collaborators: '',
    themeMessage: '',
    audioFile: null as File | null,
    pressPhoto: null as File | null
  });

  const [bioOutput, setBioOutput] = useState('');
  const [releaseOutput, setReleaseOutput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [imageIA, setImageIA] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverMethod, setCoverMethod] = useState('ai'); // 'ai', 'upload', 'bank'
  const [uploadedCover, setUploadedCover] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [exportedImages, setExportedImages] = useState<Array<{name: string, url: string}>>([]);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const canvasRef = useRef(null);
  
  // Layout Final states
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [finalLayoutImage, setFinalLayoutImage] = useState<string | null>(null);
  const [uploadedTemplates, setUploadedTemplates] = useState<any[]>([]);
  const [selectedFont, setSelectedFont] = useState('Orbitron');
  const [textColor, setTextColor] = useState('#ffffff');
  const [svgTemplate, setSvgTemplate] = useState<string | null>(null);
  const [customFonts, setCustomFonts] = useState<Array<{
    name: string;
    label: string;
    category: string;
    base64: string;
    ext: string;
  }>>([]);
  const canvasLayoutRef = useRef<HTMLCanvasElement>(null);
  const adminCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Estados para SVGs separados
  const [textSVG, setTextSVG] = useState<string>('');
  const [overlaySVG, setOverlaySVG] = useState<string>('');

  // V2.12.H - Sistema híbrido de elementos interativos
  interface CanvasElement {
    id: string;
    type: 'image' | 'text' | 'svg' | 'png-overlay';
    src?: string;
    content?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    blendMode: string;
    scale: number;
    // Propriedades de texto CSS avançado
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    textShadow?: string;
    textStroke?: string;
    letterSpacing?: number;
    lineHeight?: number;
    textTransform?: string;
    // Efeitos CSS3
    filter?: string;
    backdropFilter?: string;
    clipPath?: string;
    transform3d?: string;
    background?: string;
    borderRadius?: number;
    zIndex: number;
    visible: boolean;
    locked: boolean;
  }

  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editorMode, setEditorMode] = useState<'legacy' | 'hybrid'>('hybrid');

  // Estados legados (V2.12.G) mantidos para compatibilidade
  const [testBaseImage, setTestBaseImage] = useState<string | null>(null);
  const [testTextSvg, setTestTextSvg] = useState<string | null>(null);
  const [testOverlaySvg, setTestOverlaySvg] = useState<string | null>(null);
  const [showBase, setShowBase] = useState<boolean>(true);
  const [showText, setShowText] = useState<boolean>(true);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [blendBase, setBlendBase] = useState<string>('normal');
  const [blendText, setBlendText] = useState<string>('normal');
  const [blendOverlay, setBlendOverlay] = useState<string>('normal');
  const [alphaBase, setAlphaBase] = useState<number>(1);
  const [alphaText, setAlphaText] = useState<number>(1);
  const [alphaOverlay, setAlphaOverlay] = useState<number>(1);
  const [scaleBase, setScaleBase] = useState<number>(1);
  const [scaleText, setScaleText] = useState<number>(1);
  const [scaleOverlay, setScaleOverlay] = useState<number>(1);
  const [textReplacers, setTextReplacers] = useState<{ARTIST: string, TITLE: string}>({ ARTIST: 'ARTIST', TITLE: 'TITLE' });
  const testCanvasRef = useRef<HTMLCanvasElement>(null);
  const hybridCanvasRef = useRef<HTMLCanvasElement>(null);

  // V2.12.H - Fontes do Freepik integradas
  const freepikFonts = [
    { name: 'Bebas Neue', category: 'Display', weight: ['400', '500', '700'] },
    { name: 'Montserrat', category: 'Sans-serif', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Oswald', category: 'Display', weight: ['200', '300', '400', '500', '600', '700'] },
    { name: 'Playfair Display', category: 'Serif', weight: ['400', '500', '600', '700', '800', '900'] },
    { name: 'Roboto Condensed', category: 'Sans-serif', weight: ['300', '400', '700'] },
    { name: 'Open Sans', category: 'Sans-serif', weight: ['300', '400', '600', '700', '800'] },
    { name: 'Lato', category: 'Sans-serif', weight: ['100', '300', '400', '700', '900'] },
    { name: 'Poppins', category: 'Sans-serif', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Raleway', category: 'Sans-serif', weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { name: 'Nunito', category: 'Sans-serif', weight: ['200', '300', '400', '600', '700', '800', '900'] },
    { name: 'Source Sans Pro', category: 'Sans-serif', weight: ['200', '300', '400', '600', '700', '900'] },
    { name: 'Ubuntu', category: 'Sans-serif', weight: ['300', '400', '500', '700'] },
    { name: 'Anton', category: 'Display', weight: ['400'] },
    { name: 'Righteous', category: 'Display', weight: ['400'] },
    { name: 'Bangers', category: 'Display', weight: ['400'] },
    { name: 'Fredoka One', category: 'Display', weight: ['400'] },
    { name: 'Pacifico', category: 'Handwriting', weight: ['400'] },
    { name: 'Dancing Script', category: 'Handwriting', weight: ['400', '500', '600', '700'] },
    { name: 'Satisfy', category: 'Handwriting', weight: ['400'] },
    { name: 'Creepster', category: 'Fantasy', weight: ['400'] }
  ];

  const [loadedFreepikFonts, setLoadedFreepikFonts] = useState<Set<string>>(new Set());

  // V2.12.H - Função para carregar fontes do Freepik
  const loadFreepikFont = async (fontName: string, weights: string[] = ['400']) => {
    if (loadedFreepikFonts.has(fontName)) return;

    try {
      const fontFamily = fontName.replace(/\s+/g, '+');
      const weightsParam = weights.join(',');
      const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weightsParam}&display=swap`;
      
      // Criar link element para carregar a fonte
      const link = document.createElement('link');
      link.href = googleFontsUrl;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      document.head.appendChild(link);

      // Aguardar carregamento da fonte
      await new Promise<void>((resolve) => {
        const observer = new (FontFaceObserver as any)(fontName, { weight: weights[0] });
        observer.load().then(() => {
          setLoadedFreepikFonts(prev => new Set(prev).add(fontName));
          resolve();
        }).catch(() => {
          console.warn(`Erro ao carregar fonte: ${fontName}`);
          resolve();
        });
      });

      console.log(`Fonte ${fontName} carregada com sucesso`);
    } catch (error) {
      console.error(`Erro ao carregar fonte ${fontName}:`, error);
    }
  };

  // V2.12.H - Função para renderizar canvas híbrido
  const renderHybridCanvas = async () => {
    const canvas = hybridCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, 1080, 1080);

    // Renderizar elementos ordenados por zIndex
    const sortedElements = [...canvasElements].sort((a, b) => a.zIndex - b.zIndex);

    for (const element of sortedElements) {
      if (!element.visible) continue;

      ctx.save();
      
      // Aplicar transformações
      ctx.globalAlpha = element.opacity;
      ctx.globalCompositeOperation = element.blendMode as GlobalCompositeOperation;
      
      // Transformar coordenadas
      ctx.translate(element.x + element.width/2, element.y + element.height/2);
      ctx.rotate(element.rotation * Math.PI / 180);
      ctx.scale(element.scale, element.scale);
      ctx.translate(-element.width/2, -element.height/2);

      // Renderizar baseado no tipo
      if (element.type === 'text' && element.content) {
        await renderTextElement(ctx, element);
      } else if (element.type === 'image' && element.src) {
        await renderImageElement(ctx, element);
      } else if (element.type === 'svg' && element.src) {
        await renderSvgElement(ctx, element);
      } else if (element.type === 'png-overlay' && element.src) {
        await renderPngElement(ctx, element);
      }

      ctx.restore();
    }
  };

  // V2.12.H - Renderizar elemento de texto com CSS avançado
  const renderTextElement = async (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (!element.content) return;

    // Carregar fonte se necessário
    if (element.fontFamily && !loadedFreepikFonts.has(element.fontFamily)) {
      const font = freepikFonts.find(f => f.name === element.fontFamily);
      if (font) {
        await loadFreepikFont(font.name, font.weight);
      }
    }

    // Configurar texto
    const fontSize = element.fontSize || 48;
    const fontWeight = element.fontWeight || '400';
    const fontFamily = element.fontFamily || 'Arial';
    
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", Arial, sans-serif`;
    ctx.fillStyle = element.color || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Aplicar sombra se definida
    if (element.textShadow) {
      const shadowParts = element.textShadow.split(' ');
      if (shadowParts.length >= 4) {
        ctx.shadowOffsetX = parseInt(shadowParts[0]);
        ctx.shadowOffsetY = parseInt(shadowParts[1]);
        ctx.shadowBlur = parseInt(shadowParts[2]);
        ctx.shadowColor = shadowParts.slice(3).join(' ');
      }
    }

    // Renderizar texto
    const lines = element.content.split('\n');
    const lineHeight = (element.lineHeight || 1.2) * fontSize;
    const startY = element.height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      
      // Aplicar transformação de texto
      let processedLine = line;
      if (element.textTransform === 'uppercase') {
        processedLine = line.toUpperCase();
      } else if (element.textTransform === 'lowercase') {
        processedLine = line.toLowerCase();
      }

      ctx.fillText(processedLine, element.width / 2, y);
    });
  };

  // V2.12.H - Renderizar elemento de imagem
  const renderImageElement = async (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (!element.src) return;

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Aplicar filtros se definidos
        if (element.filter && element.filter !== 'none') {
          ctx.filter = element.filter;
        }

        ctx.drawImage(img, 0, 0, element.width, element.height);
        ctx.filter = 'none';
        resolve();
      };
      img.onerror = () => resolve();
      img.src = element.src;
    });
  };

  // V2.12.H - Renderizar elemento SVG
  const renderSvgElement = async (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    if (!element.src) return;

    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(element.src)}`;
    return renderImageElement(ctx, { ...element, src: svgDataUrl });
  };

  // V2.12.H - Auto-renderizar quando elementos mudam
  useEffect(() => {
    if (editorMode === 'hybrid') {
      renderHybridCanvas();
    }
  }, [canvasElements, editorMode]);

  // V2.12.H - Exportar canvas híbrido
  const exportHybridCanvas = () => {
    const canvas = hybridCanvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `zentraw_v2.12h_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // V2.12.H - Renderizar elemento PNG overlay
  const renderPngElement = async (ctx: CanvasRenderingContext2D, element: CanvasElement) => {
    return renderImageElement(ctx, element);
  };

  // V2.12.H - Funções do editor híbrido
  const addElement = (type: CanvasElement['type'], config: Partial<CanvasElement> = {}) => {
    const newElement: CanvasElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: 540, // Centro do canvas 1080x1080
      y: 540,
      width: type === 'text' ? 300 : 200,
      height: type === 'text' ? 80 : 200,
      rotation: 0,
      opacity: 1,
      blendMode: 'normal',
      scale: 1,
      zIndex: canvasElements.length,
      visible: true,
      locked: false,
      // Configurações padrão para texto
      fontSize: 48,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#ffffff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      letterSpacing: 2,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      // Efeitos CSS3
      filter: 'none',
      background: 'transparent',
      borderRadius: 0,
      content: type === 'text' ? 'Novo Texto' : undefined,
      ...config
    };

    setCanvasElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
    renderHybridCanvas();
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setCanvasElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
    renderHybridCanvas();
  };

  const deleteElement = (id: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
    renderHybridCanvas();
  };

  const duplicateElement = (id: string) => {
    const element = canvasElements.find(el => el.id === id);
    if (element) {
      const duplicate = {
        ...element,
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: canvasElements.length
      };
      setCanvasElements(prev => [...prev, duplicate]);
      setSelectedElement(duplicate.id);
      renderHybridCanvas();
    }
  };

  const reorderElement = (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    setCanvasElements(prev => {
      const elements = [...prev];
      const elementIndex = elements.findIndex(el => el.id === id);
      const element = elements[elementIndex];
      
      switch (direction) {
        case 'up':
          element.zIndex = Math.min(element.zIndex + 1, elements.length - 1);
          break;
        case 'down':
          element.zIndex = Math.max(element.zIndex - 1, 0);
          break;
        case 'top':
          element.zIndex = elements.length - 1;
          break;
        case 'bottom':
          element.zIndex = 0;
          break;
      }
      
      return elements.sort((a, b) => a.zIndex - b.zIndex);
    });
    renderHybridCanvas();
  };

  // Admin editor functions
  const applyFilter = (filterType: string) => {
    console.log('Applying filter:', filterType);
    const canvas = adminCanvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }
    
    if (!imageIA && !uploadedCover) {
      console.log('No image available');
      toast({
        title: "Nenhuma imagem",
        description: "Gere ou faça upload de uma capa primeiro",
        variant: "destructive",
      });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImageSrc = imageIA || uploadedCover;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 500;
      canvas.height = 500;
      
      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply filter based on type
      switch (filterType) {
        case 'grayscale':
          ctx.filter = 'grayscale(100%)';
          break;
        case 'invert':
          ctx.filter = 'invert(100%)';
          break;
        case 'sepia':
          ctx.filter = 'sepia(100%)';
          break;
        case 'blur':
          ctx.filter = 'blur(3px)';
          break;
        case 'brightness':
          ctx.filter = 'brightness(150%)';
          break;
        default:
          ctx.filter = 'none';
      }
      
      ctx.drawImage(img, 0, 0, 500, 500);
      ctx.filter = 'none'; // Reset filter
      console.log('Filter applied successfully:', filterType);
    };
    img.onerror = () => {
      console.error('Failed to load image for filter');
    };
    img.src = currentImageSrc!;
  };

  // Load admin canvas with current image when available
  useEffect(() => {
    if ((imageIA || uploadedCover) && adminCanvasRef.current) {
      console.log('Loading image to admin canvas');
      const canvas = adminCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = 500;
          canvas.height = 500;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, 500, 500);
          console.log('Image loaded to admin canvas');
        };
        img.onerror = () => {
          console.error('Failed to load image to admin canvas');
        };
        img.src = imageIA || uploadedCover || '';
      }
    }
  }, [imageIA, uploadedCover]);

  // Remove custom font function
  const removeCustomFont = async (fontName: string) => {
    console.log('Removing font:', fontName);
    
    // Find the font in server data to get its ID
    const fontToRemove = serverFonts?.find((f: any) => f.name === fontName);
    if (!fontToRemove) {
      toast({
        title: "Erro",
        description: "Fonte não encontrada no servidor",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteFontMutation.mutateAsync(fontToRemove.id);
      
      // If removing the currently selected font, switch to default
      if (selectedFont === fontName) {
        setSelectedFont('Orbitron');
      }
      
      toast({
        title: "Fonte removida",
        description: `A fonte "${fontName}" foi removida do servidor.`,
      });
    } catch (error) {
      console.error('Error removing font:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a fonte do servidor",
        variant: "destructive",
      });
    }
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load custom fonts from server
  const { data: serverFonts = [], isLoading: fontsLoading, error: fontsError } = useQuery<Array<{
    id: number;
    name: string;
    label: string;
    category: string;
    base64: string;
    ext: string;
  }>>({
    queryKey: ['/api/custom-fonts'],
  });

  // Debug fonts loading
  useEffect(() => {
    console.log('Fonts query state:', { 
      serverFonts: serverFonts?.length, 
      fontsLoading, 
      fontsError: fontsError?.message 
    });
  }, [serverFonts, fontsLoading, fontsError]);

  // Create font mutation
  const createFontMutation = useMutation({
    mutationFn: async (fontData: {
      name: string;
      label: string;
      category: string;
      base64: string;
      ext: string;
    }) => {
      const response = await fetch('/api/custom-fonts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fontData),
      });
      if (!response.ok) throw new Error('Failed to save font');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-fonts'] });
    },
  });

  // Delete font mutation
  const deleteFontMutation = useMutation({
    mutationFn: async (fontId: number) => {
      const response = await fetch(`/api/custom-fonts/${fontId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete font');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/custom-fonts'] });
    },
  });

  // Available fonts for templates (base + custom)
  const baseFonts = [
    { name: 'Orbitron', label: 'Orbitron (Futurista)', category: 'Tech' },
    { name: 'Antonio', label: 'Antonio (Condensada)', category: 'Modern' },
    { name: 'Rajdhani', label: 'Rajdhani (Tech)', category: 'Tech' },
    { name: 'Outfit', label: 'Outfit (Clean)', category: 'Modern' },
    { name: 'Michroma', label: 'Michroma (Caps Futurista)', category: 'Tech' },
    { name: 'Playfair Display', label: 'Playfair Display (Elegante)', category: 'Elegant' },
    { name: 'Libre Baskerville', label: 'Libre Baskerville (Clássica)', category: 'Classic' },
    { name: 'Monoton', label: 'Monoton (Neon)', category: 'Retro' },
    { name: 'Major Mono Display', label: 'Major Mono Display (Retro Tech)', category: 'Retro' },
    { name: 'Rye', label: 'Rye (Vintage Western)', category: 'Vintage' },
    { name: 'Special Elite', label: 'Special Elite (Typewriter)', category: 'Vintage' },
    { name: 'Press Start 2P', label: 'Press Start 2P (Pixel)', category: 'Retro' }
  ];

  const availableFonts = [...baseFonts, ...customFonts];

  // Common text colors
  const textColors = [
    { name: 'Branco', value: '#ffffff' },
    { name: 'Preto', value: '#000000' },
    { name: 'Amarelo', value: '#ffff00' },
    { name: 'Ciano', value: '#00ffff' },
    { name: 'Magenta', value: '#ff00ff' },
    { name: 'Vermelho', value: '#ff0000' },
    { name: 'Verde', value: '#00ff00' },
    { name: 'Azul', value: '#0066ff' },
    { name: 'Laranja', value: '#ff8800' },
    { name: 'Rosa', value: '#ff69b4' }
  ];

  // Mock templates for Layout Final
  const mockTemplates = [
    {
      id: 'template1',
      name: 'Minimal Center',
      svg: `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.3)"/>
        <text x="540" y="600" font-size="72" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">ARTIST</text>
        <text x="540" y="700" font-size="48" text-anchor="middle" fill="white" font-family="Arial, sans-serif">TITLE</text>
      </svg>`
    },
    {
      id: 'template2',
      name: 'Bold Gradient',
      svg: `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff006e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8338ec;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)"/>
        <text x="540" y="500" font-size="96" text-anchor="middle" fill="url(#textGrad)" font-family="Impact, Arial Black, sans-serif" font-weight="900">ARTIST</text>
        <text x="540" y="620" font-size="64" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold">TITLE</text>
      </svg>`
    },
    {
      id: 'template3',
      name: 'Corner Modern',
      svg: `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.2)"/>
        <rect x="50" y="850" width="500" height="150" fill="rgba(0,0,0,0.7)" rx="10"/>
        <text x="80" y="920" font-size="48" text-anchor="start" fill="#00d4ff" font-family="Arial, sans-serif" font-weight="bold">ARTIST</text>
        <text x="80" y="970" font-size="32" text-anchor="start" fill="#ffffff" font-family="Arial, sans-serif">TITLE</text>
      </svg>`
    },
    {
      id: 'template4',
      name: 'Top Banner',
      svg: `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.2)"/>
        <rect x="0" y="50" width="100%" height="180" fill="rgba(0,0,0,0.8)"/>
        <text x="540" y="140" font-size="56" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-weight="bold">ARTIST</text>
        <text x="540" y="190" font-size="36" text-anchor="middle" fill="#cccccc" font-family="Arial, sans-serif">TITLE</text>
      </svg>`
    }
  ];

  // Initialize with first template and combine with uploaded ones
  useEffect(() => {
    const allTemplates = [...mockTemplates, ...uploadedTemplates];
    if (!selectedTemplate && allTemplates.length > 0) {
      setSelectedTemplate(allTemplates[0]);
    }
  }, [uploadedTemplates]);

  // Upload multiple custom fonts function
  const handleUploadFonts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log(`Uploading ${files.length} fonts`);

    const validFiles = Array.from(files).filter(file => 
      file.name.match(/\.(woff2|ttf|otf)$/i)
    );

    if (validFiles.length === 0) {
      toast({
        title: "Nenhum arquivo válido",
        description: "Use apenas arquivos .woff2, .ttf ou .otf",
        variant: "destructive",
      });
      return;
    }

    if (validFiles.length !== files.length) {
      toast({
        title: "Alguns arquivos ignorados",
        description: `${files.length - validFiles.length} arquivos com formato inválido foram ignorados`,
        variant: "destructive",
      });
    }

    const processedFonts: Array<{
      name: string;
      label: string;
      category: string;
      base64: string;
      ext: string;
    }> = [];

    // Process each font file
    for (const file of validFiles) {
      try {
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(new Error(`Erro ao ler ${file.name}`));
          reader.readAsArrayBuffer(file);
        });

        const uint8Array = new Uint8Array(arrayBuffer);
        const base64 = btoa(Array.prototype.map.call(uint8Array, (byte: number) => String.fromCharCode(byte)).join(''));
        const fontName = file.name.split('.')[0];
        const ext = file.name.split('.').pop()?.toLowerCase();

        const newFont = {
          name: fontName,
          label: `${fontName} (Custom)`,
          category: 'Custom',
          base64: base64,
          ext: ext || 'woff2',
        };

        processedFonts.push(newFont);
        console.log('Font processed:', newFont.name);

      } catch (error) {
        console.error(`Error processing font ${file.name}:`, error);
        toast({
          title: `Erro ao processar ${file.name}`,
          description: "Este arquivo foi ignorado",
          variant: "destructive",
        });
      }
    }

    if (processedFonts.length > 0) {
      // Save fonts to server in batches to avoid payload size limits
      try {
        let successCount = 0;
        const batchSize = 5; // Process 5 fonts at a time

        for (let i = 0; i < processedFonts.length; i += batchSize) {
          const batch = processedFonts.slice(i, i + batchSize);
          
          for (const font of batch) {
            try {
              await createFontMutation.mutateAsync({
                name: font.name,
                label: font.label,
                category: font.category,
                base64: font.base64,
                ext: font.ext
              });
              successCount++;
            } catch (fontError) {
              console.error(`Error saving font ${font.name}:`, fontError);
            }
          }

          // Small delay between batches to prevent server overload
          if (i + batchSize < processedFonts.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }

        if (successCount > 0) {
          // Set the first uploaded font as selected
          setSelectedFont(processedFonts[0].name);

          toast({
            title: "Fontes processadas",
            description: `${successCount}/${processedFonts.length} fonte(s) salva(s) no servidor`,
          });
        } else {
          toast({
            title: "Erro no upload",
            description: "Nenhuma fonte foi salva no servidor",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error saving fonts to server:', error);
        toast({
          title: "Erro ao salvar",
          description: "Problema na comunicação com o servidor",
          variant: "destructive",
        });
      }
    }

    // Clear the input
    e.target.value = '';
  };

  // Sistema de cache melhorado sem localStorage (evita quota exceeded)
  useEffect(() => {
    // Tenta sessionStorage primeiro (menor chance de quota exceeded)
    try {
      const sessionCached = sessionStorage.getItem('zentraw_fonts_session');
      if (sessionCached) {
        const parsed = JSON.parse(sessionCached);
        if (parsed.length > 0) {
          injectFontsIntoDOM(parsed);
          setCustomFonts(parsed);
          console.log('Loaded fonts from session cache:', parsed.length);
          return;
        }
      }
    } catch (e) {
      console.log('Session cache not available, will load from server');
    }
  }, []);

  // Reativa fontes quando necessário (trigger para templates)
  const reactivateFonts = () => {
    if (customFonts.length > 0) {
      injectFontsIntoDOM(customFonts);
      console.log('Fonts reactivated for template usage');
    }
  };

  // Função para recarregar fontes Freepik usando o uploader de arquivo
  const reloadFreepikFonts = () => {
    toast({
      title: "Recarregar Fontes Freepik",
      description: "Use o campo de upload acima para carregar seus arquivos de fonte Freepik (.ttf, .otf, .woff2)",
    });
  };

  // Update local state when server fonts change and inject fonts into DOM
  useEffect(() => {
    if (serverFonts && serverFonts.length > 0) {
      setCustomFonts(serverFonts);
      console.log('Loaded fonts from server:', serverFonts.length);
      
      // Inject fonts into DOM for immediate use
      injectFontsIntoDOM(serverFonts);
      
      // Cache apenas nomes das fontes no sessionStorage (mais leve)
      try {
        const lightCache = serverFonts.map(f => ({ name: f.name, ext: f.ext }));
        sessionStorage.setItem('zentraw_fonts_names', JSON.stringify(lightCache));
        console.log('Font names cached successfully');
      } catch (e) {
        console.log('Cannot cache font names, will reload from server when needed');
      }
    }
  }, [serverFonts]);

  // Função reforçada para injetar fontes no DOM mantendo estilo vivo
  const injectFontsIntoDOM = (fonts: any[]) => {
    const existing = document.getElementById('zentraw-custom-fonts');
    if (existing) existing.remove();

    if (fonts.length === 0) return;

    const style = document.createElement('style');
    style.id = 'zentraw-custom-fonts';
    let css = '';

    fonts.forEach(font => {
      if (font.base64) {
        const format = font.ext === 'ttf' ? 'truetype' :
                      font.ext === 'otf' ? 'opentype' :
                      font.ext === 'woff2' ? 'woff2' : 'woff';

        css += `
          @font-face {
            font-family: '${font.name}';
            src: url(data:font/${font.ext};base64,${font.base64}) format('${format}');
            font-display: swap;
            font-weight: normal;
            font-style: normal;
          }
        `;
      }
    });

    style.textContent = css;
    document.head.appendChild(style);
    console.log('Injected', fonts.length, 'fonts into DOM with font-display: swap');
  };

  // Handle SVG template upload
  const handleUploadSVG = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.svg')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo SVG válido",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      if (svgContent) {
        const newTemplate = {
          id: `uploaded-${Date.now()}`,
          name: file.name.replace('.svg', ''),
          svg: svgContent,
          isUploaded: true
        };
        
        setUploadedTemplates(prev => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate);
        
        toast({
          title: "Template carregado!",
          description: `Template "${newTemplate.name}" adicionado com sucesso`,
        });
      }
    };
    reader.readAsText(file);
  };

  // Load projects
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["/api/projects"],
  });

  // Load media files
  const { data: mediaFiles = [] } = useQuery<any[]>({
    queryKey: ["/api/media-files"],
  });

  useEffect(() => {
    if (formData.pressPhoto) {
      setPhotoPreview(URL.createObjectURL(formData.pressPhoto));
    }
    if (formData.audioFile) {
      setAudioPreview(URL.createObjectURL(formData.audioFile));
    }
  }, [formData.pressPhoto, formData.audioFile]);

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media-files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media-files"] });
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save project mutation
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest("POST", "/api/projects", {
        name: `${projectData.artistName} - ${projectData.songTitle || 'Project'}`,
        type: "complete",
        data: {
          ...projectData,
          bioOutput,
          releaseOutput,
          imageIA,
          photoPreview,
          audioPreview
        }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate biography mutation
  const generateBioMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/biographies", data);
      return response.json();
    },
    onSuccess: (data) => {
      setBioOutput(data.fullBio);
      toast({
        title: "Biography generated",
        description: "AI-powered biography is ready",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate press release mutation
  const generateReleaseMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/press-releases", data);
      return response.json();
    },
    onSuccess: (data) => {
      setReleaseOutput(data.fullRelease);
      toast({
        title: "Press release generated",
        description: "AI-powered press release is ready",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate AI image with progress
  const generateImageIA = async () => {
    try {
      setIsGeneratingImage(true);
      setImageProgress(0);
      
      // Start progress animation
      const progressInterval = setInterval(() => {
        setImageProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      const prompt = `Album cover art for "${formData.songTitle}" by ${formData.artistName}, ${formData.musicStyle} style, ${formData.mood} mood, theme: ${formData.themeMessage}, professional, high quality, artistic`;
      
      const response = await apiRequest("POST", "/api/generate-image", {
        prompt: prompt,
        size: '1024x1024'
      });
      
      const result = await response.json();
      
      // Complete progress
      clearInterval(progressInterval);
      setImageProgress(100);
      
      setImageIA(result.imageUrl);
      
      setTimeout(() => {
        setIsGeneratingImage(false);
        setImageProgress(0);
      }, 1000);
      
      toast({
        title: "Capa gerada com sucesso",
        description: "Sua capa AI está pronta para download",
      });
    } catch (error: any) {
      setIsGeneratingImage(false);
      setImageProgress(0);
      toast({
        title: "Falha na geração",
        description: error.message || "Verifique sua configuração da API OpenAI",
        variant: "destructive",
      });
    }
  };

  // Load project into form
  const loadProjectIntoForm = (project: any) => {
    try {
      const projectData = JSON.parse(project.content);
      setFormData({
        ...formData,
        ...projectData
      });
      
      if (projectData.bioOutput) setBioOutput(projectData.bioOutput);
      if (projectData.releaseOutput) setReleaseOutput(projectData.releaseOutput);
      if (projectData.imageIA) setImageIA(projectData.imageIA);
      if (projectData.photoPreview) setPhotoPreview(projectData.photoPreview);
      if (projectData.audioPreview) setAudioPreview(projectData.audioPreview);
      
      setSelectedProject(project);
      
      toast({
        title: "Project loaded",
        description: `Loaded project: ${project.name}`,
      });
    } catch (error) {
      toast({
        title: "Load failed",
        description: "Failed to load project data",
        variant: "destructive",
      });
    }
  };

  // Delete project
  const deleteProject = async (projectId: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiRequest("DELETE", `/api/projects/${projectId}`, {});
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        
        toast({
          title: "Project deleted",
          description: "Project has been permanently deleted",
        });
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  // Export cover in multiple sizes
  const exportCoverSizes = async () => {
    const coverImageSrc = imageIA || uploadedCover;
    
    if (!coverImageSrc) {
      toast({
        title: "Nenhuma imagem de capa",
        description: "Por favor, gere ou faça upload de uma imagem primeiro",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Iniciando exportação...",
      description: "Carregando imagem e preparando downloads",
    });

    const sizes = [
      { name: 'spotify', w: 2048, h: 2048 },
      { name: 'instagram_post', w: 1080, h: 1350 },
      { name: 'reel_story', w: 1080, h: 1920 },
      { name: 'youtube', w: 1920, h: 1080 },
    ];

    try {
      // Convert external image to blob to avoid tainted canvas issues
      let imageBlob: Blob;
      
      // Use proxy for external images to avoid CORS issues
      if (coverImageSrc.startsWith('http')) {
        console.log('External image detected, using server proxy');
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(coverImageSrc)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Failed to fetch image through proxy');
        imageBlob = await response.blob();
      } else {
        // For blob URLs and local sources
        const response = await fetch(coverImageSrc);
        if (!response.ok) throw new Error('Failed to fetch local image');
        imageBlob = await response.blob();
      }
      
      // Create object URL from blob
      const objectUrl = URL.createObjectURL(imageBlob);
      
      // Load image from object URL (no CORS issues)
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        
        image.onload = () => {
          console.log('Image loaded successfully from blob:', image.width, 'x', image.height);
          resolve(image);
        };
        
        image.onerror = () => {
          reject(new Error('Falha ao carregar a imagem do blob'));
        };
        
        image.src = objectUrl;
      });

      const results: Array<{name: string, url: string}> = [];
      let successCount = 0;
      
      // Process each size and store results
      for (const { name, w, h } of sizes) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error('Failed to get canvas context for', name);
            continue;
          }
          
          // Fill with white background first
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          
          // Calculate dimensions for crop/zoom to fill entire canvas
          const imgAspect = img.width / img.height;
          const canvasAspect = w / h;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > canvasAspect) {
            // Image is wider - fit to height and crop sides
            drawHeight = h;
            drawWidth = h * imgAspect;
            drawX = (w - drawWidth) / 2; // Center horizontally
            drawY = 0;
          } else {
            // Image is taller - fit to width and crop top/bottom
            drawWidth = w;
            drawHeight = w / imgAspect;
            drawX = 0;
            drawY = (h - drawHeight) / 2; // Center vertically
          }
          
          // Draw the image
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          
          // Add text overlay if artist info is available
          if (formData.artistName || formData.songTitle) {
            const overlayHeight = Math.max(80, h * 0.08);
            
            // Semi-transparent overlay for text readability
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, h - overlayHeight, w, overlayHeight);
            
            // Artist name
            if (formData.artistName) {
              ctx.fillStyle = '#ffffff';
              ctx.font = `bold ${Math.min(w * 0.03, 36)}px Arial, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(formData.artistName, w / 2, h - overlayHeight + overlayHeight * 0.35);
            }
            
            // Song title
            if (formData.songTitle) {
              ctx.fillStyle = '#cccccc';
              ctx.font = `${Math.min(w * 0.02, 24)}px Arial, sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(formData.songTitle, w / 2, h - overlayHeight + overlayHeight * 0.7);
            }
          }
          
          // Get data URL for preview and download
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          results.push({ name, url: dataUrl });
          
          // Download the image
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${formData.artistName || 'cover'}_${name}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          successCount++;
          console.log(`Successfully exported ${name} (${successCount}/${sizes.length})`);
          
        } catch (sizeError) {
          console.error(`Error processing ${name}:`, sizeError);
          if (sizeError instanceof Error) {
            console.error('Size error details:', sizeError.message);
          }
        }
      }
      
      // Update exported images for preview
      setExportedImages(results);
      
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      
      if (successCount > 0) {
        toast({
          title: "Capas exportadas com sucesso!",
          description: `${successCount} tamanhos baixados: ${results.map(r => r.name).join(', ')}`,
        });
      } else {
        throw new Error('Nenhuma capa foi exportada com sucesso');
      }
        
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Falha na exportação",
        description: error.message || "Erro desconhecido durante a exportação",
        variant: "destructive",
      });
    }
  };

  // Export mini site
  const exportMiniSite = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${formData.artistName} - ${formData.songTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #111; color: #fff; }
          img { max-width: 400px; border-radius: 8px; }
          .bio, .release { background: #222; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
          footer { text-align: center; margin-top: 2rem; color: #888; }
        </style>
      </head>
      <body>
        <h1>${formData.artistName}</h1>
        <h2>${formData.songTitle}</h2>
        ${photoPreview ? `<img src="${photoPreview}" alt="Press photo" />` : ''}
        ${imageIA ? `<img src="${imageIA}" alt="Cover art" />` : ''}
        ${bioOutput ? `<div class="bio"><h3>Biography</h3><p>${bioOutput.replace(/\n/g, '<br>')}</p></div>` : ''}
        ${releaseOutput ? `<div class="release"><h3>Press Release</h3><p>${releaseOutput.replace(/\n/g, '<br>')}</p></div>` : ''}
        ${audioPreview ? `<audio controls src="${audioPreview}" style="width: 100%; margin: 1rem 0;"></audio>` : ''}
        <footer><p>Generated with Zentraw Artist Toolkit V2.7</p></footer>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.artistName}_presskit.html`;
    link.click();
    
    toast({
      title: "Press kit exported",
      description: "Mini site HTML has been downloaded",
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied",
    });
  };

  // Export PDF
  const handleExportPDF = (content: string, filename: string) => {
    const pdfContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">${formData.artistName}</h1>
        <h2 style="color: #666; margin-bottom: 30px;">${formData.songTitle}</h2>
        <div style="line-height: 1.6; color: #444;">
          ${content.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    
    exportToPDF(pdfContent, filename);
  };

  // Apply template function for Layout Final
  const applyTemplate = async () => {
    if (!selectedTemplate || !canvasLayoutRef.current) return;

    try {
      const baseImageSrc = exportedImages[0]?.url || imageIA || uploadedCover;
      if (!baseImageSrc) {
        toast({ title: "Imagem não encontrada", description: "Gere ou envie uma imagem de capa antes", variant: "destructive" });
        return;
      }

      const baseImg = new Image();
      baseImg.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        baseImg.onload = res;
        baseImg.onerror = rej;
        baseImg.src = baseImageSrc;
      });

      // Parse SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(selectedTemplate.svg, 'image/svg+xml');
      const svgRoot = svgDoc.documentElement;

      // Sistema robusto de fontes com injeção direta no SVG
      const customFontObj = customFonts.find(f => f.name === selectedFont) as any;
      const styleEl = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
      
      let fontCSS = '';
      
      // Incluir TODAS as fontes disponíveis no SVG para garantir acesso
      let allFontsCSS = '';
      customFonts.forEach(font => {
        if (font.base64) {
          const format = font.ext === 'ttf' ? 'truetype' :
                        font.ext === 'otf' ? 'opentype' :
                        font.ext === 'woff2' ? 'woff2' : 'woff';

          allFontsCSS += `
            @font-face {
              font-family: '${font.name}';
              src: url(data:font/${font.ext};base64,${font.base64}) format('${format}');
              font-display: block;
              font-weight: normal;
              font-style: normal;
            }
          `;
        }
      });
      
      if (customFontObj && customFontObj.base64) {
        // Usar fonte customizada se disponível
        fontCSS = `
          ${allFontsCSS}
          text, tspan {
            font-family: '${selectedFont}', 'Impact', 'Arial Black', sans-serif !important;
            fill: ${textColor} !important;
          }
        `;
        console.log('Aplicando fonte customizada:', selectedFont);
      } else {
        // Sistema de fallback melhorado
        const systemFontMap: { [key: string]: string } = {
          'Impact': 'Impact, "Arial Black", sans-serif',
          'Arial Black': '"Arial Black", Impact, sans-serif',
          'Helvetica': 'Helvetica, Arial, sans-serif',
          'Times New Roman': '"Times New Roman", Times, serif',
          'Georgia': 'Georgia, Times, serif'
        };
        
        const fontStack = systemFontMap[selectedFont] || 'Impact, "Arial Black", sans-serif';
        
        fontCSS = `
          ${allFontsCSS}
          text, tspan {
            font-family: ${fontStack} !important;
            fill: ${textColor} !important;
          }
        `;
        console.log('Aplicando fonte do sistema:', fontStack);
      }
      
      styleEl.textContent = fontCSS;
      svgRoot.insertBefore(styleEl, svgRoot.firstChild);

      // Função aprimorada para substituir texto preservando posição e efeitos
      const replaceTextPreservingEffects = (svgRoot: Element, targetText: string, newText: string, isArtist: boolean = true) => {
        console.log(`Procurando por "${targetText}" para substituir por "${newText}"`);

        // Primeiro procurar por IDs específicos
        const artistEl = svgRoot.querySelector('text[id="ARTIST"]');
        const titleEl = svgRoot.querySelector('text[id="TITLE"]');
        
        if (isArtist && artistEl) {
          console.log('Encontrado text[id="ARTIST"] - preservando estrutura');
          
          // Preservar todos os atributos originais exceto o conteúdo
          const originalAttributes: Record<string, string> = {};
          for (let i = 0; i < artistEl.attributes.length; i++) {
            const attr = artistEl.attributes[i];
            originalAttributes[attr.name] = attr.value;
          }
          
          // Limpar conteúdo mas preservar estrutura
          while (artistEl.firstChild) {
            artistEl.removeChild(artistEl.firstChild);
          }
          
          // Restaurar atributos e adicionar font
          Object.keys(originalAttributes).forEach(name => {
            artistEl.setAttribute(name, originalAttributes[name]);
          });
          artistEl.setAttribute('font-family', selectedFont);
          artistEl.setAttribute('fill', textColor);
          
          // Adicionar novo texto
          artistEl.textContent = newText;
          console.log(`ARTIST substituído preservando estrutura original`);
          return true;
        }
        
        if (!isArtist && titleEl) {
          console.log('Encontrado text[id="TITLE"] - preservando estrutura');
          
          // Preservar todos os atributos originais
          const originalAttributes: Record<string, string> = {};
          for (let i = 0; i < titleEl.attributes.length; i++) {
            const attr = titleEl.attributes[i];
            originalAttributes[attr.name] = attr.value;
          }
          
          while (titleEl.firstChild) {
            titleEl.removeChild(titleEl.firstChild);
          }
          
          Object.keys(originalAttributes).forEach(name => {
            titleEl.setAttribute(name, originalAttributes[name]);
          });
          titleEl.setAttribute('font-family', selectedFont);
          titleEl.setAttribute('fill', textColor);
          
          titleEl.textContent = newText;
          console.log(`TITLE substituído preservando estrutura original`);
          return true;
        }

        // Buscar por conteúdo de texto específico - busca mais abrangente
        const allTextElements = svgRoot.querySelectorAll('text, tspan');
        console.log(`Procurando "${targetText}" em ${allTextElements.length} elementos text/tspan...`);
        
        for (let i = 0; i < allTextElements.length; i++) {
          const el = allTextElements[i];
          const content = el.textContent?.trim() || '';
          
          // Busca flexível para diferentes variações de placeholder
          const shouldReplace = 
            content.toLowerCase().includes(targetText.toLowerCase()) ||
            content === targetText ||
            (targetText === 'TRACK NAME' && (content.toLowerCase().includes('track') || content.toLowerCase().includes('nome'))) ||
            (targetText === 'ARTIST' && (content.toLowerCase().includes('artist') || content.toLowerCase().includes('artista'))) ||
            (targetText === 'TITLE' && (content.toLowerCase().includes('title') || content.toLowerCase().includes('titulo'))) ||
            // Busca por placeholders genéricos
            (isArtist && (content.toLowerCase().includes('artist') || content.toLowerCase().includes('nome') || content.toLowerCase().includes('track'))) ||
            (!isArtist && (content.toLowerCase().includes('title') || content.toLowerCase().includes('song') || content.toLowerCase().includes('musica')));
          
          if (shouldReplace) {
            
            console.log(`Encontrou "${targetText}" no elemento: "${content}"`);
            
            // Preservar todos os atributos e estrutura original
            const originalAttributes: Record<string, string> = {};
            
            for (let j = 0; j < el.attributes.length; j++) {
              const attr = el.attributes[j];
              originalAttributes[attr.name] = attr.value;
            }
            
            // Substituir apenas o conteúdo de texto
            while (el.firstChild) {
              el.removeChild(el.firstChild);
            }
            
            // Restaurar todos os atributos originais
            Object.keys(originalAttributes).forEach(name => {
              el.setAttribute(name, originalAttributes[name]);
            });
            
            // Aplicar font apenas se não conflitar com estilos existentes
            const classAttr = originalAttributes['class'] || '';
            if (!classAttr || !classAttr.includes('cls-')) {
              el.setAttribute('font-family', selectedFont);
              el.setAttribute('fill', textColor);
            }
            
            // Adicionar novo texto preservando posicionamento
            el.textContent = newText;
            
            console.log(`Texto "${targetText}" substituído por "${newText}" preservando efeitos`);
            return true;
          }
        }
        
        console.warn(`Texto "${targetText}" não encontrado no SVG`);
        return false;
      };

      // Função para aplicar template de 3 camadas: imagem base + texto SVG + overlay SVG
      const applyThreeLayerTemplate = async ({
        baseImageUrl,
        textSvgContent,
        overlaySvgContent,
        canvasRef,
        formData,
        selectedFont,
        textColor,
        fonts
      }: {
        baseImageUrl: string;
        textSvgContent: string;
        overlaySvgContent: string;
        canvasRef: React.RefObject<HTMLCanvasElement>;
        formData: any;
        selectedFont: string;
        textColor: string;
        fonts: any[];
      }) => {
        try {
          const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });

          const injectFonts = (svgDoc: Document) => {
            const styleEl = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
            let css = '';
            fonts.forEach(font => {
              const format = font.ext === 'ttf' ? 'truetype' : font.ext === 'otf' ? 'opentype' : 'woff2';
              css += `@font-face { font-family: '${font.name}'; src: url(data:font/${font.ext};base64,${font.base64}) format('${format}'); font-display: swap; }`;
            });
            css += `text, tspan { font-family: '${selectedFont}'; fill: ${textColor}; }`;
            styleEl.textContent = css;
            svgDoc.documentElement.insertBefore(styleEl, svgDoc.documentElement.firstChild);
          };

          const substituteText = (svgDoc: Document) => {
            const artistEl = svgDoc.querySelector('text[id="ARTIST"]');
            const titleEl = svgDoc.querySelector('text[id="TITLE"]');
            
            // Também procurar por TRACK NAME como fallback
            const trackNameEl = svgDoc.querySelector('text') || svgDoc.querySelector('text[id="TITLE"]');
            
            if (artistEl && formData.artistName) {
              artistEl.textContent = formData.artistName;
              console.log(`ARTIST substituído por: ${formData.artistName}`);
            }
            if (titleEl && formData.songTitle) {
              titleEl.textContent = formData.songTitle;
              console.log(`TITLE substituído por: ${formData.songTitle}`);
            }
            
            // Se não encontrou ARTIST mas tem TRACK NAME, substitui pelo nome do artista
            if (!artistEl && trackNameEl && formData.artistName) {
              trackNameEl.textContent = formData.artistName;
              console.log(`TRACK NAME substituído por: ${formData.artistName}`);
            }
          };

          const serializeToDataURL = (svgString: string) => {
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            return URL.createObjectURL(blob);
          };

          console.log('Iniciando aplicação de template 3 camadas...');
          
          // Carregar imagem base
          const baseImage = await loadImage(baseImageUrl);
          console.log('Imagem base carregada');

          // Processar SVG de texto
          const parser = new DOMParser();
          const textSvgDoc = parser.parseFromString(textSvgContent, 'image/svg+xml');
          injectFonts(textSvgDoc);
          substituteText(textSvgDoc);
          const textSvgUrl = serializeToDataURL(new XMLSerializer().serializeToString(textSvgDoc));
          const textImage = await loadImage(textSvgUrl);
          console.log('SVG de texto processado');

          // Processar SVG de overlay
          const overlaySvgDoc = parser.parseFromString(overlaySvgContent, 'image/svg+xml');
          const overlaySvgUrl = serializeToDataURL(new XMLSerializer().serializeToString(overlaySvgDoc));
          const overlayImage = await loadImage(overlaySvgUrl);
          console.log('SVG de overlay processado');

          // Renderizar no canvas
          const canvas = canvasRef.current;
          if (!canvas) throw new Error("Canvas não encontrado");
          
          canvas.width = 1080;
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Contexto do canvas não encontrado");

          // Desenhar as 3 camadas
          ctx.drawImage(baseImage, 0, 0, 1080, 1080);
          ctx.drawImage(textImage, 0, 0, 1080, 1080);
          ctx.drawImage(overlayImage, 0, 0, 1080, 1080);

          console.log("Template de 3 camadas aplicado com sucesso!");
          
          // Cleanup URLs
          URL.revokeObjectURL(textSvgUrl);
          URL.revokeObjectURL(overlaySvgUrl);
          
        } catch (err) {
          console.error("Erro ao aplicar layout 3 camadas:", err);
          throw err;
        }
      };





      // Configurar proporção 1:1 do SVG
      svgRoot.setAttribute('width', '1080');
      svgRoot.setAttribute('height', '1080');
      svgRoot.setAttribute('viewBox', '0 0 1080 1080');

      // Reativar fontes antes de aplicar template
      reactivateFonts();
      
      // Log do SVG original para debug
      console.log('SVG original:', selectedTemplate.svg.substring(0, 500) + '...');
      
      // Substituir textos preservando efeitos e posicionamento - uma única passada
      const replaceAllTexts = (svgRoot: Element) => {
        const allTextElements = svgRoot.querySelectorAll('text, tspan');
        console.log(`Analisando ${allTextElements.length} elementos de texto...`);
        
        allTextElements.forEach((el, index) => {
          const content = el.textContent?.trim() || '';
          console.log(`Elemento ${index}: "${content}"`);
          
          // Determinar se é placeholder de artista
          const isArtistPlaceholder = 
            content.toLowerCase().includes('artist') ||
            content.toLowerCase().includes('artista') ||
            content.toLowerCase().includes('track') ||
            content.toLowerCase().includes('nome');
          
          // Determinar se é placeholder de título
          const isTitlePlaceholder = 
            content.toLowerCase().includes('title') ||
            content.toLowerCase().includes('titulo') ||
            content.toLowerCase().includes('song') ||
            content.toLowerCase().includes('musica');
          
          if (isArtistPlaceholder && formData.artistName) {
            console.log(`Substituindo "${content}" por "${formData.artistName}"`);
            
            // Preservar atributos originais
            const originalAttributes: Record<string, string> = {};
            for (let j = 0; j < el.attributes.length; j++) {
              const attr = el.attributes[j];
              originalAttributes[attr.name] = attr.value;
            }
            
            // Limpar e substituir conteúdo
            while (el.firstChild) {
              el.removeChild(el.firstChild);
            }
            
            // Restaurar atributos
            Object.keys(originalAttributes).forEach(name => {
              el.setAttribute(name, originalAttributes[name]);
            });
            
            // Aplicar fonte se não conflitar
            const classAttr = originalAttributes['class'] || '';
            if (!classAttr.includes('cls-')) {
              el.setAttribute('font-family', selectedFont);
              el.setAttribute('fill', textColor);
            }
            
            el.textContent = formData.artistName;
            
          } else if (isTitlePlaceholder && formData.songTitle) {
            console.log(`Substituindo "${content}" por "${formData.songTitle}"`);
            
            // Preservar atributos originais
            const originalAttributes: Record<string, string> = {};
            for (let j = 0; j < el.attributes.length; j++) {
              const attr = el.attributes[j];
              originalAttributes[attr.name] = attr.value;
            }
            
            // Limpar e substituir conteúdo
            while (el.firstChild) {
              el.removeChild(el.firstChild);
            }
            
            // Restaurar atributos
            Object.keys(originalAttributes).forEach(name => {
              el.setAttribute(name, originalAttributes[name]);
            });
            
            // Aplicar fonte se não conflitar
            const classAttr = originalAttributes['class'] || '';
            if (!classAttr.includes('cls-')) {
              el.setAttribute('font-family', selectedFont);
              el.setAttribute('fill', textColor);
            }
            
            el.textContent = formData.songTitle;
          }
        });
      };
      
      replaceAllTexts(svgRoot);
      
      // Log do SVG final para verificar mudanças
      const finalSvg = new XMLSerializer().serializeToString(svgRoot);
      console.log('SVG final:', finalSvg.substring(0, 500) + '...');

      // Aplicar apenas mudanças de cor se especificado, sem alterar fontes dos templates
      if (textColor !== '#ffffff') {
        const allTextElements = svgRoot.querySelectorAll('text, tspan');
        allTextElements.forEach((el) => {
          el.setAttribute('fill', textColor);
        });
      }

      // Serializa SVG e converte para imagem
      const svgString = new XMLSerializer().serializeToString(svgRoot);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const svgImg = new Image();
      svgImg.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        svgImg.onload = res;
        svgImg.onerror = rej;
        svgImg.src = svgUrl;
      });

      // Desenha tudo no canvas
      const canvas = canvasLayoutRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not found');
      canvas.width = 1080;
      canvas.height = 1080;
      ctx.clearRect(0, 0, 1080, 1080);
      
      // Calcula escala para cobrir todo o canvas mantendo proporção
      const scaleX = 1080 / baseImg.width;
      const scaleY = 1080 / baseImg.height;
      const scale = Math.max(scaleX, scaleY);
      
      const scaledWidth = baseImg.width * scale;
      const scaledHeight = baseImg.height * scale;
      
      // Centraliza a imagem
      const offsetX = (1080 - scaledWidth) / 2;
      const offsetY = (1080 - scaledHeight) / 2;
      
      ctx.drawImage(baseImg, offsetX, offsetY, scaledWidth, scaledHeight);
      ctx.drawImage(svgImg, 0, 0, 1080, 1080);

      // Preview final
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setFinalLayoutImage(url);
          toast({ title: 'Template aplicado!', description: 'Texto e fonte atualizados com sucesso' });
        }
      }, 'image/png');

      URL.revokeObjectURL(svgUrl);

    } catch (err: any) {
      console.error('Erro ao aplicar template:', err);
      toast({ title: 'Erro', description: err.message || 'Erro desconhecido', variant: 'destructive' });
    }
  };

  // Export final cover with template and save to storage
  const exportFinalCover = async () => {
    if (!canvasLayoutRef.current || !finalLayoutImage) {
      toast({
        title: "Nenhuma imagem final disponível",
        description: "Primeiro aplique um template",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = canvasLayoutRef.current;
      const artistName = formData.artistName?.trim() || 'Artist';
      const songTitle = formData.songTitle?.trim() || 'Song';
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob from canvas'));
        }, 'image/png');
      });

      // Save to server storage
      const formDataUpload = new FormData();
      formDataUpload.append('file', blob, `${artistName}_${songTitle}_final_cover.png`);
      
      const response = await fetch('/api/media-files', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const result = await response.json();
        queryClient.invalidateQueries({ queryKey: ["/api/media-files"] });
        
        toast({
          title: "Capa final salva com sucesso!",
          description: `Imagem salva no servidor e disponível na galeria de mídia`,
        });
      } else {
        throw new Error('Falha ao salvar no servidor');
      }

      // Also download locally
      const link = document.createElement('a');
      link.download = `${artistName}_${songTitle}_final_cover.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (error: any) {
      console.error('Export and save error:', error);
      toast({
        title: "Erro na exportação",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  // Upload independente dos SVGs
  const handleUploadTextSVG = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTextSVG(reader.result as string);
      toast({ title: "Texto SVG carregado com sucesso" });
    };
    reader.readAsText(file);
  };

  const handleUploadOverlaySVG = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOverlaySVG(reader.result as string);
      toast({ title: "Overlay SVG carregado com sucesso" });
    };
    reader.readAsText(file);
  };

  // Aplicar template principal de 3 camadas
  const handleApplyThreeLayerTemplate = async () => {
    if ((!uploadedCover && !imageIA) || !textSVG) {
      toast({
        title: "Erro",
        description: "Selecione uma imagem base e um SVG de texto",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Iniciando aplicação do template 3 camadas...');
      
      // Função para carregar imagem
      const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      // Obter URL da imagem base
      const baseImageUrl = uploadedCover || imageIA || '';
      if (!baseImageUrl) throw new Error("Nenhuma imagem base disponível");

      const baseImage = await loadImage(baseImageUrl);

      // Processar SVG de texto
      const parser = new DOMParser();
      const textSvgDoc = parser.parseFromString(textSVG, 'image/svg+xml');
      
      // Injetar fontes no SVG de texto
      const styleEl = textSvgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
      let css = '';
      
      // Usar fontes do servidor se disponíveis
      if (serverFonts && serverFonts.length > 0) {
        serverFonts.forEach((font: any) => {
          const format = font.ext === 'ttf' ? 'truetype' : font.ext === 'otf' ? 'opentype' : 'woff2';
          css += `@font-face { font-family: '${font.name}'; src: url(data:font/${font.ext};base64,${font.base64}) format('${format}'); font-display: swap; }`;
        });
      }
      
      css += `text, tspan { font-family: '${selectedFont}'; fill: ${textColor}; }`;
      styleEl.textContent = css;
      textSvgDoc.documentElement.insertBefore(styleEl, textSvgDoc.documentElement.firstChild);

      // Substituir textos usando nossa função inteligente
      const allTextElements = textSvgDoc.documentElement.querySelectorAll('text, tspan');
      console.log(`Analisando ${allTextElements.length} elementos de texto para substituição...`);
      
      allTextElements.forEach((el, index) => {
        const content = el.textContent?.trim() || '';
        console.log(`Elemento ${index}: "${content}"`);
        
        // Determinar se é placeholder de artista
        const isArtistPlaceholder = 
          content.toLowerCase().includes('artist') ||
          content.toLowerCase().includes('artista') ||
          content.toLowerCase().includes('track') ||
          content.toLowerCase().includes('nome');
        
        // Determinar se é placeholder de título
        const isTitlePlaceholder = 
          content.toLowerCase().includes('title') ||
          content.toLowerCase().includes('titulo') ||
          content.toLowerCase().includes('song') ||
          content.toLowerCase().includes('musica');
        
        if (isArtistPlaceholder && formData.artistName) {
          console.log(`Substituindo "${content}" por "${formData.artistName}"`);
          el.textContent = formData.artistName;
        } else if (isTitlePlaceholder && formData.songTitle) {
          console.log(`Substituindo "${content}" por "${formData.songTitle}"`);
          el.textContent = formData.songTitle;
        }
      });

      // Converter SVG de texto para imagem
      const textSvgString = new XMLSerializer().serializeToString(textSvgDoc);
      const textSvgBlob = new Blob([textSvgString], { type: 'image/svg+xml' });
      const textSvgUrl = URL.createObjectURL(textSvgBlob);
      const textImage = await loadImage(textSvgUrl);

      // Processar SVG de overlay se existir
      let overlayImage: HTMLImageElement | null = null;
      let overlaySvgUrl: string | null = null;
      if (overlaySVG) {
        const overlaySvgDoc = parser.parseFromString(overlaySVG, 'image/svg+xml');
        const overlaySvgString = new XMLSerializer().serializeToString(overlaySvgDoc);
        const overlaySvgBlob = new Blob([overlaySvgString], { type: 'image/svg+xml' });
        overlaySvgUrl = URL.createObjectURL(overlaySvgBlob);
        overlayImage = await loadImage(overlaySvgUrl);
      }

      // Compor no canvas
      const canvas = canvasLayoutRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) throw new Error("Canvas não encontrado");
      
      canvas.width = 1080;
      canvas.height = 1080;
      ctx.clearRect(0, 0, 1080, 1080);

      // Desenhar camadas na ordem: base -> texto -> overlay
      ctx.drawImage(baseImage, 0, 0, 1080, 1080);
      ctx.drawImage(textImage, 0, 0, 1080, 1080);
      if (overlayImage) {
        ctx.drawImage(overlayImage, 0, 0, 1080, 1080);
      }

      // Gerar preview final
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setFinalLayoutImage(url);
          toast({ title: "Template de 3 camadas aplicado com sucesso!" });
        }
      }, 'image/png');

      // Limpar URLs temporárias
      URL.revokeObjectURL(textSvgUrl);
      if (overlaySvgUrl) URL.revokeObjectURL(overlaySvgUrl);

    } catch (error) {
      console.error('Erro ao aplicar template 3 camadas:', error);
      toast({
        title: "Erro",
        description: "Erro ao aplicar template de 3 camadas",
        variant: "destructive"
      });
    }
  };

  // Funções para aba de teste de camadas
  const handleTestImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'base' | 'text' | 'overlay') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'base') setTestBaseImage(reader.result as string);
      if (type === 'text') setTestTextSvg(reader.result as string);
      if (type === 'overlay') setTestOverlaySvg(reader.result as string);
    };
    
    if (type === 'text' || type === 'overlay') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const drawTestLayer = async (ctx: CanvasRenderingContext2D, src: string, options: {
    alpha?: number;
    blend?: string;
    scale?: number;
  } = {}) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = options.alpha || 1;
        ctx.globalCompositeOperation = (options.blend as GlobalCompositeOperation) || 'source-over';
        
        // Calcular escala para fit to canvas (1080x1080)
        const scaleX = 1080 / img.width;
        const scaleY = 1080 / img.height;
        const autoScale = Math.min(scaleX, scaleY); // Fit mantendo proporção
        const finalScale = (options.scale || 1) * autoScale;
        
        const w = img.width * finalScale;
        const h = img.height * finalScale;
        
        // Centralizar na tela
        const x = (1080 - w) / 2;
        const y = (1080 - h) / 2;
        
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  };

  const applyTestCanvas = async () => {
    const canvas = testCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, 1080, 1080);

    // Desenhar imagem base
    if (showBase && testBaseImage) {
      await drawTestLayer(ctx, testBaseImage, { 
        alpha: alphaBase, 
        blend: blendBase, 
        scale: scaleBase 
      });
    }

    // Desenhar SVG de texto
    if (showText && testTextSvg) {
      let svgTextProcessed = testTextSvg;
      
      // Parser DOM para manipular SVG corretamente
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgTextProcessed, 'image/svg+xml');
      
      // Substituição usando regex no SVG bruto primeiro
      let svgProcessed = svgTextProcessed
        .replace(/Track Name/gi, textReplacers.TITLE)
        .replace(/TRACK NAME/gi, textReplacers.TITLE)
        .replace(/ARTIST/gi, textReplacers.ARTIST)
        .replace(/TITLE/gi, textReplacers.TITLE);
      
      // Reprocessar com DOM para casos complexos
      const svgDocProcessed = parser.parseFromString(svgProcessed, 'image/svg+xml');
      const textElements = svgDocProcessed.querySelectorAll('text');
      console.log(`Teste de camadas: Encontrados ${textElements.length} elementos text após regex`);
      
      textElements.forEach((element, index) => {
        const content = element.textContent?.trim() || '';
        console.log(`Elemento ${index}: "${content}"`);
        
        // Substituir qualquer texto restante
        if (content.toLowerCase().includes('track') || content.toLowerCase().includes('name')) {
          console.log(`Substituindo "${content}" por "${textReplacers.TITLE}"`);
          element.textContent = textReplacers.TITLE;
        } else if (content.toLowerCase().includes('artist')) {
          console.log(`Substituindo "${content}" por "${textReplacers.ARTIST}"`);
          element.textContent = textReplacers.ARTIST;
        }
      });
      
      // Serializar SVG modificado
      const serializer = new XMLSerializer();
      const modifiedSvg = serializer.serializeToString(svgDocProcessed);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvg)}`;
      
      await drawTestLayer(ctx, svgDataUrl, { 
        alpha: alphaText, 
        blend: blendText, 
        scale: scaleText 
      });
    }

    // Desenhar SVG de overlay
    if (showOverlay && testOverlaySvg) {
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(testOverlaySvg)}`;
      await drawTestLayer(ctx, svgDataUrl, { 
        alpha: alphaOverlay, 
        blend: blendOverlay, 
        scale: scaleOverlay 
      });
    }
  };

  const exportTestImage = () => {
    const canvas = testCanvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = 'teste_camadas.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      
      {/* Modal global */}
      {modalImageUrl && <ImageModal imageUrl={modalImageUrl} onClose={() => setModalImageUrl(null)} />}
      
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Zentraw Artist Toolkit V2.12</h1>
          <p className="text-gray-300">Complete AI-powered music marketing solution</p>
        </div>

        <Tabs defaultValue="bio" className="w-full">
          <div className="mb-6 space-y-2">
            {/* Primeira linha de abas */}
            <TabsList className="grid grid-cols-5 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="bio" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Bio
              </TabsTrigger>
              <TabsTrigger value="release" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Release
              </TabsTrigger>
              <TabsTrigger value="midia" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="capa" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Cover
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Layout Final
              </TabsTrigger>
            </TabsList>
            
            {/* Segunda linha de abas */}
            <TabsList className="grid grid-cols-4 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="teste" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Teste Camadas
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Editor V3
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="kit" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Final Kit
              </TabsTrigger>
              <TabsTrigger value="recentes" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Biography Tab */}
          <TabsContent value="bio">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="artist-name" className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
                    <Input
                      id="artist-name"
                      name="artistName"
                      value={formData.artistName}
                      onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                      placeholder="Your artist name"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                    <Input
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="Music genre"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Achievements</label>
                    <Input
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="Awards, chart positions, etc."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Influences</label>
                    <Input
                      value={formData.influences}
                      onChange={(e) => setFormData({ ...formData, influences: e.target.value })}
                      placeholder="Musical influences"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                    <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Audience</label>
                    <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="press">Press</SelectItem>
                        <SelectItem value="fans">Fans</SelectItem>
                        <SelectItem value="industry">Industry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => generateBioMutation.mutate(formData)}
                    disabled={generateBioMutation.isPending}
                    className="gradient-blue hover:opacity-90"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {generateBioMutation.isPending ? "Generating..." : "Generate Bio"}
                  </Button>
                  <Button 
                    onClick={() => saveProjectMutation.mutate(formData)}
                    disabled={saveProjectMutation.isPending}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Project
                  </Button>
                </div>

                {bioOutput && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white mb-2">Generated Biography</h4>
                    <div className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{bioOutput}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(bioOutput)}
                        className="border-white/20 hover:bg-white/10 text-white"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleExportPDF(bioOutput, `${formData.artistName}-biography.pdf`)}
                        className="gradient-blue hover:opacity-90"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Press Release Tab */}
          <TabsContent value="release">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Song Title</label>
                    <Input
                      value={formData.songTitle}
                      onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                      placeholder="Song or album title"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Music Style</label>
                    <Input
                      value={formData.musicStyle}
                      onChange={(e) => setFormData({ ...formData, musicStyle: e.target.value })}
                      placeholder="Electronic, Pop, etc."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
                    <Input
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      placeholder="Energetic, Melancholic, etc."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                    <Input
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      placeholder="When will it be released?"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Collaborators</label>
                    <Input
                      value={formData.collaborators}
                      onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
                      placeholder="Featured artists, producers"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme/Message</label>
                  <Textarea
                    value={formData.themeMessage}
                    onChange={(e) => setFormData({ ...formData, themeMessage: e.target.value })}
                    placeholder="What's the story behind this release?"
                    className="bg-white/5 border-white/20 text-white min-h-[100px]"
                  />
                </div>

                <div className="flex gap-4 mb-6">
                  <Button 
                    onClick={() => generateReleaseMutation.mutate(formData)}
                    disabled={generateReleaseMutation.isPending}
                    className="gradient-emerald hover:opacity-90"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {generateReleaseMutation.isPending ? "Generating..." : "Generate Release"}
                  </Button>
                  <Button 
                    onClick={() => saveProjectMutation.mutate(formData)}
                    disabled={saveProjectMutation.isPending}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Project
                  </Button>
                </div>

                {releaseOutput && (
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-medium text-white mb-2">Generated Press Release</h4>
                    <div className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{releaseOutput}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => copyToClipboard(releaseOutput)}
                        className="border-white/20 hover:bg-white/10 text-white"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleExportPDF(releaseOutput, `${formData.artistName}-press-release.pdf`)}
                        className="gradient-blue hover:opacity-90"
                      >
                        <FileDown className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="midia">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Upload */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Press Photo</h3>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, pressPhoto: file });
                            uploadFileMutation.mutate(file);
                          }
                        }}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-300">Click to upload press photo</p>
                      </label>
                    </div>
                    {photoPreview && (
                      <div className="mt-4">
                        <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  {/* Audio Upload */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Audio Track</h3>
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, audioFile: file });
                            uploadFileMutation.mutate(file);
                          }
                        }}
                        className="hidden"
                        id="audio-upload"
                      />
                      <label htmlFor="audio-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-300">Click to upload audio track</p>
                      </label>
                    </div>
                    {audioPreview && (
                      <div className="mt-4">
                        <audio controls src={audioPreview} className="w-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Library */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Media Library</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaFiles.map((file: any) => (
                      <div key={file.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                        {file.type === 'image' ? (
                          <img src={file.url} alt={file.originalName} className="w-full h-24 object-cover rounded mb-2" />
                        ) : (
                          <div className="w-full h-24 bg-gray-700 rounded mb-2 flex items-center justify-center">
                            <Music className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <p className="text-xs text-gray-300 truncate">{file.originalName}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-2 text-xs border-white/20 hover:bg-white/10 text-white"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url;
                            link.download = file.originalName;
                            link.click();
                          }}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cover Tab */}
          <TabsContent value="capa">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Cover Art Generator</h3>
                  
                  {/* Method Selection */}
                  <div className="flex gap-4 mb-6">
                    <Button 
                      onClick={() => setCoverMethod('ai')}
                      variant={coverMethod === 'ai' ? 'default' : 'outline'}
                      className={coverMethod === 'ai' ? 'gradient-purple' : 'border-white/20 hover:bg-white/10 text-white'}
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      AI Generation
                    </Button>
                    <Button 
                      onClick={() => setCoverMethod('upload')}
                      variant={coverMethod === 'upload' ? 'default' : 'outline'}
                      className={coverMethod === 'upload' ? 'gradient-blue' : 'border-white/20 hover:bg-white/10 text-white'}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <Button 
                      onClick={() => setCoverMethod('bank')}
                      variant={coverMethod === 'bank' ? 'default' : 'outline'}
                      className={coverMethod === 'bank' ? 'gradient-emerald' : 'border-white/20 hover:bg-white/10 text-white'}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Partner Bank
                    </Button>
                  </div>

                  {/* AI Generation Method */}
                  {coverMethod === 'ai' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Cover Style</label>
                          <Select value={formData.musicStyle} onValueChange={(value) => setFormData({ ...formData, musicStyle: value })}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Choose style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimalist">Minimalist</SelectItem>
                              <SelectItem value="abstract">Abstract</SelectItem>
                              <SelectItem value="vintage">Vintage</SelectItem>
                              <SelectItem value="futuristic">Futuristic</SelectItem>
                              <SelectItem value="grunge">Grunge</SelectItem>
                              <SelectItem value="neon">Neon</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Color Palette</label>
                          <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                            <SelectTrigger className="bg-white/5 border-white/20 text-white">
                              <SelectValue placeholder="Choose colors" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dark">Dark & Moody</SelectItem>
                              <SelectItem value="bright">Bright & Vibrant</SelectItem>
                              <SelectItem value="pastel">Soft Pastels</SelectItem>
                              <SelectItem value="monochrome">Black & White</SelectItem>
                              <SelectItem value="warm">Warm Tones</SelectItem>
                              <SelectItem value="cool">Cool Tones</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Visual Theme</label>
                        <Textarea
                          value={formData.themeMessage}
                          onChange={(e) => setFormData({ ...formData, themeMessage: e.target.value })}
                          placeholder="Describe the visual theme (e.g., urban landscape, abstract geometry, nature elements)"
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>

                      <Button 
                        onClick={generateImageIA}
                        disabled={isGeneratingImage}
                        className="gradient-purple hover:opacity-90 w-full"
                      >
                        {isGeneratingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Gerando capa...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Gerar Capa com IA
                          </>
                        )}
                      </Button>

                      {isGeneratingImage && (
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm text-gray-300">
                            <span>Gerando sua capa personalizada...</span>
                            <span>{Math.round(imageProgress)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${imageProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upload Method */}
                  {coverMethod === 'upload' && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setUploadedCover(url);
                              setImageIA(url);
                              uploadFileMutation.mutate(file);
                            }
                          }}
                          className="hidden"
                          id="cover-upload"
                        />
                        <label htmlFor="cover-upload" className="cursor-pointer">
                          <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-white text-lg mb-2">Upload Your Cover Art</p>
                          <p className="text-gray-400 text-sm">Click to select an image file</p>
                          <p className="text-gray-500 text-xs mt-2">Recommended: 2048x2048px, JPG or PNG</p>
                        </label>
                      </div>

                      {uploadedCover && (
                        <div className="text-center">
                          <img src={uploadedCover} alt="Uploaded Cover" className="mx-auto max-w-md rounded-lg shadow-lg" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Partner Bank Method */}
                  {coverMethod === 'bank' && (
                    <div className="space-y-4">
                      <div className="text-center p-8">
                        <h4 className="text-lg font-semibold text-white mb-4">Partner Image Bank</h4>
                        <p className="text-gray-300 mb-6">Choose from thousands of high-quality stock images from our partner network</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                          {/* Sample partner images */}
                          {[
                            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1571974599782-87ad85da9a64?w=300&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&sat=-100',
                            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
                            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&hue=180',
                            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
                          ].map((src, index) => (
                            <div 
                              key={index}
                              className="relative cursor-pointer group"
                              onClick={() => setImageIA(src)}
                            >
                              <img 
                                src={src} 
                                alt={`Stock ${index + 1}`} 
                                className="w-full h-24 object-cover rounded-lg border border-white/20 group-hover:border-purple-400 transition-colors"
                              />
                              <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <Eye className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                          Browse More Images
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Export Options */}
                  {(imageIA || uploadedCover) && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Export Options</h4>
                        <Button 
                          onClick={exportCoverSizes}
                          className="gradient-blue hover:opacity-90"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Export All Sizes
                        </Button>
                      </div>

                      <div className="text-center mb-6">
                        <img 
                          src={imageIA || uploadedCover || ''} 
                          alt="Final Cover" 
                          className="mx-auto max-w-sm rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
                          onClick={() => setModalImageUrl(imageIA || uploadedCover || '')}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <p className="font-medium">Spotify</p>
                          <p>2048x2048</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <p className="font-medium">Instagram</p>
                          <p>1080x1350</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <p className="font-medium">Stories</p>
                          <p>1080x1920</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg text-center">
                          <p className="font-medium">YouTube</p>
                          <p>1920x1080</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Exported Images Preview */}
                  {exportedImages.length > 0 && (
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h4 className="text-lg font-semibold text-white mb-4">Capas Exportadas</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {exportedImages.map((img) => (
                          <div key={img.name} className="text-center space-y-2">
                            <p className="text-sm text-gray-300 font-medium capitalize">{img.name.replace('_', ' ')}</p>
                            <img
                              src={img.url}
                              alt={img.name}
                              className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity border border-white/20"
                              onClick={() => setModalImageUrl(img.url)}
                            />
                            <div className="flex gap-2">
                              <a
                                href={img.url}
                                download={`${formData.artistName || 'cover'}_${img.name}.png`}
                                className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Baixar
                              </a>
                              <button
                                onClick={() => setModalImageUrl(img.url)}
                                className="text-xs text-purple-400 hover:text-purple-300 underline flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                Ver
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Final Kit Tab */}
          <TabsContent value="kit">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Export Complete Press Kit</h3>
                  <p className="text-gray-300">Generate a complete marketing package with all your content</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={exportMiniSite}
                    className="gradient-blue hover:opacity-90 p-6 h-auto flex-col"
                  >
                    <Package className="h-8 w-8 mb-2" />
                    <span className="text-lg">Export Mini Site</span>
                    <span className="text-sm opacity-80">Complete HTML press kit</span>
                  </Button>

                  <Button 
                    onClick={() => {
                      const fullContent = `${bioOutput}\n\n${releaseOutput}`;
                      handleExportPDF(fullContent, `${formData.artistName}-complete-kit.pdf`);
                    }}
                    className="gradient-emerald hover:opacity-90 p-6 h-auto flex-col"
                  >
                    <FileDown className="h-8 w-8 mb-2" />
                    <span className="text-lg">Export PDF Kit</span>
                    <span className="text-sm opacity-80">Bio + Press Release</span>
                  </Button>

                  <Button 
                    onClick={exportCoverSizes}
                    className="gradient-purple hover:opacity-90 p-6 h-auto flex-col"
                  >
                    <Palette className="h-8 w-8 mb-2" />
                    <span className="text-lg">Export Cover Art</span>
                    <span className="text-sm opacity-80">All platform sizes</span>
                  </Button>

                  <Button 
                    onClick={() => saveProjectMutation.mutate(formData)}
                    disabled={saveProjectMutation.isPending}
                    className="gradient-yellow hover:opacity-90 p-6 h-auto flex-col"
                  >
                    <Save className="h-8 w-8 mb-2" />
                    <span className="text-lg">Save Complete Project</span>
                    <span className="text-sm opacity-80">All data & media</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="recentes">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Saved Projects</h3>
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/projects"] })}
                    variant="outline"
                    className="border-white/20 hover:bg-white/10 text-white"
                  >
                    Refresh
                  </Button>
                </div>

                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No projects saved yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projects.map((project: any) => (
                      <div key={project.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{project.name}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">Type: {project.type}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm"
                            onClick={() => loadProjectIntoForm(project)}
                            className="gradient-blue hover:opacity-90"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Load
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProject(project.id)}
                            className="border-red-500/50 hover:bg-red-500/10 text-red-300"
                          >
                            <Trash className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Final Tab */}
          <TabsContent value="layout">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Layout Final - Aplicar Template</h2>
                  <p className="text-gray-300">Escolha um template SVG e aplique sobre sua capa gerada</p>
                </div>

                {/* Upload SVG Template */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Upload Template SVG Personalizado</h3>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".svg"
                      onChange={handleUploadSVG}
                      className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
                    />
                    <div className="text-sm text-gray-400">
                      Carregue arquivos SVG com placeholders ARTIST e TITLE
                    </div>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Escolher Template</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...mockTemplates, ...uploadedTemplates].map((template) => (
                      <Button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        variant={selectedTemplate?.id === template.id ? 'default' : 'outline'}
                        className={`h-20 relative ${
                          selectedTemplate?.id === template.id 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'border-white/20 hover:bg-white/10 text-white'
                        }`}
                      >
                        <div className="text-center">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {template.isUploaded ? (
                              <span className="text-green-400">Personalizado</span>
                            ) : (
                              <>
                                {template.id === 'template1' && 'Texto centralizado'}
                                {template.id === 'template2' && 'Estilo bold'}
                                {template.id === 'template3' && 'Canto inferior'}
                                {template.id === 'template4' && 'Banner superior'}
                              </>
                            )}
                          </div>
                        </div>
                        {template.isUploaded && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Font and Color Customization */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-4">Personalização de Texto</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Font Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Fonte do Texto</label>
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Selecione uma fonte" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          {availableFonts.map((font) => (
                            <SelectItem key={font.name} value={font.name} className="text-white hover:bg-white/10">
                              <span style={{ fontFamily: `'${font.name}', sans-serif` }}>
                                {font.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cor do Texto</label>
                      <div className="grid grid-cols-5 gap-2">
                        {textColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setTextColor(color.value)}
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              textColor === color.value 
                                ? 'border-white scale-110' 
                                : 'border-gray-600 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="mt-2 h-8 w-full bg-white/5 border-white/20"
                        title="Cor personalizada"
                      />
                    </div>
                  </div>

                  {/* Font Preview */}
                  {selectedFont && (
                    <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preview da Fonte Selecionada</label>
                      <div 
                        className="text-white text-2xl mb-2"
                        style={{ 
                          fontFamily: `'${selectedFont}', Arial, sans-serif`,
                          color: textColor 
                        }}
                      >
                        {formData.artistName || 'ARTIST'}
                      </div>
                      <div 
                        className="text-lg"
                        style={{ 
                          fontFamily: `'${selectedFont}', Arial, sans-serif`,
                          color: textColor 
                        }}
                      >
                        {formData.songTitle || 'TITLE'}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Fonte atual: {selectedFont}
                      </div>
                    </div>
                  )}
                </div>

                {/* Current Data Preview */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-2">Preview do Texto:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded border border-white/10">
                      <div 
                        className="text-2xl font-bold mb-2"
                        style={{ 
                          fontFamily: `'${selectedFont}', sans-serif`,
                          color: textColor 
                        }}
                      >
                        {formData.artistName || 'Nome do Artista'}
                      </div>
                      <div 
                        className="text-lg"
                        style={{ 
                          fontFamily: `'${selectedFont}', sans-serif`,
                          color: textColor 
                        }}
                      >
                        {formData.songTitle || 'Título da Música'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Template Button */}
                <div className="mb-6 flex flex-wrap gap-4">
                  <Button 
                    onClick={applyTemplate}
                    disabled={!selectedTemplate}
                    className="gradient-blue hover:opacity-90 flex-1 md:flex-none"
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Aplicar Template Selecionado
                  </Button>
                  
                  {finalLayoutImage && (
                    <Button 
                      onClick={exportFinalCover}
                      variant="outline"
                      className="border-green-500/50 hover:bg-green-500/10 text-green-300 flex-1 md:flex-none"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar Capa Final
                    </Button>
                  )}
                </div>

                {/* Sistema de 3 Camadas Avançado */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-white px-2 py-1 rounded text-xs mr-2">NOVO</span>
                    Sistema de 3 Camadas Avançado
                  </h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Combine imagem base + texto SVG + overlay SVG para capas profissionais
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-400">
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="font-medium text-white">Camada 1</div>
                      <div>Imagem Base</div>
                      <div className="text-green-400">{(uploadedCover || imageIA) ? '✓ Pronta' : '• Pendente'}</div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="font-medium text-white">Camada 2</div>
                      <div>Texto SVG</div>
                      <div className="text-green-400">{textSVG ? '✓ Carregado' : '• Pendente'}</div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded">
                      <div className="font-medium text-white">Camada 3</div>
                      <div>Overlay SVG</div>
                      <div className="text-yellow-400">{overlaySVG ? '✓ Carregado' : '• Opcional'}</div>
                    </div>
                  </div>

                  {/* Upload buttons for SVGs */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Upload SVG de Texto</label>
                      <input
                        type="file"
                        accept=".svg"
                        onChange={handleUploadTextSVG}
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                      />
                      {textSVG && <div className="text-xs text-green-400 mt-1">✓ SVG de texto carregado</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Upload SVG de Overlay</label>
                      <input
                        type="file"
                        accept=".svg"
                        onChange={handleUploadOverlaySVG}
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      {overlaySVG && <div className="text-xs text-green-400 mt-1">✓ SVG de overlay carregado</div>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleApplyThreeLayerTemplate}
                    className="w-full mb-4 gradient-purple hover:opacity-90"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Aplicar Template 3 Camadas
                  </Button>

                  <Button 
                    onClick={async () => {
                      try {
                        if (!uploadedCover && !imageIA) {
                          toast({ title: 'Erro', description: 'Carregue uma imagem base primeiro', variant: 'destructive' });
                          return;
                        }
                        if (!selectedTemplate?.svg) {
                          toast({ title: 'Erro', description: 'Carregue um template SVG primeiro', variant: 'destructive' });
                          return;
                        }

                        // SVG de exemplo para overlay (efeitos visuais simples)
                        const overlayExample = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">
                          <defs>
                            <radialGradient id="overlay-gradient" cx="50%" cy="50%">
                              <stop offset="0%" style="stop-color:rgba(255,255,255,0.1)" />
                              <stop offset="100%" style="stop-color:rgba(0,0,0,0.3)" />
                            </radialGradient>
                          </defs>
                          <rect width="1080" height="1080" fill="url(#overlay-gradient)" opacity="0.5"/>
                          <circle cx="540" cy="540" r="300" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                        </svg>`;

                        // Implementação direta do sistema de 3 camadas
                        const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
                          const img = new Image();
                          img.crossOrigin = 'anonymous';
                          img.onload = () => resolve(img);
                          img.onerror = reject;
                          img.src = src;
                        });

                        // Carregar imagem base
                        const baseImage = await loadImage(uploadedCover || imageIA || '');

                        // Processar SVG de texto
                        const parser = new DOMParser();
                        const textSvgDoc = parser.parseFromString(selectedTemplate.svg, 'image/svg+xml');
                        
                        // Injetar fontes no SVG
                        const styleEl = textSvgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
                        let css = `text, tspan { font-family: '${selectedFont}'; fill: ${textColor}; }`;
                        styleEl.textContent = css;
                        textSvgDoc.documentElement.insertBefore(styleEl, textSvgDoc.documentElement.firstChild);

                        // Substituir texto
                        const artistEl = textSvgDoc.querySelector('text[id="ARTIST"]') || textSvgDoc.querySelector('text');
                        const titleEl = textSvgDoc.querySelector('text[id="TITLE"]');
                        
                        if (artistEl && formData.artistName) artistEl.textContent = formData.artistName;
                        if (titleEl && formData.songTitle) titleEl.textContent = formData.songTitle;

                        const textSvgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(textSvgDoc)], { type: 'image/svg+xml' }));
                        const textImage = await loadImage(textSvgUrl);

                        // Processar SVG de overlay
                        const overlaySvgDoc = parser.parseFromString(overlayExample, 'image/svg+xml');
                        const overlaySvgUrl = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(overlaySvgDoc)], { type: 'image/svg+xml' }));
                        const overlayImage = await loadImage(overlaySvgUrl);

                        // Renderizar no canvas
                        const targetCanvas = canvasLayoutRef.current;
                        if (!targetCanvas) throw new Error("Canvas não encontrado");
                        
                        targetCanvas.width = 1080;
                        targetCanvas.height = 1080;
                        const ctx = targetCanvas.getContext('2d');
                        if (!ctx) throw new Error("Contexto do canvas não encontrado");

                        // Desenhar as 3 camadas
                        ctx.drawImage(baseImage, 0, 0, 1080, 1080);
                        ctx.drawImage(textImage, 0, 0, 1080, 1080);
                        ctx.drawImage(overlayImage, 0, 0, 1080, 1080);

                        // Cleanup URLs
                        URL.revokeObjectURL(textSvgUrl);
                        URL.revokeObjectURL(overlaySvgUrl);

                        // Gerar preview final
                        targetCanvas.toBlob((blob) => {
                          if (blob) {
                            const url = URL.createObjectURL(blob);
                            setFinalLayoutImage(url);
                            toast({ 
                              title: 'Sucesso!', 
                              description: 'Template de 3 camadas aplicado com sucesso!' 
                            });
                          }
                        }, 'image/png');

                      } catch (error) {
                        console.error('Erro na demonstração 3 camadas:', error);
                        toast({ 
                          title: 'Erro', 
                          description: 'Erro ao aplicar template de 3 camadas', 
                          variant: 'destructive' 
                        });
                      }
                    }}
                    disabled={(!uploadedCover && !imageIA) || !selectedTemplate?.svg}
                    className="w-full gradient-purple hover:opacity-90"
                  >
                    <span className="mr-2">🎨</span>
                    Demonstrar Sistema 3 Camadas
                  </Button>
                </div>

                {/* Preview Canvas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Canvas Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Preview com Template</h3>
                    <div className="relative bg-black/20 rounded-lg p-4 border border-white/10">
                      <canvas 
                        ref={canvasLayoutRef} 
                        width={1080} 
                        height={1080} 
                        className="w-full max-w-md mx-auto border border-white/20 rounded-lg bg-white/5" 
                      />
                    </div>
                  </div>

                  {/* Final Result */}
                  {finalLayoutImage && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Resultado Final</h3>
                      <div className="relative bg-black/20 rounded-lg p-4 border border-white/10">
                        <img 
                          src={finalLayoutImage} 
                          alt="Layout final com template" 
                          className="w-full max-w-md mx-auto border border-white/20 rounded-lg cursor-pointer"
                          onClick={() => setModalImageUrl(finalLayoutImage)}
                        />
                        <div className="mt-4 flex gap-2 justify-center">
                          <Button 
                            onClick={() => setModalImageUrl(finalLayoutImage)}
                            variant="outline"
                            size="sm"
                            className="border-white/20 hover:bg-white/10 text-white"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Ampliado
                          </Button>
                          <Button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = finalLayoutImage;
                              link.download = `${formData.artistName}-${formData.songTitle}-layout-final.png`;
                              link.click();
                            }}
                            size="sm"
                            className="gradient-blue hover:opacity-90"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-300 font-medium mb-2">Como usar:</h4>
                  <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Preencha o nome do artista e título da música nas abas Bio/Release</li>
                    <li>Gere ou faça upload de uma capa na aba "Cover"</li>
                    <li>Opcionalmente, carregue templates SVG personalizados com placeholders ARTIST e TITLE</li>
                    <li>Escolha um template de layout que combine com seu estilo</li>
                    <li>Clique em "Aplicar Template" - o texto será ajustado automaticamente ao tamanho</li>
                    <li>Use "Exportar Capa Final" para salvar no servidor e baixar localmente</li>
                  </ol>
                  <div className="mt-3 p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <p className="text-yellow-200 text-xs">
                      <strong>Dica:</strong> Templates SVG personalizados devem usar "ARTIST" e "TITLE" como placeholders de texto. 
                      O sistema ajusta automaticamente o tamanho da fonte baseado no comprimento dos nomes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Painel Admin / Editor</h2>
                  <p className="text-gray-300">Upload de fontes customizadas e editor de imagem avançado</p>
                </div>

                {/* Font Upload Section */}
                <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Upload de Fontes Freepik</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Input
                      type="file"
                      accept=".woff2,.ttf,.otf"
                      multiple
                      onChange={handleUploadFonts}
                      className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
                    />
                    <Button onClick={reloadFreepikFonts} variant="outline" className="border-green-500/50 hover:bg-green-500/10 text-green-300">
                      Recarregar Freepik
                    </Button>
                    <div className="text-sm text-gray-400">
                      Carregue múltiplos arquivos .woff2, .ttf ou .otf de uma vez
                    </div>
                  </div>
                  
                  {/* Custom Fonts List */}
                  {customFonts.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">Fontes Personalizadas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {customFonts.map((font) => (
                          <div key={font.name} className="bg-white/10 p-2 rounded text-center">
                            <span 
                              className="text-white text-sm block"
                              style={{ fontFamily: `'${font.name}', sans-serif` }}
                            >
                              {font.label}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs border-red-500/50 hover:bg-red-500/10 text-red-300"
                              onClick={() => removeCustomFont(font.name)}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Editor Section */}
                <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Editor de Imagem</h3>
                  
                  {(imageIA || uploadedCover) ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <canvas 
                          ref={adminCanvasRef} 
                          width={500} 
                          height={500} 
                          className="border border-white/20 rounded-md bg-black/20 max-w-full"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        <Button 
                          onClick={() => applyFilter('none')}
                          className="gradient-blue hover:opacity-90 text-sm"
                        >
                          Original
                        </Button>
                        <Button 
                          onClick={() => applyFilter('grayscale')}
                          className="gradient-purple hover:opacity-90 text-sm"
                        >
                          Cinza
                        </Button>
                        <Button 
                          onClick={() => applyFilter('invert')}
                          className="gradient-yellow hover:opacity-90 text-sm"
                        >
                          Inverter
                        </Button>
                        <Button 
                          onClick={() => applyFilter('sepia')}
                          className="gradient-orange hover:opacity-90 text-sm"
                        >
                          Sépia
                        </Button>
                        <Button 
                          onClick={() => applyFilter('brightness')}
                          className="gradient-green hover:opacity-90 text-sm"
                        >
                          Brilho
                        </Button>
                      </div>

                      <div className="text-center">
                        <Button 
                          onClick={() => {
                            const canvas = adminCanvasRef.current;
                            if (canvas) {
                              console.log('Downloading edited image');
                              canvas.toBlob((blob) => {
                                if (blob) {
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `edited-cover-${Date.now()}.png`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  URL.revokeObjectURL(url);
                                  
                                  toast({
                                    title: "Download iniciado",
                                    description: "Imagem editada baixada com sucesso",
                                  });
                                } else {
                                  toast({
                                    title: "Erro no download",
                                    description: "Não foi possível processar a imagem",
                                    variant: "destructive",
                                  });
                                }
                              }, 'image/png', 1.0);
                            }
                          }}
                          className="gradient-blue hover:opacity-90"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Imagem Editada
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">Gere ou faça upload de uma capa primeiro na aba "Cover"</p>
                    </div>
                  )}
                </div>

                {/* SVG Editor Preview */}
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Visualização SVG</h3>
                  {selectedTemplate ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Template Selecionado:</h4>
                        <div className="bg-black/20 p-4 rounded border border-white/10">
                          <div className="text-center">
                            <div className="text-green-400 font-medium">{selectedTemplate.name}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {selectedTemplate.isUploaded ? 'Template personalizado' : 'Template padrão'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">Configurações Atuais:</h4>
                        <div className="bg-black/20 p-4 rounded border border-white/10 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fonte:</span>
                            <span className="text-white" style={{ fontFamily: `'${selectedFont}', sans-serif` }}>
                              {selectedFont}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cor:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded border border-white/20" 
                                style={{ backgroundColor: textColor }}
                              />
                              <span className="text-white">{textColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400">Nenhum template selecionado</p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-300 font-medium mb-2">Funcionalidades Admin:</h4>
                  <ul className="text-sm text-blue-200 space-y-1 list-disc list-inside">
                    <li>Upload de fontes personalizadas do Freepik (.woff2, .ttf, .otf)</li>
                    <li>Editor de imagem com filtros (cinza, sépia, inversão, brilho)</li>
                    <li>Visualização em tempo real das configurações de template</li>
                    <li>Download de imagens editadas em alta qualidade</li>
                    <li>Gerenciamento de fontes customizadas com persistência local</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teste de Camadas Tab */}
          <TabsContent value="teste">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6">
                {/* Switch entre V2.12.G (Legacy) e V2.12.H (Híbrido) */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white/10 p-1 rounded-lg border border-white/20">
                    <button
                      onClick={() => setEditorMode('legacy')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        editorMode === 'legacy' 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      V2.12.G (Legacy)
                    </button>
                    <button
                      onClick={() => setEditorMode('hybrid')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        editorMode === 'hybrid' 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      V2.12.H (Híbrido)
                    </button>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {editorMode === 'hybrid' 
                      ? 'Zentraw V2.12.H - Editor Híbrido' 
                      : 'Zentraw V2.12.G - Teste de Camadas'
                    }
                  </h3>
                  <p className="text-gray-300">
                    {editorMode === 'hybrid' 
                      ? 'Editor visual com fontes Freepik, manipulação por mouse e efeitos CSS3' 
                      : 'Interface avançada para testar composição de camadas em tempo real'
                    }
                  </p>
                </div>

                {/* Canvas Preview */}
                <div className="text-center mb-6">
                  <div className="inline-block border border-white/20 rounded-lg p-4 bg-black/20">
                    <h4 className="text-white font-semibold mb-3">
                      {editorMode === 'hybrid' ? 'Canvas Visual Híbrido' : 'Preview Final'}
                    </h4>
                    
                    {editorMode === 'hybrid' ? (
                      <canvas 
                        ref={hybridCanvasRef} 
                        width={1080} 
                        height={1080} 
                        className="w-full max-w-md h-auto border border-white/10 rounded cursor-crosshair"
                        onClick={(e) => {
                          // Sistema de seleção por clique (implementação futura)
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = (e.clientX - rect.left) * (1080 / rect.width);
                          const y = (e.clientY - rect.top) * (1080 / rect.height);
                          console.log('Clique no canvas:', { x, y });
                        }}
                      />
                    ) : (
                      <canvas 
                        ref={testCanvasRef} 
                        width={1080} 
                        height={1080} 
                        className="w-full max-w-md h-auto border border-white/10 rounded"
                      />
                    )}
                  </div>
                </div>

                {/* Text Replacement Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-white/5 border border-white/20 rounded-lg">
                  <h4 className="col-span-full text-white font-semibold mb-2">Substituição de Texto</h4>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Nome do Artista:</label>
                    <input 
                      type="text" 
                      value={textReplacers.ARTIST}
                      onChange={(e) => {
                        setTextReplacers(prev => ({ ...prev, ARTIST: e.target.value }));
                        // Auto-aplicar após mudança de texto
                        setTimeout(() => applyTestCanvas(), 100);
                      }}
                      className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded text-white"
                      placeholder="Ex: DJ Shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Título da Música:</label>
                    <input 
                      type="text" 
                      value={textReplacers.TITLE}
                      onChange={(e) => {
                        setTextReplacers(prev => ({ ...prev, TITLE: e.target.value }));
                        // Auto-aplicar após mudança de texto
                        setTimeout(() => applyTestCanvas(), 100);
                      }}
                      className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded text-white"
                      placeholder="Ex: Midnight City"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {editorMode === 'hybrid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <Button 
                      onClick={() => addElement('text')} 
                      className="gradient-purple hover:opacity-90"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Texto
                    </Button>
                    <Button 
                      onClick={() => addElement('image')} 
                      className="gradient-blue hover:opacity-90"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Imagem
                    </Button>
                    <Button 
                      onClick={() => addElement('svg')} 
                      className="gradient-green hover:opacity-90"
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      SVG
                    </Button>
                    <Button 
                      onClick={() => addElement('png-overlay')} 
                      className="gradient-orange hover:opacity-90"
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      PNG
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-4 mb-6">
                    <Button 
                      onClick={applyTestCanvas} 
                      className="gradient-blue hover:opacity-90 flex-1"
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      Aplicar Camadas
                    </Button>
                    <Button 
                      onClick={exportTestImage} 
                      className="gradient-green hover:opacity-90 flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar PNG
                    </Button>
                  </div>
                )}

                {/* Editor Híbrido V2.12.H */}
                {editorMode === 'hybrid' && (
                  <>
                    {/* Lista de Elementos */}
                    <div className="mb-6 p-4 bg-white/5 border border-white/20 rounded-lg">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <Layers className="mr-2 h-5 w-5" />
                        Elementos no Canvas ({canvasElements.length})
                      </h4>
                      {canvasElements.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                          Clique nos botões acima para adicionar elementos ao canvas
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {canvasElements
                            .sort((a, b) => b.zIndex - a.zIndex)
                            .map((element) => (
                            <div
                              key={element.id}
                              className={`p-3 rounded border cursor-pointer transition-all ${
                                selectedElement === element.id
                                  ? 'border-purple-400 bg-purple-500/20'
                                  : 'border-white/20 bg-white/5 hover:bg-white/10'
                              }`}
                              onClick={() => setSelectedElement(element.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    element.type === 'text' ? 'bg-purple-400' :
                                    element.type === 'image' ? 'bg-blue-400' :
                                    element.type === 'svg' ? 'bg-green-400' : 'bg-orange-400'
                                  }`}></div>
                                  <span className="text-white font-medium">
                                    {element.type === 'text' 
                                      ? element.content?.substring(0, 20) + (element.content && element.content.length > 20 ? '...' : '')
                                      : `${element.type.toUpperCase()} #${element.zIndex + 1}`
                                    }
                                  </span>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      duplicateElement(element.id);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                    title="Duplicar"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteElement(element.id);
                                    }}
                                    className="text-gray-400 hover:text-red-400"
                                    title="Excluir"
                                  >
                                    <Trash className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Painel de Propriedades */}
                    {selectedElement && (
                      <div className="mb-6 p-4 bg-white/5 border border-white/20 rounded-lg">
                        <h4 className="text-white font-semibold mb-3 flex items-center">
                          <Settings className="mr-2 h-5 w-5" />
                          Propriedades do Elemento
                        </h4>
                        {(() => {
                          const element = canvasElements.find(el => el.id === selectedElement);
                          if (!element) return null;

                          return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Posição e Tamanho */}
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Posição X:</label>
                                <input
                                  type="number"
                                  value={element.x}
                                  onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Posição Y:</label>
                                <input
                                  type="number"
                                  value={element.y}
                                  onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Largura:</label>
                                <input
                                  type="number"
                                  value={element.width}
                                  onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
                                  className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                />
                              </div>

                              {/* Propriedades de Texto */}
                              {element.type === 'text' && (
                                <>
                                  <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm text-gray-300">Conteúdo:</label>
                                    <textarea
                                      value={element.content || ''}
                                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                      rows={2}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm text-gray-300">Fonte Freepik:</label>
                                    <select
                                      value={element.fontFamily || 'Arial'}
                                      onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
                                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                    >
                                      <option value="Arial">Arial (Default)</option>
                                      {freepikFonts.map(font => (
                                        <option key={font.name} value={font.name}>
                                          {font.name} ({font.category})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm text-gray-300">Tamanho da Fonte:</label>
                                    <input
                                      type="number"
                                      value={element.fontSize || 48}
                                      onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
                                      className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                      min="8"
                                      max="200"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-sm text-gray-300">Cor:</label>
                                    <input
                                      type="color"
                                      value={element.color || '#ffffff'}
                                      onChange={(e) => updateElement(element.id, { color: e.target.value })}
                                      className="w-full h-8 bg-black/20 border border-white/20 rounded"
                                    />
                                  </div>
                                </>
                              )}

                              {/* Propriedades Gerais */}
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Opacidade:</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={element.opacity}
                                  onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{Math.round(element.opacity * 100)}%</span>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Blend Mode:</label>
                                <select
                                  value={element.blendMode}
                                  onChange={(e) => updateElement(element.id, { blendMode: e.target.value })}
                                  className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="multiply">Multiply</option>
                                  <option value="screen">Screen</option>
                                  <option value="overlay">Overlay</option>
                                  <option value="soft-light">Soft Light</option>
                                  <option value="hard-light">Hard Light</option>
                                  <option value="color-dodge">Color Dodge</option>
                                  <option value="color-burn">Color Burn</option>
                                </select>
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm text-gray-300">Rotação:</label>
                                <input
                                  type="range"
                                  min="-180"
                                  max="180"
                                  value={element.rotation}
                                  onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
                                  className="w-full"
                                />
                                <span className="text-xs text-gray-400">{element.rotation}°</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}

                {/* Legacy Upload Controls */}
                {editorMode === 'legacy' && (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {['base', 'text', 'overlay'].map((type) => (
                    <div key={type} className="border border-white/20 p-4 rounded-lg bg-white/5">
                      <label className="block mb-3 uppercase font-bold text-white text-center">
                        {type === 'base' ? 'IMAGEM BASE' : type === 'text' ? 'SVG TEXTO' : 'SVG OVERLAY'}
                      </label>
                      
                      <input 
                        type="file" 
                        accept={type === 'base' ? 'image/*' : '.svg'} 
                        onChange={(e) => handleTestImageUpload(e, type as 'base' | 'text' | 'overlay')}
                        className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 mb-3"
                      />
                      
                      <div className="space-y-2">
                        <label className="flex items-center text-white">
                          <input 
                            type="checkbox" 
                            checked={type === 'base' ? showBase : type === 'text' ? showText : showOverlay}
                            onChange={() => {
                              if (type === 'base') setShowBase(!showBase);
                              if (type === 'text') setShowText(!showText);
                              if (type === 'overlay') setShowOverlay(!showOverlay);
                            }}
                            className="mr-2"
                          />
                          Mostrar
                        </label>
                        
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Blend Mode:</label>
                          <select 
                            value={type === 'base' ? blendBase : type === 'text' ? blendText : blendOverlay}
                            onChange={(e) => {
                              if (type === 'base') setBlendBase(e.target.value);
                              if (type === 'text') setBlendText(e.target.value);
                              if (type === 'overlay') setBlendOverlay(e.target.value);
                            }}
                            className="w-full px-2 py-1 bg-black/20 border border-white/20 rounded text-white text-sm"
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
                            <option value="hue">Hue</option>
                            <option value="saturation">Saturation</option>
                            <option value="color">Color</option>
                            <option value="luminosity">Luminosity</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Transparência:</label>
                          <input 
                            type="range" 
                            min={0} 
                            max={1} 
                            step={0.01} 
                            value={type === 'base' ? alphaBase : type === 'text' ? alphaText : alphaOverlay}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (type === 'base') setAlphaBase(value);
                              if (type === 'text') setAlphaText(value);
                              if (type === 'overlay') setAlphaOverlay(value);
                            }}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">
                            {Math.round((type === 'base' ? alphaBase : type === 'text' ? alphaText : alphaOverlay) * 100)}%
                          </span>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-300 mb-1">Escala:</label>
                          <input 
                            type="range" 
                            min={0.1} 
                            max={2} 
                            step={0.1} 
                            value={type === 'base' ? scaleBase : type === 'text' ? scaleText : scaleOverlay}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (type === 'base') setScaleBase(value);
                              if (type === 'text') setScaleText(value);
                              if (type === 'overlay') setScaleOverlay(value);
                            }}
                            className="w-full"
                          />
                          <span className="text-xs text-gray-400">
                            {(type === 'base' ? scaleBase : type === 'text' ? scaleText : scaleOverlay).toFixed(1)}x
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                  </> 
                )}

                {/* Text Editor */}
                {editorMode === 'legacy' && (
                <>
                <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/20">
                  <h4 className="font-bold text-white mb-3">Editor de Texto em Tempo Real</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">ARTIST:</label>
                      <input 
                        type="text" 
                        placeholder="Nome do Artista" 
                        value={textReplacers.ARTIST} 
                        onChange={(e) => setTextReplacers({ ...textReplacers, ARTIST: e.target.value })}
                        className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">TITLE:</label>
                      <input 
                        type="text" 
                        placeholder="Título da Música" 
                        value={textReplacers.TITLE} 
                        onChange={(e) => setTextReplacers({ ...textReplacers, TITLE: e.target.value })}
                        className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-300 font-semibold mb-2">Como usar:</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>1. Faça upload de uma imagem base e SVGs de texto/overlay</li>
                    <li>2. Ajuste transparência, escala e modo de mesclagem para cada camada</li>
                    <li>3. Edite o texto em tempo real nos campos ARTIST e TITLE</li>
                    <li>4. Clique em "Aplicar Camadas" para ver o resultado</li>
                    <li>5. Use "Exportar PNG" para baixar o resultado final</li>
                  </ul>
                </div>
                </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor V3 Tab */}
          <TabsContent value="editor">
            <PhotoshopEditor
              baseImage={imageIA || uploadedCover || undefined}
              defaultTexts={{
                artist: formData.artistName || 'Nome do Artista',
                title: formData.songTitle || 'Título da Música'
              }}
              onExport={(imgUrl: string) => {
                setFinalLayoutImage(imgUrl);
                setExportedImages(prev => [...prev, {
                  name: `zentraw_v3_${Date.now()}.png`,
                  url: imgUrl
                }]);
                toast({
                  title: "Imagem exportada",
                  description: "Arte criada com sucesso no Editor V3"
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}