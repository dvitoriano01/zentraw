@echo off
cls
title ZENTRAW - CORREÇÃO DE CAMINHOS COM ESPAÇOS
color 0B
echo.
echo ================================================
echo   ZENTRAW - CORREÇÃO CAMINHOS COM ESPAÇOS
echo ================================================
echo.
echo 🔧 PROBLEMA IDENTIFICADO:
echo    Caminhos com espaços não tinham aspas
echo    "C:\Users\Denys Victoriano" virava "C:\Users\Denys"
echo.
echo ✅ CORREÇÃO APLICADA:
echo    Todos os caminhos agora têm aspas duplas
echo.

cd /d "%~dp0"

echo 🛑 Parando backend atual...
taskkill /F /IM node.exe /T >nul 2>&1

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🚀 Iniciando backend corrigido...
start "Zentraw Backend" cmd /k "node server-simple-real.cjs"

echo ⏳ Aguardando backend inicializar (5 segundos)...
timeout /t 5 /nobreak >nul

echo 🎬 Testando geração de MP4...
echo.

curl -X POST "http://localhost:3004/api/blender/audio-visualizer" ^
     -F "audio=@Blender\sample_audio2.wav" ^
     -F "image=@Blender\sample_cover.jpg" ^
     --max-time 300 ^
     --write-out "%%{http_code}" ^
     --output final-response.json

echo.
echo.
echo 📄 RESPOSTA DO SERVIDOR:
type final-response.json

echo.
echo 📁 VERIFICANDO MP4 GERADO:
if exist "uploads\*.mp4" (
    echo ✅ SUCESSO! MP4 files encontrados:
    dir uploads\*.mp4 /b
) else (
    echo ❌ Ainda sem MP4. Verificar logs do backend.
)

echo.
echo 🎯 Teste com correção de caminhos completo!
pause
