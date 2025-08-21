import { useCallback, useRef } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { useAudio } from "./use-audio";

interface VoiceCommand {
  patterns: string[];
  action: () => void;
  response: string;
}

interface VoiceCommandsProps {
  onNext?: () => void;
  onRepeat?: () => void;
  onPlayAudio?: (language: 'en' | 'bn') => void;
  onStartLesson?: () => void;
  onGoHome?: () => void;
}

export function useVoiceCommands({
  onNext,
  onRepeat,
  onPlayAudio,
  onStartLesson,
  onGoHome
}: VoiceCommandsProps) {
  
  const { speechState, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { playText } = useAudio();
  const isProcessingRef = useRef(false);

  const commands: VoiceCommand[] = [
    {
      patterns: ["next", "next lesson", "continue", "go next", "move on"],
      action: () => onNext?.(),
      response: "Moving to the next lesson!"
    },
    {
      patterns: ["repeat", "again", "say again", "one more time", "repeat lesson"],
      action: () => onRepeat?.(),
      response: "Let's practice this again!"
    },
    {
      patterns: ["play english", "english audio", "speak english", "listen english"],
      action: () => onPlayAudio?.('en'),
      response: "Playing in English"
    },
    {
      patterns: ["play bangla", "play bengali", "bangla audio", "bengali audio", "speak bangla"],
      action: () => onPlayAudio?.('bn'),
      response: "Playing in Bengali"
    },
    {
      patterns: ["start lesson", "begin lesson", "start learning", "let's learn"],
      action: () => onStartLesson?.(),
      response: "Starting your lesson now!"
    },
    {
      patterns: ["go home", "home", "main menu", "back home", "return home"],
      action: () => onGoHome?.(),
      response: "Going back to home"
    },
    {
      patterns: ["hello hujur", "hi hujur", "assalamu alaikum", "greetings"],
      action: () => {},
      response: "Wa alaikum assalam! I'm here to help you learn. How can I assist you today?"
    },
    {
      patterns: ["help", "what can you do", "commands", "voice commands"],
      action: () => {},
      response: "I can help you navigate lessons! You can say: next, repeat, play english, play bangla, go home, or just ask me questions about Islamic learning."
    }
  ];

  const findMatchingCommand = useCallback((transcript: string): VoiceCommand | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    return commands.find(command => 
      command.patterns.some(pattern => {
        // Exact match
        if (normalizedTranscript === pattern) return true;
        
        // Contains pattern
        if (normalizedTranscript.includes(pattern)) return true;
        
        // Fuzzy match for common variations
        const words = normalizedTranscript.split(' ');
        const patternWords = pattern.split(' ');
        
        return patternWords.every(patternWord => 
          words.some(word => 
            word.includes(patternWord) || patternWord.includes(word)
          )
        );
      })
    ) || null;
  }, [commands]);

  const processVoiceCommand = useCallback(async (transcript: string) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    try {
      const matchingCommand = findMatchingCommand(transcript);
      
      if (matchingCommand) {
        // Execute the command action
        matchingCommand.action();
        
        // Provide audio feedback
        await playText(matchingCommand.response, 'en');
      } else {
        // No command found, provide generic response
        await playText("I didn't understand that command. You can say: next, repeat, play english, or ask for help.", 'en');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [findMatchingCommand, playText]);

  const startVoiceCommand = useCallback(() => {
    resetTranscript();
    startListening('en', 6000); // 6 second timeout for commands
  }, [startListening, resetTranscript]);

  const handleTranscriptChange = useCallback(() => {
    // Process transcript when speech recognition stops and we have content
    if (!speechState.isListening && speechState.transcript && !isProcessingRef.current) {
      processVoiceCommand(speechState.transcript);
    }
  }, [speechState.isListening, speechState.transcript, processVoiceCommand]);

  // Auto-process when transcript is available and not listening
  if (!speechState.isListening && speechState.transcript && !isProcessingRef.current) {
    setTimeout(handleTranscriptChange, 500);
  }

  return {
    speechState,
    startVoiceCommand,
    stopListening,
    resetTranscript,
    isProcessing: isProcessingRef.current,
    supportedCommands: commands.map(cmd => cmd.patterns[0]) // First pattern of each command
  };
}