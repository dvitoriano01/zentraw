@echo off
echo 🚀 ZENTRAW V1.4.0.a.2 - EXECUÇÃO DIRETA
echo =====================================
echo.

echo 🛑 Parando processos Node antigos...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM tsx.exe /T >nul 2>&1

echo ⏱️ Aguardando limpeza...
timeout /t 2 /nobreak >nul

echo 🧹 Limpando porta 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Matando processo %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo 🚀 Iniciando servidor...
npm run dev:back

pause
