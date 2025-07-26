@echo off
chcp 65001 >nul
cls
echo ================================================================
echo        🚀 ZENTRAW V1.4.0.a.8 - TESTE RÁPIDO (8 SAMPLES)
echo ================================================================
echo 🎯 CONFIGURAÇÃO: FAST (Render em ~30 segundos)
echo 📊 SAMPLES: 8 (vs 128 do teste anterior)
echo ⚡ FPS: 30 (adequado)
echo 🎨 RESOLUÇÃO: 1080x1920
echo ================================================================

:: Criar diretório de output se não existir
if not exist "output" mkdir output

:: Configurações FAST para teste rápido
set "CONFIG={"resolution":"1080x1920","fps":30,"samples":8,"renderEngine":"CYCLES","amplitudeMultiplier":3.0,"smoothing":1,"frequencyRange":"full","audioChannels":"mono","cubeScale":1.0,"maxScale":5.0,"cameraDistance":7.3,"lightIntensity":1000,"backgroundColor":"#1e3c72","cubeColor":"#4CAF50"}"

echo 🚀 Iniciando render RÁPIDO...
echo ⏱️ Tempo estimado: ~30 segundos

:: Executar script Python com configurações FAST
"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe" --background --python Blender\render_audio_visualizer_v1.4.0.a.8.py -- "sample_audio3.wav" "%CONFIG%"

echo.
echo ================================================================
if exist "output\*.mp4" (
    echo ✅ SUCESSO! Render concluído
    echo 📁 Arquivo disponível em: output\
    echo 🎬 Abrindo resultado...
    start "" "output"
) else (
    echo ❌ ERRO: Arquivo não foi gerado
    echo 🔍 Verifique os logs acima
)
echo ================================================================
pause
