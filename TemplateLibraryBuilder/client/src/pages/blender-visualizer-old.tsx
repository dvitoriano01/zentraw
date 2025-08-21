import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Download, TestTube, Settings, Sliders } from 'lucide-react';

interface BlenderRenderResult {
  success: boolean;
  downloadUrl?: string;
  outputPath?: string;
  duration?: number;
  message?: string;
  error?: string;
}

interface RenderSettings {
  resolution: '720p' | '1080p' | '4K';
  quality: 'fast' | 'balanced' | 'high';
  animationStyle: 'cube' | 'sphere' | 'bars';
  sensitivity: number;
  smoothing: number;
  cameraDistance: number;
  cameraHeight: number;
  cameraAngle: number;
  renderEngine: 'eevee' | 'cycles';
}

export default function BlenderVisualizerPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isTestingBlender, setIsTestingBlender] = useState(false);
  const [renderResult, setRenderResult] = useState<BlenderRenderResult | null>(null);
  const [blenderStatus, setBlenderStatus] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // Estados do modal de preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [useSimulatedPreview, setUseSimulatedPreview] = useState(true); // Usar preview simulado por padrão
  const [cameraPosition, setCameraPosition] = useState({ x: 50, y: 50 }); // Posição da câmera no preview
  const [isDraggingCamera, setIsDraggingCamera] = useState(false);

  // Auto-update preview quando configurações da câmera mudarem
  const [autoUpdatePreview, setAutoUpdatePreview] = useState(false);

  // Effect para regenerar preview automaticamente
  
  // Configurações de render
  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    resolution: '1080p',
    quality: 'balanced',
    animationStyle: 'cube',
    sensitivity: 50,
    smoothing: 30,
    cameraDistance: 50, // 0-100: distância da câmera do objeto (50 = posição original)
    cameraHeight: 50,   // 0-100: altura da câmera (50 = posição original)
    cameraAngle: 50,    // 0-100: ângulo de rotação da câmera (50 = posição original)
    renderEngine: 'eevee', // Eevee como padrão para preview (mais rápido)
  });

  // Effect para regenerar preview automaticamente quando configurações da câmera mudarem
  React.useEffect(() => {
    if (autoUpdatePreview && previewImage && audioFile && imageFile && !isGeneratingPreview) {
      const timer = setTimeout(() => {
        generatePreview();
      }, 1000); // Aguardar 1 segundo após mudança para regenerar
      
      return () => clearTimeout(timer);
    }
  }, [renderSettings.cameraDistance, renderSettings.cameraHeight, renderSettings.cameraAngle, autoUpdatePreview]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'audio' | 'image',
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'audio') {
        setAudioFile(file);
      } else {
        setImageFile(file);
      }
    }
  };

  const testBlender = async () => {
    setIsTestingBlender(true);
    try {
      const response = await fetch('/api/blender/test');
      const result = await response.json();
      setBlenderStatus(result.blenderAvailable);
    } catch (error) {
      console.error('Error testing Blender:', error);
      setBlenderStatus(false);
    } finally {
      setIsTestingBlender(false);
    }
  };

  const testRenderSample = async () => {
    setIsRendering(true);
    setRenderResult(null);

    try {
      const response = await fetch('/api/blender/test-render', {
        method: 'POST',
      });

      const result = await response.json();
      setRenderResult(result);
    } catch (error) {
      console.error('Error testing render:', error);
      setRenderResult({
        success: false,
        error: 'Failed to test render',
      });
    } finally {
      setIsRendering(false);
    }
  };

  const generatePreview = async () => {
    if (!audioFile) {
      alert('Please select an audio file first');
      return;
    }

    if (!imageFile) {
      alert('Please select an image file first');
      return;
    }

    setIsGeneratingPreview(true);
    setPreviewImage(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('image', imageFile);
      formData.append('renderEngine', renderSettings.renderEngine);
      formData.append('cameraDistance', renderSettings.cameraDistance.toString());
      formData.append('cameraHeight', renderSettings.cameraHeight.toString());
      formData.append('cameraAngle', renderSettings.cameraAngle.toString());
      formData.append('animationStyle', renderSettings.animationStyle);
      formData.append('sensitivity', renderSettings.sensitivity.toString());
      formData.append('smoothing', renderSettings.smoothing.toString());
      formData.append('previewOnly', 'true'); // Flag para preview estático

      const response = await fetch('/api/blender/preview', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.previewUrl) {
        setPreviewImage(result.previewUrl);
      } else {
        console.error('Preview generation failed:', result.error);
        alert('Failed to generate preview: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Preview generation error:', error);
      alert('Error generating preview');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleRender = async () => {
    if (!audioFile || !imageFile) {
      setRenderResult({
        success: false,
        error: 'Please select both audio and image files',
      });
      return;
    }

    setIsRendering(true);
    setRenderResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('image', imageFile);
      
      // Adicionar configurações de render
      formData.append('settings', JSON.stringify(renderSettings));

      const response = await fetch('/api/blender/render', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setRenderResult(result);
    } catch (error) {
      console.error('Error rendering:', error);
      setRenderResult({
        success: false,
        error: 'Failed to render audio visualizer',
      });
    } finally {
      setIsRendering(false);
    }
  };

  const updateSetting = (key: keyof RenderSettings, value: any) => {
    setRenderSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDownload = () => {
    if (renderResult?.downloadUrl) {
      const link = document.createElement('a');
      link.href = renderResult.downloadUrl;
      link.download = 'audio_visualizer.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="h-screen overflow-y-auto p-4">
        <div className="max-w-6xl mx-auto space-y-6 pb-8">{/* Container with padding bottom */}
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎬 Zentraw Blender Integration</h1>
          <p className="text-xl opacity-90">Generate 3D Audio Visualizers automatically</p>
          <div className="mt-4 flex justify-center">
            <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
              <span className="text-green-300 font-medium">✅ V1.4.0.a.1 - Production Ready</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Upload e Configurações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blender Status Card */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Blender Status
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Check if Blender is properly installed and configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={testBlender}
                    disabled={isTestingBlender}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {isTestingBlender ? 'Testing...' : 'Test Blender'}
                  </Button>

                  {blenderStatus !== null && (
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        blenderStatus ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {blenderStatus ? '✅ Blender Available' : '❌ Blender Not Available'}
                    </div>
                  )}
                </div>

                {blenderStatus && (
                  <div className="space-y-2">
                    <Button
                      onClick={testRenderSample}
                      disabled={isRendering}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Test Render (Sample Files)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* File Upload Card */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Files
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select audio and image files for your visualizer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Audio Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Audio File</label>
                  <p className="text-xs text-gray-400 mb-2">Supported: WAV (44.1kHz recommended), MP3, FLAC</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="audio/wav,audio/mp3,audio/flac,audio/*"
                      onChange={(e) => handleFileChange(e, 'audio')}
                      className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    {audioFile && <span className="text-green-400 text-sm">✓ {audioFile.name}</span>}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Cover Image</label>
                  <p className="text-xs text-gray-400 mb-2">Supported: JPG, PNG, BMP (1920x1080 recommended)</p>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/bmp,image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    {imageFile && <span className="text-green-400 text-sm">✓ {imageFile.name}</span>}
                  </div>
                </div>

                {/* Render Button */}
                <Button
                  onClick={handleRender}
                  disabled={!audioFile || !imageFile || isRendering}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {isRendering ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Rendering...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate 3D Visualizer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Progress */}
            {isRendering && (
              <Card className="bg-black/20 border-white/10 text-white">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rendering in progress...</span>
                      <span>This may take a few minutes</span>
                    </div>
                    <Progress value={undefined} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {renderResult && (
              <Card className="bg-black/20 border-white/10 text-white">
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 ${
                      renderResult.success ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {renderResult.success ? '✅ Render Successful' : '❌ Render Failed'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {renderResult.success ? (
                    <div className="space-y-4">
                      <Alert className="bg-green-500/10 border-green-500/20">
                        <AlertDescription className="text-green-200">
                          {renderResult.message}
                          {renderResult.duration && (
                            <span className="ml-2 text-green-300">
                              (Completed in {formatDuration(renderResult.duration)})
                            </span>
                          )}
                        </AlertDescription>
                      </Alert>

                      {renderResult.downloadUrl && (
                        <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download MP4
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Alert className="bg-red-500/10 border-red-500/20">
                      <AlertDescription className="text-red-200">{renderResult.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Lateral - Configurações */}
          <div className="space-y-6">
            {/* Settings Panel */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Render Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize your visualization parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resolution */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Resolution</label>
                  <select
                    value={renderSettings.resolution}
                    onChange={(e) => updateSetting('resolution', e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                  >
                    <option value="720p">720p (1280x720)</option>
                    <option value="1080p">1080p (1920x1080) ✓</option>
                    <option value="4K">4K (3840x2160)</option>
                  </select>
                </div>

                {/* Quality */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Quality</label>
                  <select
                    value={renderSettings.quality}
                    onChange={(e) => updateSetting('quality', e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                  >
                    <option value="fast">Fast (32 samples)</option>
                    <option value="balanced">Balanced (64 samples) ✓</option>
                    <option value="high">High (128 samples)</option>
                  </select>
                </div>

                {/* Animation Style */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Animation Style</label>
                  <select
                    value={renderSettings.animationStyle}
                    onChange={(e) => updateSetting('animationStyle', e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded px-3 py-2 text-white"
                  >
                    <option value="cube">3D Cube ✓</option>
                    <option value="sphere">3D Sphere</option>
                    <option value="bars">Audio Bars</option>
                  </select>
                </div>

                {/* Sensitivity */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Audio Sensitivity: {renderSettings.sensitivity}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={renderSettings.sensitivity}
                    onChange={(e) => updateSetting('sensitivity', parseInt(e.target.value))}
                    className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Subtle</span>
                    <span>Reactive</span>
                  </div>
                </div>

                {/* Smoothing */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Animation Smoothing: {renderSettings.smoothing}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={renderSettings.smoothing}
                    onChange={(e) => updateSetting('smoothing', parseInt(e.target.value))}
                    className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Sharp</span>
                    <span>Smooth</span>
                  </div>
                </div>

                {/* Camera Controls Section */}
                <div className="border-t border-white/10 pt-4 space-y-4">
                  <h4 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    📷 Camera Position Controls
                  </h4>
                  
                  {/* Camera Distance */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Camera Distance: {renderSettings.cameraDistance}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={renderSettings.cameraDistance}
                      onChange={(e) => updateSetting('cameraDistance', parseInt(e.target.value))}
                      className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Close</span>
                      <span>Default</span>
                      <span>Far</span>
                    </div>
                  </div>

                  {/* Camera Height */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Camera Height: {renderSettings.cameraHeight}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={renderSettings.cameraHeight}
                      onChange={(e) => updateSetting('cameraHeight', parseInt(e.target.value))}
                      className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Low</span>
                      <span>Default</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* Camera Angle */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Camera Angle: {renderSettings.cameraAngle}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={renderSettings.cameraAngle}
                      onChange={(e) => updateSetting('cameraAngle', parseInt(e.target.value))}
                      className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Left</span>
                      <span>Default</span>
                      <span>Right</span>
                    </div>
                  </div>

                  {/* Render Engine Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Render Engine
                    </label>
                    <select
                      value={renderSettings.renderEngine}
                      onChange={(e) => updateSetting('renderEngine', e.target.value as 'eevee' | 'cycles')}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="eevee">Eevee (Fast - Recommended for Preview)</option>
                      <option value="cycles">Cycles GPU (High Quality - Slower)</option>
                    </select>
                    <div className="text-xs text-gray-400">
                      {renderSettings.renderEngine === 'eevee' 
                        ? '⚡ Real-time engine - Perfect for quick previews' 
                        : '🎯 Path-tracing engine - Best quality for final renders'
                      }
                    </div>
                  </div>

                  {/* Auto-Update Preview */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoUpdatePreview}
                        onChange={(e) => setAutoUpdatePreview(e.target.checked)}
                        className="rounded border-white/20 bg-black/30 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                      />
                      🔄 Auto-Update Preview
                    </label>
                    <div className="text-xs text-gray-400">
                      {autoUpdatePreview 
                        ? '✅ Preview will automatically regenerate when camera settings change' 
                        : '⏸️ Manual preview generation only'
                      }
                    </div>
                  </div>

                  {/* Template Preview Button */}
                  <Button
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white relative"
                    disabled={!audioFile || !imageFile}
                  >
                    <span className="mr-2">🎬</span>
                    Preview Template.blend
                    {autoUpdatePreview && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Auto-update ativo" />
                    )}
                  </Button>
                </div>

                {/* Reset Button */}
                <Button
                  onClick={() => setRenderSettings({
                    resolution: '1080p',
                    quality: 'balanced',
                    animationStyle: 'cube',
                    sensitivity: 50,
                    smoothing: 30,
                    cameraDistance: 50,
                    cameraHeight: 50,
                    cameraAngle: 50,
                    renderEngine: 'eevee',
                  })}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  size="sm"
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="bg-black/20 border-white/10 text-white">
              <CardHeader>
                <CardTitle>📊 Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Engine:</span>
                  <span className="text-green-400">Blender 4.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Render:</span>
                  <span className="text-blue-400">Cycles GPU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Quality:</span>
                  <span className="text-purple-400">{renderSettings.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Resolution:</span>
                  <span className="text-yellow-400">{renderSettings.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Success:</span>
                  <span className="text-green-400">97.21s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Specifications */}
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader>
            <CardTitle>🚀 System Specifications - V1.4.0.a.1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-white font-medium">🎬 Render Engine</h4>
                <p>• Blender 4.5.0 with Vulkan Support</p>
                <p>• Cycles Engine (GPU Accelerated)</p>
                <p>• 64 Samples for High Quality</p>
                <p>• Real-time Audio Analysis</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-medium">📐 Output Quality</h4>
                <p>• 1920x1080 Full HD Resolution</p>
                <p>• H.264 Video + AAC Audio</p>
                <p>• 30 FPS Smooth Animation</p>
                <p>• Perfect Audio-Video Sync</p>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-white font-medium mb-2">ℹ️ How it works</h4>
              <div className="space-y-1">
                <p>• Upload an audio file (WAV format) and a cover image</p>
                <p>• Our system analyzes audio using RMS amplitude calculation</p>
                <p>• Blender renders 3D objects that react to music frequencies</p>
                <p>• Professional MP4 output ready for YouTube/social media</p>
                <p>• Estimated render time: ~0.95 seconds per frame</p>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
              <p className="text-blue-300 font-medium">🎯 Latest Success: 97.21 seconds of audio rendered in 2916 frames</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Features Overview Card - Moved to bottom */}
        <Card className="bg-black/20 border-white/10 text-white mt-8">
          <CardHeader>
            <CardTitle>✨ Available Features</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="text-green-400 font-medium">✅ Current (V1.4.0.a.1)</div>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• WAV Audio Processing</li>
                <li>• 3D Cube Animation</li>
                <li>• Real-time Audio Sync</li>
                <li>• MP4 H.264 Export</li>
                <li>• 1920x1080 Quality</li>
                <li>• 📷 Camera Position Control</li>
                <li>• Quality/Sensitivity Settings</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-yellow-400 font-medium">🔄 Coming Soon (V1.4.0.a.2)</div>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• MP3/FLAC Support</li>
                <li>• Custom Templates</li>
                <li>• Animation Presets</li>
                <li>• Quality Profiles</li>
                <li>• Batch Processing</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-blue-400 font-medium">🚀 Future (V1.4.0.a.3+)</div>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• Real-time Preview</li>
                <li>• Particle Systems</li>
                <li>• Camera Animation</li>
                <li>• Custom Shaders</li>
                <li>• Cloud Rendering</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Modal de Preview da Câmera */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header do Modal */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">🎬 Template Preview</h2>
                  <p className="text-gray-300">Preview the complete visualizer with your audio, image, and camera settings</p>
                </div>
                <Button
                  onClick={() => setShowPreviewModal(false)}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/20"
                >
                  ✕ Close
                </Button>
              </div>

              {/* Auto-Update Status */}
              {autoUpdatePreview && (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-200 text-sm">
                    🔄 Auto-update ativo - O preview será regenerado automaticamente quando você alterar as configurações da câmera
                  </span>
                </div>
              )}

              {/* Settings Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-gray-400">Distance</div>
                  <div className="text-white font-medium">{renderSettings.cameraDistance}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-gray-400">Height</div>
                  <div className="text-white font-medium">{renderSettings.cameraHeight}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-gray-400">Angle</div>
                  <div className="text-white font-medium">{renderSettings.cameraAngle}%</div>
                </div>
                <div className="bg-black/20 p-3 rounded-lg">
                  <div className="text-gray-400">Engine</div>
                  <div className="text-white font-medium capitalize">{renderSettings.renderEngine}</div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="bg-black/40 rounded-lg border border-white/10 mb-6">
                {previewImage && previewImage !== 'simulated' ? (
                  <div className="p-4">
                    <img 
                      src={previewImage} 
                      alt="Template Preview" 
                      className="w-full rounded-lg shadow-lg"
                    />
                    <div className="mt-3 text-center text-green-300 text-sm">
                      ✅ Template preview generated - Adjust camera settings and regenerate to see changes
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-xl font-medium text-white mb-2">Generate Template Preview</h3>
                    <p className="text-gray-400 mb-6">
                      Generate a preview frame from your template.blend with the selected image and camera settings
                    </p>
                    
                    <Button
                      onClick={generatePreview}
                      disabled={isGeneratingPreview || !audioFile || !imageFile}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                    >
                      {isGeneratingPreview ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Rendering Template Preview...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">🎬</span>
                          Generate Template Preview ({renderSettings.renderEngine.toUpperCase()})
                        </>
                      )}
                    </Button>

                    {(!audioFile || !imageFile) && (
                      <div className="mt-4 text-yellow-400 text-sm">
                        ⚠️ Please select both audio and image files first
                      </div>
                    )}

                    <div className="mt-4 text-xs text-gray-500">
                      This will render a single frame from template.blend with your image and camera settings applied
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {renderSettings.renderEngine === 'eevee' 
                    ? '⚡ Eevee: ~5-10 seconds for preview'
                    : '🎯 Cycles: ~30-60 seconds for preview (higher quality)'
                  }
                </div>
                <div className="space-x-3">
                  {previewImage && (
                    <Button
                      onClick={generatePreview}
                      disabled={isGeneratingPreview}
                      variant="outline"
                      className="text-white border-white/20"
                    >
                      🔄 Regenerate
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowPreviewModal(false)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Continue to Render
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
