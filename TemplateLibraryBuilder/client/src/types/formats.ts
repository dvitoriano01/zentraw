export interface FormatDimensions {
  width: number;
  height: number;
  name: string;
  aspectRatio: number;
}

export const CANVAS_FORMATS: Record<string, FormatDimensions> = {
  'square': {
    width: 1080,
    height: 1080,
    name: 'Square (1:1)',
    aspectRatio: 1,
  },
  'story': {
    width: 1080,
    height: 1920,
    name: 'Story (9:16)',
    aspectRatio: 9/16,
  },
  'youtube-hd': {
    width: 1920,
    height: 1080,
    name: 'YouTube HD (16:9)',
    aspectRatio: 16/9,
  },
  'youtube-thumbnail': {
    width: 1280,
    height: 720,
    name: 'YouTube Thumbnail (16:9)',
    aspectRatio: 16/9,
  },
  'instagram-post': {
    width: 1080,
    height: 1080,
    name: 'Instagram Post (1:1)',
    aspectRatio: 1,
  },
  'facebook-cover': {
    width: 1200,
    height: 630,
    name: 'Facebook Cover (1.91:1)',
    aspectRatio: 1200/630,
  },
};

export type FormatKey = keyof typeof CANVAS_FORMATS;