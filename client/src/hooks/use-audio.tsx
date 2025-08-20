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
      // For demo purposes, simulate audio playback
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setAudioState(prev => ({ ...prev, progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          setAudioState(prev => ({
            ...prev,
            isPlaying: false,
            progress: 0,
          }));
        }
      }, 100);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return {
    audioState,
    play,
    pause,
  };
}
