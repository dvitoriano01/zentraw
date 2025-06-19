import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface QuickImageUploadProps {
  onUploadSuccess?: (imageData: any) => void;
}

export function QuickImageUpload({ onUploadSuccess }: QuickImageUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Uploaded ${file.name}`);
      formData.append('type', 'upload');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Upload successful!",
        description: "Image uploaded and ready to use.",
      });
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again with a smaller image.",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <Card className={`transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : ''}`}>
      <CardContent className="p-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          {uploadMutation.isPending ? (
            <div>
              <p className="text-gray-600 mb-2">Uploading...</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
                <div className="h-2 bg-blue-500 rounded-full animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or click to select
              </p>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        />
      </CardContent>
    </Card>
  );
}