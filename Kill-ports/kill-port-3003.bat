@echo off
echo.
echo 🔪 ========================================
echo    ZENTRAW - KILL PORT 3003 (ADMIN PANEL)
echo ========================================
echo.

echo 📋 Verificando processos na porta 3003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3003') do (
    if "%%a" neq "" (
        echo 🎯 Processo encontrado: %%a
        echo 🔪 Matando processo %%a...
        taskkill /F /PID %%a >nul 2>&1
        if !errorlevel! equ 0 (
            echo ✅ Processo %%a eliminado com sucesso!
        ) else (
            echo ❌ Falha ao eliminar processo %%a
        )
    )
)

echo.
echo 🔄 Verificando se a porta está livre...
timeout /t 2 /nobreak >nul

netstat -ano | findstr :3003 >nul
if %errorlevel% equ 0 (
    echo ❌ Porta 3003 ainda ocupada! Forçando limpeza...
    
    rem Força eliminação de todos os processos Node.js
    taskkill /F /IM node.exe /T >nul 2>&1
    taskkill /F /IM nodemon.exe /T >nul 2>&1
    
    timeout /t 3 /nobreak >nul
    
    netstat -ano | findstr :3003 >nul
    if %errorlevel% equ 0 (
        echo ❌ ERRO: Não foi possível liberar a porta 3003
        echo 🔧 Reinicie o computador se o problema persistir
    ) else (
        echo ✅ Porta 3003 liberada com sucesso!
    )
) else (
    echo ✅ Porta 3003 livre!
)

echo.
echo 🎯 ========================================
echo    PORTA 3003 PROCESSADA
echo ========================================
echo.
pause
