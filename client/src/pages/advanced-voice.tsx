import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, BookOpen, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import TajweedPractice from "@/components/tajweed-practice";
import ImamMode from "@/components/imam-mode";
import { useMultilingualCommands } from "@/hooks/use-multilingual-commands";

type FeatureMode = 'selection' | 'tajweed' | 'imam' | 'multilingual';
type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export default function AdvancedVoicePage() {
  const [currentMode, setCurrentMode] = useState<FeatureMode>('selection');
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerType>('fajr');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'bn' | 'ar' | 'ur'>('en');

  const {
    speechState,
    startMultilingualCommand,
    stopListening,
    currentLanguage,
    supportedLanguages,
    getCommandsForLanguage
  } = useMultilingualCommands({
    onNext: () => console.log('Next command received'),
    onRepeat: () => console.log('Repeat command received'),
    onGoHome: () => setCurrentMode('selection'),
    onStartPrayer: () => setCurrentMode('imam'),
    onShowTajweed: () => setCurrentMode('tajweed')
  });

  const handleBackToSelection = () => {
    setCurrentMode('selection');
    stopListening();
  };

  const renderModeContent = () => {
    switch (currentMode) {
      case 'tajweed':
        return (
          <TajweedPractice
            arabicText="بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ"
            transliteration="Bismillahi rahmani raheem"
            meaning="In the name of Allah, the Most Gracious, the Most Merciful"
            onComplete={() => {
              console.log('Tajweed practice completed!');
              setTimeout(() => setCurrentMode('selection'), 2000);
            }}
            className="max-w-2xl mx-auto"
          />
        );

      case 'imam':
        return (
          <ImamMode
            prayerType={selectedPrayer}
            onComplete={() => {
              console.log('Prayer practice completed!');
              setTimeout(() => setCurrentMode('selection'), 2000);
            }}
            className="max-w-2xl mx-auto"
          />
        );

      case 'multilingual':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Globe className="mr-3 text-blue-600" size={24} />
                Multilingual Voice Commands
              </h2>
              
              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Voice Command Language:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {supportedLanguages.map((lang) => (
                      <Button
                        key={lang}
                        variant={selectedLanguage === lang ? "default" : "outline"}
                        onClick={() => setSelectedLanguage(lang)}
                        className="justify-start"
                        data-testid={`button-language-${lang}`}
                      >
                        {lang === 'en' && '🇺🇸 English'}
                        {lang === 'bn' && '🇧🇩 বাংলা'}
                        {lang === 'ar' && '🇸🇦 العربية'}
                        {lang === 'ur' && '🇵🇰 اردو'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Voice Command Demo */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Available Commands in {selectedLanguage === 'en' ? 'English' : 
                                         selectedLanguage === 'bn' ? 'Bengali' :
                                         selectedLanguage === 'ar' ? 'Arabic' : 'Urdu'}:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {getCommandsForLanguage(selectedLanguage).map((command, index) => (
                      <div key={index} className="bg-white rounded px-3 py-2 text-gray-700">
                        "{command}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Voice Commands */}
                <div className="text-center">
                  <Button
                    onClick={() => startMultilingualCommand(selectedLanguage)}
                    disabled={speechState.isListening}
                    className={`flex items-center space-x-2 mx-auto ${
                      speechState.isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    data-testid="button-test-multilingual"
                  >
                    <Mic size={16} />
                    <span>
                      {speechState.isListening 
                        ? 'Listening...' 
                        : `Test Voice Commands in ${selectedLanguage.toUpperCase()}`
                      }
                    </span>
                  </Button>

                  {speechState.transcript && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                      You said: "{speechState.transcript}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Advanced Voice Features</h1>
              <p className="text-lg text-gray-600">
                Experience Islamic learning with cutting-edge voice interaction technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Tajweed Practice */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer"
                onClick={() => setCurrentMode('tajweed')}
                data-testid="card-tajweed-practice"
              >
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <BookOpen size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  Tajweed Practice
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Perfect your Quranic pronunciation with AI-powered feedback on Tajweed rules
                </p>
                <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                  ✓ Real-time pronunciation analysis<br/>
                  ✓ Tajweed rules assessment<br/>
                  ✓ Personalized feedback
                </div>
              </motion.div>

              {/* Imam Mode */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer"
                onClick={() => setCurrentMode('imam')}
                data-testid="card-imam-mode"
              >
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Users size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  Imam Mode
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  AI teacher leads you through step-by-step prayer practice sessions
                </p>
                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                  ✓ Guided prayer sessions<br/>
                  ✓ Step-by-step instructions<br/>
                  ✓ Real-time progress tracking
                </div>

                {/* Prayer Selection */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Select Prayer:
                  </label>
                  <select
                    value={selectedPrayer}
                    onChange={(e) => setSelectedPrayer(e.target.value as PrayerType)}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                    data-testid="select-prayer-type"
                  >
                    <option value="fajr">Fajr (Dawn)</option>
                    <option value="dhuhr">Dhuhr (Noon)</option>
                    <option value="asr">Asr (Afternoon)</option>
                    <option value="maghrib">Maghrib (Sunset)</option>
                    <option value="isha">Isha (Night)</option>
                  </select>
                </div>
              </motion.div>

              {/* Multilingual Commands */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer"
                onClick={() => setCurrentMode('multilingual')}
                data-testid="card-multilingual-commands"
              >
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Globe size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  Multilingual Commands
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Voice commands in English, Bengali, Arabic, and Urdu languages
                </p>
                <div className="bg-purple-50 rounded-lg p-3 text-sm text-purple-800">
                  ✓ 4 Language support<br/>
                  ✓ Natural voice commands<br/>
                  ✓ Cultural context awareness
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="advanced-voice-page">
      <NavigationHeader />
      
      <main className="py-8 px-4">
        {/* Back Button */}
        {currentMode !== 'selection' && (
          <div className="max-w-4xl mx-auto mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSelection}
              className="flex items-center space-x-2"
              data-testid="button-back-to-selection"
            >
              <ArrowLeft size={16} />
              <span>Back to Features</span>
            </Button>
          </div>
        )}

        {renderModeContent()}

        {/* Navigation Footer */}
        {currentMode === 'selection' && (
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2 mx-auto">
                <ArrowLeft size={16} />
                <span>Return to Home</span>
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}