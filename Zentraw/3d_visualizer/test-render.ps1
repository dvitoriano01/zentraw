# Zentraw 3D Visualizer V1.4.0.a.4 - Test MP4 Render
# Data: 24/07/2025
# Propósito: Testar renderização MP4 via PowerShell

Write-Host "🚀 Zentraw 3D Visualizer V1.4.0.a.4 - Testing MP4 Render" -ForegroundColor Green

# Caminhos dos arquivos de teste
$audioFile = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_audio2.wav"
$imageFile = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_cover.jpg"
$serverUrl = "http://localhost:3004"

Write-Host "📁 Audio file: $audioFile" -ForegroundColor Cyan
Write-Host "🖼️ Image file: $imageFile" -ForegroundColor Cyan

# Verificar se arquivos existem
if (-not (Test-Path $audioFile)) {
    Write-Host "❌ Audio file not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $imageFile)) {
    Write-Host "❌ Image file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Files found, testing server connection..." -ForegroundColor Green

# Testar conexão
try {
    $testResponse = Invoke-RestMethod -Uri "$serverUrl/api/test" -Method Get -TimeoutSec 5
    Write-Host "✅ Server connection successful!" -ForegroundColor Green
    Write-Host "📋 Dependencies check:" -ForegroundColor Yellow
    $testResponse.dependencies | Format-Table
} catch {
    Write-Host "❌ Server connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎬 Starting Blender render..." -ForegroundColor Green

# Criar requisição multipart
$boundary = [System.Guid]::NewGuid().ToString()
$bodyLines = @()
$bodyLines += "--$boundary"
$bodyLines += 'Content-Disposition: form-data; name="audio"; filename="sample_audio2.wav"'
$bodyLines += 'Content-Type: audio/wav'
$bodyLines += ''
$bodyLines += [System.IO.File]::ReadAllBytes($audioFile)
$bodyLines += "--$boundary"
$bodyLines += 'Content-Disposition: form-data; name="image"; filename="sample_cover.jpg"'
$bodyLines += 'Content-Type: image/jpeg'
$bodyLines += ''
$bodyLines += [System.IO.File]::ReadAllBytes($imageFile)
$bodyLines += "--$boundary--"

Write-Host "📤 Sending files to Blender..." -ForegroundColor Yellow

# Fazer requisição (implementação simplificada - vamos usar curl se disponível)
if (Get-Command curl -ErrorAction SilentlyContinue) {
    Write-Host "🔧 Using curl for multipart upload..." -ForegroundColor Cyan
    & curl -X POST "$serverUrl/api/blender/audio-visualizer" -F "audio=@$audioFile" -F "image=@$imageFile" -v
} else {
    Write-Host "❌ curl not available, please install curl or test via interface" -ForegroundColor Red
}

Write-Host "🎉 Test completed!" -ForegroundColor Green
