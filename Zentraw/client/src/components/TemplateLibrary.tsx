import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Search, 
  Check,
  Star,
  Sparkles,
  Zap,
  Camera
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic' | 'minimalist';
  preview: string;
  style: {
    overlay: string;
    textColor: string;
    shadowColor: string;
    gradient: string;
    filter: string;
  };
  popular?: boolean;
}

interface TemplateLibraryProps {
  selectedImage: any;
  artistName: string;
  albumName: string;
  onTemplateSelect: (template: Template) => void;
}

export function TemplateLibrary({ selectedImage, artistName, albumName, onTemplateSelect }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: 'modern-gradient',
      name: 'Modern Gradient',
      category: 'modern',
      preview: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8))',
        textColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        gradient: 'linear-gradient(135deg, #3b82f6, #9333ea)',
        filter: 'contrast(1.1) saturate(1.2)'
      },
      popular: true
    },
    {
      id: 'neon-glow',
      name: 'Neon Glow',
      category: 'futuristic',
      preview: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(59, 130, 246, 0.9))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(59, 130, 246, 0.9))',
        textColor: '#ffffff',
        shadowColor: 'rgba(236, 72, 153, 0.8)',
        gradient: 'linear-gradient(135deg, #ec4899, #3b82f6)',
        filter: 'contrast(1.3) brightness(1.1)'
      },
      popular: true
    },
    {
      id: 'vintage-film',
      name: 'Vintage Film',
      category: 'vintage',
      preview: 'linear-gradient(135deg, rgba(217, 119, 6, 0.7), rgba(120, 53, 15, 0.8))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(217, 119, 6, 0.7), rgba(120, 53, 15, 0.8))',
        textColor: '#fef3c7',
        shadowColor: 'rgba(120, 53, 15, 0.8)',
        gradient: 'linear-gradient(135deg, #d97706, #78350f)',
        filter: 'sepia(0.3) contrast(1.1)'
      }
    },
    {
      id: 'urban-dark',
      name: 'Urban Dark',
      category: 'urban',
      preview: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(55, 65, 81, 0.9))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(55, 65, 81, 0.9))',
        textColor: '#f9fafb',
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        gradient: 'linear-gradient(135deg, #111827, #374151)',
        filter: 'contrast(1.2) brightness(0.9)'
      }
    },
    {
      id: 'classic-elegant',
      name: 'Classic Elegant',
      category: 'classic',
      preview: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(75, 85, 99, 0.8))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(75, 85, 99, 0.8))',
        textColor: '#f3f4f6',
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        gradient: 'linear-gradient(135deg, #1f2937, #4b5563)',
        filter: 'contrast(1.1)'
      }
    },
    {
      id: 'minimalist-clean',
      name: 'Minimalist Clean',
      category: 'minimalist',
      preview: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.9))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.9))',
        textColor: '#111827',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        gradient: 'linear-gradient(135deg, #ffffff, #f3f4f6)',
        filter: 'contrast(1.05) brightness(1.05)'
      }
    },
    {
      id: 'sunset-vibes',
      name: 'Sunset Vibes',
      category: 'modern',
      preview: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8), rgba(239, 68, 68, 0.8))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8), rgba(239, 68, 68, 0.8))',
        textColor: '#ffffff',
        shadowColor: 'rgba(239, 68, 68, 0.6)',
        gradient: 'linear-gradient(135deg, #fb923c, #ef4444)',
        filter: 'contrast(1.1) saturate(1.3)'
      }
    },
    {
      id: 'cyberpunk-neon',
      name: 'Cyberpunk Neon',
      category: 'futuristic',
      preview: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(14, 165, 233, 0.9))',
      style: {
        overlay: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(14, 165, 233, 0.9))',
        textColor: '#ffffff',
        shadowColor: 'rgba(168, 85, 247, 0.8)',
        gradient: 'linear-gradient(135deg, #a855f7, #0ea5e9)',
        filter: 'contrast(1.4) brightness(1.1) saturate(1.3)'
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Palette },
    { id: 'modern', name: 'Modern', icon: Sparkles },
    { id: 'futuristic', name: 'Futuristic', icon: Zap },
    { id: 'vintage', name: 'Vintage', icon: Camera },
    { id: 'urban', name: 'Urban', icon: null },
    { id: 'classic', name: 'Classic', icon: null },
    { id: 'minimalist', name: 'Minimalist', icon: null }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="template-search">Search Templates</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="template-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template styles..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {Icon && <Icon className="w-4 h-4" />}
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Template Preview with Selected Image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Templates ({filteredTemplates.length})</h3>
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                  hoveredTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => onTemplateSelect(template)}
              >
                <CardContent className="p-3">
                  <div 
                    className="aspect-square rounded-lg mb-3 relative overflow-hidden"
                    style={{ background: template.preview }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div 
                          className="text-lg font-bold mb-1"
                          style={{ 
                            color: template.style.textColor,
                            textShadow: `2px 2px 4px ${template.style.shadowColor}`
                          }}
                        >
                          {artistName || 'Artist'}
                        </div>
                        <div 
                          className="text-sm"
                          style={{ 
                            color: template.style.textColor,
                            textShadow: `1px 1px 2px ${template.style.shadowColor}`
                          }}
                        >
                          {albumName || 'Album'}
                        </div>
                      </div>
                    </div>
                    {template.popular && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview with Selected Image */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square rounded-lg overflow-hidden relative bg-gray-100">
                {selectedImage && (
                  <img
                    src={selectedImage.url}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    style={{ filter: hoveredTemplate ? templates.find(t => t.id === hoveredTemplate)?.style.filter : 'none' }}
                  />
                )}
                {hoveredTemplate && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ 
                      background: templates.find(t => t.id === hoveredTemplate)?.style.overlay 
                    }}
                  >
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold mb-2"
                        style={{ 
                          color: templates.find(t => t.id === hoveredTemplate)?.style.textColor,
                          textShadow: `3px 3px 6px ${templates.find(t => t.id === hoveredTemplate)?.style.shadowColor}`
                        }}
                      >
                        {artistName || 'Artist Name'}
                      </div>
                      <div 
                        className="text-lg"
                        style={{ 
                          color: templates.find(t => t.id === hoveredTemplate)?.style.textColor,
                          textShadow: `2px 2px 4px ${templates.find(t => t.id === hoveredTemplate)?.style.shadowColor}`
                        }}
                      >
                        {albumName || 'Album Name'}
                      </div>
                    </div>
                  </div>
                )}
                {!hoveredTemplate && !selectedImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Palette className="w-12 h-12 mx-auto mb-2" />
                      <p>Hover over templates to preview</p>
                    </div>
                  </div>
                )}
              </div>
              
              {hoveredTemplate && (
                <div className="mt-4">
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={() => {
                      const template = templates.find(t => t.id === hoveredTemplate);
                      if (template) onTemplateSelect(template);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No templates found matching your criteria</p>
        </div>
      )}
    </div>
  );
}