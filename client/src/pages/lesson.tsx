import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import LessonInterface from "@/components/lesson-interface";
import { useUpdateProgress } from "@/hooks/use-progress";
import { useToast } from "@/hooks/use-toast";
import type { Lesson } from "@shared/schema";
import type { LessonContent } from "@/types/lesson";

export default function LessonPage() {
  const [, params] = useRoute("/lesson/:lessonId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const lessonId = params?.lessonId || "";

  const [currentStep, setCurrentStep] = useState(1);
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ["/api/lessons", lessonId],
    enabled: !!lessonId,
  });

  const updateProgress = useUpdateProgress();

  useEffect(() => {
    if (lesson && lessonCompleted) {
      updateProgress.mutate({
        lessonId: lesson.id,
        chapterId: lesson.chapterId,
        completed: true,
        score: 100
      });
    }
  }, [lesson, lessonCompleted, updateProgress]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark-slate">Lesson not found</h2>
          </div>
        </div>
      </div>
    );
  }

  const content = lesson.content as LessonContent;
  const totalSteps = 3; // Each lesson has multiple steps

  const handleBack = () => {
    setLocation(`/chapter/${lesson.chapterId}`);
  };

  const handleNext = () => {
    if (currentStep >= totalSteps) {
      // Lesson completed
      setLessonCompleted(true);
      toast({
        title: "Lesson Completed!",
        description: "Great job! You've completed this lesson.",
      });
      
      setTimeout(() => {
        setLocation(`/chapter/${lesson.chapterId}`);
      }, 2000);
    } else {
      setCurrentStep(prev => prev + 1);
      setShowCorrectFeedback(false);
      setShowIncorrectFeedback(false);
    }
  };

  const handleRepeat = () => {
    setCurrentStep(1);
    setShowCorrectFeedback(false);
    setShowIncorrectFeedback(false);
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === content.interactive.correct;
    
    if (isCorrect) {
      setShowCorrectFeedback(true);
      toast({
        title: "Correct!",
        description: "Well done! You got it right.",
      });
      
      // Auto-advance after showing feedback
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setShowIncorrectFeedback(true);
      toast({
        title: "Try again!",
        description: "That's not quite right. Give it another try!",
        variant: "destructive",
      });
      
      // Reset feedback after a delay
      setTimeout(() => {
        setShowIncorrectFeedback(false);
      }, 2000);
    }
  };

  const handlePlayAudio = (language: 'en' | 'bn') => {
    // Get the current lesson content for audio
    if (content.english && language === 'en') {
      playText(content.english, 'en');
    } else if (content.bengali && language === 'bn') {
      playText(content.bengali, 'bn');
    } else if (content.transliteration && language === 'en') {
      playText(content.transliteration, 'en');
    }
  };

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="lesson-page">
      <NavigationHeader />
      
      <main className="py-8 px-4">
        <LessonInterface
          lesson={lesson}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onBack={handleBack}
          onNext={handleNext}
          onRepeat={handleRepeat}
          onAnswer={handleAnswer}
          showCorrectFeedback={showCorrectFeedback}
          showIncorrectFeedback={showIncorrectFeedback}
          onPlayAudio={handlePlayAudio}
        />
      </main>
    </div>
  );
}
