import React, { useRef, useEffect } from 'react';

interface TextEffectPreviewProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  effectName: string;
  effectProperties: any;
  width?: number;
  height?: number;
}

export function TextEffectPreview({ 
  text, 
  fontSize, 
  fontFamily, 
  effectName, 
  effectProperties,
  width = 200,
  height = 60
}: TextEffectPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width * 2; // For high DPI
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set base text properties
    ctx.font = `${Math.min(fontSize, 24)}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = width / 2;
    const y = height / 2;

    // Apply effect-specific styling
    switch (effectName) {
      case 'shadow':
        if (effectProperties.shadowColor && effectProperties.shadowOffsetX !== undefined) {
          ctx.shadowColor = effectProperties.shadowColor;
          ctx.shadowOffsetX = effectProperties.shadowOffsetX / 2;
          ctx.shadowOffsetY = effectProperties.shadowOffsetY / 2;
          ctx.shadowBlur = effectProperties.shadowBlur / 2;
        }
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
        break;

      case 'glow':
        if (effectProperties.glowColor && effectProperties.glowBlur) {
          // Create glow effect with multiple shadows
          for (let i = 0; i < 3; i++) {
            ctx.shadowColor = effectProperties.glowColor;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = effectProperties.glowBlur / 2;
            ctx.fillStyle = effectProperties.glowColor;
            ctx.fillText(text, x, y);
          }
          // Main text
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x, y);
        }
        break;

      case 'outline':
        if (effectProperties.strokeColor && effectProperties.strokeWidth) {
          ctx.strokeStyle = effectProperties.strokeColor;
          ctx.lineWidth = effectProperties.strokeWidth;
          ctx.strokeText(text, x, y);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x, y);
        }
        break;

      case 'gradient':
        if (effectProperties.gradientStart && effectProperties.gradientEnd) {
          const angle = (effectProperties.gradientAngle || 0) * (Math.PI / 180);
          const gradient = ctx.createLinearGradient(
            x - Math.cos(angle) * 50,
            y - Math.sin(angle) * 50,
            x + Math.cos(angle) * 50,
            y + Math.sin(angle) * 50
          );
          gradient.addColorStop(0, effectProperties.gradientStart);
          gradient.addColorStop(1, effectProperties.gradientEnd);
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        }
        break;

      case 'neon':
        if (effectProperties.neonColor) {
          // Outer glow
          ctx.shadowColor = effectProperties.neonColor;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 20;
          ctx.fillStyle = effectProperties.neonColor;
          ctx.fillText(text, x, y);
          
          // Inner glow
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(text, x, y);
          
          // Core text
          ctx.shadowBlur = 0;
          ctx.fillStyle = effectProperties.neonColor;
          ctx.fillText(text, x, y);
        }
        break;

      case 'fire':
        if (effectProperties.fireColor1 && effectProperties.fireColor2) {
          const gradient = ctx.createLinearGradient(x, y - 15, x, y + 15);
          gradient.addColorStop(0, effectProperties.fireColor1);
          gradient.addColorStop(1, effectProperties.fireColor2);
          
          // Fire glow
          ctx.shadowColor = effectProperties.fireColor1;
          ctx.shadowBlur = 15;
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        }
        break;

      case 'ice':
        if (effectProperties.iceColor) {
          // Ice crystal effect
          ctx.shadowColor = effectProperties.iceColor;
          ctx.shadowBlur = 8;
          ctx.fillStyle = effectProperties.iceColor;
          ctx.fillText(text, x, y);
          
          // Highlight
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.7;
          ctx.fillText(text, x, y - 1);
          ctx.globalAlpha = 1;
        }
        break;

      case 'retro':
        if (effectProperties.retroColor1 && effectProperties.retroColor2) {
          // Chrome effect simulation
          const gradient = ctx.createLinearGradient(x, y - 10, x, y + 10);
          gradient.addColorStop(0, effectProperties.retroColor1);
          gradient.addColorStop(0.5, '#ffffff');
          gradient.addColorStop(1, effectProperties.retroColor2);
          
          ctx.fillStyle = gradient;
          ctx.fillText(text, x, y);
        }
        break;

      case 'holographic':
        // Simplified holographic effect
        const holoGradient = ctx.createLinearGradient(x - 50, y, x + 50, y);
        holoGradient.addColorStop(0, '#ff00ff');
        holoGradient.addColorStop(0.33, '#00ffff');
        holoGradient.addColorStop(0.66, '#ffff00');
        holoGradient.addColorStop(1, '#ff00ff');
        
        ctx.fillStyle = holoGradient;
        ctx.fillText(text, x, y);
        break;

      case 'vintage':
        // Sepia tone effect
        ctx.fillStyle = '#8b4513';
        ctx.shadowColor = '#654321';
        ctx.shadowBlur = 2;
        ctx.fillText(text, x, y);
        break;

      default:
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
    }
  }, [text, fontSize, fontFamily, effectName, effectProperties, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-[#4a4a4a] rounded bg-black"
      style={{ width, height }}
    />
  );
}