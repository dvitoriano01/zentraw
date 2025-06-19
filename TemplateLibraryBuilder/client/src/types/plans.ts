export type PlanTier = 'Basic' | 'Pro' | 'Advanced' | 'Admin';

export interface PlanFeatures {
  maxTemplates: number;
  maxExportResolution: string;
  svgLayouts: boolean;
  premiumEffects: boolean;
  batchExport: boolean;
  customFonts: boolean;
  collaboration: boolean;
  adminTemplates: boolean;
  analytics: boolean;
}

export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  Basic: {
    maxTemplates: 5,
    maxExportResolution: 'standard',
    svgLayouts: false,
    premiumEffects: false,
    batchExport: false,
    customFonts: false,
    collaboration: false,
    adminTemplates: false,
    analytics: false,
  },
  Pro: {
    maxTemplates: 50,
    maxExportResolution: 'high',
    svgLayouts: false,
    premiumEffects: true,
    batchExport: false,
    customFonts: true,
    collaboration: false,
    adminTemplates: false,
    analytics: false,
  },
  Advanced: {
    maxTemplates: 200,
    maxExportResolution: 'ultra',
    svgLayouts: true,
    premiumEffects: true,
    batchExport: true,
    customFonts: true,
    collaboration: true,
    adminTemplates: false,
    analytics: true,
  },
  Admin: {
    maxTemplates: -1, // Unlimited
    maxExportResolution: 'ultra',
    svgLayouts: true,
    premiumEffects: true,
    batchExport: true,
    customFonts: true,
    collaboration: true,
    adminTemplates: true,
    analytics: true,
  },
};

export function hasFeature(userPlan: PlanTier, feature: keyof PlanFeatures): boolean {
  return PLAN_FEATURES[userPlan][feature] as boolean;
}

export function getFeatureLimit(userPlan: PlanTier, feature: keyof PlanFeatures): number | string {
  return PLAN_FEATURES[userPlan][feature];
}