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

const USER_ID = "default-user";

export default function Home() {
  const { data: chapters = [] } = useQuery<Chapter[]>({
    queryKey: ["/api/users", USER_ID, "chapters"],
  });

  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/users", USER_ID],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/users", USER_ID, "progress"],
  });

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
                    className="border-2 border-white text-white hover:bg-white hover:text-islamic-green px-6 py-3 text-base md:text-lg"
                    data-testid="button-my-progress"
                  >
                    <ChartLine className="mr-2" size={18} />
                    My Progress
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
                value={`${user?.streak || 0} Days`}
                subtitle="Keep it up!"
              />
              <ProgressCard
                type="achievements"
                value={Array.isArray(user?.achievements) ? user.achievements.length : 0}
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

        {/* Chapter Selection */}
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-dark-slate mb-2">
              Choose Your Lesson
            </h3>
            <p className="text-center text-islamic-green font-bengali text-base md:text-lg mb-8 md:mb-12">
              পাঠ বেছে নিন
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {chapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  completedLessons={getChapterProgress(chapter.id)}
                />
              ))}
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
                const isEarned = Array.isArray(user?.achievements) && user.achievements.includes(achievement.id);
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
                <li><a href="#" className="hover:text-islamic-green transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-islamic-green transition-colors">Parent Guide</a></li>
                <li><a href="#" className="hover:text-islamic-green transition-colors">Contact Us</a></li>
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
