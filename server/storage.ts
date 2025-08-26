import { 
  type User, 
  type InsertUser,
  type UpdateUser,
  type UpsertUser,
  type Chapter, 
  type InsertChapter,
  type Lesson, 
  type InsertLesson,
  type UserProgress,
  type InsertUserProgress,
  type LearningSession,
  type InsertLearningSession,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type StreakHistory,
  type InsertStreakHistory,
  type UserAnalytics
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

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
  
  // Chapter unlock methods
  getUnlockedChapters(userId: string): Promise<Chapter[]>;

  // Learning Sessions
  createLearningSession(session: InsertLearningSession): Promise<LearningSession>;
  updateLearningSession(sessionId: string, updates: Partial<LearningSession>): Promise<LearningSession | undefined>;
  getUserLearningSessions(userId: string, limit?: number): Promise<LearningSession[]>;

  // Achievements
  getAllAchievements(): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;

  // Streak tracking
  updateStreakHistory(userId: string, data: InsertStreakHistory): Promise<StreakHistory>;
  getUserStreakHistory(userId: string, days?: number): Promise<StreakHistory[]>;
  updateUserStreak(userId: string): Promise<User | undefined>;

  // Analytics
  getUserAnalytics(userId: string): Promise<UserAnalytics>;
  getWeeklyProgress(userId: string): Promise<{ date: string; lessonsCompleted: number; timeSpent: number }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chapters: Map<string, Chapter>;
  private lessons: Map<string, Lesson>;
  private userProgress: Map<string, UserProgress>;
  private learningSessions: Map<string, LearningSession>;
  private achievements: Map<string, Achievement>;
  private userAchievements: Map<string, UserAchievement>;
  private streakHistory: Map<string, StreakHistory>;

  constructor() {
    this.users = new Map();
    this.chapters = new Map();
    this.lessons = new Map();
    this.userProgress = new Map();
    this.learningSessions = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.streakHistory = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample chapters
    const nooraniChapter: Chapter = {
      id: "noorani-qaida-chapter",
      name: "Noorani Qaida",
      nameArabic: "نوراني قاعدة",
      nameBengali: "নূরানি কায়েদা",
      description: "Master Arabic fundamentals with traditional Noorani Qaida methodology",
      icon: "book-open",
      color: "islamic-green",
      totalLessons: 5,
      order: 1,
    };

    const amparaChapter: Chapter = {
      id: "ampara-chapter",
      name: "Ampara (30 Para)",
      nameArabic: "الأمبارة (٣٠ بارة)",
      nameBengali: "আম্পারা (৩০ পারা)",
      description: "Learn Quran reading through the 30 traditional sections",
      icon: "book-open-check",
      color: "islamic-green",
      totalLessons: 30,
      order: 2,
    };

    const quranChapter: Chapter = {
      id: "quran-chapter",
      name: "Quran",
      nameArabic: "القرآن",
      nameBengali: "কুরআন",
      description: "Learn to read and understand the Holy Quran",
      icon: "book-quran",
      color: "islamic-green",
      totalLessons: 5,
      order: 3,
    };

    const numbersChapter: Chapter = {
      id: "numbers-chapter",
      name: "Arabic Numbers",
      nameArabic: "الأرقام العربية",
      nameBengali: "আরবি সংখ্যা",
      description: "Learn Arabic numerals from 1 to 10",
      icon: "123",
      color: "blue-500",
      totalLessons: 10,
      order: 4,
    };

    const greetingsChapter: Chapter = {
      id: "greetings-chapter",
      name: "Islamic Greetings",
      nameArabic: "التحيات الإسلامية",
      nameBengali: "ইসলামিক শুভেচ্ছা",
      description: "Learn common Islamic greetings and their responses",
      icon: "hand-heart",
      color: "purple-500",
      totalLessons: 5,
      order: 5,
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
      order: 6,
    };

    const nooraniQaidaV2Chapter: Chapter = {
      id: "noorani-qaida-v2-chapter",
      name: "Noorani Qaida Version 2",
      nameArabic: "نوراني قاعدة الإصدار الثاني",
      nameBengali: "নূরানি কায়েদা সংস্করণ ২",
      description: "Comprehensive Duolingo-style Arabic learning with AI feedback and interactive lessons",
      icon: "graduation-cap",
      color: "emerald-600",
      totalLessons: 20,
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
      order: 7,
    };

    this.chapters.set(nooraniChapter.id, nooraniChapter);
    this.chapters.set(nooraniQaidaV2Chapter.id, nooraniQaidaV2Chapter);
    this.chapters.set(amparaChapter.id, amparaChapter);
    this.chapters.set(quranChapter.id, quranChapter);
    this.chapters.set(numbersChapter.id, numbersChapter);
    this.chapters.set(greetingsChapter.id, greetingsChapter);
    this.chapters.set(salahChapter.id, salahChapter);
    this.chapters.set(duaChapter.id, duaChapter);

    // Initialize sample lessons
    // Noorani Qaida lessons - foundational Arabic learning
    const nooraniLessons: Lesson[] = [
      {
        id: "noorani-lesson-1",
        chapterId: "noorani-qaida-chapter",
        title: "Arabic Alphabet - Part 1 (Alif, Ba, Ta)",
        titleBengali: "আরবি বর্ণমালা - ১ম অংশ (আলিফ, বা, তা)",
        content: {
          lesson_type: "noorani",
          letters: ["ا", "ب", "ت"],
          transliterations: ["Alif", "Ba", "Ta"],
          explanation: "Learn the first three letters of the Arabic alphabet with proper pronunciation",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت", "ث"],
            correct: "ا",
            question: "Identify the letter Alif"
          }
        },
        audioUrls: {
          en: "/audio/noorani-1-english.mp3",
          bn: "/audio/noorani-1-bengali.mp3"
        },
        order: 1,
        difficulty: "beginner"
      },
      {
        id: "noorani-lesson-2",
        chapterId: "noorani-qaida-chapter",
        title: "Arabic Alphabet - Part 2 (Tha, Jeem, Haa)",
        titleBengali: "আরবি বর্ণমালা - ২য় অংশ (সা, জিম, হা)",
        content: {
          lesson_type: "noorani",
          letters: ["ث", "ج", "ح"],
          transliterations: ["Tha", "Jeem", "Haa"],
          explanation: "Continue learning Arabic letters with Tha, Jeem, and Haa",
          interactive: {
            type: "pronunciation-practice",
            question: "Practice pronouncing these letters correctly"
          }
        },
        audioUrls: {
          en: "/audio/noorani-2-english.mp3",
          bn: "/audio/noorani-2-bengali.mp3"
        },
        order: 2,
        difficulty: "beginner"
      },
      {
        id: "noorani-lesson-3",
        chapterId: "noorani-qaida-chapter",
        title: "Short Vowels (Harakat)",
        titleBengali: "হ্রস্ব স্বরধ্বনি (হারাকাত)",
        content: {
          lesson_type: "noorani",
          vowels: ["َ", "ِ", "ُ"],
          vowel_names: ["Fatha", "Kasra", "Damma"],
          explanation: "Learn Fatha, Kasra, and Damma - the three short vowels in Arabic",
          interactive: {
            type: "vowel-recognition",
            question: "Match the correct vowel sound"
          }
        },
        audioUrls: {
          en: "/audio/noorani-3-english.mp3",
          bn: "/audio/noorani-3-bengali.mp3"
        },
        order: 3,
        difficulty: "beginner"
      },
      {
        id: "noorani-lesson-4",
        chapterId: "noorani-qaida-chapter",
        title: "Sukoon and Tanween",
        titleBengali: "সুকূন এবং তানবীন",
        content: {
          lesson_type: "noorani",
          marks: ["ْ", "ً", "ٍ", "ٌ"],
          mark_names: ["Sukoon", "Tanween Fath", "Tanween Kasr", "Tanween Dham"],
          explanation: "Learn about Sukoon (no vowel) and Tanween (double short vowels)",
          interactive: {
            type: "mark-identification",
            question: "Identify the Sukoon mark"
          }
        },
        audioUrls: {
          en: "/audio/noorani-4-english.mp3",
          bn: "/audio/noorani-4-bengali.mp3"
        },
        order: 4,
        difficulty: "intermediate"
      },
      {
        id: "noorani-lesson-5",
        chapterId: "noorani-qaida-chapter",
        title: "Connecting Letters",
        titleBengali: "অক্ষর সংযোগ",
        content: {
          lesson_type: "noorani",
          combinations: ["بت", "جب", "حم"],
          explanation: "Learn how Arabic letters connect to form words",
          interactive: {
            type: "letter-combination",
            question: "Connect the letters to form words"
          }
        },
        audioUrls: {
          en: "/audio/noorani-5-english.mp3",
          bn: "/audio/noorani-5-bengali.mp3"
        },
        order: 5,
        difficulty: "intermediate"
      }
    ];

    const quranLessons: Lesson[] = [
      {
        id: "quran-lesson-1",
        chapterId: "quran-chapter",
        title: "Arabic Letters - Alif",
        titleBengali: "আরবি অক্ষর - আলিফ",
        content: {
          letter: "ا",
          transliteration: "Alif",
          explanation: "Alif is the first letter of the Arabic alphabet. It makes a long 'aa' sound.",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت"],
            correct: "ا",
            question: "Can you find the letter Alif?"
          }
        },
        audioUrls: {
          en: "/audio/alif-english.mp3",
          bn: "/audio/alif-bengali.mp3"
        },
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
          explanation: "Baa is the second letter of the Arabic alphabet. It sounds like the English letter 'B'.",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت"],
            correct: "ب",
            question: "Which one is the letter Baa?"
          }
        },
        audioUrls: {
          en: "/audio/baa-english.mp3",
          bn: "/audio/baa-bengali.mp3"
        },
        order: 2,
        difficulty: "beginner"
      },
      {
        id: "quran-lesson-3",
        chapterId: "quran-chapter",
        title: "Arabic Letters - Taa",
        titleBengali: "আরবি অক্ষর - তা",
        content: {
          letter: "ت",
          transliteration: "Taa",
          explanation: "Taa is the third letter of the Arabic alphabet. It sounds like the English letter 'T'.",
          interactive: {
            type: "letter-recognition",
            options: ["ا", "ب", "ت"],
            correct: "ت",
            question: "Can you identify the letter Taa?"
          }
        },
        audioUrls: {
          en: "/audio/taa-english.mp3",
          bn: "/audio/taa-bengali.mp3"
        },
        order: 3,
        difficulty: "beginner"
      },
      {
        id: "quran-lesson-4",
        chapterId: "quran-chapter",
        title: "First Word - Allah",
        titleBengali: "প্রথম শব্দ - আল্লাহ",
        content: {
          arabic: "الله",
          transliteration: "Allah",
          meaning: "Allah - The One and Only God",
          bengaliMeaning: "আল্লাহ - একমাত্র সৃষ্টিকর্তা",
          explanation: "Allah is the Arabic word for God. It is the most important word in Islam.",
          interactive: {
            type: "recitation-practice",
            question: "Practice saying 'Allah' with proper pronunciation"
          }
        },
        audioUrls: {
          en: "/audio/allah-english.mp3",
          bn: "/audio/allah-bengali.mp3"
        },
        order: 4,
        difficulty: "beginner"
      },
      {
        id: "quran-lesson-5",
        chapterId: "quran-chapter",
        title: "Bismillah",
        titleBengali: "বিসমিল্লাহ",
        content: {
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Bismillahir-Rahmanir-Raheem",
          meaning: "In the name of Allah, the Most Gracious, the Most Merciful",
          bengaliMeaning: "পরম করুণাময় ও দয়ালু আল্লাহর নামে",
          explanation: "This is how we begin everything we do. It reminds us that Allah is with us.",
          interactive: {
            type: "recitation-practice",
            question: "Can you recite Bismillah?"
          }
        },
        audioUrls: {
          en: "/audio/bismillah-english.mp3",
          bn: "/audio/bismillah-bengali.mp3"
        },
        order: 5,
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

    const numbersLessons: Lesson[] = [
      {
        id: "numbers-lesson-1",
        chapterId: "numbers-chapter",
        title: "Number One - Wahid",
        titleBengali: "সংখ্যা এক - ওয়াহিদ",
        content: {
          arabic: "١",
          transliteration: "Wahid",
          meaning: "One",
          bengaliMeaning: "এক",
          explanation: "This is the Arabic numeral for one. In Islam, it represents the Oneness of Allah.",
          interactive: {
            type: "number-recognition",
            options: ["١", "٢", "٣"],
            correct: "١",
            question: "Can you find the Arabic number for one?"
          }
        },
        audioUrls: {},
        order: 1,
        difficulty: "beginner"
      },
      {
        id: "numbers-lesson-2",
        chapterId: "numbers-chapter",
        title: "Number Two - Ithnan",
        titleBengali: "সংখ্যা দুই - ইছনান",
        content: {
          arabic: "٢",
          transliteration: "Ithnan",
          meaning: "Two",
          bengaliMeaning: "দুই",
          explanation: "This is the Arabic numeral for two.",
          interactive: {
            type: "number-recognition",
            options: ["١", "٢", "٣"],
            correct: "٢",
            question: "Which one shows the number two?"
          }
        },
        audioUrls: {},
        order: 2,
        difficulty: "beginner"
      }
    ];

    const greetingsLessons: Lesson[] = [
      {
        id: "greetings-lesson-1",
        chapterId: "greetings-chapter",
        title: "As-Salamu Alaikum",
        titleBengali: "আস-সালামু আলাইকুম",
        content: {
          arabic: "السَّلَامُ عَلَيْكُمْ",
          transliteration: "As-Salamu Alaikum",
          meaning: "Peace be upon you",
          bengaliMeaning: "আপনার উপর শান্তি বর্ষিত হোক",
          explanation: "This is the Islamic greeting. We say this when we meet other Muslims.",
          interactive: {
            type: "greeting-practice",
            question: "When should you say As-Salamu Alaikum?",
            options: ["When meeting someone", "When leaving", "Only on Friday"],
            correct: "When meeting someone"
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

    // Ampara lessons - 30 Para of the Quran
    const amparaLessons: Lesson[] = [
      {
        id: "ampara-lesson-1",
        chapterId: "ampara-chapter",
        title: "Para 1: Al-Fatiha to Al-Baqarah (verse 141)",
        titleBengali: "পারা ১: আল-ফাতিহা থেকে আল-বাকারা (আয়াত ১৪১)",
        content: {
          lesson_type: "ampara",
          para_number: 1,
          starting_surah: "Al-Fatiha",
          ending_surah: "Al-Baqarah",
          starting_verse: 1,
          ending_verse: 141,
          explanation: "Begin your Quran journey with the opening chapter and first section of Al-Baqarah",
          key_teachings: ["Opening of the Quran", "Guidance for mankind", "Stories of early believers"],
          interactive: {
            type: "verse-recognition",
            question: "Identify the opening verse of the Quran"
          }
        },
        audioUrls: {
          en: "/audio/ampara-1-english.mp3",
          bn: "/audio/ampara-1-bengali.mp3"
        },
        order: 1,
        difficulty: "beginner"
      },
      {
        id: "ampara-lesson-2",
        chapterId: "ampara-chapter",
        title: "Para 2: Al-Baqarah (verse 142-252)",
        titleBengali: "পারা ২: আল-বাকারা (আয়াত ১৪২-২৫২)",
        content: {
          lesson_type: "ampara",
          para_number: 2,
          starting_surah: "Al-Baqarah",
          ending_surah: "Al-Baqarah",
          starting_verse: 142,
          ending_verse: 252,
          explanation: "Continue with Al-Baqarah covering change of Qibla and laws",
          key_teachings: ["Change of Qibla", "Laws and regulations", "Stories of prophets"],
          interactive: {
            type: "comprehension-check",
            question: "What major change is mentioned in this Para?"
          }
        },
        audioUrls: {
          en: "/audio/ampara-2-english.mp3",
          bn: "/audio/ampara-2-bengali.mp3"
        },
        order: 2,
        difficulty: "beginner"
      },
      {
        id: "ampara-lesson-3",
        chapterId: "ampara-chapter",
        title: "Para 3: Al-Baqarah (verse 253) to Al-Imran (verse 92)",
        titleBengali: "পারা ৩: আল-বাকারা (আয়াত ২৫৩) থেকে আল-ইমরান (আয়াত ৯২)",
        content: {
          lesson_type: "ampara",
          para_number: 3,
          starting_surah: "Al-Baqarah",
          ending_surah: "Al-Imran",
          starting_verse: 253,
          ending_verse: 92,
          explanation: "Transition from Al-Baqarah to Al-Imran with stories of Jesus and Mary",
          key_teachings: ["Story of Jesus (Isa)", "Story of Mary (Maryam)", "Unity in faith"],
          interactive: {
            type: "story-sequence",
            question: "Arrange the events in the story of Maryam"
          }
        },
        audioUrls: {
          en: "/audio/ampara-3-english.mp3",
          bn: "/audio/ampara-3-bengali.mp3"
        },
        order: 3,
        difficulty: "beginner"
      }
    ];

    // Noorani Qaida Version 2 lessons - comprehensive curriculum
    const nooraniV2Lessons: Lesson[] = [
      // Chapter 1: Introduction to Arabic Letters
      {
        id: "noorani-v2-lesson-1",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 1.1 - Introduction to Arabic Script (Alif, Ba, Ta)",
        titleBengali: "অধ্যায় ১.১ - আরবি লিপির পরিচয় (আলিফ, বা, তা)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Introduction to Arabic Letters",
          letters: ["ا", "ب", "ت"],
          transliterations: ["Alif", "Baa", "Taa"],
          explanation: "Learn the first three Arabic letters with proper pronunciation. The AI Hujur will guide you step-by-step.",
          detailed_instruction: "AI Hujur displays each letter and asks you to repeat. Voice recognition assesses pronunciation accuracy.",
          interactive: {
            type: "letter-recognition-advanced",
            question: "Identify and pronounce the letter Alif (ا)",
            voice_feedback: true,
            ai_correction: true
          },
          gamification: {
            stars_earned: 1,
            badge: "First Letters Master",
            xp_points: 10
          }
        },
        audioUrls: {},
        order: 1,
        difficulty: "beginner"
      },
      {
        id: "noorani-v2-lesson-2", 
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 1.2 - Additional Letters (Tha, Jeem, Ha)",
        titleBengali: "অধ্যায় ১.২ - অতিরিক্ত বর্ণ (সা, জিম, হা)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Introduction to Arabic Letters",
          letters: ["ث", "ج", "ح"],
          transliterations: ["Thaa", "Jeem", "Haa"],
          explanation: "Continue learning Arabic letters with Tha, Jeem, and Ha. Focus on correct pronunciation.",
          detailed_instruction: "AI introduces new letters with sound examples. Practice each letter individually with voice feedback.",
          interactive: {
            type: "pronunciation-practice-advanced",
            question: "Practice pronouncing Jeem (ج) correctly",
            voice_feedback: true,
            streak_tracking: true
          },
          gamification: {
            stars_earned: 1,
            badge: "Letter Explorer",
            xp_points: 15
          }
        },
        audioUrls: {},
        order: 2,
        difficulty: "beginner"
      },
      // Chapter 2: Short Vowels and Basic Combinations
      {
        id: "noorani-v2-lesson-3",
        chapterId: "noorani-qaida-v2-chapter", 
        title: "Chapter 2.1 - Short Vowels (Fatha, Kasra, Dhamma)",
        titleBengali: "অধ্যায় ২.১ - সংক্ষিপ্ত স্বরবর্ণ (ফাতহা, কাসরা, দাম্মা)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Short Vowels and Basic Combinations",
          vowels: ["ـَ", "ـِ", "ـُ"],
          vowel_names: ["Fatha", "Kasra", "Dhamma"],
          explanation: "Learn how short vowels modify letter sounds. Essential for correct pronunciation.",
          examples: ["بَ", "بِ", "بُ"],
          example_sounds: ["Ba", "Bi", "Bu"],
          detailed_instruction: "AI shows vowel markings and demonstrates how they change letter pronunciation.",
          interactive: {
            type: "vowel-recognition",
            question: "Identify the vowel marking in بَ",
            options: ["Fatha", "Kasra", "Dhamma"],
            correct: "Fatha"
          },
          gamification: {
            stars_earned: 2,
            xp_points: 20
          }
        },
        audioUrls: {},
        order: 3,
        difficulty: "beginner"
      },
      {
        id: "noorani-v2-lesson-4",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 2.2 - Letter Combinations Practice",
        titleBengali: "অধ্যায় ২.২ - বর্ণ সমন্বয় অনুশীলন",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Short Vowels and Basic Combinations",
          combinations: ["بَاب", "تِجَارَة"],
          meanings: ["Door", "Trade"],
          explanation: "Practice combining letters with vowels to form simple words.",
          detailed_instruction: "Interactive quiz where AI gives combinations and you match sounds to written words.",
          interactive: {
            type: "word-matching",
            question: "Match the sound to the written word: بَاب",
            voice_input: true,
            ai_evaluation: true
          },
          gamification: {
            stars_earned: 2,
            xp_points: 25
          }
        },
        audioUrls: {},
        order: 4,
        difficulty: "beginner"
      },
      // Chapter 3: Complex Letter Combinations  
      {
        id: "noorani-v2-lesson-5",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 3.1 - Advanced Letter Combinations",
        titleBengali: "অধ্যায় ৩.১ - উন্নত বর্ণ সমন্বয়",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Complex Letter Combinations", 
          combinations: ["بَاب", "فَاتِحَة"],
          meanings: ["Door", "Opening"],
          explanation: "Master complex letter combinations with step-by-step breakdown.",
          detailed_instruction: "AI breaks down each combination, listens to pronunciation with voice recognition.",
          interactive: {
            type: "combination-breakdown",
            question: "Break down and pronounce: فَاتِحَة",
            hint_system: true,
            correction_feedback: "Focus on the 'A' sound"
          },
          gamification: {
            stars_earned: 3,
            xp_points: 30
          }
        },
        audioUrls: {},
        order: 5,
        difficulty: "intermediate"
      },
      {
        id: "noorani-v2-lesson-6",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 3.2 - Longer Word Practice",
        titleBengali: "অধ্যায় ৩.২ - দীর্ঘ শব্দ অনুশীলন",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Complex Letter Combinations",
          long_words: ["مَكْتَبَة", "مَدْرَسَة"],
          meanings: ["Library", "School"],
          explanation: "Read and pronounce longer Arabic words by breaking them into segments.",
          detailed_instruction: "AI displays longer words, child breaks them down into smaller segments for pronunciation.",
          interactive: {
            type: "word-segmentation",
            question: "Break down مَكْتَبَة into syllables",
            segment_practice: true
          },
          gamification: {
            stars_earned: 3,
            xp_points: 35
          }
        },
        audioUrls: {},
        order: 6,
        difficulty: "intermediate"
      },
      // Chapter 4: Basic Arabic Words and Sentences
      {
        id: "noorani-v2-lesson-7",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 4.1 - Essential Arabic Words",
        titleBengali: "অধ্যায় ৪.১ - অত্যাবশ্যকীয় আরবি শব্দ",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Basic Arabic Words and Sentences",
          essential_words: ["الله", "رَحْمَة", "بِسْمِ"],
          meanings: ["Allah", "Mercy", "In the name of"],
          explanation: "Learn fundamental Arabic words used in Quran and daily prayers.",
          detailed_instruction: "AI introduces basic words with meanings, child repeats with voice evaluation.",
          interactive: {
            type: "word-meaning-match",
            question: "What does الله mean?",
            options: ["Allah", "Mercy", "Peace"],
            correct: "Allah"
          },
          gamification: {
            stars_earned: 2,
            badge: "Word Scholar",
            xp_points: 25
          }
        },
        audioUrls: {},
        order: 7,
        difficulty: "beginner"
      },
      {
        id: "noorani-v2-lesson-8",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 4.2 - Introduction to Duas",
        titleBengali: "অধ্যায় ৪.২ - দোয়ার পরিচয়",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Basic Arabic Words and Sentences",
          duas: [
            { arabic: "بِسْمِ اللهِ", transliteration: "Bismillah", meaning: "In the name of Allah" },
            { arabic: "الحَمْدُ لِلهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah" }
          ],
          explanation: "Learn basic Duas used in daily life with proper pronunciation.",
          detailed_instruction: "AI asks child to repeat Duas, provides hints and corrections for proper recitation.",
          interactive: {
            type: "dua-recitation",
            question: "Recite Bismillah correctly",
            voice_recognition: true,
            pronunciation_help: true
          },
          gamification: {
            stars_earned: 3,
            badge: "Dua Beginner",
            xp_points: 40
          }
        },
        audioUrls: {},
        order: 8,
        difficulty: "beginner"
      },
      // Chapter 5: Introduction to Tajweed
      {
        id: "noorani-v2-lesson-9",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 5.1 - What is Tajweed?",
        titleBengali: "অধ্যায় ৫.১ - তাজবিদ কী?",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Introduction to Tajweed",
          tajweed_concept: "Beautiful recitation of the Quran with proper rules",
          importance: "Essential for correct Quranic pronunciation",
          basic_rules: ["Qalqalah", "Ikhfaa", "Ghunna"],
          explanation: "Introduction to Tajweed and its importance in Quranic recitation.",
          detailed_instruction: "AI explains Tajweed concept, child practices basic pronunciation exercises.",
          interactive: {
            type: "tajweed-introduction",
            question: "Why is Tajweed important?",
            educational: true
          },
          gamification: {
            stars_earned: 2,
            badge: "Tajweed Explorer",
            xp_points: 30
          }
        },
        audioUrls: {},
        order: 9,
        difficulty: "intermediate"
      },
      {
        id: "noorani-v2-lesson-10",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 5.2 - Practical Tajweed (Qalqalah)",
        titleBengali: "অধ্যায় ৫.২ - ব্যবহারিক তাজবিদ (কালকালাহ)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Introduction to Tajweed",
          qalqalah_letters: ["ق", "ط", "ب", "ج", "د"],
          rule_explanation: "Bouncing sound when these letters have sukoon",
          examples: ["مِنْ قَبْلُ", "يُحِبُّ"],
          explanation: "Learn Qalqalah rule - the bouncing sound for specific letters.",
          detailed_instruction: "AI demonstrates Qalqalah with examples, child practices with voice feedback.",
          interactive: {
            type: "tajweed-practice",
            question: "Practice Qalqalah in: مِنْ قَبْلُ",
            voice_analysis: true,
            improvement_tracking: true
          },
          gamification: {
            stars_earned: 4,
            badge: "Tajweed Practitioner", 
            xp_points: 50
          }
        },
        audioUrls: {},
        order: 10,
        difficulty: "intermediate"
      },
      // Chapter 6: Quranic Surahs and Duas
      {
        id: "noorani-v2-lesson-11",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 6.1 - Surah Al-Fatiha (Part 1)",
        titleBengali: "অধ্যায় ৬.১ - সূরা আল-ফাতিহা (১ম অংশ)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Quranic Surahs and Duas",
          surah: "Al-Fatiha",
          verses: [
            { arabic: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ", transliteration: "Bismillah ir-Rahman ir-Raheem" },
            { arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", transliteration: "Alhamdu lillahi rabbil alameen" }
          ],
          explanation: "Learn the opening chapter of the Quran with correct Tajweed and pronunciation.",
          detailed_instruction: "AI breaks down Al-Fatiha into parts, child repeats with real-time corrections.",
          interactive: {
            type: "surah-recitation",
            question: "Recite the first two verses of Al-Fatiha",
            tajweed_focus: true,
            progress_tracking: true
          },
          gamification: {
            stars_earned: 5,
            badge: "Al-Fatiha Beginner",
            xp_points: 60
          }
        },
        audioUrls: {},
        order: 11,
        difficulty: "intermediate"
      },
      {
        id: "noorani-v2-lesson-12",
        chapterId: "noorani-qaida-v2-chapter", 
        title: "Chapter 6.2 - Surah Al-Fatiha (Part 2)",
        titleBengali: "অধ্যায় ৬.২ - সূরা আল-ফাতিহা (২য় অংশ)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Quranic Surahs and Duas",
          surah: "Al-Fatiha",
          verses: [
            { arabic: "الرَّحْمَنِ الرَّحِيمِ", transliteration: "Ar-Rahman ir-Raheem" },
            { arabic: "مَالِكِ يَوْمِ الدِّينِ", transliteration: "Maliki yawm id-deen" }
          ],
          explanation: "Complete learning of Surah Al-Fatiha with advanced Tajweed rules.",
          detailed_instruction: "AI helps child practice complete Al-Fatiha with real-time pronunciation feedback.",
          interactive: {
            type: "complete-surah-recitation",
            question: "Recite complete Surah Al-Fatiha",
            full_evaluation: true
          },
          gamification: {
            stars_earned: 5,
            badge: "Al-Fatiha Master",
            xp_points: 70
          }
        },
        audioUrls: {},
        order: 12,
        difficulty: "intermediate"
      },
      {
        id: "noorani-v2-lesson-13",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 6.3 - Surah Al-Ikhlas",
        titleBengali: "অধ্যায় ৬.৩ - সূরা আল-ইখলাস",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Quranic Surahs and Duas",
          surah: "Al-Ikhlas",
          verses: [
            { arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ", transliteration: "Qul huwa Allahu ahad" },
            { arabic: "اللَّهُ الصَّمَدُ", transliteration: "Allah us-Samad" }
          ],
          explanation: "Learn Surah Al-Ikhlas focusing on correct recitation with Tajweed rules.",
          detailed_instruction: "AI teaches each verse with proper Tajweed, child practices with voice corrections.",
          interactive: {
            type: "surah-recitation-advanced",
            question: "Recite Surah Al-Ikhlas with proper Tajweed",
            tajweed_analysis: true
          },
          gamification: {
            stars_earned: 4,
            badge: "Surah Al-Ikhlas Master",
            xp_points: 55
          }
        },
        audioUrls: {},
        order: 13,
        difficulty: "intermediate"
      },
      // Chapter 7: Daily Duas and Short Invocations
      {
        id: "noorani-v2-lesson-14",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 7.1 - Daily Duas (Morning & Evening)",
        titleBengali: "অধ্যায় ৭.১ - দৈনিক দোয়া (সকাল ও সন্ধ্যা)",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Daily Duas and Short Invocations",
          duas: [
            {
              arabic: "اللَّهُمَّ أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
              transliteration: "Allahumma asbahna wa asbahal-mulku lillah",
              meaning: "O Allah, we have reached the morning and all dominion belongs to Allah",
              time: "Morning"
            },
            {
              arabic: "اللَّهُمَّ أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
              transliteration: "Allahumma amsayna wa amsal-mulku lillah", 
              meaning: "O Allah, we have reached the evening and all dominion belongs to Allah",
              time: "Evening"
            }
          ],
          explanation: "Learn essential daily Duas for morning and evening remembrance.",
          detailed_instruction: "AI presents each Dua, child repeats with instant pronunciation feedback and progress recording.",
          interactive: {
            type: "daily-dua-practice",
            question: "Practice the morning Dua correctly",
            context_learning: true,
            usage_guidance: true
          },
          gamification: {
            stars_earned: 3,
            badge: "Daily Dhikr Practitioner",
            xp_points: 45
          }
        },
        audioUrls: {},
        order: 14,
        difficulty: "beginner"
      },
      {
        id: "noorani-v2-lesson-15",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 7.2 - Meal Time Duas",
        titleBengali: "অধ্যায় ৭.২ - খাবারের সময়ের দোয়া",
        content: {
          lesson_type: "noorani_v2", 
          chapter: "Daily Duas and Short Invocations",
          duas: [
            {
              arabic: "بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ",
              transliteration: "Bismillahi wa ala barakati Allah",
              meaning: "In the name of Allah and with the blessings of Allah",
              time: "Before eating"
            },
            {
              arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا",
              transliteration: "Alhamdu lillahi alladhi at'amana wa saqana",
              meaning: "Praise be to Allah who fed us and gave us drink",
              time: "After eating"
            }
          ],
          explanation: "Learn proper etiquette and Duas for before and after meals.",
          detailed_instruction: "AI teaches mealtime Duas with context, child can see daily/weekly practice progress.",
          interactive: {
            type: "contextual-dua-practice",
            question: "When do you say this Dua: بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ",
            practical_application: true
          },
          gamification: {
            stars_earned: 3,
            badge: "Mealtime Manner Master",
            xp_points: 40
          }
        },
        audioUrls: {},
        order: 15,
        difficulty: "beginner"
      },
      {
        id: "noorani-v2-lesson-16",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Chapter 7.3 - Sleep and Travel Duas",
        titleBengali: "অধ্যায় ৭.৩ - ঘুম ও সফরের দোয়া",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Daily Duas and Short Invocations", 
          duas: [
            {
              arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
              transliteration: "Allahumma bismika amutu wa ahya",
              meaning: "O Allah, in Your name I die and I live",
              time: "Before sleep"
            },
            {
              arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا",
              transliteration: "Subhanal ladhi sakhkhara lana hadha",
              meaning: "Glory be to Him who has subjected this to us",
              time: "When traveling"
            }
          ],
          explanation: "Learn protective Duas for sleep and travel with proper understanding.",
          detailed_instruction: "AI explains the importance and context of each Dua, tracks how well child has learned each one.",
          interactive: {
            type: "protective-dua-learning",
            question: "Recite the travel Dua with understanding",
            meaning_emphasis: true
          },
          gamification: {
            stars_earned: 3,
            badge: "Protection Seeker", 
            xp_points: 45
          }
        },
        audioUrls: {},
        order: 16,
        difficulty: "beginner"
      },
      // Advanced Integration Lessons
      {
        id: "noorani-v2-lesson-17",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Advanced Practice - Letter Connection Mastery",
        titleBengali: "উন্নত অনুশীলন - বর্ণ সংযোগ দক্ষতা",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Advanced Integration",
          focus: "Letter connections in different positions",
          connection_types: ["Initial", "Medial", "Final", "Isolated"],
          practice_words: ["كِتَاب", "مَدْرَسَة", "طَالِب"],
          explanation: "Master how Arabic letters connect in different positions within words.",
          detailed_instruction: "Interactive exercises where child identifies letter positions and practices writing connections.",
          interactive: {
            type: "connection-mastery",
            question: "Identify the position of ت in كِتَاب",
            visual_learning: true
          },
          gamification: {
            stars_earned: 4,
            badge: "Connection Master",
            xp_points: 55
          }
        },
        audioUrls: {},
        order: 17,
        difficulty: "advanced"
      },
      {
        id: "noorani-v2-lesson-18",
        chapterId: "noorani-qaida-v2-chapter", 
        title: "Reading Fluency - Short Verses",
        titleBengali: "পড়ার সাবলীলতা - সংক্ষিপ্ত আয়াত",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Reading Fluency",
          focus: "Smooth reading of Quranic verses",
          practice_verses: [
            "وَالْعَصْرِ",
            "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ",
            "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"
          ],
          explanation: "Develop fluency in reading Quranic text with proper pace and pronunciation.",
          detailed_instruction: "AI provides real-time feedback on reading speed, accuracy, and Tajweed application.",
          interactive: {
            type: "fluency-assessment",
            question: "Read this verse smoothly: وَالْعَصْرِ",
            speed_tracking: true,
            fluency_scoring: true
          },
          gamification: {
            stars_earned: 5,
            badge: "Fluent Reader",
            xp_points: 65
          }
        },
        audioUrls: {},
        order: 18,
        difficulty: "advanced"
      },
      {
        id: "noorani-v2-lesson-19",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Comprehensive Review - All Skills",
        titleBengali: "ব্যাপক পর্যালোচনা - সকল দক্ষতা",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Comprehensive Review",
          review_areas: [
            "Letter recognition",
            "Vowel application", 
            "Word formation",
            "Tajweed basics",
            "Surah recitation",
            "Daily Duas"
          ],
          explanation: "Comprehensive review of all skills learned throughout the course.",
          detailed_instruction: "Mixed exercises testing all learned skills with AI providing overall progress assessment.",
          interactive: {
            type: "comprehensive-assessment",
            question: "Demonstrate your mastery across all areas",
            skill_evaluation: true,
            progress_report: true
          },
          gamification: {
            stars_earned: 6,
            badge: "Noorani Qaida Graduate",
            xp_points: 80
          }
        },
        audioUrls: {},
        order: 19,
        difficulty: "advanced"
      },
      {
        id: "noorani-v2-lesson-20",
        chapterId: "noorani-qaida-v2-chapter",
        title: "Graduation & Next Steps",
        titleBengali: "স্নাতক ও পরবর্তী পদক্ষেপ",
        content: {
          lesson_type: "noorani_v2",
          chapter: "Graduation",
          achievement: "Completed comprehensive Noorani Qaida curriculum",
          skills_mastered: [
            "Arabic alphabet recognition and pronunciation",
            "Short vowel application",
            "Basic Tajweed rules",
            "Surah Al-Fatiha and Al-Ikhlas",
            "Essential daily Duas",
            "Reading fluency foundations"
          ],
          next_recommendations: [
            "Advanced Tajweed course",
            "Quran memorization program", 
            "Islamic studies continuation"
          ],
          explanation: "Celebrate your achievement and plan your continued Islamic learning journey.",
          detailed_instruction: "AI congratulates progress and provides personalized recommendations for next learning steps.",
          interactive: {
            type: "graduation-ceremony",
            question: "What would you like to learn next?",
            path_planning: true
          },
          gamification: {
            stars_earned: 10,
            badge: "Noorani Qaida Master Graduate",
            xp_points: 100,
            special_certificate: true
          }
        },
        audioUrls: {},
        order: 20,
        difficulty: "completion"
      }
    ];

    nooraniLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    nooraniV2Lessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    amparaLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    quranLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    numbersLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    greetingsLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    salahLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));
    duaLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Create a default user
    const defaultUser: User = {
      id: "default-user",
      username: "student",
      email: null,
      firstName: null,
      lastName: null,
      language: "en",
      overallProgress: 25,
      streak: 7,
      totalLessonsCompleted: 3,
      totalTimeSpentMinutes: 45,
      achievements: ["first-lesson", "seven-day-streak", "perfect-score"],
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
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
      language: insertUser.language || "en",
      overallProgress: 15, 
      streak: 3,
      totalLessonsCompleted: 2,
      totalTimeSpentMinutes: 45,
      achievements: ["first-lesson", "3-day-streak"],
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    
    // Add some sample progress for demo purposes
    this.addSampleProgressForUser(id);
    
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    
    if (existingUser) {
      // Update existing user
      const updatedUser = {
        ...existingUser,
        ...userData,
        updatedAt: new Date(),
      };
      this.users.set(userData.id!, updatedUser);
      return updatedUser;
    } else {
      // Create new user
      const newUser: User = {
        id: userData.id!,
        username: userData.username || null,
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        language: userData.language || "en",
        overallProgress: 15,
        streak: 3,
        totalLessonsCompleted: 2,
        totalTimeSpentMinutes: 45,
        achievements: ["first-lesson", "3-day-streak"],
        lastActiveAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(userData.id!, newUser);
      
      // Add some sample progress for demo purposes
      this.addSampleProgressForUser(userData.id!);
      
      return newUser;
    }
  }

  private addSampleProgressForUser(userId: string) {
    // Add sample completed lessons to demonstrate achievements
    const sampleProgress: UserProgress[] = [
      {
        id: randomUUID(),
        userId: userId,
        lessonId: "noorani-lesson-1",
        chapterId: "noorani-qaida-chapter",
        completed: true,
        score: 100,
        timeSpentMinutes: 15,
        attempts: 1,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        userId: userId,
        lessonId: "noorani-lesson-2",
        chapterId: "noorani-qaida-chapter",
        completed: true,
        score: 85,
        timeSpentMinutes: 18,
        attempts: 1,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ];

    sampleProgress.forEach(progress => {
      this.userProgress.set(progress.id, progress);
    });
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
    const chapter: Chapter = { 
      ...insertChapter, 
      id,
      nameArabic: insertChapter.nameArabic || null,
      nameBengali: insertChapter.nameBengali || null,
      totalLessons: insertChapter.totalLessons || 0
    };
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
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      titleBengali: insertLesson.titleBengali || null,
      audioUrls: insertLesson.audioUrls || {},
      difficulty: insertLesson.difficulty || "beginner"
    };
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
        completed: progressData.completed || false,
        score: progressData.score || null,
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

  async getUnlockedChapters(userId: string): Promise<Chapter[]> {
    const allChapters = await this.getAllChapters();
    const userProgress = await this.getUserProgress(userId);
    
    const unlockedChapters: Chapter[] = [];
    
    for (const chapter of allChapters) {
      if (chapter.order === 1) {
        // First chapter is always unlocked
        unlockedChapters.push(chapter);
      } else {
        // Check if previous chapter is completed
        const previousChapter = allChapters.find(c => c.order === chapter.order - 1);
        if (previousChapter) {
          const previousChapterProgress = userProgress.filter(p => p.chapterId === previousChapter.id && p.completed);
          const completedLessons = previousChapterProgress.length;
          
          // Unlock if at least 80% of previous chapter is completed
          const requiredLessons = Math.ceil(previousChapter.totalLessons * 0.8);
          if (completedLessons >= requiredLessons) {
            unlockedChapters.push(chapter);
          }
        }
      }
    }
    
    return unlockedChapters;
  }

  // Learning Sessions
  async createLearningSession(sessionData: InsertLearningSession): Promise<LearningSession> {
    const id = randomUUID();
    const session: LearningSession = {
      ...sessionData,
      id,
      startedAt: new Date(),
      endedAt: sessionData.endedAt || null,
      durationMinutes: sessionData.durationMinutes || 0,
      activitiesCompleted: sessionData.activitiesCompleted || 0,
      score: sessionData.score || 0,
      metadata: sessionData.metadata || {}
    };
    this.learningSessions.set(id, session);
    return session;
  }

  async updateLearningSession(sessionId: string, updates: Partial<LearningSession>): Promise<LearningSession | undefined> {
    const session = this.learningSessions.get(sessionId);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.learningSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getUserLearningSessions(userId: string, limit: number = 50): Promise<LearningSession[]> {
    return Array.from(this.learningSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...achievementData,
      id,
      nameArabic: achievementData.nameArabic || null,
      nameBengali: achievementData.nameBengali || null,
      points: achievementData.points || 10,
      isActive: achievementData.isActive !== false
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const id = randomUUID();
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 0
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    const userProgress = await this.getUserProgress(userId);
    const newAchievements: UserAchievement[] = [];

    // Simple achievement logic examples
    const completedLessons = userProgress.filter(p => p.completed).length;
    
    // First lesson achievement
    if (completedLessons >= 1) {
      const existing = await this.getUserAchievements(userId);
      if (!existing.some(ua => ua.achievementId === "first-lesson")) {
        const achievement = await this.unlockAchievement(userId, "first-lesson");
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // Streak tracking
  async updateStreakHistory(userId: string, data: InsertStreakHistory): Promise<StreakHistory> {
    const id = randomUUID();
    const streakHistory: StreakHistory = {
      ...data,
      id,
      date: data.date || new Date(),
      lessonsCompleted: data.lessonsCompleted || 0,
      timeSpentMinutes: data.timeSpentMinutes || 0,
      isActive: data.isActive !== false
    };
    this.streakHistory.set(id, streakHistory);
    return streakHistory;
  }

  async getUserStreakHistory(userId: string, days: number = 30): Promise<StreakHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return Array.from(this.streakHistory.values())
      .filter(sh => sh.userId === userId && new Date(sh.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateUserStreak(userId: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const recentHistory = await this.getUserStreakHistory(userId, 2);
    const todayActivity = recentHistory.find(h => 
      new Date(h.date).toDateString() === today.toDateString()
    );
    const yesterdayActivity = recentHistory.find(h => 
      new Date(h.date).toDateString() === yesterday.toDateString()
    );

    let newStreak = user.streak;
    if (todayActivity && todayActivity.lessonsCompleted > 0) {
      if (yesterdayActivity && yesterdayActivity.lessonsCompleted > 0) {
        newStreak = user.streak + 1;
      } else {
        newStreak = 1; // Reset streak if no activity yesterday
      }
    }

    return this.updateUser(userId, { 
      streak: newStreak,
      lastActiveAt: new Date()
    });
  }

  // Analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const user = await this.getUser(userId);
    const userProgress = await this.getUserProgress(userId);
    const learningSessions = await this.getUserLearningSessions(userId, 10);
    const achievements = await this.getUserAchievements(userId);
    const streakHistory = await this.getUserStreakHistory(userId, 30);

    const completedLessons = userProgress.filter(p => p.completed);
    const averageScore = completedLessons.length > 0 
      ? completedLessons.reduce((sum, p) => sum + (p.score || 0), 0) / completedLessons.length 
      : 0;

    const chaptersCompleted = Array.from(new Set(completedLessons.map(p => p.chapterId))).length;
    
    const longestStreak = streakHistory.reduce((max, h) => {
      // Simple calculation - in real implementation, would calculate consecutive days
      return Math.max(max, user?.streak || 0);
    }, 0);

    const weeklyProgress = await this.getWeeklyProgress(userId);

    return {
      totalTimeSpent: user?.totalTimeSpentMinutes || 0,
      totalLessonsCompleted: user?.totalLessonsCompleted || 0,
      currentStreak: user?.streak || 0,
      longestStreak,
      chaptersCompleted,
      averageScore,
      recentActivity: learningSessions,
      achievementsEarned: achievements,
      weeklyProgress
    };
  }

  async getWeeklyProgress(userId: string): Promise<{ date: string; lessonsCompleted: number; timeSpent: number }[]> {
    const streakHistory = await this.getUserStreakHistory(userId, 7);
    const weeklyData: { date: string; lessonsCompleted: number; timeSpent: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayData = streakHistory.find(h => 
        new Date(h.date).toISOString().split('T')[0] === dateString
      );

      weeklyData.push({
        date: dateString,
        lessonsCompleted: dayData?.lessonsCompleted || 0,
        timeSpent: dayData?.timeSpentMinutes || 0
      });
    }

    return weeklyData;
  }
}

export const storage = new MemStorage();

// Initialize sample data for analytics demonstration
async function initializeSampleData() {
  // Create default user if not exists
  const userId = "default-user";
  let user = await storage.getUser(userId);
  
  if (!user) {
    user = await storage.createUser({
      id: userId,
      username: "Student",
      email: "student@example.com",
      preferredLanguage: "en",
      streak: 5,
      totalTimeSpentMinutes: 180,
      totalLessonsCompleted: 8,
      lastActiveAt: new Date()
    });
  }

  // Add some sample achievements
  try {
    await storage.createAchievement({
      id: "first-lesson",
      name: "First Steps",
      description: "Complete your first lesson",
      category: "learning",
      points: 10
    });
  } catch (e) {
    // Achievement already exists
  }

  // Add sample progress data for different days
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    try {
      await storage.updateStreakHistory(userId, {
        date,
        lessonsCompleted: Math.floor(Math.random() * 3) + 1,
        timeSpentMinutes: Math.floor(Math.random() * 60) + 15,
        isActive: true
      });
    } catch (e) {
      // Streak data might already exist
    }
  }

  // Add some learning sessions
  try {
    for (let i = 0; i < 3; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(sessionDate.getDate() - i);
      
      await storage.createLearningSession({
        userId,
        sessionType: "lesson",
        startedAt: sessionDate,
        endedAt: new Date(sessionDate.getTime() + 30 * 60000), // 30 minutes later
        durationMinutes: 30,
        activitiesCompleted: 2,
        score: 85 + Math.floor(Math.random() * 15),
        metadata: {}
      });
    }
  } catch (e) {
    // Sessions might already exist
  }

  console.log("Sample analytics data initialized");
}

// Initialize data when storage is created
initializeSampleData().catch(console.error);
