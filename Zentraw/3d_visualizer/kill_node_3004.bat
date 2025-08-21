@echo off
REM Script para finalizar automaticamente o processo node.exe que ocupa a porta 3004
setlocal enabledelayedexpansion
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3004 ^| findstr LISTENING') do (
    set PID=%%a
    echo Finalizando node.exe com PID !PID!...
    taskkill /F /PID !PID! >nul 2>&1
)
echo Processo node.exe na porta 3004 finalizado (se existia).
exit /b 0
