@echo off
echo 🚀 Iniciando servidores Zentraw...
echo.

REM Matar processos existentes nas portas
echo 🧹 Limpando portas 5000 e 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if "%%a" neq "" (
        echo Matando processo na porta 5000: %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    if "%%a" neq "" (
        echo Matando processo na porta 5173: %%a
        taskkill /PID %%a /F >nul 2>&1
    )
)

echo.
echo 🔧 Navegando para o diretório do projeto...
cd /d "%~dp0.."

echo.
echo 🚀 Iniciando Backend (porta 5000)...
start "Zentraw Backend" cmd /k "npm run dev:back"

echo.
echo ⏳ Aguardando backend inicializar...
timeout /t 5 /nobreak

echo.
echo 🌐 Iniciando Frontend (porta 5173)...
start "Zentraw Frontend" cmd /k "npm run dev:front"

echo.
echo ⏳ Aguardando frontend inicializar...
timeout /t 3 /nobreak

echo.
echo 🧪 Testando conexão com backend...
curl -X GET http://localhost:5000/api/blender/test
echo.

echo ✅ Servidores iniciados!
echo 🔗 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause >nul
start http://localhost:5173
