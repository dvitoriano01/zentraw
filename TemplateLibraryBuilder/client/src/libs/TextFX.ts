export interface TextEffect {
  id: string;
  label: string;
  fabricOptions: {
    shadow?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDashArray?: number[];
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
    skewX?: number;
    skewY?: number;
    angle?: number;
    opacity?: number;
  };
}

export const textEffects: { [key: string]: TextEffect } = {
  glitch: {
    id: 'glitch',
    label: 'Glitch',
    fabricOptions: {
      shadow: 'rgba(255, 0, 0, 0.8) 2px 0 0, rgba(0, 255, 255, 0.8) -2px 0 0',
      fill: '#ffffff',
      stroke: '#ff0000',
      strokeWidth: 1,
      skewX: -5
    }
  },
  neon: {
    id: 'neon',
    label: 'Neon',
    fabricOptions: {
      shadow: 'rgba(0, 255, 255, 1) 0 0 20px, rgba(0, 255, 255, 0.8) 0 0 40px',
      fill: '#00ffff',
      stroke: '#0080ff',
      strokeWidth: 2
    }
  },
  retro: {
    id: 'retro',
    label: 'Retro',
    fabricOptions: {
      fill: '#ff6b35',
      stroke: '#004e89',
      strokeWidth: 3,
      shadow: 'rgba(0, 0, 0, 0.8) 4px 4px 0'
    }
  },
  outline: {
    id: 'outline',
    label: 'Outline',
    fabricOptions: {
      fill: 'transparent',
      stroke: '#ffffff',
      strokeWidth: 2
    }
  },
  shadow: {
    id: 'shadow',
    label: 'Shadow',
    fabricOptions: {
      fill: '#ffffff',
      shadow: 'rgba(0, 0, 0, 0.8) 4px 4px 8px'
    }
  },
  chrome: {
    id: 'chrome',
    label: 'Chrome',
    fabricOptions: {
      fill: 'linear-gradient(45deg, #c0c0c0, #ffffff, #c0c0c0)',
      stroke: '#808080',
      strokeWidth: 1,
      shadow: 'rgba(0, 0, 0, 0.5) 2px 2px 4px'
    }
  },
  fire: {
    id: 'fire',
    label: 'Fire',
    fabricOptions: {
      fill: 'linear-gradient(45deg, #ff0000, #ff8800, #ffff00)',
      shadow: 'rgba(255, 0, 0, 0.8) 0 0 20px, rgba(255, 136, 0, 0.6) 0 0 40px'
    }
  },
  ice: {
    id: 'ice',
    label: 'Ice',
    fabricOptions: {
      fill: 'linear-gradient(45deg, #87ceeb, #ffffff, #b0e0e6)',
      stroke: '#4682b4',
      strokeWidth: 1,
      shadow: 'rgba(135, 206, 235, 0.8) 0 0 15px'
    }
  },
  vintage: {
    id: 'vintage',
    label: 'Vintage',
    fabricOptions: {
      fill: '#8b4513',
      shadow: 'rgba(139, 69, 19, 0.6) 3px 3px 6px',
      opacity: 0.9
    }
  },
  psychedelic: {
    id: 'psychedelic',
    label: 'Psychedelic',
    fabricOptions: {
      fill: 'linear-gradient(45deg, #ff00ff, #00ff00, #ff0000, #0000ff)',
      skewX: 10,
      angle: 5,
      shadow: 'rgba(255, 0, 255, 0.8) 0 0 25px'
    }
  },
  cyberpunk: {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    fabricOptions: {
      fill: '#00ff41',
      stroke: '#ff0080',
      strokeWidth: 2,
      shadow: 'rgba(0, 255, 65, 0.8) 0 0 20px, rgba(255, 0, 128, 0.6) 0 0 40px'
    }
  },
  graffiti: {
    id: 'graffiti',
    label: 'Graffiti',
    fabricOptions: {
      fill: '#ff6b35',
      stroke: '#004e89',
      strokeWidth: 4,
      skewX: -10,
      shadow: 'rgba(0, 0, 0, 0.8) 6px 6px 0'
    }
  }
};

export function applyTextEffectToObject(object: any, effect: TextEffect) {
  if (!object || object.type !== 'i-text') return;

  const options = effect.fabricOptions;
  
  // Apply all effect properties
  Object.keys(options).forEach(key => {
    if (options[key as keyof typeof options] !== undefined) {
      object.set(key, options[key as keyof typeof options]);
    }
  });

  // Store effect metadata
  object.set('appliedTextEffect', effect.id);
}

export function removeTextEffectsFromObject(object: any) {
  if (!object || object.type !== 'i-text') return;
  
  // Reset to default text properties
  object.set({
    shadow: null,
    fill: '#000000',
    stroke: null,
    strokeWidth: 0,
    strokeDashArray: null,
    skewX: 0,
    skewY: 0,
    angle: 0,
    opacity: 1,
    appliedTextEffect: null
  });
}