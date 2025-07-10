@echo off
REM Script para atualizar automaticamente a versão das tasks do VS Code
REM Uso: update-version.bat

echo 🔄 Atualizando versão das tasks do VS Code...

cd /d "%~dp0.."
node scripts/update-version.js

if %errorlevel% neq 0 (
    echo ❌ Erro ao executar o script de atualização
    pause
    exit /b 1
)

echo ✅ Script executado com sucesso!
pause
