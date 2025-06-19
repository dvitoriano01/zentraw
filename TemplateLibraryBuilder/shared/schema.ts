import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  tags: text("tags").array().default([]),
  previewUrl: text("preview_url"),
  thumbnailUrl: text("thumbnail_url"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  canvasData: json("canvas_data").notNull(),
  userId: integer("user_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  isPremium: boolean("is_premium").default(false),
  downloads: integer("downloads").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  templates: many(templates),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(users, {
    fields: [templates.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTemplateSchema = createInsertSchema(templates).pick({
  name: true,
  category: true,
  description: true,
  tags: true,
  previewUrl: true,
  thumbnailUrl: true,
  width: true,
  height: true,
  canvasData: true,
  userId: true,
  isPublic: true,
  isPremium: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
