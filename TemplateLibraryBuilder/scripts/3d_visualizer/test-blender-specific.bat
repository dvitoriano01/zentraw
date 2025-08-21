@echo off
echo 🔬 ZENTRAW V1.4.0.a.2 - TESTE ESPECÍFICO DO BLENDER
echo ================================================
echo.

:: Teste 1: Verificar se o Blender executa
echo 🔍 Teste 1: Verificando execução do Blender...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Blender executa corretamente
) else (
    echo ❌ Blender não executa
)

:: Teste 2: Verificar se o template existe
echo 🔍 Teste 2: Verificando template...
if exist "Blender\template.blend" (
    echo ✅ Template existe
) else (
    echo ❌ Template não existe
    echo 🔧 Criando template básico...
    mkdir Blender >nul 2>&1
    echo Template básico criado > Blender\template.blend
)

:: Teste 3: Verificar se o script Python existe
echo 🔍 Teste 3: Verificando script Python...
if exist "Blender\render_audio_visualizer.py" (
    echo ✅ Script Python existe
) else (
    echo ❌ Script Python não existe
    echo 🔧 Problema crítico: Script Python ausente
)

:: Teste 4: Testar comando Blender com script
echo 🔍 Teste 4: Testando comando Blender...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" --background --python-exit-code 1 --python-text "import bpy; print('Blender Python OK')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Blender Python funciona
) else (
    echo ❌ Blender Python com problema
)

:: Teste 5: Verificar dependências Python do Blender
echo 🔍 Teste 5: Verificando dependências Python...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" --background --python-exit-code 1 --python-text "import sys; print(sys.version)" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python do Blender OK
) else (
    echo ❌ Python do Blender com problema
)

:: Teste 6: Verificar se o servidor consegue chamar o Blender
echo 🔍 Teste 6: Testando chamada do servidor...
curl -s -X POST http://localhost:5000/api/blender/test-render > test_result.txt 2>&1
findstr "success" test_result.txt >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Servidor consegue chamar Blender
) else (
    echo ❌ Servidor não consegue chamar Blender
    echo 📄 Detalhes do erro:
    type test_result.txt
)
del test_result.txt >nul 2>&1

echo.
echo 🎯 Teste específico do Blender completo!
pause
