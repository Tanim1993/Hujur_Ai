import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AITeacher from "./ai-teacher";
import AudioPlayer from "./audio-player";
import VoiceInteraction from "./voice-interaction";
import VoiceCommandPanel from "./voice-command-panel";
import { useAudio } from "@/hooks/use-audio";
import type { Lesson } from "@shared/schema";
import type { LessonContent } from "@/types/lesson";

interface LessonInterfaceProps {
  lesson: Lesson;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onRepeat: () => void;
  onAnswer: (answer: string) => void;
  showCorrectFeedback: boolean;
  showIncorrectFeedback: boolean;
  onPlayAudio?: (language: 'en' | 'bn') => void;
  className?: string;
}

export default function LessonInterface({
  lesson,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onRepeat,
  onAnswer,
  showCorrectFeedback,
  showIncorrectFeedback,
  onPlayAudio,
  className = ""
}: LessonInterfaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const { audioState } = useAudio();
  const content = lesson.content as LessonContent;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`} data-testid="lesson-interface">
      <div className="bg-white rounded-xl md:rounded-3xl shadow-xl overflow-hidden">
        {/* Lesson Header */}
        <div className="bg-gradient-to-r from-islamic-green to-success-green p-4 md:p-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-20 rounded-full hover:bg-white hover:bg-opacity-30 flex-shrink-0"
                data-testid="button-back"
              >
                <ArrowLeft size={16} className="md:w-5 md:h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg md:text-xl font-bold truncate">{lesson.title}</h4>
                {lesson.titleBengali && (
                  <p className="text-xs md:text-sm opacity-90 font-bengali truncate">{lesson.titleBengali}</p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs md:text-sm opacity-90">Progress</div>
              <div className="text-base md:text-lg font-bold" data-testid="lesson-progress">
                {currentStep}/{totalSteps}
              </div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="mt-3 md:mt-4 bg-white bg-opacity-20" />
        </div>
        
        {/* Lesson Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* AI Teacher Section */}
            <div className="text-center order-1 lg:order-none">
              <AITeacher
                message={`Let's learn about ${content.letter || content.steps?.[0] || "this lesson"}!`}
                messageBengali={lesson.titleBengali || "চলুন শিখি!"}
                showSpeechBubble={true}
                size="sm"
                isAnimating={audioState.isPlaying}
                className="sm:scale-100"
              />
              
              <div className="mt-4 md:mt-6">
                <AudioPlayer
                  englishText={
                    content.letter 
                      ? `This is the letter ${content.transliteration}. ${content.meaning || ''}` 
                      : content.arabic 
                        ? `${content.transliteration}. ${content.meaning}` 
                        : lesson.title
                  }
                  bengaliText={
                    content.letter 
                      ? `এটি ${content.transliteration} অক্ষর। ${content.bengaliMeaning || lesson.titleBengali?.split(' - ')[1] || ''}` 
                      : content.arabic 
                        ? `${content.transliteration}। ${content.bengaliMeaning || content.meaning}` 
                        : lesson.titleBengali || lesson.title
                  }
                  onLanguageChange={(lang) => console.log("Language changed to:", lang)}
                />
              </div>
            </div>
            
            {/* Interactive Content */}
            <div className="space-y-4 md:space-y-6 order-2 lg:order-none">
              {/* Content Display */}
              {content.letter && (
                <div className="text-center bg-gradient-to-br from-golden-yellow to-warm-sand p-6 md:p-8 rounded-xl md:rounded-2xl">
                  <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 md:mb-4">{content.letter}</div>
                  <div className="text-xl md:text-2xl font-bold text-dark-slate mb-2">
                    {content.transliteration}
                  </div>
                  <div className="text-base md:text-lg font-bengali text-dark-slate">
                    {lesson.titleBengali?.split(' - ')[1] || content.transliteration}
                  </div>
                </div>
              )}

              {content.arabic && (
                <div className="text-center bg-gradient-to-br from-islamic-green to-success-green p-6 md:p-8 rounded-xl md:rounded-2xl text-white">
                  <div className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-bengali">{content.arabic}</div>
                  <div className="text-base md:text-lg mb-2">{content.transliteration}</div>
                  <div className="text-sm opacity-90">{content.meaning}</div>
                  {content.bengaliMeaning && (
                    <div className="text-sm font-bengali mt-2 opacity-90">{content.bengaliMeaning}</div>
                  )}
                </div>
              )}
              
              {/* Interactive Question */}
              {content.interactive.type === 'letter-recognition' && content.interactive.options && (
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl">
                  <h5 className="font-semibold text-dark-slate mb-3 md:mb-4 text-center text-sm md:text-base">
                    Can you find the letter {content.transliteration}?
                  </h5>
                  <p className="text-center font-bengali text-islamic-green mb-4 text-sm md:text-base">
                    {content.transliteration} অক্ষরটি খুঁজে বের করুন
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    <AnimatePresence>
                      {content.interactive.options.map((option, index) => {
                        const isCorrect = option === content.interactive.correct;
                        const isSelected = option === selectedAnswer;
                        
                        let buttonClass = "bg-white border-2 border-gray-200 hover:border-islamic-green text-dark-slate";
                        
                        if (isSelected && showCorrectFeedback && isCorrect) {
                          buttonClass = "bg-success-green text-white border-success-green";
                        } else if (isSelected && showIncorrectFeedback && !isCorrect) {
                          buttonClass = "bg-red-500 text-white border-red-500";
                        } else if (isSelected) {
                          buttonClass = "border-islamic-green bg-green-50 text-islamic-green";
                        }

                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-3 md:p-4 rounded-lg md:rounded-xl transition-colors text-2xl md:text-3xl lg:text-4xl font-bold aspect-square flex items-center justify-center ${buttonClass}`}
                            data-testid={`option-${option}`}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Voice Practice Section */}
              {(content.letter || content.arabic) && (
                <VoiceInteraction
                  targetText={content.letter || content.transliteration || content.arabic || "Practice"}
                  targetLanguage={content.arabic ? 'en' : 'en'}
                  pronunciation={content.transliteration}
                  onSuccess={() => {
                    console.log('Pronunciation practice successful!');
                  }}
                  onRetry={() => {
                    console.log('Encouraging user to try again');
                  }}
                />
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={onRepeat}
                  className="flex-1 py-3 text-sm md:text-base"
                  data-testid="button-repeat"
                >
                  <RotateCcw className="mr-2" size={16} />
                  Repeat
                </Button>
                <Button
                  onClick={onNext}
                  className="flex-1 bg-success-green hover:bg-green-600 py-3 text-sm md:text-base"
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Command Panel */}
      <VoiceCommandPanel
        onNext={onNext}
        onRepeat={onRepeat}
        onPlayAudio={onPlayAudio}
        onGoHome={onBack}
      />
    </div>
  );
}
