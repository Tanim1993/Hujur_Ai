import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Volume2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AITeacher from "./ai-teacher";
import { useAudio } from "@/hooks/use-audio";

interface PrayerStep {
  id: string;
  name: string;
  arabicName: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  duration: number; // seconds
  instructions: string;
  posture: 'standing' | 'bowing' | 'prostrating' | 'sitting';
}

interface ImamModeProps {
  prayerType: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  onComplete?: () => void;
  className?: string;
}

const PRAYER_STEPS: Record<string, PrayerStep[]> = {
  fajr: [
    {
      id: 'takbir',
      name: 'Opening Takbir',
      arabicName: 'تكبيرة الإحرام',
      arabic: 'اللَّهُ أَكْبَرُ',
      transliteration: 'Allahu Akbar',
      meaning: 'Allah is the Greatest',
      duration: 3,
      instructions: 'Raise your hands to your ears and say the opening Takbir',
      posture: 'standing'
    },
    {
      id: 'fatiha',
      name: 'Al-Fatiha',
      arabicName: 'الفاتحة',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Bismillahi rabbil alameen. Alhamdu lillahi rabbil alameen...',
      meaning: 'In the name of Allah, the Most Gracious, the Most Merciful. All praise is due to Allah...',
      duration: 15,
      instructions: 'Recite Al-Fatiha, the opening chapter of the Quran',
      posture: 'standing'
    },
    {
      id: 'ruku',
      name: 'Ruku (Bowing)',
      arabicName: 'ركوع',
      arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      transliteration: 'Subhana rabbial adheem',
      meaning: 'Glory be to my Lord, the Most Great',
      duration: 8,
      instructions: 'Bow down with hands on knees, back straight',
      posture: 'bowing'
    },
    {
      id: 'sajda',
      name: 'Sujud (Prostration)',
      arabicName: 'سجود',
      arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
      transliteration: 'Subhana rabbial ala',
      meaning: 'Glory be to my Lord, the Most High',
      duration: 8,
      instructions: 'Prostrate with forehead, nose, hands, knees, and toes touching the ground',
      posture: 'prostrating'
    },
    {
      id: 'tashahhud',
      name: 'Tashahhud',
      arabicName: 'تشهد',
      arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ',
      transliteration: 'Attahiyyatu lillahi wassalawatu wattayyibat...',
      meaning: 'All compliments, prayers and pure words are due to Allah...',
      duration: 12,
      instructions: 'Sit and recite the Tashahhud while pointing the index finger',
      posture: 'sitting'
    }
  ]
};

export default function ImamMode({
  prayerType,
  onComplete,
  className = ""
}: ImamModeProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { playText, audioState } = useAudio();
  const steps = PRAYER_STEPS[prayerType] || PRAYER_STEPS.fajr;
  const currentStep = steps[currentStepIndex];
  const totalProgress = ((currentStepIndex * 100) + stepProgress) / steps.length;

  // Timer for step progression
  useEffect(() => {
    if (!isActive || isPaused || !currentStep) return;

    const interval = setInterval(() => {
      setStepProgress(prev => {
        const newProgress = prev + (100 / currentStep.duration);
        
        if (newProgress >= 100) {
          // Move to next step
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            return 0;
          } else {
            // Prayer complete
            setIsActive(false);
            onComplete?.();
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, currentStep, currentStepIndex, steps.length, onComplete]);

  // Auto-play current step audio when step changes
  useEffect(() => {
    if (isActive && !isPaused && currentStep) {
      const timer = setTimeout(() => {
        playText(currentStep.transliteration, 'en');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isActive, isPaused, currentStep, playText]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
  };

  const handlePlayCurrentStep = () => {
    if (currentStep) {
      playText(currentStep.transliteration, 'en');
    }
  };

  const getTeacherExpression = (): 'neutral' | 'speaking' | 'happy' | 'encouraging' => {
    if (audioState.isPlaying) return 'speaking';
    if (isActive && !isPaused) return 'encouraging';
    if (totalProgress === 100) return 'happy';
    return 'neutral';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`} data-testid="imam-mode">
      {/* Header */}
      <div className="bg-islamic-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Imam Mode</h2>
            <p className="text-islamic-green-100 capitalize">{prayerType} Prayer Practice</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <div className="text-sm text-islamic-green-100">Complete</div>
          </div>
        </div>
        
        <Progress value={totalProgress} className="mt-4 bg-islamic-green-700" />
      </div>

      {/* AI Teacher */}
      <div className="p-6 bg-gradient-to-br from-islamic-green-50 to-white">
        <AITeacher
          expression={getTeacherExpression()}
          isAnimated={isActive && !isPaused}
          size="md"
          className="mx-auto mb-4"
        />
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">
            {isActive ? 'Follow along with the prayer' : 'Ready to start prayer practice'}
          </div>
          {isActive && (
            <div className="text-xs text-islamic-green-600 font-medium">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          )}
        </div>
      </div>

      {/* Current Step Display */}
      {currentStep && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 border-t border-gray-100"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {currentStep.name} ({currentStep.arabicName})
              </h3>
              
              <div className="bg-islamic-green-50 rounded-lg p-4 mb-4">
                <div className="text-2xl font-arabic text-islamic-green-800 mb-2 leading-relaxed">
                  {currentStep.arabic}
                </div>
                <div className="text-lg text-gray-700 font-medium mb-1">
                  {currentStep.transliteration}
                </div>
                <div className="text-sm text-gray-600">
                  {currentStep.meaning}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> {currentStep.instructions}
                </p>
              </div>

              {/* Step Progress */}
              {isActive && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Step Progress</span>
                    <span>{Math.round(stepProgress)}%</span>
                  </div>
                  <Progress value={stepProgress} className="h-2" />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Controls */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="bg-islamic-green-600 hover:bg-islamic-green-700 flex items-center space-x-2"
              data-testid="button-start-prayer"
            >
              <Play size={16} />
              <span>Start Prayer</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="button-pause-prayer"
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </Button>

              <Button
                onClick={handlePlayCurrentStep}
                variant="outline"
                disabled={audioState.isPlaying}
                className="flex items-center space-x-2"
                data-testid="button-repeat-step"
              >
                <Volume2 size={16} />
                <span>Repeat</span>
              </Button>
            </>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className="flex items-center space-x-2"
            data-testid="button-reset-prayer"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </Button>
        </div>

        {isActive && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock size={14} />
              <span>
                Estimated time: {Math.ceil((steps.reduce((sum, step) => sum + step.duration, 0) * (100 - totalProgress)) / 100)} seconds remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}