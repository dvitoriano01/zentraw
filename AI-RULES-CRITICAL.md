# 🚨 ZENTRAW - REGRAS CRÍTICAS PARA AGENTES IA

## ⚡ **LEIA ISTO PRIMEIRO - PROTOCOLO OBRIGATÓRIO**

### **🔍 ANTES DE QUALQUER MODIFICAÇÃO**
1. **LER [docs/CHANGELOG.md](./docs/CHANGELOG.md)** → Identificar versão funcional atual
2. **USAR APENAS** arquivos listados na versão atual do CHANGELOG
3. **NUNCA** usar arquivos de `/archive/` (são obsoletos)
4. **CONSULTAR [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** → Evitar erros já resolvidos

---

## 🚨 **ERROS CRÍTICOS - NÃO REPETIR**

### **❌ CÁLCULO DE DURAÇÃO INCORRETO**
```python
❌ ERRO: duration_seconds = len(samples) / sr (samples processados)
✅ SOLUÇÃO: duration_seconds = nframes / sr (samples originais)
```

### **❌ ARQUIVO BACKEND INCORRETO**
```bash
❌ NUNCA: server-simple-real.js (obsoleto - ES modules error)
✅ SEMPRE: server-simple-real.cjs (funcional - CommonJS)
```

### **❌ UNICODE ESCAPE ERROR - PYTHON**
```python
❌ ERRO: "C:\Users\Denys\..." (Windows paths em docstring)
✅ SOLUÇÃO: "C:/Users/Denys/..." (Forward slashes)
```

### **❌ SPAWN SHELL ISSUES**
```javascript
❌ ERRO: spawn('blender.exe', args, { shell: true })
✅ SOLUÇÃO: spawn('C:\\Blender\\blender.exe', args, { shell: false })
```

### **❌ ARQUIVOS OBSOLETOS**
```bash
❌ NUNCA usar: /archive/, /_rollback_backups/, /archived-tests/
✅ SEMPRE usar: Apenas arquivos listados no CHANGELOG atual
```

---

## ✅ **VERSÃO ATUAL: V1.4.0.a.5**

### **📁 ARQUIVOS ATIVOS (ÚNICOS PERMITIDOS)**
```
3d_visualizer/
├── server-simple-real.cjs           # ✅ Backend (NÃO .js!)
├── test-simple-real.html            # ✅ Interface
├── start-simple-real.bat            # ✅ Script inicialização
├── package.json                     # ✅ Dependências  
├── Blender/
│   ├── render_audio_visualizer.py   # ✅ Script Python
│   ├── template.blend               # ✅ Template 3D
│   ├── sample_audio2.wav            # ✅ Teste áudio
│   └── sample_cover.jpg             # ✅ Teste imagem
└── uploads/                         # ✅ Output directory
```

### **⚠️ PROBLEMA ATUAL**
- **Status**: MP4 gerado MAS duração incorreta (dobro do áudio)
- **Causa**: Cálculo de duração usando len(samples) ao invés de nframes
- **Próximo**: Corrigir fórmula duration_seconds = nframes / sr

---

## 🤖 **PROTOCOLO PARA AGENTES IA**

### **✅ SEMPRE FAZER**
1. **Consultar CHANGELOG primeiro** → Usar arquivos exatos da versão atual
2. **Testar cada mudança** → Validar funcionamento imediato
3. **Partir de base funcional** → Não reinventar o que já funciona
4. **Documentar em tempo real** → Atualizar docs após sucesso

### **❌ NUNCA FAZER**
1. **Usar arquivos de /archive/** → São obsoletos e causam erros
2. **Criar novas versões** → server-v2.js, backend-new.js, etc.
3. **Assumir funcionamento** → Sempre testar antes de continuar
4. **Ignorar documentação** → CHANGELOG é lei absoluta

### **🔧 QUANDO ALGO QUEBRA**
1. **PARAR** → Não fazer mais mudanças
2. **REVERTER** → Voltar para última versão funcional
3. **IDENTIFICAR** → O que causou o problema
4. **CORRIGIR** → Aplicar mudança mínima necessária

---

## 📋 **CHECKLIST RÁPIDO**

### **✅ ANTES DE COMEÇAR**
- [ ] Li CHANGELOG.md versão atual?
- [ ] Identifiquei arquivos permitidos?
- [ ] Verifiquei TROUBLESHOOTING.md?
- [ ] Sei qual é o problema específico?

### **✅ DURANTE DESENVOLVIMENTO**
- [ ] Usando apenas arquivos da versão atual?
- [ ] Testando cada mudança imediatamente?
- [ ] Aplicando correção mínima necessária?
- [ ] Documentando progresso?

### **✅ APÓS SUCESSO**
- [ ] Sistema funciona 100%?
- [ ] CHANGELOG.md atualizado?
- [ ] Arquivos obsoletos arquivados?
- [ ] Problema adicionado ao TROUBLESHOOTING?

---

## 🎯 **DIRETÓRIO OFICIAL ATUAL**
```
C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\
```

**Base Sólida**: V1.4.0.a.4 (MP4 gerado com sucesso)  
**Meta Atual**: V1.4.0.a.5 (Integrar áudio no MP4)  
**Arquivos Base**: Listados no CHANGELOG.md V1.4.0.a.5

---

## 🚀 **RESULTADO ESPERADO**
**ELIMINAÇÃO COMPLETA DE ERROS REPETITIVOS** através de:
1. **Base sólida preservada** → Sempre partir de versão funcional
2. **Arquivos consistentes** → Usar mesma base entre agentes
3. **Problemas documentados** → Não repetir erros resolvidos
4. **Evolução linear** → Sem loops infinitos de debug

**NEXT**: Resolver áudio V1.4.0.a.5 usando base V1.4.0.a.4 + correções AAC
