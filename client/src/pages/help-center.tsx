import { Link } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import { Book, Play, Award, Settings, ArrowLeft, MessageCircle } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-ghost-white">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center text-islamic-green hover:text-islamic-green-700 transition-colors mb-4">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-dark-slate mb-2">Help Center</h1>
          <p className="text-gray-600 font-bengali">সাহায্য কেন্দ্র</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Book className="text-islamic-green mr-3" size={24} />
              <h2 className="text-xl font-semibold">Getting Started</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-islamic-green bg-gray-50">
                <h3 className="font-medium">How to begin learning?</h3>
                <p className="text-sm text-gray-600 mt-1">Start with Noorani Qaida to learn Arabic fundamentals, then progress to Quran reading and Islamic practices.</p>
              </div>
              <div className="p-3 border-l-4 border-blue-500 bg-gray-50">
                <h3 className="font-medium">Understanding progress tracking</h3>
                <p className="text-sm text-gray-600 mt-1">Your progress is automatically saved. Complete lessons to unlock new chapters and earn achievements.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Play className="text-purple-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Using the Platform</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-purple-600 bg-gray-50">
                <h3 className="font-medium">Audio pronunciation guide</h3>
                <p className="text-sm text-gray-600 mt-1">Click the audio button to hear correct pronunciation. Switch between English and Bengali explanations.</p>
              </div>
              <div className="p-3 border-l-4 border-orange-500 bg-gray-50">
                <h3 className="font-medium">Interactive exercises</h3>
                <p className="text-sm text-gray-600 mt-1">Complete quizzes and recognition tasks to reinforce your learning and earn higher scores.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Award className="text-golden-yellow mr-3" size={24} />
            <h2 className="text-xl font-semibold">Achievements & Progress</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-islamic-green rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white">🎯</span>
              </div>
              <h3 className="font-medium mb-1">First Lesson</h3>
              <p className="text-sm text-gray-600">Complete your first lesson to earn this badge</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white">🔥</span>
              </div>
              <h3 className="font-medium mb-1">Streak Master</h3>
              <p className="text-sm text-gray-600">Learn for 7 consecutive days</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white">⭐</span>
              </div>
              <h3 className="font-medium mb-1">Perfect Score</h3>
              <p className="text-sm text-gray-600">Get 100% in any lesson</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Settings className="text-gray-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Troubleshooting</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-islamic-green mb-2">Audio not playing?</h3>
              <p className="text-sm text-gray-600">Make sure your device volume is up and browser allows audio playback. Try refreshing the page if audio doesn't work.</p>
            </div>
            <div>
              <h3 className="font-medium text-islamic-green mb-2">Progress not saving?</h3>
              <p className="text-sm text-gray-600">Ensure you're logged in and have completed the lesson fully. Progress saves automatically when you finish exercises.</p>
            </div>
            <div>
              <h3 className="font-medium text-islamic-green mb-2">Can't access next chapter?</h3>
              <p className="text-sm text-gray-600">Complete at least 80% of the current chapter to unlock the next one. Check your progress in the analytics page.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-islamic-green rounded-lg p-6 text-white">
            <MessageCircle className="mx-auto mb-3" size={32} />
            <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
            <p className="mb-4">Our support team is here to assist you with any questions.</p>
            <Link href="/contact">
              <button className="bg-white text-islamic-green px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}