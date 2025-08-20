import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  language: text("language").notNull().default("en"), // "en" or "bn"
  overallProgress: integer("overall_progress").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  achievements: jsonb("achievements").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameArabic: text("name_arabic"),
  nameBengali: text("name_bengali"),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  totalLessons: integer("total_lessons").notNull().default(0),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chapterId: varchar("chapter_id").notNull(),
  title: text("title").notNull(),
  titleBengali: text("title_bengali"),
  content: jsonb("content").notNull(), // Lesson content structure
  audioUrls: jsonb("audio_urls").notNull().default({}), // {en: "url", bn: "url"}
  order: integer("order").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  chapterId: varchar("chapter_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  language: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
