@echo off
title Zentraw V1.4.0.a.3 - TESTE FINAL MP4
color 0A
echo.
echo =========================================
echo   TESTE FINAL - BACKEND CORRIGIDO
echo =========================================
echo.

cd /d "%~dp0"

echo 🎯 Testing backend V1.4.0.a.3 with corrections...
echo 📡 Server: http://localhost:3004
echo 🎬 Route: POST /api/blender/audio-visualizer
echo.

echo 🔍 Checking test files...
if exist "Blender\sample_audio2.wav" (
    echo ✅ Audio file found
) else (
    echo ❌ Audio file NOT found
    pause
    exit /b 1
)

if exist "Blender\sample_cover.jpg" (
    echo ✅ Image file found
) else (
    echo ❌ Image file NOT found
    pause
    exit /b 1
)

echo.
echo 🚀 Executing CURL for MP4 render with detailed output...
echo.

curl -X POST "http://localhost:3004/api/blender/audio-visualizer" ^
     -F "audio=@Blender\sample_audio2.wav" ^
     -F "image=@Blender\sample_cover.jpg" ^
     --max-time 300 ^
     --write-out "%%{http_code}" ^
     --output response.json

echo.
echo.
echo 📄 Server Response:
type response.json 2>nul

echo.
echo 📁 Checking uploads folder...
if exist "uploads\" (
    echo ✅ Uploads folder exists
    echo 📋 Files in uploads:
    dir uploads\ /b 2>nul
    echo.
    echo 🎬 MP4 files:
    dir uploads\*.mp4 /b 2>nul && echo ✅ MP4 files found! || echo ⚠️ No MP4 files yet
) else (
    echo ❌ Uploads folder does not exist
)

echo.
echo 🎯 Test complete! Check response.json for detailed server response.
echo.
pause
