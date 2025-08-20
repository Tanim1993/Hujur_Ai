import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Chapter } from "@shared/schema";
import { Link } from "wouter";

interface ChapterCardProps {
  chapter: Chapter;
  completedLessons: number;
  className?: string;
}

export default function ChapterCard({ 
  chapter, 
  completedLessons, 
  className = "" 
}: ChapterCardProps) {
  const progressPercentage = (completedLessons / chapter.totalLessons) * 100;
  
  const colorClasses = {
    "islamic-green": {
      bg: "bg-gradient-to-br from-islamic-green to-success-green",
      border: "hover:border-islamic-green",
      button: "bg-islamic-green hover:bg-green-700"
    },
    "warm-sand": {
      bg: "bg-gradient-to-br from-warm-sand to-golden-yellow",
      border: "hover:border-warm-sand", 
      button: "bg-warm-sand hover:bg-orange-400"
    },
    "golden-yellow": {
      bg: "bg-gradient-to-br from-golden-yellow to-warm-sand",
      border: "hover:border-golden-yellow",
      button: "bg-golden-yellow hover:bg-yellow-300 text-dark-slate"
    }
  };

  const colorConfig = colorClasses[chapter.color as keyof typeof colorClasses] || colorClasses["islamic-green"];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`card-hover bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-transparent ${colorConfig.border} cursor-pointer ${className}`}
      data-testid={`chapter-card-${chapter.id}`}
    >
      <div className={`${colorConfig.bg} p-6 text-white text-center`}>
        <div className="text-4xl mb-4">
          {chapter.icon === "book-quran" && "📖"}
          {chapter.icon === "pray" && "🤲"}
          {chapter.icon === "hands-praying" && "🙏"}
        </div>
        <h4 className="text-2xl font-bold mb-2">{chapter.name}</h4>
        {chapter.nameBengali && (
          <p className="font-bengali text-lg">{chapter.nameBengali}</p>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-dark-slate">Progress</span>
          <span className={`text-sm font-semibold text-${chapter.color}`} data-testid={`${chapter.id}-progress`}>
            {completedLessons}/{chapter.totalLessons} lessons
          </span>
        </div>
        
        <Progress value={progressPercentage} className="mb-4" />
        
        <ul className="space-y-2 text-sm text-dark-slate mb-6">
          <li className="flex items-center space-x-2">
            <CheckCircle className="text-success-green" size={16} />
            <span>Basic concepts</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle className="text-success-green" size={16} />
            <span>Interactive lessons</span>
          </li>
          <li className="flex items-center space-x-2">
            <Clock className="text-warm-sand" size={16} />
            <span>Advanced topics</span>
          </li>
        </ul>
        
        <Link href={`/chapter/${chapter.id}`}>
          <Button 
            className={`w-full ${colorConfig.button} transition-colors`}
            data-testid={`button-continue-${chapter.id}`}
          >
            {completedLessons > 0 ? "Continue Learning" : "Start Learning"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
