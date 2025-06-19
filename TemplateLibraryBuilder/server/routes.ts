import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTemplateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getPublicTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Invalid template data" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const templateData = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, templateData);
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(400).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTemplate(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.get("/api/user/templates", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const templates = await storage.getTemplatesByUser(req.user.id);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching user templates:", error);
      res.status(500).json({ error: "Failed to fetch user templates" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: 'Failed to fetch admin stats' });
    }
  });

  app.get('/api/admin/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching admin templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  app.post('/api/admin/templates', async (req, res) => {
    try {
      const templateData = {
        ...req.body,
        userId: 1,
        width: 800,
        height: 600,
        canvasData: {}
      };
      
      const template = await storage.createTemplate(templateData);
      res.json(template);
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({ message: 'Failed to create template' });
    }
  });

  app.patch('/api/admin/templates/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.updateTemplate(id, req.body);
      res.json(template);
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({ message: 'Failed to update template' });
    }
  });

  app.delete('/api/admin/templates/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTemplate(id);
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ message: 'Failed to delete template' });
    }
  });

  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Public template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getPublicTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ message: 'Failed to fetch template' });
    }
  });

  app.post('/api/templates/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementTemplateDownloads(id);
      res.json({ message: 'Download counted' });
    } catch (error) {
      console.error('Error incrementing download:', error);
      res.status(500).json({ message: 'Failed to count download' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
