@echo off
echo ========================================
echo TESTE DIRETO DO BLENDER - V1.4.0.a.3
echo ========================================

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo.
echo 1. Testando Blender básico...
"C:\Blender\blender.exe" --version
echo.

echo 2. Testando carregamento do template...
"C:\Blender\blender.exe" --background template.blend --python-exit-code 1 --python-expr "print('Template loaded successfully')"
echo.

echo 3. Testando script Python com arquivos sample...
echo Comando que será executado:
echo "C:\Blender\blender.exe" --background "template.blend" --python "render_audio_visualizer_fixed.py" -- "sample_audio2.wav" "sample_cover.jpg" "test_output.mp4"
echo.

"C:\Blender\blender.exe" --background "template.blend" --python "render_audio_visualizer_fixed.py" -- "sample_audio2.wav" "sample_cover.jpg" "test_output.mp4"

echo.
echo 4. Verificando se MP4 foi gerado...
if exist "test_output.mp4" (
    echo ✅ MP4 gerado com sucesso!
    for %%f in (test_output.mp4) do echo    Tamanho: %%~zf bytes
) else (
    echo ❌ MP4 NÃO foi gerado
)

echo.
echo 5. Verificando uploads directory...
cd ..
if exist "uploads" (
    echo ✅ Pasta uploads existe
    dir uploads
) else (
    echo ❌ Pasta uploads não existe
)

echo.
echo ========================================
echo TESTE CONCLUÍDO
echo ========================================
pause
