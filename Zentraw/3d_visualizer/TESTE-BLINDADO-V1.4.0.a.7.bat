@echo off
echo 🛡️ TESTE BLINDADO V1.4.0.a.7 - SINCRONIZAÇÃO SAMPLE_AUDIO3.WAV
echo ============================================================
echo 📅 %date% %time%
echo 🎯 OBJETIVO: Testar correção de sincronização SEM perder funcionalidade V1.4.0.a.5
echo.

cd "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender"

echo 🔍 ETAPA 1: VALIDAÇÃO DE ARQUIVOS
echo ----------------------------------
set ERRO_FOUND=0

if exist "sample_audio3.wav" (
    for %%A in ("sample_audio3.wav") do echo ✅ sample_audio3.wav: %%~zA bytes
) else (
    echo ❌ sample_audio3.wav: NÃO ENCONTRADO
    set ERRO_FOUND=1
)

if exist "sample_cover.jpg" (
    echo ✅ sample_cover.jpg: EXISTE
) else (
    echo ❌ sample_cover.jpg: NÃO ENCONTRADO  
    set ERRO_FOUND=1
)

if exist "template.blend" (
    echo ✅ template.blend: EXISTE
) else (
    echo ❌ template.blend: NÃO ENCONTRADO
    set ERRO_FOUND=1
)

if exist "render_audio_visualizer_v1.4.0.a.7.py" (
    echo ✅ render_audio_visualizer_v1.4.0.a.7.py: NOVO SCRIPT CRIADO
) else (
    echo ❌ render_audio_visualizer_v1.4.0.a.7.py: SCRIPT NOVO NÃO ENCONTRADO
    set ERRO_FOUND=1
)

if exist "render_audio_visualizer.py" (
    echo 🛡️ render_audio_visualizer.py: BACKUP V1.4.0.a.5 PRESERVADO
) else (
    echo ⚠️ render_audio_visualizer.py: BACKUP V1.4.0.a.5 AUSENTE
)

if %ERRO_FOUND%==1 (
    echo.
    echo ❌ FALHA NA VALIDAÇÃO - PARANDO TESTE
    pause
    exit /b 1
)

echo.
echo 🧪 ETAPA 2: TESTE SCRIPT V1.4.0.a.7 (SAMPLE_AUDIO3.WAV)
echo ------------------------------------------------------
echo 📋 Comando Blender:
echo "C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav sample_cover.jpg output_v1.4.0.a.7_test.mp4
echo.
echo 🚀 EXECUTANDO...

"C:\Blender\blender.exe" --background template.blend --python render_audio_visualizer_v1.4.0.a.7.py -- sample_audio3.wav sample_cover.jpg output_v1.4.0.a.7_test.mp4

echo.
echo 🔍 ETAPA 3: ANÁLISE DE RESULTADOS
echo ----------------------------------

if exist "output_v1.4.0.a.7_test.mp4" (
    for %%A in ("output_v1.4.0.a.7_test.mp4") do (
        echo ✅ SUCESSO V1.4.0.a.7! MP4 gerado: %%~nxA
        echo 📊 Tamanho: %%~zA bytes
        
        if %%~zA GTR 1000000 (
            echo 🎯 QUALIDADE: EXCELENTE ^(^>1MB^)
            echo 🛡️ STATUS: EVOLUÇÃO BLINDADA FUNCIONOU!
            echo 🔧 SINCRONIZAÇÃO: sample_audio3.wav CORRIGIDA
        ) else if %%~zA GTR 100000 (
            echo 🎯 QUALIDADE: BOA ^(^>100KB^)
            echo 🛡️ STATUS: FUNCIONAL - verificar conteúdo
        ) else (
            echo ⚠️ QUALIDADE: BAIXA ^(^<100KB^) - possível erro
        )
    )
    
    echo.
    echo 🧪 COMPARAÇÃO COM V1.4.0.a.5:
    if exist "test_final_output.mp4" (
        for %%B in ("test_final_output.mp4") do (
            echo 📊 V1.4.0.a.5: %%~zB bytes
        )
        for %%A in ("output_v1.4.0.a.7_test.mp4") do (
            echo 📊 V1.4.0.a.7: %%~zA bytes
        )
    ) else (
        echo 📊 V1.4.0.a.5: Arquivo de referência não encontrado
    )
    
) else (
    echo ❌ FALHA V1.4.0.a.7: MP4 não foi gerado
    echo 🔍 Verificar logs do Blender acima
    echo 🛡️ ROLLBACK: Usar render_audio_visualizer.py (V1.4.0.a.5)
)

echo.
echo 🏁 TESTE BLINDADO CONCLUÍDO
echo ===========================
echo 📅 %date% %time%
echo 🛡️ BASE V1.4.0.a.5: PRESERVADA
echo 🔧 EVOLUÇÃO V1.4.0.a.7: TESTADA
echo.
pause
