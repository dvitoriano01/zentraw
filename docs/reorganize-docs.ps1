# ZENTRAW - Script de Reorganização de Documentação
# Data: 25/07/2025 - Sistema V1.4.0.a.5 funcionando
# Objetivo: Mover documentos para subpastas organizacionais

$docsPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\docs"

# Arquivos para analysis-reports
$analysisFiles = @(
    "ZENTRAW_ANALISE_CRITICA_COMPLETA_24_07_2025.md",
    "ZENTRAW_ANALISE_CRITICA_DOCUMENTOS_PRINCIPAIS.md", 
    "ZENTRAW_RELATORIO_TESTE_V1.4.0.a.5_24_07_2025.md"
)

# Arquivos para system-logs
$logFiles = @(
    "ZENTRAW_LOG_ARQUIVAMENTO_BLENDER_3D_VISUALIZER.md",
    "ZENTRAW_LOG_LIMPEZA_DOCUMENTACAO_V1.4.0.a.6_24_07_2025.md",
    "ZENTRAW_LOG_LIMPEZA_VALIDACAO_24_07_2025.md"
)

# Arquivos para legacy-rules
$legacyFiles = @(
    "PROJECT_MASTER_RULES.md",
    "PROJECT_RULES.md", 
    "AI-AGENT-RULES.md"
)

# Arquivos para versioning-system
$versioningFiles = @(
    "AUTOMATIC_VERSIONING_SYSTEM.md",
    "VERSIONING_SYSTEM_SUMMARY.md"
)

# Arquivos para sessions
$sessionFiles = @(
    "ZENTRAW_SESSION_SUMMARY_18_01_2025.md"
)

Write-Host "🚀 Iniciando reorganização da documentação..."

# Mover analysis-reports
foreach ($file in $analysisFiles) {
    $source = Join-Path $docsPath $file
    $dest = Join-Path $docsPath "analysis-reports\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "✅ Movido: $file → analysis-reports/"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

# Mover system-logs
foreach ($file in $logFiles) {
    $source = Join-Path $docsPath $file
    $dest = Join-Path $docsPath "system-logs\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "✅ Movido: $file → system-logs/"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

# Mover legacy-rules
foreach ($file in $legacyFiles) {
    $source = Join-Path $docsPath $file
    $dest = Join-Path $docsPath "legacy-rules\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "✅ Movido: $file → legacy-rules/"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

# Mover versioning-system
foreach ($file in $versioningFiles) {
    $source = Join-Path $docsPath $file
    $dest = Join-Path $docsPath "versioning-system\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "✅ Movido: $file → versioning-system/"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

# Mover sessions
foreach ($file in $sessionFiles) {
    $source = Join-Path $docsPath $file
    $dest = Join-Path $docsPath "sessions\$file"
    if (Test-Path $source) {
        Move-Item $source $dest -Force
        Write-Host "✅ Movido: $file → sessions/"
    } else {
        Write-Host "⚠️ Não encontrado: $file"
    }
}

Write-Host ""
Write-Host "🎯 Reorganização concluída!"
Write-Host "📋 Estrutura final em docs/:"
Get-ChildItem $docsPath -Directory | ForEach-Object { Write-Host "   📁 $($_.Name)/" }
