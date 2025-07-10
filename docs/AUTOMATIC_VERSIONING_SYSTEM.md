# 🤖 Sistema de Versionamento Automático Configurado!

## 🎯 Problema Resolvido

**ANTES**: Você precisava atualizar manualmente o label das tasks do VS Code toda vez que a versão mudava.

**AGORA**: O sistema detecta automaticamente mudanças de versão e atualiza tudo sozinho!

## 🔧 O que foi configurado:

### 1. **Script Principal** (`scripts/update-version.js`)
- Detecta versão atual analisando múltiplos arquivos
- Atualiza automaticamente o label das tasks
- Atualiza package.json se necessário

### 2. **Sistema de Watch** (`scripts/watch-version.js`)
- Monitora arquivos de versão em tempo real
- Executa atualizações automaticamente quando detecta mudanças
- Pode ser executado via VS Code Task

### 3. **Git Hook Pre-commit**
- Executa automaticamente antes de cada commit
- Garante que as tasks sempre estejam atualizadas
- Adiciona arquivos modificados ao commit automaticamente

### 4. **Tasks do VS Code**
- **"Update Version Labels"**: Atualização manual
- **"Watch Version Changes"**: Monitoramento automático
- **"Build Zentraw..."**: Sempre com versão atualizada
- **"Start Zentraw Frontend..."**: Sempre com versão atualizada

### 5. **Scripts de Conveniência**
- `scripts/update-version.bat` (Windows)
- `scripts/update-version.sh` (Unix/Linux)
- `scripts/setup.js` (Configuração inicial)

## 📋 Como usar:

### 🚀 Modo Automático (Recomendado)
Simplesmente trabalhe normalmente! O sistema:
1. Detecta quando você muda a versão no código
2. Atualiza automaticamente as tasks
3. Inclui as mudanças no próximo commit

### 🔄 Modo Manual
```bash
# Windows
scripts\update-version.bat

# Unix/Linux
./scripts/update-version.sh

# Node.js direto
node scripts/update-version.js
```

### 👀 Modo Watch
Via VS Code:
1. `Ctrl+Shift+P`
2. "Tasks: Run Task"
3. "Watch Version Changes"

### 🧪 Testando
```bash
# Testa se está funcionando
node scripts/update-version.js

# Deve mostrar:
# 🔄 Atualizando versão das tasks do VS Code...
# 📋 Versão atual detectada: v1.3.0.c.9
# ✅ Tasks já estão atualizadas para versão v1.3.0.c.9
```

## 🎯 Detecção de Versão

O sistema analisa estes arquivos (em ordem):

1. `docs/v1.3.0.c.9/DEVELOPMENT_PLAN.md`
2. `docs/v1.3.0.c.9/ZOOM_SYSTEM_PHOTOSHOP.md`
3. `client/src/pages/PhotoEditorFixed.tsx`
4. `docs/versioning/VERSION_LOG.md`

### Padrões reconhecidos:
- `v1.3.0.c.9`
- `version: "1.3.0.c.9"`
- `Zentraw v1.3.0.c.9`

## 🔧 Configuração Avançada

Edite `scripts/version-config.json` para personalizar:

```json
{
  "project": {
    "name": "Zentraw Photo Editor",
    "currentVersion": "v1.3.0.c.9",
    "versionFormat": "v1.3.0.c.{increment}",
    "autoIncrement": true
  },
  "tasks": {
    "build": {
      "labelTemplate": "Build Zentraw FREEPIK FONTS ROBUSTAS {version}",
      "enabled": true
    },
    "dev": {
      "labelTemplate": "Start Zentraw Frontend with FREEPIK FONTS {version}",
      "enabled": true
    }
  }
}
```

## 📁 Arquivos Criados/Modificados

```
zentraw/
├── scripts/
│   ├── update-version.js       # Script principal
│   ├── watch-version.js        # Sistema de watch
│   ├── setup.js               # Configuração inicial
│   ├── update-version.bat     # Script Windows
│   ├── update-version.sh      # Script Unix/Linux
│   ├── version-config.json    # Configuração
│   ├── package.json          # Dependências dos scripts
│   └── README.md             # Documentação
├── .vscode/
│   └── tasks.json            # Tasks atualizadas
├── .git/hooks/
│   └── pre-commit            # Hook Git
└── TemplateLibraryBuilder/
    └── package.json          # Script npm adicionado
```

## 🎉 Vantagens

- ✅ **Zero manutenção**: Nunca mais se preocupe com versões desatualizadas
- ✅ **Integração perfeita**: Funciona com seu workflow Git
- ✅ **Flexível**: Múltiplas formas de executar
- ✅ **Confiável**: Detecta versão de várias fontes
- ✅ **Transparente**: Logs claros de todas as operações

## 🆘 Solução de Problemas

### Script não executa
```bash
# Verificar Node.js
node --version

# Deve ser 16+ 
```

### Tasks não atualizam
```bash
# Executar manualmente
node scripts/update-version.js

# Verificar se .vscode/tasks.json foi modificado
git status
```

### Hook não funciona
```bash
# Verificar se o hook existe
ls -la .git/hooks/pre-commit

# Reconfigurar
node scripts/setup.js
```

## 🔄 Fluxo de Trabalho Típico

1. **Você desenvolve normalmente**
2. **Atualiza versão no código** (ex: v1.3.0.c.9 → v1.3.0.c.10)
3. **Faz commit**
4. **Hook pre-commit executa automaticamente**
5. **Tasks são atualizadas automaticamente**
6. **Commit inclui as atualizações**

**Resultado**: Sempre sincronizado, sem esforço manual!

---

**Status**: ✅ Configurado e funcionando  
**Versão**: v1.3.0.c.9  
**Data**: 2025-01-08  
**Autor**: Sistema Zentraw Automático
