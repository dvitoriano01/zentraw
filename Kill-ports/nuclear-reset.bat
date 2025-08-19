@echo off
echo.
echo 🔥 ========================================
echo    ZENTRAW - NUCLEAR RESET
echo ========================================
echo.

echo 💀 ELIMINANDO TODOS OS PROCESSOS NODE...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
taskkill /F /IM npm.exe /T >nul 2>&1

echo 🎯 ELIMINANDO POR PID (MÉTODO AVANÇADO)...
for /f "skip=1 tokens=2" %%i in ('wmic process where "name='node.exe'" get ProcessId 2^>nul') do @if not "%%i"=="" taskkill /F /PID %%i >nul 2>&1

echo 🧹 AGUARDANDO PROCESSOS FINALIZAREM...
timeout /t 3 /nobreak >nul

echo � VERIFICANDO SE AINDA RESTAM PROCESSOS...
tasklist | findstr /i node >nul
if %errorlevel% equ 0 (
    echo ⚠️ Ainda há processos node! Forçando eliminação...
    wmic process where "name='node.exe'" delete >nul 2>&1
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ Todos os processos node eliminados!
)

echo 🧹 LIMPANDO CACHE DO NPM...
npm cache clean --force >nul 2>&1

echo 🔄 AGUARDANDO LIMPEZA COMPLETA...
timeout /t 3 /nobreak >nul

echo 📊 VERIFICANDO PORTAS...
netstat -ano | findstr ":300" >nul
if %errorlevel% equ 0 (
    echo ⚠️ Algumas portas ainda ocupadas
    netstat -ano | findstr ":300"
) else (
    echo ✅ Todas as portas 3000-3009 livres
)

echo.
echo 💥 ========================================
echo    RESET NUCLEAR CONCLUÍDO
echo ========================================
echo.
echo 🚀 Para reiniciar tudo, execute:
echo    restart-admin-panel.bat
echo.
pause
