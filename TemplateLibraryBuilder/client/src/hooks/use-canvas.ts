import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    canvas,
    initCanvas,
    disposeCanvas,
    selectedObject,
    zoom,
    canUndo,
    canRedo,
    undo,
    redo,
    zoomIn,
    zoomOut,
    fitToScreen,
    saveState,
    deleteSelectedObject,
  } = useEditorStore();

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      initCanvas(canvasRef.current);
    }

    return () => {
      if (canvas) {
        disposeCanvas();
      }
    };
  }, [canvas, initCanvas, disposeCanvas]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;

      // Prevent default browser shortcuts
      if ((e.ctrlKey || e.metaKey) && ['z', 'y', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      // Undo (Ctrl+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        undo();
      }

      // Redo (Ctrl+Y or Ctrl+Shift+Z)
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        redo();
      }

      // Delete selected object
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject) {
        deleteSelectedObject();
      }

      // Save state (Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        saveState();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, selectedObject, undo, redo, deleteSelectedObject, saveState]);

  return {
    canvasRef,
    canvas,
    selectedObject,
    zoom,
    canUndo: canUndo(),
    canRedo: canRedo(),
    undo,
    redo,
    zoomIn,
    zoomOut,
    fitToScreen,
  };
}
