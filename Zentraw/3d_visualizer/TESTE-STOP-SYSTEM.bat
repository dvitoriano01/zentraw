@echo off
chcp 65001 >nul
cls
echo ================================================================
echo      🧪 ZENTRAW V1.4.0.a.8 - TESTE SISTEMA STOP/CANCEL
echo ================================================================
echo 🎯 OBJETIVO: Validar botão Stop/Cancel da interface
echo 🛑 FUNCIONALIDADE: Parar render em execução
echo ⚡ STATUS: Novo sistema implementado
echo ================================================================

:: Verificar se backend está rodando
echo 🔍 Verificando backend...
curl -s http://localhost:3004/api/health >nul
if %errorlevel% neq 0 (
    echo ❌ Backend não está rodando na porta 3004
    echo 🚀 Iniciando backend V1.4.0.a.8...
    start "Backend V1.4.0.a.8" cmd /c "cd /d \"%~dp0\" && node server-v1.4.0.a.8-parametrizado.cjs"
    echo ⏳ Aguardando backend inicializar...
    timeout /t 5 >nul
)

echo.
echo ================================================================
echo           🎛️ INSTRUÇÕES DE TESTE
echo ================================================================
echo 1. 🌐 Interface será aberta automaticamente
echo 2. 📁 Selecione arquivo de áudio (sample_audio3.wav disponível)
echo 3. 🖼️ Selecione imagem (test_image.jpg disponível)
echo 4. ⚙️ Use preset "ULTRA" (128 samples - render longo)
echo 5. 🚀 Clique "Iniciar Render"
echo 6. ⏳ Aguarde alguns segundos (~10-15 segundos)
echo 7. 🛑 Clique "Parar Render" para testar cancelamento
echo 8. ✅ Verifique se render foi cancelado nos logs
echo ================================================================

echo.
echo 🌐 Abrindo interface de teste...
start http://localhost:3004

echo.
echo 📋 Arquivos de teste disponíveis:
echo    🎵 Blender\sample_audio3.wav
echo    🖼️ Blender\test_image.jpg

echo.
echo ================================================================
echo 🎯 TESTE: Sistema Stop/Cancel implementado
echo 💡 DICA: Use preset Ultra para ter tempo de testar o stop
echo 🔍 VALIDAÇÃO: Logs devem mostrar "Render cancelado pelo usuário"
echo ================================================================

pause
