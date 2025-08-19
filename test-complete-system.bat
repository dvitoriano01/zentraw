@echo off
echo.
echo 🔍 ========================================
echo    ZENTRAW - TESTE COMPLETO DO SISTEMA
echo ========================================
echo.

echo 📋 1. Verificando portas em uso...
netstat -ano | findstr ":300"
echo.

echo 📋 2. Tentando conectar com Admin Panel...
curl http://localhost:3003/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ Admin Panel CONECTADO na porta 3003
) else (
    echo ❌ Admin Panel NAO RESPONDE
    echo 🔧 Iniciando Admin Panel...
    cd Admin_Panel
    start "Admin Panel" cmd /k "npm run dev"
    cd ..
    timeout /t 5 /nobreak >nul
    echo 🔄 Testando novamente...
    curl http://localhost:3003/health 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Admin Panel INICIADO com sucesso!
    ) else (
        echo ❌ Falha ao iniciar Admin Panel
    )
)
echo.

echo 📋 3. Testando API Manager...
curl http://localhost:3003/api/external-apis/status 2>nul
if %errorlevel% equ 0 (
    echo ✅ API Manager FUNCIONANDO
) else (
    echo ❌ API Manager com problemas
)
echo.

echo 📋 4. Verificando outros módulos...
curl http://localhost:3004/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ TemplateLibraryBuilder ATIVO (porta 3004)
) else (
    echo ⚪ TemplateLibraryBuilder OFFLINE (porta 3004)
)

curl http://localhost:3005/health 2>nul
if %errorlevel% equ 0 (
    echo ✅ 3D Visualizer ATIVO (porta 3005)
) else (
    echo ⚪ 3D Visualizer OFFLINE (porta 3005)
)
echo.

echo 🎯 ========================================
echo    TESTE COMPLETO FINALIZADO
echo ========================================
echo.
echo 🌐 URLs de acesso:
echo    Admin Panel: http://localhost:3003
echo    TemplateLibraryBuilder: http://localhost:3004
echo    3D Visualizer: http://localhost:3005
echo.
pause
