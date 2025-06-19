import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editorStore";
import { canvasService } from "@/services/canvasService";
import { ExportOptions } from "@/types/canvas";
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportModal({ open, onOpenChange }: ExportModalProps) {
  const { toast } = useToast();
  const { canvas } = useEditorStore();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 'high',
    transparent: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'png', label: 'PNG', description: 'Transparent background' },
    { value: 'jpeg', label: 'JPEG', description: 'Smaller file size' },
    { value: 'svg', label: 'SVG', description: 'Vector format' },
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard (720p)', badge: 'Free', available: true },
    { value: 'high', label: 'High (1080p)', badge: 'Pro', available: true },
    { value: 'ultra', label: 'Ultra (4K)', badge: 'Advanced', available: false },
  ];

  const handleExport = async () => {
    if (!canvas) return;

    setIsExporting(true);
    try {
      const scale = canvasService.getResolutionScale(exportOptions.quality);
      const dataUrl = await canvasService.exportCanvas(canvas, {
        ...exportOptions,
        scale,
      });

      const filename = `zentraw-design.${exportOptions.format}`;
      canvasService.downloadImage(dataUrl, filename);

      toast({
        title: "Export successful",
        description: `Your design has been exported as ${filename}`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your design. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map(format => (
                <Button
                  key={format.value}
                  variant={exportOptions.format === format.value ? "default" : "outline"}
                  className="flex flex-col h-auto p-3 text-center"
                  onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                >
                  <div className="font-semibold">{format.label}</div>
                  <div className="text-xs opacity-80 mt-1">{format.description}</div>
                </Button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quality</Label>
            <div className="space-y-2">
              {qualityOptions.map(quality => (
                <div
                  key={quality.value}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    !quality.available 
                      ? 'opacity-50 cursor-not-allowed' 
                      : exportOptions.quality === quality.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  onClick={() => {
                    if (quality.available) {
                      setExportOptions(prev => ({ ...prev, quality: quality.value as any }));
                    }
                  }}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-700 dark:text-gray-300">{quality.label}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    quality.badge === 'Free' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      : quality.badge === 'Pro'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
                  }`}>
                    {quality.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Background Options */}
          {exportOptions.format === 'png' && (
            <div className="flex items-center justify-between">
              <Label htmlFor="transparent" className="text-sm font-medium">
                Transparent Background
              </Label>
              <Switch
                id="transparent"
                checked={exportOptions.transparent}
                onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, transparent: checked }))}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download mr-2"></i>
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
