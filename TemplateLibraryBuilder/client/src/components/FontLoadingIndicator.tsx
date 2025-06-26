// FontLoadingIndicator.tsx - Componente de loading para fontes
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Type } from 'lucide-react';

interface FontLoadingIndicatorProps {
  totalFonts: number;
  loadedFonts: number;
  currentFont: string;
  onComplete?: () => void;
}

export const FontLoadingIndicator: React.FC<FontLoadingIndicatorProps> = ({
  totalFonts,
  loadedFonts,
  currentFont,
  onComplete,
}) => {
  const progress = totalFonts > 0 ? (loadedFonts / totalFonts) * 100 : 0;
  const isComplete = loadedFonts === totalFonts && totalFonts > 0;

  React.useEffect(() => {
    if (isComplete && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-96 bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Type className="h-8 w-8 text-green-500 mr-2" />
              <h3 className="text-xl font-bold text-white">Fontes Carregadas!</h3>
            </div>
            <p className="text-gray-300 mb-4">{loadedFonts} fontes prontas para uso</p>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '100%' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 bg-gray-900 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
            <h3 className="text-xl font-bold text-white">Carregando Fontes</h3>
          </div>

          <p className="text-gray-300 mb-4">Preparando fontes Freepik para o editor...</p>

          {currentFont && <p className="text-sm text-blue-400 mb-4">Carregando: {currentFont}</p>}

          <Progress value={progress} className="mb-4" />

          <div className="flex justify-between text-sm text-gray-400">
            <span>
              {loadedFonts} de {totalFonts}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="mt-4 text-xs text-gray-500">Isso pode levar alguns segundos...</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FontLoadingIndicator;
