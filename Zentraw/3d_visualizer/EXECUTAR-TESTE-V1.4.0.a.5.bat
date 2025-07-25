@echo off
echo ===== TESTE V1.4.0.a.5 - MP4 COM AUDIO =====
echo.
echo Executando Blender com as correcoes V1.4.0.a.5:
echo - Duracao corrigida
echo - Codec AAC ativado  
echo - Sequence editor integrado
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo Comando:
echo "C:\Blender\blender.exe" --background "Blender\template.blend" --python "Blender\render_audio_visualizer.py" -- "Blender\sample_audio2.wav" "Blender\sample_cover.jpg" "uploads\teste_v1.4.0.a.5_CMD.mp4"
echo.

"C:\Blender\blender.exe" --background "Blender\template.blend" --python "Blender\render_audio_visualizer.py" -- "Blender\sample_audio2.wav" "Blender\sample_cover.jpg" "uploads\teste_v1.4.0.a.5_CMD.mp4"

echo.
if exist "uploads\teste_v1.4.0.a.5_CMD.mp4" (
    echo ===== SUCESSO! MP4 COM AUDIO GERADO! =====
    dir "uploads\teste_v1.4.0.a.5_CMD.mp4"
    echo.
    echo Verificacoes:
    echo 1. Duracao: ~8 segundos
    echo 2. Audio: Deve estar presente
    echo 3. Codec: AAC integrado
    echo.
    echo V1.4.0.a.5 - TESTE CONCLUIDO!
) else (
    echo ===== ERRO: MP4 NAO FOI GERADO =====
)

pause
