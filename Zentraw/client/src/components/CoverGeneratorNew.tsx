import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { 
  Sparkles, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  ArrowRight,
  Plus
} from 'lucide-react';

interface CoverGeneratorProps {
  onImageSelected?: (imageData: any) => void;
}

interface ImageResult {
  id: string;
  url: string;
  photographer?: string;
  source: 'pexels' | 'pixabay' | 'dall-e' | 'upload';
  width: number;
  height: number;
}

export function CoverGeneratorNew({ onImageSelected }: CoverGeneratorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [artistName, setArtistName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [generationType, setGenerationType] = useState<'upload' | 'ai' | 'api' | null>(null);
  const [imageDescription, setImageDescription] = useState('');
  const [style, setStyle] = useState('modern');
  const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
  const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: recentImages = [] } = useQuery({
    queryKey: ["/api/content"],
    select: (data: any[]) => data.filter(item => item.type === 'upload').slice(0, 6)
  });

  const styles = [
    { value: 'modern', label: 'Modern' },
    { value: 'futuristic', label: 'Futuristic' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'urban', label: 'Urban' },
    { value: 'classic', label: 'Classic' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'abstract', label: 'Abstract' }
  ];

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `${artistName} - ${albumName} Cover`);
      formData.append('type', 'upload');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      
      const imageResult: ImageResult = {
        id: data.id.toString(),
        url: `/api/image/${data.id}`,
        source: 'upload',
        width: 2048,
        height: 2048
      };
      
      setSelectedImage(imageResult);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your image is ready for editing.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again with a smaller image.",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleGenerateAI = async () => {
    if (!artistName || !imageDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in artist name and image description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName,
          trackName: albumName,
          description: imageDescription,
          style
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
      
      toast({
        title: "Image generated successfully!",
        description: "Your AI-generated image is ready for editing."
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again with a different description.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearchImages = async () => {
    if (!searchQuery) {
      toast({
        title: "Enter search terms",
        description: "Please enter keywords to search for images",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-images?q=${encodeURIComponent(searchQuery)}&type=pexels`);
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      setSearchResults(results.images || []);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please check your API keys or try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelect = (image: any) => {
    const imageResult: ImageResult = {
      id: image.id.toString(),
      url: image.type === 'upload' ? `/api/image/${image.id}` : image.url,
      source: image.type === 'upload' ? 'upload' : 'pexels',
      width: 2048,
      height: 2048
    };
    setSelectedImage(imageResult);
  };

  const handleNextStep = () => {
    if (selectedImage && onImageSelected) {
      onImageSelected({
        image: selectedImage,
        artistName,
        albumName
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Cover Art Generator</CardTitle>
          <p className="text-gray-600">Create professional cover art for your music</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              {/* Artist and Album Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="artistName">Artist Name *</Label>
                  <Input
                    id="artistName"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Enter artist name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="albumName">Single/Album Name *</Label>
                  <Input
                    id="albumName"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="Enter single or album name"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Generation Type Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Choose how to generate your cover image:</Label>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Upload Option */}
                  <Card 
                    className={`cursor-pointer border-2 transition-colors ${
                      generationType === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGenerationType('upload')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">Upload Your Image</h3>
                          <p className="text-sm text-gray-600">Use your own artwork or photo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Generation Option */}
                  <Card 
                    className={`cursor-pointer border-2 transition-colors ${
                      generationType === 'ai' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGenerationType('ai')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <div>
                          <h3 className="font-medium">Generate with AI</h3>
                          <p className="text-sm text-gray-600">Create unique artwork using DALL-E</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search Partners Option */}
                  <Card 
                    className={`cursor-pointer border-2 transition-colors ${
                      generationType === 'api' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGenerationType('api')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-green-600" />
                        <div>
                          <h3 className="font-medium">Search Partner Images</h3>
                          <p className="text-sm text-gray-600">Browse high-quality stock photos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Generation Type Specific Content */}
              {generationType === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    {uploadMutation.isPending ? (
                      <div>
                        <p className="text-gray-600 mb-2">Uploading...</p>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
                          <div className="h-2 bg-blue-500 rounded-full animate-pulse w-1/2"></div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-4">Drag and drop an image here, or click to select</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button variant="outline" asChild>
                            <span>Choose Image</span>
                          </Button>
                        </Label>
                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {generationType === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageDescription">Image Description *</Label>
                    <Textarea
                      id="imageDescription"
                      value={imageDescription}
                      onChange={(e) => setImageDescription(e.target.value)}
                      placeholder="Describe the image you want to generate (e.g., 'A futuristic cityscape at sunset with neon lights and flying cars')"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="style">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((styleOption) => (
                          <SelectItem key={styleOption.value} value={styleOption.value}>
                            {styleOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleGenerateAI} 
                    disabled={isGenerating || !artistName || !imageDescription}
                    className="w-full"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Image'}
                  </Button>
                </div>
              )}

              {generationType === 'api' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="searchQuery">Search Terms</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="searchQuery"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter keywords (e.g., 'sunset', 'urban', 'nature')"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchImages()}
                      />
                      <Button onClick={handleSearchImages} disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {searchResults.map((image) => (
                        <div
                          key={image.id}
                          className="relative group cursor-pointer rounded-lg overflow-hidden"
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image.url}
                            alt=""
                            className="w-full h-24 object-cover group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Images */}
              {recentImages.length > 0 && !selectedImage && (
                <div className="space-y-3">
                  <Label>Recent Uploads</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {recentImages.map((image: any) => (
                      <div
                        key={image.id}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => handleImageSelect(image)}
                      >
                        <img
                          src={`/api/image/${image.id}`}
                          alt={image.title}
                          className="w-full h-20 object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <Label>Image Preview</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex items-center justify-center bg-gray-50">
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedImage.url}
                      alt="Selected cover image"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">
                        {selectedImage.source === 'upload' ? 'Uploaded' : 
                         selectedImage.source === 'dall-e' ? 'AI Generated' : 'Stock Photo'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">Select or upload an image to see preview</p>
                  </div>
                )}
              </div>

              {selectedImage && (
                <Button 
                  onClick={handleNextStep}
                  size="lg"
                  className="w-full"
                >
                  Next Step - Choose Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}