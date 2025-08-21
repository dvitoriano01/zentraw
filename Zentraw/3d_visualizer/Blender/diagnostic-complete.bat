@echo off
echo ========================================
echo ZENTRAW V1.4.0.a.3 - DIAGNOSTIC TEST
echo ========================================

echo.
echo 1. Verificando Blender...
"C:\Blender\blender.exe" --version
if errorlevel 1 (
    echo ❌ ERRO: Blender não encontrado em C:\Blender\blender.exe
    exit /b 1
) else (
    echo ✅ Blender encontrado e funcionando
)

echo.
echo 2. Verificando arquivos essenciais...
if exist "template.blend" (
    echo ✅ template.blend encontrado
    for %%f in (template.blend) do echo    Tamanho: %%~zf bytes
) else (
    echo ❌ template.blend NÃO ENCONTRADO
)

if exist "render_audio_visualizer.py" (
    echo ✅ render_audio_visualizer.py encontrado
    for %%f in (render_audio_visualizer.py) do echo    Tamanho: %%~zf bytes
) else (
    echo ❌ render_audio_visualizer.py NÃO ENCONTRADO
)

if exist "sample_audio2.wav" (
    echo ✅ sample_audio2.wav encontrado
    for %%f in (sample_audio2.wav) do echo    Tamanho: %%~zf bytes
) else (
    echo ❌ sample_audio2.wav NÃO ENCONTRADO
)

if exist "sample_cover.jpg" (
    echo ✅ sample_cover.jpg encontrado
    for %%f in (sample_cover.jpg) do echo    Tamanho: %%~zf bytes
) else (
    echo ❌ sample_cover.jpg NÃO ENCONTRADO
)

echo.
echo 3. Testando execução básica do Blender...
"C:\Blender\blender.exe" --background --python-exit-code 1 --python test_python_deps.py
if errorlevel 1 (
    echo ❌ ERRO: Falha na execução Python do Blender
) else (
    echo ✅ Blender Python OK
)

echo.
echo 4. Testando template.blend...
if exist "template.blend" (
    "C:\Blender\blender.exe" --background template.blend --python-exit-code 1 --python-expr "import bpy; print('Objects:', list(bpy.data.objects.keys())); print('Materials:', len(bpy.data.materials))"
    if errorlevel 1 (
        echo ❌ ERRO: template.blend corrompido ou inválido
    ) else (
        echo ✅ template.blend carregado com sucesso
    )
)

echo.
echo ========================================
echo DIAGNOSTIC COMPLETE
echo ========================================
pause
