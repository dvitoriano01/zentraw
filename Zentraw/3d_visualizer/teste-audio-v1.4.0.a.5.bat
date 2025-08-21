@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 🎵 TESTE V1.4.0.a.5 - MP4 COM ÁUDIO INTEGRADO
echo 📁 Diretório: %cd%
echo ⏰ Data/Hora: %date% %time%
echo ============================================
echo.

echo 📋 VERIFICANDO ARQUIVOS DE TESTE...
set BASE_DIR=%cd%
set AUDIO_FILE=%BASE_DIR%\Blender\sample_audio2.wav
set IMAGE_FILE=%BASE_DIR%\Blender\sample_cover.jpg
set TEMPLATE_FILE=%BASE_DIR%\Blender\template.blend
set OUTPUT_FILE=%BASE_DIR%\uploads\teste_audio_v1.4.0.a.5.mp4

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
echo 🎬 EXECUTANDO BLENDER V1.4.0.a.5 COM ÁUDIO INTEGRADO...
echo 📂 Comando: "C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "Blender\render_audio_visualizer.py" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"
echo.
echo 🔧 CORREÇÕES APLICADAS:
echo    ✅ Duração correta: duration_seconds * fps
echo    ✅ Codec AAC ativado: scene.render.ffmpeg.audio_codec = 'AAC'
echo    ✅ Sequence editor: Áudio carregado no Blender
echo    ✅ Caminhos absolutos: Paths Windows resolvidos
echo.

"C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "Blender\render_audio_visualizer.py" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"

echo.
echo ============================================
echo 🔍 VERIFICANDO RESULTADO V1.4.0.a.5:
echo ============================================

if exist "%OUTPUT_FILE%" (
    for %%I in ("%OUTPUT_FILE%") do (
        echo ✅ SUCESSO! MP4 COM ÁUDIO gerado!
        echo    📁 Arquivo: %%~fI
        echo    📏 Tamanho: %%~zI bytes
        echo.
        echo 🎯 VERIFICAÇÕES CRÍTICAS:
        echo    1. ⏱️ Duração deve ser ~8 segundos (igual ao áudio)
        echo    2. 🎵 Áudio deve estar presente e audível no MP4
        echo    3. 🎬 Animação sincronizada com áudio
        echo    4. 🔊 Codec AAC integrado
        echo.
        echo 💡 V1.4.0.a.5 - TESTE MP4 COM ÁUDIO:
        echo    - Abra o arquivo para verificar áudio
        echo    - Duração correta: 8 segundos
        echo    - Qualidade visual + sonora mantida
        echo.
        echo 🎉 SE TUDO FUNCIONOU: V1.4.0.a.5 COMPLETO!
    )
) else (
    echo ❌ ERRO: Arquivo MP4 não foi gerado!
    echo    Verifique os logs acima para diagnosticar.
    echo    Possível causa: Problema no sequence editor ou codec AAC
)

echo.
echo ============================================
echo 🏁 TESTE V1.4.0.a.5 COM ÁUDIO CONCLUÍDO!
echo ============================================
pause
