# 🏗️ ZENTRAW - PADRÃO ARQUITETURAL DE MÓDULOS

**Versão:** MASTER v2.0 - WSL MIGRATION EDITION  
**Data:** 19 de Agosto de 2025  
**WSL Migration:** COMPLETO - Ubuntu 22.04.4 LTS  
**Autoridade:** MASTER - Definido por ZENTRAW-MASTER-RULES.md  
**Aplicação:** OBRIGATÓRIA para todos os módulos Zentraw

---

## 🚀 **WSL UBUNTU ENVIRONMENT REQUIREMENTS**

### **AMBIENTE TÉCNICO OBRIGATÓRIO:**
- **Sistema:** WSL Ubuntu 22.04.4 LTS
- **Node.js:** v18.20.8 (via NVM)
- **NPM:** v10.8.2+
- **Workspace:** `~/zentraw/` (WSL filesystem)
- **Admin Panel:** http://localhost:3003 (Centro de Controle)

---

## 🎯 **TEMPLATE ARQUITETURAL WSL-NATIVE**

### **ESTRUTURA FÍSICA PADRÃO (WSL-COMPATIBLE):**
```
[NOME_MÓDULO]/
├── 📚 docs/
│   ├── 🎯 README.md                    # ✅ OBRIGATÓRIO - Status atual
│   ├── 📋 CHANGELOG.md                 # ✅ OBRIGATÓRIO - Histórico
│   ├── 🚨 TROUBLESHOOTING.md           # ✅ OBRIGATÓRIO - Problemas
│   ├── 🐧 WSL_MIGRATION.md             # ✅ NOVO - Status migração WSL
│   ├── 🏗️ ARCHITECTURE.md              # ✅ RECOMENDADO - Estrutura
│   ├── 🧪 TESTING.md                   # ✅ RECOMENDADO - Testes
│   ├── 📊 API.md                       # ⚡ SE APLICÁVEL - APIs
│   └── 📁 versions/                    # ✅ OBRIGATÓRIO - Versionado
│       ├── v1.4.0.a.5/                # Documentação específica
│       ├── v1.4.0.a.6/                # Por versão
│       ├── wsl-migration/              # 🆕 Docs migração WSL
│       └── current/                    # Link para versão ativa
├── 🔧 src/                             # ✅ OBRIGATÓRIO - Código fonte (WSL-native)
│   ├── components/                     # Componentes principais
│   ├── services/                       # Serviços/APIs
│   ├── utils/                          # Utilitários
│   └── main.[ext]                      # Arquivo principal
├── 🧪 tests/                           # ✅ RECOMENDADO - Testes (WSL-compatible)
│   ├── unit/                           # Testes unitários
│   ├── integration/                    # Testes integração
│   └── fixtures/                       # Dados de teste
├── 📋 config/                          # ⚡ SE APLICÁVEL - Configs (WSL-paths)
│   ├── development.json                # Config desenvolvimento
│   ├── production.json                 # Config produção
│   ├── wsl.json                        # 🆕 Config específica WSL
│   └── default.json                    # Config padrão
├── 📤 outputs/                         # ✅ OBRIGATÓRIO - Resultados
│   ├── builds/                         # Builds gerados
│   ├── exports/                        # Exportações
│   └── temp/                           # Temporários
├── 📊 logs/                            # ✅ RECOMENDADO - Logs
│   ├── error.log                       # Logs de erro
│   ├── access.log                      # Logs de acesso
│   ├── wsl-migration.log              # 🆕 Logs migração WSL
│   └── debug.log                       # Logs debug
├── 🎯 README.md                        # ✅ OBRIGATÓRIO - Visão geral
├── 📦 package.json                     # ⚡ SE APLICÁVEL - Dependencies (Node.js v18+)
├── � wsl-setup.sh                     # 🆕 OBRIGATÓRIO - Script setup WSL
├── �🔧 [config-files]                   # Configs específicos
└── 📁 archive/                         # ⚠️ OBSOLETOS Windows - NUNCA USAR
```

### **PORTAS OFICIAIS ZENTRAW (WSL-ENVIRONMENT):**
```
3003 - 🔧 Admin Panel (Centro de Controle) - OBRIGATÓRIO
3004 - 📚 Template Library Builder Backend
3005 - 🎬 3D Visualizer (~/zentraw/Zentraw/3d_visualizer)
3006 - 🎵 Music Intelligence AI
```
```

---

### **PORTAS OFICIAIS ZENTRAW (WSL-ENVIRONMENT):**
```
3003 - 🔧 Admin Panel (Centro de Controle) - OBRIGATÓRIO
3004 - 📚 Template Library Builder Backend
3005 - 🎬 3D Visualizer (~/zentraw/Zentraw/3d_visualizer)
3006 - 🎵 Music Intelligence AI
```

---

## 🔧 **INTEGRAÇÃO COM ADMIN PANEL (Centro de Controle)**

### **CONEXÃO OBRIGATÓRIA:**
- **Endpoint Central:** http://localhost:3003
- **API Registration:** Todos os módulos DEVEM se registrar no Admin Panel
- **Status Monitoring:** Heartbeat a cada 30 segundos
- **Global Config:** Configurações centralizadas via Admin Panel

### **IMPLEMENTAÇÃO WSL-NATIVE:**
```bash
# Setup obrigatório para novos módulos
curl -X POST http://localhost:3003/api/modules/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "[NOME_MÓDULO]",
    "port": [PORTA],
    "environment": "WSL Ubuntu 22.04.4",
    "nodeVersion": "v18.20.8",
    "status": "active"
  }'
```

---

## 📋 **PADRÕES DE DOCUMENTAÇÃO WSL-COMPLIANT**

### **README.md OBRIGATÓRIO:**
```markdown
# 🎯 [NOME_MÓDULO] - Zentraw Ecosystem

**Versão:** [X.X.X]  
**WSL Environment:** Ubuntu 22.04.4 LTS  
**Node.js:** v18.20.8  
**Admin Panel:** http://localhost:3003  
**Status:** [ACTIVE/MAINTENANCE/DEPRECATED]  

## 🚀 Quick Start (WSL)
```bash
# Clone no WSL filesystem
cd ~/zentraw
git clone [repositório]
cd [módulo]

# Setup WSL environment
chmod +x wsl-setup.sh
./wsl-setup.sh

# Start via Admin Panel
curl http://localhost:3003/api/modules/start/[MÓDULO]
```

## 🔗 Integração Zentraw
- **Admin Panel:** http://localhost:3003
- **API Status:** GET /api/status
- **Health Check:** GET /health

## 📊 Dependencies WSL-Native
- Node.js v18.20.8+ (via NVM)
- NPM v10.8.2+
- Ubuntu 22.04.4 LTS
- Admin Panel integration

[Resto da documentação...]
```

---

## 🧪 **PADRÕES DE TESTES WSL-ENVIRONMENT**

### **ESTRUTURA DE TESTES:**
```
tests/
├── 🔧 wsl-integration/               # 🆕 Testes específicos WSL
│   ├── filesystem-access.test.js    # Acesso filesystem WSL
│   ├── network-binding.test.js      # Binding de portas
│   ├── admin-panel-connection.test.js # Conexão Admin Panel
│   └── performance-wsl.test.js      # Performance vs Windows
├── 🌐 unit/                         # Testes unitários padrão
├── 🔗 integration/                  # Testes integração
├── 🎯 e2e/                          # Testes end-to-end
└── 📊 fixtures/                     # Dados de teste
```

### **SCRIPTS OBRIGATÓRIOS (package.json):**
```json
{
  "scripts": {
    "test:wsl": "jest tests/wsl-integration/",
    "test:admin-connection": "jest tests/wsl-integration/admin-panel-connection.test.js",
    "dev:wsl": "NODE_ENV=development node src/main.js",
    "start:admin": "curl http://localhost:3003/api/modules/start/$(basename $PWD)",
    "health": "curl http://localhost:$(grep -o '\"port\":[0-9]*' package.json | cut -d: -f2)/health"
  }
}
```

---

## 🚨 **REGRAS CRÍTICAS WSL-MIGRATION**

### **OBRIGATÓRIAS ✅:**
1. **APENAS WSL Ubuntu 22.04.4 LTS** - Windows development PROIBIDO
2. **Node.js v18.20.8 via NVM** - Versions antigas INCOMPATÍVEIS
3. **Admin Panel Integration** - Todos os módulos DEVEM se conectar
4. **Filesystem WSL-native** - `~/zentraw/` como workspace root
5. **Port Management** - Coordenação via Admin Panel (3003)

### **PROIBIDAS ❌:**
1. **Windows development environment** - COMPLETAMENTE BANIDO
2. **Node.js global installation** - APENAS via NVM no WSL
3. **Manual port management** - APENAS via Admin Panel
4. **Documentação desatualizada** - SEMPRE versionar com WSL specs
5. **Git operations fora do WSL** - APENAS WSL filesystem

---

## � **VERSIONAMENTO WSL-COMPLIANT**

### **ESTRUTURA DE VERSÕES:**
```
docs/versions/
├── v1.4.0.a.5/                     # Versão Windows (LEGACY)
├── v1.4.0.a.6/                     # Primeira versão WSL
├── wsl-migration/                   # 🆕 Documentação migração
│   ├── migration-report.md         # Relatório completo
│   ├── performance-comparison.md   # WSL vs Windows
│   ├── compatibility-matrix.md     # Compatibilidades
│   └── rollback-procedure.md       # Proc. rollback (emergência)
└── current/ -> v1.4.0.a.6/        # Link para versão ativa
```

### **COMMIT STANDARDS WSL:**
```
feat: [WSL] Add module WSL-native support
fix: [WSL] Resolve Admin Panel connection issue  
docs: [WSL] Update architecture for Ubuntu 22.04.4
test: [WSL] Add WSL-specific integration tests
perf: [WSL] Optimize performance for WSL environment
```

---

## 🔧 **CONFIGURAÇÃO TÉCNICA DETALHADA**

### **ENVIRONMENT SETUP WSL:**
```bash
# ~/.bashrc additions (OBRIGATÓRIO)
export ZENTRAW_HOME="$HOME/zentraw"
export ZENTRAW_ADMIN_PANEL="http://localhost:3003"
export NODE_VERSION="v18.20.8"
export WSL_ENVIRONMENT="Ubuntu-22.04.4"

# PATH additions
export PATH="$HOME/.nvm:$PATH"
export PATH="$ZENTRAW_HOME/scripts:$PATH"
```

### **ADMIN PANEL CONNECTION:**
```javascript
// src/utils/admin-panel.js (TEMPLATE OBRIGATÓRIO)
const ADMIN_PANEL_URL = 'http://localhost:3003';

class AdminPanelConnector {
  static async register(moduleInfo) {
    return fetch(`${ADMIN_PANEL_URL}/api/modules/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...moduleInfo,
        environment: 'WSL Ubuntu 22.04.4',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      })
    });
  }

  static async heartbeat(moduleName) {
    return fetch(`${ADMIN_PANEL_URL}/api/modules/${moduleName}/heartbeat`, {
      method: 'POST'
    });
  }
}

module.exports = AdminPanelConnector;
```

---

## �📋 **TEMPLATES DE DOCUMENTOS OBRIGATÓRIOS (WSL-UPDATED)**

### **1. README.md DO MÓDULO (OBRIGATÓRIO WSL-COMPLIANT)**
```markdown
# [NOME_MÓDULO] - Zentraw Ecosystem

## 🎯 **STATUS ATUAL WSL**
- **Versão**: V[x.x.x.x]
- **WSL Environment**: Ubuntu 22.04.4 LTS
- **Node.js**: v18.20.8 (via NVM)
- **Admin Panel**: http://localhost:3003
- **Data**: [DD/MM/AAAA - HH:MM BRT]
- **Status**: [ACTIVE/MAINTENANCE/DEPRECATED]
- **Última Atualização**: [responsável] em [data]

## 📁 **ARQUIVOS ATIVOS WSL-NATIVE V[x.x.x.x]**
```
[MÓDULO]/
├── 🐧 wsl-setup.sh                  # ✅ Setup automático WSL
├── src/
│   ├── arquivo-principal.[ext]     # ✅ Descrição
│   ├── utils/admin-panel.js        # ✅ Conexão Admin Panel
│   └── componente-chave.[ext]      # ✅ Descrição
├── config/
│   ├── wsl.json                    # ✅ Config WSL-específica
│   └── config-principal.json      # ✅ Config principal
├── tests/
│   └── wsl-integration/            # ✅ Testes WSL
└── outputs/
    └── resultado-esperado.[ext]    # ✅ Resultado esperado
```

## ✅ **FUNCIONALIDADES VALIDADAS WSL**
- ✅ [Funcionalidade 1]: WSL-compatible
- ✅ [Admin Panel Integration]: Conectado
- ✅ [Performance WSL]: 75% melhor que Windows
- ✅ [Funcionalidade N]: [Status WSL]

## ⚠️ **PROBLEMAS CONHECIDOS (WSL-SPECIFIC)**
- ❌ [Problema WSL 1]: [Descrição]
- 🔧 [Problema WSL 2]: [Em correção]

## 🚀 **COMO USAR (WSL-ENVIRONMENT)**
```bash
# 1. Setup WSL Environment
chmod +x wsl-setup.sh
./wsl-setup.sh

# 2. Register with Admin Panel
curl -X POST http://localhost:3003/api/modules/register \
  -H "Content-Type: application/json" \
  -d '{"name":"[MÓDULO]","port":[PORTA]}'

# 3. Start via Admin Panel
curl http://localhost:3003/api/modules/start/[MÓDULO]
```

## 🔗 **INTEGRAÇÃO ZENTRAW WSL**
- **Admin Panel**: http://localhost:3003
- **WSL Filesystem**: ~/zentraw/[MÓDULO]
- **Node.js**: v18.20.8 (NVM)
- **Environment**: Ubuntu 22.04.4 LTS
```

### **2. wsl-setup.sh (OBRIGATÓRIO PARA NOVOS MÓDULOS)**
```bash
#!/bin/bash
# WSL Setup Script - Zentraw Module
# Versão: 2.0 - WSL Migration Edition

echo "🐧 Setting up [MÓDULO] for WSL Ubuntu 22.04.4..."

# Check WSL environment
if ! grep -q "microsoft" /proc/version; then
    echo "❌ ERROR: This script must run in WSL Ubuntu environment"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
if [[ "$NODE_VERSION" != "v18.20.8" ]]; then
    echo "⚠️  WARNING: Expected Node.js v18.20.8, found $NODE_VERSION"
    echo "Installing correct version via NVM..."
    nvm install v18.20.8
    nvm use v18.20.8
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create WSL-specific config
echo "🔧 Creating WSL configuration..."
cat > config/wsl.json << EOF
{
  "environment": "WSL Ubuntu 22.04.4",
  "nodeVersion": "v18.20.8",
  "adminPanel": "http://localhost:3003",
  "wslfFilesystem": true,
  "performanceMode": "optimized"
}
EOF

# Test Admin Panel connection
echo "🔗 Testing Admin Panel connection..."
if curl -s http://localhost:3003/health > /dev/null; then
    echo "✅ Admin Panel connection successful"
    
    # Register module
    curl -X POST http://localhost:3003/api/modules/register \
      -H "Content-Type: application/json" \
      -d "{
        \"name\": \"$(basename $PWD)\",
        \"port\": $(grep -o '\"port\":[0-9]*' package.json | cut -d: -f2 || echo 3000),
        \"environment\": \"WSL Ubuntu 22.04.4\",
        \"nodeVersion\": \"$NODE_VERSION\",
        \"status\": \"setup-complete\"
      }" > /dev/null 2>&1
    
    echo "✅ Module registered with Admin Panel"
else
    echo "⚠️  Admin Panel not available. Start it first:"
    echo "   cd ~/zentraw/Admin_Panel && npm start"
fi

echo "🚀 Setup complete! Module ready for WSL development."
```

### **3. TROUBLESHOOTING.md (OBRIGATÓRIO WSL-SPECIFIC)**
```markdown
# 🚨 TROUBLESHOOTING - [MÓDULO] WSL

## 🐧 **PROBLEMAS WSL-SPECIFIC**

### **Error: Module não conecta ao Admin Panel**
```bash
# Verificar Admin Panel status
curl http://localhost:3003/health

# Se não responder, iniciar Admin Panel
cd ~/zentraw/Admin_Panel
npm start

# Re-registrar módulo
curl -X POST http://localhost:3003/api/modules/register \
  -d '{"name":"[MÓDULO]","port":[PORTA]}'
```

### **Error: Node.js version incompatível**
```bash
# Verificar versão atual
node --version

# Instalar versão correta via NVM
nvm install v18.20.8
nvm use v18.20.8
nvm alias default v18.20.8
```

### **Error: Port binding failed**
```bash
# Verificar portas em uso
netstat -tlnp | grep :[PORTA]

# Liberar porta via Admin Panel
curl -X POST http://localhost:3003/api/ports/release/[PORTA]
```

### **Error: WSL filesystem permissions**
```bash
# Corrigir permissões
cd ~/zentraw/[MÓDULO]
chmod +x wsl-setup.sh
chmod -R 755 src/
chmod -R 644 config/
```

## 🔧 **COMANDOS DE RECOVERY WSL**
```bash
# Reset completo WSL module
cd ~/zentraw/[MÓDULO]
./wsl-setup.sh

# Verificar integração Admin Panel
curl http://localhost:3003/api/modules/status/[MÓDULO]
```
```

---

## 🎯 **VALIDATION CHECKLIST WSL-MIGRATION**

### **PRÉ-DEPLOYMENT (OBRIGATÓRIO):**
- [ ] ✅ WSL Ubuntu 22.04.4 LTS environment confirmed
- [ ] ✅ Node.js v18.20.8 via NVM installed
- [ ] ✅ Admin Panel (localhost:3003) accessible
- [ ] ✅ Module registered with Admin Panel
- [ ] ✅ wsl-setup.sh script functional
- [ ] ✅ WSL-specific documentation complete
- [ ] ✅ Performance tests vs Windows documented
- [ ] ✅ All Windows references removed from code
- [ ] ✅ Port coordination via Admin Panel working
- [ ] ✅ Git operations functional in WSL

### **DOCUMENTAÇÃO COMPLIANCE:**
- [ ] ✅ README.md updated with WSL specs
- [ ] ✅ TROUBLESHOOTING.md with WSL solutions
- [ ] ✅ wsl-setup.sh script included
- [ ] ✅ Admin Panel integration documented
- [ ] ✅ WSL performance metrics included
- [ ] ✅ Migration notes in docs/versions/wsl-migration/

### **TECHNICAL VERIFICATION:**
- [ ] ✅ Module starts via Admin Panel
- [ ] ✅ Heartbeat to Admin Panel functional
- [ ] ✅ WSL filesystem paths correct
- [ ] ✅ No Windows paths in configuration
- [ ] ✅ All tests pass in WSL environment
- [ ] ✅ Performance >= 50% better than Windows

---

## 📊 **CONCLUSÃO - MODULE ARCHITECTURE STANDARD V2.0**

**AUTORIDADE SUPREMA:** Este documento define os padrões arquiteturais OBRIGATÓRIOS para todos os módulos do ecossistema Zentraw em ambiente WSL Ubuntu 22.04.4 LTS.

**APLICAÇÃO IMEDIATA:** Todos os módulos existentes DEVEM migrar para conformidade WSL dentro de 30 dias. Novos módulos DEVEM seguir este padrão desde a criação.

**ADMIN PANEL CENTRALIZATION:** O Admin Panel (localhost:3003) é o centro de controle OBRIGATÓRIO para todos os módulos. Nenhum módulo pode operar independentemente.

**WSL-NATIVE REQUIREMENT:** Desenvolvimento em Windows está COMPLETAMENTE PROIBIDO. Apenas WSL Ubuntu 22.04.4 LTS é aceito para desenvolvimento Zentraw.

**ATUALIZAÇÃO MASTER:** Esta versão 2.0 substitui TODAS as versões anteriores e é a única autoridade válida para arquitetura de módulos Zentraw.

---

**🔗 Integração com:** ZENTRAW-MASTER-RULES.md v2.0  
**📊 Status:** MASTER AUTHORITY - WSL MIGRATION EDITION  
**⚡ Aplicação:** IMEDIATA e OBRIGATÓRIA  
**🎯 Próxima Revisão:** Março 2026 ou quando nova migração técnica major
- **Admin Panel**: http://localhost:3003
- **WSL Filesystem**: ~/zentraw/[MÓDULO]
- **Node.js**: v18.20.8 (NVM)
- **Environment**: Ubuntu 22.04.4 LTS
```

# 3. Teste
[comandos de validação]
```

## 🔗 **DEPENDÊNCIAS**
- [Dependência 1]: [Versão]
- [Dependência 2]: [Versão]

## 📊 **MÉTRICAS**
- Performance: [dados]
- Estabilidade: [dados]
- Cobertura de testes: [dados]
```

### **2. CHANGELOG.md DO MÓDULO (OBRIGATÓRIO)**
```markdown
# [MÓDULO] - CHANGELOG

## 🚀 **V[x.x.x.x]** - [DD/MM/AAAA] - [TÍTULO]

### **🎯 OBJETIVO**
[Objetivo principal desta versão]

### **📁 ARQUIVOS PRINCIPAIS V[x.x.x.x]**
```
[lista exata de arquivos]
```

### **✅ CONQUISTAS**
- ✅ [Conquista 1]: [Descrição]
- ✅ [Conquista 2]: [Descrição]

### **🔧 CORREÇÕES APLICADAS**
- 🔧 [Correção 1]: [Antes] → [Depois]
- 🔧 [Correção 2]: [Antes] → [Depois]

### **🚫 ARQUIVOS ARQUIVADOS**
- `arquivo-obsoleto.ext` → [Motivo]

### **📊 MÉTRICAS**
- Progresso: [percentual]
- Testes: [quantidade passando]
- Performance: [melhorias]

---

## [Versões anteriores em ordem cronológica reversa]
```

### **3. TROUBLESHOOTING.md DO MÓDULO (OBRIGATÓRIO)**
```markdown
# [MÓDULO] - Troubleshooting

## 🎯 **PROBLEMAS RESOLVIDOS - NÃO REPETIR**

### **🔧 [NOME DO PROBLEMA]**
**Problema**: [Descrição detalhada]
```
# ❌ ERRO (código que causa problema):
[código problemático]

# ✅ SOLUÇÃO (código correto):
[código corrigido]
```
**Status**: ✅ RESOLVIDO em V[x.x.x.x]
**Arquivo**: `[caminho/arquivo]`

---

## 🚨 **PROBLEMAS ATIVOS**

### **🔍 [PROBLEMA ATUAL]**
**Sintoma**: [Descrição do que acontece]
**Possíveis Causas**:
1. [Causa 1]
2. [Causa 2]

**Próximos Passos**:
- [ ] [Ação 1]
- [ ] [Ação 2]

---

## 📋 **CHECKLIST DE VALIDAÇÃO**

### **✅ SISTEMA FUNCIONANDO**
- [ ] [Validação 1]
- [ ] [Validação 2]
- [ ] [Validação 3]

### **❌ INDICADORES DE PROBLEMA**
- [ ] [Indicador 1]
- [ ] [Indicador 2]
```

---

## 🔧 **CONFIGURAÇÕES ESPECÍFICAS POR TIPO DE MÓDULO**

### **MÓDULOS WEB (Frontend/Backend):**
```
adicionar:
├── public/          # Assets públicos
├── routes/          # Rotas de API
├── middleware/      # Middlewares
└── views/           # Templates
```

### **MÓDULOS DESKTOP:**
```
adicionar:
├── assets/          # Recursos do app
├── build/           # Build configs
└── dist/            # Distribuição
```

### **MÓDULOS DE PROCESSAMENTO:**
```
adicionar:
├── algorithms/      # Algoritmos principais
├── data/            # Datasets
└── models/          # Modelos ML/AI
```

### **MÓDULOS DE INTEGRAÇÃO:**
```
adicionar:
├── connectors/      # Conectores externos
├── protocols/       # Protocolos
└── adapters/        # Adaptadores
```

---

## 📊 **VALIDAÇÃO DE COMPLIANCE**

### **CHECKLIST OBRIGATÓRIO:**
```
✅ Estrutura física segue template
✅ README.md existe e está atualizado
✅ CHANGELOG.md existe e está completo
✅ TROUBLESHOOTING.md existe
✅ Arquivos listados existem fisicamente
✅ Versão documentada = versão real
✅ Dependências documentadas
✅ Instruções testadas e funcionais
✅ Pasta archive/ não é referenciada
✅ Nomenclatura segue padrão MASTER
```

### **VALIDAÇÃO AUTOMÁTICA:**
```bash
# Script de validação (a ser implementado)
./validate-module-compliance.sh [NOME_MÓDULO]

# Resultado esperado:
✅ Estrutura: COMPLIANT
✅ Documentação: COMPLIANT  
✅ Arquivos: TODOS EXISTEM
✅ Versionamento: CONSISTENTE
✅ Testes: PASSANDO
```

---

## 🚀 **IMPLEMENTAÇÃO EM MÓDULOS EXISTENTES**

### **MIGRAÇÃO ORDENADA:**
```
1. 📋 CRIAR estrutura docs/ no módulo
2. 📝 MIGRAR documentação existente  
3. 🔧 PADRONIZAR nomenclatura
4. ✅ VALIDAR compliance
5. 📊 ATUALIZAR MODULE-STATUS-TRACKER.md
```

### **PRIORIDADE DE MIGRAÇÃO:**
```
P1: TemplateLibraryBuilder (módulo principal)
P2: 3d-visualizer (módulo crítico)
P3: ZentrawMediaControl (módulo ativo)
P4: VisualFilters (módulo secundário)
P5: textFX (módulo auxiliar)
```

---

## 🤖 **INSTRUÇÕES PARA AGENTES IA**

### **AO TRABALHAR COM QUALQUER MÓDULO:**
```
1. ✅ VERIFICAR se módulo segue este template
2. ✅ SE NÃO: aplicar padronização primeiro
3. ✅ SEMPRE trabalhar com arquivos listados no README.md
4. ✅ NUNCA usar arquivos de /archive/
5. ✅ ATUALIZAR documentação após mudanças
```

### **CRIAÇÃO DE NOVO MÓDULO:**
```
1. 📁 CRIAR estrutura física padrão
2. 📝 PREENCHER templates obrigatórios
3. 🔧 IMPLEMENTAR funcionalidade base
4. 🧪 CRIAR testes básicos
5. ✅ VALIDAR compliance completo
```

---

**🎯 ESTE TEMPLATE É OBRIGATÓRIO PARA TODOS OS MÓDULOS ZENTRAW**

**Status:** ATIVO - Implementação imediata requerida  
**Autoridade:** ZENTRAW-MASTER-RULES.md  
**Validação:** MODULE-STATUS-TRACKER.md
