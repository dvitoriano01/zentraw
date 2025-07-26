@echo off
chcp 65001 >nul
cls
echo ================================================================
echo         🔧 ZENTRAW V1.4.0.a.8 - CORREÇÕES APLICADAS
echo ================================================================
echo 🎯 PROBLEMA 1: ✅ Porta corrigida 3005 → 3004
echo 🎯 PROBLEMA 2: ✅ Câmera ajustada 7.3m → 10.0m
echo 🎯 PROBLEMA 3: ✅ Áudio sequencer adicionado ao script
echo ================================================================

:: Verificar se backend está rodando
echo 🔍 Verificando backend na porta 3004...
curl -s http://localhost:3004/api/health >nul
if %errorlevel% neq 0 (
    echo ❌ Backend não está rodando na porta 3004
    echo 🚀 Iniciando backend V1.4.0.a.8 com correções...
    start "Backend V1.4.0.a.8" cmd /c "cd /d \"%~dp0\" && node server-v1.4.0.a.8-parametrizado.cjs"
    echo ⏳ Aguardando backend inicializar...
    timeout /t 5 >nul
    
    :: Verificar novamente
    curl -s http://localhost:3004/api/health >nul
    if %errorlevel% neq 0 (
        echo ❌ Falha ao iniciar backend. Verifique o Node.js
        pause
        exit /b 1
    )
)

echo ✅ Backend ativo na porta 3004
echo.
echo ================================================================
echo           🧪 TESTE DAS CORREÇÕES
echo ================================================================
echo 📋 INSTRUÇÕES:
echo 1. 🌐 Interface abrirá com configurações corrigidas
echo 2. 📁 Use Blender\sample_audio3.wav (áudio teste)
echo 3. 🖼️ Use Blender\test_image.jpg (imagem teste)
echo 4. 📷 Câmera agora está em 10.0m (melhor visualização)
echo 5. 🎵 Sistema de áudio melhorado (sequencer)
echo 6. 🚀 Teste com preset "Rápido" primeiro
echo ================================================================

echo.
echo 🌐 Abrindo interface corrigida...
start http://localhost:3004

echo.
echo 📋 Arquivos de teste disponíveis:
if exist "Blender\sample_audio3.wav" (
    echo    ✅ 🎵 Blender\sample_audio3.wav
) else (
    echo    ❌ 🎵 Blender\sample_audio3.wav - AUSENTE
)

if exist "Blender\test_image.jpg" (
    echo    ✅ 🖼️ Blender\test_image.jpg
) else (
    echo    ❌ 🖼️ Blender\test_image.jpg - AUSENTE
)

echo.
echo ================================================================
echo 🎯 STATUS: Correções aplicadas e sistema pronto
echo 💡 DICA: Use preset "Rápido" para teste inicial
echo 🔍 VERIFICAR: Áudio no resultado final, câmera com zoom adequado
echo ================================================================

pause
