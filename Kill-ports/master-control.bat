@echo off
echo.
echo ⚡ ========================================
echo    ZENTRAW - MASTER CONTROL
echo ========================================
echo.
echo Escolha uma opção:
echo.
echo 1. 📊 Status do Sistema
echo 2. 🔪 Kill Porta 3003 (Admin Panel)
echo 3. 🔥 Kill Todas as Portas (3003-3006)
echo 4. ⚡ Restart Admin Panel
echo 5. 💥 Nuclear Reset (Limpa tudo)
echo 6. 🚪 Sair
echo.
set /p choice="Digite sua escolha (1-6): "

if "%choice%"=="1" goto status
if "%choice%"=="2" goto kill3003
if "%choice%"=="3" goto killall
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto nuclear
if "%choice%"=="6" goto exit

echo Opção inválida. Tente novamente.
pause
goto :eof

:status
call "%~dp0check-status.bat"
goto :eof

:kill3003
call "%~dp0kill-port-3003.bat"
goto :eof

:killall
call "%~dp0kill-all-ports.bat"
goto :eof

:restart
call "%~dp0restart-admin-panel.bat"
goto :eof

:nuclear
echo.
echo ⚠️ ATENÇÃO: Isso vai eliminar TODOS os processos Node.js!
echo.
set /p confirm="Tem certeza? (S/N): "
if /i "%confirm%"=="S" (
    call "%~dp0nuclear-reset.bat"
) else (
    echo Operação cancelada.
    pause
)
goto :eof

:exit
echo.
echo 👋 Até logo!
exit
