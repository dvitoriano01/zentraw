# 🏛️ ZENTRAW - REGRAS MASTER UNIVERSAIS

**Versão:** MASTER v2.1 - WORKSPACE TRANSITION EDITION  
**Data:** 20 de Agosto de 2025  
**Última Atualização:** Troca de Workspace + Dashboard Integration Complete  
**Autoridade:** ABSOLUTA - Sobrepõe toda documentação modular  
**Escopo:** TODO o ecossistema Zentraw

---

## 🔄 **TROCA DE WORKSPACE E RESET DE MEMÓRIA DO AGENTE (20/08/2025)**

### **CONTEXTO CRÍTICO:**
Workspace foi alterado para incluir TODOS os repositórios necessários. Memória do agente reseta a cada troca de workspace. É OBRIGATÓRIO documentar todo o progresso e instruções para continuidade.

### **WORKSPACE ATUAL (DESDE 20/08/2025):**
- **Diretório Raiz:** `~/GitHub/clone` (WSL) / `C:\Users\Denys Victoriano\Documents\GitHub\clone` (Windows mapping)
- **Repositórios Inclusos:** zentraw, gsap-threejs-inertia_DENYS, outros módulos necessários
- **3D Visualizer Oficial:** `C:\Users\Denys Victoriano\Documents\GitHub\clone\gsap-threejs-inertia_DENYS\Grok_Blender_Integration`
- **Dashboard Zentraw:** Configurado em `zentraw\Zentraw\dashboard\` para gerenciamento modular

### **DASHBOARD ZENTRAW - STATUS 20/08/2025:**
- **Localização:** `c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\dashboard\`
- **Função:** Gerenciamento modular - inicia apenas um módulo por vez
- **Porta:** 3000 (dashboard principal)
- **Status:** Configurado com novos paths, incluindo 3D Visualizer externo
- **Segurança:** Configurado para NÃO executar scripts Python automáticos

## 🚀 **WSL UBUNTU MIGRATION - ENVIRONMENT REQUIREMENTS**

### **AMBIENTE OBRIGATÓRIO (ATUALIZADO 20/08/2025):**
**TODO desenvolvimento Zentraw opera EXCLUSIVAMENTE no WSL Ubuntu 22.04.4 LTS**

✅ **ESPECIFICAÇÕES TÉCNICAS:**
- **Sistema:** WSL Ubuntu 22.04.4 LTS
- **Node.js:** v18.20.8 (via NVM - OBRIGATÓRIO)
- **NPM:** v10.8.2+
- **Git:** Configurado com credenciais do usuário
- **Workspace:** `~/zentraw/` (WSL filesystem)
- **Performance:** 75% melhoria vs Windows (npm install: 24s vs 60-120s)
- **Security:** 0 vulnerabilities (vs múltiplas no Windows)

✅ **ROTINA OPERACIONAL OBRIGATÓRIA:**
```bash
# Acesso WSL
wsl -d Ubuntu-22.04

# Configuração Node.js
source ~/.bashrc && nvm use 18

# Workspace Zentraw
cd ~/zentraw

# Admin Panel (CENTRO DE CONTROLE)
cd ~/zentraw/Admin_Panel && npm start  # Porta 3003 - OBRIGATÓRIA
```

✅ **ADMIN PANEL COMO NÚCLEO CENTRAL:**
- **URL:** http://localhost:3003 (PORTA FIXA)
- **Função:** Controle centralizado de TODOS os módulos Zentraw
- **APIs:** Gerenciamento central de todas as APIs externas
- **Monitoramento:** Real-time de módulos, conflitos e performance
- **Configuração:** Global - mudanças aplicadas em todo o ecossistema

🚫 **PROIBIDO ABSOLUTO:** Desenvolvimento em ambiente Windows, PowerShell ou cmd para Zentraw. WSL-only.

---

## 🚨 **HIERARQUIA DOCUMENTAL ABSOLUTA**

### **ORDEM DE PRIORIDADE OBRIGATÓRIA:**
```
P0: 🏛️ ZENTRAW-MASTER-RULES.md         ← ESTE DOCUMENTO (SUPREMO)
P1: 🏗️ MODULE-ARCHITECTURE-STANDARD.md  ← Padrão arquitetural
P2: 📋 [MÓDULO]/docs/README.md          ← Status atual do módulo
P3: 📋 [MÓDULO]/docs/CHANGELOG.md       ← Histórico do módulo
P4: 🚨 [MÓDULO]/docs/TROUBLESHOOTING.md ← Problemas resolvidos
P5: 📊 Demais documentos modulares      ← Específicos técnicos
```

### **REGRA DE OURO:**
**EM CASO DE CONTRADIÇÃO**: MASTER sempre prevalece. Módulo deve ser corrigido para compliance.

---

## 🏗️ **PADRÕES ARQUITETURAIS OBRIGATÓRIOS**

### **ESTRUTURA UNIVERSAL DE MÓDULO (WSL-NATIVE):**
```
[NOME_MÓDULO]/
├── 📚 docs/
│   ├── README.md              # Status + arquivos ativos (OBRIGATÓRIO)
│   ├── CHANGELOG.md           # Histórico completo (OBRIGATÓRIO) 
│   ├── TROUBLESHOOTING.md     # Problemas resolvidos (OBRIGATÓRIO)
│   ├── WSL_MIGRATION.md       # Status migração WSL (NOVO - OBRIGATÓRIO)
│   ├── ARCHITECTURE.md        # Estrutura técnica
│   ├── TESTING.md             # Procedimentos de teste
│   ├── API.md                 # Documentação de API (se aplicável)
│   └── versions/              # Logs por versão
│       ├── v[x.x.x.x]/       # Documentação versionada
│       └── current/           # Link para versão ativa
├── 🔧 src/                    # Código fonte ativo (WSL-native)
├── 🧪 tests/                  # Testes validados (WSL-native)
├── 📋 config/                 # Configurações (WSL-compatible)
├── 📤 outputs/                # Resultados/builds
├── 📊 logs/                   # Logs de execução
├── 🎯 README.md               # Visão geral do módulo
├── 📦 package.json            # Dependências (Node.js v18.20.8)
├── 🐧 wsl-setup.sh            # Script de setup WSL (NOVO - OBRIGATÓRIO)
└── 📁 archive/                # Arquivos obsoletos Windows (NUNCA USAR)
```

### **PORTAS OFICIAIS ZENTRAW (WSL-NATIVE):**
```
3003 - Admin Panel (Centro de Controle) - OBRIGATÓRIO
3004 - Template Library Builder Backend
3005 - 3D Visualizer (Official: ~/zentraw/Zentraw/3d_visualizer)
3006 - Music Intelligence AI
5002 - Media Control (Legacy)
```

---

## 🤖 **PROTOCOLO OBRIGATÓRIO PARA AGENTES IA**

### **🔍 ANTES DE QUALQUER AÇÃO (OBRIGATÓRIO)**
```
ETAPA 1: ANÁLISE HIERÁRQUICA
├── 1.1 LER ZENTRAW-MASTER-RULES.md (este documento)
├── 1.2 LER MODULE-ARCHITECTURE-STANDARD.md  
├── 1.3 CONSULTAR MODULE-STATUS-TRACKER.md
└── 1.4 LER README.md do módulo específico

ETAPA 2: VALIDAÇÃO FÍSICA
├── 2.1 CONFIRMAR que arquivos listados EXISTEM fisicamente
├── 2.2 VERIFICAR se diretórios correspondem à documentação
├── 2.3 TESTAR sistema atual SEM modificações
└── 2.4 IDENTIFICAR versão real em execução

ETAPA 3: CONTEXTO TÉCNICO
├── 3.1 LER CHANGELOG.md do módulo
├── 3.2 CONSULTAR TROUBLESHOOTING.md
├── 3.3 VERIFICAR logs da versão atual
└── 3.4 ENTENDER arquitetura via ARCHITECTURE.md
```

### **⚡ DURANTE EXECUÇÃO (OBRIGATÓRIO)**
```
✅ UMA MUDANÇA POR VEZ
✅ TESTAR IMEDIATAMENTE após cada mudança
✅ DOCUMENTAR decisão em tempo real
✅ PRESERVAR funcionalidade existente
✅ APLICAR mudança mínima necessária
```

### **📝 APÓS EXECUÇÃO (OBRIGATÓRIO)**
```
ETAPA 1: ATUALIZAÇÃO DOCUMENTAL
├── 1.1 ATUALIZAR README.md do módulo
├── 1.2 REGISTRAR mudança em CHANGELOG.md
├── 1.3 ADICIONAR solução ao TROUBLESHOOTING.md (se aplicável)
└── 1.4 ATUALIZAR MODULE-STATUS-TRACKER.md

ETAPA 2: VALIDAÇÃO FINAL
├── 2.1 EXECUTAR VALIDATION-CHECKLIST.md
├── 2.2 CONFIRMAR sistema funciona 100%
├── 2.3 VERIFICAR consistência documental
└── 2.4 REGISTRAR no ZENTRAW-AGENT-DECISIONS-LOG.md
```

---

## 📋 **PADRÕES DE NOMENCLATURA OBRIGATÓRIOS**

### **VERSIONAMENTO UNIVERSAL:**
```
V[MAJOR].[MINOR].[PATCH].[BUILD]
Exemplo: V1.4.0.a.6

MAJOR: Mudanças arquiteturais grandes (1, 2, 3...)
MINOR: Funcionalidades novas importantes (0, 1, 2...)  
PATCH: Correções de bugs e melhorias (0, 1, 2...)
BUILD: Iterações de desenvolvimento (a, b, c... depois 1, 2, 3...)
```

### **ARQUIVOS DE DOCUMENTAÇÃO:**
```
📚 README.md           # Visão geral + status atual
📋 CHANGELOG.md        # Histórico cronológico
🚨 TROUBLESHOOTING.md  # Problemas + soluções
🏗️ ARCHITECTURE.md     # Estrutura técnica
🧪 TESTING.md          # Procedimentos de teste
📊 API.md              # Documentação de API
```

### **DIRETÓRIOS PADRÃO:**
```
📚 docs/       # Documentação
🔧 src/        # Código fonte
🧪 tests/      # Testes
📋 config/     # Configurações  
📤 outputs/    # Resultados
📊 logs/       # Logs
📁 archive/    # Obsoletos (NUNCA USAR)
```

---

## 🚨 **REGRAS CRÍTICAS DE SEGURANÇA DOCUMENTAL**

### **❌ ABSOLUTAMENTE PROIBIDO:**
```
❌ Usar arquivos de /archive/ (obsoletos)
❌ Criar documentação contraditória
❌ Documentar sistemas inexistentes como reais
❌ Misturar informações de versões diferentes
❌ Criar instruções não testadas
❌ Ignorar hierarquia de prioridades
❌ Assumir funcionalidade sem validar
❌ Modificar sem documentar
```

### **✅ OBRIGATÓRIO SEMPRE:**
```
✅ Validar existência física de arquivos
✅ Testar instruções antes de documentar
✅ Manter consistência hierárquica
✅ Documentar em tempo real
✅ Preservar base funcional
✅ Aplicar princípio da mudança mínima
✅ Seguir protocolo de prioridades
✅ Validar após cada modificação
```

---

## 🔄 **PROTOCOLO DE ATUALIZAÇÃO DOCUMENTAL**

### **QUANDO ALGO MUDA:**
```
1. 📝 PARAR e documentar estado atual
2. 🔍 IDENTIFICAR impacto na arquitetura
3. 📋 ATUALIZAR documentação do módulo
4. 📊 REGISTRAR no MODULE-STATUS-TRACKER.md
5. 🚨 ADICIONAR ao TROUBLESHOOTING.md (se erro)
6. 📝 REGISTRAR decisão no log de agentes
7. ✅ VALIDAR consistência total
```

### **FREQUÊNCIA DE VALIDAÇÃO:**
```
🔍 VALIDATION-CHECKLIST.md: A cada modificação
📊 MODULE-STATUS-TRACKER.md: Diário
📝 ZENTRAW-AGENT-DECISIONS-LOG.md: Tempo real
🧹 Limpeza de arquivo: Semanal
```

---

## 🎯 **MÓDULOS ZENTRAW OFICIAIS**

### **ESTRUTURA CURRENT:**
```
zentraw/
├── 🎬 3d-visualizer/          # Renderização 3D + Blender
├── 🏗️ TemplateLibraryBuilder/  # Sistema principal
├── 📱 ZentrawMediaControl/     # Controle de mídia  
├── 🎨 VisualFilters/          # Filtros visuais
└── 🧪 textFX/                 # Efeitos de texto
```

### **CADA MÓDULO DEVE:**
```
✅ Seguir estrutura padrão obrigatória
✅ Ter documentação completa em docs/
✅ Manter README.md atualizado com status
✅ Registrar versão atual no tracker
✅ Implementar testes validados
```

---

## 🤖 **REGRAS ESPECÍFICAS PARA AGENTES IA**

### **PROTOCOLO DE ENTRADA:**
```
1. 🏛️ "Analisei ZENTRAW-MASTER-RULES.md"
2. 📋 "Identifiquei módulo: [NOME]"
3. 🎯 "Li README.md do módulo e confirmo status: [STATUS]"
4. ✅ "Validei que arquivos listados existem fisicamente"
5. 🔍 "Sistema atual testado e funcionando: [SIM/NÃO]"
```

### **DURANTE TRABALHO:**
```
⚡ "Aplicando mudança: [DESCRIÇÃO]"
🧪 "Testando resultado: [RESULTADO]"
📝 "Documentando decisão: [MOTIVO]"
✅ "Validando funcionalidade: [STATUS]"
```

### **PROTOCOLO DE SAÍDA:**
```
1. 📊 "Atualizei MODULE-STATUS-TRACKER.md"
2. 📝 "Registrei no ZENTRAW-AGENT-DECISIONS-LOG.md"
3. ✅ "Sistema funciona 100%: [CONFIRMADO]"
4. 🔍 "Validação completa executada: [SIM]"
```

---

## 🏆 **OBJETIVOS DESTA ARQUITETURA**

### **ELIMINAÇÃO COMPLETA DE:**
- ❌ Documentação contraditória
- ❌ Arquivos fantasma 
- ❌ Versões desalinhadas
- ❌ Instruções desatualizadas
- ❌ Loops de erro infinitos
- ❌ Confusão de diretórios
- ❌ Informação tóxica

### **GARANTIA ABSOLUTA DE:**
- ✅ Consistência hierárquica
- ✅ Validação física obrigatória
- ✅ Atualização controlada
- ✅ Rastreabilidade completa  
- ✅ Arquitetura robusta
- ✅ Protocolo de prioridades
- ✅ Single source of truth

---

## 🚨 **AVISO CRÍTICO PARA TODOS OS AGENTES**

**ESTE DOCUMENTO É SUPREMO**

Qualquer contradição encontrada entre este documento e documentação modular deve ser resolvida IMEDIATAMENTE atualizando o módulo para compliance com estas regras.

**NUNCA IGNORE ESTE PROTOCOLO**

A violação destas regras causará erro recursivo e dano ao ecossistema Zentraw.

---

**🎯 AUTORIDADE:** ABSOLUTA  
**🔒 STATUS:** IMUTÁVEL (sem aprovação específica)  
**⚡ VIGÊNCIA:** IMEDIATA para todos os módulos Zentraw  
**📋 COMPLIANCE:** OBRIGATÓRIO para agentes e desenvolvedores
