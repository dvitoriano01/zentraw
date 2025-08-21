@echo off
echo.
echo 🚀 ZENTRAW - POWERSHELL MASTER CONTROL V2.0
echo Baseado na sugestão do Team Grok IA
echo.

echo 🔧 Iniciando PowerShell Master Control...
powershell -ExecutionPolicy Bypass -File "%~dp0zentraw_master_control_v2_fixed.ps1"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao executar PowerShell!
    echo 💡 Dica: Execute como Administrador para melhor funcionamento
    echo.
    pause
)

echo.
echo 👋 PowerShell Master Control encerrado
pause
