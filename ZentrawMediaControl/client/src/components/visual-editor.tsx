import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Wand2, Type, Shapes, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VisualEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(true); // Enable all features
  const { toast } = useToast();

  const generateCoverArt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ARTIST NAME', canvas.width/2, canvas.height/2 - 20);
    
    ctx.font = '18px Arial';
    ctx.fillText('Song Title', canvas.width/2, canvas.height/2 + 20);
    
    toast({
      title: "Success!",
      description: "Cover art generated successfully",
    });
  };

  const togglePremiumFeatures = () => {
    setShowPremiumFeatures(!showPremiumFeatures);
    toast({
      title: "Premium Features",
      description: "Upgrade to Premium for advanced editing tools, unlimited exports, and priority processing.",
    });
  };

  useEffect(() => {
    generateCoverArt();
  }, []);

  return (
    <Card className="shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Palette className="text-indigo-600 h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Visual Editor</h3>
              <p className="text-sm text-gray-600">Create cover art & graphics</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={togglePremiumFeatures}
            className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          >
            <Crown className="mr-1 h-4 w-4" />
            Premium
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        {/* Canvas Preview */}
        <div className="mb-4 flex justify-center">
          <canvas 
            ref={canvasRef}
            width={300} 
            height={300} 
            className="border border-gray-300 rounded-lg bg-black max-w-full"
            style={{ maxWidth: '300px', height: '300px' }}
          />
        </div>
        
        {/* Quick Tools */}
        <div className="space-y-3">
          <Button 
            onClick={generateCoverArt}
            className="w-full bg-indigo-500 hover:bg-indigo-600"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Auto-Generate Cover
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ 
                title: "Premium Feature", 
                description: "Upgrade to add custom text elements" 
              })}
            >
              <Type className="mr-1 h-4 w-4" />
              Add Text
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ 
                title: "Premium Feature", 
                description: "Upgrade to add shapes and elements" 
              })}
            >
              <Shapes className="mr-1 h-4 w-4" />
              Shapes
            </Button>
          </div>
          
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center text-amber-800 text-sm">
              <Crown className="mr-2 h-4 w-4" />
              <span>Upgrade to Premium for advanced editing tools</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
