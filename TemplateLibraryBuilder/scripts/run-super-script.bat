@echo off
title ZENTRAW BLENDER SUPER SCRIPT v2.0

echo.
echo ========================================================================
echo   ______ ______ _   _ _______ _____     _____ _    _ _____  ______ _____  
echo  ^|___  /^|  ____^| \ ^| ^|__   __^|  __ \   / ____^| ^|  ^| ^|  __ \^|  ____^|  __ \ 
echo     / / ^| ^|__  ^|  \^| ^|  ^| ^|  ^| ^|__) ^| ^| (___ ^| ^|  ^| ^| ^|__) ^| ^|__  ^| ^|__) ^|
echo    / /  ^|  __^| ^| . ` ^|  ^| ^|  ^|  _  /   \___ \^| ^|  ^| ^|  ___/^|  __^| ^|  _  / 
echo   / /__ ^| ^|____^| ^|\  ^|  ^| ^|  ^| ^| \ \   ____) ^| ^|__^| ^| ^|    ^| ^|____^| ^| \ \ 
echo  /_____^|______^|_^| \_^|  ^|_^|  ^|_^|  \_\ ^|_____/ \____/^|_^|    ^|______^|_^|  \_\
echo.
echo                 SUPER SCRIPT v2.0 - All-in-One Solution
echo ========================================================================
echo.
echo [INFO] Este script executa TUDO automaticamente:
echo        ✅ Diagnóstico completo do sistema
echo        🔧 Correção automática de todos os problemas
echo        🎯 Otimização do BlenderService  
echo        🧪 Testes automatizados completos
echo        📊 Relatório detalhado final
echo.
echo [WARN] IMPORTANTE: Feche todos os outros terminais/servidores antes de continuar
echo.

set /p confirm="Continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo [INFO] Operação cancelada pelo usuário.
    pause
    exit /b
)

echo.
echo [INFO] Mudando para diretório do projeto...
cd /d "%~dp0.."

echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js não encontrado! Instale o Node.js primeiro.
    pause
    exit /b 1
)

echo [INFO] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm não encontrado! Instale o Node.js primeiro.
    pause
    exit /b 1
)

:: Verificar instalação do Blender
blender --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Blender não encontrado! Instale o Blender e configure o PATH.
    pause
    exit /b 1
)

echo [INFO] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python não encontrado! Instale o Python e configure o PATH.
    pause
    exit /b 1
)

echo [INFO] Criando arquivo de log...
set LOG_FILE=zentraw-super-script-log.txt
echo [INFO] Log iniciado em %date% %time% > %LOG_FILE%

:: Adicionar opção para executar apenas partes do script
set /p option="Escolha uma opção (1: Diagnóstico, 2: Correção, 3: Testes, 4: Tudo): "
if "%option%"=="1" (
    echo [INFO] Executando apenas diagnóstico... >> %LOG_FILE%
    node scripts/zentraw-super-script.js --diagnostic >> %LOG_FILE% 2>&1
    goto end
) else if "%option%"=="2" (
    echo [INFO] Executando apenas correções... >> %LOG_FILE%
    node scripts/zentraw-super-script.js --fix >> %LOG_FILE% 2>&1
    goto end
) else if "%option%"=="3" (
    echo [INFO] Executando apenas testes... >> %LOG_FILE%
    node scripts/zentraw-super-script.js --test >> %LOG_FILE% 2>&1
    goto end
) else if "%option%"=="4" (
    echo [INFO] Executando todas as etapas... >> %LOG_FILE%
    node scripts/zentraw-super-script.js >> %LOG_FILE% 2>&1
) else (
    echo [ERROR] Opção inválida! >> %LOG_FILE%
    pause
    exit /b 1
)

:end
echo [INFO] Iniciando servidor backend...
npm run dev >> %LOG_FILE% 2>&1

echo [INFO] Iniciando servidor frontend...
cd TemplateLibraryBuilder && npm run dev:front >> %LOG_FILE% 2>&1

echo [INFO] Script concluído. Verifique o log em %LOG_FILE%.
pause
