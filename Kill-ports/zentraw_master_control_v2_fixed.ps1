# ZENTRAW - MASTER CONTROL POWERSHELL V2.1
# Versão corrigida - Sem erros de sintaxe
# Rodar como Admin

param(
    [switch]$Force,
    [int]$Port,
    [string]$Action
)

$Global:ZentrawPorts = @(3003, 3004, 3005, 3006)
$Global:AdminPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Admin_Panel"

function Write-ZentrawLog {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    switch ($Type) {
        "Success" { Write-Host "[$timestamp] $Message" -ForegroundColor Green }
        "Error" { Write-Host "[$timestamp] $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[$timestamp] $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "[$timestamp] $Message" -ForegroundColor Cyan }
        default { Write-Host "[$timestamp] $Message" -ForegroundColor White }
    }
}

function Test-AdminRights {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Show-ZentrawBanner {
    Clear-Host
    Write-Host "====================================================" -ForegroundColor Magenta
    Write-Host "    ZENTRAW - MASTER CONTROL POWERSHELL V2.1" -ForegroundColor Yellow
    Write-Host "    Versao Corrigida - Team Grok Approved" -ForegroundColor Yellow
    Write-Host "====================================================" -ForegroundColor Magenta
    Write-Host ""

    if (-not (Test-AdminRights)) {
        Write-ZentrawLog "AVISO: Execute como Administrador para melhor funcionamento!" "Warning"
    } else {
        Write-ZentrawLog "Executando como Administrador" "Success"
    }
    Write-Host ""
}

function Get-SystemStatus {
    Write-ZentrawLog "Executando diagnostico completo do sistema..." "Info"
    
    # Verificar portas em uso
    Write-Host "`nPORTAS ZENTRAW EM USO:" -ForegroundColor Magenta
    foreach ($port in $Global:ZentrawPorts) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne 0 -and $_.OwningProcess -ne 4 }
        if ($connections) {
            foreach ($conn in $connections) {
                $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                $procName = if ($proc) { $proc.ProcessName } else { "Unknown" }
                Write-Host "Porta $port - PID: $($conn.OwningProcess) ($procName) - Estado: $($conn.State)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Porta ${port}: Livre" -ForegroundColor Gray
        }
    }
    
    # Processos Node.js
    Write-Host "`nPROCESSOS NODE.JS ATIVOS:" -ForegroundColor Magenta
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | ForEach-Object {
            $memory = [math]::Round($_.WorkingSet64 / 1MB, 2)
            Write-Host "PID: $($_.Id) | Memory: ${memory}MB | Start: $($_.StartTime)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Nenhum processo Node.js encontrado" -ForegroundColor Green
    }
    
    # Teste de conectividade
    Write-Host "`nTESTE DE CONECTIVIDADE:" -ForegroundColor Magenta
    foreach ($port in $Global:ZentrawPorts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
            Write-ZentrawLog "Porta ${port}: ONLINE (Status: $($response.StatusCode))" "Success"
        } catch {
            Write-ZentrawLog "Porta ${port}: OFFLINE" "Error"
        }
    }
}

function Stop-ProcessByPort {
    param([int]$Port, [switch]$Force)
    
    Write-ZentrawLog "Procurando processos na porta $Port..." "Info"
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processedPIDs = @()
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            
            # Ignorar processo Idle (PID 0) e processos do sistema
            if ($processId -eq 0 -or $processId -eq 4) {
                Write-ZentrawLog "Ignorando processo do sistema (PID: $processId)" "Warning"
                continue
            }
            
            # Evitar processar o mesmo PID múltiplas vezes
            if ($processedPIDs -contains $processId) {
                continue
            }
            $processedPIDs += $processId
            
            try {
                $process = Get-Process -Id $processId -ErrorAction Stop
                
                # Verificar se é realmente um processo que pode ser terminado
                if ($process.ProcessName -in @("System", "Idle", "csrss", "winlogon", "smss")) {
                    Write-ZentrawLog "Ignorando processo critico do sistema: $($process.ProcessName)" "Warning"
                    continue
                }
                
                Write-ZentrawLog "Encontrado: $($process.ProcessName) (PID: $processId)" "Warning"
                
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-ZentrawLog "Processo $processId eliminado!" "Success"
            }
            catch {
                Write-ZentrawLog "Falha ao eliminar processo $processId`: $($_.Exception.Message)" "Error"
            }
        }
        
        # Verificar se a porta foi liberada
        Start-Sleep -Seconds 2
        $stillConnected = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -ne 0 -and $_.OwningProcess -ne 4 }
        if ($stillConnected) {
            Write-ZentrawLog "Porta $Port ainda ocupada por processos nao-sistema!" "Warning"
            return $false
        } else {
            Write-ZentrawLog "Porta $Port liberada com sucesso!" "Success"
            return $true
        }
    }
    else {
        Write-ZentrawLog "Porta $Port ja esta livre" "Info"
        return $true
    }
}

function Invoke-KillAllPorts {
    Write-ZentrawLog "Eliminando processos de todas as portas Zentraw..." "Warning"
    
    foreach ($port in $Global:ZentrawPorts) {
        Stop-ProcessByPort -Port $port -Force
    }
    
    Write-ZentrawLog "Limpeza de portas concluida!" "Success"
}

function Invoke-NuclearReset {
    Write-ZentrawLog "Iniciando Nuclear Reset..." "Warning"
    
    # Método 1: Stop-Process padrão
    Write-ZentrawLog "Metodo 1: Eliminacao padrao..." "Info"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "nodemon" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Start-Sleep -Seconds 2
    
    # Método 2: WMI para processos teimosos
    Write-ZentrawLog "Metodo 2: Eliminacao por WMI..." "Info"
    Get-WmiObject -Class Win32_Process -Filter "name='node.exe'" | ForEach-Object {
        Write-ZentrawLog "Eliminando PID $($_.ProcessId) via WMI" "Warning"
        $_.Terminate() | Out-Null
    }
    
    Start-Sleep -Seconds 3
    
    # Verificação final
    $remainingNodes = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($remainingNodes) {
        Write-ZentrawLog "Ainda existem $($remainingNodes.Count) processos Node.js!" "Warning"
    } else {
        Write-ZentrawLog "Todos os processos Node.js foram eliminados!" "Success"
    }
    
    # Limpar cache
    Write-ZentrawLog "Limpando cache NPM..." "Info"
    try {
        npm cache clean --force 2>$null
        Write-ZentrawLog "Cache NPM limpo!" "Success"
    } catch {
        Write-ZentrawLog "Falha ao limpar cache NPM" "Warning"
    }
}

function Invoke-RestartAdminPanel {
    Write-ZentrawLog "Reiniciando Admin Panel..." "Info"
    
    # Kill porta 3003
    $killed = Stop-ProcessByPort -Port 3003 -Force
    
    if ($killed) {
        Write-ZentrawLog "Iniciando Admin Panel..." "Info"
        
        if (Test-Path $Global:AdminPath) {
            Set-Location $Global:AdminPath
            
            # Verificar se package.json existe
            if (Test-Path "package.json") {
                # Instalar dependências se necessário
                if (!(Test-Path "node_modules")) {
                    Write-ZentrawLog "Instalando dependencias..." "Info"
                    npm install | Out-Null
                }
                
                # Iniciar o servidor
                Write-ZentrawLog "Iniciando servidor..." "Info"
                Start-Process cmd -ArgumentList "/k", "npm run dev" -WindowStyle Normal
                
                # Aguardar e testar
                Write-ZentrawLog "Aguardando inicializacao..." "Info"
                Start-Sleep -Seconds 8
                
                try {
                    $response = Invoke-WebRequest -Uri "http://localhost:3003/health" -UseBasicParsing -TimeoutSec 5
                    Write-ZentrawLog "Admin Panel iniciado com sucesso! (Status: $($response.StatusCode))" "Success"
                    Write-ZentrawLog "URL: http://localhost:3003" "Info"
                } catch {
                    Write-ZentrawLog "Admin Panel pode estar inicializando... Teste manualmente: http://localhost:3003" "Warning"
                }
            } else {
                Write-ZentrawLog "package.json nao encontrado em $Global:AdminPath" "Error"
            }
        } else {
            Write-ZentrawLog "Diretorio Admin Panel nao encontrado: $Global:AdminPath" "Error"
        }
    } else {
        Write-ZentrawLog "Falha ao liberar porta 3003. Restart cancelado." "Error"
    }
}

# Verificar parâmetros de linha de comando
if ($Action) {
    Show-ZentrawBanner
    switch ($Action.ToLower()) {
        "status" { 
            Get-SystemStatus
            Write-Host "`nPressione Enter para continuar..." -NoNewline
            Read-Host
            exit 
        }
        "kill" { 
            if ($Port) { 
                Stop-ProcessByPort -Port $Port -Force 
            } else { 
                Invoke-KillAllPorts 
            }
            Write-Host "`nPressione Enter para continuar..." -NoNewline
            Read-Host
            exit 
        }
        "restart" { 
            Invoke-RestartAdminPanel
            Write-Host "`nPressione Enter para continuar..." -NoNewline
            Read-Host
            exit 
        }
        "nuclear" { 
            Invoke-NuclearReset
            Write-Host "`nPressione Enter para continuar..." -NoNewline
            Read-Host
            exit 
        }
        default { 
            Write-ZentrawLog "Acao invalida: $Action" "Error"
            Write-Host "`nPressione Enter para continuar..." -NoNewline
            Read-Host
            exit 
        }
    }
}

# Menu interativo (se sem parâmetros)
function Show-Menu {
    Show-ZentrawBanner
    Write-Host "1. Status Completo do Sistema"
    Write-Host "2. Kill Porta Especifica"
    Write-Host "3. Kill Todas as Portas Zentraw"
    Write-Host "4. Restart Admin Panel"
    Write-Host "5. Nuclear Reset"
    Write-Host "6. Sair"
    Write-Host ""
    
    $choice = Read-Host "Digite sua escolha (1-6)"
    
    switch ($choice) {
        1 { Get-SystemStatus; Read-Host "`nPressione Enter para continuar"; Show-Menu }
        2 { 
            $port = Read-Host "Digite a porta para eliminar"
            if ($port -match '^\d+$') {
                Stop-ProcessByPort -Port ([int]$port) -Force
            } else {
                Write-ZentrawLog "Porta invalida!" "Error"
            }
            Read-Host "`nPressione Enter para continuar"
            Show-Menu
        }
        3 { Invoke-KillAllPorts; Read-Host "`nPressione Enter para continuar"; Show-Menu }
        4 { Invoke-RestartAdminPanel; Read-Host "`nPressione Enter para continuar"; Show-Menu }
        5 { Invoke-NuclearReset; Read-Host "`nPressione Enter para continuar"; Show-Menu }
        6 { exit }
        default { 
            Write-ZentrawLog "Opcao invalida!" "Error"
            Start-Sleep -Seconds 2
            Show-Menu
        }
    }
}

# Iniciar menu se não há ação especificada
Show-Menu
