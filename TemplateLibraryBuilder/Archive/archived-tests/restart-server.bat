@echo off
echo Parando servidor Node.js...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Matando processo %%a
    taskkill /PID %%a /F
)
echo Aguardando 2 segundos...
timeout /t 2 /nobreak > nul
echo Iniciando servidor...
npm run dev
