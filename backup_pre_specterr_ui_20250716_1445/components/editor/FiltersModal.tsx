import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Palette, Sun, Moon, Zap, Droplets, Sparkles, Film, Camera } from 'lucide-react';

interface Filter {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType;
  preview: string;
  settings: FilterSetting[];
}

interface FilterSetting {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filter: Filter, settings: Record<string, number>) => void;
}

const filters: Filter[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    category: 'Classic',
    icon: Camera,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3ZpbnRhZ2UpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InZpbnRhZ2UiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZkYmE0IiBzdG9wLW9wYWNpdHk9IjAuOCIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNjZDc5NWQiIHN0b3Atb3BhY2l0eT0iMC44Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    settings: [
      { name: 'Sepia', value: 60, min: 0, max: 100, step: 1, unit: '%' },
      { name: 'Contrast', value: 120, min: 50, max: 200, step: 1, unit: '%' },
      { name: 'Brightness', value: 110, min: 50, max: 200, step: 1, unit: '%' }
    ]
  },
  {
    id: 'blackwhite',
    name: 'Black & White',
    category: 'Classic',
    icon: Moon,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2J3KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJidyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    settings: [
      { name: 'Grayscale', value: 100, min: 0, max: 100, step: 1, unit: '%' },
      { name: 'Contrast', value: 130, min: 50, max: 200, step: 1, unit: '%' }
    ]
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    category: 'Modern',
    icon: Sparkles,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3ZpYnJhbnQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InZpYnJhbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmYwMGZmIi8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjMDBmZmZmIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZmYwMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjwvdXZnPg==',
    settings: [
      { name: 'Saturation', value: 150, min: 0, max: 300, step: 1, unit: '%' },
      { name: 'Vibrance', value: 130, min: 50, max: 200, step: 1, unit: '%' },
      { name: 'Brightness', value: 110, min: 50, max: 200, step: 1, unit: '%' }
    ]
  },
  {
    id: 'warm',
    name: 'Warm',
    category: 'Temperature',
    icon: Sun,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI3dhcm0pIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9Indhcm0iIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZkNzAwIiBzdG9wLW9wYWNpdHk9IjAuNyIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjhiMDAiIHN0b3Atb3BhY2l0eT0iMC43Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    settings: [
      { name: 'Temperature', value: 30, min: -100, max: 100, step: 1, unit: '°' },
      { name: 'Warmth', value: 40, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'cool',
    name: 'Cool',
    category: 'Temperature',
    icon: Droplets,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2Nvb2wpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImNvb2wiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDBiZmZmIiBzdG9wLW9wYWNpdHk9IjAuNyIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDQ4ZmYiIHN0b3Atb3BhY2l0eT0iMC43Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
    settings: [
      { name: 'Temperature', value: -30, min: -100, max: 100, step: 1, unit: '°' },
      { name: 'Coolness', value: 40, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    category: 'Artistic',
    icon: Film,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ1cmwoI2RyYW1hdGljKSIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJkcmFtYXRpYyIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=',
    settings: [
      { name: 'Contrast', value: 180, min: 50, max: 300, step: 1, unit: '%' },
      { name: 'Shadows', value: -40, min: -100, max: 100, step: 1, unit: '%' },
      { name: 'Highlights', value: 20, min: -100, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'blur',
    name: 'Blur',
    category: 'Effects',
    icon: Zap,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjY2NjY2NjIiBmaWx0ZXI9InVybCgjYmx1cikiLz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImJsdXIiPgo8ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUdyYXBoaWMiIHN0ZERldmlhdGlvbj0iMyIvPgo8L2ZpbHRlcj4KPC9kZWZzPgo8L3N2Zz4=',
    settings: [
      { name: 'Blur Radius', value: 5, min: 0, max: 20, step: 0.1, unit: 'px' },
      { name: 'Motion Blur', value: 0, min: 0, max: 10, step: 0.1, unit: 'px' }
    ]
  },
  {
    id: 'sharpen',
    name: 'Sharpen',
    category: 'Effects',
    icon: Sparkles,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMjUgMjVMNzUgNzVNNzUgMjVMMjUgNzUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvdXZnPg==',
    settings: [
      { name: 'Sharpness', value: 150, min: 100, max: 300, step: 1, unit: '%' },
      { name: 'Edge Enhancement', value: 20, min: 0, max: 100, step: 1, unit: '%' }
    ]
  }
];

const categories = ['All', 'Classic', 'Modern', 'Temperature', 'Artistic', 'Effects'];

export function FiltersModal({ open, onOpenChange, onApplyFilter }: FiltersModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [filterSettings, setFilterSettings] = useState<Record<string, number>>({});

  const filteredFilters = filters.filter(filter => 
    selectedCategory === 'All' || filter.category === selectedCategory
  );

  const handleFilterSelect = (filter: Filter) => {
    setSelectedFilter(filter);
    const initialSettings: Record<string, number> = {};
    filter.settings.forEach(setting => {
      initialSettings[setting.name] = setting.value;
    });
    setFilterSettings(initialSettings);
  };

  const handleApplyFilter = () => {
    if (selectedFilter) {
      onApplyFilter(selectedFilter, filterSettings);
      onOpenChange(false);
    }
  };

  const updateSetting = (settingName: string, value: number) => {
    setFilterSettings(prev => ({ ...prev, [settingName]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] bg-[#2c2c2c] border-[#1e1e1e] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Photo Filters</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Left Panel - Filter Categories & List */}
          <div className="w-80 border-r border-[#1e1e1e] pr-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    text-xs
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

            {/* Filters List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredFilters.map((filter) => {
                const IconComponent = filter.icon;
                
                return (
                  <div
                    key={filter.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors border
                      ${selectedFilter?.id === filter.id 
                        ? 'bg-[#0078d4] border-[#0078d4]' 
                        : 'bg-[#383838] border-[#555] hover:bg-[#404040]'
                      }
                    `}
                    onClick={() => handleFilterSelect(filter)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundImage: `url(${filter.preview})`, backgroundSize: 'cover' }}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 text-white drop-shadow-lg" />}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm">{filter.name}</h3>
                        <p className="text-xs text-gray-400">{filter.category}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Filter Settings */}
          <div className="flex-1 pl-4">
            {selectedFilter ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedFilter.name}</h3>
                  <p className="text-sm text-gray-400">Adjust the filter settings to your preference</p>
                </div>

                {/* Filter Settings */}
                <div className="space-y-6">
                  {selectedFilter.settings.map((setting) => (
                    <div key={setting.name}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">{setting.name}</label>
                        <span className="text-sm text-gray-400">
                          {filterSettings[setting.name]?.toFixed(setting.step < 1 ? 1 : 0) || setting.value}{setting.unit}
                        </span>
                      </div>
                      <Slider
                        value={[filterSettings[setting.name] || setting.value]}
                        onValueChange={(value) => updateSetting(setting.name, value[0])}
                        min={setting.min}
                        max={setting.max}
                        step={setting.step}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Apply Button */}
                <div className="mt-8 pt-4 border-t border-[#1e1e1e]">
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleApplyFilter}
                      className="bg-[#0078d4] hover:bg-[#106ebe] flex-1"
                    >
                      Apply Filter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedFilter(null)}
                      className="border-[#555] hover:bg-[#383838]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Select a filter to adjust its settings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}