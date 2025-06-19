import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useCanvas } from "@/hooks/use-canvas";
import { useEditorStore } from "@/store/editorStore";

export function CanvasEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    canvasRef, 
    canvas, 
    zoom, 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    zoomIn, 
    zoomOut, 
    fitToScreen 
  } = useCanvas();
  
  const { dimensions } = useEditorStore();

  // Auto-fit canvas when container resizes
  useEffect(() => {
    const handleResize = () => {
      if (canvas && containerRef.current) {
        fitToScreen();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvas, fitToScreen]);

  // Add zoom and pan functionality
  useEffect(() => {
    if (!canvas || !containerRef.current) return;

    const container = containerRef.current;
    let isPanning = false;
    let lastX = 0;
    let lastY = 0;
    let spacePressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spacePressed = true;
        container.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spacePressed = false;
        container.style.cursor = 'default';
        isPanning = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (spacePressed) {
        e.preventDefault();
        isPanning = true;
        lastX = e.clientX;
        lastY = e.clientY;
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning && spacePressed) {
        e.preventDefault();
        const deltaX = e.clientX - lastX;
        const deltaY = e.clientY - lastY;
        
        container.scrollLeft -= deltaX;
        container.scrollTop -= deltaY;
        
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = spacePressed ? 'grab' : 'default';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (spacePressed) {
        // Pan with space + scroll
        e.preventDefault();
        const vpt = canvas.viewportTransform!;
        vpt[4] -= e.deltaX * 0.5;
        vpt[5] -= e.deltaY * 0.5;
        canvas.setViewportTransform(vpt);
        canvas.renderAll();
      } else {
        // Zoom with scroll
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const pointer = canvas.getPointer(e);
        
        const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, zoom * zoomDelta));
        
        canvas.zoomToPoint(pointer, newZoom);
        canvas.renderAll();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [canvas, zoom]);

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* History Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo"
            >
              <i className="fas fa-undo"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo"
            >
              <i className="fas fa-redo"></i>
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600"></div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={zoomOut} title="Zoom Out">
              <i className="fas fa-search-minus"></i>
            </Button>
            <span className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded min-w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={zoomIn} title="Zoom In">
              <i className="fas fa-search-plus"></i>
            </Button>
            <Button variant="ghost" size="sm" onClick={fitToScreen} title="Fit to Screen">
              <i className="fas fa-expand-arrows-alt"></i>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>Canvas: {dimensions.width} × {dimensions.height}</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 p-8 flex items-center justify-center overflow-auto" style={{ backgroundColor: '#282828' }}>
        <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
          {/* Canvas Container */}
          <div 
            className="bg-white shadow-2xl rounded-lg overflow-hidden relative mx-auto"
            style={{ 
              width: dimensions.width, 
              height: dimensions.height,
            }}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{ 
                width: '100%', 
                height: '100%' 
              }}
            />
            
            {/* Canvas placeholder when empty */}
            {canvas && canvas.getObjects().length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700 pointer-events-none">
                <div className="text-center">
                  <i className="fas fa-plus-circle text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Start Creating</h3>
                  <p className="text-gray-500 dark:text-gray-400">Use the tools panel to add elements or choose a template</p>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Rulers */}
          <div className="absolute -top-6 left-0 right-0 h-6 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 text-xs flex items-center px-2 text-gray-500">
            <span>0</span>
          </div>
          <div className="absolute -left-6 top-0 bottom-0 w-6 bg-gray-200 dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-xs flex flex-col justify-start pt-2 text-gray-500">
            <span className="transform -rotate-90 origin-center">0</span>
          </div>
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700 pointer-events-auto">
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <i className="fas fa-minus"></i>
          </Button>
          <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded">
            <input
              type="range"
              min="10"
              max="500"
              value={zoom * 100}
              onChange={(e) => {
                const newZoom = parseInt(e.target.value) / 100;
                canvas?.setZoom(newZoom);
              }}
              className="w-full h-2 appearance-none rounded cursor-pointer bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <i className="fas fa-plus"></i>
          </Button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-2"></div>
          <Button variant="ghost" size="sm" onClick={fitToScreen}>
            <span className="text-xs">Fit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
