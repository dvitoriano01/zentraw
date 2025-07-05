# Zentraw Photo Editor - Arquivos Essenciais V1.3.0.c.7

## 📁 Estrutura de Arquivos Críticos

### 🎯 Core do Editor
```
TemplateLibraryBuilder/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── PhotoEditorFixed.tsx                    # ⭐ ARQUIVO PRINCIPAL
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   ├── TextPropertiesPanel.tsx             # 🎨 Painel de propriedades
│   │   │   │   ├── ImagePropertiesPanel.tsx            # 🖼️ Painel de imagens
│   │   │   │   ├── LayerPanel.tsx                      # 📚 Painel de layers
│   │   │   │   └── ToolsPanel.tsx                      # 🔧 Painel de ferramentas
│   │   │   └── ui/                                     # 🎭 Componentes UI base
│   │   │       ├── button.tsx
│   │   │       ├── select.tsx
│   │   │       ├── slider.tsx
│   │   │       ├── tabs.tsx
│   │   │       └── ...
│   │   ├── constants/
│   │   │   └── freepikFontsFixed.ts                    # 📝 Lista de fontes
│   │   ├── styles/
│   │   │   ├── freepik-fonts.css                       # 🎨 CSS das fontes
│   │   │   └── globals.css                             # 🌐 Estilos globais
│   │   └── lib/
│   │       └── utils.ts                                # 🛠️ Utilitários
│   └── index.html                                      # 🏠 HTML principal
├── public/
│   └── fonts/
│       └── freepik/                                    # 📚 Arquivos de fonte
│           ├── Aerohate-Caps.otf
│           ├── Akuina-Regular.ttf
│           ├── Akuina-Black.ttf
│           ├── Akuina-RegularItalic.ttf
│           └── ... (todas as fontes físicas)
└── server/                                             # 🖥️ Backend (se necessário)
```

### ⚙️ Configuração
```
TemplateLibraryBuilder/
├── package.json                                        # 📦 Dependências
├── vite.config.ts                                      # ⚡ Configuração Vite
├── tailwind.config.ts                                  # 🎨 Configuração Tailwind
├── tsconfig.json                                       # 🔧 Configuração TypeScript
├── postcss.config.js                                   # 📝 Configuração PostCSS
└── components.json                                     # 🎭 Configuração UI
```

### 📖 Documentação
```
TemplateLibraryBuilder/
├── VERSION-V1.3.0.c.7.md                              # 📋 Documentação da versão
├── ARQUIVOS-ESSENCIAIS.md                             # 📁 Esta documentação
└── README.md                                           # 📖 Documentação geral
```

## 🎯 Arquivos Críticos - Detalhamento

### 1. PhotoEditorFixed.tsx
**Função:** Lógica principal do editor
**Tamanho:** ~1550 linhas
**Dependências críticas:**
- `fabric.js` - Canvas principal
- `fontfaceobserver` - Carregamento de fontes
- `freepikFontsFixed.ts` - Lista de fontes
- `freepik-fonts.css` - CSS das fontes

**Funcionalidades:**
- Canvas principal com Fabric.js
- Sistema de layers e objetos
- Histórico Ctrl+Z/Redo
- Carregamento e aplicação de fontes
- Ferramentas de desenho e texto
- Export/import de projetos

### 2. TextPropertiesPanel.tsx
**Função:** Controles de propriedades de texto
**Tamanho:** ~425 linhas
**Dependências críticas:**
- `freepikFontsFixed.ts` - Lista de fontes
- Componentes UI (select, slider, button)

**Funcionalidades:**
- Dropdown de fontes com chave única
- Controles de tamanho, cor, alinhamento
- Aplicação de peso e estilo
- Efeitos de texto (sombra, outline)

### 3. freepikFontsFixed.ts
**Função:** Lista de fontes Freepik disponíveis
**Tamanho:** ~85 linhas
**Formato:** Array de objetos com propriedades
**Sincronização:** CSS + Arquivos físicos

**Estrutura:**
```typescript
export interface FreepikFont {
  label: string;        // Nome para exibição
  value: string;        // Família CSS
  weight?: number;      // Peso (400, 700, etc.)
  style?: string;       // Estilo (normal, italic)
  family?: string;      // Agrupamento
  originalValue?: string; // Nome original
}
```

### 4. freepik-fonts.css
**Função:** Declarações @font-face
**Tamanho:** ~500 linhas
**Formato:** CSS com @font-face
**Sincronização:** Lista TS + Arquivos físicos

**Estrutura:**
```css
@font-face {
  font-family: 'Nome da Fonte';
  src: url('/fonts/freepik/arquivo.ttf');
  font-weight: 400;
  font-style: normal;
}
```

### 5. /public/fonts/freepik/
**Função:** Arquivos de fonte físicos
**Formatos:** .ttf, .otf, .woff, .woff2
**Quantidade:** ~40 arquivos
**Sincronização:** CSS + Lista TS

## 🔄 Dependências Críticas

### Principais (package.json)
```json
{
  "fabric": "^5.3.0",                    // Canvas principal
  "fontfaceobserver": "^2.3.0",          // Carregamento de fontes
  "react": "^18.2.0",                    // Framework
  "typescript": "^5.0.0",                // Tipagem
  "vite": "^4.0.0",                      // Build tool
  "tailwindcss": "^3.3.0"                // Estilos
}
```

### UI Components
```json
{
  "@radix-ui/react-select": "^1.2.0",    // Dropdown
  "@radix-ui/react-slider": "^1.1.0",    // Slider
  "@radix-ui/react-tabs": "^1.0.0",      // Tabs
  "lucide-react": "^0.263.0"             // Ícones
}
```

## 🚨 Arquivos NÃO Essenciais (Candidatos para Arquivamento)

### Desenvolvimento/Debug
```
TemplateLibraryBuilder/
├── attached_assets/                     # 📎 Assets temporários
├── testeGit.txt.txt                    # 🧪 Arquivo de teste
└── client/src/
    ├── components/
    │   └── [componentes não utilizados]
    └── pages/
        └── [páginas antigas/não utilizadas]
```

### Servidor (se não usado)
```
TemplateLibraryBuilder/
└── server/                             # 🖥️ Backend (verificar uso)
```

## 🔍 Verificações Essenciais

### 1. Integridade das Fontes
```bash
# Verificar se todos os arquivos CSS têm correspondência física
ls public/fonts/freepik/ | wc -l
grep -c "@font-face" client/src/styles/freepik-fonts.css
```

### 2. Build Success
```bash
npm run build
# Deve completar sem erros
```

### 3. TypeScript Check
```bash
npm run type-check
# Deve passar sem warnings
```

### 4. Funcionalidades Críticas
- [ ] Dropdown de fontes carrega todas as variações
- [ ] Aplicação de fonte funciona (família + peso + estilo)
- [ ] Histórico Ctrl+Z/Redo preserva estado
- [ ] Export/import funciona corretamente
- [ ] Canvas renderiza sem erros

## 🎯 Instruções de Restauração

### Em caso de problemas:
1. **Verificar sincronização:** CSS ↔ Lista TS ↔ Arquivos físicos
2. **Revisar logs:** Console do navegador para erros de fonte
3. **Testar build:** `npm run build` deve passar
4. **Verificar imports:** Todos os arquivos essenciais importados
5. **Restaurar de backup:** Usar tag Git `v1.3.0.c.7`

### Comando de restauração:
```bash
git checkout v1.3.0.c.7
npm install
npm run build
```

---
**Versão:** V1.3.0.c.7  
**Status:** Produção Estável ✅  
**Última Atualização:** Janeiro 2025
