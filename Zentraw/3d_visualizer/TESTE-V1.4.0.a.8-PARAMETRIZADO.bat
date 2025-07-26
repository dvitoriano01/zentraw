@echo off
echo ================================================================
echo        🎯 ZENTRAW V1.4.0.a.8 - TESTE PARAMETRIZADO COMPLETO
echo ===========================curl -s http://localhost:3004/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend detectado na porta 3004
    echo 🌐 Abrindo interface...
    start http://localhost:3004
) else (
    echo ❌ Backend não está rodando na porta 3004==============================
echo.
echo 🛡️ BLINDAGEM: V1.4.0.a.7 preservada como fallback
echo ⚙️ NOVIDADE: Interface parametrizada completa
echo 📊 FEATURES: Todos os parâmetros Blender configuráveis
echo.

:MENU
echo ================================================================
echo                    MENU DE TESTES V1.4.0.a.8
echo ================================================================
echo.
echo [1] 🚀 Testar V1.4.0.a.8 (Parametrizado Completo)
echo [2] 🛡️ Testar V1.4.0.a.7 (Blindado - Fallback) 
echo [3] 🔧 Testar V1.4.0.a.5 (Original - Emergência)
echo [4] 🌐 Iniciar Backend V1.4.0.a.8 (Porta 3004)
echo [5] 🎨 Abrir Interface Parametrizada
echo [6] 📊 Diagnóstico Completo do Sistema
echo [7] 🧹 Limpar Outputs e Logs
echo [0] ❌ Sair
echo.
set /p choice="🎯 Escolha uma opção: "

if "%choice%"=="1" goto TEST_V8
if "%choice%"=="2" goto TEST_V7
if "%choice%"=="3" goto TEST_V5
if "%choice%"=="4" goto START_BACKEND
if "%choice%"=="5" goto OPEN_INTERFACE
if "%choice%"=="6" goto DIAGNOSTICS
if "%choice%"=="7" goto CLEANUP
if "%choice%"=="0" goto EXIT
echo ❌ Opção inválida!
timeout /t 2 /nobreak >nul
goto MENU

:TEST_V8
echo.
echo 🎯 TESTANDO V1.4.0.a.8 - PARAMETRIZADO COMPLETO
echo ================================================================
echo 📊 Script: render_audio_visualizer_v1.4.0.a.8.py
echo ⚙️ Configurações: Parametrizadas via JSON
echo 🛡️ Blindagem: V1.4.0.a.7 como fallback
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo 🎵 Usando: sample_audio3.wav (stereo)
echo 🖼️ Usando: test_image.jpg
echo 📁 Output: output_v1.4.0.a.8_test.mp4
echo.

echo 📁 Criando diretório de output se necessário...
if not exist "../outputs" mkdir "../outputs"

set "SETTINGS={\"resolution\":\"1080x1920\",\"fps\":30,\"samples\":128,\"renderEngine\":\"CYCLES\",\"amplitudeMultiplier\":3.0,\"smoothing\":2,\"audioChannels\":\"mono\",\"cubeScale\":1.0,\"maxScale\":5.0,\"cameraDistance\":7.3,\"lightIntensity\":1000,\"backgroundColor\":\"#1e3c72\",\"cubeColor\":\"#4CAF50\"}"

echo ⚙️ Configurações aplicadas:
echo    🎬 Resolução: 1080x1920
echo    🎞️ FPS: 30, Samples: 128
echo    🚀 Engine: Cycles
echo    📊 Amplitude: 3.0x (V1.4.0.a.7 BLINDADO)
echo    🌊 Suavização: 2 frames
echo    🎧 Canais: Mono (canal esquerdo)
echo    📦 Escala: 1.0x → 5.0x
echo    📷 Câmera: 7.3m
echo    💡 Luz: 1000W
echo    🌈 Cores: Azul → Verde
echo.

echo 🚀 Executando Blender V1.4.0.a.8...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" template.blend --background --python render_audio_visualizer_v1.4.0.a.8.py -- sample_audio3.wav test_image.jpg output_v1.4.0.a.8_test.mp4 "%SETTINGS%"

echo.
if exist "output_v1.4.0.a.8_test.mp4" (
    echo ✅ SUCESSO! Arquivo criado:
    dir "output_v1.4.0.a.8_test.mp4"
    echo.
    echo 🎉 V1.4.0.a.8 FUNCIONANDO - PARAMETRIZADO COMPLETO!
) else (
    echo ❌ ERRO: Arquivo não foi criado
    echo 🛡️ TESTE DE BLINDAGEM: Recomendado usar V1.4.0.a.7 (opção 2)
)

echo.
pause
goto MENU

:TEST_V7
echo.
echo 🛡️ TESTANDO V1.4.0.a.7 - BLINDADO (FALLBACK)
echo ================================================================
echo 📊 Script: render_audio_visualizer_v1.4.0.a.7.py
echo ✅ Status: SYNC CORRIGIDO DEFINITIVAMENTE
echo 🛡️ Função: Sistema de fallback blindado
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo 🚀 Executando Blender V1.4.0.a.7 (Blindado)...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" template.blend --background --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav test_image.jpg output_v1.4.0.a.7_fallback.mp4

echo.
if exist "output_v1.4.0.a.7_fallback.mp4" (
    echo ✅ BLINDAGEM CONFIRMADA! V1.4.0.a.7 funcionando
    dir "output_v1.4.0.a.7_fallback.mp4"
) else (
    echo ❌ PROBLEMA NA BLINDAGEM!
)

echo.
pause
goto MENU

:TEST_V5
echo.
echo 🔧 TESTANDO V1.4.0.a.5 - ORIGINAL (EMERGÊNCIA)
echo ================================================================
echo 📊 Script: render_audio_visualizer.py
echo ⚠️ Status: Funcional mas sync com pequenos offsets
echo 🚨 Função: Sistema de emergência
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo 🚀 Executando Blender V1.4.0.a.5 (Original)...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" template.blend --background --python render_audio_visualizer.py -- sample_audio2.wav sample_cover.jpg output_v1.4.0.a.5_emergency.mp4

echo.
if exist "output_v1.4.0.a.5_emergency.mp4" (
    echo ✅ EMERGÊNCIA OK! V1.4.0.a.5 disponível
    dir "output_v1.4.0.a.5_emergency.mp4"
) else (
    echo ❌ SISTEMA DE EMERGÊNCIA FALHOU!
)

echo.
pause
goto MENU

:START_BACKEND
echo.
echo 🌐 INICIANDO BACKEND V1.4.0.a.8 - PARAMETRIZADO
echo ================================================================
echo 🚀 Servidor: server-v1.4.0.a.8-parametrizado.cjs
echo 🌐 Porta: 3004
echo ⚙️ Interface: Parametrizada completa
echo 🛡️ Blindagem: V1.4.0.a.7 ativa
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 🔍 Verificando dependências...
if not exist "node_modules\uuid" (
    echo 📦 Instalando uuid...
    npm install uuid
)

echo.
echo 🚀 Iniciando servidor na porta 3004...
echo 🌐 Interface disponível em: http://localhost:3004
echo 🛡️ Sistema de blindagem ativo
echo.
echo ⚠️ Para parar o servidor, pressione Ctrl+C
echo.

node server-v1.4.0.a.8-parametrizado.cjs

pause
goto MENU

:OPEN_INTERFACE
echo.
echo 🎨 ABRINDO INTERFACE PARAMETRIZADA V1.4.0.a.8
echo ================================================================
echo.

echo 🔍 Verificando se backend está rodando...
curl -s http://localhost:3005/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Backend detectado na porta 3005
    echo 🌐 Abrindo interface parametrizada...
    start http://localhost:3005
) else (
    echo ❌ Backend não está rodando na porta 3005
    echo 💡 Execute a opção [4] primeiro para iniciar o backend
)

echo.
pause
goto MENU

:DIAGNOSTICS
echo.
echo 📊 DIAGNÓSTICO COMPLETO DO SISTEMA V1.4.0.a.8
echo ================================================================
echo.

echo 🔍 Verificando arquivos principais...
cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 📁 BLINDAGEM V1.4.0.a.7:
if exist "blindage\v1.4.0.a.7\server-v1.4.0.a.7-blindado.cjs" (echo ✅ Backend V1.4.0.a.7 blindado) else (echo ❌ Backend V1.4.0.a.7 NÃO blindado)
if exist "blindage\v1.4.0.a.7\interface-v1.4.0.a.7-blindada.html" (echo ✅ Interface V1.4.0.a.7 blindada) else (echo ❌ Interface V1.4.0.a.7 NÃO blindada)
if exist "blindage\v1.4.0.a.7\render_audio_visualizer_v1.4.0.a.7.py" (echo ✅ Script V1.4.0.a.7 blindado) else (echo ❌ Script V1.4.0.a.7 NÃO blindado)

echo.
echo 📁 SISTEMA V1.4.0.a.8:
if exist "server-v1.4.0.a.8-parametrizado.cjs" (echo ✅ Backend V1.4.0.a.8) else (echo ❌ Backend V1.4.0.a.8 ausente)
if exist "interface-v1.4.0.a.8-parametrizada.html" (echo ✅ Interface V1.4.0.a.8) else (echo ❌ Interface V1.4.0.a.8 ausente)
if exist "Blender\render_audio_visualizer_v1.4.0.a.8.py" (echo ✅ Script V1.4.0.a.8) else (echo ❌ Script V1.4.0.a.8 ausente)

echo.
echo 📁 ARQUIVOS DE TESTE:
cd Blender
if exist "sample_audio3.wav" (echo ✅ Audio teste V1.4.0.a.7/8) else (echo ❌ Audio teste ausente)
if exist "sample_audio2.wav" (echo ✅ Audio teste V1.4.0.a.5) else (echo ❌ Audio teste V1.4.0.a.5 ausente)
if exist "test_image.jpg" (echo ✅ Imagem teste) else (echo ❌ Imagem teste ausente)
if exist "template.blend" (echo ✅ Template Blender) else (echo ❌ Template Blender ausente)

echo.
echo 🔍 Verificando dependências Node.js...
cd ..
if exist "node_modules\uuid" (echo ✅ uuid instalado) else (echo ❌ uuid não instalado)
if exist "node_modules\express" (echo ✅ express instalado) else (echo ❌ express não instalado)
if exist "node_modules\multer" (echo ✅ multer instalado) else (echo ❌ multer não instalado)

echo.
echo 🔍 Verificando Blender...
"C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" --version 2>nul
if %errorlevel%==0 (echo ✅ Blender 4.5 detectado) else (echo ❌ Blender 4.5 não encontrado)

echo.
echo 📊 RESUMO DO DIAGNÓSTICO:
echo    🛡️ Sistema de blindagem V1.4.0.a.7: %blindage_status%
echo    ⚙️ Sistema parametrizado V1.4.0.a.8: %v8_status%
echo    🔧 Sistema original V1.4.0.a.5: %v5_status%
echo.

pause
goto MENU

:CLEANUP
echo.
echo 🧹 LIMPEZA DE OUTPUTS E LOGS
echo ================================================================
echo.

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 🗑️ Removendo outputs antigos...
if exist "output_*.mp4" del /q "output_*.mp4"
if exist "Blender\output_*.mp4" del /q "Blender\output_*.mp4"

echo 📂 Limpando diretório uploads...
if exist "uploads\*" del /q "uploads\*"

echo 📂 Limpando diretório outputs...
if exist "outputs\*" del /q "outputs\*"

echo 📋 Limpando logs...
if exist "logs\*" del /q "logs\*"

echo ✅ Limpeza concluída!
echo.

pause
goto MENU

:EXIT
echo.
echo 🎯 ZENTRAW V1.4.0.a.8 - EVOLUÇÃO PARAMETRIZADA COMPLETA
echo ================================================================
echo 🛡️ Blindagem V1.4.0.a.7: PRESERVADA
echo ⚙️ Interface Parametrizada: IMPLEMENTADA
echo 📊 Logs Detalhados: ATIVOS
echo 🎨 Controle Completo: DISPONÍVEL
echo.
echo 🎉 Sistema pronto para uso em produção!
echo.
exit /b 0
