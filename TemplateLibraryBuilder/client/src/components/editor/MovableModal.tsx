import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Move, Maximize2, Minimize2, X, Pin, PinOff } from 'lucide-react';

interface MovableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  canDock?: boolean;
  onDock?: (docked: boolean) => void;
}

export function MovableModal({
  open,
  onOpenChange,
  title,
  children,
  defaultWidth = 400,
  defaultHeight = 500,
  canDock = true,
  onDock
}: MovableModalProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isDocked) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Check for docking zones
        const rightEdge = window.innerWidth - 320; // 320px is sidebar width
        
        if (canDock && newX > rightEdge - 50) {
          // Snap to sidebar
          setIsDocked(true);
          onDock?.(true);
        } else {
          setPosition({ x: Math.max(0, newX), y: Math.max(0, newY) });
        }
      }
      
      if (isResizing) {
        const newWidth = Math.max(300, e.clientX - position.x);
        const newHeight = Math.max(200, e.clientY - position.y);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position, canDock, onDock, isDocked]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDocked) return;
    
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      setPosition({ x: 100, y: 100 });
      setSize({ width: defaultWidth, height: defaultHeight });
    }
  };

  const toggleDock = () => {
    const newDocked = !isDocked;
    setIsDocked(newDocked);
    onDock?.(newDocked);
    
    if (newDocked) {
      // Position in sidebar
      setPosition({ x: window.innerWidth - 320, y: 0 });
      setSize({ width: 320, height: window.innerHeight });
    } else {
      // Return to floating
      setPosition({ x: 100, y: 100 });
      setSize({ width: defaultWidth, height: defaultHeight });
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      {!isDocked && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          fixed bg-[#2c2c2c] border border-[#4a4a4a] rounded-lg shadow-xl overflow-hidden
          ${isDocked ? 'z-30' : 'z-50'}
          ${isDocked ? 'border-l-0 rounded-l-none' : ''}
        `}
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
          minWidth: 300,
          minHeight: 200
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between p-3 bg-[#383838] border-b border-[#4a4a4a] cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-white">{title}</h3>
          </div>
          
          <div className="flex items-center space-x-1">
            {canDock && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDock}
                className="p-1 h-6 w-6 hover:bg-[#4a4a4a]"
              >
                {isDocked ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMaximize}
              className="p-1 h-6 w-6 hover:bg-[#4a4a4a]"
            >
              {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="p-1 h-6 w-6 hover:bg-[#4a4a4a] hover:text-red-400"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto" style={{ height: size.height - 48 }}>
          {children}
        </div>
        
        {/* Resize Handle */}
        {!isDocked && !isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-[#4a4a4a] hover:bg-[#555555]"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1">
              <div className="w-1 h-1 bg-gray-500 rounded-full" />
              <div className="w-1 h-1 bg-gray-500 rounded-full mt-0.5 ml-0.5" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}