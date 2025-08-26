import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { User } from "@shared/schema";
import { Church, User as UserIcon, BarChart, Home, BookOpen, Mic } from "lucide-react";

const USER_ID = "default-user";

export default function NavigationHeader() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [location] = useLocation();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users", USER_ID],
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "bn" : "en");
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50" data-testid="navigation-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <div className="w-12 h-12 bg-islamic-green rounded-full flex items-center justify-center cursor-pointer hover:bg-islamic-green-700 transition-colors">
                <Church className="text-white text-xl" />
              </div>
            </Link>
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold text-islamic-green cursor-pointer hover:text-islamic-green-700 transition-colors">
                  Hujur
                </h1>
              </Link>
              <p className="text-sm text-dark-slate font-bengali">ইসলামী শিক্ষা</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Home size={18} />
                <span className="text-sm font-medium">Home</span>
              </div>
            </Link>

            <Link href="/noorani-qaida">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/noorani-qaida') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <BookOpen size={18} />
                <span className="text-sm font-medium">Noorani Qaida</span>
              </div>
            </Link>

            <Link href="/advanced-voice">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/advanced-voice') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Mic size={18} />
                <span className="text-sm font-medium">Voice</span>
              </div>
            </Link>

            <Link href="/analytics">
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/analytics') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <BarChart size={18} />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-full p-1 flex">
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  language === "en"
                    ? "bg-islamic-green text-white"
                    : "text-dark-slate hover:bg-gray-200"
                }`}
                data-testid="button-language-en"
              >
                EN
              </button>
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 rounded-full text-sm font-medium font-bengali transition-colors ${
                  language === "bn"
                    ? "bg-islamic-green text-white"
                    : "text-dark-slate hover:bg-gray-200"
                }`}
                data-testid="button-language-bn"
              >
                বাং
              </button>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-islamic-green to-success-green rounded-full flex items-center justify-center">
              <UserIcon className="text-white" size={20} />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4">
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <div className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Home size={18} />
                <span className="text-xs mt-1">Home</span>
              </div>
            </Link>

            <Link href="/noorani-qaida">
              <div className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/noorani-qaida') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <BookOpen size={18} />
                <span className="text-xs mt-1">Qaida</span>
              </div>
            </Link>

            <Link href="/advanced-voice">
              <div className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/advanced-voice') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Mic size={18} />
                <span className="text-xs mt-1">Voice</span>
              </div>
            </Link>

            <Link href="/analytics">
              <div className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive('/analytics') 
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <BarChart size={18} />
                <span className="text-xs mt-1">Stats</span>
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
