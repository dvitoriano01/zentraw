# 🚨 ZENTRAW V1.4.0.a.2 - TASKS CORRETAS

## 📋 Tasks Atualizadas para 3D Visualizer

### ✅ Tasks Corretas (arquivo: `.vscode/tasks.json`)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Zentraw Backend V1.4.0",
      "type": "shell",
      "command": "cd TemplateLibraryBuilder && npm run dev:back",
      "group": "build",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Stop All Node Processes",
      "type": "shell",
      "command": "taskkill /F /IM node.exe",
      "group": "build",
      "isBackground": false,
      "problemMatcher": []
    },
    {
      "label": "Restart Backend V1.4.0",
      "type": "shell",
      "command": "cd TemplateLibraryBuilder && taskkill /F /IM node.exe & timeout 2 & npm run dev:back",
      "group": "build",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Start Zentraw Frontend V1.4.0",
      "type": "shell",
      "command": "cd TemplateLibraryBuilder && npm run dev:front",
      "group": "build",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Build Zentraw V1.4.0",
      "type": "shell",
      "command": "cd TemplateLibraryBuilder && npm run build",
      "group": "build",
      "isBackground": false,
      "problemMatcher": ["$tsc"]
    }
  ]
}
```

## 🔧 Como Usar

### Backend:
- **Iniciar**: `Ctrl+Shift+P` → `Tasks: Run Task` → `Start Zentraw Backend V1.4.0`
- **Parar**: `Ctrl+Shift+P` → `Tasks: Run Task` → `Stop All Node Processes`
- **Reiniciar**: `Ctrl+Shift+P` → `Tasks: Run Task` → `Restart Backend V1.4.0`

### Frontend:
- **Iniciar**: `Ctrl+Shift+P` → `Tasks: Run Task` → `Start Zentraw Frontend V1.4.0`

### Build:
- **Construir**: `Ctrl+Shift+P` → `Tasks: Run Task` → `Build Zentraw V1.4.0`

## 🚨 Scripts NPM Corretos

### Backend (`npm run dev:back`):
```bash
set NODE_ENV=development && tsx server/backend-only.ts
```

### Frontend (`npm run dev:front`):
```bash
vite
```

### Build (`npm run build`):
```bash
vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

## 📍 Diretório de Trabalho

**SEMPRE trabalhar em**: `c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder\`

## 🔍 Verificação do Sistema

### Portas:
- **Backend**: `http://localhost:5001`
- **Frontend**: `http://localhost:5173`

### Endpoints de Debug:
- **Health**: `GET /health`
- **Blender Test**: `GET /api/blender/test`
- **Debug**: `GET /api/blender/debug`

---

**⚠️ IMPORTANTE**: As tasks antigas mencionadas no workspace info estão desatualizadas. Sempre usar as tasks definidas no arquivo `.vscode/tasks.json` atual.
