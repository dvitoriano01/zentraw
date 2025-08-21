// ZENTRAW PHOTO EDITOR V1.3.0.c.7 - Sistema de Fontes Freepik Premium
// 🎯 SINCRONIZAÇÃO COMPLETA: CSS ↔ Arquivos ↔ Lista
// 🔬 VERIFICAÇÃO ROBUSTA: Apenas fontes que existem em freepik-fonts.css e /public/fonts/freepik
// 🔄 CHAVE ÚNICA: Família-peso-estilo para dropdown inteligente
// 🛡️ FALLBACK SEGURO: Tratamento de fontes OTF problemáticas com fallback gracioso
//
// IMPORTANTE: NÃO ALTERAR sem verificar correspondência com CSS e arquivos físicos!
export interface FreepikFont {
  label: string;
  value: string;
  weight?: number;
  style?: 'normal' | 'italic';
  family?: string; // For grouping variations
  originalValue?: string; // Original font family name for CSS application
}

export const freepikFonts: FreepikFont[] = [
  { label: 'Aerohate Caps', value: 'Aerohate-Caps', weight: 400, family: 'Aerohate' },

  // Família Akuina - códigos únicos para cada variação
  { label: 'Akuina Regular', value: 'Akuina-Regular', weight: 400, family: 'Akuina' },
  { label: 'Akuina Black', value: 'Akuina-Black', weight: 800, family: 'Akuina' },
  {
    label: 'Akuina Regular Italic',
    value: 'Akuina-Regular-Italic',
    weight: 400,
    style: 'italic',
    family: 'Akuina',
  },
  { label: 'Akuina Black Italic', value: 'Akuina-Black-Italic', weight: 800, style: 'italic', family: 'Akuina' },

  { label: 'Bestters Supply', value: 'Bestters-Supply', weight: 400, family: 'Bestters Supply' },
  { label: 'Big Bang', value: 'Big-Bang-Italic', weight: 400, style: 'italic', family: 'Big Bang' },
  { label: 'Big Bang Swashes', value: 'Big-Bang-Swashes', weight: 400, family: 'Big Bang' },
  { label: 'Bilground', value: 'Bilground-Regular', weight: 400, family: 'Bilground' },
  { label: 'Birthday Dream', value: 'Birthday-Dream', weight: 400, family: 'Birthday Dream' },
  { label: 'Bonitalia', value: 'Bonitalia-Regular', weight: 400, family: 'Bonitalia' },
  { label: 'Crown Ford', value: 'Crown-Ford', weight: 400, family: 'Crown Ford' },
  { label: 'Custody Script', value: 'Custody-Script', weight: 400, family: 'Custody Script' },
  { label: 'Dhaniel', value: 'Dhaniel-Regular', weight: 400, family: 'Dhaniel' },

  // Família Different Beginning - códigos únicos para cada variação
  {
    label: 'Different Beginning Regular',
    value: 'Different-Beginning-Regular',
    weight: 400,
    family: 'Different Beginning',
  },
  {
    label: 'Different Beginning Bold',
    value: 'Different-Beginning-Bold',
    weight: 700,
    family: 'Different Beginning',
  },

  { label: 'Facon', value: 'Facon-Regular', weight: 400, family: 'Facon' },

  // Família Freedom Standing - códigos únicos para cada variação
  {
    label: 'Freedom Standing Extra Light',
    value: 'Freedom-Standing-ExtraLight',
    weight: 100,
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Regular',
    value: 'Freedom-Standing-Regular',
    weight: 400,
    family: 'Freedom Standing',
  },

  { label: 'Glitch Goblin', value: 'Glitch-Goblin', weight: 400, family: 'Glitch Goblin' },
  { label: 'Guthenberg Swashes', value: 'Guthenberg-Swashes', weight: 400, family: 'Guthenberg' },
  { label: 'Hericake', value: 'Hericake-Regular', weight: 400, family: 'Hericake' },
  { label: 'Holian', value: 'Holian-Regular', weight: 400, family: 'Holian' },
  { label: 'Keep Humble', value: 'Keep-Humble', weight: 400, family: 'Keep Humble' },

  // Família Magical Sparkle - código único
  {
    label: 'Magical Sparkle Regular',
    value: 'Magical-Sparkle-Regular',
    weight: 400,
    family: 'Magical Sparkle',
  },

  // Família Medium Unique - códigos únicos para cada variação
  { label: 'Medium Unique Regular', value: 'Medium-Unique-Regular', weight: 400, family: 'Medium Unique' },
  { label: 'Medium Unique Bold', value: 'Medium-Unique-Bold', weight: 700, family: 'Medium Unique' },

  { label: 'Mercy Christole', value: 'Mercy-Christole', weight: 400, family: 'Mercy Christole' },
  { label: 'Milksea', value: 'Milksea-Regular', weight: 400, family: 'Milksea' },
  { label: 'Mockatea', value: 'Mockatea-Regular', weight: 400, family: 'Mockatea' },

  // Família Mofita - códigos únicos para cada variação
  { label: 'Mofita Regular', value: 'Mofita-Regular', weight: 400, family: 'Mofita' },
  { label: 'Mofita Italic', value: 'Mofita-Italic', weight: 400, style: 'italic', family: 'Mofita' },

  { label: 'Mongkrain', value: 'Mongkrain-Regular', weight: 400, family: 'Mongkrain' },
  { label: 'Morthwicks', value: 'Morthwicks-Regular', weight: 400, family: 'Morthwicks' },
  { label: 'Playride', value: 'Playride-Regular', weight: 400, family: 'Playride' },

  // Família Retroking - código único
  { label: 'Retroking', value: 'Retroking-Regular', weight: 400, family: 'Retroking' },

  { label: 'The Beautyline', value: 'The-Beautyline', weight: 400, family: 'The Beautyline' },
  { label: 'Tratags', value: 'Tratags-Regular', weight: 400, family: 'Tratags' },

  // Família Turbo Type - códigos únicos para cada variação
  { label: 'Turbo Type', value: 'Turbo-Type-Regular', weight: 400, family: 'Turbo Type' },
  { label: 'Turbo Type Two', value: 'Turbo-Type-Two', weight: 400, family: 'Turbo Type' },

  // Família Urban Starblues - códigos únicos para cada variação
  {
    label: 'Urban Starblues Graffiti',
    value: 'Urban-Starblues-Graffiti',
    weight: 400,
    family: 'Urban Starblues',
  },
  {
    label: 'Urban Starblues Sans',
    value: 'Urban-Starblues-Sans',
    weight: 400,
    family: 'Urban Starblues',
  },

  { label: 'Vibes Arcade', value: 'Vibes-Arcade', weight: 400, family: 'Vibes Arcade' },
  { label: 'Watten', value: 'Watten-Regular', weight: 400, family: 'Watten' },
];
