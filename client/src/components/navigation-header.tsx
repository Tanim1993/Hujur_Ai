import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { Church, User as UserIcon, BarChart, Home, BookOpen, LogOut, ChevronDown } from "lucide-react";
import { useState as useDropdownState } from "react";

export default function NavigationHeader() {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [lessonsDropdownOpen, setLessonsDropdownOpen] = useDropdownState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

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

            {/* Lessons Dropdown */}
            <div className="relative">
              <div 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  location.includes('/chapter') || location.includes('/lesson')
                    ? 'bg-islamic-green text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setLessonsDropdownOpen(!lessonsDropdownOpen)}
              >
                <BookOpen size={18} />
                <span className="text-sm font-medium">Lessons</span>
                <ChevronDown size={16} className={`transition-transform ${lessonsDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {lessonsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Quran Learning</div>
                    <Link href="/chapter/noorani-qaida-chapter">
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setLessonsDropdownOpen(false)}>
                        Noorani Qaida
                      </div>
                    </Link>
                    <Link href="/chapter/quran-chapter">
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setLessonsDropdownOpen(false)}>
                        Basic Quran Reading
                      </div>
                    </Link>
                    
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">Prayer & Duas</div>
                    <Link href="/chapter/salah-chapter">
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setLessonsDropdownOpen(false)}>
                        Salah Guide
                      </div>
                    </Link>
                    <Link href="/chapter/dua-chapter">
                      <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={() => setLessonsDropdownOpen(false)}>
                        Daily Duas
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

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
            <div className="flex items-center space-x-3">
              {/* User Profile */}
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-islamic-green to-success-green rounded-full flex items-center justify-center">
                  <UserIcon className="text-white" size={20} />
                </div>
              )}
              
              {/* User Name */}
              {user && (
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName || user.username || 'Student'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => window.location.href = '/api/logout'}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
                data-testid="button-logout"
              >
                <LogOut size={18} />
              </button>
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

            <div 
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                location.includes('/chapter') || location.includes('/lesson')
                  ? 'bg-islamic-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setLessonsDropdownOpen(!lessonsDropdownOpen)}
            >
              <BookOpen size={18} />
              <span className="text-xs mt-1">Lessons</span>
            </div>

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
