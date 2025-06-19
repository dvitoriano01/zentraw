// workspace.tsx — Arquivo principal com estrutura Photoshop-like
import React, { useRef, useState } from 'react';
import { Topbar } from './editor/Topbar';
import { SidebarLeft } from './editor/SidebarLeft';
import { SidebarRight } from './editor/SidebarRight';
import { CanvasEditor } from './editor/CanvasEditor';
import '../styles/fonts.css';

const visualFX = [
  { id: 'grain', label: 'Grain', src: '/overlays/grain.svg' },
  { id: 'vhs', label: 'VHS', src: '/overlays/vhs.svg' },
  { id: 'scanlines', label: 'Scanlines', src: '/overlays/scanlines.svg' },
];

export default function Workspace() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [elements, setElements] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [gridSize, setGridSize] = useState(30);
  const [showGrid, setShowGrid] = useState(true);

  function addText() {
    const newElement = {
      id: crypto.randomUUID(),
      type: 'text',
      x: 200,
      y: 200,
      text: 'Novo Texto',
      font: 'AkuiNa Bold',
      size: 48,
      color: '#ffffff',
      opacity: 1,
      blendMode: 'normal',
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  }

  function addOverlay(src: string) {
    const overlay = {
      id: crypto.randomUUID(),
      type: 'overlay',
      x: 0,
      y: 0,
      src,
      opacity: 0.6,
      blendMode: 'screen',
    };
    setElements((prev) => [...prev, overlay]);
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImg = {
        id: crypto.randomUUID(),
        type: 'image',
        x: 100,
        y: 100,
        src: reader.result as string,
        opacity: 1,
        blendMode: 'normal',
      };
      setElements((prev) => [...prev, newImg]);
    };
    reader.readAsDataURL(file);
  }

  function applyTextEffect(effect: string) {
    if (!selectedId) return;
    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId ? { ...el, effect } : el
      )
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#121212]">
      <Topbar canvasRef={canvasRef} />
      <div className="flex flex-1">
        <SidebarLeft
          addText={addText}
          uploadImage={uploadImage}
          fileInputRef={fileInputRef}
          applyTextEffect={applyTextEffect}
          visualFX={visualFX}
          addOverlay={addOverlay}
        />
        <CanvasEditor
          canvasRef={canvasRef}
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          draggingId={draggingId}
          setDraggingId={setDraggingId}
          zoom={zoom}
          gridSize={gridSize}
          showGrid={showGrid}
        />
        <SidebarRight
          selectedId={selectedId}
          elements={elements}
          setElements={setElements}
        />
      </div>
    </div>
  );
}