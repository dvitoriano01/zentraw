# ZENTRAW - Troubleshooting Guide V1.4.0.a.2

## 🚨 Problemas Comuns e Soluções

### 1. ERR_MODULE_NOT_FOUND
**Sintomas:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module './blender-service.js'
```

**Solução:**
```json
// package.json - ANTES
"blender:super": "node scripts/zentraw-super-script.js"

// package.json - DEPOIS
"blender:super": "npx tsx scripts/zentraw-super-script.js"
```

**Status:** ✅ RESOLVIDO

---

### 2. "All methods failed" (Erro Genérico)
**Sintomas:**
```
{success: false, error: 'All methods failed'}
```

**Problema:** Sistema antigo não fornecia detalhes específicos dos erros.

**Solução:** Implementação do BlenderServiceRobust
```typescript
// Sistema antigo
return { success: false, error: 'All methods failed' };

// Sistema novo
return { 
  success: false, 
  error: 'All methods failed - sistema de fallback esgotado',
  detailedLog: [
    'EEVEE_ORIGINAL: Engine not supported',
    'CYCLES: GPU not compatible', 
    'WORKBENCH: Driver issue'
  ]
};
```

**Status:** ✅ RESOLVIDO

---

### 3. Backend/Frontend Port Mismatch
**Sintomas:**
```
POST http://localhost:5174/api/blender/preview 500 (Internal Server Error)
```

**Problema:** Backend na porta 5001, frontend esperando 5000.

**Solução:**
```typescript
// backend-only.ts - ANTES
const PORT = process.env.PORT || 5001;

// backend-only.ts - DEPOIS  
const PORT = process.env.PORT || 5000;
```

**Status:** ✅ RESOLVIDO

---

### 4. Proxy Configuration Issues
**Sintomas:**
```
🔴 Proxy error: ECONNREFUSED
```

**Solução:**
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      timeout: 30000, // Adicionar timeout
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          console.error('🔴 Proxy error:', err.message);
          if (!res.headersSent) {
            res.writeHead(503, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Backend unavailable'}));
          }
        });
      }
    }
  }
}
```

**Status:** ✅ RESOLVIDO

---

### 5. Backend Não Carrega Código Atualizado
**Sintomas:**
- Endpoint `/test-robust` retorna 404
- Logs antigos ainda aparecem
- Mudanças no código não refletem

**Diagnóstico:**
```bash
# Verificar se endpoint existe
curl http://localhost:5000/api/blender/test-robust

# Verificar processos
netstat -ano | findstr ":5000"
```

**Solução:**
```bash
# 1. Parar backend manualmente
Ctrl+C (no terminal do backend)

# 2. Verificar se porta foi liberada
netstat -ano | findstr ":5000"

# 3. Matar processos persistentes
taskkill /F /IM node.exe
taskkill /F /IM tsx.exe

# 4. Reiniciar
npm run dev:back
```

**Status:** ⚠️ EM ANDAMENTO

---

### 6. Blender Engine Compatibility
**Sintomas:**
```
❌ Method EEVEE_ORIGINAL failed: Engine 'BLENDER_EEVEE' not supported
```

**Problema:** Diferentes versões do Blender têm nomes de engines diferentes.

**Solução - Sistema de Fallback:**
```typescript
const engines = [
  'BLENDER_EEVEE',    // Blender 4.0+
  'EEVEE',            // Blender 3.x
  'CYCLES',           // Universal
  'BLENDER_WORKBENCH' // Fallback leve
];
```

**Status:** ✅ IMPLEMENTADO

---

### 7. Permission Issues (Windows)
**Sintomas:**
```
❌ No write permissions for output directory
```

**Diagnóstico:**
```typescript
// Teste de permissões
try {
  fs.accessSync(path.dirname(outputPath), fs.constants.W_OK);
  console.log('✅ Write permissions OK');
} catch (err) {
  console.error('❌ No write permissions');
}
```

**Solução:**
```bash
# Executar como administrador ou ajustar permissões
icacls "C:\path\to\directory" /grant Users:F
```

---

### 8. Blender Script Execution Timeout
**Sintomas:**
```
Script execution timeout after 30s
```

**Solução:**
```typescript
// Aumentar timeout e adicionar heartbeat
const blenderProcess = spawn(BLENDER_PATH, args, {
  stdio: ['pipe', 'pipe', 'pipe'],
  timeout: 60000 // 60 segundos
});

// Heartbeat no script Python
print("HEARTBEAT: Still rendering...")
```

---

### 9. Template File Not Found
**Sintomas:**
```
❌ Template file not found: template.blend
```

**Diagnóstico:**
```typescript
const templatePath = BLENDER_PATHS.TEMPLATE_PATH;
console.log('Template path:', templatePath);
console.log('Template exists:', fs.existsSync(templatePath));
```

**Solução:**
```typescript
// Fallback para cena mínima
if (!fs.existsSync(templatePath)) {
  console.log('⚠️ Template not found, using minimal scene');
  return this.executeMinimalScene(outputPath);
}
```

---

### 10. Memory Issues (Large Renders)
**Sintomas:**
```
💥 Process killed: Out of memory
```

**Solução:**
```typescript
// Reduzir resolução para preview
bpy.context.scene.render.resolution_x = 960  // Ao invés de 1920
bpy.context.scene.render.resolution_y = 540  // Ao invés de 1080
bpy.context.scene.render.resolution_percentage = 50
```

## 🔧 Ferramentas de Diagnóstico

### Quick Health Check
```bash
# Verificação rápida do sistema
echo "=== ZENTRAW HEALTH CHECK ==="
echo "Backend:" && curl -s http://localhost:5000/api/blender/test
echo "Sistema Robusto:" && curl -s http://localhost:5000/api/blender/test-robust
echo "Portas:" && netstat -ano | findstr ":5000"
```

### Detailed Diagnostics
```powershell
# PowerShell - Diagnóstico completo
$endpoints = @(
  "http://localhost:5000/api/blender/test",
  "http://localhost:5000/api/blender/test-robust"
)

foreach ($endpoint in $endpoints) {
  try {
    $response = Invoke-RestMethod -Uri $endpoint
    Write-Host "✅ $endpoint" -ForegroundColor Green
  } catch {
    Write-Host "❌ $endpoint - $($_.Exception.Message)" -ForegroundColor Red
  }
}
```

### Log Analysis
```bash
# Filtrar logs importantes
npm run dev:back 2>&1 | findstr /C:"SISTEMA ROBUSTO" /C:"ERROR" /C:"SUCESSO"
```

## 📋 Checklist de Resolução

### Quando o Sistema Não Funciona:

1. **[ ]** Backend está rodando na porta 5000?
   ```bash
   netstat -ano | findstr ":5000"
   ```

2. **[ ]** Código foi atualizado e backend reiniciado?
   ```bash
   # Parar: Ctrl+C
   # Reiniciar: npm run dev:back
   ```

3. **[ ]** Endpoint de teste responde?
   ```bash
   curl http://localhost:5000/api/blender/test-robust
   ```

4. **[ ]** Blender está instalado e acessível?
   ```bash
   "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" --version
   ```

5. **[ ]** Permissões de escrita estão OK?
   ```typescript
   fs.accessSync(outputDir, fs.constants.W_OK);
   ```

6. **[ ]** Template.blend existe?
   ```typescript
   fs.existsSync(BLENDER_PATHS.TEMPLATE_PATH);
   ```

7. **[ ]** Logs detalhados aparecem no console?
   ```
   🔥 SISTEMA ROBUSTO INICIADO - Testando 5 métodos...
   ```

## 🚀 Recovery Procedures

### Procedimento 1: Reset Completo
```bash
# 1. Parar tudo
taskkill /F /IM node.exe
taskkill /F /IM tsx.exe

# 2. Limpar cache
npm cache clean --force

# 3. Reinstalar dependências
npm install

# 4. Verificar compilação
npx tsc --noEmit

# 5. Reiniciar
npm run dev:back
```

### Procedimento 2: Rollback para Versão Funcional
```bash
# Git rollback para último commit funcional
git log --oneline -10
git checkout <commit-hash>

# Teste
npm run dev:back
```

### Procedimento 3: Debug Mode
```bash
# Ativar debug verbose
set DEBUG=zentraw:*
npm run dev:back
```

---

**Última Atualização:** 18/01/2025  
**Versão:** V1.4.0.a.2  
**Próxima Revisão:** Após testes da próxima sessão
