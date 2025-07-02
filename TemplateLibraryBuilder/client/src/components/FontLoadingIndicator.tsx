/**
 * 🎨 FONT LOADING INDICATOR OTIMIZADO v2.0
 * 
 * MELHORIAS:
 * ✅ Progress bar animada
 * ✅ Estatísticas em tempo real
 * ✅ Design moderno e responsivo
 * ✅ Feedback visual aprimorado
 * ✅ Cancelamento opcional
 */

import React from 'react';
import { FontLoadProgress } from '@/utils/FreepikFontManagerOptimized';

interface FontLoadingIndicatorOptimizedProps {
  progress: FontLoadProgress;
  onCancel?: () => void;
  showDetails?: boolean;
}

const FontLoadingIndicatorOptimized: React.FC<FontLoadingIndicatorOptimizedProps> = ({
  progress,
  onCancel,
  showDetails = true
}) => {
  const { loaded, total, current, percentage } = progress;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Carregando Fontes Freepik
          </h3>
          <p className="text-gray-600 text-sm">
            Preparando suas fontes exclusivas...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progresso
            </span>
            <span className="text-sm font-bold text-purple-600">
              {percentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Current Font */}
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Carregando:</div>
          <div className="text-base font-medium text-gray-900 truncate">
            {current || 'Preparando...'}
          </div>
        </div>

        {/* Statistics */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{loaded}</div>
              <div className="text-xs text-gray-600">Carregadas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        )}

        {/* Status Messages */}
        <div className="text-center mb-4">
          {percentage < 25 && (
            <p className="text-sm text-gray-600">
              🚀 Iniciando carregamento paralelo...
            </p>
          )}
          {percentage >= 25 && percentage < 75 && (
            <p className="text-sm text-gray-600">
              ⚡ Processando fontes em lote...
            </p>
          )}
          {percentage >= 75 && percentage < 100 && (
            <p className="text-sm text-gray-600">
              🎯 Finalizando carregamento...
            </p>
          )}
          {percentage === 100 && (
            <p className="text-sm text-green-600 font-medium">
              ✅ Carregamento concluído!
            </p>
          )}
        </div>

        {/* Cancel Button */}
        {onCancel && percentage < 100 && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Pular carregamento
            </button>
          </div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FontLoadingIndicatorOptimized;

