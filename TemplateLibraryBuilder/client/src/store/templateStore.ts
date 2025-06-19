import { create } from 'zustand';
import { TemplateSchema, TemplateCategory } from '@/types/template';
import { templateService } from '@/services/templateService';

interface TemplateState {
  templates: TemplateSchema[];
  categories: TemplateCategory[];
  selectedTemplate: TemplateSchema | null;
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTemplates: () => Promise<void>;
  setSelectedTemplate: (template: TemplateSchema | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  createTemplate: (template: Omit<TemplateSchema, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<TemplateSchema>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  getFilteredTemplates: () => TemplateSchema[];
}

const defaultCategories: TemplateCategory[] = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'social', name: 'Social Media', icon: 'share' },
  { id: 'music', name: 'Music', icon: 'music' },
  { id: 'marketing', name: 'Marketing', icon: 'megaphone' },
  { id: 'business', name: 'Business', icon: 'briefcase' },
  { id: 'events', name: 'Events', icon: 'calendar' },
];

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  categories: defaultCategories,
  selectedTemplate: null,
  searchQuery: '',
  selectedCategory: 'all',
  isLoading: false,
  error: null,

  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const templates = await templateService.loadAll();
      set({ templates, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load templates',
        isLoading: false 
      });
    }
  },

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  createTemplate: async (templateData) => {
    set({ isLoading: true, error: null });
    try {
      const template = await templateService.save(templateData);
      const { templates } = get();
      set({ 
        templates: [...templates, template],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create template',
        isLoading: false 
      });
    }
  },

  updateTemplate: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTemplate = await templateService.update(id, updates);
      const { templates } = get();
      set({ 
        templates: templates.map(t => t.id === id ? updatedTemplate : t),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update template',
        isLoading: false 
      });
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await templateService.remove(id);
      const { templates } = get();
      set({ 
        templates: templates.filter(t => t.id !== id),
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete template',
        isLoading: false 
      });
    }
  },

  getFilteredTemplates: () => {
    const { templates, searchQuery, selectedCategory } = get();
    
    return templates.filter(template => {
      const matchesSearch = !searchQuery || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        template.category.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  },
}));
