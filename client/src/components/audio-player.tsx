import { Play, Pause } from "lucide-react";
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

  const handlePlayAudio = async (language: "en" | "bn") => {
    if (audioState.isPlaying) {
      pause();
      return;
    }

    // Use text-to-speech instead of audio files
    const textToSpeak = language === "en" ? englishText : bengaliText;
    await playText(textToSpeak, language);
    onLanguageChange?.(language);
  };

  return (
    <div className={`bg-gray-50 rounded-2xl p-4 ${className}`} data-testid="audio-player">
      <h5 className="font-semibold text-dark-slate mb-3">Audio Instructions</h5>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => handlePlayAudio("en")}
          className="flex items-center space-x-2 bg-islamic-green text-white hover:bg-green-700 transition-colors"
          data-testid="button-play-english"
        >
          {audioState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{englishText}</span>
        </Button>
        <Button
          onClick={() => handlePlayAudio("bn")}
          className="flex items-center space-x-2 bg-warm-sand text-white hover:bg-orange-400 transition-colors font-bengali"
          data-testid="button-play-bengali"
        >
          {audioState.isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{bengaliText}</span>
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
