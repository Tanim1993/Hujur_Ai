import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Mic, MicOff, Volume2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceCommands } from "@/hooks/use-voice-commands";

interface VoiceCommandPanelProps {
  onNext?: () => void;
  onRepeat?: () => void;
  onPlayAudio?: (language: 'en' | 'bn') => void;
  onStartLesson?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export default function VoiceCommandPanel({
  onNext,
  onRepeat,
  onPlayAudio,
  onStartLesson,
  onGoHome,
  className = ""
}: VoiceCommandPanelProps) {
  const [showCommands, setShowCommands] = useState(false);
  
  const {
    speechState,
    startVoiceCommand,
    stopListening,
    resetTranscript,
    isProcessing,
    supportedCommands
  } = useVoiceCommands({
    onNext,
    onRepeat,
    onPlayAudio,
    onStartLesson,
    onGoHome
  });

  const handleVoiceToggle = () => {
    if (speechState.isListening) {
      stopListening();
    } else {
      startVoiceCommand();
    }
  };

  if (!speechState.isSupported) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`} data-testid="voice-command-panel">
      {/* Command Reference */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 mb-2"
          >
            <div className="text-sm font-semibold text-gray-800 mb-3">Voice Commands:</div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Next"</span>
                <span>→ Go to next lesson</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Repeat"</span>
                <span>→ Practice again</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Play English"</span>
                <span>→ Audio in English</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Play Bangla"</span>
                <span>→ Audio in Bengali</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Go Home"</span>
                <span>→ Return to main menu</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-indigo-600">"Help"</span>
                <span>→ Show all commands</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      <AnimatePresence>
        {(speechState.isListening || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 bg-blue-50 rounded-lg p-3 mb-2 border border-blue-200"
          >
            <div className="flex items-center space-x-2">
              {speechState.isListening && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-red-500 rounded-full"
                  />
                  <span className="text-sm text-blue-700 font-medium">
                    Listening for commands...
                  </span>
                </>
              )}
              {isProcessing && (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                  />
                  <span className="text-sm text-blue-700 font-medium">
                    Processing...
                  </span>
                </>
              )}
            </div>
            
            {speechState.transcript && (
              <div className="mt-2 text-xs text-gray-600 bg-white rounded px-2 py-1">
                "You said: {speechState.transcript}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Control Buttons */}
      <div className="flex space-x-2">
        {/* Help Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCommands(!showCommands)}
          className="rounded-full w-10 h-10 p-0 bg-white shadow-lg border-gray-300 hover:bg-gray-50"
          data-testid="button-show-commands"
        >
          <HelpCircle size={16} className="text-gray-600" />
        </Button>

        {/* Voice Command Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          animate={speechState.isListening ? { 
            boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)"],
          } : {}}
          transition={speechState.isListening ? {
            duration: 1.5,
            repeat: Infinity,
          } : {}}
        >
          <Button
            onClick={handleVoiceToggle}
            disabled={isProcessing}
            className={`rounded-full w-14 h-14 shadow-lg transition-colors ${
              speechState.isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
            data-testid="button-voice-command"
          >
            {speechState.isListening ? (
              <MicOff size={24} className="text-white" />
            ) : (
              <MessageCircle size={24} className="text-white" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Error Display */}
      {speechState.error && (
        <div className="absolute bottom-16 right-0 bg-red-50 border border-red-200 rounded-lg p-2 mb-2 text-xs text-red-700 max-w-64">
          {speechState.error}
        </div>
      )}
    </div>
  );
}