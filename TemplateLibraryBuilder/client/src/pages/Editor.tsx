import { useState, useEffect } from "react";
import { EditorLayout } from "@/components/layout/EditorLayout";
import { Header } from "@/components/layout/Header";
import { ToolsPanel } from "@/components/editor/ToolsPanel";
import { CanvasEditor } from "@/components/editor/CanvasEditor";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { LayersPanel } from "@/components/editor/LayersPanel";
import { TemplateGallery } from "@/components/editor/TemplateGallery";
import { ExportModal } from "@/components/editor/ExportModal";

import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { useToast } from "@/hooks/use-toast";

export default function Editor() {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'layers'>('properties');
  const { toast } = useToast();
  const { canvas, isModified } = useEditorStore();

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSave = () => {
    if (!canvas) return;
    
    // Save current canvas state to localStorage
    const canvasData = canvas.toJSON();
    localStorage.setItem('zentraw_current_design', JSON.stringify(canvasData));
    
    toast({
      title: "Design saved",
      description: "Your design has been saved successfully.",
    });
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleOpenTemplates = () => {
    setShowTemplateGallery(true);
  };

  const leftSidebar = (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleOpenTemplates}
          className="w-full"
          variant="outline"
        >
          <i className="fas fa-th-large mr-2"></i>
          Browse Templates
        </Button>
      </div>
      <ToolsPanel />
    </div>
  );

  const rightSidebar = (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className={`flex-1 rounded-none border-b-2 text-gray-700 dark:text-gray-300 ${
            rightPanelTab === 'properties'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => setRightPanelTab('properties')}
        >
          <i className="fas fa-sliders-h mr-2"></i>
          Properties
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 rounded-none border-b-2 text-gray-700 dark:text-gray-300 ${
            rightPanelTab === 'layers'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => setRightPanelTab('layers')}
        >
          <i className="fas fa-layer-group mr-2"></i>
          Layers
        </Button>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {rightPanelTab === 'properties' ? <PropertiesPanel /> : <LayersPanel />}
      </div>
    </div>
  );

  return (
    <>
      <EditorLayout
        header={<Header onExport={handleExport} onSave={handleSave} />}
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
      >
        <CanvasEditor />
      </EditorLayout>

      <TemplateGallery
        open={showTemplateGallery}
        onOpenChange={setShowTemplateGallery}
      />

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
      />
    </>
  );
}
