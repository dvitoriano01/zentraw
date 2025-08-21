# 🚨 ZENTRAW - REGRAS CRÍTICAS DE DESENVOLVIMENTO

**Data**: 10/07/2025 | **Status**: OBRIGATÓRIO - CUMPRIMENTO INTEGRAL

---

## ⚠️ **CRITICAL ALERT - ESTAS REGRAS SÃO INVIOLÁVEIS**

### 📋 **METODOLOGIA CLARA DE VERSIONAMENTO**

#### 🎯 **PROGRESSÃO ALFA-NUMÉRICA OFICIAL**

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

#### 🔤 **LÓGICA DE PROGRESSÃO**

- **Alfa-Numérica**: Cada melhoria acrescenta um número ao final
- **Progressão de Casa**: Só avança casa após grupo de implementações estáveis
- **Autorização**: **SEMPRE perguntar antes de mudar versão**
- **Aprovação DEV**: Mudanças dependem de autorização/sugestão do DEV

---

## ✅ **REGRAS OBRIGATÓRIAS DE DESENVOLVIMENTO**

### 📍 **1. VERSÃO BASE**

**REGRA**: Sempre trabalhar sobre a última versão salva e commitada

**PROCEDIMENTO**:

- ✅ Verificar PRIMEIRO: Versionamento + última data de commit
- ✅ Procurar e trabalhar sempre em cima da última versão commitada
- ❌ **EXCEÇÃO**: Apenas com autorização expressa do DEV

### 🔧 **2. DESENVOLVIMENTO INCREMENTAL**

**REGRA**: Aplicar melhorias SOMENTE em blocos específicos

**PROCEDIMENTO**:

- ✅ Identificar bloco específico a melhorar
- ✅ Fazer mudanças pontuais e controladas
- ❌ **NUNCA** sobre o código inteiro
- ❌ **EXCEÇÃO**: Rollback solicitado OU autorização expressa do DEV

### 🛡️ **3. PRESERVAÇÃO OBRIGATÓRIA**

**REGRA**: Manter 44 fontes Freepik + otimizações existentes

**PROCEDIMENTO**:

- ✅ Verificar que 44 fontes permanecem funcionais
- ✅ Preservar todas as otimizações já implementadas
- ✅ Não quebrar compatibilidade sem autorização
- ✅ Testar sistema de fontes após qualquer mudança

### 🔐 **4. AUTORIZAÇÃO DE ROLLBACK**

**REGRA**: Qualquer rollback deve ser expressamente autorizado

**PROCEDIMENTO**:

- ✅ Solicitar autorização expressa do DEV
- ✅ Documentar motivo e aprovação do rollback
- ✅ Fazer backup da versão atual antes do rollback
- ✅ Confirmar que rollback é a única opção

### 📋 **5. DOCUMENTAÇÃO OBRIGATÓRIA**

**REGRA**: Cada mudança deve ser documentada

**PROCEDIMENTO**:

- ✅ Criar documento com versão, data, arquivos modificados
- ✅ Seguir nomenclatura padrão: `ZENTRAW_V[versão]_[TIPO]_[DESCRIÇÃO].md`
- ✅ Incluir motivo da mudança e validação realizada
- ✅ Salvar na pasta docs/ adequada

---

## 🔄 **REGRAS ESPECÍFICAS DE TRABALHO COM VERSÕES**

### 📍 **BASE DE TRABALHO**

1. **Trabalhar SEMPRE** em cima da última versão salva e commitada
2. **EXCEÇÃO única**: Rollback total autorizado pelo DEV
3. **Verificação obrigatória**: Versionamento + data antes de iniciar

### 🔧 **RECUPERAÇÃO DE MELHORIAS ESPECÍFICAS**

1. **Uma melhoria específica**: Aplicar na última versão alfa-numérica
2. **Consulta obrigatória**: Verificar com MAIN DEV qual melhor opção
3. **Documentar origem**: Indicar de qual versão foi recuperada

### 📝 **MELHORIAS EM VERSÕES ANTIGAS**

1. **Necessidade de refatorar bloco específico**: Salvar com progressão numérica após a letra
2. **Formato**: V1.3.0.c.8.1, V1.3.0.c.8.2 (melhorias pontuais na c.8)
3. **Documentação obrigatória**: Motivo da melhoria retroativa

---

## 🚨 **REGRAS CRÍTICAS DO CHAT - PROTOCOLO CONSOLIDADO**

### ⚠️ **METODOLOGIA DEFINIDA - CUMPRIMENTO OBRIGATÓRIO**

#### 📋 **REGRA FUNDAMENTAL: BASE DE TRABALHO**

```
"Trabalhar SEMPRE em cima da última versão salva e commitada"
```

**EXCEÇÃO ÚNICA**: Rollback total autorizado pelo DEV

**PROCEDIMENTO OBRIGATÓRIO**:

1. Verificar última versão no repositório
2. Confirmar último commit realizado
3. Trabalhar sobre essa base EXCLUSIVAMENTE
4. Solicitar autorização para qualquer exceção

#### 📋 **REGRA DE MELHORIAS ESPECÍFICAS**

```
"Uma melhoria específica pode ser aplicada na última versão alfa-numérica"
```

**CONSULTA OBRIGATÓRIA**: Verificar com MAIN DEV qual melhor opção

**PROCEDIMENTO DETALHADO**:

1. Identificar melhoria específica necessária
2. Localizar bloco de código específico
3. Consultar DEV sobre abordagem
4. Aplicar na versão alfa-numérica atual
5. Documentar origem da melhoria

#### 📋 **REGRA DE AUTORIZAÇÃO DE VERSIONAMENTO**

```
"SEMPRE perguntar antes de mudar versão"
"Mudanças de versão dependem de autorização/sugestão do DEV"
```

**PROTOCOLO DE AUTORIZAÇÃO**:

1. **NUNCA** avançar versão automaticamente
2. **SEMPRE** solicitar autorização expressa
3. **AGUARDAR** confirmação antes de implementar
4. **DOCUMENTAR** autorização recebida

#### 📋 **REGRA DE PROGRESSÃO ALFA-NUMÉRICA**

```
V1.3.0.c.8 → V1.3.0.c.9 → V1.3.0.c.10 → V1.3.0.e.x → V1.5.x.x.x → V2.x.x.x.x
```

**LÓGICA DE PROGRESSÃO**:

- **Numérica**: c.8 → c.9 → c.10 (melhorias incrementais)
- **Alfabética**: c.x → d.x → e.x (grupos de funcionalidades)
- **Casa decimal**: 1.3.x → 1.4.x → 1.5.x (features maiores)
- **Versão major**: V1.x → V2.x (mudanças arquiteturais)

#### 📋 **REGRA DE PRESERVAÇÃO FUNCIONAL**

```
"Manter 44 fontes Freepik + otimizações existentes"
"Não quebrar compatibilidade sem autorização"
```

**CHECKLIST DE PRESERVAÇÃO**:

- [ ] 44 fontes Freepik funcionando
- [ ] Otimizações existentes preservadas
- [ ] Compatibilidade mantida
- [ ] Funcionalidades estáveis intactas

---

## 🔄 **PROTOCOLO COMPLETO DE DESENVOLVIMENTO**

### 📍 **ETAPA 1: PREPARAÇÃO E VERIFICAÇÃO**

1. **Identificar versão atual**: Verificar repositório e logs
2. **Confirmar última versão commitada**: V1.3.0.c.9
3. **Verificar integridade**: 44 fontes + funcionalidades
4. **Planejar escopo**: Definir bloco específico a modificar

### 📍 **ETAPA 2: CONSULTA E AUTORIZAÇÃO**

1. **Consultar DEV**: Sobre abordagem e necessidade
2. **Solicitar autorização**: Para mudanças de versão
3. **Aguardar confirmação**: Antes de proceder
4. **Documentar aprovação**: Guardar autorização recebida

### 📍 **ETAPA 3: IMPLEMENTAÇÃO CONTROLADA**

1. **Criar backup**: Da versão atual antes de modificar
2. **Aplicar mudanças**: Apenas no bloco específico
3. **Preservar funcionalidades**: 44 fontes + otimizações
4. **Testar incrementalmente**: Cada modificação

### 📍 **ETAPA 4: VALIDAÇÃO E DOCUMENTAÇÃO**

1. **Validar funcionalidade**: Testar modificações
2. **Verificar compatibilidade**: Com sistema existente
3. **Documentar mudanças**: Com detalhes e versões
4. **Preparar commit**: Apenas após validação completa

### 📍 **ETAPA 5: VERSIONAMENTO E FINALIZAÇÃO**

1. **Confirmar autorização**: Para mudança de versão
2. **Atualizar versão**: Apenas se autorizado
3. **Fazer commit**: Com informações completas
4. **Comunicar status**: Informar DEV sobre conclusão

---

## ❌ **VIOLAÇÕES CRÍTICAS - NEVER DO**

### 🚫 **PROIBIÇÕES ABSOLUTAS**

- **Trabalhar sobre versão não-commitada** sem autorização
- **Avançar versão automaticamente** sem consulta
- **Modificar código inteiro** sem rollback autorizado
- **Quebrar sistema de fontes** (44 fontes Freepik)
- **Ignorar protocolo de autorização**

### ⚠️ **EXCEÇÕES CRÍTICAS PERMITIDAS**

- **Rollback total**: Com autorização expressa do DEV
- **Modificação ampla**: Em casos críticos autorizados
- **Trabalho sobre versão anterior**: Apenas para rollback autorizado

---

**📋 COMPLIANCE: Estas regras devem ser seguidas à risca. Não cumprimento resulta em rollback imediato.**

---

_Documento criado em 10/07/2025 baseado em regras encontradas no chat_
