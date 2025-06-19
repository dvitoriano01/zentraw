import React from 'react';
import { ArrowLeft, Download, Upload, Save } from 'lucide-react';
import { Link } from 'wouter';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

interface TopbarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function Topbar({ canvasRef }: TopbarProps) {
  async function exportPNG() {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'zentraw-artwork.png');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao exportar PNG:', error);
    }
  }

  return (
    <div className="h-12 bg-[#2a2a2a] border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <button className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">
            <ArrowLeft size={16} />
            Voltar
          </button>
        </Link>
        <h1 className="text-white font-semibold">Zentraw Editor v1.3</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={exportPNG}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
        >
          <Download size={16} />
          Exportar PNG
        </button>
      </div>
    </div>
  );
}