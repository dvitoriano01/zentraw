import { users, templates, type User, type InsertUser, type Template, type InsertTemplate } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  getTemplatesByUser(userId: number): Promise<Template[]>;
  getPublicTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template>;
  deleteTemplate(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTemplates(): Promise<Template[]> {
    return await db.select().from(templates).orderBy(desc(templates.createdAt));
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template || undefined;
  }

  async getTemplatesByUser(userId: number): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.userId, userId)).orderBy(desc(templates.createdAt));
  }

  async getPublicTemplates(): Promise<Template[]> {
    return await db.select().from(templates).where(eq(templates.isPublic, true)).orderBy(desc(templates.createdAt));
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db
      .insert(templates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template> {
    const [updatedTemplate] = await db
      .update(templates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }

  // Admin-specific methods
  async getAdminStats(): Promise<{
    totalTemplates: number;
    totalUsers: number;
    totalDownloads: number;
    monthlyGrowth: number;
  }> {
    const templatesResult = await db.select().from(templates);
    const usersResult = await db.select().from(users);
    
    const totalDownloads = templatesResult.reduce((sum, template) => sum + (template.downloads || 0), 0);
    
    return {
      totalTemplates: templatesResult.length,
      totalUsers: usersResult.length,
      totalDownloads,
      monthlyGrowth: 15
    };
  }

  async getAllUsers(): Promise<Array<{
    id: number;
    username: string;
    email: string;
    plan: string;
    templatesCount: number;
    joinedAt: string;
  }>> {
    const allUsers = await db.select().from(users);
    
    return Promise.all(allUsers.map(async (user) => {
      const userTemplates = await this.getTemplatesByUser(user.id);
      return {
        id: user.id,
        username: user.username,
        email: `${user.username}@example.com`,
        plan: 'Basic',
        templatesCount: userTemplates.length,
        joinedAt: user.createdAt?.toISOString() || new Date().toISOString()
      };
    }));
  }

  async incrementTemplateDownloads(id: number): Promise<void> {
    const template = await this.getTemplateById(id);
    if (template) {
      await db
        .update(templates)
        .set({ downloads: (template.downloads || 0) + 1 })
        .where(eq(templates.id, id));
    }
  }
}

export const storage = new DatabaseStorage();
