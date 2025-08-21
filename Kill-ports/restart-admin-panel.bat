@echo off
echo.
echo ⚡ ========================================
echo    ZENTRAW - RESTART ADMIN PANEL
echo ========================================
echo.

echo 🔪 PASSO 1: Eliminando processos na porta 3003...
call "%~dp0kill-port-3003.bat"

echo.
echo 🚀 PASSO 2: Iniciando Admin Panel...
cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Admin_Panel"

if not exist "package.json" (
    echo ❌ ERRO: package.json não encontrado em Admin_Panel
    echo 📍 Pasta atual: %cd%
    pause
    exit /b 1
)

echo 📦 Instalando dependências...
npm install >nul 2>&1

echo 🚀 Iniciando servidor...
start "Zentraw Admin Panel V1.0.0" cmd /k "npm run dev"

echo.
echo 🔄 Aguardando inicialização...
timeout /t 5 /nobreak >nul

echo.
echo 🔍 Verificando se o servidor está rodando...
curl http://localhost:3003/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ SUCESSO! Admin Panel rodando em http://localhost:3003
) else (
    echo ⏳ Servidor ainda inicializando... Aguarde mais alguns segundos
    timeout /t 5 /nobreak >nul
    curl http://localhost:3003/health 2>nul
    if %errorlevel% equ 0 (
        echo ✅ SUCESSO! Admin Panel rodando em http://localhost:3003
    ) else (
        echo ❌ ERRO: Servidor não responde. Verifique o terminal do Admin Panel
    )
)

echo.
echo 🌐 URLs disponíveis:
echo    Admin Panel: http://localhost:3003
echo    Live Server: http://127.0.0.1:5500/Admin_Panel/src/main.html
echo.
echo 🎯 ========================================
echo    RESTART CONCLUÍDO
echo ========================================
echo.
pause
