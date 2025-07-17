@echo off
echo Forcando restart completo do backend...

REM Matar todos os processos Node.js
echo Matando processos Node.js...
taskkill /F /IM node.exe >nul 2>&1

REM Aguardar um pouco
timeout /t 2 >nul

REM Verificar se porta 5000 ainda esta ocupada
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000"') do (
    echo Matando processo na porta 5000: %%a
    taskkill /F /PID %%a >nul 2>&1
)

REM Aguardar mais um pouco
timeout /t 2 >nul

REM Reiniciar backend
echo Iniciando backend...
cd /d "%~dp0"
npm run dev:back
