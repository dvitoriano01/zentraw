import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { CanvasObjectProperties } from "@/types/canvas";

export function PropertiesPanel() {
  const { selectedObject, updateObjectProperties } = useEditorStore();
  const [properties, setProperties] = useState<Partial<CanvasObjectProperties>>({});

  useEffect(() => {
    if (selectedObject) {
      setProperties({
        left: selectedObject.left || 0,
        top: selectedObject.top || 0,
        width: selectedObject.width || 0,
        height: selectedObject.height || 0,
        angle: selectedObject.angle || 0,
        opacity: (selectedObject.opacity || 1) * 100,
        fill: selectedObject.fill as string || '#000000',
        stroke: selectedObject.stroke as string || '#000000',
        strokeWidth: selectedObject.strokeWidth || 0,
        fontSize: (selectedObject as any).fontSize || 16,
        fontFamily: (selectedObject as any).fontFamily || 'Inter',
        fontWeight: (selectedObject as any).fontWeight || 'normal',
        textAlign: (selectedObject as any).textAlign || 'left',
      });
    }
  }, [selectedObject]);

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    
    // Apply to canvas object
    if (selectedObject) {
      const canvasValue = key === 'opacity' ? value / 100 : value;
      updateObjectProperties({ [key]: canvasValue });
    }
  };

  if (!selectedObject) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <i className="fas fa-mouse-pointer text-3xl mb-3"></i>
          <p className="text-sm">Select an object to edit its properties</p>
        </div>
      </div>
    );
  }

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
  const isShape = ['rect', 'circle', 'triangle', 'polygon'].includes(selectedObject.type || '');

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Properties</h3>

      {/* Position & Size */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Position & Size</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={Math.round(properties.left || 0)}
              onChange={(e) => handlePropertyChange('left', parseInt(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={Math.round(properties.top || 0)}
              onChange={(e) => handlePropertyChange('top', parseInt(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={Math.round(properties.width || 0)}
              onChange={(e) => handlePropertyChange('width', parseInt(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={Math.round(properties.height || 0)}
              onChange={(e) => handlePropertyChange('height', parseInt(e.target.value) || 0)}
              className="text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-xs mb-2 block">Rotation</Label>
          <Slider
            value={[properties.angle || 0]}
            onValueChange={([value]) => handlePropertyChange('angle', value)}
            max={360}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{properties.angle || 0}°</div>
        </div>
      </div>

      {/* Typography (for text objects) */}
      {isText && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Typography</h4>
          <div>
            <Label className="text-xs">Font Family</Label>
            <Select 
              value={properties.fontFamily} 
              onValueChange={(value) => handlePropertyChange('fontFamily', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Size</Label>
              <Input
                type="number"
                value={properties.fontSize || 16}
                onChange={(e) => handlePropertyChange('fontSize', parseInt(e.target.value) || 16)}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Weight</Label>
              <Select 
                value={properties.fontWeight} 
                onValueChange={(value) => handlePropertyChange('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={properties.textAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => handlePropertyChange('textAlign', 'left')}
            >
              <i className="fas fa-align-left"></i>
            </Button>
            <Button 
              variant={properties.textAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => handlePropertyChange('textAlign', 'center')}
            >
              <i className="fas fa-align-center"></i>
            </Button>
            <Button 
              variant={properties.textAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => handlePropertyChange('textAlign', 'right')}
            >
              <i className="fas fa-align-right"></i>
            </Button>
          </div>
        </div>
      )}

      {/* Fill & Stroke (for shapes) */}
      {(isShape || isText) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Fill & Stroke</h4>
          <div>
            <Label className="text-xs mb-2 block">Fill Color</Label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={properties.fill || '#000000'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={properties.fill || '#000000'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Stroke Color</Label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={properties.stroke || '#000000'}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              />
              <Input
                type="text"
                value={properties.stroke || '#000000'}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="flex-1 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-2 block">Stroke Width</Label>
            <Slider
              value={[properties.strokeWidth || 0]}
              onValueChange={([value]) => handlePropertyChange('strokeWidth', value)}
              max={20}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{properties.strokeWidth || 0}px</div>
          </div>
        </div>
      )}

      {/* Effects */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Effects</h4>
        <div>
          <Label className="text-xs mb-2 block">Opacity</Label>
          <Slider
            value={[properties.opacity || 100]}
            onValueChange={([value]) => handlePropertyChange('opacity', value)}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-gray-500 mt-1">{properties.opacity || 100}%</div>
        </div>
      </div>
    </div>
  );
}
