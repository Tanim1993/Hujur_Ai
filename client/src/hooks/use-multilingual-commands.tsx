import { useCallback, useRef } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { useAudio } from "./use-audio";

interface MultilingualCommand {
  patterns: {
    en: string[];
    bn: string[];
    ar: string[];
    ur: string[];
  };
  action: () => void;
  responses: {
    en: string;
    bn: string;
    ar: string;
    ur: string;
  };
}

interface MultilingualCommandsProps {
  onNext?: () => void;
  onRepeat?: () => void;
  onPlayAudio?: (language: 'en' | 'bn') => void;
  onStartLesson?: () => void;
  onGoHome?: () => void;
  onStartPrayer?: () => void;
  onShowTajweed?: () => void;
}

export function useMultilingualCommands({
  onNext,
  onRepeat,
  onPlayAudio,
  onStartLesson,
  onGoHome,
  onStartPrayer,
  onShowTajweed
}: MultilingualCommandsProps) {
  
  const { speechState, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { playText } = useAudio();
  const isProcessingRef = useRef(false);
  const currentLanguage = useRef<'en' | 'bn' | 'ar' | 'ur'>('en');

  const commands: MultilingualCommand[] = [
    {
      patterns: {
        en: ["next", "next lesson", "continue", "go next", "move on"],
        bn: ["পরবর্তী", "পরের পাঠ", "এগিয়ে যাও", "পরবর্তী পাঠ"],
        ar: ["التالي", "الدرس التالي", "متابعة", "إلى الأمام"],
        ur: ["اگلا", "اگلا سبق", "آگے بڑھو", "جاری رکھو"]
      },
      action: () => onNext?.(),
      responses: {
        en: "Moving to the next lesson!",
        bn: "পরবর্তী পাঠে যাচ্ছি!",
        ar: "الانتقال إلى الدرس التالي!",
        ur: "اگلے سبق پر جا رہے ہیں!"
      }
    },
    {
      patterns: {
        en: ["repeat", "again", "say again", "one more time"],
        bn: ["আবার", "পুনরাবৃত্তি", "আরেকবার বল"],
        ar: ["كرر", "مرة أخرى", "قل مرة أخرى"],
        ur: ["دوبارہ", "پھر سے", "دہرائیں"]
      },
      action: () => onRepeat?.(),
      responses: {
        en: "Let's practice this again!",
        bn: "আবার অনুশীলন করি!",
        ar: "دعنا نتدرب على هذا مرة أخرى!",
        ur: "آئیے اسے دوبارہ مشق کرتے ہیں!"
      }
    },
    {
      patterns: {
        en: ["play english", "english audio", "speak english"],
        bn: ["ইংরেজি বাজাও", "ইংরেজি অডিও"],
        ar: ["شغل الإنجليزية", "الصوت الإنجليزي"],
        ur: ["انگریزی چلائیں", "انگریزی آڈیو"]
      },
      action: () => onPlayAudio?.('en'),
      responses: {
        en: "Playing in English",
        bn: "ইংরেজিতে বাজানো হচ্ছে",
        ar: "التشغيل باللغة الإنجليزية",
        ur: "انگریزی میں چل رہا ہے"
      }
    },
    {
      patterns: {
        en: ["play bangla", "play bengali", "bangla audio"],
        bn: ["বাংলা বাজাও", "বাংলা অডিও", "বাংলায় বল"],
        ar: ["شغل البنغالية", "الصوت البنغالي"],
        ur: ["بنگالی چلائیں", "بنگالی آڈیو"]
      },
      action: () => onPlayAudio?.('bn'),
      responses: {
        en: "Playing in Bengali",
        bn: "বাংলায় বাজানো হচ্ছে",
        ar: "التشغيل باللغة البنغالية",
        ur: "بنگالی میں چل رہا ہے"
      }
    },
    {
      patterns: {
        en: ["go home", "home", "main menu", "back home"],
        bn: ["বাড়ি যাও", "মূল মেনু", "হোমে যাও"],
        ar: ["اذهب للبيت", "القائمة الرئيسية", "الصفحة الرئيسية"],
        ur: ["گھر جائیں", "مین مینو", "ہوم پیج"]
      },
      action: () => onGoHome?.(),
      responses: {
        en: "Going back to home",
        bn: "বাড়িতে ফিরে যাচ্ছি",
        ar: "العودة إلى الصفحة الرئيسية",
        ur: "گھر واپس جا رہے ہیں"
      }
    },
    {
      patterns: {
        en: ["start prayer", "prayer time", "salah practice", "namaz"],
        bn: ["নামাজ শুরু", "সালাত অনুশীলন", "নামাজের সময়"],
        ar: ["ابدأ الصلاة", "وقت الصلاة", "ممارسة الصلاة"],
        ur: ["نماز شروع کریں", "نماز کا وقت", "نماز کی مشق"]
      },
      action: () => onStartPrayer?.(),
      responses: {
        en: "Starting prayer practice session!",
        bn: "নামাজ অনুশীলন শুরু করছি!",
        ar: "بدء جلسة ممارسة الصلاة!",
        ur: "نماز کی مشق کا سیشن شروع کر رہے ہیں!"
      }
    },
    {
      patterns: {
        en: ["tajweed practice", "pronunciation", "quranic recitation"],
        bn: ["তাজবীদ অনুশীলন", "উচ্চারণ", "কুরআন তিলাওয়াত"],
        ar: ["ممارسة التجويد", "النطق", "تلاوة القرآن"],
        ur: ["تجوید کی مشق", "تلفظ", "قرآن کی تلاوت"]
      },
      action: () => onShowTajweed?.(),
      responses: {
        en: "Starting Tajweed pronunciation practice!",
        bn: "তাজবীদ উচ্চারণ অনুশীলন শুরু!",
        ar: "بدء ممارسة النطق والتجويد!",
        ur: "تجوید کی تلفظ مشق شروع!"
      }
    },
    {
      patterns: {
        en: ["hello hujur", "hi hujur", "assalamu alaikum", "greetings"],
        bn: ["হ্যালো হুজুর", "আসসালামু আলাইকুম", "সালাম"],
        ar: ["السلام عليكم", "أهلا أستاذ", "مرحبا"],
        ur: ["آداب استاد", "السلام علیکم", "ہیلو"]
      },
      action: () => {},
      responses: {
        en: "Wa alaikum assalam! I'm here to help you learn. How can I assist you today?",
        bn: "ওয়া আলাইকুমুস সালাম! আমি আপনাকে শিখতে সাহায্য করতে এসেছি।",
        ar: "وعليكم السلام! أنا هنا لمساعدتك في التعلم. كيف يمكنني مساعدتك اليوم؟",
        ur: "وعلیکم السلام! میں آپ کو سیکھنے میں مدد کرنے کے لیے یہاں ہوں۔"
      }
    }
  ];

  const findMatchingCommand = useCallback((transcript: string, language: 'en' | 'bn' | 'ar' | 'ur'): MultilingualCommand | null => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    return commands.find(command => 
      command.patterns[language].some(pattern => {
        const normalizedPattern = pattern.toLowerCase();
        
        // Exact match
        if (normalizedTranscript === normalizedPattern) return true;
        
        // Contains pattern
        if (normalizedTranscript.includes(normalizedPattern)) return true;
        
        // Fuzzy match for common variations
        const words = normalizedTranscript.split(' ');
        const patternWords = normalizedPattern.split(' ');
        
        return patternWords.every(patternWord => 
          words.some(word => 
            word.includes(patternWord) || patternWord.includes(word)
          )
        );
      })
    ) || null;
  }, [commands]);

  const processVoiceCommand = useCallback(async (transcript: string, language: 'en' | 'bn' | 'ar' | 'ur') => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    
    try {
      const matchingCommand = findMatchingCommand(transcript, language);
      
      if (matchingCommand) {
        // Execute the command action
        matchingCommand.action();
        
        // Provide audio feedback in the same language
        await playText(matchingCommand.responses[language], language === 'ar' || language === 'ur' ? 'en' : language);
      } else {
        // No command found, provide generic response
        const noCommandResponses = {
          en: "I didn't understand that command. Try saying: next, repeat, or help.",
          bn: "আমি সেই কমান্ড বুঝতে পারিনি। বলুন: পরবর্তী, আবার, বা সাহায্য।",
          ar: "لم أفهم هذا الأمر. جرب قول: التالي، كرر، أو المساعدة.",
          ur: "مجھے یہ کمانڈ سمجھ نہیں آیا۔ کہیے: اگلا، دوبارہ، یا مدد۔"
        };
        
        await playText(noCommandResponses[language], language === 'ar' || language === 'ur' ? 'en' : language);
      }
    } catch (error) {
      console.error('Error processing multilingual voice command:', error);
    } finally {
      isProcessingRef.current = false;
    }
  }, [findMatchingCommand, playText]);

  const startMultilingualCommand = useCallback((language: 'en' | 'bn' | 'ar' | 'ur' = 'en') => {
    resetTranscript();
    currentLanguage.current = language;
    
    // Start listening in the appropriate language (fallback to English for AR/UR)
    const listenLanguage = language === 'ar' || language === 'ur' ? 'en' : language;
    startListening(listenLanguage, 8000); // 8 second timeout for multilingual commands
  }, [startListening, resetTranscript]);

  const handleTranscriptChange = useCallback(() => {
    // Process transcript when speech recognition stops and we have content
    if (!speechState.isListening && speechState.transcript && !isProcessingRef.current) {
      processVoiceCommand(speechState.transcript, currentLanguage.current);
    }
  }, [speechState.isListening, speechState.transcript, processVoiceCommand]);

  // Auto-process when transcript is available and not listening
  if (!speechState.isListening && speechState.transcript && !isProcessingRef.current) {
    setTimeout(handleTranscriptChange, 500);
  }

  const getSupportedLanguages = () => ['en', 'bn', 'ar', 'ur'] as const;
  
  const getCommandsForLanguage = (language: 'en' | 'bn' | 'ar' | 'ur') => {
    return commands.map(cmd => cmd.patterns[language][0]); // First pattern of each command
  };

  return {
    speechState,
    startMultilingualCommand,
    stopListening,
    resetTranscript,
    isProcessing: isProcessingRef.current,
    currentLanguage: currentLanguage.current,
    supportedLanguages: getSupportedLanguages(),
    getCommandsForLanguage
  };
}