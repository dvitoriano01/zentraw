#!/bin/bash
# Script para atualizar automaticamente a versão das tasks do VS Code
# Uso: ./update-version.sh

echo "🔄 Atualizando versão das tasks do VS Code..."

cd "$(dirname "$0")/.."
node scripts/update-version.js

if [ $? -ne 0 ]; then
    echo "❌ Erro ao executar o script de atualização"
    exit 1
fi

echo "✅ Script executado com sucesso!"
