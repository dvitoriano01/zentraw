import { Button } from '@/components/ui/button';
import { visualEffects, applyVisualEffectToObject, removeVisualEffectsFromObject } from '@/libs/VisualEffects';

interface VisualEffectsPanelProps {
  selectedObject: any;
  applyEffect: (effect: any) => void;
}

export function VisualEffectsPanel({ selectedObject, applyEffect }: VisualEffectsPanelProps) {
  if (!selectedObject) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Select an object to apply visual effects
      </div>
    );
  }

  const handleApplyEffect = (effect: any) => {
    if (selectedObject) {
      applyVisualEffectToObject(selectedObject, effect);
      selectedObject.canvas?.renderAll();
    }
  };

  const handleRemoveEffects = () => {
    if (selectedObject) {
      removeVisualEffectsFromObject(selectedObject);
      selectedObject.canvas?.renderAll();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">Visual Effects</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemoveEffects}
          className="text-xs h-7 px-2 text-gray-400 border-gray-600 hover:bg-gray-700"
        >
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {visualEffects.map((effect) => (
          <Button
            key={effect.id}
            variant="outline"
            size="sm"
            onClick={() => handleApplyEffect(effect)}
            className="text-xs h-8 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
          >
            {effect.label}
          </Button>
        ))}
      </div>
    </div>
  );
}