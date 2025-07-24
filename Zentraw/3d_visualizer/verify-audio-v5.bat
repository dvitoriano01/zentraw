@echo off
echo ========================================
echo ZENTRAW V1.4.0.a.5 - VERIFICACAO DE AUDIO
echo ========================================
echo.

echo Procurando arquivos MP4 recentes...
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo.
echo Arquivos MP4 encontrados:
for %%f in (*.mp4) do (
    echo - %%f ^(%%~zf bytes^)
)

echo.
set /p filename="Digite o nome do arquivo MP4 para verificar (ou pressione Enter para o mais recente): "

if "%filename%"=="" (
    for /f "delims=" %%i in ('dir /b /od *.mp4 2^>nul') do set filename=%%i
)

if not exist "%filename%" (
    echo ❌ ERRO: Arquivo %filename% nao encontrado
    pause
    exit /b 1
)

echo.
echo 📁 Verificando arquivo: %filename%
echo 📏 Tamanho: 
for %%f in ("%filename%") do echo    %%~zf bytes

echo.
echo 🎬 Tentando reproduzir o arquivo...
echo (Se houver audio, voce devera ouvi-lo)
echo.
echo Pressione qualquer tecla para reproduzir...
pause >nul

start "" "%filename%"

echo.
echo 🎵 TESTE DE AUDIO:
echo.
echo 1. O arquivo foi reproduzido?
echo 2. Voce consegue ouvir o audio original?
echo 3. A animacao visual esta sincronizada?
echo.
echo ========================================
echo RESULTADO V1.4.0.a.5:
echo ========================================
echo.
echo Se voce ouviu o audio:
echo ✅ SUCESSO! Sistema 100%% funcional
echo ✅ Integracao de audio funcionando
echo ✅ Zentraw V1.4.0.a.5 completo!
echo.
echo Se nao ouviu audio:
echo ❌ Audio ainda nao integrado
echo ⚠️  Necessario mais testes/ajustes
echo.
pause
