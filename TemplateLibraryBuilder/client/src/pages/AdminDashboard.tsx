import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Download, 
  Upload,
  Users,
  FileText,
  BarChart3,
  Settings,
  Filter,
  Calendar,
  Star
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  isPremium: boolean;
  downloads: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  previewUrl?: string;
  thumbnailUrl?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  plan: string;
  templatesCount: number;
  joinedAt: string;
}

interface AdminStats {
  totalTemplates: number;
  totalUsers: number;
  totalDownloads: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: '',
    description: '',
    tags: '',
    isPublic: true,
    isPremium: false
  });

  const queryClient = useQueryClient();

  // Fetch admin stats
  const { data: stats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    retry: false
  });

  // Fetch templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ['/api/admin/templates'],
    retry: false
  });

  // Fetch users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    retry: false
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest('/api/admin/templates', 'POST', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setTemplateDialogOpen(false);
      resetForm();
    }
  });

  // Update template mutation
  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, ...templateData }: any) => {
      return await apiRequest(`/api/admin/templates/${id}`, 'PATCH', templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      setTemplateDialogOpen(false);
      setEditingTemplate(null);
      resetForm();
    }
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/templates/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/templates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
    }
  });

  const resetForm = () => {
    setNewTemplate({
      name: '',
      category: '',
      description: '',
      tags: '',
      isPublic: true,
      isPremium: false
    });
  };

  const handleCreateTemplate = () => {
    const templateData = {
      ...newTemplate,
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    createTemplateMutation.mutate(templateData);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    
    const templateData = {
      id: editingTemplate.id,
      ...newTemplate,
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    updateTemplateMutation.mutate(templateData);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      category: template.category,
      description: template.description,
      tags: template.tags.join(', '),
      isPublic: template.isPublic,
      isPremium: template.isPremium
    });
    setTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage templates, users, and platform settings</p>
          </div>
          <Button 
            onClick={() => setTemplateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Templates</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalTemplates || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalDownloads || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                    <p className="text-2xl font-bold text-gray-900">+{stats?.monthlyGrowth || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Templates</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {templates.slice(0, 5).map((template) => (
                    <div key={template.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{template.name}</p>
                          <p className="text-sm text-gray-600">{template.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={template.isPublic ? "default" : "secondary"}>
                          {template.isPublic ? "Public" : "Private"}
                        </Badge>
                        {template.isPremium && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{template.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{template.category}</Badge>
                      <span className="text-sm text-gray-500">{template.downloads} downloads</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {templatesLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Platform Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Templates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.plan === 'Pro' ? 'default' : 'secondary'}>
                            {user.plan}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.templatesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Template Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Social Media</option>
                    <option>Business Cards</option>
                    <option>Presentations</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Template File Size (MB)
                  </label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="autoApprove" className="rounded" />
                  <label htmlFor="autoApprove" className="text-sm text-gray-700">
                    Auto-approve new templates
                  </label>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter template description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="design, business, modern"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newTemplate.isPublic}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Public Template
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={newTemplate.isPremium}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, isPremium: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isPremium" className="text-sm text-gray-700">
                  Premium Template
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTemplateDialogOpen(false);
                setEditingTemplate(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              disabled={createTemplateMutation.isPending || updateTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending || updateTemplateMutation.isPending ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}