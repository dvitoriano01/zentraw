@echo off
echo ==============================================
echo TESTE FINAL: CORRECAO DE PATHS COM ESPACOS
echo ==============================================
echo.

echo 1. Parando processos Node existentes...
taskkill /F /IM node.exe /T >nul 2>&1

echo 2. Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 3. Iniciando backend V1.4.0.a.3 com paths corrigidos...
start "Backend V1.4.0.a.3" cmd /c "node server-simple-real.cjs"

echo 4. Aguardando backend inicializar...
timeout /t 5 /nobreak

echo 5. Testando conexao API...
curl -s http://localhost:3004/api/test
echo.
echo.

echo 6. Testando geracao de MP4 com paths corrigidos...
echo    - Audio: test_audio.wav
echo    - Image: test_image.jpg
echo    - Backend: localhost:3004
echo.

curl -X POST http://localhost:3004/api/blender/audio-visualizer ^
  -F "audio=@test_audio.wav" ^
  -F "image=@test_image.jpg" ^
  --max-time 300 ^
  --progress-bar

echo.
echo.
echo 7. Verificando arquivo gerado...
dir uploads\*.mp4 /O-D

echo.
echo ==============================================
echo TESTE CONCLUIDO - Verificar se MP4 foi gerado
echo ==============================================
pause
