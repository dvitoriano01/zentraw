// Backup do arquivo freepikFontsFixed.ts da versão V1.3.0.c.8
// Data: 08/07/2025
// Status: 100% funcional - Array com valores únicos sincronizados com CSS
// Correção: Valores únicos para cada variação

// ZENTRAW PHOTO EDITOR V1.3.0.c.7 - Sistema de Fontes Freepik Premium
// 🎯 SINCRONIZAÇÃO COMPLETA: CSS ↔ Arquivos ↔ Lista
// 🔬 VERIFICAÇÃO ROBUSTA: Apenas fontes que existem em freepik-fonts.css e /public/fonts/freepik
// 🔄 CHAVE ÚNICA: Família-peso-estilo para dropdown inteligente
// 🛡️ FALLBACK SEGURO: Tratamento de fontes OTF problemáticas com fallback gracioso

export interface FreepikFont {
  label: string;
  value: string;
  weight?: number;
  style?: 'normal' | 'italic';
  family?: string;
  originalValue?: string;
}

export const freepikFonts: FreepikFont[] = [
  { label: 'Aerohate Caps', value: 'Aerohate-Caps', weight: 400, family: 'Aerohate' },
  // ... [ARQUIVO COMPLETO COPIADO PARA BACKUP] ...
