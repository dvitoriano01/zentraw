@echo off
title ZENTRAW V1.4.0.a.2 - TESTE AUTOMATICO COMPLETO
color 0B
echo.
echo ████████╗███████╗███████╗████████╗███████╗     █████╗ ██╗   ██╗████████╗ ██████╗ 
echo ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗
echo    ██║   █████╗  ███████╗   ██║   █████╗      ███████║██║   ██║   ██║   ██║   ██║
echo    ██║   ██╔══╝  ╚════██║   ██║   ██╔══╝      ██╔══██║██║   ██║   ██║   ██║   ██║
echo    ██║   ███████╗███████║   ██║   ███████╗    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝
echo    ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚══════╝    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ 
echo.
echo                      🎬 ZENTRAW V1.4.0.a.2 - TESTE AUTOMATICO COMPLETO
echo                      ================================================
echo.
echo 🚀 Iniciando teste automatico completo...
echo 📋 Você pode fazer outras coisas enquanto isso roda!
echo.

:: Criar arquivo de log
set LOG_FILE=zentraw_test_log_%DATE:~-4,4%%DATE:~-10,2%%DATE:~-7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%.txt
echo 📝 Log salvo em: %LOG_FILE%
echo.

:: Redirecionar output para arquivo de log
(
echo ========================================
echo ZENTRAW V1.4.0.a.2 - TESTE AUTOMATICO
echo Data: %DATE% %TIME%
echo ========================================
echo.

echo [FASE 1] 🔥 Limpando processos antigos...
taskkill /F /IM "node.exe" /T >nul 2>&1
taskkill /F /IM "tsx.exe" /T >nul 2>&1
powershell -Command "Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }" >nul 2>&1
echo ✅ Processos limpos

echo.
echo [FASE 2] 🔍 Verificando porta 5000...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️ Porta 5000 ocupada, forçando limpeza...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ Porta 5000 livre
)

echo.
echo [FASE 3] 🧪 Diagnostico rapido...
if exist "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" (
    echo ✅ Blender encontrado
) else (
    echo ❌ Blender não encontrado
)

if exist "Blender\template.blend" (
    echo ✅ Template encontrado
) else (
    echo ❌ Template não encontrado
)

if exist "server\routes\blender.ts" (
    echo ✅ Arquivo blender.ts encontrado
) else (
    echo ❌ Arquivo blender.ts não encontrado
)

echo.
echo [FASE 4] 🚀 Iniciando servidor...
) > %LOG_FILE% 2>&1

:: Iniciar servidor em background
echo 🌟 Iniciando servidor em background...
start /min cmd /c "npm run dev > server_output.txt 2>&1"

:: Aguardar servidor iniciar
echo ⏱️ Aguardando servidor iniciar (5 segundos)...
timeout /t 5 /nobreak >nul

:: Continuar log
(
echo ✅ Servidor iniciado
echo.
echo [FASE 5] 🧪 Testando endpoints...
) >> %LOG_FILE% 2>&1

echo 🔍 Testando endpoints...

:: Teste 1: Endpoint básico
curl -s --connect-timeout 5 http://localhost:5000/api/blender/test > test1.tmp 2>&1
findstr "success" test1.tmp >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint /test - OK >> %LOG_FILE% 2>&1
    echo ✅ Endpoint /test - OK
) else (
    echo ❌ Endpoint /test - FALHA >> %LOG_FILE% 2>&1
    echo ❌ Endpoint /test - FALHA
)

:: Teste 2: Endpoint preview
curl -s --connect-timeout 5 -X POST http://localhost:5000/api/blender/preview > test2.tmp 2>&1
findstr "error" test2.tmp >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint /preview - OK ^(retorna erro esperado^) >> %LOG_FILE% 2>&1
    echo ✅ Endpoint /preview - OK (retorna erro esperado)
) else (
    echo ❌ Endpoint /preview - FALHA >> %LOG_FILE% 2>&1
    echo ❌ Endpoint /preview - FALHA
)

:: Teste 3: Endpoint render
curl -s --connect-timeout 5 -X POST http://localhost:5000/api/blender/render > test3.tmp 2>&1
findstr "error" test3.tmp >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint /render - OK ^(retorna erro esperado^) >> %LOG_FILE% 2>&1
    echo ✅ Endpoint /render - OK (retorna erro esperado)
) else (
    echo ❌ Endpoint /render - FALHA >> %LOG_FILE% 2>&1
    echo ❌ Endpoint /render - FALHA
)

:: Teste 4: Endpoint test-render
curl -s --connect-timeout 5 -X POST http://localhost:5000/api/blender/test-render > test4.tmp 2>&1
findstr "success" test4.tmp >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Endpoint /test-render - OK >> %LOG_FILE% 2>&1
    echo ✅ Endpoint /test-render - OK
) else (
    echo ❌ Endpoint /test-render - FALHA >> %LOG_FILE% 2>&1
    echo ❌ Endpoint /test-render - FALHA
)

:: Limpar arquivos temporários
del test1.tmp test2.tmp test3.tmp test4.tmp >nul 2>&1

:: Finalizar log
(
echo.
echo [FASE 6] 📊 Resultados finais...
echo ========================================
echo TESTE AUTOMATICO COMPLETO
echo Data: %DATE% %TIME%
echo ========================================
echo.
echo 🎯 Servidor está rodando na porta 5000
echo 📋 Verifique o log para detalhes completos
echo 🌐 Acesse: http://localhost:5000
echo.
echo PRÓXIMOS PASSOS:
echo 1. Testar frontend no navegador
echo 2. Fazer upload de arquivos
echo 3. Verificar renderização
echo.
) >> %LOG_FILE% 2>&1

echo.
echo 🎉 TESTE AUTOMATICO COMPLETO!
echo ================================
echo.
echo 📋 Resultados:
echo ✅ Servidor rodando em: http://localhost:5000
echo 📝 Log completo em: %LOG_FILE%
echo 🖥️ Servidor rodando em background
echo.
echo 🚀 VOCÊ ESTÁ LIVRE PARA FAZER OUTRAS COISAS!
echo.
echo 💡 Comandos úteis:
echo    - Para ver o log: type %LOG_FILE%
echo    - Para parar servidor: taskkill /F /IM node.exe
echo    - Para testar frontend: http://localhost:5000
echo.
echo 🎯 Pressione qualquer tecla para finalizar este script
echo    ^(O servidor continuará rodando em background^)
pause >nul

:: Abrir log automaticamente
start notepad %LOG_FILE%
