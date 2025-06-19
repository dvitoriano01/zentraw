import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Upload, 
  Search, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRight,
  ArrowLeft,
  Plus,
  ChevronDown
} from "lucide-react";
import { TemplateLibrary } from "@/components/TemplateLibrary";

export default function Content() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form states
  const [artistName, setArtistName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [generationType, setGenerationType] = useState<'upload' | 'ai' | 'api' | null>(null);
  const [imageDescription, setImageDescription] = useState("");
  const [style, setStyle] = useState("modern");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Workflow states
  const [currentStep, setCurrentStep] = useState<'generator' | 'template' | 'editor'>('generator');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/content"],
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
      
      const imageResult = {
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
    const imageResult = {
      id: image.id.toString(),
      url: image.type === 'upload' ? `/api/image/${image.id}` : image.url,
      source: image.type === 'upload' ? 'upload' : 'pexels',
      width: 2048,
      height: 2048
    };
    setSelectedImage(imageResult);
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cover Art Generator</h2>
              <p className="text-gray-600">Create professional cover art for your music</p>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">AI Powered</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Template Selection Step */}
          {currentStep === 'template' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Choose Template</CardTitle>
                    <p className="text-gray-600">Select a design template for your cover art</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('generator')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Generator
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TemplateLibrary
                  selectedImage={selectedImage}
                  artistName={artistName}
                  albumName={albumName}
                  onTemplateSelect={(template) => {
                    setSelectedTemplate(template);
                    setCurrentStep('editor');
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Editor Step */}
          {currentStep === 'editor' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Edit Cover Art</CardTitle>
                    <p className="text-gray-600">Customize your cover art design</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('template')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Templates
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-square rounded-lg overflow-hidden relative bg-gray-100">
                    {selectedImage && (
                      <img
                        src={selectedImage.url}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        style={{ filter: selectedTemplate?.style.filter }}
                      />
                    )}
                    {selectedTemplate && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ 
                          background: selectedTemplate.style.overlay 
                        }}
                      >
                        <div className="text-center">
                          <div 
                            className="text-4xl font-bold mb-4"
                            style={{ 
                              color: selectedTemplate.style.textColor,
                              textShadow: `3px 3px 6px ${selectedTemplate.style.shadowColor}`
                            }}
                          >
                            {artistName}
                          </div>
                          <div 
                            className="text-2xl"
                            style={{ 
                              color: selectedTemplate.style.textColor,
                              textShadow: `2px 2px 4px ${selectedTemplate.style.shadowColor}`
                            }}
                          >
                            {albumName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep('template')}
                      className="flex-1"
                    >
                      Choose Different Template
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Cover art completed!",
                          description: "Your cover art has been generated successfully."
                        });
                        setCurrentStep('generator');
                        setSelectedImage(null);
                        setSelectedTemplate(null);
                        setArtistName("");
                        setAlbumName("");
                        setGenerationType(null);
                        queryClient.invalidateQueries({ queryKey: ["/api/content"] });
                      }}
                      className="flex-1"
                    >
                      Save Cover Art
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generator Step (Default) */}
          {currentStep === 'generator' && (
            <Card>
              <CardContent className="p-8">
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
                    
                    <Select value={generationType || ''} onValueChange={(value: any) => setGenerationType(value)}>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          {generationType === 'upload' && <Upload className="w-4 h-4" />}
                          {generationType === 'ai' && <Sparkles className="w-4 h-4" />}
                          {generationType === 'api' && <Search className="w-4 h-4" />}
                          <SelectValue placeholder="Select generation method" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upload">
                          <div className="flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Your Image
                          </div>
                        </SelectItem>
                        <SelectItem value="ai">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Generate with AI
                          </div>
                        </SelectItem>
                        <SelectItem value="api">
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4" />
                            Search Partner Images
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dropdown Content Based on Selection */}
                  {generationType === 'upload' && (
                    <Card className="border-dashed">
                      <CardContent className="p-6 text-center">
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
                      </CardContent>
                    </Card>
                  )}

                  {generationType === 'ai' && (
                    <Card>
                      <CardContent className="p-6 space-y-4">
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
                      </CardContent>
                    </Card>
                  )}

                  {generationType === 'api' && (
                    <Card>
                      <CardContent className="p-6 space-y-4">
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
                      </CardContent>
                    </Card>
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
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (!artistName || !albumName) {
                          toast({
                            title: "Missing information",
                            description: "Please fill in artist name and album name first",
                            variant: "destructive"
                          });
                          return;
                        }
                        setCurrentStep('template');
                      }}
                    >
                      Next Step - Choose Template
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          )}

          {/* Recent Content Gallery */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Content</h3>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : content.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {content
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 12)
                  .map((item: any) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {item.fileData && (
                        <img
                          src={`/api/image/${item.id}`}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div 
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center cursor-pointer"
                        onClick={() => handleImageSelect(item)}
                      >
                        <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No content yet. Create your first cover art!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}