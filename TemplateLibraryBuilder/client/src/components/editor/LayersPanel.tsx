import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

export function LayersPanel() {
  const { 
    layers, 
    selectedObject,
    canvas,
    toggleLayerVisibility, 
    toggleLayerLock,
    setSelectedObject,
    reorderLayers,
    removeLayer
  } = useEditorStore();
  
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const handleLayerSelect = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && canvas) {
      setSelectedLayerId(layerId);
      canvas.setActiveObject(layer.object);
      setSelectedObject(layer.object);
      canvas.renderAll();
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    reorderLayers(sourceIndex, destinationIndex);
  };

  const handleLayerDelete = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && canvas) {
      canvas.remove(layer.object);
      removeLayer(layerId);
      if (selectedLayerId === layerId) {
        setSelectedLayerId(null);
        setSelectedObject(null);
      }
    }
  };

  const handleVisibilityToggle = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && canvas) {
      const newVisibility = !layer.visible;
      layer.object.visible = newVisibility;
      toggleLayerVisibility(layerId);
      canvas.renderAll();
    }
  };

  const handleLockToggle = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer && canvas) {
      const newLockState = !layer.locked;
      layer.object.selectable = !newLockState;
      layer.object.evented = !newLockState;
      toggleLayerLock(layerId);
      canvas.renderAll();
    }
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return 'fas fa-font';
      case 'image':
        return 'fas fa-image';
      case 'shape':
        return 'fas fa-shapes';
      case 'background':
        return 'fas fa-square';
      default:
        return 'fas fa-layer-group';
    }
  };

  const getLayerColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'text-blue-500';
      case 'image':
        return 'text-green-500';
      case 'shape':
        return 'text-purple-500';
      case 'background':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Layers</h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              if (canvas) {
                layers.forEach(layer => {
                  if (!layer.visible) handleVisibilityToggle(layer.id);
                });
              }
            }}
            title="Show All Layers"
          >
            <i className="fas fa-eye text-xs"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              if (canvas) {
                layers.forEach(layer => {
                  if (layer.locked) handleLockToggle(layer.id);
                });
              }
            }}
            title="Unlock All Layers"
          >
            <i className="fas fa-unlock text-xs"></i>
          </Button>
        </div>
      </div>

      {layers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <i className="fas fa-layer-group text-3xl mb-3"></i>
          <p className="text-sm">No layers yet</p>
          <p className="text-xs">Add objects to see them here</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="layers-list">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  "space-y-1 min-h-8 rounded-lg transition-colors",
                  snapshot.isDraggingOver ? "bg-blue-50 dark:bg-blue-900/20" : ""
                )}
              >
                {layers.map((layer, index) => (
                  <Draggable key={layer.id} draggableId={layer.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "group flex items-center p-3 rounded-lg border transition-all cursor-pointer",
                          selectedLayerId === layer.id
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm",
                          snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : "",
                          !layer.visible ? "opacity-50" : "",
                          layer.locked ? "border-orange-300" : ""
                        )}
                        onClick={() => handleLayerSelect(layer.id)}
                      >
                        <div className="flex items-center flex-1 space-x-3">
                          <div
                            {...provided.dragHandleProps}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <i className="fas fa-grip-vertical text-xs"></i>
                          </div>
                          
                          <button
                            className={cn(
                              "p-1 h-6 w-6 rounded border-0 bg-transparent transition-colors",
                              layer.visible 
                                ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20" 
                                : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVisibilityToggle(layer.id);
                            }}
                            title={layer.visible ? "Hide layer" : "Show layer"}
                          >
                            <i className={`fas ${layer.visible ? "fa-eye" : "fa-eye-slash"} text-xs`}></i>
                          </button>
                          
                          <button
                            className={cn(
                              "p-1 h-6 w-6 rounded border-0 bg-transparent transition-colors",
                              layer.locked 
                                ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20" 
                                : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLockToggle(layer.id);
                            }}
                            title={layer.locked ? "Unlock layer" : "Lock layer"}
                          >
                            <i className={`fas ${layer.locked ? "fa-lock" : "fa-unlock"} text-xs`}></i>
                          </button>
                          
                          <button
                            className="p-1 h-6 w-6 rounded border-0 bg-transparent text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (canvas) {
                                canvas.remove(layer.object);
                                canvas.renderAll();
                              }
                            }}
                            title="Delete layer"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                          
                          <div className={cn(
                            "w-8 h-8 rounded flex items-center justify-center", 
                            layer.type === 'background' 
                              ? 'bg-white border border-gray-200' 
                              : 'bg-gradient-to-br from-blue-400 to-purple-500'
                          )}>
                            <i className={cn(getLayerIcon(layer.type), getLayerColor(layer.type), "text-xs")}></i>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {layer.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {layer.type}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLayerDelete(layer.id);
                          }}
                          title="Delete layer"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              const selectedLayer = layers.find(l => l.id === selectedLayerId);
              if (selectedLayer && canvas) {
                const objects = canvas.getObjects();
                const currentIndex = objects.indexOf(selectedLayer.object);
                if (currentIndex < objects.length - 1) {
                  reorderLayers(currentIndex, currentIndex + 1);
                }
              }
            }}
            disabled={!selectedLayerId}
          >
            <i className="fas fa-arrow-up mr-1"></i>
            Move Up
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => {
              const selectedLayer = layers.find(l => l.id === selectedLayerId);
              if (selectedLayer && canvas) {
                const objects = canvas.getObjects();
                const currentIndex = objects.indexOf(selectedLayer.object);
                if (currentIndex > 0) {
                  reorderLayers(currentIndex, currentIndex - 1);
                }
              }
            }}
            disabled={!selectedLayerId}
          >
            <i className="fas fa-arrow-down mr-1"></i>
            Move Down
          </Button>
        </div>
      </div>
    </div>
  );
}
