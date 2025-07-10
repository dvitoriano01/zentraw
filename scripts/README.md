# Sistema de Atualização Automática de Versão

Este sistema automatiza a atualização dos labels das tasks do VS Code baseado na versão atual do projeto Zentraw.

## 🎯 Funcionalidades

- **Detecção automática de versão**: Analisa múltiplos arquivos para detectar a versão atual
- **Atualização automática de tasks**: Atualiza os labels das tasks do VS Code
- **Integração com Git**: Hooks pre-commit para manter tudo sincronizado
- **Configuração flexível**: Arquivo de configuração para personalizar comportamento

## 📁 Arquivos

```
scripts/
├── update-version.js      # Script principal Node.js
├── update-version.bat     # Script para Windows
├── update-version.sh      # Script para Unix/Linux
├── version-config.json    # Configuração do sistema
└── README.md             # Esta documentação
```

## 🚀 Como Usar

### Execução Manual

**Windows:**
```cmd
cd zentraw
scripts\update-version.bat
```

**Unix/Linux:**
```bash
cd zentraw
./scripts/update-version.sh
```

**Diretamente com Node.js:**
```bash
node scripts/update-version.js
```

### Execução via VS Code

1. Pressione `Ctrl+Shift+P` (ou `Cmd+Shift+P` no Mac)
2. Digite "Tasks: Run Task"
3. Selecione "Update Version Labels"

### Execução Automática

O sistema é configurado para executar automaticamente:
- **Pre-commit hook**: Antes de cada commit
- **Durante o desenvolvimento**: Sempre que necessário

## ⚙️ Configuração

O arquivo `version-config.json` permite personalizar:

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

## 🔍 Detecção de Versão

O sistema analisa os seguintes arquivos (em ordem de prioridade):

1. `docs/v1.3.0.c.9/DEVELOPMENT_PLAN.md`
2. `docs/v1.3.0.c.9/ZOOM_SYSTEM_PHOTOSHOP.md`
3. `client/src/pages/PhotoEditorFixed.tsx`
4. `docs/versioning/VERSION_LOG.md`

### Padrões de Versão Reconhecidos

- `v1.3.0.c.9`
- `version: "1.3.0.c.9"`
- `Zentraw v1.3.0.c.9`

## 🔄 Fluxo de Trabalho

1. **Desenvolvimento**: Trabalhe normalmente no código
2. **Commit**: O hook pre-commit executará automaticamente
3. **Sincronização**: Tasks e package.json serão atualizados
4. **Verificação**: Labels das tasks refletirão a versão atual

## 🛠️ Solução de Problemas

### Erro "Script não encontrado"

Certifique-se de que Node.js está instalado:
```bash
node --version
```

### Erro de permissão (Unix/Linux)

Dê permissão de execução:
```bash
chmod +x scripts/update-version.sh
```

### Tasks não atualizadas

Execute manualmente:
```bash
node scripts/update-version.js
```

## 📋 Logs

O sistema mantém logs em `scripts/version-update.log` para debugging.

## 🎉 Benefícios

- ✅ **Automação completa**: Sem necessidade de atualização manual
- ✅ **Consistência**: Versões sempre sincronizadas
- ✅ **Flexibilidade**: Configuração personalizada
- ✅ **Integração**: Funciona com workflow Git
- ✅ **Confiabilidade**: Detecta versão de múltiplas fontes

## 📝 Exemplo de Uso

Quando você atualiza a versão no código de `v1.3.0.c.9` para `v1.3.0.c.10`, o sistema automaticamente:

1. Detecta a nova versão
2. Atualiza task "Build" para: `Build Zentraw FREEPIK FONTS ROBUSTAS v1.3.0.c.10`
3. Atualiza task "Dev" para: `Start Zentraw Frontend with FREEPIK FONTS v1.3.0.c.10`
4. Atualiza package.json se necessário
5. Registra as mudanças no log

---

**Autor**: Sistema automático Zentraw  
**Versão**: v1.3.0.c.9  
**Data**: 2025-01-08
