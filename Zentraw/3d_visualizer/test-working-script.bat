@echo off
echo ========================================
echo TESTE - SCRIPT WORKING (SEM NUMPY)
echo ========================================

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo Testando script render_audio_visualizer_working.py...
echo.

"C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_working.py -- sample_audio2.wav sample_cover.jpg test_working_output.mp4

echo.
echo Resultado do teste:
if errorlevel 1 (
    echo ❌ FALHOU - Exit code %errorlevel%
) else (
    echo ✅ SUCESSO - Exit code 0
    if exist "test_working_output.mp4" (
        echo ✅ MP4 gerado!
        for %%f in (test_working_output.mp4) do echo    Tamanho: %%~zf bytes
    ) else (
        echo ❌ MP4 não foi gerado
    )
)

pause
