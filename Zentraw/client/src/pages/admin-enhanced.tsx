import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Undo, Redo, RotateCcw, Settings, Layers, Type, Palette, Download, User, Music, Move, Grid, Eye, EyeOff, Lock, Unlock, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { PreviewPanel } from '@/components/PreviewPanel';
import { VisualFilters, VisualFilter, defaultFilters } from '@/components/VisualFilters';
import { CanvasRenderer } from '@/components/CanvasRenderer';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface SVGTemplate {
  id: number;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic' | 'minimalist';
  svgContent: string;
  isActive: boolean;
}

interface LayerControls {
  image: {
    scale: { cover: number; story: number };
    opacity: number;
    position: { cover: { x: number; y: number }; story: { x: number; y: number } };
    hidden: boolean;
    locked: boolean;
  };
  svg: {
    scale: { cover: number; story: number };
    opacity: number;
    position: { cover: { x: number; y: number }; story: { x: number; y: number } };
    hidden: boolean;
    locked: boolean;
  };
  artist: {
    scale: { cover: number; story: number };
    opacity: number;
    position: { cover: { x: number; y: number }; story: { x: number; y: number } };
    hidden: boolean;
    locked: boolean;
  };
  album: {
    scale: { cover: number; story: number };
    opacity: number;
    position: { cover: { x: number; y: number }; story: { x: number; y: number } };
    hidden: boolean;
    locked: boolean;
  };
  layerOrder: string[];
}

interface TemplateState {
  typography: any;
  layerControls: LayerControls;
  visualFilters: Record<string, VisualFilter>;
  uploadedImage: string | null;
}

export default function AdminEnhanced() {
  const [selectedTemplate, setSelectedTemplate] = useState<SVGTemplate | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeFormat, setActiveFormat] = useState<'cover' | 'story'>('cover');
  const [previewZoom, setPreviewZoom] = useState(1);
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial state
  const initialState: TemplateState = {
    typography: {
      artistName: 'Artist Name',
      albumName: 'Album Name',
      artistFont: {
        family: 'Arial',
        size: 24,
        weight: 700,
        color: '#ffffff',
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: 'uppercase' as const,
        textAlign: 'center' as const,
        strokeWidth: 0,
        strokeColor: '#000000',
        rotation: 0,
        skewX: 0,
        skewY: 0,
        shadowBlur: 0,
        shadowColor: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        gradientEnabled: false,
        gradientStart: '#ffffff',
        gradientEnd: '#cccccc',
        gradientAngle: 0,
        outlineWidth: 0,
        outlineColor: '#000000',
        backgroundColor: 'transparent',
        backgroundOpacity: 0,
        borderRadius: 0,
        padding: 0,
        maxWidth: 300,
        wordWrap: true,
        textDecoration: 'none' as const,
        fontStyle: 'normal' as const
      },
      albumFont: {
        family: 'Arial',
        size: 18,
        weight: 400,
        color: '#ffffff',
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: 'none' as const,
        textAlign: 'center' as const,
        strokeWidth: 0,
        strokeColor: '#000000',
        rotation: 0,
        skewX: 0,
        skewY: 0,
        shadowBlur: 0,
        shadowColor: '#000000',
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        gradientEnabled: false,
        gradientStart: '#ffffff',
        gradientEnd: '#cccccc',
        gradientAngle: 0,
        outlineWidth: 0,
        outlineColor: '#000000',
        backgroundColor: 'transparent',
        backgroundOpacity: 0,
        borderRadius: 0,
        padding: 0,
        maxWidth: 300,
        wordWrap: true,
        textDecoration: 'none' as const,
        fontStyle: 'normal' as const
      }
    },
    layerControls: {
      image: {
        scale: { cover: 100, story: 100 },
        opacity: 100,
        position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } },
        hidden: false,
        locked: false
      },
      svg: {
        scale: { cover: 100, story: 100 },
        opacity: 100,
        position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } },
        hidden: false,
        locked: false
      },
      artist: {
        scale: { cover: 100, story: 100 },
        opacity: 100,
        position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } },
        hidden: false,
        locked: false
      },
      album: {
        scale: { cover: 100, story: 100 },
        opacity: 100,
        position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } },
        hidden: false,
        locked: false
      },
      layerOrder: ['image', 'svg', 'artist', 'album']
    },
    visualFilters: {
      image: { ...defaultFilters },
      svg: { ...defaultFilters },
      artist: { ...defaultFilters },
      album: { ...defaultFilters }
    },
    uploadedImage: null
  };

  // Real undo/redo implementation
  const {
    state,
    canUndo,
    canRedo,
    pushState,
    undo,
    redo,
    reset
  } = useUndoRedo<TemplateState>(initialState);

  // Load templates
  const { data: templates = [], isLoading } = useQuery<SVGTemplate[]>({
    queryKey: ['/api/admin/templates'],
  });

  // Template mutations
  const createMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest('/api/admin/templates', 'POST', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template created successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error creating template", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/templates/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting template", description: error.message, variant: "destructive" });
    },
  });

  // State update functions that trigger undo/redo
  const updateTypography = useCallback((newTypography: any) => {
    pushState({
      ...state,
      typography: newTypography
    });
  }, [state, pushState]);

  const updateLayerControls = useCallback((newLayerControls: LayerControls) => {
    pushState({
      ...state,
      layerControls: newLayerControls
    });
  }, [state, pushState]);

  const updateVisualFilters = useCallback((layerType: string, filters: VisualFilter) => {
    pushState({
      ...state,
      visualFilters: {
        ...state.visualFilters,
        [layerType]: filters
      }
    });
  }, [state, pushState]);

  const updateUploadedImage = useCallback((image: string | null) => {
    pushState({
      ...state,
      uploadedImage: image
    });
  }, [state, pushState]);

  // Individual update functions for UI components
  const updateLayerControl = useCallback((layerType: string, property: string, value: any) => {
    const currentLayer = state.layerControls[layerType as keyof LayerControls];
    if (typeof currentLayer === 'object') {
      const newLayerControls = {
        ...state.layerControls,
        [layerType]: {
          ...currentLayer,
          [property]: value
        }
      };
      updateLayerControls(newLayerControls);
    }
  }, [state.layerControls, updateLayerControls]);

  const updateTypographyProperty = useCallback((property: string, value: any) => {
    const newTypography = {
      ...state.typography,
      [property]: value
    };
    updateTypography(newTypography);
  }, [state.typography, updateTypography]);

  // File upload handlers
  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target?.result as string;
        const templateData = {
          name: file.name.replace('.svg', ''),
          category: 'modern',
          svgContent,
          isActive: true
        };
        createMutation.mutate(templateData);
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updateUploadedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Layer interaction handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, layerType: string) => {
    const layer = state.layerControls[layerType as keyof LayerControls];
    if (typeof layer === 'object' && 'locked' in layer && !layer.locked) {
      setDraggedLayer(layerType);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [state.layerControls]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedLayer) {
      const rect = document.querySelector('.preview-container')?.getBoundingClientRect();
      if (rect) {
        const newX = (e.clientX - rect.left - dragOffset.x - rect.width / 2) / previewZoom;
        const newY = (e.clientY - rect.top - dragOffset.y - rect.height / 2) / previewZoom;
        
        const newLayerControls = {
          ...state.layerControls,
          [draggedLayer]: {
            ...state.layerControls[draggedLayer as keyof LayerControls],
            position: {
              ...state.layerControls[draggedLayer as keyof LayerControls].position,
              [activeFormat]: { x: newX, y: newY }
            }
          }
        };
        updateLayerControls(newLayerControls);
      }
    }
  }, [draggedLayer, dragOffset, activeFormat, previewZoom, state.layerControls, updateLayerControls]);

  const handleMouseUp = useCallback(() => {
    setDraggedLayer(null);
  }, []);

  useEffect(() => {
    if (draggedLayer) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedLayer, handleMouseMove, handleMouseUp]);

  // Canvas rendering and download
  const handleDownload = async (format: 'cover' | 'story') => {
    if (!selectedTemplate || !canvasRef.current) return;

    const renderer = new CanvasRenderer(canvasRef.current);
    
    try {
      await renderer.renderTemplate({
        template: selectedTemplate,
        format,
        layerControls: state.layerControls,
        typography: state.typography,
        uploadedImage: state.uploadedImage,
        visualFilters: state.visualFilters
      });

      const filename = `${selectedTemplate.name}-${format}-${state.typography.artistName}-${state.typography.albumName}.png`;
      await renderer.downloadAsPNG(filename);
      
      toast({ title: `${format} downloaded successfully!` });
    } catch (error) {
      toast({ title: "Error generating download", description: "Please try again", variant: "destructive" });
    }
  };

  // Reset functions
  const resetLayerPositions = () => {
    const newLayerControls = { ...state.layerControls };
    Object.keys(newLayerControls).forEach(layerType => {
      if (layerType !== 'layerOrder') {
        newLayerControls[layerType as keyof LayerControls].position = {
          cover: { x: 0, y: 0 },
          story: { x: 0, y: 0 }
        };
      }
    });
    updateLayerControls(newLayerControls);
  };

  const resetTypography = (textType: 'artist' | 'album') => {
    const defaultFont = initialState.typography[`${textType}Font`];
    const newTypography = {
      ...state.typography,
      [`${textType}Font`]: { ...defaultFont }
    };
    updateTypography(newTypography);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            if (selectedTemplate) {
              handleDownload('cover');
            }
            break;
          case 'r':
            e.preventDefault();
            resetLayerPositions();
            break;
        }
      }
      
      // Format switching with Tab
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setActiveFormat(activeFormat === 'cover' ? 'story' : 'cover');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, selectedTemplate, activeFormat, handleDownload, resetLayerPositions]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Hidden canvas for rendering */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Preview Panel */}
      <PreviewPanel
        selectedTemplate={selectedTemplate}
        activeFormat={activeFormat}
        uploadedImage={state.uploadedImage}
        layerControls={state.layerControls}
        typography={state.typography}
        previewZoom={previewZoom}
        visualFilters={state.visualFilters}
        onFormatSwitch={() => setActiveFormat(activeFormat === 'cover' ? 'story' : 'cover')}
        onResetPositions={resetLayerPositions}
        onZoomChange={setPreviewZoom}
        onDownload={handleDownload}
        onMouseDown={handleMouseDown}
      />

      {/* Control Panel */}
      <div className="flex-1 bg-white">
        <div className="p-6">
          {/* Header with Undo/Redo */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Enhanced Template Manager</h1>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reset(initialState)}
                title="Reset All"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="templates">
                  <Settings className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Type className="w-4 h-4 mr-2" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="layers">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers
                </TabsTrigger>
                <TabsTrigger value="effects">
                  <Palette className="w-4 h-4 mr-2" />
                  Visual FX
                </TabsTrigger>
                <TabsTrigger value="export">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="svg-upload">SVG Template File</Label>
                        <Input 
                          id="svg-upload" 
                          type="file" 
                          accept=".svg" 
                          onChange={handleSvgUpload}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-upload">Background Image</Label>
                        <Input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div>Loading templates...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                          <Card 
                            key={template.id} 
                            className={`cursor-pointer transition-all ${
                              selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{template.name}</h3>
                                <Badge variant="outline">{template.category}</Badge>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMutation.mutate(template.id.toString());
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="effects" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {['image', 'svg', 'artist', 'album'].map((layerType) => (
                    <VisualFilters
                      key={layerType}
                      layerType={layerType as 'image' | 'svg' | 'artist' | 'album'}
                      filters={state.visualFilters[layerType]}
                      onFiltersChange={(filters) => updateVisualFilters(layerType, filters)}
                      onReset={() => updateVisualFilters(layerType, { ...defaultFilters })}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Artist Name */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Artist Name
                        </h3>
                        <div>
                          <Label>Text</Label>
                          <Input
                            value={state.typography.artistName}
                            onChange={(e) => updateTypographyProperty('artistName', e.target.value)}
                            placeholder="Artist Name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Font Family</Label>
                            <Select 
                              value={state.typography.artistFont.family} 
                              onValueChange={(value) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, family: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                                <SelectItem value="Impact">Impact</SelectItem>
                                <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                                <SelectItem value="Courier New">Courier New</SelectItem>
                                <SelectItem value="Lucida Console">Lucida Console</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Font Weight</Label>
                            <Select 
                              value={state.typography.artistFont.weight.toString()} 
                              onValueChange={(value) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, weight: parseInt(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100">Thin</SelectItem>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="900">Black</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Font Size: {state.typography.artistFont.size}px</Label>
                          <Slider
                            value={[state.typography.artistFont.size]}
                            onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, size: value })}
                            min={12}
                            max={120}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Text Color</Label>
                            <Input
                              type="color"
                              value={state.typography.artistFont.color}
                              onChange={(e) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, color: e.target.value })}
                              className="mt-2 h-10"
                            />
                          </div>
                          <div>
                            <Label>Stroke Color</Label>
                            <Input
                              type="color"
                              value={state.typography.artistFont.strokeColor || '#000000'}
                              onChange={(e) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, strokeColor: e.target.value })}
                              className="mt-2 h-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Stroke Width: {state.typography.artistFont.strokeWidth || 0}px</Label>
                          <Slider
                            value={[state.typography.artistFont.strokeWidth || 0]}
                            onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, strokeWidth: value })}
                            min={0}
                            max={10}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Shadow X: {state.typography.artistFont.shadowOffsetX || 0}</Label>
                            <Slider
                              value={[state.typography.artistFont.shadowOffsetX || 0]}
                              onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, shadowOffsetX: value })}
                              min={-20}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Shadow Y: {state.typography.artistFont.shadowOffsetY || 0}</Label>
                            <Slider
                              value={[state.typography.artistFont.shadowOffsetY || 0]}
                              onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, shadowOffsetY: value })}
                              min={-20}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Shadow Blur: {state.typography.artistFont.shadowBlur || 0}</Label>
                            <Slider
                              value={[state.typography.artistFont.shadowBlur || 0]}
                              onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, shadowBlur: value })}
                              min={0}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Shadow Color</Label>
                          <Input
                            type="color"
                            value={state.typography.artistFont.shadowColor || '#000000'}
                            onChange={(e) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, shadowColor: e.target.value })}
                            className="mt-2 h-10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Text Transform</Label>
                            <Select 
                              value={state.typography.artistFont.textTransform || 'none'} 
                              onValueChange={(value) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, textTransform: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                                <SelectItem value="lowercase">lowercase</SelectItem>
                                <SelectItem value="capitalize">Capitalize</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Letter Spacing: {state.typography.artistFont.letterSpacing || 0}px</Label>
                            <Slider
                              value={[state.typography.artistFont.letterSpacing || 0]}
                              onValueChange={([value]) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, letterSpacing: value })}
                              min={-5}
                              max={20}
                              step={0.5}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={state.typography.artistFont.gradient || false}
                              onCheckedChange={(checked) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, gradient: checked })}
                            />
                            <Label>Gradient</Label>
                          </div>
                          {state.typography.artistFont.gradient && (
                            <Input
                              type="color"
                              value={state.typography.artistFont.gradientColor || '#ff0000'}
                              onChange={(e) => updateTypographyProperty('artistFont', { ...state.typography.artistFont, gradientColor: e.target.value })}
                              className="h-8 w-16"
                            />
                          )}
                        </div>
                      </div>

                      {/* Album Name */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Music className="w-5 h-5" />
                          Album Name
                        </h3>
                        <div>
                          <Label>Text</Label>
                          <Input
                            value={state.typography.albumName}
                            onChange={(e) => updateTypographyProperty('albumName', e.target.value)}
                            placeholder="Album Name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Font Family</Label>
                            <Select 
                              value={state.typography.albumFont.family} 
                              onValueChange={(value) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, family: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                                <SelectItem value="Impact">Impact</SelectItem>
                                <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                                <SelectItem value="Courier New">Courier New</SelectItem>
                                <SelectItem value="Lucida Console">Lucida Console</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Font Weight</Label>
                            <Select 
                              value={state.typography.albumFont.weight.toString()} 
                              onValueChange={(value) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, weight: parseInt(value) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="100">Thin</SelectItem>
                                <SelectItem value="300">Light</SelectItem>
                                <SelectItem value="400">Normal</SelectItem>
                                <SelectItem value="500">Medium</SelectItem>
                                <SelectItem value="700">Bold</SelectItem>
                                <SelectItem value="900">Black</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Font Size: {state.typography.albumFont.size}px</Label>
                          <Slider
                            value={[state.typography.albumFont.size]}
                            onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, size: value })}
                            min={10}
                            max={80}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Text Color</Label>
                            <Input
                              type="color"
                              value={state.typography.albumFont.color}
                              onChange={(e) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, color: e.target.value })}
                              className="mt-2 h-10"
                            />
                          </div>
                          <div>
                            <Label>Stroke Color</Label>
                            <Input
                              type="color"
                              value={state.typography.albumFont.strokeColor || '#000000'}
                              onChange={(e) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, strokeColor: e.target.value })}
                              className="mt-2 h-10"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Stroke Width: {state.typography.albumFont.strokeWidth || 0}px</Label>
                          <Slider
                            value={[state.typography.albumFont.strokeWidth || 0]}
                            onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, strokeWidth: value })}
                            min={0}
                            max={10}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Shadow X: {state.typography.albumFont.shadowOffsetX || 0}</Label>
                            <Slider
                              value={[state.typography.albumFont.shadowOffsetX || 0]}
                              onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, shadowOffsetX: value })}
                              min={-20}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Shadow Y: {state.typography.albumFont.shadowOffsetY || 0}</Label>
                            <Slider
                              value={[state.typography.albumFont.shadowOffsetY || 0]}
                              onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, shadowOffsetY: value })}
                              min={-20}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Shadow Blur: {state.typography.albumFont.shadowBlur || 0}</Label>
                            <Slider
                              value={[state.typography.albumFont.shadowBlur || 0]}
                              onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, shadowBlur: value })}
                              min={0}
                              max={20}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Shadow Color</Label>
                          <Input
                            type="color"
                            value={state.typography.albumFont.shadowColor || '#000000'}
                            onChange={(e) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, shadowColor: e.target.value })}
                            className="mt-2 h-10"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Text Transform</Label>
                            <Select 
                              value={state.typography.albumFont.textTransform || 'none'} 
                              onValueChange={(value) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, textTransform: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="uppercase">UPPERCASE</SelectItem>
                                <SelectItem value="lowercase">lowercase</SelectItem>
                                <SelectItem value="capitalize">Capitalize</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Letter Spacing: {state.typography.albumFont.letterSpacing || 0}px</Label>
                            <Slider
                              value={[state.typography.albumFont.letterSpacing || 0]}
                              onValueChange={([value]) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, letterSpacing: value })}
                              min={-5}
                              max={20}
                              step={0.5}
                              className="mt-2"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={state.typography.albumFont.gradient || false}
                              onCheckedChange={(checked) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, gradient: checked })}
                            />
                            <Label>Gradient</Label>
                          </div>
                          {state.typography.albumFont.gradient && (
                            <Input
                              type="color"
                              value={state.typography.albumFont.gradientColor || '#ff0000'}
                              onChange={(e) => updateTypographyProperty('albumFont', { ...state.typography.albumFont, gradientColor: e.target.value })}
                              className="h-8 w-16"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layers" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Layer Control & Positioning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Layer Order Controls */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Grid className="w-5 h-5" />
                        Layer Order
                      </h3>
                      <div className="space-y-3">
                        <Label>Layer Stacking Order (Drag to reorder)</Label>
                        <div className="space-y-2">
                          {(Array.isArray(state.layerControls.layerOrder) ? state.layerControls.layerOrder : ['image', 'svg', 'artist', 'album']).map((layer, index) => (
                            <div
                              key={layer}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', layer);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                const draggedLayer = e.dataTransfer.getData('text/plain');
                                const currentOrder = Array.isArray(state.layerControls.layerOrder) ? [...state.layerControls.layerOrder] : ['image', 'svg', 'artist', 'album'];
                                const draggedIndex = currentOrder.indexOf(draggedLayer);
                                const targetIndex = currentOrder.indexOf(layer);
                                
                                if (draggedIndex !== -1 && targetIndex !== -1) {
                                  // Remove dragged item and insert at new position
                                  currentOrder.splice(draggedIndex, 1);
                                  currentOrder.splice(targetIndex, 0, draggedLayer);
                                  updateLayerControl('layerOrder', '', currentOrder);
                                }
                              }}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg border-2 border-dashed border-transparent hover:border-muted-foreground/25 cursor-move transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                                    {index + 1}
                                  </span>
                                  <Move className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {layer === 'image' ? '🖼️' : layer === 'svg' ? '🎨' : layer === 'artist' ? '👤' : '💿'}
                                  </span>
                                  <span className="font-medium capitalize">{layer} Layer</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const currentOrder = Array.isArray(state.layerControls.layerOrder) ? [...state.layerControls.layerOrder] : ['image', 'svg', 'artist', 'album'];
                                    if (index > 0) {
                                      [currentOrder[index], currentOrder[index - 1]] = [currentOrder[index - 1], currentOrder[index]];
                                      updateLayerControl('layerOrder', '', currentOrder);
                                    }
                                  }}
                                  disabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const currentOrder = Array.isArray(state.layerControls.layerOrder) ? [...state.layerControls.layerOrder] : ['image', 'svg', 'artist', 'album'];
                                    if (index < currentOrder.length - 1) {
                                      [currentOrder[index], currentOrder[index + 1]] = [currentOrder[index + 1], currentOrder[index]];
                                      updateLayerControl('layerOrder', '', currentOrder);
                                    }
                                  }}
                                  disabled={index === (Array.isArray(state.layerControls.layerOrder) ? state.layerControls.layerOrder.length : 4) - 1}
                                >
                                  ↓
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentOrder = Array.isArray(state.layerControls.layerOrder) ? [...state.layerControls.layerOrder] : ['image', 'svg', 'artist', 'album'];
                              updateLayerControl('layerOrder', '', currentOrder.reverse());
                            }}
                          >
                            Reverse Order
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateLayerControl('layerOrder', '', ['image', 'svg', 'artist', 'album']);
                            }}
                          >
                            Reset Order
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          💡 Tip: Higher layers appear on top. Drag items or use arrow buttons to reorder.
                        </div>
                      </div>
                    </div>

                    {/* Individual Layer Controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(state.layerControls).map(([layerType, controls]) => {
                        if (layerType === 'layerOrder') return null;
                        
                        const layerIcons = {
                          image: '🖼️',
                          svg: '🎨',
                          artist: '👤',
                          album: '💿'
                        };
                        
                        return (
                          <div key={layerType} className="space-y-4 p-4 border rounded-lg bg-muted/30">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{layerIcons[layerType as keyof typeof layerIcons]}</span>
                                <h3 className="text-lg font-semibold capitalize">{layerType} Layer</h3>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateLayerControl(layerType, 'locked', !controls.locked)}
                                  >
                                    {controls.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                  </Button>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateLayerControl(layerType, 'hidden', !controls.hidden)}
                                  >
                                    {controls.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Opacity: {Math.round(controls.opacity * 100)}%</Label>
                              <Slider
                                value={[controls.opacity * 100]}
                                onValueChange={([value]) => updateLayerControl(layerType, 'opacity', value / 100)}
                                min={0}
                                max={100}
                                step={1}
                                className="mt-2"
                                disabled={controls.locked}
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-sm font-medium">Scale Controls</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Cover: {Math.round(controls.scale.cover * 100)}%</Label>
                                  <Slider
                                    value={[controls.scale.cover * 100]}
                                    onValueChange={([value]) => updateLayerControl(layerType, 'scale', { 
                                      ...controls.scale, 
                                      cover: value / 100 
                                    })}
                                    min={10}
                                    max={300}
                                    step={1}
                                    className="mt-1"
                                    disabled={controls.locked}
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Story: {Math.round(controls.scale.story * 100)}%</Label>
                                  <Slider
                                    value={[controls.scale.story * 100]}
                                    onValueChange={([value]) => updateLayerControl(layerType, 'scale', { 
                                      ...controls.scale, 
                                      story: value / 100 
                                    })}
                                    min={10}
                                    max={300}
                                    step={1}
                                    className="mt-1"
                                    disabled={controls.locked}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <Move className="w-4 h-4" />
                                Position Controls (Drag in preview or use sliders)
                              </Label>
                              
                              {/* Cover Position */}
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">Cover Format Position</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">X: {controls.position?.cover?.x || 0}px</Label>
                                    <Slider
                                      value={[controls.position?.cover?.x || 0]}
                                      onValueChange={([value]) => updateLayerControl(layerType, 'position', {
                                        cover: { ...controls.position?.cover, x: value },
                                        story: controls.position?.story || { x: 0, y: 0 }
                                      })}
                                      min={-400}
                                      max={400}
                                      step={1}
                                      className="mt-1"
                                      disabled={controls.locked}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Y: {controls.position?.cover?.y || 0}px</Label>
                                    <Slider
                                      value={[controls.position?.cover?.y || 0]}
                                      onValueChange={([value]) => updateLayerControl(layerType, 'position', {
                                        cover: { ...controls.position?.cover, y: value },
                                        story: controls.position?.story || { x: 0, y: 0 }
                                      })}
                                      min={-400}
                                      max={400}
                                      step={1}
                                      className="mt-1"
                                      disabled={controls.locked}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Story Position */}
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">Story Format Position</Label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <Label className="text-xs">X: {controls.position?.story?.x || 0}px</Label>
                                    <Slider
                                      value={[controls.position?.story?.x || 0]}
                                      onValueChange={([value]) => updateLayerControl(layerType, 'position', {
                                        cover: controls.position?.cover || { x: 0, y: 0 },
                                        story: { ...controls.position?.story, x: value }
                                      })}
                                      min={-400}
                                      max={400}
                                      step={1}
                                      className="mt-1"
                                      disabled={controls.locked}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Y: {controls.position?.story?.y || 0}px</Label>
                                    <Slider
                                      value={[controls.position?.story?.y || 0]}
                                      onValueChange={([value]) => updateLayerControl(layerType, 'position', {
                                        cover: controls.position?.cover || { x: 0, y: 0 },
                                        story: { ...controls.position?.story, y: value }
                                      })}
                                      min={-400}
                                      max={400}
                                      step={1}
                                      className="mt-1"
                                      disabled={controls.locked}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLayerControl(layerType, 'position', {
                                  cover: { x: 0, y: 0 },
                                  story: { x: 0, y: 0 }
                                })}
                                disabled={controls.locked}
                              >
                                Reset Position
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLayerControl(layerType, 'scale', {
                                  cover: 1,
                                  story: 1
                                })}
                                disabled={controls.locked}
                              >
                                Reset Scale
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Global Layer Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={resetLayerPositions}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset All Positions
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        💡 Tip: Click and drag layers in the preview panel for precise positioning
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTemplate && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button 
                          onClick={() => handleDownload('cover')}
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Cover (1:1)</span>
                        </Button>
                        <Button 
                          onClick={() => handleDownload('story')}
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Story (9:16)</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}