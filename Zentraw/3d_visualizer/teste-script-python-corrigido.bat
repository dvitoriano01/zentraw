@echo off
echo ============================================
echo 🐍 TESTE CORREÇÃO SCRIPT PYTHON
echo ============================================
echo Data: %date% %time%
echo Problema: SyntaxError no script Python (unicode error)
echo Solução: Corrigido escape sequences
echo ============================================

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🔍 TESTE 1: VERIFICAR SCRIPT PYTHON CORRIGIDO
echo ============================================
echo Testando sintaxe do script Python...
echo.

set TEMPLATE="%cd%\Blender\template.blend"
set SCRIPT="%cd%\Blender\render_audio_visualizer.py"
set AUDIO="%cd%\Blender\sample_audio2.wav"
set IMAGE="%cd%\Blender\sample_cover.jpg"
set OUTPUT="%cd%\uploads\teste_corrigido.mp4"

if not exist uploads mkdir uploads

echo Comando corrigido:
echo "C:\Blender\blender.exe" --background %TEMPLATE% --python %SCRIPT% -- %AUDIO% %IMAGE% %OUTPUT%
echo.

echo Executando...
"C:\Blender\blender.exe" --background %TEMPLATE% --python %SCRIPT% -- %AUDIO% %IMAGE% %OUTPUT%

echo.
echo 🔍 VERIFICAR RESULTADO:
echo ============================================
if exist "uploads\teste_corrigido.mp4" (
    echo ✅ SUCESSO! Script Python corrigido funcionou!
    for %%A in ("uploads\teste_corrigido.mp4") do echo    Tamanho: %%~zA bytes
    echo    Localização: %cd%\uploads\teste_corrigido.mp4
    echo.
    echo 🎉 PROBLEMA RESOLVIDO! Era o script Python, não os paths!
) else (
    echo ❌ AINDA FALHOU! Pode haver outros problemas no script
)

echo.
echo 🚀 PRÓXIMO PASSO:
echo Se funcionou, reinicie o backend e teste na interface
echo Os paths estavam corretos, o problema era unicode no Python
echo.
echo ============================================
echo 🐍 TESTE SCRIPT PYTHON CONCLUÍDO!
echo ============================================
pause
