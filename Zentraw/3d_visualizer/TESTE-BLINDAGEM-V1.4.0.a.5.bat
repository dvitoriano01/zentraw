@echo off
echo 🧪 TESTE BLINDAGEM V1.4.0.a.5 - VALIDAÇÃO SISTEMA ATUAL
echo ==========================================
cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"
echo 📁 Diretório atual: %cd%
echo.
echo 🔍 Validando arquivos essenciais...
if exist "server-simple-real.cjs" (
    echo ✅ server-simple-real.cjs: EXISTE
) else (
    echo ❌ server-simple-real.cjs: AUSENTE
)

if exist "test-simple-real.html" (
    echo ✅ test-simple-real.html: EXISTE
) else (
    echo ❌ test-simple-real.html: AUSENTE
)

if exist "Blender\render_audio_visualizer.py" (
    echo ✅ render_audio_visualizer.py: EXISTE
) else (
    echo ❌ render_audio_visualizer.py: AUSENTE
)

if exist "Blender\sample_audio3.wav" (
    echo ✅ sample_audio3.wav: EXISTE
) else (
    echo ❌ sample_audio3.wav: AUSENTE
)

echo.
echo 🚀 Iniciando servidor (pressione Ctrl+C para parar)...
node server-simple-real.cjs
