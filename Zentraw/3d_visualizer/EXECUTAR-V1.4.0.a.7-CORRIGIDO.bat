@echo off
chcp 65001 >nul
echo 🛡️ ZENTRAW V1.4.0.a.7 - CORREÇÃO RÁPIDA DE VALIDAÇÃO
echo ================================================
echo 📅 %date% %time%
echo.

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 🔍 VALIDAÇÃO RÁPIDA DOS ARQUIVOS ESSENCIAIS:
echo ============================================
echo.

echo [BACKUP V1.4.0.a.5 - BLINDAGEM]
if exist "server-simple-real.cjs" (
    for %%A in ("server-simple-real.cjs") do echo ✅ server-simple-real.cjs: %%~zA bytes - OK
) else (
    echo ❌ server-simple-real.cjs: AUSENTE - CRÍTICO!
    goto erro_critico
)

if exist "test-simple-real.html" (
    echo ✅ test-simple-real.html: OK
) else (
    echo ❌ test-simple-real.html: AUSENTE
)

if exist "Blender\render_audio_visualizer.py" (
    echo ✅ render_audio_visualizer.py: OK
) else (
    echo ❌ render_audio_visualizer.py: AUSENTE
)

echo.
echo [EVOLUTION V1.4.0.a.7 - NOVOS ARQUIVOS]
if exist "server-v1.4.0.a.7-blindado.cjs" (
    echo ✅ server-v1.4.0.a.7-blindado.cjs: OK
) else (
    echo ❌ server-v1.4.0.a.7-blindado.cjs: AUSENTE
)

if exist "interface-v1.4.0.a.7-blindada.html" (
    echo ✅ interface-v1.4.0.a.7-blindada.html: OK
) else (
    echo ❌ interface-v1.4.0.a.7-blindada.html: AUSENTE
)

if exist "Blender\render_audio_visualizer_v1.4.0.a.7.py" (
    echo ✅ render_audio_visualizer_v1.4.0.a.7.py: OK
) else (
    echo ❌ render_audio_visualizer_v1.4.0.a.7.py: AUSENTE
)

if exist "Blender\sample_audio3.wav" (
    for %%A in ("Blender\sample_audio3.wav") do echo ✅ sample_audio3.wav: %%~zA bytes - OK
) else (
    echo ❌ sample_audio3.wav: AUSENTE
)

echo.
echo 🎯 ESCOLHA RÁPIDA DE EXECUÇÃO:
echo =============================
echo.
echo [1] 🛡️ INICIAR V1.4.0.a.5 (MODO SEGURO - GARANTIDO)
echo [2] 🔧 INICIAR V1.4.0.a.7 (MODO EVOLUTION - TESTANDO)
echo [3] 🧪 TESTE DIRETO sample_audio3.wav
echo [4] 🚪 SAIR
echo.
set /p choice="Escolha (1-4): "

if "%choice%"=="1" goto iniciar_v5
if "%choice%"=="2" goto iniciar_v7
if "%choice%"=="3" goto teste_direto
if "%choice%"=="4" goto sair
goto escolha_invalida

:iniciar_v5
echo.
echo 🛡️ INICIANDO MODO SEGURO V1.4.0.a.5
echo ===================================
echo 🚀 Servidor: server-simple-real.cjs (porta 3004)
echo 🌐 Interface: test-simple-real.html
echo 📊 Status: FUNCIONAMENTO GARANTIDO
echo.
start "Zentraw V1.4.0.a.5 SEGURO" cmd /k "echo 🛡️ SERVIDOR V1.4.0.a.5 INICIADO && node server-simple-real.cjs"
timeout /t 2 /nobreak >nul
start "" "test-simple-real.html"
echo ✅ V1.4.0.a.5 INICIADO - Acesse http://localhost:3004
goto fim

:iniciar_v7
echo.
echo 🔧 INICIANDO MODO EVOLUTION V1.4.0.a.7
echo ======================================
echo 🚀 Servidor: server-v1.4.0.a.7-blindado.cjs (porta 3004)
echo 🌐 Interface: interface-v1.4.0.a.7-blindada.html
echo 📊 Status: SINCRONIZAÇÃO CORRIGIDA + LOGS
echo.
start "Zentraw V1.4.0.a.7 BLINDADO" cmd /k "echo 🛡️ SERVIDOR V1.4.0.a.7 INICIADO && node server-v1.4.0.a.7-blindado.cjs"
timeout /t 2 /nobreak >nul
start "" "interface-v1.4.0.a.7-blindada.html"
echo ✅ V1.4.0.a.7 INICIADO - Acesse http://localhost:3004
goto fim

:teste_direto
echo.
echo 🧪 EXECUTANDO TESTE DIRETO - SAMPLE_AUDIO3.WAV
echo ==============================================
cd Blender
echo 📋 Comando: C:\Blender\blender.exe --background template.blend --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav sample_cover.jpg test_output_direct.mp4
echo.
"C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav sample_cover.jpg test_output_direct.mp4
echo.
if exist "test_output_direct.mp4" (
    for %%A in ("test_output_direct.mp4") do echo ✅ SUCESSO: %%~nxA (%%~zA bytes)
) else (
    echo ❌ FALHA: MP4 não foi gerado
)
cd ..
goto fim

:escolha_invalida
echo ❌ Opção inválida! Digite 1, 2, 3 ou 4.
timeout /t 2 /nobreak >nul
goto menu

:erro_critico
echo.
echo ❌ ERRO CRÍTICO: Arquivos essenciais V1.4.0.a.5 ausentes!
echo 🔧 SOLUÇÃO: Restaurar backup ou recriar arquivos
pause
exit /b 1

:sair
echo 👋 Saindo...
exit /b 0

:fim
echo.
echo 🏁 EXECUÇÃO CONCLUÍDA
echo ====================
echo 🛡️ V1.4.0.a.5: BACKUP PRESERVADO
echo 🔧 V1.4.0.a.7: EVOLUTION ATIVA
echo 📊 Logs: Disponíveis na interface
echo.
pause

:menu
goto escolha_rapida
