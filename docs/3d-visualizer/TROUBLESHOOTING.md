# 3D Visualizer - Troubleshooting Guide

## Problemas Comuns e Soluções

### 🔧 Backend Issues

#### Problema: "Error: listen EADDRINUSE: address already in use 0.0.0.0:5000"
**Causa**: Processo Node.js anterior ainda rodando na porta 5000

**Soluções**:
```bash
# Opção 1: Matar todos os processos Node.js
taskkill /F /IM node.exe

# Opção 2: Encontrar processo específico
netstat -ano | findstr :5000
taskkill /F /PID [PID_NUMBER]

# Opção 3: Usar PowerShell
powershell "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
```

#### Problema: "Backend server not available"
**Causa**: Backend não está rodando ou porta incorreta

**Diagnóstico**:
1. Verificar se backend está rodando: `http://localhost:5001/api/blender/test`
2. Checar logs do terminal do backend
3. Verificar configuração de proxy no `vite.config.ts`

**Solução**:
```bash
cd TemplateLibraryBuilder
npm run dev:back
```

---

### 🎨 Blender Issues

#### Problema: "enum 'BLENDER_EEVEE' not found"
**Status**: ✅ **RESOLVIDO**

**Causa**: Versão nova do Blender removeu `BLENDER_EEVEE`

**Solução Aplicada**:
```typescript
// Em blender-service.ts linha 278
// ANTES:
bpy.context.scene.render.engine = 'BLENDER_EEVEE'

// DEPOIS:
bpy.context.scene.render.engine = 'BLENDER_EEVEE_NEXT'
```

#### Problema: "Template file not found"
**Causa**: Caminho incorreto para template.blend

**Verificação**:
```bash
# Verificar se arquivo existe
dir "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder\Blender\template.blend"
```

**Solução**: Verificar `BLENDER_PATHS` em `blender-paths.ts`

#### Problema: "Blender not found"
**Causa**: Blender não instalado ou não no PATH

**Soluções**:
1. Instalar Blender: https://www.blender.org/download/
2. Adicionar ao PATH do sistema
3. Verificar caminho em `BLENDER_PATHS.BLENDER_EXE`

---

### 🖼️ Image Loading Issues

#### Problema: "GET http://localhost:5176/api/blender/download/preview_[id].png 404"
**Status**: ❌ **PROBLEMA ATIVO**

**Causa**: Proxy do Vite não funciona para elementos `<img>` e fetch diretos

**Análise**:
- Backend gera arquivo corretamente ✅
- API retorna URL correta ✅  
- Vite proxy configurado ✅
- Frontend tenta carregar na porta errada ❌

**Tentativas Realizadas**:
1. ✅ Configuração de proxy para porta 5001
2. ✅ CORS multi-origin
3. ✅ Fetch + blob URL implementation
4. ❌ Ainda falha com 404

**Próximas Soluções a Testar**:
```typescript
// Opção 1: URL absoluta para backend
const imageUrl = `http://localhost:5001${result.previewUrl}`;

// Opção 2: Base64 encoding no backend
return { success: true, imageBase64: base64String };

// Opção 3: Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));
```

---

### ⚡ Development Issues

#### Problema: TSX não detecta mudanças no código
**Causa**: Cache do TSX não invalidado

**Soluções**:
```bash
# Opção 1: Restart manual
Ctrl+C no terminal do backend
npm run dev:back

# Opção 2: Kill all processes
taskkill /F /IM node.exe
npm run dev:back

# Opção 3: Modificar arquivo para trigger
# Adicionar comentário ou espaço no código
```

#### Problema: "Port 5173 is in use, trying another one"
**Causa**: Vite muda portas automaticamente

**Impacto**: CORS e proxy podem falhar com portas dinâmicas

**Soluções**:
1. **Temporária**: Atualizar CORS para novas portas
2. **Permanente**: Fixar porta do Vite
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5173,
    strictPort: true // Falha se porta ocupada
  }
})
```

---

### 🔄 Proxy & CORS Issues

#### Problema: CORS blocked
**Verificação**:
```javascript
// Browser DevTools Console
fetch('/api/blender/test')
  .then(r => r.json())
  .then(console.log)
```

**Solução**: Verificar CORS no backend
```typescript
// backend-only.ts
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'http://localhost:5176'  // Adicionar nova porta
];
```

#### Problema: Proxy não funciona
**Diagnóstico**:
1. Verificar configuração em `vite.config.ts`
2. Testar URL diretamente: `http://localhost:5001/api/blender/test`
3. Verificar logs do Vite para proxy errors

**Configuração Atual**:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
    secure: false,
    configure: (proxy, options) => {
      proxy.on('error', (err, req, res) => {
        console.log('Proxy error:', err.message);
      });
    }
  }
}
```

---

### 📁 File Upload Issues

#### Problema: "Audio file missing" ou "Image file missing"
**Causa**: Multer não configurado corretamente ou arquivos não enviados

**Verificação**:
```javascript
// Frontend - verificar FormData
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('image', imageFile);
console.log('FormData entries:', [...formData.entries()]);
```

**Configuração Multer**:
```typescript
const upload = multer({ 
  dest: 'uploads/blender/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
```

---

### 🚀 Performance Issues

#### Problema: Render muito lento (>10s)
**Causas Possíveis**:
1. Blender não usando GPU
2. Resolução muito alta
3. Template complexo demais

**Otimizações**:
```python
# GPU rendering (se disponível)
bpy.context.scene.render.engine = 'CYCLES'
bpy.context.scene.cycles.device = 'GPU'

# Preview resolution menor
bpy.context.scene.render.resolution_percentage = 50
```

**Tempos Atuais**: ~2.5s (excelente performance)

---

### 🔍 Debug Tools

#### Backend Debugging
```bash
# Logs detalhados
NODE_ENV=development npm run dev:back

# Verificar arquivos gerados
dir TemplateLibraryBuilder\uploads\blender\
```

#### Frontend Debugging
```javascript
// Browser DevTools
localStorage.setItem('debug', 'true');

// Network tab para verificar requests
// Console para logs detalhados
```

#### Blender Debugging
```python
# Adicionar ao script Python
print(f"Template loaded: {bpy.data.filepath}")
print(f"Objects in scene: {[obj.name for obj in bpy.data.objects]}")
print(f"Render engine: {bpy.context.scene.render.engine}")
```

---

### 📋 Checklist de Diagnóstico

Quando algo não funciona, seguir esta ordem:

1. **✅ Backend rodando?**
   - `curl http://localhost:5001/api/blender/test`

2. **✅ Frontend conectando?**
   - Browser DevTools > Network > Verificar requests

3. **✅ Arquivos existem?**
   - Template.blend, uploads directory, Blender executável

4. **✅ Blender executa?**
   - Logs do backend para erros Python

5. **✅ Arquivos gerados?**
   - Verificar `uploads/blender/` para preview files

6. **✅ Proxy funcionando?**
   - Testar URLs diretas vs. proxy

---

### 🆘 Emergency Reset

Se tudo falhar, reset completo:

```bash
# 1. Matar todos os processos
taskkill /F /IM node.exe

# 2. Limpar uploads
rmdir /S TemplateLibraryBuilder\uploads\blender
mkdir TemplateLibraryBuilder\uploads\blender

# 3. Reinstalar dependências
cd TemplateLibraryBuilder
npm install

# 4. Restart clean
npm run dev:back
# Em outro terminal:
npm run dev:front
```

**Status Esperado Após Reset**:
- Backend: ✅ Rodando na porta 5001
- Frontend: ✅ Rodando em porta dinâmica
- Blender: ✅ Executa e gera previews
- Images: ❌ Ainda problema de proxy (known issue)

---

### 📞 Suporte

**Documentação Relacionada**:
- [README Principal](./README.md)
- [Log de Desenvolvimento](./DEVELOPMENT_LOG.md)
- [Especificações Técnicas](./TECHNICAL_SPECS.md)

**Logs Importantes**:
- Backend: Terminal onde `npm run dev:back` está rodando
- Frontend: Browser DevTools Console
- Blender: Logs Python no terminal do backend

---

### Problema: Caminhos com Espaços
**Causa**: Caminhos contendo espaços não são tratados corretamente em comandos do sistema ou scripts.

**Solução**:
- Sempre envolver caminhos em aspas duplas (") ao passá-los como argumentos.
- Exemplo:
```bash
"C:\\Users\\Denys Victoriano\\Documents\\GitHub\\clone\\zentraw\\TemplateLibraryBuilder\\Blender\\template.blend"
```
