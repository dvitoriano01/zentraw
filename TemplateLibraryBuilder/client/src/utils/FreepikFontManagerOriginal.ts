// FreepikFontManager.ts - Sistema robusto de carregamento de fontes
export interface FontLoadStatus {
  font: { label: string; value: string };
  success: boolean;
  error?: string;
}

export interface FontLoadResult {
  totalFonts: number;
  loadedFonts: number;
  failedFonts: number;
  results: FontLoadStatus[];
}

export class FreepikFontManager {
  private static instance: FreepikFontManager;
  private loadedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<boolean>>();
  private fontFallbacks = new Map<string, string>();

  static getInstance(): FreepikFontManager {
    if (!FreepikFontManager.instance) {
      FreepikFontManager.instance = new FreepikFontManager();
    }
    return FreepikFontManager.instance;
  }

  // Lista de fontes reais do Google Fonts
  private getFreepikFontsWithUrls() {
    return [
      // Fontes estilizadas reais do Google Fonts
      {
        label: 'Orbitron',
        value: 'Orbitron',
        url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
        fallback: 'Orbitron, monospace',
      },
      {
        label: 'Dancing Script',
        value: 'Dancing Script',
        url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
        fallback: 'Dancing Script, cursive',
      },
      {
        label: 'Bungee',
        value: 'Bungee',
        url: 'https://fonts.googleapis.com/css2?family=Bungee&display=swap',
        fallback: 'Bungee, cursive',
      },
      {
        label: 'Black Ops One',
        value: 'Black Ops One',
        url: 'https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap',
        fallback: 'Black Ops One, cursive',
      },
      {
        label: 'Righteous',
        value: 'Righteous',
        url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
        fallback: 'Righteous, cursive',
      },
      {
        label: 'Creepster',
        value: 'Creepster',
        url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap',
        fallback: 'Creepster, cursive',
      },
      {
        label: 'Satisfy',
        value: 'Satisfy',
        url: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
        fallback: 'Satisfy, cursive',
      },
      {
        label: 'Press Start 2P',
        value: 'Press Start 2P',
        url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        fallback: 'Press Start 2P, monospace',
      },
      {
        label: 'Fredoka One',
        value: 'Fredoka One',
        url: 'https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap',
        fallback: 'Fredoka One, cursive',
      },
      {
        label: 'Audiowide',
        value: 'Audiowide',
        url: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
        fallback: 'Audiowide, cursive',
      },
      // Fontes Google populares para design
      {
        label: 'Bebas Neue',
        value: 'Bebas Neue',
        url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
        fallback: 'Bebas Neue, cursive',
      },
      {
        label: 'Montserrat',
        value: 'Montserrat',
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
        fallback: 'Montserrat, sans-serif',
      },
      {
        label: 'Oswald',
        value: 'Oswald',
        url: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
        fallback: 'Oswald, sans-serif',
      },
      {
        label: 'Poppins',
        value: 'Poppins',
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
        fallback: 'Poppins, sans-serif',
      },
      {
        label: 'Roboto',
        value: 'Roboto',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
        fallback: 'Roboto, sans-serif',
      },
      {
        label: 'Anton',
        value: 'Anton',
        url: 'https://fonts.googleapis.com/css2?family=Anton&display=swap',
        fallback: 'Anton, sans-serif',
      },
      {
        label: 'Bangers',
        value: 'Bangers',
        url: 'https://fonts.googleapis.com/css2?family=Bangers&display=swap',
        fallback: 'Bangers, cursive',
      },
      {
        label: 'Pacifico',
        value: 'Pacifico',
        url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
        fallback: 'Pacifico, cursive',
      },
      {
        label: 'Lobster',
        value: 'Lobster',
        url: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap',
        fallback: 'Lobster, cursive',
      },
      {
        label: 'Comfortaa',
        value: 'Comfortaa',
        url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap',
        fallback: 'Comfortaa, cursive',
      },
    ];
  }

  // Carregar todas as fontes em paralelo
  async loadAllFreepikFonts(
    onProgress?: (loaded: number, total: number, current: string) => void,
  ): Promise<FontLoadResult> {
    const fonts = this.getFreepikFontsWithUrls();
    let loadedCount = 0;
    const results: FontLoadStatus[] = [];

    // Carregar em paralelo (máximo 5 por vez para não sobrecarregar)
    const batchSize = 5;
    for (let i = 0; i < fonts.length; i += batchSize) {
      const batch = fonts.slice(i, i + batchSize);

      const batchPromises = batch.map(async (font) => {
        onProgress?.(loadedCount, fonts.length, font.label);

        const success = await this.loadSingleFont(font);
        if (success) loadedCount++;

        return { font, success };
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return {
      totalFonts: fonts.length,
      loadedFonts: loadedCount,
      failedFonts: fonts.length - loadedCount,
      results,
    };
  }

  // Carregar fonte individual
  private async loadSingleFont(font: {
    label: string;
    value: string;
    url: string;
    fallback: string;
  }): Promise<boolean> {
    if (this.loadedFonts.has(font.value)) {
      return true; // Já carregada
    }

    if (this.loadingPromises.has(font.value)) {
      return this.loadingPromises.get(font.value)!; // Já carregando
    }

    const loadPromise = this.attemptFontLoad(font);
    this.loadingPromises.set(font.value, loadPromise);

    const success = await loadPromise;
    if (success) {
      this.loadedFonts.add(font.value);
    } else {
      // Setup fallback
      this.fontFallbacks.set(font.value, font.fallback);
    }

    return success;
  }

  // Tentar carregar fonte com timeout
  private async attemptFontLoad(font: {
    label: string;
    value: string;
    url: string;
    fallback: string;
  }): Promise<boolean> {
    try {
      // Método 1: Verificar se já está disponível
      if (document.fonts.check(`12px "${font.value}"`)) {
        return true;
      }

      // Método 2: Carregar via Google Fonts
      await this.loadFontFromUrl(font.url);

      // Método 3: Aguardar carregamento com timeout
      const fontFace = new FontFace(font.value, `url(${font.url})`);
      await Promise.race([
        fontFace.load(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
      ]);

      document.fonts.add(fontFace);
      return true;
    } catch (error) {
      console.warn(`Falha ao carregar fonte ${font.label}:`, error);
      return false;
    }
  }

  // Carregar fonte via URL
  private loadFontFromUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Verificar se já foi carregada
      const existingLink = document.querySelector(`link[href="${url}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load ${url}`));

      document.head.appendChild(link);
    });
  }

  // Verificar se fonte está disponível
  isFontAvailable(fontName: string): boolean {
    return this.loadedFonts.has(fontName) || document.fonts.check(`12px "${fontName}"`);
  }

  // Obter fonte com fallback
  getFontWithFallback(fontName: string): string {
    if (this.isFontAvailable(fontName)) {
      return fontName;
    }
    return this.fontFallbacks.get(fontName) || 'Arial, sans-serif';
  }

  // Obter lista de fontes carregadas
  getAvailableFonts(): Array<{ label: string; value: string }> {
    // Retornar todas as fontes, não apenas as carregadas
    return this.getFreepikFontsWithUrls().map((font) => ({
      label: font.label,
      value: font.value,
    }));
  }

  // Obter todas as fontes (carregadas + fallbacks)
  getAllFonts(): Array<{ label: string; value: string; available: boolean }> {
    return this.getFreepikFontsWithUrls().map((font) => ({
      label: font.label,
      value: font.value,
      available: this.isFontAvailable(font.value),
    }));
  }
}
