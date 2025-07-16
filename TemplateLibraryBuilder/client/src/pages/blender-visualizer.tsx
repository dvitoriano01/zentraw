import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Play, Download, TestTube } from 'lucide-react';

interface BlenderRenderResult {
  success: boolean;
  downloadUrl?: string;
  outputPath?: string;
  duration?: number;
  message?: string;
  error?: string;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎬 Zentraw Blender Integration</h1>
          <p className="text-xl opacity-90">Generate 3D Audio Visualizers automatically</p>
        </div>

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
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  blenderStatus ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
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
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, 'audio')}
                  className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                {audioFile && (
                  <span className="text-green-400 text-sm">✓ {audioFile.name}</span>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Cover Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="flex-1 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                {imageFile && (
                  <span className="text-green-400 text-sm">✓ {imageFile.name}</span>
                )}
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
                    </AlertDescription>
                  </Alert>
                  
                  {renderResult.downloadUrl && (
                    <Button 
                      onClick={handleDownload}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download MP4
                    </Button>
                  )}
                </div>
              ) : (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-200">
                    {renderResult.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-black/20 border-white/10 text-white">
          <CardHeader>
            <CardTitle>ℹ️ How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-gray-300 text-sm">
            <p>• Upload an audio file (WAV, MP3, etc.) and a cover image</p>
            <p>• Our system analyzes the audio frequency data</p>
            <p>• Blender renders a 3D visualizer synchronized to the music</p>
            <p>• Get a professional MP4 video ready for YouTube/social media</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
