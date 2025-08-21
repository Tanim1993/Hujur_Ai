import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
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

  const httpServer = createServer(app);
  return httpServer;
}
