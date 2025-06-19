import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export interface VisualFilter {
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  sepia: number;
  invert: number;
  grayscale: number;
  opacity: number;
  // Advanced effects
  glitch: boolean;
  vhs: boolean;
  chromaticAberration: boolean;
  noise: number;
  grain: number;
  // Animation controls
  animationsEnabled: boolean;
  // Blend modes
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light' | 'color-dodge' | 'color-burn' | 'darken' | 'lighten' | 'difference' | 'exclusion';
}

interface VisualFiltersProps {
  layerType: 'image' | 'svg' | 'artist' | 'album';
  filters: VisualFilter;
  onFiltersChange: (filters: VisualFilter) => void;
  onReset: () => void;
}

const defaultFilters: VisualFilter = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  sepia: 0,
  invert: 0,
  grayscale: 0,
  opacity: 100,
  glitch: false,
  vhs: false,
  chromaticAberration: false,
  noise: 0,
  grain: 0,
  animationsEnabled: false,
  blendMode: 'normal'
};

export function VisualFilters({ layerType, filters, onFiltersChange, onReset }: VisualFiltersProps) {
  const updateFilter = (key: keyof VisualFilter, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange(defaultFilters);
    onReset();
  };

  // Generate CSS filter string
  const getCSSFilter = () => {
    const filterArray = [];
    
    if (filters.blur > 0) filterArray.push(`blur(${filters.blur}px)`);
    if (filters.brightness !== 100) filterArray.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) filterArray.push(`contrast(${filters.contrast}%)`);
    if (filters.saturation !== 100) filterArray.push(`saturate(${filters.saturation}%)`);
    if (filters.hue !== 0) filterArray.push(`hue-rotate(${filters.hue}deg)`);
    if (filters.sepia > 0) filterArray.push(`sepia(${filters.sepia}%)`);
    if (filters.invert > 0) filterArray.push(`invert(${filters.invert}%)`);
    if (filters.grayscale > 0) filterArray.push(`grayscale(${filters.grayscale}%)`);
    
    return filterArray.join(' ');
  };

  // Generate CSS classes for advanced effects
  const getEffectClasses = () => {
    const classes = [];
    
    if (filters.glitch) classes.push('glitch-effect');
    if (filters.vhs) classes.push('vhs-effect');
    if (filters.chromaticAberration) classes.push('chromatic-aberration');
    if (filters.noise > 0) classes.push('noise-effect');
    if (filters.grain > 0) classes.push('grain-effect');
    
    return classes.join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="capitalize">{layerType} Visual Effects</CardTitle>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Basic Filters</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Blur: {filters.blur}px</Label>
              <Slider
                value={[filters.blur]}
                onValueChange={(value) => updateFilter('blur', value[0])}
                min={0}
                max={20}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Brightness: {filters.brightness}%</Label>
              <Slider
                value={[filters.brightness]}
                onValueChange={(value) => updateFilter('brightness', value[0])}
                min={0}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Contrast: {filters.contrast}%</Label>
              <Slider
                value={[filters.contrast]}
                onValueChange={(value) => updateFilter('contrast', value[0])}
                min={0}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Saturation: {filters.saturation}%</Label>
              <Slider
                value={[filters.saturation]}
                onValueChange={(value) => updateFilter('saturation', value[0])}
                min={0}
                max={200}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Hue: {filters.hue}°</Label>
              <Slider
                value={[filters.hue]}
                onValueChange={(value) => updateFilter('hue', value[0])}
                min={-180}
                max={180}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Sepia: {filters.sepia}%</Label>
              <Slider
                value={[filters.sepia]}
                onValueChange={(value) => updateFilter('sepia', value[0])}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Effects */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm text-gray-700">Advanced Effects</h4>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.animationsEnabled}
                onCheckedChange={(checked) => updateFilter('animationsEnabled', checked)}
              />
              <Label className="text-xs">Animações</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.glitch}
                onCheckedChange={(checked) => updateFilter('glitch', checked)}
              />
              <Label>Glitch Effect</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.vhs}
                onCheckedChange={(checked) => updateFilter('vhs', checked)}
              />
              <Label>VHS Effect</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.chromaticAberration}
                onCheckedChange={(checked) => updateFilter('chromaticAberration', checked)}
              />
              <Label>Chromatic Aberration</Label>
            </div>

            <div>
              <Label>Noise: {filters.noise}%</Label>
              <Slider
                value={[filters.noise]}
                onValueChange={(value) => updateFilter('noise', value[0])}
                min={0}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Blend Mode */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Blend Mode</h4>
          
          <div>
            <Label>Blend Mode</Label>
            <Select 
              value={filters.blendMode}
              onValueChange={(value) => updateFilter('blendMode', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
                <SelectItem value="soft-light">Soft Light</SelectItem>
                <SelectItem value="hard-light">Hard Light</SelectItem>
                <SelectItem value="color-dodge">Color Dodge</SelectItem>
                <SelectItem value="color-burn">Color Burn</SelectItem>
                <SelectItem value="darken">Darken</SelectItem>
                <SelectItem value="lighten">Lighten</SelectItem>
                <SelectItem value="difference">Difference</SelectItem>
                <SelectItem value="exclusion">Exclusion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Preview */}
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">CSS Filter String:</Label>
          <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
            {getCSSFilter() || 'none'}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}

export { defaultFilters };