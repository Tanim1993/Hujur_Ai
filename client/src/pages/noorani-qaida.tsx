import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Star, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import NooraniLessonComponent from "@/components/noorani-lesson";
import { NOORANI_QAIDA_LESSONS, getNooraniLessonById, getNooraniLessonsByLevel } from "@/data/noorani-qaida";
import type { NooraniLesson } from "@/data/noorani-qaida";

export default function NooraniQaidaPage() {
  const [, setLocation] = useLocation();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const selectedLesson = selectedLessonId ? getNooraniLessonById(selectedLessonId) : null;

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
  };

  const handleLessonComplete = () => {
    if (selectedLessonId && !completedLessons.includes(selectedLessonId)) {
      setCompletedLessons(prev => [...prev, selectedLessonId]);
    }
  };

  const handleNextLesson = () => {
    if (!selectedLessonId) return;
    
    const currentIndex = NOORANI_QAIDA_LESSONS.findIndex(l => l.id === selectedLessonId);
    const nextLesson = NOORANI_QAIDA_LESSONS[currentIndex + 1];
    
    if (nextLesson) {
      setSelectedLessonId(nextLesson.id);
    } else {
      setSelectedLessonId(null);
    }
  };

  const handlePreviousLesson = () => {
    if (!selectedLessonId) return;
    
    const currentIndex = NOORANI_QAIDA_LESSONS.findIndex(l => l.id === selectedLessonId);
    const previousLesson = NOORANI_QAIDA_LESSONS[currentIndex - 1];
    
    if (previousLesson) {
      setSelectedLessonId(previousLesson.id);
    } else {
      setSelectedLessonId(null);
    }
  };

  const backToLessons = () => {
    setSelectedLessonId(null);
  };

  const getProgressPercentage = () => {
    return Math.round((completedLessons.length / NOORANI_QAIDA_LESSONS.length) * 100);
  };

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    return completedLessons.includes(NOORANI_QAIDA_LESSONS[lessonIndex - 1].id);
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-ghost-white" data-testid="noorani-lesson-page">
        <NavigationHeader />
        <main className="py-8 px-4">
          <NooraniLessonComponent
            lesson={selectedLesson}
            onComplete={handleLessonComplete}
            onNext={handleNextLesson}
            onPrevious={handlePreviousLesson}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="noorani-qaida-page">
      <NavigationHeader />
      
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <ArrowLeft size={16} />
                  <span>Home</span>
                </Button>
              </Link>
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-dark-slate mb-2">
                  Noorani Qaida
                </h1>
                <p className="text-xl text-islamic-green font-bengali">
                  নূরানি কায়েদা
                </p>
              </div>
              <div className="w-20" />
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              Master the fundamentals of Arabic reading and Quranic pronunciation through traditional Noorani Qaida methodology. 
              Learn letter recognition, vowel sounds, and proper Tajweed step by step.
            </p>
            <p className="text-gray-500 font-bengali">
              ঐতিহ্যবাহী নূরানি কায়েদা পদ্ধতির মাধ্যমে আরবি পড়া এবং কুরআনিক উচ্চারণের মূল বিষয়গুলি আয়ত্ত করুন।
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-islamic-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <BookOpen size={32} className="text-islamic-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{NOORANI_QAIDA_LESSONS.length}</div>
                <div className="text-sm text-gray-600">Total Lessons</div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <Trophy size={32} className="text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{completedLessons.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              
              <div className="text-center">
                <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <Star size={32} className="text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{getProgressPercentage()}%</div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <Clock size={32} className="text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">15-20</div>
                <div className="text-sm text-gray-600">Min per lesson</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>
          </div>

          {/* Lesson Categories */}
          {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
            const levelLessons = getNooraniLessonsByLevel(level);
            if (levelLessons.length === 0) return null;

            return (
              <div key={level} className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Badge 
                    variant={level === 'beginner' ? 'default' : 'outline'}
                    className={`${
                      level === 'beginner' ? 'bg-green-500' :
                      level === 'intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Badge>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {level === 'beginner' && 'Foundation'}
                    {level === 'intermediate' && 'Building Skills'}
                    {level === 'advanced' && 'Mastery'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelLessons.map((lesson, index) => {
                    const globalIndex = NOORANI_QAIDA_LESSONS.findIndex(l => l.id === lesson.id);
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isUnlocked = isLessonUnlocked(globalIndex);
                    const isActive = !isCompleted && isUnlocked;

                    return (
                      <motion.div
                        key={lesson.id}
                        whileHover={isUnlocked ? { scale: 1.02 } : {}}
                        whileTap={isUnlocked ? { scale: 0.98 } : {}}
                        className={`
                          relative bg-white rounded-xl shadow-lg border-2 overflow-hidden cursor-pointer
                          ${isCompleted ? 'border-green-500 bg-green-50' :
                            isActive ? 'border-islamic-green-400 hover:border-islamic-green-500' :
                            'border-gray-200 opacity-60 cursor-not-allowed'}
                        `}
                        onClick={() => isUnlocked && handleLessonSelect(lesson.id)}
                        data-testid={`lesson-card-${lesson.id}`}
                      >
                        {/* Status Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' :
                          isActive ? 'bg-islamic-green-500' :
                          'bg-gray-300'
                        }`}>
                          {isCompleted ? (
                            <span className="text-white text-xs">✓</span>
                          ) : isActive ? (
                            <span className="text-white text-xs">{globalIndex + 1}</span>
                          ) : (
                            <span className="text-white text-xs">🔒</span>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 pr-8">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 font-bengali">
                            {lesson.titleBengali}
                          </p>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {lesson.description}
                          </p>

                          {/* Lesson Content Preview */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="grid grid-cols-3 gap-2 text-center">
                              {lesson.letters.slice(0, 3).map((letter, letterIndex) => (
                                <div key={letterIndex} className="bg-white rounded p-2">
                                  <div className="text-xl font-arabic text-islamic-green-700">
                                    {letter.arabic}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {letter.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {lesson.letters.length > 3 && (
                              <div className="text-center text-xs text-gray-500 mt-2">
                                +{lesson.letters.length - 3} more letters
                              </div>
                            )}
                          </div>

                          {/* Lesson Stats */}
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{lesson.letters.length} Letters</span>
                            <span>{lesson.exercises.length} Exercises</span>
                            <span>15-20 min</span>
                          </div>

                          {/* Action Button */}
                          <div className="mt-4">
                            {isCompleted ? (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-green-500 text-green-700 hover:bg-green-50"
                              >
                                Review Lesson
                              </Button>
                            ) : isActive ? (
                              <Button 
                                size="sm" 
                                className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                              >
                                Start Lesson
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full" 
                                disabled
                              >
                                Complete Previous Lesson
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Footer Information */}
          <div className="bg-blue-50 rounded-xl p-8 mt-12 text-center">
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              About Noorani Qaida
            </h3>
            <p className="text-blue-700 mb-4 max-w-3xl mx-auto">
              Noorani Qaida is the traditional method for learning to read Arabic and the Quran. 
              It provides a systematic approach to understanding Arabic letters, vowel marks, and pronunciation rules. 
              This digital version includes interactive exercises, pronunciation practice, and immediate feedback to enhance your learning experience.
            </p>
            <p className="text-sm text-blue-600 font-bengali">
              নূরানি কায়েদা আরবি এবং কুরআন পড়া শেখার ঐতিহ্যবাহী পদ্ধতি। এটি আরবি অক্ষর, স্বরচিহ্ন এবং উচ্চারণের নিয়মগুলি বোঝার জন্য একটি নিয়মতান্ত্রিক পদ্ধতি প্রদান করে।
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}