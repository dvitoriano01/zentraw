@echo off
echo.
echo 🔪 ========================================
echo    ZENTRAW - KILL ALL PORTS (3003-3006)
echo ========================================
echo.

setlocal enabledelayedexpansion

rem Array de portas do Zentraw
set ports=3003 3004 3005 3006

for %%p in (%ports%) do (
    echo.
    echo 📋 Processando porta %%p...
    
    set found=0
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
        if "%%a" neq "" (
            set found=1
            echo 🎯 Processo encontrado na porta %%p: %%a
            taskkill /F /PID %%a >nul 2>&1
            if !errorlevel! equ 0 (
                echo ✅ Processo %%a eliminado!
            ) else (
                echo ❌ Falha ao eliminar %%a
            )
        )
    )
    
    if !found! equ 0 (
        echo ⚪ Porta %%p já está livre
    )
)

echo.
echo 🔥 Eliminando TODOS os processos Node.js...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM nodemon.exe /T >nul 2>&1
taskkill /F /IM npm.exe /T >nul 2>&1

echo.
echo 🔄 Aguardando limpeza completa...
timeout /t 3 /nobreak >nul

echo.
echo 📊 Status final das portas:
for %%p in (%ports%) do (
    netstat -ano | findstr :%%p >nul
    if !errorlevel! equ 0 (
        echo ❌ Porta %%p ainda ocupada
    ) else (
        echo ✅ Porta %%p livre
    )
)

echo.
echo 🎯 ========================================
echo    LIMPEZA COMPLETA FINALIZADA
echo ========================================
echo.
pause
