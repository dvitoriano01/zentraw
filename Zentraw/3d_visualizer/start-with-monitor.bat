@echo off
title Zentraw 3D Visualizer V1.4.0.a.4 - Backend Monitor
color 0A
echo.
echo ███████╗███████╗███╗   ██╗████████╗██████╗  █████╗ ██╗    ██╗
echo ╚══███╔╝██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██║    ██║
echo   ███╔╝ █████╗  ██╔██╗ ██║   ██║   ██████╔╝███████║██║ █╗ ██║
echo  ███╔╝  ██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗██╔══██║██║███╗██║
echo ███████╗███████╗██║ ╚████║   ██║   ██║  ██║██║  ██║╚███╔███╔╝
echo ╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ 
echo.
echo 🎬 3D Visualizer V1.4.0.a.4 - Real Blender Execution
echo 📡 Port: 3004 ^| 🎯 MP4 Generation Ready
echo.
cd /d "%~dp0"
echo 📁 Current Directory: %CD%
echo 🚀 Starting Node.js Backend...
echo.
node server-simple-real.js
echo.
echo ⚠️  Backend stopped. Press any key to restart...
pause >nul
goto :eof
