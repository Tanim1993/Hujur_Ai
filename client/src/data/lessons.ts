import type { Achievement } from "@/types/lesson";

export const achievements: Achievement[] = [
  {
    id: "first-lesson",
    name: "First Lesson",
    description: "Completed your first lesson!",
    icon: "book-open",
    color: "golden-yellow"
  },
  {
    id: "seven-day-streak",
    name: "7 Day Streak",
    description: "Seven days of consistent learning!",
    icon: "fire",
    color: "islamic-green"
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Got 100% in a lesson!",
    icon: "star",
    color: "warm-sand"
  },
  {
    id: "quran-master",
    name: "Quran Master",
    description: "Complete all Quran lessons",
    icon: "trophy",
    color: "gray"
  }
];
