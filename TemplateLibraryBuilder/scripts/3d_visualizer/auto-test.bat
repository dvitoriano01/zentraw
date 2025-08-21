@echo off
echo 🚀 ZENTRAW V1.4.0.a.2 - AUTOMAÇÃO DE TESTES COMPLETA
echo ===============================================
echo.

:: Função para matar todos os processos Node.js
echo 🔥 Matando todos os processos Node.js antigos...
taskkill /F /IM "node.exe" /T >nul 2>&1
taskkill /F /IM "tsx.exe" /T >nul 2>&1

:: Aguarda 2 segundos para processos terminarem
echo ⏱️ Aguardando processos terminarem...
timeout /t 2 /nobreak >nul

:: Limpa a porta 5000 usando PowerShell
echo 🧹 Limpando porta 5000...
powershell -Command "Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: Verifica se a porta está livre
echo 🔍 Verificando porta 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo ⚠️ Processo %%a ainda usando porta 5000, forçando kill...
    taskkill /F /PID %%a >nul 2>&1
)

:: Aguarda mais 1 segundo
timeout /t 1 /nobreak >nul

:: Verifica se a porta está realmente livre
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo ❌ Porta 5000 ainda ocupada, usando porta alternativa...
    set PORT=5001
) else (
    echo ✅ Porta 5000 livre!
    set PORT=5000
)

echo.
echo 🌟 Iniciando servidor na porta %PORT%...
echo.

:: Inicia o servidor
npm run dev

pause
