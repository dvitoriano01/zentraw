import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Type, Sparkles, Zap, Palette, Circle } from 'lucide-react';

interface TextEffect {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType;
  preview: string;
  settings: EffectSetting[];
}

interface EffectSetting {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

interface TextEffectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyEffect: (effect: TextEffect, settings: Record<string, number>) => void;
}

const textEffects: TextEffect[] = [
  {
    id: 'shadow',
    name: 'Drop Shadow',
    category: 'Basic',
    icon: Circle,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUyIiB5PSI1NCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMzMzMiPkE8L3RleHQ+Cjx0ZXh0IHg9IjUwIiB5PSI1MiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAwMDAiPkE8L3RleHQ+CjwvdXZnPg==',
    settings: [
      { name: 'Offset X', value: 2, min: -20, max: 20, step: 1, unit: 'px' },
      { name: 'Offset Y', value: 2, min: -20, max: 20, step: 1, unit: 'px' },
      { name: 'Blur', value: 4, min: 0, max: 20, step: 1, unit: 'px' },
      { name: 'Opacity', value: 50, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'glow',
    name: 'Outer Glow',
    category: 'Glow',
    icon: Sparkles,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMTExIi8+CjxkZWZzPgo8ZmlsdGVyIGlkPSJnbG93Ij4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNCIgcmVzdWx0PSJjb2xvcmVkQmx1ciIvPgo8ZmVNZXJnZT4KPGZlTWVyZ2VOb2RlIGluPSJjb2xvcmVkQmx1ciIvPgo8ZmVNZXJnZU5vZGUgaW49IlNvdXJjZUdyYXBoaWMiLz4KPC9mZU1lcmdlPgo8L2ZpbHRlcj4KPC9kZWZzPgo8dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDBiZmZmIiBmaWx0ZXI9InVybCgjZ2xvdykiPkE8L3RleHQ+CjwvdXZnPg==',
    settings: [
      { name: 'Size', value: 8, min: 0, max: 30, step: 1, unit: 'px' },
      { name: 'Spread', value: 0, min: -10, max: 10, step: 1, unit: 'px' },
      { name: 'Opacity', value: 75, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'stroke',
    name: 'Stroke',
    category: 'Basic',
    icon: Type,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIj5BPC90ZXh0Pgo8L3N2Zz4=',
    settings: [
      { name: 'Size', value: 2, min: 0, max: 10, step: 0.5, unit: 'px' },
      { name: 'Position', value: 1, min: 0, max: 2, step: 1, unit: '' }
    ]
  },
  {
    id: 'gradient',
    name: 'Gradient Overlay',
    category: 'Color',
    icon: Palette,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InRleHRHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjAwZmYiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMDBmZmZmIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHR4dCB4PSI1MCIgeT0iNTUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ1cmwoI3RleHRHcmFkaWVudCkiPkE8L3RleHQ+CjwvdXZnPg==',
    settings: [
      { name: 'Angle', value: 45, min: 0, max: 360, step: 1, unit: '°' },
      { name: 'Opacity', value: 100, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'bevel',
    name: 'Bevel & Emboss',
    category: 'Dimensional',
    icon: Zap,
    preview: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxkZWZzPgo8ZmlsdGVyIGlkPSJiZXZlbCI+CjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlQWxwaGEiIHN0ZERldmlhdGlvbj0iMyIvPgo8ZmVPZmZzZXQgZHg9IjEiIGR5PSIxIiByZXN1bHQ9Im9mZnNldCIvPgo8ZmVGbG9vZCBmbG9vZC1jb2xvcj0iI2ZmZmZmZiIgZmxvb2Qtb3BhY2l0eT0iMC41Ii8+CjxmZUNvbXBvc2l0ZSBpbjI9Im9mZnNldCIgb3BlcmF0b3I9ImluIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiM2NjY2NjYiIGZpbHRlcj0idXJsKCNiZXZlbCkiPkE8L3RleHQ+CjwvdXZnPg==',
    settings: [
      { name: 'Depth', value: 100, min: 0, max: 200, step: 1, unit: '%' },
      { name: 'Size', value: 5, min: 0, max: 20, step: 1, unit: 'px' },
      { name: 'Angle', value: 120, min: 0, max: 360, step: 1, unit: '°' },
      { name: 'Altitude', value: 30, min: 0, max: 90, step: 1, unit: '°' }
    ]
  }
];

const categories = ['All', 'Basic', 'Glow', 'Color', 'Dimensional'];

export function TextEffectsModal({ open, onOpenChange, onApplyEffect }: TextEffectsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEffect, setSelectedEffect] = useState<TextEffect | null>(null);
  const [effectSettings, setEffectSettings] = useState<Record<string, number>>({});

  const filteredEffects = textEffects.filter(effect => 
    selectedCategory === 'All' || effect.category === selectedCategory
  );

  const handleEffectSelect = (effect: TextEffect) => {
    setSelectedEffect(effect);
    const initialSettings: Record<string, number> = {};
    effect.settings.forEach(setting => {
      initialSettings[setting.name] = setting.value;
    });
    setEffectSettings(initialSettings);
  };

  const handleApplyEffect = () => {
    if (selectedEffect) {
      onApplyEffect(selectedEffect, effectSettings);
      onOpenChange(false);
    }
  };

  const updateSetting = (settingName: string, value: number) => {
    setEffectSettings(prev => ({ ...prev, [settingName]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] bg-[#2c2c2c] border-[#1e1e1e] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Text Effects</DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Left Panel - Effect Categories & List */}
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

            {/* Effects List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredEffects.map((effect) => {
                const IconComponent = effect.icon;
                
                return (
                  <div
                    key={effect.id}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors border
                      ${selectedEffect?.id === effect.id 
                        ? 'bg-[#0078d4] border-[#0078d4]' 
                        : 'bg-[#383838] border-[#555] hover:bg-[#404040]'
                      }
                    `}
                    onClick={() => handleEffectSelect(effect)}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundImage: `url(${effect.preview})`, backgroundSize: 'cover' }}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 text-white drop-shadow-lg" />}
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm">{effect.name}</h3>
                        <p className="text-xs text-gray-400">{effect.category}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Effect Settings */}
          <div className="flex-1 pl-4">
            {selectedEffect ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{selectedEffect.name}</h3>
                  <p className="text-sm text-gray-400">Adjust the effect settings to your preference</p>
                </div>

                {/* Effect Settings */}
                <div className="space-y-6">
                  {selectedEffect.settings.map((setting) => (
                    <div key={setting.name}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">{setting.name}</label>
                        <span className="text-sm text-gray-400">
                          {effectSettings[setting.name]?.toFixed(setting.step < 1 ? 1 : 0) || setting.value}{setting.unit}
                        </span>
                      </div>
                      <Slider
                        value={[effectSettings[setting.name] || setting.value]}
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
                      onClick={handleApplyEffect}
                      className="bg-[#0078d4] hover:bg-[#106ebe] flex-1"
                    >
                      Apply Effect
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedEffect(null)}
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
                  <Type className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Select a text effect to adjust its settings</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}