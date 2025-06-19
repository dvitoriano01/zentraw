import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { 
  Upload, 
  Save, 
  Trash2, 
  Eye, 
  Settings, 
  Type, 
  Layout, 
  Download,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Move
} from 'lucide-react';

// Enhanced SVG Preview with typography application
function SvgPreview({ svgContent, artistName, albumName, typography, position = { x: 0, y: 0 }, scale = 1, opacity = 1 }: {
  svgContent: string;
  artistName: string;
  albumName: string;
  typography?: any;
  position?: { x: number; y: number };
  scale?: number;
  opacity?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;
    
    try {
      // Process SVG with text replacement
      let processedSvg = svgContent
        .replace(/\{\{artistName\}\}/g, artistName || 'Artist Name')
        .replace(/\{\{albumName\}\}/g, albumName || 'Album Name')
        .replace(/\{\{ARTIST_NAME\}\}/g, artistName || 'Artist Name')
        .replace(/\{\{ALBUM_NAME\}\}/g, albumName || 'Album Name');
      
      // Apply typography if provided
      if (typography) {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(processedSvg, 'image/svg+xml');
        const textElements = svgDoc.querySelectorAll('text');
        
        textElements.forEach((textEl) => {
          const text = textEl.textContent || '';
          const isArtistName = text.includes(artistName) || text === artistName;
          const fontConfig = isArtistName ? typography.artistFont : typography.albumFont;
          
          if (fontConfig) {
            textEl.setAttribute('font-family', fontConfig.family);
            textEl.setAttribute('font-weight', fontConfig.weight.toString());
            textEl.setAttribute('font-size', fontConfig.size.default.toString());
            textEl.setAttribute('fill', fontConfig.color);
            textEl.setAttribute('opacity', (fontConfig.opacity.default / 100).toString());
            
            if (fontConfig.strokeWidth > 0) {
              textEl.setAttribute('stroke', fontConfig.strokeColor);
              textEl.setAttribute('stroke-width', fontConfig.strokeWidth.toString());
            }
          }
        });
        
        processedSvg = new XMLSerializer().serializeToString(svgDoc);
      }
      
      containerRef.current.innerHTML = processedSvg;
    } catch (error) {
      console.error('Error processing SVG:', error);
      containerRef.current.innerHTML = svgContent;
    }
  }, [svgContent, artistName, albumName, typography]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        opacity: opacity,
        transformOrigin: 'center center'
      }}
    />
  );
}

// Text Layer Component with typography
function TextLayer({ artistName, albumName, typography, position = { x: 0, y: 0 }, scale = 1, opacity = 1 }: {
  artistName: string;
  albumName: string;
  typography?: any;
  position?: { x: number; y: number };
  scale?: number;
  opacity?: number;
}) {
  if (!typography || !artistName || !albumName) return null;
  
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        opacity: opacity,
        transformOrigin: 'center center'
      }}
    >
      <div 
        style={{
          fontFamily: typography.artistFont.family,
          fontWeight: typography.artistFont.weight,
          fontSize: `${typography.artistFont.size.default}px`,
          color: typography.artistFont.color,
          textTransform: typography.artistFont.textTransform,
          textAlign: typography.artistFont.textAlign,
          letterSpacing: `${typography.artistFont.letterSpacing}px`,
          lineHeight: typography.artistFont.lineHeight,
          WebkitTextStroke: typography.artistFont.strokeWidth > 0 
            ? `${typography.artistFont.strokeWidth}px ${typography.artistFont.strokeColor}` 
            : 'none'
        }}
      >
        {artistName}
      </div>
      <div 
        style={{
          fontFamily: typography.albumFont.family,
          fontWeight: typography.albumFont.weight,
          fontSize: `${typography.albumFont.size.default}px`,
          color: typography.albumFont.color,
          textTransform: typography.albumFont.textTransform,
          textAlign: typography.albumFont.textAlign,
          letterSpacing: `${typography.albumFont.letterSpacing}px`,
          lineHeight: typography.albumFont.lineHeight,
          WebkitTextStroke: typography.albumFont.strokeWidth > 0 
            ? `${typography.albumFont.strokeWidth}px ${typography.albumFont.strokeColor}` 
            : 'none'
        }}
      >
        {albumName}
      </div>
    </div>
  );
}

interface SVGTemplate {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic' | 'minimalist';
  svgContent: string;
  isActive: boolean;
  fontProperties: {
    artistFont: {
      family: string;
      weight: number;
      size: { min: number; max: number; default: number };
      color: string;
      opacity: { min: number; max: number; default: number };
      position: { x: number; y: number };
      rotation: number;
      letterSpacing: number;
      lineHeight: number;
      textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
      textAlign: 'left' | 'center' | 'right';
      strokeWidth: number;
      strokeColor: string;
    };
    albumFont: {
      family: string;
      weight: number;
      size: { min: number; max: number; default: number };
      color: string;
      opacity: { min: number; max: number; default: number };
      position: { x: number; y: number };
      rotation: number;
      letterSpacing: number;
      lineHeight: number;
      textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
      textAlign: 'left' | 'center' | 'right';
      strokeWidth: number;
      strokeColor: string;
    };
  };
  layoutProperties: {
    canvasSize: { width: number; height: number };
    shapes: Array<{
      id: string;
      type: 'rectangle' | 'circle' | 'polygon' | 'path';
      properties: any;
      overlay: boolean;
      blendMode: string;
    }>;
    overlays: Array<{
      id: string;
      type: 'gradient' | 'texture' | 'pattern';
      opacity: { min: number; max: number; default: number };
      blendMode: string;
      properties: any;
    }>;
  };
}

export default function AdminPanel() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SVGTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'cover' | 'story'>('cover');
  
  // Text state
  const [previewText, setPreviewText] = useState({
    artistName: 'ALOK',
    albumName: 'Too Sweet'
  });
  
  const [appliedText, setAppliedText] = useState({
    artistName: 'ALOK',
    albumName: 'Too Sweet'
  });

  // Layer controls with separate text layer
  const [layerControls, setLayerControls] = useState({
    image: { scale: 100, opacity: 100, position: { x: 0, y: 0 } },
    svg: { scale: 100, opacity: 100, position: { x: 0, y: 0 } },
    text: { scale: 100, opacity: 100, position: { x: 0, y: 0 } },
    layerOrder: ['image', 'svg', 'text'] // Bottom to top
  });

  // Drag state
  const [isDragging, setIsDragging] = useState<'text' | 'svg' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Apply text changes
  const applyTextChanges = () => {
    setAppliedText({ ...previewText });
  };

  // Layer order manipulation
  const moveLayerUp = (layer: string) => {
    setLayerControls(prev => {
      const currentIndex = prev.layerOrder.indexOf(layer);
      if (currentIndex < prev.layerOrder.length - 1) {
        const newOrder = [...prev.layerOrder];
        [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
        return { ...prev, layerOrder: newOrder };
      }
      return prev;
    });
  };

  const moveLayerDown = (layer: string) => {
    setLayerControls(prev => {
      const currentIndex = prev.layerOrder.indexOf(layer);
      if (currentIndex > 0) {
        const newOrder = [...prev.layerOrder];
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
        return { ...prev, layerOrder: newOrder };
      }
      return prev;
    });
  };

  // Reset positions
  const resetPositions = () => {
    setLayerControls(prev => ({
      ...prev,
      image: { ...prev.image, position: { x: 0, y: 0 } },
      svg: { ...prev.svg, position: { x: 0, y: 0 } },
      text: { ...prev.text, position: { x: 0, y: 0 } }
    }));
  };

  // Mouse handlers for drag positioning
  const handleMouseDown = (e: React.MouseEvent, element: 'text' | 'svg') => {
    e.preventDefault();
    setIsDragging(element);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setLayerControls(prev => ({
      ...prev,
      [isDragging]: {
        ...prev[isDragging as keyof typeof prev],
        position: {
          x: (prev[isDragging as keyof typeof prev] as any).position.x + deltaX,
          y: (prev[isDragging as keyof typeof prev] as any).position.y + deltaY
        }
      }
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Fixed PNG Download with proper layer rendering
  const downloadTemplateAsPNG = async (template: SVGTemplate, format: 'cover' | 'story' = 'cover') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed output dimensions for consistency
    const outputDimensions = format === 'cover' 
      ? { width: 1000, height: 1000 } 
      : { width: 1080, height: 1920 };
    
    canvas.width = outputDimensions.width;
    canvas.height = outputDimensions.height;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderLayer = async (layerType: string) => {
      const layer = layerControls[layerType as keyof typeof layerControls];
      if (typeof layer === 'object' && 'scale' in layer) {
        const scale = layer.scale / 100;
        const opacity = layer.opacity / 100;
        const pos = layer.position;

        if (layerType === 'image') {
          // Background image - centered and scaled for 1:1 format
          const bgImage = new Image();
          bgImage.crossOrigin = 'anonymous';
          
          return new Promise<void>((resolve) => {
            bgImage.onload = () => {
              ctx.globalAlpha = opacity;
              const scaledWidth = canvas.width * scale;
              const scaledHeight = canvas.height * scale;
              const x = (canvas.width - scaledWidth) / 2 + pos.x;
              const y = (canvas.height - scaledHeight) / 2 + pos.y;
              ctx.drawImage(bgImage, x, y, scaledWidth, scaledHeight);
              resolve();
            };
            bgImage.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&h=1000&fit=crop';
          });
        } else if (layerType === 'svg') {
          // SVG layer with typography applied
          let processedSvg = template.svgContent
            .replace(/\{\{artistName\}\}/g, appliedText.artistName)
            .replace(/\{\{albumName\}\}/g, appliedText.albumName);

          // Apply typography settings
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(processedSvg, 'image/svg+xml');
          const textElements = svgDoc.querySelectorAll('text');
          
          textElements.forEach((textEl) => {
            const text = textEl.textContent || '';
            const isArtistName = text.includes(appliedText.artistName);
            const fontConfig = isArtistName ? template.fontProperties.artistFont : template.fontProperties.albumFont;
            
            textEl.setAttribute('font-family', fontConfig.family);
            textEl.setAttribute('font-weight', fontConfig.weight.toString());
            textEl.setAttribute('font-size', fontConfig.size.default.toString());
            textEl.setAttribute('fill', fontConfig.color);
            textEl.setAttribute('opacity', (fontConfig.opacity.default / 100).toString());
            
            if (fontConfig.strokeWidth > 0) {
              textEl.setAttribute('stroke', fontConfig.strokeColor);
              textEl.setAttribute('stroke-width', fontConfig.strokeWidth.toString());
            }
          });

          processedSvg = new XMLSerializer().serializeToString(svgDoc);

          const svgBlob = new Blob([processedSvg], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);
          const svgImage = new Image();

          return new Promise<void>((resolve) => {
            svgImage.onload = () => {
              ctx.globalAlpha = opacity;
              const scaledWidth = canvas.width * scale;
              const scaledHeight = canvas.height * scale;
              const x = (canvas.width - scaledWidth) / 2 + pos.x;
              const y = (canvas.height - scaledHeight) / 2 + pos.y;
              ctx.drawImage(svgImage, x, y, scaledWidth, scaledHeight);
              URL.revokeObjectURL(svgUrl);
              resolve();
            };
            svgImage.src = svgUrl;
          });
        } else if (layerType === 'text') {
          // Text layer with full typography control
          const typography = template.fontProperties;
          ctx.globalAlpha = opacity;
          
          // Artist name
          ctx.font = `${typography.artistFont.weight} ${typography.artistFont.size.default * scale}px ${typography.artistFont.family}`;
          ctx.fillStyle = typography.artistFont.color;
          ctx.textAlign = 'center';
          const artistY = canvas.height / 2 - 50 + pos.y;
          ctx.fillText(appliedText.artistName, canvas.width / 2 + pos.x, artistY);
          
          // Album name
          ctx.font = `${typography.albumFont.weight} ${typography.albumFont.size.default * scale}px ${typography.albumFont.family}`;
          ctx.fillStyle = typography.albumFont.color;
          const albumY = canvas.height / 2 + 50 + pos.y;
          ctx.fillText(appliedText.albumName, canvas.width / 2 + pos.x, albumY);
        }
      }
    };

    // Render layers in order
    for (const layerType of layerControls.layerOrder) {
      await renderLayer(layerType);
    }

    // Reset alpha and download
    ctx.globalAlpha = 1;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name}-${format}-${appliedText.artistName}-${appliedText.albumName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const { data: templates = [], isLoading } = useQuery<SVGTemplate[]>({
    queryKey: ['/api/admin/templates'],
  });

  const createMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest('/api/admin/templates', 'POST', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template created successfully!" });
      setIsEditing(false);
      setSelectedTemplate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, templateData }: { id: string; templateData: any }) => {
      return await apiRequest(`/api/admin/templates/${id}`, 'PUT', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template updated successfully!" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/templates/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template deleted successfully!" });
      setSelectedTemplate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      
      // Create new template with all required properties
      const newTemplate = {
        name: file.name.replace('.svg', ''),
        category: 'modern',
        svgContent,
        isActive: true,
        fontProperties: {
          artistFont: {
            family: 'Arial',
            weight: 700,
            size: { min: 12, max: 72, default: 24 },
            color: '#ffffff',
            opacity: { min: 0, max: 100, default: 100 },
            position: { x: 0, y: 0 },
            rotation: 0,
            letterSpacing: 0,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            textAlign: 'center',
            strokeWidth: 0,
            strokeColor: '#000000'
          },
          albumFont: {
            family: 'Arial',
            weight: 400,
            size: { min: 10, max: 48, default: 18 },
            color: '#ffffff',
            opacity: { min: 0, max: 100, default: 100 },
            position: { x: 0, y: 0 },
            rotation: 0,
            letterSpacing: 0,
            lineHeight: 1.2,
            textTransform: 'none',
            textAlign: 'center',
            strokeWidth: 0,
            strokeColor: '#000000'
          }
        },
        layoutProperties: {
          canvasSize: { width: 1000, height: 1000 },
          shapes: [],
          overlays: []
        },
        filterProperties: {
          blur: { enabled: false, radius: 0 },
          brightness: { enabled: false, value: 100 },
          contrast: { enabled: false, value: 100 },
          saturation: { enabled: false, value: 100 },
          hue: { enabled: false, rotation: 0 }
        },
        renderingFormats: {
          cover: { width: 1000, height: 1000, quality: 'high' },
          story: { width: 1080, height: 1920, quality: 'high' },
          social: { width: 1200, height: 630, quality: 'medium' }
        }
      };

      createMutation.mutate(newTemplate);
    };

    reader.readAsText(file);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Manager</h1>
          <p className="text-gray-600">Create and manage SVG templates with advanced controls</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Templates
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload SVG
                </Button>
              </CardTitle>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMutation.mutate(template.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Live Preview
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === 'cover' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('cover')}
                  >
                    1:1 Cover
                  </Button>
                  <Button
                    variant={previewMode === 'story' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('story')}
                  >
                    9:16 Story
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  {/* Preview Container */}
                  <div 
                    className={`relative border-2 border-dashed border-gray-300 bg-white overflow-hidden ${
                      previewMode === 'cover' ? 'aspect-square' : 'aspect-[9/16]'
                    }`}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {/* Render layers in order */}
                    {layerControls.layerOrder.map((layerType) => {
                      const layer = layerControls[layerType as keyof typeof layerControls];
                      if (typeof layer === 'object' && 'scale' in layer) {
                        if (layerType === 'image') {
                          return (
                            <div
                              key={layerType}
                              className="absolute inset-0"
                              style={{
                                backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: `translate(${layer.position.x}px, ${layer.position.y}px) scale(${layer.scale / 100})`,
                                opacity: layer.opacity / 100,
                                transformOrigin: 'center center'
                              }}
                            />
                          );
                        } else if (layerType === 'svg') {
                          return (
                            <div
                              key={layerType}
                              className="absolute inset-0 cursor-move"
                              onMouseDown={(e) => handleMouseDown(e, 'svg')}
                              style={{
                                transform: `translate(${layer.position.x}px, ${layer.position.y}px) scale(${layer.scale / 100})`,
                                opacity: layer.opacity / 100,
                                transformOrigin: 'center center'
                              }}
                            >
                              <SvgPreview
                                svgContent={selectedTemplate.svgContent}
                                artistName={appliedText.artistName}
                                albumName={appliedText.albumName}
                                typography={selectedTemplate.fontProperties}
                              />
                            </div>
                          );
                        } else if (layerType === 'text') {
                          return (
                            <div
                              key={layerType}
                              className="absolute inset-0 cursor-move"
                              onMouseDown={(e) => handleMouseDown(e, 'text')}
                            >
                              <TextLayer
                                artistName={appliedText.artistName}
                                albumName={appliedText.albumName}
                                typography={selectedTemplate.fontProperties}
                                position={layer.position}
                                scale={layer.scale / 100}
                                opacity={layer.opacity / 100}
                              />
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>

                  {/* Quick Text Controls */}
                  <div className="space-y-3">
                    <div>
                      <Label>Artist Name</Label>
                      <Input
                        value={previewText.artistName}
                        onChange={(e) => setPreviewText(prev => ({ ...prev, artistName: e.target.value }))}
                        placeholder="Artist Name"
                      />
                    </div>
                    <div>
                      <Label>Album Name</Label>
                      <Input
                        value={previewText.albumName}
                        onChange={(e) => setPreviewText(prev => ({ ...prev, albumName: e.target.value }))}
                        placeholder="Album Name"
                      />
                    </div>
                    <Button onClick={applyTextChanges} className="w-full">
                      Apply Text Changes
                    </Button>
                  </div>

                  {/* Download Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'cover')}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download 1:1 Cover
                    </Button>
                    <Button
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'story')}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download 9:16 Story
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a template to preview
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Layer Controls</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <Tabs defaultValue="layers" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="layers">
                      <Settings className="w-4 h-4 mr-2" />
                      Layers
                    </TabsTrigger>
                    <TabsTrigger value="typography">
                      <Type className="w-4 h-4 mr-2" />
                      Typography
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="layers" className="space-y-4 mt-6">
                    {/* Layer Order */}
                    <div>
                      <h4 className="font-medium mb-3">Layer Order (Bottom to Top)</h4>
                      <div className="space-y-2">
                        {layerControls.layerOrder.map((layer, index) => (
                          <div key={layer} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="capitalize font-medium">{layer}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveLayerUp(layer)}
                                disabled={index === layerControls.layerOrder.length - 1}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => moveLayerDown(layer)}
                                disabled={index === 0}
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Layer Controls */}
                    {['image', 'svg', 'text'].map((layerType) => {
                      const layer = layerControls[layerType as keyof typeof layerControls];
                      if (typeof layer === 'object' && 'scale' in layer) {
                        return (
                          <div key={layerType}>
                            <h5 className="font-medium mb-3 capitalize">{layerType} Controls</h5>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-sm">Scale: {layer.scale}%</Label>
                                <Slider
                                  value={[layer.scale]}
                                  onValueChange={(value) => 
                                    setLayerControls(prev => ({
                                      ...prev,
                                      [layerType]: { ...prev[layerType as keyof typeof prev.image], scale: value[0] }
                                    }))
                                  }
                                  min={10}
                                  max={300}
                                  step={5}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label className="text-sm">Opacity: {layer.opacity}%</Label>
                                <Slider
                                  value={[layer.opacity]}
                                  onValueChange={(value) => 
                                    setLayerControls(prev => ({
                                      ...prev,
                                      [layerType]: { ...prev[layerType as keyof typeof prev.image], opacity: value[0] }
                                    }))
                                  }
                                  min={0}
                                  max={100}
                                  step={5}
                                  className="mt-2"
                                />
                              </div>
                              <div className="text-sm text-gray-600">
                                Position: X: {layer.position.x}px, Y: {layer.position.y}px
                                {layerType !== 'image' && <span className="block">Drag in preview to adjust</span>}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}

                    {/* Reset Button */}
                    <Button onClick={resetPositions} variant="outline" className="w-full">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset All Positions
                    </Button>
                  </TabsContent>

                  <TabsContent value="typography" className="space-y-4 mt-6">
                    <div className="text-center text-gray-600">
                      Typography controls for font family, size, color, and styling properties
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a template to configure
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}