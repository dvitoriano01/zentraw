// Lista sincronizada de fontes Freepik realmente presentes no CSS
// Atualize este array sempre que atualizar o CSS de fontes

export interface FreepikFont {
  label: string; // Nome amigável
  value: string; // Código único (igual ao font-family do CSS)
  weight: number;
  style: 'normal' | 'italic';
  family: string; // Família base
}

export const freepikFontsSynced: FreepikFont[] = [
  // Exemplo:
  // { label: 'Freepik Grotesk Bold', value: 'freepik-grotesk-bold', weight: 700, style: 'normal', family: 'freepik-grotesk' },
  // { label: 'Freepik Grotesk Italic', value: 'freepik-grotesk-italic', weight: 400, style: 'italic', family: 'freepik-grotesk' },
  // Adicione aqui as fontes realmente presentes no CSS
];
