// Zentraw V3 - Editor Photoshop-Style com Fabric.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Upload, Download, Save, FolderOpen, Copy, Move, RotateCw, FlipHorizontal, 
  Trash2, Eye, EyeOff, Type, Image as ImageIcon, Layers, Settings,
  Grid, Maximize, Minimize, Palette, Sliders, Plus, Minus, X, Square, Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FontFaceObserver from 'fontfaceobserver';

// Tipos para o fabric.js
declare global {
  interface Window {
    fabric: any;
  }
}

interface PhotoshopEditorProps {
  baseImage?: string;
  defaultTexts?: {
    artist: string;
    title: string;
  };
  onExport?: (imageUrl: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface LayerItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
}

interface CanvasProperties {
  width: number;
  height: number;
  backgroundColor: string;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
}

interface ProjectTemplate {
  id: string;
  name: string;
  canvasProperties: CanvasProperties;
  objects: any[];
  thumbnail: string;
  createdAt: number;
}

export default function PhotoshopEditor({ 
  baseImage, 
  defaultTexts = { artist: 'Nome do Artista', title: 'Título da Música' },
  onExport,
  isFullscreen = false,
  onToggleFullscreen
}: PhotoshopEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const { toast } = useToast();

  // Estados principais
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [canvasProps, setCanvasProps] = useState<CanvasProperties>({
    width: 800,
    height: 800,
    backgroundColor: 'transparent',
    showGrid: true,
    gridSize: 20,
    snapToGrid: false
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [zoom, setZoom] = useState(1);

  // Fontes do Freepik - Lista expandida
  const freepikFonts = [
    'Bebas Neue', 'Montserrat', 'Oswald', 'Playfair Display', 'Roboto Condensed',
    'Open Sans', 'Poppins', 'Raleway', 'Anton', 'Righteous', 'Bangers', 
    'Pacifico', 'Dancing Script', 'Satisfy', 'Creepster', 'Lobster',
    'Comfortaa', 'Nunito', 'Lato', 'Source Sans Pro', 'Ubuntu', 'Roboto',
    'PT Sans', 'Merriweather', 'Crimson Text', 'Libre Baskerville'
  ];

  // Carregar Fabric.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js';
    script.onload = () => {
      initializeFabricCanvas();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Carregar fontes (Google Fonts + Fontes Customizadas)
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Carregar fontes customizadas da pasta public/fonts
        const customFontsLink = document.createElement('link');
        customFontsLink.href = '/fonts/fonts.css';
        customFontsLink.rel = 'stylesheet';
        document.head.appendChild(customFontsLink);

        // URLs das fontes Google Fonts
        const fontUrls = [
          'https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;500;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
          'https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
          'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap',
          'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
          'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap',
          'https://fonts.googleapis.com/css2?family=Anton:wght@400&display=swap',
          'https://fonts.googleapis.com/css2?family=Righteous:wght@400&display=swap',
          'https://fonts.googleapis.com/css2?family=Bangers:wght@400&display=swap',
          'https://fonts.googleapis.com/css2?family=Pacifico:wght@400&display=swap',
          'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Lobster:wght@400&display=swap',
          'https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap'
        ];

        // Carregar CSS das fontes
        fontUrls.forEach(url => {
          const link = document.createElement('link');
          link.href = url;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        });

        // Verificar se as fontes foram carregadas
        const fontPromises = freepikFonts.slice(0, 8).map(font => {
          const fontObserver = new FontFaceObserver(font);
          return fontObserver.load(null, 8000).catch(() => {
            console.warn(`Font ${font} failed to load`);
          });
        });

        await Promise.allSettled(fontPromises);
        setFontsLoaded(true);
        toast({ title: "Fontes carregadas com sucesso!" });
      } catch (error) {
        console.error('Erro ao carregar fontes:', error);
        toast({ 
          title: "Erro ao carregar fontes", 
          description: "Algumas fontes podem não estar disponíveis",
          variant: "destructive"
        });
      }
    };

    loadFonts();
  }, [toast]);

  // Inicializar canvas do Fabric.js
  const initializeFabricCanvas = useCallback(() => {
    if (!canvasRef.current || !window.fabric) return;

    const canvas = new window.fabric.Canvas(canvasRef.current, {
      width: canvasProps.width,
      height: canvasProps.height,
      backgroundColor: null, // Sempre transparente
      preserveObjectStacking: true,
      selection: true,
      fireRightClick: true,
      stopContextMenu: true
    });

    // Configurar zoom para fit no workspace
    const maxWidth = window.innerWidth * 0.6;
    const maxHeight = window.innerHeight * 0.8;
    const scaleX = maxWidth / canvasProps.width;
    const scaleY = maxHeight / canvasProps.height;
    const scale = Math.min(scaleX, scaleY, 1);
    setZoom(scale);
    canvas.setZoom(scale);

    // Configurar grid
    if (canvasProps.showGrid) {
      drawGrid(canvas);
    }

    // Event listeners
    canvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected[0]);
      updateLayers(canvas);
    });

    canvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected[0]);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    canvas.on('object:added', () => {
      updateLayers(canvas);
    });

    canvas.on('object:removed', () => {
      updateLayers(canvas);
    });

    canvas.on('object:modified', () => {
      updateLayers(canvas);
    });

    // Carregar imagem base se existir
    if (baseImage) {
      window.fabric.Image.fromURL(baseImage, (img: any) => {
        img.set({
          left: 0,
          top: 0,
          scaleX: canvasProps.width / img.width,
          scaleY: canvasProps.height / img.height,
          selectable: false,
          evented: false
        });
        canvas.add(img);
        canvas.sendToBack(img);
      }, { crossOrigin: 'anonymous' });
    }

    // Adicionar textos padrão
    addDefaultTexts(canvas);

    fabricCanvasRef.current = canvas;
  }, [baseImage, canvasProps, defaultTexts]);

  // Desenhar grid no canvas
  const drawGrid = (canvas: any) => {
    const gridSize = canvasProps.gridSize;
    const width = canvasProps.width;
    const height = canvasProps.height;

    // Limpar grid anterior
    canvas.getObjects('line').forEach((line: any) => {
      if (line.isGrid) {
        canvas.remove(line);
      }
    });

    // Linhas verticais
    for (let i = 0; i <= width; i += gridSize) {
      const line = new window.fabric.Line([i, 0, i, height], {
        stroke: '#ddd',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGrid: true,
        opacity: 0.3
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }

    // Linhas horizontais
    for (let i = 0; i <= height; i += gridSize) {
      const line = new window.fabric.Line([0, i, width, i], {
        stroke: '#ddd',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGrid: true,
        opacity: 0.3
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }
  };

  // Adicionar textos padrão
  const addDefaultTexts = (canvas: any) => {
    // Texto do artista
    const artistText = new window.fabric.Text(defaultTexts.artist, {
      left: canvas.width / 2,
      top: canvas.height - 200,
      fontFamily: 'Bebas Neue',
      fontSize: 72,
      fill: '#ffffff',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      shadow: '3px 3px 8px rgba(0,0,0,0.8)'
    });

    // Texto do título
    const titleText = new window.fabric.Text(defaultTexts.title, {
      left: canvas.width / 2,
      top: canvas.height - 120,
      fontFamily: 'Montserrat',
      fontSize: 48,
      fill: '#cccccc',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      shadow: '2px 2px 6px rgba(0,0,0,0.6)'
    });

    canvas.add(artistText);
    canvas.add(titleText);
  };

  // Atualizar lista de camadas (filtrar grid lines)
  const updateLayers = (canvas: any) => {
    const objects = canvas.getObjects().filter((obj: any) => !obj.isGrid);
    const newLayers: LayerItem[] = objects.map((obj: any, index: number) => ({
      id: obj.id || `layer-${index}`,
      name: obj.type === 'text' ? obj.text?.substring(0, 15) + '...' : 
           obj.type === 'image' ? 'Imagem' : 
           obj.type,
      type: obj.type,
      visible: obj.visible !== false,
      locked: !obj.selectable,
      opacity: obj.opacity || 1,
      blendMode: obj.globalCompositeOperation || 'source-over'
    }));
    setLayers(newLayers.reverse()); // Reverter para mostrar ordem correta
  };

  // Toggle visibilidade da camada
  const toggleLayerVisibility = (layerIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
    const targetIndex = objects.length - 1 - layerIndex; // Ajustar índice
    const obj = objects[targetIndex];
    
    if (obj) {
      obj.set('visible', !obj.visible);
      fabricCanvasRef.current.renderAll();
      updateLayers(fabricCanvasRef.current);
    }
  };

  // Toggle lock da camada
  const toggleLayerLock = (layerIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
    const targetIndex = objects.length - 1 - layerIndex; // Ajustar índice
    const obj = objects[targetIndex];
    
    if (obj) {
      const isLocked = !obj.selectable;
      obj.set({
        selectable: isLocked,
        evented: isLocked
      });
      fabricCanvasRef.current.renderAll();
      updateLayers(fabricCanvasRef.current);
    }
  };

  // Selecionar camada
  const selectLayer = (layerIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
    const targetIndex = objects.length - 1 - layerIndex; // Ajustar índice
    const obj = objects[targetIndex];
    
    if (obj && obj.selectable) {
      fabricCanvasRef.current.setActiveObject(obj);
      fabricCanvasRef.current.renderAll();
    }
  };

  // Mover camada para cima
  const moveLayerUp = (layerIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
    const targetIndex = objects.length - 1 - layerIndex;
    const obj = objects[targetIndex];
    
    if (obj) {
      fabricCanvasRef.current.bringForward(obj);
      updateLayers(fabricCanvasRef.current);
    }
  };

  // Mover camada para baixo
  const moveLayerDown = (layerIndex: number) => {
    if (!fabricCanvasRef.current) return;
    
    const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
    const targetIndex = objects.length - 1 - layerIndex;
    const obj = objects[targetIndex];
    
    if (obj) {
      fabricCanvasRef.current.sendBackwards(obj);
      updateLayers(fabricCanvasRef.current);
    }
  };

  // Adicionar texto
  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new window.fabric.Text('Novo Texto', {
      left: 100,
      top: 100,
      fontFamily: 'Bebas Neue',
      fontSize: 48,
      fill: '#ffffff',
      shadow: '2px 2px 6px rgba(0,0,0,0.8)'
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  // Adicionar forma
  const addShape = (type: string) => {
    if (!fabricCanvasRef.current) return;

    let shape;
    
    if (type === 'rectangle') {
      shape = new window.fabric.Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 150,
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2
      });
    } else if (type === 'circle') {
      shape = new window.fabric.Circle({
        left: 100,
        top: 100,
        radius: 75,
        fill: '#00ff00',
        stroke: '#000000',
        strokeWidth: 2
      });
    }

    if (shape) {
      fabricCanvasRef.current.add(shape);
      fabricCanvasRef.current.setActiveObject(shape);
    }
  };

  // Upload de imagem
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      window.fabric.Image.fromURL(imgUrl, (img: any) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
      });
    };
    reader.readAsDataURL(file);
  };

  // Exportar canvas
  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });

    const link = document.createElement('a');
    link.download = `zentraw_photoshop_v3_${Date.now()}.png`;
    link.href = dataURL;
    link.click();

    if (onExport) {
      onExport(dataURL);
    }

    toast({ title: 'Imagem exportada com sucesso!' });
  };

  // Salvar como template (otimizado para evitar quota exceeded)
  const saveAsTemplate = () => {
    if (!fabricCanvasRef.current) return;

    const templateName = prompt('Nome do template:');
    if (!templateName) return;

    try {
      const objects = fabricCanvasRef.current.getObjects().filter((obj: any) => !obj.isGrid);
      
      // Thumbnail menor para economizar espaço
      const thumbnail = fabricCanvasRef.current.toDataURL({
        format: 'jpeg',
        quality: 0.1,
        multiplier: 0.1
      });

      // Simplificar objetos para reduzir tamanho
      const simplifiedObjects = objects.map((obj: any) => {
        const objData = obj.toObject();
        // Remover propriedades desnecessárias para economizar espaço
        delete objData.shadow;
        delete objData.clipPath;
        delete objData.transformMatrix;
        return objData;
      });

      const template: ProjectTemplate = {
        id: `template_${Date.now()}`,
        name: templateName,
        canvasProperties: { ...canvasProps },
        objects: simplifiedObjects,
        thumbnail,
        createdAt: Date.now()
      };

      const savedTemplates = JSON.parse(localStorage.getItem('zentraw_templates') || '[]');
      
      // Limitar a 10 templates para evitar quota exceeded
      if (savedTemplates.length >= 10) {
        savedTemplates.shift(); // Remove o mais antigo
        toast({ 
          title: "Template mais antigo removido", 
          description: "Limite de 10 templates atingido"
        });
      }
      
      savedTemplates.push(template);
      localStorage.setItem('zentraw_templates', JSON.stringify(savedTemplates));
      setTemplates(savedTemplates);

      toast({ title: `Template "${templateName}" salvo com sucesso!` });
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({ 
        title: "Erro ao salvar template", 
        description: "Limite de armazenamento atingido. Exclua alguns templates.",
        variant: "destructive"
      });
    }
  };

  // Carregar template
  const loadTemplate = (template: ProjectTemplate) => {
    if (!fabricCanvasRef.current) return;

    // Limpar canvas
    fabricCanvasRef.current.clear();
    
    // Aplicar propriedades do canvas
    setCanvasProps(template.canvasProperties);
    fabricCanvasRef.current.setWidth(template.canvasProperties.width);
    fabricCanvasRef.current.setHeight(template.canvasProperties.height);

    // Adicionar objetos
    template.objects.forEach((objData: any) => {
      window.fabric.util.enlivenObjects([objData], (objects: any[]) => {
        objects.forEach((obj: any) => {
          fabricCanvasRef.current.add(obj);
        });
        fabricCanvasRef.current.renderAll();
        updateLayers(fabricCanvasRef.current);
      });
    });

    // Redesenhar grid se necessário
    if (template.canvasProperties.showGrid) {
      setTimeout(() => drawGrid(fabricCanvasRef.current), 100);
    }

    toast({ title: `Template "${template.name}" carregado!` });
  };

  // Carregar templates salvos
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('zentraw_templates') || '[]');
    setTemplates(savedTemplates);
  }, []);

  // Deletar objeto selecionado
  const deleteSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    fabricCanvasRef.current.remove(selectedObject);
    setSelectedObject(null);
  };

  // Duplicar objeto selecionado
  const duplicateSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    selectedObject.clone((cloned: any) => {
      cloned.set({
        left: selectedObject.left + 20,
        top: selectedObject.top + 20
      });
      fabricCanvasRef.current.add(cloned);
      fabricCanvasRef.current.setActiveObject(cloned);
    });
  };

  // Atualizar propriedades do canvas
  const updateCanvasProperties = (updates: Partial<CanvasProperties>) => {
    const newProps = { ...canvasProps, ...updates };
    setCanvasProps(newProps);
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setWidth(newProps.width);
      fabricCanvasRef.current.setHeight(newProps.height);
      fabricCanvasRef.current.setBackgroundColor(
        newProps.backgroundColor === 'transparent' ? null : newProps.backgroundColor,
        fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current)
      );
      
      if (newProps.showGrid) {
        drawGrid(fabricCanvasRef.current);
      } else {
        // Remover grid
        fabricCanvasRef.current.getObjects('line').forEach((line: any) => {
          if (line.isGrid) {
            fabricCanvasRef.current.remove(line);
          }
        });
      }
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} bg-gray-900 text-white`}>
      <div className="flex h-full">
        {/* Toolbar Esquerda */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
          <Button
            size="sm"
            variant={selectedTool === 'select' ? 'default' : 'ghost'}
            className="w-10 h-10 p-0"
            onClick={() => setSelectedTool('select')}
          >
            <Move className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === 'text' ? 'default' : 'ghost'}
            className="w-10 h-10 p-0"
            onClick={() => {
              setSelectedTool('text');
              addText();
            }}
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === 'rectangle' ? 'default' : 'ghost'}
            className="w-10 h-10 p-0"
            onClick={() => {
              setSelectedTool('rectangle');
              addShape('rectangle');
            }}
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={selectedTool === 'circle' ? 'default' : 'ghost'}
            className="w-10 h-10 p-0"
            onClick={() => {
              setSelectedTool('circle');
              addShape('circle');
            }}
          >
            <Circle className="w-4 h-4" />
          </Button>
          <label className="cursor-pointer">
            <Button size="sm" variant="ghost" className="w-10 h-10 p-0" asChild>
              <span><ImageIcon className="w-4 h-4" /></span>
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Área Principal */}
        <div className="flex-1 flex flex-col">
          {/* Barra Superior */}
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={exportCanvas} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" onClick={saveAsTemplate} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Template
              </Button>
              <Button size="sm" onClick={deleteSelected} disabled={!selectedObject} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              <Button size="sm" onClick={duplicateSelected} disabled={!selectedObject}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => updateCanvasProperties({ showGrid: !canvasProps.showGrid })}
              >
                <Grid className="w-4 h-4" />
              </Button>
              {onToggleFullscreen && (
                <Button size="sm" variant="ghost" onClick={onToggleFullscreen}>
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center bg-gray-700 p-4 overflow-auto">
            <div className="bg-white shadow-2xl">
              <canvas
                ref={canvasRef}
                className="border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Painel Direito */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 m-2 text-xs">
              <TabsTrigger value="properties">
                <Settings className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="layers">
                <Layers className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="templates">
                <FolderOpen className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="effects">
                <Sliders className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="canvas">
                <Palette className="w-3 h-3" />
              </TabsTrigger>
            </TabsList>

            {/* Propriedades */}
            <TabsContent value="properties" className="flex-1 p-4 space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Propriedades do Objeto</h3>
                  {selectedObject ? (
                    <div className="space-y-3">
                      {selectedObject.type === 'text' && (
                        <>
                          <div>
                            <label className="text-sm text-gray-300 block mb-1">Texto</label>
                            <Input
                              value={selectedObject.text || ''}
                              onChange={(e) => {
                                selectedObject.set('text', e.target.value);
                                fabricCanvasRef.current?.renderAll();
                              }}
                              className="bg-gray-600 border-gray-500 text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-300 block mb-1">Fonte</label>
                            <Select
                              value={selectedObject.fontFamily || 'Bebas Neue'}
                              onValueChange={(value) => {
                                selectedObject.set('fontFamily', value);
                                fabricCanvasRef.current?.renderAll();
                              }}
                            >
                              <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {freepikFonts.map((font) => (
                                  <SelectItem key={font} value={font}>
                                    {font}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-1">Tamanho</label>
                            <Slider
                              value={[selectedObject.fontSize || 48]}
                              onValueChange={(value) => {
                                selectedObject.set('fontSize', value[0]);
                                fabricCanvasRef.current?.renderAll();
                              }}
                              min={8}
                              max={200}
                              step={1}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-400">{selectedObject.fontSize || 48}px</span>
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-1">Cor</label>
                            <input
                              type="color"
                              value={selectedObject.fill || '#ffffff'}
                              onChange={(e) => {
                                selectedObject.set('fill', e.target.value);
                                fabricCanvasRef.current?.renderAll();
                              }}
                              className="w-full h-8 rounded border border-gray-500"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Opacidade</label>
                        <Slider
                          value={[selectedObject.opacity || 1]}
                          onValueChange={(value) => {
                            selectedObject.set('opacity', value[0]);
                            fabricCanvasRef.current?.renderAll();
                          }}
                          min={0}
                          max={1}
                          step={0.01}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-400">{Math.round((selectedObject.opacity || 1) * 100)}%</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Selecione um objeto para editar</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Camadas */}
            <TabsContent value="layers" className="flex-1 p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Camadas ({layers.length})</h3>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {layers.map((layer, index) => (
                      <div
                        key={`${layer.id}-${index}`}
                        className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${
                          selectedObject && fabricCanvasRef.current?.getObjects().filter((obj: any) => !obj.isGrid)[layers.length - 1 - index] === selectedObject
                            ? 'bg-blue-600 border border-blue-400' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        onClick={() => selectLayer(index)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            layer.type === 'text' ? 'bg-blue-400' : 
                            layer.type === 'image' ? 'bg-green-400' : 
                            layer.type === 'rect' ? 'bg-red-400' :
                            layer.type === 'circle' ? 'bg-yellow-400' : 'bg-purple-400'
                          }`} />
                          <span className="truncate text-white">{layer.name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {/* Mover para cima */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-5 h-5 p-0 hover:bg-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerUp(index);
                            }}
                            disabled={index === 0}
                          >
                            <Plus className="w-2 h-2" />
                          </Button>
                          
                          {/* Mover para baixo */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-5 h-5 p-0 hover:bg-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayerDown(index);
                            }}
                            disabled={index === layers.length - 1}
                          >
                            <Minus className="w-2 h-2" />
                          </Button>
                          
                          {/* Toggle visibilidade */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-5 h-5 p-0 hover:bg-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerVisibility(index);
                            }}
                          >
                            {layer.visible ? <Eye className="w-2 h-2" /> : <EyeOff className="w-2 h-2" />}
                          </Button>
                          
                          {/* Toggle lock */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-5 h-5 p-0 hover:bg-gray-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLayerLock(index);
                            }}
                          >
                            {layer.locked ? 
                              <X className="w-2 h-2 text-red-400" /> : 
                              <Settings className="w-2 h-2 text-green-400" />
                            }
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {layers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">Nenhuma camada encontrada</p>
                      <p className="text-gray-500 text-xs mt-1">Adicione texto ou imagens para começar</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates" className="flex-1 p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Templates Salvos ({templates.length})</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-2 p-2 bg-gray-600 rounded text-sm cursor-pointer hover:bg-gray-500 transition-colors"
                        onClick={() => loadTemplate(template)}
                      >
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-12 h-12 rounded object-cover border border-gray-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{template.name}</div>
                          <div className="text-gray-400 text-xs">
                            {template.canvasProperties.width}x{template.canvasProperties.height}px
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(template.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Excluir template "${template.name}"?`)) {
                              const updatedTemplates = templates.filter(t => t.id !== template.id);
                              setTemplates(updatedTemplates);
                              localStorage.setItem('zentraw_templates', JSON.stringify(updatedTemplates));
                              toast({ title: 'Template excluído' });
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  {templates.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">Nenhum template salvo</p>
                      <p className="text-gray-500 text-xs mt-1">Crie um design e salve como template</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Efeitos */}
            <TabsContent value="effects" className="flex-1 p-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Efeitos</h3>
                  <p className="text-gray-400 text-sm">Filtros e efeitos em desenvolvimento</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Canvas */}
            <TabsContent value="canvas" className="flex-1 p-4 space-y-4">
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Propriedades do Canvas</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Largura</label>
                        <Input
                          type="number"
                          value={canvasProps.width}
                          onChange={(e) => updateCanvasProperties({ width: Number(e.target.value) })}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Altura</label>
                        <Input
                          type="number"
                          value={canvasProps.height}
                          onChange={(e) => updateCanvasProperties({ height: Number(e.target.value) })}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 block mb-1">Fundo</label>
                      <Select
                        value={canvasProps.backgroundColor}
                        onValueChange={(value) => updateCanvasProperties({ backgroundColor: value })}
                      >
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transparent">Transparente</SelectItem>
                          <SelectItem value="#ffffff">Branco</SelectItem>
                          <SelectItem value="#000000">Preto</SelectItem>
                          <SelectItem value="#f0f0f0">Cinza Claro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Grid</label>
                      <Button
                        size="sm"
                        variant={canvasProps.showGrid ? 'default' : 'outline'}
                        onClick={() => updateCanvasProperties({ showGrid: !canvasProps.showGrid })}
                      >
                        {canvasProps.showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                    </div>

                    {canvasProps.showGrid && (
                      <div>
                        <label className="text-sm text-gray-300 block mb-1">Tamanho do Grid</label>
                        <Slider
                          value={[canvasProps.gridSize]}
                          onValueChange={(value) => updateCanvasProperties({ gridSize: value[0] })}
                          min={10}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <span className="text-xs text-gray-400">{canvasProps.gridSize}px</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}