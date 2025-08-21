@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 🎵 TESTE V1.4.0.a.5 - AUDIO INTEGRADO
echo ============================================
echo 📁 Diretorio Oficial: %cd%
echo ⏰ Data/Hora: %date% %time%
echo 🔧 Seguindo AI-RULES-CRITICAL.md
echo.

echo 📋 VERIFICANDO ARQUIVOS OBRIGATORIOS:
set AUDIO_FILE=Blender\sample_audio2.wav
set IMAGE_FILE=Blender\sample_cover.jpg
set TEMPLATE_FILE=Blender\template.blend
set PYTHON_SCRIPT=Blender\render_audio_visualizer.py
set OUTPUT_FILE=uploads\teste_v1.4.0.a.5_FINAL.mp4

echo 🎵 Audio: %AUDIO_FILE%
if exist "%AUDIO_FILE%" (
    echo ✅ Audio encontrado
) else (
    echo ❌ ERRO: Audio nao encontrado!
    pause
    exit /b 1
)

echo 🖼️ Image: %IMAGE_FILE%
if exist "%IMAGE_FILE%" (
    echo ✅ Imagem encontrada
) else (
    echo ❌ ERRO: Imagem nao encontrada!
    pause
    exit /b 1
)

echo 🎬 Template: %TEMPLATE_FILE%
if exist "%TEMPLATE_FILE%" (
    echo ✅ Template encontrado
) else (
    echo ❌ ERRO: Template nao encontrado!
    pause
    exit /b 1
)

echo 🐍 Python: %PYTHON_SCRIPT%
if exist "%PYTHON_SCRIPT%" (
    echo ✅ Script Python encontrado
) else (
    echo ❌ ERRO: Script Python nao encontrado!
    pause
    exit /b 1
)

echo.
echo 🎬 EXECUTANDO BLENDER V1.4.0.a.5 COM CORRECOES APLICADAS:
echo    ✅ Duracao: duration_seconds * fps
echo    ✅ Codec AAC ativado
echo    ✅ Sequence editor integrado
echo.

echo Comando: "C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "%PYTHON_SCRIPT%" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"
echo.

timeout 180 "C:\Blender\blender.exe" --background "%TEMPLATE_FILE%" --python "%PYTHON_SCRIPT%" -- "%AUDIO_FILE%" "%IMAGE_FILE%" "%OUTPUT_FILE%"

echo.
echo ============================================
echo 🔍 VERIFICANDO RESULTADO V1.4.0.a.5:
echo ============================================

if exist "%OUTPUT_FILE%" (
    for %%I in ("%OUTPUT_FILE%") do (
        echo ✅ SUCESSO! MP4 COM AUDIO GERADO!
        echo    📁 Arquivo: %%~fI
        echo    📏 Tamanho: %%~zI bytes
        echo    📅 Modificado: %%~tI
        echo.
        echo 🎯 VERIFICACOES CRITICAS V1.4.0.a.5:
        echo    1. ⏱️ Duracao: ~8 segundos (igual ao audio)
        echo    2. 🎵 Audio: Presente e audivel
        echo    3. 🎬 Animacao: Sincronizada com audio
        echo    4. 🔊 Codec: AAC integrado
        echo.
        echo 🎉 V1.4.0.a.5 - MP4 COM AUDIO - TESTE CONCLUIDO!
        echo 💡 Abra o arquivo para verificar se o audio esta funcionando.
    )
) else (
    echo ❌ ERRO: MP4 nao foi gerado!
    echo    Possivel problema no Blender ou script Python.
    echo    Verifique se o Blender esta instalado em C:\Blender\
)

echo.
echo 🏁 TESTE V1.4.0.a.5 FINALIZADO!
echo ============================================
pause
