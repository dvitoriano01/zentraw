import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Download, TestTube, ArrowLeft, Zap } from 'lucide-react';

interface BlenderRenderResult {
  success: boolean;
  downloadUrl?: string;
  outputPath?: string;
  duration?: number;
  message?: string;
  error?: string;
  platform?: string;
}

export default function BlenderVisualizerPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isTestingBlender, setIsTestingBlender] = useState(false);
  const [renderResult, setRenderResult] = useState<BlenderRenderResult | null>(null);
  const [blenderStatus, setBlenderStatus] = useState<boolean | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
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
        error: 'Failed to test render'
      });
    } finally {
      setIsRendering(false);
    }
  };

  const handleRender = async () => {
    if (!audioFile || !imageFile) {
      setRenderResult({
        success: false,
        error: 'Please select both audio and image files'
      });
      return;
    }

    setIsRendering(true);
    setRenderResult(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('image', imageFile);

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
        error: 'Failed to render audio visualizer'
      });
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownload = () => {
    if (renderResult?.downloadUrl) {
      const link = document.createElement('a');
      link.href = renderResult.downloadUrl;
      link.download = 'zentraw_audio_visualizer.mp4';
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

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header with Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={goBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">🎬 3D Audio Visualizer</h1>
                <p className="text-sm text-white/70">ZentrawMediaControl • Powered by Blender</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Zap className="w-4 h-4" />
              Professional 3D Rendering
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Status Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">ZentrawMediaControl Active</span>
            </div>
            <Button
              onClick={testBlender}
              disabled={isTestingBlender}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTestingBlender ? 'Testing...' : 'Check System'}
            </Button>
          </div>
        </div>

        {/* Blender Status */}
        {blenderStatus !== null && (
          <Alert className={`${
            blenderStatus ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <AlertDescription className={blenderStatus ? 'text-green-200' : 'text-red-200'}>
              {blenderStatus ? 
                '✅ Blender is available and ready for 3D rendering' : 
                '❌ Blender not available - please check installation'
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Test */}
        {blenderStatus && (
          <Card className="bg-black/30 border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-400" />
                Quick Test
              </CardTitle>
              <CardDescription className="text-gray-300">
                Test the system with sample files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testRenderSample} 
                disabled={isRendering}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Test Render
              </Button>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
        <Card className="bg-black/30 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              Upload Your Files
            </CardTitle>
            <CardDescription className="text-gray-300">
              Upload audio and cover image for your custom visualizer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">Audio File</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                  className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
                {audioFile && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {audioFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">Cover Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 file:cursor-pointer"
                />
                {imageFile && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {imageFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Render Button */}
            <div className="pt-4">
              <Button 
                onClick={handleRender}
                disabled={!audioFile || !imageFile || isRendering}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
                size="lg"
              >
                {isRendering ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
                    Rendering 3D Visualizer...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-3" />
                    Generate 3D Audio Visualizer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        {isRendering && (
          <Card className="bg-black/30 border-white/10 text-white">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>🎬 Blender is rendering your 3D visualizer...</span>
                  <span className="text-purple-400">Please wait</span>
                </div>
                <Progress value={undefined} className="w-full h-2" />
                <div className="text-xs text-gray-400 text-center">
                  This process can take several minutes depending on audio length
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {renderResult && (
          <Card className="bg-black/30 border-white/10 text-white">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                renderResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
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
                      {renderResult.platform && (
                        <div className="mt-2 text-xs text-green-400">
                          Platform: {renderResult.platform}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  {renderResult.downloadUrl && (
                    <Button 
                      onClick={handleDownload}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download MP4 Video
                    </Button>
                  )}
                </div>
              ) : (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-200">
                    {renderResult.error}
                    {renderResult.platform && (
                      <div className="mt-2 text-xs text-red-400">
                        Platform: {renderResult.platform}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="bg-black/30 border-white/10 text-white">
          <CardHeader>
            <CardTitle>🎯 How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>• <strong>Audio Analysis:</strong> Extract frequency data from your music</p>
                <p>• <strong>3D Rendering:</strong> Generate synchronized visual elements</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Professional Output:</strong> High-quality MP4 ready for platforms</p>
                <p>• <strong>Powered by Blender:</strong> Industry-standard 3D software</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
