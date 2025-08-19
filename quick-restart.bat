@echo off
echo.
echo ⚡ ZENTRAW - RESTART RÁPIDO
echo.

echo 🔪 Eliminando porta 3003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3003') do (
    if "%%a" neq "" taskkill /F /PID %%a >nul 2>&1
)

echo 🚀 Iniciando Admin Panel...
cd Admin_Panel
start "Admin Panel" cmd /k "npm run dev"

echo ✅ Admin Panel iniciando...
echo 🌐 URL: http://localhost:3003
