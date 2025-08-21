@echo off
title Zentraw 3D Visualizer V1.4.0.a.3 - Backend FUNCIONANDO
color 0A
echo.
echo 🚀 Zentraw 3D Visualizer V1.4.0.a.3 - VOLTANDO AO QUE FUNCIONAVA
echo 📡 Port: 3004 ^| 🎯 Rota: /api/blender/audio-visualizer
echo.
cd /d "%~dp0"
echo 📁 Current Directory: %CD%
echo 🚀 Starting Backend V1.4.0.a.3 (.cjs)...
echo.
node server-simple-real.cjs
