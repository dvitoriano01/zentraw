# ZENTRAW - Scripts de Desenvolvimento V1.4.0.a.2

## 🔧 Scripts de Reinicialização

### restart-backend.bat
```batch
@echo off
echo 🔄 Reiniciando Backend Zentraw V1.4.0.a.2...
cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 🛑 Parando processos Node.js...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM tsx.exe 2>NUL

echo 🔍 Verificando porta 5000...
netstat -ano | findstr ":5000"

echo 🚀 Iniciando backend...
npm run dev:back
pause
```

### restart-frontend.bat
```batch
@echo off
echo 🎨 Reiniciando Frontend Zentraw V1.4.0.a.2...
cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 🛑 Parando processos Vite...
taskkill /F /IM node.exe 2>NUL

echo 🚀 Iniciando frontend...
npm run dev:front
pause
```

### restart-full-system.bat
```batch
@echo off
echo 🔄 Reiniciando Sistema Completo Zentraw V1.4.0.a.2...
cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo 🛑 Parando todos os processos...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM tsx.exe 2>NUL

echo ⏳ Aguardando 3 segundos...
timeout /t 3 /nobreak > NUL

echo 🚀 Iniciando backend...
start "Backend" cmd /c "npm run dev:back"

echo ⏳ Aguardando backend inicializar...
timeout /t 5 /nobreak > NUL

echo 🎨 Iniciando frontend...
start "Frontend" cmd /c "npm run dev:front"

echo ✅ Sistema iniciado!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
```

## 🧪 Scripts de Teste

### test-system.bat
```batch
@echo off
echo 🧪 Testando Sistema Zentraw V1.4.0.a.2...

echo 🔍 Verificando backend...
curl -s http://localhost:5000/api/blender/test > NUL
if %errorlevel% == 0 (
    echo ✅ Backend respondendo
) else (
    echo ❌ Backend não responde
)

echo 🔍 Testando sistema robusto...
curl -s http://localhost:5000/api/blender/test-robust > NUL
if %errorlevel% == 0 (
    echo ✅ Sistema robusto carregado
) else (
    echo ❌ Sistema robusto não carregado
)

echo 🔍 Verificando portas...
netstat -ano | findstr ":5000"
netstat -ano | findstr ":5173"

pause
```

### test-blender.bat
```batch
@echo off
echo 🎨 Testando Blender...

set BLENDER_PATH="C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"

echo 🔍 Verificando Blender...
if exist %BLENDER_PATH% (
    echo ✅ Blender encontrado
    %BLENDER_PATH% --version
) else (
    echo ❌ Blender não encontrado em %BLENDER_PATH%
)

pause
```

## 🔧 Scripts PowerShell

### restart-system.ps1
```powershell
# Zentraw V1.4.0.a.2 - Sistema de Reinicialização
Write-Host "🔄 Reiniciando Sistema Zentraw V1.4.0.a.2..." -ForegroundColor Cyan

$projectPath = "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"
Set-Location $projectPath

Write-Host "🛑 Parando processos existentes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node" -or $_.ProcessName -eq "tsx"} | Stop-Process -Force

Write-Host "🔍 Verificando portas..." -ForegroundColor Blue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "⚠️ Porta 5000 ainda ocupada" -ForegroundColor Red
} else {
    Write-Host "✅ Porta 5000 livre" -ForegroundColor Green
}

Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c", "npm run dev:back" -WorkingDirectory $projectPath

Start-Sleep 5

Write-Host "🎨 Iniciando frontend..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/c", "npm run dev:front" -WorkingDirectory $projectPath

Write-Host "✅ Sistema iniciado!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
```

### test-endpoints.ps1
```powershell
# Teste de Endpoints Zentraw V1.4.0.a.2
Write-Host "🧪 Testando Endpoints..." -ForegroundColor Cyan

$endpoints = @(
    "http://localhost:5000/api/blender/test",
    "http://localhost:5000/api/blender/test-robust"
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-RestMethod -Uri $endpoint -Method Get -TimeoutSec 5
        Write-Host "✅ $endpoint - OK" -ForegroundColor Green
        Write-Host $response | ConvertTo-Json
    } catch {
        Write-Host "❌ $endpoint - FALHA" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
    Write-Host ""
}
```

## 📝 Scripts de Diagnóstico

### diagnose-system.bat
```batch
@echo off
echo 🔬 Diagnóstico Completo Zentraw V1.4.0.a.2...

echo ===== INFORMAÇÕES DO SISTEMA =====
echo Data/Hora: %date% %time%
echo Usuário: %username%
echo Diretório: %cd%

echo ===== VERIFICAÇÃO NODE.JS =====
node --version
npm --version

echo ===== VERIFICAÇÃO TYPESCRIPT =====
npx tsx --version

echo ===== VERIFICAÇÃO BLENDER =====
if exist "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe" (
    echo ✅ Blender 4.5 encontrado
) else (
    echo ❌ Blender 4.5 não encontrado
)

echo ===== PORTAS EM USO =====
netstat -ano | findstr ":5000"
netstat -ano | findstr ":5173"

echo ===== PROCESSOS NODE =====
tasklist | findstr node.exe
tasklist | findstr tsx.exe

echo ===== VERIFICAÇÃO ARQUIVOS =====
if exist "server\services\blender-service-robust.ts" (
    echo ✅ BlenderServiceRobust encontrado
) else (
    echo ❌ BlenderServiceRobust não encontrado
)

if exist "package.json" (
    echo ✅ Package.json encontrado
) else (
    echo ❌ Package.json não encontrado
)

pause
```

## 🔄 Scripts de Deploy

### deploy-dev.bat
```batch
@echo off
echo 🚀 Deploy Desenvolvimento Zentraw V1.4.0.a.2...

echo 📦 Instalando dependências...
npm install

echo 🧹 Limpando cache...
npm run clean 2>NUL || echo "No clean script"

echo 🔨 Compilando TypeScript...
npx tsc --noEmit

echo 🧪 Executando testes...
npm test 2>NUL || echo "No tests configured"

echo ✅ Deploy concluído!
pause
```

## 📊 Scripts de Monitoramento

### monitor-logs.bat
```batch
@echo off
echo 📊 Monitor de Logs Zentraw V1.4.0.a.2...

echo ===== LOGS DO SISTEMA =====
echo [%time%] Sistema iniciado

:loop
echo [%time%] Verificando status...

curl -s http://localhost:5000/api/blender/test > temp_status.json 2>NUL
if %errorlevel% == 0 (
    echo [%time%] ✅ Backend OK
) else (
    echo [%time%] ❌ Backend DOWN
)

timeout /t 30 /nobreak > NUL
goto loop
```

## 📋 Arquivo de Configuração

### zentraw-config.json
```json
{
  "version": "1.4.0.a.2",
  "project": "Zentraw Blender Visualizer",
  "paths": {
    "project": "c:\\Users\\Denys Victoriano\\Documents\\GitHub\\clone\\zentraw\\TemplateLibraryBuilder",
    "blender": "C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe",
    "uploads": "uploads\\blender",
    "templates": "Blender\\template.blend"
  },
  "ports": {
    "backend": 5000,
    "frontend": 5173,
    "fallback_frontend": [5174, 5175]
  },
  "endpoints": {
    "test": "/api/blender/test",
    "test_robust": "/api/blender/test-robust",
    "preview": "/api/blender/preview",
    "render": "/api/blender/render"
  },
  "blender": {
    "engines": ["BLENDER_EEVEE", "CYCLES", "BLENDER_WORKBENCH"],
    "fallback_methods": [
      "EEVEE_ORIGINAL",
      "CYCLES", 
      "WORKBENCH",
      "FACTORY_RESET",
      "MINIMAL_SCENE"
    ]
  }
}
```

---

**Criado em:** 18/01/2025  
**Versão:** V1.4.0.a.2  
**Uso:** Scripts auxiliares para desenvolvimento e manutenção do sistema Zentraw
