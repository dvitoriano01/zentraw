@echo off
echo ============================================
echo 🔧 DIAGNÓSTICO COMPLETO - PATHS COM ESPAÇOS
echo ============================================
echo Data: %date% %time%
echo Problema: Blender recebe paths truncados
echo ============================================

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🔍 TESTE 1: VERIFICAR PATHS MANUALMENTE
echo ============================================
echo Template.blend:
dir "Blender\template.blend"
echo.
echo Script Python:
dir "Blender\render_audio_visualizer.py"
echo.
echo Sample Audio:
dir "Blender\sample_audio2.wav"
echo.
echo Sample Image:
dir "Blender\sample_cover.jpg"
echo.

echo 🔍 TESTE 2: COMANDO BLENDER MANUAL
echo ============================================
echo Testando comando direto do Blender...
echo.

set TEMPLATE="%cd%\Blender\template.blend"
set SCRIPT="%cd%\Blender\render_audio_visualizer.py"
set AUDIO="%cd%\Blender\sample_audio2.wav"
set IMAGE="%cd%\Blender\sample_cover.jpg"
set OUTPUT="%cd%\uploads\manual_test.mp4"

echo Comando que será executado:
echo C:\Blender\blender.exe --background %TEMPLATE% --python %SCRIPT% -- %AUDIO% %IMAGE% %OUTPUT%
echo.

if not exist uploads mkdir uploads

echo Executando comando...
"C:\Blender\blender.exe" --background %TEMPLATE% --python %SCRIPT% -- %AUDIO% %IMAGE% %OUTPUT%

echo.
echo 🔍 TESTE 3: VERIFICAR RESULTADO
echo ============================================
if exist "uploads\manual_test.mp4" (
    echo ✅ SUCESSO! Arquivo MP4 gerado com comando manual
    for %%A in ("uploads\manual_test.mp4") do echo    Tamanho: %%~zA bytes
) else (
    echo ❌ FALHOU! Mesmo com comando manual
)

echo.
echo 🔧 TESTE 4: REINICIAR BACKEND CORRIGIDO
echo ============================================
echo Matando processos antigos...
taskkill /F /IM node.exe /T >nul 2>&1

echo Aguardando...
timeout /t 2 /nobreak >nul

echo Iniciando backend com correção (sem shell: true)...
start "Zentraw Backend CORRIGIDO" cmd /k "node server-simple-real.cjs"

echo.
echo 📋 INSTRUÇÕES:
echo 1. Se TESTE 2 funcionou → problema está no spawn com shell: true
echo 2. Se TESTE 2 falhou → problema é com paths ou scripts
echo 3. Teste agora na interface com backend corrigido
echo 4. Observe os logs detalhados dos argumentos
echo.
echo ============================================
echo 🔧 DIAGNÓSTICO PATHS CONCLUÍDO!
echo ============================================
pause
