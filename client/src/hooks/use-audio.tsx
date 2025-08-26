import { useState, useRef, useCallback } from "react";

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
}

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playText = useCallback(async (text: string, language: 'en' | 'bn' = 'en') => {
    try {
      // Stop any existing speech
      speechSynthesis.cancel();
      
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Check if browser supports speech synthesis
      if (!speechSynthesis) {
        throw new Error('Speech synthesis not supported');
      }

      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;
      
      // Set language and voice with more natural settings
      utterance.lang = language === 'bn' ? 'bn-IN' : 'en-US'; // Use Indian Bengali for better voice support
      utterance.rate = language === 'bn' ? 0.6 : 0.75; // Much slower for natural speech
      utterance.pitch = language === 'bn' ? 0.8 : 0.85; // Lower pitch for Bengali male voice
      utterance.volume = 0.95;

      // Try to find appropriate male voice
      const voices = speechSynthesis.getVoices();
      let preferredVoice;
      
      if (language === 'bn') {
        // Comprehensive search for Bengali voices with prioritization
        preferredVoice = voices.find(voice => 
          voice.lang === 'bn-IN' && voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang === 'bn-BD' && voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang.includes('bn-IN')
        ) || voices.find(voice => 
          voice.lang.includes('bn-BD')
        ) || voices.find(voice => 
          voice.lang.includes('bn')
        ) || voices.find(voice => 
          voice.name.toLowerCase().includes('bengali') || voice.name.toLowerCase().includes('bangla')
        ) || voices.find(voice => 
          // Use Hindi male as fallback for similar pronunciation patterns
          voice.lang.includes('hi-IN') && voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang.includes('hi')
        );
      } else {
        // Look for English male voice with better patterns
        preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'))
        ) || voices.find(voice => 
          voice.lang.includes('en') && 
          !voice.name.toLowerCase().includes('female') && 
          !voice.name.toLowerCase().includes('woman')
        ) || voices.find(voice => 
          voice.lang.includes('en')
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using voice: ${preferredVoice.name} (${preferredVoice.lang})`);
      } else {
        console.log('No preferred voice found, using default');
        // Log available voices for debugging
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }

      // Set up event listeners
      utterance.onstart = () => {
        setAudioState(prev => ({ 
          ...prev, 
          isPlaying: true,
          duration: text.length / 10, // Rough estimate
          currentTime: 0,
          progress: 0
        }));
      };

      utterance.onend = () => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
          progress: 100,
        }));
      };

      utterance.onerror = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      };

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAudioState(prev => {
          if (!prev.isPlaying) {
            clearInterval(progressInterval);
            return prev;
          }
          const newProgress = Math.min(prev.progress + 5, 95);
          return {
            ...prev,
            currentTime: (newProgress / 100) * prev.duration,
            progress: newProgress
          };
        });
      }, 200);

      utterance.onend = () => {
        clearInterval(progressInterval);
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: prev.duration,
          progress: 100,
        }));
      };

      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const play = useCallback(async (audioUrl: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        setAudioState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      });

      audio.addEventListener('timeupdate', () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          progress: (audio.currentTime / audio.duration) * 100,
        }));
      });

      audio.addEventListener('play', () => {
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      });

      audio.addEventListener('pause', () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      });

      audio.addEventListener('ended', () => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0,
          progress: 0,
        }));
      });

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (speechRef.current) {
      speechSynthesis.cancel();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  return {
    audioState,
    play,
    playText,
    pause,
  };
}
