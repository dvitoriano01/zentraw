/**
 * 🎯 HOOK OTIMIZADO PARA CARREGAMENTO DE FONTES v2.0
 * 
 * FUNCIONALIDADES:
 * ✅ Carregamento paralelo automático
 * ✅ Cache persistente
 * ✅ Progress tracking
 * ✅ Error handling
 * ✅ Retry automático
 * ✅ Fallback inteligente
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { FreepikFontManagerOptimized, FontLoadResult, FontLoadProgress } from '@/utils/FreepikFontManagerOptimized';
import { FreepikFont } from '@/constants/freepikFontsFixed';

export interface UseFontLoaderOptions {
  autoLoad?: boolean;
  timeout?: number;
  retryAttempts?: number;
  enableCache?: boolean;
  onComplete?: (result: FontLoadResult) => void;
  onError?: (error: Error) => void;
}

export interface FontLoaderState {
  isLoading: boolean;
  progress: FontLoadProgress;
  availableFonts: FreepikFont[];
  loadResult: FontLoadResult | null;
  error: Error | null;
}

export const useFontLoaderOptimized = (
  fonts: FreepikFont[],
  options: UseFontLoaderOptions = {}
) => {
  const {
    autoLoad = true,
    timeout = 3000,
    retryAttempts = 2,
    enableCache = true,
    onComplete,
    onError
  } = options;

  const [state, setState] = useState<FontLoaderState>({
    isLoading: false,
    progress: { loaded: 0, total: 0, current: '', percentage: 0 },
    availableFonts: [],
    loadResult: null,
    error: null
  });

  const fontManager = useRef(FreepikFontManagerOptimized.getInstance());
  const retryCount = useRef(0);
  const abortController = useRef<AbortController | null>(null);

  // Função para carregar fontes
  const loadFonts = useCallback(async (fontsToLoad: FreepikFont[] = fonts) => {
    if (state.isLoading) {
      console.warn('⚠️ Carregamento já em andamento');
      return;
    }

    // Verificar cache se habilitado
    if (enableCache) {
      const cachedFonts = fontsToLoad.filter(font => 
        fontManager.current.isFontAvailable(font.value)
      );
      
      if (cachedFonts.length === fontsToLoad.length) {
        console.log('📦 Todas as fontes já estão em cache');
        setState(prev => ({
          ...prev,
          availableFonts: fontsToLoad,
          progress: { loaded: fontsToLoad.length, total: fontsToLoad.length, current: 'Cache', percentage: 100 }
        }));
        return;
      }
    }

    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        progress: { loaded: 0, total: fontsToLoad.length, current: 'Iniciando...', percentage: 0 }
      }));

      console.log(`🚀 Iniciando carregamento de ${fontsToLoad.length} fontes...`);

      // Criar AbortController para cancelamento
      abortController.current = new AbortController();

      const result = await fontManager.current.loadAllFreepikFonts(
        fontsToLoad,
        (progress) => {
          setState(prev => ({
            ...prev,
            progress
          }));
        },
        timeout
      );

      // Verificar se foi cancelado
      if (abortController.current?.signal.aborted) {
        console.log('🚫 Carregamento cancelado');
        return;
      }

      // Filtrar fontes que foram carregadas com sucesso
      const successfulFonts = result.results
        .filter(r => r.success)
        .map(r => r.font);

      // Adicionar fontes de fallback se necessário
      const fallbackFonts: FreepikFont[] = [
        { label: 'Arial', value: 'Arial', weight: 400, family: 'Arial' },
        { label: 'Helvetica', value: 'Helvetica', weight: 400, family: 'Helvetica' },
        { label: 'Times New Roman', value: 'Times New Roman', weight: 400, family: 'Times New Roman' },
        { label: 'Georgia', value: 'Georgia', weight: 400, family: 'Georgia' },
        { label: 'Verdana', value: 'Verdana', weight: 400, family: 'Verdana' },
      ];

      const allAvailableFonts = [...successfulFonts, ...fallbackFonts];

      setState(prev => ({
        ...prev,
        isLoading: false,
        availableFonts: allAvailableFonts,
        loadResult: result,
        progress: { 
          loaded: result.loadedFonts, 
          total: result.totalFonts, 
          current: 'Concluído!', 
          percentage: 100 
        }
      }));

      console.log(`✅ Carregamento concluído: ${result.loadedFonts}/${result.totalFonts} fontes`);
      console.log(`⏱️ Tempo total: ${Math.round(result.loadTime)}ms`);

      onComplete?.(result);

      // Reset retry count on success
      retryCount.current = 0;

    } catch (error) {
      console.error('❌ Erro no carregamento de fontes:', error);

      const errorObj = error instanceof Error ? error : new Error('Erro desconhecido');

      // Tentar novamente se ainda há tentativas
      if (retryCount.current < retryAttempts) {
        retryCount.current++;
        console.log(`🔄 Tentativa ${retryCount.current}/${retryAttempts}...`);
        
        // Aguardar um pouco antes de tentar novamente
        setTimeout(() => {
          loadFonts(fontsToLoad);
        }, 1000 * retryCount.current);
        
        return;
      }

      // Usar apenas fontes de fallback em caso de erro
      const fallbackFonts: FreepikFont[] = [
        { label: 'Arial', value: 'Arial', weight: 400, family: 'Arial' },
        { label: 'Helvetica', value: 'Helvetica', weight: 400, family: 'Helvetica' },
        { label: 'Times New Roman', value: 'Times New Roman', weight: 400, family: 'Times New Roman' },
        { label: 'Georgia', value: 'Georgia', weight: 400, family: 'Georgia' },
        { label: 'Verdana', value: 'Verdana', weight: 400, family: 'Verdana' },
      ];

      setState(prev => ({
        ...prev,
        isLoading: false,
        availableFonts: fallbackFonts,
        error: errorObj,
        progress: { loaded: 0, total: fontsToLoad.length, current: 'Erro', percentage: 0 }
      }));

      onError?.(errorObj);
    }
  }, [fonts, timeout, retryAttempts, enableCache, onComplete, onError, state.isLoading]);

  // Função para cancelar carregamento
  const cancelLoading = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setState(prev => ({
        ...prev,
        isLoading: false,
        progress: { ...prev.progress, current: 'Cancelado' }
      }));
      console.log('🚫 Carregamento cancelado pelo usuário');
    }
  }, []);

  // Função para recarregar fontes
  const reloadFonts = useCallback(() => {
    retryCount.current = 0;
    fontManager.current.clearCache();
    loadFonts();
  }, [loadFonts]);

  // Verificar se uma fonte específica está disponível
  const isFontAvailable = useCallback((fontName: string) => {
    return fontManager.current.isFontAvailable(fontName);
  }, []);

  // Obter fallback para uma fonte
  const getFontFallback = useCallback((fontName: string) => {
    return fontManager.current.getFontFallback(fontName);
  }, []);

  // Auto-load se habilitado
  useEffect(() => {
    if (autoLoad && fonts.length > 0 && !state.isLoading && state.availableFonts.length === 0) {
      loadFonts();
    }
  }, [autoLoad, fonts, loadFonts, state.isLoading, state.availableFonts.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    loadFonts,
    cancelLoading,
    reloadFonts,
    isFontAvailable,
    getFontFallback,
    // Computed properties
    isComplete: !state.isLoading && state.progress.percentage === 100,
    hasError: !!state.error,
    successRate: state.loadResult ? (state.loadResult.loadedFonts / state.loadResult.totalFonts) * 100 : 0
  };
};

