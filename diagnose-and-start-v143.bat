@echo off
echo ================================================
echo ZENTRAW 3D VISUALIZER - DIAGNOSTICO E INICIO
echo ================================================
echo.

echo 1. Verificando se backend V1.4.0.a.3 existe...
cd "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

if exist "server-simple-real.cjs" (
    echo ✅ Backend V1.4.0.a.3 encontrado: server-simple-real.cjs
) else (
    echo ❌ Backend V1.4.0.a.3 NAO encontrado
    echo    Procurando alternativas...
    dir server*.* /b
    pause
    exit /b 1
)

echo.
echo 2. Parando processos conflitantes...
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo 3. Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo 4. Iniciando backend V1.4.0.a.3 na porta 3004...
echo    Arquivo: server-simple-real.cjs
echo    Porta: 3004 (documentada)
echo    CORS: Configurado para localhost:3000
echo.

start "Zentraw Backend V1.4.0.a.3" cmd /c "node server-simple-real.cjs & pause"

echo.
echo 5. Aguardando backend inicializar (8 segundos)...
timeout /t 8 /nobreak

echo.
echo 6. Testando conexao API na porta 3004...
curl -s http://localhost:3004/api/test
echo.

echo.
echo 7. Verificando se porta esta aberta...
netstat -an | findstr :3004

echo.
echo ================================================
echo DIAGNOSTICO CONCLUIDO
echo ================================================
echo.
echo Se backend iniciou corretamente:
echo - Backend: http://localhost:3004
echo - Interface: test-simple-real.html
echo.
echo Para interface web, execute:
echo serve -s . -l 3000
echo.
pause
