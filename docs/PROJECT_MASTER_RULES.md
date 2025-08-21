# 📜 ZENTRAW MASTER RULES - TODAS AS REGRAS CONSOLIDADAS

**Versão**: V1.4.0.a.2  
**Data**: 23 de Julho de 2025  
**Horário**: 11:15 BRT  
**Aplicável a**: TODO o projeto Zentraw e subprojetos

---

## 🎯 **ÍNDICE DE REGRAS**

| Categoria | Descrição | Status |
|-----------|-----------|--------|
| [📁 Organização](#organização) | Estrutura de arquivos e pastas | ✅ Obrigatório |
| [🏗️ Desenvolvimento](#desenvolvimento) | Metodologia de código | ✅ Obrigatório |
| [📋 Versionamento](#versionamento) | Controle de versões | ✅ Obrigatório |
| [📝 Documentação](#documentação) | Padrões de docs | ✅ Obrigatório |
| [🤖 Agentes IA](#agentes-ia) | Interação com assistentes | ✅ Obrigatório |
| [🧪 Testes](#testes) | Validação e qualidade | ✅ Obrigatório |
| [🚨 Emergência](#emergência) | Protocolos críticos | ✅ Obrigatório |

---

## 📁 **ORGANIZAÇÃO**

### **REGRA UNIVERSAL #1: NUNCA ARQUIVOS SOLTOS**
❌ **ABSOLUTAMENTE PROIBIDO:**
- Criar arquivos `.md`, `.js`, `.ts`, `.bat`, `.html` na raiz de pastas principais
- Deixar documentos temporários soltos
- Scripts experimentais fora de pastas organizadas

✅ **ESTRUTURA OBRIGATÓRIA:**
```
zentraw/
├── docs/                      # APENAS documentação estrutural do projeto
│   ├── PROJECT_MASTER_RULES.md  # Este documento
│   ├── INDEX.md               # Índice principal
│   ├── README.md              # Guia principal
│   ├── sessions/              # Logs de sessões
│   ├── zentraw-core/          # Docs do core
│   └── 3d-visualizer/         # Docs do visualizador

TemplateLibraryBuilder/
├── client/                    # Frontend React/Vite
├── server/                    # Backend TypeScript/Node
├── Blender/                   # Scripts Python + Templates
├── scripts/                   # Scripts organizados por categoria
│   ├── 3d_visualizer/        # Scripts do visualizador 3D
│   ├── utilities/            # Utilitários gerais
│   ├── maintenance/          # Scripts de manutenção
│   └── deployment/           # Scripts de deploy
├── docs/                     # Documentação específica do projeto
│   ├── 3d_visualizer/        # Docs do visualizador
│   ├── implementations/      # Implementações técnicas
│   ├── bug-fixes/           # Correções documentadas
│   └── versions/            # Logs por versão
├── tests/                    # Testes organizados
└── uploads/                  # Outputs do sistema
```

### **REGRA #2: NOMENCLATURA PADRONIZADA**
- **Scripts**: `[categoria]-[funcao]-v[versao].[ext]`
- **Documentação**: `[PROJETO]_V[VERSAO]_[CATEGORIA].md`
- **Testes**: `test-[funcionalidade]-v[versao].[ext]`
- **Backups**: `backup-[YYYYMMDD]-v[versao]/`

### **REGRA #3: CABEÇALHO OBRIGATÓRIO**
**TODO ARQUIVO DEVE TER:**
```javascript
/**
 * Zentraw [Projeto] V[VERSÃO]
 * Data: DD/MM/AAAA - HH:MM BRT
 * Propósito: [Descrição clara e objetiva]
 * Status: [Funcional/Experimental/Deprecated/Testing]
 * Dependências: [Lista de dependências]
 * Autor: [Nome do desenvolvedor]
 * Categoria: [Frontend/Backend/Docs/Scripts/Tests]
 */
```

---

## 🏗️ **DESENVOLVIMENTO**

### **REGRA #4: METODOLOGIA INCREMENTAL OBRIGATÓRIA**

#### **FASE 1: ANÁLISE (SEMPRE PRIMEIRO)**
1. **Verificar estrutura** atual do workspace
2. **Identificar arquivos** principais envolvidos
3. **Consultar histórico** de mudanças recentes
4. **Entender contexto** completo do problema

#### **FASE 2: PLANEJAMENTO**
1. **Quebrar** request em tarefas menores
2. **Identificar dependências** entre componentes
3. **Mapear arquivos** que serão alterados
4. **Definir sequência** lógica de implementação

#### **FASE 3: IMPLEMENTAÇÃO CONTROLADA**
1. **Uma mudança** por vez
2. **Testar** cada alteração antes da próxima
3. **Documentar** cada passo realizado
4. **Manter logs** claros de progresso

#### **FASE 4: VALIDAÇÃO**
1. **Testar funcionalidade** após cada mudança
2. **Confirmar** que o problema foi resolvido
3. **Documentar solução** aplicada
4. **Atualizar** logs de versão

### **REGRA #5: PRESERVAÇÃO DE FUNCIONALIDADES**
- **SEMPRE manter** funcionalidades estáveis já implementadas
- **NUNCA quebrar** compatibilidade sem autorização explícita
- **Aplicar melhorias** SOMENTE em blocos específicos
- **EVITAR** mudanças no código inteiro (exceto rollback autorizado)

---

## 📋 **VERSIONAMENTO**

### **REGRA #6: TRABALHO SOBRE ÚLTIMA VERSÃO**
```
"Trabalhar SEMPRE em cima da última versão salva e commitada"
EXCEÇÃO: Rollback total autorizado pelo DEV principal
```

### **REGRA #7: PROGRESSÃO ALFA-NUMÉRICA**
```
V1.3.0.c.8 → V1.3.0.c.9 → V1.3.0.c.10 → V1.5.x.x.x → V2.x.x.x.x
```

### **REGRA #8: AUTORIZAÇÃO OBRIGATÓRIA**
- **SEMPRE perguntar** antes de mudar versão
- **Mudanças de versão** dependem de autorização do DEV principal
- **Uma melhoria específica** pode ser aplicada na última versão
- **Consulta obrigatória** para determinar melhor opção

### **REGRA #9: DIRETRIZES ANTI-ROLLBACK (EDITOR DE IMAGENS)**
❌ **NUNCA FAZER ROLLBACK PARA:**
- V1.3.0.c.7 ou anterior (fontes genéricas)
- V1.3.0.c.2 ou anterior (apenas 7-20 fontes)
- V1.3.0.b.1 ou anterior (react-beautiful-dnd com erros)

✅ **VERSÃO DE PRODUÇÃO ESTÁVEL:**
- V1.3.0.c.8: 44 fontes Freepik funcionais
- Commit: `7cb7fc0`
- Status: Production-ready

---

## 📝 **DOCUMENTAÇÃO**

### **REGRA #10: ESTRUTURA DOCUMENTAL OBRIGATÓRIA**

#### **RAIZ DO REPOSITÓRIO** (`/zentraw/docs/`)
- **APENAS** documentação ESTRUTURAL e CRÍTICA da plataforma
- Guias gerais, roadmaps, protocolos principais
- README.md principal da plataforma

#### **PASTA DO PROJETO** (`/TemplateLibraryBuilder/docs/`)
- **TODA** documentação específica do editor de imagens
- Subdivisão por categorias organizacionais
- Histórico completo de mudanças e implementações

#### **CATEGORIAS OBRIGATÓRIAS**
```
docs/
├── implementations/     # Implementações e testes
├── technical/          # Análises técnicas detalhadas  
├── bug-fixes/          # Correções de bugs específicos
├── versions/           # Changelogs e histórico de versões
├── architecture/       # Arquitetura e design patterns
├── troubleshooting/    # Logs de problemas e soluções
├── rollback/           # Backups e restore logs
└── critical/           # Documentos de alta prioridade
```

### **REGRA #11: SALVAMENTO DOCUMENTAL**
- **NUNCA** salvar docs temporárias na raiz
- **SEMPRE** categorizar por tipo de documento
- **SEMPRE** incluir data e versão nos nomes
- **SEMPRE** seguir o protocolo de interação

---

## 🤖 **AGENTES IA**

### **REGRA #12: PROTOCOLO DE INTERAÇÃO COM ASSISTENTES**

#### **FLUXO OBRIGATÓRIO PARA QUALQUER MUDANÇA:**
1. **🔍 ANÁLISE INICIAL** - Verificar estrutura e contexto
2. **🧩 DECOMPOSIÇÃO** - Quebrar em tarefas menores
3. **🎯 IMPLEMENTAÇÃO** - Uma mudança por vez
4. **✅ VALIDAÇÃO** - Testar cada alteração
5. **📚 DOCUMENTAÇÃO** - Registrar mudanças

#### **CHECKLIST PRE-IMPLEMENTAÇÃO:**
- [ ] Versão atual identificada e confirmada
- [ ] Bloco específico a modificar definido
- [ ] Autorização obtida (se mudança de versão)
- [ ] Backup de segurança realizado
- [ ] Plano de rollback definido

### **REGRA #13: DESENVOLVIMENTO ASSISTIDO POR IA**
- **CONSULTAR** documentação existente antes de implementar
- **APLICAR** lições aprendidas dos logs de sessão
- **EVITAR** repetição de erros já documentados
- **USAR** experiência acumulada nas decisões

### **REGRA #19: PERMISSÃO PARA AGENTES ASSISTENTES IA**
- Agentes assistentes têm permissão para:
  - Editar arquivos diretamente, seguindo as regras do projeto.
  - Atualizar documentação e scripts conforme solicitado.
  - Implementar mudanças incrementais e testadas.
- Todas as alterações feitas por agentes devem ser documentadas e validadas.
- Desenvolvedores devem revisar mudanças críticas antes de commit final.

### **REGRA #20: PROATIVIDADE DOS AGENTES IA**

- **SEMPRE AGIR PROATIVAMENTE** na resolução de problemas encontrados, verificando a melhor opção a ser seguida.
- **APONTAR O PROBLEMA, A SOLUÇÃO E PERGUNTAR SOMENTE SE PODE SEGUIR NAQUELA DIREÇÃO**.
- Perguntar como deseja proceder **apenas se for algo muito crítico** que pode atrapalhar em outros módulos ou códigos que também dependam daquele determinado arquivo.
- **EM CASOS COMUNS, AGIR SEMPRE COM PROATIVIDADE!**

---

## 🧪 **TESTES**

### **REGRA #14: VALIDAÇÃO SISTEMÁTICA**

#### **TESTES OBRIGATÓRIOS (Editor de Imagens):**
- [ ] **Fontes**: 44 fontes carregam (não 7 ou 20)
- [ ] **Histórico**: Ctrl+Z preserva zoom e background
- [ ] **Seleção**: Objetos mantêm seleção ao clicar
- [ ] **Drag & Drop**: Layers movem sem erro no console
- [ ] **Interface**: Zoom funciona com Ctrl+Scroll

#### **TESTES OBRIGATÓRIOS (3D Visualizer):**
- [ ] **Backend**: Servidor inicia na porta correta
- [ ] **Interface**: Conecta ao backend sem erro
- [ ] **Upload**: Aceita arquivos de áudio e imagem
- [ ] **Blender**: Executa render real (não simulado)
- [ ] **Output**: Gera arquivo MP4 válido

### **REGRA #15: CRITÉRIOS DE ACEITAÇÃO**
- **Organização**: 0 arquivos soltos na raiz
- **Documentação**: 100% dos arquivos com cabeçalho
- **Funcionalidade**: Testes passando consistentemente
- **Performance**: Responsividade < 3s para ações principais

---

## 🤖 **TESTES AUTOMATIZADOS**

### **REGRA UNIVERSAL #2: PRIORIDADE PARA TESTES AUTOMÁTICOS**
- Sempre que possível, implementar testes automatizados para validação de funcionalidades.
- Evitar dependência de testes manuais, exceto em casos extremos.
- Ferramentas recomendadas: Jest, Mocha, Cypress.
- Exemplo de automação:
```bash
npm test
```

---

## 🚨 **EMERGÊNCIA**

### **REGRA #16: PROTOCOLO DE EMERGÊNCIA (Editor)**
Se algo crítico quebrar no editor:
1. **Backup atual**: `git stash push -m "backup-emergency"`
2. **Rollback para c.8**: `git checkout 7cb7fc0`
3. **Criar branch**: `git checkout -b emergency-restore`
4. **Validar funcionamento**: Testar 44 fontes + Ctrl+Z + Seleção
5. **Só então investigar** problema original

### **REGRA #17: PREVENÇÃO DE CÍRCULOS VICIOSOS**
- **IDENTIFICAR** sistema funcionando antes de "limpar"
- **DOCUMENTAR** o que funciona antes de experimentar
- **MANTER** sempre uma versão estável conhecida
- **EVITAR** experimentação excessiva sem controle

### **REGRA #18: RECUPERAÇÃO DE ARQUIVOS PERDIDOS**
Se arquivos críticos forem acidentalmente movidos/deletados:
1. **PARAR** imediatamente qualquer alteração
2. **VERIFICAR** se existem backups automáticos
3. **LISTAR** últimas modificações com timestamp
4. **RECUPERAR** da fonte mais recente disponível
5. **VALIDAR** funcionamento após recuperação

---

## 📊 **MÉTRICAS DE QUALIDADE**

### **INDICADORES DE SUCESSO:**
- **Organização**: 0 arquivos soltos na raiz
- **Documentação**: 100% dos arquivos com cabeçalho padrão
- **Funcionalidade**: Sistema principal funcionando sempre
- **Versionamento**: Progressão controlada e documentada
- **Testes**: Validação sistemática antes de commits

### **INDICADORES DE ALERTA:**
- 🚨 Arquivos sem cabeçalho de identificação
- 🚨 Múltiplas versões do mesmo arquivo
- 🚨 Funcionalidades que "funcionavam ontem"
- 🚨 Experimentação sem documentação
- 🚨 Rollbacks não planejados

---

## 🎯 **REGRAS ESPECÍFICAS POR PROJETO**

### **EDITOR DE IMAGENS (TemplateLibraryBuilder)**
- **Arquivo principal**: `client/src/pages/PhotoEditorFixed.tsx`
- **Sistema de fontes**: `client/src/styles/freepik-fonts.css`
- **Versão estável**: V1.3.0.c.8 (commit `7cb7fc0`)
- **Preservar**: 44 fontes Freepik funcionais

### **3D VISUALIZER (Blender Integration)**
- **Sistema funcionando**: `server-simple-real.js` + `test-simple-real.html`
- **Porta**: 3004 (backend), frontend via file:// ou servidor local
- **Scripts organizados**: `scripts/3d_visualizer/`
- **Documentação**: `docs/3d_visualizer/`

---

## 🔄 **APLICAÇÃO IMEDIATA**

### **PARA DESENVOLVEDORES:**
1. **Ler** estas regras antes de qualquer alteração
2. **Seguir** metodologia incremental obrigatória
3. **Documentar** cada mudança em tempo real
4. **Testar** sistematicamente antes de commits

### **PARA ASSISTENTES IA:**
1. **Consultar** este documento antes de implementar
2. **Aplicar** protocolo de interação obrigatório
3. **Preservar** funcionalidades estáveis existentes
4. **Documentar** processo e resultados

### **PARA GERENTES DE PROJETO:**
1. **Garantir** conformidade com regras
2. **Validar** estrutura de pastas periodicamente
3. **Revisar** documentação de mudanças
4. **Autorizar** mudanças de versão

---

## 📋 **CHECKLIST DE CONFORMIDADE**

### **ANTES DE QUALQUER ALTERAÇÃO:**
- [ ] Li e entendi todas as regras aplicáveis
- [ ] Identifiquei a versão atual do projeto
- [ ] Defini o escopo exato da mudança
- [ ] Tenho autorização para mudanças de versão (se aplicável)
- [ ] Tenho plano de rollback se algo der errado

### **DURANTE O DESENVOLVIMENTO:**
- [ ] Estou aplicando uma mudança por vez
- [ ] Estou testando cada alteração
- [ ] Estou documentando em tempo real
- [ ] Estou seguindo estrutura de pastas

### **APÓS IMPLEMENTAÇÃO:**
- [ ] Funcionalidade principal ainda funciona
- [ ] Testes de validação passaram
- [ ] Documentação foi atualizada
- [ ] Arquivos estão organizados corretamente
- [ ] Commit foi feito com mensagem descritiva

---

**Status**: ✅ Regras Definidas e Obrigatórias para TODO o Projeto  
**Próxima Revisão**: A cada release major  
**Responsável**: Zentraw Development Team  
**Aplicação**: **IMEDIATA** para todas as atividades
