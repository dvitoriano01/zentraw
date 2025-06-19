import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Layers,
  Filter,
  ZoomIn,
  Move
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CoverEditorProps {
  image: {
    id: string;
    url: string;
    source: 'pexels' | 'pixabay' | 'dall-e' | 'upload';
    width: number;
    height: number;
  };
  artistName: string;
  trackName: string;
  onComplete?: (imageData: any) => void;
  onBack?: () => void;
}

interface Template {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic';
  preview: string;
  overlay: string;
  flipAllowed: 'horizontal' | 'vertical' | 'both' | 'none';
  opacityRange: { min: number; max: number };
}

interface TextConfig {
  text: string;
  font: string;
  size: number;
  color: string;
  opacity: number;
  x: number;
  y: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

export function CoverEditor({ image, artistName, trackName, onComplete, onBack }: CoverEditorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(80);
  const [overlayIntensity, setOverlayIntensity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<string>('none');
  
  const [artistText, setArtistText] = useState<TextConfig>({
    text: artistName || 'ARTIST',
    font: 'Arial',
    size: 48,
    color: '#ffffff',
    opacity: 100,
    x: 50,
    y: 80,
    rotation: 0,
    flipH: false,
    flipV: false
  });
  
  const [trackText, setTrackText] = useState<TextConfig>({
    text: trackName || 'TRACK',
    font: 'Arial',
    size: 32,
    color: '#ffffff',
    opacity: 100,
    x: 50,
    y: 90,
    rotation: 0,
    flipH: false,
    flipV: false
  });

  const templates: Template[] = [
    {
      id: 'modern-1',
      name: 'Clean Modern',
      category: 'modern',
      preview: '/templates/modern-1-preview.jpg',
      overlay: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.1) 100%)',
      flipAllowed: 'both',
      opacityRange: { min: 20, max: 80 }
    },
    {
      id: 'futuristic-1',
      name: 'Neon Grid',
      category: 'futuristic',
      preview: '/templates/futuristic-1-preview.jpg',
      overlay: 'linear-gradient(45deg, rgba(0,255,255,0.2) 0%, rgba(255,0,255,0.2) 100%)',
      flipAllowed: 'horizontal',
      opacityRange: { min: 30, max: 70 }
    },
    {
      id: 'vintage-1',
      name: 'Retro Film',
      category: 'vintage',
      preview: '/templates/vintage-1-preview.jpg',
      overlay: 'radial-gradient(circle, rgba(255,220,180,0.3) 0%, rgba(139,69,19,0.5) 100%)',
      flipAllowed: 'none',
      opacityRange: { min: 40, max: 90 }
    }
  ];

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Impact', 'Trebuchet MS', 'Comic Sans MS', 'Courier New', 'Palatino'
  ];

  const filters = [
    { id: 'none', name: 'None', css: 'none' },
    { id: 'glitch', name: 'Glitch', css: 'hue-rotate(90deg) saturate(2) contrast(1.2)' },
    { id: 'scanlines', name: 'Scanlines', css: 'contrast(1.1) brightness(0.9)' },
    { id: 'noise', name: 'Noise', css: 'sepia(0.3) contrast(1.2) brightness(0.8)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(0.8) contrast(1.3) brightness(0.9)' },
    { id: 'cyberpunk', name: 'Cyberpunk', css: 'hue-rotate(240deg) saturate(1.5) contrast(1.3)' }
  ];

  useEffect(() => {
    renderCanvas();
  }, [selectedTemplate, watermarkOpacity, overlayIntensity, zoom, imagePosition, activeFilter, artistText, trackText]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 2048;
    canvas.height = 2048;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and draw main image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Apply zoom and position
      const scale = zoom / 100;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (canvas.width - scaledWidth) / 2 + imagePosition.x;
      const y = (canvas.height - scaledHeight) / 2 + imagePosition.y;

      // Apply filters
      if (activeFilter !== 'none') {
        const filter = filters.find(f => f.id === activeFilter);
        if (filter) {
          ctx.filter = filter.css;
        }
      }

      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      ctx.filter = 'none';

      // Apply template overlay
      if (selectedTemplate) {
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.width = canvas.width;
        overlayCanvas.height = canvas.height;
        const overlayCtx = overlayCanvas.getContext('2d');
        
        if (overlayCtx) {
          const gradient = overlayCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
          // Parse and apply template overlay
          overlayCtx.globalAlpha = overlayIntensity / 100;
          overlayCtx.fillStyle = selectedTemplate.overlay;
          overlayCtx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.globalAlpha = 1;
          ctx.drawImage(overlayCanvas, 0, 0);
        }
      }

      // Draw watermark
      drawWatermark(ctx);

      // Draw text elements
      drawText(ctx, artistText);
      drawText(ctx, trackText);
    };
    img.src = image.url;
  };

  const drawWatermark = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = watermarkOpacity / 100;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 128px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Rotate and position watermark
    ctx.translate(1024, 1024);
    ctx.rotate(-Math.PI / 6);
    ctx.fillText('zentraw.com', 0, 0);
    ctx.restore();
  };

  const drawText = (ctx: CanvasRenderingContext2D, textConfig: TextConfig) => {
    if (!textConfig.text) return;

    ctx.save();
    ctx.globalAlpha = textConfig.opacity / 100;
    ctx.fillStyle = textConfig.color;
    ctx.font = `bold ${textConfig.size}px ${textConfig.font}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const x = (canvas.width * textConfig.x) / 100;
    const y = (canvas.height * textConfig.y) / 100;

    ctx.translate(x, y);
    
    if (textConfig.rotation !== 0) {
      ctx.rotate((textConfig.rotation * Math.PI) / 180);
    }
    
    if (textConfig.flipH || textConfig.flipV) {
      ctx.scale(textConfig.flipH ? -1 : 1, textConfig.flipV ? -1 : 1);
    }

    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(textConfig.text.toUpperCase(), 0, 0);
    ctx.restore();
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setOverlayIntensity(template.opacityRange.min + 
      (template.opacityRange.max - template.opacityRange.min) / 2);
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 1.0);
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artistName || 'artist'}-${trackName || 'track'}-cover.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t('common.success'),
        description: 'Cover downloaded successfully!'
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to download cover',
        variant: 'destructive'
      });
    }
  };

  const handleSaveProject = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageData = canvas.toDataURL('image/png');
      
      const projectData = {
        artistName,
        trackName,
        image: image.url,
        template: selectedTemplate?.id,
        watermarkOpacity,
        overlayIntensity,
        zoom,
        imagePosition,
        activeFilter,
        artistText,
        trackText
      };

      const { data, error } = await supabase
        .from('saved_projects')
        .insert({
          name: `${artistName} - ${trackName}`,
          type: 'cover',
          data: projectData,
          thumbnail: imageData
        });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('messages.saveSuccess')
      });

      if (onComplete) {
        onComplete({ imageData, projectData });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to save project',
        variant: 'destructive'
      });
    }
  };

  const updateTextConfig = (type: 'artist' | 'track', field: string, value: any) => {
    const setter = type === 'artist' ? setArtistText : setTrackText;
    setter(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t('editor.title')}
            </CardTitle>
            <div className="flex gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.back')}
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('editor.reset')}
              </Button>
              <Button variant="outline" onClick={handleSaveProject}>
                <Save className="w-4 h-4 mr-2" />
                {t('editor.save')}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                {t('editor.download')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tools Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="templates">
                    <Layers className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="text">
                    <Type className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="filters">
                    <Filter className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-4">
                  <div>
                    <Label>{t('editor.templates')}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedTemplate?.id === template.id
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            <div className="text-xs text-center p-2">
                              <div className="font-medium">{template.name}</div>
                              <Badge variant="secondary" className="text-xs mt-1">
                                {template.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTemplate && (
                    <div>
                      <Label>{t('editor.intensity')}</Label>
                      <Slider
                        value={[overlayIntensity]}
                        onValueChange={(value) => setOverlayIntensity(value[0])}
                        min={selectedTemplate.opacityRange.min}
                        max={selectedTemplate.opacityRange.max}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {overlayIntensity}% - {overlayIntensity < 50 ? t('editor.soft') : t('editor.hard')}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>{t('editor.watermark')} {t('editor.opacity')}</Label>
                    <Slider
                      value={[watermarkOpacity]}
                      onValueChange={(value) => setWatermarkOpacity(value[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">{watermarkOpacity}%</div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  {/* Artist Text Controls */}
                  <div className="border rounded-lg p-3 space-y-3">
                    <Label className="font-medium">{t('editor.artistText')}</Label>
                    <Input
                      value={artistText.text}
                      onChange={(e) => updateTextConfig('artist', 'text', e.target.value)}
                      placeholder="Artist name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{t('editor.font')}</Label>
                        <Select 
                          value={artistText.font} 
                          onValueChange={(value) => updateTextConfig('artist', 'font', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font} value={font}>{font}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">{t('editor.size')}</Label>
                        <Input
                          type="number"
                          value={artistText.size}
                          onChange={(e) => updateTextConfig('artist', 'size', parseInt(e.target.value))}
                          min={12}
                          max={200}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{t('editor.color')}</Label>
                        <Input
                          type="color"
                          value={artistText.color}
                          onChange={(e) => updateTextConfig('artist', 'color', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{t('editor.opacity')}</Label>
                        <Slider
                          value={[artistText.opacity]}
                          onValueChange={(value) => updateTextConfig('artist', 'opacity', value[0])}
                          min={0}
                          max={100}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X Position</Label>
                        <Slider
                          value={[artistText.x]}
                          onValueChange={(value) => updateTextConfig('artist', 'x', value[0])}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y Position</Label>
                        <Slider
                          value={[artistText.y]}
                          onValueChange={(value) => updateTextConfig('artist', 'y', value[0])}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={artistText.flipH ? "default" : "outline"}
                        onClick={() => updateTextConfig('artist', 'flipH', !artistText.flipH)}
                      >
                        H
                      </Button>
                      <Button
                        size="sm"
                        variant={artistText.flipV ? "default" : "outline"}
                        onClick={() => updateTextConfig('artist', 'flipV', !artistText.flipV)}
                      >
                        V
                      </Button>
                    </div>
                  </div>

                  {/* Track Text Controls */}
                  <div className="border rounded-lg p-3 space-y-3">
                    <Label className="font-medium">{t('editor.trackText')}</Label>
                    <Input
                      value={trackText.text}
                      onChange={(e) => updateTextConfig('track', 'text', e.target.value)}
                      placeholder="Track name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{t('editor.font')}</Label>
                        <Select 
                          value={trackText.font} 
                          onValueChange={(value) => updateTextConfig('track', 'font', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map((font) => (
                              <SelectItem key={font} value={font}>{font}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">{t('editor.size')}</Label>
                        <Input
                          type="number"
                          value={trackText.size}
                          onChange={(e) => updateTextConfig('track', 'size', parseInt(e.target.value))}
                          min={12}
                          max={200}
                          className="h-8"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">{t('editor.color')}</Label>
                        <Input
                          type="color"
                          value={trackText.color}
                          onChange={(e) => updateTextConfig('track', 'color', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">{t('editor.opacity')}</Label>
                        <Slider
                          value={[trackText.opacity]}
                          onValueChange={(value) => updateTextConfig('track', 'opacity', value[0])}
                          min={0}
                          max={100}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X Position</Label>
                        <Slider
                          value={[trackText.x]}
                          onValueChange={(value) => updateTextConfig('track', 'x', value[0])}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y Position</Label>
                        <Slider
                          value={[trackText.y]}
                          onValueChange={(value) => updateTextConfig('track', 'y', value[0])}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={trackText.flipH ? "default" : "outline"}
                        onClick={() => updateTextConfig('track', 'flipH', !trackText.flipH)}
                      >
                        H
                      </Button>
                      <Button
                        size="sm"
                        variant={trackText.flipV ? "default" : "outline"}
                        onClick={() => updateTextConfig('track', 'flipV', !trackText.flipV)}
                      >
                        V
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <ZoomIn className="w-4 h-4" />
                      {t('editor.zoom')}
                    </Label>
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={50}
                      max={200}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-xs text-gray-500 mt-1">{zoom}%</div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Move className="w-4 h-4" />
                      {t('editor.position')}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <Label className="text-xs">X</Label>
                        <Slider
                          value={[imagePosition.x]}
                          onValueChange={(value) => setImagePosition(prev => ({ ...prev, x: value[0] }))}
                          min={-500}
                          max={500}
                          step={10}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y</Label>
                        <Slider
                          value={[imagePosition.y]}
                          onValueChange={(value) => setImagePosition(prev => ({ ...prev, y: value[0] }))}
                          min={-500}
                          max={500}
                          step={10}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-4">
                  <div>
                    <Label>{t('editor.filters')}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {filters.map((filter) => (
                        <Button
                          key={filter.id}
                          size="sm"
                          variant={activeFilter === filter.id ? "default" : "outline"}
                          onClick={() => setActiveFilter(filter.id)}
                          className="text-xs"
                        >
                          {filter.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Canvas Preview */}
            <div className="lg:col-span-2">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1' }}>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    2048x2048
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}