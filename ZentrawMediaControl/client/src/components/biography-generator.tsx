import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Wand2, Copy, Edit, Save, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { exportToPDF } from "@/lib/pdf-utils";

export default function BiographyGenerator() {
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    achievements: "",
    influences: "",
    tone: "casual",
    audience: "press"
  });
  const [generatedBio, setGeneratedBio] = useState<{
    shortBio: string;
    fullBio: string;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveProjectMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/projects", {
        name: `Biography - ${data.artistName}`,
        type: "biography",
        data: data
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Saved",
        description: "Your biography project has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      });
    }
  });

  const generateBioMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/biographies", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedBio({
        shortBio: data.shortBio,
        fullBio: data.fullBio
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Biography generated successfully",
      });
    },
    onError: (error: Error) => {
      const isApiKeyError = error.message.includes("OpenAI API key");
      toast({
        title: isApiKeyError ? "API Key Required" : "Error",
        description: isApiKeyError 
          ? "Please add your OpenAI API key in Replit Secrets to use AI generation"
          : error.message || "Failed to generate biography",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.artistName.trim() || !formData.genre.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the artist name and genre",
        variant: "destructive",
      });
      return;
    }
    generateBioMutation.mutate(formData);
  };

  const handleSaveProject = () => {
    if (!formData.artistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an artist name before saving",
        variant: "destructive",
      });
      return;
    }
    saveProjectMutation.mutate(formData);
  };

  const handleExportPDF = () => {
    if (!generatedBio) {
      toast({
        title: "Error",
        description: "Generate a biography first before exporting",
        variant: "destructive",
      });
      return;
    }

    const content = `
      <h1 style="color: #333; margin-bottom: 20px;">${formData.artistName} - Biography</h1>
      <h3 style="color: #666; margin-bottom: 15px;">Short Bio</h3>
      <p style="margin-bottom: 20px; line-height: 1.6;">${generatedBio.shortBio}</p>
      <h3 style="color: #666; margin-bottom: 15px;">Full Biography</h3>
      <div style="line-height: 1.6; white-space: pre-wrap;">${generatedBio.fullBio}</div>
    `;
    
    exportToPDF(content, `${formData.artistName}-Biography.pdf`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <Card id="bio" className="gradient-card border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-blue rounded-xl flex items-center justify-center glow-blue">
              <User className="text-white h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Artist Biography Generator</h3>
              <p className="text-sm text-gray-400">AI-powered professional biographies</p>
            </div>
          </div>
          <span className="gradient-blue text-white text-xs font-medium px-3 py-1.5 rounded-full glow-blue">✨ AI Powered</span>
        </div>
      </div>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
              <Input
                placeholder="Enter your artist name"
                value={formData.artistName}
                onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <Input
                placeholder="e.g., Hip-Hop, Pop, Rock"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                required
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Achievements & Career Highlights</label>
            <Textarea
              rows={3}
              placeholder="List your major achievements, awards, collaborations, etc."
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              className="resize-none bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Musical Influences</label>
            <Input
              placeholder="Artists that inspire your work (optional)"
              value={formData.influences}
              onChange={(e) => setFormData({ ...formData, influences: e.target.value })}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="formal">Formal & Professional</SelectItem>
                  <SelectItem value="casual">Casual & Approachable</SelectItem>
                  <SelectItem value="creative">Creative & Artistic</SelectItem>
                  <SelectItem value="direct">Direct & Concise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
              <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="press">Press & Media</SelectItem>
                  <SelectItem value="spotify">Spotify & Streaming</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="booking">Booking Agents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  artistName: "",
                  genre: "",
                  achievements: "",
                  influences: "",
                  tone: "casual",
                  audience: "press"
                });
                setGeneratedBio(null);
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
              className="flex-1 gradient-blue hover:opacity-90 transition-opacity glow-blue text-white font-medium py-3"
              disabled={generateBioMutation.isPending}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {generateBioMutation.isPending ? "Generating..." : "Generate Biography"}
            </Button>
          </div>
        </form>
        
        {generatedBio && (
          <div className="mt-6 space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-medium text-white mb-2">Short Bio (300 characters)</h4>
              <p className="text-gray-300 text-sm">{generatedBio.shortBio}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h4 className="font-medium text-white mb-2">Full Biography</h4>
              <div className="text-gray-300 text-sm whitespace-pre-wrap">{generatedBio.fullBio}</div>
              <div className="flex space-x-2 mt-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => copyToClipboard(generatedBio.fullBio)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportPDF}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-400/30"
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
