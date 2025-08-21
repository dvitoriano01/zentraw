@echo off
chcp 65001 >nul
echo 🔧 ZENTRAW V1.4.0.a.7 - TESTE EVOLUTION COM COMPARAÇÃO
echo ====================================================
echo 📅 %date% %time%
echo 🛡️ BASELINE V1.4.0.a.5 CONFIRMADO: ✅ FUNCIONANDO PERFEITAMENTE
echo.

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer"

echo 📊 DADOS DO TESTE BASELINE V1.4.0.a.5:
echo =======================================
echo ✅ Audio: sample_audio3.wav (0.87MB)
echo ✅ Image: cover_spotify.png (6.44MB)  
echo ✅ Render Time: 107.90 segundos
echo ✅ Output: 1,047,737 bytes (1.02MB)
echo ✅ Status: SUCCESS TOTAL
echo.

echo 🔧 INICIANDO TESTE V1.4.0.a.7 EVOLUTION:
echo ========================================
echo 🎯 Objetivo: Validar correção de sincronização
echo 📊 Esperado: Mesmo resultado ou melhor que V1.4.0.a.5
echo 🛡️ Blindagem: Rollback automático se falhar
echo.

echo 🚀 Iniciando servidor V1.4.0.a.7 BLINDADO...
start "Zentraw V1.4.0.a.7 - TESTE EVOLUTION" cmd /k "echo 🔧 SERVIDOR V1.4.0.a.7 EVOLUTION INICIADO && echo 🛡️ Fallback V1.4.0.a.5 disponível && echo 📊 Comparando com baseline: 1.02MB em 107.90s && node server-v1.4.0.a.7-blindado.cjs"

echo ⏱️ Aguardando servidor inicializar...
timeout /t 3 /nobreak >nul

echo 🌐 Abrindo interface V1.4.0.a.7 BLINDADA...
start "" "interface-v1.4.0.a.7-blindada.html"

echo.
echo 📋 INSTRUÇÕES PARA TESTE V1.4.0.a.7:
echo ====================================
echo.
echo 1. 🎵 USE OS MESMOS ARQUIVOS DO TESTE V1.4.0.a.5:
echo    • Audio: sample_audio3.wav (0.87MB)
echo    • Image: cover_spotify.png (6.44MB)
echo.
echo 2. 🐍 ESCOLHA O SCRIPT V1.4.0.a.7:
echo    • No dropdown: "V1.4.0.a.7 (SINCRONIZAÇÃO CORRIGIDA)"
echo.
echo 3. 📊 COMPARE OS RESULTADOS:
echo    • V1.4.0.a.5: 1,047,737 bytes em 107.90s
echo    • V1.4.0.a.7: [AGUARDANDO TESTE]
echo.
echo 4. 🔍 OBSERVE OS LOGS DETALHADOS:
echo    • Interface V1.4.0.a.7 mostra logs em tempo real
echo    • Acompanhe o progresso do render
echo    • Verifique se sincronização melhorou
echo.
echo 5. ✅ CRITÉRIOS DE SUCESSO:
echo    • MP4 gerado com sucesso
echo    • Tamanho similar ou maior que 1.02MB
echo    • Tempo de render aceitável (± 110s)
echo    • Sincronização visual melhorada
echo.
echo 6. 🚨 EM CASO DE FALHA:
echo    • Sistema automaticamente sugere fallback V1.4.0.a.5
echo    • Logs detalhados mostrarão o problema
echo    • Rollback preserva funcionalidade original
echo.
echo ⚠️ IMPORTANTE:
echo • Interface está em http://localhost:3004
echo • Use os mesmos arquivos para comparação válida
echo • Observe melhorias na sincronização áudio-vídeo
echo • Logs detalhados ajudam no diagnóstico
echo.
echo 🎯 EXECUTE O TESTE AGORA!
echo.
pause
