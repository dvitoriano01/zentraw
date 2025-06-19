// ZentrawHistory.ts - Sistema de Undo/Redo para Zentraw
import { useRef } from 'react';

export function useHistory(canvasRef: React.MutableRefObject<any>) {
  const history = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const currentIndex = useRef<number>(-1);

  const saveState = () => {
    if (!canvasRef.current) return;
    
    try {
      const json = canvasRef.current.toJSON(['selectable', 'evented']);
      const jsonString = JSON.stringify(json);
      
      // Remove estados futuros se estivermos no meio do histórico
      if (currentIndex.current < history.current.length - 1) {
        history.current = history.current.slice(0, currentIndex.current + 1);
        redoStack.current = [];
      }
      
      history.current.push(jsonString);
      currentIndex.current = history.current.length - 1;
      
      // Limitar histórico a 50 estados
      if (history.current.length > 50) {
        history.current.shift();
        currentIndex.current--;
      }
      
      console.log(`Estado salvo. Histórico: ${history.current.length} estados`);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  };

  const undo = () => {
    if (currentIndex.current <= 0 || !canvasRef.current) return false;
    
    try {
      currentIndex.current--;
      const previousState = history.current[currentIndex.current];
      
      canvasRef.current.loadFromJSON(JSON.parse(previousState), () => {
        canvasRef.current?.renderAll();
        console.log('Undo executado');
      });
      
      return true;
    } catch (error) {
      console.error('Erro no undo:', error);
      return false;
    }
  };

  const redo = () => {
    if (currentIndex.current >= history.current.length - 1 || !canvasRef.current) return false;
    
    try {
      currentIndex.current++;
      const nextState = history.current[currentIndex.current];
      
      canvasRef.current.loadFromJSON(JSON.parse(nextState), () => {
        canvasRef.current?.renderAll();
        console.log('Redo executado');
      });
      
      return true;
    } catch (error) {
      console.error('Erro no redo:', error);
      return false;
    }
  };

  const canUndo = () => currentIndex.current > 0;
  const canRedo = () => currentIndex.current < history.current.length - 1;

  const clearHistory = () => {
    history.current = [];
    redoStack.current = [];
    currentIndex.current = -1;
  };

  return { 
    saveState, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    clearHistory,
    historyLength: history.current.length 
  };
}