import React, { useState, useEffect } from 'react';
import { Canvas, FabricObject, IText } from 'fabric';
import { ParameterInput } from './ParameterInput';

interface ObjectPropertiesPanelProps {
  fabricCanvas: Canvas | null;
}

export function ObjectPropertiesPanel({ fabricCanvas }: ObjectPropertiesPanelProps) {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [properties, setProperties] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    opacity: 1,
    fill: '#000000',
    stroke: '#000000',
    strokeWidth: 0,
    fontSize: 32,
    fontFamily: 'Arial'
  });

  useEffect(() => {
    if (!fabricCanvas) return;

    const updateSelectedObject = () => {
      const activeObject = fabricCanvas.getActiveObject();
      setSelectedObject(activeObject || null);
      
      if (activeObject) {
        setProperties({
          left: Math.round(activeObject.left || 0),
          top: Math.round(activeObject.top || 0),
          width: Math.round((activeObject.width || 0) * (activeObject.scaleX || 1)),
          height: Math.round((activeObject.height || 0) * (activeObject.scaleY || 1)),
          angle: Math.round(activeObject.angle || 0),
          opacity: activeObject.opacity || 1,
          fill: (activeObject.fill as string) || '#000000',
          stroke: (activeObject.stroke as string) || '#000000',
          strokeWidth: activeObject.strokeWidth || 0,
          fontSize: (activeObject as IText).fontSize || 32,
          fontFamily: (activeObject as IText).fontFamily || 'Arial'
        });
      }
    };

    fabricCanvas.on('selection:created', updateSelectedObject);
    fabricCanvas.on('selection:updated', updateSelectedObject);
    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });
    fabricCanvas.on('object:modified', updateSelectedObject);

    return () => {
      fabricCanvas.off('selection:created', updateSelectedObject);
      fabricCanvas.off('selection:updated', updateSelectedObject);
      fabricCanvas.off('selection:cleared');
      fabricCanvas.off('object:modified', updateSelectedObject);
    };
  }, [fabricCanvas]);

  const updateObjectProperty = (property: string, value: any) => {
    if (!selectedObject || !fabricCanvas) return;

    if (property === 'width' || property === 'height') {
      const scaleX = value / (selectedObject.width || 1);
      const scaleY = value / (selectedObject.height || 1);
      
      if (property === 'width') {
        selectedObject.set('scaleX', scaleX);
      } else {
        selectedObject.set('scaleY', scaleY);
      }
    } else {
      selectedObject.set(property as any, value);
    }

    fabricCanvas.renderAll();
    setProperties(prev => ({ ...prev, [property]: value }));
  };

  if (!selectedObject) {
    return (
      <div className="space-y-4">
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">Select an object to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Position */}
      <div>
        <h4 className="text-xs text-gray-400 mb-3">Position</h4>
        <div className="grid grid-cols-2 gap-2">
          <ParameterInput
            label="X"
            value={properties.left}
            min={-1000}
            max={1000}
            step={1}
            unit="px"
            defaultValue={0}
            onChange={(value) => updateObjectProperty('left', value)}
          />
          <ParameterInput
            label="Y"
            value={properties.top}
            min={-1000}
            max={1000}
            step={1}
            unit="px"
            defaultValue={0}
            onChange={(value) => updateObjectProperty('top', value)}
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="text-xs text-gray-400 mb-3">Size</h4>
        <div className="grid grid-cols-2 gap-2">
          <ParameterInput
            label="Width"
            value={properties.width}
            min={1}
            max={2000}
            step={1}
            unit="px"
            defaultValue={100}
            onChange={(value) => updateObjectProperty('width', value)}
          />
          <ParameterInput
            label="Height"
            value={properties.height}
            min={1}
            max={2000}
            step={1}
            unit="px"
            defaultValue={100}
            onChange={(value) => updateObjectProperty('height', value)}
          />
        </div>
      </div>

      {/* Transform */}
      <div>
        <h4 className="text-xs text-gray-400 mb-3">Transform</h4>
        <div className="space-y-3">
          <ParameterInput
            label="Rotation"
            value={properties.angle}
            min={-180}
            max={180}
            step={1}
            unit="°"
            defaultValue={0}
            onChange={(value) => updateObjectProperty('angle', value)}
          />
          <ParameterInput
            label="Opacity"
            value={Math.round(properties.opacity * 100)}
            min={0}
            max={100}
            step={1}
            unit="%"
            defaultValue={100}
            onChange={(value) => updateObjectProperty('opacity', value / 100)}
          />
        </div>
      </div>

      {/* Appearance */}
      <div>
        <h4 className="text-xs text-gray-400 mb-3">Appearance</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-2">Fill Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={properties.fill}
                onChange={(e) => updateObjectProperty('fill', e.target.value)}
                className="w-8 h-8 rounded border border-[#4a4a4a] bg-[#2d2d2d]"
              />
              <input
                type="text"
                value={properties.fill}
                onChange={(e) => updateObjectProperty('fill', e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-[#4a4a4a] border border-[#5a5a5a] rounded text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-2">Stroke Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={properties.stroke}
                onChange={(e) => updateObjectProperty('stroke', e.target.value)}
                className="w-8 h-8 rounded border border-[#4a4a4a] bg-[#2d2d2d]"
              />
              <input
                type="text"
                value={properties.stroke}
                onChange={(e) => updateObjectProperty('stroke', e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-[#4a4a4a] border border-[#5a5a5a] rounded text-white"
              />
            </div>
          </div>

          <ParameterInput
            label="Stroke Width"
            value={properties.strokeWidth}
            min={0}
            max={50}
            step={1}
            unit="px"
            defaultValue={0}
            onChange={(value) => updateObjectProperty('strokeWidth', value)}
          />
        </div>
      </div>

      {/* Text Properties (only for text objects) */}
      {selectedObject?.type === 'i-text' && (
        <div>
          <h4 className="text-xs text-gray-400 mb-3">Text</h4>
          <div className="space-y-3">
            <ParameterInput
              label="Font Size"
              value={properties.fontSize}
              min={8}
              max={200}
              step={1}
              unit="px"
              defaultValue={32}
              onChange={(value) => updateObjectProperty('fontSize', value)}
            />
            
            <div>
              <label className="text-xs text-gray-400 block mb-2">Font Family</label>
              <select
                value={properties.fontFamily}
                onChange={(e) => updateObjectProperty('fontFamily', e.target.value)}
                className="w-full px-2 py-1 text-xs bg-[#4a4a4a] border border-[#5a5a5a] rounded text-white"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}