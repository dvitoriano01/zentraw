# ZENTRAW

> Media Central for Artists — Criação visual e sonora impulsionada por IA.

![Zentraw](https://img.shields.io/badge/Zentraw-CreativeAI-blueviolet?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-V1.4.0.a.2-success?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-3D_Visualizer-brightgreen?style=for-the-badge)

---

## 🧠 Visão Geral

**Zentraw** é uma plataforma híbrida que une arte, música e tecnologia para oferecer ferramentas profissionais de criação visual e musical. Desenvolvida por e para criadores digitais, a Zentraw combina inteligência artificial com controle criativo manual, oferecendo um ambiente ágil, intuitivo e inspirador.

### 🚀 **NOVIDADES V1.4.0.a.2** (17/07/2025)

- 🆕 **3D VISUALIZER IMPLEMENTADO** - Sistema completo de renderização 3D com Blender
- ✅ **INTERFACE SPECTERR** - Layout profissional com sidebars organizadas
- ✅ **CONTROLES DE CÂMERA** - Posição, rotação e zoom 3D em tempo real
- ✅ **BLENDER INTEGRATION** - Execução automática via Python scripting
- ✅ **EEVEE_NEXT ENGINE** - Compatibilidade com versões recentes do Blender
- ✅ **PREVIEW SYSTEM** - Geração de previews 3D em ~2.5s
- � **TASKS ATUALIZADAS** - Sistema de tasks VS Code completamente revisado
- 📋 **DOCUMENTAÇÃO COMPLETA** - Guia completo de tasks e desenvolvimento

### 🎮 **COMO USAR - TASKS V1.4.0.a.2**

#### **Desenvolvimento:**
1. `Ctrl+Shift+P` → `Tasks: Run Task` → `🚀 Start Zentraw Backend V1.4.0.a.2`
2. `Ctrl+Shift+P` → `Tasks: Run Task` → `🎨 Start Zentraw Frontend V1.4.0.a.2`
3. `Ctrl+Shift+P` → `Tasks: Run Task` → `🔍 Test Backend Connection`

#### **Quando há Problemas:**
1. `Ctrl+Shift+P` → `Tasks: Run Task` → `🛑 Stop All Node Processes`
2. `Ctrl+Shift+P` → `Tasks: Run Task` → `🔄 Restart Backend V1.4.0.a.2 (Complete)`
3. `Ctrl+Shift+P` → `Tasks: Run Task` → `🧪 Debug Blender System`

#### **Build:**
1. `Ctrl+Shift+P` → `Tasks: Run Task` → `🏗️ Build Zentraw V1.4.0.a.2`

📖 **Documentação Completa**: [/docs/ZENTRAW_V1.4.0.a.2_TASKS_GUIA_COMPLETO.md](./docs/ZENTRAW_V1.4.0.a.2_TASKS_GUIA_COMPLETO.md)

### 🚀 **ÚLTIMAS ATUALIZAÇÕES V1.3.0.c.10** (10/07/2025)

- ✅ **ALTA RESOLUÇÃO IMPLEMENTADA** - Canvas renderiza em qualidade superior (2x+ devicePixelRatio)
- ✅ **WORKSPACE OTIMIZADO** - Canvas ocupa automaticamente 85-90% da área disponível
- ✅ **ZOOM SEM DEGRADAÇÃO** - Texto e imagens mantêm qualidade profissional em qualquer zoom
- ✅ **EXPORTAÇÃO PREMIUM** - Exports em alta resolução (3x multiplier) para uso comercial
- ✅ **SINCRONIZAÇÃO PERFEITA** - CSS + Fabric.js trabalhando em harmonia
- ✅ **TODAS AS CONQUISTAS MANTIDAS** - Cover Art padrão, 44 fontes Freepik, painéis funcionais

🎯 Melhorias V1.3.0.c.10:

- Canvas inteligente que se adapta ao tamanho da tela
- Renderização com `imageSmoothingQuality = 'high'`
- Texto criado em tamanhos otimizados para alta qualidade
- Zoom sincronizado entre CSS transform e Fabric.js
- Área de trabalho maximizada sem perder funcionalidade

🎯 Foco atual do projeto:

- Geração automática de capas de single (formatos: 1:1, Story, Landscape)
- Editor visual estilo Photoshop com camadas, filtros e tipografia personalizada
- Geração de bios, press releases e kits promocionais com IA
- Visualizers animados e efeitos de texto para redes sociais
- Integração com dados musicais e APIs criativas de IA

---

## ⚙️ Funcionalidades Principais

### 🎨 Editor Visual Avançado

- Interface inspirada no Photoshop (drag & drop, camadas, blend modes)
- Templates SVG para capas de música e conteúdo digital
- Efeitos visuais customizáveis: glitch, filme, plástico, vinil, neon, holograma

### 🎧 Ferramentas Musicais Inteligentes

- Gerador automático de releases, bios e press kits
- Análise de performance e sugestões de promoção por IA
- Exportação para playlists, mídia e distribuição

### 🎬 3D Visualizer (NOVO V1.4.0)

- **Render Engine**: Integração completa com Blender (EEVEE_NEXT)
- **Interface Specterr**: Layout profissional com controles organizados
- **Camera Controls**: Posição 3D, rotação e zoom em tempo real
- **Preview System**: Geração rápida de previews (~2.5s)
- **File Support**: Upload de áudio e imagem para visualização 3D
- **Customization**: Configurações de resolução, qualidade e estilo de animação

### 🔗 Integrações com APIs

- **Spotify**: análise de streaming e metadados artísticos
- **YouTube Shorts & TikTok**: vídeos promocionais automáticos
- **OpenAI**: geração de conteúdo textual e visual com ChatGPT e DALL·E
- **Mirage Studio, VHEER, Replicate, Sora**: geração de vídeos, filtros e AI FX
- **Blender**: renderização 3D e visualização musical

---

## 🧱 Tecnologias Utilizadas

- **Front-end**: React + TailwindCSS + Fabric.js
- **Back-end**: Node.js (em estrutura monorepo)
- **Builder**: Vite
- **Ambiente**: Replit
- **IA**: OpenAI (GPT, DALL·E), Mirage, VHEER, Stability AI

---

## 🛠️ Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seuuser/zentraw.git
cd zentraw

# 2. Instale as dependências
npm install

# 3. Rode o projeto
npm run dev
```

---

## 🤖 Regras para Agentes IA

### **Protocolo de Interação com Assistentes**
1. **🔍 Análise Inicial** - Verificar estrutura e contexto.
2. **🧩 Decomposição** - Quebrar em tarefas menores.
3. **🎯 Implementação** - Uma mudança por vez.
4. **✅ Validação** - Testar cada alteração.
5. **📚 Documentação** - Registrar mudanças.

### **Desenvolvimento Assistido por IA**
- **Consultar** documentação existente antes de implementar.
- **Aplicar** lições aprendidas dos logs de sessão.
- **Evitar** repetição de erros já documentados.
- **Usar** experiência acumulada nas decisões.

### **Proatividade dos Agentes IA**
- **Sempre agir proativamente** na resolução de problemas encontrados.
- **Apontar o problema, a solução e perguntar somente se necessário.**
- **Em casos comuns, agir sempre com proatividade!**
