@echo off
echo ============================================
echo 🎵 ZENTRAW V1.4.0.a.5 - INICIALIZAÇÃO COMPLETA
echo ============================================
echo Data: %date% %time%
echo Branch: Feat_V1.4.0.a.5_Render_MP4_com_audio
echo Sistema: Básico .WAV (sem codec AAC)
echo ============================================

cd /d "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo.
echo 🚀 PASSO 1: INICIANDO BACKEND V1.4.0.a.5
echo ============================================
echo Comando: node server-simple-real.cjs
echo Porta: 3004
echo Status: Básico .WAV configurado
echo.

start "Zentraw Backend V1.4.0.a.5" cmd /k "node server-simple-real.cjs"

echo ✅ Backend iniciado em nova janela!

echo.
echo 🌐 PASSO 2: ABRINDO INTERFACE
echo ============================================
echo Arquivo: test-simple-real.html
echo URL Backend: http://localhost:3004
echo.

timeout /t 3 /nobreak >nul

start "" "test-simple-real.html"

echo ✅ Interface aberta!

echo.
echo 📁 PASSO 3: ARQUIVOS DE TESTE DISPONÍVEIS
echo ============================================
echo 📂 Localização: Blender\
echo 🎵 Áudio: sample_audio2.wav
echo 🖼️ Imagem: sample_cover.jpg
echo 🎬 Template: template.blend
echo.

echo 🎯 INSTRUÇÕES DE TESTE:
echo 1. Aguarde backend carregar (porta 3004)
echo 2. Na interface: clique "Test Connection"
echo 3. Upload: sample_audio2.wav + sample_cover.jpg
echo 4. Clique: "Execute Simple Real Blender"
echo 5. Aguarde: MP4 será gerado em uploads\
echo.
echo ============================================
echo 🎵 SISTEMA V1.4.0.a.5 BÁSICO INICIADO!
echo ============================================
pause
