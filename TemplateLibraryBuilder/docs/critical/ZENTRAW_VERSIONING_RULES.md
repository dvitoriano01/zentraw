# 📋 ZENTRAW - REGRAS DE VERSIONAMENTO E NOMENCLATURA

**Data**: 10/07/2025 | **Status**: Regras Oficiais

---

## 🚨 **CRITICAL ALERT - METODOLOGIA CLARA DE VERSIONAMENTO**

### 📋 **PROGRESSÃO ALFA-NUMÉRICA OFICIAL**

```
V1.3.0.c.8 (BASE ESTÁVEL) 
    ↓
V1.3.0.c.9 (+ Zoom)
    ↓  
V1.3.0.c.10 (+ Outras melhorias)
    ↓
V1.3.0.e.x (Próximo grupo)
    ↓
V1.3.0.f.x (Próximo grupo)
    ↓
V1.4.0.x.x (Major feature)
    ↓
V1.5.x.x.x (Major release)
    ↓
V2.x.x.x.x (Major version)
```

<!-- As versões v1.3.0.d.x foram arquivadas devido a problemas e não fazem parte do fluxo principal. Consulte docs/archive/manus-versions-dx para histórico técnico. -->

### ⚠️ **REGRAS CRÍTICAS DE PROGRESSÃO**
1. **Lógica Alfa-Numérica**: Cada melhoria acrescenta um número ao final
2. **Progressão de Casa**: Só avança casa após grupo de implementações estáveis
3. **Autorização Obrigatória**: **SEMPRE perguntar antes de mudar versão**
4. **Aprovação DEV**: Mudanças de versão dependem de autorização/sugestão do DEV

---

## ✅ **REGRAS OBRIGATÓRIAS DE DESENVOLVIMENTO**

### 📍 **Versão Base**
- **SEMPRE** trabalhar sobre a última versão salva e commitada
- **VERIFICAR PRIMEIRO**: Versionamento + última data de commit
- **EXCEÇÃO**: Apenas com autorização expressa do DEV

### 🔧 **Desenvolvimento Incremental** 
- Aplicar melhorias **SOMENTE em blocos específicos**
- **NUNCA** sobre o código inteiro
- **EXCEÇÃO**: Rollback solicitado OU autorização expressa do DEV em casos críticos

### 🛡️ **Preservação Obrigatória**
- Manter **44 fontes Freepik** + otimizações existentes
- Preservar funcionalidades estáveis já implementadas
- Não quebrar compatibilidade sem autorização

### 🔐 **Autorização de Rollback**
- **Qualquer rollback** deve ser expressamente autorizado pelo DEV
- Documentar motivo e aprovação do rollback
- Manter backup da versão atual antes do rollback

### 📋 **Documentação Obrigatória**
- **Cada mudança** deve ser documentada
- Incluir versão, data, arquivos modificados
- Seguir nomenclatura padrão de arquivos

---

## 🏷️ **ESQUEMA DE VERSIONAMENTO ZENTRAW**

### 📊 **Formato Oficial**
```
V[MAJOR].[MINOR].[PATCH].[TYPE].[BUILD]
```

**Exemplo**: `V1.3.0.c.9`

### 🔤 **Componentes da Versão**

- **MAJOR** (1): Mudanças significativas de arquitetura
- **MINOR** (3): Novas funcionalidades ou melhorias importantes  
- **PATCH** (0): Correções de bugs e otimizações pontuais
- **TYPE** (c): Tipo de release
  - `d` = Development (Desenvolvimento)
  - `c` = Correction/Candidate (Correção/Candidato)
  - `r` = Release (Produção)
  - `h` = Hotfix (Correção urgente)
- **BUILD** (9): Número incremental da build

---

## 🚨 **REGRA CRÍTICA: VERSÃO ATUAL = V1.3.0.c.9**

### ⚠️ **ESTADO ATUAL DO PROJETO**

**VERSÃO REAL DE DESENVOLVIMENTO**: `V1.3.0.c.9`

**❌ PROIBIDO AVANÇAR VERSÃO ANTES DE:**
- Finalizar implementação completa
- Validar funcionalidade total  
- Confirmar estabilidade
- Documentar mudanças
- Fazer commit oficial

### 📋 **REGRAS DE NOMENCLATURA DE ARQUIVOS**

#### ✅ **FORMATO CORRETO:**
```
ZENTRAW_V1.3.0.c.9_[TIPO]_[DESCRIÇÃO].md
```

#### 🎯 **EXEMPLOS CORRETOS:**
- `ZENTRAW_V1.3.0.c.9_BUG_CANVAS_SIZE_FIX.md`
- `ZENTRAW_V1.3.0.c.9_IMPLEMENTATION_BOUNDING_BOX.md`
- `ZENTRAW_V1.3.0.c.9_TECHNICAL_RESOLUTION_ANALYSIS.md`
- `ZENTRAW_V1.3.0.c.9_CHANGELOG_WORKSPACE_OPTIMIZATION.md`

#### ❌ **EXEMPLOS INCORRETOS:**
- `ZENTRAW_V1.3.0.c.10_*` (versão não alcançada)
- `ZENTRAW_V1.3.0.c.11_*` (versão não alcançada)
- `ZENTRAW_V1.3.0.c.12_*` (versão não alcançada)

---

## 🔄 **PROCESSO DE AVANÇO DE VERSÃO**

### 📋 **Checklist Obrigatório (ANTES de avançar para V1.3.0.c.10)**

#### ✅ **Desenvolvimento**
- [ ] Implementação completa da funcionalidade
- [ ] Código testado e funcional
- [ ] Performance validada
- [ ] Bugs críticos resolvidos

#### ✅ **Documentação**
- [ ] Changelog atualizado
- [ ] Documentação técnica criada
- [ ] Logs de implementação completos
- [ ] Guias de uso atualizados

#### ✅ **Validação**
- [ ] Testes manuais executados
- [ ] Funcionalidade confirmada
- [ ] Integração validada
- [ ] Rollback testado

#### ✅ **Versionamento**
- [ ] Commit realizado
- [ ] Tag criada no Git
- [ ] Branch atualizado
- [ ] Documentação arquivada

### 🎯 **Só ENTÃO avançar para próxima versão**

---

## 📚 **HISTÓRICO DE VERSÕES DOCUMENTADAS**

### ✅ **Versões Estáveis Confirmadas**
- **V1.3.0.c.8**: Fontes Freepik 100% funcionais
- **V1.3.0.c.7**: Sistema de fontes otimizado
- **V1.3.0.c.6**: Correções de carregamento de fontes
- **V1.3.0.c.3**: Ctrl+Z, seleção e zoom estabilizados

### 🔄 **Versão em Desenvolvimento**
- **V1.3.0.c.9**: Workspace optimization + investigação bounding box

### 🎯 **Próximas Versões Planejadas**
- **V1.3.0.c.10**: Correção de bounding box em alta resolução
- **V1.3.0.c.11**: Ajustes finos de resolução
- **V1.3.1.r.1**: Release estável para produção

---

## 🚨 **ARQUIVOS QUE DEVEM SER RENOMEADOS**

### 📝 **Lista de Arquivos Incorretos Encontrados:**

Os seguintes arquivos foram criados com versões futuras e devem usar `V1.3.0.c.9`:

#### ❌ **Versões Incorretas Identificadas:**
1. Arquivos com `V1.3.0.c.10` ou superior
2. Criados durante desenvolvimento da V1.3.0.c.9
3. Que não representam avanço real de versão

#### ✅ **Ação Necessária:**
- Renomear para `V1.3.0.c.9` 
- Manter conteúdo inalterado
- Atualizar referências internas se necessário

---

## 🔗 **REGRAS DE REFERÊNCIA CRUZADA**

### 📋 **Em Documentos**
- Sempre referenciar a versão ATUAL: `V1.3.0.c.9`
- Não antecipar versões futuras
- Usar versões passadas apenas para histórico

### 🗂️ **Em Nomes de Arquivos**
- Formato obrigatório: `ZENTRAW_V1.3.0.c.9_[TIPO]_[DESCRIÇÃO].md`
- Tipos válidos: IMPLEMENTATION, TECHNICAL, BUG, CHANGELOG, ANALYSIS
- Descrição clara e concisa

### 🌿 **Em Branches Git**
- Formato: `feature/description-v1.3.0.c.9`
- Exemplo: `feature/bounding-box-fix-v1.3.0.c.9`

---

## ✅ **VALIDAÇÃO DE CONFORMIDADE**

### 🎯 **Checklist de Validação de Arquivo**
- [ ] Nome segue formato: `ZENTRAW_V1.3.0.c.9_[TIPO]_[DESCRIÇÃO].md`
- [ ] Versão corresponde ao estado atual de desenvolvimento
- [ ] Tipo de documento está correto
- [ ] Conteúdo reflete a versão indicada

### 🚨 **Sinais de Alerta**
- ❌ Arquivos com versão > V1.3.0.c.9
- ❌ Referências a funcionalidades não implementadas
- ❌ Changelogs de versões futuras
- ❌ Documentação de features não testadas

---

## 📖 **DOCUMENTAÇÃO DE REFERÊNCIA**

### 🎯 **Documentos Principais**
- `docs/versioning/VERSION_LOG.md` - Log oficial de versões
- `docs/versioning/ZENTRAW_V1.3.0.c.9_CHANGELOG.md` - Changelog atual
- `docs/critical/ZENTRAW_ORGANIZATIONAL_RULES.md` - Regras organizacionais

### 🔍 **Para Consulta de Histórico**
- `docs/versioning/` - Todos os changelogs por versão
- `docs/implementation/` - Implementações por versão
- `docs/technical/` - Análises técnicas por versão

---

**📋 RESUMO: Sempre usar V1.3.0.c.9 até implementação completa e validada!**

---

*Documento criado em 10/07/2025 para esclarecer regras de versionamento*

---

## 🚨 **REGRAS IMPORTANTES DO CHAT - PROTOCOLO OFICIAL**

### ⚠️ **CRITICAL DEVELOPMENT METHODOLOGY**

#### 📋 **BASE DE TRABALHO OBRIGATÓRIA**
```
"Trabalhar SEMPRE em cima da última versão salva e commitada"
EXCEÇÃO: Rollback total autorizado pelo DEV
```

#### 📋 **MELHORIAS ESPECÍFICAS**
```
"Uma melhoria específica pode ser aplicada na última versão alfa-numérica"
CONSULTA OBRIGATÓRIA: Verificar com MAIN DEV qual melhor opção
```

#### 📋 **AUTORIZAÇÃO DE VERSIONAMENTO**
```
"SEMPRE perguntar antes de mudar versão"
"Mudanças de versão dependem de autorização/sugestão do DEV"
```

#### 📋 **PROGRESSÃO ALFA-NUMÉRICA**
```
V1.3.0.c.8 → V1.3.0.c.9 → V1.3.0.c.10 → V1.3.0.e.x → V1.5.x.x.x → V2.x.x.x.x
```

#### 📋 **PRESERVAÇÃO FUNCIONAL**
```
"Manter 44 fontes Freepik + otimizações existentes"
"Não quebrar compatibilidade sem autorização"
```

---

## 🔄 **PROTOCOLO DE IMPLEMENTAÇÃO DETALHADO**

### 📍 **FASE 1: PREPARAÇÃO**
1. **VERIFICAR**: Última versão commitada no repositório
2. **IDENTIFICAR**: Bloco específico que precisa de melhoria
3. **CONSULTAR**: DEV sobre melhor abordagem (quando necessário)
4. **PLANEJAR**: Escopo limitado e controlado da implementação

### 📍 **FASE 2: IMPLEMENTAÇÃO**
1. **BACKUP**: Criar cópia de segurança da versão atual
2. **IMPLEMENTAR**: Mudanças pontuais e específicas
3. **PRESERVAR**: 44 fontes Freepik e funcionalidades estáveis
4. **TESTAR**: Funcionalidade modificada + compatibilidade geral

### 📍 **FASE 3: VALIDAÇÃO**
1. **DOCUMENTAR**: Mudanças realizadas com detalhes
2. **VERSIONAR**: Apenas com autorização expressa do DEV
3. **COMMIT**: Salvar versão estável no repositório
4. **COMUNICAR**: Informar status e próximos passos

---

## ❌ **PROIBIÇÕES ABSOLUTAS**

### 🚫 **NEVER DO - PROIBIDO FAZER**
- **Avançar versão** sem autorização expressa
- **Modificar código inteiro** sem rollback autorizado
- **Quebrar 44 fontes Freepik** sem exceção crítica
- **Rollback** sem autorização do DEV
- **Pular etapas** do protocolo de implementação

### ⚠️ **EXCEPTIONS - EXCEÇÕES PERMITIDAS**
- **Rollback total**: Apenas com autorização expressa do DEV
- **Modificação ampla**: Apenas em casos críticos autorizados
- **Mudança de versão**: Apenas com autorização/sugestão do DEV

---
