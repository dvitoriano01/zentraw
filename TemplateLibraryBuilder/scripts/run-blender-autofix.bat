@echo off
echo ========================================
echo  ZENTRAW BLENDER AUTO-FIX v1.0
echo  Diagnostico e Correcao Automatica
echo ========================================
echo.

cd /d "%~dp0.."

echo [INFO] Executando diagnostico automatico...
node scripts/blender-auto-fix.js

echo.
echo [INFO] Diagnostico concluido!
echo [INFO] Verificar relatorio: blender-diagnostic-report.json
echo.

pause
