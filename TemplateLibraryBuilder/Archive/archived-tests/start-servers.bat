@echo off
echo 🚀 Iniciando servidores Zentraw...

echo.
echo 📡 Iniciando Backend (Porta 5000)...
start "Zentraw Backend" cmd /k "npm run dev:back"

echo.
echo ⏳ Aguardando backend inicializar...
timeout /t 10 /nobreak

echo.
echo 🌐 Iniciando Frontend (Porta 5173)...
start "Zentraw Frontend" cmd /k "npm run dev:front"

echo.
echo ✅ Servidores iniciados!
echo.
echo 📡 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo ⏳ Aguardando 5 segundos e abrindo navegador...
timeout /t 5 /nobreak

start http://localhost:5173

pause
