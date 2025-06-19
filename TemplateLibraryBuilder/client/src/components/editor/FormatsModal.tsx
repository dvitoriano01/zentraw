import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFormat: (format: string) => void;
}

export function FormatsModal({ open, onOpenChange, onSelectFormat }: FormatsModalProps) {
  const formats = [
    { id: 'cover-art', name: 'Cover Art', dimensions: '2000 × 2000', description: 'Square format for album covers' },
    { id: 'instagram-post', name: 'Instagram Post', dimensions: '1080 × 1080', description: 'Square social media post' },
    { id: 'instagram-story', name: 'Instagram Story', dimensions: '1080 × 1920', description: 'Vertical story format' },
    { id: 'facebook-post', name: 'Facebook Post', dimensions: '1200 × 630', description: 'Horizontal social post' },
    { id: 'twitter-post', name: 'Twitter Post', dimensions: '1024 × 512', description: 'Twitter header image' },
    { id: 'linkedin-post', name: 'LinkedIn Post', dimensions: '1200 × 627', description: 'Professional social post' },
    { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', dimensions: '1280 × 720', description: 'Video thumbnail' },
    { id: 'a4-print', name: 'A4 Print', dimensions: '2480 × 3508', description: 'Standard print format' },
    { id: 'business-card', name: 'Business Card', dimensions: '1050 × 600', description: 'Professional card' },
    { id: 'banner', name: 'Web Banner', dimensions: '1500 × 500', description: 'Horizontal web banner' },
    { id: 'custom', name: 'Custom', dimensions: '800 × 600', description: 'Custom dimensions' }
  ];

  const handleFormatSelect = (formatId: string) => {
    onSelectFormat(formatId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#2a2a2a] border-[#4a4a4a] text-gray-300">
        <DialogHeader>
          <DialogTitle className="text-gray-200">Choose Format</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {formats.map((format) => (
            <Button
              key={format.id}
              variant="outline"
              onClick={() => handleFormatSelect(format.id)}
              className="h-auto p-4 flex flex-col items-start text-left bg-[#1e1e1e] border-gray-600 hover:bg-[#333] hover:border-blue-500"
            >
              <div className="font-medium text-gray-200">{format.name}</div>
              <div className="text-sm text-blue-400">{format.dimensions}</div>
              <div className="text-xs text-gray-500 mt-1">{format.description}</div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}