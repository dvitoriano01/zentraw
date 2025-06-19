import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'bio', 'release', 'video', 'cover'
  content: text("content"), // JSON string containing project data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // 'image', 'audio'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artistName: text("artist_name").notNull(),
  songTitle: text("song_title").notNull(),
  videoUrl: text("video_url").notNull(),
  imageFileId: integer("image_file_id"),
  audioFileId: integer("audio_file_id"),
  duration: integer("duration").default(15),
  quality: text("quality").default("720p"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const biographies = pgTable("biographies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artistName: text("artist_name").notNull(),
  genre: text("genre").notNull(),
  achievements: text("achievements"),
  influences: text("influences"),
  tone: text("tone").notNull(),
  audience: text("audience").notNull(),
  shortBio: text("short_bio"),
  fullBio: text("full_bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pressReleases = pgTable("press_releases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  artistName: text("artist_name").notNull(),
  songTitle: text("song_title").notNull(),
  musicStyle: text("music_style"),
  mood: text("mood"),
  releaseDate: text("release_date"),
  collaborators: text("collaborators"),
  themeMessage: text("theme_message"),
  shortRelease: text("short_release"),
  fullRelease: text("full_release"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customFonts = pgTable("custom_fonts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  category: text("category").notNull().default("Custom"),
  base64: text("base64").notNull(),
  ext: text("ext").notNull().default("woff2"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertBiographySchema = createInsertSchema(biographies).omit({
  id: true,
  createdAt: true,
  shortBio: true,
  fullBio: true,
});

export const insertPressReleaseSchema = createInsertSchema(pressReleases).omit({
  id: true,
  createdAt: true,
  shortRelease: true,
  fullRelease: true,
});

export const insertCustomFontSchema = createInsertSchema(customFonts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Biography = typeof biographies.$inferSelect;
export type InsertBiography = z.infer<typeof insertBiographySchema>;

export type PressRelease = typeof pressReleases.$inferSelect;
export type InsertPressRelease = z.infer<typeof insertPressReleaseSchema>;

export type CustomFont = typeof customFonts.$inferSelect;
export type InsertCustomFont = z.infer<typeof insertCustomFontSchema>;
