import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Upload, Search, Image as ImageIcon, Palette } from 'lucide-react';
import { CoverEditor } from './CoverEditor';

interface CoverGeneratorProps {
  onComplete?: (imageData: any) => void;
}

interface ImageResult {
  id: string;
  url: string;
  photographer?: string;
  source: 'pexels' | 'pixabay' | 'dall-e' | 'upload';
  width: number;
  height: number;
}

export function CoverGenerator({ onComplete }: CoverGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'input' | 'selection' | 'editor'>('input');
  const [generationType, setGenerationType] = useState<'ai' | 'upload' | 'api'>('ai');
  const [formData, setFormData] = useState({
    artistName: '',
    trackName: '',
    albumName: '',
    imageDescription: '',
    style: 'modern'
  });
  
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { value: 'modern', label: t('coverGenerator.styles.modern') },
    { value: 'futuristic', label: t('coverGenerator.styles.futuristic') },
    { value: 'vintage', label: t('coverGenerator.styles.vintage') },
    { value: 'urban', label: t('coverGenerator.styles.urban') },
    { value: 'classic', label: t('coverGenerator.styles.classic') },
    { value: 'cyberpunk', label: t('coverGenerator.styles.cyberpunk') },
    { value: 'abstract', label: t('coverGenerator.styles.abstract') }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateByAI = async () => {
    if (!formData.artistName || !formData.imageDescription) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName: formData.artistName,
          trackName: formData.trackName,
          description: formData.imageDescription,
          style: formData.style
        })
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const result = await response.json();
      setSelectedImage({
        id: 'generated',
        url: result.imageUrl,
        source: 'dall-e',
        width: 2048,
        height: 2048
      });
      setStep('editor');
      
      toast({
        title: t('common.success'),
        description: t('messages.generateSuccess')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchImages = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-images?q=${encodeURIComponent(query)}&type=pexels`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      setSearchResults(results.images || []);
      setStep('selection');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to search images. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('common.error'),
        description: 'Please select a valid image file',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('common.error'),
        description: 'Image size must be less than 10MB',
        variant: 'destructive'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', `${formData.artistName} - ${formData.trackName}`);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      setSelectedImage({
        id: result.id,
        url: `/api/image/${result.id}`,
        source: 'upload',
        width: 2048,
        height: 2048
      });
      setStep('editor');
      
      toast({
        title: t('common.success'),
        description: t('messages.uploadSuccess')
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('messages.errorUpload'),
        variant: 'destructive'
      });
    }
  };

  const handleImageSelect = (image: ImageResult) => {
    setSelectedImage(image);
    setStep('editor');
  };

  if (step === 'editor' && selectedImage) {
    return (
      <CoverEditor
        image={selectedImage}
        artistName={formData.artistName}
        trackName={formData.trackName}
        onComplete={onComplete}
        onBack={() => setStep('input')}
      />
    );
  }

  if (step === 'selection') {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Select an Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {searchResults.map((image) => (
              <div key={image.id} className="relative group cursor-pointer" onClick={() => handleImageSelect(image)}>
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                    {t('coverGenerator.useThisImage')}
                  </Button>
                </div>
                {image.photographer && (
                  <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                    {image.photographer}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setStep('input')}>
            {t('common.back')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {t('coverGenerator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="artistName">{t('coverGenerator.artistName')} *</Label>
            <Input
              id="artistName"
              value={formData.artistName}
              onChange={(e) => handleInputChange('artistName', e.target.value)}
              placeholder="Enter artist name"
            />
          </div>
          <div>
            <Label htmlFor="trackName">{t('coverGenerator.trackName')}</Label>
            <Input
              id="trackName"
              value={formData.trackName}
              onChange={(e) => handleInputChange('trackName', e.target.value)}
              placeholder="Enter track name"
            />
          </div>
        </div>

        {/* Generation Type */}
        <Tabs value={generationType} onValueChange={(value: any) => setGenerationType(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t('coverGenerator.generateByAI')}
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t('coverGenerator.uploadImage')}
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {t('coverGenerator.chooseFromAPI')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <div>
              <Label htmlFor="imageDescription">{t('coverGenerator.imageDescription')} *</Label>
              <Textarea
                id="imageDescription"
                value={formData.imageDescription}
                onChange={(e) => handleInputChange('imageDescription', e.target.value)}
                placeholder="Describe the image you want to generate..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="style">{t('coverGenerator.style')}</Label>
              <Select value={formData.style} onValueChange={(value) => handleInputChange('style', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateByAI} 
              disabled={isGenerating || !formData.artistName || !formData.imageDescription}
              className="w-full"
            >
              {isGenerating ? t('coverGenerator.generating') : t('coverGenerator.generate')}
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Upload an image (minimum 2000px recommended)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button asChild>
                  <span>{t('common.upload')}</span>
                </Button>
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div>
              <Label htmlFor="searchQuery">Search Query</Label>
              <div className="flex gap-2">
                <Input
                  id="searchQuery"
                  placeholder="Enter search terms..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value;
                      if (query) handleSearchImages(query);
                    }
                  }}
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('searchQuery') as HTMLInputElement;
                    if (input?.value) handleSearchImages(input.value);
                  }}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : t('common.search')}
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Search high-quality images from Pexels and Pixabay
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}