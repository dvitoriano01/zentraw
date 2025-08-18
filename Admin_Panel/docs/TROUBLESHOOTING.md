# TROUBLESHOOTING - Admin Panel Zentraw

**Versão:** V1.0.0  
**Data:** 18/08/2025  
**Última Atualização:** 18/08/2025 - 10:30 BRT

---

## 🚨 **PROBLEMAS CONHECIDOS**

### **❌ Nenhum problema conhecido**
- Módulo recém-criado
- Primeira versão estável

---

## 🔧 **SOLUÇÕES RÁPIDAS**

### **PROBLEMA: Porta 3001 já está em uso**
```bash
# Verificar processo usando a porta
netstat -ano | findstr :3001

# Parar processo específico (Windows)
taskkill /PID [NUMBER] /F

# Ou usar porta alternativa
set PORT=3002 && npm start
```

### **PROBLEMA: Módulos não respondem**
```bash
# Verificar se os módulos estão rodando
curl http://localhost:3004/health  # TemplateLibraryBuilder
curl http://localhost:3005/health  # 3D Visualizer

# Reiniciar módulos se necessário
cd ../TemplateLibraryBuilder && npm start
cd ../Zentraw/3d_visualizer && node server-v1.4.0.a.8-parametrizado.cjs
```

### **PROBLEMA: Dependências não instaladas**
```bash
# Instalar dependências
cd Admin_Panel
npm install

# Verificar se todas as dependências estão instaladas
npm ls
```

---

## 🔍 **DIAGNÓSTICO PASSO A PASSO**

### **ETAPA 1: Verificar Estrutura**
```bash
# Verificar se todos os arquivos estão presentes
ls -la Admin_Panel/
ls -la Admin_Panel/src/
ls -la Admin_Panel/config/
ls -la Admin_Panel/docs/
```

### **ETAPA 2: Verificar Configuração**
```bash
# Verificar arquivo de configuração
cat Admin_Panel/config/default.json

# Verificar package.json
cat Admin_Panel/package.json
```

### **ETAPA 3: Verificar Conectividade**
```bash
# Testar conexão com módulos
ping localhost
telnet localhost 3004
telnet localhost 3005
```

### **ETAPA 4: Verificar Logs**
```bash
# Verificar logs do servidor
tail -f Admin_Panel/logs/error.log
tail -f Admin_Panel/logs/access.log

# Verificar logs do console
npm start # Observar mensagens de erro
```

---

## 🌐 **PROBLEMAS DE REDE**

### **CORS Errors**
- **Sintoma:** Erro de CORS no navegador
- **Causa:** Módulos em portas diferentes
- **Solução:** Verificar configuração CORS em `config/default.json`

### **Timeout de Conexão**
- **Sintoma:** Módulos marcados como offline
- **Causa:** Timeout muito baixo ou módulos lentos
- **Solução:** Aumentar timeout em `config/default.json`

### **Health Check Falhando**
- **Sintoma:** Status sempre offline
- **Causa:** Endpoint `/health` não implementado nos módulos
- **Solução:** Implementar endpoint nos módulos ou ajustar configuração

---

## 🔐 **PROBLEMAS DE SEGURANÇA**

### **JWT Token Inválido**
- **Sintoma:** Erro de autenticação
- **Causa:** Token expirado ou chave inválida
- **Solução:** Regenerar token ou verificar configuração

### **Certificados SSL**
- **Sintoma:** Erro de certificado
- **Causa:** HTTPS mal configurado
- **Solução:** Usar HTTP em desenvolvimento ou configurar certificados válidos

---

## 📊 **PROBLEMAS DE PERFORMANCE**

### **Alto Uso de CPU**
- **Sintoma:** Sistema lento
- **Causa:** Verificações muito frequentes
- **Solução:** Aumentar intervalo de health check

### **Alto Uso de Memória**
- **Sintoma:** Processo crescendo na memória
- **Causa:** Logs acumulando sem limpeza
- **Solução:** Implementar rotação de logs

---

## 🛠️ **COMANDOS DE DIAGNÓSTICO**

### **Verificação Completa do Sistema**
```bash
# Comando completo de diagnóstico
cd Admin_Panel

echo "=== ZENTRAW ADMIN PANEL DIAGNÓSTICO ==="
echo "1. Verificando estrutura..."
ls -la

echo "2. Verificando dependências..."
npm ls --depth=0

echo "3. Verificando configuração..."
node -e "console.log(JSON.stringify(require('./config/default.json'), null, 2))"

echo "4. Testando conectividade..."
curl -s http://localhost:3001/health || echo "Admin Panel offline"
curl -s http://localhost:3004/health || echo "TemplateLibraryBuilder offline"
curl -s http://localhost:3005/health || echo "3D Visualizer offline"

echo "5. Verificando portas..."
netstat -ano | findstr ":3001"
netstat -ano | findstr ":3004"
netstat -ano | findstr ":3005"

echo "=== FIM DO DIAGNÓSTICO ==="
```

### **Reset Completo**
```bash
# Reset completo do ambiente
cd Admin_Panel

# Parar todos os processos
taskkill /F /IM node.exe /T

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar logs
rm -rf logs/*

# Reiniciar
npm start
```

---

## 📞 **SUPORTE E CONTATO**

### **Documentação de Referência**
- ZENTRAW-MASTER-RULES.md
- MODULE-ARCHITECTURE-STANDARD.md
- Admin_Panel/docs/README.md

### **Logs Importantes**
- `logs/error.log` - Erros do sistema
- `logs/access.log` - Logs de acesso
- `logs/debug.log` - Informações de debug

### **Compliance**
- ✅ 100% conforme ZENTRAW-MASTER-RULES.md
- ✅ 100% conforme MODULE-ARCHITECTURE-STANDARD.md
- ✅ Rastreabilidade completa

---

**🚨 IMPORTANTE:** Sempre consultar a documentação master antes de fazer modificações.  
**📋 ATUALIZAÇÃO:** Este documento será atualizado conforme novos problemas sejam identificados.
