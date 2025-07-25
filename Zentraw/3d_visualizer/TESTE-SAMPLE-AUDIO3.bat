@echo off
echo 🧪 TESTE PRIMEIRO - SAMPLE_AUDIO3.WAV
echo ===================================
echo 🎯 Testando V1.4.0.a.5 com sample_audio3.wav SEM modificar código
echo 📁 Diretório: C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender
echo.

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo 🔍 Verificando arquivos necessários...
if exist "sample_audio3.wav" (
    echo ✅ sample_audio3.wav: EXISTE (%~z1 bytes)
) else (
    echo ❌ sample_audio3.wav: NÃO ENCONTRADO
    pause
    exit /b 1
)

if exist "sample_cover.jpg" (
    echo ✅ sample_cover.jpg: EXISTE
) else (
    echo ❌ sample_cover.jpg: NÃO ENCONTRADO
    pause
    exit /b 1
)

if exist "template.blend" (
    echo ✅ template.blend: EXISTE
) else (
    echo ❌ template.blend: NÃO ENCONTRADO
    pause
    exit /b 1
)

if exist "render_audio_visualizer.py" (
    echo ✅ render_audio_visualizer.py: EXISTE
) else (
    echo ❌ render_audio_visualizer.py: NÃO ENCONTRADO
    pause
    exit /b 1
)

echo.
echo 🚀 Executando Blender direto (bypass server para teste rápido)...
echo 📋 Comando:
echo C:\Blender\blender.exe --background template.blend --python render_audio_visualizer.py -- sample_audio3.wav sample_cover.jpg test_output_sample3.mp4

"C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer.py -- sample_audio3.wav sample_cover.jpg test_output_sample3.mp4

echo.
echo 🔍 Verificando resultado...
if exist "test_output_sample3.mp4" (
    for %%A in ("test_output_sample3.mp4") do echo ✅ MP4 gerado: %%~nxA (%%~zA bytes)
    echo 🎯 TESTE SUCESSO - sample_audio3.wav funcionou com código V1.4.0.a.5 atual!
) else (
    echo ❌ MP4 não foi gerado - possível problema de sincronização
    echo 🔍 Verificar logs do Blender acima
)

echo.
pause
