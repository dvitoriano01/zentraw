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
  Palette, 
  Filter,
  Layout,
  Download,
  X
} from 'lucide-react';

// SVG Preview Component for proper text rendering
interface SvgPreviewProps {
  svgContent: string;
  artistName: string;
  albumName: string;
}

function SvgPreview({ svgContent, artistName, albumName }: SvgPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !svgContent) return;
    
    console.log('SVG Preview - Processing:', { artistName, albumName });
    console.log('Original SVG contains artistName placeholder:', svgContent.includes('{{artistName}}'));
    console.log('Original SVG contains albumName placeholder:', svgContent.includes('{{albumName}}'));
    
    try {
      // Replace all possible placeholder patterns
      let processedSvg = svgContent
        .replace(/\{\{artistName\}\}/g, artistName || 'Artist Name')
        .replace(/\{\{albumName\}\}/g, albumName || 'Album Name')
        .replace(/\{\{ARTIST_NAME\}\}/g, artistName || 'Artist Name')
        .replace(/\{\{ALBUM_NAME\}\}/g, albumName || 'Album Name');
      
      console.log('After replacement - contains artistName placeholder:', processedSvg.includes('{{artistName}}'));
      console.log('After replacement - contains albumName placeholder:', processedSvg.includes('{{albumName}}'));
      
      // Set the processed SVG
      containerRef.current.innerHTML = processedSvg;
      
      // Additional DOM-based text replacement for better reliability
      const textElements = containerRef.current.querySelectorAll('text');
      textElements.forEach((textEl) => {
        const currentText = textEl.textContent || '';
        if (currentText.includes('{{')) {
          let newText = currentText
            .replace(/\{\{artistName\}\}/g, artistName || 'Artist Name')
            .replace(/\{\{albumName\}\}/g, albumName || 'Album Name')
            .replace(/\{\{ARTIST_NAME\}\}/g, artistName || 'Artist Name')
            .replace(/\{\{ALBUM_NAME\}\}/g, albumName || 'Album Name');
          
          console.log('Text replacement:', currentText, '->', newText);
          textEl.textContent = newText;
        }
      });
      
      console.log('SVG successfully processed and rendered');
      
    } catch (error) {
      console.error('Error processing SVG:', error);
      containerRef.current.innerHTML = svgContent;
    }
  }, [svgContent, artistName, albumName]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full"
    />
  );
}

interface SVGTemplate {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic' | 'minimalist';
  svgContent: string;
  isActive: boolean;
  
  // Font Configuration
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
  
  // Layout Configuration
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
  
  // Filter Configuration
  filterProperties: {
    brightness: { min: number; max: number; default: number };
    contrast: { min: number; max: number; default: number };
    saturation: { min: number; max: number; default: number };
    hue: { min: number; max: number; default: number };
    blur: { min: number; max: number; default: number };
    sepia: { min: number; max: number; default: number };
    grayscale: { min: number; max: number; default: number };
    vintage: { min: number; max: number; default: number };
  };
  
  // Rendering Configuration
  renderingFormats: {
    cover: { width: number; height: number; enabled: boolean };
    story: { width: number; height: number; enabled: boolean };
  };
  
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SVGTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState<'cover' | 'story'>('cover');
  const [previewText, setPreviewText] = useState({
    artistName: 'Test Artist',
    albumName: 'Test Album'
  });
  const [appliedText, setAppliedText] = useState({
    artistName: 'Test Artist',
    albumName: 'Test Album'
  });
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);

  // Apply text changes to preview with forced refresh
  const applyTextChanges = () => {
    console.log('Apply button clicked');
    console.log('Current previewText:', previewText);
    console.log('Current appliedText:', appliedText);
    
    setAppliedText({ ...previewText });
    setRenderTimestamp(Date.now());
    
    console.log('New appliedText will be:', previewText);
  };

  const [renderTimestamp, setRenderTimestamp] = useState(Date.now());
  
  // File controls for actual rendering with separate text layer
  const [fileControls, setFileControls] = useState({
    svgScale: 100,
    svgOpacity: 100,
    textScale: 100,
    textOpacity: 100,
    imageScale: 100,
    imageOpacity: 100,
    layerOrder: ['image', 'svg', 'text'] // Bottom to top order
  });

  // Positioning controls with mouse drag
  const [elementPositions, setElementPositions] = useState({
    text: { x: 0, y: 0 },
    svg: { x: 0, y: 0 }
  });
  
  const [isDragging, setIsDragging] = useState<'text' | 'svg' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Mouse drag handlers for positioning
  const handleMouseDown = (e: React.MouseEvent, element: 'text' | 'svg') => {
    e.preventDefault();
    setIsDragging(element);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setElementPositions(prev => ({
      ...prev,
      [isDragging]: {
        x: prev[isDragging].x + deltaX,
        y: prev[isDragging].y + deltaY
      }
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Reset positions
  const resetPositions = () => {
    setElementPositions({
      text: { x: 0, y: 0 },
      svg: { x: 0, y: 0 }
    });
  };

  // Layer order manipulation
  const moveLayerUp = (layer: string) => {
    setFileControls(prev => {
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
    setFileControls(prev => {
      const currentIndex = prev.layerOrder.indexOf(layer);
      if (currentIndex > 0) {
        const newOrder = [...prev.layerOrder];
        [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
        return { ...prev, layerOrder: newOrder };
      }
      return prev;
    });
  };

  // Get original template dimensions from SVG
  const getTemplateDimensions = (svgContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (svg) {
      const width = svg.getAttribute('width') || svg.getAttribute('viewBox')?.split(' ')[2] || '1000';
      const height = svg.getAttribute('height') || svg.getAttribute('viewBox')?.split(' ')[3] || '1000';
      return {
        width: parseInt(width.replace(/[^\d]/g, '')),
        height: parseInt(height.replace(/[^\d]/g, ''))
      };
    }
    
    return { width: 1000, height: 1000 };
  };

  // PNG Download functionality with proper scaling and layer order
  const downloadTemplateAsPNG = async (template: SVGTemplate, format: 'cover' | 'story' = 'cover') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set fixed output dimensions for consistent results
    const outputDimensions = format === 'cover' 
      ? { width: 1000, height: 1000 } 
      : { width: 1080, height: 1920 };
    
    canvas.width = outputDimensions.width;
    canvas.height = outputDimensions.height;

    // Create background image
    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    
    return new Promise<void>((resolve) => {
      bgImage.onload = () => {
        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create SVG with replaced text and applied typography
        let processedSvg = template.svgContent
          .replace(/\{\{artistName\}\}/g, appliedText.artistName)
          .replace(/\{\{albumName\}\}/g, appliedText.albumName);

        // Apply typography settings to SVG text elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(processedSvg, 'image/svg+xml');
        const textElements = svgDoc.querySelectorAll('text');
        
        textElements.forEach((textEl, index) => {
          const isArtistName = textEl.textContent?.includes(appliedText.artistName);
          const fontConfig = isArtistName ? template.fontProperties.artistFont : template.fontProperties.albumFont;
          
          // Apply font properties
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

        // Serialize the modified SVG
        processedSvg = new XMLSerializer().serializeToString(svgDoc);

        // Convert SVG to image
        const svgBlob = new Blob([processedSvg], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgImage = new Image();

        svgImage.onload = () => {
          // Calculate scaling based on file controls
          const imageScale = fileControls.imageScale / 100;
          const svgScale = fileControls.svgScale / 100;
          
          // Calculate dimensions with scaling
          const scaledImageWidth = canvas.width * imageScale;
          const scaledImageHeight = canvas.height * imageScale;
          const scaledSvgWidth = canvas.width * svgScale;
          const scaledSvgHeight = canvas.height * svgScale;
          
          // Center the scaled elements
          const imageX = (canvas.width - scaledImageWidth) / 2;
          const imageY = (canvas.height - scaledImageHeight) / 2;
          const svgX = (canvas.width - scaledSvgWidth) / 2;
          const svgY = (canvas.height - scaledSvgHeight) / 2;

          // Apply layer order
          if (fileControls.layerOrder === 'image-on-top') {
            // Draw SVG first, then image on top
            ctx.globalAlpha = fileControls.svgOpacity / 100;
            ctx.drawImage(svgImage, svgX, svgY, scaledSvgWidth, scaledSvgHeight);
            
            ctx.globalAlpha = fileControls.imageOpacity / 100;
            ctx.drawImage(bgImage, imageX, imageY, scaledImageWidth, scaledImageHeight);
          } else {
            // Draw image first, then SVG on top (default)
            ctx.globalAlpha = fileControls.imageOpacity / 100;
            ctx.drawImage(bgImage, imageX, imageY, scaledImageWidth, scaledImageHeight);
            
            ctx.globalAlpha = fileControls.svgOpacity / 100;
            ctx.drawImage(svgImage, svgX, svgY, scaledSvgWidth, scaledSvgHeight);
          }

          // Reset alpha
          ctx.globalAlpha = 1;

          // Download the result
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
            URL.revokeObjectURL(svgUrl);
            resolve();
          }, 'image/png');
        };

        svgImage.src = svgUrl;
      };

      bgImage.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&h=1000&fit=crop';
    });
  };
  
  const { data: templates = [], isLoading } = useQuery<SVGTemplate[]>({
    queryKey: ['/api/admin/templates'],
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: Partial<SVGTemplate>) => {
      return apiRequest('/api/admin/templates', 'POST', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template created successfully" });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SVGTemplate> }) => {
      return apiRequest(`/api/admin/templates/${id}`, 'PATCH', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template updated successfully" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/admin/templates/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      toast({ title: "Template deleted successfully" });
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.svg')) {
      toast({ 
        title: "Invalid file type", 
        description: "Please upload an SVG file", 
        variant: "destructive" 
      });
      return;
    }

    const svgContent = await file.text();
    const newTemplate: Partial<SVGTemplate> = {
      name: file.name.replace('.svg', ''),
      category: 'modern',
      svgContent,
      isActive: true,
      fontProperties: {
        artistFont: {
          family: 'Arial',
          weight: 700,
          size: { min: 24, max: 120, default: 48 },
          color: '#ffffff',
          opacity: { min: 0, max: 100, default: 100 },
          position: { x: 50, y: 80 },
          rotation: 0,
          letterSpacing: 0,
          lineHeight: 1.2,
          textTransform: 'uppercase',
          textAlign: 'center',
          strokeWidth: 0,
          strokeColor: '#000000',
        },
        albumFont: {
          family: 'Arial',
          weight: 400,
          size: { min: 16, max: 80, default: 32 },
          color: '#ffffff',
          opacity: { min: 0, max: 100, default: 100 },
          position: { x: 50, y: 90 },
          rotation: 0,
          letterSpacing: 0,
          lineHeight: 1.2,
          textTransform: 'none',
          textAlign: 'center',
          strokeWidth: 0,
          strokeColor: '#000000',
        },
      },
      layoutProperties: {
        canvasSize: { width: 1080, height: 1080 },
        shapes: [],
        overlays: [],
      },
      filterProperties: {
        brightness: { min: 50, max: 150, default: 100 },
        contrast: { min: 50, max: 150, default: 100 },
        saturation: { min: 0, max: 200, default: 100 },
        hue: { min: 0, max: 360, default: 0 },
        blur: { min: 0, max: 10, default: 0 },
        sepia: { min: 0, max: 100, default: 0 },
        grayscale: { min: 0, max: 100, default: 0 },
        vintage: { min: 0, max: 100, default: 0 },
      },
      renderingFormats: {
        cover: { width: 1080, height: 1080, enabled: true },
        story: { width: 1080, height: 1920, enabled: true },
      },
    };

    createTemplateMutation.mutate(newTemplate);
  };

  const FontConfigSection = ({ type, config, onChange }: any) => (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">{type === 'artistFont' ? 'Artist Name' : 'Album Name'} Typography</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Font Family</Label>
          <Select value={config.family} onValueChange={(value) => onChange('family', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
              <SelectItem value="Poppins">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select value={config.weight.toString()} onValueChange={(value) => onChange('weight', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">Thin (100)</SelectItem>
              <SelectItem value="300">Light (300)</SelectItem>
              <SelectItem value="400">Regular (400)</SelectItem>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semi Bold (600)</SelectItem>
              <SelectItem value="700">Bold (700)</SelectItem>
              <SelectItem value="900">Black (900)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Size Range (px)</Label>
          <div className="flex gap-2">
            <Input 
              type="number" 
              value={config.size.min} 
              onChange={(e) => onChange('size', { ...config.size, min: parseInt(e.target.value) })}
              placeholder="Min"
            />
            <Input 
              type="number" 
              value={config.size.max} 
              onChange={(e) => onChange('size', { ...config.size, max: parseInt(e.target.value) })}
              placeholder="Max"
            />
            <Input 
              type="number" 
              value={config.size.default} 
              onChange={(e) => onChange('size', { ...config.size, default: parseInt(e.target.value) })}
              placeholder="Default"
            />
          </div>
        </div>
        
        <div>
          <Label>Color</Label>
          <Input 
            type="color" 
            value={config.color} 
            onChange={(e) => onChange('color', e.target.value)}
          />
        </div>
        
        <div>
          <Label>Text Transform</Label>
          <Select value={config.textTransform} onValueChange={(value) => onChange('textTransform', value)}>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Position X (%)</Label>
          <Slider
            value={[config.position.x]}
            onValueChange={(value) => onChange('position', { ...config.position, x: value[0] })}
            min={0}
            max={100}
            step={1}
          />
          <span className="text-xs text-gray-500">{config.position.x}%</span>
        </div>
        
        <div>
          <Label>Position Y (%)</Label>
          <Slider
            value={[config.position.y]}
            onValueChange={(value) => onChange('position', { ...config.position, y: value[0] })}
            min={0}
            max={100}
            step={1}
          />
          <span className="text-xs text-gray-500">{config.position.y}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Rotation (degrees)</Label>
          <Slider
            value={[config.rotation]}
            onValueChange={(value) => onChange('rotation', value[0])}
            min={-180}
            max={180}
            step={1}
          />
          <span className="text-xs text-gray-500">{config.rotation}°</span>
        </div>
        
        <div>
          <Label>Letter Spacing</Label>
          <Slider
            value={[config.letterSpacing]}
            onValueChange={(value) => onChange('letterSpacing', value[0])}
            min={-5}
            max={20}
            step={0.1}
          />
          <span className="text-xs text-gray-500">{config.letterSpacing}px</span>
        </div>
        
        <div>
          <Label>Line Height</Label>
          <Slider
            value={[config.lineHeight]}
            onValueChange={(value) => onChange('lineHeight', value[0])}
            min={0.5}
            max={3}
            step={0.1}
          />
          <span className="text-xs text-gray-500">{config.lineHeight}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stroke Width</Label>
          <Slider
            value={[config.strokeWidth]}
            onValueChange={(value) => onChange('strokeWidth', value[0])}
            min={0}
            max={10}
            step={0.5}
          />
          <span className="text-xs text-gray-500">{config.strokeWidth}px</span>
        </div>
        
        <div>
          <Label>Stroke Color</Label>
          <Input 
            type="color" 
            value={config.strokeColor} 
            onChange={(e) => onChange('strokeColor', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel - SVG Template Management</h1>
          <p className="text-gray-600 mt-2">Configure SVG templates with advanced typography and layout controls</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Upload SVG Template
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Templates ({(templates as SVGTemplate[]).length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {(templates as SVGTemplate[]).map((template: SVGTemplate) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTemplateMutation.mutate(template.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <div className={`w-3 h-3 rounded-full ${
                          template.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Preview Monitor */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Preview Monitor
              <div className="flex gap-2">
                <Button
                  variant={previewMode === 'cover' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('cover')}
                >
                  1:1
                </Button>
                <Button
                  variant={previewMode === 'story' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('story')}
                >
                  9:16
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-4">
                <div 
                  key={`main-preview-${renderTimestamp}-${appliedText.artistName}-${appliedText.albumName}`}
                  className={`bg-gray-100 rounded-lg overflow-hidden relative cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${
                    previewMode === 'cover' ? 'aspect-square' : 'aspect-[9/16]'
                  }`}
                  onClick={() => setShowPreviewPopup(true)}
                >
                  <div 
                    className="w-full h-full relative"
                    style={{
                      backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: `scale(${fileControls.imageScale / 100})`,
                      opacity: fileControls.imageOpacity / 100
                    }}
                  >
                    <div 
                      className="absolute inset-0 w-full h-full flex items-center justify-center"
                      style={{
                        transform: `scale(${fileControls.svgScale / 100})`,
                        opacity: fileControls.svgOpacity / 100
                      }}
                    >
                      <SvgPreview 
                        svgContent={selectedTemplate.svgContent}
                        artistName={appliedText.artistName}
                        albumName={appliedText.albumName}
                        key={`svg-${renderTimestamp}`}
                      />
                    </div>
                    {/* Overlay hint */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Click to expand
                    </div>
                  </div>
                </div>
                
                {/* Quick Preview Controls */}
                <div className="space-y-3 text-sm">
                  <div className="space-y-2">
                    <Label className="text-xs">Test Artist Name</Label>
                    <Input 
                      value={previewText.artistName}
                      onChange={(e) => setPreviewText({
                        ...previewText,
                        artistName: e.target.value
                      })}
                      className="h-7 text-xs"
                      placeholder="Artist Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Test Album Name</Label>
                    <Input 
                      value={previewText.albumName}
                      onChange={(e) => setPreviewText({
                        ...previewText,
                        albumName: e.target.value
                      })}
                      className="h-7 text-xs"
                      placeholder="Album Name"
                    />
                  </div>
                  
                  {/* Apply Button */}
                  <Button 
                    onClick={applyTextChanges}
                    size="sm"
                    className="w-full mt-2"
                    variant={JSON.stringify(previewText) !== JSON.stringify(appliedText) ? "default" : "outline"}
                  >
                    <Type className="w-3 h-3 mr-1" />
                    Apply Text Changes
                  </Button>
                  
                  <div className="pt-2 border-t space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Format:</span>
                      <span>{previewMode === 'cover' ? '400x400' : '400x711'}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Template:</span>
                      <span>{selectedTemplate.name}</span>
                    </div>
                  </div>
                </div>

                {/* Download Options */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Download Test Images</Label>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'cover')}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      1:1 PNG
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'story')}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      9:16 PNG
                    </Button>
                  </div>
                </div>

                {/* Live Update Indicator */}
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Preview Active
                </div>
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Select a template to preview</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedTemplate ? `Configure: ${selectedTemplate.name}` : 'Select a template to configure'}
              </CardTitle>
              {selectedTemplate && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewMode(previewMode === 'cover' ? 'story' : 'cover')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview {previewMode === 'cover' ? 'Story' : 'Cover'}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (selectedTemplate) {
                        updateTemplateMutation.mutate({
                          id: selectedTemplate.id,
                          data: selectedTemplate
                        });
                      }
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          {selectedTemplate && (
            <CardContent>
              <Tabs defaultValue="typography">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="typography">
                    <Type className="w-4 h-4 mr-2" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger value="filecontrols">
                    <Settings className="w-4 h-4 mr-2" />
                    File Controls
                  </TabsTrigger>
                  <TabsTrigger value="layout">
                    <Layout className="w-4 h-4 mr-2" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="filters">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="typography" className="space-y-6 mt-6">
                  <FontConfigSection
                    type="artistFont"
                    config={selectedTemplate.fontProperties.artistFont}
                    onChange={(prop: string, value: any) => {
                      setSelectedTemplate({
                        ...selectedTemplate,
                        fontProperties: {
                          ...selectedTemplate.fontProperties,
                          artistFont: {
                            ...selectedTemplate.fontProperties.artistFont,
                            [prop]: value
                          }
                        }
                      });
                    }}
                  />
                  
                  <hr />
                  
                  <FontConfigSection
                    type="albumFont"
                    config={selectedTemplate.fontProperties.albumFont}
                    onChange={(prop: string, value: any) => {
                      setSelectedTemplate({
                        ...selectedTemplate,
                        fontProperties: {
                          ...selectedTemplate.fontProperties,
                          albumFont: {
                            ...selectedTemplate.fontProperties.albumFont,
                            [prop]: value
                          }
                        }
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent value="filecontrols" className="space-y-4 mt-6">
                  <div>
                    <h4 className="font-medium text-lg mb-4">File Rendering Controls</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium mb-3">Layer Order</h5>
                        <Select 
                          value={fileControls.layerOrder} 
                          onValueChange={(value: 'svg-on-top' | 'image-on-top') => 
                            setFileControls(prev => ({ ...prev, layerOrder: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="svg-on-top">SVG on Top (Default)</SelectItem>
                            <SelectItem value="image-on-top">Image on Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">SVG File Controls</h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">SVG Scale: {fileControls.svgScale}%</Label>
                            <Slider
                              value={[fileControls.svgScale]}
                              onValueChange={(value) => setFileControls(prev => ({ ...prev, svgScale: value[0] }))}
                              min={10}
                              max={300}
                              step={5}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">SVG Opacity: {fileControls.svgOpacity}%</Label>
                            <Slider
                              value={[fileControls.svgOpacity]}
                              onValueChange={(value) => setFileControls(prev => ({ ...prev, svgOpacity: value[0] }))}
                              min={0}
                              max={100}
                              step={5}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-3">Background Image Controls</h5>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">Image Scale: {fileControls.imageScale}%</Label>
                            <Slider
                              value={[fileControls.imageScale]}
                              onValueChange={(value) => setFileControls(prev => ({ ...prev, imageScale: value[0] }))}
                              min={10}
                              max={300}
                              step={5}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Image Opacity: {fileControls.imageOpacity}%</Label>
                            <Slider
                              value={[fileControls.imageOpacity]}
                              onValueChange={(value) => setFileControls(prev => ({ ...prev, imageOpacity: value[0] }))}
                              min={0}
                              max={100}
                              step={5}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="outline" 
                          onClick={() => setFileControls({
                            svgScale: 100,
                            svgOpacity: 100,
                            imageScale: 100,
                            imageOpacity: 100,
                            layerOrder: 'svg-on-top'
                          })}
                          className="w-full"
                        >
                          Reset All Controls
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-4 mt-6">
                  <div>
                    <h4 className="font-medium text-lg mb-4">Canvas Dimensions</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Cover Format (1:1)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={selectedTemplate.renderingFormats.cover.width}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              renderingFormats: {
                                ...selectedTemplate.renderingFormats,
                                cover: {
                                  ...selectedTemplate.renderingFormats.cover,
                                  width: parseInt(e.target.value)
                                }
                              }
                            })}
                            placeholder="Width"
                          />
                          <Input
                            type="number"
                            value={selectedTemplate.renderingFormats.cover.height}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              renderingFormats: {
                                ...selectedTemplate.renderingFormats,
                                cover: {
                                  ...selectedTemplate.renderingFormats.cover,
                                  height: parseInt(e.target.value)
                                }
                              }
                            })}
                            placeholder="Height"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Story Format (9:16)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={selectedTemplate.renderingFormats.story.width}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              renderingFormats: {
                                ...selectedTemplate.renderingFormats,
                                story: {
                                  ...selectedTemplate.renderingFormats.story,
                                  width: parseInt(e.target.value)
                                }
                              }
                            })}
                            placeholder="Width"
                          />
                          <Input
                            type="number"
                            value={selectedTemplate.renderingFormats.story.height}
                            onChange={(e) => setSelectedTemplate({
                              ...selectedTemplate,
                              renderingFormats: {
                                ...selectedTemplate.renderingFormats,
                                story: {
                                  ...selectedTemplate.renderingFormats.story,
                                  height: parseInt(e.target.value)
                                }
                              }
                            })}
                            placeholder="Height"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-4">SVG Content</h4>
                    <Textarea
                      value={selectedTemplate.svgContent}
                      onChange={(e) => setSelectedTemplate({
                        ...selectedTemplate,
                        svgContent: e.target.value
                      })}
                      rows={10}
                      className="font-mono text-sm"
                      placeholder="Paste SVG content here..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-4 mt-6">
                  <h4 className="font-medium text-lg mb-4">Filter Ranges</h4>
                  {Object.entries(selectedTemplate.filterProperties).map(([filter, config]) => (
                    <div key={filter} className="grid grid-cols-4 gap-4 items-center">
                      <Label className="capitalize">{filter}</Label>
                      <Input
                        type="number"
                        value={config.min}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          filterProperties: {
                            ...selectedTemplate.filterProperties,
                            [filter]: {
                              ...config,
                              min: parseInt(e.target.value)
                            }
                          }
                        })}
                        placeholder="Min"
                      />
                      <Input
                        type="number"
                        value={config.max}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          filterProperties: {
                            ...selectedTemplate.filterProperties,
                            [filter]: {
                              ...config,
                              max: parseInt(e.target.value)
                            }
                          }
                        })}
                        placeholder="Max"
                      />
                      <Input
                        type="number"
                        value={config.default}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          filterProperties: {
                            ...selectedTemplate.filterProperties,
                            [filter]: {
                              ...config,
                              default: parseInt(e.target.value)
                            }
                          }
                        })}
                        placeholder="Default"
                      />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Template Name</Label>
                      <Input
                        value={selectedTemplate.name}
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          name: e.target.value
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Category</Label>
                      <Select 
                        value={selectedTemplate.category} 
                        onValueChange={(value) => setSelectedTemplate({
                          ...selectedTemplate,
                          category: value as any
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="futuristic">Futuristic</SelectItem>
                          <SelectItem value="vintage">Vintage</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="minimalist">Minimalist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedTemplate.isActive}
                      onCheckedChange={(checked) => setSelectedTemplate({
                        ...selectedTemplate,
                        isActive: checked
                      })}
                    />
                    <Label>Template Active</Label>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedTemplate.renderingFormats.cover.enabled}
                        onCheckedChange={(checked) => setSelectedTemplate({
                          ...selectedTemplate,
                          renderingFormats: {
                            ...selectedTemplate.renderingFormats,
                            cover: { ...selectedTemplate.renderingFormats.cover, enabled: checked }
                          }
                        })}
                      />
                      <Label>Enable Cover Format (1:1)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedTemplate.renderingFormats.story.enabled}
                        onCheckedChange={(checked) => setSelectedTemplate({
                          ...selectedTemplate,
                          renderingFormats: {
                            ...selectedTemplate.renderingFormats,
                            story: { ...selectedTemplate.renderingFormats.story, enabled: checked }
                          }
                        })}
                      />
                      <Label>Enable Story Format (9:16)</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Preview Popup Modal */}
      {showPreviewPopup && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Preview: {selectedTemplate.name}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPreviewPopup(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Cover Format (1:1) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Cover Format (1:1)</h4>
                    <span className="text-sm text-gray-500">400x400</span>
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="w-full h-full relative"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                        <SvgPreview 
                          svgContent={selectedTemplate.svgContent}
                          artistName={appliedText.artistName}
                          albumName={appliedText.albumName}
                          key={`popup-svg-${renderTimestamp}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Story Format (9:16) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Story Format (9:16)</h4>
                    <span className="text-sm text-gray-500">400x711</span>
                  </div>
                  <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden relative max-w-xs mx-auto">
                    <div 
                      className="w-full h-full relative"
                      style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=711&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform: selectedTemplate.name.toLowerCase().includes('story') ? 'none' : 'scale(0.85)'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: selectedTemplate.svgContent
                            .replace(/\{\{artistName\}\}/g, previewText.artistName)
                            .replace(/\{\{albumName\}\}/g, previewText.albumName)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Controls */}
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold">Test Controls</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Artist Name</Label>
                    <Input 
                      value={previewText.artistName}
                      onChange={(e) => setPreviewText({
                        ...previewText,
                        artistName: e.target.value
                      })}
                      placeholder="Enter artist name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Album Name</Label>
                    <Input 
                      value={previewText.albumName}
                      onChange={(e) => setPreviewText({
                        ...previewText,
                        albumName: e.target.value
                      })}
                      placeholder="Enter album name"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Template: {selectedTemplate.name} | 
                    Category: {selectedTemplate.category} | 
                    Type: {selectedTemplate.name.toLowerCase().includes('story') ? '9:16 Story' : '1:1 Cover'}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'cover')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download 1:1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadTemplateAsPNG(selectedTemplate, 'story')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download 9:16
                    </Button>
                    <Button onClick={() => setShowPreviewPopup(false)}>
                      Close Preview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}