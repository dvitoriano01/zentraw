@echo off
echo ============================================
echo 🎵 ZENTRAW V1.4.0.a.5 - TESTE BÁSICO WAV (SEM CODEC AAC)
echo ============================================
echo Data: %date% %time%
echo Branch: Feat_V1.4.0.a.5_Render_MP4_com_audio
echo Objetivo: Testar MP4 básico com análise .WAV (sem áudio integrado)
echo ============================================

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 📋 VERIFICAÇÃO DE ARQUIVOS DE TESTE:
echo ============================================
if exist "Blender\sample_audio2.wav" (
    echo ✅ sample_audio2.wav encontrado
    for %%A in ("Blender\sample_audio2.wav") do echo    Tamanho: %%~zA bytes
) else (
    echo ❌ sample_audio2.wav NÃO encontrado!
    pause
    exit /b 1
)

if exist "Blender\sample_cover.jpg" (
    echo ✅ sample_cover.jpg encontrado  
    for %%A in ("Blender\sample_cover.jpg") do echo    Tamanho: %%~zA bytes
) else (
    echo ❌ sample_cover.jpg NÃO encontrado!
    pause
    exit /b 1
)

if exist "Blender\template.blend" (
    echo ✅ template.blend encontrado
    for %%A in ("Blender\template.blend") do echo    Tamanho: %%~zA bytes
) else (
    echo ❌ template.blend NÃO encontrado!
    pause  
    exit /b 1
)

echo.
echo 🔍 VERIFICAÇÃO DO SCRIPT PYTHON V1.4.0.a.5:
echo ============================================
if exist "Blender\render_audio_visualizer.py" (
    echo ✅ render_audio_visualizer.py encontrado
    findstr /C:"V1.4.0.a.5" "Blender\render_audio_visualizer.py" >nul
    if %errorlevel%==0 (
        echo ✅ Versão V1.4.0.a.5 básico confirmada no script
        findstr /C:"BÁSICO WAV" "Blender\render_audio_visualizer.py" >nul
        if %errorlevel%==0 (
            echo ✅ Configuração básica .WAV encontrada no script
        ) else (
            echo ❌ Configuração básica .WAV NÃO encontrada no script!
            pause
            exit /b 1
        )
    ) else (
        echo ❌ Versão V1.4.0.a.5 NÃO encontrada no script!
        pause
        exit /b 1
    )
) else (
    echo ❌ render_audio_visualizer.py NÃO encontrado!
    pause
    exit /b 1
)

echo.
echo 🎯 RESULTADO DA VERIFICAÇÃO:
echo ============================================
echo ✅ Todos os arquivos de teste estão presentes
echo ✅ Script Python V1.4.0.a.5 básico (.WAV nativo) configurado
echo ✅ Sistema pronto para teste básico
echo.
echo 🚀 PRÓXIMO PASSO:
echo 1. Execute: start-simple-real.bat
echo 2. Abra: test-simple-real.html
echo 3. Use os arquivos de teste para upload
echo 4. Verifique se MP4 é gerado com animação baseada em .WAV
echo.
echo ============================================
echo 🎵 TESTE V1.4.0.a.5 BÁSICO - ARQUIVOS VALIDADOS!
echo ============================================
pause
