// Zentraw Artist Toolkit V3 - Editor de Imagens
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, Download, Save, FolderOpen, Copy, 
  Trash2, Eye, EyeOff, Type, Image as ImageIcon, Layers, Settings,
  RotateCcw, FlipHorizontal, FlipVertical, Plus, Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  baseImage?: string;
  defaultTexts?: {
    artist: string;
    title: string;
  };
  onExport?: (imageUrl: string) => void;
}

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'overlay';
  content?: string;
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  textShadow?: string;
  visible: boolean;
  selected: boolean;
  zIndex: number;
}

interface ProjectData {
  id: string;
  name: string;
  elements: CanvasElement[];
  thumbnail: string;
  createdAt: number;
  updatedAt: number;
}

export default function ImageEditor({ 
  baseImage, 
  defaultTexts = { artist: 'Nome do Artista', title: 'Título da Música' },
  onExport 
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Estados principais
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Fontes do Freepik
  const freepikFonts = [
    'Bebas Neue', 'Montserrat', 'Oswald', 'Playfair Display', 'Roboto Condensed',
    'Open Sans', 'Poppins', 'Raleway', 'Anton', 'Righteous', 'Bangers', 
    'Pacifico', 'Dancing Script', 'Satisfy', 'Creepster'
  ];

  // Carregar fontes do Freepik
  useEffect(() => {
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
      'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap'
    ];

    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });

    loadProjects();
  }, []);

  // Inicializar com elementos padrão
  useEffect(() => {
    if (elements.length === 0) {
      const initialElements: CanvasElement[] = [
        {
          id: 'artist-text',
          type: 'text',
          content: defaultTexts.artist,
          x: 540,
          y: 800,
          width: 400,
          height: 80,
          rotation: 0,
          opacity: 1,
          fontSize: 72,
          fontFamily: 'Bebas Neue',
          color: '#ffffff',
          textShadow: '3px 3px 8px rgba(0,0,0,0.8)',
          visible: true,
          selected: false,
          zIndex: 1
        },
        {
          id: 'title-text',
          type: 'text',
          content: defaultTexts.title,
          x: 540,
          y: 900,
          width: 400,
          height: 60,
          rotation: 0,
          opacity: 1,
          fontSize: 56,
          fontFamily: 'Montserrat',
          color: '#cccccc',
          textShadow: '2px 2px 6px rgba(0,0,0,0.6)',
          visible: true,
          selected: false,
          zIndex: 2
        }
      ];
      setElements(initialElements);
    }
  }, [defaultTexts]);

  // Renderizar canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, 1080, 1080);

    // Fundo preto
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1080, 1080);

    // Desenhar imagem base se existir
    if (baseImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1080, 1080);
          renderElements();
        }
      };
      img.src = baseImage;
    } else {
      renderElements();
    }

    function renderElements() {
      if (!ctx) return;

      // Ordenar elementos por zIndex
      const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

      sortedElements.forEach(element => {
        if (!element.visible || !ctx) return;

        ctx.save();
        ctx.globalAlpha = element.opacity;

        // Posicionar elemento
        ctx.translate(element.x, element.y);
        ctx.rotate(element.rotation * Math.PI / 180);

        if (element.type === 'text' && element.content) {
          // Renderizar texto
          const fontSize = element.fontSize || 48;
          ctx.font = `${fontSize}px "${element.fontFamily}", sans-serif`;
          ctx.fillStyle = element.color || '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Aplicar sombra se definida
          if (element.textShadow) {
            const shadowParts = element.textShadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px\s+(.+)/);
            if (shadowParts) {
              ctx.shadowOffsetX = parseInt(shadowParts[1]);
              ctx.shadowOffsetY = parseInt(shadowParts[2]);
              ctx.shadowBlur = parseInt(shadowParts[3]);
              ctx.shadowColor = shadowParts[4];
            }
          }

          // Dividir texto em linhas se necessário
          const lines = element.content.split('\n');
          const lineHeight = fontSize * 1.2;
          lines.forEach((line, index) => {
            const y = (index - (lines.length - 1) / 2) * lineHeight;
            if (ctx) {
              ctx.fillText(line, 0, y);
            }
          });
        } else if (element.type === 'image' && element.src) {
          // Renderizar imagem (implementação futura)
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            if (ctx) {
              ctx.drawImage(img, -element.width/2, -element.height/2, element.width, element.height);
            }
          };
          img.src = element.src;
        }

        // Desenhar borda se selecionado
        if (element.selected && ctx) {
          ctx.strokeStyle = '#ff00ff';
          ctx.lineWidth = 2;
          ctx.strokeRect(-element.width/2, -element.height/2, element.width, element.height);
        }

        ctx.restore();
      });
    }
  }, [elements, baseImage]);

  // Re-renderizar quando elementos mudarem
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Adicionar elemento de texto
  const addText = (text: string = 'Novo Texto') => {
    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: text,
      x: 540,
      y: 300,
      width: 300,
      height: 60,
      rotation: 0,
      opacity: 1,
      fontSize: 48,
      fontFamily: 'Bebas Neue',
      color: '#ffffff',
      textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
      visible: true,
      selected: true,
      zIndex: elements.length + 1
    };

    setElements(prev => prev.map(el => ({ ...el, selected: false })).concat(newElement));
    setSelectedElement(newElement.id);
  };

  // Upload de overlay
  const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newElement: CanvasElement = {
        id: `overlay-${Date.now()}`,
        type: 'overlay',
        src: reader.result as string,
        x: 540,
        y: 300,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
        visible: true,
        selected: true,
        zIndex: elements.length + 1
      };

      setElements(prev => prev.map(el => ({ ...el, selected: false })).concat(newElement));
      setSelectedElement(newElement.id);
    };
    reader.readAsDataURL(file);
  };

  // Atualizar elemento
  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  // Selecionar elemento
  const selectElement = (id: string) => {
    setElements(prev => prev.map(el => ({ ...el, selected: el.id === id })));
    setSelectedElement(id);
  };

  // Deletar elemento
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  // Duplicar elemento
  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const newElement: CanvasElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      selected: true,
      zIndex: elements.length + 1
    };

    setElements(prev => prev.map(el => ({ ...el, selected: false })).concat(newElement));
    setSelectedElement(newElement.id);
  };

  // Exportar canvas
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL('image/png', 1.0);
    
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
    const projectName = name || currentProject?.name || `Projeto ${Date.now()}`;
    const canvas = canvasRef.current;
    const thumbnail = canvas?.toDataURL('image/png', 0.3) || '';

    const project: ProjectData = {
      id: currentProject?.id || `project_${Date.now()}`,
      name: projectName,
      elements: elements,
      thumbnail,
      createdAt: currentProject?.createdAt || Date.now(),
      updatedAt: Date.now()
    };

    const savedProjects = JSON.parse(localStorage.getItem('zentraw_v3_projects') || '[]');
    const existingIndex = savedProjects.findIndex((p: ProjectData) => p.id === project.id);

    if (existingIndex >= 0) {
      savedProjects[existingIndex] = project;
    } else {
      savedProjects.push(project);
    }

    localStorage.setItem('zentraw_v3_projects', JSON.stringify(savedProjects));
    setProjects(savedProjects);
    setCurrentProject(project);

    toast({ title: 'Projeto salvo com sucesso!' });
  };

  // Carregar projetos
  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem('zentraw_v3_projects') || '[]');
    setProjects(savedProjects);
  };

  // Carregar projeto
  const loadProject = (project: ProjectData) => {
    setElements(project.elements);
    setCurrentProject(project);
    setSelectedElement(null);
    toast({ title: `Projeto "${project.name}" carregado!` });
  };

  // Novo projeto
  const newProject = () => {
    setElements([]);
    setCurrentProject(null);
    setSelectedElement(null);
    toast({ title: 'Novo projeto criado!' });
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto p-4">
      {/* Canvas Principal */}
      <div className="lg:col-span-3">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Barra de ferramentas */}
              <Button onClick={newProject} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
              <Button onClick={() => saveProject()} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={() => addText()} className="bg-purple-600 hover:bg-purple-700">
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
                ref={canvasRef}
                width={1080}
                height={1080}
                className="border border-white/20 rounded max-w-full h-auto cursor-crosshair"
                style={{ maxHeight: '70vh' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) * (1080 / rect.width);
                  const y = (e.clientY - rect.top) * (1080 / rect.height);
                  
                  // Encontrar elemento clicado
                  const clickedElement = elements
                    .filter(el => el.visible)
                    .sort((a, b) => b.zIndex - a.zIndex)
                    .find(el => 
                      x >= el.x - el.width/2 && x <= el.x + el.width/2 &&
                      y >= el.y - el.height/2 && y <= el.y + el.height/2
                    );
                  
                  if (clickedElement) {
                    selectElement(clickedElement.id);
                  } else {
                    setSelectedElement(null);
                    setElements(prev => prev.map(el => ({ ...el, selected: false })));
                  }
                }}
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
              Projetos ({projects.length})
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
              Camadas ({elements.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {elements
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((element) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer ${
                    element.selected ? 'bg-purple-500/20 border border-purple-400' : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => selectElement(element.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      element.type === 'text' ? 'bg-purple-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-white truncate">
                      {element.type === 'text' ? element.content?.substring(0, 15) + '...' : 'Imagem'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateElement(element.id, { visible: !element.visible });
                      }}
                    >
                      {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
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

        {/* Propriedades do Elemento */}
        {selectedEl && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Propriedades
              </h3>
              
              <div className="space-y-3">
                {/* Propriedades de texto */}
                {selectedEl.type === 'text' && (
                  <>
                    <div>
                      <label className="text-white text-xs block mb-1">Conteúdo</label>
                      <Input
                        value={selectedEl.content || ''}
                        onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white text-xs block mb-1">Fonte Freepik</label>
                      <Select
                        value={selectedEl.fontFamily || 'Bebas Neue'}
                        onValueChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
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
                      <label className="text-white text-xs block mb-1">Tamanho da Fonte</label>
                      <Input
                        type="number"
                        value={selectedEl.fontSize || 48}
                        onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                        className="bg-white/10 border-white/20 text-white"
                        min="8"
                        max="200"
                      />
                    </div>

                    <div>
                      <label className="text-white text-xs block mb-1">Cor</label>
                      <input
                        type="color"
                        value={selectedEl.color || '#ffffff'}
                        onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                        className="w-full h-8 rounded border border-white/20"
                      />
                    </div>
                  </>
                )}

                {/* Posição */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-white text-xs block mb-1">X</label>
                    <Input
                      type="number"
                      value={selectedEl.x}
                      onChange={(e) => updateElement(selectedEl.id, { x: Number(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-xs block mb-1">Y</label>
                    <Input
                      type="number"
                      value={selectedEl.y}
                      onChange={(e) => updateElement(selectedEl.id, { y: Number(e.target.value) })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                {/* Opacidade */}
                <div>
                  <label className="text-white text-xs block mb-1">Opacidade</label>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedEl.opacity}
                    onChange={(e) => updateElement(selectedEl.id, { opacity: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{Math.round(selectedEl.opacity * 100)}%</span>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => duplicateElement(selectedEl.id)}
                    className="flex-1"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => deleteElement(selectedEl.id)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Excluir
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