import React, { useEffect } from 'react';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'overlay';
  x: number;
  y: number;
  text?: string;
  font?: string;
  size?: number;
  color?: string;
  src?: string;
  opacity?: number;
  blendMode?: string;
  effect?: string;
}

interface CanvasEditorProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  elements: CanvasElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  draggingId: string | null;
  setDraggingId: React.Dispatch<React.SetStateAction<string | null>>;
  zoom: number;
  gridSize: number;
  showGrid: boolean;
}

const textFX = {
  glitch: {
    textShadow: '2px 0 red, -2px 0 cyan',
    filter: 'contrast(1.2)',
  },
  neon: {
    textShadow: '0 0 5px #fff, 0 0 15px #0ff',
    color: '#0ff',
  },
  chrome: {
    filter: 'grayscale(0.2) brightness(1.3)',
    color: '#ccc',
  },
};

export function CanvasEditor({
  canvasRef,
  elements,
  setElements,
  selectedId,
  setSelectedId,
  draggingId,
  setDraggingId,
  zoom,
  gridSize,
  showGrid
}: CanvasEditorProps) {
  const canvasWidth = 1080;
  const canvasHeight = 1080;

  function handleElementClick(e: React.MouseEvent, elementId: string) {
    e.stopPropagation();
    setSelectedId(elementId);
  }

  function handleElementMouseDown(e: React.MouseEvent, elementId: string) {
    e.stopPropagation();
    setSelectedId(elementId);
    setDraggingId(elementId);
  }

  function handleDrag(e: MouseEvent, el: CanvasElement) {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return;
    
    const x = (e.clientX - bounds.left) / zoom;
    const y = (e.clientY - bounds.top) / zoom;
    const snappedX = showGrid ? Math.round(x / gridSize) * gridSize : x;
    const snappedY = showGrid ? Math.round(y / gridSize) * gridSize : y;
    
    setElements((prev) =>
      prev.map((item) => (item.id === el.id ? { ...item, x: snappedX, y: snappedY } : item))
    );
  }

  // Global mouse event listeners for drag and drop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId) return;
      const el = elements.find(el => el.id === draggingId);
      if (!el) return;
      handleDrag(e, el);
    };
    
    const stopDrag = () => setDraggingId(null);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDrag);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, [draggingId, elements, zoom, showGrid, gridSize]);

  return (
    <div className="flex-1 flex justify-center items-center overflow-hidden bg-[#1a1a1a]">
      <div
        className="relative cursor-default"
        ref={canvasRef}
        onClick={() => setSelectedId(null)}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%), 
            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #ccc 75%), 
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `0 0, 0 ${gridSize/2}px, ${gridSize/2}px -${gridSize/2}px, -${gridSize/2}px 0px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'center',
        }}
      >
        {elements.map((el) => {
          const isSelected = el.id === selectedId;
          const fx = textFX[el.effect as keyof typeof textFX];

          return (
            <div
              key={el.id}
              onClick={(e) => handleElementClick(e, el.id)}
              onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              className={`absolute select-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: el.x,
                top: el.y,
                fontSize: el.size,
                fontFamily: el.font,
                color: fx?.color || el.color,
                textShadow: fx?.textShadow,
                filter: fx?.filter,
                opacity: el.opacity ?? 1,
                mixBlendMode: el.blendMode as any ?? 'normal',
                cursor: isSelected ? (draggingId === el.id ? 'grabbing' : 'move') : 'pointer',
                zIndex: isSelected ? 10 : 1,
              }}
            >
              {el.type === 'text' && el.text}
              {el.type === 'image' && (
                <img
                  src={el.src}
                  alt="Canvas element"
                  className="max-w-none"
                  draggable={false}
                />
              )}
              {el.type === 'overlay' && (
                <img
                  src={el.src}
                  alt="Overlay"
                  className="pointer-events-none"
                  style={{
                    width: canvasWidth,
                    height: canvasHeight,
                    opacity: el.opacity,
                    mixBlendMode: el.blendMode as any,
                  }}
                  draggable={false}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}