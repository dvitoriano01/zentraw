@echo off
echo ==============================================
echo TESTE MP4 - V1.4.0.a.3 COM PATHS CORRIGIDOS
echo ==============================================
echo.

echo 1. Parando processos Node existentes...
taskkill /F /IM node.exe /T >nul 2>&1

echo 2. Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 3. Iniciando backend V1.4.0.a.3...
start "Backend V1.4.0.a.3" cmd /c "node server-simple-real.cjs"

echo 4. Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak

echo 5. Testando conexao API...
curl -s http://localhost:3004/api/test
echo.
echo.

echo 6. Verificando arquivos de teste...
if exist "test_audio.wav" (
    echo ✅ Audio file found: test_audio.wav
) else (
    echo ❌ Audio file NOT found: test_audio.wav
    echo    Copiando do TemplateLibraryBuilder...
    copy "..\..\..\TemplateLibraryBuilder\test_audio.wav" . >nul 2>&1
)

if exist "test_image.jpg" (
    echo ✅ Image file found: test_image.jpg
) else (
    echo ❌ Image file NOT found: test_image.jpg
    echo    Copiando do TemplateLibraryBuilder...
    copy "..\..\..\TemplateLibraryBuilder\test_image.jpg" . >nul 2>&1
)

echo.
echo 7. Executando teste de geracao MP4...
echo    Backend: localhost:3004
echo    Audio: test_audio.wav
echo    Image: test_image.jpg
echo.

curl -X POST http://localhost:3004/api/blender/audio-visualizer ^
  -F "audio=@test_audio.wav" ^
  -F "image=@test_image.jpg" ^
  --max-time 300 ^
  -w "Status Code: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo.
echo 8. Verificando arquivo MP4 gerado...
dir uploads\*.mp4 /O-D 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Nenhum arquivo MP4 encontrado em uploads\
) else (
    echo ✅ Arquivo MP4 gerado com sucesso!
)

echo.
echo ==============================================
echo TESTE CONCLUIDO
echo ==============================================
pause
