@echo off
echo 🔧 ZENTRAW PORT 5500 KILLER - PROTOCOL COMPLIANCE
echo ================================================

echo 🔍 Procurando processos na porta 5500...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5500" ^| find "LISTENING"') do (
    echo 🚨 Processo encontrado: PID %%a
    echo 🔥 Terminando processo %%a...
    taskkill /PID %%a /F > nul 2>&1
    if errorlevel 1 (
        echo ❌ Erro ao terminar processo %%a
    ) else (
        echo ✅ Processo %%a terminado com sucesso
    )
)

echo 🔍 Verificando novamente a porta 5500...
netstat -an | find ":5500" | find "LISTENING" > nul
if errorlevel 1 (
    echo ✅ Porta 5500 está livre!
    echo 🚀 Pronto para iniciar Zentraw V2.0
) else (
    echo ⚠️  Ainda há processos na porta 5500
    echo 📋 Lista completa de processos:
    netstat -aon | find ":5500"
)

echo ================================================
echo 💡 Execute agora: npm run dev
pause
