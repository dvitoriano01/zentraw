import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  styles: {
    background: string;
    overlay: string;
    textStyle: string;
    filter: string;
  };
}

const professionalTemplates: Template[] = [
  {
    id: "corporate-dark",
    name: "Corporate Dark",
    category: "Business",
    preview: "🖤",
    styles: {
      background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
      overlay: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
      textStyle: "font-family: 'Helvetica', sans-serif; font-weight: 700; color: #ffffff; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);",
      filter: "contrast(1.2) brightness(0.9)"
    }
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "Clean",
    preview: "⚪",
    styles: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      overlay: "linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
      textStyle: "font-family: 'Georgia', serif; font-weight: 600; color: #1e293b; text-shadow: 1px 1px 3px rgba(255,255,255,0.8);",
      filter: "brightness(1.1) saturate(0.8)"
    }
  },
  {
    id: "vintage-sepia",
    name: "Vintage Sepia",
    category: "Retro",
    preview: "🟤",
    styles: {
      background: "radial-gradient(circle, #8b4513 0%, #654321 100%)",
      overlay: "radial-gradient(circle, transparent 30%, rgba(139,69,19,0.4) 100%)",
      textStyle: "font-family: 'Times New Roman', serif; font-weight: 700; color: #f4e4bc; text-shadow: 2px 2px 6px rgba(0,0,0,0.9);",
      filter: "sepia(0.8) contrast(1.3) brightness(0.9)"
    }
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    category: "Modern",
    preview: "💜",
    styles: {
      background: "linear-gradient(45deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
      overlay: "linear-gradient(45deg, rgba(138,43,226,0.2) 0%, rgba(0,191,255,0.2) 100%)",
      textStyle: "font-family: 'Impact', sans-serif; font-weight: 900; color: #00ffff; text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;",
      filter: "contrast(1.4) saturate(1.5) hue-rotate(240deg)"
    }
  },
  {
    id: "golden-luxury",
    name: "Golden Luxury",
    category: "Premium",
    preview: "🟡",
    styles: {
      background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
      overlay: "radial-gradient(ellipse at center, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.3) 100%)",
      textStyle: "font-family: 'Georgia', serif; font-weight: 700; color: #ffd700; text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(255,215,0,0.5);",
      filter: "contrast(1.3) brightness(0.8) saturate(1.2)"
    }
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    category: "Natural",
    preview: "🔵",
    styles: {
      background: "linear-gradient(180deg, #0077be 0%, #00a8ff 50%, #0056b3 100%)",
      overlay: "linear-gradient(to bottom, rgba(0,119,190,0.2), rgba(0,86,179,0.6))",
      textStyle: "font-family: 'Verdana', sans-serif; font-weight: 600; color: #ffffff; text-shadow: 2px 2px 6px rgba(0,86,179,0.8);",
      filter: "hue-rotate(200deg) saturate(1.4) brightness(1.1)"
    }
  }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onSelectTemplate, onClose }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = ["all", ...Array.from(new Set(professionalTemplates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "all" 
    ? professionalTemplates 
    : professionalTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Templates Profissionais</h3>
              <p className="text-gray-600">Escolha um template base para personalizar</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category === "all" ? "Todos" : category}
              </Button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {filteredTemplates.map(template => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300"
                onClick={() => onSelectTemplate(template)}
              >
                <CardContent className="p-4">
                  <div 
                    className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-4xl relative overflow-hidden"
                    style={{ background: template.styles.background }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ background: template.styles.overlay }}
                    ></div>
                    <div 
                      className="relative z-10 text-center"
                      style={{ 
                        fontFamily: template.styles.textStyle.includes('Georgia') ? 'Georgia' : 
                                   template.styles.textStyle.includes('Impact') ? 'Impact' : 
                                   template.styles.textStyle.includes('Times') ? 'Times New Roman' : 'Helvetica',
                        color: template.styles.textStyle.includes('#ffd700') ? '#ffd700' : 
                               template.styles.textStyle.includes('#00ffff') ? '#00ffff' : 
                               template.styles.textStyle.includes('#1e293b') ? '#1e293b' : '#ffffff',
                        fontSize: '14px',
                        fontWeight: '700',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      ARTIST<br/>TITLE
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                  
                  <Button size="sm" className="w-full">
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Templates incluem: Filtros, Overlays, Tipografia e Paleta de Cores pré-definidas
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}