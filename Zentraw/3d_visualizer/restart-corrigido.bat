@echo off
echo.
echo ============================================
echo   🚀 ZENTRAW V1.4.0.a.5 - SERVIDOR CORRIGIDO
echo   Forçando restart completo
echo ============================================
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 🔧 Matando todos os processos Node.js...
taskkill /F /IM node.exe /T >nul 2>&1

echo ⏱️ Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 📁 Verificando arquivos...
if not exist "server-simple-real.cjs" (
    echo ❌ ERRO: server-simple-real.cjs não encontrado!
    pause
    exit /b 1
)

if not exist "test-simple-real.html" (
    echo ❌ ERRO: test-simple-real.html não encontrado!
    pause
    exit /b 1
)

echo ✅ Arquivos encontrados!
echo.
echo 🚀 Iniciando servidor CORRIGIDO na porta 3004...
echo 📡 URLs disponíveis:
echo    - http://localhost:3004/
echo    - http://localhost:3004/test-simple-real.html
echo    - http://localhost:3004/api/test
echo.
echo 🔧 Servidor DEVE servir arquivos HTML agora!
echo.

node server-simple-real.cjs
