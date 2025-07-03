/**
 * 🚀 ZENTRAW SaaS - Hook para Carregamento Otimizado de Fontes
 * Versão: V1.3.0.d.2
 * Data: 03/07/2025
 * 
 * OTIMIZAÇÕES:
 * - Carregamento paralelo (Promise.allSettled)
 * - Cache inteligente com TTL
 * - Timeout para fontes lentas
 * - Error handling robusto
 */

import { useState, useCallback, useEffect } from 'react';
import { FreepikFontCacheManager, VerifiedFont } from '@/utils/FreepikFontCacheManager';
import { freepikFonts, FreepikFont } from '@/constants/freepikFontsFixed';

export interface FontLoadingState {
  isLoading: boolean;
  loaded: number;
  total: number;
  current: string;
  progress: number;
  fromCache: boolean;
  errors: string[];
}

export interface UseFontLoaderResult {
  fontLoadingState: FontLoadingState;
  availableFonts: VerifiedFont[];
  loadFonts: () => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => any;
}

export function useFontLoader(): UseFontLoaderResult {
  const [fontLoadingState, setFontLoadingState] = useState<FontLoadingState>({
    isLoading: false,
    loaded: 0,
    total: freepikFonts.length,
    current: '',
    progress: 0,
    fromCache: false,
    errors: []
  });

  const [availableFonts, setAvailableFonts] = useState<VerifiedFont[]>([]);

  /**
   * Testa se uma fonte específica está realmente carregada
   * OTIMIZADO: Usa OffscreenCanvas quando disponível para melhor performance
   */
  const testFontAvailability = useCallback(async (font: FreepikFont, timeout = 2000): Promise<VerifiedFont | null> => {
    const startTime = Date.now();

    try {
      // Usar OffscreenCanvas se disponível (melhor performance)
      const canvas = typeof OffscreenCanvas !== 'undefined' 
        ? new OffscreenCanvas(100, 50)
        : document.createElement('canvas');
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context não disponível');

      const testText = 'ABCabc123';
      const fontSize = 20;

      // Promise com timeout
      const testPromise = new Promise<VerifiedFont>((resolve, reject) => {
        try {
          // Medir com fonte de referência
          ctx.font = `${fontSize}px Arial`;
          const arialWidth = ctx.measureText(testText).width;

          // Medir com a fonte testada
          ctx.font = `${fontSize}px "${font.value}", Arial`;
          const testWidth = ctx.measureText(testText).width;

          // Verificação dupla: width difference + document.fonts.check
          const widthDiff = Math.abs(testWidth - arialWidth) > 1;
          const documentCheck = document.fonts.check(`${fontSize}px "${font.value}"`);

          const isLoaded = widthDiff || documentCheck;

          if (isLoaded) {
            resolve({
              label: font.label,
              value: font.value,
              weight: font.weight,
              style: font.style,
              isVerified: true,
              verifiedAt: Date.now(),
              loadTime: Date.now() - startTime
            });
          } else {
            reject(new Error(`Fonte não carregada: ${font.label}`));
          }
        } catch (error) {
          reject(error);
        }
      });

      // Timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Timeout: ${font.label}`)), timeout);
      });

      return await Promise.race([testPromise, timeoutPromise]);

    } catch (error) {
      console.warn(`⚠️ Falha ao verificar fonte ${font.label}:`, error);
      return null;
    }
  }, []);

  /**
   * Carrega fontes com estratégia otimizada
   */
  const loadFonts = useCallback(async () => {
    console.log('🎨 [V1.3.0.d.2] Iniciando carregamento OTIMIZADO de fontes Freepik');
    
    setFontLoadingState(prev => ({
      ...prev,
      isLoading: true,
      current: 'Verificando cache...',
      errors: []
    }));

    try {
      // STEP 1: Tentar carregar do cache primeiro
      const cachedFonts = FreepikFontCacheManager.loadFromCache();
      
      if (cachedFonts && cachedFonts.length > 0) {
        console.log(`✅ Fontes carregadas do CACHE: ${cachedFonts.length} fontes`);
        
        setAvailableFonts(cachedFonts);
        setFontLoadingState({
          isLoading: false,
          loaded: cachedFonts.length,
          total: freepikFonts.length,
          current: 'Carregado do cache',
          progress: 100,
          fromCache: true,
          errors: []
        });
        
        return; // Usar cache e não recarregar
      }

      // STEP 2: Cache não disponível, carregar e verificar fontes
      console.log('📋 Cache não encontrado, verificando fontes...');
      
      setFontLoadingState(prev => ({
        ...prev,
        current: 'Aguardando CSS das fontes...'
      }));

      // Aguardar fontes CSS estarem prontas
      await document.fonts.ready;

      // STEP 3: Carregamento PARALELO (principal otimização!)
      console.log('🚀 Iniciando verificação PARALELA das fontes');
      
      setFontLoadingState(prev => ({
        ...prev,
        current: 'Verificando fontes em paralelo...'
      }));

      // Criar promises para todas as fontes simultaneamente
      const fontPromises = freepikFonts.map(async (font, index) => {
        try {
          const result = await testFontAvailability(font, 3000); // 3s timeout por fonte
          
          // Atualizar progresso de forma thread-safe
          setFontLoadingState(prev => ({
            ...prev,
            loaded: prev.loaded + 1,
            progress: Math.round(((prev.loaded + 1) / freepikFonts.length) * 100),
            current: `Verificando: ${font.label}`
          }));

          return result;
        } catch (error) {
          console.warn(`⚠️ Fonte falhou: ${font.label}`, error);
          return null;
        }
      });

      // Aguardar TODAS as promises terminarem (sucesso ou falha)
      const results = await Promise.allSettled(fontPromises);
      
      // Filtrar apenas fontes que carregaram com sucesso
      const verifiedFonts = results
        .filter((result): result is PromiseFulfilledResult<VerifiedFont> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      // Coletar erros para debugging
      const errors = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason.message);

      console.log(`✅ Verificação concluída: ${verifiedFonts.length}/${freepikFonts.length} fontes carregadas`);

      // STEP 4: Salvar no cache para próximas sessões
      if (verifiedFonts.length > 0) {
        FreepikFontCacheManager.saveToCache(verifiedFonts);
      }

      // STEP 5: Atualizar estado final
      setAvailableFonts(verifiedFonts);
      setFontLoadingState({
        isLoading: false,
        loaded: verifiedFonts.length,
        total: freepikFonts.length,
        current: `${verifiedFonts.length} fontes carregadas`,
        progress: 100,
        fromCache: false,
        errors: errors.slice(0, 5) // Máximo 5 erros para não poluir UI
      });

    } catch (error) {
      console.error('❌ Erro fatal no carregamento de fontes:', error);
      
      setFontLoadingState({
        isLoading: false,
        loaded: 0,
        total: freepikFonts.length,
        current: 'Erro no carregamento',
        progress: 0,
        fromCache: false,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      });
    }
  }, [testFontAvailability]);

  /**
   * Limpa cache e força reload
   */
  const clearCache = useCallback(() => {
    FreepikFontCacheManager.clearCache();
    setAvailableFonts([]);
    setFontLoadingState(prev => ({
      ...prev,
      fromCache: false,
      current: 'Cache limpo'
    }));
  }, []);

  /**
   * Obtém estatísticas do cache
   */
  const getCacheStats = useCallback(() => {
    return FreepikFontCacheManager.getCacheStats();
  }, []);

  return {
    fontLoadingState,
    availableFonts,
    loadFonts,
    clearCache,
    getCacheStats
  };
}
