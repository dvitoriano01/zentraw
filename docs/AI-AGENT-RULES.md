# 🤖 ZENTRAW - REGRAS PARA AGENTES IA

## 🎯 **PROTOCOLO DE DESENVOLVIMENTO ASSISTIDO**

### **🔍 ANTES DE QUALQUER MODIFICAÇÃO (OBRIGATÓRIO)**

#### **1. ANÁLISE DA BASE FUNCIONAL**
```
✅ SEMPRE fazer ANTES de começar:
1. LER CHANGELOG.md → Identificar última versão FUNCIONAL
2. LER README.md do módulo → Usar MESMOS arquivos base
3. VERIFICAR package.json → Usar dependências exatas
4. CONSULTAR TROUBLESHOOTING.md → Evitar erros já resolvidos
```

#### **2. IDENTIFICAÇÃO DE ARQUIVOS ATIVOS**
```
✅ ARQUIVOS PERMITIDOS (Usar apenas estes):
- Listados na seção "ARQUIVOS PRINCIPAIS" do CHANGELOG
- Localizados FORA da pasta /archive/
- Mencionados no README.md como "✅ Funcional"

❌ ARQUIVOS PROIBIDOS (NUNCA usar):
- Qualquer arquivo em /archive/
- Arquivos marcados como "🚫 ARQUIVADO" 
- Versões antigas sem marcação "✅"
```

#### **3. VALIDAÇÃO DE CONTEXTO**
```
🔍 PERGUNTAS OBRIGATÓRIAS:
- Qual foi a ÚLTIMA versão que funcionou 100%?
- Quais arquivos EXATOS foram usados nessa versão?
- Que PROBLEMA específico estamos resolvendo?
- Já foi tentada essa solução antes? (verificar TROUBLESHOOTING)
```

---

## 📝 **DURANTE O DESENVOLVIMENTO**

### **✅ REGRAS DE EVOLUÇÃO**
1. **BASE SÓLIDA**: SEMPRE partir da versão anterior funcional
2. **ARQUIVOS CONSISTENTES**: Usar MESMOS arquivos base (não criar novos)
3. **MUDANÇAS INCREMENTAIS**: Uma modificação por vez
4. **TESTES IMEDIATOS**: Validar cada mudança antes de continuar
5. **DOCUMENTAÇÃO REAL-TIME**: Registrar mudanças conforme fazemos

### **❌ ERROS CRÍTICOS A EVITAR**
1. **NUNCA** usar arquivos de /archive/ (obsoletos)
2. **NUNCA** criar novas versões de arquivos já funcionais
3. **NUNCA** assumir que "deve funcionar" sem testar
4. **NUNCA** ignorar configurações da versão anterior
5. **NUNCA** misturar códigos de versões diferentes

### **🔧 METODOLOGIA DE CORREÇÃO**
```
Para cada BUG ou PROBLEMA:

1. DIAGNÓSTICO
   - Identificar exatamente o que não funciona
   - Verificar se problema já foi resolvido antes
   - Localizar diferença entre versão atual vs funcional

2. SOLUÇÃO MÍNIMA
   - Aplicar menor mudança possível
   - Testar imediatamente após mudança
   - Reverter se criar novos problemas

3. VALIDAÇÃO
   - Confirmar que problema original foi resolvido
   - Verificar que não quebrou funcionalidades existentes
   - Documentar solução para futuras referências
```

---

## ✅ **APÓS CADA MODIFICAÇÃO**

### **📋 CHECKLIST OBRIGATÓRIO**
```
✅ ANTES DE CONSIDERAR "PRONTO":

1. FUNCIONALIDADE
   □ Sistema executa sem erros
   □ Resultado esperado é produzido
   □ Performance mantida ou melhorada

2. DOCUMENTAÇÃO
   □ CHANGELOG.md atualizado com mudanças
   □ README.md reflete estado atual
   □ Arquivos obsoletos movidos para /archive/

3. CONSISTÊNCIA
   □ Versão numerada corretamente
   □ Dependências documentadas
   □ Scripts de teste funcionais

4. PREVENÇÃO
   □ Problema adicionado ao TROUBLESHOOTING.md
   □ Solução documentada para futura referência
   □ Arquivos ativos claramente identificados
```

---

## 🏗️ **PADRÃO PARA TODOS OS MÓDULOS**

### **📁 ESTRUTURA OBRIGATÓRIA**
```
qualquer-modulo/
├── README.md                    # ✅ Status + instruções atuais
├── CHANGELOG.md                 # ✅ Histórico de versões  
├── package.json                 # ✅ Dependências exatas
├── src/                         # ✅ Código fonte ativo
├── tests/                       # ✅ Testes validados
├── scripts/                     # ✅ Scripts de automação
├── docs/                        # ✅ Documentação específica
└── archive/                     # ❌ Arquivos obsoletos (não usar)
```

### **📋 SEÇÕES OBRIGATÓRIAS NO README.md**
```markdown
## 🎯 STATUS ATUAL
- **Versão**: V[x.x.x.x]
- **Data**: [data da última atualização]
- **Status**: [funcionando/em desenvolvimento/com problemas]

## 📁 ARQUIVOS ATIVOS V[x.x.x.x]
[Lista exata dos arquivos em uso nesta versão]

## ✅ FUNCIONALIDADES VALIDADAS
[O que está funcionando confirmadamente]

## ⚠️ PROBLEMAS CONHECIDOS  
[Problemas identificados mas não resolvidos]

## 🚫 ARQUIVOS ARQUIVADOS
[O que foi removido e por quê]
```

---

## 🚨 **SITUAÇÕES DE EMERGÊNCIA**

### **🔄 QUANDO TUDO QUEBRA**
```
PROTOCOLO DE RECUPERAÇÃO:

1. STOP! Não fazer mais mudanças
2. IDENTIFICAR última versão 100% funcional
3. REVERTER para arquivos dessa versão
4. TESTAR que funciona antes de continuar
5. IDENTIFICAR o que causou o problema
6. APLICAR correção mínima necessária
```

### **🤝 TRANSIÇÃO ENTRE AGENTES**
```
PROTOCOLO DE HANDOFF:

Agente SAINDO deve:
□ Atualizar CHANGELOG.md com progresso atual
□ Documentar próximos passos no README.md
□ Listar arquivos modificados na sessão
□ Identificar se sistema está funcional ou quebrado

Agente ENTRANDO deve:
□ LER CHANGELOG.md completamente
□ VALIDAR estado atual do sistema
□ IDENTIFICAR arquivos ativos da versão atual
□ CONTINUAR de onde parou (não recomeçar)
```

---

## 📊 **MÉTRICAS DE SUCESSO**

### **✅ AGENTE SEGUINDO REGRAS**
- Consulta CHANGELOG antes de qualquer mudança
- Usa apenas arquivos da versão atual (não arquivados)
- Testa modificações imediatamente
- Documenta mudanças em tempo real
- Evolui sobre base funcional anterior

### **❌ AGENTE QUEBRANDO REGRAS**
- Usa arquivos de /archive/
- Cria novas versões de arquivos já funcionais
- Assume funcionalidade sem testar
- Ignora documentação existente
- Repete erros já resolvidos

---

## 🎯 **OBJETIVO FINAL**

**ELIMINAÇÃO COMPLETA DE ERROS REPETITIVOS**

Através desta estrutura, QUALQUER agente IA deve conseguir:
1. **Identificar** rapidamente o estado atual do sistema
2. **Usar** exatamente os mesmos arquivos da versão funcional
3. **Evitar** problemas já resolvidos anteriormente  
4. **Evoluir** de forma consistente e documentada
5. **Transferir** conhecimento para próximos agentes

**RESULTADO**: Desenvolvimento linear, sem loops de erro, com base sólida sempre preservada.
