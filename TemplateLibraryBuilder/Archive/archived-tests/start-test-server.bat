@echo off
echo 🎬 Iniciando servidor de teste Zentraw...
echo.
echo 🔧 Verificando se a porta 5000 está disponível...
netstat -an | find "5000" >nul
if %errorlevel% == 0 (
    echo ❌ Porta 5000 está em uso. Encerrando processos...
    taskkill /F /IM node.exe /T >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo ✅ Iniciando servidor...
node test-server-simple.js
pause
