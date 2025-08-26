import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Volume2, Eye, Mic, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AITeacher from "./ai-teacher";
import { useAudio } from "@/hooks/use-audio";
import { useTajweedAnalysis } from "@/hooks/use-tajweed-analysis";
import type { NooraniLesson } from "@/data/noorani-qaida";

interface NooraniLessonProps {
  lesson: NooraniLesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

type LessonPhase = 'introduction' | 'letters' | 'exercises' | 'completion';

export default function NooraniLessonComponent({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  className = ""
}: NooraniLessonProps) {
  const [currentPhase, setCurrentPhase] = useState<LessonPhase>('introduction');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [exerciseResult, setExerciseResult] = useState<'correct' | 'incorrect' | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [showTransliteration, setShowTransliteration] = useState(false);

  const { playText, audioState } = useAudio();
  const {
    speechState,
    startTajweedPractice,
    stopListening,
    handleTranscriptReady,
    currentAnalysis
  } = useTajweedAnalysis();

  const currentLetter = lesson.letters[currentLetterIndex];
  const currentExercise = lesson.exercises[currentExerciseIndex];
  const totalProgress = getCurrentProgress();

  function getCurrentProgress(): number {
    switch (currentPhase) {
      case 'introduction': return 10;
      case 'letters': return 10 + (currentLetterIndex / lesson.letters.length) * 40;
      case 'exercises': return 50 + (completedExercises.length / lesson.exercises.length) * 40;
      case 'completion': return 100;
      default: return 0;
    }
  }

  const handleLetterAudio = (letter: string, transliteration: string) => {
    playText(transliteration, 'en');
  };

  const handlePronunciationPractice = () => {
    if (currentLetter) {
      startTajweedPractice(currentLetter.arabic, currentLetter.transliteration);
    }
  };

  const handleExerciseSubmit = () => {
    if (!currentExercise) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    setExerciseResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      setCompletedExercises(prev => [...prev, currentExerciseIndex]);
      
      setTimeout(() => {
        if (currentExerciseIndex < lesson.exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setUserAnswer("");
          setExerciseResult(null);
        } else {
          setCurrentPhase('completion');
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setExerciseResult(null);
      }, 2000);
    }
  };

  const handleNextLetter = () => {
    if (currentLetterIndex < lesson.letters.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    } else {
      setCurrentPhase('exercises');
    }
  };

  const handlePreviousLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
    }
  };

  const resetLesson = () => {
    setCurrentPhase('introduction');
    setCurrentLetterIndex(0);
    setCurrentExerciseIndex(0);
    setCompletedExercises([]);
    setUserAnswer("");
    setExerciseResult(null);
  };

  // Handle speech recognition for pronunciation exercises
  useEffect(() => {
    if (!speechState.isListening && speechState.transcript && currentExercise?.type === 'pronunciation') {
      handleTranscriptReady(speechState.transcript, currentExercise.content);
    }
  }, [speechState.isListening, speechState.transcript, currentExercise, handleTranscriptReady]);

  const renderIntroduction = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="bg-islamic-green-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-islamic-green-800 mb-4">
          {lesson.title}
        </h2>
        <p className="text-islamic-green-700 mb-2">
          {lesson.titleBengali}
        </p>
        <p className="text-gray-700 mb-4">
          {lesson.description}
        </p>
        <p className="text-gray-600 text-sm">
          {lesson.descriptionBengali}
        </p>
        
        <Badge variant="outline" className="mt-4">
          {lesson.level} Level
        </Badge>
      </div>

      <div className="bg-white rounded-lg p-6 border">
        <h3 className="font-semibold text-gray-800 mb-4">What You'll Learn:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Letters ({lesson.letters.length}):</h4>
            <div className="space-y-1">
              {lesson.letters.map((letter, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-xl font-arabic">{letter.arabic}</span>
                  <span className="text-gray-600">{letter.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Exercises ({lesson.exercises.length}):</h4>
            <div className="space-y-1 text-gray-600">
              <div>✓ Letter Recognition</div>
              <div>✓ Pronunciation Practice</div>
              <div>✓ Reading Combinations</div>
              <div>✓ Writing Practice</div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setCurrentPhase('letters')}
        className="bg-islamic-green-600 hover:bg-islamic-green-700"
        data-testid="button-start-noorani-lesson"
      >
        Start Learning →
      </Button>
    </motion.div>
  );

  const renderLetters = () => (
    <motion.div
      key={currentLetterIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center bg-white rounded-xl p-8 border shadow-sm">
        <div className="text-6xl font-arabic text-islamic-green-800 mb-4">
          {currentLetter.arabic}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {currentLetter.name}
        </h3>
        <p className="text-lg text-gray-600 mb-4">
          {currentLetter.nameBengali}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransliteration(!showTransliteration)}
              data-testid="button-toggle-transliteration"
            >
              <Eye size={16} className="mr-2" />
              {showTransliteration ? 'Hide' : 'Show'} Pronunciation
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLetterAudio(currentLetter.arabic, currentLetter.transliteration)}
              disabled={audioState.isPlaying}
              data-testid="button-play-letter-audio"
            >
              <Volume2 size={16} className="mr-2" />
              Listen
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePronunciationPractice}
              disabled={speechState.isListening}
              data-testid="button-practice-pronunciation"
            >
              <Mic size={16} className="mr-2" />
              Practice
            </Button>
          </div>

          {showTransliteration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 bg-blue-50 rounded text-blue-800"
            >
              <strong>Pronunciation:</strong> {currentLetter.transliteration} - {currentLetter.pronunciation}
            </motion.div>
          )}
        </div>

        {/* Letter Examples */}
        {currentLetter.examples && currentLetter.examples.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3">Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLetter.examples.map((example, index) => (
                <div key={index} className="bg-white rounded p-3 text-center">
                  <div className="text-xl font-arabic text-amber-800 mb-1">
                    {example.word}
                  </div>
                  <div className="text-sm text-gray-600">
                    {example.meaning} / {example.meaningBengali}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pronunciation Feedback */}
        {currentAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg ${
              currentAnalysis.overall === 'excellent' ? 'bg-green-50 border-green-200' :
              currentAnalysis.overall === 'good' ? 'bg-blue-50 border-blue-200' :
              'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle size={20} className={
                currentAnalysis.overall === 'excellent' ? 'text-green-600' :
                currentAnalysis.overall === 'good' ? 'text-blue-600' :
                'text-yellow-600'
              } />
              <span className="font-semibold">
                {currentAnalysis.overall === 'excellent' ? 'Excellent!' :
                 currentAnalysis.overall === 'good' ? 'Good effort!' :
                 'Keep practicing!'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Pronunciation clarity: {currentAnalysis.pronunciation.clarity}%
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePreviousLetter}
          disabled={currentLetterIndex === 0}
          data-testid="button-previous-letter"
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-600">
          Letter {currentLetterIndex + 1} of {lesson.letters.length}
        </div>

        <Button
          onClick={handleNextLetter}
          className="bg-islamic-green-600 hover:bg-islamic-green-700"
          data-testid="button-next-letter"
        >
          {currentLetterIndex === lesson.letters.length - 1 ? 'Start Exercises' : 'Next'}
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderExercises = () => (
    <motion.div
      key={currentExerciseIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl p-8 border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            Exercise {currentExerciseIndex + 1}
          </h3>
          <Badge variant={currentExercise.type === 'pronunciation' ? 'default' : 'outline'}>
            {currentExercise.type}
          </Badge>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg text-gray-700 mb-2">
            {currentExercise.instruction}
          </p>
          <p className="text-sm text-gray-600">
            {currentExercise.instructionBengali}
          </p>
        </div>

        <div className="bg-islamic-green-50 rounded-lg p-6 mb-6 text-center">
          <div className="text-4xl font-arabic text-islamic-green-800 mb-4">
            {currentExercise.content}
          </div>
        </div>

        {/* Exercise Input */}
        {currentExercise.type === 'recognition' && currentExercise.options ? (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentExercise.options.map((option, index) => (
              <Button
                key={index}
                variant={userAnswer === option ? "default" : "outline"}
                onClick={() => setUserAnswer(option)}
                className="py-3"
                data-testid={`option-${index}`}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : currentExercise.type === 'pronunciation' ? (
          <div className="text-center mb-6">
            <Button
              onClick={() => startTajweedPractice(currentExercise.content, currentExercise.correctAnswer)}
              disabled={speechState.isListening}
              className={`px-8 py-3 ${speechState.isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              data-testid="button-record-pronunciation"
            >
              <Mic size={20} className="mr-2" />
              {speechState.isListening ? 'Listening...' : 'Record Pronunciation'}
            </Button>
            
            {speechState.transcript && (
              <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                You said: "{speechState.transcript}"
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg"
              data-testid="input-exercise-answer"
            />
          </div>
        )}

        {/* Exercise Result */}
        <AnimatePresence>
          {exerciseResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg mb-6 text-center ${
                exerciseResult === 'correct' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                {exerciseResult === 'correct' ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <XCircle size={24} className="text-red-600" />
                )}
                <span className={`font-semibold ${
                  exerciseResult === 'correct' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {exerciseResult === 'correct' ? 'Correct! Well done!' : 'Try again!'}
                </span>
              </div>
              {exerciseResult === 'incorrect' && (
                <p className="text-sm text-gray-600 mt-2">
                  Correct answer: {currentExercise.correctAnswer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        {!exerciseResult && (currentExercise.type !== 'pronunciation' || speechState.transcript) && (
          <div className="text-center">
            <Button
              onClick={handleExerciseSubmit}
              disabled={!userAnswer && !speechState.transcript}
              className="bg-islamic-green-600 hover:bg-islamic-green-700 px-8"
              data-testid="button-submit-exercise"
            >
              Submit Answer
            </Button>
          </div>
        )}
      </div>

      {/* Exercise Progress */}
      <div className="text-center text-sm text-gray-600">
        Exercise {currentExerciseIndex + 1} of {lesson.exercises.length} • 
        {completedExercises.length} completed
      </div>
    </motion.div>
  );

  const renderCompletion = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="bg-green-50 rounded-xl p-8 border border-green-200">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Lesson Completed!
        </h2>
        <p className="text-green-700 mb-6">
          Congratulations! You have successfully completed "{lesson.title}"
        </p>

        <div className="bg-white rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Progress:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-islamic-green-600">
                {lesson.letters.length}
              </div>
              <div className="text-gray-600">Letters Learned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-islamic-green-600">
                {completedExercises.length}
              </div>
              <div className="text-gray-600">Exercises Completed</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={resetLesson}
            data-testid="button-restart-lesson"
          >
            <RotateCcw size={16} className="mr-2" />
            Practice Again
          </Button>
          
          {onNext && (
            <Button
              onClick={onNext}
              className="bg-islamic-green-600 hover:bg-islamic-green-700"
              data-testid="button-next-lesson"
            >
              Next Lesson
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`} data-testid="noorani-lesson">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
          {onPrevious && (
            <Button
              variant="ghost"
              onClick={onPrevious}
              data-testid="button-back-to-lessons"
              className="self-start"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          )}
          
          <div className="text-center flex-1 sm:mx-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Noorani Qaida</h1>
            <p className="text-sm text-gray-600">নূরানি কায়েদা</p>
          </div>
          
          {!onPrevious && <div className="w-20" />} {/* Spacer for centering when no back button */}
        </div>

        <div className="bg-white rounded-lg p-4 border">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} className="h-2" />
        </div>
      </div>

      {/* AI Teacher */}
      <div className="mb-6 md:mb-8 flex justify-center">
        <AITeacher
          expression={currentPhase === 'completion' ? 'happy' : 
                     audioState.isPlaying || speechState.isListening ? 'speaking' : 'encouraging'}
          isAnimated={true}
          size="sm"
          className="scale-90 sm:scale-100"
        />
      </div>

      {/* Lesson Content */}
      <AnimatePresence mode="wait">
        {currentPhase === 'introduction' && renderIntroduction()}
        {currentPhase === 'letters' && renderLetters()}
        {currentPhase === 'exercises' && renderExercises()}
        {currentPhase === 'completion' && renderCompletion()}
      </AnimatePresence>
    </div>
  );
}