import React, { useState, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

interface ParameterInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: number;
  onChange: (value: number) => void;
  onReset?: () => void;
}

export function ParameterInput({ 
  label, 
  value, 
  min = -100, 
  max = 100, 
  step = 1, 
  unit = '', 
  defaultValue = 0,
  onChange,
  onReset 
}: ParameterInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value.toString());
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue)) {
        onChange(Math.max(min, Math.min(max, newValue)));
      }
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value.toString());
    }
  };

  const handleBlur = () => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    onChange(defaultValue);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-gray-400">{label}</label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-16 px-1 py-0.5 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded text-gray-300"
              min={min}
              max={max}
              step={step}
            />
          ) : (
            <span 
              className="text-xs text-gray-300 cursor-pointer hover:text-white transition-colors"
              onDoubleClick={handleDoubleClick}
              title="Double-click to edit"
            >
              {value}{unit}
            </span>
          )}
          <button
            onClick={handleReset}
            className="p-1 hover:bg-[#4a4a4a] rounded transition-colors"
            title="Double-click to reset"
            onDoubleClick={handleReset}
          >
            <RotateCcw className="w-3 h-3 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-[#4a4a4a] rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}