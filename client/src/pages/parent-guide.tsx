import { Link } from "wouter";
import NavigationHeader from "@/components/navigation-header";
import { Users, Clock, Shield, Target, ArrowLeft, Heart } from "lucide-react";

export default function ParentGuide() {
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
          <h1 className="text-3xl font-bold text-dark-slate mb-2">Parent Guide</h1>
          <p className="text-gray-600 font-bengali">অভিভাবকদের গাইড</p>
        </div>

        <div className="bg-islamic-green rounded-lg p-6 text-white mb-8">
          <div className="flex items-center mb-4">
            <Heart className="mr-3" size={28} />
            <h2 className="text-2xl font-semibold">Supporting Your Child's Islamic Education</h2>
          </div>
          <p className="text-lg opacity-90">
            Hujur provides a safe, engaging environment for children to learn Islamic fundamentals. 
            Here's how you can support your child's learning journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Target className="text-islamic-green mr-3" size={24} />
              <h2 className="text-xl font-semibold">Learning Objectives</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-islamic-green mb-2">Noorani Qaida (Ages 4-8)</h3>
                <p className="text-sm text-gray-600">Traditional method to learn Arabic alphabet, letter recognition, and basic pronunciation rules.</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-600 mb-2">Quran Reading (Ages 6-12)</h3>
                <p className="text-sm text-gray-600">Progress from simple letter recognition to reading complete verses with proper Tajweed.</p>
              </div>
              <div>
                <h3 className="font-medium text-purple-600 mb-2">Islamic Practices (Ages 5-15)</h3>
                <p className="text-sm text-gray-600">Learn daily prayers (Salah), essential duas, and Islamic etiquette in an age-appropriate manner.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Clock className="text-orange-500 mr-3" size={24} />
              <h2 className="text-xl font-semibold">Recommended Schedule</h2>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <h3 className="font-medium mb-1">Daily Practice (15-20 minutes)</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 1-2 lessons per day for beginners</li>
                  <li>• Review previous lessons regularly</li>
                  <li>• Practice pronunciation with audio</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-1">Weekly Goals</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete 5-7 lessons per week</li>
                  <li>• Review achievements together</li>
                  <li>• Celebrate progress milestones</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Users className="text-purple-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">How to Support Your Child</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-islamic-green mb-3">Encouragement Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-islamic-green mr-2">✓</span>
                  Sit with your child during lessons when possible
                </li>
                <li className="flex items-start">
                  <span className="text-islamic-green mr-2">✓</span>
                  Celebrate achievements and progress, no matter how small
                </li>
                <li className="flex items-start">
                  <span className="text-islamic-green mr-2">✓</span>
                  Practice pronunciations together using the audio features
                </li>
                <li className="flex items-start">
                  <span className="text-islamic-green mr-2">✓</span>
                  Create a quiet, comfortable learning environment
                </li>
                <li className="flex items-start">
                  <span className="text-islamic-green mr-2">✓</span>
                  Set consistent daily learning times
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-600 mb-3">Monitoring Progress</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">📊</span>
                  Check the Analytics page for detailed progress reports
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">🎯</span>
                  Review completed lessons and scores regularly
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">🏆</span>
                  Acknowledge earned achievements and badges
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">📈</span>
                  Track learning streaks and encourage consistency
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">⏰</span>
                  Monitor time spent learning for balanced screen time
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="text-green-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Safety & Privacy</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-600 mb-3">Child Safety Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• No external links or advertisements</li>
                <li>• Content reviewed by Islamic education experts</li>
                <li>• Age-appropriate learning materials</li>
                <li>• Secure authentication system</li>
                <li>• No chat or social features</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-orange-600 mb-3">Privacy Protection</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Learning progress stored securely</li>
                <li>• No personal information shared with third parties</li>
                <li>• COPPA-compliant data practices</li>
                <li>• Parent access to all child data</li>
                <li>• Option to delete account and data anytime</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-islamic-green to-blue-600 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-semibold mb-3">Questions About Your Child's Learning?</h3>
          <p className="mb-4">We're here to help you support your child's Islamic education journey.</p>
          <Link href="/contact">
            <button className="bg-white text-islamic-green px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Our Education Team
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}