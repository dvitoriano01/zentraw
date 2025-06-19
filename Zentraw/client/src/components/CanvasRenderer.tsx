import { VisualFilter } from './VisualFilters';

interface CanvasRendererProps {
  template: any;
  format: 'cover' | 'story';
  layerControls: any;
  typography: any;
  uploadedImage: string | null;
  visualFilters: Record<string, VisualFilter>;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = context;
  }

  async renderTemplate(props: CanvasRendererProps): Promise<void> {
    const { template, format, layerControls, typography, uploadedImage, visualFilters } = props;

    // Set canvas dimensions based on format
    if (format === 'cover') {
      this.canvas.width = 1000;
      this.canvas.height = 1000;
    } else {
      this.canvas.width = 1080;
      this.canvas.height = 1920;
    }

    // Clear canvas with white background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render layers in reverse order (bottom to top)
    for (const layerType of [...layerControls.layerOrder].reverse()) {
      await this.renderLayer(layerType, props);
    }
  }

  private async renderLayer(layerType: string, props: CanvasRendererProps): Promise<void> {
    const { layerControls, typography, uploadedImage, template, format, visualFilters } = props;
    
    const layer = layerControls[layerType as keyof typeof layerControls];
    if (typeof layer !== 'object' || !('hidden' in layer) || layer.hidden) return;

    const scale = layer.scale[format] / 100;
    const position = layer.position[format];
    const filters = visualFilters[layerType];
    
    // Save context state
    this.ctx.save();

    // Apply layer opacity
    this.ctx.globalAlpha = layer.opacity / 100;

    // Apply blend mode
    if (filters?.blendMode && filters.blendMode !== 'normal') {
      this.ctx.globalCompositeOperation = this.getBlendMode(filters.blendMode);
    }

    // Apply canvas filters
    if (filters) {
      this.ctx.filter = this.generateCanvasFilter(filters);
    }

    // Render specific layer type
    if (layerType === 'image' && uploadedImage) {
      await this.renderImageLayer(uploadedImage, scale, position);
    } else if (layerType === 'svg') {
      await this.renderSvgLayer(template.svgContent, scale, position);
    } else if (layerType === 'artist' || layerType === 'album') {
      await this.renderTextLayer(layerType, typography, scale, position);
    }

    // Restore context state
    this.ctx.restore();
  }

  private async renderImageLayer(imageUrl: string, scale: number, position: { x: number; y: number }): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2 + position.x, this.canvas.height / 2 + position.y);
        this.ctx.scale(scale, scale);
        
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.8;
        this.ctx.drawImage(img, -size / 2, -size / 2, size, size);
        this.ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = imageUrl;
    });
  }

  private async renderSvgLayer(svgContent: string, scale: number, position: { x: number; y: number }): Promise<void> {
    return new Promise((resolve) => {
      const svgImg = new Image();
      svgImg.onload = () => {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2 + position.x, this.canvas.height / 2 + position.y);
        this.ctx.scale(scale, scale);
        
        // Calculate size based on canvas dimensions
        const size = Math.min(this.canvas.width, this.canvas.height) * 0.6;
        this.ctx.drawImage(svgImg, -size / 2, -size / 2, size, size);
        this.ctx.restore();
        resolve();
      };
      svgImg.onerror = () => {
        console.warn('Failed to load SVG image');
        resolve();
      };
      
      // Add XML declaration and ensure proper SVG format
      const cleanSvgContent = svgContent.startsWith('<?xml') 
        ? svgContent 
        : `<?xml version="1.0" encoding="UTF-8"?>${svgContent}`;
      
      const svgBlob = new Blob([cleanSvgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      svgImg.src = url;
      
      // Clean up URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  private async renderTextLayer(
    layerType: 'artist' | 'album', 
    typography: any, 
    scale: number, 
    position: { x: number; y: number }
  ): Promise<void> {
    const fontConfig = layerType === 'artist' ? typography.artistFont : typography.albumFont;
    const text = layerType === 'artist' ? typography.artistName : typography.albumName;
    
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2 + position.x, this.canvas.height / 2 + position.y);
    this.ctx.scale(scale, scale);
    
    // Apply text transformations
    const transformedText = this.transformText(text, fontConfig.textTransform);
    
    // Set up font with enhanced properties
    this.ctx.font = this.buildFontString(fontConfig);
    this.ctx.textAlign = fontConfig.textAlign;
    this.ctx.textBaseline = 'middle';
    
    const offsetY = layerType === 'artist' ? -30 : 30;
    
    // Apply rotation and skew transformations
    if (fontConfig.rotation !== 0 || fontConfig.skewX !== 0 || fontConfig.skewY !== 0) {
      this.applyTextTransforms(fontConfig);
    }
    
    // Apply text shadow
    if (fontConfig.shadowBlur > 0 || fontConfig.shadowOffsetX !== 0 || fontConfig.shadowOffsetY !== 0) {
      this.ctx.shadowColor = fontConfig.shadowColor;
      this.ctx.shadowBlur = fontConfig.shadowBlur;
      this.ctx.shadowOffsetX = fontConfig.shadowOffsetX;
      this.ctx.shadowOffsetY = fontConfig.shadowOffsetY;
    }
    
    // Draw background if enabled
    if (fontConfig.backgroundOpacity > 0) {
      this.drawTextBackground(transformedText, fontConfig, offsetY);
    }
    
    // Draw text outline/stroke
    if (fontConfig.strokeWidth > 0) {
      this.ctx.strokeStyle = fontConfig.strokeColor;
      this.ctx.lineWidth = fontConfig.strokeWidth;
      this.ctx.strokeText(transformedText, 0, offsetY);
    }
    
    if (fontConfig.outlineWidth > 0) {
      this.ctx.strokeStyle = fontConfig.outlineColor;
      this.ctx.lineWidth = fontConfig.outlineWidth;
      this.ctx.strokeText(transformedText, 0, offsetY);
    }
    
    // Draw main text
    if (fontConfig.gradientEnabled) {
      this.drawGradientText(transformedText, fontConfig, offsetY);
    } else {
      this.ctx.fillStyle = fontConfig.color;
      this.ctx.fillText(transformedText, 0, offsetY);
    }
    
    // Handle text decoration
    if (fontConfig.textDecoration && fontConfig.textDecoration !== 'none') {
      this.drawTextDecoration(transformedText, fontConfig, offsetY);
    }
    
    this.ctx.restore();
  }

  private generateCanvasFilter(filters: VisualFilter): string {
    const filterArray = [];
    
    if (filters.blur > 0) filterArray.push(`blur(${filters.blur}px)`);
    if (filters.brightness !== 100) filterArray.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) filterArray.push(`contrast(${filters.contrast}%)`);
    if (filters.saturation !== 100) filterArray.push(`saturate(${filters.saturation}%)`);
    if (filters.hue !== 0) filterArray.push(`hue-rotate(${filters.hue}deg)`);
    if (filters.sepia > 0) filterArray.push(`sepia(${filters.sepia}%)`);
    if (filters.invert > 0) filterArray.push(`invert(${filters.invert}%)`);
    if (filters.grayscale > 0) filterArray.push(`grayscale(${filters.grayscale}%)`);
    
    return filterArray.join(' ') || 'none';
  }

  private getBlendMode(blendMode: string): GlobalCompositeOperation {
    const blendModeMap: Record<string, GlobalCompositeOperation> = {
      'multiply': 'multiply',
      'screen': 'screen',
      'overlay': 'overlay',
      'soft-light': 'soft-light',
      'hard-light': 'hard-light',
      'color-dodge': 'color-dodge',
      'color-burn': 'color-burn',
      'darken': 'darken',
      'lighten': 'lighten',
      'difference': 'difference',
      'exclusion': 'exclusion'
    };
    
    return blendModeMap[blendMode] || 'source-over';
  }

  private transformText(text: string, textTransform: string): string {
    switch (textTransform) {
      case 'uppercase': return text.toUpperCase();
      case 'lowercase': return text.toLowerCase();
      case 'capitalize': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default: return text;
    }
  }

  private buildFontString(fontConfig: any): string {
    let fontString = '';
    if (fontConfig.fontStyle && fontConfig.fontStyle !== 'normal') {
      fontString += fontConfig.fontStyle + ' ';
    }
    fontString += `${fontConfig.weight} ${fontConfig.size}px ${fontConfig.family}`;
    return fontString;
  }

  private applyTextTransforms(fontConfig: any): void {
    const radRotation = (fontConfig.rotation * Math.PI) / 180;
    const skewXRad = (fontConfig.skewX * Math.PI) / 180;
    const skewYRad = (fontConfig.skewY * Math.PI) / 180;
    
    this.ctx.transform(
      Math.cos(radRotation) + Math.tan(skewYRad) * Math.sin(radRotation),
      Math.sin(radRotation) + Math.tan(skewYRad) * Math.cos(radRotation),
      Math.tan(skewXRad) * Math.cos(radRotation) - Math.sin(radRotation),
      Math.tan(skewXRad) * Math.sin(radRotation) + Math.cos(radRotation),
      0,
      0
    );
  }

  private drawTextBackground(text: string, fontConfig: any, offsetY: number): void {
    const metrics = this.ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontConfig.size;
    
    this.ctx.fillStyle = `${fontConfig.backgroundColor}${Math.round(fontConfig.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`;
    
    const padding = fontConfig.padding;
    const bgX = -(textWidth / 2) - padding;
    const bgY = offsetY - (textHeight / 2) - padding;
    const bgWidth = textWidth + (padding * 2);
    const bgHeight = textHeight + (padding * 2);
    
    if (fontConfig.borderRadius > 0) {
      this.ctx.beginPath();
      this.ctx.roundRect(bgX, bgY, bgWidth, bgHeight, fontConfig.borderRadius);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
    }
  }

  private drawGradientText(text: string, fontConfig: any, offsetY: number): void {
    const gradient = this.ctx.createLinearGradient(-100, -100, 100, 100);
    gradient.addColorStop(0, fontConfig.gradientStart);
    gradient.addColorStop(1, fontConfig.gradientEnd);
    this.ctx.fillStyle = gradient;
    this.ctx.fillText(text, 0, offsetY);
  }

  private drawTextDecoration(text: string, fontConfig: any, offsetY: number): void {
    const metrics = this.ctx.measureText(text);
    const textWidth = metrics.width;
    
    this.ctx.strokeStyle = fontConfig.color;
    this.ctx.lineWidth = Math.max(1, fontConfig.size / 20);
    
    this.ctx.beginPath();
    if (fontConfig.textDecoration === 'underline') {
      this.ctx.moveTo(-textWidth / 2, offsetY + fontConfig.size * 0.1);
      this.ctx.lineTo(textWidth / 2, offsetY + fontConfig.size * 0.1);
    } else if (fontConfig.textDecoration === 'overline') {
      this.ctx.moveTo(-textWidth / 2, offsetY - fontConfig.size * 0.4);
      this.ctx.lineTo(textWidth / 2, offsetY - fontConfig.size * 0.4);
    } else if (fontConfig.textDecoration === 'line-through') {
      this.ctx.moveTo(-textWidth / 2, offsetY - fontConfig.size * 0.1);
      this.ctx.lineTo(textWidth / 2, offsetY - fontConfig.size * 0.1);
    }
    this.ctx.stroke();
  }

  async downloadAsPNG(filename: string): Promise<void> {
    return new Promise((resolve) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        resolve();
      }, 'image/png');
    });
  }
}