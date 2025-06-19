import { 
  User, 
  InsertUser, 
  ArtistProfile, 
  InsertArtistProfile, 
  GeneratedContent, 
  InsertGeneratedContent, 
  ChartEntry, 
  InsertChartEntry, 
  ScheduledPost, 
  InsertScheduledPost,
  SvgTemplate,
  InsertSvgTemplate,
  users,
  artistProfiles,
  generatedContent,
  chartEntries,
  scheduledPosts,
  svgTemplates
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Artist profiles
  getArtistProfile(userId: number): Promise<ArtistProfile | undefined>;
  createArtistProfile(profile: InsertArtistProfile): Promise<ArtistProfile>;
  updateArtistProfile(userId: number, profile: Partial<ArtistProfile>): Promise<ArtistProfile | undefined>;
  
  // Generated content
  getGeneratedContent(userId: number): Promise<GeneratedContent[]>;
  getGeneratedContentById(id: number): Promise<GeneratedContent | undefined>;
  createGeneratedContent(content: InsertGeneratedContent): Promise<GeneratedContent>;
  updateGeneratedContent(id: number, content: Partial<GeneratedContent>): Promise<GeneratedContent | undefined>;
  
  // Chart entries
  getChartEntries(platform?: string): Promise<ChartEntry[]>;
  createChartEntry(entry: InsertChartEntry): Promise<ChartEntry>;
  
  // Scheduled posts
  getScheduledPosts(userId: number): Promise<ScheduledPost[]>;
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(id: number, post: Partial<ScheduledPost>): Promise<ScheduledPost | undefined>;
  
  // SVG Templates
  getSvgTemplates(): Promise<SvgTemplate[]>;
  getSvgTemplateById(id: number): Promise<SvgTemplate | undefined>;
  createSvgTemplate(template: InsertSvgTemplate): Promise<SvgTemplate>;
  updateSvgTemplate(id: number, template: Partial<SvgTemplate>): Promise<SvgTemplate | undefined>;
  deleteSvgTemplate(id: number): Promise<boolean>;
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

  async updateUser(id: number, userUpdate: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getArtistProfile(userId: number): Promise<ArtistProfile | undefined> {
    const [profile] = await db.select().from(artistProfiles).where(eq(artistProfiles.userId, userId));
    return profile || undefined;
  }

  async createArtistProfile(insertProfile: InsertArtistProfile): Promise<ArtistProfile> {
    const [profile] = await db
      .insert(artistProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateArtistProfile(userId: number, profileUpdate: Partial<ArtistProfile>): Promise<ArtistProfile | undefined> {
    const [profile] = await db
      .update(artistProfiles)
      .set({ ...profileUpdate, updatedAt: new Date() })
      .where(eq(artistProfiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  async getGeneratedContent(userId: number): Promise<GeneratedContent[]> {
    const content = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.userId, userId));
    return content;
  }

  async getGeneratedContentById(id: number): Promise<GeneratedContent | undefined> {
    const [content] = await db.select().from(generatedContent).where(eq(generatedContent.id, id));
    return content || undefined;
  }

  async createGeneratedContent(insertContent: InsertGeneratedContent): Promise<GeneratedContent> {
    const [content] = await db
      .insert(generatedContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async updateGeneratedContent(id: number, contentUpdate: Partial<GeneratedContent>): Promise<GeneratedContent | undefined> {
    const [content] = await db
      .update(generatedContent)
      .set(contentUpdate)
      .where(eq(generatedContent.id, id))
      .returning();
    return content || undefined;
  }

  async getChartEntries(platform?: string): Promise<ChartEntry[]> {
    if (platform) {
      const entries = await db
        .select()
        .from(chartEntries)
        .where(eq(chartEntries.platform, platform));
      return entries;
    }
    
    const entries = await db.select().from(chartEntries);
    return entries;
  }

  async createChartEntry(insertEntry: InsertChartEntry): Promise<ChartEntry> {
    const [entry] = await db
      .insert(chartEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async getScheduledPosts(userId: number): Promise<ScheduledPost[]> {
    const posts = await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.userId, userId))
      .orderBy(scheduledPosts.scheduledFor);
    return posts;
  }

  async createScheduledPost(insertPost: InsertScheduledPost): Promise<ScheduledPost> {
    const [post] = await db
      .insert(scheduledPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateScheduledPost(id: number, postUpdate: Partial<ScheduledPost>): Promise<ScheduledPost | undefined> {
    const [post] = await db
      .update(scheduledPosts)
      .set(postUpdate)
      .where(eq(scheduledPosts.id, id))
      .returning();
    return post || undefined;
  }

  // SVG Templates implementation
  async getSvgTemplates(): Promise<SvgTemplate[]> {
    return db.select().from(svgTemplates);
  }

  async getSvgTemplateById(id: number): Promise<SvgTemplate | undefined> {
    const [template] = await db.select().from(svgTemplates).where(eq(svgTemplates.id, id));
    return template;
  }

  async createSvgTemplate(insertTemplate: InsertSvgTemplate): Promise<SvgTemplate> {
    const [template] = await db
      .insert(svgTemplates)
      .values(insertTemplate)
      .returning();
    return template;
  }

  async updateSvgTemplate(id: number, templateUpdate: Partial<SvgTemplate>): Promise<SvgTemplate | undefined> {
    // Remove updatedAt from the update object to avoid timestamp issues
    const { updatedAt, createdAt, ...updateData } = templateUpdate as any;
    const [template] = await db
      .update(svgTemplates)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(svgTemplates.id, id))
      .returning();
    return template;
  }

  async deleteSvgTemplate(id: number): Promise<boolean> {
    const result = await db.delete(svgTemplates).where(eq(svgTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();