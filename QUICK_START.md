# 🚀 ZENTRAW V1.4.0.a.2 - QUICK START

## 📋 **COMANDOS ESSENCIAIS**

### **🔧 Desenvolvimento:**
```bash
# Navegar para o projeto
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

# Instalar dependências
npm install

# Iniciar backend
npm run dev:back

# Iniciar frontend (novo terminal)
npm run dev:front
```

### **🧪 Testes:**
```bash
# Testar backend
curl http://localhost:5001/health

# Testar Blender
curl http://localhost:5001/api/blender/test

# Debug sistema
curl http://localhost:5001/api/blender/debug
```

### **🎯 Tasks VS Code:**
```
Ctrl+Shift+P → Tasks: Run Task → 🚀 Start Zentraw Backend V1.4.0.a.2
Ctrl+Shift+P → Tasks: Run Task → 🎨 Start Zentraw Frontend V1.4.0.a.2
```

---

## 🚨 **PROBLEMAS CONHECIDOS**

### **❌ Backend não inicia (CRÍTICO)**
- Processo não responde na porta 5001
- Possível erro de compilação TypeScript
- Dependências podem estar faltando

### **🔍 Diagnóstico:**
```bash
# Verificar compilação
tsc --noEmit

# Verificar dependências
npm install --force

# Testar tsx
tsx server/backend-only.ts
```

---

## 📚 **DOCUMENTAÇÃO COMPLETA**

### **📁 Versão Atual (V1.4.0.a.2):**
- **Guia de Tasks**: [/docs/v1.4.0.a.2/ZENTRAW_V1.4.0.a.2_TASKS_GUIA_COMPLETO.md](./docs/v1.4.0.a.2/ZENTRAW_V1.4.0.a.2_TASKS_GUIA_COMPLETO.md)
- **Log Técnico**: [/docs/technical/ZENTRAW_V1.4.0.a.2_TECHNICAL_LOG.md](./docs/technical/ZENTRAW_V1.4.0.a.2_TECHNICAL_LOG.md)
- **Código Completo**: [/docs/technical/ZENTRAW_V1.4.0.a.2_CODIGO_COMPLETO.md](./docs/technical/ZENTRAW_V1.4.0.a.2_CODIGO_COMPLETO.md)

### **📁 Versão Estável (V1.3.0.c.9):**
- **Bounding Box Analysis**: [/docs/v1.3.0.c.9/ZENTRAW_BOUNDING_BOX_ANALISE_COMPLETA.md](./docs/v1.3.0.c.9/ZENTRAW_BOUNDING_BOX_ANALISE_COMPLETA.md)
- **Workspace Optimization**: [/docs/v1.3.0.c.9/ZENTRAW_V1.3.0.c.9_WORKSPACE_OPTIMIZATION_COMPLETE.md](./docs/v1.3.0.c.9/ZENTRAW_V1.3.0.c.9_WORKSPACE_OPTIMIZATION_COMPLETE.md)
- **Layout Perfeito**: [/docs/v1.3.0.c.9/ZENTRAW_V1.3.0.c.18_LAYOUT_PERFEITO.md](./docs/v1.3.0.c.9/ZENTRAW_V1.3.0.c.18_LAYOUT_PERFEITO.md)

### **📁 Índice Geral:**
- **Documentação Principal**: [/docs/README.md](./docs/README.md)

---

**📅 Versão**: V1.4.0.a.2
**🎯 Status**: Backend Critical Issue
**📊 Progresso**: 25% Completo
