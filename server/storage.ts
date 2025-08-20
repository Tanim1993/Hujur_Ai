import { 
  type User, 
  type InsertUser, 
  type Chapter, 
  type InsertChapter,
  type Lesson, 
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Chapter methods
  getAllChapters(): Promise<Chapter[]>;
  getChapter(id: string): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;

  // Lesson methods
  getLessonsByChapter(chapterId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getChapterProgress(userId: string, chapterId: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chapters: Map<string, Chapter>;
  private lessons: Map<string, Lesson>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.chapters = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample chapters
    const quranChapter: Chapter = {
      id: "quran-chapter",
      name: "Quran",
      nameArabic: "القرآن",
      nameBengali: "কুরআন",
      description: "Learn to read and understand the Holy Quran",
      icon: "book-quran",
      color: "islamic-green",
      totalLessons: 12,
      order: 1,
    };

    const salahChapter: Chapter = {
      id: "salah-chapter",
      name: "Salah",
      nameArabic: "الصلاة",
      nameBengali: "সালাত",
      description: "Learn the proper way to perform prayer",
      icon: "pray",
      color: "warm-sand",
      totalLessons: 10,
      order: 2,
    };

    const duaChapter: Chapter = {
      id: "dua-chapter",
      name: "Dua",
      nameArabic: "الدعاء",
      nameBengali: "দোয়া",
      description: "Learn essential daily prayers and supplications",
      icon: "hands-praying",
      color: "golden-yellow",
      totalLessons: 8,
      order: 3,
    };

    this.chapters.set(quranChapter.id, quranChapter);
    this.chapters.set(salahChapter.id, salahChapter);
    this.chapters.set(duaChapter.id, duaChapter);

    // Initialize sample lessons
    const quranLessons: Lesson[] = [
      {
        id: "quran-lesson-1",
        chapterId: "quran-chapter",
        title: "Arabic Letters - Alif",
        titleBengali: "আরবি অক্ষর - আলিফ",
        content: {
          letter: "ا",
          transliteration: "Alif",
          explanation: "Alif is the first letter of the Arabic alphabet",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت"],
            correct: "ا"
          }
        },
        audioUrls: {},
        order: 1,
        difficulty: "beginner"
      },
      {
        id: "quran-lesson-2",
        chapterId: "quran-chapter",
        title: "Arabic Letters - Baa",
        titleBengali: "আরবি অক্ষর - বা",
        content: {
          letter: "ب",
          transliteration: "Baa",
          explanation: "Baa is the second letter of the Arabic alphabet",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت"],
            correct: "ب"
          }
        },
        audioUrls: {},
        order: 2,
        difficulty: "beginner"
      }
    ];

    const salahLessons: Lesson[] = [
      {
        id: "salah-lesson-1",
        chapterId: "salah-chapter",
        title: "Wudu Steps",
        titleBengali: "ওযুর ধাপসমূহ",
        content: {
          steps: [
            "Intention (Niyyah)",
            "Wash hands three times",
            "Rinse mouth three times",
            "Clean nose three times",
            "Wash face three times",
            "Wash arms up to elbows",
            "Wipe head",
            "Wash feet up to ankles"
          ],
          interactive: {
            type: "step-ordering",
            question: "Arrange the Wudu steps in correct order"
          }
        },
        audioUrls: {},
        order: 1,
        difficulty: "beginner"
      }
    ];

    const duaLessons: Lesson[] = [
      {
        id: "dua-lesson-1",
        chapterId: "dua-chapter",
        title: "Morning Dua",
        titleBengali: "সকালের দোয়া",
        content: {
          arabic: "اللَّهُمَّ أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
          transliteration: "Allahumma asbahna wa asbahal-mulku lillah",
          meaning: "O Allah, we have reached the morning and with it all dominion belongs to Allah",
          bengaliMeaning: "হে আল্লাহ, আমরা সকালে পৌঁছেছি এবং সমস্ত রাজত্ব আল্লাহরই",
          interactive: {
            type: "recitation-practice",
            question: "Can you recite this dua?"
          }
        },
        audioUrls: {},
        order: 1,
        difficulty: "beginner"
      }
    ];

    quranLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    salahLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    duaLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Create a default user
    const defaultUser: User = {
      id: "default-user",
      username: "student",
      language: "en",
      overallProgress: 25,
      streak: 7,
      achievements: ["first-lesson", "seven-day-streak", "perfect-score"],
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      overallProgress: 0, 
      streak: 0, 
      achievements: [] 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Chapter methods
  async getAllChapters(): Promise<Chapter[]> {
    return Array.from(this.chapters.values()).sort((a, b) => a.order - b.order);
  }

  async getChapter(id: string): Promise<Chapter | undefined> {
    return this.chapters.get(id);
  }

  async createChapter(insertChapter: InsertChapter): Promise<Chapter> {
    const id = randomUUID();
    const chapter: Chapter = { ...insertChapter, id };
    this.chapters.set(id, chapter);
    return chapter;
  }

  // Lesson methods
  async getLessonsByChapter(chapterId: string): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { ...insertLesson, id };
    this.lessons.set(id, lesson);
    return lesson;
  }

  // Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async getChapterProgress(userId: string, chapterId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId && progress.chapterId === chapterId);
  }

  async updateProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const existingKey = `${progressData.userId}-${progressData.lessonId}`;
    const existing = Array.from(this.userProgress.values())
      .find(p => p.userId === progressData.userId && p.lessonId === progressData.lessonId);

    if (existing) {
      const updated: UserProgress = {
        ...existing,
        ...progressData,
        completedAt: progressData.completed ? new Date() : existing.completedAt
      };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newProgress: UserProgress = {
        ...progressData,
        id,
        completedAt: progressData.completed ? new Date() : null
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  async getProgressByLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values())
      .find(progress => progress.userId === userId && progress.lessonId === lessonId);
  }
}

export const storage = new MemStorage();
