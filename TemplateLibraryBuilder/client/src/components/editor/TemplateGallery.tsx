import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplates } from "@/hooks/use-templates";
import { useEditorStore } from "@/store/editorStore";
import { canvasService } from "@/services/canvasService";
import { useToast } from "@/hooks/use-toast";

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const { toast } = useToast();
  const { canvas } = useEditorStore();
  const {
    templates,
    categories,
    selectedTemplate,
    searchQuery,
    selectedCategory,
    isLoading,
    setSelectedTemplate,
    setSearchQuery,
    setSelectedCategory,
  } = useTemplates();

  const handleLoadTemplate = async () => {
    if (!selectedTemplate || !canvas) return;

    try {
      await canvasService.loadTemplate(canvas, { objects: selectedTemplate.layers });
      toast({
        title: "Template loaded",
        description: `${selectedTemplate.name} has been loaded to the canvas.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load template. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Template Gallery</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Grid */}
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map(template => (
                  <div
                    key={template.id}
                    className={`group cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                      selectedTemplate?.id === template.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{template.category}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {template.dimensions.width} × {template.dimensions.height}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && templates.length === 0 && (
              <div className="text-center py-8">
                <i className="fas fa-search text-3xl text-gray-400 dark:text-gray-500 mb-3"></i>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No templates found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {templates.length} template{templates.length !== 1 ? 's' : ''}
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleLoadTemplate}
                disabled={!selectedTemplate}
              >
                Use Template
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
