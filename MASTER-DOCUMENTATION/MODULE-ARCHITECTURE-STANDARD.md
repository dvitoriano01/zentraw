# 🏗️ ZENTRAW - PADRÃO ARQUITETURAL DE MÓDULOS

**Versão:** MASTER v1.0  
**Data:** 24 de Julho de 2025  
**Autoridade:** MASTER - Definido por ZENTRAW-MASTER-RULES.md  
**Aplicação:** OBRIGATÓRIA para todos os módulos Zentraw

---

## 🎯 **TEMPLATE ARQUITETURAL OBRIGATÓRIO**

### **ESTRUTURA FÍSICA PADRÃO:**
```
[NOME_MÓDULO]/
├── 📚 docs/
│   ├── 🎯 README.md                    # ✅ OBRIGATÓRIO - Status atual
│   ├── 📋 CHANGELOG.md                 # ✅ OBRIGATÓRIO - Histórico
│   ├── 🚨 TROUBLESHOOTING.md           # ✅ OBRIGATÓRIO - Problemas
│   ├── 🏗️ ARCHITECTURE.md              # ✅ RECOMENDADO - Estrutura
│   ├── 🧪 TESTING.md                   # ✅ RECOMENDADO - Testes
│   ├── 📊 API.md                       # ⚡ SE APLICÁVEL - APIs
│   └── 📁 versions/                    # ✅ OBRIGATÓRIO - Versionado
│       ├── v1.4.0.a.5/                # Documentação específica
│       ├── v1.4.0.a.6/                # Por versão
│       └── current/                    # Link para versão ativa
├── 🔧 src/                             # ✅ OBRIGATÓRIO - Código fonte
│   ├── components/                     # Componentes principais
│   ├── services/                       # Serviços/APIs
│   ├── utils/                          # Utilitários
│   └── main.[ext]                      # Arquivo principal
├── 🧪 tests/                           # ✅ RECOMENDADO - Testes
│   ├── unit/                           # Testes unitários
│   ├── integration/                    # Testes integração
│   └── fixtures/                       # Dados de teste
├── 📋 config/                          # ⚡ SE APLICÁVEL - Configs
│   ├── development.json                # Config desenvolvimento
│   ├── production.json                 # Config produção
│   └── default.json                    # Config padrão
├── 📤 outputs/                         # ✅ OBRIGATÓRIO - Resultados
│   ├── builds/                         # Builds gerados
│   ├── exports/                        # Exportações
│   └── temp/                           # Temporários
├── 📊 logs/                            # ✅ RECOMENDADO - Logs
│   ├── error.log                       # Logs de erro
│   ├── access.log                      # Logs de acesso
│   └── debug.log                       # Logs debug
├── 🎯 README.md                        # ✅ OBRIGATÓRIO - Visão geral
├── 📦 package.json                     # ⚡ SE APLICÁVEL - Dependencies
├── 🔧 [config-files]                   # Configs específicos
└── 📁 archive/                         # ⚠️ OBSOLETOS - NUNCA USAR
```

---

## 📋 **TEMPLATES DE DOCUMENTOS OBRIGATÓRIOS**

### **1. README.md DO MÓDULO (OBRIGATÓRIO)**
```markdown
# [NOME_MÓDULO] - Zentraw

## 🎯 **STATUS ATUAL**
- **Versão**: V[x.x.x.x]
- **Data**: [DD/MM/AAAA - HH:MM BRT]
- **Status**: [FUNCIONANDO/EM DESENVOLVIMENTO/COM PROBLEMAS]
- **Última Atualização**: [responsável] em [data]

## 📁 **ARQUIVOS ATIVOS V[x.x.x.x]**
```
[MÓDULO]/
├── src/
│   ├── arquivo-principal.[ext]     # ✅ Descrição
│   └── componente-chave.[ext]      # ✅ Descrição
├── config/
│   └── config-principal.json      # ✅ Descrição
└── outputs/
    └── resultado-esperado.[ext]    # ✅ Descrição
```

## ✅ **FUNCIONALIDADES VALIDADAS**
- ✅ [Funcionalidade 1]: [Status]
- ✅ [Funcionalidade 2]: [Status]
- ✅ [Funcionalidade 3]: [Status]

## ⚠️ **PROBLEMAS CONHECIDOS**
- ❌ [Problema 1]: [Descrição]
- 🔧 [Problema 2]: [Em correção]

## 🚀 **COMO USAR**
```bash
# 1. Inicialização
[comandos de setup]

# 2. Execução
[comandos principais]

# 3. Teste
[comandos de validação]
```

## 🔗 **DEPENDÊNCIAS**
- [Dependência 1]: [Versão]
- [Dependência 2]: [Versão]

## 📊 **MÉTRICAS**
- Performance: [dados]
- Estabilidade: [dados]
- Cobertura de testes: [dados]
```

### **2. CHANGELOG.md DO MÓDULO (OBRIGATÓRIO)**
```markdown
# [MÓDULO] - CHANGELOG

## 🚀 **V[x.x.x.x]** - [DD/MM/AAAA] - [TÍTULO]

### **🎯 OBJETIVO**
[Objetivo principal desta versão]

### **📁 ARQUIVOS PRINCIPAIS V[x.x.x.x]**
```
[lista exata de arquivos]
```

### **✅ CONQUISTAS**
- ✅ [Conquista 1]: [Descrição]
- ✅ [Conquista 2]: [Descrição]

### **🔧 CORREÇÕES APLICADAS**
- 🔧 [Correção 1]: [Antes] → [Depois]
- 🔧 [Correção 2]: [Antes] → [Depois]

### **🚫 ARQUIVOS ARQUIVADOS**
- `arquivo-obsoleto.ext` → [Motivo]

### **📊 MÉTRICAS**
- Progresso: [percentual]
- Testes: [quantidade passando]
- Performance: [melhorias]

---

## [Versões anteriores em ordem cronológica reversa]
```

### **3. TROUBLESHOOTING.md DO MÓDULO (OBRIGATÓRIO)**
```markdown
# [MÓDULO] - Troubleshooting

## 🎯 **PROBLEMAS RESOLVIDOS - NÃO REPETIR**

### **🔧 [NOME DO PROBLEMA]**
**Problema**: [Descrição detalhada]
```
# ❌ ERRO (código que causa problema):
[código problemático]

# ✅ SOLUÇÃO (código correto):
[código corrigido]
```
**Status**: ✅ RESOLVIDO em V[x.x.x.x]
**Arquivo**: `[caminho/arquivo]`

---

## 🚨 **PROBLEMAS ATIVOS**

### **🔍 [PROBLEMA ATUAL]**
**Sintoma**: [Descrição do que acontece]
**Possíveis Causas**:
1. [Causa 1]
2. [Causa 2]

**Próximos Passos**:
- [ ] [Ação 1]
- [ ] [Ação 2]

---

## 📋 **CHECKLIST DE VALIDAÇÃO**

### **✅ SISTEMA FUNCIONANDO**
- [ ] [Validação 1]
- [ ] [Validação 2]
- [ ] [Validação 3]

### **❌ INDICADORES DE PROBLEMA**
- [ ] [Indicador 1]
- [ ] [Indicador 2]
```

---

## 🔧 **CONFIGURAÇÕES ESPECÍFICAS POR TIPO DE MÓDULO**

### **MÓDULOS WEB (Frontend/Backend):**
```
adicionar:
├── public/          # Assets públicos
├── routes/          # Rotas de API
├── middleware/      # Middlewares
└── views/           # Templates
```

### **MÓDULOS DESKTOP:**
```
adicionar:
├── assets/          # Recursos do app
├── build/           # Build configs
└── dist/            # Distribuição
```

### **MÓDULOS DE PROCESSAMENTO:**
```
adicionar:
├── algorithms/      # Algoritmos principais
├── data/            # Datasets
└── models/          # Modelos ML/AI
```

### **MÓDULOS DE INTEGRAÇÃO:**
```
adicionar:
├── connectors/      # Conectores externos
├── protocols/       # Protocolos
└── adapters/        # Adaptadores
```

---

## 📊 **VALIDAÇÃO DE COMPLIANCE**

### **CHECKLIST OBRIGATÓRIO:**
```
✅ Estrutura física segue template
✅ README.md existe e está atualizado
✅ CHANGELOG.md existe e está completo
✅ TROUBLESHOOTING.md existe
✅ Arquivos listados existem fisicamente
✅ Versão documentada = versão real
✅ Dependências documentadas
✅ Instruções testadas e funcionais
✅ Pasta archive/ não é referenciada
✅ Nomenclatura segue padrão MASTER
```

### **VALIDAÇÃO AUTOMÁTICA:**
```bash
# Script de validação (a ser implementado)
./validate-module-compliance.sh [NOME_MÓDULO]

# Resultado esperado:
✅ Estrutura: COMPLIANT
✅ Documentação: COMPLIANT  
✅ Arquivos: TODOS EXISTEM
✅ Versionamento: CONSISTENTE
✅ Testes: PASSANDO
```

---

## 🚀 **IMPLEMENTAÇÃO EM MÓDULOS EXISTENTES**

### **MIGRAÇÃO ORDENADA:**
```
1. 📋 CRIAR estrutura docs/ no módulo
2. 📝 MIGRAR documentação existente  
3. 🔧 PADRONIZAR nomenclatura
4. ✅ VALIDAR compliance
5. 📊 ATUALIZAR MODULE-STATUS-TRACKER.md
```

### **PRIORIDADE DE MIGRAÇÃO:**
```
P1: TemplateLibraryBuilder (módulo principal)
P2: 3d-visualizer (módulo crítico)
P3: ZentrawMediaControl (módulo ativo)
P4: VisualFilters (módulo secundário)
P5: textFX (módulo auxiliar)
```

---

## 🤖 **INSTRUÇÕES PARA AGENTES IA**

### **AO TRABALHAR COM QUALQUER MÓDULO:**
```
1. ✅ VERIFICAR se módulo segue este template
2. ✅ SE NÃO: aplicar padronização primeiro
3. ✅ SEMPRE trabalhar com arquivos listados no README.md
4. ✅ NUNCA usar arquivos de /archive/
5. ✅ ATUALIZAR documentação após mudanças
```

### **CRIAÇÃO DE NOVO MÓDULO:**
```
1. 📁 CRIAR estrutura física padrão
2. 📝 PREENCHER templates obrigatórios
3. 🔧 IMPLEMENTAR funcionalidade base
4. 🧪 CRIAR testes básicos
5. ✅ VALIDAR compliance completo
```

---

**🎯 ESTE TEMPLATE É OBRIGATÓRIO PARA TODOS OS MÓDULOS ZENTRAW**

**Status:** ATIVO - Implementação imediata requerida  
**Autoridade:** ZENTRAW-MASTER-RULES.md  
**Validação:** MODULE-STATUS-TRACKER.md
