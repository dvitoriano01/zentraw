import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Image, FileText, Layers, PenTool } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  thumbnail: string;
  preview: string;
}

interface TemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: '1',
    name: 'Instagram Post',
    category: 'Social Media',
    width: 1080,
    height: 1080,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSI4IiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjE0Ij5JbnN0YWdyYW08L3RleHQ+CjwvY3ZnPgo=',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIHJ4PSI4IiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjE0Ij5JbnN0YWdyYW08L3RleHQ+CjwvY3ZnPgo='
  },
  {
    id: '2',
    name: 'Facebook Cover',
    category: 'Social Media',
    width: 1200,
    height: 630,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwNSIgdmlld0JveD0iMCAwIDIwMCAxMDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTA1IiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI4NSIgcng9IjQiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjU3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEyIj5GYWNlYm9vazwvdGV4dD4KPC9zdmc+',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwNSIgdmlld0JveD0iMCAwIDIwMCAxMDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTA1IiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI4NSIgcng9IjQiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjU3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEyIj5GYWNlYm9vazwvdGV4dD4KPC9zdmc+'
  },
  {
    id: '3',
    name: 'YouTube Thumbnail',
    category: 'Social Media',
    width: 1280,
    height: 720,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI5MyIgcng9IjQiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEyIj5Zb3VUdWJlPC90ZXh0Pgo8L3N2Zz4=',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMyIgdmlld0JveD0iMCAwIDIwMCAxMTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTEzIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI5MyIgcng9IjQiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjYxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEyIj5Zb3VUdWJlPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    id: '4',
    name: 'Business Card',
    category: 'Print',
    width: 1050,
    height: 600,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExNCIgdmlld0JveD0iMCAwIDIwMCAxMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTE0IiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxNSIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI4NCIgcng9IjgiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEwIj5CdXNpbmVzczwvdGV4dD4KPC9zdmc+',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExNCIgdmlld0JveD0iMCAwIDIwMCAxMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTE0IiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxNSIgd2lkdGg9IjE4MCIgaGVpZ2h0PSI4NCIgcng9IjgiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjM3NDgxIiBmb250LXNpemU9IjEwIj5CdXNpbmVzczwvdGV4dD4KPC9zdmc+'
  },
  {
    id: '5',
    name: 'Flyer A4',
    category: 'Print',
    width: 2480,
    height: 3508,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQzIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE0MyAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDMiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEyMyIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjcxIiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Mzc0ODEiIGZvbnQtc2l6ZT0iMTAiPkZseWVyPC90ZXh0Pgo8L3N2Zz4=',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQzIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDE0MyAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDMiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEyMyIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSIjZTVlN2ViIi8+Cjx0ZXh0IHg9IjcxIiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Mzc0ODEiIGZvbnQtc2l6ZT0iMTAiPkZseWVyPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    id: '6',
    name: 'Logo Design',
    category: 'Branding',
    width: 800,
    height: 800,
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYzNzQ4MSIgZm9udC1zaXplPSIxNCI+TG9nbzwvdGV4dD4KPC9zdmc+',
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNlNWU3ZWIiLz4KPHR4dCB4PSIxMDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzYzNzQ4MSIgZm9udC1zaXplPSIxNCI+TG9nbzwvdGV4dD4KPC9zdmc+'
  }
];

const categories = ['All', 'Social Media', 'Print', 'Branding', 'Web'];

export function TemplatesModal({ open, onOpenChange, onSelectTemplate }: TemplatesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] bg-[#2c2c2c] border-[#1e1e1e] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Choose Template</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1e1e1e] border-[#555] text-white"
              />
            </div>
            
            <div className="flex space-x-2">
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
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-[#383838] rounded-lg p-3 cursor-pointer hover:bg-[#404040] transition-colors border border-[#555]"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="aspect-square mb-3 bg-[#1e1e1e] rounded overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{template.category}</p>
                    <p className="text-xs text-gray-500">{template.width} × {template.height}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No templates found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}