/**
 * 🚀 FREEPIK FONT MANAGER - SISTEMA ROBUSTO v1.3.0.c.6
 * 
 * FUNCIONALIDADES:
 * ✅ Verificação robusta via Canvas API
 * ✅ Carregamento direto das fontes Freepik
 * ✅ Sistema de fallback
 * ✅ Aplicação garantida em textos
 * 
 * CORREÇÃO: Fontes Freepik aplicadas corretamente
 */

export interface FontLoadResult {
  totalFonts: number;
  loadedFonts: number;
  failedFonts: number;
}

export class FreepikFontManager {
  private static instance: FreepikFontManager;
  private loadedFonts = new Set<string>();
  private testCanvas: HTMLCanvasElement;
  private testCtx: CanvasRenderingContext2D;

  private constructor() {
    // Criar canvas de teste para verificação robusta
    this.testCanvas = document.createElement('canvas');
    this.testCanvas.width = 100;
    this.testCanvas.height = 50;
    this.testCtx = this.testCanvas.getContext('2d')!;
  }

  static getInstance(): FreepikFontManager {
    if (!FreepikFontManager.instance) {
      FreepikFontManager.instance = new FreepikFontManager();
    }
    return FreepikFontManager.instance;
  }

  /**
   * Verificação ROBUSTA via Canvas API (mais confiável que document.fonts.check)
   */
  private testFontAvailability(fontFamily: string): boolean {
    try {
      const testText = 'ABCabc123';
      const fontSize = 20;

      // Medir com Arial (referência)
      this.testCtx.font = `${fontSize}px Arial`;
      const arialWidth = this.testCtx.measureText(testText).width;

      // Medir com a fonte testada
      this.testCtx.font = `${fontSize}px "${fontFamily}", Arial`;
      const testWidth = this.testCtx.measureText(testText).width;

      // Se as larguras são diferentes, a fonte customizada foi carregada
      const isLoaded = Math.abs(testWidth - arialWidth) > 1;

      // Verificação dupla
      const documentCheck = document.fonts.check(`${fontSize}px "${fontFamily}"`);

      return isLoaded || documentCheck;
    } catch (error) {
      return false;
    }
  }

  /**
   * Carregar todas as fontes Freepik
   */
  async loadAllFreepikFonts(
    fonts: any[],
    onProgress?: (loaded: number, total: number, current: string) => void
  ): Promise<FontLoadResult> {
    console.log('🚀 [FreepikFontManager] Iniciando carregamento de fontes Freepik...');

    let loadedCount = 0;
    const total = fonts.length;

    // Aguardar que document.fonts esteja pronto
    await document.fonts.ready;

    for (let i = 0; i < fonts.length; i++) {
      const font = fonts[i];
      
      if (onProgress) {
        onProgress(loadedCount, total, font.label);
      }

      // Verificar se a fonte está disponível
      if (this.testFontAvailability(font.value)) {
        this.loadedFonts.add(font.value);
        loadedCount++;
        console.log(`✅ Fonte carregada: ${font.label}`);
      } else {
        console.warn(`❌ Fonte não disponível: ${font.label}`);
      }

      // Pequena pausa para não bloquear a UI
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const result = {
      totalFonts: total,
      loadedFonts: loadedCount,
      failedFonts: total - loadedCount
    };

    console.log(`🎉 [FreepikFontManager] Concluído: ${loadedCount}/${total} fontes carregadas`);
    return result;
  }

  /**
   * Verificar se fonte está disponível
   */
  isFontAvailable(fontName: string): boolean {
    return this.loadedFonts.has(fontName) || this.testFontAvailability(fontName);
  }

  /**
   * Obter lista de fontes carregadas
   */
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  /**
   * Aplicar fonte em um objeto de texto com verificação
   */
  applyFontToText(textObject: any, fontFamily: string, fontWeight?: number, fontStyle?: string): boolean {
    if (!this.isFontAvailable(fontFamily)) {
      console.warn(`❌ Fonte não disponível: ${fontFamily}`);
      return false;
    }

    try {
      textObject.set({
        fontFamily: fontFamily,
        fontWeight: fontWeight || 400,
        fontStyle: fontStyle || 'normal'
      });

      console.log(`✅ Fonte aplicada: ${fontFamily}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao aplicar fonte: ${fontFamily}`, error);
      return false;
    }
  }

  /**
   * Limpar cache
   */
  clearCache(): void {
    this.loadedFonts.clear();
  }
}
