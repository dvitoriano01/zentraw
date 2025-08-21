@echo off
title Zentraw V1.4.0.a.3 - RESTART BACKEND
color 0C
echo.
echo ==========================================
echo   REINICIANDO BACKEND COM CORREÇÕES
echo ==========================================
echo.

cd /d "%~dp0"

echo 🛑 Parando processos Node.js existentes...
taskkill /F /IM node.exe /T >nul 2>&1

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando backend corrigido...
echo 📡 Porta: 3004
echo 🔧 Melhorias: Detecção de Blender, tratamento de erro
echo.

node server-simple-real.cjs
