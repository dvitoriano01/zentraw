@echo off
cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🚀 ZENTRAW 3D VISUALIZER V1.4.0.a.8.1 - HOTFIX TEST
echo ================================================================
echo 🔧 HOTFIX: Compatibilidade total com Blender 4.5+ e EEVEE_NEXT
echo 🌐 Porta: 3004
echo ⚡ Engine: EEVEE_NEXT (Blender 4.5+ compatível)
echo 📺 Resolução Default: Full HD (1920x1080)
echo 🛑 Sistema Stop/Cancel: Ativado
echo.
echo 🌐 Interface: http://localhost:3004
echo.
echo ⚠️ Para parar: Ctrl+C
echo.

node server-v1.4.0.a.8-parametrizado.cjs
pause
