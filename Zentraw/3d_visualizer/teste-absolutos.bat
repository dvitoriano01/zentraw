@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 🔧 TESTE V1.4.0.a.5 - CAMINHOS ABSOLUTOS COMPLETOS
echo 📁 Diretório: %cd%
echo ⏰ Data/Hora: %date% %time%
echo ============================================
echo.

echo 📋 VERIFICANDO ARQUIVOS COM CAMINHOS ABSOLUTOS...
set BASE_DIR=%cd%
set AUDIO_FILE=%BASE_DIR%\Blender\sample_audio2.wav
set IMAGE_FILE=%BASE_DIR%\Blender\sample_cover.jpg
set TEMPLATE_FILE=%BASE_DIR%\Blender\template.blend
set OUTPUT_FILE=%BASE_DIR%\uploads\teste_absoluto.mp4

echo 🎵 Áudio: %AUDIO_FILE%
if not exist "%AUDIO_FILE%" (
    echo ❌ ERRO: Áudio não encontrado!
    pause
    exit /b 1
) else (
    echo ✅ Áudio encontrado!
)

echo 🖼️ Imagem: %IMAGE_FILE%
if not exist "%IMAGE_FILE%" (
    echo ❌ ERRO: Imagem não encontrada!
    pause
    exit /b 1
) else (
    echo ✅ Imagem encontrada!
)

echo 🎬 Template: %TEMPLATE_FILE%
if not exist "%TEMPLATE_FILE%" (
    echo ❌ ERRO: Template não encontrado!
    pause
    exit /b 1
) else (
    echo ✅ Template encontrado!
)

echo.
echo 🎬 EXECUTANDO BLENDER COM CAMINHOS ABSOLUTOS COMPLETOS...
echo 📂 Comando: "C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "Blender\render_audio_visualizer.py" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"
echo.

"C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "Blender\render_audio_visualizer.py" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"

echo.
echo ============================================
echo 🔍 VERIFICANDO RESULTADO:
echo ============================================

if exist "%OUTPUT_FILE%" (
    for %%I in ("%OUTPUT_FILE%") do (
        echo ✅ SUCESSO! MP4 gerado com caminhos absolutos!
        echo    📁 Arquivo: %%~fI
        echo    📏 Tamanho: %%~zI bytes
        echo.
        echo 🎯 PROBLEMA RESOLVIDO: Caminhos absolutos funcionaram!
    )
) else (
    echo ❌ ERRO: Ainda não conseguiu gerar o arquivo.
    echo    Verifique os logs acima.
)

echo.
echo ============================================
echo 🏁 TESTE CAMINHOS ABSOLUTOS CONCLUÍDO!
echo ============================================
pause
