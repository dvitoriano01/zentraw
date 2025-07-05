/**
 * FontManager Otimizado v1.3.0.c - Zentraw
 * Sistema robusto de carregamento de fontes Google Fonts
 * Performance: 12 fontes testadas, carregamento em fases, cache eficiente
 */

export interface FontDefinition {
  name: string;
  displayName: string;
  url: string;
  fallback: string;
  priority: 1 | 2 | 3; // 1=essencial, 2=decorativa, 3=especial
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
  tested: boolean; // Fonte testada e confirmada
}

export interface FontLoadStatus {
  name: string;
  loaded: boolean;
  error?: string;
  timestamp: number;
}

export interface CacheEntry {
  fonts: FontLoadStatus[];
  timestamp: number;
  version: string;
}

/**
 * Sistema otimizado de gerenciamento de fontes
 * - Carregamento em fases por prioridade
 * - Cache local com TTL
 * - Fallbacks garantidos
 * - Performance otimizada
 */
export class OptimizedFontManager {
  private static instance: OptimizedFontManager;
  private loadedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<boolean>>();
  private cache: CacheEntry | null = null;
  private readonly CACHE_VERSION = '1.3.0.c';
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas
  private readonly CACHE_KEY = 'zentraw_fonts_cache';

  static getInstance(): OptimizedFontManager {
    if (!OptimizedFontManager.instance) {
      OptimizedFontManager.instance = new OptimizedFontManager();
    }
    return OptimizedFontManager.instance;
  }

  /**
   * Lista otimizada de 12 fontes testadas e compatíveis
   * Reduzida de 20+ para 12 para performance máxima
   */
  private getOptimizedFonts(): FontDefinition[] {
    return [
      // PRIORIDADE 1: Essenciais (sempre carregam primeiro)
      {
        name: 'Montserrat',
        displayName: 'Montserrat',
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
        fallback: 'Montserrat, -apple-system, system-ui, sans-serif',
        priority: 1,
        category: 'sans-serif',
        tested: true,
      },
      {
        name: 'Roboto',
        displayName: 'Roboto',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
        fallback: 'Roboto, -apple-system, system-ui, sans-serif',
        priority: 1,
        category: 'sans-serif',
        tested: true,
      },
      {
        name: 'Poppins',
        displayName: 'Poppins',
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
        fallback: 'Poppins, -apple-system, system-ui, sans-serif',
        priority: 1,
        category: 'sans-serif',
        tested: true,
      },
      {
        name: 'Inter',
        displayName: 'Inter',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap',
        fallback: 'Inter, -apple-system, system-ui, sans-serif',
        priority: 1,
        category: 'sans-serif',
        tested: true,
      },

      // PRIORIDADE 2: Decorativas (carregamento secundário)
      {
        name: 'Orbitron',
        displayName: 'Orbitron (Futuristic)',
        url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
        fallback: 'Orbitron, Courier New, monospace',
        priority: 2,
        category: 'display',
        tested: true,
      },
      {
        name: 'Bebas Neue',
        displayName: 'Bebas Neue (Bold)',
        url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        fallback: 'Bebas Neue, Impact, sans-serif',
        priority: 2,
        category: 'display',
        tested: true,
      },
      {
        name: 'Dancing Script',
        displayName: 'Dancing Script (Script)',
        url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
        fallback: 'Dancing Script, cursive',
        priority: 2,
        category: 'handwriting',
        tested: true,
      },
      {
        name: 'Pacifico',
        displayName: 'Pacifico (Retro)',
        url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
        fallback: 'Pacifico, cursive',
        priority: 2,
        category: 'handwriting',
        tested: true,
      },

      // PRIORIDADE 3: Especiais (carregamento sob demanda)
      {
        name: 'Bungee',
        displayName: 'Bungee (Urban)',
        url: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap',
        fallback: 'Bungee, cursive',
        priority: 3,
        category: 'display',
        tested: true,
      },
      {
        name: 'Press Start 2P',
        displayName: 'Press Start 2P (Pixel)',
        url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        fallback: 'Press Start 2P, monospace',
        priority: 3,
        category: 'monospace',
        tested: true,
      },
      {
        name: 'Creepster',
        displayName: 'Creepster (Horror)',
        url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap',
        fallback: 'Creepster, cursive',
        priority: 3,
        category: 'display',
        tested: true,
      },
      {
        name: 'Righteous',
        displayName: 'Righteous (Strong)',
        url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
        fallback: 'Righteous, cursive',
        priority: 3,
        category: 'display',
        tested: true,
      },
    ];
  }

  /**
   * Carregamento inteligente em fases
   * Fase 1: Prioridade 1 (síncronas)
   * Fase 2: Prioridade 2 (background)
   * Fase 3: Prioridade 3 (lazy)
   */
  async loadFontsInPhases(
    onProgress?: (phase: number, loaded: number, total: number, current: string) => void,
  ): Promise<{ phase1: number; phase2: number; phase3: number; total: number }> {
    console.log('🎨 [OptimizedFontManager] Iniciando carregamento em fases...');

    // Verificar cache primeiro
    await this.loadFromCache();

    const fonts = this.getOptimizedFonts();

    // Fase 1: Fontes essenciais (bloqueantes)
    const phase1Fonts = fonts.filter((f) => f.priority === 1);
    console.log(`📦 Fase 1: Carregando ${phase1Fonts.length} fontes essenciais...`);
    const phase1Results = await this.loadFontBatch(phase1Fonts, 1, onProgress);

    // Fase 2: Fontes decorativas (background)
    setTimeout(async () => {
      const phase2Fonts = fonts.filter((f) => f.priority === 2);
      console.log(`🎨 Fase 2: Carregando ${phase2Fonts.length} fontes decorativas...`);
      await this.loadFontBatch(phase2Fonts, 2, onProgress);
    }, 500);

    // Fase 3: Fontes especiais (lazy)
    setTimeout(async () => {
      const phase3Fonts = fonts.filter((f) => f.priority === 3);
      console.log(`✨ Fase 3: Carregando ${phase3Fonts.length} fontes especiais...`);
      await this.loadFontBatch(phase3Fonts, 3, onProgress);
    }, 1500);

    return {
      phase1: phase1Results,
      phase2: 0, // Será atualizado background
      phase3: 0, // Será atualizado lazy
      total: fonts.length,
    };
  }

  /**
   * Carregar lote de fontes
   */
  private async loadFontBatch(
    fonts: FontDefinition[],
    phase: number,
    onProgress?: (phase: number, loaded: number, total: number, current: string) => void,
  ): Promise<number> {
    let loaded = 0;

    // Carregamento em paralelo, mas limitado a 3 simultâneas para performance
    for (let i = 0; i < fonts.length; i += 3) {
      const batch = fonts.slice(i, i + 3);

      const promises = batch.map(async (font) => {
        onProgress?.(phase, loaded, fonts.length, font.displayName);

        const success = await this.loadSingleFontOptimized(font);
        if (success) {
          loaded++;
          this.loadedFonts.add(font.name);
        }

        return success;
      });

      await Promise.all(promises);
    }

    // Salvar no cache
    await this.saveToCache();

    console.log(`✅ Fase ${phase} concluída: ${loaded}/${fonts.length} fontes carregadas`);
    return loaded;
  }

  /**
   * Carregamento otimizado de fonte individual
   */
  private async loadSingleFontOptimized(font: FontDefinition): Promise<boolean> {
    // Verificar se já está carregada
    if (this.loadedFonts.has(font.name)) {
      return true;
    }

    // Verificar se já está sendo carregada
    if (this.loadingPromises.has(font.name)) {
      return await this.loadingPromises.get(font.name)!;
    }

    // Iniciar carregamento
    const loadPromise = this.performFontLoad(font);
    this.loadingPromises.set(font.name, loadPromise);

    return await loadPromise;
  }

  /**
   * Executar carregamento da fonte
   */
  private async performFontLoad(font: FontDefinition): Promise<boolean> {
    try {
      // Método 1: Verificar se já está no sistema
      if (this.isFontAvailableInSystem(font.name)) {
        console.log(`✅ Fonte do sistema detectada: ${font.name}`);
        return true;
      }

      // Método 2: Carregar via CSS Link
      await this.loadFontViaCSS(font);

      // Método 3: Verificar se carregou corretamente
      const isLoaded = await this.verifyFontLoaded(font.name);

      if (isLoaded) {
        console.log(`✅ Fonte carregada: ${font.displayName}`);
        return true;
      } else {
        console.warn(`⚠️ Fonte não carregou: ${font.displayName}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Erro ao carregar fonte ${font.displayName}:`, error);
      return false;
    }
  }

  /**
   * Verificar se fonte está disponível no sistema
   */
  private isFontAvailableInSystem(fontName: string): boolean {
    try {
      return document.fonts.check(`12px "${fontName}"`);
    } catch {
      return false;
    }
  }

  /**
   * Carregar fonte via CSS
   */
  private loadFontViaCSS(font: FontDefinition): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar se já existe
      const existingLink = document.querySelector(`link[data-font="${font.name}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.href = font.url;
      link.rel = 'stylesheet';
      link.setAttribute('data-font', font.name);
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`CSS load failed: ${font.name}`));

      document.head.appendChild(link);
    });
  }

  /**
   * Verificar se fonte foi carregada com timeout
   */
  private async verifyFontLoaded(fontName: string, timeout = 3000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (document.fonts.check(`12px "${fontName}"`)) {
        return true;
      }

      // Aguardar 100ms antes de verificar novamente
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return false;
  }

  /**
   * Sistema de cache local
   */
  private async loadFromCache(): Promise<void> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return;

      const cacheData: CacheEntry = JSON.parse(cached);

      // Verificar versão e TTL
      if (
        cacheData.version !== this.CACHE_VERSION ||
        Date.now() - cacheData.timestamp > this.CACHE_TTL
      ) {
        localStorage.removeItem(this.CACHE_KEY);
        return;
      }

      // Aplicar cache
      cacheData.fonts.forEach((status) => {
        if (status.loaded) {
          this.loadedFonts.add(status.name);
        }
      });

      this.cache = cacheData;
      console.log(`📦 Cache carregado: ${this.loadedFonts.size} fontes`);
    } catch (error) {
      console.warn('⚠️ Erro ao carregar cache:', error);
      localStorage.removeItem(this.CACHE_KEY);
    }
  }

  private async saveToCache(): Promise<void> {
    try {
      const fonts = this.getOptimizedFonts();
      const fontStatuses: FontLoadStatus[] = fonts.map((font) => ({
        name: font.name,
        loaded: this.loadedFonts.has(font.name),
        timestamp: Date.now(),
      }));

      const cacheData: CacheEntry = {
        fonts: fontStatuses,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 Cache salvo');
    } catch (error) {
      console.warn('⚠️ Erro ao salvar cache:', error);
    }
  }

  /**
   * API pública
   */

  // Obter fontes para dropdown (somente carregadas)
  getAvailableFonts(): Array<{ label: string; value: string; category: string }> {
    const fonts = this.getOptimizedFonts();
    return fonts
      .filter((font) => this.loadedFonts.has(font.name))
      .map((font) => ({
        label: font.displayName,
        value: font.name,
        category: font.category,
      }));
  }

  // Obter fonte com fallback garantido
  getFontWithFallback(fontName: string): string {
    const font = this.getOptimizedFonts().find((f) => f.name === fontName);

    if (font && this.loadedFonts.has(fontName)) {
      return font.fallback;
    }

    // Fallback seguro baseado na categoria
    if (font) {
      switch (font.category) {
        case 'serif':
          return 'Georgia, Times, serif';
        case 'monospace':
          return 'Courier New, monospace';
        case 'handwriting':
          return 'cursive';
        case 'display':
          return 'Impact, sans-serif';
        default:
          return '-apple-system, system-ui, sans-serif';
      }
    }

    return '-apple-system, system-ui, sans-serif';
  }

  // Verificar se fonte está disponível
  isFontLoaded(fontName: string): boolean {
    return this.loadedFonts.has(fontName);
  }

  // Obter estatísticas
  getStats(): { loaded: number; total: number; cached: boolean } {
    const total = this.getOptimizedFonts().length;
    return {
      loaded: this.loadedFonts.size,
      total,
      cached: this.cache !== null,
    };
  }

  // Forçar recarregamento
  async forceReload(): Promise<void> {
    localStorage.removeItem(this.CACHE_KEY);
    this.loadedFonts.clear();
    this.loadingPromises.clear();
    this.cache = null;

    await this.loadFontsInPhases();
  }
}
