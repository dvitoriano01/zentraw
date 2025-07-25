@echo off
echo 🛡️ ZENTRAW V1.4.0.a.7 - BACKUP BLINDAGEM AUTOMÁTICO
echo ================================================
echo 📅 Data: %date% %time%
echo 🎯 Objetivo: Blindar V1.4.0.a.5 antes de evolução para V1.4.0.a.7
echo.

set SOURCE_DIR=C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer
set BACKUP_DIR=%SOURCE_DIR%\BACKUP_V1.4.0.a.5_BLINDAGEM_%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =%
set BACKUP_DIR=%BACKUP_DIR::=%

echo 📁 Origem: %SOURCE_DIR%
echo 💾 Backup: %BACKUP_DIR%
echo.

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo 🔄 Copiando arquivos essenciais V1.4.0.a.5...
copy "%SOURCE_DIR%\server-simple-real.cjs" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\test-simple-real.html" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\Blender\render_audio_visualizer.py" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\Blender\template.blend" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\Blender\sample_audio2.wav" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\Blender\sample_audio3.wav" "%BACKUP_DIR%\" > nul
copy "%SOURCE_DIR%\Blender\sample_cover.jpg" "%BACKUP_DIR%\" > nul

echo ✅ Backup V1.4.0.a.5 criado com sucesso!
echo 📊 Local: %BACKUP_DIR%
echo.
echo 🛡️ SISTEMA BLINDADO - Pronto para evolução V1.4.0.a.7
pause
