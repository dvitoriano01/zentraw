import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Database Types
export interface User {
  id: string;
  email: string;
  artist_name?: string;
  plan: 'free' | 'basic' | 'premium';
  tokens_used: number;
  created_at: string;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  title: string;
  image_url?: string;
  image_data?: string;
  type: 'cover' | 'story' | 'video' | 'visualizer' | 'upload';
  prompt?: string;
  style?: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
}

export interface SavedProject {
  id: string;
  user_id: string;
  name: string;
  type: 'cover' | 'release' | 'press_kit';
  data: any;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'modern' | 'futuristic' | 'vintage' | 'urban' | 'classic';
  preview_url: string;
  template_data: any;
  flip_allowed: 'horizontal' | 'vertical' | 'both' | 'none';
  opacity_range: { min: number; max: number };
  font_size_range: { min: number; max: number };
  filters_enabled: string[];
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  auto_save: boolean;
  watermark_opacity: number;
  default_template_category: string;
  created_at: string;
  updated_at: string;
}