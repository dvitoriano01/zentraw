# ZENTRAW - PORT 3003 DETECTIVE
# Detecta especificamente qual processo está usando a porta 3003

Write-Host "DETECTIVE DE PORTA 3003" -ForegroundColor Yellow
Write-Host "========================" -ForegroundColor Yellow
Write-Host ""

# Método 1: Get-NetTCPConnection
Write-Host "METODO 1: Get-NetTCPConnection" -ForegroundColor Cyan
$connections = Get-NetTCPConnection -LocalPort 3003 -ErrorAction SilentlyContinue
if ($connections) {
    foreach ($conn in $connections) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        Write-Host "  PID: $($conn.OwningProcess)" -ForegroundColor White
        Write-Host "  Processo: $($proc.ProcessName)" -ForegroundColor White
        Write-Host "  Estado: $($conn.State)" -ForegroundColor White
        Write-Host "  Local: $($conn.LocalAddress):$($conn.LocalPort)" -ForegroundColor White
        Write-Host "  Remoto: $($conn.RemoteAddress):$($conn.RemotePort)" -ForegroundColor White
        Write-Host "  ---" -ForegroundColor Gray
    }
} else {
    Write-Host "  Nenhuma conexao encontrada via Get-NetTCPConnection" -ForegroundColor Green
}

Write-Host ""

# Método 2: netstat
Write-Host "METODO 2: netstat" -ForegroundColor Cyan
$netstatOutput = netstat -ano | findstr ":3003"
if ($netstatOutput) {
    Write-Host "  Saida do netstat:" -ForegroundColor White
    $netstatOutput | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} else {
    Write-Host "  Nenhuma conexao encontrada via netstat" -ForegroundColor Green
}

Write-Host ""

# Método 3: Verificar se algo escuta na porta
Write-Host "METODO 3: Test-NetConnection" -ForegroundColor Cyan
try {
    $test = Test-NetConnection -ComputerName localhost -Port 3003 -WarningAction SilentlyContinue
    Write-Host "  Conexao TCP na porta 3003: $($test.TcpTestSucceeded)" -ForegroundColor White
} catch {
    Write-Host "  Erro ao testar conexao: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Método 4: Tentar conectar via HTTP
Write-Host "METODO 4: Teste HTTP" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003" -UseBasicParsing -TimeoutSec 3
    Write-Host "  HTTP Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "  Servidor esta respondendo!" -ForegroundColor Green
} catch {
    Write-Host "  HTTP Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "ANALISE COMPLETA" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para sair"
