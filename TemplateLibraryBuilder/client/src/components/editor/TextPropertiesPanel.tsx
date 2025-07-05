// ZENTRAW PHOTO EDITOR V1.3.0.c.7 - Painel de Propriedades de Texto
// 🎯 DROPDOWN INTELIGENTE: Chave única por variação (família-peso-estilo)
// 🔄 APLICAÇÃO ROBUSTA: Família + peso + estilo aplicados simultaneamente
// 🎨 ORGANIZAÇÃO PHOTOSHOP: Famílias agrupadas e organizadas
// 🛡️ FALLBACK SEGURO: Tratamento de erros na aplicação de fontes

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Palette
} from 'lucide-react';
import { freepikFonts } from '@/constants/freepikFontsFixed';

interface TextPropertiesProps {
  selectedObject: any;
  onUpdateText: (properties: any) => void;
}

// Substituído por fontes Freepik reais
const FREEPIK_FONTS = freepikFonts;

const FONT_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72
];

export function TextPropertiesPanel({ selectedObject, onUpdateText }: TextPropertiesProps) {
  const [activeTab, setActiveTab] = useState('character');
  const [textProperties, setTextProperties] = useState({
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 400 as string | number,
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
    hyphenate: false
  });

  useEffect(() => {
    if (selectedObject && selectedObject.type === 'i-text') {
      setTextProperties({
        fontFamily: selectedObject.fontFamily || 'Arial',
        fontSize: selectedObject.fontSize || 16,
        fontWeight: selectedObject.fontWeight || 400,
        fontStyle: selectedObject.fontStyle || 'normal',
        textDecoration: selectedObject.textDecoration || '',
        fill: selectedObject.fill || '#000000',
        textAlign: selectedObject.textAlign || 'left',
        lineHeight: selectedObject.lineHeight || 1.2,
        letterSpacing: selectedObject.charSpacing || 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        textIndent: 0,
        hyphenate: false
      });
    }
  }, [selectedObject]);

  const getCurrentFontKey = () => {
    // Encontrar a fonte que corresponde exatamente ao estado atual
    const currentFont = FREEPIK_FONTS.find(font => 
      font.value === textProperties.fontFamily && 
      (font.weight || 400) === (typeof textProperties.fontWeight === 'string' ? 
        (textProperties.fontWeight === 'bold' ? 700 : 400) : 
        textProperties.fontWeight) && 
      (font.style || 'normal') === textProperties.fontStyle
    );
    
    if (currentFont) {
      return `${currentFont.value}-${currentFont.weight || 400}-${currentFont.style || 'normal'}`;
    }
    
    // Fallback: criar chave baseada no estado atual
    return `${textProperties.fontFamily}-${typeof textProperties.fontWeight === 'string' ? 
      (textProperties.fontWeight === 'bold' ? 700 : 400) : 
      textProperties.fontWeight}-${textProperties.fontStyle}`;
  };

  const updateProperty = (property: string, value: any) => {
    const newProperties = { ...textProperties, [property]: value };
    setTextProperties(newProperties);
    
    // Map properties to Fabric.js property names
    const fabricProperty = property === 'letterSpacing' ? 'charSpacing' : property;
    onUpdateText({ [fabricProperty]: value });
  };

  const updateFontFamily = (fontKey: string) => {
    // Encontrar a fonte selecionada pelo valor único (fontKey)
    const selectedFont = FREEPIK_FONTS.find(font => {
      const key = `${font.value}-${font.weight || 400}-${font.style || 'normal'}`;
      return key === fontKey;
    });
    
    if (selectedFont) {
      const updates: any = { fontFamily: selectedFont.value };
      
      // Aplicar weight e style se especificados na fonte
      if (selectedFont.weight) {
        updates.fontWeight = selectedFont.weight;
      }
      if (selectedFont.style) {
        updates.fontStyle = selectedFont.style;
      }
      
      console.log('Fonte selecionada:', selectedFont);
      console.log('Updates a aplicar:', updates);
      
      // Atualizar o estado local
      const newProperties = { ...textProperties, ...updates };
      setTextProperties(newProperties);
      
      // Enviar todas as propriedades para o Fabric.js
      onUpdateText(updates);
    } else {
      // Fallback para fontes não-Freepik (usar apenas o nome da família)
      updateProperty('fontFamily', fontKey);
    }
  };

  const toggleBold = () => {
    const newWeight = (textProperties.fontWeight === 700 || textProperties.fontWeight === 'bold') ? 400 : 700;
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
            <TabsTrigger value="character" className="text-xs py-1">Character</TabsTrigger>
            <TabsTrigger value="paragraph" className="text-xs py-1">Paragraph</TabsTrigger>
          </TabsList>
        </div>

        {/* Character Tab */}
        <TabsContent value="character" className="m-0 p-4 space-y-4">
          {/* Font Family */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Font Family</label>
            <Select value={getCurrentFontKey()} onValueChange={(value) => updateFontFamily(value)}>
              <SelectTrigger className="w-full h-7 text-xs bg-[#2d2d2d] border-[#4a4a4a]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREEPIK_FONTS.map(font => {
                  // Criar uma chave única para cada variação de fonte
                  const fontKey = `${font.value}-${font.weight || 400}-${font.style || 'normal'}`;
                  return (
                    <SelectItem key={fontKey} value={fontKey} className="text-xs">
                      <span style={{ 
                        fontFamily: font.value,
                        fontWeight: font.weight || 400,
                        fontStyle: font.style || 'normal'
                      }}>
                        {font.label}
                      </span>
                    </SelectItem>
                  );
                })}
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
                  {FONT_SIZES.map(size => (
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
                variant={(textProperties.fontWeight === 700 || textProperties.fontWeight === 'bold') ? 'default' : 'outline'}
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
            <label htmlFor="hyphenate" className="text-xs text-gray-400">Hyphenate</label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}