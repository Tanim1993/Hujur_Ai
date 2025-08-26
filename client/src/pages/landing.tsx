import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Church, BookOpen, Mic, BarChart, Star, Users, Globe, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ghost-white" data-testid="landing-page">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-islamic-green rounded-full flex items-center justify-center">
                <Church className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-islamic-green">Hujur</h1>
                <p className="text-sm text-dark-slate font-bengali">ইসলামী শিক্ষা</p>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-islamic-green hover:bg-islamic-green-700"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Interactive Islamic
            <span className="text-islamic-green block">Learning Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Learn Quran, Salah, and Islamic fundamentals with our AI-powered teacher. 
            Perfect for children and beginners with bilingual support.
          </p>
          <p className="text-lg text-gray-600 font-bengali mb-8">
            আমাদের AI শিক্ষকের সাথে কুরআন, সালাত এবং ইসলামের মূল বিষয়গুলি শিখুন
          </p>
          
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-islamic-green hover:bg-islamic-green-700 text-lg px-8 py-4"
            data-testid="button-start-learning"
          >
            Start Learning Free
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-islamic-green mx-auto mb-4" />
              <CardTitle className="text-lg">Noorani Qaida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Traditional Arabic learning foundation with interactive lessons</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Mic className="w-12 h-12 text-islamic-green mx-auto mb-4" />
              <CardTitle className="text-lg">Voice Interaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Practice pronunciation with AI-powered speech recognition</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart className="w-12 h-12 text-islamic-green mx-auto mb-4" />
              <CardTitle className="text-lg">Progress Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track your learning journey with detailed insights and streaks</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="w-12 h-12 text-islamic-green mx-auto mb-4" />
              <CardTitle className="text-lg">Bilingual Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Learn in English and Bengali with cultural context</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Paths */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Learning Curriculum</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-islamic-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Foundation</h3>
              <p className="text-gray-600">Start with Noorani Qaida and Arabic alphabet basics</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice</h3>
              <p className="text-gray-600">Learn Salah, Dua, and essential Islamic practices</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-golden-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mastery</h3>
              <p className="text-gray-600">Advanced voice features and Quran recitation</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 text-center mb-16">
          <div>
            <div className="text-3xl font-bold text-islamic-green mb-2">50+</div>
            <div className="text-gray-600">Interactive Lessons</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-islamic-green mb-2">6</div>
            <div className="text-gray-600">Learning Chapters</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-islamic-green mb-2">3</div>
            <div className="text-gray-600">Voice Features</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-islamic-green mb-2">2</div>
            <div className="text-gray-600">Languages</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-islamic-green rounded-2xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Islamic Learning Journey?</h2>
          <p className="text-xl mb-6">Join thousands of students learning with Hujur</p>
          <p className="text-lg font-bengali mb-6">হাজার হাজার শিক্ষার্থীর সাথে যোগ দিন</p>
          
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-islamic-green hover:bg-gray-100 text-lg px-8 py-4"
            data-testid="button-get-started"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-slate text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-islamic-green rounded-full flex items-center justify-center">
              <Church className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold">Hujur</span>
          </div>
          <p className="text-gray-400">Interactive Islamic Learning Platform</p>
          <p className="text-gray-400 font-bengali">ইন্টারঅ্যাক্টিভ ইসলামী শিক্ষা প্ল্যাটফর্ম</p>
        </div>
      </footer>
    </div>
  );
}