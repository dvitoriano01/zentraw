import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/store/editorStore';
import { CANVAS_FORMATS, FormatKey } from '@/types/formats';
import { cn } from '@/lib/utils';
import { ChevronDown, Monitor } from 'lucide-react';

export function FormatSelector() {
  const { canvas, setDimensions, dimensions } = useEditorStore();
  const [selectedFormat, setSelectedFormat] = useState<FormatKey>('square');

  const handleFormatChange = (formatKey: FormatKey) => {
    if (!canvas) return;

    const format = CANVAS_FORMATS[formatKey];
    setSelectedFormat(formatKey);

    // Get all objects on canvas
    const objects = canvas.getObjects();

    // Calculate scale factor to fit content
    const currentAspectRatio = dimensions.width / dimensions.height;
    const newAspectRatio = format.aspectRatio;

    // Update canvas dimensions
    canvas.setDimensions({
      width: format.width,
      height: format.height,
    });

    setDimensions(format.width, format.height);

    // Intelligently scale and position objects
    objects.forEach(obj => {
      if (obj.type === 'image') {
        // For images, maintain aspect ratio and crop if needed
        fitImageToFormat(obj, format, dimensions);
      } else {
        // For other objects, scale proportionally
        const scaleX = format.width / dimensions.width;
        const scaleY = format.height / dimensions.height;
        const uniformScale = Math.min(scaleX, scaleY);

        obj.set({
          left: (obj.left! * scaleX),
          top: (obj.top! * scaleY),
          scaleX: (obj.scaleX! * uniformScale),
          scaleY: (obj.scaleY! * uniformScale),
        });
      }
    });

    canvas.renderAll();
  };

  const fitImageToFormat = (imageObj: any, format: any, currentDims: any) => {
    const imageAspectRatio = imageObj.width / imageObj.height;
    const formatAspectRatio = format.aspectRatio;

    // Calculate scaling to fill the format while maintaining aspect ratio
    let scaleX = format.width / (imageObj.width * imageObj.scaleX);
    let scaleY = format.height / (imageObj.height * imageObj.scaleY);

    if (imageAspectRatio > formatAspectRatio) {
      // Image is wider - scale to fit height and crop width
      const scale = scaleY;
      imageObj.set({
        scaleX: scale,
        scaleY: scale,
        left: format.width / 2,
        top: format.height / 2,
        originX: 'center',
        originY: 'center',
      });
    } else {
      // Image is taller - scale to fit width and crop height
      const scale = scaleX;
      imageObj.set({
        scaleX: scale,
        scaleY: scale,
        left: format.width / 2,
        top: format.height / 2,
        originX: 'center',
        originY: 'center',
      });
    }
  };

  const currentFormat = CANVAS_FORMATS[selectedFormat];

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              <span className="text-sm">{currentFormat.name}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          {Object.entries(CANVAS_FORMATS).map(([key, format]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleFormatChange(key as FormatKey)}
              className={cn(
                "flex justify-between",
                selectedFormat === key && "bg-blue-50 dark:bg-blue-900/20"
              )}
            >
              <span>{format.name}</span>
              <span className="text-xs text-gray-500">
                {format.width}×{format.height}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        <p>Images will be automatically cropped to fit the new format while maintaining their aspect ratio.</p>
      </div>
    </div>
  );
}