# 🔒 ZENTRAW - GUIA DE SEGURANÇA DE API KEYS

**Data de Criação:** 20 de Agosto de 2025  
**Motivo:** Resposta a security breach - chaves expostas em commits  
**Status:** PROTOCOLO OBRIGATÓRIO

---

## 🚨 **O QUE ACONTECEU**

### **PROBLEMA IDENTIFICADO:**
- Chaves de API reais foram commitadas no arquivo `Admin_Panel/.env`
- GitHub detectou e revogou automaticamente as chaves expostas
- GitGuardian enviou alertas de security breach
- Spotify, GitHub Token e outras chaves foram comprometidas

### **CHAVES COMPROMETIDAS:**
```
❌ OpenAI API Key: sk-proj-kbgi6NWpa4d...
❌ Spotify Client ID: d98998fd9e344596b882dc42a9a4da6a
❌ Spotify Client Secret: 1f26813f709f47788b6cc2f4fc5528dd
❌ GitHub Token: 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
❌ Supabase Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ✅ **SOLUÇÕES IMPLEMENTADAS**

### **1. REMOÇÃO IMEDIATA DAS CHAVES**
- ✅ Arquivo `.env` limpo com placeholders seguros
- ✅ Arquivo `.env.example` atualizado como template seguro
- ✅ `.gitignore` robusto criado para prevenir futuros vazamentos

### **2. PROTEÇÃO ROBUSTA IMPLEMENTADA**
- ✅ `.gitignore` com proteção específica para `.env*`
- ✅ Proteção para arquivos de configuração sensíveis
- ✅ Bloqueio de arquivos com padrões de chaves API

---

## 🛡️ **PROTOCOLO DE SEGURANÇA OBRIGATÓRIO**

### **REGRAS CRÍTICAS (NUNCA QUEBRAR):**

#### **❌ ABSOLUTAMENTE PROIBIDO:**
```bash
# NUNCA fazer isso:
git add Admin_Panel/.env                    # ❌ PROIBIDO
git add */config/api-keys.json             # ❌ PROIBIDO  
git add */.env*                            # ❌ PROIBIDO
git commit -m "add api keys"               # ❌ PROIBIDO
```

#### **✅ SEMPRE FAZER:**
```bash
# Verificar antes de commit:
git status                                  # ✅ Verificar arquivos
git diff --cached                          # ✅ Ver mudanças
grep -r "sk-" . --exclude-dir=node_modules # ✅ Buscar chaves
grep -r "ghp_" . --exclude-dir=node_modules # ✅ Buscar tokens
```

### **CONFIGURAÇÃO SEGURA:**

#### **1. Configurar Chaves (LOCAL ONLY):**
```bash
# No WSL environment:
cd ~/zentraw/Admin_Panel

# Copiar template seguro:
cp .env.example .env

# Editar com chaves reais (NUNCA COMMIT):
nano .env

# Verificar que .env está no .gitignore:
git check-ignore .env  # Deve retornar: .env
```

#### **2. Verificação Antes de Commit:**
```bash
# SEMPRE executar antes de commit:
git status | grep "\.env"                   # Deve estar vazio
git diff --cached | grep -i "key\|token"   # Deve estar vazio
git diff --cached | grep -i "secret"       # Deve estar vazio
```

#### **3. Comandos de Segurança:**
```bash
# Verificar se chaves estão expostas:
grep -r "sk-proj" . --exclude-dir=node_modules
grep -r "ghp_" . --exclude-dir=node_modules  
grep -r "eyJhbGci" . --exclude-dir=node_modules

# Limpar cache do Git (se necessário):
git rm --cached Admin_Panel/.env
git rm --cached */.*env*
```

---

## 🔧 **RECUPERAÇÃO PÓS-BREACH**

### **PRÓXIMOS PASSOS OBRIGATÓRIOS:**

#### **1. GERAR NOVAS CHAVES:**
- [ ] **OpenAI:** https://platform.openai.com/api-keys → Criar nova key
- [ ] **Spotify:** https://developer.spotify.com/dashboard → Criar novo app
- [ ] **GitHub:** https://github.com/settings/tokens → Gerar novo token
- [ ] **Supabase:** https://supabase.com/dashboard → Regenerar keys

#### **2. ATUALIZAR CONFIGURAÇÕES:**
- [ ] Substituir chaves antigas pelas novas no `.env` local
- [ ] Testar Admin Panel com novas chaves
- [ ] Verificar que todas as APIs funcionam
- [ ] Documentar novas configurações (sem expor chaves)

#### **3. MONITORAMENTO CONTÍNUO:**
- [ ] Verificar emails de security alerts regularmente
- [ ] Usar `git diff --cached` antes de todo commit
- [ ] Verificar GitGuardian dashboard mensalmente
- [ ] Fazer audit de segurança trimestral

---

## 🚨 **PROTOCOLO DE EMERGÊNCIA**

### **SE CHAVES FOREM EXPOSTAS NOVAMENTE:**

#### **AÇÃO IMEDIATA (primeiros 15 minutos):**
```bash
# 1. Revogar chaves comprometidas nos serviços
# 2. Remover chaves do arquivo:
sed -i 's/sk-proj-.*/your-openai-key-here/g' Admin_Panel/.env
sed -i 's/ghp_.*/your-github-token/g' Admin_Panel/.env

# 3. Commit de emergência:
git add Admin_Panel/.env
git commit -m "SECURITY: Remove exposed API keys"
git push origin $(git branch --show-current)
```

#### **AÇÃO COMPLETA (próximas 24 horas):**
1. Gerar todas as novas chaves
2. Atualizar documentação de segurança
3. Fortalecer .gitignore se necessário
4. Verificar outros repositórios
5. Notificar equipe sobre o incident

---

## 📋 **CHECKLIST DE SEGURANÇA**

### **ANTES DE CADA COMMIT:**
- [ ] `git status` não mostra arquivos `.env*`
- [ ] `git diff --cached` não contém chaves/tokens
- [ ] Arquivos sensíveis estão no `.gitignore`
- [ ] Nenhum `sk-`, `ghp_`, ou secrets visíveis

### **CONFIGURAÇÃO DE DESENVOLVIMENTO:**
- [ ] `.env` existe e contém chaves reais (local only)
- [ ] `.env.example` contém apenas placeholders
- [ ] `.gitignore` protege arquivos sensíveis
- [ ] Admin Panel funciona com novas chaves

### **MONITORAMENTO:**
- [ ] GitHub security alerts ativo
- [ ] GitGuardian monitoramento configurado
- [ ] Email notifications habilitados
- [ ] Audit logs revisados mensalmente

---

## 🎯 **RESPONSABILIDADES**

### **DESENVOLVEDOR:**
- Seguir protocolo de segurança 100%
- Verificar commits antes de push
- Manter chaves locais seguras
- Reportar incidents imediatamente

### **SISTEMA AUTOMÁTICO:**
- `.gitignore` bloqueia arquivos sensíveis
- GitHub detecta e revoga chaves expostas
- GitGuardian monitora e alerta
- Scripts de verificação automática

---

**🔒 LEMBRETE:** A segurança é responsabilidade de TODOS. Uma chave exposta pode comprometer todo o ecossistema Zentraw.

**📞 EM CASO DE DÚVIDAS:** Sempre preferir pecar por excesso de cautela. When in doubt, don't commit!
