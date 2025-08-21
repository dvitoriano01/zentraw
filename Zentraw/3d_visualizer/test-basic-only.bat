@echo off
echo ========================================
echo TESTE RÁPIDO - SCRIPT BÁSICO
echo ========================================

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo Testando script básico...
echo.

"C:\Blender\blender.exe" --background template.blend --python test_basic.py -- sample_audio2.wav sample_cover.jpg test_basic_output.mp4

echo.
echo Resultado do teste:
if errorlevel 1 (
    echo ❌ FALHOU - Exit code %errorlevel%
) else (
    echo ✅ SUCESSO - Exit code 0
)

pause
