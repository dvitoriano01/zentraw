import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileAudio, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; title: string; tags: string }) => {
      const formData = new FormData();
      formData.append('audio', data.file);
      formData.append('title', data.title);
      formData.append('tags', data.tags);

      const response = await fetch('/api/meetings', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meeting uploaded and transcription started!",
      });
      
      // Reset form
      setFile(null);
      setTitle("");
      setTags("");
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/action-items/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/ogg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select an audio file (MP3, WAV, M4A, OGG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Auto-generate title if empty
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(`Meeting - ${fileName}`);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select an audio file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for the meeting",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      file,
      title: title.trim(),
      tags: tags.trim(),
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Recording</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : file 
                  ? "border-green-300 bg-green-50" 
                  : "border-gray-300 hover:border-primary"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileInputChange}
              disabled={uploadMutation.isPending}
            />
            
            {file ? (
              <div className="space-y-2">
                <FileAudio className="w-12 h-12 text-green-600 mx-auto" />
                <h4 className="text-lg font-medium text-gray-900">{file.name}</h4>
                <p className="text-gray-500">{formatFileSize(file.size)}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  disabled={uploadMutation.isPending}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your audio file here
                </h4>
                <p className="text-gray-500 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-400">
                  Supports MP3, WAV, M4A, OGG files up to 100MB
                </p>
              </>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekly Team Standup"
                disabled={uploadMutation.isPending}
                required
              />
            </div>
            <div>
              <Label htmlFor="meeting-tags">Tags (comma-separated)</Label>
              <Input
                id="meeting-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="team, standup, weekly"
                disabled={uploadMutation.isPending}
              />
            </div>
          </div>

          {/* Upload Progress */}
          {uploadMutation.isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Processing your audio file...
              </div>
              <div className="text-xs text-gray-500">
                This may take a few minutes depending on the file size
              </div>
            </div>
          )}

          {/* Error Display */}
          {uploadMutation.isError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">
                {uploadMutation.error?.message || "Upload failed"}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!file || !title.trim() || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Transcribe
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
