@echo off
cls
echo.
echo ==========================================
echo   LIMPANDO TERMINAL E TESTANDO MP4
echo ==========================================
echo.

echo 🧹 Limpando terminal...
echo 📁 Navegando para diretorio correto...

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo ✅ Diretorio atual: %CD%
echo.

echo 🚀 Executando teste final MP4...
call test-final.bat

echo.
echo 🎯 Se ainda houver erro, vamos testar Blender manualmente...
echo.
pause
