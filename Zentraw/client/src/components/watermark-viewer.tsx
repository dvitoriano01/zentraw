import { useEffect, useRef } from "react";

interface WatermarkViewerProps {
  imageUrl: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function WatermarkViewer({ imageUrl, onCanvasReady }: WatermarkViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermarks with specified layout
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Main watermark in center (10% of image size)
      const mainSize = Math.min(canvas.width, canvas.height) * 0.1;
      ctx.font = `bold ${mainSize}px Arial`;
      ctx.fillText('ZENTRAW', centerX, centerY);
      
      // Top-left watermark (5% of image size)
      const smallSize = Math.min(canvas.width, canvas.height) * 0.05;
      ctx.font = `bold ${smallSize}px Arial`;
      ctx.fillText('ZENTRAW', canvas.width * 0.25, canvas.height * 0.25);
      
      // Bottom-right watermark (5% of image size)
      ctx.fillText('ZENTRAW', canvas.width * 0.75, canvas.height * 0.75);
      
      onCanvasReady?.(canvas);
    };
    
    img.onerror = () => {
      console.error('Failed to load image for watermarking');
    };
    
    img.src = imageUrl;
  }, [imageUrl, onCanvasReady]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full object-contain"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    />
  );
}