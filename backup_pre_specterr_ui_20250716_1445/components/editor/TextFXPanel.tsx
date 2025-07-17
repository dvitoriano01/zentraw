import React from 'react';
import { Button } from '@/components/ui/button';

interface TextFXPanelProps {
  selectedObject: any;
  onApplyEffect: (effect: any) => void;
}

export function TextFXPanel({ selectedObject, onApplyEffect }: TextFXPanelProps) {
  const [activeEffect, setActiveEffect] = React.useState<string | null>(null);

  if (!selectedObject || selectedObject.type !== 'i-text') {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a text object to apply effects
      </div>
    );
  }

  const textEffects = [
    {
      name: 'Bold Shadow',
      style: {
        shadow: 'rgba(0,0,0,0.8) 3px 3px 8px',
        fontWeight: 'bold'
      }
    },
    {
      name: 'Neon Glow',
      style: {
        fill: '#00ffff',
        stroke: '#ffffff',
        strokeWidth: 2,
        shadow: 'rgba(0,255,255,0.8) 0px 0px 20px'
      }
    },
    {
      name: 'Outline Text',
      style: {
        fill: 'transparent',
        stroke: '#000000',
        strokeWidth: 3
      }
    },
    {
      name: '3D Effect',
      style: {
        shadow: 'rgba(0,0,0,0.6) 2px 2px 0px, rgba(0,0,0,0.4) 4px 4px 0px, rgba(0,0,0,0.2) 6px 6px 0px',
        fontWeight: 'bold'
      }
    },
    {
      name: 'Retro Wave',
      style: {
        fill: '#ff006e',
        stroke: '#8338ec',
        strokeWidth: 2,
        shadow: 'rgba(255,0,110,0.7) 0px 0px 15px'
      }
    },
    {
      name: 'Gold Metallic',
      style: {
        fill: '#ffd700',
        stroke: '#b8860b',
        strokeWidth: 1,
        shadow: 'rgba(255,215,0,0.6) 0px 0px 10px'
      }
    },
    {
      name: 'Comic Book',
      style: {
        fill: '#ffff00',
        stroke: '#000000',
        strokeWidth: 4,
        fontWeight: 'bold',
        shadow: 'rgba(0,0,0,0.8) 3px 3px 0px'
      }
    },
    {
      name: 'Ice Crystal',
      style: {
        fill: '#e0f7ff',
        stroke: '#4dd0e1',
        strokeWidth: 2,
        shadow: 'rgba(77,208,225,0.5) 0px 0px 12px'
      }
    },
    {
      name: 'Fire Text',
      style: {
        fill: '#ff4500',
        stroke: '#ff0000',
        strokeWidth: 1,
        shadow: 'rgba(255,69,0,0.8) 0px 0px 15px'
      }
    },
    {
      name: 'Vintage',
      style: {
        fill: '#8b4513',
        stroke: '#654321',
        strokeWidth: 1,
        shadow: 'rgba(139,69,19,0.6) 2px 2px 5px'
      }
    },
    {
      name: 'Skew Left',
      style: {
        skewX: -15,
        skewY: 0
      }
    },
    {
      name: 'Skew Right',
      style: {
        skewX: 15,
        skewY: 0
      }
    },
    {
      name: 'Perspective',
      style: {
        skewX: -10,
        skewY: 5
      }
    },
    {
      name: 'Italic Skew',
      style: {
        skewX: -8,
        fontStyle: 'italic'
      }
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300 mb-3">Text Effects</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {textEffects.map((effect, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeEffect === effect.name) {
                // Deactivate effect
                onApplyEffect({
                  fill: '#000000',
                  stroke: '',
                  strokeWidth: 0,
                  shadow: '',
                  skewX: 0,
                  skewY: 0,
                  fontWeight: 'normal',
                  fontStyle: 'normal'
                });
                setActiveEffect(null);
              } else {
                // Apply effect
                onApplyEffect(effect.style);
                setActiveEffect(effect.name);
              }
            }}
            className={`text-xs p-2 h-auto border-gray-600 hover:bg-[#2a2a2a] text-gray-300 ${
              activeEffect === effect.name 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-[#1e1e1e]'
            }`}
          >
            {effect.name}
          </Button>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-600">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onApplyEffect({
            fill: '#000000',
            stroke: '',
            strokeWidth: 0,
            shadow: '',
            skewX: 0,
            skewY: 0,
            fontWeight: 'normal',
            fontStyle: 'normal'
          })}
          className="w-full text-xs bg-[#1e1e1e] border-gray-600 hover:bg-[#2a2a2a] text-gray-300"
        >
          Reset Effects
        </Button>
      </div>
    </div>
  );
}