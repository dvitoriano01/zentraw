import { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { CanvasRenderer } from './CanvasRenderer';

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: any;
  format: 'cover' | 'story';
  layerControls: any;
  typography: any;
  uploadedImage: string | null;
  visualFilters: Record<string, any>;
}

export function PreviewModal({
  open,
  onOpenChange,
  template,
  format,
  layerControls,
  typography,
  uploadedImage,
  visualFilters
}: PreviewModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (open && template && canvasRef.current) {
      renderPreview();
    }
  }, [open, template, format, layerControls, typography, uploadedImage, visualFilters]);

  const renderPreview = async () => {
    if (!canvasRef.current || !template) return;

    setIsRendering(true);
    try {
      const renderer = new CanvasRenderer(canvasRef.current);
      await renderer.renderTemplate({
        template,
        format,
        layerControls,
        typography,
        uploadedImage,
        visualFilters
      });

      // Convert canvas to preview URL
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPreviewUrl(dataUrl);
    } catch (error) {
      console.error('Error rendering preview:', error);
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = async () => {
    if (!canvasRef.current || !template) return;

    try {
      const renderer = new CanvasRenderer(canvasRef.current);
      await renderer.renderTemplate({
        template,
        format,
        layerControls,
        typography,
        uploadedImage,
        visualFilters
      });

      const filename = `${template.name}-${format}-${typography.artistName}-${typography.albumName}.png`;
      await renderer.downloadAsPNG(filename);
    } catch (error) {
      console.error('Error downloading:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span className="text-lg font-semibold">
              Preview - {format === 'cover' ? 'Cover Format (1:1)' : 'Story Format (9:16)'}
            </span>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
          {isRendering ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Rendering high-quality preview...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={format === 'cover' ? 1000 : 562}
                  height={format === 'cover' ? 1000 : 1000}
                  className="border-2 border-border rounded-lg shadow-2xl bg-white"
                  style={{
                    maxWidth: format === 'cover' ? '500px' : '281px',
                    maxHeight: '500px',
                    imageRendering: 'high-quality'
                  }}
                />
                {isRendering && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg backdrop-blur-sm">
                    <div className="bg-white px-4 py-2 rounded-lg text-sm font-medium">
                      Rendering preview...
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleDownload} className="flex items-center space-x-2 px-6" size="lg">
                  <Download className="w-4 h-4" />
                  <span>Download {format === 'cover' ? 'Cover (1000x1000)' : 'Story (562x1000)'}</span>
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}