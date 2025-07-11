# 📋 ZENTRAW - REGRAS ORGANIZACIONAIS CRÍTICAS

**Versão**: V1.3.0.c.10 | **Data**: 10/07/2025 | **Status**: Regras Permanentes

---

## 🎯 **REGRAS FUNDAMENTAIS**

### 1. 📁 **ORGANIZAÇÃO DOCUMENTAL**

**✅ CORRETO:**
- Documentação específica → `TemplateLibraryBuilder/docs/`
- Logs de implementação → `docs/implementation/`
- Análises técnicas → `docs/technical/`
- Correções de bugs → `docs/bug-fixes/`
- Changelogs → `docs/versioning/`

**❌ INCORRETO:**
- Documentação temporária na raiz `/zentraw/`
- Logs parciais na raiz
- Documentação específica misturada com estrutural

### 2. 🔗 **PROTOCOLO DE INTERAÇÃO**

**FLUXO OBRIGATÓRIO:**
1. **🔍 ANÁLISE** → Entender contexto completo
2. **🧩 DECOMPOSIÇÃO** → Quebrar em tarefas menores  
3. **🎯 IMPLEMENTAÇÃO** → Uma mudança por vez
4. **✅ VALIDAÇÃO** → Testar e documentar
5. **📚 ORGANIZAÇÃO** → Salvar docs na pasta correta

### 3. 📂 **HIERARQUIA DE PASTAS**

```
/zentraw/                           # RAIZ - Só docs estruturais
├── README.md                       # ✅ Descrição geral da plataforma
├── ZENTRAW_STRATEGIC_ROADMAP.md    # ✅ Roadmap geral
└── TemplateLibraryBuilder/         # PROJETO ESPECÍFICO
    └── docs/                       # TODA documentação específica
        ├── implementation/         # Implementações e testes
        ├── technical/             # Análises técnicas
        ├── bug-fixes/             # Correções específicas
        ├── versioning/            # Changelogs
        ├── architecture/          # Design patterns
        ├── troubleshooting/       # Logs de problemas
        ├── rollback/              # Backups
        └── critical/              # Alta prioridade
```

### 4. 🏷️ **CONVENÇÕES DE NOMENCLATURA**

**Formato obrigatório:**
- `ZENTRAW_V[versão]_[TIPO]_[DESCRIÇÃO].md`
- Exemplo: `ZENTRAW_V1.3.0.c.10_BUG_CANVAS_SIZE_FIX.md`

**Tipos válidos:**
- `IMPLEMENTATION` - Implementações
- `TECHNICAL` - Análises técnicas  
- `BUG` - Correções de bugs
- `CHANGELOG` - Histórico de mudanças
- `ARCHITECTURE` - Design e arquitetura
- `TROUBLESHOOTING` - Resolução de problemas
- `ROLLBACK` - Backup e restore

### 5. ⚠️ **VALIDAÇÕES OBRIGATÓRIAS**

**Antes de qualquer mudança:**
- [ ] Analisou o contexto completo?
- [ ] Entendeu a estrutura atual?
- [ ] Consultou documentação existente?
- [ ] Definiu onde salvar a documentação?

**Após qualquer mudança:**
- [ ] Testou a implementação?
- [ ] Documentou a solução?
- [ ] Salvou na pasta correta?
- [ ] Atualizou logs de versão?

---

## 🚨 **LEMBRETES CRÍTICOS**

1. **RAIZ É SAGRADA** - Só documentação estrutural da plataforma
2. **UMA MUDANÇA POR VEZ** - Implementar e testar gradualmente
3. **DOCUMENTAR TUDO** - Cada mudança deve ter registro
4. **CATEGORIZAR SEMPRE** - Usar as pastas certas no docs/
5. **PROTOCOLO PRIMEIRO** - Seguir fluxo de análise→implementação→validação

---

*Este documento deve ser consultado antes de qualquer trabalho no Zentraw.*
