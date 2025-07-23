@echo off
echo 🎬 ZENTRAW 3D VISUALIZER - REAL BACKEND
echo.

cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 📁 Directory: %CD%
echo.

echo 🔥 Starting REAL backend with actual BlenderService...
echo This will execute the real Blender render!
echo.

npx tsx server-real.js

pause
