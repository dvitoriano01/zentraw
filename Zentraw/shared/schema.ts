import { pgTable, text, serial, integer, boolean, timestamp, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  artistName: text("artist_name"),
  plan: text("plan").default("free").notNull(), // free, basic, premium
  tokensUsed: integer("tokens_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Artist profiles and bio/release data
export const artistProfiles = pgTable("artist_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  artistName: text("artist_name").notNull(),
  musicalStyle: text("musical_style"),
  mood: text("mood"),
  targetAudience: text("target_audience"),
  tone: text("tone"),
  mainTheme: text("main_theme"),
  collaborations: text("collaborations").array().default([]),
  shortBio: text("short_bio"),
  longBio: text("long_bio"),
  pressRelease: text("press_release"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generated content (covers, videos, etc.)
export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // cover, story, video, visualizer, upload
  title: text("title").notNull(),
  prompt: text("prompt"),
  style: text("style"),
  fileUrl: text("file_url"),
  fileData: text("file_data"), // Base64 encoded image data for permanent storage
  fileType: text("file_type"), // MIME type (image/jpeg, image/png, etc.)
  fileSize: integer("file_size"), // File size in bytes
  format: text("format"), // png, jpg, mp4
  size: text("size"), // 2048x2048, 1080x1920, etc.
  status: text("status").default("completed").notNull(), // pending, completed, failed
  tokensUsed: integer("tokens_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Music charts tracking
export const chartEntries = pgTable("chart_entries", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // billboard, beatport, spotify
  position: integer("position").notNull(),
  trackName: text("track_name").notNull(),
  artistName: text("artist_name").notNull(),
  genre: text("genre"),
  chartDate: timestamp("chart_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Social media posts scheduling
export const scheduledPosts = pgTable("scheduled_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // instagram, tiktok, twitter
  contentId: integer("content_id").references(() => generatedContent.id),
  caption: text("caption"),
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: text("status").default("scheduled").notNull(), // scheduled, posted, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SVG Templates for cover generation
export const svgTemplates = pgTable("svg_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  svgContent: text("svg_content").notNull(),
  isActive: boolean("is_active").default(true),
  fontProperties: json("font_properties").notNull(),
  layoutProperties: json("layout_properties").notNull(),
  filterProperties: json("filter_properties").notNull(),
  renderingFormats: json("rendering_formats").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  artistName: true,
});

export const insertArtistProfileSchema = createInsertSchema(artistProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  createdAt: true,
});

export const insertChartEntrySchema = createInsertSchema(chartEntries).omit({
  id: true,
  createdAt: true,
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({
  id: true,
  createdAt: true,
});

export const insertSvgTemplateSchema = createInsertSchema(svgTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type InsertArtistProfile = z.infer<typeof insertArtistProfileSchema>;

export type GeneratedContent = typeof generatedContent.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;

export type ChartEntry = typeof chartEntries.$inferSelect;
export type InsertChartEntry = z.infer<typeof insertChartEntrySchema>;

export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;

export type SvgTemplate = typeof svgTemplates.$inferSelect;
export type InsertSvgTemplate = z.infer<typeof insertSvgTemplateSchema>;
