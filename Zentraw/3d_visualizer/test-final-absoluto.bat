@echo off
echo ========================================
echo TESTE FINAL - CAMINHOS ABSOLUTOS
echo ========================================

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

set AUDIO_PATH=%CD%\sample_audio2.wav
set IMAGE_PATH=%CD%\sample_cover.jpg
set OUTPUT_PATH=%CD%\test_final_output.mp4

echo Verificando arquivos...
echo Audio: %AUDIO_PATH%
if exist "%AUDIO_PATH%" (echo ✅ Audio encontrado) else (echo ❌ Audio NAO encontrado)

echo Image: %IMAGE_PATH%
if exist "%IMAGE_PATH%" (echo ✅ Image encontrada) else (echo ❌ Image NAO encontrada)

echo Output: %OUTPUT_PATH%
echo.

echo Executando com caminhos absolutos...
"C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_working.py -- "%AUDIO_PATH%" "%IMAGE_PATH%" "%OUTPUT_PATH%"

echo.
echo Resultado:
if errorlevel 1 (
    echo ❌ FALHOU - Exit code %errorlevel%
) else (
    echo ✅ SUCESSO - Exit code 0
    if exist "%OUTPUT_PATH%" (
        echo ✅ MP4 gerado!
        for %%f in ("%OUTPUT_PATH%") do echo    Tamanho: %%~zf bytes
    ) else (
        echo ❌ MP4 não foi gerado
    )
)

pause
