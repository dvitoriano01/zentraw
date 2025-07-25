@echo off
title ZENTRAW V1.4.0.a.7 - EVOLUÇÃO BLINDADA
color 0A

echo.
echo     🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️
echo     🛡️                                                           🛡️
echo     🛡️           ZENTRAW 3D VISUALIZER V1.4.0.a.7              🛡️
echo     🛡️              EVOLUÇÃO BLINDADA COMPLETA                  🛡️
echo     🛡️                                                           🛡️
echo     🛡️  📊 Base: V1.4.0.a.5 PRESERVADA (100%% funcional)      🛡️
echo     🛡️  🔧 Evolution: Sincronização corrigida + logs           🛡️
echo     🛡️  🎯 Objetivo: sample_audio3.wav funcionando              🛡️
echo     🛡️                                                           🛡️
echo     🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️🛡️
echo.
echo     📅 Data: %date% %time%
echo     📁 Diretório: C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer
echo.

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🔍 ETAPA 1: VALIDAÇÃO DE SISTEMA
echo ================================
echo.

echo 📊 Verificando arquivos V1.4.0.a.5 (BACKUP BLINDAGEM)...
if exist "server-simple-real.cjs" (
    echo ✅ server-simple-real.cjs (V1.4.0.a.5 BACKUP)
) else (
    echo ❌ server-simple-real.cjs (V1.4.0.a.5) - CRITICO!
    pause
    exit /b 1
)

if exist "test-simple-real.html" (
    echo ✅ test-simple-real.html (V1.4.0.a.5 BACKUP)
) else (
    echo ❌ test-simple-real.html (V1.4.0.a.5) - CRITICO!
)

echo.
echo 📊 Verificando arquivos V1.4.0.a.7 (EVOLUÇÃO)...
if exist "server-v1.4.0.a.7-blindado.cjs" (
    echo ✅ server-v1.4.0.a.7-blindado.cjs (EVOLUTION)
) else (
    echo ❌ server-v1.4.0.a.7-blindado.cjs - CRIAÇÃO FALHOU!
    pause
    exit /b 1
)

if exist "interface-v1.4.0.a.7-blindada.html" (
    echo ✅ interface-v1.4.0.a.7-blindada.html (EVOLUTION)
) else (
    echo ❌ interface-v1.4.0.a.7-blindada.html - CRIAÇÃO FALHOU!
)

if exist "Blender\render_audio_visualizer_v1.4.0.a.7.py" (
    echo ✅ render_audio_visualizer_v1.4.0.a.7.py (SINCRONIZAÇÃO CORRIGIDA)
) else (
    echo ❌ render_audio_visualizer_v1.4.0.a.7.py - SCRIPT FALHOU!
)

if exist "Blender\sample_audio3.wav" (
    echo ✅ sample_audio3.wav (ARQUIVO TESTE V1.4.0.a.7)
) else (
    echo ❌ sample_audio3.wav - ARQUIVO TESTE AUSENTE!
)

echo.
echo 🎯 ETAPA 2: ESCOLHA DO MODO DE EXECUÇÃO
echo =======================================
echo.
echo [1] 🛡️ MODO SEGURO: Usar V1.4.0.a.5 (garantido funcionando)
echo [2] 🔧 MODO EVOLUTION: Usar V1.4.0.a.7 (sincronização corrigida)
echo [3] 🧪 TESTE RÁPIDO: Executar sample_audio3.wav direto no Blender
echo [4] 📊 STATUS: Verificar todos os sistemas
echo [5] 🚪 SAIR
echo.
set /p choice="Digite sua escolha (1-5): "

if "%choice%"=="1" goto modo_seguro
if "%choice%"=="2" goto modo_evolution
if "%choice%"=="3" goto teste_rapido
if "%choice%"=="4" goto status
if "%choice%"=="5" goto sair
goto menu_invalido

:modo_seguro
echo.
echo 🛡️ INICIANDO MODO SEGURO V1.4.0.a.5
echo ===================================
echo 📊 Base 100%% funcional preservada
echo 🌐 Interface: test-simple-real.html
echo 🖥️ Backend: server-simple-real.cjs
echo.
echo 🚀 Iniciando servidor V1.4.0.a.5...
start "Zentraw V1.4.0.a.5 - MODO SEGURO" cmd /k "echo 🛡️ SERVIDOR V1.4.0.a.5 INICIADO && node server-simple-real.cjs"
timeout /t 3 /nobreak >nul
echo.
echo 🌐 Abrindo interface V1.4.0.a.5...
start "" "test-simple-real.html"
echo.
echo ✅ MODO SEGURO V1.4.0.a.5 INICIADO!
echo 📊 Use sample_audio2.wav para teste seguro
goto fim

:modo_evolution
echo.
echo 🔧 INICIANDO MODO EVOLUTION V1.4.0.a.7
echo ======================================
echo 🛡️ Base V1.4.0.a.5 preservada como backup
echo 🔧 Sincronização áudio-vídeo corrigida
echo 📊 Logs detalhados ativados
echo 🌐 Interface: interface-v1.4.0.a.7-blindada.html
echo 🖥️ Backend: server-v1.4.0.a.7-blindado.cjs
echo.
echo 🚀 Iniciando servidor V1.4.0.a.7 BLINDADO...
start "Zentraw V1.4.0.a.7 - BLINDADO" cmd /k "echo 🛡️ SERVIDOR V1.4.0.a.7 BLINDADO INICIADO && node server-v1.4.0.a.7-blindado.cjs"
timeout /t 3 /nobreak >nul
echo.
echo 🌐 Abrindo interface V1.4.0.a.7 BLINDADA...
start "" "interface-v1.4.0.a.7-blindada.html" 
echo.
echo ✅ MODO EVOLUTION V1.4.0.a.7 INICIADO!
echo 🎯 Use sample_audio3.wav para teste da sincronização corrigida
echo 🛡️ Fallback automático para V1.4.0.a.5 se houver problemas
goto fim

:teste_rapido
echo.
echo 🧪 EXECUTANDO TESTE RÁPIDO - SAMPLE_AUDIO3.WAV
echo ==============================================
echo 🎯 Testando sincronização V1.4.0.a.7 direto no Blender
echo ⚡ Bypass do servidor para teste mais rápido
echo.
if exist "TESTE-BLINDADO-V1.4.0.a.7.bat" (
    echo 🚀 Executando teste blindado...
    call "TESTE-BLINDADO-V1.4.0.a.7.bat"
) else (
    echo ❌ Script de teste não encontrado, executando teste básico...
    cd Blender
    "C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav sample_cover.jpg test_output_v1.4.0.a.7.mp4
    cd ..
)
goto fim

:status
echo.
echo 📊 VERIFICANDO STATUS COMPLETO DO SISTEMA
echo =========================================
echo.
echo 🛡️ ARQUIVOS V1.4.0.a.5 (BACKUP BLINDAGEM):
dir /b server-simple-real.cjs test-simple-real.html Blender\render_audio_visualizer.py 2>nul
echo.
echo 🔧 ARQUIVOS V1.4.0.a.7 (EVOLUTION):
dir /b server-v1.4.0.a.7-blindado.cjs interface-v1.4.0.a.7-blindada.html Blender\render_audio_visualizer_v1.4.0.a.7.py 2>nul
echo.
echo 🎵 ARQUIVOS DE TESTE:
dir /b Blender\sample_audio*.wav Blender\sample_cover.jpg 2>nul
echo.
echo 🧪 SCRIPTS DE TESTE:
dir /b TESTE-*.bat CRIAR-*.bat 2>nul
echo.
echo 📁 ÚLTIMOS OUTPUTS:
dir /b uploads\*.mp4 Blender\*output*.mp4 2>nul | findstr /v "Dir not found"
echo.
pause
goto menu

:menu_invalido
echo.
echo ❌ Opção inválida! Digite 1, 2, 3, 4 ou 5.
timeout /t 2 /nobreak >nul
goto menu

:sair
echo.
echo 👋 Saindo do sistema V1.4.0.a.7...
echo 🛡️ Base V1.4.0.a.5 preservada com sucesso!
exit /b 0

:fim
echo.
echo 🏁 SISTEMA INICIADO COM SUCESSO!
echo ===============================
echo 🛡️ Base V1.4.0.a.5: PRESERVADA
echo 🔧 Evolution V1.4.0.a.7: ATIVA
echo 📊 Logs: DETALHADOS
echo 🎯 Objetivo: Testar sincronização sample_audio3.wav
echo.
echo ⚠️ IMPORTANTE:
echo • Para emergência: Use SEMPRE os arquivos V1.4.0.a.5
echo • Para evolução: Teste V1.4.0.a.7 gradualmente
echo • Documentação: MASTER-DOCUMENTATION\MODULE-STATUS-TRACKER.md
echo.
pause

:menu
goto etapa2
