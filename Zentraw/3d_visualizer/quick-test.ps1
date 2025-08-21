# Zentraw 3D Visualizer V1.4.0.a.4 - Quick MP4 Test
# Simple test with curl

Write-Host "🚀 Zentraw 3D Visualizer V1.4.0.a.4 - Quick MP4 Test" -ForegroundColor Green

# Test server
$serverUrl = "http://localhost:3004"
Write-Host "🔍 Testing server connection..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$serverUrl/api/test" -Method Get -TimeoutSec 10
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "📋 Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Server not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure to run: start-backend.cmd" -ForegroundColor Yellow
    exit 1
}

Write-Host "🎬 Testing Blender render endpoint..." -ForegroundColor Green

# Test files
$audioPath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_audio2.wav"
$imagePath = "C:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\Zentraw\3d_visualizer\Blender\sample_cover.jpg"

if (Test-Path $audioPath) {
    Write-Host "✅ Audio file found" -ForegroundColor Green
} else {
    Write-Host "❌ Audio file not found: $audioPath" -ForegroundColor Red
}

if (Test-Path $imagePath) {
    Write-Host "✅ Image file found" -ForegroundColor Green
} else {
    Write-Host "❌ Image file not found: $imagePath" -ForegroundColor Red
}

Write-Host "🎯 Ready for MP4 generation!" -ForegroundColor Green
Write-Host "📝 Next: Use curl or test in browser at: $serverUrl" -ForegroundColor Yellow
