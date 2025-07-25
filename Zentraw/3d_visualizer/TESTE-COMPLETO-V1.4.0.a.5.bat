@echo off
echo ===== TESTE COMPLETO V1.4.0.a.5 =====
echo.
echo 1. Iniciando servidor V1.4.0.a.5...
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"
start /b node server-simple-real.cjs
timeout /t 3 /nobreak >nul

echo 2. Testando conexao...
curl http://localhost:3004/api/test
echo.

echo 3. Testando geracao MP4 direta...
"C:\Blender\blender.exe" --background "Blender\template.blend" --python "Blender\render_audio_visualizer.py" -- "Blender\sample_audio2.wav" "Blender\sample_cover.jpg" "uploads\teste_v1.4.0.a.5_FINAL.mp4"

echo 4. Verificando resultado...
if exist "uploads\teste_v1.4.0.a.5_FINAL.mp4" (
    echo ✅ SUCESSO: MP4 V1.4.0.a.5 gerado!
    for %%A in ("uploads\teste_v1.4.0.a.5_FINAL.mp4") do echo Tamanho: %%~zA bytes
) else (
    echo ❌ ERRO: MP4 não foi gerado
)

echo.
echo ===== TESTE V1.4.0.a.5 FINALIZADO =====
pause
