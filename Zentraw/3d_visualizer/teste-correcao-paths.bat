@echo off
echo ============================================
echo 🔧 TESTE V1.4.0.a.5 - CORREÇÃO DE PATHS
echo ============================================
echo Data: %date% %time%
echo Problema: Paths com espaços quebram spawn do Blender
echo Solução: Aspas duplas em todos os argumentos
echo ============================================

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🔍 VERIFICAÇÃO DAS CORREÇÕES:
echo ============================================
findstr /N "path.resolve(audioFile)" server-simple-real.cjs
if %errorlevel%==0 (
    echo ✅ Correção de paths encontrada no código
) else (
    echo ❌ Correção de paths NÃO encontrada!
)

echo.
echo 🚀 REINICIANDO BACKEND COM CORREÇÃO:
echo ============================================
echo Matando processos Node.js antigos...
taskkill /F /IM node.exe /T >nul 2>&1

echo Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo Iniciando backend V1.4.0.a.5 corrigido...
start "Zentraw Backend V1.4.0.a.5 CORRIGIDO" cmd /k "node server-simple-real.cjs"

echo.
echo 🎯 TESTE AGORA:
echo 1. Aguarde backend carregar (porta 3004)
echo 2. Abra: test-simple-real.html
echo 3. Test Connection (deve mostrar V1.4.0.a.5 BÁSICO)
echo 4. Upload: sample_audio2.wav + sample_cover.jpg
echo 5. Execute Simple Real Blender
echo 6. Verifique se NÃO aparece erro "Cannot read file C:\Users\Denys"
echo.
echo ============================================
echo 🔧 CORREÇÃO DE PATHS APLICADA!
echo ============================================
pause
