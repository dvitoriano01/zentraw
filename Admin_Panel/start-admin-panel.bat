@echo off
echo ========================================
echo  ZENTRAW ADMIN PANEL V1.0.0
echo  Inicializacao Automatica
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale Node.js em: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/4] Verificando dependencias...
if not exist "node_modules\" (
    echo Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
) else (
    echo Dependencias ja instaladas.
)

echo [3/4] Verificando portas...
netstat -ano | findstr ":3001" >nul
if not errorlevel 1 (
    echo AVISO: Porta 3001 ja esta em uso!
    echo Tentando parar processos existentes...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo [4/4] Iniciando Admin Panel...
echo.
echo ========================================
echo  ZENTRAW ADMIN PANEL INICIANDO...
echo ========================================
echo  URL: http://localhost:3001
echo  Health: http://localhost:3001/health
echo  API: http://localhost:3001/api/status
echo ========================================
echo.

npm start
