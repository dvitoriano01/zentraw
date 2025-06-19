import React, { useState, useCallback } from 'react';
import { Upload, FileImage, File } from 'lucide-react';

interface DragDropZoneProps {
  onFileUpload: (file: File) => void;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

export function DragDropZone({ onFileUpload, accept = "image/*", className = "", children }: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (accept === "image/*" && file.type.startsWith('image/')) {
        onFileUpload(file);
      } else if (accept === ".svg" && file.name.toLowerCase().endsWith('.svg')) {
        onFileUpload(file);
      } else if (accept === ".json,.template" && (file.name.toLowerCase().endsWith('.json') || file.name.toLowerCase().endsWith('.template'))) {
        onFileUpload(file);
      } else {
        onFileUpload(file);
      }
      e.dataTransfer.clearData();
    }
  }, [onFileUpload, accept]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg transition-all duration-200
        ${isDragging 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${className}
      `}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">Drop files here</p>
          </div>
        </div>
      )}
      
      {children || (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {accept === "image/*" ? (
              <FileImage className="w-12 h-12 text-gray-400" />
            ) : (
              <File className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <p className="text-gray-600 mb-2">
            Drag and drop {accept === "image/*" ? "images" : "files"} here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse
          </p>
        </div>
      )}
    </div>
  );
}