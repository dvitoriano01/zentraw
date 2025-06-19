import { useEffect, useRef, useState } from 'react';

interface ZoomPanState {
  zoom: number;
  panX: number;
  panY: number;
}

interface UseCanvasZoomPanProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

export function useCanvasZoomPan({
  canvasRef,
  containerRef,
  minZoom = 0.1,
  maxZoom = 5,
  zoomStep = 0.1
}: UseCanvasZoomPanProps) {
  const [state, setState] = useState<ZoomPanState>({
    zoom: 1,
    panX: 0,
    panY: 0
  });

  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });
  const isSpacePressed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isSpacePressed.current = true;
        container.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        isSpacePressed.current = false;
        container.style.cursor = '';
        isPanning.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isSpacePressed.current) {
        // Pan with space + scroll
        setState(prev => ({
          ...prev,
          panX: prev.panX - e.deltaX * 0.5,
          panY: prev.panY - e.deltaY * 0.5
        }));
      } else {
        // Zoom with scroll
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        const newZoom = Math.max(minZoom, Math.min(maxZoom, state.zoom + zoomDirection * zoomStep));
        
        if (newZoom !== state.zoom) {
          // Zoom towards canvas center for better user experience
          const containerRect = container.getBoundingClientRect();
          const centerX = containerRect.width / 2;
          const centerY = containerRect.height / 2;
          
          const zoomRatio = newZoom / state.zoom;
          setState(prev => ({
            zoom: newZoom,
            panX: centerX - (centerX - prev.panX) * zoomRatio,
            panY: centerY - (centerY - prev.panY) * zoomRatio
          }));
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isSpacePressed.current) {
        isPanning.current = true;
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning.current && isSpacePressed.current) {
        const deltaX = e.clientX - lastPanPoint.current.x;
        const deltaY = e.clientY - lastPanPoint.current.y;
        
        setState(prev => ({
          ...prev,
          panX: prev.panX + deltaX,
          panY: prev.panY + deltaY
        }));
        
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      if (isPanning.current) {
        isPanning.current = false;
        container.style.cursor = isSpacePressed.current ? 'grab' : '';
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvasRef, containerRef, state.zoom, minZoom, maxZoom, zoomStep]);

  const zoomIn = () => {
    setState(prev => ({
      ...prev,
      zoom: Math.min(maxZoom, prev.zoom + zoomStep)
    }));
  };

  const zoomOut = () => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, prev.zoom - zoomStep)
    }));
  };

  const resetZoom = () => {
    setState({
      zoom: 1,
      panX: 0,
      panY: 0
    });
  };

  const fitToScreen = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;

    const containerRect = container.getBoundingClientRect();
    const scaleX = (containerRect.width - 100) / canvas.width; // 50px margin on each side
    const scaleY = (containerRect.height - 100) / canvas.height; // 50px margin on top/bottom
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%
    
    setState({
      zoom: Math.max(minZoom, Math.min(maxZoom, scale)),
      panX: 0, // Center horizontally
      panY: 0  // Center vertically
    });
  };

  return {
    zoom: state.zoom,
    panX: state.panX,
    panY: state.panY,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen
  };
}