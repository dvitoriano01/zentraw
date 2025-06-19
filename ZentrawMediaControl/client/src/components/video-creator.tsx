import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Play, Download, Share, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function VideoCreator() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [duration, setDuration] = useState("15");
  const [quality, setQuality] = useState("720p");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles } = useQuery({
    queryKey: ["/api/media-files"],
  });

  const imageFiles = Array.isArray(mediaFiles) ? mediaFiles.filter((file: any) => file.type === 'image') : [];
  const audioFiles = Array.isArray(mediaFiles) ? mediaFiles.filter((file: any) => file.type === 'audio') : [];

  const createVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/videos", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedVideo(data);
      setIsProcessing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Video generated successfully",
      });
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to generate video",
        variant: "destructive",
      });
    }
  });

  const handleGenerateVideo = () => {
    if (!selectedImage || !selectedAudio) {
      toast({
        title: "Error",
        description: "Please select both an image and audio file",
        variant: "destructive",
      });
      return;
    }

    const imageFile = imageFiles.find((f: any) => f.id === selectedImage);
    const audioFile = audioFiles.find((f: any) => f.id === selectedAudio);

    if (!imageFile || !audioFile) {
      toast({
        title: "Error",
        description: "Selected files not found",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setGeneratedVideo(null);

    // Process video with actual file data
    setTimeout(() => {
      createVideoMutation.mutate({
        artistName: imageFile.filename.split('-')[0] || "Artist Name",
        songTitle: audioFile.filename.split('-')[0] || "Song Title",
        imageFileId: selectedImage,
        audioFileId: selectedAudio,
        duration: parseInt(duration),
        quality,
        videoUrl: `/uploads/video_${Date.now()}.mp4`
      });
    }, 2000);
  };

  return (
    <Card id="video" className="shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="text-purple-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Promotional Video Creator</h3>
              <p className="text-sm text-gray-600">Generate 20-second promotional videos</p>
            </div>
          </div>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Video AI</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Select Media Files</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artist Image/Cover Art</label>
                <Select value={selectedImage?.toString() || ""} onValueChange={(value) => setSelectedImage(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an image file" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageFiles.map((file: any) => (
                      <SelectItem key={file.id} value={file.id.toString()}>
                        {file.originalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {imageFiles.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No image files uploaded. Please upload images in the Media Library.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audio Track</label>
                <Select value={selectedAudio?.toString() || ""} onValueChange={(value) => setSelectedAudio(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an audio file" />
                  </SelectTrigger>
                  <SelectContent>
                    {audioFiles.map((file: any) => (
                      <SelectItem key={file.id} value={file.id.toString()}>
                        {file.originalName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {audioFiles.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No audio files uploaded. Please upload audio in the Media Library.</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Video Settings</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds (max)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Quality</label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={handleGenerateVideo}
            disabled={isProcessing || !selectedImage || !selectedAudio}
            className="w-full bg-purple-500 hover:bg-purple-600 text-lg font-medium py-3"
          >
            <Play className="mr-2 h-5 w-5" />
            {isProcessing ? "Generating Video..." : "Generate Promotional Video"}
          </Button>
        </div>

        {isProcessing && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Loader2 className="animate-spin h-4 w-4 text-blue-600 mr-3" />
              <span className="text-blue-800 font-medium">Processing video... This may take 1-2 minutes</span>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
            </div>
          </div>
        )}

        {generatedVideo && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Generated Video</h4>
            <div className="aspect-video bg-black rounded-lg mb-4 relative flex items-center justify-center">
              <div className="text-white text-center">
                <Video className="h-12 w-12 mx-auto mb-2 opacity-75" />
                <p className="text-sm opacity-75">Video Preview</p>
                <p className="text-xs opacity-50">({generatedVideo.artistName} - {generatedVideo.songTitle})</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
              <Button variant="outline" className="flex-1">
                <Share className="mr-2 h-4 w-4" />
                Share Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
