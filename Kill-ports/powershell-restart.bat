@echo off
echo ⚡ ZENTRAW - RESTART ADMIN PANEL (PowerShell)
powershell -ExecutionPolicy Bypass -File "%~dp0zentraw_master_control_v2.ps1" -Action "restart"
pause
