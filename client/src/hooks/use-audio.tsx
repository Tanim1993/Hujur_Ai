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
      
      // Set language and voice
      utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      utterance.rate = 0.8; // Slower speech for children
      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.volume = 0.9;

      // Try to find appropriate voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith(language === 'bn' ? 'bn' : 'en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
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
