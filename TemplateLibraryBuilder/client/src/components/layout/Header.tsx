import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useEditorStore } from "@/store/editorStore";
import { FileText, FolderOpen, RotateCcw, Undo, Redo, Plus, Trash2 } from "lucide-react";

interface HeaderProps {
  onExport: () => void;
  onSave: () => void;
}

export function Header({ onExport, onSave }: HeaderProps) {
  const { toast } = useToast();
  const { canvas, undo, redo, canUndo, canRedo } = useEditorStore();

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleNewTemplate = () => {
    if (canvas) {
      canvas.clear();
      toast({
        title: "New Template",
        description: "Canvas cleared for new design.",
      });
    }
  };

  const handleReset = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      toast({
        title: "Reset Canvas",
        description: "Canvas has been reset to default state.",
      });
    }
  };

  const handleOpenTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && canvas) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            canvas.loadFromJSON(data, () => {
              canvas.renderAll();
              toast({
                title: "Template Loaded",
                description: "Design loaded successfully.",
              });
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to load template file.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Z</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Zentraw</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
          <span>Untitled Design</span>
          <i className="fas fa-check-circle text-green-500 ml-1"></i>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        {/* File Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              File
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleNewTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenTemplate}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Open Template
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSave}>
              <i className="fas fa-save w-4 h-4 mr-2"></i>
              Save
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <i className="fas fa-download w-4 h-4 mr-2"></i>
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 text-gray-600 dark:text-gray-300 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleThemeToggle}
          className="p-2 text-gray-600 dark:text-gray-300"
        >
          <i className="fas fa-moon dark:hidden"></i>
          <i className="fas fa-sun hidden dark:inline"></i>
        </Button>
        
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">JD</span>
        </div>
      </div>
    </header>
  );
}
