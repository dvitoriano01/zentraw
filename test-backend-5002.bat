@echo off  
echo ==============================================
echo TESTE API - Backend na porta 5002
echo ==============================================
echo.

echo 1. Testando conexao API na porta 5002...
curl -s http://localhost:5002/api/blender/test
echo.
echo.

echo 2. Verificando se arquivos de teste existem...
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

if exist "test_audio.wav" (
    echo ✅ Audio file found: test_audio.wav
) else (
    echo ❌ Audio file NOT found: test_audio.wav
    pause
    exit /b 1
)

if exist "test_image.jpg" (
    echo ✅ Image file found: test_image.jpg  
) else (
    echo ❌ Image file NOT found: test_image.jpg
    pause
    exit /b 1
)

echo.
echo 3. Executando teste de geracao MP4...
echo    Backend: localhost:5002
echo    Audio: test_audio.wav
echo    Image: test_image.jpg
echo.

curl -X POST http://localhost:5002/api/blender/audio-visualizer ^
  -F "audio=@test_audio.wav" ^
  -F "image=@test_image.jpg" ^
  --max-time 300 ^
  -w "Status Code: %%{http_code}\nTime: %%{time_total}s\n"

echo.
echo.
echo 4. Verificando arquivos gerados...
dir uploads\*.mp4 /O-D 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Nenhum arquivo MP4 encontrado em uploads\
) else (
    echo ✅ Arquivo MP4 gerado com sucesso!
)

echo.
echo 5. Verificando logs de upload...
dir uploads\blender\*.* /O-D 2>nul

echo.
echo ==============================================
echo TESTE CONCLUIDO - Porta 5002
echo ==============================================
pause
