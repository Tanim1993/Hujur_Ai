import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, BookOpen, Award, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTajweedAnalysis } from "@/hooks/use-tajweed-analysis";

interface TajweedPracticeProps {
  arabicText: string;
  transliteration: string;
  meaning: string;
  onComplete?: () => void;
  className?: string;
}

export default function TajweedPractice({
  arabicText,
  transliteration,
  meaning,
  onComplete,
  className = ""
}: TajweedPracticeProps) {
  const [isActive, setIsActive] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const {
    speechState,
    startTajweedPractice,
    stopListening,
    resetTranscript,
    handleTranscriptReady,
    currentAnalysis,
    tajweedRules
  } = useTajweedAnalysis();

  const handleStartPractice = () => {
    setIsActive(true);
    setAttemptCount(prev => prev + 1);
    startTajweedPractice(arabicText, transliteration);
  };

  const handleStopPractice = () => {
    stopListening();
    setIsActive(false);
  };

  const handleTryAgain = () => {
    resetTranscript();
    handleStartPractice();
  };

  // Handle transcript processing
  useEffect(() => {
    if (!speechState.isListening && speechState.transcript && isActive) {
      handleTranscriptReady(speechState.transcript, arabicText);
      setIsActive(false);
    }
  }, [speechState.isListening, speechState.transcript, isActive, handleTranscriptReady, arabicText]);

  // Auto-complete after excellent performance
  useEffect(() => {
    if (currentAnalysis?.overall === 'excellent' && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [currentAnalysis, onComplete]);

  if (!speechState.isSupported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          Speech recognition is not supported in your browser. Please use Chrome or Edge for Tajweed practice.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`} data-testid="tajweed-practice">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 rounded-full p-2">
          <BookOpen size={20} className="text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Tajweed Practice</h3>
          <p className="text-sm text-gray-600">Perfect your Quranic pronunciation</p>
        </div>
        {currentAnalysis?.overall === 'excellent' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-yellow-100 rounded-full p-2"
          >
            <Award size={20} className="text-yellow-600" />
          </motion.div>
        )}
      </div>

      {/* Arabic Text Display */}
      <div className="text-center mb-6 space-y-4">
        <div className="bg-islamic-green-50 rounded-lg p-6">
          <div className="text-3xl font-arabic text-islamic-green-800 mb-2 leading-relaxed">
            {arabicText}
          </div>
          <div className="text-lg text-gray-700 font-medium">
            {transliteration}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {meaning}
          </div>
        </div>
      </div>

      {/* Practice Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <Button
          variant="outline"
          onClick={() => handleStartPractice()}
          disabled={speechState.isListening}
          className="flex items-center space-x-2"
          data-testid="button-listen-example"
        >
          <Volume2 size={16} />
          <span>Listen</span>
        </Button>

        <motion.div
          whileTap={{ scale: 0.95 }}
          animate={speechState.isListening ? { 
            boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.7)", "0 0 0 10px rgba(34, 197, 94, 0)"],
          } : {}}
          transition={speechState.isListening ? {
            duration: 1.5,
            repeat: Infinity,
          } : {}}
        >
          <Button
            onClick={speechState.isListening ? handleStopPractice : handleStartPractice}
            className={`flex items-center space-x-2 ${
              speechState.isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            data-testid="button-practice-tajweed"
          >
            <Mic size={16} />
            <span>{speechState.isListening ? 'Stop' : 'Practice'}</span>
          </Button>
        </motion.div>

        {attemptCount > 0 && (
          <Button
            variant="outline"
            onClick={handleTryAgain}
            disabled={speechState.isListening}
            className="flex items-center space-x-2"
            data-testid="button-try-again"
          >
            <RotateCcw size={16} />
            <span>Try Again</span>
          </Button>
        )}
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {speechState.isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 bg-blue-500 rounded-full"
              />
              <span className="text-blue-700 font-medium">
                Listening for your recitation...
              </span>
            </div>
            
            {speechState.transcript && (
              <div className="mt-3 p-2 bg-white rounded border text-sm text-gray-600">
                Heard: "{speechState.transcript}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Display */}
      <AnimatePresence>
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Overall Assessment */}
            <div className={`rounded-lg p-4 ${
              currentAnalysis.overall === 'excellent' ? 'bg-green-50 border border-green-200' :
              currentAnalysis.overall === 'good' ? 'bg-blue-50 border border-blue-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-sm font-semibold ${
                  currentAnalysis.overall === 'excellent' ? 'text-green-700' :
                  currentAnalysis.overall === 'good' ? 'text-blue-700' :
                  'text-yellow-700'
                }`}>
                  {currentAnalysis.overall === 'excellent' ? 'Mashallah! Excellent!' :
                   currentAnalysis.overall === 'good' ? 'Good Effort!' :
                   'Keep Practicing!'}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Pronunciation Clarity</span>
                  <span>{currentAnalysis.pronunciation.clarity}%</span>
                </div>
                <Progress value={currentAnalysis.pronunciation.clarity} className="h-2" />
              </div>
            </div>

            {/* Specific Rules Feedback */}
            {currentAnalysis.rulesFeedback.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">Tajweed Rules Assessment:</h4>
                <div className="space-y-2">
                  {currentAnalysis.rulesFeedback.map((feedback, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{feedback.rule}:</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        feedback.status === 'correct' ? 'bg-green-100 text-green-700' :
                        feedback.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {feedback.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attempt Counter */}
            <div className="text-center text-sm text-gray-500">
              Attempt {attemptCount} • {currentAnalysis.overall === 'excellent' ? 'Moving to next lesson...' : 'Try again to improve!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {speechState.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {speechState.error}
        </div>
      )}
    </div>
  );
}