#!/bin/bash

echo "🚀 ZENTRAW ECOSYSTEM STARTUP"
echo "=============================="

# Função para verificar se porta está em uso
check_port() {
    if ss -tulpn | grep -q ":$1 "; then
        echo "✅ Porta $1 está ativa"
        return 0
    else
        echo "❌ Porta $1 está livre"
        return 1
    fi
}

# Função para iniciar serviço
start_service() {
    local service_name=$1
    local port=$2
    local path=$3
    
    echo "🔄 Iniciando $service_name na porta $port..."
    
    if check_port $port; then
        echo "⚠️  $service_name já está rodando na porta $port"
    else
        cd "$path"
        nohup node src/server.js > "${service_name,,}.log" 2>&1 &
        sleep 3
        
        if check_port $port; then
            echo "✅ $service_name iniciado com sucesso!"
        else
            echo "❌ Falha ao iniciar $service_name"
        fi
    fi
}

# Paths
ADMIN_PANEL_PATH="/mnt/c/Users/Denys Victoriano/Documents/GitHub/clone/zentraw/Admin_Panel"
AGENT_PATH="/mnt/c/Users/Denys Victoriano/Documents/GitHub/clone/zentraw/Agent"

# Iniciar Admin Panel
start_service "Admin Panel" 3003 "$ADMIN_PANEL_PATH"

# Iniciar Zentraw Agent
start_service "Zentraw Agent" 3007 "$AGENT_PATH"

echo ""
echo "🌐 ACESSO AOS SERVIÇOS:"
echo "=============================="
echo "🔧 Admin Panel: http://localhost:3003"
echo "🤖 Zentraw Agent: http://localhost:3007"
echo ""
echo "📋 STATUS DOS SERVIÇOS:"
echo "=============================="

# Verificar status
if check_port 3003; then
    echo "🟢 Admin Panel: ONLINE"
else
    echo "🔴 Admin Panel: OFFLINE"
fi

if check_port 3007; then
    echo "🟢 Zentraw Agent: ONLINE"
else
    echo "🔴 Zentraw Agent: OFFLINE"
fi

echo ""
echo "🎯 COMO USAR O ZENTRAW AGENT:"
echo "=============================="
echo "1. Acesse: http://localhost:3003"
echo "2. Clique em 'API Manager' > 'Abrir'"
echo "3. Localize o container 'OpenAI'"
echo "4. Clique no botão '🤖 AGENT'"
echo ""
echo "✅ Sistema pronto para uso!"
