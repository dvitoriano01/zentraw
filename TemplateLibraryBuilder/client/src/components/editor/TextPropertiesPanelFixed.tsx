import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
} from 'lucide-react';
import { FreepikFontManager } from '@/utils/FreepikFontManager';
import { FreepikFont } from '@/constants/freepikFontsFixed';

interface TextPropertiesProps {
  selectedObject: any;
  onUpdateText: (properties: any) => void;
  availableFonts?: FreepikFont[];
}

// System fonts as fallback - matched to FreepikFont structure
const SYSTEM_FONTS: FreepikFont[] = [
  { label: 'Arial', value: 'Arial', weight: 400, family: 'Arial' },
  { label: 'Helvetica', value: 'Helvetica', weight: 400, family: 'Helvetica' },
  { label: 'Times New Roman', value: 'Times New Roman', weight: 400, family: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia', weight: 400, family: 'Georgia' },
  { label: 'Verdana', value: 'Verdana', weight: 400, family: 'Verdana' },
  { label: 'Tahoma', value: 'Tahoma', weight: 400, family: 'Tahoma' },
  { label: 'Impact', value: 'Impact', weight: 400, family: 'Impact' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS', weight: 400, family: 'Comic Sans MS' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS', weight: 400, family: 'Trebuchet MS' },
  { label: 'Courier New', value: 'Courier New', weight: 400, family: 'Courier New' },
];

const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72,
];

export function TextPropertiesPanel({
  selectedObject,
  onUpdateText,
  availableFonts: propAvailableFonts,
}: TextPropertiesProps) {
  const [activeTab, setActiveTab] = useState('character');
  const [localAvailableFonts, setLocalAvailableFonts] = useState<FreepikFont[]>([]);
  const fontManager = FreepikFontManager.getInstance();

  // Use fonts passed as prop (robustly verified) or fallback
  const allFonts = propAvailableFonts || localAvailableFonts;

  const [textProperties, setTextProperties] = useState({
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: '',
    fill: '#000000',
    textAlign: 'left',
    lineHeight: 1.2,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    textIndent: 0,
    hyphenate: false,
  });

  // Load available fonts only if not passed as prop
  useEffect(() => {
    if (!propAvailableFonts) {
      const loadAvailableFonts = () => {
        const freepikFonts = fontManager.getAvailableFonts();
        const systemFonts = SYSTEM_FONTS;

        // Combine Freepik + system fonts, removing duplicates
        const allFonts = [
          ...freepikFonts,
          ...systemFonts.filter(
            (sysFont) =>
              !freepikFonts.some((fpFont: FreepikFont) => fpFont.value === sysFont.value),
          ),
        ];

        setLocalAvailableFonts(allFonts);
      };

      loadAvailableFonts();
    }
  }, [propAvailableFonts, fontManager]);

  // Update text properties when selected object changes
  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      setTextProperties({
        fontFamily: selectedObject.fontFamily || 'Arial',
        fontSize: selectedObject.fontSize || 16,
        fontWeight: selectedObject.fontWeight || 'normal',
        fontStyle: selectedObject.fontStyle || 'normal',
        textDecoration: selectedObject.textDecoration || '',
        fill: selectedObject.fill || '#000000',
        textAlign: selectedObject.textAlign || 'left',
        lineHeight: selectedObject.lineHeight || 1.2,
        letterSpacing: selectedObject.charSpacing || 0,
        marginTop: selectedObject.marginTop || 0,
        marginBottom: selectedObject.marginBottom || 0,
        marginLeft: selectedObject.marginLeft || 0,
        marginRight: selectedObject.marginRight || 0,
        textIndent: selectedObject.textIndent || 0,
        hyphenate: selectedObject.hyphenate || false,
      });
    }
  }, [selectedObject]);

  const updateProperty = (property: string, value: any) => {
    const newProperties = { ...textProperties, [property]: value };
    setTextProperties(newProperties);

    // Handle font family specially for Freepik fonts
    if (property === 'fontFamily') {
      const selectedFont = allFonts.find((font) => font.value === value) as FreepikFont;

      if (selectedFont) {
        console.log(`🎨 Applying font: ${selectedFont.label} (${selectedFont.value})`);
        onUpdateText({
          fontFamily: selectedFont.value,
          fontWeight: selectedFont.weight || 400,
          fontStyle: selectedFont.style || 'normal',
        });
      } else {
        onUpdateText({ fontFamily: value });
      }
    } else {
      // Handle other properties
      const fabricProperty = property === 'letterSpacing' ? 'charSpacing' : property;
      onUpdateText({ [fabricProperty]: value });
    }
  };

  const toggleBold = () => {
    const newWeight =
      textProperties.fontWeight === 'bold' || textProperties.fontWeight === 700 ? 'normal' : 'bold';
    updateProperty('fontWeight', newWeight);
  };

  const toggleItalic = () => {
    const newStyle = textProperties.fontStyle === 'italic' ? 'normal' : 'italic';
    updateProperty('fontStyle', newStyle);
  };

  const toggleUnderline = () => {
    const newDecoration = textProperties.textDecoration === 'underline' ? '' : 'underline';
    updateProperty('textDecoration', newDecoration);
  };

  if (!selectedObject || selectedObject.type !== 'i-text') {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Type className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Select a text object to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#1a1a1a] border-l border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Type className="h-4 w-4" />
          Text Properties
        </h3>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 bg-[#2a2a2a] mx-4 mt-4">
          <TabsTrigger value="character" className="text-xs">
            Character
          </TabsTrigger>
          <TabsTrigger value="paragraph" className="text-xs">
            Paragraph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="character" className="mt-4 px-4 space-y-4">
          {/* Font Family */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Font Family</label>
            <Select
              value={textProperties.fontFamily}
              onValueChange={(value) => updateProperty('fontFamily', value)}
            >
              <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-600 max-h-60">
                {allFonts.length > 0 ? (
                  <>
                    {/* Freepik Fonts Section */}
                    {(() => {
                      const freepikFonts = allFonts.filter(
                        (font) => !SYSTEM_FONTS.some((sys) => sys.value === font.value),
                      );
                      const systemFonts = allFonts.filter((font) =>
                        SYSTEM_FONTS.some((sys) => sys.value === font.value),
                      );

                      return (
                        <>
                          {freepikFonts.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-[#1a1a1a]">
                                🎨 Freepik Fonts ({freepikFonts.length})
                              </div>
                              {freepikFonts.map((font) => (
                                <SelectItem
                                  key={font.value}
                                  value={font.value}
                                  className="text-xs hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span>{font.label}</span>
                                    {font.weight && font.weight !== 400 && (
                                      <span className="text-[10px] text-gray-500 ml-2">
                                        {font.weight}
                                        {font.style === 'italic' ? 'i' : ''}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </>
                          )}

                          {/* System Fonts Section */}
                          {systemFonts.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-[#1a1a1a]">
                                🔧 System Fonts ({systemFonts.length})
                              </div>
                              {systemFonts.map((font) => (
                                <SelectItem
                                  key={font.value}
                                  value={font.value}
                                  className="text-xs hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                                >
                                  {font.label}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <SelectItem value="Arial" className="text-xs">
                    Loading fonts...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Font Size</label>
            <Select
              value={textProperties.fontSize.toString()}
              onValueChange={(value) => updateProperty('fontSize', parseInt(value))}
            >
              <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-600 max-h-60">
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size.toString()} className="text-xs">
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Style Buttons */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Style</label>
            <div className="flex gap-2">
              <Button
                variant={
                  textProperties.fontWeight === 'bold' || textProperties.fontWeight === 700
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={toggleBold}
                className="flex-1"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={textProperties.fontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleItalic}
                className="flex-1"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={textProperties.textDecoration === 'underline' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleUnderline}
                className="flex-1"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Color</label>
            <input
              type="color"
              value={textProperties.fill}
              onChange={(e) => updateProperty('fill', e.target.value)}
              className="w-full h-10 bg-[#2a2a2a] border border-gray-600 rounded cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">
              Letter Spacing: {textProperties.letterSpacing}px
            </label>
            <Slider
              value={[textProperties.letterSpacing]}
              onValueChange={(value) => updateProperty('letterSpacing', value[0])}
              min={-5}
              max={20}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">
              Line Height: {textProperties.lineHeight}
            </label>
            <Slider
              value={[textProperties.lineHeight]}
              onValueChange={(value) => updateProperty('lineHeight', value[0])}
              min={0.8}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="paragraph" className="mt-4 px-4 space-y-4">
          {/* Text Alignment */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Alignment</label>
            <div className="flex gap-2">
              <Button
                variant={textProperties.textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'left')}
                className="flex-1"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'center')}
                className="flex-1"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'right')}
                className="flex-1"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'justify')}
                className="flex-1"
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TextPropertiesPanel;
