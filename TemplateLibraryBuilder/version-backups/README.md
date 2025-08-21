# 📁 SISTEMA DE VERSIONAMENTO ZENTRAW - ARQUIVOS POR VERSÃO

## 🎯 **OBJETIVO**

Manter cópias dos arquivos alterados para cada versão, permitindo rollback preciso e evitando regressões.

## 📋 **ESTRUTURA**

```
version-backups/
├── v1.3.0.c.1/
│   ├── PhotoEditorFixed.tsx
│   ├── TextPropertiesPanel.tsx
│   ├── ZentrawVersionManager.ts
│   └── version-info.json
├── v1.3.0.c.2/
│   ├── PhotoEditorFixed.tsx
│   ├── TextPropertiesPanel.tsx
│   └── version-info.json
├── v1.3.0.c.3/
│   ├── PhotoEditorFixed.tsx
│   ├── TextPropertiesPanel.tsx
│   ├── freepikFontsFixed.ts
│   ├── freepik-fonts.css
│   └── version-info.json
└── README.md (este arquivo)
```

## 🔧 **INSTRUÇÕES PARA AGENTES DEV**

### **ANTES DE FAZER ALTERAÇÕES:**

1. **Criar backup da versão atual:**

```bash
# Criar pasta da versão
mkdir version-backups/v[VERSION]

# Copiar arquivos alterados
copy client/src/pages/PhotoEditorFixed.tsx version-backups/v[VERSION]/
copy client/src/components/editor/TextPropertiesPanel.tsx version-backups/v[VERSION]/
copy client/src/utils/ZentrawVersionManager.ts version-backups/v[VERSION]/

# Outras dependências conforme necessário
copy client/src/constants/freepikFontsFixed.ts version-backups/v[VERSION]/
copy client/src/styles/freepik-fonts.css version-backups/v[VERSION]/
```

2. **Criar version-info.json:**

```json
{
  "version": "1.3.0.c.3",
  "timestamp": "2025-01-27T12:00:00Z",
  "description": "Sistema de fontes Freepik organizadas",
  "files": [
    "PhotoEditorFixed.tsx",
    "TextPropertiesPanel.tsx",
    "ZentrawVersionManager.ts",
    "freepikFontsFixed.ts",
    "freepik-fonts.css"
  ],
  "features": ["50+ fontes Freepik REAIS", "Organização estilo Photoshop"],
  "status": "stable|testing|experimental"
}
```

### **PARA FAZER ROLLBACK:**

1. **Identificar versão estável:**

```bash
# Listar versões disponíveis
dir version-backups

# Verificar info da versão
type version-backups/v[VERSION]/version-info.json
```

2. **Restaurar arquivos:**

```bash
# Copiar arquivos da versão escolhida
copy version-backups/v[VERSION]/* client/src/[paths]/

# Ou usar Git se disponível
git checkout [COMMIT_HASH] -- client/src/pages/PhotoEditorFixed.tsx
git checkout [COMMIT_HASH] -- client/src/components/editor/TextPropertiesPanel.tsx
```

3. **Verificar funcionamento:**

```bash
npm run dev:front
# Validar se está funcionando sem erros
```

### **ROLLBACK VIA GIT (PREFERENCIAL):**

1. **Ver histórico de commits:**

```bash
git log --oneline --graph -10
```

2. **Rollback completo para commit específico:**

```bash
# Ver mudanças desde commit funcional
git diff [COMMIT_HASH] HEAD

# Rollback suave (mantém working directory)
git reset --soft [COMMIT_HASH]

# Rollback completo (CUIDADO: perde mudanças)
git reset --hard [COMMIT_HASH]
```

3. **Rollback de arquivos específicos:**

```bash
git checkout [COMMIT_HASH] -- client/src/pages/PhotoEditorFixed.tsx
git checkout [COMMIT_HASH] -- client/src/components/editor/TextPropertiesPanel.tsx
```

## ⚠️ **PROTOCOLOS DE EMERGÊNCIA**

### **Se build quebrar:**

1. ✅ Verificar Problems tab no VS Code
2. ✅ Usar `git status` para ver mudanças
3. ✅ Rollback via Git para último commit funcional
4. ✅ Restaurar arquivos do version-backups se necessário

### **Se funcionalidade regredir:**

1. ✅ Marcar regressão no ZentrawVersionManager
2. ✅ Identificar última versão estável no version-backups
3. ✅ Fazer rollback completo
4. ✅ Documentar problema encontrado

## 🎯 **VERSÕES ESTÁVEIS CONHECIDAS**

- **v1.3.0.c.3**: Sistema Freepik funcionando + organização
- **v1.3.0.c.2**: Estado funcional básico
- **v1.3.0.c.1**: Versão inicial estável

---

**📋 REGRA DE OURO**: Sempre fazer backup antes de alterações e usar Git como fonte da verdade!
