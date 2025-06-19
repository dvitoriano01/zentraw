import { useEffect } from 'react';
import { useTemplateStore } from '@/store/templateStore';

export function useTemplates() {
  const {
    templates,
    categories,
    selectedTemplate,
    searchQuery,
    selectedCategory,
    isLoading,
    error,
    loadTemplates,
    setSelectedTemplate,
    setSearchQuery,
    setSelectedCategory,
    getFilteredTemplates,
  } = useTemplateStore();

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filteredTemplates = getFilteredTemplates();

  return {
    templates: filteredTemplates,
    allTemplates: templates,
    categories,
    selectedTemplate,
    searchQuery,
    selectedCategory,
    isLoading,
    error,
    setSelectedTemplate,
    setSearchQuery,
    setSelectedCategory,
    loadTemplates,
  };
}
