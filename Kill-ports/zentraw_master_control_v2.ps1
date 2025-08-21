# ZENTRAW - MASTER CONTROL POWERSHELL V2.0
# Baseado na sugestão do Team Grok IA
# Rodar como Admin: powershell -ExecutionPolicy Bypass -File zentraw_master_control_v2.ps1

param(
    [switch]$Force,
    [int]$Port,
    [string]$Action
)

$Global:ZentrawPorts = @(3003, 3004, 3005, 3006)
$Global:AdminPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Admin_Panel"

# Cores para output
$Global:Colors = @{
    Success = "Green"
    Error = "Red" 
    Warning = "Yellow"
    Info = "Cyan"
    Header = "Magenta"
}

function Write-ZentrawLog {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = $Global:Colors[$Type]
    Write-Host "[$timestamp] $Message" -ForegroundColor $color
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Show-ZentrawBanner {
    Clear-Host
    Write-Host @"
⚡ ===================================================
    ZENTRAW - MASTER CONTROL POWERSHELL V2.0
    Baseado na sugestão do Team Grok IA
===================================================
"@ -ForegroundColor $Global:Colors.Header

    if (-not (Test-AdminRights)) {
        Write-ZentrawLog "⚠️ AVISO: Execute como Administrador para melhor funcionamento!" "Warning"
    } else {
        Write-ZentrawLog "✅ Executando como Administrador" "Success"
    }
    Write-Host ""
}

function Show-Menu {
    Show-ZentrawBanner
    Write-Host "1. 📊 Status Completo do Sistema"
    Write-Host "2. 🔪 Kill Porta Específica"
    Write-Host "3. 🔥 Kill Todas as Portas Zentraw (3003-3006)"
    Write-Host "4. ⚡ Restart Admin Panel (Kill + Start)"
    Write-Host "5. 💥 Nuclear Reset (Elimina todos Node.js)"
    Write-Host "6. 🧹 Limpeza Avançada (Handles + Cache)"
    Write-Host "7. 🔍 Diagnóstico Avançado"
    Write-Host "8. 🛠️ Configurar Firewall Windows"
    Write-Host "9. 🚪 Sair"
    Write-Host ""
    
    $choice = Read-Host "Digite sua escolha (1-9)"
    
    switch ($choice) {
        1 { Get-SystemStatus }
        2 { Invoke-KillSpecificPort }
        3 { Invoke-KillAllPorts }
        4 { Invoke-RestartAdminPanel }
        5 { Invoke-NuclearReset }
        6 { Invoke-AdvancedCleanup }
        7 { Invoke-AdvancedDiagnostic }
        8 { Set-FirewallRules }
        9 { exit }
        default { 
            Write-ZentrawLog "Opção inválida!" "Error"
            Start-Sleep -Seconds 2
        }
    }
    Show-Menu
}

function Get-SystemStatus {
    Write-ZentrawLog "🔍 Executando diagnóstico completo do sistema..." "Info"
    
    # Verificar portas em uso
    Write-Host "`n📊 PORTAS ZENTRAW EM USO:" -ForegroundColor $Global:Colors.Header
    foreach ($port in $Global:ZentrawPorts) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                Write-Host "🎯 Porta $port - PID: $($conn.OwningProcess) ($procName) - Estado: $($conn.State)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "⚪ Porta $port: Livre" -ForegroundColor Gray
        }
    }
    
    # Processos Node.js
    Write-Host "`n📋 PROCESSOS NODE.JS ATIVOS:" -ForegroundColor $Global:Colors.Header
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            $memory = [math]::Round($_.WorkingSet64 / 1MB, 2)
            Write-Host "🔸 PID: $($_.Id) | CPU: $($_.CPU) | Memory: ${memory}MB | Start: $($_.StartTime)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✅ Nenhum processo Node.js encontrado" -ForegroundColor Green
    }
    
    # Teste de conectividade
    Write-Host "`n🌐 TESTE DE CONECTIVIDADE:" -ForegroundColor $Global:Colors.Header
    foreach ($port in $Global:ZentrawPorts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            Write-ZentrawLog "✅ Porta $port: ONLINE (Status: $($response.StatusCode))" "Success"
        } catch {
            Write-ZentrawLog "❌ Porta $port: OFFLINE" "Error"
        }
    }
    
    Read-Host "`nPressione Enter para continuar"
}

function Stop-ProcessByPort {
    param([int]$Port, [switch]$Force)
    
    Write-ZentrawLog "🔍 Procurando processos na porta $Port..." "Info"
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            try {
                $process = Get-Process -Id $processId -ErrorAction Stop
                Write-ZentrawLog "🎯 Encontrado: $($process.ProcessName) (PID: $processId)" "Warning"
                
                if ($Force) {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-ZentrawLog "✅ Processo $processId eliminado com força!" "Success"
                } else {
                    $process.CloseMainWindow()
                    Start-Sleep -Seconds 2
                    if (!$process.HasExited) {
                        Stop-Process -Id $processId -Force
                    }
                    Write-ZentrawLog "✅ Processo $processId encerrado!" "Success"
                }
            }
            catch {
                Write-ZentrawLog "❌ Falha ao eliminar processo $processId: $($_.Exception.Message)" "Error"
            }
        }
        
        # Verificar se a porta foi liberada
        Start-Sleep -Seconds 1
        $stillConnected = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($stillConnected) {
            Write-ZentrawLog "⚠️ Porta $Port ainda ocupada após kill!" "Warning"
            return $false
        } else {
            Write-ZentrawLog "✅ Porta $Port liberada com sucesso!" "Success"
            return $true
        }
    }
    else {
        Write-ZentrawLog "⚪ Porta $Port já está livre" "Info"
        return $true
    }
}

function Invoke-KillSpecificPort {
    $port = Read-Host "Digite a porta para eliminar (ex.: 3003)"
    if ($port -match '^\d+$') {
        Stop-ProcessByPort -Port ([int]$port) -Force
    } else {
        Write-ZentrawLog "Porta inválida!" "Error"
    }
    Read-Host "`nPressione Enter para continuar"
}

function Invoke-KillAllPorts {
    Write-ZentrawLog "🔥 Eliminando processos de todas as portas Zentraw..." "Warning"
    
    foreach ($port in $Global:ZentrawPorts) {
        Stop-ProcessByPort -Port $port -Force
    }
    
    Write-ZentrawLog "✅ Limpeza de portas concluída!" "Success"
    Read-Host "`nPressione Enter para continuar"
}

function Invoke-NuclearReset {
    Write-Host "`n⚠️ NUCLEAR RESET - Isso vai eliminar TODOS os processos Node.js!" -ForegroundColor Red
    $confirm = Read-Host "Tem certeza? (S/N)"
    
    if ($confirm -match '^[Ss]$') {
        Write-ZentrawLog "💀 Iniciando Nuclear Reset..." "Warning"
        
        # Método 1: Stop-Process padrão
        Write-ZentrawLog "🔸 Método 1: Eliminação padrão..." "Info"
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "nodemon" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
        
        Start-Sleep -Seconds 2
        
        # Método 2: WMI para processos teimosos
        Write-ZentrawLog "🔸 Método 2: Eliminação por WMI..." "Info"
        Get-WmiObject -Class Win32_Process -Filter "name='node.exe'" | ForEach-Object {
            Write-ZentrawLog "🎯 Eliminando PID $($_.ProcessId) via WMI" "Warning"
            $_.Terminate() | Out-Null
        }
        
        Start-Sleep -Seconds 3
        
        # Verificação final
        $remainingNodes = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($remainingNodes) {
            Write-ZentrawLog "⚠️ Ainda existem $($remainingNodes.Count) processos Node.js!" "Warning"
        } else {
            Write-ZentrawLog "✅ Todos os processos Node.js foram eliminados!" "Success"
        }
        
        # Limpar cache
        Write-ZentrawLog "🧹 Limpando cache NPM..." "Info"
        try {
            npm cache clean --force 2>$null
            Write-ZentrawLog "✅ Cache NPM limpo!" "Success"
        } catch {
            Write-ZentrawLog "⚠️ Falha ao limpar cache NPM" "Warning"
        }
    }
    
    Read-Host "`nPressione Enter para continuar"
}

function Invoke-RestartAdminPanel {
    Write-ZentrawLog "⚡ Reiniciando Admin Panel..." "Info"
    
    # Kill porta 3003
    $killed = Stop-ProcessByPort -Port 3003 -Force
    
    if ($killed) {
        Write-ZentrawLog "🚀 Iniciando Admin Panel..." "Info"
        
        if (Test-Path $Global:AdminPath) {
            Set-Location $Global:AdminPath
            
            # Verificar se package.json existe
            if (Test-Path "package.json") {
                # Instalar dependências se necessário
                if (!(Test-Path "node_modules")) {
                    Write-ZentrawLog "📦 Instalando dependências..." "Info"
                    npm install
                }
                
                # Iniciar o servidor
                Write-ZentrawLog "🚀 Iniciando servidor..." "Info"
                Start-Process cmd -ArgumentList "/k", "npm run dev" -WindowStyle Normal
                
                # Aguardar e testar
                Write-ZentrawLog "⏳ Aguardando inicialização..." "Info"
                Start-Sleep -Seconds 8
                
                try {
                    $response = Invoke-WebRequest -Uri "http://localhost:3003/health" -UseBasicParsing -TimeoutSec 5
                    Write-ZentrawLog "✅ Admin Panel iniciado com sucesso! (Status: $($response.StatusCode))" "Success"
                    Write-ZentrawLog "🌐 URL: http://localhost:3003" "Info"
                } catch {
                    Write-ZentrawLog "⚠️ Admin Panel pode estar inicializando... Teste manualmente: http://localhost:3003" "Warning"
                }
            } else {
                Write-ZentrawLog "❌ package.json não encontrado em $Global:AdminPath" "Error"
            }
        } else {
            Write-ZentrawLog "❌ Diretório Admin Panel não encontrado: $Global:AdminPath" "Error"
        }
    } else {
        Write-ZentrawLog "❌ Falha ao liberar porta 3003. Restart cancelado." "Error"
    }
    
    Read-Host "`nPressione Enter para continuar"
}

function Invoke-AdvancedCleanup {
    Write-ZentrawLog "🧹 Iniciando limpeza avançada..." "Info"
    
    # Limpar handles órfãos
    Write-ZentrawLog "🔸 Limpando handles de arquivo..." "Info"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            $_.Kill()
        } catch {}
    }
    
    # Limpar cache temporal
    Write-ZentrawLog "🔸 Limpando arquivos temporários..." "Info"
    $tempPaths = @(
        "$env:TEMP\npm-*",
        "$env:LOCALAPPDATA\npm-cache",
        "$env:APPDATA\npm-cache"
    )
    
    foreach ($path in $tempPaths) {
        if (Test-Path $path) {
            Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Resetar Winsock (para problemas de rede)
    Write-ZentrawLog "🔸 Resetando stack de rede..." "Info"
    try {
        netsh winsock reset | Out-Null
        netsh int ip reset | Out-Null
        Write-ZentrawLog "✅ Stack de rede resetado" "Success"
    } catch {
        Write-ZentrawLog "⚠️ Falha ao resetar rede (requer Admin)" "Warning"
    }
    
    Write-ZentrawLog "✅ Limpeza avançada concluída!" "Success"
    Read-Host "`nPressione Enter para continuar"
}

function Invoke-AdvancedDiagnostic {
    Write-ZentrawLog "🔍 Executando diagnóstico avançado..." "Info"
    
    # Verificar serviços Windows relacionados
    Write-Host "`n🔸 SERVIÇOS WINDOWS:" -ForegroundColor $Global:Colors.Header
    $services = @("Dnscache", "Dhcp", "Netman", "Nla")
    foreach ($service in $services) {
        $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
        if ($svc) {
            Write-Host "   $service: $($svc.Status)" -ForegroundColor $(if ($svc.Status -eq 'Running') { 'Green' } else { 'Yellow' })
        }
    }
    
    # Verificar uso de CPU e memória
    Write-Host "`n🔸 RECURSOS DO SISTEMA:" -ForegroundColor $Global:Colors.Header
    $cpu = Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average
    $memory = Get-WmiObject Win32_OperatingSystem
    $memoryUsed = [math]::Round((($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / $memory.TotalVisibleMemorySize) * 100, 2)
    
    Write-Host "   CPU: $($cpu.Average)%" -ForegroundColor Cyan
    Write-Host "   Memória: $memoryUsed%" -ForegroundColor Cyan
    
    # Verificar conexões de rede
    Write-Host "`n🔸 CONEXÕES DE REDE SUSPEITAS:" -ForegroundColor $Global:Colors.Header
    $connections = Get-NetTCPConnection | Where-Object { $_.State -eq 'CloseWait' -or $_.State -eq 'TimeWait' }
    if ($connections) {
        $connections | ForEach-Object {
            Write-Host "   $($_.LocalAddress):$($_.LocalPort) -> $($_.RemoteAddress):$($_.RemotePort) [$($_.State)]" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   Nenhuma conexão suspeita encontrada" -ForegroundColor Green
    }
    
    Read-Host "`nPressione Enter para continuar"
}

function Set-FirewallRules {
    if (-not (Test-AdminRights)) {
        Write-ZentrawLog "❌ Configuração de firewall requer privilégios de Administrador!" "Error"
        Read-Host "`nPressione Enter para continuar"
        return
    }
    
    Write-ZentrawLog "🛠️ Configurando regras de firewall para Zentraw..." "Info"
    
    try {
        # Remover regras antigas se existirem
        netsh advfirewall firewall delete rule name="Zentraw Ports" | Out-Null
        
        # Adicionar nova regra
        netsh advfirewall firewall add rule name="Zentraw Ports" dir=in action=allow protocol=TCP localport=3003-3006 | Out-Null
        netsh advfirewall firewall add rule name="Zentraw Ports OUT" dir=out action=allow protocol=TCP localport=3003-3006 | Out-Null
        
        Write-ZentrawLog "✅ Regras de firewall configuradas para portas 3003-3006" "Success"
    } catch {
        Write-ZentrawLog "❌ Falha ao configurar firewall: $($_.Exception.Message)" "Error"
    }
    
    Read-Host "`nPressione Enter para continuar"
}

# Verificar parâmetros de linha de comando
if ($Action) {
    switch ($Action.ToLower()) {
        "status" { Get-SystemStatus; exit }
        "kill" { 
            if ($Port) { Stop-ProcessByPort -Port $Port -Force }
            else { Invoke-KillAllPorts }
            exit 
        }
        "restart" { Invoke-RestartAdminPanel; exit }
        "nuclear" { Invoke-NuclearReset; exit }
        default { Write-ZentrawLog "Acao invalida: $Action" "Error"; exit }
    }
}

# Iniciar menu interativo
Show-Menu
