@echo off
echo 🔬 ZENTRAW V1.4.0.a.2 - DIAGNÓSTICO DE ERROS
echo ==========================================
echo.

:: Verifica se o Blender está instalado
echo 🔍 Verificando instalação do Blender...
if exist "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" (
    echo ✅ Blender 4.5 encontrado
) else (
    echo ❌ Blender 4.5 não encontrado
)

:: Verifica arquivos de template
echo 🔍 Verificando arquivos de template...
if exist "Blender\template.blend" (
    echo ✅ Template Blender encontrado
) else (
    echo ❌ Template Blender não encontrado
)

:: Verifica arquivos de teste
echo 🔍 Verificando arquivos de teste...
if exist "Blender\sample_audio2.mp3" (
    echo ✅ Arquivo de audio de teste encontrado
) else (
    echo ❌ Arquivo de audio de teste não encontrado
)

if exist "Blender\cover_spotify.png" (
    echo ✅ Arquivo de imagem de teste encontrado
) else (
    echo ❌ Arquivo de imagem de teste não encontrado
)

:: Verifica dependências Node.js
echo 🔍 Verificando dependências...
npm list tsx >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ TSX instalado
) else (
    echo ❌ TSX não instalado
)

:: Verifica estrutura de diretórios
echo 🔍 Verificando estrutura de diretórios...
if exist "server\routes\blender.ts" (
    echo ✅ Arquivo blender.ts encontrado
) else (
    echo ❌ Arquivo blender.ts não encontrado
)

if exist "server\services\blender-service.ts" (
    echo ✅ Arquivo blender-service.ts encontrado
) else (
    echo ❌ Arquivo blender-service.ts não encontrado
)

:: Testa conexão com servidor
echo 🔍 Testando conexão com servidor...
curl -s --connect-timeout 5 http://localhost:5000/api/blender/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Servidor respondendo
) else (
    echo ❌ Servidor não respondendo
)

echo.
echo 🎯 Diagnóstico completo!
pause
