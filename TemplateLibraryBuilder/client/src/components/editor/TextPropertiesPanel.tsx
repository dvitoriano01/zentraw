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
import { freepikFonts } from '@/constants/freepikFontsFixed';
import type { FreepikFont } from '@/constants/freepikFontsFixed';

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
  { label: 'Lucida Console', value: 'Lucida Console', weight: 400, family: 'Lucida Console' },
  { label: 'Palatino', value: 'Palatino', weight: 400, family: 'Palatino' },
  { label: 'Garamond', value: 'Garamond', weight: 400, family: 'Garamond' },
  { label: 'Bookman', value: 'Bookman', weight: 400, family: 'Bookman' },
  { label: 'Avant Garde', value: 'Avant Garde', weight: 400, family: 'Avant Garde' },
];

const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72,
];

// Helper to build unique font value
function getFontUniqueValue(font: FreepikFont) {
  return `${font.value}-${font.weight}-${font.style || 'normal'}`;
}

// Helper to parse unique font value
function parseFontUniqueValue(val: string) {
  const [value, weight, style] = val.split('-');
  return { value, weight: Number(weight), style };
}

export function TextPropertiesPanel({ selectedObject, onUpdateText, availableFonts: propAvailableFonts }: TextPropertiesProps) {
  const [activeTab, setActiveTab] = useState('character');
  const [localAvailableFonts, setLocalAvailableFonts] = useState<FreepikFont[]>([]);

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
    // Paragraph properties
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
        // Usar diretamente o array de fontes
        const freepikFontsList = freepikFonts;
        const systemFonts = SYSTEM_FONTS;

        // Combine Freepik + system fonts, removendo duplicatas
        const allFonts = [
          ...freepikFontsList,
          ...systemFonts.filter(
            (sysFont) => !freepikFontsList.some((fpFont: FreepikFont) => fpFont.value === sysFont.value),
          ),
        ];

        setLocalAvailableFonts(allFonts);
      };

      loadAvailableFonts();
    }
  }, [propAvailableFonts]);

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
        // Paragraph properties
        marginTop: selectedObject.marginTop || 0,
        marginBottom: selectedObject.marginBottom || 0,
        marginLeft: selectedObject.marginLeft || 0,
        marginRight: selectedObject.marginRight || 0,
        textIndent: selectedObject.textIndent || 0,
        hyphenate: selectedObject.hyphenate || false,
      });
    }
  }, [selectedObject]);

  // Find the unique value for the current font selection
  function getCurrentFontUniqueValue() {
    const font = allFonts.find(f =>
      f.value === textProperties.fontFamily &&
      (f.weight?.toString() === textProperties.fontWeight?.toString() || (!f.weight && textProperties.fontWeight === 'normal')) &&
      (f.style || 'normal') === (textProperties.fontStyle || 'normal')
    );
    return font ? getFontUniqueValue(font) : textProperties.fontFamily;
  }

  const updateProperty = (property: string, value: any) => {
    const newProperties = { ...textProperties, [property]: value };
    setTextProperties(newProperties);

    // CRITICAL FIX: For fontFamily, handle new font structure with weight and style
    if (property === 'fontFamily') {
      // Parse the unique value
      const { value: fontValue, weight, style } = parseFontUniqueValue(value);
      const selectedFont = allFonts.find(font =>
        font.value === fontValue &&
        font.weight === weight &&
        (font.style || 'normal') === (style || 'normal')
      ) as FreepikFont;
      if (selectedFont) {
        const finalFontFamily = selectedFont.originalValue || selectedFont.value;
        const fontWeight = selectedFont.weight || 400;
        const fontStyle = selectedFont.style || 'normal';
        onUpdateText({ 
          fontFamily: finalFontFamily,
          fontWeight: fontWeight,
          fontStyle: fontStyle
        });
      } else {
        // Fallback for system fonts or missing fonts
        onUpdateText({ fontFamily: value });
      }
    } else {
      // Handle other properties normally
      const fabricProperty = property === 'letterSpacing' ? 'charSpacing' : property;
      onUpdateText({ [fabricProperty]: value });
    }
  };

  const toggleBold = () => {
    const newWeight = textProperties.fontWeight === 'bold' ? 'normal' : 'bold';
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
      <div className="p-4 text-center text-gray-500">
        <Type className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select text to edit properties</p>
      </div>
    );
  }

  return (
    <div className="bg-[#383838] border border-[#4a4a4a] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#2d2d2d] px-3 py-2 border-b border-[#4a4a4a]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">Text Properties</span>
          <Type className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-[#323232] px-3 py-1">
          <TabsList className="grid w-full grid-cols-2 bg-[#1e1e1e] h-8">
            <TabsTrigger value="character" className="text-xs py-1">
              Character
            </TabsTrigger>
            <TabsTrigger value="paragraph" className="text-xs py-1">
              Paragraph
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Character Tab */}
        <TabsContent value="character" className="m-0 p-4 space-y-4">
          {/* Font Family */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
            <Select
              value={getCurrentFontUniqueValue()}
              onValueChange={(value) => updateProperty('fontFamily', value)}
            >
              <SelectTrigger className="w-full h-7 text-xs bg-[#2d2d2d] border-[#4a4a4a]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64 overflow-y-auto">
                {/* Freepik Fonts Section - ORGANIZADAS por família */}
                {allFonts.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-xs font-semibold text-blue-400 bg-[#1a1a1a]">
                      🎨 Freepik Fonts Organized (
                      {allFonts.filter((f: FreepikFont) => !SYSTEM_FONTS.some((sf: FreepikFont) => sf.value === f.value)).length})
                    </div>
                    {(() => {
                      const freepikFonts = allFonts.filter((font: FreepikFont) => !SYSTEM_FONTS.some((sf: FreepikFont) => sf.value === font.value));
                      let currentFamily = '';
                      return freepikFonts.map((font: FreepikFont, index: number) => {
                        const familyName = font.family || font.label.split(' ')[0];
                        const isNewFamily = familyName !== currentFamily;
                        currentFamily = familyName;
                        const uniqueValue = getFontUniqueValue(font);
                        return (
                          <div key={uniqueValue}>
                            {/* Family separator */}
                            {isNewFamily && index > 0 && (
                              <div className="border-t border-[#2a2a2a] my-1" />
                            )}
                            <SelectItem 
                              value={uniqueValue}
                              className="text-xs hover:bg-[#3a3a3a] focus:bg-[#3a3a3a]"
                              style={{
                                fontFamily: font.value,
                                fontWeight: font.weight || 400,
                                fontStyle: font.style || 'normal',
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{font.label}</span>
                                {font.weight && font.weight !== 400 && (
                                  <span className="text-[10px] text-gray-500 ml-2">
                                    {font.weight}{font.style === 'italic' ? 'i' : ''}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          </div>
                        );
                      });
                    })()}
                  </>
                )}

                {/* System Fonts Section */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-[#1a1a1a]">
                  🔧 System Fonts ({SYSTEM_FONTS.length})
                </div>
                {SYSTEM_FONTS.map((font) => (
                  <SelectItem key={font.value} value={font.value} className="text-xs">
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size & Style Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Size</label>
              <Select
                value={textProperties.fontSize.toString()}
                onValueChange={(value) => updateProperty('fontSize', parseInt(value))}
              >
                <SelectTrigger className="w-full h-7 text-xs bg-[#2d2d2d] border-[#4a4a4a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size} pt
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={textProperties.fill}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="w-7 h-7 border border-[#4a4a4a] rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={textProperties.fill}
                  onChange={(e) => updateProperty('fill', e.target.value)}
                  className="flex-1 h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>

          {/* Style Buttons */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Style</label>
            <div className="flex space-x-1">
              <Button
                variant={textProperties.fontWeight === 'bold' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleBold}
                className="w-8 h-8 p-0"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.fontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleItalic}
                className="w-8 h-8 p-0"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textDecoration === 'underline' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleUnderline}
                className="w-8 h-8 p-0"
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
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
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Line Height: {textProperties.lineHeight}
            </label>
            <Slider
              value={[textProperties.lineHeight]}
              onValueChange={(value) => updateProperty('lineHeight', value[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>
        </TabsContent>

        {/* Paragraph Tab */}
        <TabsContent value="paragraph" className="m-0 p-4 space-y-4">
          {/* Text Alignment */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Alignment</label>
            <div className="flex space-x-1">
              <Button
                variant={textProperties.textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'left')}
                className="w-8 h-8 p-0"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'center')}
                className="w-8 h-8 p-0"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'right')}
                className="w-8 h-8 p-0"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === 'justify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateProperty('textAlign', 'justify')}
                className="w-8 h-8 p-0"
              >
                <AlignJustify className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Margins */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Before</label>
              <input
                type="number"
                value={textProperties.marginTop}
                onChange={(e) => updateProperty('marginTop', parseInt(e.target.value) || 0)}
                className="w-full h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
                placeholder="0 pt"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">After</label>
              <input
                type="number"
                value={textProperties.marginBottom}
                onChange={(e) => updateProperty('marginBottom', parseInt(e.target.value) || 0)}
                className="w-full h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
                placeholder="0 pt"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Left</label>
              <input
                type="number"
                value={textProperties.marginLeft}
                onChange={(e) => updateProperty('marginLeft', parseInt(e.target.value) || 0)}
                className="w-full h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
                placeholder="0 pt"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Right</label>
              <input
                type="number"
                value={textProperties.marginRight}
                onChange={(e) => updateProperty('marginRight', parseInt(e.target.value) || 0)}
                className="w-full h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
                placeholder="0 pt"
              />
            </div>
          </div>

          {/* Text Indent */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">First Line Indent</label>
            <input
              type="number"
              value={textProperties.textIndent}
              onChange={(e) => updateProperty('textIndent', parseInt(e.target.value) || 0)}
              className="w-full h-7 text-xs bg-[#2d2d2d] border border-[#4a4a4a] rounded px-2"
              placeholder="0 pt"
            />
          </div>

          {/* Hyphenate */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hyphenate"
              checked={textProperties.hyphenate}
              onChange={(e) => updateProperty('hyphenate', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="hyphenate" className="text-xs text-gray-400">
              Hyphenate
            </label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TextPropertiesPanel;