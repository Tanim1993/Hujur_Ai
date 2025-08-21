import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useAudio } from "@/hooks/use-audio";

interface VoiceInteractionProps {
  targetText: string;
  targetLanguage: 'en' | 'bn';
  pronunciation?: string;
  onSuccess?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function VoiceInteraction({
  targetText,
  targetLanguage = 'en',
  pronunciation,
  onSuccess,
  onRetry,
  className = ""
}: VoiceInteractionProps) {
  const [attemptResult, setAttemptResult] = useState<'success' | 'retry' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const { speechState, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { playText } = useAudio();

  const similarity = useCallback((str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const s2 = str2.toLowerCase().replace(/[^\w\s]/g, '').trim();
    
    if (s1 === s2) return 1;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }, []);

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null)
    );
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleStartListening = () => {
    resetTranscript();
    setAttemptResult(null);
    setShowFeedback(false);
    startListening(targetLanguage, 8000); // 8 second timeout
  };

  const handleStopListening = () => {
    stopListening();
    
    // Process the result after a short delay
    setTimeout(() => {
      if (speechState.transcript) {
        const accuracyScore = similarity(speechState.transcript, targetText);
        const isSuccess = accuracyScore >= 0.7; // 70% similarity threshold
        
        setAttemptResult(isSuccess ? 'success' : 'retry');
        setShowFeedback(true);
        
        if (isSuccess) {
          onSuccess?.();
        } else {
          onRetry?.();
        }
        
        // Hide feedback after 3 seconds
        setTimeout(() => {
          setShowFeedback(false);
        }, 3000);
      }
    }, 500);
  };

  const handlePlayTarget = async () => {
    await playText(pronunciation || targetText, targetLanguage);
  };

  const handleRetry = () => {
    resetTranscript();
    setAttemptResult(null);
    setShowFeedback(false);
  };

  if (!speechState.isSupported) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-4 text-center ${className}`}>
        <div className="text-gray-600 text-sm">
          Voice interaction not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 ${className}`} data-testid="voice-interaction">
      <div className="text-center mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">
          Practice Pronunciation
        </h4>
        <div className="text-lg font-medium text-indigo-700 mb-2">
          {targetText}
        </div>
        {pronunciation && pronunciation !== targetText && (
          <div className="text-sm text-gray-600 italic">
            Pronunciation: {pronunciation}
          </div>
        )}
      </div>

      {/* Target Audio Button */}
      <div className="text-center mb-4">
        <Button
          onClick={handlePlayTarget}
          variant="outline"
          size="sm"
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          data-testid="button-play-target"
        >
          <Volume2 size={16} className="mr-2" />
          Listen
        </Button>
      </div>

      {/* Voice Recording Controls */}
      <div className="text-center mb-4">
        <motion.div
          animate={{
            scale: speechState.isListening ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: speechState.isListening ? Infinity : 0,
          }}
        >
          <Button
            onClick={speechState.isListening ? handleStopListening : handleStartListening}
            size="lg"
            className={`w-20 h-20 rounded-full ${
              speechState.isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            data-testid="button-voice-record"
          >
            {speechState.isListening ? (
              <MicOff size={32} />
            ) : (
              <Mic size={32} />
            )}
          </Button>
        </motion.div>
        
        <div className="text-sm text-gray-600 mt-2">
          {speechState.isListening ? (
            <span className="text-red-600 font-medium">
              🎤 Listening... Click to stop
            </span>
          ) : (
            "Click to start recording"
          )}
        </div>
      </div>

      {/* Transcript Display */}
      {speechState.transcript && (
        <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">You said:</div>
          <div className="text-gray-800 font-medium" data-testid="speech-transcript">
            "{speechState.transcript}"
          </div>
          {speechState.confidence > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(speechState.confidence * 100)}%
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {showFeedback && attemptResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center p-3 rounded-lg ${
            attemptResult === 'success' 
              ? 'bg-green-100 border border-green-200' 
              : 'bg-orange-100 border border-orange-200'
          }`}
        >
          <div className="flex items-center justify-center mb-2">
            {attemptResult === 'success' ? (
              <Check size={24} className="text-green-600" />
            ) : (
              <X size={20} className="text-orange-600" />
            )}
          </div>
          <div className={`font-medium ${
            attemptResult === 'success' ? 'text-green-700' : 'text-orange-700'
          }`}>
            {attemptResult === 'success' 
              ? 'Great pronunciation! Well done!' 
              : 'Good try! Let\'s practice again.'
            }
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {speechState.error && (
        <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-red-700 text-sm">{speechState.error}</div>
        </div>
      )}

      {/* Retry Button */}
      {speechState.transcript && !speechState.isListening && (
        <div className="text-center mt-4">
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            data-testid="button-retry-speech"
          >
            <RotateCcw size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}