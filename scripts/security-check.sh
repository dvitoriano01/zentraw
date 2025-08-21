#!/bin/bash
# 🔒 ZENTRAW SECURITY CHECK - PROTOCOLO DE MASCARAMENTO DE CHAVES
# ================================================================
# Versão: 1.0.0
# Data: 20/08/2025
# Função: Verificar exposição de chaves, tokens e secrets
# ================================================================

echo "🔍 ZENTRAW SECURITY SCAN INICIADO"
echo "================================="
echo "Data: $(date)"
echo "Workspace: $(pwd)"
echo ""

# Contadores
ISSUES_FOUND=0
WARNINGS=0

# Verificar chaves OpenAI
echo "📋 Verificando chaves OpenAI..."
if grep -r "sk-" . --exclude-dir=node_modules --exclude="*.md" --exclude="*.example" --exclude="security-check.sh" | grep -v "your-openai-api-key-here" | grep -v "sk-proj-your-openai-api-key-here"; then
    echo "🚨 CHAVES OPENAI ENCONTRADAS!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ Nenhuma chave OpenAI exposta"
fi

# Verificar arquivos .env
echo ""
echo "📋 Verificando arquivos .env..."
ENV_FILES=$(find . -name ".env" -not -path "./node_modules/*" | grep -v ".env.example")
if [ ! -z "$ENV_FILES" ]; then
    echo "🚨 ARQUIVOS .ENV ENCONTRADOS:"
    echo "$ENV_FILES"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ Nenhum arquivo .env no repositório"
fi

# Verificar outros padrões sensíveis
echo ""
echo "📋 Verificando outros tokens/secrets..."

# API Keys genéricas
if grep -r "api_key\s*=\s*['\"][a-zA-Z0-9]" . --exclude-dir=node_modules --exclude="*.md" --exclude="security-check.sh" | grep -v "your-api-key" | grep -v "example"; then
    echo "⚠️ Possível API key encontrada"
    WARNINGS=$((WARNINGS + 1))
fi

# Bearer tokens
if grep -r "Bearer [a-zA-Z0-9]" . --exclude-dir=node_modules --exclude="*.md" --exclude="security-check.sh" | grep -v "Bearer \${" | grep -v "Bearer your-token"; then
    echo "⚠️ Possível Bearer token encontrado"
    WARNINGS=$((WARNINGS + 1))
fi

# Secret patterns
if grep -r "secret.*=.*['\"][a-zA-Z0-9]" . --exclude-dir=node_modules --exclude="*.md" --exclude="security-check.sh" | grep -v "your-secret" | grep -v "example"; then
    echo "⚠️ Possível secret encontrado"
    WARNINGS=$((WARNINGS + 1))
fi

# Relatório final
echo ""
echo "📊 RELATÓRIO FINAL"
echo "=================="
echo "🔍 Issues Críticos: $ISSUES_FOUND"
echo "⚠️ Warnings: $WARNINGS"

if [ $ISSUES_FOUND -gt 0 ]; then
    echo ""
    echo "🚨 FALHA NA VERIFICAÇÃO DE SEGURANÇA!"
    echo "Resolva os issues críticos antes de continuar."
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "1. Invalidar chaves expostas"
    echo "2. Remover arquivos .env do repositório"
    echo "3. Adicionar regras ao .gitignore"
    echo "4. Executar este script novamente"
    echo ""
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo ""
    echo "⚠️ WARNINGS ENCONTRADOS - REVISAR MANUALMENTE"
    echo "Verifique os patterns identificados acima."
    echo ""
    exit 2
else
    echo ""
    echo "✅ SCAN DE SEGURANÇA PASSOU!"
    echo "Nenhum problema crítico identificado."
    echo ""
    exit 0
fi
