/**
 * 🚀 ZENTRAW SaaS - Sistema de Cache Inteligente para Fontes Freepik
 * Versão: V1.3.0.d.2
 * Data: 03/07/2025
 * 
 * OBJETIVO: Eliminar re-carregamentos desnecessários e acelerar inicialização
 */

export interface VerifiedFont {
  label: string;
  value: string;
  weight?: number;
  style?: string;
  isVerified: boolean;
  verifiedAt: number;
  loadTime?: number;
}

export interface FontCacheData {
  fonts: VerifiedFont[];
  cacheVersion: string;
  createdAt: number;
  expiresAt: number;
  userAgent: string; // Para detectar mudanças de browser
}

export class FreepikFontCacheManager {
  private static readonly CACHE_KEY = 'zentraw-freepik-fonts-cache-v1.3.0.d.2';
  private static readonly CACHE_VERSION = '1.3.0.d.2';
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas
  private static readonly MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB max
  
  /**
   * Salva fontes verificadas no cache localStorage
   */
  static saveToCache(fonts: VerifiedFont[]): boolean {
    try {
      const cacheData: FontCacheData = {
        fonts,
        cacheVersion: this.CACHE_VERSION,
        createdAt: Date.now(),
        expiresAt: Date.now() + this.CACHE_TTL,
        userAgent: navigator.userAgent
      };

      const serialized = JSON.stringify(cacheData);
      
      // Verificar tamanho do cache
      if (serialized.length > this.MAX_CACHE_SIZE) {
        console.warn('🚨 Cache muito grande, reduzindo dados...');
        // Manter apenas fontes essenciais se cache ficar muito grande (v1.3.0.d.3 otimizadas)
        const essentialFonts = fonts.filter(font => 
          ['Akuina', 'Different Beginning', 'Freedom Standing', 'Arial', 'Helvetica'].includes(font.value)
        );
        cacheData.fonts = essentialFonts;
      }

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      
      console.log(`✅ Cache salvo: ${fonts.length} fontes, expires in ${Math.round(this.CACHE_TTL / (1000 * 60 * 60))}h`);
      return true;
      
    } catch (error) {
      console.error('❌ Erro ao salvar cache de fontes:', error);
      // Limpar cache corrompido
      this.clearCache();
      return false;
    }
  }

  /**
   * Carrega fontes do cache se ainda válido
   */
  static loadFromCache(): VerifiedFont[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        console.log('📋 Nenhum cache encontrado');
        return null;
      }

      const cacheData: FontCacheData = JSON.parse(cached);
      
      // Verificar se cache ainda é válido
      if (!this.isCacheValid(cacheData)) {
        console.log('⏰ Cache expirado, removendo...');
        this.clearCache();
        return null;
      }

      console.log(`✅ Cache válido carregado: ${cacheData.fonts.length} fontes`);
      return cacheData.fonts;
      
    } catch (error) {
      console.error('❌ Erro ao carregar cache:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Verifica se o cache ainda é válido
   */
  static isCacheValid(cacheData?: FontCacheData): boolean {
    let data = cacheData;
    
    if (!data) {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return false;
      
      try {
        data = JSON.parse(cached);
      } catch {
        return false;
      }
    }

    if (!data) return false;

    const now = Date.now();
    
    // Verificar expiração
    if (now > data.expiresAt) {
      console.log('⏰ Cache expirado por tempo');
      return false;
    }

    // Verificar versão
    if (data.cacheVersion !== this.CACHE_VERSION) {
      console.log('🔄 Cache inválido por versão');
      return false;
    }

    // Verificar mudança de browser (opcional)
    if (data.userAgent !== navigator.userAgent) {
      console.log('🌐 Cache inválido por mudança de browser');
      return false;
    }

    return true;
  }

  /**
   * Limpa o cache
   */
  static clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      console.log('🗑️ Cache de fontes limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  static getCacheStats(): {
    exists: boolean;
    size: number;
    fontsCount: number;
    expiresIn: number;
    isValid: boolean;
  } {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        return {
          exists: false,
          size: 0,
          fontsCount: 0,
          expiresIn: 0,
          isValid: false
        };
      }

      const cacheData: FontCacheData = JSON.parse(cached);
      const expiresIn = Math.max(0, cacheData.expiresAt - Date.now());

      return {
        exists: true,
        size: cached.length,
        fontsCount: cacheData.fonts.length,
        expiresIn,
        isValid: this.isCacheValid(cacheData)
      };
      
    } catch {
      return {
        exists: false,
        size: 0,
        fontsCount: 0,
        expiresIn: 0,
        isValid: false
      };
    }
  }

  /**
   * Força refresh do cache (útil para debugging)
   */
  static forceRefresh(): void {
    this.clearCache();
    console.log('🔄 Cache forçado a refresh');
  }
}
