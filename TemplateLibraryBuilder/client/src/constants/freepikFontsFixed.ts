// Fontes Freepik Premium - Sistema corrigido com values únicos (v1.3.0.c.4)
// CORREÇÃO FINAL: Values devem corresponder exatamente aos font-family do CSS
// CSS usa uma família com múltiplos pesos (ex: "Akuina" com font-weight 200, 400, 700)
export interface FreepikFont {
  label: string;
  value: string;
  weight?: number;
  style?: 'normal' | 'italic';
  family?: string; // For grouping variations
  originalValue?: string; // Original font family name for CSS application
}

export const freepikFonts: FreepikFont[] = [
  { label: 'Aerohate Caps', value: 'Aerohate Caps', weight: 400, family: 'Aerohate' },

  // Família Akuina - Otimizada para 4 melhores variações (v1.3.0.d.3)
  // Selecionadas por uso comum, contraste visual e flexibilidade
  { label: 'Akuina Light', value: 'Akuina', weight: 200, family: 'Akuina' },
  { label: 'Akuina Regular', value: 'Akuina', weight: 400, family: 'Akuina' },
  { label: 'Akuina Regular Italic', value: 'Akuina', weight: 400, style: 'italic', family: 'Akuina' },
  { label: 'Akuina Bold', value: 'Akuina', weight: 700, family: 'Akuina' },

  { label: 'Bestters Supply', value: 'Bestters Supply', weight: 400, family: 'Bestters Supply' },
  { label: 'Big Bang', value: 'Big Bang', weight: 400, family: 'Big Bang' },
  { label: 'Big Bang Swashes', value: 'Big Bang Swashes', weight: 400, family: 'Big Bang' },
  { label: 'Bilground', value: 'Bilground', weight: 400, family: 'Bilground' },
  { label: 'Birthday Dream', value: 'Birthday Dream', weight: 400, family: 'Birthday Dream' },
  { label: 'Bonitalia', value: 'Bonitalia', weight: 400, family: 'Bonitalia' },
  { label: 'Crown Ford', value: 'Crown Ford', weight: 400, family: 'Crown Ford' },
  { label: 'Custody Script', value: 'Custody Script', weight: 400, family: 'Custody Script' },
  { label: 'Dhaniel', value: 'Dhaniel', weight: 400, family: 'Dhaniel' },

  // Família Different Beginning
  {
    label: 'Different Beginning Light',
    value: 'Different Beginning',
    weight: 200,
    family: 'Different Beginning',
  },
  {
    label: 'Different Beginning Regular',
    value: 'Different Beginning',
    weight: 400,
    family: 'Different Beginning',
  },
  {
    label: 'Different Beginning Bold',
    value: 'Different Beginning',
    weight: 700,
    family: 'Different Beginning',
  },

  { label: 'Facon', value: 'Facon', weight: 400, family: 'Facon' },

  // Família Freedom Standing
  {
    label: 'Freedom Standing Extra Light',
    value: 'Freedom Standing',
    weight: 100,
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Light',
    value: 'Freedom Standing',
    weight: 200,
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Regular',
    value: 'Freedom Standing',
    weight: 400,
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Extra Light Italic',
    value: 'Freedom Standing',
    weight: 100,
    style: 'italic',
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Light Italic',
    value: 'Freedom Standing',
    weight: 200,
    style: 'italic',
    family: 'Freedom Standing',
  },
  {
    label: 'Freedom Standing Regular Italic',
    value: 'Freedom Standing',
    weight: 400,
    style: 'italic',
    family: 'Freedom Standing',
  },

  { label: 'Glitch Goblin', value: 'Glitch Goblin', weight: 400, family: 'Glitch Goblin' },
  { label: 'Guthenberg Swashes', value: 'Guthenberg Swashes', weight: 400, family: 'Guthenberg' },
  { label: 'Hericake', value: 'Hericake', weight: 400, family: 'Hericake' },
  { label: 'Holian', value: 'Holian', weight: 400, family: 'Holian' },
  { label: 'Keep Humble', value: 'Keep Humble', weight: 400, family: 'Keep Humble' },

  // Família Magical Sparkle
  {
    label: 'Magical Sparkle Regular',
    value: 'Magical Sparkle',
    weight: 400,
    family: 'Magical Sparkle',
  },
  {
    label: 'Magical Sparkle Italic',
    value: 'Magical Sparkle',
    weight: 400,
    style: 'italic',
    family: 'Magical Sparkle',
  },

  // Família Medium Unique
  { label: 'Medium Unique Regular', value: 'Medium Unique', weight: 400, family: 'Medium Unique' },
  { label: 'Medium Unique Bold', value: 'Medium Unique', weight: 700, family: 'Medium Unique' },

  { label: 'Mercy Christole', value: 'Mercy Christole', weight: 400, family: 'Mercy Christole' },
  { label: 'Milksea', value: 'Milksea', weight: 400, family: 'Milksea' },
  { label: 'Mockatea', value: 'Mockatea', weight: 400, family: 'Mockatea' },

  // Família Mofita
  { label: 'Mofita Regular', value: 'Mofita', weight: 400, family: 'Mofita' },
  { label: 'Mofita Italic', value: 'Mofita', weight: 400, style: 'italic', family: 'Mofita' },
  { label: 'Mofita Pro Regular', value: 'Mofita Pro', weight: 400, family: 'Mofita Pro' },
  {
    label: 'Mofita Pro Italic',
    value: 'Mofita Pro',
    weight: 400,
    style: 'italic',
    family: 'Mofita Pro',
  },

  { label: 'Mongkrain', value: 'Mongkrain', weight: 400, family: 'Mongkrain' },
  { label: 'Morthwicks', value: 'Morthwicks', weight: 400, family: 'Morthwicks' },
  { label: 'Playride', value: 'Playride', weight: 400, family: 'Playride' },

  // Família Retroking
  { label: 'Retroking', value: 'Retroking', weight: 400, family: 'Retroking' },
  { label: 'Retroking Rough', value: 'Retroking Rough', weight: 400, family: 'Retroking' },

  { label: 'The Beautyline', value: 'The Beautyline', weight: 400, family: 'The Beautyline' },
  { label: 'Tratags', value: 'Tratags', weight: 400, family: 'Tratags' },

  // Família Turbo Type
  { label: 'Turbo Type', value: 'Turbo Type', weight: 400, family: 'Turbo Type' },
  { label: 'Turbo Type Two', value: 'Turbo Type Two', weight: 400, family: 'Turbo Type' },

  // Família Urban Starblues
  {
    label: 'Urban Starblues Graffiti',
    value: 'Urban Starblues Graffiti',
    weight: 400,
    family: 'Urban Starblues',
  },
  {
    label: 'Urban Starblues Sans',
    value: 'Urban Starblues Sans',
    weight: 400,
    family: 'Urban Starblues',
  },

  { label: 'Vibes Arcade', value: 'Vibes Arcade', weight: 400, family: 'Vibes Arcade' },
  { label: 'Watten', value: 'Watten', weight: 400, family: 'Watten' },
];
