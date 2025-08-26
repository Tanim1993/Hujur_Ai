import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get all chapters
  app.get("/api/chapters", async (req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  // Get unlocked chapters for user
  app.get("/api/users/:userId/chapters", async (req, res) => {
    try {
      const { userId } = req.params;
      const unlockedChapters = await storage.getUnlockedChapters(userId);
      res.json(unlockedChapters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch unlocked chapters" });
    }
  });

  // Get single chapter
  app.get("/api/chapters/:chapterId", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const chapter = await storage.getChapter(chapterId);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      
      res.json(chapter);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapter" });
    }
  });

  // Get lessons by chapter
  app.get("/api/chapters/:chapterId/lessons", async (req, res) => {
    try {
      const { chapterId } = req.params;
      const lessons = await storage.getLessonsByChapter(chapterId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Get specific lesson
  app.get("/api/lessons/:lessonId", async (req, res) => {
    try {
      const { lessonId } = req.params;
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Get user progress
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Get chapter progress for user
  app.get("/api/users/:userId/chapters/:chapterId/progress", async (req, res) => {
    try {
      const { userId, chapterId } = req.params;
      const progress = await storage.getChapterProgress(userId, chapterId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chapter progress" });
    }
  });

  // Update lesson progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateProgress(progressData);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Get user profile
  app.get("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.patch("/api/users/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const user = await storage.updateUser(userId, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Analytics endpoints
  app.get("/api/users/:userId/analytics", async (req, res) => {
    try {
      const { userId } = req.params;
      const analytics = await storage.getUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/users/:userId/weekly-progress", async (req, res) => {
    try {
      const { userId } = req.params;
      const weeklyProgress = await storage.getWeeklyProgress(userId);
      res.json(weeklyProgress);
    } catch (error) {
      console.error("Weekly progress error:", error);
      res.status(500).json({ message: "Failed to fetch weekly progress" });
    }
  });

  // Learning sessions
  app.post("/api/users/:userId/learning-sessions", async (req, res) => {
    try {
      const { userId } = req.params;
      const sessionData = { ...req.body, userId };
      const session = await storage.createLearningSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Create session error:", error);
      res.status(500).json({ message: "Failed to create learning session" });
    }
  });

  app.patch("/api/learning-sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      const session = await storage.updateLearningSession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Update session error:", error);
      res.status(500).json({ message: "Failed to update learning session" });
    }
  });

  app.get("/api/users/:userId/learning-sessions", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const sessions = await storage.getUserLearningSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({ message: "Failed to fetch learning sessions" });
    }
  });

  // Achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const { userId } = req.params;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Get user achievements error:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/users/:userId/check-achievements", async (req, res) => {
    try {
      const { userId } = req.params;
      const newAchievements = await storage.checkAndUnlockAchievements(userId);
      res.json(newAchievements);
    } catch (error) {
      console.error("Check achievements error:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Streak tracking
  app.post("/api/users/:userId/update-streak", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.updateUserStreak(userId);
      res.json(user);
    } catch (error) {
      console.error("Update streak error:", error);
      res.status(500).json({ message: "Failed to update streak" });
    }
  });

  app.get("/api/users/:userId/streak-history", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const history = await storage.getUserStreakHistory(userId, days);
      res.json(history);
    } catch (error) {
      console.error("Get streak history error:", error);
      res.status(500).json({ message: "Failed to fetch streak history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
