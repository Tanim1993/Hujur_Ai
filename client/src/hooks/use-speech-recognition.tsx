import { useState, useRef, useCallback, useEffect } from "react";

export interface SpeechRecognitionState {
  isListening: boolean;
  transcript: string;
  confidence: number;
  isSupported: boolean;
  error: string | null;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export function useSpeechRecognition() {
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: "",
    confidence: 0,
    isSupported: false,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    setSpeechState(prev => ({
      ...prev,
      isSupported: !!SpeechRecognition,
    }));

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setSpeechState(prev => ({
          ...prev,
          isListening: true,
          error: null,
          transcript: "",
          confidence: 0,
        }));
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        let maxConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence || 0;

          if (result.isFinal) {
            finalTranscript += transcript;
            maxConfidence = Math.max(maxConfidence, confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setSpeechState(prev => ({
          ...prev,
          transcript: finalTranscript || interimTranscript,
          confidence: maxConfidence || prev.confidence,
        }));
      };

      recognition.onend = () => {
        setSpeechState(prev => ({
          ...prev,
          isListening: false,
        }));
      };

      recognition.onerror = (event: any) => {
        setSpeechState(prev => ({
          ...prev,
          isListening: false,
          error: `Speech recognition error: ${event.error}`,
        }));
      };
    }
  }, []);

  const startListening = useCallback((language: 'en' | 'bn' = 'en', timeout: number = 5000) => {
    if (!recognitionRef.current || speechState.isListening) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const recognition = recognitionRef.current;
    recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';

    try {
      recognition.start();
      
      // Set timeout for automatic stop
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, timeout);
    } catch (error) {
      setSpeechState(prev => ({
        ...prev,
        error: "Failed to start speech recognition",
      }));
    }
  }, [speechState.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && speechState.isListening) {
      recognitionRef.current.stop();
    }
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [speechState.isListening]);

  const resetTranscript = useCallback(() => {
    setSpeechState(prev => ({
      ...prev,
      transcript: "",
      confidence: 0,
      error: null,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    speechState,
    startListening,
    stopListening,
    resetTranscript,
  };
}