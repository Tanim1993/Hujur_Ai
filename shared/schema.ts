import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  language: text("language").notNull().default("en"), // "en" or "bn"
  overallProgress: integer("overall_progress").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  totalLessonsCompleted: integer("total_lessons_completed").notNull().default(0),
  totalTimeSpentMinutes: integer("total_time_spent_minutes").notNull().default(0),
  achievements: jsonb("achievements").notNull().default([]),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  attempts: integer("attempts").notNull().default(1),
  completedAt: timestamp("completed_at"),
  lastAttemptAt: timestamp("last_attempt_at").defaultNow(),
});

// Learning sessions for detailed analytics
export const learningSessions = pgTable("learning_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id"),
  chapterId: varchar("chapter_id"),
  sessionType: text("session_type").notNull(), // "lesson", "practice", "review"
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  durationMinutes: integer("duration_minutes").default(0),
  activitiesCompleted: integer("activities_completed").default(0),
  score: integer("score").default(0),
  metadata: jsonb("metadata").default({}), // Additional session data
});

// Achievements system
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameArabic: text("name_arabic"),
  nameBengali: text("name_bengali"),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // "progress", "streak", "mastery", "special"
  condition: jsonb("condition").notNull(), // Achievement unlock conditions
  points: integer("points").notNull().default(10),
  isActive: boolean("is_active").notNull().default(true),
});

// User achievements (many-to-many)
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  achievementId: varchar("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0), // For progressive achievements
});

// Daily learning streaks
export const streakHistory = pgTable("streak_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").notNull(),
  lessonsCompleted: integer("lessons_completed").notNull().default(0),
  timeSpentMinutes: integer("time_spent_minutes").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  language: true,
});

export const updateUserSchema = createInsertSchema(users).pick({
  username: true,
  firstName: true,
  lastName: true,
  language: true,
  overallProgress: true,
  streak: true,
  totalLessonsCompleted: true,
  totalTimeSpentMinutes: true,
  achievements: true,
  lastActiveAt: true,
}).partial();

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
  lastAttemptAt: true,
});

export const insertLearningSessionSchema = createInsertSchema(learningSessions).omit({
  id: true,
  startedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertStreakHistorySchema = createInsertSchema(streakHistory).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;
export type LearningSession = typeof learningSessions.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertStreakHistory = z.infer<typeof insertStreakHistorySchema>;
export type StreakHistory = typeof streakHistory.$inferSelect;

// Analytics types
export type UserAnalytics = {
  totalTimeSpent: number;
  totalLessonsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  chaptersCompleted: number;
  averageScore: number;
  recentActivity: LearningSession[];
  achievementsEarned: UserAchievement[];
  weeklyProgress: {
    date: string;
    lessonsCompleted: number;
    timeSpent: number;
  }[];
};
