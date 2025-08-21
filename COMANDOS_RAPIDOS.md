# 🚀 ZENTRAW V1.4.0.a.2 - COMANDOS RÁPIDOS

## ▶️ PARA INICIAR O SISTEMA:

### 1. Abrir Terminal e executar:
```bash
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"
start-simple-real.bat
```

### 2. O VS Code Simple Browser já foi aberto com a interface!
- Se não abriu, use: Ctrl+Shift+P → "Simple Browser: Show"
- URL: `file:///C:/Users/Denys%20Victoriano/Documents/GitHub/clone/zentraw/TemplateLibraryBuilder/test-simple-real.html`

## 🔧 COMANDOS CORRETOS:

### ✅ CORRETO:
```bash
start-simple-real.bat
```

### ❌ INCORRETO (arquivo não existe):
```bash
start-backend.bat
```

## 🎯 PASSO A PASSO SIMPLES:

1. **Copy/Paste este comando no terminal:**
   ```
   cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder" && start-simple-real.bat
   ```

2. **A interface já está aberta no Simple Browser do VS Code**

3. **Teste a conexão:**
   - Clique em "🔗 TEST SIMPLE CONNECTION"
   - Se aparecer "Connected ✅", está funcionando!

4. **Teste o Blender:**
   - Upload um arquivo de áudio
   - Upload um arquivo de imagem  
   - Clique "🔥 EXECUTE SIMPLE REAL BLENDER"

## 🆘 SE DER ERRO:

### Erro: "Backend server not available"
```bash
# Verificar se o backend está rodando:
netstat -an | findstr ":3004"

# Se não estiver, executar:
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"
npx tsx server-simple-real.js
```

### Erro: "start-simple-real.bat not found"
```bash
# Verificar se o arquivo existe:
dir start-simple-real.bat

# Se não existir, está na pasta errada
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"
```

## 🎉 SUCESSO = LOGS REAIS DO BLENDER

Se funcionar, você verá logs como:
```
🎬 Starting Blender process...
📊 Blender stdout: [logs reais do Blender]
🏁 Blender process exited with code: 0
```

**NÃO** logs fake como "SUCCESS with CROSS_SPAWN"!
