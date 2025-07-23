@echo off
title ZENTRAW V1.4.0.a.2 - AUTOMAÇÃO MASTER
color 0A
echo.
echo  ████████╗███████╗███╗   ██╗████████╗██████╗  █████╗ ██╗    ██╗
echo  ╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██║    ██║
echo     ██║   █████╗  ██╔██╗ ██║   ██║   ██████╔╝███████║██║ █╗ ██║
echo     ██║   ██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗██╔══██║██║███╗██║
echo     ██║   ███████╗██║ ╚████║   ██║   ██║  ██║██║  ██║╚███╔███╔╝
echo     ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝
echo.
echo                    🎬 3D VISUALIZER AUTOMAÇÃO V1.4.0.a.2
echo                    ======================================
echo.

:menu
echo 🎯 OPÇÕES DISPONÍVEIS:
echo.
echo [1] 🚀 Iniciar Testes Completos (Recomendado)
echo [2] 🔧 Diagnóstico de Erros
echo [3] 🧪 Validar Endpoints
echo [4] 🔥 Apenas Matar Processos
echo [5] 🌟 Apenas Iniciar Servidor
echo [6] 📊 Status do Sistema
echo [7] 🚪 Sair
echo.
set /p choice=Digite sua opção (1-7): 

if "%choice%"=="1" goto full_test
if "%choice%"=="2" goto diagnose
if "%choice%"=="3" goto validate
if "%choice%"=="4" goto kill_processes
if "%choice%"=="5" goto start_server
if "%choice%"=="6" goto system_status
if "%choice%"=="7" goto exit

echo ❌ Opção inválida!
pause
goto menu

:full_test
echo.
echo 🚀 EXECUTANDO TESTES COMPLETOS...
echo ================================
call diagnose-errors.bat
echo.
call auto-test.bat
echo.
start /wait validate-endpoints.bat
goto menu

:diagnose
echo.
echo 🔧 EXECUTANDO DIAGNÓSTICO...
echo ===========================
call diagnose-errors.bat
goto menu

:validate
echo.
echo 🧪 VALIDANDO ENDPOINTS...
echo ========================
call validate-endpoints.bat
goto menu

:kill_processes
echo.
echo 🔥 MATANDO PROCESSOS...
echo =====================
taskkill /F /IM "node.exe" /T >nul 2>&1
taskkill /F /IM "tsx.exe" /T >nul 2>&1
powershell -Command "Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
echo ✅ Processos terminados!
pause
goto menu

:start_server
echo.
echo 🌟 INICIANDO SERVIDOR...
echo =======================
npm run dev
goto menu

:system_status
echo.
echo 📊 STATUS DO SISTEMA...
echo ======================
echo 🔍 Verificando porta 5000...
netstat -ano | findstr :5000
echo.
echo 🔍 Processos Node.js ativos...
tasklist | findstr node.exe
echo.
echo 🔍 Processos TSX ativos...
tasklist | findstr tsx.exe
echo.
pause
goto menu

:exit
echo.
echo 👋 Saindo da automação...
echo ✅ Até logo!
pause
exit
