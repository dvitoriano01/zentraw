export interface TemplateSchema {
  id: string;
  name: string;
  category: string;
  tags: string[];
  previewUrl: string;
  thumbnailUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  layers: FabricObject[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FabricObject {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: string;
  src?: string;
  [key: string]: any;
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}

export type PlanTier = 'Basic' | 'Pro' | 'Advanced';

export interface PlanLimits {
  maxExportResolution: string;
  maxTemplates: number;
  premiumEffects: boolean;
  batchRender: boolean;
}
