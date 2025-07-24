# Zentraw 3D Visualizer V1.4.0.a.4 - Simple Test
# Script simples sem caracteres especiais

Write-Host "Zentraw 3D Visualizer V1.4.0.a.4 - Test Started" -ForegroundColor Green
Write-Host "Date: $(Get-Date)" -ForegroundColor Cyan

$serverUrl = "http://localhost:3004"

Write-Host "Waiting for backend to start (5 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test server connection
Write-Host "Testing server connection..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$serverUrl/api/test" -Method Get -TimeoutSec 10
    Write-Host "SUCCESS: Server is online!" -ForegroundColor Green
    Write-Host "Version: $($response.version)" -ForegroundColor White
} catch {
    Write-Host "ERROR: Server not responding - $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure backend is running on port 3004" -ForegroundColor Yellow
    exit 1
}

# Check test files
Write-Host "Checking test files..." -ForegroundColor Cyan
$audioPath = "Blender\sample_audio2.wav"
$imagePath = "Blender\sample_cover.jpg"

$audioExists = Test-Path $audioPath
$imageExists = Test-Path $imagePath

Write-Host "Audio file exists: $audioExists" -ForegroundColor $(if($audioExists){"Green"}else{"Red"})
Write-Host "Image file exists: $imageExists" -ForegroundColor $(if($imageExists){"Green"}else{"Red"})

if (-not $audioExists -or -not $imageExists) {
    Write-Host "ERROR: Test files not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Files ready! Now testing MP4 render..." -ForegroundColor Green

# Test MP4 render with curl equivalent
Write-Host "Using PowerShell to upload files..." -ForegroundColor Cyan

try {
    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $audioBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $audioPath))
    $imageBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $imagePath))
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"audio`"; filename=`"sample_audio2.wav`"",
        "Content-Type: audio/wav$LF",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($audioBytes),
        "--$boundary",
        "Content-Disposition: form-data; name=`"image`"; filename=`"sample_cover.jpg`"",
        "Content-Type: image/jpeg$LF",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($imageBytes),
        "--$boundary--$LF"
    ) -join $LF
    
    $headers = @{
        'Content-Type' = "multipart/form-data; boundary=$boundary"
    }
    
    Write-Host "Sending request to Blender API..." -ForegroundColor Yellow
    
    $renderResponse = Invoke-RestMethod -Uri "$serverUrl/api/blender/audio-visualizer" -Method Post -Body $bodyLines -Headers $headers -TimeoutSec 300
    
    Write-Host "SUCCESS: Blender render completed!" -ForegroundColor Green
    Write-Host "Response: $($renderResponse | ConvertTo-Json -Depth 2)" -ForegroundColor White
    
} catch {
    Write-Host "ERROR during render: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "HTTP Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "Test completed!" -ForegroundColor Green
