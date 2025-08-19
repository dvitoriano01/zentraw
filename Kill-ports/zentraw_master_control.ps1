# ZENTRAW - MASTER CONTROL POWERSHELL
# Rodar como Admin

$ports = 3003, 3004, 3005, 3006  # Portas do Zentraw

function Show-Menu {
    Write-Host "`n⚡ ========================================`n    ZENTRAW - MASTER CONTROL POWERSHELL`n========================================`n"
    Write-Host "1. 📊 Status do Sistema"
    Write-Host "2. 🔪 Kill Porta Específica"
    Write-Host "3. 🔥 Kill Todas as Portas (3003-3006)"
    Write-Host "4. ⚡ Restart Admin Panel (Porta 3003)"
    Write-Host "5. 💥 Nuclear Reset (Mata todos Node.js)"
    Write-Host "6. 🚪 Sair"
    $choice = Read-Host "`nDigite sua escolha (1-6)"
    switch ($choice) {
        1 { Check-Status }
        2 { Kill-SpecificPort }
        3 { Kill-AllPorts }
        4 { Restart-AdminPanel }
        5 { Nuclear-Reset }
        6 { exit }
        default { Write-Host "Opção inválida." }
    }
    Show-Menu
}

function Check-Status {
    Write-Host "`n🔍 PORTAS EM USO:"
    Get-NetTCPConnection -LocalPort $ports -ErrorAction SilentlyContinue | Select LocalPort, OwningProcess | Format-Table

    Write-Host "`n📋 PROCESSOS NODE.JS:"
    Get-Process -Name node -ErrorAction SilentlyContinue | Select Id, ProcessName, CPU, WorkingSet64 | Format-Table

    Write-Host "`n🌐 TESTANDO CONECTIVIDADE:"
    foreach ($port in $ports) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$port/health" -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Porta $port: ONLINE"
            } else {
                Write-Host "❌ Porta $port: OFFLINE (Status: $($response.StatusCode))"
            }
        } catch {
            Write-Host "❌ Porta $port: OFFLINE"
        }
    }
}

function Kill-Port($port) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            Write-Host "🎯 Processo na porta $port: PID $($conn.OwningProcess)"
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "✅ PID $($conn.OwningProcess) eliminado!"
        }
    } else {
        Write-Host "⚪ Porta $port já livre."
    }
}

function Kill-SpecificPort {
    $port = Read-Host "Digite a porta para matar (ex.: 3003)"
    Kill-Port $port
}

function Kill-AllPorts {
    foreach ($p in $ports) {
        Kill-Port $p
    }
}

function Nuclear-Reset {
    Write-Host "`n💀 ELIMINANDO TODOS OS PROCESSOS NODE.JS..."
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name nodemon -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Todos processos Node eliminados!"

    Start-Sleep -Seconds 3

    Write-Host "`n🧹 LIMPANDO CACHE NPM..."
    npm cache clean --force
}

function Restart-AdminPanel {
    Kill-Port 3003
    Write-Host "`n🚀 REINICIANDO ADMIN PANEL..."
    $adminPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Admin_Panel"
    Set-Location $adminPath
    npm install
    Start-Process cmd -ArgumentList "/k npm run dev"
    Write-Host "✅ Admin Panel iniciado!"
}

# Iniciar menu
Show-Menu