@echo off
echo.
echo 📊 ========================================
echo    ZENTRAW - STATUS DO SISTEMA
echo ========================================
echo.

echo 🔍 PORTAS EM USO:
netstat -ano | findstr ":300"

echo.
echo 📋 PROCESSOS NODE.JS:
tasklist | findstr /i node

echo.
echo 🌐 TESTANDO CONECTIVIDADE:

curl http://localhost:3003/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ Admin Panel (3003): ONLINE
) else (
    echo ❌ Admin Panel (3003): OFFLINE
)

curl http://localhost:3004/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ TemplateLibraryBuilder (3004): ONLINE
) else (
    echo ❌ TemplateLibraryBuilder (3004): OFFLINE
)

curl http://localhost:3005/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ 3D Visualizer (3005): ONLINE
) else (
    echo ❌ 3D Visualizer (3005): OFFLINE
)

curl http://localhost:3006/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ Music Intelligence (3006): ONLINE
) else (
    echo ❌ Music Intelligence (3006): OFFLINE
)

echo.
echo 🎯 ========================================
echo    STATUS COMPLETO
echo ========================================
echo.
pause
