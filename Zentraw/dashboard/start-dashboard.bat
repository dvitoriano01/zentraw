@echo off
echo.
echo ================================
echo  🎨 ZENTRAW DASHBOARD LAUNCHER
echo ================================
echo.
echo 🚀 Iniciando Zentraw Ecosystem Dashboard...
echo.

cd /d "%~dp0"

echo 📦 Verificando dependências...
if not exist "node_modules" (
    echo 📥 Instalando dependências...
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

echo.
echo 🔧 Iniciando servidor do dashboard...
echo 🌐 Dashboard será aberto em: http://localhost:3000
echo.
echo ⚡ Para parar o servidor, pressione Ctrl+C
echo.

start "" "http://localhost:3000"
npm start

pause
