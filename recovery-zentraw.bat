@echo off
echo 🔌 ZENTRAW - RECOVERY SYSTEM V1.0.0
echo ========================================
echo.

echo 🔍 Verificando status dos serviços...
echo.

REM Verificar Admin Panel
echo [1/4] Verificando Admin Panel (porta 3003)...
netstat -ano | findstr :3003 >nul
if %errorlevel% equ 0 (
    echo ✅ Admin Panel: ATIVO
) else (
    echo ❌ Admin Panel: INATIVO - Reiniciando...
    cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Admin_Panel"
    start "Admin Panel" cmd /k "npm run dev"
    timeout /t 3 /nobreak >nul
)

REM Verificar 3D Visualizer
echo [2/4] Verificando 3D Visualizer (porta 3005)...
netstat -ano | findstr :3005 >nul
if %errorlevel% equ 0 (
    echo ✅ 3D Visualizer: ATIVO
) else (
    echo ⚠️ 3D Visualizer: INATIVO
    echo 💡 Para reativar: cd Zentraw\3d_visualizer && node server-v1.4.0.a.8-parametrizado.cjs
)

REM Verificar TemplateLibraryBuilder
echo [3/4] Verificando TemplateLibraryBuilder (porta 3004)...
netstat -ano | findstr :3004 >nul
if %errorlevel% equ 0 (
    echo ✅ TemplateLibraryBuilder: ATIVO
) else (
    echo ⚠️ TemplateLibraryBuilder: INATIVO
)

REM Verificar Music Intelligence
echo [4/4] Verificando Music Intelligence (porta 3006)...
netstat -ano | findstr :3006 >nul
if %errorlevel% equ 0 (
    echo ✅ Music Intelligence: ATIVO
) else (
    echo ⚠️ Music Intelligence: PLANEJADO
)

echo.
echo 🌐 Testando conectividade...
timeout /t 2 /nobreak >nul

REM Testar Admin Panel
curl -s http://localhost:3003/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Admin Panel API: RESPONDENDO
) else (
    echo ❌ Admin Panel API: SEM RESPOSTA
)

echo.
echo 🎯 RECOVERY COMPLETO!
echo ========================================
echo 📱 Admin Panel: http://localhost:3003
echo 🎬 3D Visualizer: http://localhost:3005
echo 📚 TemplateLibraryBuilder: http://localhost:3004
echo ========================================
echo.
pause
