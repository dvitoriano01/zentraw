import { TemplateSchema } from '@/types/template';
import { apiRequest } from '@/lib/queryClient';
import type { Template, InsertTemplate } from '@shared/schema';

class TemplateService {
  private templates: Map<string, TemplateSchema> = new Map();

  async loadAll(): Promise<TemplateSchema[]> {
    try {
      // Load templates from database
      const response = await apiRequest('GET', '/api/templates');
      const dbTemplates = await response.json() as Template[];
      
      // Convert database templates to frontend format
      const convertedTemplates = dbTemplates.map(this.convertFromDbTemplate);
      
      // Load built-in templates as fallback
      const builtinTemplates = await this.loadBuiltinTemplates();
      
      // Combine templates
      const allTemplates = [...convertedTemplates, ...builtinTemplates];
      
      // Cache templates
      this.templates.clear();
      allTemplates.forEach(template => {
        this.templates.set(template.id, template);
      });
      
      return allTemplates;
    } catch (error) {
      console.error('Failed to load templates from database, using built-in templates:', error);
      // Fallback to built-in templates
      const builtinTemplates = await this.loadBuiltinTemplates();
      this.templates.clear();
      builtinTemplates.forEach(template => {
        this.templates.set(template.id, template);
      });
      return builtinTemplates;
    }
  }

  private async loadBuiltinTemplates(): Promise<TemplateSchema[]> {
    const templatePaths = [
      '/src/templates/instagram-post.json',
      '/src/templates/album-cover.json',
      '/src/templates/business-poster.json',
    ];

    const templates: TemplateSchema[] = [];

    for (const path of templatePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          const template = await response.json();
          templates.push(template);
        }
      } catch (error) {
        console.warn(`Failed to load template from ${path}:`, error);
      }
    }

    return templates;
  }

  private loadUserTemplates(): TemplateSchema[] {
    try {
      const stored = localStorage.getItem('zentraw_user_templates');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load user templates from localStorage:', error);
      return [];
    }
  }

  private saveUserTemplates(templates: TemplateSchema[]): void {
    try {
      localStorage.setItem('zentraw_user_templates', JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save user templates to localStorage:', error);
    }
  }

  async load(id: string): Promise<TemplateSchema | null> {
    if (this.templates.size === 0) {
      await this.loadAll();
    }
    return this.templates.get(id) || null;
  }

  async save(templateData: Omit<TemplateSchema, 'id' | 'createdAt' | 'updatedAt'>): Promise<TemplateSchema> {
    const template: TemplateSchema = {
      ...templateData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(template.id, template);
    
    // Save to localStorage (user templates only)
    const userTemplates = this.loadUserTemplates();
    userTemplates.push(template);
    this.saveUserTemplates(userTemplates);

    return template;
  }

  async update(id: string, updates: Partial<TemplateSchema>): Promise<TemplateSchema> {
    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error(`Template with id ${id} not found`);
    }

    const updated: TemplateSchema = {
      ...existing,
      ...updates,
      id, // Preserve original id
      createdAt: existing.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    this.templates.set(id, updated);
    
    // Update in localStorage if it's a user template
    const userTemplates = this.loadUserTemplates();
    const userTemplateIndex = userTemplates.findIndex(t => t.id === id);
    if (userTemplateIndex >= 0) {
      userTemplates[userTemplateIndex] = updated;
      this.saveUserTemplates(userTemplates);
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const template = this.templates.get(id);
    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }

    this.templates.delete(id);
    
    // Remove from localStorage if it's a user template
    const userTemplates = this.loadUserTemplates();
    const filteredTemplates = userTemplates.filter(t => t.id !== id);
    this.saveUserTemplates(filteredTemplates);
  }

  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const templateService = new TemplateService();
