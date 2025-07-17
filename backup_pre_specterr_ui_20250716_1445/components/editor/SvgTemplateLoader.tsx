import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';
import { canvasService } from '@/services/canvasService';
import { cn } from '@/lib/utils';

export function SvgTemplateLoader() {
  const { canvas } = useEditorStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!canvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target?.result as string;
      loadSvgTemplate(svgContent);
    };
    reader.readAsText(file);
  };

  const loadSvgTemplate = async (svgContent: string) => {
    if (!canvas) return;

    try {
      // Create a temporary image from SVG
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      // Use the existing canvasService method
      await canvasService.addImage(canvas, url);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error loading SVG template:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const svgFile = files.find(file => 
      file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
    );

    if (svgFile) {
      handleFileSelect(svgFile);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="p-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Load SVG Template
      </h4>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseFiles}
      >
        <div className="flex flex-col items-center space-y-3">
          <i className="fas fa-file-upload text-2xl text-gray-400"></i>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Drop SVG template here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              or click to browse files
            </p>
          </div>
          <Button variant="outline" size="sm" type="button">
            <i className="fas fa-folder-open mr-2"></i>
            Browse Files
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Supported formats: SVG</p>
        <p>The template will be automatically centered and scaled to fit the canvas.</p>
      </div>
    </div>
  );
}