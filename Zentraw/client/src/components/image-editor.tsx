import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageEditorProps {
  imageUrl: string;
  title: string;
  onSave: (editedImageUrl: string) => void;
}

export function ImageEditor({ imageUrl, title, onSave }: ImageEditorProps) {
  const [artistName, setArtistName] = useState("");
  const [albumTitle, setAlbumTitle] = useState(title);
  const [showWatermark, setShowWatermark] = useState(true);

  const addTextToImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add watermark if enabled
      if (showWatermark) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('ZENTRAW PREVIEW', 20, 40);
      }
      
      // Add artist name at bottom
      if (artistName) {
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.strokeText(artistName, canvas.width / 2, canvas.height - 80);
        ctx.fillText(artistName, canvas.width / 2, canvas.height - 80);
      }
      
      // Add album title
      if (albumTitle) {
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.strokeText(albumTitle, canvas.width / 2, canvas.height - 30);
        ctx.fillText(albumTitle, canvas.width / 2, canvas.height - 30);
      }
      
      const editedUrl = canvas.toDataURL('image/png');
      onSave(editedUrl);
    };
    
    img.src = imageUrl;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-4">Editor de Template</h4>
        
        <div className="space-y-4">
          <div>
            <Label>Nome do Artista</Label>
            <Input 
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Nome do artista"
            />
          </div>
          
          <div>
            <Label>Título do Álbum</Label>
            <Input 
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="Título do álbum"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={showWatermark}
              onChange={(e) => setShowWatermark(e.target.checked)}
            />
            <Label>Mostrar marca d'água no preview</Label>
          </div>
          
          <Button onClick={addTextToImage} className="w-full">
            Aplicar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}