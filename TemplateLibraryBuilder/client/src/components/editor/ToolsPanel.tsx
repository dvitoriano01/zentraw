import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { useUserStore } from "@/store/userStore";
import { canvasService } from "@/services/canvasService";
import { SvgTemplateLoader } from "@/components/editor/SvgTemplateLoader";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { GridControls } from "@/components/editor/GridControls";
import { cn } from "@/lib/utils";
import { hasFeature } from "@/types/plans";

export function ToolsPanel() {
  const { canvas, selectedTool, setSelectedTool } = useEditorStore();
  const { currentPlan } = useUserStore();

  const tools = [
    { id: 'select', name: 'Select', icon: 'fas fa-mouse-pointer' },
    { id: 'text', name: 'Text', icon: 'fas fa-font' },
    { id: 'shapes', name: 'Shapes', icon: 'fas fa-shapes' },
    { id: 'images', name: 'Images', icon: 'fas fa-image' },
    { id: 'svg', name: 'SVG Layouts', icon: 'fas fa-vector-square' },
  ];

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: 'fas fa-square' },
    { id: 'circle', name: 'Circle', icon: 'fas fa-circle' },
    { id: 'triangle', name: 'Triangle', icon: 'fas fa-play' },
  ];

  const svgLayouts = [
    { id: 'instagram-layout', name: 'Instagram Post', icon: 'fab fa-instagram' },
    { id: 'story-layout', name: 'Story', icon: 'fas fa-mobile-alt' },
    { id: 'business-card', name: 'Business Card', icon: 'fas fa-id-card' },
    { id: 'logo-layout', name: 'Logo Template', icon: 'fas fa-star' },
    { id: 'admin-banner', name: 'Premium Banner', icon: 'fas fa-flag' },
    { id: 'admin-infographic', name: 'Advanced Infographic', icon: 'fas fa-chart-bar' },
    { id: 'premium-poster', name: 'Event Poster', icon: 'fas fa-calendar-alt' },
    { id: 'admin-certificate', name: 'Certificate Template', icon: 'fas fa-award' },
  ];

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  const handleShapeAdd = (shapeType: string) => {
    if (!canvas) return;

    switch (shapeType) {
      case 'rectangle':
        canvasService.createRectangle(canvas);
        break;
      case 'circle':
        canvasService.createCircle(canvas);
        break;
      case 'triangle':
        canvasService.createTriangle(canvas);
        break;
    }
  };

  const handleTextAdd = () => {
    if (!canvas) return;
    canvasService.createText(canvas);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,image/svg+xml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && canvas) {
        canvasService.addImage(canvas, file).catch(error => {
          console.error('Failed to upload image:', error);
          alert('Failed to upload image. Please try a different image file.');
        });
      }
    };
    input.click();
  };

  const handleSvgLayoutAdd = (layoutType: string) => {
    if (!canvas) return;
    canvasService.createSvgLayout(canvas, layoutType);
  };

  return (
    <div className="p-4">
      <FormatSelector />
      
      <GridControls />
      
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 mt-4">Tools</h3>
      <div className="space-y-2">
        {tools.map(tool => (
          <Button
            key={tool.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              selectedTool === tool.id && "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
            )}
            onClick={() => handleToolSelect(tool.id)}
          >
            <i className={`${tool.icon} mr-3 w-4`}></i>
            {tool.name}
          </Button>
        ))}
      </div>

      {selectedTool === 'shapes' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shapes</h4>
          <div className="grid grid-cols-3 gap-2">
            {shapes.map(shape => (
              <Button
                key={shape.id}
                variant="outline"
                size="sm"
                className="aspect-square p-0"
                onClick={() => handleShapeAdd(shape.id)}
              >
                <i className={`${shape.icon} ${shape.id === 'triangle' ? 'rotate-90' : ''}`}></i>
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedTool === 'text' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Text</h4>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleTextAdd}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Text
          </Button>
        </div>
      )}

      {selectedTool === 'images' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images</h4>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleImageUpload}
          >
            <i className="fas fa-upload mr-2"></i>
            Upload Image
          </Button>
        </div>
      )}

      {selectedTool === 'svg' && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SVG Layouts
            {!hasFeature(currentPlan, 'svgLayouts') && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Advanced+
              </span>
            )}
          </h4>
          
          {!hasFeature(currentPlan, 'svgLayouts') ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <i className="fas fa-crown text-2xl text-orange-500 mb-2"></i>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  SVG layouts are available with Advanced and Admin plans
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {svgLayouts.map(layout => {
                  const isAdminOnly = layout.id.includes('admin') || layout.id.includes('premium');
                  const canUse = !isAdminOnly || currentPlan === 'Admin';
                  
                  return (
                    <Button
                      key={layout.id}
                      variant="outline"
                      className={cn(
                        "w-full justify-start",
                        !canUse && "opacity-60 cursor-not-allowed"
                      )}
                      onClick={() => canUse && handleSvgLayoutAdd(layout.id)}
                      disabled={!canUse}
                    >
                      <i className={`${layout.icon} mr-2`}></i>
                      {layout.name}
                      {isAdminOnly && currentPlan !== 'Admin' && (
                        <span className="ml-auto text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              <SvgTemplateLoader />
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <i className="fas fa-undo"></i>
          </Button>
          <Button variant="outline" size="sm">
            <i className="fas fa-redo"></i>
          </Button>
          <Button variant="outline" size="sm">
            <i className="fas fa-search-plus"></i>
          </Button>
          <Button variant="outline" size="sm">
            <i className="fas fa-search-minus"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
