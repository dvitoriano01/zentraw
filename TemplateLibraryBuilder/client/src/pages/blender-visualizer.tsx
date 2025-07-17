import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, Play, Download, TestTube, Settings, Sliders, 
  ChevronDown, ChevronRight, Music, Image, Palette, 
  Layers, Type, FileText, Aperture, Lightbulb, Monitor,
  ArrowLeft, ArrowRight, RotateCcw
} from 'lucide-react';

interface BlenderRenderResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  duration?: number;
}

interface RenderSettings {
  resolution: string;
  quality: string;
  animationStyle: 'cube' | 'sphere' | 'bars';
  sensitivity: number;
  smoothing: number;
  cameraDistance: number;
  cameraHeight: number;
  cameraAngle: number;
  renderEngine: 'eevee' | 'cycles';
}

// Seções da sidebar esquerda
type SidebarSection = 'general' | 'audio' | 'visualizer' | 'backdrop' | 'text' | 'lyrics' | 'elements';

// Estados dos dropdowns da sidebar direita
interface DropdownStates {
  preset: boolean;
  audio: boolean;
  images: boolean;
  text: boolean;
  colors: boolean;
  elements: boolean;
  camera: boolean;
  lighting: boolean;
  render: boolean;
  export: boolean;
}

export default function BlenderVisualizerPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isTestingBlender, setIsTestingBlender] = useState(false);
  const [renderResult, setRenderResult] = useState<BlenderRenderResult | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 50, y: 50 });
  const [isDraggingCamera, setIsDraggingCamera] = useState(false);
  const [autoUpdatePreview, setAutoUpdatePreview] = useState(false);

  // Estados da UI
  const [activeSection, setActiveSection] = useState<SidebarSection>('general');
  const [dropdownStates, setDropdownStates] = useState<DropdownStates>({
    preset: true,
    audio: false,
    images: false,
    text: false,
    colors: false,
    elements: false,
    camera: false,
    lighting: false,
    render: false,
    export: false
  });

  const [renderSettings, setRenderSettings] = useState<RenderSettings>({
    resolution: '1080p',
    quality: 'balanced',
    animationStyle: 'cube',
    sensitivity: 50,
    smoothing: 30,
    cameraDistance: 50,
    cameraHeight: 50,
    cameraAngle: 50,
    renderEngine: 'eevee',
  });

  // Effect para regenerar preview automaticamente
  React.useEffect(() => {
    // Testar conectividade com backend na inicialização
    const testBackendConnection = async () => {
      try {
        console.log('🔍 Testing backend connection...');
        const response = await fetch('/api/blender/test');
        const result = await response.json();
        console.log('✅ Backend connection test result:', result);
      } catch (error) {
        console.error('❌ Backend connection test failed:', error);
      }
    };
    
    testBackendConnection();
  }, []);

  React.useEffect(() => {
    if (autoUpdatePreview && previewImage && audioFile && imageFile && !isGeneratingPreview) {
      const timer = setTimeout(() => {
        generatePreview();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [renderSettings.cameraDistance, renderSettings.cameraHeight, renderSettings.cameraAngle, autoUpdatePreview]);

  // Cleanup blob URLs on unmount
  React.useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const toggleDropdown = (dropdown: keyof DropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const updateSetting = (key: keyof RenderSettings, value: any) => {
    setRenderSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
      console.log('Blender test result:', result);
    } catch (error) {
      console.error('Blender test error:', error);
    } finally {
      setIsTestingBlender(false);
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

    console.log('🎬 Starting preview generation...');
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

      console.log('📤 Sending preview request to /api/blender/preview');
      console.log('📁 Files:', { audio: audioFile.name, image: imageFile.name });
      console.log('⚙️ Settings:', renderSettings);

      const response = await fetch('/api/blender/preview', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);

      const result = await response.json();
      console.log('📄 Response data:', result);

      if (result.success && result.previewUrl) {
        // Download image via fetch to avoid proxy issues
        try {
          console.log('🖼️ Downloading preview image via fetch...', result.previewUrl);
          const imageResponse = await fetch(result.previewUrl);
          if (imageResponse.ok) {
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setPreviewImage(imageUrl);
            console.log('✅ Preview image loaded successfully via blob URL');
          } else {
            console.error('Failed to download image:', imageResponse.status);
            // Fallback to direct URL
            setPreviewImage(result.previewUrl);
          }
        } catch (fetchError) {
          console.error('Error downloading image via fetch:', fetchError);
          // Fallback to direct URL
          setPreviewImage(result.previewUrl);
        }
        console.log('✅ Preview generated successfully:', result.previewUrl);
      } else {
        console.error('Preview generation failed:', result.error);
        alert('Failed to generate preview: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Preview generation error:', error);
      alert('Error generating preview: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
      formData.append('settings', JSON.stringify(renderSettings));

      const response = await fetch('/api/blender/render', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setRenderResult(result);
    } catch (error) {
      console.error('Render error:', error);
      setRenderResult({
        success: false,
        error: 'Failed to start render process',
      });
    } finally {
      setIsRendering(false);
    }
  };

  // Sidebar esquerda - ícones das seções
  const sidebarSections = [
    { id: 'general' as const, icon: Settings, label: 'General' },
    { id: 'audio' as const, icon: Music, label: 'Audio' },
    { id: 'visualizer' as const, icon: Sliders, label: 'Visualizer' },
    { id: 'backdrop' as const, icon: Image, label: 'Backdrop' },
    { id: 'text' as const, icon: Type, label: 'Text' },
    { id: 'lyrics' as const, icon: FileText, label: 'Lyrics' },
    { id: 'elements' as const, icon: Layers, label: 'Elements' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar Esquerda - Seções */}
      <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-sm font-bold">Z</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 p-2 space-y-2">
          {sidebarSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
                title={section.label}
              >
                <Icon size={20} />
                <span className="text-xs">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Área Central - Preview/Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header Central */}
        <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Zentraw Blender Visualizer</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Project: Audio Visualizer</span>
            </div>
          </div>
          
          {/* Controls do header */}
          <div className="flex items-center gap-2">
            <Button
              onClick={testBlender}
              disabled={isTestingBlender}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 hover:bg-gray-600"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {isTestingBlender ? 'Testing...' : 'Test Blender'}
            </Button>
            
            <Button
              onClick={generatePreview}
              disabled={!audioFile || !imageFile || isGeneratingPreview}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Play className="w-4 h-4 mr-2" />
              {isGeneratingPreview ? 'Generating...' : 'Preview'}
              {autoUpdatePreview && (
                <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </Button>

            <Button
              onClick={handleRender}
              disabled={!audioFile || !imageFile || isRendering}
              className="bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isRendering ? 'Rendering...' : 'Render'}
            </Button>
          </div>
        </div>

        {/* Canvas Principal */}
        <div className="flex-1 bg-gray-900 p-6">
          <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center relative overflow-hidden">
            {previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="Blender Preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                
                {/* Overlay com informações */}
                <div className="absolute top-4 left-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm space-y-1">
                    <div className="text-green-400">✅ Preview Ready</div>
                    <div className="text-gray-300">Engine: {renderSettings.renderEngine.toUpperCase()}</div>
                    <div className="text-gray-300">Camera: {renderSettings.cameraDistance}% distance</div>
                  </div>
                </div>

                {/* Controles de camera overlay */}
                <div className="absolute bottom-4 right-4 bg-black/70 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-xs text-gray-300 mb-2">Camera Position</div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-600 rounded hover:bg-gray-500">
                      <RotateCcw size={16} />
                    </button>
                    <button className="p-2 bg-gray-600 rounded hover:bg-gray-500">
                      <ArrowLeft size={16} />
                    </button>
                    <button className="p-2 bg-gray-600 rounded hover:bg-gray-500">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Image size={32} />
                </div>
                <h3 className="text-lg font-medium mb-2">No Preview Generated</h3>
                <p className="text-sm mb-4">Upload audio and image files, then click Preview</p>
                
                {/* Quick upload area */}
                <div className="flex gap-4 justify-center">
                  <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Music size={24} />
                    <span className="text-sm">Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'audio')}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
                    <Image size={24} />
                    <span className="text-sm">Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Status dos arquivos */}
                {(audioFile || imageFile) && (
                  <div className="mt-4 text-sm">
                    {audioFile && <div className="text-green-400">✅ Audio: {audioFile.name}</div>}
                    {imageFile && <div className="text-green-400">✅ Image: {imageFile.name}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Progress overlay para operações */}
            {(isRendering || isGeneratingPreview) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-lg font-medium mb-2">
                    {isRendering ? 'Rendering Video...' : 'Generating Preview...'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {isRendering ? 'This may take several minutes' : 'Please wait...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Direita - Parâmetros */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* Header da sidebar direita */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold capitalize">{activeSection}</h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stepGuide"
                className="rounded border-gray-600 bg-gray-700 text-purple-600"
              />
              <label htmlFor="stepGuide" className="text-sm text-gray-300">STEP GUIDE</label>
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
              BACK
            </Button>
            <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
              NEXT
            </Button>
          </div>
        </div>

        {/* Conteúdo dos parâmetros */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeSection === 'general' && (
            <>
              {/* Preset */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDropdown('preset')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <span className="font-medium">Preset</span>
                  </div>
                  {dropdownStates.preset ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {dropdownStates.preset && (
                  <div className="ml-11 space-y-3 bg-gray-900/50 rounded-lg p-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Template Style</label>
                      <select
                        value={renderSettings.animationStyle}
                        onChange={(e) => updateSetting('animationStyle', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="cube">Cube Visualizer</option>
                        <option value="sphere">Sphere Visualizer</option>
                        <option value="bars">Bars Visualizer</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Audio */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDropdown('audio')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <span className="font-medium">Audio</span>
                  </div>
                  {dropdownStates.audio ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {dropdownStates.audio && (
                  <div className="ml-11 space-y-3 bg-gray-900/50 rounded-lg p-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Audio File</label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white file:bg-purple-600 file:border-0 file:text-white file:px-4 file:py-1 file:rounded file:mr-3"
                      />
                      {audioFile && (
                        <div className="mt-2 text-sm text-green-400">
                          ✅ {audioFile.name}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Sensitivity: {renderSettings.sensitivity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderSettings.sensitivity}
                        onChange={(e) => updateSetting('sensitivity', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Smoothing: {renderSettings.smoothing}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderSettings.smoothing}
                        onChange={(e) => updateSetting('smoothing', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDropdown('images')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <span className="font-medium">Images</span>
                  </div>
                  {dropdownStates.images ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {dropdownStates.images && (
                  <div className="ml-11 space-y-3 bg-gray-900/50 rounded-lg p-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white file:bg-purple-600 file:border-0 file:text-white file:px-4 file:py-1 file:rounded file:mr-3"
                      />
                      {imageFile && (
                        <div className="mt-2 text-sm text-green-400">
                          ✅ {imageFile.name}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDropdown('camera')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Aperture size={16} />
                    </div>
                    <span className="font-medium">Camera</span>
                  </div>
                  {dropdownStates.camera ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {dropdownStates.camera && (
                  <div className="ml-11 space-y-3 bg-gray-900/50 rounded-lg p-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Distance: {renderSettings.cameraDistance}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderSettings.cameraDistance}
                        onChange={(e) => updateSetting('cameraDistance', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Close</span>
                        <span>Default</span>
                        <span>Far</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Height: {renderSettings.cameraHeight}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderSettings.cameraHeight}
                        onChange={(e) => updateSetting('cameraHeight', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Low</span>
                        <span>Default</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Angle: {renderSettings.cameraAngle}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={renderSettings.cameraAngle}
                        onChange={(e) => updateSetting('cameraAngle', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Left</span>
                        <span>Default</span>
                        <span>Right</span>
                      </div>
                    </div>

                    {/* Auto-update toggle */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                      <input
                        type="checkbox"
                        id="autoUpdate"
                        checked={autoUpdatePreview}
                        onChange={(e) => setAutoUpdatePreview(e.target.checked)}
                        className="rounded border-gray-600 bg-gray-700 text-purple-600"
                      />
                      <label htmlFor="autoUpdate" className="text-sm">Auto-update preview</label>
                    </div>
                  </div>
                )}
              </div>

              {/* Render Settings */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleDropdown('render')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <Monitor size={16} />
                    </div>
                    <span className="font-medium">Render</span>
                  </div>
                  {dropdownStates.render ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                
                {dropdownStates.render && (
                  <div className="ml-11 space-y-3 bg-gray-900/50 rounded-lg p-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Engine</label>
                      <select
                        value={renderSettings.renderEngine}
                        onChange={(e) => updateSetting('renderEngine', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="eevee">Eevee (Fast)</option>
                        <option value="cycles">Cycles (High Quality)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Resolution</label>
                      <select
                        value={renderSettings.resolution}
                        onChange={(e) => updateSetting('resolution', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="720p">720p (1280x720)</option>
                        <option value="1080p">1080p (1920x1080)</option>
                        <option value="4K">4K (3840x2160)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Quality</label>
                      <select
                        value={renderSettings.quality}
                        onChange={(e) => updateSetting('quality', e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="fast">Fast</option>
                        <option value="balanced">Balanced</option>
                        <option value="high">High Quality</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Outras seções podem ser implementadas aqui */}
          {activeSection === 'audio' && (
            <div className="text-center text-gray-400 py-8">
              <Music size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Audio Section</h3>
              <p className="text-sm">Advanced audio settings will be available here</p>
            </div>
          )}

          {activeSection === 'visualizer' && (
            <div className="text-center text-gray-400 py-8">
              <Sliders size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Visualizer Section</h3>
              <p className="text-sm">Visualizer-specific settings will be available here</p>
            </div>
          )}

          {/* ... outras seções ... */}
        </div>

        {/* Footer da sidebar direita */}
        <div className="p-4 border-t border-gray-700">
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
            className="w-full bg-gray-700 border-gray-600 hover:bg-gray-600"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Alerts/Results */}
      {renderResult && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={renderResult.success ? 'border-green-500 bg-green-950' : 'border-red-500 bg-red-950'}>
            <AlertDescription>
              {renderResult.success ? (
                <div className="space-y-2">
                  <div className="text-green-400 font-medium">✅ Render completed!</div>
                  {renderResult.duration && (
                    <div className="text-sm text-green-300">Duration: {renderResult.duration}ms</div>
                  )}
                  {renderResult.outputPath && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-green-800 border-green-600 hover:bg-green-700"
                      onClick={() => window.open(renderResult.outputPath, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-red-400">{renderResult.error}</div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
