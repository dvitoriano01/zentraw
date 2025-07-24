@echo off
title Zentraw V1.4.0.a.3 - TESTE MP4 RENDER
color 0A
echo.
echo =========================================
echo   ZENTRAW V1.4.0.a.3 - TESTE MP4 RENDER
echo =========================================
echo.
echo 🎯 Testando backend V1.4.0.a.3 que estava funcionando...
echo 📡 Server: http://localhost:3004
echo 🎬 Rota: POST /api/blender/audio-visualizer
echo.

cd /d "%~dp0"

echo 🔍 Verificando arquivos de teste...
if exist "Blender\sample_audio2.wav" (
    echo ✅ Audio file encontrado
) else (
    echo ❌ Audio file NAO encontrado
    pause
    exit /b 1
)

if exist "Blender\sample_cover.jpg" (
    echo ✅ Image file encontrado  
) else (
    echo ❌ Image file NAO encontrado
    pause
    exit /b 1
)

echo.
echo 🚀 Executando CURL para render MP4...
echo.

curl -X POST "http://localhost:3004/api/blender/audio-visualizer" ^
     -F "audio=@Blender\sample_audio2.wav" ^
     -F "image=@Blender\sample_cover.jpg" ^
     --max-time 300 ^
     --verbose

echo.
echo 📁 Verificando pasta uploads...
if exist "uploads\" (
    echo ✅ Pasta uploads existe
    dir uploads\*.mp4 /b 2>nul && echo ✅ Arquivos MP4 encontrados || echo ⚠️ Nenhum MP4 encontrado ainda
) else (
    echo ❌ Pasta uploads nao existe
)

echo.
echo 🎯 Teste completo!
pause
