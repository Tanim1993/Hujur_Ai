export interface LessonContent {
  letter?: string;
  transliteration?: string;
  explanation?: string;
  steps?: string[];
  arabic?: string;
  meaning?: string;
  bengaliMeaning?: string;
  interactive: {
    type: 'letter-recognition' | 'step-ordering' | 'recitation-practice';
    options?: string[];
    correct?: string;
    question?: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt?: Date;
}

export interface ProgressStats {
  overallProgress: number;
  streak: number;
  completedLessons: number;
  totalLessons: number;
  achievements: string[];
}
