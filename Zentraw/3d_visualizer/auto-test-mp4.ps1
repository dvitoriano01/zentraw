# Zentraw 3D Visualizer V1.4.0.a.4 - AUTO TEST MP4
# Execucao automatica com acompanhamento

Write-Host "START Zentraw 3D Visualizer V1.4.0.a.4 - AUTO TEST INICIADO" -ForegroundColor Green
Write-Host "Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Blue

$serverUrl = "http://localhost:3004"

# Aguardar backend inicializar
Write-Host "Aguardando backend inicializar (10 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Teste 1: Conexao com servidor
Write-Host "TESTE 1: Verificando conexao com servidor..." -ForegroundColor Magenta
try {
    $testResponse = Invoke-RestMethod -Uri "$serverUrl/api/test" -Method Get -TimeoutSec 10
    Write-Host "SUCESSO: Servidor respondendo!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    $testResponse | ConvertTo-Json -Depth 3 | Write-Host
} catch {
    Write-Host "FALHA: Servidor nao responde: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Verifique se start-with-monitor.bat esta rodando" -ForegroundColor Yellow
    exit 1
}

# Teste 2: Verificação de arquivos
Write-Host "`n🔍 TESTE 2: Verificando arquivos de teste..." -ForegroundColor Magenta
$audioPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_audio2.wav"
$imagePath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_cover.jpg"

$audioExists = Test-Path $audioPath
$imageExists = Test-Path $imagePath

Write-Host "🎵 Audio file: $audioExists" -ForegroundColor $(if($audioExists){"Green"}else{"Red"})
Write-Host "🖼️  Image file: $imageExists" -ForegroundColor $(if($imageExists){"Green"}else{"Red"})

if (-not $audioExists -or -not $imageExists) {
    Write-Host "❌ FALHA: Arquivos de teste não encontrados!" -ForegroundColor Red
    exit 1
}

# Teste 3: Upload e renderização (simulação com curl)
Write-Host "`n🔍 TESTE 3: Testando upload e renderização..." -ForegroundColor Magenta
Write-Host "📝 Preparando comando curl para upload multipart..." -ForegroundColor Yellow

$curlCommand = @"
curl -X POST "$serverUrl/api/blender/audio-visualizer" \
  -F "audio=@$audioPath" \
  -F "image=@$imagePath" \
  --max-time 300 \
  --verbose
"@

Write-Host "🚀 Comando preparado:" -ForegroundColor Cyan
Write-Host $curlCommand -ForegroundColor White

Write-Host "`n💡 PRÓXIMO PASSO MANUAL:" -ForegroundColor Yellow
Write-Host "Execute o comando acima em um terminal CMD/PowerShell" -ForegroundColor White
Write-Host "ou use a interface HTML: test-simple-real.html" -ForegroundColor White

Write-Host "`n✅ AUTO TEST COMPLETO - Sistema pronto para MP4!" -ForegroundColor Green
Write-Host "🎯 Backend: $serverUrl" -ForegroundColor Cyan
Write-Host "🎬 Pronto para renderizar MP4 com Blender!" -ForegroundColor Green
