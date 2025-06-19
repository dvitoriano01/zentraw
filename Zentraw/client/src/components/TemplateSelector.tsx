import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Palette } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic';
  preview: string;
  style: {
    overlay: string;
    textColor: string;
    shadowColor: string;
    gradient: string;
  };
}

interface TemplateSelectorProps {
  imageData: {
    image: any;
    artistName: string;
    albumName: string;
  };
  onTemplateSelected?: (template: Template) => void;
  onBack?: () => void;
}

export function TemplateSelector({ imageData, onTemplateSelected, onBack }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const templates: Template[] = [
    {
      id: 'modern-clean',
      name: 'Clean Modern',
      category: 'modern',
      preview: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.1) 100%)',
      style: {
        overlay: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.1) 100%)',
        textColor: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.8)',
        gradient: 'clean'
      }
    },
    {
      id: 'modern-bold',
      name: 'Bold Typography',
      category: 'modern',
      preview: 'linear-gradient(45deg, rgba(255,0,150,0.4) 0%, rgba(0,204,255,0.4) 100%)',
      style: {
        overlay: 'linear-gradient(45deg, rgba(255,0,150,0.4) 0%, rgba(0,204,255,0.4) 100%)',
        textColor: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.9)',
        gradient: 'bold'
      }
    },
    {
      id: 'futuristic-neon',
      name: 'Neon Grid',
      category: 'futuristic',
      preview: 'linear-gradient(45deg, rgba(0,255,255,0.3) 0%, rgba(255,0,255,0.3) 100%)',
      style: {
        overlay: 'linear-gradient(45deg, rgba(0,255,255,0.3) 0%, rgba(255,0,255,0.3) 100%)',
        textColor: '#00ffff',
        shadowColor: 'rgba(255,0,255,0.8)',
        gradient: 'neon'
      }
    },
    {
      id: 'futuristic-chrome',
      name: 'Chrome Effect',
      category: 'futuristic',
      preview: 'linear-gradient(90deg, rgba(192,192,192,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(192,192,192,0.4) 100%)',
      style: {
        overlay: 'linear-gradient(90deg, rgba(192,192,192,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(192,192,192,0.4) 100%)',
        textColor: '#c0c0c0',
        shadowColor: 'rgba(0,0,0,0.9)',
        gradient: 'chrome'
      }
    },
    {
      id: 'vintage-film',
      name: 'Retro Film',
      category: 'vintage',
      preview: 'radial-gradient(circle, rgba(255,220,180,0.4) 0%, rgba(139,69,19,0.6) 100%)',
      style: {
        overlay: 'radial-gradient(circle, rgba(255,220,180,0.4) 0%, rgba(139,69,19,0.6) 100%)',
        textColor: '#fff5e6',
        shadowColor: 'rgba(139,69,19,0.9)',
        gradient: 'sepia'
      }
    },
    {
      id: 'vintage-poster',
      name: 'Vintage Poster',
      category: 'vintage',
      preview: 'linear-gradient(180deg, rgba(255,165,0,0.3) 0%, rgba(255,69,0,0.5) 100%)',
      style: {
        overlay: 'linear-gradient(180deg, rgba(255,165,0,0.3) 0%, rgba(255,69,0,0.5) 100%)',
        textColor: '#ffe4b5',
        shadowColor: 'rgba(139,0,0,0.8)',
        gradient: 'vintage'
      }
    },
    {
      id: 'urban-street',
      name: 'Street Art',
      category: 'urban',
      preview: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(255,255,0,0.2) 100%)',
      style: {
        overlay: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(255,255,0,0.2) 100%)',
        textColor: '#ffff00',
        shadowColor: 'rgba(0,0,0,0.9)',
        gradient: 'urban'
      }
    },
    {
      id: 'urban-grunge',
      name: 'Grunge Style',
      category: 'urban',
      preview: 'radial-gradient(ellipse, rgba(128,128,128,0.4) 0%, rgba(0,0,0,0.7) 100%)',
      style: {
        overlay: 'radial-gradient(ellipse, rgba(128,128,128,0.4) 0%, rgba(0,0,0,0.7) 100%)',
        textColor: '#dcdcdc',
        shadowColor: 'rgba(0,0,0,0.9)',
        gradient: 'grunge'
      }
    },
    {
      id: 'classic-elegant',
      name: 'Elegant Classic',
      category: 'classic',
      preview: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(255,215,0,0.2) 100%)',
      style: {
        overlay: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(255,215,0,0.2) 100%)',
        textColor: '#ffd700',
        shadowColor: 'rgba(0,0,0,0.8)',
        gradient: 'elegant'
      }
    },
    {
      id: 'classic-minimal',
      name: 'Minimalist',
      category: 'classic',
      preview: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)',
      style: {
        overlay: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        textColor: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.7)',
        gradient: 'minimal'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'modern', name: 'Modern' },
    { id: 'futuristic', name: 'Futuristic' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'urban', name: 'Urban' },
    { id: 'classic', name: 'Classic' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleNextStep = () => {
    if (selectedTemplate && onTemplateSelected) {
      onTemplateSelected(selectedTemplate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Palette className="w-6 h-6" />
                Choose Template
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Select a template for "{imageData.artistName} - {imageData.albumName}"
              </p>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Categories and Templates */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-3">
                      <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
                        {/* Template Preview */}
                        <div 
                          className="w-full h-full relative"
                          style={{
                            background: `url(${imageData.image.url}) center/cover, ${template.preview}`,
                            backgroundBlendMode: 'overlay'
                          }}
                        >
                          <div className="absolute inset-0 flex flex-col justify-end p-2">
                            <div 
                              className="text-xs font-bold"
                              style={{ 
                                color: template.style.textColor,
                                textShadow: `1px 1px 2px ${template.style.shadowColor}`
                              }}
                            >
                              {imageData.artistName}
                            </div>
                            <div 
                              className="text-xs"
                              style={{ 
                                color: template.style.textColor,
                                textShadow: `1px 1px 2px ${template.style.shadowColor}`
                              }}
                            >
                              {imageData.albumName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium text-sm">{template.name}</h3>
                        <Badge variant="secondary" className="text-xs mt-1 capitalize">
                          {template.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="aspect-square border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  {selectedTemplate ? (
                    <div 
                      className="w-full h-full relative"
                      style={{
                        background: `url(${imageData.image.url}) center/cover, ${selectedTemplate.preview}`,
                        backgroundBlendMode: 'overlay'
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div 
                          className="text-2xl font-bold mb-2"
                          style={{ 
                            color: selectedTemplate.style.textColor,
                            textShadow: `2px 2px 4px ${selectedTemplate.style.shadowColor}`
                          }}
                        >
                          {imageData.artistName}
                        </div>
                        <div 
                          className="text-lg"
                          style={{ 
                            color: selectedTemplate.style.textColor,
                            textShadow: `2px 2px 4px ${selectedTemplate.style.shadowColor}`
                          }}
                        >
                          {imageData.albumName}
                        </div>
                      </div>
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div 
                          className="text-6xl font-bold opacity-10 transform rotate-12"
                          style={{ color: selectedTemplate.style.textColor }}
                        >
                          zentraw.com
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-500">Select a template to preview</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedTemplate && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Template: {selectedTemplate.name}</h4>
                    <div className="text-xs text-gray-600">
                      <div>Category: {selectedTemplate.category}</div>
                      <div>Style: Professional overlay with custom typography</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleNextStep}
                    size="lg"
                    className="w-full"
                  >
                    Continue to Editor
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}