#!/bin/bash

# 🚀 ZENTRAW SAFE START SCRIPT
# Script seguro de inicialização com health check integrado
# Data: 21/08/2025

echo "🚀 ZENTRAW SAFE START INICIADO"
echo "=============================="

# Mudar para diretório do Agent
cd "/mnt/c/Users/Denys Victoriano/Documents/GitHub/clone/zentraw/Agent"

echo "📍 Diretório atual: $(pwd)"

# 1. Executar health check
echo "🩺 Executando health check..."
if node health-check.js; then
    echo "✅ Health check passou!"
else
    echo "❌ Health check falhou! Corrigindo problemas..."
    
    # Tentar corrigir problemas automaticamente
    echo "🔧 Tentando correções automáticas..."
    
    # Instalar dependências se necessário
    if ! npm list openai &>/dev/null; then
        echo "📦 Instalando OpenAI..."
        npm install openai
    fi
    
    # Verificar porta novamente
    if lsof -ti:3007 &>/dev/null; then
        PID=$(lsof -ti:3007)
        echo "💀 Eliminando processo zumbi PID: $PID"
        kill -9 $PID
        sleep 2
    fi
    
    # Tentar health check novamente
    if node health-check.js; then
        echo "✅ Problemas corrigidos!"
    else
        echo "❌ Falha na correção automática. Intervenção manual necessária."
        exit 1
    fi
fi

# 2. Verificar port manager
echo "🛡️ Executando port manager..."
node port-manager.js

# 3. Iniciar servidor
echo "🎯 Iniciando Zentraw Agent..."
node src/server.js
