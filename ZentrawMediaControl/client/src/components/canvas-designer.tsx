// Zentraw Artist Toolkit V3 - Canvas Designer Simplificado
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, Download, Undo2, Redo2, Save, FolderOpen, Copy, 
  Trash2, Eye, EyeOff, Type, Image as ImageIcon, Layers, Settings,
  RotateCcw, FlipHorizontal, FlipVertical, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasDesignerProps {
  baseImage?: string;
  defaultTexts?: {
    artist: string;
    title: string;
  };
  onExport?: (imageUrl: string) => void;
}

interface ProjectData {
  id: string;
  name: string;
  canvasData: string;
  thumbnail: string;
  createdAt: number;
  updatedAt: number;
}

interface LayerItem {
  object: fabric.Object;
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
}

export default function CanvasDesigner({ 
  baseImage, 
  defaultTexts = { artist: 'Nome do Artista', title: 'Título da Música' },
  onExport 
}: CanvasDesignerProps) {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Estados principais
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);

  // Fontes do Freepik integradas
  const freepikFonts = [
    { name: 'Bebas Neue', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400;500;700&display=swap' },
    { name: 'Montserrat', category: 'Sans-serif', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { name: 'Oswald', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap' },
    { name: 'Playfair Display', category: 'Serif', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap' },
    { name: 'Roboto Condensed', category: 'Sans-serif', url: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&display=swap' },
    { name: 'Open Sans', category: 'Sans-serif', url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap' },
    { name: 'Poppins', category: 'Sans-serif', url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { name: 'Raleway', category: 'Sans-serif', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap' },
    { name: 'Anton', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Anton:wght@400&display=swap' },
    { name: 'Righteous', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Righteous:wght@400&display=swap' },
    { name: 'Bangers', category: 'Display', url: 'https://fonts.googleapis.com/css2?family=Bangers:wght@400&display=swap' },
    { name: 'Pacifico', category: 'Handwriting', url: 'https://fonts.googleapis.com/css2?family=Pacifico:wght@400&display=swap' },
    { name: 'Dancing Script', category: 'Handwriting', url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap' }
  ];

  // Carregar fontes do Freepik
  useEffect(() => {
    freepikFonts.forEach(font => {
      const link = document.createElement('link');
      link.href = font.url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, []);

  // Inicializar canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: 1080,
      height: 1080,
      backgroundColor: '#000000'
    });

    canvasRef.current = canvas;
    
    // Eventos do canvas
    canvas.on('selection:created', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e) => {
      setActiveObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setActiveObject(null);
    });

    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', () => {
      updateLayers();
      saveToHistory();
    });

    // Carregar imagem base se fornecida
    if (baseImage) {
      loadBaseImage(baseImage);
    }

    // Adicionar textos padrão
    setTimeout(() => {
      addText(defaultTexts.artist, { 
        top: 800, 
        fontSize: 80, 
        fontFamily: 'Bebas Neue',
        fill: '#ffffff',
        shadow: 'rgba(0,0,0,0.8) 3px 3px 10px'
      });
      
      addText(defaultTexts.title, { 
        top: 900, 
        fontSize: 60, 
        fontFamily: 'Montserrat',
        fill: '#cccccc',
        shadow: 'rgba(0,0,0,0.6) 2px 2px 8px'
      });
    }, 100);

    setIsCanvasReady(true);
    loadProjects();

    return () => {
      canvas.dispose();
    };
  }, []);

  // Atualizar lista de camadas
  const updateLayers = useCallback(() => {
    if (!canvasRef.current) return;
    
    const objects = canvasRef.current.getObjects().reverse();
    const layerItems: LayerItem[] = objects.map((obj, index) => ({
      object: obj,
      id: obj.id || `layer_${index}`,
      name: obj.type === 'textbox' ? (obj as fabric.Textbox).text?.substring(0, 20) + '...' || 'Texto' 
           : obj.type === 'image' ? 'Imagem' : 'Objeto',
      type: obj.type || 'object',
      visible: obj.visible !== false,
      locked: !obj.selectable
    }));
    
    setLayers(layerItems);
  }, []);

  // Salvar no histórico
  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return;
    
    const json = JSON.stringify(canvasRef.current.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory.slice(-50); // Manter apenas últimas 50 ações
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex <= 0 || !canvasRef.current) return;
    
    const prevState = history[historyIndex - 1];
    canvasRef.current.loadFromJSON(prevState, () => {
      canvasRef.current?.renderAll();
      setHistoryIndex(prev => prev - 1);
      updateLayers();
    });
  }, [history, historyIndex, updateLayers]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !canvasRef.current) return;
    
    const nextState = history[historyIndex + 1];
    canvasRef.current.loadFromJSON(nextState, () => {
      canvasRef.current?.renderAll();
      setHistoryIndex(prev => prev + 1);
      updateLayers();
    });
  }, [history, historyIndex, updateLayers]);

  // Carregar imagem base
  const loadBaseImage = (imageUrl: string) => {
    fabric.Image.fromURL(imageUrl, (img) => {
      if (!canvasRef.current) return;
      
      img.set({
        scaleX: 1080 / (img.width || 1080),
        scaleY: 1080 / (img.height || 1080),
        left: 0,
        top: 0,
        selectable: false,
        evented: false
      });
      
      canvasRef.current.setBackgroundImage(img, canvasRef.current.renderAll.bind(canvasRef.current));
      saveToHistory();
    });
  };

  // Adicionar texto
  const addText = (text: string, options: any = {}) => {
    if (!canvasRef.current) return;
    
    const textObj = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 48,
      fontFamily: 'Bebas Neue',
      fill: '#ffffff',
      textAlign: 'center',
      shadow: 'rgba(0,0,0,0.8) 2px 2px 6px',
      ...options
    });
    
    canvasRef.current.add(textObj);
    canvasRef.current.setActiveObject(textObj);
    canvasRef.current.renderAll();
    saveToHistory();
  };

  // Upload de overlay
  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      fabric.Image.fromURL(reader.result as string, (img) => {
        if (!canvasRef.current) return;
        
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        
        canvasRef.current.add(img);
        canvasRef.current.setActiveObject(img);
        canvasRef.current.renderAll();
        saveToHistory();
      });
    };
    reader.readAsDataURL(file);
  };

  // Exportar canvas
  const exportCanvas = () => {
    if (!canvasRef.current) return;
    
    const dataURL = canvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `zentraw_v3_${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    if (onExport) {
      onExport(dataURL);
    }
    
    toast({ title: 'Imagem exportada com sucesso!' });
  };

  // Salvar projeto
  const saveProject = (name?: string) => {
    if (!canvasRef.current) return;
    
    const projectName = name || currentProject?.name || `Projeto ${Date.now()}`;
    const canvasData = JSON.stringify(canvasRef.current.toJSON());
    const thumbnail = canvasRef.current.toDataURL({ format: 'png', quality: 0.3, multiplier: 0.2 });
    
    const project: ProjectData = {
      id: currentProject?.id || `project_${Date.now()}`,
      name: projectName,
      canvasData,
      thumbnail,
      createdAt: currentProject?.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    const savedProjects = JSON.parse(localStorage.getItem('zentraw_projects') || '[]');
    const existingIndex = savedProjects.findIndex((p: ProjectData) => p.id === project.id);
    
    if (existingIndex >= 0) {
      savedProjects[existingIndex] = project;
    } else {
      savedProjects.push(project);
    }
    
    localStorage.setItem('zentraw_projects', JSON.stringify(savedProjects));
    setProjects(savedProjects);
    setCurrentProject(project);
    
    toast({ title: 'Projeto salvo com sucesso!' });
  };

  // Carregar projetos
  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem('zentraw_projects') || '[]');
    setProjects(savedProjects);
  };

  // Carregar projeto
  const loadProject = (project: ProjectData) => {
    if (!canvasRef.current) return;
    
    canvasRef.current.loadFromJSON(project.canvasData, () => {
      canvasRef.current?.renderAll();
      setCurrentProject(project);
      updateLayers();
      saveToHistory();
      toast({ title: `Projeto "${project.name}" carregado!` });
    });
  };

  // Novo projeto
  const newProject = () => {
    if (!canvasRef.current) return;
    
    canvasRef.current.clear();
    canvasRef.current.setBackgroundColor('#000000', canvasRef.current.renderAll.bind(canvasRef.current));
    
    if (baseImage) {
      loadBaseImage(baseImage);
    }
    
    setCurrentProject(null);
    setHistory([]);
    setHistoryIndex(-1);
    updateLayers();
    
    toast({ title: 'Novo projeto criado!' });
  };

  // Manipulação de objetos
  const deleteSelected = () => {
    if (!activeObject || !canvasRef.current) return;
    canvasRef.current.remove(activeObject);
    canvasRef.current.renderAll();
    saveToHistory();
  };

  const duplicateSelected = () => {
    if (!activeObject || !canvasRef.current) return;
    
    activeObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20
      });
      canvasRef.current?.add(cloned);
      canvasRef.current?.setActiveObject(cloned);
      canvasRef.current?.renderAll();
      saveToHistory();
    });
  };

  // Controles de keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            e.shiftKey ? redo() : undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'd':
            e.preventDefault();
            duplicateSelected();
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteSelected, duplicateSelected]);

  if (!isCanvasReady) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Carregando editor...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto p-4">
      {/* Canvas Principal */}
      <div className="lg:col-span-3">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Barra de ferramentas */}
              <Button onClick={newProject} className="bg-blue-600 hover:bg-blue-700">
                <FolderOpen className="w-4 h-4 mr-2" />
                Novo
              </Button>
              <Button onClick={() => saveProject()} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={undo} disabled={historyIndex <= 0} className="bg-gray-600 hover:bg-gray-700">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button onClick={redo} disabled={historyIndex >= history.length - 1} className="bg-gray-600 hover:bg-gray-700">
                <Redo2 className="w-4 h-4" />
              </Button>
              <Button onClick={() => addText('Novo Texto')} className="bg-purple-600 hover:bg-purple-700">
                <Type className="w-4 h-4 mr-2" />
                Texto
              </Button>
              <label className="cursor-pointer">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <span>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Overlay
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOverlayUpload}
                  className="hidden"
                />
              </label>
              <Button onClick={exportCanvas} className="bg-pink-600 hover:bg-pink-700">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
            
            {/* Canvas */}
            <div className="flex justify-center bg-gray-900 p-4 rounded-lg">
              <canvas
                ref={canvasElRef}
                className="border border-white/20 rounded max-w-full h-auto"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Lateral */}
      <div className="lg:col-span-1 space-y-4">
        {/* Projetos Salvos */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projetos
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-2 p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10"
                  onClick={() => loadProject(project)}
                >
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-white text-xs flex-1 truncate">{project.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Camadas */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Layers className="w-4 h-4 mr-2" />
              Camadas ({layers.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer ${
                    activeObject === layer.object ? 'bg-purple-500/20 border border-purple-400' : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    canvasRef.current?.setActiveObject(layer.object);
                    canvasRef.current?.renderAll();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      layer.type === 'textbox' ? 'bg-purple-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-white truncate">{layer.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        layer.object.set('visible', !layer.visible);
                        canvasRef.current?.renderAll();
                        updateLayers();
                      }}
                    >
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        canvasRef.current?.remove(layer.object);
                        saveToHistory();
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Propriedades do Objeto */}
        {activeObject && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Propriedades
              </h3>
              
              <div className="space-y-3">
                {/* Opacidade */}
                <div>
                  <label className="text-white text-xs block mb-1">Opacidade</label>
                  <Slider
                    value={[(activeObject.opacity || 1) * 100]}
                    onValueChange={(value) => {
                      activeObject.set({ opacity: value[0] / 100 });
                      canvasRef.current?.renderAll();
                    }}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Fonte (para texto) */}
                {activeObject.type === 'textbox' && (
                  <>
                    <div>
                      <label className="text-white text-xs block mb-1">Fonte Freepik</label>
                      <Select
                        value={(activeObject as fabric.Textbox).fontFamily || 'Bebas Neue'}
                        onValueChange={(value) => {
                          (activeObject as fabric.Textbox).set({ fontFamily: value });
                          canvasRef.current?.renderAll();
                        }}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {freepikFonts.map((font) => (
                            <SelectItem key={font.name} value={font.name}>
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-white text-xs block mb-1">Tamanho da Fonte</label>
                      <Slider
                        value={[(activeObject as fabric.Textbox).fontSize || 48]}
                        onValueChange={(value) => {
                          (activeObject as fabric.Textbox).set({ fontSize: value[0] });
                          canvasRef.current?.renderAll();
                        }}
                        min={8}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-white text-xs block mb-1">Cor</label>
                      <input
                        type="color"
                        value={(activeObject as fabric.Textbox).fill as string || '#ffffff'}
                        onChange={(e) => {
                          (activeObject as fabric.Textbox).set({ fill: e.target.value });
                          canvasRef.current?.renderAll();
                        }}
                        className="w-full h-8 rounded border border-white/20"
                      />
                    </div>
                  </>
                )}

                {/* Controles de transformação */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      activeObject.set({ flipX: !activeObject.flipX });
                      canvasRef.current?.renderAll();
                    }}
                    className="flex-1"
                  >
                    <FlipHorizontal className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      activeObject.set({ flipY: !activeObject.flipY });
                      canvasRef.current?.renderAll();
                    }}
                    className="flex-1"
                  >
                    <FlipVertical className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={duplicateSelected}
                    className="flex-1"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}