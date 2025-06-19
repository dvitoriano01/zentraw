import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Palette, Image, Sparkles, Upload, ImageIcon, Plus } from "lucide-react";
import { CoverGeneratorNew } from "@/components/CoverGeneratorNew";
import { TemplateSelector } from "@/components/TemplateSelector";
import { CoverEditor } from "@/components/CoverEditor";

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
  
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["/api/content"],
  });

  const form = useForm({
    defaultValues: {
      title: "",
      prompt: "",
      style: "modern",
    },
  });

  const generateCoverMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/content/cover", {
        userId: 1,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Capa gerada com sucesso!",
        description: "Sua nova capa foi criada pela IA.",
      });
      setIsGenerating(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao gerar capa",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const onSubmit = (data: any) => {
    generateCoverMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Geração de Conteúdo</h2>
              <p className="text-gray-600">Crie capas de álbum e arte promocional com IA</p>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">DALL-E Integrado</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {/* Cover Generator Workflow */}
          {currentStep === 'generator' && (
            <CoverGeneratorNew 
              onImageSelected={(data) => {
                setSelectedImageData(data);
                setCurrentStep('template');
              }}
            />
          )}
          
          {currentStep === 'template' && selectedImageData && (
            <TemplateSelector
              imageData={selectedImageData}
              onTemplateSelected={(template) => {
                setSelectedTemplate(template);
                setCurrentStep('editor');
              }}
              onBack={() => setCurrentStep('generator')}
            />
          )}
          
          {currentStep === 'editor' && selectedImageData && selectedTemplate && (
            <CoverEditor
              image={selectedImageData.image}
              artistName={selectedImageData.artistName}
              trackName={selectedImageData.albumName}
              template={selectedTemplate}
              onComplete={(finalData) => {
                queryClient.invalidateQueries({ queryKey: ["/api/content"] });
                setCurrentStep('generator');
                setSelectedImageData(null);
                setSelectedTemplate(null);
                toast({
                  title: "Cover created successfully!",
                  description: "Your cover art has been saved to your gallery."
                });
              }}
              onBack={() => setCurrentStep('template')}
            />
          )}
          
          {/* Content Gallery - Only show when not in generator workflow */}
          {currentStep === 'generator' && (
            <div className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Generator Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">
                  <Palette className="w-5 h-5 inline-block mr-2" />
                  Criar Nova Capa
                </h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Capa</FormLabel>
                          <FormControl>
                            <Input placeholder="Summer Vibes EP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Imagem</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Uma paisagem tropical com cores vibrantes, pôr do sol sobre a praia, elementos futuristas..."
                              rows={4}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estilo</FormLabel>
                          <FormControl>
                            <select 
                              className="w-full p-2 border border-gray-300 rounded-md"
                              {...field}
                            >
                              <option value="modern">Moderno</option>
                              <option value="vintage">Vintage</option>
                              <option value="minimalist">Minimalista</option>
                              <option value="abstract">Abstrato</option>
                              <option value="cyberpunk">Cyberpunk</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        <>
                          <Image className="w-4 h-4 mr-2" />
                          Gerar Capa
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Preview da Última Imagem Gerada */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6">Prévia da Última Capa</h3>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative">
                  {isGenerating ? (
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                      <p className="text-gray-600">Gerando sua capa...</p>
                    </div>
                  ) : Array.isArray(content) && content.length > 0 ? (
                    <div className="w-full h-full relative">
                      <img 
                        src={content.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.fileUrl} 
                        alt="Última capa gerada"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <div class="text-center">
                                  <div class="w-12 h-12 mx-auto mb-4 text-gray-400">📷</div>
                                  <p>Imagem expirada</p>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />

                      
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 bg-white/90 hover:bg-white"
                          onClick={() => {
                            const latestImage = content.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                            // Open watermarked version in modal
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                            modal.innerHTML = `
                              <div class="relative max-w-4xl max-h-screen p-4">
                                <div class="relative bg-white rounded-lg overflow-hidden">
                                  <div class="relative">
                                    <img src="${latestImage?.fileUrl}" class="w-full h-auto max-h-[80vh] object-contain" />
                                    
                                    <!-- Centro - 10% -->
                                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                      <div class="text-white text-opacity-60 font-bold select-none" 
                                           style="font-size: min(10vw, 10vh, 80px); transform: rotate(-30deg);">
                                        ZENTRAW
                                      </div>
                                    </div>
                                    
                                    <!-- Superior esquerda - 5% -->
                                    <div class="absolute top-1/4 left-1/4 pointer-events-none">
                                      <div class="text-white text-opacity-60 font-bold select-none" 
                                           style="font-size: min(5vw, 5vh, 40px); transform: rotate(-30deg);">
                                        ZENTRAW
                                      </div>
                                    </div>
                                    
                                    <!-- Inferior direita - 5% -->
                                    <div class="absolute bottom-1/4 right-1/4 pointer-events-none">
                                      <div class="text-white text-opacity-60 font-bold select-none" 
                                           style="font-size: min(5vw, 5vh, 40px); transform: rotate(-30deg);">
                                        ZENTRAW
                                      </div>
                                    </div>
                                  </div>
                                  <button class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                          onclick="this.closest('.fixed').remove()">×</button>
                                </div>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                        >
                          Ver com Marca D'água
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            const latestImage = content.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                            
                            // Create simple text overlay demo
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg max-w-4xl w-full p-6">
                                <div class="flex justify-between items-center mb-4">
                                  <h3 class="text-lg font-bold">Editor de Template - Demonstração CSS</h3>
                                  <button class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center">×</button>
                                </div>
                                
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <!-- Controls -->
                                  <div class="space-y-4">
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Nome do Artista</label>
                                      <input type="text" id="artistInput" value="PlayitAgain" 
                                             class="w-full p-2 border border-gray-300 rounded-md">
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Título da Música</label>
                                      <input type="text" id="titleInput" value="Electronic Vibes" 
                                             class="w-full p-2 border border-gray-300 rounded-md">
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Posição Base</label>
                                      <select id="positionSelect" class="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="bottom">Inferior</option>
                                        <option value="top">Superior</option>
                                        <option value="center">Centro</option>
                                        <option value="left">Esquerda</option>
                                        <option value="right">Direita</option>
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Nudge Tool - Ajuste Fino</label>
                                      <div class="grid grid-cols-3 gap-2 w-32 mx-auto">
                                        <div></div>
                                        <button data-nudge="up" class="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm">↑</button>
                                        <div></div>
                                        <button data-nudge="left" class="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm">←</button>
                                        <button data-nudge="reset" class="bg-red-200 hover:bg-red-300 p-2 rounded text-xs">R</button>
                                        <button data-nudge="right" class="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm">→</button>
                                        <div></div>
                                        <button data-nudge="down" class="bg-gray-200 hover:bg-gray-300 p-2 rounded text-sm">↓</button>
                                        <div></div>
                                      </div>
                                      <p class="text-xs text-gray-500 mt-1 text-center">Ajuste com precisão pixel</p>
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Fonte</label>
                                      <select id="fontSelect" class="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="Arial">Arial</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Impact">Impact</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                      </select>
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Tamanho da Fonte</label>
                                      <div class="flex items-center gap-2">
                                        <input type="range" id="fontSizeSlider" min="12" max="72" value="24" class="flex-1">
                                        <input type="number" id="fontSizeInput" min="12" max="72" value="24" class="w-16 p-1 border border-gray-300 rounded text-sm">
                                        <span class="text-sm text-gray-600">px</span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Cores do Texto</label>
                                      <div class="flex gap-2">
                                        <button data-color="white" class="w-6 h-6 bg-white border-2 border-gray-300 rounded"></button>
                                        <button data-color="black" class="w-6 h-6 bg-black border-2 border-gray-300 rounded"></button>
                                        <button data-color="red" class="w-6 h-6 bg-red-500 border-2 border-gray-300 rounded"></button>
                                        <button data-color="blue" class="w-6 h-6 bg-blue-500 border-2 border-gray-300 rounded"></button>
                                        <button data-color="purple" class="w-6 h-6 bg-purple-500 border-2 border-gray-300 rounded"></button>
                                        <button data-color="gold" class="w-6 h-6 bg-yellow-500 border-2 border-gray-300 rounded"></button>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label class="block text-sm font-medium mb-2">Filtros da Imagem</label>
                                      <select id="filterSelect" class="w-full p-2 border border-gray-300 rounded-md mb-2">
                                        <option value="none">Sem Filtro</option>
                                        <option value="vintage">Vintage</option>
                                        <option value="cool">Cool</option>
                                        <option value="warm">Warm</option>
                                        <option value="dramatic">Dramático</option>
                                        <option value="bw">Preto e Branco</option>
                                        <option value="sepia">Sépia</option>
                                      </select>
                                      
                                      <label class="block text-sm font-medium mb-2">Overlay</label>
                                      <select id="overlaySelect" class="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="none">Sem Overlay</option>
                                        <option value="dark">Escuro</option>
                                        <option value="light">Claro</option>
                                        <option value="gradient-dark">Gradiente Escuro</option>
                                        <option value="gradient-light">Gradiente Claro</option>
                                        <option value="vignette">Vinheta</option>
                                      </select>
                                    </div>
                                    
                                    <div class="pt-4 space-y-2">
                                      <button id="templateLibraryBtn" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-3">
                                        📚 Biblioteca de Templates Profissionais
                                      </button>
                                      
                                      <p class="text-sm text-gray-600 mb-1">✅ Nudge Tool para ajuste preciso</p>
                                      <p class="text-sm text-gray-600 mb-1">✅ Filtros e overlays profissionais</p>
                                      <p class="text-sm text-gray-600 mb-1">✅ Tipografia personalizada</p>
                                      <p class="text-sm text-gray-600">✅ Templates pré-configurados</p>
                                    </div>
                                  </div>
                                  
                                  <!-- Preview -->
                                  <div class="relative">
                                    <div id="imageContainer" class="relative bg-gray-900 rounded-lg overflow-hidden">
                                      <img id="previewImage" src="${latestImage?.fileUrl}" class="w-full h-auto" />
                                      
                                      <!-- Overlay Layer -->
                                      <div id="overlayLayer" class="absolute inset-0"></div>
                                      
                                      <div id="artistOverlay" class="absolute bottom-16 left-4 text-white font-bold text-2xl drop-shadow-lg" 
                                           style="text-shadow: 2px 2px 4px rgba(0,0,0,0.9); font-family: Arial;">
                                        PLAYITAGAIN
                                      </div>
                                      <div id="titleOverlay" class="absolute bottom-6 left-4 text-white font-medium text-lg drop-shadow-lg" 
                                           style="text-shadow: 2px 2px 4px rgba(0,0,0,0.9); font-family: Arial;">
                                        ELECTRONIC VIBES
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            `;
                            
                            document.body.appendChild(modal);
                            
                            // Add event listeners after modal is in DOM
                            setTimeout(() => {
                              const artistInput = modal.querySelector('#artistInput');
                              const titleInput = modal.querySelector('#titleInput');
                              const positionSelect = modal.querySelector('#positionSelect');
                              const fontSelect = modal.querySelector('#fontSelect');
                              const fontSizeSlider = modal.querySelector('#fontSizeSlider');
                              const fontSizeInput = modal.querySelector('#fontSizeInput');
                              const filterSelect = modal.querySelector('#filterSelect');
                              const overlaySelect = modal.querySelector('#overlaySelect');
                              const colorButtons = modal.querySelectorAll('[data-color]');
                              const nudgeButtons = modal.querySelectorAll('[data-nudge]');
                              const closeBtn = modal.querySelector('button');
                              const artistOverlay = modal.querySelector('#artistOverlay');
                              const titleOverlay = modal.querySelector('#titleOverlay');
                              const previewImage = modal.querySelector('#previewImage');
                              const overlayLayer = modal.querySelector('#overlayLayer');
                              const templateLibraryBtn = modal.querySelector('#templateLibraryBtn');
                              
                              let nudgeX = 0;
                              let nudgeY = 0;
                              
                              const updateText = () => {
                                if (artistOverlay && titleOverlay && artistInput && titleInput) {
                                  artistOverlay.textContent = (artistInput.value || 'ARTISTA').toUpperCase();
                                  titleOverlay.textContent = (titleInput.value || 'TÍTULO').toUpperCase();
                                  
                                  const position = positionSelect?.value || 'bottom';
                                  const font = fontSelect?.value || 'Arial';
                                  const fontSize = fontSizeSlider?.value || '24';
                                  
                                  artistOverlay.style.fontFamily = font;
                                  titleOverlay.style.fontFamily = font;
                                  artistOverlay.style.fontSize = fontSize + 'px';
                                  titleOverlay.style.fontSize = (parseInt(fontSize) * 0.8) + 'px';
                                  
                                  if (fontSizeInput) fontSizeInput.value = fontSize;
                                  
                                  // Apply position with nudge
                                  if (position === 'bottom') {
                                    artistOverlay.style.bottom = (64 + nudgeY) + 'px';
                                    artistOverlay.style.left = (16 + nudgeX) + 'px';
                                    titleOverlay.style.bottom = (24 + nudgeY) + 'px';
                                    titleOverlay.style.left = (16 + nudgeX) + 'px';
                                  } else if (position === 'top') {
                                    artistOverlay.style.top = (24 + nudgeY) + 'px';
                                    artistOverlay.style.left = (16 + nudgeX) + 'px';
                                    titleOverlay.style.top = (56 + nudgeY) + 'px';
                                    titleOverlay.style.left = (16 + nudgeX) + 'px';
                                  }
                                }
                              };
                              
                              const updateFilters = () => {
                                if (!previewImage || !overlayLayer) return;
                                
                                const filter = filterSelect?.value || 'none';
                                const overlay = overlaySelect?.value || 'none';
                                
                                // Apply filters
                                if (filter === 'vintage') {
                                  previewImage.style.filter = 'sepia(0.5) contrast(1.2)';
                                } else if (filter === 'cool') {
                                  previewImage.style.filter = 'hue-rotate(240deg) saturate(1.2)';
                                } else if (filter === 'warm') {
                                  previewImage.style.filter = 'hue-rotate(30deg) saturate(1.3)';
                                } else if (filter === 'dramatic') {
                                  previewImage.style.filter = 'contrast(1.5) brightness(0.8)';
                                } else if (filter === 'bw') {
                                  previewImage.style.filter = 'grayscale(1)';
                                } else if (filter === 'sepia') {
                                  previewImage.style.filter = 'sepia(1)';
                                } else {
                                  previewImage.style.filter = 'none';
                                }
                                
                                // Apply overlays
                                if (overlay === 'dark') {
                                  overlayLayer.style.background = 'rgba(0,0,0,0.3)';
                                } else if (overlay === 'light') {
                                  overlayLayer.style.background = 'rgba(255,255,255,0.2)';
                                } else if (overlay === 'gradient-dark') {
                                  overlayLayer.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.6))';
                                } else if (overlay === 'vignette') {
                                  overlayLayer.style.background = 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.5) 100%)';
                                } else {
                                  overlayLayer.style.background = 'none';
                                }
                              };
                              
                              // Event listeners
                              if (nudgeButtons) {
                                nudgeButtons.forEach(btn => {
                                  btn.addEventListener('click', () => {
                                    const direction = btn.getAttribute('data-nudge');
                                    if (direction === 'up') nudgeY -= 5;
                                    else if (direction === 'down') nudgeY += 5;
                                    else if (direction === 'left') nudgeX -= 5;
                                    else if (direction === 'right') nudgeX += 5;
                                    else if (direction === 'reset') { nudgeX = 0; nudgeY = 0; }
                                    updateText();
                                  });
                                });
                              }
                              
                              artistInput?.addEventListener('input', updateText);
                              titleInput?.addEventListener('input', updateText);
                              positionSelect?.addEventListener('change', updateText);
                              fontSelect?.addEventListener('change', updateText);
                              fontSizeSlider?.addEventListener('input', updateText);
                              filterSelect?.addEventListener('change', updateFilters);
                              overlaySelect?.addEventListener('change', updateFilters);
                              
                              if (colorButtons) {
                                colorButtons.forEach(btn => {
                                  btn.addEventListener('click', () => {
                                    const color = btn.getAttribute('data-color');
                                    if (artistOverlay && titleOverlay && color) {
                                      let colorValue = '#ffffff';
                                      if (color === 'black') colorValue = '#000000';
                                      else if (color === 'red') colorValue = '#ef4444';
                                      else if (color === 'blue') colorValue = '#3b82f6';
                                      else if (color === 'purple') colorValue = '#8b5cf6';
                                      else if (color === 'gold') colorValue = '#eab308';
                                      
                                      artistOverlay.style.color = colorValue;
                                      titleOverlay.style.color = colorValue;
                                    }
                                  });
                                });
                              }
                              
                              templateLibraryBtn?.addEventListener('click', () => {
                                // Create template library modal
                                const templateModal = document.createElement('div');
                                templateModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                                
                                const templates = [
                                  {
                                    name: 'Corporate Dark',
                                    category: 'Profissional',
                                    filter: 'contrast(1.2) brightness(0.9)',
                                    overlay: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
                                    textColor: '#ffffff',
                                    font: 'Helvetica',
                                    fontSize: '32'
                                  },
                                  {
                                    name: 'Golden Luxury',
                                    category: 'Premium',
                                    filter: 'contrast(1.3) brightness(0.8) saturate(1.2)',
                                    overlay: 'radial-gradient(ellipse at center, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.3) 100%)',
                                    textColor: '#ffd700',
                                    font: 'Georgia',
                                    fontSize: '28'
                                  },
                                  {
                                    name: 'Neon Cyber',
                                    category: 'Moderno',
                                    filter: 'contrast(1.4) saturate(1.5) hue-rotate(240deg)',
                                    overlay: 'linear-gradient(45deg, rgba(138,43,226,0.2) 0%, rgba(0,191,255,0.2) 100%)',
                                    textColor: '#00ffff',
                                    font: 'Impact',
                                    fontSize: '30'
                                  },
                                  {
                                    name: 'Vintage Sepia',
                                    category: 'Retrô',
                                    filter: 'sepia(0.8) contrast(1.3) brightness(0.9)',
                                    overlay: 'radial-gradient(circle, transparent 30%, rgba(139,69,19,0.4) 100%)',
                                    textColor: '#f4e4bc',
                                    font: 'Times New Roman',
                                    fontSize: '26'
                                  },
                                  {
                                    name: 'Ocean Blue',
                                    category: 'Natural',
                                    filter: 'hue-rotate(200deg) saturate(1.4) brightness(1.1)',
                                    overlay: 'linear-gradient(to bottom, rgba(0,119,190,0.2), rgba(0,86,179,0.6))',
                                    textColor: '#ffffff',
                                    font: 'Verdana',
                                    fontSize: '28'
                                  },
                                  {
                                    name: 'Minimal White',
                                    category: 'Clean',
                                    filter: 'brightness(1.1) saturate(0.8)',
                                    overlay: 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
                                    textColor: '#1e293b',
                                    font: 'Georgia',
                                    fontSize: '30'
                                  }
                                ];
                                
                                let templatesHTML = '';
                                templates.forEach((template, index) => {
                                  templatesHTML += '<div class="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300 rounded-lg p-4 bg-white template-card" data-template="' + index + '">';
                                  templatesHTML += '<div class="w-full h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden" style="background: ' + template.overlay + '">';
                                  templatesHTML += '<div class="text-center" style="font-family: ' + template.font + '; color: ' + template.textColor + '; font-size: 12px; font-weight: 700; text-shadow: 2px 2px 4px rgba(0,0,0,0.8)">ARTIST<br/>TITLE</div>';
                                  templatesHTML += '</div>';
                                  templatesHTML += '<h4 class="font-semibold text-gray-900 mb-1">' + template.name + '</h4>';
                                  templatesHTML += '<p class="text-sm text-gray-600 mb-2">' + template.category + '</p>';
                                  templatesHTML += '<button class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 text-sm">Aplicar Template</button>';
                                  templatesHTML += '</div>';
                                });
                                
                                templateModal.innerHTML = '<div class="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] relative flex flex-col"><div class="flex justify-between items-center p-6 border-b"><div><h3 class="text-xl font-bold text-gray-900">Templates Profissionais</h3><p class="text-gray-600">Escolha um template e ele será aplicado automaticamente</p></div><button id="closeTemplateModal" class="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 text-lg font-bold shrink-0">×</button></div><div class="overflow-y-auto flex-1 p-6"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">' + templatesHTML + '</div><div class="border-t pt-6"><h4 class="font-semibold mb-3">Upload Seus Templates Personalizados</h4><div class="flex gap-4 mb-3"><input type="file" id="templateUpload" accept=".json,.css,.svg" class="flex-1 p-2 border border-gray-300 rounded-md"><button id="uploadTemplateBtn" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Enviar Template</button></div><div class="text-sm text-gray-600 space-y-2"><p><strong>JSON:</strong> Configuração completa (filtros, overlays, cores, fontes)</p><p><strong>CSS:</strong> Estilos avançados e animações personalizadas</p><p><strong>SVG:</strong> Layouts vetoriais com texto editável e transparências</p></div></div></div></div>';
                                
                                document.body.appendChild(templateModal);
                                
                                // Template selection
                                templateModal.querySelectorAll('.template-card').forEach(card => {
                                  card.addEventListener('click', () => {
                                    const templateIndex = card.getAttribute('data-template');
                                    const selectedTemplate = templates[parseInt(templateIndex)];
                                    
                                    // Apply template
                                    if (previewImage && overlayLayer && artistOverlay && titleOverlay) {
                                      previewImage.style.filter = selectedTemplate.filter;
                                      overlayLayer.style.background = selectedTemplate.overlay;
                                      artistOverlay.style.color = selectedTemplate.textColor;
                                      titleOverlay.style.color = selectedTemplate.textColor;
                                      artistOverlay.style.fontFamily = selectedTemplate.font;
                                      titleOverlay.style.fontFamily = selectedTemplate.font;
                                      artistOverlay.style.fontSize = selectedTemplate.fontSize + 'px';
                                      titleOverlay.style.fontSize = (parseInt(selectedTemplate.fontSize) * 0.8) + 'px';
                                      
                                      // Update form controls
                                      if (fontSelect) fontSelect.value = selectedTemplate.font;
                                      if (fontSizeSlider) fontSizeSlider.value = selectedTemplate.fontSize;
                                      if (fontSizeInput) fontSizeInput.value = selectedTemplate.fontSize;
                                      
                                      // Set filter based on template
                                      if (filterSelect) {
                                        if (selectedTemplate.filter.includes('sepia')) filterSelect.value = 'sepia';
                                        else if (selectedTemplate.filter.includes('hue-rotate(240')) filterSelect.value = 'cool';
                                        else if (selectedTemplate.filter.includes('hue-rotate(200')) filterSelect.value = 'cool';
                                        else if (selectedTemplate.filter.includes('contrast(1.4)')) filterSelect.value = 'dramatic';
                                        else if (selectedTemplate.filter.includes('brightness(1.1)')) filterSelect.value = 'warm';
                                        else filterSelect.value = 'vintage';
                                      }
                                      
                                      if (overlaySelect) {
                                        if (selectedTemplate.overlay.includes('radial-gradient')) overlaySelect.value = 'vignette';
                                        else if (selectedTemplate.overlay.includes('rgba(255,255,255')) overlaySelect.value = 'light';
                                        else if (selectedTemplate.overlay.includes('rgba(0,0,0')) overlaySelect.value = 'dark';
                                        else overlaySelect.value = 'gradient-dark';
                                      }
                                      
                                      updateText();
                                      updateFilters();
                                    }
                                    
                                    document.body.removeChild(templateModal);
                                  });
                                });
                                
                                // Template upload functionality
                                const uploadBtn = templateModal.querySelector('#uploadTemplateBtn');
                                const fileInput = templateModal.querySelector('#templateUpload');
                                
                                uploadBtn?.addEventListener('click', () => {
                                  const file = fileInput?.files?.[0];
                                  if (!file) {
                                    alert('Por favor, selecione um arquivo primeiro.');
                                    return;
                                  }
                                  
                                  const reader = new FileReader();
                                  reader.onload = (e) => {
                                    try {
                                      const content = e.target?.result;
                                      
                                      if (file.name.endsWith('.json')) {
                                        // Template JSON format
                                        const template = JSON.parse(content);
                                        if (template.name && template.filter && template.overlay && template.textColor) {
                                          // Apply custom template
                                          if (previewImage && overlayLayer && artistOverlay && titleOverlay) {
                                            previewImage.style.filter = template.filter;
                                            overlayLayer.style.background = template.overlay;
                                            artistOverlay.style.color = template.textColor;
                                            titleOverlay.style.color = template.textColor;
                                            if (template.font) {
                                              artistOverlay.style.fontFamily = template.font;
                                              titleOverlay.style.fontFamily = template.font;
                                            }
                                            if (template.fontSize) {
                                              artistOverlay.style.fontSize = template.fontSize + 'px';
                                              titleOverlay.style.fontSize = (parseInt(template.fontSize) * 0.8) + 'px';
                                            }
                                          }
                                          alert('Template "' + template.name + '" aplicado com sucesso!');
                                        } else {
                                          alert('Formato JSON inválido. Verifique se contém: name, filter, overlay, textColor');
                                        }
                                      } else if (file.name.endsWith('.css')) {
                                        // CSS styles
                                        const style = document.createElement('style');
                                        style.textContent = content;
                                        document.head.appendChild(style);
                                        alert('Estilos CSS aplicados!');
                                      } else if (file.name.endsWith('.svg')) {
                                        // SVG overlay com suporte avançado
                                        if (overlayLayer) {
                                          overlayLayer.innerHTML = content;
                                          overlayLayer.style.background = 'none';
                                          
                                          // Procurar por elementos de texto editáveis no SVG
                                          const svgTexts = overlayLayer.querySelectorAll('text[data-editable="true"]');
                                          const artistName = (artistInput?.value || 'ARTISTA').toUpperCase();
                                          const titleName = (titleInput?.value || 'TÍTULO').toUpperCase();
                                          
                                          svgTexts.forEach((textElement, index) => {
                                            if (textElement.getAttribute('data-type') === 'artist') {
                                              textElement.textContent = artistName;
                                            } else if (textElement.getAttribute('data-type') === 'title') {
                                              textElement.textContent = titleName;
                                            }
                                          });
                                          
                                          // Aplicar transparências se especificadas
                                          const transparentElements = overlayLayer.querySelectorAll('[data-opacity]');
                                          transparentElements.forEach(element => {
                                            const opacity = element.getAttribute('data-opacity');
                                            if (opacity) element.style.opacity = opacity;
                                          });
                                          
                                          // Aplicar texturas se especificadas
                                          const texturedElements = overlayLayer.querySelectorAll('[data-texture]');
                                          texturedElements.forEach(element => {
                                            const texture = element.getAttribute('data-texture');
                                            if (texture === 'noise') {
                                              element.style.filter = 'url(#noise-filter)';
                                            } else if (texture === 'grain') {
                                              element.style.filter = 'url(#grain-filter)';
                                            }
                                          });
                                        }
                                        alert('Layout SVG avançado aplicado com texto editável, transparências e texturas!');
                                      }
                                      
                                      document.body.removeChild(templateModal);
                                    } catch (error) {
                                      alert('Erro ao processar arquivo: ' + error.message);
                                    }
                                  };
                                  reader.readAsText(file);
                                });
                                
                                // Close template modal
                                const closeBtn = templateModal.querySelector('#closeTemplateModal');
                                closeBtn?.addEventListener('click', () => {
                                  document.body.removeChild(templateModal);
                                });
                                
                                // Close on backdrop click
                                templateModal.addEventListener('click', (e) => {
                                  if (e.target === templateModal) {
                                    document.body.removeChild(templateModal);
                                  }
                                });
                              });
                              
                              // Close button functionality
                              const modalCloseBtn = modal.querySelector('button');
                              modalCloseBtn?.addEventListener('click', () => {
                                document.body.removeChild(modal);
                              });
                              
                              // Close on backdrop click
                              modal.addEventListener('click', (e) => {
                                if (e.target === modal) {
                                  document.body.removeChild(modal);
                                }
                              });
                              
                              // Initial update
                              updateText();
                              updateFilters();
                            }, 100);
                          }}
                        >
                          Editar Template
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">Sua próxima capa aparecerá aqui</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Section - Full Width Below */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Galeria de Capas ({Array.isArray(content) ? content.length : 0})</h3>
              
              {Array.isArray(content) && content.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {content
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((item: any, index: number) => (
                    <div key={item.id || index} className="flex-none w-48 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100">
                        {item.fileUrl ? (
                          <img 
                            src={item.fileUrl} 
                            alt={item.title || 'Cover'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <div class="text-center">
                                      <div class="w-8 h-8 mx-auto mb-2 text-gray-400">📷</div>
                                      <p class="text-xs">Imagem expirada</p>
                                    </div>
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-xs">Sem imagem</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.title || 'Sem título'}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">{item.type || 'cover'}</Badge>
                          <Badge className={`text-xs ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.status || 'unknown'}
                          </Badge>
                        </div>
                        
                        {item.status === 'completed' && item.fileUrl && (
                          <div className="mt-3 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 text-xs"
                              onClick={() => window.open(item.fileUrl, '_blank')}
                            >
                              Ver
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 text-xs bg-purple-600 hover:bg-purple-700"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = item.fileUrl;
                                link.download = `${item.title?.replace(/\s+/g, '_') || 'cover'}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              Download
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="font-medium text-gray-900 mb-2">Nenhuma capa criada ainda</h4>
                  <p className="text-sm">Use o formulário acima para gerar sua primeira capa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}