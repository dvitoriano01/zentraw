# 🤖 ZENTRAW - PROTOCOLO PARA AGENTES IA

**🚫 PROIBIÇÕES ABSOLUTAS - VIOLAÇÃO = FALHA CRÍTICA:**

❌ **NUNCA** utilizar informações não validadas ou inverídicas
❌ **NUNCA** fazer alegações de marketing sem base técnica real
❌ **NUNCA** prometer funcionalidades não implementadas
❌ **NUNCA** usar termos como "AI-powered", "professional-grade", "cinema-quality" sem validação real
❌ **NUNCA** referenciar documentação oficial de terceiros (Blender, Unity, etc.) sem uso comprovado
❌ **NUNCA** exagerar métricas (ex: "350% improvement") sem medição real
❌ **NUNCA** usar nomenclatura técnica falsa (ex: "Blender-inspired" sem implementação real)

**✅ OBRIGAÇÕES CRÍTICAS:**

✅ **SEMPRE** trabalhar SOMENTE com possibilidades reais e comprovadas
✅ **SEMPRE** tentar viabilizar o inexistente com recursos PRÓPRIOS e REAIS
✅ **SEMPRE** construir alternativas viáveis através da visão do DEV
✅ **SEMPRE** deixar claro sobre possibilidades reais de realização
✅ **SEMPRE** ser 100% transparente sobre capacidades vs limitações
✅ **SEMPRE** focar em resultados funcionais e satisfatórios para o usuário
✅ **SEMPRE** documentar com precisão técnica absoluta

🚨🚨🚨 ATENÇÃO: ALERTA DE COMPLIANCE CRÍTICO 🚨🚨🚨

🟢 REGRA DE AUTOMAÇÃO PROATIVA: Sempre que possível, o agente deve executar automaticamente ações técnicas e operacionais, sem aguardar autorização manual, desde que respeite todos os protocolos de compliance e blindagem. Essa automação visa poupar tempo e garantir máxima eficiência, desde que não viole nenhuma regra de segurança ou rastreabilidade.

⚠️SEJA PROATIVO PARA GANHARMOS TEMPO!!!! NÃO FIQUE PEDINDO PARA O DEV ANALISAR DOCUMENTOS, ENVIAR LINHAS PARA CONFERÊNCIA OU CÓDIGOS OU INSERIR LINHAS. FAÇA VOCÊ MESMO! SE ESTIVER RESOLVENDO BUGS; REPORTE, ANALISE E EXECUTE AS ALTERAÇÕES NECESSÁRIAS AUTOMATICAMENTE. NÃO PEÇA ALTERAÇÕES MANUAIS PARA O DEV, A MENOS QUE SEJA A ÚNICA SAÍDAs⚠️

É ESTRITAMENTE PROIBIDO, sob qualquer circunstância, utilizar, sugerir, executar ou referenciar tasks, scripts, comandos, exemplos ou fluxos do TemplateLibraryBuilder para o módulo `Zentraw/3d_visualizer`.

🔴 TODA E QUALQUER AÇÃO, TESTE, EXEMPLO OU INSTRUÇÃO DEVE SER EXCLUSIVA DO DIRETÓRIO `Zentraw/3d_visualizer`.

🔴 VIOLAÇÕES DEVEM SER DOCUMENTADAS IMEDIATAMENTE NO LOG DE DECISÕES E REPORTADAS AO DEV RESPONSÁVEL.

🔴 O AGENTE QUEBROU O PROTOCOLO AO SUGERIR TASKS/SCRIPTS DE OUTRO MÓDULO: ESTE INCIDENTE FOI REGISTRADO E SERVE COMO EXEMPLO DE ERRO CRÍTICO QUE NÃO PODE SE REPETIR.

🔒 O cumprimento deste alerta é OBRIGATÓRIO e INVIOLÁVEL. Qualquer dúvida, SEMPRE priorize a auditoria do diretório oficial do módulo antes de agir.

⚠️ AVISO IMPORTANTE SOBRE ESCOPO DESTE DOCUMENTO ⚠️

Este protocolo, exemplos de porta (3004, 3005, 3006), comandos, scripts e todas as instruções aqui presentes se aplicam EXCLUSIVAMENTE ao módulo oficial `C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer`.

O sistema TemplateLibraryBuilder é independente, possui documentação e tasks próprias, e NÃO deve ser usado como referência para o 3d_visualizer.

Qualquer menção a TemplateLibraryBuilder, portas antigas (5001) ou caminhos legados neste contexto deve ser ignorada e reportada para correção imediata.

NÃO USAR A TASK Restart Backend V1.4.0.a.2

🚀🚀🚀 ENVIRONMENT MIGRATION COMPLETO: WSL UBUNTU 22.04 🚀🚀🚀

**OBRIGATÓRIO:** TODO desenvolvimento Zentraw agora opera EXCLUSIVAMENTE no ambiente WSL Ubuntu 22.04.4 LTS. 

✅ **WSL ENVIRONMENT REQUIREMENTS:**
- Sistema: WSL Ubuntu 22.04.4 LTS  
- Node.js: v18.20.8 (via NVM)
- NPM: v10.8.2+
- Git: Configurado com credenciais do usuário
- Diretório base: `~/zentraw/` (WSL filesystem)

✅ **ROTINA OPERACIONAL OBRIGATÓRIA:**
```bash
# 1. Acesso WSL
wsl -d Ubuntu-22.04

# 2. Ambiente Node.js
source ~/.bashrc && nvm use 18

# 3. Projeto Zentraw
cd ~/zentraw

# 4. Admin Panel (OBRIGATÓRIO - Controle Central)
cd ~/zentraw/Admin_Panel && npm start
```

✅ **ADMIN PANEL COMO CENTRO DE CONTROLE:**
- URL: http://localhost:3003 (porta 3003 - OBRIGATÓRIA)
- Todas as configurações globais passam pelo Admin Panel
- APIs externas gerenciadas centralmente
- Detecção automática de conflitos
- Monitoramento de todos os módulos em tempo real

✅ **SCRIPTS DE CONTROLE WSL:**
- `~/zentraw/zentraw-wsl-control.sh` - Controle de módulos
- `~/zentraw/zentraw-wsl-migration-consolidated.sh` - Rotina completa

🚫 **PROIBIDO:** Usar comandos Windows, PowerShell ou ambiente Windows para desenvolvimento Zentraw. Toda operação deve ser WSL-native.

Portas oficiais do backend 3d_visualizer: **3004, 3005, 3006** (NUNCA usar outras portas neste módulo).

---

**Versão:** MASTER v1.1  
**Data:** 18 de Agosto de 2025  
**Última Atualização:** 18/08/2025 - Admin Panel V1.0.0 + PowerShell Integration  
**Autoridade:** ZENTRAW-MASTER-RULES.md  
**Aplicação:** OBRIGATÓRIA para TODOS os agentes IA

---

## 🎯 **ZENTRAW MISSION STATEMENT**

O ZENTRAW pretende trazer **ECOSSISTEMA MODULAR INTEGRADO** para criadores de conteúdo musical, reunindo tecnologias de template generation + análise de áudio + visualização 3D + gerenciamento de APIs que **NÃO SÃO UTILIZADAS JUNTAS** em uma solução integrada e estável. Exemplo: template automation + análise musical + renderização Blender + API management centralizado + pipeline completamente integrado.

**🔍 ZENTRAW DIFERENCIAL REAL:**
Primeira solução que combina: **Admin Panel Centralizado + Template Library Builder + 3D Visualizer + API Manager + PowerShell Automation + Zero Configuração Manual** em uma solução modular para criação musical profissional.

**🎯 ZENTRAW MODULES OVERVIEW:**
- **Admin Panel V1.0.0:** Central de controle e API management (porta 3003)
- **Template Library Builder V1.4.0.a.2+:** Sistema de templates (porta 3004) 
- **3D Visualizer V1.4.0.a.8:** Renderização audiovisual (porta 3005)
- **PowerShell Management V2.1:** Automação e controle de processos
- **Music Intelligence:** Em desenvolvimento (porta 3006)

---

## 🛡️ **POWERSH ELL MANAGEMENT INTEGRATION**

**REGRA CRÍTICA:** Todos os agentes devem conhecer e utilizar o sistema PowerShell Management V2.1 para controle de processos e debugging.

### ✅ SCRIPTS PRINCIPAIS DISPONÍVEIS:

- **zentraw_master_control_v2_fixed.ps1:** Script principal de controle
- **port-3003-detective.ps1:** Diagnóstico específico do Admin Panel
- **ps-master.bat:** Interface interativa para usuário
- **ps-restart.bat:** Restart automático do Admin Panel
- **ps-nuclear.bat:** Reset completo de processos Node.js

### 🔐 UTILIZAÇÃO OBRIGATÓRIA:

```powershell
# Para restart do Admin Panel:
ps-restart.bat

# Para diagnóstico completo:
ps-master.bat # opção 1 (Status)

# Para problemas críticos:
ps-nuclear.bat # com confirmação
```

### 🛑 DEBUGS E TROUBLESHOOTING:

- **SEMPRE** usar PowerShell scripts antes de debugging manual
- **SEMPRE** verificar portas ocupadas via port-detective antes de iniciar serviços
- **SEMPRE** usar restart automático em vez de kill manual + start manual

---

## 🔒 **ADMIN PANEL INTEGRATION - PROTECTION PROTOCOL**

**REGRA CRÍTICA:** O Admin Panel V1.0.0 (porta 3003) é o centro de controle do ecossistema Zentraw.

### ✅ OPERAÇÕES QUE EXIGEM ADMIN PANEL:

- Monitoramento de status dos módulos
- Configuração e teste de APIs externas
- Logs centralizados do sistema
- Health checks automáticos

### 🔐 IMPLEMENTAÇÃO OBRIGATÓRIA:

```javascript
// Endpoints críticos disponíveis:
// GET  /health                     - Health check geral
// GET  /api/status                 - Status dos módulos
// GET  /api/external-apis/status   - Status das APIs externas
// GET  /api/external-apis/test/:api - Teste de APIs específicas
// POST /api/external-apis/config   - Configuração de APIs
```

### 🛑 PROTEÇÃO DO ADMIN PANEL:

- **SEMPRE** verificar se porta 3003 está livre antes de iniciar
- **SEMPRE** usar PowerShell scripts para restart
- **NUNCA** modificar estrutura core sem backup
- **SEMPRE** testar health check após mudanças

---

## 🛡️ **MÓDULOS BLINDADOS - PROTEÇÃO CONTRA QUEBRAS**

**PROBLEMA:** Módulos funcionais podem quebrar com edições/melhoramentos futuros.

### 🔒 ESTRATÉGIAS DE BLINDAGEM ZENTRAW:

#### 1. **VERSIONAMENTO GRANULAR POR MÓDULO**

```
Admin_Panel/
├── V1.0.0/           ← BLINDADO (funcionando)
├── V1.1.0-dev/       ← Desenvolvimento
└── config/           ← Compartilhado

Template Library Builder/
├── V1.4.0.a.2+/      ← BLINDADO (funcionando)
├── V1.4.0.a.3-dev/   ← Desenvolvimento
└── shared/           ← Componentes reutilizáveis
```

#### 2. **POWERSH ELL SAFETY LATCH**

```powershell
# Safety Latch obrigatório para operações críticas
function Confirm-CriticalOperation {
    if (!$Force) {
        $confirm = Read-Host "CONFIRMA OPERAÇÃO CRÍTICA? (SIM/não)"
        if ($confirm -ne 'SIM') { return $false }
    }
    return $true
}
```

#### 3. **HEALTH CHECK INTEGRATION**

```javascript
// Verificação de integridade na inicialização
const MODULE_INTEGRITY = {
  "admin-panel": { port: 3003, endpoint: "/health" },
  "template-builder": { port: 3004, endpoint: "/health" },
  "3d-visualizer": { port: 3005, endpoint: "/health" }
};
```

#### 4. **BACKUP AUTOMÁTICO VIA POWERSHELL**

```powershell
# Backup antes de qualquer operação crítica
function Backup-ZentrawModule {
    param([string]$ModuleName)
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "backups/${ModuleName}_${timestamp}"
    # Backup implementation
}
```

---

## ⚡ CONTEXTO INICIAL DO AGENTE (OBRIGATÓRIO)

Antes de qualquer ação, o agente IA deve:

1. **Registrar Diretório Oficial do Módulo**

   - Exemplo: `C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer`
   - Nunca utilizar ou referenciar diretórios antigos, como TemplateLibraryBuilder.

2. **Validar e Documentar Versão e Status**

   - Confirmar versão ativa do módulo e status funcional real.
   - Registrar se o sistema está online/offline, porta utilizada, e status do backend.

3. **Registrar Objetivo do Usuário e Limitações**

   - Anotar o objetivo declarado pelo usuário para a sessão.
   - Listar restrições explícitas (ex: “NÃO usar TemplateLibraryBuilder”, “NÃO modificar arquivos blindados”).

4. **Coletar e Validar Contexto Técnico**

   - Ler e validar todos os arquivos obrigatórios: ZENTRAW-MASTER-RULES.md, MODULE-ARCHITECTURE-STANDARD.md, MODULE-STATUS-TRACKER.md, README.md do módulo.
   - Garantir que não há referências a sistemas, arquivos ou diretórios antigos na documentação ou no escopo da sessão.

5. **Registrar Estado Inicial**

   - Documentar o “estado do sistema” no início da sessão: arquivos presentes, serviços ativos, variáveis de ambiente relevantes.

6. **Prompt Dinâmico**
   - Sempre iniciar a sessão com um prompt contextualizado, incluindo diretório oficial, objetivo do usuário, restrições e status do sistema.

> **Atenção:**

1-Qualquer referência a TemplateLibraryBuilder, arquivos ou caminhos antigos deve ser ignorada e, se encontrada, reportada para correção imediata.

2- O DEV é iniciante e não entende muito de códigos, seja PROATIVO e sempre que for necessário executar ações, especifique o diretório e o script ou comando para ele executar. Como agente, você tem autorização para executar os testes, bem como utilizar as ferramentas necessárias para a edição e refatoração de códigos para a solução do problema, DESDE QUE SIGA TODOS OS PROTOCOLOS DE SEGURAÇA E BLINDE AS VERSÕES ANTERIORES, para não perdemos o que já foi conquistado e está funcional. Execute as ações necessárias. Em casos críticos, questione o caminho a seguir.

---

## 🚨 **PROTOCOLO OBRIGATÓRIO - NUNCA IGNORAR**

### **⚡ ANTES DE QUALQUER AÇÃO (SEQUÊNCIA RÍGIDA):**

#### **ETAPA 1: HIERARQUIA DOCUMENTAL (OBRIGATÓRIO)**

```
1.1 📚 LER ZENTRAW-MASTER-RULES.md
    ├── Confirmar prioridades hierárquicas
    ├── Entender regras universais
    └── Identificar padrões obrigatórios

1.2 🏗️ LER MODULE-ARCHITECTURE-STANDARD.md
    ├── Verificar estrutura padrão
    ├── Identificar templates obrigatórios
    └── Confirmar nomenclatura

1.3 📋 CONSULTAR MODULE-STATUS-TRACKER.md
    ├── Identificar versão ativa do módulo
    ├── Verificar status atual
    └── Confirmar arquivos principais

1.4 🎯 LER README.md do módulo específico
    ├── Entender status atual
    ├── Identificar arquivos ativos
    └── Verificar funcionalidades validadas
```

#### **ETAPA 2: VALIDAÇÃO FÍSICA (CRÍTICO)**

```
2.1 ✅ CONFIRMAR EXISTÊNCIA FÍSICA
    ├── Todos os arquivos listados existem?
    ├── Caminhos correspondem à documentação?
    ├── Versões coincidem com documentado?
    └── Diretórios estão corretos?

2.2 🧪 TESTAR SISTEMA ATUAL
    ├── Executar sem modificações
    ├── Confirmar funcionamento básico
    ├── Identificar versão real executando
    └── Validar outputs esperados

2.3 📊 IDENTIFICAR DISCREPÂNCIAS
    ├── Documentação vs realidade
    ├── Versões conflitantes
    ├── Arquivos ausentes/extras
    └── Funcionalidades quebradas
```

#### **ETAPA 3: CONTEXTO TÉCNICO (OBRIGATÓRIO)**

```
3.1 📋 CONSULTAR CHANGELOG.md
    ├── Entender evolução do módulo
    ├── Identificar última versão estável
    ├── Verificar correções aplicadas
    └── Entender decisões anteriores

3.2 🚨 CONSULTAR TROUBLESHOOTING.md
    ├── Verificar problemas já resolvidos
    ├── Evitar repetir erros conhecidos
    ├── Aplicar soluções documentadas
    └── Identificar padrões de erro

3.3 🏗️ CONSULTAR ARCHITECTURE.md (se existir)
    ├── Entender estrutura técnica
    ├── Identificar dependências
    ├── Compreender fluxo de dados
    └── Mapear componentes críticos
```

---

## ⚡ **DURANTE EXECUÇÃO (PROTOCOLO RÍGIDO)**

### **PRINCÍPIOS OBRIGATÓRIOS:**

```
🛡️ BLINDAGEM TOTAL: NUNCA PERDER FUNCIONALIDADE EXISTENTE
🔧 CORREÇÃO PRIORITÁRIA: VERIFICAR POSSIBILIDADE DE CORREÇÃO TÉCNICA ANTES DE ROLLBACK
🚫 ARQUIVOS DE REFERÊNCIA: NUNCA incorporar - SOMENTE estudar e reescrever (em blocos identificados para que, se necessário, sejam deletados)
🚫 PASTAS ARQUIVADAS: NUNCA recuperar de /archive/ ou "NÃO USAR" - JAMAIS! (exceto com autorização expressa do DEV)
✅ UMA MUDANÇA POR VEZ
✅ TESTAR IMEDIATAMENTE após cada mudança
✅ DOCUMENTAR decisão em TEMPO REAL
✅ PRESERVAR funcionalidade existente
✅ APLICAR mudança MÍNIMA necessária
✅ VALIDAR antes de continuar
🚨 ROLLBACK IMEDIATO se funcionalidade quebrar E correção não for possível - MAS SOMENTE SE ESGOTADAS AS POSSIBILIDADES DE CORREÇÃO E COM AUTORIZAÇÃO EXPRESSA DO DEV!!
```

### **FLUXO DE EXECUÇÃO:**

```
PASSO 1: 📝 PLANEJAR
├── Definir objetivo específico
├── Identificar arquivos a modificar
├── Prever impactos na arquitetura
└── Preparar estratégia de rollback

PASSO 2: ⚡ EXECUTAR
├── Aplicar UMA mudança específica
├── Preservar backup automático
├── Manter logs detalhados
└── Monitorar sistema em tempo real

PASSO 3: 🧪 VALIDAR
├── Testar funcionalidade modificada
├── Verificar sistema completo
├── Confirmar outputs esperados
└── Validar integridade arquitetural

PASSO 4: 📊 DOCUMENTAR
├── Atualizar README.md se necessário
├── Registrar no CHANGELOG.md
├── Adicionar ao TROUBLESHOOTING.md
└── Atualizar MODULE-STATUS-TRACKER.md
```

---

## 📝 **APÓS EXECUÇÃO (OBRIGATÓRIO)**

### **ATUALIZAÇÃO DOCUMENTAL (SEQUÊNCIA RÍGIDA):**

```
ETAPA 1: DOCUMENTAÇÃO MODULAR
├── 1.1 ATUALIZAR README.md do módulo
│   ├── Status atual
│   ├── Arquivos ativos
│   ├── Funcionalidades validadas
│   └── Problemas conhecidos
├── 1.2 REGISTRAR no CHANGELOG.md
│   ├── Versão atualizada
│   ├── Mudanças aplicadas
│   ├── Arquivos modificados
│   └── Impactos funcionais
├── 1.3 ATUALIZAR TROUBLESHOOTING.md
│   ├── Adicionar solução (se erro resolvido)
│   ├── Documentar problema (se encontrado)
│   ├── Atualizar status de problemas
│   └── Registrar padrões identificados
└── 1.4 CRIAR/ATUALIZAR ARCHITECTURE.md
    ├── Mudanças estruturais
    ├── Novas dependências
    ├── Fluxos alterados
    └── Componentes adicionados/removidos
```

### **ATUALIZAÇÃO MASTER (OBRIGATÓRIO):**

```
ETAPA 2: DOCUMENTAÇÃO CENTRAL
├── 2.1 ATUALIZAR MODULE-STATUS-TRACKER.md
│   ├── Nova versão do módulo
│   ├── Status funcional atualizado
│   ├── Arquivos principais
│   └── Última modificação
├── 2.2 REGISTRAR em ZENTRAW-AGENT-DECISIONS-LOG.md
│   ├── Decisão tomada
│   ├── Contexto da ação
│   ├── Resultado obtido
│   └── Lições aprendidas
└── 2.3 EXECUTAR VALIDATION-CHECKLIST.md
    ├── Consistência documental
    ├── Integridade arquitetural
    ├── Funcionalidade completa
    └── Compliance com padrões
```

---

### **🔍 PROTOCOLOS ESPECÍFICOS POR SITUAÇÃO**

### **🆕 NOVO MÓDULO:**

```
1. 📁 APLICAR MODULE-ARCHITECTURE-STANDARD.md
2. 📝 PREENCHER templates obrigatórios
3. 🔧 IMPLEMENTAR funcionalidade mínima
4. 🧪 CRIAR testes básicos
5. ✅ VALIDAR compliance completo
6. 📊 REGISTRAR no MODULE-STATUS-TRACKER.md
```

### **🔧 MODIFICAÇÃO EXISTENTE:**

```
1. 🎯 CONFIRMAR estado atual via README.md
2. 🧪 TESTAR sistema antes de modificar
3. ⚡ APLICAR mudança mínima
4. 🧪 VALIDAR imediatamente
5. 📝 DOCUMENTAR em tempo real
6. 📊 ATUALIZAR status tracker
7. 📝 CHAT EM PORTUGUÊS
8. ⚡ CÓDIGOS E TERMOS UNIVERSAIS EM INGLÊS
```

### **🚨 SISTEMA QUEBRADO:**

```
1. 🛑 PARAR modificações imediatamente
2. 📋 CONSULTAR TROUBLESHOOTING.md
3. � VERIFICAR A POSSIBILIDADE DE CORREÇÃO, SEM QUEBRAR O CÓDIGO OU A BLINDAGEM, ANTES DE SUGERIR ROLLBACK TOTAL
4. 🔧 APLICAR correção técnica mínima SE possível OU
5. �🔄 APLICAR solução conhecida OU
6. 📞 REVERTER para última versão estável APENAS como último recurso
7. 🔍 IDENTIFICAR causa raiz
8. 📝 DOCUMENTAR problema e solução
```

### **❓ SISTEMA DESCONHECIDO:**

```
1. 🔍 NUNCA assumir - sempre investigar
2. 📊 EXECUTAR auditoria completa
3. 📝 DOCUMENTAR estado encontrado
4. 🎯 CRIAR README.md baseado na realidade
5. 📋 ATUALIZAR MODULE-STATUS-TRACKER.md
6. ⚡ APLICAR padronização gradual

---

### **🔎 DIRETRIZES DE PESQUISA EXTERNA E CONSULTA DE FONTES**

Sempre que houver necessidade de solucionar problemas, implementar integrações, validar comportamentos ou buscar conhecimento técnico sobre softwares, APIs, frameworks ou bibliotecas externas (exemplo: Blender 4.5), o agente IA deve seguir as diretrizes abaixo:

1. **Priorizar Fontes Oficiais e Documentação Primária**
   - Buscar sempre primeiro na documentação oficial do software (ex: https://docs.blender.org para Blender, https://docs.python.org para Python, etc).
   - Consultar changelogs, guias de migração, referências de API, manuais de uso e FAQs diretamente do site oficial.
   - Validar se a documentação corresponde exatamente à versão utilizada no projeto (ex: Blender 4.5, não 4.0 ou 3.x).

2. **Utilizar Repositórios Oficiais e Comunidades Reconhecidas**
   - Buscar exemplos, issues e discussões em repositórios oficiais (ex: GitHub do Blender, Add-ons, etc).
   - Utilizar fóruns oficiais, Stack Overflow, Blender Artists, DevTalk, Reddit técnico, entre outros reconhecidos pela comunidade.
   - Priorizar respostas e soluções com alta reputação, aceitação e atualização recente.

3. **Validação de Soluções de Terceiros**
   - Conferir se a solução de terceiros é amplamente aceita, tem boa reputação e está atualizada para a versão em uso.
   - Evitar blogs, vídeos ou tutoriais sem referência técnica clara, sem código-fonte ou sem validação por outros desenvolvedores.
   - Sempre comparar a solução de terceiros com a documentação oficial antes de aplicar.

4. **Registro e Citação de Fontes**
   - Toda fonte externa consultada deve ser registrada na documentação do projeto (link, data, trecho relevante ou print/screenshot se aplicável).
   - Ao implementar uma solução baseada em fonte externa, citar explicitamente a origem no comentário do código ou no log de decisões.

5. **Pesquisa Automatizada pelo Agente**
   - O agente deve, ao identificar dúvida técnica, buscar automaticamente:
     - Documentação oficial da versão exata (ex: “Blender 4.5 Python API” ou “Blender 4.5 command line arguments”).
     - Exemplos de código e integração em fontes oficiais e fóruns reconhecidos.
     - Relatos de bugs, limitações e soluções em issues oficiais e discussões técnicas.
   - Registrar no log de decisões todas as fontes externas consultadas, mesmo que não utilizadas diretamente.

6. **Prompt de Pesquisa e Solicitação do Usuário**
   - O usuário pode solicitar explicitamente pesquisas, por exemplo:
     - “Pesquisar documentação oficial do Blender sobre [tema]”
     - “Buscar exemplos de integração Blender + Node.js”
     - “Verificar problemas conhecidos do render engine Eevee Next”
   - O agente deve interpretar essas solicitações como prioridade máxima e apresentar as fontes consultadas e um resumo dos achados.

7. **Validação e Aplicação Segura**
   - Antes de aplicar qualquer solução externa, validar se ela é compatível com o contexto do projeto, não viola blindagens e não introduz dependências não autorizadas.
   - Testar a solução em ambiente controlado antes de promover para produção.

> **Importante:** Toda consulta, pesquisa ou implementação baseada em fonte externa deve ser documentada, rastreável e validada quanto à versão, aplicabilidade e segurança para o projeto.

---

### **🤖 COMUNICAÇÃO PADRÃO DO AGENTE**

### **PROTOCOLO DE ENTRADA (OBRIGATÓRIO):**

```

🤖 AGENTE: [NOME/ID] - PROTOCOLO INICIADO
├── 🏛️ ZENTRAW-MASTER-RULES.md: ✅ LIDO
├── 🏗️ MODULE-ARCHITECTURE-STANDARD.md: ✅ LIDO
├── 📋 MODULE-STATUS-TRACKER.md: ✅ CONSULTADO
├── 🎯 [MÓDULO]/docs/README.md: ✅ LIDO
├── 📊 Módulo identificado: [NOME_MÓDULO]
├── 🔍 Versão atual confirmada: V[x.x.x.x]
├── ✅ Arquivos físicos validados: [QTD] arquivos existem
├── 🧪 Sistema testado: [FUNCIONANDO/PROBLEMAS]
└── 🎯 Objetivo: [DESCRIÇÃO_CLARA]

```

### **DURANTE TRABALHO:**

```

⚡ [TIMESTAMP] EXECUTANDO: [AÇÃO_ESPECÍFICA]
🧪 [TIMESTAMP] TESTANDO: [RESULTADO]
📝 [TIMESTAMP] DOCUMENTANDO: [MUDANÇA]
✅ [TIMESTAMP] VALIDADO: [STATUS]

```

### **PROTOCOLO DE SAÍDA (OBRIGATÓRIO):**

```

🤖 AGENTE: [NOME/ID] - PROTOCOLO FINALIZADO
├── ✅ Objetivo alcançado: [SIM/NÃO]
├── 📊 Sistema funcional: [CONFIRMADO/PROBLEMAS]
├── 📝 README.md atualizado: [SIM/NÃO]
├── 📋 CHANGELOG.md atualizado: [SIM/NÃO]
├── 🚨 TROUBLESHOOTING.md atualizado: [SIM/SE_APLICÁVEL]
├── 📊 MODULE-STATUS-TRACKER.md atualizado: [SIM]
├── 📝 ZENTRAW-AGENT-DECISIONS-LOG.md registrado: [SIM]
├── 🔍 VALIDATION-CHECKLIST.md executado: [SIM]
├── ⚠️ Problemas identificados: [LISTA_OU_NENHUM]
└── 📋 Próximos passos recomendados: [LISTA_OU_NENHUM]

```

---
### **🚨 SITUAÇÕES DE EMERGÊNCIA**

### **🛑 QUANDO PARAR IMEDIATAMENTE:**

```

❌ Documentação contradiz realidade massivamente
❌ Sistema funcionando diverge totalmente dos docs
❌ Múltiplos arquivos críticos ausentes
❌ Versões completamente desalinhadas
❌ Modificação causou quebra crítica
❌ Instrução causa loop infinito de erro

```

### **🔄 PROTOCOLO DE RECUPERAÇÃO:**

```

1. 🛑 PARAR todas as modificações
2. 📊 DOCUMENTAR estado atual encontrado
3. � ANALISAR possibilidade de correção técnica preservando blindagem
4. 🔧 APLICAR correção mínima SE viável E segura
5. 🧪 TESTAR correção mantendo funcionalidade base
6. �🔄 REVERTER para último estado estável APENAS se correção falhar
7. 📝 REGISTRAR problema no TROUBLESHOOTING.md
8. 📋 ATUALIZAR documentação baseada na REALIDADE
9. ✅ VALIDAR sistema novamente
10. 📊 REGISTRAR recuperação no log de decisões

```

---

### **🎯 OBJETIVOS DESTE PROTOCOLO**

### **ELIMINAÇÃO GARANTIDA DE:**

- ❌ Uso de documentação desatualizada
- ❌ Modificações baseadas em suposições
- ❌ Loops infinitos de "correção"
- ❌ Quebra de sistemas funcionais
- ❌ Documentação contraditória
- ❌ Decisões não documentadas

### **GARANTIA ABSOLUTA DE:**

- ✅ Validação física antes de ação
- ✅ Preservação de funcionalidade
- ✅ Documentação em tempo real
- ✅ Consistência hierárquica
- ✅ Rastreabilidade completa
- ✅ Recuperação controlada

---

### **🏆 MÉTRICAS DE SUCESSO**

### **AGENTE SEGUINDO PROTOCOLO:**

- ✅ 100% validação física antes de ação
- ✅ 0% modificações baseadas em suposições
- ✅ 100% documentação atualizada após ação
- ✅ 0% quebra de sistemas funcionais
- ✅ 100% rastreabilidade de decisões

### **AGENTE VIOLANDO PROTOCOLO:**

- ❌ Usa arquivos de /archive/
- ❌ Usa pastas "NÃO USAR"
- ❌ Incorpora código de referência diretamente
- ❌ Modifica sem testar estado atual
- ❌ Não documenta mudanças
- ❌ Ignora hierarquia de prioridades
- ❌ Cria documentação contraditória

---

**🚨 ESTE PROTOCOLO É OBRIGATÓRIO E INVIOLÁVEL**

**Autoridade:** ZENTRAW-MASTER-RULES.md
**Vigência:** IMEDIATA para todos os agentes
**Compliance:** OBRIGATÓRIO - Sem exceções
**Validação:** MODULE-STATUS-TRACKER.md + VALIDATION-CHECKLIST.md
```
