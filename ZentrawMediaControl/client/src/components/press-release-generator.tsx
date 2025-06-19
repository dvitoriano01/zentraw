import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Newspaper, Copy, FileDown, Save, Wand2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToPDF } from "@/lib/pdf-utils";

export default function PressReleaseGenerator() {
  const [formData, setFormData] = useState({
    artistName: "",
    songTitle: "",
    musicStyle: "",
    mood: "",
    releaseDate: "",
    collaborators: "",
    themeMessage: ""
  });
  const [generatedRelease, setGeneratedRelease] = useState<{
    shortRelease: string;
    fullRelease: string;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/projects", {
        name: `Press Release - ${data.artistName}`,
        type: "press-release",
        data: data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Saved",
        description: "Your press release project has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    },
  });

  const generateReleaseMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/press-releases", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedRelease(data);
      toast({
        title: "Press Release Generated!",
        description: "Your AI-powered press release is ready",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate press release. Please check your OpenAI API key.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateReleaseMutation.mutate(formData);
  };

  const handleSaveProject = () => {
    saveProjectMutation.mutate(formData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Press release text has been copied",
    });
  };

  const handleExportPDF = () => {
    if (!generatedRelease) return;
    
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">Press Release</h1>
        <h2 style="color: #666; margin-bottom: 30px;">${formData.artistName} - ${formData.songTitle}</h2>
        <div style="line-height: 1.6; color: #444;">
          ${generatedRelease.fullRelease.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
    
    exportToPDF(content, `press-release-${formData.artistName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <Card className="shadow-lg bg-white/10 backdrop-blur-md border border-white/20">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Press Release Generator</h2>
            <p className="text-gray-300 text-sm">Create professional press releases with AI</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
              <Input
                value={formData.artistName}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                placeholder="Your artist or band name"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Song/Album Title</label>
              <Input
                value={formData.songTitle}
                onChange={(e) => setFormData({ ...formData, songTitle: e.target.value })}
                placeholder="Name of your release"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Music Style</label>
              <Input
                value={formData.musicStyle}
                onChange={(e) => setFormData({ ...formData, musicStyle: e.target.value })}
                placeholder="e.g., Electronic, Pop, Hip-hop"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood/Vibe</label>
              <Input
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                placeholder="e.g., Energetic, Melancholic, Uplifting"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
              <Input
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                placeholder="When will it be released?"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Collaborators</label>
              <Input
                value={formData.collaborators}
                onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
                placeholder="Featured artists, producers, etc."
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Key Message/Theme</label>
            <Textarea
              value={formData.themeMessage}
              onChange={(e) => setFormData({ ...formData, themeMessage: e.target.value })}
              placeholder="What's the main story or message behind this release?"
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>
          <div className="flex space-x-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  artistName: "",
                  songTitle: "",
                  musicStyle: "",
                  mood: "",
                  releaseDate: "",
                  collaborators: "",
                  themeMessage: ""
                });
                setGeneratedRelease(null);
              }}
              className="border-white/20 hover:bg-white/10 text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              New
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleSaveProject}
              disabled={saveProjectMutation.isPending}
              className="border-white/20 hover:bg-white/10 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {saveProjectMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 gradient-emerald hover:opacity-90 transition-opacity glow-emerald text-white font-medium py-3"
              disabled={generateReleaseMutation.isPending}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {generateReleaseMutation.isPending ? "Generating..." : "Generate Press Release"}
            </Button>
          </div>
        </form>

        {generatedRelease && (
          <div className="mt-6 space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-medium text-white mb-2">Short Release (Social Media)</h4>
              <p className="text-gray-300 text-sm">{generatedRelease.shortRelease}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-medium text-white mb-2">Full Press Release</h4>
              <div className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{generatedRelease.fullRelease}</div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(generatedRelease.fullRelease)}
                  className="flex-1 border-white/20 hover:bg-white/10 text-white"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleExportPDF}
                  className="flex-1 gradient-blue hover:opacity-90 transition-opacity"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}