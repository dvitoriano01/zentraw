@echo off
echo ===========================================
echo    ZENTRAW BACKEND RESTART WITH LOGGING
echo ===========================================

echo.
echo [1/4] Terminando processos Node.js existentes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM tsx.exe /T 2>nul

REM Verificar se porta 5001 ainda esta ocupada
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5001"') do (
    echo Matando processo na porta 5001: %%a
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 3 /nobreak>nul

echo.
echo [2/4] Navegando para o diretório...
cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo.
echo [3/4] Verificando dependências...
echo Verificando tsx...
where tsx >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing tsx globally...
    npm install -g tsx
)

echo.
echo [4/4] Iniciando backend com logging completo...
echo NODE_ENV=development
echo Comando: tsx server/backend-only.ts
echo Backend será iniciado na porta 5001
echo.

set NODE_ENV=development
set DEBUG=*
tsx server/backend-only.ts

pause
