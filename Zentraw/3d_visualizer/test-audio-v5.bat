@echo off
echo ========================================
echo ZENTRAW V1.4.0.a.5 - TESTE DE AUDIO
echo ========================================
echo Data: %date% %time%
echo Objetivo: Testar integracao de audio AAC no MP4
echo.

echo 1. Verificando arquivos necessarios...
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

if not exist "Blender\render_audio_visualizer.py" (
    echo ❌ ERRO: Script Python nao encontrado
    pause
    exit /b 1
)

if not exist "Blender\template.blend" (
    echo ❌ ERRO: Template Blender nao encontrado
    pause
    exit /b 1
)

echo ✅ Arquivos encontrados

echo.
echo 2. Verificando se backend esta rodando...
curl -s http://localhost:3004/api/test >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Backend nao esta rodando. Iniciando...
    start /b start-simple-real.bat
    timeout /t 5 /nobreak >nul
) else (
    echo ✅ Backend ja esta rodando na porta 3004
)

echo.
echo 3. Verificando arquivos de teste...
if not exist "test_audio.wav" (
    echo ❌ ERRO: Arquivo de audio de teste nao encontrado
    echo Por favor, coloque um arquivo test_audio.wav no diretorio
    pause
    exit /b 1
)

if not exist "test_image.jpg" (
    echo ❌ ERRO: Arquivo de imagem de teste nao encontrado
    echo Por favor, coloque um arquivo test_image.jpg no diretorio
    pause
    exit /b 1
)

echo ✅ Arquivos de teste encontrados

echo.
echo 4. Limpando arquivos de saida anteriores...
if exist "Blender\test_audio_v5.mp4" del "Blender\test_audio_v5.mp4"
echo ✅ Preparado para teste

echo.
echo 5. EXECUTANDO TESTE DE AUDIO V1.4.0.a.5...
echo.
echo INSTRUCOES:
echo 1. Abra: http://localhost:3000/test-simple-real.html
echo 2. Faca upload do test_audio.wav e test_image.jpg
echo 3. Clique em "Execute Simple Real Blender"
echo 4. Aguarde o processamento
echo 5. Verifique se o MP4 gerado contem audio
echo.

echo ========================================
echo TESTE V1.4.0.a.5 PREPARADO!
echo ========================================
echo Modificacoes implementadas:
echo ✅ Audio codec: NONE → AAC
echo ✅ Audio bitrate: 192kbps
echo ✅ Audio channels: STEREO
echo ✅ Sample rate: 44100Hz
echo.
echo Pressione qualquer tecla para abrir a interface...
pause >nul

start http://localhost:3000/test-simple-real.html

echo.
echo Interface aberta! Execute o teste e verifique o resultado.
echo.
pause
