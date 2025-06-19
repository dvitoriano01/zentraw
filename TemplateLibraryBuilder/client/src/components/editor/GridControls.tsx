import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/store/editorStore';
import { Grid, Eye, EyeOff, Magnet, ChevronDown, Settings } from 'lucide-react';

export function GridControls() {
  const {
    gridEnabled,
    gridVisible,
    gridSize,
    snapToGrid,
    setGridEnabled,
    setGridVisible,
    setGridSize,
    setSnapToGrid,
  } = useEditorStore();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Grid className="w-4 h-4 mr-2" />
              <span className="text-sm">Grid Options</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4">
          <div className="space-y-4">
            {/* Enable Grid */}
            <div className="flex items-center justify-between">
              <Label htmlFor="grid-enabled" className="text-sm">
                Enable Grid
              </Label>
              <Switch
                id="grid-enabled"
                checked={gridEnabled}
                onCheckedChange={setGridEnabled}
              />
            </div>

            {/* Show/Hide Grid */}
            {gridEnabled && (
              <div className="flex items-center justify-between">
                <Label htmlFor="grid-visible" className="text-sm flex items-center gap-2">
                  {gridVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  Show Grid
                </Label>
                <Switch
                  id="grid-visible"
                  checked={gridVisible}
                  onCheckedChange={setGridVisible}
                />
              </div>
            )}

            {/* Grid Size */}
            {gridEnabled && (
              <div className="space-y-2">
                <Label className="text-sm">
                  Grid Size: {gridSize}px
                </Label>
                <Slider
                  value={[gridSize]}
                  onValueChange={(value) => setGridSize(value[0])}
                  min={10}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}

            {/* Snap to Grid */}
            {gridEnabled && (
              <div className="flex items-center justify-between">
                <Label htmlFor="snap-to-grid" className="text-sm flex items-center gap-2">
                  <Magnet size={14} />
                  Snap to Grid
                </Label>
                <Switch
                  id="snap-to-grid"
                  checked={snapToGrid}
                  onCheckedChange={setSnapToGrid}
                />
              </div>
            )}

            {/* Info */}
            {gridEnabled && snapToGrid && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                Objects will automatically align to grid when moved
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}