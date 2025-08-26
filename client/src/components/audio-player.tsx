import { useState } from "react";
import { Play, Pause, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/use-audio";

interface AudioPlayerProps {
  englishText?: string;
  bengaliText?: string;
  onLanguageChange?: (lang: "en" | "bn") => void;
  className?: string;
}

export default function AudioPlayer({
  englishText = "English",
  bengaliText = "বাংলা",
  onLanguageChange,
  className = ""
}: AudioPlayerProps) {
  const { audioState, playText, pause } = useAudio();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "bn">("en");

  const handlePlayAudio = async () => {
    if (audioState.isPlaying) {
      pause();
      return;
    }

    // Use text-to-speech instead of audio files
    const textToSpeak = currentLanguage === "en" ? englishText : bengaliText;
    await playText(textToSpeak, currentLanguage);
    onLanguageChange?.(currentLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "bn" : "en";
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const currentText = currentLanguage === "en" ? englishText : bengaliText;
  const isPlaying = audioState.isPlaying;

  return (
    <div className={`bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 ${className}`} data-testid="audio-player">
      <h5 className="font-semibold text-dark-slate mb-3 text-sm md:text-base">Audio Instructions</h5>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center">
        {/* Language Toggle Button */}
        <Button
          onClick={toggleLanguage}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 text-xs md:text-sm border-islamic-green text-islamic-green hover:bg-islamic-green hover:text-white"
          data-testid="button-toggle-language"
        >
          <Globe size={14} />
          <span>{currentLanguage === "en" ? "EN" : "বাং"}</span>
        </Button>

        {/* Play Button */}
        <Button
          onClick={handlePlayAudio}
          className={`flex-1 sm:flex-none items-center space-x-2 transition-colors text-sm md:text-base px-4 md:px-6 py-2 md:py-3 ${
            currentLanguage === "en" 
              ? "bg-islamic-green text-white hover:bg-green-700" 
              : "bg-warm-sand text-white hover:bg-orange-400 font-bengali"
          }`}
          data-testid={`button-play-${currentLanguage}`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span className="truncate max-w-[200px] sm:max-w-none">
            {currentText}
          </span>
        </Button>
      </div>
      
      {/* Audio progress indicator */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-islamic-green h-1 rounded-full transition-all duration-300"
          style={{ width: `${audioState.progress}%` }}
          data-testid="audio-progress"
        />
      </div>
    </div>
  );
}
