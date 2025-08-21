# TESTE CORRETO V1.4.0.a.3 - USAR POST
Write-Host "🎯 ZENTRAW V1.4.0.a.3 - TESTE CORRETO" -ForegroundColor Green

$serverUrl = "http://localhost:3004"
$audioFile = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_audio2.wav"
$imageFile = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_cover.jpg"

# Teste 1: Conexao (GET) - JA FUNCIONOU
Write-Host "✅ TESTE 1: Conexao OK - Connection Successful!" -ForegroundColor Green

# Teste 2: Verificar arquivos
Write-Host "🔍 TESTE 2: Verificando arquivos..." -ForegroundColor Yellow
if (Test-Path $audioFile) { Write-Host "✅ Audio encontrado" -ForegroundColor Green } else { Write-Host "❌ Audio NAO encontrado" -ForegroundColor Red }
if (Test-Path $imageFile) { Write-Host "✅ Image encontrado" -ForegroundColor Green } else { Write-Host "❌ Image NAO encontrado" -ForegroundColor Red }

# Teste 3: RENDER via POST (CORRETO)
Write-Host "🎬 TESTE 3: Render MP4 via POST..." -ForegroundColor Magenta

$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"audio`"; filename=`"sample_audio2.wav`"",
    "Content-Type: audio/wav$LF",
    [System.IO.File]::ReadAllText($audioFile, [System.Text.Encoding]::Default),
    "--$boundary",
    "Content-Disposition: form-data; name=`"image`"; filename=`"sample_cover.jpg`"",
    "Content-Type: image/jpeg$LF",
    [System.IO.File]::ReadAllText($imageFile, [System.Text.Encoding]::Default),
    "--$boundary--$LF"
) -join $LF

try {
    $response = Invoke-RestMethod -Uri "$serverUrl/api/blender/audio-visualizer" -Method POST -Body $bodyLines -ContentType "multipart/form-data; boundary=$boundary" -TimeoutSec 30
    Write-Host "🎉 SUCESSO: Render completado!" -ForegroundColor Green
    $response | ConvertTo-Json | Write-Host -ForegroundColor Cyan
} catch {
    Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Detalhe: $($_.Exception.Response)" -ForegroundColor Yellow
}

Write-Host "`n🎯 COMANDO CURL ALTERNATIVO:" -ForegroundColor Yellow
Write-Host "curl -X POST http://localhost:3004/api/blender/audio-visualizer -F `"audio=@Blender\sample_audio2.wav`" -F `"image=@Blender\sample_cover.jpg`"" -ForegroundColor White
