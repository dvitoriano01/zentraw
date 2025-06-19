import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { 
  users, 
  projects, 
  mediaFiles, 
  videos, 
  biographies, 
  pressReleases,
  customFonts,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type MediaFile,
  type InsertMediaFile,
  type Video,
  type InsertVideo,
  type Biography,
  type InsertBiography,
  type PressRelease,
  type InsertPressRelease,
  type CustomFont,
  type InsertCustomFont
} from "@shared/schema";

// Database connection (only if valid URL provided)
let db: any = null;
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql://')) {
  try {
    const client = postgres(process.env.DATABASE_URL);
    db = drizzle(client);
  } catch (error) {
    console.warn('Invalid database URL, falling back to memory storage');
  }
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Projects
  getProjects(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;

  // Media Files
  getMediaFiles(userId: number): Promise<MediaFile[]>;
  createMediaFile(mediaFile: InsertMediaFile): Promise<MediaFile>;
  getMediaFile(id: number): Promise<MediaFile | undefined>;
  deleteMediaFile(id: number): Promise<void>;

  // Videos
  getVideos(userId: number): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: number): Promise<Video | undefined>;

  // Biographies
  getBiographies(userId: number): Promise<Biography[]>;
  createBiography(biography: InsertBiography): Promise<Biography>;
  getBiography(id: number): Promise<Biography | undefined>;

  // Press Releases
  getPressReleases(userId: number): Promise<PressRelease[]>;
  createPressRelease(pressRelease: InsertPressRelease): Promise<PressRelease>;
  getPressRelease(id: number): Promise<PressRelease | undefined>;

  // Custom Fonts
  getCustomFonts(userId: number): Promise<CustomFont[]>;
  getAllCustomFonts(): Promise<CustomFont[]>;
  createCustomFont(customFont: InsertCustomFont): Promise<CustomFont>;
  getCustomFont(id: number): Promise<CustomFont | undefined>;
  deleteCustomFont(id: number): Promise<void>;

  // Stats
  getUserStats(userId: number): Promise<{
    bios: number;
    releases: number;
    videos: number;
    downloads: number;
  }>;

  // Delete operations
  deleteProject(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private mediaFiles: Map<number, MediaFile>;
  private videos: Map<number, Video>;
  private biographies: Map<number, Biography>;
  private pressReleases: Map<number, PressRelease>;
  private customFonts: Map<number, CustomFont>;
  private currentUserId: number;
  private currentProjectId: number;
  private currentMediaFileId: number;
  private currentVideoId: number;
  private currentBiographyId: number;
  private currentPressReleaseId: number;
  private currentCustomFontId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.mediaFiles = new Map();
    this.videos = new Map();
    this.biographies = new Map();
    this.pressReleases = new Map();
    this.customFonts = new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
    this.currentMediaFileId = 1;
    this.currentVideoId = 1;
    this.currentBiographyId = 1;
    this.currentPressReleaseId = 1;
    this.currentCustomFontId = 1;

    // Create default user
    this.users.set(1, {
      id: 1,
      username: "alex.rodriguez",
      password: "hashed_password"
    });
    this.currentUserId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = { 
      ...insertProject, 
      id,
      content: insertProject.content || null,
      createdAt: new Date()
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  async getMediaFiles(userId: number): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values())
      .filter(file => file.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const id = this.currentMediaFileId++;
    const mediaFile: MediaFile = { 
      ...insertMediaFile, 
      id,
      createdAt: new Date()
    };
    this.mediaFiles.set(id, mediaFile);
    return mediaFile;
  }

  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    return this.mediaFiles.get(id);
  }

  async deleteMediaFile(id: number): Promise<void> {
    this.mediaFiles.delete(id);
  }

  async getVideos(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values())
      .filter(video => video.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = { 
      ...insertVideo, 
      id,
      imageFileId: insertVideo.imageFileId || null,
      audioFileId: insertVideo.audioFileId || null,
      duration: insertVideo.duration || null,
      quality: insertVideo.quality || null,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getBiographies(userId: number): Promise<Biography[]> {
    return Array.from(this.biographies.values())
      .filter(bio => bio.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createBiography(insertBiography: InsertBiography): Promise<Biography> {
    const id = this.currentBiographyId++;
    const biography: Biography = { 
      ...insertBiography, 
      id,
      achievements: insertBiography.achievements || null,
      influences: insertBiography.influences || null,
      shortBio: null,
      fullBio: null,
      createdAt: new Date()
    };
    this.biographies.set(id, biography);
    return biography;
  }

  async getBiography(id: number): Promise<Biography | undefined> {
    return this.biographies.get(id);
  }

  async getPressReleases(userId: number): Promise<PressRelease[]> {
    return Array.from(this.pressReleases.values())
      .filter(release => release.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPressRelease(insertPressRelease: InsertPressRelease): Promise<PressRelease> {
    const id = this.currentPressReleaseId++;
    const pressRelease: PressRelease = { 
      ...insertPressRelease, 
      id,
      musicStyle: insertPressRelease.musicStyle || null,
      mood: insertPressRelease.mood || null,
      releaseDate: insertPressRelease.releaseDate || null,
      collaborators: insertPressRelease.collaborators || null,
      themeMessage: insertPressRelease.themeMessage || null,
      shortRelease: null,
      fullRelease: null,
      createdAt: new Date()
    };
    this.pressReleases.set(id, pressRelease);
    return pressRelease;
  }

  async getPressRelease(id: number): Promise<PressRelease | undefined> {
    return this.pressReleases.get(id);
  }

  async getCustomFonts(userId: number): Promise<CustomFont[]> {
    return Array.from(this.customFonts.values()).filter(f => f.userId === userId);
  }

  async getAllCustomFonts(): Promise<CustomFont[]> {
    return Array.from(this.customFonts.values());
  }

  async createCustomFont(insertCustomFont: InsertCustomFont): Promise<CustomFont> {
    const id = this.currentCustomFontId++;
    const customFont: CustomFont = { 
      ...insertCustomFont, 
      id,
      category: insertCustomFont.category || 'Custom',
      ext: insertCustomFont.ext || 'woff2',
      createdAt: new Date()
    };
    this.customFonts.set(id, customFont);
    return customFont;
  }

  async getCustomFont(id: number): Promise<CustomFont | undefined> {
    return this.customFonts.get(id);
  }

  async deleteCustomFont(id: number): Promise<void> {
    this.customFonts.delete(id);
  }

  async getUserStats(userId: number): Promise<{
    bios: number;
    releases: number;
    videos: number;
    downloads: number;
  }> {
    const bios = Array.from(this.biographies.values()).filter(b => b.userId === userId).length;
    const releases = Array.from(this.pressReleases.values()).filter(r => r.userId === userId).length;
    const videos = Array.from(this.videos.values()).filter(v => v.userId === userId).length;
    const downloads = Math.floor(Math.random() * 200) + 100; // Simulated download count

    return { bios, releases, videos, downloads };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getProjects(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getMediaFiles(userId: number): Promise<MediaFile[]> {
    return await db.select().from(mediaFiles).where(eq(mediaFiles.userId, userId));
  }

  async createMediaFile(insertMediaFile: InsertMediaFile): Promise<MediaFile> {
    const result = await db.insert(mediaFiles).values(insertMediaFile).returning();
    return result[0];
  }

  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    const result = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id)).limit(1);
    return result[0];
  }

  async deleteMediaFile(id: number): Promise<void> {
    await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
  }

  async getVideos(userId: number): Promise<Video[]> {
    return await db.select().from(videos).where(eq(videos.userId, userId));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(insertVideo).returning();
    return result[0];
  }

  async getVideo(id: number): Promise<Video | undefined> {
    const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
    return result[0];
  }

  async getBiographies(userId: number): Promise<Biography[]> {
    return await db.select().from(biographies).where(eq(biographies.userId, userId));
  }

  async createBiography(insertBiography: InsertBiography): Promise<Biography> {
    const result = await db.insert(biographies).values(insertBiography).returning();
    return result[0];
  }

  async getBiography(id: number): Promise<Biography | undefined> {
    const result = await db.select().from(biographies).where(eq(biographies.id, id)).limit(1);
    return result[0];
  }

  async getPressReleases(userId: number): Promise<PressRelease[]> {
    return await db.select().from(pressReleases).where(eq(pressReleases.userId, userId));
  }

  async createPressRelease(insertPressRelease: InsertPressRelease): Promise<PressRelease> {
    const result = await db.insert(pressReleases).values(insertPressRelease).returning();
    return result[0];
  }

  async getPressRelease(id: number): Promise<PressRelease | undefined> {
    const result = await db.select().from(pressReleases).where(eq(pressReleases.id, id)).limit(1);
    return result[0];
  }

  async getUserStats(userId: number): Promise<{
    bios: number;
    releases: number;
    videos: number;
    downloads: number;
  }> {
    const bios = await db.select().from(biographies).where(eq(biographies.userId, userId));
    const releases = await db.select().from(pressReleases).where(eq(pressReleases.userId, userId));
    const videoList = await db.select().from(videos).where(eq(videos.userId, userId));
    
    return {
      bios: bios.length,
      releases: releases.length,
      videos: videoList.length,
      downloads: Math.floor(Math.random() * 300) + 100, // Simulated for demo
    };
  }

  async getCustomFonts(userId: number): Promise<CustomFont[]> {
    if (!db) return [];
    return await db.select().from(customFonts).where(eq(customFonts.userId, userId));
  }

  async getAllCustomFonts(): Promise<CustomFont[]> {
    if (!db) return [];
    return await db.select().from(customFonts);
  }

  async createCustomFont(insertCustomFont: InsertCustomFont): Promise<CustomFont> {
    if (!db) throw new Error('Database not connected');
    const [result] = await db.insert(customFonts).values(insertCustomFont).returning();
    return result;
  }

  async getCustomFont(id: number): Promise<CustomFont | undefined> {
    if (!db) return undefined;
    const [result] = await db.select().from(customFonts).where(eq(customFonts.id, id));
    return result;
  }

  async deleteCustomFont(id: number): Promise<void> {
    if (!db) return;
    await db.delete(customFonts).where(eq(customFonts.id, id));
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }
}

// Use database storage if valid DATABASE_URL is available, otherwise use memory storage
export const storage = (db && process.env.DATABASE_URL?.startsWith('postgresql://')) ? new DatabaseStorage() : new MemStorage();
