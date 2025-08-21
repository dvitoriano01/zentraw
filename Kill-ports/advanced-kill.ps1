# Zentraw - PowerShell Advanced Port Killer
# Para casos extremos onde batch scripts não funcionam

Write-Host ""
Write-Host "🔥 =======================================" -ForegroundColor Red
Write-Host "   ZENTRAW - ADVANCED PORT KILLER" -ForegroundColor Yellow
Write-Host "🔥 =======================================" -ForegroundColor Red
Write-Host ""

# Função para matar processo por porta
function Kill-ProcessByPort {
    param([int]$Port)
    
    Write-Host "🔍 Procurando processos na porta $Port..." -ForegroundColor Cyan
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($connection in $connections) {
            $processId = $connection.OwningProcess
            try {
                $process = Get-Process -Id $processId -ErrorAction Stop
                Write-Host "🎯 Encontrado: $($process.Name) (PID: $processId)" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force
                Write-Host "✅ Processo $processId eliminado!" -ForegroundColor Green
            }
            catch {
                Write-Host "❌ Falha ao eliminar processo $processId" -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "⚪ Porta $Port já está livre" -ForegroundColor Gray
    }
}

# Função para verificar se porta está livre
function Test-PortFree {
    param([int]$Port)
    
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -eq $null
}

# Portas do Zentraw
$zentrawPorts = @(3003, 3004, 3005, 3006)

Write-Host "📋 Eliminando processos nas portas Zentraw..." -ForegroundColor Cyan

foreach ($port in $zentrawPorts) {
    Kill-ProcessByPort -Port $port
}

Write-Host ""
Write-Host "🔥 Eliminando TODOS os processos Node.js..." -ForegroundColor Red

# Mata todos os processos Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "nodemon" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host ""
Write-Host "⏳ Aguardando limpeza..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "📊 Status final das portas:" -ForegroundColor Cyan

foreach ($port in $zentrawPorts) {
    if (Test-PortFree -Port $port) {
        Write-Host "✅ Porta $port: LIVRE" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Porta $port: OCUPADA" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 =======================================" -ForegroundColor Green
Write-Host "   LIMPEZA POWERSHELL CONCLUÍDA" -ForegroundColor Yellow
Write-Host "🎯 =======================================" -ForegroundColor Green
Write-Host ""

Read-Host "Pressione Enter para continuar"
