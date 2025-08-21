@echo off
echo 🔥 ZENTRAW 3D VISUALIZER - DIRECT REAL BACKEND
echo.

cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 📁 Directory: %CD%
echo.

echo 🔥 Starting DIRECT backend with BlenderServiceRobustV2...
echo This calls executeAudioVisualizerWithFallback DIRECTLY!
echo.

npx tsx server-direct.js

pause
