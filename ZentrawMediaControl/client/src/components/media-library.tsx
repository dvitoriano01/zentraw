import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, Image, Music, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function MediaLibrary() {
  const [dragOver, setDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles } = useQuery({
    queryKey: ["/api/media-files"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch("/api/media-files", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media-files"] });
      toast({
        title: "Success!",
        description: "File uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/media-files/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media-files"] });
      toast({
        title: "Success!",
        description: "File deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: `File ${file.name} is too large. Maximum size is 20MB.`,
          variant: "destructive",
        });
        return;
      }
      
      uploadMutation.mutate(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const imageFiles = mediaFiles?.filter((file: any) => file.type === 'image') || [];
  const audioFiles = mediaFiles?.filter((file: any) => file.type === 'audio') || [];

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card id="media" className="shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <CloudUpload className="text-amber-600 h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Media Library</h3>
            <p className="text-sm text-gray-600">Upload and manage your assets</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        {/* Image Upload */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Press Photos & Artwork</h4>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => imageInputRef.current?.click()}
          >
            <Image className="text-2xl text-gray-400 mb-2 h-8 w-8 mx-auto" />
            <p className="text-sm text-gray-600">Upload images</p>
            <p className="text-xs text-gray-500">JPG, PNG up to 10MB each</p>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
          
          {/* Image Preview */}
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {imageFiles.map((file: any) => (
                <div key={file.id} className="relative group">
                  <img 
                    src={file.url} 
                    alt={file.originalName}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Upload */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Audio Tracks</h4>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => audioInputRef.current?.click()}
          >
            <Music className="text-2xl text-gray-400 mb-2 h-8 w-8 mx-auto" />
            <p className="text-sm text-gray-600">Upload audio files</p>
            <p className="text-xs text-gray-500">MP3, WAV up to 20MB each</p>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
          
          {/* Audio Preview */}
          {audioFiles.length > 0 && (
            <div className="space-y-3 mt-4">
              {audioFiles.map((file: any) => (
                <div key={file.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{file.originalName}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(file.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <audio controls className="w-full h-8" controlsList="nodownload">
                    <source src={file.url} type={file.mimeType} />
                  </audio>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Size: {formatFileSize(file.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
