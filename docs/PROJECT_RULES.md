# 📜 ZENTRAW PROJECT RULES - REGRAS DE DESENVOLVIMENTO

**Versão**: V1.4.0.a.2  
**Data**: 23 de Julho de 2025  
**Horário**: 10:45 BRT  
**Aplicável a**: Todas as versões futuras

---

## 🚫 **REGRAS CRÍTICAS - NUNCA QUEBRAR**

### **REGRA #1: ORGANIZAÇÃO DE ARQUIVOS**
❌ **NUNCA criar arquivos soltos na raiz de nenhuma pasta principal**

✅ **SEMPRE salvar em pasta específica:**
- Scripts → `scripts/[categoria]/`
- Documentação → `docs/[categoria]/`
- Testes → `tests/[categoria]/`
- Backups → `_backup/[data]/`

### **REGRA #2: CABEÇALHO OBRIGATÓRIO**
**TODO ARQUIVO DEVE TER:**
```javascript
/**
 * Zentraw 3D Visualizer V[VERSÃO]
 * Data: DD/MM/AAAA - HH:MM BRT
 * Propósito: [Descrição clara e objetiva]
 * Status: [Funcional/Experimental/Deprecated/Testing]
 * Dependências: [Lista de dependências]
 * Autor: [Nome do desenvolvedor]
 */
```

### **REGRA #3: NOMENCLATURA PADRONIZADA**
- **Scripts**: `[categoria]-[funcao]-[versao].[ext]`
- **Documentação**: `[PROJETO]_[VERSAO]_[CATEGORIA].md`
- **Testes**: `test-[funcionalidade]-[versao].[ext]`
- **Backups**: `backup-[data]-[versao]/`

### **REGRA #4: ESTRUTURA DE PASTAS OBRIGATÓRIA**
```
TemplateLibraryBuilder/
├── client/                    # Frontend React/Vite
├── server/                    # Backend TypeScript/Node
├── Blender/                   # Scripts Python + Templates
├── scripts/                   # Scripts organizados
│   ├── 3d_visualizer/        # Scripts do visualizador
│   ├── utilities/            # Utilitários gerais
│   ├── maintenance/          # Scripts de manutenção
│   └── deployment/           # Scripts de deploy
├── docs/                     # Documentação estruturada
│   ├── zentraw-core/         # Docs do core
│   ├── 3d-visualizer/        # Docs do visualizador
│   ├── sessions/             # Logs de sessão
│   └── v[versao]/            # Docs por versão
├── tests/                    # Testes organizados
│   ├── unit/                 # Testes unitários
│   ├── integration/          # Testes de integração
│   └── e2e/                  # Testes end-to-end
└── uploads/                  # Outputs do sistema
```

---

## 🎯 **METODOLOGIA DE DESENVOLVIMENTO**

### **FASE 1: PLANEJAMENTO**
1. **Análise de Requisitos**
   - Documentar objetivos claros
   - Definir critérios de sucesso
   - Mapear dependências

2. **Arquitetura**
   - Definir estrutura de arquivos
   - Escolher tecnologias
   - Validar compatibilidade

### **FASE 2: IMPLEMENTAÇÃO**
1. **Desenvolvimento Incremental**
   - Fazer mudanças pequenas
   - Testar cada alteração
   - Documentar em tempo real

2. **Controle de Versão**
   - Commits frequentes e descritivos
   - Branches para features
   - Tags para releases

### **FASE 3: VALIDAÇÃO**
1. **Testes Sistemáticos**
   - Testes unitários primeiro
   - Integração progressiva
   - Validação end-to-end

2. **Documentação**
   - Atualizar specs técnicas
   - Criar guias de uso
   - Documentar lições aprendidas

---

## 🔄 **FLUXO DE TRABALHO OBRIGATÓRIO**

### **Para Qualquer Alteração:**
1. **Planejar** → Documento de especificação
2. **Implementar** → Código com cabeçalho padrão
3. **Testar** → Validação funcional
4. **Documentar** → Atualizar documentação
5. **Revisar** → Code review interno
6. **Commit** → Versionamento controlado

### **Para Experimentação:**
1. Criar em `scripts/experimental/`
2. Documentar propósito e escopo
3. Testar isoladamente
4. Se funcional → mover para pasta apropriada
5. Se não funcional → arquivar com explicação

---

## 🚨 **ERROS A EVITAR - LIÇÕES APRENDIDAS**

### **❌ NÃO FAZER:**
1. **Criar múltiplas versões** de mesmo arquivo
2. **Arquivos sem documentação** de propósito
3. **Testes sem metodologia** clara
4. **Mudanças sem backup** do estado anterior
5. **Desenvolvimento sem planejamento**
6. **Ignorar dependências** entre componentes
7. **Código sem versionamento** no cabeçalho

### **✅ SEMPRE FAZER:**
1. **Uma versão definitiva** por funcionalidade
2. **Documentação clara** em todos os arquivos
3. **Testes sistemáticos** e reproducíveis
4. **Backups automáticos** antes de mudanças
5. **Planejamento detalhado** antes da implementação
6. **Mapeamento de dependências** completo
7. **Versionamento claro** em todos os arquivos

---

## 📊 **MÉTRICAS DE QUALIDADE**

### **Indicadores de Sucesso:**
- **Organização**: 0 arquivos soltos na raiz
- **Documentação**: 100% dos arquivos com cabeçalho
- **Funcionalidade**: Testes passando consistentemente
- **Manutenibilidade**: Código autodocumentado
- **Versionamento**: Histórico claro de mudanças

### **Critérios de Aceitação:**
- Todo arquivo tem propósito documentado
- Estrutura de pastas respeitada
- Nomenclatura padronizada
- Dependências mapeadas
- Testes validados

---

## 🎯 **APLICAÇÃO IMEDIATA**

### **Para V1.4.0.a.2 3D Visualizer:**
1. **Analisar arquivos funcionais** já identificados
2. **Aplicar metodologia nova** em desenvolvimento
3. **Documentar lições aprendidas** dos últimos dias
4. **Implementar sistema robusto** baseado na experiência
5. **Evitar repetição** dos erros cometidos

### **Responsabilidades da Equipe:**
- **Desenvolvedores**: Seguir regras de código
- **Documentadores**: Manter docs atualizadas
- **Testadores**: Validar funcionalidades
- **Gerentes**: Garantir conformidade

---

**Status**: ✅ Regras Definidas e Aplicáveis  
**Próxima Revisão**: A cada release major  
**Responsável**: Zentraw Development Team  
**Aplicação**: Imediata para todas as atividades
