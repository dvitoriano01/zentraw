# 🚀 ZENTRAW WSL SETUP - GUIA DEFINITIVO

**Data:** 19/08/2025  
**Método:** Automático com script do GitHub  
**Tempo Total:** ~1 hora (5 min setup + 55 min instalação automática)

---

## ✅ **PASSO A PASSO DEFINITIVO**

### **PASSO 1: INSTALAR WSL (5 minutos)**

```powershell
# Windows PowerShell (Run as Administrator)
wsl --install Ubuntu-22.04
```

**💡 Dica:** Clique com botão direito no PowerShell e "Run as administrator"

**Resultado esperado:**
```
Installing: Windows Subsystem for Linux
Installing: Ubuntu 22.04 LTS
The requested operation is successful. Changes will not be effective until the system is rebooted.
```

### **PASSO 2: RESTART WINDOWS**

```
⚠️ OBRIGATÓRIO: Restart o Windows quando solicitado
```

### **PASSO 3: SETUP AUTOMÁTICO ZENTRAW (50 minutos)**

**Após o restart, o terminal Ubuntu abrirá automaticamente. Execute:**

```bash
# No Ubuntu terminal (cola e pressiona Enter)
curl -fsSL https://raw.githubusercontent.com/dvitoriano01/zentraw/Feat_Admin_Panel_V1.0.0.0/zentraw-wsl-setup.sh | bash
```

**O script perguntará:**
- `Username:` → Digite seu nome (ex: denys)
- `Password:` → Crie uma senha
- `Git name:` → Digite: dvitoriano01
- `Git email:` → Digite seu email do GitHub

**Depois disso, tudo é automático!**

---

## 📋 **O QUE O SCRIPT FAZ AUTOMATICAMENTE**

```
🔄 Atualizando Ubuntu...
🛠️ Instalando Git, Node.js, ferramentas...
📦 Clonando repositório Zentraw...
🌿 Mudando para branch Feat_Admin_Panel_V1.0.0.0...
📦 Instalando Admin Panel dependencies...
📦 Instalando Template Builder dependencies...
📦 Instalando 3D Visualizer dependencies...
🎯 Criando script de controle zentraw-control.sh...
⚙️ Configurando aliases úteis...
✅ Setup concluído!
```

### **RESULTADO FINAL:**
```
✅ Zentraw está pronto para desenvolvimento no WSL!

Comandos úteis:
  zentraw              # Ir para diretório do projeto
  zc status            # Ver status dos serviços
  zc start-admin       # Iniciar Admin Panel
  zc stop-all          # Parar todos os serviços
  code .               # Abrir VS Code no projeto
```

---

## 🧪 **TESTE RÁPIDO APÓS SETUP**

```bash
# 1. Ir para projeto
zentraw

# 2. Verificar status
zc status

# 3. Iniciar Admin Panel
zc start-admin

# 4. Abrir VS Code
code .

# 5. No navegador Windows: http://localhost:3003
```

**Se tudo funcionar, você está pronto! 🎉**

---

## 🚨 **SE ALGO DER ERRADO**

### **Problema: WSL não instala**
```powershell
# Método alternativo (Windows PowerShell Admin)
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
# Restart e instalar Ubuntu da Microsoft Store
```

### **Problema: Script não executa**
```bash
# Se o curl falhar, execute passo a passo:
wget https://raw.githubusercontent.com/dvitoriano01/zentraw/Feat_Admin_Panel_V1.0.0.0/zentraw-wsl-setup.sh
chmod +x zentraw-wsl-setup.sh
./zentraw-wsl-setup.sh
```

### **Problema: Qualquer outro erro**
```bash
# Me avise qual erro apareceu que eu te ajudo!
```

---

## 📊 **CRONOGRAMA REALISTA**

```
00:00 - Abrir PowerShell Admin
00:02 - Executar wsl --install Ubuntu-22.04
00:05 - Restart Windows
00:10 - Ubuntu terminal abre, executar script
00:15 - Script instalando dependências...
00:45 - Dependencies instaladas...
01:00 - Setup concluído!
01:05 - Teste Admin Panel funcionando
```

---

## 🎯 **APÓS CONCLUSÃO**

### **Uso Diário:**
```bash
# Abrir WSL (qualquer terminal)
wsl

# Comandos rápidos
zentraw          # Vai para projeto
zc start-admin   # Start desenvolvimento
code .           # Abrir VS Code
```

### **Performance Esperada:**
- **npm install:** 15-30s (vs 60-120s Windows)
- **Admin Panel start:** 10-15s (vs 30-45s Windows)
- **Process management:** 100% confiável
- **Zero port conflicts**

---

## ✅ **CHECKLIST FINAL**

Marque conforme completa:

- [ ] PowerShell Admin aberto
- [ ] `wsl --install Ubuntu-22.04` executado
- [ ] Windows restart feito
- [ ] Ubuntu terminal abriu automaticamente
- [ ] Script executado: `curl -fsSL ... | bash`
- [ ] Setup concluído com ✅
- [ ] `zentraw` comando funciona
- [ ] `zc status` mostra serviços
- [ ] `zc start-admin` funciona
- [ ] `code .` abre VS Code WSL
- [ ] Admin Panel acessível em http://localhost:3003

**Quando todos estiverem ✅, sua migração WSL está completa!**

---

## 🤝 **SUPORTE**

**Se precisar de ajuda em qualquer passo:**
1. Me avise qual erro apareceu
2. Copy/paste a mensagem de erro
3. Te ajudo a resolver imediatamente

**PRONTO PARA COMEÇAR? 🚀**

**Execute o PASSO 1 agora e me avise quando chegar no PASSO 3!**
