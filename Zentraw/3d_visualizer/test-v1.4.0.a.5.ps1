# PowerShell V1.4.0.a.5 Audio Test
Write-Host "============================================" -ForegroundColor Green
Write-Host "🎵 TESTE V1.4.0.a.5 - MP4 COM ÁUDIO INTEGRADO" -ForegroundColor Green
Write-Host "📁 Diretório: $(Get-Location)" -ForegroundColor Yellow
Write-Host "⏰ Data/Hora: $(Get-Date)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

$audioFile = "Blender\sample_audio2.wav"
$imageFile = "Blender\sample_cover.jpg"
$templateFile = "Blender\template.blend"
$outputFile = "uploads\teste_v1.4.0.a.5_final.mp4"

Write-Host "📋 VERIFICANDO ARQUIVOS..." -ForegroundColor Cyan

if (Test-Path $audioFile) {
    Write-Host "✅ Áudio encontrado: $audioFile" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO: Áudio não encontrado!" -ForegroundColor Red
    exit 1
}

if (Test-Path $imageFile) {
    Write-Host "✅ Imagem encontrada: $imageFile" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO: Imagem não encontrada!" -ForegroundColor Red
    exit 1
}

if (Test-Path $templateFile) {
    Write-Host "✅ Template encontrado: $templateFile" -ForegroundColor Green
} else {
    Write-Host "❌ ERRO: Template não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎬 EXECUTANDO BLENDER V1.4.0.a.5..." -ForegroundColor Cyan
Write-Host "🔧 CORREÇÕES APLICADAS:" -ForegroundColor Yellow
Write-Host "   ✅ Duração: duration_seconds * fps" -ForegroundColor Green
Write-Host "   ✅ Codec AAC ativado" -ForegroundColor Green
Write-Host "   ✅ Sequence editor integrado" -ForegroundColor Green
Write-Host ""

$blenderArgs = @(
    "--background", $templateFile,
    "--python", "Blender\render_audio_visualizer.py",
    "--", $audioFile, $imageFile, $outputFile
)

Write-Host "Comando: C:\Blender\blender.exe $($blenderArgs -join ' ')" -ForegroundColor Gray
Write-Host ""

try {
    $process = Start-Process -FilePath "C:\Blender\blender.exe" -ArgumentList $blenderArgs -Wait -PassThru -RedirectStandardOutput "blender_output.txt" -RedirectStandardError "blender_error.txt"
    
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "🔍 RESULTADO V1.4.0.a.5:" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    
    if (Test-Path $outputFile) {
        $fileInfo = Get-Item $outputFile
        Write-Host "✅ SUCESSO! MP4 COM ÁUDIO gerado!" -ForegroundColor Green
        Write-Host "   📁 Arquivo: $($fileInfo.FullName)" -ForegroundColor Yellow
        Write-Host "   📏 Tamanho: $($fileInfo.Length) bytes" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🎯 VERIFICAÇÕES CRÍTICAS V1.4.0.a.5:" -ForegroundColor Cyan
        Write-Host "   1. ⏱️ Duração deve ser ~8 segundos" -ForegroundColor White
        Write-Host "   2. 🎵 Áudio deve estar audível" -ForegroundColor White
        Write-Host "   3. 🎬 Animação sincronizada" -ForegroundColor White
        Write-Host "   4. 🔊 Codec AAC integrado" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 V1.4.0.a.5 COM ÁUDIO - TESTE CONCLUÍDO!" -ForegroundColor Green
    } else {
        Write-Host "❌ ERRO: MP4 não foi gerado!" -ForegroundColor Red
        Write-Host "Verificando logs..." -ForegroundColor Yellow
        
        if (Test-Path "blender_output.txt") {
            Write-Host "📄 Output:" -ForegroundColor Cyan
            Get-Content "blender_output.txt" | Select-Object -Last 20
        }
        
        if (Test-Path "blender_error.txt") {
            Write-Host "📄 Errors:" -ForegroundColor Red
            Get-Content "blender_error.txt" | Select-Object -Last 10
        }
    }
} catch {
    Write-Host "❌ ERRO na execução: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🏁 TESTE V1.4.0.a.5 FINALIZADO!" -ForegroundColor Green
