# 🚨 ZENTRAW - TROUBLESHOOTING GUIDE

## 🎯 **PROBLEMAS RESOLVIDOS - NÃO REPETIR**

### **🔧 UNICODE ESCAPE ERROR - PYTHON SCRIPT**
**Problema**: `SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes`
```python
# ❌ ERRO (Windows path em docstring):
"""
Zentraw 3D Visualizer V1.4.0.a.5
Path: C:\Users\Denys Victoriano\Documents\...
"""

# ✅ SOLUÇÃO (Forward slashes):
"""
Zentraw 3D Visualizer V1.4.0.a.5  
Path: C:/Users/Denys Victoriano/Documents/...
"""
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.5
**Arquivo**: `render_audio_visualizer.py`

---

### **📁 WINDOWS PATH COM ESPAÇOS**
**Problema**: `Cannot read file 'C:\Users\Denys': No such file or directory`
```javascript
// ❌ ERRO (path sem aspas):
const args = [audio, image, output];

// ✅ SOLUÇÃO (caminhos absolutos):
const audioPath = path.resolve(audio);
const imagePath = path.resolve(image);  
const outputPath = path.resolve(output);
const args = [audioPath, imagePath, outputPath];
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.5
**Arquivo**: `server-simple-real.cjs`

---

### **🎵 DURAÇÃO INCORRETA DO VÍDEO**
**Problema**: Áudio 8s gerando vídeo 17s
```python
# ❌ ERRO (cálculo errado):
scene.frame_end = len(audio_data) // 1024

# ✅ SOLUÇÃO (baseado em duração real):
duration_seconds = len(audio_data) / sample_rate
scene.frame_end = int(duration_seconds * fps)
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.5
**Arquivo**: `render_audio_visualizer.py`

---

### **🔊 MP4 SEM ÁUDIO**
**Problem**: Vídeo gerado sem trilha sonora
```python
# ❌ FALTANDO (codec não configurado):
# Sem configuração de áudio

# ✅ SOLUÇÃO (codec AAC + H264):
scene.render.ffmpeg.audio_codec = 'AAC'
scene.render.ffmpeg.codec = 'H264'
```
**Status**: ⚠️ PARCIALMENTE RESOLVIDO em V1.4.0.a.5
**Arquivo**: `render_audio_visualizer.py`

---

### **⚡ SPAWN SHELL=TRUE ISSUES**
**Problema**: Execução inconsistente no Windows
```javascript
// ❌ ERRO (shell problemático):
spawn('blender.exe', args, { shell: true });

// ✅ SOLUÇÃO (executável direto):
spawn('C:\\Blender\\blender.exe', args, { shell: false });
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.4
**Arquivo**: `server-simple-real.cjs`

---

### **📦 ES MODULES VS COMMONJS**
**Problema**: `Cannot use import statement outside a module`
```javascript
// ❌ ERRO (import em .js):
import express from 'express';

// ✅ SOLUÇÃO (require em .cjs):
const express = require('express');
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.4
**Arquivo**: `server-simple-real.cjs`

---

### **🌐 CORS FRONTEND/BACKEND**
**Problema**: Interface não conecta com backend
```javascript
// ❌ ERRO (CORS não configurado):
app.listen(3004);

// ✅ SOLUÇÃO (CORS permissivo):
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
```
**Status**: ✅ RESOLVIDO em V1.4.0.a.4
**Arquivo**: `server-simple-real.cjs`

---

## 🔍 **DEBUGGING SISTEMÁTICO**

### **🎬 VERIFICAÇÃO BLENDER**
```bash
# 1. Verificar instalação
"C:\Blender\blender.exe" --version

# 2. Testar comando manual
"C:\Blender\blender.exe" --background "template.blend" --python "script.py"

# 3. Verificar arquivos necessários
dir Blender\template.blend
dir Blender\render_audio_visualizer.py
dir Blender\sample_audio2.wav
dir Blender\sample_cover.jpg
```

### **📁 VERIFICAÇÃO PATHS**
```javascript
// Sempre usar path.resolve() para caminhos absolutos
const audioPath = path.resolve(process.cwd(), audio);
console.log('Audio path resolved:', audioPath);

// Verificar se arquivo existe antes de usar
if (!fs.existsSync(audioPath)) {
    throw new Error(`File not found: ${audioPath}`);
}
```

### **🔧 VERIFICAÇÃO BACKEND**
```bash
# 1. Verificar porta disponível
netstat -an | findstr :3004

# 2. Testar conexão
curl http://localhost:3004/api/test

# 3. Verificar logs em tempo real
# Abrir terminal e executar: node server-simple-real.cjs
```

---

## 🚨 **PROBLEMAS ATIVOS (V1.4.0.a.5)**

### **🎵 ÁUDIO AUSENTE NO MP4**
**Sintoma**: MP4 gerado mas sem trilha sonora audível
**Possíveis Causas**:
1. Codec AAC não aplicado corretamente
2. Arquivo de áudio não incorporado ao render
3. Configuração FFmpeg incompleta

**Próximos Passos**:
- [ ] Verificar se `scene.render.ffmpeg.audio_codec = 'AAC'` está ativo
- [ ] Confirmar que arquivo de áudio é carregado no Blender
- [ ] Testar render com áudio via interface Blender manual

---

### **⏱️ SINCRONIA ÁUDIO/VÍDEO**  
**Sintoma**: Duração pode não estar perfeitamente sincronizada
**Possíveis Causas**:
1. FPS scene vs cálculo de frames
2. Sample rate interpretation  
3. Keyframe timing

**Próximos Passos**:
- [ ] Validar que `fps = scene.render.fps` está correto
- [ ] Confirmar sample_rate = 44100Hz
- [ ] Testar com áudios de durações diferentes

---

## ❌ **ERROS CRÍTICOS - REVERSÃO IMEDIATA**

### **🔴 SISTEMA NÃO GERA MP4**
**Ação**: Reverter para V1.4.0.a.4 (última versão funcional)
```bash
# Usar arquivos exatos da V1.4.0.a.4:
- server-simple-real.cjs (versão funcional)
- render_audio_visualizer.py (versão que gerava MP4)
- test-simple-real.html (interface validada)
```

### **🔴 MÚLTIPLOS BACKENDS CONFLITANTES**
**Ação**: Parar todos os processos e usar apenas um
```bash
# Parar todos
taskkill /F /IM node.exe /T

# Usar apenas o oficial
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"
node server-simple-real.cjs
```

### **🔴 ARQUIVOS OBSOLETOS EM USO**
**Ação**: Verificar se está usando arquivos de /archive/
```bash
# ❌ NUNCA usar arquivos de:
/archive/
/archived-tests/
/_rollback_backups/

# ✅ SEMPRE usar arquivos de:
/3d_visualizer/ (diretório oficial atual)
```

---

## 📋 **CHECKLIST DE VALIDAÇÃO**

### **✅ SISTEMA FUNCIONANDO (V1.4.0.a.5)**
- [ ] Backend responde em http://localhost:3004/api/test
- [ ] Interface carrega sem erros de console
- [ ] Upload de arquivos funciona (áudio + imagem)
- [ ] Blender executa e gera logs detalhados
- [ ] MP4 é criado em uploads/ com tamanho > 1MB
- [ ] Arquivo MP4 tem duração correta (igual ao áudio)
- [ ] Arquivo MP4 contém trilha sonora audível

### **❌ INDICADORES DE PROBLEMA**
- [ ] Erro 404 ao acessar backend
- [ ] Console mostra erros de CORS
- [ ] Upload resulta em erro 400/500
- [ ] Blender exit code = 1
- [ ] MP4 não é gerado ou tem 0 bytes
- [ ] Logs mostram "Cannot read file" ou paths truncados

---

## 🔧 **RECUPERAÇÃO RÁPIDA**

### **⚡ VOLTA AO FUNCIONAL (5 MIN)**
```bash
# 1. Parar tudo
taskkill /F /IM node.exe /T

# 2. Ir para diretório oficial
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

# 3. Usar arquivos base V1.4.0.a.4 (comprovadamente funcionais)
# - server-simple-real.cjs
# - test-simple-real.html  
# - start-simple-real.bat
# - Blender/render_audio_visualizer.py (versão que gera MP4)

# 4. Teste básico
start-simple-real.bat
# Abrir test-simple-real.html
# Upload sample_audio2.wav + sample_cover.jpg
# Execute Simple Real Blender
# Verificar MP4 gerado
```

**Resultado Esperado**: MP4 gerado em ~30s, tamanho > 1MB, sem erros críticos.

**Se ainda assim não funcionar**: Problema pode ser ambiental (Blender installation, paths, permissions).
