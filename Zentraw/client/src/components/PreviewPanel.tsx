import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download, Eye } from 'lucide-react';
import { VisualFilter } from './VisualFilters';
import { PreviewModal } from './PreviewModal';

interface PreviewPanelProps {
  selectedTemplate: any;
  activeFormat: 'cover' | 'story';
  uploadedImage: string | null;
  layerControls: any;
  typography: any;
  previewZoom: number;
  visualFilters: Record<string, VisualFilter>;
  onFormatSwitch: () => void;
  onResetPositions: () => void;
  onZoomChange: (zoom: number) => void;
  onDownload: (format: 'cover' | 'story') => void;
  onMouseDown: (e: React.MouseEvent, layerType: string) => void;
}

export function PreviewPanel({
  selectedTemplate,
  activeFormat,
  uploadedImage,
  layerControls,
  typography,
  previewZoom,
  visualFilters,
  onFormatSwitch,
  onResetPositions,
  onZoomChange,
  onDownload,
  onMouseDown
}: PreviewPanelProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const getLayerStyle = (layerType: string) => {
    const layer = layerControls[layerType];
    if (!layer) return {};

    const scale = layer.scale[activeFormat] / 100;
    const position = layer.position[activeFormat];
    const opacity = layer.opacity / 100;
    const filters = visualFilters[layerType];

    // Generate CSS filter string
    const filterArray = [];
    if (filters?.blur > 0) filterArray.push(`blur(${filters.blur}px)`);
    if (filters?.brightness !== 100) filterArray.push(`brightness(${filters.brightness}%)`);
    if (filters?.contrast !== 100) filterArray.push(`contrast(${filters.contrast}%)`);
    if (filters?.saturation !== 100) filterArray.push(`saturate(${filters.saturation}%)`);
    if (filters?.hue !== 0) filterArray.push(`hue-rotate(${filters.hue}deg)`);
    if (filters?.sepia > 0) filterArray.push(`sepia(${filters.sepia}%)`);
    if (filters?.invert > 0) filterArray.push(`invert(${filters.invert}%)`);
    if (filters?.grayscale > 0) filterArray.push(`grayscale(${filters.grayscale}%)`);

    // Generate effect classes
    const effectClasses = [];
    if (filters?.glitch) effectClasses.push('glitch-effect');
    if (filters?.vhs) effectClasses.push('vhs-effect');
    if (filters?.chromaticAberration) effectClasses.push('chromatic-aberration');
    if (filters?.noise > 0) effectClasses.push('noise-effect');
    if (filters?.grain > 0) effectClasses.push('grain-effect');

    return {
      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
      opacity,
      filter: filterArray.join(' ') || 'none',
      mixBlendMode: filters?.blendMode || 'normal',
      className: effectClasses.join(' ')
    };
  };

  const renderTextLayer = (layerType: 'artist' | 'album') => {
    const fontConfig = typography[`${layerType}Font`];
    const text = layerType === 'artist' ? typography.artistName : typography.albumName;
    const offsetY = layerType === 'artist' ? -30 : 30;
    const layerStyle = getLayerStyle(layerType);
    const layer = layerControls[layerType];

    if (!layer || layer.hidden) return null;

    const textStyle: React.CSSProperties = {
      fontFamily: fontConfig.family,
      fontSize: `${fontConfig.size}px`,
      fontWeight: fontConfig.weight,
      fontStyle: fontConfig.fontStyle,
      color: fontConfig.gradientEnabled ? 'transparent' : fontConfig.color,
      textAlign: fontConfig.textAlign,
      textTransform: fontConfig.textTransform,
      textDecoration: fontConfig.textDecoration,
      letterSpacing: `${fontConfig.letterSpacing}px`,
      lineHeight: fontConfig.lineHeight,
      maxWidth: fontConfig.wordWrap ? `${fontConfig.maxWidth}px` : 'none',
      wordWrap: fontConfig.wordWrap ? 'break-word' : 'normal',
      userSelect: 'none',
      pointerEvents: 'none',
      transform: `rotate(${fontConfig.rotation}deg) skew(${fontConfig.skewX}deg, ${fontConfig.skewY}deg)`,
      WebkitTextStroke: fontConfig.strokeWidth > 0 
        ? `${fontConfig.strokeWidth}px ${fontConfig.strokeColor}` 
        : 'none',
      textShadow: fontConfig.shadowBlur > 0 || fontConfig.shadowOffsetX !== 0 || fontConfig.shadowOffsetY !== 0
        ? `${fontConfig.shadowOffsetX}px ${fontConfig.shadowOffsetY}px ${fontConfig.shadowBlur}px ${fontConfig.shadowColor}`
        : 'none',
      ...(fontConfig.backgroundOpacity > 0 && !fontConfig.gradientEnabled && {
        backgroundColor: `${fontConfig.backgroundColor}${Math.round(fontConfig.backgroundOpacity * 2.55).toString(16).padStart(2, '0')}`
      }),
      borderRadius: `${fontConfig.borderRadius}px`,
      padding: fontConfig.padding > 0 ? `${fontConfig.padding}px` : '0',
      outline: fontConfig.outlineWidth > 0 
        ? `${fontConfig.outlineWidth}px solid ${fontConfig.outlineColor}`
        : 'none',
      ...(fontConfig.gradientEnabled && {
        backgroundImage: `linear-gradient(${fontConfig.gradientAngle}deg, ${fontConfig.gradientStart}, ${fontConfig.gradientEnd})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text'
      })
    };

    return (
      <div
        key={layerType}
        className={`absolute inset-0 flex items-center justify-center ${
          !layer.locked ? 'cursor-move' : 'cursor-not-allowed'
        } ${layerStyle.className}`}
        style={{
          ...layerStyle,
          transform: `${layerStyle.transform} translateY(${offsetY}px)`
        }}
        onMouseDown={(e) => onMouseDown(e, layerType)}
      >
        <span style={textStyle}>{text}</span>
      </div>
    );
  };

  return (
    <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Preview</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFormatSwitch}
          >
            {activeFormat === 'cover' ? 'Cover (1:1)' : 'Story (9:16)'}
          </Button>
          <Button variant="outline" size="sm" onClick={onResetPositions}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {selectedTemplate && (
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div 
            ref={previewRef}
            className="relative bg-white border-2 border-gray-200 overflow-hidden cursor-move shadow-lg transition-transform"
            style={{
              width: activeFormat === 'cover' ? '350px' : '210px',
              height: activeFormat === 'cover' ? '350px' : '373px',
              aspectRatio: activeFormat === 'cover' ? '1/1' : '9/16',
              transform: `scale(${previewZoom})`
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.1 : 0.1;
              onZoomChange(Math.max(0.5, Math.min(3, previewZoom + delta)));
            }}
          >
            {/* Render layers in reverse order (bottom to top) */}
            {[...(Array.isArray(layerControls.layerOrder) ? layerControls.layerOrder : ['image', 'svg', 'artist', 'album'])].reverse().map((layerType) => {
              const layer = layerControls[layerType];
              if (!layer || layer.hidden) return null;

              const layerStyle = getLayerStyle(layerType);

              if (layerType === 'image' && uploadedImage) {
                return (
                  <div
                    key={layerType}
                    className={`absolute inset-0 flex items-center justify-center ${layerStyle.className}`}
                    style={layerStyle}
                  >
                    <img 
                      src={uploadedImage} 
                      alt="Background"
                      className="w-full h-full object-cover"
                      style={{ maxWidth: '80%', maxHeight: '80%' }}
                    />
                  </div>
                );
              }

              if (layerType === 'svg') {
                return (
                  <div
                    key={layerType}
                    className={`absolute inset-0 flex items-center justify-center ${
                      !layer.locked ? 'cursor-move' : 'cursor-not-allowed'
                    } ${layerStyle.className}`}
                    style={layerStyle}
                    onMouseDown={(e) => onMouseDown(e, layerType)}
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.svgContent }}
                  />
                );
              }

              if (layerType === 'artist' || layerType === 'album') {
                return renderTextLayer(layerType);
              }

              return null;
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedTemplate && (
        <div className="mt-6 space-y-3">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setShowPreviewModal(true)}
              variant="outline"
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </Button>
            <Button 
              onClick={() => onZoomChange(1)}
              variant="outline"
              size="sm"
            >
              {Math.round(previewZoom * 100)}%
            </Button>
          </div>
          <Button 
            onClick={() => onDownload('cover')}
            className="w-full flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Cover (1:1)</span>
          </Button>
          <Button 
            onClick={() => onDownload('story')}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Story (9:16)</span>
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        template={selectedTemplate}
        format={activeFormat}
        layerControls={layerControls}
        typography={typography}
        uploadedImage={uploadedImage}
        visualFilters={visualFilters}
      />
    </div>
  );
}