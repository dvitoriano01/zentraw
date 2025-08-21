@echo off
echo.
echo ============================================
echo   🚀 ZENTRAW V1.4.0.a.6 - QUICK START
echo   Sync Correction + Dynamic Interface  
echo ============================================
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 📋 Verificando arquivos V1.4.0.a.6...
if not exist "Blender\render_audio_visualizer_v1.4.0.a.6.py" (
    echo ❌ ERRO: Blender\render_audio_visualizer_v1.4.0.a.6.py não encontrado!
    pause
    exit /b 1
)

if not exist "interface-v1.4.0.a.6.html" (
    echo ❌ ERRO: interface-v1.4.0.a.6.html não encontrado!
    pause
    exit /b 1
)

if not exist "server-v1.4.0.a.6.cjs" (
    echo ❌ ERRO: server-v1.4.0.a.6.cjs não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivos V1.4.0.a.6 verificados!
echo.

echo 🔧 Instalando dependências...
if not exist "node_modules" (
    npm install express multer
) else (
    echo ✅ node_modules já existe
)

echo.
echo 🚀 Iniciando Backend V1.4.0.a.6...
echo 📡 URL: http://localhost:3004
echo 🎨 Interface: http://localhost:3004/
echo.
echo 💡 Recursos V1.4.0.a.6:
echo    - FPS dinâmico (24-60fps)
echo    - Resolução configurável (720p/1080p/4K)
echo    - Amplitude ajustável (1x-5x)
echo    - Sincronização por timestamp
echo.
echo ⏰ Iniciando em 3 segundos...
timeout /t 3 /nobreak >nul

node server-v1.4.0.a.6.cjs
