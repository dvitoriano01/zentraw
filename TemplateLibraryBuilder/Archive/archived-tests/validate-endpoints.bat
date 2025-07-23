@echo off
echo 🧪 ZENTRAW V1.4.0.a.2 - VALIDAÇÃO DE ENDPOINTS
echo =============================================
echo.

:: Aguarda o servidor iniciar
echo ⏱️ Aguardando servidor iniciar...
timeout /t 3 /nobreak >nul

:: Testa endpoint básico
echo 🔍 Testando endpoint básico...
curl -s http://localhost:5000/api/blender/test | findstr "success" >nul
if %errorlevel% equ 0 (
    echo ✅ Endpoint /api/blender/test - OK
) else (
    echo ❌ Endpoint /api/blender/test - FALHA
)

:: Testa endpoint de preview
echo 🔍 Testando endpoint de preview...
curl -s -X POST http://localhost:5000/api/blender/preview | findstr "error" >nul
if %errorlevel% equ 0 (
    echo ✅ Endpoint /api/blender/preview - OK (retorna erro esperado)
) else (
    echo ❌ Endpoint /api/blender/preview - FALHA
)

:: Testa endpoint de render
echo 🔍 Testando endpoint de render...
curl -s -X POST http://localhost:5000/api/blender/render | findstr "error" >nul
if %errorlevel% equ 0 (
    echo ✅ Endpoint /api/blender/render - OK (retorna erro esperado)
) else (
    echo ❌ Endpoint /api/blender/render - FALHA
)

:: Testa endpoint de test-render
echo 🔍 Testando endpoint de test-render...
curl -s -X POST http://localhost:5000/api/blender/test-render | findstr "success" >nul
if %errorlevel% equ 0 (
    echo ✅ Endpoint /api/blender/test-render - OK
) else (
    echo ❌ Endpoint /api/blender/test-render - FALHA
)

echo.
echo 🎯 Validação completa!
pause
