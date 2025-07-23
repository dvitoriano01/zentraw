# 📋 ZENTRAW V1.4.0.a.2 - GUIA COMPLETO DE TASKS

## 🎯 **TASKS ATUALIZADAS - VERSÃO OFICIAL**

### 📁 **Localização**: `.vscode/tasks.json`

---

## 🚀 **TASKS PRINCIPAIS**

### 1. **🚀 Start Zentraw Backend V1.4.0.a.2**

- **Função**: Inicia o servidor backend na porta 5001
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🚀 Start Zentraw Backend V1.4.0.a.2`
- **Script**: `npm run dev:back` (tsx server/backend-only.ts)
- **Porta**: `http://localhost:5001`
- **Background**: Sim (processo contínuo)

### 2. **🎨 Start Zentraw Frontend V1.4.0.a.2**

- **Função**: Inicia o servidor frontend Vite na porta 5173
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🎨 Start Zentraw Frontend V1.4.0.a.2`
- **Script**: `npm run dev:front` (vite)
- **Porta**: `http://localhost:5173`
- **Background**: Sim (processo contínuo)

### 3. **🏗️ Build Zentraw V1.4.0.a.2**

- **Função**: Compila o projeto para produção
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🏗️ Build Zentraw V1.4.0.a.2`
- **Script**: `npm run build`
- **Background**: Não (processo único)

---

## 🔧 **TASKS DE CONTROLE**

### 4. **🛑 Stop All Node Processes**

- **Função**: Para todos os processos Node.js
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🛑 Stop All Node Processes`
- **Script**: `taskkill /F /IM node.exe /T`
- **Background**: Não

### 5. **🔄 Restart Backend V1.4.0.a.2 (Complete)**

- **Função**: Reinicia o backend completamente
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🔄 Restart Backend V1.4.0.a.2 (Complete)`
- **Script**: Para processos + timeout + reinicia backend
- **Background**: Sim

---

## 🧪 **TASKS DE TESTE**

### 6. **🔍 Test Backend Connection**

- **Função**: Testa conexão com backend (health + blender test)
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🔍 Test Backend Connection`
- **Endpoints**: `/health` e `/api/blender/test`
- **Background**: Não

### 7. **🧪 Debug Blender System**

- **Função**: Executa debug completo do sistema Blender
- **Comando**: `Ctrl+Shift+P` → `Tasks: Run Task` → `🧪 Debug Blender System`
- **Endpoint**: `/api/blender/debug`
- **Background**: Não

---

## 🎮 **COMO USAR AS TASKS**

### **Método 1: Command Palette**

1. Pressione `Ctrl+Shift+P`
2. Digite: `Tasks: Run Task`
3. Selecione a task desejada

### **Método 2: Menu Terminal**

1. Vá em `Terminal` → `Run Task...`
2. Selecione a task desejada

### **Método 3: Keyboard Shortcut**

1. Pressione `Ctrl+Shift+P`
2. Digite: `Tasks: Configure Task`
3. Adicione keybindings personalizados

---

## 🔄 **FLUXO DE TRABALHO RECOMENDADO**

### **Desenvolvimento Normal:**

1. `🚀 Start Zentraw Backend V1.4.0.a.2`
2. `🎨 Start Zentraw Frontend V1.4.0.a.2`
3. `🔍 Test Backend Connection`

### **Quando há Problemas:**

1. `🛑 Stop All Node Processes`
2. `🔄 Restart Backend V1.4.0.a.2 (Complete)`
3. `🧪 Debug Blender System`

### **Para Produção:**

1. `🛑 Stop All Node Processes`
2. `🏗️ Build Zentraw V1.4.0.a.2`

---

## 📊 **CONFIGURAÇÕES TÉCNICAS**

### **Apresentação Visual:**

- **Echo**: Mostra comandos executados
- **Reveal**: Sempre mostra o terminal
- **Panel**: Dedicado para processos background
- **Clear**: Limpa terminal antes de executar

### **Diretório de Trabalho:**

- **Base**: `${workspaceFolder}`
- **Execução**: `TemplateLibraryBuilder/`

### **Problem Matchers:**

- **TypeScript**: `$tsc` para detecção de erros
- **Geral**: `[]` para logs limpos

---

## 🚨 **IMPORTANTES**

### **❌ NÃO USAR TASKS ANTIGAS:**

- ~~`Build Zentraw FREEPIK FONTS ROBUSTAS v1.3.0.c.3`~~
- ~~`Start Zentraw Frontend with FREEPIK FONTS v1.3.0.c.4`~~

### **✅ USAR APENAS TASKS V1.4.0.a.2:**

- Todas as tasks têm emojis identificadores
- Nomes claros e específicos
- Configurações otimizadas

---

## 📋 **SCRIPTS NPM CORRESPONDENTES**

```json
{
  "dev": "set NODE_ENV=development && tsx server/index.ts",
  "dev:back": "set NODE_ENV=development && tsx server/backend-only.ts",
  "dev:front": "vite",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "set NODE_ENV=production && node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

---

## 🌐 **ENDPOINTS DISPONÍVEIS**

### **Backend (localhost:5001):**

- `GET /health` - Health check
- `GET /api/blender/test` - Teste do Blender
- `GET /api/blender/debug` - Debug completo
- `POST /api/blender/preview` - Gerar preview
- `POST /api/blender/render` - Render completo

### **Frontend (localhost:5173):**

- Interface do usuário
- Proxy para backend nas rotas `/api/*`

---

**🔄 Última Atualização**: 17/07/2025
**📝 Versão**: V1.4.0.a.2
**👨‍💻 Autor**: Zentraw Development Team
