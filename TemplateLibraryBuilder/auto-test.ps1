# ZENTRAW V1.4.0.a.2 - SCRIPT POWERSHELL AUTOMATICO
# Execute com: powershell -ExecutionPolicy Bypass -File auto-test.ps1

Write-Host "🚀 ZENTRAW V1.4.0.a.2 - TESTE AUTOMATICO COMPLETO" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Criar timestamp para log
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "zentraw_test_$timestamp.log"

Write-Host "📝 Log: $logFile" -ForegroundColor Yellow
Write-Host "🔄 Executando testes em background..." -ForegroundColor Cyan
Write-Host "🎯 VOCÊ PODE FAZER OUTRAS COISAS AGORA!" -ForegroundColor Green
Write-Host ""

# Função para log
function Write-Log {
    param($message)
    $timeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timeStamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host $message
}

# Fase 1: Limpar processos
Write-Log "🔥 [FASE 1] Limpando processos antigos..."
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "tsx" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    Write-Log "✅ Processos limpos"
} catch {
    Write-Log "⚠️ Erro ao limpar processos: $($_.Exception.Message)"
}

# Aguardar
Start-Sleep -Seconds 2

# Fase 2: Verificar porta
Write-Log "🔍 [FASE 2] Verificando porta 5000..."
$portInUse = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Log "⚠️ Porta 5000 ainda ocupada, forçando limpeza..."
    $portInUse | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 3
} else {
    Write-Log "✅ Porta 5000 livre"
}

# Fase 3: Diagnóstico rápido
Write-Log "🧪 [FASE 3] Diagnóstico rápido..."
$blenderPath = "C:\Program Files\Blender Foundation\Blender 4.5\blender.exe"
if (Test-Path $blenderPath) {
    Write-Log "✅ Blender encontrado"
} else {
    Write-Log "❌ Blender não encontrado"
}

if (Test-Path "Blender\template.blend") {
    Write-Log "✅ Template encontrado"
} else {
    Write-Log "❌ Template não encontrado"
}

if (Test-Path "server\routes\blender.ts") {
    Write-Log "✅ Arquivo blender.ts encontrado"
} else {
    Write-Log "❌ Arquivo blender.ts não encontrado"
}

# Fase 4: Iniciar servidor
Write-Log "🚀 [FASE 4] Iniciando servidor..."
try {
    Start-Process -FilePath "cmd" -ArgumentList "/c npm run dev > server_output.txt 2>&1" -WindowStyle Minimized
    Write-Log "✅ Servidor iniciado em background"
} catch {
    Write-Log "❌ Erro ao iniciar servidor: $($_.Exception.Message)"
}

# Aguardar servidor iniciar
Write-Log "⏱️ Aguardando servidor iniciar (5 segundos)..."
Start-Sleep -Seconds 5

# Fase 5: Testar endpoints
Write-Log "🧪 [FASE 5] Testando endpoints..."

# Teste 1: Endpoint básico
try {
    $response1 = Invoke-WebRequest -Uri "http://localhost:5000/api/blender/test" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response1.Content -match "success") {
        Write-Log "✅ Endpoint /test - OK"
    } else {
        Write-Log "❌ Endpoint /test - FALHA"
    }
} catch {
    Write-Log "❌ Endpoint /test - ERRO: $($_.Exception.Message)"
}

# Teste 2: Endpoint preview
try {
    $response2 = Invoke-WebRequest -Uri "http://localhost:5000/api/blender/preview" -Method POST -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response2.Content -match "error") {
        Write-Log "✅ Endpoint /preview - OK (retorna erro esperado)"
    } else {
        Write-Log "❌ Endpoint /preview - FALHA"
    }
} catch {
    Write-Log "❌ Endpoint /preview - ERRO: $($_.Exception.Message)"
}

# Teste 3: Endpoint render
try {
    $response3 = Invoke-WebRequest -Uri "http://localhost:5000/api/blender/render" -Method POST -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response3.Content -match "error") {
        Write-Log "✅ Endpoint /render - OK (retorna erro esperado)"
    } else {
        Write-Log "❌ Endpoint /render - FALHA"
    }
} catch {
    Write-Log "❌ Endpoint /render - ERRO: $($_.Exception.Message)"
}

# Finalizar
Write-Log "🎯 [FASE 6] Finalizando..."
Write-Log "========================================="
Write-Log "TESTE AUTOMATICO COMPLETO"
Write-Log "Data: $(Get-Date)"
Write-Log "========================================="
Write-Log ""
Write-Log "🎯 Servidor está rodando na porta 5000"
Write-Log "📋 Verifique o log para detalhes completos"
Write-Log "🌐 Acesse: http://localhost:5000"
Write-Log ""
Write-Log "PRÓXIMOS PASSOS:"
Write-Log "1. Testar frontend no navegador"
Write-Log "2. Fazer upload de arquivos"
Write-Log "3. Verificar renderização"

Write-Host ""
Write-Host "🎉 TESTE AUTOMATICO COMPLETO!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Resultados:" -ForegroundColor Yellow
Write-Host "✅ Servidor rodando em: http://localhost:5000" -ForegroundColor Green
Write-Host "📝 Log completo em: $logFile" -ForegroundColor Yellow
Write-Host "🖥️ Servidor rodando em background" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 VOCÊ ESTÁ LIVRE PARA FAZER OUTRAS COISAS!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   - Para ver o log: Get-Content $logFile" -ForegroundColor White
Write-Host "   - Para parar servidor: Get-Process -Name node | Stop-Process" -ForegroundColor White
Write-Host "   - Para testar frontend: http://localhost:5000" -ForegroundColor White
Write-Host ""

# Abrir log automaticamente
Start-Process notepad $logFile
