import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Layers, Grid, Layout, Box, Circle, Triangle, Star, Heart, Search } from 'lucide-react';
import { DragDropZone } from './DragDropZone';

interface SVGLayout {
  id: string;
  name: string;
  category: string;
  preview: string;
  elements: SVGElement[];
}

interface SVGElement {
  type: 'rect' | 'circle' | 'text' | 'path';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  d?: string;
}

interface SVGLayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLayout: (layout: SVGLayout) => void;
}

const handleFileUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      if (file.name.toLowerCase().endsWith('.svg')) {
        console.log('SVG file uploaded:', file.name);
        // Process SVG file
      } else if (file.name.toLowerCase().endsWith('.json')) {
        const layoutData = JSON.parse(e.target?.result as string);
        console.log('Layout file uploaded:', layoutData);
        // Process layout JSON
      }
    } catch (error) {
      console.error('Error processing uploaded file:', error);
    }
  };
  
  if (file.name.toLowerCase().endsWith('.svg')) {
    reader.readAsText(file);
  } else {
    reader.readAsText(file);
  }
};

const svgLayouts: SVGLayout[] = [
  {
    id: '1',
    name: 'Grid Layout',
    category: 'Basic',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiNjYmQyZDkiLz4KPHJlY3QgeD0iMTEwIiB5PSIyMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiNjYmQyZDkiLz4KPHJlY3QgeD0iMjAiIHk9IjExMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiNjYmQyZDkiLz4KPHJlY3QgeD0iMTEwIiB5PSIxMTAiIHdpZHRoPSI3MCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2U1ZTdlYiIgc3Ryb2tlPSIjY2JkMmQ5Ii8+CjwvdXZnPg==',
    elements: [
      { type: 'rect', x: 50, y: 50, width: 120, height: 120, fill: '#e5e7eb', stroke: '#cbd2d9' },
      { type: 'rect', x: 200, y: 50, width: 120, height: 120, fill: '#e5e7eb', stroke: '#cbd2d9' },
      { type: 'rect', x: 50, y: 200, width: 120, height: 120, fill: '#e5e7eb', stroke: '#cbd2d9' },
      { type: 'rect', x: 200, y: 200, width: 120, height: 120, fill: '#e5e7eb', stroke: '#cbd2d9' }
    ]
  },
  {
    id: '2',
    name: 'Business Card Layout',
    category: 'Professional',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMDAiIHJ4PSI4IiBmaWxsPSIjMWY0MjY4IiBzdHJva2U9IiMzNzQ5NWQiLz4KPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2U1ZTdlYiIvPgo8dGV4dCB4PSI4MCIgeT0iMzUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+Sm9obiBEb2U8L3RleHQ+Cjx0ZXh0IHg9IjgwIiB5PSI1MCIgZmlsbD0iI2NiZDJkOSIgZm9udC1zaXplPSIxMCI+RGVzaWduZXI8L3RleHQ+CjwvdXZnPg==',
    elements: [
      { type: 'rect', x: 0, y: 0, width: 400, height: 240, fill: '#1f2968', stroke: '#374151' },
      { type: 'circle', x: 40, y: 40, radius: 20, fill: '#e5e7eb' },
      { type: 'text', x: 80, y: 40, text: 'Nome da Empresa', fontSize: 18, fill: 'white' },
      { type: 'text', x: 80, y: 65, text: 'Slogan ou Descrição', fontSize: 12, fill: '#cbd2d9' },
      { type: 'text', x: 40, y: 180, text: 'contato@empresa.com', fontSize: 10, fill: '#cbd2d9' },
      { type: 'text', x: 40, y: 200, text: '(11) 99999-9999', fontSize: 10, fill: '#cbd2d9' }
    ]
  },
  {
    id: '3',
    name: 'Social Media Post',
    category: 'Social',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICNmOTY4ZDMsICNmNDNmNWUpIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCI+VElUVUxPPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiPlN1YnRpdHVsbzwvdGV4dD4KPC91dmc+',
    elements: [
      { type: 'rect', x: 0, y: 0, width: 400, height: 400, fill: 'linear-gradient(45deg, #f968d3, #f43f5e)' },
      { type: 'text', x: 200, y: 160, text: 'TITULO PRINCIPAL', fontSize: 32, fill: 'white' },
      { type: 'text', x: 200, y: 200, text: 'Subtítulo ou descrição', fontSize: 18, fill: 'white' },
      { type: 'circle', x: 200, y: 300, radius: 30, fill: 'rgba(255,255,255,0.2)' }
    ]
  },
  {
    id: '4',
    name: 'Infographic Layout',
    category: 'Professional',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzM3NDk1ZCIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiMzYjgyZjYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIyMCIgZmlsbD0iIzEwYjk4MSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMDAiIHI9IjIwIiBmaWxsPSIjZjU5ZTBiIi8+CjxyZWN0IHg9IjIwIiB5PSIxNDAiIHdpZHRoPSIxNjAiIGhlaWdodD0iODAiIGZpbGw9IiNlNWU3ZWIiLz4KPC9zdmc+',
    elements: [
      { type: 'rect', x: 40, y: 40, width: 320, height: 60, fill: '#374151' },
      { type: 'text', x: 200, y: 75, text: 'INFOGRÁFICO', fontSize: 20, fill: 'white' },
      { type: 'circle', x: 100, y: 150, radius: 25, fill: '#3b82f6' },
      { type: 'circle', x: 200, y: 150, radius: 25, fill: '#10b981' },
      { type: 'circle', x: 300, y: 150, radius: 25, fill: '#f59e0b' },
      { type: 'text', x: 100, y: 155, text: '1', fontSize: 18, fill: 'white' },
      { type: 'text', x: 200, y: 155, text: '2', fontSize: 18, fill: 'white' },
      { type: 'text', x: 300, y: 155, text: '3', fontSize: 18, fill: 'white' },
      { type: 'rect', x: 40, y: 200, width: 320, height: 100, fill: '#e5e7eb' }
    ]
  },
  {
    id: '5',
    name: 'Logo Template',
    category: 'Branding',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzM3NDk1ZCIvPgo8cGF0aCBkPSJNODUgODBMMTAwIDk1TDExNSA4MEwxMDAgNjVaIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxMDAiIHk9IjE0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzM3NDk1ZCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPkxPR088L3RleHQ+CjwvdXZnPg==',
    elements: [
      { type: 'circle', x: 200, y: 160, radius: 60, fill: '#374151' },
      { type: 'path', x: 170, y: 130, d: 'M170 160L200 190L230 160L200 130Z', fill: 'white' },
      { type: 'text', x: 200, y: 260, text: 'MARCA', fontSize: 24, fill: '#374151' }
    ]
  },
  {
    id: '6',
    name: 'Certificate Layout',
    category: 'Professional',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDIwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNkNGQ0ZDQiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMTAiIGZpbGw9IiNmNTk1MGYiLz4KPHR4dCB4PSIxMDAiIHk9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzc0MTUxIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCI+Q0VSVElGSUNBRE88L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Mzc0ODEiIGZvbnQtc2l6ZT0iMTAiPkRlIENvbmNsdXPjbzwvdGV4dD4KPC9zdmc+',
    elements: [
      { type: 'rect', x: 20, y: 20, width: 360, height: 240, fill: 'white', stroke: '#d4d4d4', strokeWidth: 4 },
      { type: 'rect', x: 40, y: 40, width: 320, height: 20, fill: '#f59e0b' },
      { type: 'text', x: 200, y: 120, text: 'CERTIFICADO', fontSize: 28, fill: '#374151' },
      { type: 'text', x: 200, y: 150, text: 'DE CONCLUSÃO', fontSize: 16, fill: '#6b7280' },
      { type: 'text', x: 200, y: 190, text: 'Nome do Participante', fontSize: 20, fill: '#374151' },
      { type: 'text', x: 200, y: 220, text: 'Nome do Curso', fontSize: 14, fill: '#6b7280' }
    ]
  }
];

const categories = ['All', 'Basic', 'Professional', 'Social', 'Branding'];

export function SVGLayoutModal({ open, onOpenChange, onSelectLayout }: SVGLayoutModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredLayouts = svgLayouts.filter(layout => 
    selectedCategory === 'All' || layout.category === selectedCategory
  );

  const handleSelectLayout = (layout: SVGLayout) => {
    onSelectLayout(layout);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] bg-[#2c2c2c] border-[#1e1e1e] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">SVG Layouts</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Category Filters */}
          <div className="flex space-x-2 mb-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`
                  ${selectedCategory === category 
                    ? 'bg-[#0078d4] border-[#0078d4]' 
                    : 'bg-transparent border-[#555] hover:bg-[#383838]'
                  }
                `}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Layouts Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLayouts.map((layout) => (
                <div
                  key={layout.id}
                  className="bg-[#383838] rounded-lg p-4 cursor-pointer hover:bg-[#404040] transition-colors border border-[#555]"
                  onClick={() => handleSelectLayout(layout)}
                >
                  <div className="aspect-video mb-3 bg-[#1e1e1e] rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={layout.preview}
                      alt={layout.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1">{layout.name}</h3>
                    <p className="text-xs text-gray-400">{layout.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}