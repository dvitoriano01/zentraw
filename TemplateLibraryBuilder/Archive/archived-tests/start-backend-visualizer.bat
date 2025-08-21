@echo off
echo 🎬 INICIANDO ZENTRAW 3D VISUALIZER BACKEND V1.4.0.a.2
echo.

cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 📁 Diretório atual: %CD%
echo.

echo � Instalando dependências...
npm install express multer cors

echo.
echo �🚀 Iniciando backend simples...
node backend-simple.js

pause
