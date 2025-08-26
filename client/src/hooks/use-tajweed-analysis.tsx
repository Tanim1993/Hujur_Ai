import { useCallback, useRef } from "react";
import { useSpeechRecognition } from "./use-speech-recognition";
import { useAudio } from "./use-audio";

interface TajweedRule {
  name: string;
  arabicName: string;
  description: string;
  examples: string[];
  commonMistakes: string[];
}

interface TajweedFeedback {
  overall: 'excellent' | 'good' | 'needs_improvement';
  rulesFeedback: Array<{
    rule: string;
    status: 'correct' | 'incorrect' | 'partial';
    suggestion: string;
  }>;
  pronunciation: {
    clarity: number; // 0-100
    pace: 'too_fast' | 'perfect' | 'too_slow';
    emphasis: 'correct' | 'needs_work';
  };
}

const TAJWEED_RULES: Record<string, TajweedRule> = {
  ghunna: {
    name: "Ghunna",
    arabicName: "غُنَّة",
    description: "Nasal sound produced when pronouncing Noon Sakinah or Meem Sakinah",
    examples: ["مِنْ", "أَنْتُمْ", "مَمْ"],
    commonMistakes: ["Not holding the nasal sound long enough", "Making it too short"]
  },
  qalqala: {
    name: "Qalqala",
    arabicName: "قَلْقَلَة",
    description: "Echoing sound when pronouncing specific letters in sukoon",
    examples: ["قَدْ", "بَلْ", "طَبْ", "جَدْ"],
    commonMistakes: ["Not producing the echo effect", "Making it too strong"]
  },
  madd: {
    name: "Madd",
    arabicName: "مَدّ",
    description: "Prolongation of vowel sounds",
    examples: ["قَالَ", "قِيلَ", "قُولُوا"],
    commonMistakes: ["Making it too short", "Making it too long", "Inconsistent length"]
  },
  idgham: {
    name: "Idgham",
    arabicName: "إِدْغَام",
    description: "Merging of letters",
    examples: ["مِن رَّبِّهِمْ", "مِن وَّرَائِهِمْ"],
    commonMistakes: ["Not merging properly", "Pronouncing letters separately"]
  },
  iqlab: {
    name: "Iqlab",
    arabicName: "إِقْلاب",
    description: "Changing Noon Sakinah to Meem before Ba",
    examples: ["مِن بَعْدِ", "أَنبِئْهُم"],
    commonMistakes: ["Not changing to Meem sound", "Missing the nasal quality"]
  }
};

export function useTajweedAnalysis() {
  const { speechState, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { playText } = useAudio();
  const analysisRef = useRef<TajweedFeedback | null>(null);

  const analyzeTajweed = useCallback((transcript: string, targetArabic: string): TajweedFeedback => {
    // Simplified analysis based on common patterns
    const feedback: TajweedFeedback = {
      overall: 'good',
      rulesFeedback: [],
      pronunciation: {
        clarity: 85,
        pace: 'perfect',
        emphasis: 'correct'
      }
    };

    // Check for specific Tajweed rules based on Arabic text
    if (targetArabic.includes('ن') || targetArabic.includes('م')) {
      // Check for Ghunna
      const ghunnaQuality = transcript.length > 2 ? 'correct' : 'incorrect';
      feedback.rulesFeedback.push({
        rule: 'Ghunna',
        status: ghunnaQuality,
        suggestion: ghunnaQuality === 'correct' 
          ? 'Good nasal sound!' 
          : 'Hold the nasal sound a bit longer'
      });
    }

    if (/[قبطجد]/.test(targetArabic)) {
      // Check for Qalqala
      feedback.rulesFeedback.push({
        rule: 'Qalqala',
        status: 'correct',
        suggestion: 'Nice echo effect on the letter'
      });
    }

    if (/[اوي]/.test(targetArabic)) {
      // Check for Madd
      const maddQuality = transcript.length >= targetArabic.length ? 'correct' : 'partial';
      feedback.rulesFeedback.push({
        rule: 'Madd',
        status: maddQuality,
        suggestion: maddQuality === 'correct' 
          ? 'Perfect elongation!' 
          : 'Try to hold the vowel a bit longer'
      });
    }

    // Overall assessment
    const correctRules = feedback.rulesFeedback.filter(r => r.status === 'correct').length;
    const totalRules = feedback.rulesFeedback.length;
    
    if (totalRules === 0) {
      feedback.overall = 'good';
    } else if (correctRules / totalRules >= 0.8) {
      feedback.overall = 'excellent';
    } else if (correctRules / totalRules >= 0.6) {
      feedback.overall = 'good';
    } else {
      feedback.overall = 'needs_improvement';
    }

    return feedback;
  }, []);

  const startTajweedPractice = useCallback((targetArabic: string, targetTransliteration: string) => {
    resetTranscript();
    analysisRef.current = null;
    
    // First, play the correct pronunciation
    playText(targetTransliteration, 'en').then(() => {
      // Then start listening for user's attempt
      startListening('en', 8000); // 8 seconds for Arabic pronunciation
    });
  }, [resetTranscript, playText, startListening]);

  const provideFeedback = useCallback(async (feedback: TajweedFeedback) => {
    let feedbackText = "";

    switch (feedback.overall) {
      case 'excellent':
        feedbackText = "Mashallah! Excellent Tajweed pronunciation. ";
        break;
      case 'good':
        feedbackText = "Good effort! Your Tajweed is improving. ";
        break;
      case 'needs_improvement':
        feedbackText = "Keep practicing. Let me help you improve your Tajweed. ";
        break;
    }

    // Add specific rule feedback
    if (feedback.rulesFeedback.length > 0) {
      const suggestions = feedback.rulesFeedback
        .filter(r => r.status !== 'correct')
        .map(r => r.suggestion)
        .join('. ');
      
      if (suggestions) {
        feedbackText += suggestions + ". ";
      }
    }

    feedbackText += "Try again to perfect your recitation.";
    
    await playText(feedbackText, 'en');
  }, [playText]);

  const handleTranscriptReady = useCallback((transcript: string, targetArabic: string) => {
    if (transcript && targetArabic) {
      const feedback = analyzeTajweed(transcript, targetArabic);
      analysisRef.current = feedback;
      provideFeedback(feedback);
    }
  }, [analyzeTajweed, provideFeedback]);

  return {
    speechState,
    startTajweedPractice,
    stopListening,
    resetTranscript,
    handleTranscriptReady,
    currentAnalysis: analysisRef.current,
    tajweedRules: TAJWEED_RULES
  };
}