@echo off
echo 🧪 TESTE V1.4.0.a.8.3 - Single Execution Control
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 📁 Diretório atual: %CD%
echo.

echo 🔍 Verificando arquivos principais...
if exist "server-v1.4.0.a.8.3-single.cjs" (
    echo ✅ server-v1.4.0.a.8.3-single.cjs - ENCONTRADO
) else (
    echo ❌ server-v1.4.0.a.8.3-single.cjs - NÃO ENCONTRADO
)

if exist "interface-v1.4.0.a.8.3-single.html" (
    echo ✅ interface-v1.4.0.a.8.3-single.html - ENCONTRADO
) else (
    echo ❌ interface-v1.4.0.a.8.3-single.html - NÃO ENCONTRADO
)

echo.
echo 🧪 Testando sintaxe do servidor...
node -c server-v1.4.0.a.8.3-single.cjs
if %ERRORLEVEL% == 0 (
    echo ✅ Sintaxe do servidor - OK
) else (
    echo ❌ Sintaxe do servidor - ERRO
)

echo.
echo 🚀 Iniciando servidor para teste (5 segundos)...
echo 🌐 Acesse: http://localhost:3004
echo 📋 Interface: interface-v1.4.0.a.8.3-single.html
echo.

timeout /t 2 /nobreak >nul

start /min node server-v1.4.0.a.8.3-single.cjs

echo ⏳ Aguardando servidor inicializar...
timeout /t 3 /nobreak >nul

echo.
echo 🔍 Testando endpoints...

powershell -Command "$response = try { Invoke-WebRequest -Uri 'http://localhost:3004/health' -UseBasicParsing -TimeoutSec 5; $response.Content } catch { 'Server not responding' }; Write-Host $response"

echo.
echo 🛑 Parando servidor de teste...
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo ✅ Teste concluído!
echo 📋 Para iniciar manualmente: START-V1.4.0.a.8.3-SINGLE.bat
echo 🌐 Interface: http://localhost:3004
pause
