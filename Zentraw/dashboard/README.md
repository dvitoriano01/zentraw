# 🎨 Zentraw Ecosystem Dashboard

**Versão:** 1.1.0 - WORKSPACE TRANSITION EDITION  
**Data de Atualização:** 20 de Agosto de 2025  
**Desenvolvido por:** Zentraw Team

## 📋 Visão Geral

O Zentraw Dashboard é um **sistema de gerenciamento modular** que permite iniciar e controlar os módulos do ecossistema Zentraw **um de cada vez**, otimizando o uso de recursos do sistema (CPU, memória, etc.).

## 🔄 **ATUALIZAÇÃO 20/08/2025 - WORKSPACE TRANSITION**

### **CONFIGURAÇÃO ATUAL:**
- **Workspace Expandido:** Incluindo todos os repositórios necessários
- **3D Visualizer:** Path atualizado para repositório externo
- **Segurança:** Configurado para evitar execução automática de scripts Python
- **Status:** Configurado e pronto para teste

## 🎯 Características Principais

### ✅ **Gerenciamento Inteligente de Módulos**
- **Um módulo por vez**: Evita sobrecarga do sistema
- **Start/Stop automático**: Controle total dos processos
- **Monitoramento em tempo real**: Status e saúde dos módulos
- **Interface modular Zentraw**: Design consistente com padrão escuro + laranja

### 🚀 **Módulos Gerenciados (ATUALIZADO 20/08/2025)**
1. **Admin Panel** (porta 3003) - Dashboard central + API Manager
2. **Template Library Builder** (porta 3004) - Sistema de templates
3. **3D Visualizer** (EXTERNO) - Path atualizado para repositório correto
4. **Music Intelligence** (porta 3006) - IA para música

### 🔄 **Configuração Atual:**
- **3D Visualizer Path:** `C:/Users/Denys Victoriano/Documents/GitHub/clone/gsap-threejs-inertia_DENYS/Grok_Blender_Integration`
- **Comando Seguro:** `node server-simple-real.cjs` (apenas servidor Node.js)
- **Segurança:** SEM execução automática de scripts Python

### 🛡️ **Recursos de Segurança**
- **Isolamento de processos**: Cada módulo roda independentemente
- **Recovery automático**: Reinicialização em caso de falha
- **Port management**: Detecta e resolve conflitos de porta
- **Graceful shutdown**: Encerramento seguro de todos os processos

## 🔧 Instalação e Configuração

### **Pré-requisitos**
- Node.js 16+ instalado
- NPM ou Yarn
- Windows 10/11

### **Instalação**
```bash
# Navegar para o diretório
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\dashboard"

# Instalar dependências
npm install

# Iniciar o dashboard
npm start
```

### **Acesso**
- **Dashboard**: http://localhost:3000
- **Interface completa** com controles visuais
- **Acesso direto** aos módulos quando ativos

## 🎛️ Como Usar

### **1. Iniciando o Dashboard**
```bash
npm start
```

### **2. Acessando a Interface**
1. Abra o navegador
2. Vá para `http://localhost:3000`
3. Visualize todos os módulos disponíveis

### **3. Gerenciando Módulos**
- **Iniciar módulo**: Clique no botão "🚀 Iniciar" do módulo desejado
- **Acessar módulo**: Clique em "🌐 Acessar" quando estiver rodando
- **Parar todos**: Use o botão "🛑 Parar Todos os Módulos"

### **4. Monitoramento**
- **Status em tempo real**: Indicadores visuais de status
- **Informações do sistema**: CPU, memória, uptime
- **Logs automáticos**: Console do servidor mostra atividades

## 📊 Interface Visual

### **Painel de Status**
```
📊 Status do Sistema
┌─────────────────┬──────────────────┬─────────────────┬───────────────┐
│ 🖥️ Sistema      │ ⚡ Dashboard     │ 🎯 Módulos     │ 💾 Recursos  │
│ Windows x64     │ 🟢 Online       │ 1 de 4 ativos  │ Otimização ✅ │
│ 8 CPUs         │ Porto 3000      │ Modo: Um/vez   │ Modo: 1x1    │
│ 8GB / 16GB     │ Uptime: 2h      │                │              │
└─────────────────┴──────────────────┴─────────────────┴───────────────┘
```

### **Cards de Módulos**
```
┌─────────────────────────────────────────────┐
│ 🏗️ Template Library Builder                 │
│ Porto: 3004                                 │
│ Sistema de criação e gerenciamento de       │
│ templates                                   │
│                                             │
│ 🟢 Executando                               │
│                                             │
│ [🚀 Iniciar] [🌐 Acessar]                   │
└─────────────────────────────────────────────┘
```

## ⚙️ Configuração Avançada

### **Configuração de Módulos** (`server.js`)
```javascript
const MODULES = {
  'nome-modulo': {
    name: 'Nome Exibido',
    port: 3001,
    path: '../../caminho/para/modulo',
    command: 'npm start',
    icon: '🎯',
    description: 'Descrição do módulo'
  }
};
```

### **Adicionando Novos Módulos**
1. Edite a constante `MODULES` em `server.js`
2. Adicione as informações do novo módulo
3. Reinicie o dashboard
4. O novo módulo aparecerá automaticamente

## 🔍 Resolução de Problemas

### **Problemas Comuns**

#### **Erro: Porta já em uso**
```
Solução: Use o botão "🛑 Parar Todos" antes de iniciar novo módulo
```

#### **Módulo não inicia**
```
1. Verificar se o caminho está correto
2. Verificar se as dependências estão instaladas
3. Verificar logs no console do servidor
```

#### **Dashboard não carrega**
```
1. Verificar se a porta 3000 está livre
2. Verificar se Node.js está instalado
3. Verificar se npm install foi executado
```

### **Logs e Debugging**
- **Console do servidor**: Mostra logs detalhados de cada módulo
- **Browser DevTools**: F12 para ver erros de frontend
- **Network tab**: Verificar requisições à API

## 📁 Estrutura de Arquivos

```
dashboard/
├── package.json                 # Dependências e scripts
├── server.js                   # Servidor principal
├── public/
│   └── index.html              # Interface do dashboard
├── README.md                   # Esta documentação
└── node_modules/               # Dependências (após npm install)
```

## 🚀 API Endpoints

### **GET /api/modules**
Retorna status de todos os módulos

### **POST /api/modules/:moduleId/start**
Inicia um módulo específico

### **POST /api/modules/stop-all**
Para todos os módulos

### **GET /api/health**
Health check do dashboard

### **GET /api/system**
Informações do sistema

## 🔒 Segurança

- **Localhost only**: Dashboard acessível apenas localmente
- **Process isolation**: Módulos isolados uns dos outros
- **Graceful shutdown**: Encerramento seguro de processos
- **Error handling**: Tratamento robusto de erros

## 📈 Performance

### **Otimizações**
- **Um módulo por vez**: Reduz uso de CPU/memória
- **Auto-refresh inteligente**: Atualiza apenas quando necessário
- **Process management**: Controle eficiente de processos filhos
- **Resource monitoring**: Monitoramento de recursos do sistema

### **Recursos do Sistema**
- **CPU**: ~5% quando idle, ~15% durante operações
- **Memória**: ~50MB para o dashboard + módulo ativo
- **Disco**: Logs rotativos, sem acúmulo excessivo

## 🎨 Customização

### **Temas e Cores**
O dashboard usa o padrão visual Zentraw:
- **Fundo**: Gradiente escuro (#1a1a1a → #2d2d2d)
- **Primário**: Laranja Zentraw (#ff6b35)
- **Secundário**: Tons de cinza e branco
- **Acentos**: Gradientes e sombras suaves

### **Modificando a Interface**
- **Cores**: Edite as variáveis CSS em `public/index.html`
- **Layout**: Modifique as classes CSS Grid
- **Animações**: Ajuste as transições e keyframes

## 🆕 Próximas Versões

### **V1.1 - Planejado**
- [ ] Configuração via interface web
- [ ] Logs viewer integrado
- [ ] Métricas de performance em tempo real
- [ ] Themes customizáveis

### **V1.2 - Planejado**
- [ ] Auto-discovery de novos módulos
- [ ] Backup e restore de configurações
- [ ] Sistema de plugins
- [ ] Mobile responsive

## 📞 Suporte

Para suporte técnico:
1. Verificar logs do console
2. Consultar esta documentação
3. Verificar issues conhecidos no repositório

---

**Desenvolvido com ❤️ para a comunidade Zentraw**  
**Dashboard V1.0 - Agosto 2025**
