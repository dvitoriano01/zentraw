// Visual Effects library for Fabric.js objects

export interface VisualEffect {
  id: string;
  label: string;
  fabricOptions: {
    filter?: any;
    css?: string;
  };
}

export const visualEffects: VisualEffect[] = [
  {
    id: 'none',
    label: 'None',
    fabricOptions: { css: 'none' }
  },
  {
    id: 'lofi',
    label: 'Lo-Fi',
    fabricOptions: { css: 'contrast(1.4) saturate(1.6)' }
  },
  {
    id: 'clarendon',
    label: 'Clarendon',
    fabricOptions: { css: 'brightness(1.2) contrast(1.1) saturate(1.2)' }
  },
  {
    id: 'vhs',
    label: 'VHS',
    fabricOptions: { css: 'contrast(1.5) saturate(1.2) hue-rotate(-15deg)' }
  },
  {
    id: 'prisma',
    label: 'Prisma',
    fabricOptions: { css: 'contrast(1.4) saturate(1.4) sepia(0.3)' }
  },
  {
    id: 'tumblr',
    label: 'Tumblr',
    fabricOptions: { css: 'saturate(1.3) hue-rotate(10deg) brightness(1.1)' }
  },
  {
    id: 'grayscale',
    label: 'B&W',
    fabricOptions: { 
      css: 'grayscale(1)'
    }
  },
  {
    id: 'brightness',
    label: 'Bright',
    fabricOptions: { css: 'brightness(1.3) contrast(1.1)' }
  },
  {
    id: 'blur',
    label: 'Blur',
    fabricOptions: { 
      css: 'blur(2px)'
    }
  },
  {
    id: 'noise',
    label: 'Noise',
    fabricOptions: { 
      css: 'contrast(1.2) brightness(1.1)'
    }
  },
  {
    id: 'vintage',
    label: 'Vintage',
    fabricOptions: { 
      css: 'sepia(0.8) contrast(1.2) brightness(1.1)'
    }
  },
  {
    id: 'invert',
    label: 'Invert',
    fabricOptions: { 
      css: 'invert(1)'
    }
  }
];

export function applyVisualEffectToObject(object: any, effect: VisualEffect) {
  if (!object) return;
  
  // Clear existing filters first
  object.set('filters', []);
  
  // Apply CSS-based effects using style attribute
  if (effect.fabricOptions.css && effect.fabricOptions.css !== 'none') {
    const element = object.getElement ? object.getElement() : object._element;
    if (element) {
      element.style.filter = effect.fabricOptions.css;
    }
    object.set('cssFilter', effect.fabricOptions.css);
  } else {
    // Clear effects
    const element = object.getElement ? object.getElement() : object._element;
    if (element) {
      element.style.filter = '';
    }
    object.set('cssFilter', '');
  }
  
  // Store effect metadata
  object.set('appliedEffect', effect.id);
  
  // Force canvas refresh
  if (object.canvas) {
    object.canvas.renderAll();
  }
}

export function removeVisualEffectsFromObject(object: any) {
  if (!object) return;
  
  // Remove CSS filter
  object.set('cssFilter', 'none');
  object.set('appliedEffect', null);
}