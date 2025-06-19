import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Download, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, X, Move, RotateCcw, Undo, Redo, GripVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface SVGTemplate {
  id: number;
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
  filterProperties: any;
  renderingFormats: any;
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

export default function AdminComplete() {
  const [selectedTemplate, setSelectedTemplate] = useState<SVGTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  
  // Enhanced typography controls with advanced styling
  const [typography, setTypography] = useState({
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
      // Enhanced properties
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
      fontStyle: 'normal' as const,
      verticalAlign: 'middle' as const
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
      // Enhanced properties
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
      fontStyle: 'normal' as const,
      verticalAlign: 'middle' as const
    }
  });

  // Enhanced layer controls with Cover/Story separation
  const [layerControls, setLayerControls] = useState<LayerControls>({
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
  });

  const [activeFormat, setActiveFormat] = useState<'cover' | 'story'>('cover');
  const [draggedLayer, setDraggedLayer] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [previewZoom, setPreviewZoom] = useState(1);
  const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);
  
  // Undo/Redo state
  const [historyState, setHistoryState] = useState<{
    past: any[];
    present: any;
    future: any[];
  }>({
    past: [],
    present: typography,
    future: []
  });

  // Drag and drop for layer ordering
  const [draggedLayerIndex, setDraggedLayerIndex] = useState<number | null>(null);
  const [editingNumericField, setEditingNumericField] = useState<string | null>(null);
  const [dragInfo, setDragInfo] = useState<{
    isDragging: boolean;
    dragType: string | null;
    startPos: { x: number; y: number };
    startTransform: { x: number; y: number };
  }>({
    isDragging: false,
    dragType: null,
    startPos: { x: 0, y: 0 },
    startTransform: { x: 0, y: 0 }
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load templates
  const { data: templates = [], isLoading } = useQuery<SVGTemplate[]>({
    queryKey: ['/api/admin/templates'],
  });

  // Create template mutation
  const createMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest('/api/admin/templates', 'POST', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template created successfully!" });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error creating template", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Update template mutation
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
        variant: "destructive" 
      });
    },
  });

  // Delete template mutation
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
        variant: "destructive" 
      });
    },
  });

  // Handle SVG file upload
  const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes('svg')) {
      toast({ 
        title: "Invalid file", 
        description: "Please select an SVG file",
        variant: "destructive" 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      
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

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast({ 
        title: "Invalid file", 
        description: "Please select an image file",
        variant: "destructive" 
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reset layer positions
  const resetLayerPositions = () => {
    setLayerControls(prev => ({
      ...prev,
      image: { ...prev.image, position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } } },
      svg: { ...prev.svg, position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } } },
      artist: { ...prev.artist, position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } } },
      album: { ...prev.album, position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } } }
    }));
  };

  // Layer order management
  const moveLayer = (layerType: string, direction: 'up' | 'down') => {
    setLayerControls(prev => {
      const currentOrder = [...prev.layerOrder];
      const currentIndex = currentOrder.indexOf(layerType);
      
      if (direction === 'up' && currentIndex > 0) {
        [currentOrder[currentIndex], currentOrder[currentIndex - 1]] = 
        [currentOrder[currentIndex - 1], currentOrder[currentIndex]];
      } else if (direction === 'down' && currentIndex < currentOrder.length - 1) {
        [currentOrder[currentIndex], currentOrder[currentIndex + 1]] = 
        [currentOrder[currentIndex + 1], currentOrder[currentIndex]];
      }
      
      return { ...prev, layerOrder: currentOrder };
    });
  };

  // Toggle layer visibility
  const toggleLayerVisibility = (layerType: keyof LayerControls) => {
    if (layerType === 'layerOrder') return;
    setLayerControls(prev => ({
      ...prev,
      [layerType]: { ...prev[layerType], hidden: !prev[layerType].hidden }
    }));
  };

  // Toggle layer lock
  const toggleLayerLock = (layerType: keyof LayerControls) => {
    if (layerType === 'layerOrder') return;
    setLayerControls(prev => ({
      ...prev,
      [layerType]: { ...prev[layerType], locked: !prev[layerType].locked }
    }));
  };

  // Mouse drag handlers for repositioning
  const handleMouseDown = (e: React.MouseEvent, layerType: string) => {
    const layer = layerControls[layerType as keyof LayerControls];
    if (typeof layer === 'object' && 'locked' in layer && layer.locked) return;
    
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDraggedLayer(layerType);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedLayer || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    
    setLayerControls(prev => ({
      ...prev,
      [draggedLayer]: {
        ...prev[draggedLayer as keyof LayerControls],
        position: {
          ...prev[draggedLayer as keyof LayerControls].position,
          [activeFormat]: { x: newX, y: newY }
        }
      }
    }));
  }, [draggedLayer, dragOffset, activeFormat]);

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

  // Download functionality with faithful rendering
  const downloadTemplateAsPNG = async (template: SVGTemplate, format: 'cover' | 'story' = 'cover') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on format
    if (format === 'cover') {
      canvas.width = 1000;
      canvas.height = 1000;
    } else {
      canvas.width = 1080;
      canvas.height = 1920;
    }

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderLayer = async (layerType: string) => {
      const layer = layerControls[layerType as keyof LayerControls];
      if (typeof layer !== 'object' || !('hidden' in layer) || layer.hidden) return;

      const scale = layer.scale[format] / 100;
      const position = layer.position[format];
      
      ctx.globalAlpha = layer.opacity / 100;

      if (layerType === 'image' && uploadedImage) {
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.save();
            ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
            ctx.scale(scale, scale);
            
            const size = Math.min(canvas.width, canvas.height) * 0.8;
            ctx.drawImage(img, -size / 2, -size / 2, size, size);
            ctx.restore();
            resolve(null);
          };
          img.src = uploadedImage;
        });
      } else if (layerType === 'svg') {
        const svgImg = new Image();
        await new Promise((resolve) => {
          svgImg.onload = () => {
            ctx.save();
            ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
            ctx.scale(scale, scale);
            ctx.drawImage(svgImg, -250, -250, 500, 500);
            ctx.restore();
            resolve(null);
          };
          const svgBlob = new Blob([template.svgContent], { type: 'image/svg+xml' });
          svgImg.src = URL.createObjectURL(svgBlob);
        });
      } else if (layerType === 'artist' || layerType === 'album') {
        const fontConfig = layerType === 'artist' ? typography.artistFont : typography.albumFont;
        const text = layerType === 'artist' ? typography.artistName : typography.albumName;
        
        ctx.save();
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
        ctx.scale(scale, scale);
        
        // Apply text transformations
        const transformedText = fontConfig.textTransform === 'uppercase' ? text.toUpperCase() :
                               fontConfig.textTransform === 'lowercase' ? text.toLowerCase() :
                               fontConfig.textTransform === 'capitalize' ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() :
                               text;
        
        // Set up font with enhanced properties
        let fontString = '';
        if (fontConfig.fontStyle && fontConfig.fontStyle !== 'normal') {
          fontString += fontConfig.fontStyle + ' ';
        }
        fontString += `${fontConfig.weight} ${fontConfig.size}px ${fontConfig.family}`;
        ctx.font = fontString;
        
        // Set text alignment and baseline
        ctx.textAlign = fontConfig.textAlign;
        ctx.textBaseline = 'middle';
        
        const offsetY = layerType === 'artist' ? -30 : 30;
        
        // Apply rotation and skew transformations
        if (fontConfig.rotation !== 0 || fontConfig.skewX !== 0 || fontConfig.skewY !== 0) {
          const radRotation = (fontConfig.rotation * Math.PI) / 180;
          const skewXRad = (fontConfig.skewX * Math.PI) / 180;
          const skewYRad = (fontConfig.skewY * Math.PI) / 180;
          
          ctx.transform(
            Math.cos(radRotation) + Math.tan(skewYRad) * Math.sin(radRotation),
            Math.sin(radRotation) + Math.tan(skewYRad) * Math.cos(radRotation),
            Math.tan(skewXRad) * Math.cos(radRotation) - Math.sin(radRotation),
            Math.tan(skewXRad) * Math.sin(radRotation) + Math.cos(radRotation),
            0,
            0
          );
        }
        
        // Apply text shadow
        if (fontConfig.shadowBlur > 0 || fontConfig.shadowOffsetX !== 0 || fontConfig.shadowOffsetY !== 0) {
          ctx.shadowColor = fontConfig.shadowColor;
          ctx.shadowBlur = fontConfig.shadowBlur;
          ctx.shadowOffsetX = fontConfig.shadowOffsetX;
          ctx.shadowOffsetY = fontConfig.shadowOffsetY;
        }
        
        // Draw background if enabled
        if (fontConfig.backgroundOpacity > 0) {
          const metrics = ctx.measureText(transformedText);
          const textWidth = metrics.width;
          const textHeight = fontConfig.size;
          
          ctx.fillStyle = `${fontConfig.backgroundColor}${Math.round(fontConfig.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`;
          
          const padding = fontConfig.padding;
          const bgX = -(textWidth / 2) - padding;
          const bgY = offsetY - (textHeight / 2) - padding;
          const bgWidth = textWidth + (padding * 2);
          const bgHeight = textHeight + (padding * 2);
          
          if (fontConfig.borderRadius > 0) {
            // Draw rounded rectangle
            ctx.beginPath();
            ctx.roundRect(bgX, bgY, bgWidth, bgHeight, fontConfig.borderRadius);
            ctx.fill();
          } else {
            ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
          }
        }
        
        // Draw text outline/stroke
        if (fontConfig.strokeWidth > 0) {
          ctx.strokeStyle = fontConfig.strokeColor;
          ctx.lineWidth = fontConfig.strokeWidth;
          ctx.strokeText(transformedText, 0, offsetY);
        }
        
        if (fontConfig.outlineWidth > 0) {
          ctx.strokeStyle = fontConfig.outlineColor;
          ctx.lineWidth = fontConfig.outlineWidth;
          ctx.strokeText(transformedText, 0, offsetY);
        }
        
        // Draw main text
        if (fontConfig.gradientEnabled) {
          // Create gradient
          const gradient = ctx.createLinearGradient(-100, -100, 100, 100);
          gradient.addColorStop(0, fontConfig.gradientStart);
          gradient.addColorStop(1, fontConfig.gradientEnd);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = fontConfig.color;
        }
        
        ctx.fillText(transformedText, 0, offsetY);
        
        // Handle text decoration (underline, overline, line-through)
        if (fontConfig.textDecoration && fontConfig.textDecoration !== 'none') {
          const metrics = ctx.measureText(transformedText);
          const textWidth = metrics.width;
          
          ctx.strokeStyle = fontConfig.color;
          ctx.lineWidth = Math.max(1, fontConfig.size / 20);
          
          ctx.beginPath();
          if (fontConfig.textDecoration === 'underline') {
            ctx.moveTo(-textWidth / 2, offsetY + fontConfig.size * 0.1);
            ctx.lineTo(textWidth / 2, offsetY + fontConfig.size * 0.1);
          } else if (fontConfig.textDecoration === 'overline') {
            ctx.moveTo(-textWidth / 2, offsetY - fontConfig.size * 0.4);
            ctx.lineTo(textWidth / 2, offsetY - fontConfig.size * 0.4);
          } else if (fontConfig.textDecoration === 'line-through') {
            ctx.moveTo(-textWidth / 2, offsetY - fontConfig.size * 0.1);
            ctx.lineTo(textWidth / 2, offsetY - fontConfig.size * 0.1);
          }
          ctx.stroke();
        }
        
        ctx.restore();
      }
    };

    // Render layers in reverse order (bottom to top)
    for (const layerType of [...layerControls.layerOrder].reverse()) {
      await renderLayer(layerType);
    }

    ctx.globalAlpha = 1;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name}-${format}-${typography.artistName}-${typography.albumName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Preview */}
      <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Preview</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveFormat(activeFormat === 'cover' ? 'story' : 'cover')}
            >
              {activeFormat === 'cover' ? 'Cover (1:1)' : 'Story (9:16)'}
            </Button>
            <Button variant="outline" size="sm" onClick={resetLayerPositions}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {selectedTemplate && (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div 
              ref={previewRef}
              className="relative bg-white border-2 border-gray-200 overflow-hidden cursor-move shadow-lg transition-transform"
              style={{
                width: activeFormat === 'cover' ? '350px' : '210px',
                height: activeFormat === 'cover' ? '350px' : '373px',
                aspectRatio: activeFormat === 'cover' ? '1/1' : '9/16',
                transform: `scale(${previewZoom})`
              }}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                setPreviewZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
              }}
            >
              {/* Render preview layers in order */}
              {[...layerControls.layerOrder].reverse().map((layerType) => {
                const layer = layerControls[layerType as keyof LayerControls];
                if (typeof layer !== 'object' || !('hidden' in layer) || layer.hidden) return null;

                const scale = layer.scale[activeFormat] / 100;
                const position = layer.position[activeFormat];
                const opacity = layer.opacity / 100;

                if (layerType === 'image' && uploadedImage) {
                  return (
                    <div
                      key={layerType}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        opacity
                      }}
                    >
                      <img 
                        src={uploadedImage} 
                        alt="Background"
                        className="w-full h-full object-cover"
                        style={{ maxWidth: '80%', maxHeight: '80%' }}
                      />
                    </div>
                  );
                }

                if (layerType === 'svg') {
                  return (
                    <div
                      key={layerType}
                      className={`absolute inset-0 flex items-center justify-center ${!layer.locked ? 'cursor-move' : 'cursor-not-allowed'}`}
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        opacity
                      }}
                      onMouseDown={(e) => handleMouseDown(e, layerType)}
                      dangerouslySetInnerHTML={{ __html: selectedTemplate.svgContent }}
                    />
                  );
                }

                if (layerType === 'artist' || layerType === 'album') {
                  const fontConfig = layerType === 'artist' ? typography.artistFont : typography.albumFont;
                  const text = layerType === 'artist' ? typography.artistName : typography.albumName;
                  const offsetY = layerType === 'artist' ? -30 : 30;

                  // Create comprehensive text styling
                  const textStyle: React.CSSProperties = {
                    fontFamily: fontConfig.family,
                    fontSize: `${fontConfig.size}px`,
                    fontWeight: fontConfig.weight,
                    fontStyle: fontConfig.fontStyle,
                    color: fontConfig.gradientEnabled 
                      ? 'transparent' 
                      : fontConfig.color,
                    textAlign: fontConfig.textAlign,
                    textTransform: fontConfig.textTransform,
                    textDecoration: fontConfig.textDecoration,
                    letterSpacing: `${fontConfig.letterSpacing}px`,
                    lineHeight: fontConfig.lineHeight,
                    maxWidth: fontConfig.wordWrap ? `${fontConfig.maxWidth}px` : 'none',
                    wordWrap: fontConfig.wordWrap ? 'break-word' : 'normal',
                    userSelect: 'none',
                    pointerEvents: 'none',
                    // Advanced effects
                    transform: `rotate(${fontConfig.rotation}deg) skew(${fontConfig.skewX}deg, ${fontConfig.skewY}deg)`,
                    // Text stroke/outline
                    WebkitTextStroke: fontConfig.strokeWidth > 0 
                      ? `${fontConfig.strokeWidth}px ${fontConfig.strokeColor}` 
                      : 'none',
                    // Text shadow
                    textShadow: fontConfig.shadowBlur > 0 || fontConfig.shadowOffsetX !== 0 || fontConfig.shadowOffsetY !== 0
                      ? `${fontConfig.shadowOffsetX}px ${fontConfig.shadowOffsetY}px ${fontConfig.shadowBlur}px ${fontConfig.shadowColor}`
                      : 'none',
                    // Background styling (only if no gradient)
                    ...(fontConfig.backgroundOpacity > 0 && !fontConfig.gradientEnabled && {
                      backgroundColor: `${fontConfig.backgroundColor}${Math.round(fontConfig.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`
                    }),
                    borderRadius: `${fontConfig.borderRadius}px`,
                    padding: fontConfig.padding > 0 ? `${fontConfig.padding}px` : '0',
                    // Outline effect
                    outline: fontConfig.outlineWidth > 0 
                      ? `${fontConfig.outlineWidth}px solid ${fontConfig.outlineColor}`
                      : 'none',
                    // Gradient text (if enabled)
                    ...(fontConfig.gradientEnabled && {
                      backgroundImage: `linear-gradient(${fontConfig.gradientAngle}deg, ${fontConfig.gradientStart}, ${fontConfig.gradientEnd})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text'
                    })
                  };

                  return (
                    <div
                      key={layerType}
                      className={`absolute inset-0 flex items-center justify-center ${!layer.locked ? 'cursor-move' : 'cursor-not-allowed'}`}
                      style={{
                        transform: `translate(${position.x}px, ${position.y + offsetY}px) scale(${scale})`,
                        opacity
                      }}
                      onMouseDown={(e) => handleMouseDown(e, layerType)}
                    >
                      <span style={textStyle}>
                        {text}
                      </span>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedTemplate && (
          <div className="mt-6 space-y-3">
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  // Generate and download preview image for testing
                  if (selectedTemplate) {
                    downloadTemplateAsPNG(selectedTemplate, 'cover');
                    toast({ title: "Preview downloaded as PNG" });
                  }
                }}
                variant="outline"
                className="flex-1 flex items-center justify-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Button>
              <Button 
                onClick={() => setPreviewZoom(1)}
                variant="outline"
                size="sm"
              >
                {Math.round(previewZoom * 100)}%
              </Button>
            </div>
            <Button 
              onClick={() => downloadTemplateAsPNG(selectedTemplate, 'cover')}
              className="w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Cover (1:1)</span>
            </Button>
            <Button 
              onClick={() => downloadTemplateAsPNG(selectedTemplate, 'story')}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Story (9:16)</span>
            </Button>
          </div>
        )}
      </div>

      {/* Right Panel - Controls */}
      <div className="flex-1 bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Template Manager</h1>
            <Button 
              variant="outline" 
              onClick={() => setIsManagerOpen(!isManagerOpen)}
            >
              {isManagerOpen ? 'Collapse Controls' : 'Expand Controls'}
            </Button>
          </div>

          {isManagerOpen && (
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                  <TabsTrigger value="layers">Layer Controls</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
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
                                <div className="space-y-2">
                                  <div className="text-sm text-gray-600">
                                    Status: {template.isActive ? 'Active' : 'Inactive'}
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
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Text Content</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Artist Name</Label>
                        <Input 
                          value={typography.artistName}
                          onChange={(e) => setTypography(prev => ({ ...prev, artistName: e.target.value }))}
                          className="mt-2"
                          placeholder="Enter artist name"
                        />
                      </div>
                      <div>
                        <Label>Album/Song Name</Label>
                        <Input 
                          value={typography.albumName}
                          onChange={(e) => setTypography(prev => ({ ...prev, albumName: e.target.value }))}
                          className="mt-2"
                          placeholder="Enter album or song name"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {['artist', 'album'].map((textType) => {
                      const fontConfig = typography[`${textType}Font` as keyof typeof typography];
                      return (
                        <Card key={textType}>
                          <CardHeader>
                            <CardTitle className="capitalize">{textType} Typography Settings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Basic Font Properties */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Basic Properties</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Font Family</Label>
                                  <Select 
                                    value={fontConfig.family}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], family: value }
                                    }))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Arial">Arial</SelectItem>
                                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                      <SelectItem value="Georgia">Georgia</SelectItem>
                                      <SelectItem value="Verdana">Verdana</SelectItem>
                                      <SelectItem value="Impact">Impact</SelectItem>
                                      <SelectItem value="Courier New">Courier New</SelectItem>
                                      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
                                      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
                                      <SelectItem value="Palatino">Palatino</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Font Style</Label>
                                  <Select 
                                    value={fontConfig.fontStyle}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], fontStyle: value }
                                    }))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="normal">Normal</SelectItem>
                                      <SelectItem value="italic">Italic</SelectItem>
                                      <SelectItem value="oblique">Oblique</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Size: {fontConfig.size}px</Label>
                                  <Slider
                                    value={[fontConfig.size]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], size: value[0] }
                                    }))}
                                    min={8}
                                    max={120}
                                    step={1}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Weight: {fontConfig.weight}</Label>
                                  <Slider
                                    value={[fontConfig.weight]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], weight: value[0] }
                                    }))}
                                    min={100}
                                    max={900}
                                    step={100}
                                    className="mt-2"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label>Text Color</Label>
                                  <Input 
                                    type="color"
                                    value={fontConfig.color}
                                    onChange={(e) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], color: e.target.value }
                                    }))}
                                    className="mt-1 h-8"
                                  />
                                </div>

                                <div>
                                  <Label>Text Transform</Label>
                                  <Select 
                                    value={fontConfig.textTransform}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], textTransform: value }
                                    }))}
                                  >
                                    <SelectTrigger className="mt-1">
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
                                  <Label>Text Align</Label>
                                  <Select 
                                    value={fontConfig.textAlign}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], textAlign: value }
                                    }))}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Advanced Typography */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Advanced Typography</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Letter Spacing: {fontConfig.letterSpacing}px</Label>
                                  <Slider
                                    value={[fontConfig.letterSpacing]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], letterSpacing: value[0] }
                                    }))}
                                    min={-5}
                                    max={20}
                                    step={0.5}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Line Height: {fontConfig.lineHeight}</Label>
                                  <Slider
                                    value={[fontConfig.lineHeight]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], lineHeight: value[0] }
                                    }))}
                                    min={0.5}
                                    max={3}
                                    step={0.1}
                                    className="mt-2"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Text Decoration</Label>
                                <Select 
                                  value={fontConfig.textDecoration}
                                  onValueChange={(value) => setTypography(prev => ({
                                    ...prev,
                                    [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], textDecoration: value }
                                  }))}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="underline">Underline</SelectItem>
                                    <SelectItem value="overline">Overline</SelectItem>
                                    <SelectItem value="line-through">Line Through</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <Separator />

                            {/* Transform Effects */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Transform Effects</h4>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label>Rotation: {fontConfig.rotation}°</Label>
                                  <Slider
                                    value={[fontConfig.rotation]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], rotation: value[0] }
                                    }))}
                                    min={-180}
                                    max={180}
                                    step={1}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Skew X: {fontConfig.skewX}°</Label>
                                  <Slider
                                    value={[fontConfig.skewX]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], skewX: value[0] }
                                    }))}
                                    min={-45}
                                    max={45}
                                    step={1}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Skew Y: {fontConfig.skewY}°</Label>
                                  <Slider
                                    value={[fontConfig.skewY]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], skewY: value[0] }
                                    }))}
                                    min={-45}
                                    max={45}
                                    step={1}
                                    className="mt-2"
                                  />
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Text Effects */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Text Effects</h4>
                              
                              {/* Stroke/Outline */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Stroke Width: {fontConfig.strokeWidth}px</Label>
                                  <Slider
                                    value={[fontConfig.strokeWidth]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], strokeWidth: value[0] }
                                    }))}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Stroke Color</Label>
                                  <Input 
                                    type="color"
                                    value={fontConfig.strokeColor}
                                    onChange={(e) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], strokeColor: e.target.value }
                                    }))}
                                    className="mt-2 h-8"
                                  />
                                </div>
                              </div>

                              {/* Outline */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Outline Width: {fontConfig.outlineWidth}px</Label>
                                  <Slider
                                    value={[fontConfig.outlineWidth]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], outlineWidth: value[0] }
                                    }))}
                                    min={0}
                                    max={10}
                                    step={0.5}
                                    className="mt-2"
                                  />
                                </div>

                                <div>
                                  <Label>Outline Color</Label>
                                  <Input 
                                    type="color"
                                    value={fontConfig.outlineColor}
                                    onChange={(e) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], outlineColor: e.target.value }
                                    }))}
                                    className="mt-2 h-8"
                                  />
                                </div>
                              </div>

                              {/* Shadow */}
                              <div className="space-y-3">
                                <Label>Text Shadow</Label>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs">Blur: {fontConfig.shadowBlur}px</Label>
                                    <Slider
                                      value={[fontConfig.shadowBlur]}
                                      onValueChange={(value) => setTypography(prev => ({
                                        ...prev,
                                        [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], shadowBlur: value[0] }
                                      }))}
                                      min={0}
                                      max={20}
                                      step={1}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">Shadow Color</Label>
                                    <Input 
                                      type="color"
                                      value={fontConfig.shadowColor}
                                      onChange={(e) => setTypography(prev => ({
                                        ...prev,
                                        [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], shadowColor: e.target.value }
                                      }))}
                                      className="mt-1 h-8"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs">Offset X: {fontConfig.shadowOffsetX}px</Label>
                                    <Slider
                                      value={[fontConfig.shadowOffsetX]}
                                      onValueChange={(value) => setTypography(prev => ({
                                        ...prev,
                                        [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], shadowOffsetX: value[0] }
                                      }))}
                                      min={-20}
                                      max={20}
                                      step={1}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-xs">Offset Y: {fontConfig.shadowOffsetY}px</Label>
                                    <Slider
                                      value={[fontConfig.shadowOffsetY]}
                                      onValueChange={(value) => setTypography(prev => ({
                                        ...prev,
                                        [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], shadowOffsetY: value[0] }
                                      }))}
                                      min={-20}
                                      max={20}
                                      step={1}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Separator />

                            {/* Gradient Fill */}
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`gradient-${textType}`}
                                  checked={fontConfig.gradientEnabled}
                                  onCheckedChange={(checked) => setTypography(prev => ({
                                    ...prev,
                                    [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], gradientEnabled: !!checked }
                                  }))}
                                />
                                <Label htmlFor={`gradient-${textType}`} className="font-medium text-sm">
                                  Enable Gradient Fill
                                </Label>
                              </div>

                              {fontConfig.gradientEnabled && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs">Start Color</Label>
                                      <Input 
                                        type="color"
                                        value={fontConfig.gradientStart}
                                        onChange={(e) => setTypography(prev => ({
                                          ...prev,
                                          [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], gradientStart: e.target.value }
                                        }))}
                                        className="mt-1 h-8"
                                      />
                                    </div>

                                    <div>
                                      <Label className="text-xs">End Color</Label>
                                      <Input 
                                        type="color"
                                        value={fontConfig.gradientEnd}
                                        onChange={(e) => setTypography(prev => ({
                                          ...prev,
                                          [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], gradientEnd: e.target.value }
                                        }))}
                                        className="mt-1 h-8"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs">Gradient Angle: {fontConfig.gradientAngle}°</Label>
                                    <Slider
                                      value={[fontConfig.gradientAngle]}
                                      onValueChange={(value) => setTypography(prev => ({
                                        ...prev,
                                        [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], gradientAngle: value[0] }
                                      }))}
                                      min={0}
                                      max={360}
                                      step={1}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <Separator />

                            {/* Background */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Text Background</h4>
                              
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-xs">Background</Label>
                                  <Input 
                                    type="color"
                                    value={fontConfig.backgroundColor}
                                    onChange={(e) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], backgroundColor: e.target.value }
                                    }))}
                                    className="mt-1 h-8"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs">Opacity: {fontConfig.backgroundOpacity}%</Label>
                                  <Slider
                                    value={[fontConfig.backgroundOpacity]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], backgroundOpacity: value[0] }
                                    }))}
                                    min={0}
                                    max={100}
                                    step={5}
                                    className="mt-1"
                                  />
                                </div>

                                <div>
                                  <Label className="text-xs">Border Radius: {fontConfig.borderRadius}px</Label>
                                  <Slider
                                    value={[fontConfig.borderRadius]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], borderRadius: value[0] }
                                    }))}
                                    min={0}
                                    max={50}
                                    step={1}
                                    className="mt-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-xs">Padding: {fontConfig.padding}px</Label>
                                <Slider
                                  value={[fontConfig.padding]}
                                  onValueChange={(value) => setTypography(prev => ({
                                    ...prev,
                                    [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], padding: value[0] }
                                  }))}
                                  min={0}
                                  max={50}
                                  step={1}
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <Separator />

                            {/* Layout Controls */}
                            <div className="space-y-4">
                              <h4 className="font-medium text-sm text-gray-700">Layout & Wrapping</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs">Max Width: {fontConfig.maxWidth}px</Label>
                                  <Slider
                                    value={[fontConfig.maxWidth]}
                                    onValueChange={(value) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], maxWidth: value[0] }
                                    }))}
                                    min={50}
                                    max={800}
                                    step={10}
                                    className="mt-1"
                                  />
                                </div>

                                <div className="flex items-center space-x-2 mt-6">
                                  <Checkbox
                                    id={`wrap-${textType}`}
                                    checked={fontConfig.wordWrap}
                                    onCheckedChange={(checked) => setTypography(prev => ({
                                      ...prev,
                                      [`${textType}Font`]: { ...prev[`${textType}Font` as keyof typeof typography], wordWrap: !!checked }
                                    }))}
                                  />
                                  <Label htmlFor={`wrap-${textType}`} className="text-xs">
                                    Enable Word Wrap
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="layers" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Layer Management</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActiveFormat(activeFormat === 'cover' ? 'story' : 'cover')}
                      >
                        Format: {activeFormat === 'cover' ? 'Cover (1:1)' : 'Story (9:16)'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetLayerPositions}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Positions
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Layer Order (Top to Bottom)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">Drag layers to reorder</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              // Basic undo functionality - reset to default layer order
                              setLayerControls(prev => ({
                                ...prev,
                                layerOrder: ['image', 'svg', 'artist', 'album']
                              }));
                              toast({ title: "Layers reset to default order" });
                            }}
                          >
                            <Undo className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onDoubleClick={() => {
                              // Reset all layers to defaults
                              setLayerControls({
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
                              });
                              toast({ title: "All layers reset to defaults" });
                            }}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {layerControls.layerOrder.map((layerType, index) => {
                          const layer = layerControls[layerType as keyof LayerControls];
                          if (typeof layer !== 'object' || !('hidden' in layer)) return null;
                          
                          return (
                            <div 
                              key={layerType} 
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-move transition-all hover:shadow-md ${
                                draggedLayerIndex === index ? 'opacity-50 scale-95 shadow-lg' : ''
                              } ${layer.locked ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                              draggable={!layer.locked}
                              onDragStart={(e) => {
                                if (!layer.locked) {
                                  setDraggedLayerIndex(index);
                                  e.dataTransfer.effectAllowed = 'move';
                                }
                              }}
                              onDragEnd={() => setDraggedLayerIndex(null)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedLayerIndex !== null && draggedLayerIndex !== index && !layer.locked) {
                                  const newOrder = [...layerControls.layerOrder];
                                  const draggedItem = newOrder[draggedLayerIndex];
                                  newOrder.splice(draggedLayerIndex, 1);
                                  newOrder.splice(index, 0, draggedItem);
                                  
                                  setLayerControls(prev => ({
                                    ...prev,
                                    layerOrder: newOrder
                                  }));
                                  toast({ title: `Moved ${draggedItem} layer` });
                                }
                                setDraggedLayerIndex(null);
                              }}
                            >
                              <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                <span className="font-medium capitalize">{layerType}</span>
                                <div className="flex items-center space-x-1">
                                  {layer.hidden && <EyeOff className="w-3 h-3 text-gray-400" />}
                                  {layer.locked && <Lock className="w-3 h-3 text-red-400" />}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => toggleLayerVisibility(layerType as keyof LayerControls)}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  title={layer.hidden ? "Show layer" : "Hide layer"}
                                >
                                  {layer.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => toggleLayerLock(layerType as keyof LayerControls)}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  title={layer.locked ? "Unlock layer" : "Lock layer"}
                                >
                                  {layer.locked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4" />}
                                </button>
                                <button
                                  onDoubleClick={() => {
                                    // Reset individual layer to defaults
                                    setLayerControls(prev => ({
                                      ...prev,
                                      [layerType]: {
                                        scale: { cover: 100, story: 100 },
                                        opacity: 100,
                                        position: { cover: { x: 0, y: 0 }, story: { x: 0, y: 0 } },
                                        hidden: false,
                                        locked: false
                                      }
                                    }));
                                    toast({ title: `${layerType} layer reset to defaults` });
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                  title="Double-click to reset layer"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {['image', 'svg', 'artist', 'album'].map((layerType) => {
                      const layer = layerControls[layerType as keyof LayerControls];
                      if (typeof layer !== 'object' || !('scale' in layer)) return null;
                      
                      return (
                        <Card key={layerType}>
                          <CardHeader>
                            <CardTitle className="capitalize">{layerType} Controls</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label>Scale ({activeFormat}): {layer.scale[activeFormat]}%</Label>
                              <Slider
                                value={[layer.scale[activeFormat]]}
                                onValueChange={(value) => 
                                  setLayerControls(prev => ({
                                    ...prev,
                                    [layerType]: { 
                                      ...prev[layerType as keyof LayerControls], 
                                      scale: { 
                                        ...prev[layerType as keyof LayerControls].scale, 
                                        [activeFormat]: value[0] 
                                      }
                                    }
                                  }))
                                }
                                min={10}
                                max={300}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            
                            <div>
                              <Label>Opacity: {layer.opacity}%</Label>
                              <Slider
                                value={[layer.opacity]}
                                onValueChange={(value) => 
                                  setLayerControls(prev => ({
                                    ...prev,
                                    [layerType]: { ...prev[layerType as keyof LayerControls], opacity: value[0] }
                                  }))
                                }
                                min={0}
                                max={100}
                                step={5}
                                className="mt-2"
                              />
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <div>Position ({activeFormat}):</div>
                              <div>X: {layer.position[activeFormat].x}px, Y: {layer.position[activeFormat].y}px</div>
                              {layerType !== 'image' && (
                                <div className="flex items-center mt-1">
                                  <Move className="w-3 h-3 mr-1" />
                                  <span>Drag in preview to adjust</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Download Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedTemplate && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            onClick={() => downloadTemplateAsPNG(selectedTemplate, 'cover')}
                            className="flex items-center space-x-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Cover (1:1)</span>
                          </Button>
                          <Button 
                            onClick={() => downloadTemplateAsPNG(selectedTemplate, 'story')}
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
          )}
        </div>
      </div>

    </div>
  );
}