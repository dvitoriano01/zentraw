@echo off
REM ====================================================
REM ZENTRAW 3D VISUALIZER - Kill Port Script
REM Finaliza automaticamente processos na porta 5173 (Vite dev server)
REM Projeto: Zentraw 3D Audio Visualizer
REM Versão: V1.0.2.0
REM ====================================================

echo ========================================
echo   ZENTRAW - Liberando Porta 5173
echo ========================================

setlocal enabledelayedexpansion
set "FOUND=0"

REM Procura por processos na porta 5173
echo Verificando processos na porta 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    set PID=%%a
    set "FOUND=1"
    echo [INFO] Encontrado processo na porta 5173 com PID !PID!
    echo [ACTION] Finalizando processo !PID!...
    taskkill /F /PID !PID! >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo [SUCCESS] Processo !PID! finalizado com sucesso
    ) else (
        echo [WARNING] Erro ao finalizar processo !PID!
    )
)

if !FOUND! EQU 0 (
    echo [INFO] Nenhum processo encontrado na porta 5173
)

REM Verifica se a porta está realmente livre
timeout /t 2 /nobreak >nul
echo Verificando se a porta 5173 está livre...
netstat -ano | findstr :5173 | findstr LISTENING >nul
if !ERRORLEVEL! EQU 0 (
    echo [WARNING] Porta 5173 ainda ocupada! Tentando forçar liberação...
    REM Mata todos os processos node.exe como último recurso
    taskkill /F /IM node.exe >nul 2>&1
    echo [ACTION] Processos Node.js finalizados
) else (
    echo [SUCCESS] Porta 5173 está livre!
)

echo ========================================
echo   ZENTRAW - Porta 5173 Liberada
echo ========================================
echo.
echo Agora você pode executar: npm run dev
echo.
pause
exit /b 0
