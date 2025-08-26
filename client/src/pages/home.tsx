import { useQuery } from "@tanstack/react-query";
import { Play, ChartLine, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationHeader from "@/components/navigation-header";
import AITeacher from "@/components/ai-teacher";
import ProgressCard from "@/components/progress-card";
import ChapterCard from "@/components/chapter-card";
import AchievementBadge from "@/components/achievement-badge";
import { achievements } from "@/data/lessons";
import type { Chapter, User as UserType, UserProgress } from "@shared/schema";
import { Link } from "wouter";

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/users", authUser?.id, "chapters"],
    enabled: !!authUser?.id,
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", authUser?.id, "progress"],
    enabled: !!authUser?.id,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-ghost-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the learning dashboard.</div>;
  }

  const getChapterProgress = (chapterId: string) => {
    return userProgress.filter(p => p.chapterId === chapterId && p.completed).length;
  };

  const totalCompletedLessons = userProgress.filter(p => p.completed).length;
  const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.totalLessons, 0);

  return (
    <div className="min-h-screen bg-ghost-white" data-testid="home-page">
      <NavigationHeader />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-islamic-green via-islamic-green to-success-green text-white py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Meet Hujur
                  <span className="block text-golden-yellow font-bengali text-2xl md:text-3xl lg:text-4xl">আপনার AI শিক্ষক</span>
                </h2>
                <p className="text-lg md:text-xl mb-6 opacity-90">
                  Learn Quran, Salah, and Dua with your friendly AI teacher!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Button 
                    className="bg-golden-yellow text-dark-slate hover:bg-yellow-300 px-6 py-3 text-base md:text-lg"
                    asChild
                    data-testid="button-start-learning"
                  >
                    <Link href="/chapter/noorani-qaida-chapter">
                      <Play className="mr-2" size={18} />
                      Start Learning
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-islamic-green transition-all duration-300 px-6 py-3 text-base md:text-lg font-semibold"
                    asChild
                    data-testid="button-my-progress"
                  >
                    <Link href="/analytics">
                      <ChartLine className="mr-2" size={18} />
                      My Progress
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 flex justify-center">
                <AITeacher
                  message="Welcome to Hujur! Let's start your Islamic education journey!"
                  messageBengali="হুজুরে স্বাগতম! চলুন আপনার ইসলামী শিক্ষার যাত্রা শুরু করি!"
                  showSpeechBubble={true}
                  size="md"
                  className="scale-90 sm:scale-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="py-6 md:py-8 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-center text-dark-slate mb-2">
              Your Learning Journey
            </h3>
            <p className="text-center text-islamic-green font-bengali text-base md:text-lg mb-6 md:mb-8">
              আপনার শেখার যাত্রা
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <ProgressCard
                type="progress"
                value={`${Math.round((totalCompletedLessons / totalLessons) * 100) || 0}%`}
                subtitle={`${totalCompletedLessons} lessons completed`}
              />
              <ProgressCard
                type="streak"
                value={`${authUser?.streak || 0} Days`}
                subtitle="Keep it up!"
              />
              <ProgressCard
                type="achievements"
                value={Array.isArray(authUser?.achievements) ? authUser.achievements.length : 0}
                subtitle="Badges earned"
              />
            </div>
          </div>
        </section>

        {/* Advanced Voice Features Banner */}
        <section className="py-6 md:py-8 px-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mx-4 md:mx-0">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎤</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">
                  New: Advanced Voice Features!
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Experience Islamic learning with AI-powered Tajweed pronunciation analysis, 
                  guided prayer sessions, and multilingual voice commands in English, Bengali, Arabic & Urdu.
                </p>
                <Link href="/advanced-voice">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg">
                    Try Voice Features →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lessons Section */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-dark-slate mb-2">
              Choose Your Lesson
            </h3>
            <p className="text-center text-islamic-green font-bengali text-base md:text-lg mb-8 md:mb-12">
              পাঠ বেছে নিন
            </p>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* Quran Learning Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-6 border-islamic-green transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-islamic-green rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-3xl">📖</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-dark-slate">Quran Learning</h4>
                    <p className="text-lg text-gray-600 font-bengali">কুরআন শেখা</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link href="/chapter/noorani-qaida-chapter">
                    <div className="p-4 bg-islamic-green text-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">Noorani Qaida</h5>
                        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">25%</span>
                      </div>
                      <p className="text-sm opacity-90">Traditional Arabic fundamentals</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </Link>
                  <Link href="/chapter/quran-chapter">
                    <div className="p-4 bg-islamic-green text-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">Basic Quran Reading</h5>
                        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">15%</span>
                      </div>
                      <p className="text-sm opacity-90">Start with simple surahs</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Salah Guide Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-6 border-blue-500 transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-3xl">🕌</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-dark-slate">Salah Guide</h4>
                    <p className="text-lg text-gray-600 font-bengali">নামাজ শিক্ষা</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link href="/chapter/salah-chapter">
                    <div className="p-4 bg-blue-500 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">Prayer Basics</h5>
                        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">40%</span>
                      </div>
                      <p className="text-sm opacity-90">Learn how to pray step by step</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 bg-gray-100 text-gray-600 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-lg font-semibold">Wudu (Ablution)</h5>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">Soon</span>
                    </div>
                    <p className="text-sm opacity-80">Coming soon for beginners</p>
                  </div>
                </div>
              </div>

              {/* Daily Duas Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-l-6 border-purple-500 transform hover:scale-105 transition-transform">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-3xl">🤲</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-dark-slate">Daily Duas</h4>
                    <p className="text-lg text-gray-600 font-bengali">দৈনিক দোয়া</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link href="/chapter/dua-chapter">
                    <div className="p-4 bg-purple-500 text-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-lg font-semibold">Essential Duas</h5>
                        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">60%</span>
                      </div>
                      <p className="text-sm opacity-90">Morning, evening & meal duas</p>
                      <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4 bg-gray-100 text-gray-600 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="text-lg font-semibold">Simple Duas for Kids</h5>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded">Soon</span>
                    </div>
                    <p className="text-sm opacity-80">Easy duas for beginners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Showcase */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-dark-slate mb-2">
              Your Achievements
            </h3>
            <p className="text-center text-islamic-green font-bengali text-lg mb-12">
              আপনার অর্জনসমূহ
            </p>
            
            <div className="grid md:grid-cols-4 gap-6">
              {achievements.map((achievement) => {
                const isEarned = Array.isArray(authUser?.achievements) && authUser.achievements.includes(achievement.id);
                return (
                  <AchievementBadge
                    key={achievement.id}
                    title={achievement.name}
                    description={achievement.description}
                    icon={achievement.icon}
                    color={isEarned ? achievement.color as any : "gray"}
                    earned={isEarned}
                    earnedDate={isEarned ? "3 days ago" : undefined}
                    progress={!isEarned ? "Not earned yet" : undefined}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-slate text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-islamic-green rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🕌</span>
                </div>
                <span className="text-xl font-bold">Hujur</span>
              </div>
              <p className="text-gray-300 text-sm">
                Interactive Islamic education for children with AI-powered learning.
              </p>
              <p className="text-gray-300 text-sm font-bengali mt-2">
                শিশুদের জন্য ইন্টারেক্টিভ ইসলামী শিক্ষা।
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Lessons</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-islamic-green transition-colors">Quran Learning</a></li>
                <li><a href="#" className="hover:text-islamic-green transition-colors">Salah Guide</a></li>
                <li><a href="#" className="hover:text-islamic-green transition-colors">Daily Duas</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/help-center" className="hover:text-islamic-green transition-colors">Help Center</Link></li>
                <li><Link href="/parent-guide" className="hover:text-islamic-green transition-colors">Parent Guide</Link></li>
                <li><Link href="/contact" className="hover:text-islamic-green transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Languages</h5>
              <div className="flex space-x-2 mb-4">
                <span className="px-3 py-1 bg-islamic-green rounded-full text-xs">English</span>
                <span className="px-3 py-1 bg-warm-sand rounded-full text-xs font-bengali">বাংলা</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Hujur. All rights reserved. | Built with ❤️ for Muslim children</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
