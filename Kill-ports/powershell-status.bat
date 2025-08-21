@echo off
echo 📊 ZENTRAW - STATUS DO SISTEMA (PowerShell)
powershell -ExecutionPolicy Bypass -File "%~dp0zentraw_master_control_v2.ps1" -Action "status"
pause
