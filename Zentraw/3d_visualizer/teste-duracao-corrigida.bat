@echo off
chcp 65001 > nul
echo.
echo ============================================
echo 🎵 TESTE V1.4.0.a.5 - DURAÇÃO E ÁUDIO CORRIGIDOS
echo 📁 Diretório: %cd%
echo ⏰ Data/Hora: %date% %time%
echo ============================================
echo.

echo 📋 VERIFICANDO ARQUIVOS DE TESTE...
if not exist "Blender\sample_audio2.wav" (
    echo ❌ ERRO: sample_audio2.wav não encontrado!
    pause
    exit /b 1
)

if not exist "Blender\sample_cover.jpg" (
    echo ❌ ERRO: sample_cover.jpg não encontrado!
    pause
    exit /b 1
)

if not exist "Blender\template.blend" (
    echo ❌ ERRO: template.blend não encontrado!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos de teste encontrados!
echo.

echo 🎬 EXECUTANDO BLENDER COM DURAÇÃO CORRIGIDA...
echo 📂 Comando: "C:\Blender\blender.exe" --background "Blender\template.blend" --python "Blender\render_audio_visualizer.py" -- "Blender\sample_audio2.wav" "Blender\sample_cover.jpg" "uploads\teste_duracao_corrigida.mp4"
echo.

"C:\Blender\blender.exe" --background "Blender\template.blend" --python "Blender\render_audio_visualizer.py" -- "Blender\sample_audio2.wav" "Blender\sample_cover.jpg" "uploads\teste_duracao_corrigida.mp4"

echo.
echo ============================================
echo 🔍 VERIFICANDO RESULTADO:
echo ============================================

if exist "uploads\teste_duracao_corrigida.mp4" (
    for %%I in ("uploads\teste_duracao_corrigida.mp4") do (
        echo ✅ SUCESSO! MP4 gerado com duração corrigida!
        echo    📁 Arquivo: %%~fI
        echo    📏 Tamanho: %%~zI bytes
        echo.
        echo 🎯 VERIFICAÇÕES CRÍTICAS:
        echo    1. ⏱️ Duração deve ser ~8 segundos (igual ao áudio)
        echo    2. 🎵 Áudio deve estar presente no MP4
        echo    3. 🎬 Animação sincronizada com áudio
        echo.
        echo 💡 DICA: Abra o arquivo para verificar:
        echo    - Duração correta: 8 segundos
        echo    - Áudio presente e audível
        echo    - Qualidade visual mantida
    )
) else (
    echo ❌ ERRO: Arquivo MP4 não foi gerado!
    echo    Verifique os logs acima para diagnosticar o problema.
)

echo.
echo ============================================
echo 🏁 TESTE DURAÇÃO CORRIGIDA CONCLUÍDO!
echo ============================================
pause
