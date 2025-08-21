@echo off
chcp 65001 >nul
cls
echo ================================================================
echo        🛑 PARAR RENDER V1.4.0.a.8 ATUAL
echo ================================================================
echo 🚨 Finalizando todos os processos Blender e Python...

:: Parar processos Blender
taskkill /F /IM blender.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Blender finalizado
) else (
    echo ℹ️ Nenhum processo Blender encontrado
)

:: Parar processos Python
taskkill /F /IM python.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Python finalizado
) else (
    echo ℹ️ Nenhum processo Python encontrado
)

echo.
echo ================================================================
echo 🎯 ANÁLISE DO PROBLEMA:
echo ================================================================
echo ❌ PROBLEMA: Configuração ULTRA com 128 samples
echo ⏱️ TEMPO: Cada frame levava ~13 segundos
echo 📊 TOTAL: 60 frames × 13s = 13 minutos de render!
echo.
echo ✅ SOLUÇÃO: Usar preset FAST com 8 samples
echo ⚡ NOVO TEMPO: 60 frames × 0.5s = ~30 segundos total
echo ================================================================

timeout /t 3 >nul

echo.
echo 🚀 Deseja executar um TESTE RÁPIDO agora? (8 samples)
echo [S] Sim - Teste rápido (30 segundos)
echo [N] Não - Só parar os processos
echo.
set /p escolha="Digite S ou N: "

if /i "%escolha%"=="S" (
    echo.
    echo 🚀 Executando teste rápido...
    call TESTE-RAPIDO-V1.4.0.a.8.bat
) else (
    echo.
    echo ✅ Processos finalizados com sucesso
    echo 💡 Use TESTE-RAPIDO-V1.4.0.a.8.bat para teste rápido
)

pause
